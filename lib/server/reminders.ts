import { BookingRecord } from '@/lib/types'

export type LocalTimeWindow = {
  date: string
  time: string
}

export function getWarsawDateTime(date: Date): LocalTimeWindow {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  }
}

export function isAfter(leftDate: string, leftTime: string, rightDate: string, rightTime: string): boolean {
  return `${leftDate}T${leftTime}` > `${rightDate}T${rightTime}`
}

export function isBeforeOrEqual(leftDate: string, leftTime: string, rightDate: string, rightTime: string): boolean {
  return `${leftDate}T${leftTime}` <= `${rightDate}T${rightTime}`
}

export function isWithinReminderWindow(
  bookingDate: string,
  bookingTime: string,
  start: LocalTimeWindow,
  end: LocalTimeWindow,
): boolean {
  return (
    isAfter(bookingDate, bookingTime, start.date, start.time) &&
    isBeforeOrEqual(bookingDate, bookingTime, end.date, end.time)
  )
}

export function shouldSendReminderForBooking(
  booking: Pick<BookingRecord, 'bookingStatus' | 'paymentStatus' | 'reminderSent' | 'bookingDate' | 'bookingTime'>,
  start: LocalTimeWindow,
  end: LocalTimeWindow,
): boolean {
  return (
    booking.bookingStatus === 'confirmed' &&
    booking.paymentStatus === 'paid' &&
    !booking.reminderSent &&
    isWithinReminderWindow(booking.bookingDate, booking.bookingTime, start, end)
  )
}
