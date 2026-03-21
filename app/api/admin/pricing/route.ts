import { NextResponse } from 'next/server'
import { parseConsultationPriceInput } from '@/lib/pricing'
import { updateActiveConsultationPrice } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { amount?: string | number }

    if (typeof body.amount !== 'string' && typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'Brak nowej ceny konsultacji.' }, { status: 400 })
    }

    const normalizedAmount = parseConsultationPriceInput(body.amount)
    const price = await updateActiveConsultationPrice(normalizedAmount)

    return NextResponse.json({ price })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udalo sie zapisac nowej ceny.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 400 })
  }
}
