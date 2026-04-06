import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

function readFlagValue(flagName: string) {
  const index = process.argv.indexOf(flagName)

  if (index === -1) {
    return null
  }

  const value = process.argv[index + 1]

  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flagName}.`)
  }

  return value
}

function normalizeEnvValue(rawValue: string) {
  const trimmedValue = rawValue.trim()
  const quote = trimmedValue[0]
  const hasMatchingQuotes =
    trimmedValue.length >= 2 &&
    (quote === '"' || quote === "'") &&
    trimmedValue[trimmedValue.length - 1] === quote

  const unwrappedValue = hasMatchingQuotes ? trimmedValue.slice(1, -1) : trimmedValue

  return unwrappedValue
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .trim()
}

function parseEnvLine(line: string) {
  const trimmedLine = line.trim()

  if (!trimmedLine || trimmedLine.startsWith('#')) {
    return null
  }

  const withoutExport = trimmedLine.startsWith('export ') ? trimmedLine.slice('export '.length) : trimmedLine
  const separatorIndex = withoutExport.indexOf('=')

  if (separatorIndex <= 0) {
    return null
  }

  const name = withoutExport.slice(0, separatorIndex).trim()
  const rawValue = withoutExport.slice(separatorIndex + 1)

  if (!name) {
    return null
  }

  return {
    name,
    value: normalizeEnvValue(rawValue),
  }
}

export function applyOptionalEnvFileOverride(rootDir = process.cwd()) {
  const requestedPath = readFlagValue('--env-file') ?? process.env.BEHAWIOR15_ENV_FILE?.trim() ?? null

  if (!requestedPath) {
    return null
  }

  const resolvedPath = path.isAbsolute(requestedPath) ? requestedPath : path.join(rootDir, requestedPath)
  const source = readFileSync(resolvedPath, 'utf8')

  for (const line of source.split(/\r?\n/)) {
    const entry = parseEnvLine(line)

    if (entry) {
      process.env[entry.name] = entry.value
    }
  }

  return resolvedPath
}

export function getDefaultProductionEnvSnapshotPath(rootDir = process.cwd()) {
  const currentSnapshotPath = path.join(rootDir, '.vercel', '.env.production.current')

  if (existsSync(currentSnapshotPath)) {
    return currentSnapshotPath
  }

  return path.join(rootDir, '.vercel', '.env.production.local')
}
