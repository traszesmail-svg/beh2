import { redirect } from 'next/navigation'
import { buildBookHref, buildSlotHref, readProblemTypeSearchParam, readQaBookingSearchParam } from '@/lib/booking-routing'

export default function LegacyProblemPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)

  if (problem) {
    redirect(buildSlotHref(problem, null, qaBooking))
  }

  redirect(buildBookHref(null, null, qaBooking))
}
