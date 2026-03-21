import { NextResponse } from 'next/server'
import { deleteAvailabilitySlot } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await deleteAvailabilitySlot(params.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udalo sie usunac slotu.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 400 })
  }
}
