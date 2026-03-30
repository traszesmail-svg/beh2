import { readFile, stat } from 'fs/promises'
import path from 'path'

export type QaReportSnapshot = {
  exists: boolean
  filePath: string
  content: string
  updatedAt: string | null
}

export function getLatestQaReportPath(rootDir = process.cwd()) {
  return path.join(rootDir, 'qa-reports', 'latest-report.md')
}

function extractReportTimestamp(content: string) {
  const match = content.match(/^- Data:\s+(.+)$/m)
  return match?.[1]?.trim() ?? null
}

export async function readLatestQaReport(rootDir = process.cwd()): Promise<QaReportSnapshot> {
  const filePath = getLatestQaReportPath(rootDir)

  try {
    const [content, metadata] = await Promise.all([readFile(filePath, 'utf8'), stat(filePath)])
    const contentTimestamp = extractReportTimestamp(content)

    return {
      exists: true,
      filePath,
      content,
      updatedAt: contentTimestamp ?? metadata.mtime.toISOString(),
    }
  } catch {
    return {
      exists: false,
      filePath,
      content:
        '# Brak raportu QA\n\nNie znaleziono jeszcze `qa-reports/latest-report.md`. Uruchom walidację i zapisz artefakt raportowy w repo.',
      updatedAt: null,
    }
  }
}
