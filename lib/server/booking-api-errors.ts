import { ConfigurationError, getPublicFeatureUnavailableMessage } from '@/lib/server/env'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Nie udało się utworzyć bookingu.'
}

function getNumericErrorStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const record = error as Record<string, unknown>
  const candidates = ['status', 'statusCode', 'code'] as const

  for (const key of candidates) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && /^\d{3}$/.test(value)) {
      return Number(value)
    }
  }

  return null
}

function isTransientBookingInfrastructureError(error: unknown): boolean {
  const status = getNumericErrorStatus(error)
  if (status === 502 || status === 503 || status === 504) {
    return true
  }

  const normalizedMessage = getErrorMessage(error)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  return (
    normalizedMessage.includes('<!doctype html') ||
    normalizedMessage.includes('bad gateway') ||
    normalizedMessage.includes('error code 502') ||
    normalizedMessage.includes('cloudflare') ||
    normalizedMessage.includes('gateway timeout') ||
    normalizedMessage.includes('service unavailable') ||
    normalizedMessage.includes('fetch failed')
  )
}

export function getBookingApiErrorSnapshot(error: unknown): { message: string; status: 409 | 503 } {
  if (error instanceof ConfigurationError || isTransientBookingInfrastructureError(error)) {
    return {
      message: getPublicFeatureUnavailableMessage('booking'),
      status: 503,
    }
  }

  return {
    message: getErrorMessage(error),
    status: 409,
  }
}
