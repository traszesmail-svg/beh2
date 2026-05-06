export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { recordFunnelEvent } from '@/lib/server/db'
import { unsubscribeNotificationOptIn, type NotificationChannel } from '@/lib/server/notification-optins'

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
    return NextResponse.json({ error: 'Nie udalo sie odczytac formularza.' }, { status: 400 })
  }

  const phone = normalizePhone(body.phone)
  const channel = normalizeChannel(body.channel)

  if (!phone) {
    return NextResponse.json({ error: 'Podaj poprawny numer telefonu.' }, { status: 400 })
  }

  const record = await unsubscribeNotificationOptIn(phone, channel)

  try {
    await recordFunnelEvent({
      eventType: 'notification_optout_submitted',
      source: 'server',
      pagePath: normalizeSingleLine(body.sourcePage, 160),
      location: normalizeSingleLine(body.location, 120),
      properties: { channel },
    })
  } catch (error) {
    console.warn('[regulski][notifications] opt-out event record skipped', error)
  }

  return NextResponse.json({
    ok: true,
    id: record?.id ?? null,
    message: 'Wypisanie zapisane.',
  })
}
