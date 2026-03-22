import { NextResponse } from 'next/server'
import { createAvailabilitySlot } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingDate?: string; bookingTime?: string }

    if (!body.bookingDate || !body.bookingTime) {
      return NextResponse.json({ error: 'Brak daty lub godziny slotu.' }, { status: 400 })
    }

    const slot = await createAvailabilitySlot(body.bookingDate, body.bookingTime)
    return NextResponse.json({ slot })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udało się dodać slotu.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 400 })
  }
}
