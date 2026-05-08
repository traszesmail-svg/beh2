// POST /api/materiały/confirm — owner-side endpoint to confirm a BLIK payment
// and release the unlock code to the customer. Authenticated by a shared
// admin secret in the `x-admin-secret` header (or `?secret=` query string).
//
// Request body: { orderId: string }
//
// Response: { ok: true, code, expiresAt } or { ok: false, error }

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import {
  getMaterialyBundleBySlug,
  getMaterialyGuideBySlug,
} from '@/lib/materialy-catalog'
import { confirmPayment, getOrderById } from '@/lib/server/materialy-storage'
import { sendMaterialyCodeCustomerEmail, type MaterialyOrderEmailPayload } from '@/lib/server/notifications'

function isAuthorized(request: Request): boolean {
  const expected = process.env.MATERIALY_ADMIN_SECRET?.trim()
  if (!expected) return false
  const fromHeader = request.headers.get('x-admin-secret')?.trim()
  const url = new URL(request.url)
  const fromQuery = url.searchParams.get('secret')?.trim()
  return fromHeader === expected || fromQuery === expected
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Brak autoryzacji.' }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: 'Niepoprawny format zapytania.' }, { status: 400 })
  }

  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'Brak orderId.' }, { status: 400 })
  }

  const existing = await getOrderById(orderId)
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Nie znaleziono zamówienia.' }, { status: 404 })
  }
  if (existing.status === 'cancelled') {
    return NextResponse.json({ ok: false, error: 'Zamówienie anulowane.' }, { status: 409 })
  }
  if (existing.status === 'paid' || existing.status === 'used') {
    return NextResponse.json({ ok: true, code: existing.code, expiresAt: existing.expiresAt, alreadyPaid: true })
  }

  const updated = await confirmPayment(orderId)
  if (!updated || !updated.code || !updated.expiresAt) {
    return NextResponse.json({ ok: false, error: 'Nie udało się potwierdzić zamówienia.' }, { status: 500 })
  }

  const item = updated.productKind === 'guide'
    ? getMaterialyGuideBySlug(updated.productSlug)
    : getMaterialyBundleBySlug(updated.productSlug)
  const productTitle = item?.title ?? updated.productSlug

  const payload: MaterialyOrderEmailPayload = {
    orderId: updated.id,
    productKind: updated.productKind,
    productSlug: updated.productSlug,
    productTitle,
    priceLabel: updated.priceLabel,
    priceAmount: updated.priceAmount,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    customerPhone: updated.customerPhone,
    notes: updated.notes,
  }

  void sendMaterialyCodeCustomerEmail(payload, updated.code, updated.expiresAt).catch((err) => {
    console.error('[materiały/confirm] code email failed', err)
  })

  return NextResponse.json({
    ok: true,
    orderId: updated.id,
    code: updated.code,
    expiresAt: updated.expiresAt,
  })
}
