export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { recordFunnelEvent } from '@/lib/server/db'
import { upsertGrowthSignup } from '@/lib/server/growth-signups'
import { syncNewsletterSubscriber } from '@/lib/server/mailerlite'

function normalizeSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeSegment(value: unknown) {
  const raw = normalizeSingleLine(value, 32)?.toLowerCase()

  if (raw === 'dogs' || raw === 'dog' || raw === 'pies') return 'pies'
  if (raw === 'cats' || raw === 'cat' || raw === 'kot') return 'kot'
  return 'oba'
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Nie udało się odczytać formularza.' }, { status: 400 })
  }

  const email = normalizeSingleLine(body.email, 160)
  const name = normalizeSingleLine(body.name, 80)
  const segment = normalizeSegment(body.segment ?? body.interest)
  const location = normalizeSingleLine(body.location, 120) ?? 'newsletter-api'
  const sourcePage = normalizeSingleLine(body.sourcePage, 160) ?? '/newsletter'

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 })
  }

  let signupId: string | null = null

  try {
    const signup = await upsertGrowthSignup({
      kind: 'newsletter',
      email,
      segment,
      location,
      sourcePage,
    })
    signupId = signup.id
  } catch (error) {
    console.warn('[regulski][newsletter] signup save skipped', error)
  }

  try {
    await recordFunnelEvent({
      eventType: 'newsletter_signup',
      source: 'server',
      pagePath: sourcePage,
      location,
      properties: {
        email_domain: email.split('@')[1] ?? null,
        segment,
        signup_kind: 'newsletter',
      },
    })
  } catch (error) {
    console.warn('[regulski][newsletter] event record skipped', error)
  }

  const provider = await syncNewsletterSubscriber({
    email,
    name,
    segment,
    sourcePage,
    location,
  })

  if (provider.status === 'failed') {
    console.warn('[regulski][newsletter] mailerlite sync failed', provider.reason)
  }

  return NextResponse.json({
    ok: true,
    signupId,
    provider: provider.status,
    message: 'Dziękuję. Zapis jest przyjęty.',
  })
}
