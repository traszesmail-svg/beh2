import { redirect } from 'next/navigation'
import { appendSearchParams } from '@/lib/booking-routing'

export default function LegacyPokojPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  redirect(appendSearchParams('/book', searchParams))
}
