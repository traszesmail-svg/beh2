import { ConfigurationError, getPublicFeatureUnavailableMessage } from '@/lib/server/env'

export type BookingApiErrorCode = 'slot_unavailable' | 'booking_unavailable'

export type BookingApiErrorSnapshot = {
  code: BookingApiErrorCode
  message: string
  status: 409 | 503
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Nie udało się utworzyć bookingu.'
}

function normalizeErrorMessage(error: unknown): string {
  return getErrorMessage(error)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[łŁ]/g, 'l')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function getNumericErrorStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const record = error as Record<string, unknown>
  const candidates = ['status', 'statusCode', 'code'] as const

  for (const key of candidates) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && /^\d{3}$/.test(value)) {
      return Number(value)
    }
  }

  return null
}

function isTransientBookingInfrastructureError(error: unknown): boolean {
  const status = getNumericErrorStatus(error)
  if (status === 502 || status === 503 || status === 504) {
    return true
  }

  const normalizedMessage = getErrorMessage(error)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  return (
    normalizedMessage.includes('<!doctype html') ||
    normalizedMessage.includes('bad gateway') ||
    normalizedMessage.includes('error code 502') ||
    normalizedMessage.includes('cloudflare') ||
    normalizedMessage.includes('gateway timeout') ||
    normalizedMessage.includes('service unavailable') ||
    normalizedMessage.includes('fetch failed')
  )
}

function isSlotUnavailableBookingError(error: unknown): boolean {
  const normalizedMessage = normalizeErrorMessage(error)

  return (
    normalizedMessage.includes('wybrany termin') &&
    (
      normalizedMessage.includes('nie jest juz dostepny') ||
      normalizedMessage.includes('nie jest dostepny') ||
      normalizedMessage.includes('zostal przed chwila zajety') ||
      normalizedMessage.includes('zostal zajety') ||
      normalizedMessage.includes('slot no longer available') ||
      normalizedMessage.includes('already booked') ||
      normalizedMessage.includes('already reserved') ||
      normalizedMessage.includes('locked by booking id')
    )
  )
}

const SLOT_UNAVAILABLE_MESSAGE =
  'Ten termin został właśnie zajęty. Wróć do listy terminów i wybierz inny.'

export function getBookingApiErrorSnapshot(error: unknown): BookingApiErrorSnapshot {
  if (error instanceof ConfigurationError || isTransientBookingInfrastructureError(error)) {
    return {
      message: getPublicFeatureUnavailableMessage('booking'),
      status: 503,
      code: 'booking_unavailable',
    }
  }

  if (isSlotUnavailableBookingError(error)) {
    return {
      message: SLOT_UNAVAILABLE_MESSAGE,
      status: 409,
      code: 'slot_unavailable',
    }
  }

  return {
    message: getPublicFeatureUnavailableMessage('booking'),
    status: 503,
    code: 'booking_unavailable',
  }
}
