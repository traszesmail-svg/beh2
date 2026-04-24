export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createPendingTestimonial } from '@/lib/server/testimonial-store'
import { sendClientTestimonialNotificationEmail } from '@/lib/server/notifications'
import { TESTIMONIAL_ISSUE_OPTIONS, isTestimonialIssueCategory, TESTIMONIAL_FORM_LIMITS } from '@/lib/testimonials'

const SUCCESS_MESSAGE = 'Dzieki. Opinia trafila do weryfikacji. Odezwe sie po sprawdzeniu.'
const GENERIC_ERROR_MESSAGE = 'Nie udalo sie wyslac opinii. Sprobuj ponownie pozniej.'

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length <= maxLength ? normalized : normalized.slice(0, maxLength)
}

function normalizeLongText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.replace(/\r\n/g, '\n').trim()
  return normalized.length <= maxLength ? normalized : normalized.slice(0, maxLength)
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>

    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Nie udalo sie odczytac formularza.' }, { status: 400 })
    }

    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const displayName = normalizeSingleLine(body.displayName, TESTIMONIAL_FORM_LIMITS.displayName)
    const email = normalizeSingleLine(body.email, TESTIMONIAL_FORM_LIMITS.email)
    const issueCategory = normalizeSingleLine(body.issueCategory, 80)
    const opinion = normalizeLongText(body.opinion, TESTIMONIAL_FORM_LIMITS.opinion)
    const photoUrl = normalizeSingleLine(body.photoUrl ?? '', TESTIMONIAL_FORM_LIMITS.photoUrl) || null
    const consentPublish = body.consentPublish === true

    if (!displayName || !email || !issueCategory || !opinion) {
      return NextResponse.json({ error: 'Uzupelnij wszystkie wymagane pola.' }, { status: 400 })
    }

    if (!isEmailValid(email)) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 })
    }

    if (!isTestimonialIssueCategory(issueCategory)) {
      const labels = TESTIMONIAL_ISSUE_OPTIONS.map((o) => o.label).join(', ')
      return NextResponse.json({ error: `Wybierz kategorie: ${labels}.` }, { status: 400 })
    }

    if (opinion.length < 20) {
      return NextResponse.json({ error: 'Opinia jest za krotka. Napisz kilka zdan.' }, { status: 400 })
    }

    if (!consentPublish) {
      return NextResponse.json({ error: 'Zaznacz zgode na publikacje.' }, { status: 400 })
    }

    const record = await createPendingTestimonial({
      displayName,
      email,
      issueCategory,
      opinion,
      photoUrl,
      consentPublish,
    })

    await sendClientTestimonialNotificationEmail({
      id: record.id,
      displayName: record.displayName,
      email: record.email,
      issueCategory: record.issueCategory,
      opinion: record.opinion,
      photoUrl: record.photoUrl,
    }).catch((err) => {
      console.error('[testimonials/submit] email failed', err)
    })

    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
  } catch (error) {
    console.error('[testimonials/submit] unexpected error', error)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
