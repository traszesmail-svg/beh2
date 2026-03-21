import { NextResponse } from 'next/server'
import { ConfigurationError } from '@/lib/server/env'
import { getReminderAuthorizationError, runBookingReminderSweep } from '@/lib/server/reminder-runner'

export async function handleReminderRunRequest(request: Request) {
  try {
    const authorizationError = getReminderAuthorizationError(request.headers.get('authorization'))

    if (authorizationError) {
      return NextResponse.json({ error: authorizationError }, { status: 401 })
    }

    const result = await runBookingReminderSweep()

    console.info('[behawior15][reminder] run', result)

    return NextResponse.json({
      ok: true,
      ...result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reminder runner zakonczyl sie bledem.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}
