export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { recordFunnelEvent } from '@/lib/server/db'
import { upsertNotificationOptIn, type NotificationChannel } from '@/lib/server/notification-optins'
import { getTwilioNotificationMode } from '@/lib/server/twilio'

function normalizeSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizePhone(value: unknown) {
  const raw = normalizeSingleLine(value, 32)
  if (!raw) return null

  const normalized = raw.replace(/[^\d+]/g, '')
  const digitCount = normalized.replace(/\D/g, '').length
  return digitCount >= 7 && digitCount <= 15 ? normalized : null
}

function normalizeChannel(value: unknown): NotificationChannel {
  return normalizeSingleLine(value, 16) === 'sms' ? 'sms' : 'whatsapp'
}

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Nie udało się odczytać formularza.' }, { status: 400 })
  }

  const phone = normalizePhone(body.phone)
  const channel = normalizeChannel(body.channel)
  const consent = body.consent === true
  const sourcePage = normalizeSingleLine(body.sourcePage, 160)
  const location = normalizeSingleLine(body.location, 120)
  const context = normalizeSingleLine(body.context, 160)
  const recommendedService = normalizeSingleLine(body.recommendedService, 80)

  if (!phone) {
    return NextResponse.json({ error: 'Podaj poprawny numer telefonu.' }, { status: 400 })
  }

  if (!consent) {
    return NextResponse.json({ error: 'Zgoda na kontakt jest wymagana przy zapisie powiadomienia.' }, { status: 400 })
  }

  const record = await upsertNotificationOptIn({
    phone,
    channel,
    sourcePage,
    location,
    context,
    recommendedService,
  })

  try {
    await recordFunnelEvent({
      eventType: 'notification_optin_submitted',
      source: 'server',
      pagePath: sourcePage,
      location,
      properties: {
        channel,
        context,
        recommended_service: recommendedService,
        twilio_mode: getTwilioNotificationMode(),
      },
    })
  } catch (error) {
    console.warn('[regulski][notifications] event record skipped', error)
  }

  return NextResponse.json({
    ok: true,
    id: record.id,
    channel,
    provider: getTwilioNotificationMode(),
    message:
      getTwilioNotificationMode() === 'configured'
        ? 'Zapis przyjęty. Jeśli powiadomienie jest włączone dla tej ścieżki, dostaniesz krótka wiadomość.'
        : 'Zapis przyjęty. Powiadomienia zewnętrzne nie są włączone bez konfiguracji Twilio.',
  })
}
