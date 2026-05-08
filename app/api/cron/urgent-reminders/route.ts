export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { listUrgentNowRequests } from '@/lib/server/db'
import { sendAdminUrgentReminderSms } from '@/lib/server/sms'

const CRON_SECRET = process.env.CRON_SECRET?.trim() || null
const URGENT_WINDOW_MS = 15 * 60 * 1000
const REMINDER_AT_MS = 10 * 60 * 1000

function isCronAuthorized(request: Request): boolean {
  if (!CRON_SECRET) return true
  const auth = request.headers.get('authorization')
  return auth === `Bearer ${CRON_SECRET}`
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = Date.now()
    const requests = await listUrgentNowRequests()

    const due = requests.filter((r) => {
      if (r.status !== 'new') return false
      const age = now - new Date(r.createdAt).getTime()
      return age >= REMINDER_AT_MS && age < URGENT_WINDOW_MS
    })

    const results = await Promise.allSettled(
      due.map((r) => sendAdminUrgentReminderSms(r.id, r.name, r.topicLabel)),
    )

    return NextResponse.json({
      ok: true,
      checked: requests.filter((r) => r.status === 'new').length,
      reminded: due.length,
      results: results.map((r) => (r.status === 'fulfilled' ? r.value.status : 'rejected')),
    })
  } catch (err) {
    console.error('[regulski-behawiorysta][cron][urgent-reminders] error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return GET(request)
}
