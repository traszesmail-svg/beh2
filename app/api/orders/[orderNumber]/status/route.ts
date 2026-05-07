export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { isCommerceTestModeAllowed } from '@/lib/server/commerce-service'
import { canUseCommerceAccess, getCommerceOrder } from '@/lib/server/commerce-store'

function buildRequestReviewUrl(request: Request, token: string, action: 'approve' | 'reject') {
  const url = new URL(`/api/admin/confirm-payment/${encodeURIComponent(token)}`, request.url)
  url.searchParams.set('action', action)
  return url.toString()
}

export async function GET(request: Request, { params }: { params: { orderNumber: string } }) {
  const order = await getCommerceOrder(params.orderNumber)

  if (!order) {
    return NextResponse.json({ error: 'Nie znaleziono zamówienia.' }, { status: 404 })
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    productType: order.productType,
    productName: order.productName,
    customerEmail: order.customerEmail,
    accessReady: canUseCommerceAccess(order),
    accessCode: canUseCommerceAccess(order) ? order.accessCode : null,
    accessUrl: canUseCommerceAccess(order)
      ? `/pokoj?code=${encodeURIComponent(order.accessCode!)}&email=${encodeURIComponent(order.customerEmail)}`
      : null,
    testAdminConfirmUrl:
      isCommerceTestModeAllowed() &&
      order.status === 'payment_reported' &&
      order.adminConfirmationToken &&
      !order.adminConfirmationTokenUsedAt
        ? buildRequestReviewUrl(request, order.adminConfirmationToken, 'approve')
        : null,
    testAdminRejectUrl:
      isCommerceTestModeAllowed() &&
      order.status === 'payment_reported' &&
      order.adminConfirmationToken &&
      !order.adminConfirmationTokenUsedAt
        ? buildRequestReviewUrl(request, order.adminConfirmationToken, 'reject')
        : null,
  })
}
