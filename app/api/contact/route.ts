import { NextResponse } from 'next/server'
import { ConfigurationError } from '@/lib/server/env'
import { sendContactLeadEmail } from '@/lib/server/notifications'
import { getContactDetails } from '@/lib/site'

const SUCCESS_MESSAGE = 'Dziękuję. Wiadomość trafiła do weryfikacji. Odpowiem na podany kontakt.'
const UNAVAILABLE_MESSAGE = 'Formularz kontaktowy jest chwilowo niedostępny. Spróbuj później lub napisz bezpośrednio.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'

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
  return (
    normalizeSingleLine(body.email, 160) ??
    normalizeSingleLine(body.contact, 160) ??
    normalizeSingleLine(body.phone, 160)
  )
}

function normalizeSpeciesLabel(value: unknown): string | null {
  const species = normalizeSingleLine(value, 32)?.toLowerCase() ?? null

  if (species === 'pies') {
    return 'Pies'
  }

  if (species === 'kot') {
    return 'Kot'
  }

  return normalizeSingleLine(value, 32)
}

function validatePayload(body: Record<string, unknown>): { payload?: Parameters<typeof sendContactLeadEmail>[0]; error?: string } {
  const name = normalizeSingleLine(body.name ?? body.displayName, 120)
  const contact = pickContactCandidate(body)
  const topic = normalizeSingleLine(body.topic, 120) ?? 'Kontakt i rezerwacja'
  const contextLabel =
    normalizeSingleLine(body.contextLabel, 120) ??
    normalizeSpeciesLabel(body.species) ??
    'Kontakt ogólny'
  const message = normalizeLongText(body.message, 4000)
  const bookingId = normalizeSingleLine(body.bookingId, 120) ?? null
  const website = normalizeSingleLine(body.website, 120) ?? ''

  if (!name || !contact || !message) {
    return { error: 'Uzupełnij imię, kontakt i krótki opis sytuacji.' }
  }

  if (message.length < 12) {
    return { error: 'Napisz kilka zdań o sytuacji, żeby łatwiej było zacząć.' }
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
