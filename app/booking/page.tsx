import { redirect } from 'next/navigation'
import { appendSearchParams } from '@/lib/booking-routing'

export default function LegacyBookingPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  redirect(appendSearchParams('/book', searchParams))
}
