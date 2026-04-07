import { NextResponse } from 'next/server'
import { getBookingForViewer } from '@/lib/server/db'

type RouteContext = {
  params: {
    id: string
  }
}

function readAccessToken(request: Request) {
  const { searchParams } = new URL(request.url)
  return searchParams.get('access')
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const booking = await getBookingForViewer(params.id, readAccessToken(request), request.headers.get('authorization'))

    if (!booking) {
      return NextResponse.json({ error: 'Nie znaleziono rezerwacji.' }, { status: 404 })
    }

    return NextResponse.json({
      bookingId: booking.id,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod ?? null,
      paymentReference: booking.paymentReference ?? null,
      payuOrderId: booking.payuOrderId ?? null,
      payuOrderStatus: booking.payuOrderStatus ?? null,
      smsConfirmationStatus: booking.smsConfirmationStatus ?? null,
      updatedAt: booking.updatedAt,
    })
  } catch (error) {
    console.error('[behawior15][booking-status-api] load failed', error)
    return NextResponse.json({ error: 'Nie udało się odczytać statusu rezerwacji.' }, { status: 500 })
  }
}
