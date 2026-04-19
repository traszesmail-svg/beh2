export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { recordFunnelEvent } from '@/lib/server/db'

type SignupKind = 'newsletter' | 'lead_magnet'

function normalizeSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
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

  const kind = normalizeSingleLine(body.kind, 32) as SignupKind | null
  const email = normalizeSingleLine(body.email, 160)
  const leadMagnetSlug = normalizeSingleLine(body.leadMagnetSlug, 120)
  const location = normalizeSingleLine(body.location, 120)
  const sourcePage = normalizeSingleLine(body.sourcePage, 160)
  const segment = normalizeSingleLine(body.segment, 16) ?? 'oba'

  if (!kind || (kind !== 'newsletter' && kind !== 'lead_magnet')) {
    return NextResponse.json({ error: 'Nieprawidłowy typ zapisu.' }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 })
  }

  if (kind === 'lead_magnet' && !leadMagnetSlug) {
    return NextResponse.json({ error: 'Brakuje identyfikatora materiału.' }, { status: 400 })
  }

  const magnet = leadMagnetSlug ? getLeadMagnetBySlug(leadMagnetSlug) : null

  if (kind === 'lead_magnet' && !magnet) {
    return NextResponse.json({ error: 'Nie znaleziono materiału.' }, { status: 404 })
  }

  try {
    await recordFunnelEvent({
      eventType: kind === 'newsletter' ? 'newsletter_signup' : 'lead_magnet_signup',
      source: 'server',
      pagePath: sourcePage,
      location,
      properties: {
        email_domain: email.split('@')[1] ?? null,
        signup_kind: kind,
        segment,
        lead_magnet_slug: magnet?.slug ?? null,
      },
    })
  } catch (error) {
    console.warn('[behawior15][growth-signup] event record skipped', error)
  }

  if (kind === 'lead_magnet' && magnet) {
    return NextResponse.json({
      ok: true,
      redirectTo: `/bezplatne-materialy/dziekuje?leadMagnet=${encodeURIComponent(magnet.slug)}`,
    })
  }

  return NextResponse.json({
    ok: true,
    message: 'Dziękuję. Zapis jest przyjęty. Będę pisać tylko wtedy, gdy będzie coś użytecznego.',
  })
}
