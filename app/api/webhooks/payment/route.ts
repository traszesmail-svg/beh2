export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillCommerceOrderAndNotify } from '@/lib/server/commerce-service'

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook nie jest skonfigurowany.' }, { status: 503 })
  }

  const stripe = new Stripe(secretKey)
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Brak podpisu Stripe.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nieprawidlowy podpis Stripe.' },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderNumber = session.metadata?.orderNumber || session.client_reference_id

    if (orderNumber && session.payment_status === 'paid') {
      await fulfillCommerceOrderAndNotify(orderNumber, 'online', {
        providerPaymentId: session.payment_intent ? String(session.payment_intent) : session.id,
      })
    }
  }

  return NextResponse.json({ received: true })
}

