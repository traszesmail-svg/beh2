import { handleGrowthFollowupRunRequest } from '@/lib/server/growth-http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  return handleGrowthFollowupRunRequest(request)
}

export async function POST(request: Request) {
  return handleGrowthFollowupRunRequest(request)
}
