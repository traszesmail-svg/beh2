import { compareDateAndTime, formatDateLabel } from '@/lib/data'
import { listAvailability } from '@/lib/server/db'

type NextSlotProps = {
  className?: string
}

function getWarsawNowParts() {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(new Date())
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

function formatFutureSlotCount(count: number) {
  return count === 1 ? '1 dostępny termin' : `${count} dostępnych terminów`
}

export async function NextSlot({ className }: NextSlotProps) {
  try {
    const groupedAvailability = await listAvailability()
    const availability = groupedAvailability.flatMap((group) => group.slots)
    const now = getWarsawNowParts()
    const nextSlot =
      availability
        .filter((slot) => !slot.isBooked)
        .sort((left, right) => compareDateAndTime(left.bookingDate, left.bookingTime, right.bookingDate, right.bookingTime))
        .find((slot) => compareDateAndTime(slot.bookingDate, slot.bookingTime, now.date, now.time) >= 0) ?? null

    if (!nextSlot) {
      return null
    }

    const futureSlotCount = availability.filter(
      (slot) => !slot.isBooked && compareDateAndTime(slot.bookingDate, slot.bookingTime, now.date, now.time) >= 0,
    ).length

    return (
      <div className={className ? `next-slot-badge ${className}` : 'next-slot-badge'}>
        <span className="next-slot-dot" aria-hidden="true" />
        <span>
          Najbliższy dostępny termin: <strong>{formatDateLabel(nextSlot.bookingDate)}, {nextSlot.bookingTime}</strong>
          {futureSlotCount > 1 ? ` · ${formatFutureSlotCount(futureSlotCount)}` : ''}
        </span>
      </div>
    )
  } catch {
    return null
  }
}
