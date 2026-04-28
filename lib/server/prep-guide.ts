import { getBaseUrl } from '@/lib/server/env'
import { resolveBookingServiceType } from '@/lib/booking-services'
import type { BookingRecord } from '@/lib/types'

const PREP_GUIDE_SLUGS: Record<string, string> = {
  'szybka-konsultacja-15-min': 'kwadrans',
  'kwadrans-na-juz': 'kwadrans-na-juz',
  'konsultacja-30-min': 'konsultacja-30-min',
  'konsultacja-behawioralna-online': 'konsultacja-behawioralna-online',
}

export function getPrepGuideUrl(
  booking: Pick<BookingRecord, 'serviceType' | 'amount'>,
): string | null {
  const serviceType = resolveBookingServiceType(booking.serviceType, booking.amount)
  const slug = PREP_GUIDE_SLUGS[serviceType]

  if (!slug) {
    return null
  }

  // PDF in public/prep-guides/ served as static file
  return `${getBaseUrl()}/prep-guides/${slug}.pdf`
}
