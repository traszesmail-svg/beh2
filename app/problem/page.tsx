import { redirect } from 'next/navigation'
import { buildSlotHref, readProblemTypeSearchParam } from '@/lib/booking-routing'

export default function LegacyProblemPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readProblemTypeSearchParam(searchParams?.problem)

  if (problem) {
    redirect(buildSlotHref(problem))
  }

  redirect('/book')
}
