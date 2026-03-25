import { BookingRecord } from '@/lib/types'

export const SELF_CANCELLATION_WINDOW_MS = 60 * 1000

type SelfCancellationBooking = Pick<BookingRecord, 'bookingStatus' | 'paymentStatus' | 'paidAt' | 'paymentMethod'>

function parsePaidAtMs(paidAt: string | null | undefined): number | null {
  if (!paidAt) {
    return null
  }

  const parsed = Date.parse(paidAt)
  return Number.isFinite(parsed) ? parsed : null
}

export function getSelfCancellationDeadlineMs(booking: Pick<SelfCancellationBooking, 'paidAt'>): number | null {
  const paidAtMs = parsePaidAtMs(booking.paidAt)

  if (paidAtMs === null) {
    return null
  }

  return paidAtMs + SELF_CANCELLATION_WINDOW_MS
}

export function getRemainingSelfCancellationSeconds(
  booking: Pick<SelfCancellationBooking, 'paidAt'>,
  now = new Date(),
): number {
  const deadlineMs = getSelfCancellationDeadlineMs(booking)

  if (deadlineMs === null) {
    return 0
  }

  return Math.max(0, Math.ceil((deadlineMs - now.getTime()) / 1000))
}

export function canSelfCancelBooking(booking: SelfCancellationBooking, now = new Date()): boolean {
  if (!(booking.bookingStatus === 'confirmed' && booking.paymentStatus === 'paid')) {
    return false
  }

  if (!(booking.paymentMethod === 'payu' || booking.paymentMethod === 'stripe' || booking.paymentMethod === 'mock')) {
    return false
  }

  return getRemainingSelfCancellationSeconds(booking, now) > 0
}
