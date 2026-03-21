import { listBookings, markBookingReminderSent } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'
import { sendBookingReminderEmail } from '@/lib/server/notifications'
import { LocalTimeWindow, getWarsawDateTime, shouldSendReminderForBooking } from '@/lib/server/reminders'
import { BookingRecord } from '@/lib/types'

export const REMINDER_RUN_PATH = '/api/reminders/run'
export const SUPABASE_REMINDER_JOB_NAME = 'behavior15-booking-reminders'
export const SUPABASE_REMINDER_SCHEDULE = '*/5 * * * *'
export const SUPABASE_REMINDER_APP_URL_SECRET = 'behavior15_app_url'
export const SUPABASE_REMINDER_CRON_SECRET = 'behavior15_cron_secret'

type ReminderDeliveryResult = Awaited<ReturnType<typeof sendBookingReminderEmail>>

type ReminderRunnerDeps = {
  listBookings: () => Promise<BookingRecord[]>
  sendBookingReminderEmail: (booking: BookingRecord) => Promise<ReminderDeliveryResult>
  markBookingReminderSent: (bookingId: string) => Promise<BookingRecord | null>
  now: () => Date
}

export type ReminderRunResult = {
  checked: number
  candidates: number
  sent: number
  skipped: number
  failed: number
  windowStart: LocalTimeWindow
  windowEnd: LocalTimeWindow
}

const defaultDeps: ReminderRunnerDeps = {
  listBookings,
  sendBookingReminderEmail,
  markBookingReminderSent,
  now: () => new Date(),
}

export function getReminderRunSecret(): string {
  const secret = process.env.CRON_SECRET?.trim()

  if (!secret) {
    throw new ConfigurationError('Brak konfiguracji CRON_SECRET.')
  }

  return secret
}

export function getReminderAuthorizationError(authorization: string | null): string | null {
  const secret = getReminderRunSecret()

  if (authorization !== `Bearer ${secret}`) {
    return 'Brak poprawnej autoryzacji remindera.'
  }

  return null
}

export async function runBookingReminderSweep(overrides: Partial<ReminderRunnerDeps> = {}): Promise<ReminderRunResult> {
  const deps = { ...defaultDeps, ...overrides }
  const now = deps.now()
  const windowStart = getWarsawDateTime(now)
  const windowEnd = getWarsawDateTime(new Date(now.getTime() + 60 * 60 * 1000))
  const bookings = await deps.listBookings()
  const candidates = bookings.filter((booking) => shouldSendReminderForBooking(booking, windowStart, windowEnd))

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const booking of candidates) {
    const delivery = await deps.sendBookingReminderEmail(booking)

    if (delivery.status === 'sent') {
      await deps.markBookingReminderSent(booking.id)
      sent += 1
      continue
    }

    if (delivery.status === 'skipped') {
      skipped += 1
      continue
    }

    failed += 1
  }

  return {
    checked: bookings.length,
    candidates: candidates.length,
    sent,
    skipped,
    failed,
    windowStart,
    windowEnd,
  }
}
