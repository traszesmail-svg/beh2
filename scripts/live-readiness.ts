import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'
import { getVerifiedDeployReadinessChecks, hasBlockingGoLiveChecks, type GoLiveCheck } from '../lib/server/go-live'
import { applyOptionalEnvFileOverride, getDefaultProductionEnvSnapshotPath } from './lib/env-file'

const REPORTS_DIR = path.join(process.cwd(), 'qa-reports')
const LATEST_REPORT_PATH = path.join(REPORTS_DIR, 'latest-live-readiness.md')
const REPORT_TIME_ZONE = 'Europe/Warsaw'

function hasFlag(flagName: string) {
  return process.argv.includes(flagName)
}

function getFormattedDate(date: Date) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function getReportFileStamp(date: Date) {
  return getFormattedDate(date).replaceAll('-', '').replace(' ', '-').replaceAll(':', '')
}

function getCheckHeading(check: GoLiveCheck) {
  return check.tone === 'ready' ? 'GOTOWE' : 'BLOKER'
}

function getModeLabel(reportOnly: boolean) {
  return reportOnly ? 'report-only' : 'strict'
}

function getOverallResultLabel(hasBlockers: boolean) {
  return hasBlockers ? 'BLOCKED' : 'READY'
}

function getEnvSourceLabel(envOverridePath: string | null, usedDefaultProductionSnapshot: boolean) {
  if (envOverridePath) {
    return usedDefaultProductionSnapshot
      ? `production snapshot (${envOverridePath})`
      : `explicit override (${envOverridePath})`
  }

  return 'default runtime env'
}

function renderReport(checks: GoLiveCheck[], createdAt: Date, reportOnly: boolean, envSourceLabel: string) {
  const readyCount = checks.filter((check) => check.tone === 'ready').length
  const blockingCount = checks.length - readyCount
  const hasBlockers = blockingCount > 0
  const sections = checks.flatMap((check) => [
    `### ${getCheckHeading(check)} - ${check.label}`,
    `- Summary: ${check.summary}`,
    `- Next: ${check.nextStep}`,
    '',
  ])

  return [
    '# Raport Go-Live Readiness',
    '',
    `- Data: ${getFormattedDate(createdAt)} ${REPORT_TIME_ZONE}`,
    `- Tryb: ${getModeLabel(reportOnly)}`,
    `- Zrodlo env: ${envSourceLabel}`,
    `- Wynik ogolny: ${getOverallResultLabel(hasBlockers)}`,
    `- Gotowe: ${readyCount}/${checks.length}`,
    `- Blockery: ${blockingCount}`,
    '',
    '## Checki',
    ...sections,
  ].join('\n')
}

async function writeReport(reportContent: string, createdAt: Date) {
  const archivePath = path.join(REPORTS_DIR, `live-readiness-${getReportFileStamp(createdAt)}.md`)

  await mkdir(REPORTS_DIR, { recursive: true })
  await Promise.all([
    writeFile(LATEST_REPORT_PATH, `${reportContent}\n`, 'utf8'),
    writeFile(archivePath, `${reportContent}\n`, 'utf8'),
  ])

  return archivePath
}

async function main() {
  const rootDir = process.cwd()
  loadEnvConfig(rootDir)

  let envOverridePath = applyOptionalEnvFileOverride(rootDir)
  let usedDefaultProductionSnapshot = false

  if (!envOverridePath) {
    const defaultProductionSnapshotPath = getDefaultProductionEnvSnapshotPath(rootDir)

    if (existsSync(defaultProductionSnapshotPath)) {
      process.env.BEHAWIOR15_ENV_FILE = defaultProductionSnapshotPath
      envOverridePath = applyOptionalEnvFileOverride(rootDir)
      delete process.env.BEHAWIOR15_ENV_FILE
      usedDefaultProductionSnapshot = true
    }
  }

  const reportOnly = hasFlag('--report-only')
  const createdAt = new Date()
  const checks = await getVerifiedDeployReadinessChecks()
  const hasBlockers = hasBlockingGoLiveChecks(checks)
  const readyCount = checks.filter((check) => check.tone === 'ready').length
  const blockingCount = checks.length - readyCount
  const envSourceLabel = getEnvSourceLabel(envOverridePath, usedDefaultProductionSnapshot)
  const reportContent = renderReport(checks, createdAt, reportOnly, envSourceLabel)
  const archivePath = await writeReport(reportContent, createdAt)

  console.log(`Go-live readiness mode: ${getModeLabel(reportOnly)}`)
  if (envOverridePath) {
    console.log(
      usedDefaultProductionSnapshot
        ? `Applied default production env snapshot: ${envOverridePath}`
        : `Applied env file override: ${envOverridePath}`,
    )
  }
  console.log(`Env source: ${envSourceLabel}`)
  console.log(`Latest report: ${LATEST_REPORT_PATH}`)
  console.log(`Archive report: ${archivePath}`)
  console.log(`Ready checks: ${readyCount}/${checks.length}`)
  console.log(`Blocking checks: ${blockingCount}`)

  for (const check of checks) {
    console.log(`- ${getCheckHeading(check)} | ${check.label}: ${check.summary}`)
  }

  if (hasBlockers) {
    if (reportOnly) {
      console.log('Go-live readiness detected blockers, but report-only mode kept exit code at 0.')
      return
    }

    throw new Error('Go-live readiness detected blockers.')
  }

  console.log('Go-live readiness passed.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
