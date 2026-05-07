export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import {
  buildCommerceManualReviewUrl,
  isCommerceTestModeAllowed,
} from '@/lib/server/commerce-service'
import { reportCommerceManualPayment } from '@/lib/server/commerce-store'
import { markBookingManualPaymentPending } from '@/lib/server/db'
import { sendCommerceManualPaymentReportedAdminEmail } from '@/lib/server/notifications'

export async function POST(request: Request, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await reportCommerceManualPayment(params.orderNumber)

    if (!order) {
      return NextResponse.json({ error: 'Nie znaleziono zamówienia.' }, { status: 404 })
    }

    if (order.productType === 'consultation' && order.meta.bookingId) {
      await markBookingManualPaymentPending(order.meta.bookingId, {
        paymentReference: order.orderNumber,
        customerAccessToken: order.meta.bookingAccessToken ?? null,
        suppressAdminEmail: true,
      })
    }

    const emailResult = await sendCommerceManualPaymentReportedAdminEmail(order, {
      approveUrl: buildCommerceManualReviewUrl(order, 'approve'),
      rejectUrl: buildCommerceManualReviewUrl(order, 'reject'),
    })

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      status: order.status,
      adminNotification: emailResult.status,
      redirectTo: `/oczekiwanie/${encodeURIComponent(order.orderNumber)}`,
      testAdminConfirmUrl: isCommerceTestModeAllowed() ? buildCommerceManualReviewUrl(order, 'approve') : null,
    })
  } catch (error) {
    console.error('[commerce][orders] report manual payment failed', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nie udało się zgłosić płatności.' },
      { status: 500 },
    )
  }
}
