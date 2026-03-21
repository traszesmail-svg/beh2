import { NextResponse } from 'next/server'
import { markBookingDone } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await request.json()) as { recommendedNextStep?: string }
    const booking = await markBookingDone(params.id, body.recommendedNextStep)

    if (!booking) {
      return NextResponse.json({ error: 'Nie znaleziono bookingu.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udalo sie zamknac konsultacji.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}
