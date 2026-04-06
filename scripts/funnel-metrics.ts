import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { loadEnvConfig } from '@next/env'
import { buildFunnelMetricsSnapshot, renderFunnelMetricsMarkdown } from '@/lib/server/funnel-metrics'
import { getLocalStoreDataDir } from '@/lib/server/local-store-path'
import type { BookingRecord, FunnelEventRecord } from '@/lib/types'

const rootDir = process.cwd()
const REPORTS_DIR = path.join(rootDir, 'qa-reports')
const LATEST_REPORT_PATH = path.join(REPORTS_DIR, 'latest-funnel-metrics.md')
const REPORT_TIME_ZONE = 'Europe/Warsaw'

function getWarsawTimestamp(date: Date) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const values: Record<string, string> = {}

  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') {
      values[part.type] = part.value
    }
  }

  return `${values.year}${values.month}${values.day}-${values.hour}${values.minute}${values.second}`
}

async function main() {
  loadEnvConfig(rootDir)
  const dataDir = getLocalStoreDataDir(rootDir)

  const [events, bookings] = await Promise.all([
    readJsonFile<FunnelEventRecord[]>(path.join(dataDir, 'funnel-events.json'), []),
    readJsonFile<BookingRecord[]>(path.join(dataDir, 'bookings.json'), []),
  ])
  const generatedAt = new Date()
  const snapshot = buildFunnelMetricsSnapshot({ events, bookings, now: generatedAt })
  const report = `${renderFunnelMetricsMarkdown(snapshot)}\n`
  const archivePath = path.join(REPORTS_DIR, `funnel-metrics-${getWarsawTimestamp(generatedAt)}.md`)

  await mkdir(REPORTS_DIR, { recursive: true })
  await writeFile(LATEST_REPORT_PATH, report, 'utf8')
  await writeFile(archivePath, report, 'utf8')

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'funnel metrics report written',
      latestReportPath: LATEST_REPORT_PATH,
      archivePath,
      productionEvents: snapshot.totalEvents,
      qaEvents: snapshot.totalQaEvents,
      bookingCount: snapshot.bookingCounts.total,
    }),
  )
}

async function readJsonFile<T>(filePath: string, fallbackValue: T): Promise<T> {
  try {
    const raw = await readFile(filePath, 'utf8')

    if (!raw.trim()) {
      return fallbackValue
    }

    return JSON.parse(raw) as T
  } catch {
    return fallbackValue
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      level: 'error',
      msg: 'funnel metrics report failed',
      error: error instanceof Error ? error.message : String(error),
    }),
  )
  process.exitCode = 1
})
