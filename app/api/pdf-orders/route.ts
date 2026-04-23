export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getPdfBundleBySlug, getPdfGuideBySlug } from '@/lib/pdf-guides'
import { sendPdfOrderAutoReplyEmail, sendPdfOrderEmail, type PdfOrderSubmission } from '@/lib/server/notifications'

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
  return normalized.length > 0 ? normalized.slice(0, maxLength) : ''
}

function validatePayload(body: Record<string, unknown>): { payload?: PdfOrderSubmission; error?: string } {
  const itemType = normalizeSingleLine(body.itemType, 16)
  const itemSlug = normalizeSingleLine(body.itemSlug, 160)
  const name = normalizeSingleLine(body.name, 120)
  const email = normalizeSingleLine(body.email, 160)
  const notes = normalizeLongText(body.notes, 1200) ?? ''
  const website = normalizeSingleLine(body.website, 120) ?? ''
  const consentProcessing = body.consentProcessing === true
  const consentPolicy = body.consentPolicy === true

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Podaj imie i poprawny adres e-mail.' }
  }

  if (!consentProcessing || !consentPolicy) {
    return { error: 'Zaznacz zgody na kontakt i polityke prywatnosci.' }
  }

  if (itemType !== 'guide' && itemType !== 'bundle') {
    return { error: 'Nie udalo sie rozpoznac produktu.' }
  }

  if (!itemSlug) {
    return { error: 'Brakuje identyfikatora produktu.' }
  }

  const guide = itemType === 'guide' ? getPdfGuideBySlug(itemSlug) : null
  const bundle = itemType === 'bundle' ? getPdfBundleBySlug(itemSlug) : null
  const item = guide ?? bundle

  if (!item) {
    return { error: 'Ten produkt PDF nie jest juz dostepny.' }
  }

  return {
    payload: {
      itemType,
      itemSlug,
      itemTitle: 'title' in item ? item.title : '',
      itemPrice: item.pricing,
      email,
      name,
      notes,
      website,
    },
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Nie udalo sie odczytac formularza.' }, { status: 400 })
  }

  const { payload, error } = validatePayload(body)

  if (error || !payload) {
    return NextResponse.json({ error: error ?? 'Nie udalo sie wyslac formularza.' }, { status: 400 })
  }

  if (payload.website) {
    return NextResponse.json({ ok: true, message: 'Dziekuje. Potwierdzenie i dalszy krok platnosci wysylam mailowo. PayPal albo BLIK na telefon sa dostepne bez publikowania numeru na stronie.' })
  }

  const delivery = await sendPdfOrderEmail(payload)

  if (delivery.status !== 'sent') {
    return NextResponse.json({ error: 'Formularz PDF jest chwilowo niedostepny. Sprobuj ponownie pozniej.' }, { status: 503 })
  }

  const customerDelivery = await sendPdfOrderAutoReplyEmail(payload)

  if (customerDelivery.status === 'failed') {
    console.error('[behawior15][pdf-order] customer auto-reply failed', customerDelivery.reason)
  }

  return NextResponse.json({
    ok: true,
    message: 'Dziekuje. Wyslalem mail z potwierdzeniem wyboru i dalszym krokiem platnosci: PayPal albo BLIK na telefon.',
  })
}
