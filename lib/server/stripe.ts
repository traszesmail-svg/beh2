import Stripe from 'stripe'
import { getBookingServiceTitle, resolveBookingServiceType } from '@/lib/booking-services'
import { getProblemLabel } from '@/lib/data'
import { formatPricePln, MIN_CONSULTATION_PRICE_PLN, toStripeUnitAmount } from '@/lib/pricing'
import { attachCheckoutSession, getBookingForViewer, markBookingPaid } from '@/lib/server/db'
import { getBaseUrl, getStripeServerConfig, reportRuntimeModeUsage } from '@/lib/server/env'
import { BookingRecord } from '@/lib/types'

let stripeClient: Stripe | null = null
let stripeSecretCache: string | null = null
export const MIN_STRIPE_CHECKOUT_AMOUNT_PLN = 2

export function getStripeClient(): Stripe {
  reportRuntimeModeUsage()
  const config = getStripeServerConfig('real Stripe Checkout')

  if (!stripeClient || stripeSecretCache !== config.secretKey) {
    stripeSecretCache = config.secretKey
    stripeClient = new Stripe(config.secretKey, {
      apiVersion: '2026-02-25.clover',
    })
  }

  return stripeClient
}

export function isStripeTestMode(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim().startsWith('sk_test_'))
}

export function assertStripeCheckoutAmountSupported(amount: number) {
  if (amount < MIN_STRIPE_CHECKOUT_AMOUNT_PLN || amount < MIN_CONSULTATION_PRICE_PLN) {
    throw new Error(
      `Stripe Checkout w PLN wymaga kwoty co najmniej ${formatPricePln(
        MIN_STRIPE_CHECKOUT_AMOUNT_PLN,
      )}. Ustaw wyzsza cene konsultacji w panelu specjalisty, zanim wlaczysz platnosc Stripe.`,
    )
  }
}

type CheckoutBookingSnapshot = Pick<
  BookingRecord,
  'id' | 'email' | 'problemType' | 'bookingDate' | 'bookingTime' | 'amount' | 'serviceType'
>

type RefundableBookingSnapshot = Pick<BookingRecord, 'id' | 'paymentIntentId' | 'checkoutSessionId'>

export function buildCheckoutSessionParams(
  booking: CheckoutBookingSnapshot,
  options?: {
    accessToken?: string | null
    baseUrl?: string
  },
): Stripe.Checkout.SessionCreateParams {
  const stripeUnitAmount = toStripeUnitAmount(booking.amount)
  const accessQuery = options?.accessToken ? `&access=${encodeURIComponent(options.accessToken)}` : ''
  const baseUrl = options?.baseUrl ?? getBaseUrl()
  const serviceTitle = getBookingServiceTitle(resolveBookingServiceType(booking.serviceType, booking.amount))

  assertStripeCheckoutAmountSupported(booking.amount)

  return {
    mode: 'payment',
    success_url: `${baseUrl}/confirmation?bookingId=${booking.id}${accessQuery}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment?bookingId=${booking.id}${accessQuery}&cancelled=1`,
    customer_email: booking.email,
    metadata: {
      bookingId: booking.id,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'pln',
          unit_amount: stripeUnitAmount,
          product_data: {
            name: `Regulski - ${serviceTitle}`,
            description: `${getProblemLabel(booking.problemType)} | ${booking.bookingDate} ${booking.bookingTime} | ${formatPricePln(
              booking.amount,
            )}`,
          },
        },
      },
    ],
  }
}

export async function createCheckoutSession(
  bookingId: string,
  accessToken?: string | null,
  authorizationHeader?: string | null,
) {
  const booking = await getBookingForViewer(bookingId, accessToken, authorizationHeader)

  if (!booking) {
    throw new Error('Nie znaleziono rezerwacji do platnosci.')
  }

  if (!(booking.bookingStatus === 'pending' && booking.paymentStatus === 'unpaid')) {
    throw new Error('Stripe Checkout mozna uruchomic tylko dla bookingu oczekujacego na platnosc.')
  }

  const stripe = getStripeClient()
  const stripeUnitAmount = toStripeUnitAmount(booking.amount)
  console.info('[behawior15][pricing] stripe-checkout-session', {
    bookingId: booking.id,
    bookingAmount: booking.amount,
    unitAmount: stripeUnitAmount,
    currency: 'pln',
    isStripeTestMode: isStripeTestMode(),
  })
  const session = await stripe.checkout.sessions.create(
    buildCheckoutSessionParams(booking, {
      accessToken: accessToken ?? null,
      baseUrl: getBaseUrl(),
    }),
  )

  await attachCheckoutSession(booking.id, session.id)
  return session
}

export async function finalizeStripeCheckoutSession(
  sessionId: string,
  options?: {
    triggerPaymentConfirmationSms?: boolean
  },
) {
  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  })

  const bookingId = session.metadata?.bookingId

  if (!bookingId) {
    throw new Error('Sesja Stripe nie zawiera bookingId.')
  }

  if (session.payment_status !== 'paid') {
    return null
  }

  return markBookingPaid(bookingId, {
    checkoutSessionId: session.id,
    paymentIntentId:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    paymentMethod: 'stripe',
    triggerPaymentConfirmationSms: options?.triggerPaymentConfirmationSms ?? false,
  })
}

async function resolveStripePaymentIntentId(booking: RefundableBookingSnapshot): Promise<string> {
  if (booking.paymentIntentId) {
    return booking.paymentIntentId
  }

  if (!booking.checkoutSessionId) {
    throw new Error('Brak payment intent albo checkout session do wykonania zwrotu Stripe.')
  }

  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.retrieve(booking.checkoutSessionId, {
    expand: ['payment_intent'],
  })
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  if (!paymentIntentId) {
    throw new Error('Nie udalo sie ustalic payment intent dla tej platnosci Stripe.')
  }

  return paymentIntentId
}

export async function refundStripeCheckoutBooking(booking: RefundableBookingSnapshot) {
  const stripe = getStripeClient()
  const paymentIntentId = await resolveStripePaymentIntentId(booking)

  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: 'requested_by_customer',
    metadata: {
      bookingId: booking.id,
    },
  })
}
