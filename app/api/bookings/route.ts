import { NextResponse } from 'next/server'
import { isProblemType } from '@/lib/data'
import { createPendingBooking } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'
import { AnimalType } from '@/lib/types'

function isAnimalType(value: unknown): value is AnimalType {
  return value === 'Pies' || value === 'Kot'
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPhoneValid(value: string): boolean {
  return value.replace(/\D/g, '').length >= 9
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Nie udalo sie utworzyc bookingu.'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const rawProblemType = typeof body.problemType === 'string' ? body.problemType : null
    const rawAnimalType = body.animalType

    if (
      typeof body.ownerName !== 'string' ||
      !isProblemType(rawProblemType) ||
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
    const petAge = body.petAge
    const durationNotes = body.durationNotes
    const description = body.description
    const phone = body.phone
    const email = body.email
    const slotId = body.slotId

    const fields = [
      ownerName,
      petAge,
      durationNotes,
      description,
      phone,
      email,
      slotId,
    ]

    if (fields.some((value) => value.trim().length === 0)) {
      return NextResponse.json({ error: 'Uzupelnij wszystkie pola formularza.' }, { status: 400 })
    }

    if (!isEmailValid(email.trim())) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail do potwierdzenia konsultacji.' }, { status: 400 })
    }

    if (!isPhoneValid(phone.trim())) {
      return NextResponse.json({ error: 'Podaj poprawny numer telefonu. Wystarczy co najmniej 9 cyfr.' }, { status: 400 })
    }

    if (description.trim().length < 20) {
      return NextResponse.json(
        { error: 'Dodaj krotski, ale konkretny opis sytuacji, aby dobrze wykorzystac 15 minut rozmowy.' },
        { status: 400 },
      )
    }

    const result = await createPendingBooking({
      ownerName,
      problemType,
      animalType,
      petAge,
      durationNotes,
      description,
      phone,
      email,
      slotId,
    })

    return NextResponse.json({ bookingId: result.booking.id, accessToken: result.accessToken })
  } catch (error) {
    console.error('[behawior15][booking-api] create failed', error)
    const message = getErrorMessage(error)
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 409 })
  }
}
