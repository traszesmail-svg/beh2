import { NextResponse } from 'next/server'
import { listBookings, markBookingReminderSent } from '@/lib/server/db'
import { ConfigurationError } from '@/lib/server/env'
import { sendBookingReminderEmail } from '@/lib/server/notifications'
import { getWarsawDateTime, shouldSendReminderForBooking } from '@/lib/server/reminders'

function authorize(request: Request): string | null {
  const secret = process.env.CRON_SECRET?.trim()

  if (!secret) {
    return 'Brak konfiguracji CRON_SECRET.'
  }

  const authorization = request.headers.get('authorization')

  if (authorization !== `Bearer ${secret}`) {
    return 'Brak poprawnej autoryzacji crona.'
  }

  return null
}

export const runtime = 'nodejs'

async function handleReminderRequest(request: Request) {
  try {
    const authorizationError = authorize(request)

    if (authorizationError) {
      return NextResponse.json({ error: authorizationError }, { status: authorizationError.includes('CRON_SECRET') ? 503 : 401 })
    }

    const now = new Date()
    const windowStart = getWarsawDateTime(now)
    const windowEnd = getWarsawDateTime(new Date(now.getTime() + 60 * 60 * 1000))
    const bookings = await listBookings()
    const candidates = bookings.filter((booking) => shouldSendReminderForBooking(booking, windowStart, windowEnd))

    let sent = 0
    let failed = 0
    let skipped = 0

    for (const booking of candidates) {
      const delivery = await sendBookingReminderEmail(booking)

      if (delivery.status === 'sent') {
        await markBookingReminderSent(booking.id)
        sent += 1
        continue
      }

      if (delivery.status === 'skipped') {
        skipped += 1
        continue
      }

      failed += 1
    }

    console.info('[behawior15][reminder] run', {
      checked: bookings.length,
      candidates: candidates.length,
      sent,
      skipped,
      failed,
      windowStart,
      windowEnd,
    })

    return NextResponse.json({
      ok: true,
      checked: bookings.length,
      candidates: candidates.length,
      sent,
      skipped,
      failed,
      windowStart,
      windowEnd,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cron reminder zakonczyl sie bledem.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}

export async function GET(request: Request) {
  return handleReminderRequest(request)
}

export async function POST(request: Request) {
  return handleReminderRequest(request)
}
