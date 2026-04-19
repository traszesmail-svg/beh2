import { redirect } from 'next/navigation'
import {
  appendSearchParams,
  buildBookHref,
  buildSlotHref,
  readBookingServiceSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
} from '@/lib/booking-routing'

export default function LegacyProblemPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = readBookingServiceSearchParam(searchParams?.service)
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)

  if (problem) {
    const slotHref = appendSearchParams(buildSlotHref(problem, null, qaBooking), searchParams, ['problem', 'qa', 'service'])
    redirect(serviceType ? appendSearchParams(slotHref, { service: serviceType }, []) : slotHref)
  }

  const bookHref = appendSearchParams(buildBookHref(null, null, qaBooking), searchParams, ['qa', 'service'])
  redirect(serviceType ? appendSearchParams(bookHref, { service: serviceType }, []) : bookHref)
}
