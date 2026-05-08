// POST /api/admin/materiały/confirm — owner confirms BLIK payment from the admin UI.
// Protected by middleware-level Basic Auth (no extra header needed here).
//
// Request body: { orderId: string }
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

export async function POST(request: Request) {
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
    return NextResponse.json({
      ok: true,
      orderId: existing.id,
      code: existing.code,
      expiresAt: existing.expiresAt,
      alreadyPaid: true,
    })
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
    console.error('[admin/materiały/confirm] code email failed', err)
  })

  return NextResponse.json({
    ok: true,
    orderId: updated.id,
    code: updated.code,
    expiresAt: updated.expiresAt,
  })
}
