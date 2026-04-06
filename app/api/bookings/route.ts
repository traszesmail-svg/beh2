import { NextResponse } from 'next/server'
import { isBookingServiceType } from '@/lib/booking-services'
import { isProblemType } from '@/lib/data'
import { isValidPolishPhone } from '@/lib/phone'
import { createPendingBooking } from '@/lib/server/db'
import { getBookingApiErrorSnapshot } from '@/lib/server/booking-api-errors'
import { getQaCheckoutEligibility } from '@/lib/server/payment-options'
import { AnimalType } from '@/lib/types'

function isAnimalType(value: unknown): value is AnimalType {
  return value === 'Pies' || value === 'Kot'
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const rawProblemType = typeof body.problemType === 'string' ? body.problemType : null
    const rawAnimalType = body.animalType
    const rawServiceType = typeof body.serviceType === 'string' ? body.serviceType : null
    const qaBooking = body.qaBooking === true

    if (
      typeof body.ownerName !== 'string' ||
      !isProblemType(rawProblemType) ||
      (rawServiceType !== null && !isBookingServiceType(rawServiceType)) ||
      !isAnimalType(rawAnimalType) ||
      typeof body.petAge !== 'string' ||
      typeof body.durationNotes !== 'string' ||
      typeof body.description !== 'string' ||
      typeof body.phone !== 'string' ||
      typeof body.email !== 'string' ||
      typeof body.slotId !== 'string'
    ) {
      return NextResponse.json({ error: 'Niepoprawne dane formularza.' }, { status: 400 })
    }

    const ownerName = body.ownerName
    const problemType = rawProblemType
    const animalType = rawAnimalType
    const serviceType = rawServiceType
    const petAge = body.petAge
    const durationNotes = body.durationNotes
    const description = body.description
    const phone = body.phone
    const email = body.email
    const slotId = body.slotId

    if (qaBooking) {
      const qaEligibility = getQaCheckoutEligibility({
        id: 'pending',
        qaBooking: true,
        email,
        phone,
      })

      if (!qaEligibility.isAllowed) {
        return NextResponse.json({ error: qaEligibility.reason ?? qaEligibility.summary }, { status: 403 })
      }
    }

    const fields = [ownerName, petAge, durationNotes, description, phone, email, slotId]

    if (fields.some((value) => value.trim().length === 0)) {
      return NextResponse.json({ error: 'UzupeĹ‚nij wszystkie pola formularza.' }, { status: 400 })
    }

    if (!isEmailValid(email.trim())) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail do potwierdzenia konsultacji.' }, { status: 400 })
    }

    if (!isValidPolishPhone(phone.trim())) {
      return NextResponse.json(
        { error: 'Podaj poprawny polski numer telefonu, np. 500 600 700 albo +48 500 600 700.' },
        { status: 400 },
      )
    }

    if (description.trim().length < 20) {
      return NextResponse.json(
        { error: 'Dodaj krótki, ale konkretny opis sytuacji, aby dobrze wykorzystać wybrany czas rozmowy.' },
        { status: 400 },
      )
    }

    const result = await createPendingBooking({
      ownerName,
      serviceType: serviceType ?? undefined,
      problemType,
      animalType,
      petAge,
      durationNotes,
      description,
      phone,
      email,
      slotId,
      qaBooking,
    })

    return NextResponse.json({ bookingId: result.booking.id, accessToken: result.accessToken })
  } catch (error) {
    console.error('[behawior15][booking-api] create failed', error)
    const failure = getBookingApiErrorSnapshot(error)
    return NextResponse.json({ error: failure.message }, { status: failure.status })
  }
}
