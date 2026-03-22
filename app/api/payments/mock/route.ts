import { NextResponse } from 'next/server'
import { getBookingForViewer, markBookingPaid, markBookingPaymentFailed } from '@/lib/server/db'
import { ConfigurationError, assertMockPaymentAllowed, getPublicFeatureUnavailableMessage } from '@/lib/server/env'

export async function POST(request: Request) {
  try {
    assertMockPaymentAllowed()

    const body = (await request.json()) as { bookingId?: string; accessToken?: string; outcome?: 'success' | 'failed' }

    if (!body.bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const booking = await getBookingForViewer(body.bookingId, body.accessToken ?? null, request.headers.get('authorization'))

    if (!booking) {
      return NextResponse.json({ error: 'Nie znaleziono rezerwacji albo link wygasł.' }, { status: 403 })
    }

    const accessQuery = body.accessToken ? `&access=${encodeURIComponent(body.accessToken)}` : ''

    if (body.outcome === 'failed') {
      await markBookingPaymentFailed(body.bookingId)
      return NextResponse.json({ redirectTo: `/payment?bookingId=${body.bookingId}${accessQuery}&failed=1` })
    }

    await markBookingPaid(body.bookingId, {
      checkoutSessionId: 'mock-checkout-session',
      paymentIntentId: 'mock-payment-intent',
    })

    return NextResponse.json({ redirectTo: `/confirmation?bookingId=${body.bookingId}${accessQuery}` })
  } catch (error) {
    const message = error instanceof ConfigurationError
      ? getPublicFeatureUnavailableMessage('payment')
      : error instanceof Error
        ? error.message
        : 'Mock płatność nie powiodła się.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}
