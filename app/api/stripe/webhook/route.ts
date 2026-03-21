import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { markBookingExpired, markBookingPaymentFailed } from '@/lib/server/db'
import { ConfigurationError, getStripeServerConfig } from '@/lib/server/env'
import { finalizeStripeCheckoutSession, getStripeClient } from '@/lib/server/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { webhookSecret } = getStripeServerConfig('Stripe webhook verification', { requireWebhookSecret: true })
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Brak podpisu Stripe.' }, { status: 400 })
    }

    const payload = await request.text()
    const stripe = getStripeClient()
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret!)

    if (event.type === 'checkout.session.completed') {
      await finalizeStripeCheckoutSession(event.data.object.id)
    }

    if (event.type === 'checkout.session.expired') {
      const bookingId = event.data.object.metadata?.bookingId
      if (bookingId) {
        await markBookingExpired(bookingId)
      }
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const bookingId = event.data.object.metadata?.bookingId
      if (bookingId) {
        await markBookingPaymentFailed(bookingId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook Stripe zwrocil blad.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 400 })
  }
}
