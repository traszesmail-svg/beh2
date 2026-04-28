import { resolveBookingServiceType, getBookingServiceRoomDurationMinutes } from '@/lib/booking-services'
import type { BookingRecord } from '@/lib/types'

function padTwo(n: number): string {
  return String(n).padStart(2, '0')
}

// Parses "YYYY-MM-DD" + "HH:MM" into a Date in local time (Warsaw/Europe)
function parseLocalDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  // We build an ISO string treating the time as Europe/Warsaw (UTC+1/+2).
  // Since Next.js runs on the server and we only need the URL, we keep it
  // simple: treat the booking time as written (no DST correction) and let
  // Google Calendar handle the display. Worst case ±1h off in edge DST weeks.
  return new Date(Date.UTC(year, month - 1, day, hour, minute))
}

function toGoogleCalendarDate(d: Date): string {
  return [
    d.getUTCFullYear(),
    padTwo(d.getUTCMonth() + 1),
    padTwo(d.getUTCDate()),
    'T',
    padTwo(d.getUTCHours()),
    padTwo(d.getUTCMinutes()),
    '00Z',
  ].join('')
}

export function buildGoogleCalendarUrl(
  booking: Pick<BookingRecord, 'bookingDate' | 'bookingTime' | 'serviceType' | 'amount' | 'ownerName' | 'meetingUrl'>,
): string {
  const serviceType = resolveBookingServiceType(booking.serviceType, booking.amount)
  const durationMinutes = getBookingServiceRoomDurationMinutes(serviceType)

  const start = parseLocalDateTime(booking.bookingDate, booking.bookingTime)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Behawior 15 – ${booking.ownerName}`,
    dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
    details: `Link do rozmowy: ${booking.meetingUrl}`,
    location: booking.meetingUrl,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
