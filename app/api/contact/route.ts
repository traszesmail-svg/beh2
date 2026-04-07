import { NextResponse } from 'next/server'
import { ConfigurationError } from '@/lib/server/env'
import { getPublicContactDetails } from '@/lib/site'
import { sendContactLeadEmail } from '@/lib/server/notifications'

const SUCCESS_MESSAGE = 'Dziękujemy. Wiadomość trafiła do weryfikacji. Odpowiem na podany adres e-mail.'
const UNAVAILABLE_MESSAGE = 'Formularz kontaktowy jest chwilowo niedostępny. Spróbuj później lub skontaktuj się bezpośrednio.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'

type Payload = {
  name: string
  email: string
  topic: string
  contextLabel: string
  message: string
  bookingId: string | null
  website: string
}

function getUnavailableMessage(): string {
  const contact = getPublicContactDetails()

  if (contact.email) {
    return `Formularz kontaktowy jest chwilowo niedostępny. Spróbuj później albo napisz na ${contact.email}.`
  }

  return UNAVAILABLE_MESSAGE
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length <= maxLength ? normalized : normalized.slice(0, maxLength)
}

function normalizeLongText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.replace(/\r\n/g, '\n').trim()
  return normalized.length <= maxLength ? normalized : normalized.slice(0, maxLength)
}

function validatePayload(body: Record<string, unknown>): { payload?: Payload; error?: string } {
  const name = normalizeSingleLine(body.name, 120)
  const email = normalizeSingleLine(body.email, 254)
  const topic = normalizeSingleLine(body.topic ?? '', 120) ?? 'Ogólne pytanie'
  const contextLabel = normalizeSingleLine(body.contextLabel ?? '', 200) ?? 'Kontakt ogólny'
  const message = normalizeLongText(body.message, 4000)
  const bookingId = normalizeSingleLine(body.bookingId ?? '', 80)
  const website = normalizeSingleLine(body.website ?? '', 120) ?? ''

  if (!name || !email || !message) {
    return { error: 'Uzupełnij wszystkie wymagane pola formularza kontaktowego.' }
  }

  if (!isEmailValid(email)) {
    return { error: 'Podaj poprawny adres e-mail, aby otrzymać odpowiedź.' }
  }

  if (message.length < 20) {
    return { error: 'Napisz kilka zdań o sytuacji, aby łatwiej było wybrać kolejny krok.' }
  }

  return {
    payload: {
      name,
      email,
      topic,
      contextLabel,
      message,
      bookingId: bookingId || null,
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
      return NextResponse.json({ error: 'Nie udało się odczytać formularza kontaktowego.' }, { status: 400 })
    }

    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const { payload, error } = validatePayload(body)

    if (error || !payload) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    const delivery = await sendContactLeadEmail({
      name: payload.name,
      email: payload.email,
      topic: payload.topic,
      contextLabel: payload.contextLabel,
      message: payload.message,
      bookingId: payload.bookingId,
    })

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
