import { NextResponse } from 'next/server'
import { createPayuCheckout } from '@/lib/server/payu'

function resolveClientIp(request: Request): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    null
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; accessToken?: string }

    if (!body.bookingId) {
      return NextResponse.json({ error: 'Brak bookingId.' }, { status: 400 })
    }

    const session = await createPayuCheckout(
      body.bookingId,
      body.accessToken ?? null,
      request.headers.get('authorization'),
      resolveClientIp(request),
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[behawior15][payment-api] payu checkout failed', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nie udało się uruchomić PayU.' },
      { status: 500 },
    )
  }
}
