import { NextResponse } from 'next/server'
import { reportManualPayment } from '@/lib/server/manual-payments'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; accessToken?: string }

    if (!body.bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const result = await reportManualPayment(body.bookingId, body.accessToken ?? null, request.headers.get('authorization'))
    const redirectParams = new URLSearchParams({
      bookingId: result.booking.id,
      manual: 'reported',
    })

    if (body.accessToken) {
      redirectParams.set('access', body.accessToken)
    }

    if (result.adminNotification.status !== 'sent') {
      redirectParams.set('adminNotice', result.adminNotification.status)
    }

    return NextResponse.json({
      redirectTo: `/confirmation?${redirectParams.toString()}`,
    })
  } catch (error) {
    console.error('[behawior15][payment-api] manual report failed', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nie udało się zgłosić płatności.' },
      { status: 500 },
    )
  }
}
