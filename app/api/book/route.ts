export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { sendBookRequestAutoReplyEmail, sendBookRequestEmail } from '@/lib/server/notifications'
import type { BookingSpecies } from '@/lib/booking-routing'

type BookingServiceId = 'kwadrans-na-juz' | 'szybka-konsultacja-15-min' | 'konsultacja-30-min' | 'konsultacja-behawioralna-online'

type ValidatedBookPayload = {
  service: BookingServiceId
  serviceLabel: string
  servicePrice: string
  name: string
  email: string
  species: BookingSpecies
  description: string
  preferredSlots: string
  consentRodo: boolean
  consentRegulamin: boolean
  consentEarlyStart: boolean
  honeypot: string
}

const SERVICES: Record<BookingServiceId, { label: string; price: string }> = {
  'kwadrans-na-juz': { label: 'Kwadrans na juz', price: '69 zl' },
  'szybka-konsultacja-15-min': { label: 'Kwadrans z behawiorysta', price: '69 zl' },
  'konsultacja-30-min': { label: 'Dwa kwadranse', price: '129 zl' },
  'konsultacja-behawioralna-online': { label: 'Pelna konsultacja', price: '350 zl' },
}

const SUCCESS_MESSAGE = 'Dostalem Twoja rezerwacje. Wyslalem tez kopie na podany adres e-mail.'
const URGENT_SUCCESS_MESSAGE = 'Twoja prosba o Kwadrans na juz dotarla. Wyslalem tez kopie na podany adres e-mail.'
const GENERIC_ERROR_MESSAGE = 'Nie udalo sie wyslac prosby o rezerwacje. Sprobuj ponownie pozniej.'
const UNAVAILABLE_MESSAGE = 'Rezerwacja mailowa jest chwilowo niedostepna. Sprobuj pozniej albo napisz przez formularz kontaktowy.'

function normalizeSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeLongText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.replace(/\r\n/g, '\n').trim()
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validatePayload(body: Record<string, unknown>): { payload?: ValidatedBookPayload; error?: string } {
  const service = normalizeSingleLine(body.service, 80) as BookingServiceId | null
  const name = normalizeSingleLine(body.name, 120)
  const email = normalizeSingleLine(body.email, 160)
  const speciesValue = normalizeSingleLine(body.species, 16)
  const description = normalizeLongText(body.description, 1000)
  const preferredSlots = normalizeLongText(body.preferredSlots, 1200)
  const honeypot = normalizeSingleLine(body.honeypot, 120) ?? ''
  const consentRodo = body.consentRodo === true
  const consentRegulamin = body.consentRegulamin === true
  const consentEarlyStart = body.consentEarlyStart === true
  const serviceConfig = service ? SERVICES[service] : null
  const species = speciesValue === 'pies' || speciesValue === 'kot' ? speciesValue : null

  if (!serviceConfig || !name || !email || !species || !description || (!preferredSlots && service !== 'kwadrans-na-juz')) {
    return { error: 'Uzupelnij usluge, imie, e-mail, gatunek, opis sytuacji i preferowane terminy.' }
  }

  if (!isEmailValid(email)) {
    return { error: 'Podaj poprawny adres e-mail.' }
  }

  if (description.length < 20) {
    return { error: 'Opis sytuacji powinien miec co najmniej 20 znakow.' }
  }

  if (!consentRodo || !consentRegulamin || !consentEarlyStart) {
    return { error: 'Zaznacz wszystkie wymagane zgody.' }
  }

  return {
    payload: {
      service: service as BookingServiceId,
      serviceLabel: serviceConfig.label,
      servicePrice: serviceConfig.price,
      name,
      email,
      species,
      description,
      preferredSlots: preferredSlots ?? 'Chce termin jak najszybciej - prosze o kontakt w ciagu 15 minut.',
      consentRodo,
      consentRegulamin,
      consentEarlyStart,
      honeypot,
    },
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>

    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Nie udalo sie odczytac formularza rezerwacji.' }, { status: 400 })
    }

    const { payload, error } = validatePayload(body)

    if (!payload || error) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    if (payload.honeypot) {
      return NextResponse.json({ ok: true, message: payload.service === 'kwadrans-na-juz' ? URGENT_SUCCESS_MESSAGE : SUCCESS_MESSAGE })
    }

    const adminDelivery = await sendBookRequestEmail(payload)

    if (adminDelivery.status === 'sent') {
      const customerDelivery = await sendBookRequestAutoReplyEmail(payload)

      if (customerDelivery.status === 'failed') {
        console.error('[behawior15][book] auto-reply failed', customerDelivery.reason)
      } else if (customerDelivery.status === 'skipped') {
        console.warn('[behawior15][book] auto-reply skipped', customerDelivery.reason)
      }

      return NextResponse.json({ ok: true, message: payload.service === 'kwadrans-na-juz' ? URGENT_SUCCESS_MESSAGE : SUCCESS_MESSAGE })
    }

    if (adminDelivery.status === 'skipped') {
      console.warn('[behawior15][book] submission skipped', adminDelivery.reason)
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    console.error('[behawior15][book] submission failed', adminDelivery.reason)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  } catch (error) {
    console.error('[behawior15][book] unexpected error', error)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
