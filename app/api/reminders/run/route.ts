import { handleReminderRunRequest } from '@/lib/server/reminder-http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  return handleReminderRunRequest(request)
}

export async function POST(request: Request) {
  return handleReminderRunRequest(request)
}
