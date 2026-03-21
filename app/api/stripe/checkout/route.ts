import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/server/stripe'
import { ConfigurationError, getPaymentModeStatus } from '@/lib/server/env'

export async function POST(request: Request) {
  try {
    const paymentMode = getPaymentModeStatus()

    if (!paymentMode.isValid || paymentMode.active !== 'stripe') {
      return NextResponse.json({ error: paymentMode.summary }, { status: 503 })
    }

    const body = (await request.json()) as { bookingId?: string; accessToken?: string }
    if (!body.bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const session = await createCheckoutSession(body.bookingId, body.accessToken ?? null, request.headers.get('authorization'))

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe nie zwrocil URL checkout.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udalo sie uruchomic checkout.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}
