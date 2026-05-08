export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getBookingForViewer } from '@/lib/server/db'
import { getManualPaymentConfig } from '@/lib/server/payment-options'

// Returns the BLIK phone number only after verifying the booking access token.
// The number is never embedded in HTML — the client fetches it on demand.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const accessToken = searchParams.get('access')

    if (!bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const booking = await getBookingForViewer(
      bookingId,
      accessToken ?? null,
      request.headers.get('authorization'),
    )

    if (!booking) {
      return NextResponse.json({ error: 'Nie znaleziono rezerwacji lub link wygasł.' }, { status: 404 })
    }

    const allowedStatuses = ['pending', 'pending_manual_payment']
    if (!allowedStatuses.includes(booking.bookingStatus)) {
      return NextResponse.json({ error: 'Rezerwacja nie jest w stanie oczekującym na płatność.' }, { status: 409 })
    }

    const manual = getManualPaymentConfig()

    if (!manual.isAvailable || !manual.phone) {
      return NextResponse.json({ error: 'Płatność BLIK jest chwilowo niedostępna.' }, { status: 503 })
    }

    return NextResponse.json({
      phone: manual.phone,
      phoneDisplay: manual.phoneDisplay,
      accountName: manual.accountName,
      holdMinutes: manual.holdMinutes,
    })
  } catch (error) {
    console.error('[regulski-behawiorysta][blik-phone] error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Błąd serwera.' },
      { status: 500 },
    )
  }
}
