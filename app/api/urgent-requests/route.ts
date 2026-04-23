export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { createUrgentNowRequest } from '@/lib/server/db'
import { sendUrgentNowAdminAlertEmail, sendUrgentNowCustomerAckEmail } from '@/lib/server/notifications'
import { sendUrgentCustomerAckSms } from '@/lib/server/sms'
import type { ProblemType } from '@/lib/types'

const SUCCESS_MESSAGE =
  'Prosba trafila do mnie. Odpiszę na podany adres e-mail w ciągu 15 minut z proponowanym terminem.'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

type RateLimitEntry = { count: number; resetAt: number }
const globalStore = globalThis as typeof globalThis & {
  __urgentRateLimitStore?: Map<string, RateLimitEntry>
}
const rateLimitStore =
  globalStore.__urgentRateLimitStore ?? new Map<string, RateLimitEntry>()
if (!globalStore.__urgentRateLimitStore) {
  globalStore.__urgentRateLimitStore = rateLimitStore
}

type ValidatedUrgentPayload = {
  name: string
  email: string
  phone: string | null
  species: FunnelSpecies
  topicId: ProblemType
  topicLabel: string
  message: string
  requestedDate: string
  requestedTime: string
  website: string
}

function normalizeSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const s = value.trim().replace(/\s+/g, ' ')
  return s.length > 0 ? s.slice(0, maxLength) : null
}

function normalizeLongText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const s = value.replace(/\r\n/g, '\n').trim()
  return s.length > 0 ? s.slice(0, maxLength) : null
}

function normalizeDate(value: unknown): string | null {
  const s = normalizeSingleLine(value, 32)
  return s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

function normalizeTime(value: unknown): string | null {
  const s = normalizeSingleLine(value, 16)
  return s && /^\d{2}:\d{2}$/.test(s) ? s : null
}

function normalizeSpecies(value: unknown): FunnelSpecies | null {
  const s = normalizeSingleLine(value, 32)?.toLowerCase() ?? null
  return s === 'pies' || s === 'kot' ? s : null
}

function getFingerprint(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  const real = req.headers.get('x-real-ip')
  const vercel = req.headers.get('x-vercel-forwarded-for')
  return (fwd?.split(',')[0] ?? real ?? vercel ?? 'unknown').trim() || 'unknown'
}

function consumeRateLimit(req: Request): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) rateLimitStore.delete(key)
  }
  const fp = getFingerprint(req)
  const current = rateLimitStore.get(fp)
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(fp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }
  current.count += 1
  return { allowed: true }
}

function validate(body: Record<string, unknown>): { payload?: ValidatedUrgentPayload; error?: string } {
  const name = normalizeSingleLine(body.name, 120)
  const email = normalizeSingleLine(body.email, 160)
  const phone = normalizeSingleLine(body.phone, 32) ?? null
  const species = normalizeSpecies(body.species)
  const topicId = normalizeSingleLine(body.topicId, 80)
  const topicOption = species ? getPublicProblemOptionById(species, topicId) : null
  const message = normalizeLongText(body.message, 600)
  const requestedDate = normalizeDate(body.requestedDate)
  const requestedTime = normalizeTime(body.requestedTime)
  const website = normalizeSingleLine(body.website, 120) ?? ''
  const consentProcessing = body.consentProcessing === true
  const consentPolicy = body.consentPolicy === true

  if (!name || !email) return { error: 'Uzupelnij imie i adres e-mail.' }
  if (!species || !topicOption) return { error: 'Wybierz gatunek i temat konsultacji.' }
  if (!message || message.length < 10) return { error: 'Opisz krotko sytuacje.' }
  if (!requestedDate || !requestedTime) return { error: 'Podaj preferowana date i godzine.' }
  if (!consentProcessing || !consentPolicy) return { error: 'Zaznacz zgode na kontakt i akceptacje polityki prywatnosci.' }

  return {
    payload: {
      name,
      email,
      phone,
      species,
      topicId: topicOption.id,
      topicLabel: topicOption.title,
      message,
      requestedDate,
      requestedTime,
      website,
    },
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Nie udalo sie odczytac formularza.' }, { status: 400 })
    }

    const { payload, error } = validate(body)
    if (error || !payload) {
      return NextResponse.json({ error: error ?? 'Blad walidacji.' }, { status: 400 })
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const rateLimit = consumeRateLimit(request)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Za duzo prob w krotkim czasie. Sprobuj ponownie za godzine.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      )
    }

    const record = await createUrgentNowRequest({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      species: payload.species,
      topicId: payload.topicId,
      topicLabel: payload.topicLabel,
      message: payload.message,
      requestedDate: payload.requestedDate,
      requestedTime: payload.requestedTime,
    })

    const speciesLabel = payload.species === 'kot' ? 'Kot' : 'Pies'

    await Promise.allSettled([
      sendUrgentNowCustomerAckEmail({
        requestId: record.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        topic: payload.topicLabel,
        species: speciesLabel,
        message: payload.message,
        requestedDate: payload.requestedDate,
        requestedTime: payload.requestedTime,
      }),
      sendUrgentNowAdminAlertEmail({
        requestId: record.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        topic: payload.topicLabel,
        species: speciesLabel,
        message: payload.message,
        requestedDate: payload.requestedDate,
        requestedTime: payload.requestedTime,
      }),
      sendUrgentCustomerAckSms(record.id, payload.name, payload.phone),
    ])

    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE, requestId: record.id })
  } catch (err) {
    console.error('[behawior15][urgent-requests] unexpected error', err)
    return NextResponse.json({ error: 'Nie udalo sie wyslac prosby. Sprobuj ponownie.' }, { status: 500 })
  }
}
