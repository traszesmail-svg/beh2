import { redirect } from 'next/navigation'
import {
  buildBookHref,
  buildSlotHref,
  readBookingSpeciesSearchParam,
  readBookingServiceSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
} from '@/lib/booking-routing'
import { DEFAULT_BOOKING_SERVICE, normalizeBookingServiceType } from '@/lib/booking-services'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SlotPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service))
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const species = readBookingSpeciesSearchParam(searchParams?.species)

  if (!problem) {
    redirect(buildBookHref(null, serviceQuery, qaBooking, species))
  }

  redirect(buildSlotHref(problem, serviceQuery, qaBooking, species))
}
