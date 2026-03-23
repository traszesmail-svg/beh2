import { buildRollingAvailabilitySeed, isFutureAvailabilitySlot } from '@/lib/data'
import { AvailabilitySlot } from '@/lib/types'

type AvailabilityLike = Pick<AvailabilitySlot, 'bookingDate' | 'bookingTime'>

export function hasFutureAvailabilitySlots(slots: AvailabilityLike[], now = new Date()): boolean {
  return slots.some((slot) => isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime, now))
}

export function buildSeedAvailabilitySlots(now = new Date(), timestamp = new Date().toISOString()): AvailabilitySlot[] {
  return buildRollingAvailabilitySeed(now).flatMap((entry) =>
    entry.times.map((bookingTime) => ({
      id: `${entry.date}-${bookingTime}`,
      bookingDate: entry.date,
      bookingTime,
      isBooked: false,
      lockedByBookingId: null,
      lockedUntil: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
  )
}
