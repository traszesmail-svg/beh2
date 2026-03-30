import { NextResponse } from 'next/server'
import { readLatestQaReport } from '@/lib/server/qa-report'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const report = await readLatestQaReport()

  return new NextResponse(report.content, {
    status: report.exists ? 200 : 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}
