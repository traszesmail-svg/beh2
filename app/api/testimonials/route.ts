import { NextResponse } from 'next/server'
import { ConfigurationError } from '@/lib/server/env'
import { getTestimonialSubmissionConfigIssue, sendTestimonialSubmissionEmail } from '@/lib/server/notifications'
import { getContactDetails } from '@/lib/site'
import {
  TESTIMONIAL_FORM_LIMITS,
  TESTIMONIAL_ISSUE_OPTIONS,
  isTestimonialIssueCategory,
} from '@/lib/testimonials'

const SUCCESS_MESSAGE = 'Dziękujemy. Twoja opinia trafiła do weryfikacji. Po akceptacji dodamy ją na stronę.'
const UNAVAILABLE_MESSAGE = 'Formularz opinii jest chwilowo niedostępny. Spróbuj później lub skontaktuj się bezpośrednio.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się wysłać opinii do weryfikacji. Spróbuj ponownie później.'

type Payload = {
  displayName: string
  email: string
  issueCategory: string
  opinion: string
  beforeAfter: string
  photoUrl: string
  consentContact: boolean
  consentPublish: boolean
  website?: string
}

function getUnavailableMessage(): string {
  const contact = getContactDetails()

  if (contact.email) {
    return `Formularz opinii jest chwilowo niedostępny. Spróbuj później albo napisz na ${contact.email}.`
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
  const displayName = normalizeSingleLine(body.displayName, TESTIMONIAL_FORM_LIMITS.displayName)
  const email = normalizeSingleLine(body.email, TESTIMONIAL_FORM_LIMITS.email)
  const issueCategory = normalizeSingleLine(body.issueCategory, 80)
  const opinion = normalizeLongText(body.opinion, TESTIMONIAL_FORM_LIMITS.opinion)
  const beforeAfter = normalizeLongText(body.beforeAfter, TESTIMONIAL_FORM_LIMITS.beforeAfter)
  const photoUrl = normalizeSingleLine(body.photoUrl ?? '', TESTIMONIAL_FORM_LIMITS.photoUrl) ?? ''
  const website = normalizeSingleLine(body.website ?? '', 120) ?? ''
  const consentContact = body.consentContact === true
  const consentPublish = body.consentPublish === true

  if (!displayName || !email || !issueCategory || !opinion || !beforeAfter) {
    return { error: 'Uzupełnij wszystkie wymagane pola formularza opinii.' }
  }

  if (!isEmailValid(email)) {
    return { error: 'Podaj poprawny adres e-mail do weryfikacji opinii.' }
  }

  if (!isTestimonialIssueCategory(issueCategory)) {
    const labels = TESTIMONIAL_ISSUE_OPTIONS.map((option) => option.label).join(', ')
    return { error: `Wybierz jedną z dostępnych kategorii problemu: ${labels}.` }
  }

  if (opinion.length < 20) {
    return { error: 'Dodaj kilka konkretnych zdań o tym, jak pomogła konsultacja.' }
  }

  if (beforeAfter.length < 20) {
    return { error: 'Opisz krótko, co działo się wcześniej i co zmieniło się po konsultacji.' }
  }

  if (!consentContact || !consentPublish) {
    return { error: 'Zaznacz obie zgody wymagane do weryfikacji opinii.' }
  }

  return {
    payload: {
      displayName,
      email,
      issueCategory,
      opinion,
      beforeAfter,
      photoUrl,
      consentContact,
      consentPublish,
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
      return NextResponse.json({ error: 'Nie udało się odczytać formularza opinii.' }, { status: 400 })
    }

    const { payload, error } = validatePayload(body)
    if (error || !payload) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const configIssue = getTestimonialSubmissionConfigIssue()
    if (configIssue) {
      console.warn('[behawior15][testimonials] missing mail config', configIssue)
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    const delivery = await sendTestimonialSubmissionEmail(payload)
    if (delivery.status === 'sent') {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    if (delivery.status === 'skipped') {
      console.warn('[behawior15][testimonials] submission skipped', delivery.reason)
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    console.error('[behawior15][testimonials] submission failed', delivery.reason)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  } catch (error) {
    console.error('[behawior15][testimonials] unexpected error', error)

    if (error instanceof ConfigurationError) {
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
