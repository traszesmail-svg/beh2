export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { createUrgentNowRequest } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'
import { sendContactLeadAutoReplyEmail, sendContactLeadEmail } from '@/lib/server/notifications'
import { getContactDetails } from '@/lib/site'
import { isUrgentNowIntent } from '@/lib/urgent-now'
import type { ProblemType } from '@/lib/types'

const SUCCESS_MESSAGE = 'Dziekuje. Wiadomosc trafila do mnie. Odpowiem na podany adres e-mail.'
const URGENT_SUCCESS_MESSAGE = 'Dziekuje. Prosba o Kwadrans na juz trafila do mnie. Odpowiem na podany adres e-mail w ciagu 15 minut.'
const UNAVAILABLE_MESSAGE = 'Formularz kontaktowy jest chwilowo niedostepny. Sprobuj pozniej lub napisz bezposrednio.'
const GENERIC_ERROR_MESSAGE = 'Nie udalo sie wyslac wiadomosci. Sprobuj ponownie pozniej.'
const RATE_LIMIT_MESSAGE = 'Za duzo prob w krotkim czasie. Sprobuj ponownie za godzine.'
const CONTACT_RATE_LIMIT_MAX = 3
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

type RateLimitEntry = {
  count: number
  resetAt: number
}

const globalRateLimitStore = globalThis as typeof globalThis & {
  __behawior15ContactRateLimitStore?: Map<string, RateLimitEntry>
}

const contactRateLimitStore =
  globalRateLimitStore.__behawior15ContactRateLimitStore ?? new Map<string, RateLimitEntry>()

if (!globalRateLimitStore.__behawior15ContactRateLimitStore) {
  globalRateLimitStore.__behawior15ContactRateLimitStore = contactRateLimitStore
}

type ValidatedContactLeadPayload = {
  name: string
  email: string
  species: FunnelSpecies
  topicId: ProblemType
  topic: string
  message: string
  contextLabel: string
  serviceLabel?: string | null
  requestedDate?: string | null
  requestedTime?: string | null
  intent?: string | null
  bookingId?: string | null
  website?: string | null
  consentProcessing: boolean
  consentPolicy: boolean
}

function getUnavailableMessage(): string {
  const contact = getContactDetails()

  if (contact.email) {
    return `Formularz kontaktowy jest chwilowo niedostepny. Sprobuj pozniej albo napisz na ${contact.email}.`
  }

  return UNAVAILABLE_MESSAGE
}

function normalizeSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeLongText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.replace(/\r\n/g, '\n').trim()
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeDate(value: unknown): string | null {
  const normalized = normalizeSingleLine(value, 32)
  return normalized && /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null
}

function normalizeTime(value: unknown): string | null {
  const normalized = normalizeSingleLine(value, 16)
  return normalized && /^\d{2}:\d{2}$/.test(normalized) ? normalized : null
}

function pickContactCandidate(body: Record<string, unknown>): string | null {
  return normalizeSingleLine(body.email, 160) ?? normalizeSingleLine(body.contact, 160) ?? normalizeSingleLine(body.phone, 160)
}

function normalizeSpecies(value: unknown): FunnelSpecies | null {
  const species = normalizeSingleLine(value, 32)?.toLowerCase() ?? null

  if (species === 'pies' || species === 'kot') {
    return species
  }

  return null
}

function getSpeciesLabel(species: FunnelSpecies) {
  return species === 'kot' ? 'Kot' : 'Pies'
}

function getClientFingerprint(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for')
  const candidate = forwardedFor?.split(',')[0] ?? realIp ?? vercelForwardedFor ?? 'unknown'

  return candidate.trim() || 'unknown'
}

function consumeContactRateLimit(request: Request): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now()

  for (const [key, entry] of contactRateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      contactRateLimitStore.delete(key)
    }
  }

  const fingerprint = getClientFingerprint(request)
  const current = contactRateLimitStore.get(fingerprint)

  if (!current || current.resetAt <= now) {
    contactRateLimitStore.set(fingerprint, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true }
  }

  if (current.count >= CONTACT_RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  contactRateLimitStore.set(fingerprint, current)
  return { allowed: true }
}

