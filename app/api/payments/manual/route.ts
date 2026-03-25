import { NextResponse } from 'next/server'
import { reportManualPayment } from '@/lib/server/manual-payments'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; accessToken?: string }

    if (!body.bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const booking = await reportManualPayment(body.bookingId, body.accessToken ?? null, request.headers.get('authorization'))
    const accessQuery = body.accessToken ? `&access=${encodeURIComponent(body.accessToken)}` : ''

    return NextResponse.json({
      redirectTo: `/confirmation?bookingId=${booking.id}${accessQuery}&manual=reported`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nie udało się zgłosić płatności.' },
      { status: 500 },
    )
  }
}
