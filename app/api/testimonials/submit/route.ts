export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createPendingTestimonial } from '@/lib/server/testimonial-store'
import { sendClientTestimonialNotificationEmail, type EmailAttachment } from '@/lib/server/notifications'
import { TESTIMONIAL_ISSUE_OPTIONS, isTestimonialIssueCategory, TESTIMONIAL_FORM_LIMITS } from '@/lib/testimonials'

const SUCCESS_MESSAGE = 'Dzięki. Opinia trafiła do weryfikacji. Odezwę się po sprawdzeniu.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się wysłać opinii. Spróbuj ponownie później.'
const MAX_PHOTO_SIZE_BYTES = 25 * 1024 * 1024

type ParsedRequestBody = {
  fields: Record<string, unknown>
  photoAttachment: EmailAttachment | null
  photoLabel: string | null
}

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

function isTruthyFormValue(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === '1'
}

function sanitizeAttachmentFilename(value: string): string {
  const normalized = value.trim().replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/-+/g, '-')
  return normalized.slice(0, 120) || 'zdjecie-opinii'
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function parseRequestBody(request: Request): Promise<ParsedRequestBody> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const fields: Record<string, unknown> = {}

    for (const [key, value] of formData.entries()) {
      if (key !== 'photo') {
        fields[key] = typeof value === 'string' ? value : ''
      }
    }

    const photo = formData.get('photo')
    if (!(photo instanceof File) || photo.size === 0) {
      return { fields, photoAttachment: null, photoLabel: null }
    }

    if (!photo.type.startsWith('image/')) {
      throw new Error('PHOTO_TYPE')
    }

    if (photo.size > MAX_PHOTO_SIZE_BYTES) {
      throw new Error('PHOTO_TOO_LARGE')
    }

    const filename = sanitizeAttachmentFilename(photo.name || 'zdjecie-opinii')
    const content = Buffer.from(await photo.arrayBuffer()).toString('base64')
    const photoLabel = `${filename} (${formatFileSize(photo.size)})`

    return {
      fields,
      photoAttachment: {
        filename,
        content,
        contentType: photo.type || 'application/octet-stream',
        encoding: 'base64',
      },
      photoLabel,
    }
  }

  try {
    return {
      fields: (await request.json()) as Record<string, unknown>,
      photoAttachment: null,
      photoLabel: null,
    }
  } catch {
    throw new Error('BODY_PARSE')
  }
}

export async function POST(request: Request) {
  try {
    let parsed: ParsedRequestBody

    try {
      parsed = await parseRequestBody(request)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''

      if (message === 'PHOTO_TYPE') {
        return NextResponse.json({ error: 'Dodaj plik graficzny, np. JPG, PNG albo WEBP.' }, { status: 400 })
      }

      if (message === 'PHOTO_TOO_LARGE') {
        return NextResponse.json({ error: 'Zdjęcie jest za duże. Limit załącznika to 25 MB.' }, { status: 400 })
      }

      return NextResponse.json({ error: 'Nie udało się odczytać formularza.' }, { status: 400 })
    }

    const body = parsed.fields

    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const displayName = normalizeSingleLine(body.displayName, TESTIMONIAL_FORM_LIMITS.displayName)
    const email = normalizeSingleLine(body.email, TESTIMONIAL_FORM_LIMITS.email)
    const issueCategory = normalizeSingleLine(body.issueCategory, 80)
    const opinion = normalizeLongText(body.opinion, TESTIMONIAL_FORM_LIMITS.opinion)
    const legacyPhotoUrl = normalizeSingleLine(body.photoUrl ?? '', TESTIMONIAL_FORM_LIMITS.photoUrl) || null
    const photoUrl = parsed.photoLabel ? `Załącznik mailowy: ${parsed.photoLabel}` : legacyPhotoUrl
    const consentPublish = isTruthyFormValue(body.consentPublish)

    if (!displayName || !email || !issueCategory || !opinion) {
      return NextResponse.json({ error: 'Uzupełnij wszystkie wymagane pola.' }, { status: 400 })
    }

    if (!isEmailValid(email)) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 })
    }

    if (!isTestimonialIssueCategory(issueCategory)) {
      const labels = TESTIMONIAL_ISSUE_OPTIONS.map((option) => option.label).join(', ')
      return NextResponse.json({ error: `Wybierz kategorię: ${labels}.` }, { status: 400 })
    }

    if (opinion.length < 20) {
      return NextResponse.json({ error: 'Opinia jest za krótka. Napisz kilka zdań.' }, { status: 400 })
    }

    if (!consentPublish) {
      return NextResponse.json({ error: 'Zaznacz zgodę na publikację.' }, { status: 400 })
    }

    let storedRecord:
      | Awaited<ReturnType<typeof createPendingTestimonial>>
      | null = null

    try {
      storedRecord = await createPendingTestimonial({
        displayName,
        email,
        issueCategory,
        opinion,
        photoUrl,
        consentPublish,
      })
    } catch (error) {
      console.error('[testimonials/submit] database save failed', error)
    }

    const recordForEmail = storedRecord ?? {
      id: `mail-${randomUUID()}`,
      displayName,
      email,
      issueCategory,
      opinion,
      photoUrl,
    }

    const emailResult = await sendClientTestimonialNotificationEmail({
      id: recordForEmail.id,
      displayName: recordForEmail.displayName,
      email: recordForEmail.email,
      issueCategory: recordForEmail.issueCategory,
      opinion: recordForEmail.opinion,
      photoUrl: recordForEmail.photoUrl,
      photoLabel: parsed.photoLabel,
      photoAttachment: parsed.photoAttachment,
    }).catch((error) => {
      console.error('[testimonials/submit] email failed', error)
      return { status: 'failed' as const, reason: error instanceof Error ? error.message : String(error) }
    })

    if (!storedRecord && emailResult.status !== 'sent') {
      console.error('[testimonials/submit] no persistence path available', { emailResult })
      return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 503 })
    }

    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
  } catch (error) {
    console.error('[testimonials/submit] unexpected error', error)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
