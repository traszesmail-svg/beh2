import { isBookingServiceType, type BookingServiceType } from '@/lib/booking-services'
import { isProblemType } from '@/lib/data'
import type { ProblemType } from '@/lib/types'

type SearchParamValue = string | string[] | undefined

export function readSearchParam(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export function readProblemTypeSearchParam(value: SearchParamValue): ProblemType | null {
  const problem = readSearchParam(value)
  return isProblemType(problem) ? problem : null
}

export function readBookingServiceSearchParam(value: SearchParamValue): BookingServiceType | null {
  const service = readSearchParam(value)
  return isBookingServiceType(service) ? service : null
}

export function readQaBookingSearchParam(value: SearchParamValue): boolean {
  const qa = readSearchParam(value)

  if (!qa) {
    return false
  }

  return ['1', 'true', 'qa', 'yes'].includes(qa.trim().toLowerCase())
}

function buildQueryHref(pathname: string, params: Record<string, string | null | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value.length > 0) {
      searchParams.set(key, value)
    }
  }

  const query = searchParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function buildBookHref(
  problem?: ProblemType | null,
  serviceType?: BookingServiceType | null,
  qaBooking?: boolean,
): string {
  return buildQueryHref('/book', {
    problem: problem ?? null,
    service: serviceType ?? null,
    qa: qaBooking ? '1' : null,
  })
}

export function buildSlotHref(
  problem: ProblemType,
  serviceType?: BookingServiceType | null,
  qaBooking?: boolean,
): string {
  return buildQueryHref('/slot', {
    problem,
    service: serviceType ?? null,
    qa: qaBooking ? '1' : null,
  })
}

export function buildFormHref(
  problem: ProblemType,
  slotId: string,
  serviceType?: BookingServiceType | null,
  qaBooking?: boolean,
): string {
  return buildQueryHref('/form', {
    problem,
    slotId,
    service: serviceType ?? null,
    qa: qaBooking ? '1' : null,
  })
}

export function buildPaymentHref(
  bookingId: string,
  accessToken?: string | null,
  serviceType?: BookingServiceType | null,
  qaBooking?: boolean,
): string {
  return buildQueryHref('/payment', {
    bookingId,
    access: accessToken ?? null,
    service: serviceType ?? null,
    qa: qaBooking ? '1' : null,
  })
}