function validatePayload(body: Record<string, unknown>): { payload?: ValidatedContactLeadPayload; error?: string } {
  const name = normalizeSingleLine(body.name ?? body.displayName, 120)
  const contact = pickContactCandidate(body)
  const species = normalizeSpecies(body.species)
  const topicId = normalizeSingleLine(body.topicId, 80)
  const topicOption = species ? getPublicProblemOptionById(species, topicId) : null
  const legacyTopic = normalizeSingleLine(body.topic, 120)
  const topic = topicOption?.title ?? legacyTopic ?? null
  const message = normalizeLongText(body.message, 1200)
  const bookingId = normalizeSingleLine(body.bookingId, 120) ?? null
  const website = normalizeSingleLine(body.website, 120) ?? ''
  const intent = normalizeSingleLine(body.intent, 80) ?? normalizeSingleLine(body.service, 80) ?? null
  const requestedDate = normalizeDate(body.requestedDate)
  const requestedTime = normalizeTime(body.requestedTime)
  const consentProcessing = body.consentProcessing === true
  const consentPolicy = body.consentPolicy === true
  const contextLabel =
    species && topic ? `${getSpeciesLabel(species)} • ${topic}` : topic ? `Kontakt • ${topic}` : null

  if (!name || !contact || !species || !topic || !topicOption || !message || !contextLabel) {
    return { error: 'Uzupelnij imie, adres e-mail, gatunek, temat i krotki opis problemu.' }
  }

  if (message.length < 20) {
    return { error: 'Opisz problem w 2-4 zdaniach, zebym mogl wskazac najprostszy kolejny krok.' }
  }

  if (!consentProcessing || !consentPolicy) {
    return { error: 'Zaznacz zgode na kontakt i akceptacje polityki prywatnosci.' }
  }

  if (isUrgentNowIntent(intent) && (!requestedDate || !requestedTime)) {
    return { error: 'Przy Kwadransie na juz podaj preferowana date i godzine.' }
  }

  return {
    payload: {
      name,
      email: contact,
      species,
      topicId: topicOption.id,
      topic,
      message,
      contextLabel,
      serviceLabel: isUrgentNowIntent(intent) ? 'Kwadrans na juz' : null,
      requestedDate,
      requestedTime,
      intent,
      bookingId,
      website,
      consentProcessing,
      consentPolicy,
    },
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>

    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Nie udalo sie odczytac formularza kontaktu.' }, { status: 400 })
    }

    const { payload, error } = validatePayload(body)

    if (error || !payload) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, message: isUrgentNowIntent(payload.intent) ? URGENT_SUCCESS_MESSAGE : SUCCESS_MESSAGE })
    }

    const rateLimit = consumeContactRateLimit(request)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: RATE_LIMIT_MESSAGE },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    if (isUrgentNowIntent(payload.intent)) {
      await createUrgentNowRequest({
        name: payload.name,
        email: payload.email,
        species: payload.species,
        topicId: payload.topicId,
        topicLabel: payload.topic,
        message: payload.message,
        requestedDate: payload.requestedDate ?? '',
        requestedTime: payload.requestedTime ?? '',
      })
    }

    const delivery = await sendContactLeadEmail(payload)

    if (delivery.status === 'sent') {
      const customerDelivery = await sendContactLeadAutoReplyEmail(payload)

      if (customerDelivery.status === 'failed') {
        console.error('[behawior15][contact] customer auto-reply failed', customerDelivery.reason)
      } else if (customerDelivery.status === 'skipped') {
        console.warn('[behawior15][contact] customer auto-reply skipped', customerDelivery.reason)
      }

      return NextResponse.json({ ok: true, message: isUrgentNowIntent(payload.intent) ? URGENT_SUCCESS_MESSAGE : SUCCESS_MESSAGE })
    }

    if (delivery.status === 'skipped') {
      console.warn('[behawior15][contact] submission skipped', delivery.reason)
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    console.error('[behawior15][contact] submission failed', delivery.reason)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  } catch (error) {
    console.error('[behawior15][contact] unexpected error', error)

    if (error instanceof ConfigurationError) {
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
