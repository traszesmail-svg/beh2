import { NextResponse } from 'next/server'
import { canSelfCancelBooking } from '@/lib/self-cancellation'
import { getBookingForViewer, markBookingRefunded } from '@/lib/server/db'
import { ConfigurationError, getPaymentModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { refundStripeCheckoutBooking } from '@/lib/server/stripe'

export const runtime = 'nodejs'

function resolveAccessToken(request: Request): string | null {
  return new URL(request.url).searchParams.get('access')
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ConfigurationError) {
    return getPublicFeatureUnavailableMessage('payment')
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Nie udało się anulować rezerwacji.'
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await getBookingForViewer(params.id, resolveAccessToken(request), request.headers.get('authorization'))

    if (!booking) {
      return NextResponse.json({ error: 'Ten link do potwierdzenia jest nieprawidłowy albo wygasł.' }, { status: 403 })
    }

    if (!canSelfCancelBooking(booking)) {
      return NextResponse.json(
        { error: 'Minuta na samodzielną anulację już minęła albo rezerwacja nie kwalifikuje się do automatycznego zwrotu.' },
        { status: 409 },
      )
    }

    const paymentMode = getPaymentModeStatus()

    if (!paymentMode.isValid || !paymentMode.active) {
      throw new ConfigurationError(paymentMode.summary)
    }

    if (paymentMode.active === 'stripe') {
      await refundStripeCheckoutBooking(booking)
    }

    const updatedBooking = await markBookingRefunded(booking.id)

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Nie znaleziono rezerwacji do anulowania.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: error instanceof ConfigurationError ? 503 : 500 },
    )
  }
}
