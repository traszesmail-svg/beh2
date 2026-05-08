export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { buildFormHref } from '@/lib/booking-routing'
import { createAvailabilitySlot, listUrgentNowRequests, respondUrgentNowRequest } from '@/lib/server/db'
import { sendUrgentNowResponseEmail } from '@/lib/server/notifications'

function normalizeSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await request.json()) as {
      proposedDate?: string
      proposedTime?: string
      responseNote?: string
    }

    const proposedDate = normalizeSingleLine(body.proposedDate, 32)
    const proposedTime = normalizeSingleLine(body.proposedTime, 16)
    const responseNote = normalizeSingleLine(body.responseNote, 500)

    if (!proposedDate || !proposedTime) {
      return NextResponse.json({ error: 'Podaj datę i godzinę odpowiedzi.' }, { status: 400 })
    }

    const requests = await listUrgentNowRequests()
    const urgentRequest = requests.find((item) => item.id === params.id)

    if (!urgentRequest) {
      return NextResponse.json({ error: 'Nie znaleziono prośby o Kwadrans na już.' }, { status: 404 })
    }

    const slot = await createAvailabilitySlot(proposedDate, proposedTime)
    const bookingHref = buildFormHref(urgentRequest.topicId, slot.id, 'szybka-konsultacja-15-min')

    const updatedRequest = await respondUrgentNowRequest({
      id: urgentRequest.id,
      proposedDate,
      proposedTime,
      responseNote,
      availabilitySlotId: slot.id,
      bookingHref,
    })

    if (!updatedRequest) {
      return NextResponse.json({ error: 'Nie udało się zapisać odpowiedzi.' }, { status: 500 })
    }

    const emailResult = await sendUrgentNowResponseEmail({
      customerName: urgentRequest.name,
      customerEmail: urgentRequest.email,
      topic: urgentRequest.topicLabel,
      proposedDate,
      proposedTime,
      bookingHref,
      responseNote,
    })

    if (emailResult.status !== 'sent') {
      return NextResponse.json(
        { error: emailResult.reason ?? 'Nie udało się wysłać odpowiedzi do klienta.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      request: updatedRequest,
      slot,
      bookingHref,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nie udało się odpowiedzieć na prośbę.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
