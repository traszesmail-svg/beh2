import { NextResponse } from 'next/server'
import { ConfigurationError } from '@/lib/server/env'
import { assertGrowthRunnerConfigured, getGrowthAuthorizationError, runGrowthFollowupSweep } from '@/lib/server/growth-runner'

export async function handleGrowthFollowupRunRequest(request: Request) {
  try {
    assertGrowthRunnerConfigured()
    const authorizationError = getGrowthAuthorizationError(request.headers.get('authorization'))

    if (authorizationError) {
      return NextResponse.json({ error: authorizationError }, { status: 401 })
    }

    const result = await runGrowthFollowupSweep()
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Growth follow-up runner zakonczyl sie bledem.'
    return NextResponse.json({ error: message }, { status: error instanceof ConfigurationError ? 503 : 500 })
  }
}
