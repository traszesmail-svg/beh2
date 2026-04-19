export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { ConfigurationError } from '@/lib/server/env'
import { sendContactLeadEmail } from '@/lib/server/notifications'
import { getContactDetails } from '@/lib/site'

const SUCCESS_MESSAGE = 'Dziękuję. Wiadomość trafiła do mnie. Odpowiem na podany adres e-mail.'
const UNAVAILABLE_MESSAGE = 'Formularz kontaktowy jest chwilowo niedostępny. Spróbuj później lub napisz bezpośrednio.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'

type ValidatedContactLeadPayload = {
  name: string
  email: string
  topic: string
  message: string
  contextLabel: string
  bookingId?: string | null
  website?: string | null
  consentProcessing: boolean
  consentPolicy: boolean
}

function getUnavailableMessage(): string {
  const contact = getContactDetails()

  if (contact.email) {
    return `Formularz kontaktowy jest chwilowo niedostępny. Spróbuj później albo napisz na ${contact.email}.`
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

function validatePayload(body: Record<string, unknown>): { payload?: ValidatedContactLeadPayload; error?: string } {
  const name = normalizeSingleLine(body.name ?? body.displayName, 120)
  const contact = pickContactCandidate(body)
  const species = normalizeSpecies(body.species)
  const legacyTopic = normalizeSingleLine(body.topic, 120)
  const legacyContextLabel = normalizeSingleLine(body.contextLabel, 160)
  const topicId = normalizeSingleLine(body.topicId, 80)
  const topic = species ? getPublicProblemOptionById(species, topicId)?.title ?? legacyTopic ?? null : legacyTopic ?? null
  const message = normalizeLongText(body.message, 1200)
  const bookingId = normalizeSingleLine(body.bookingId, 120) ?? null
  const website = normalizeSingleLine(body.website, 120) ?? ''
  const consentProcessing = body.consentProcessing === true
  const consentPolicy = body.consentPolicy === true
  const contextLabel =
    legacyContextLabel ?? (species && topic ? `${getSpeciesLabel(species)} • ${topic}` : topic ? `Kontakt • ${topic}` : null)

  if (!name || !contact || !topic || !message || !contextLabel) {
    return { error: 'Uzupełnij imię, adres e-mail, gatunek, temat i krótki opis problemu.' }
  }

  if (message.length < 20) {
    return { error: 'Opisz problem w 2-4 zdaniach, żebym mógł wskazać najprostszy kolejny krok.' }
  }

  if (!consentProcessing || !consentPolicy) {
    return { error: 'Zaznacz zgodę na kontakt i akceptację polityki prywatności.' }
  }

  return {
    payload: {
      name,
      email: contact,
      topic,
      message,
      contextLabel,
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
      return NextResponse.json({ error: 'Nie udało się odczytać formularza kontaktu.' }, { status: 400 })
    }

    const { payload, error } = validatePayload(body)

    if (error || !payload) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const delivery = await sendContactLeadEmail(payload)

    if (delivery.status === 'sent') {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
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
