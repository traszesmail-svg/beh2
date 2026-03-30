import { isProblemType } from '@/lib/data'
import type { ProblemType } from '@/lib/types'

type SearchParamValue = string | string[] | undefined

export function readSearchParam(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export function readProblemTypeSearchParam(value: SearchParamValue): ProblemType | null {
  const problem = readSearchParam(value)
  return isProblemType(problem) ? problem : null
}

function buildQueryHref(pathname: string, params: Record<string, string | null | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value.length > 0) {
      searchParams.set(key, value)
    }
  }

  const query = searchParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function buildBookHref(problem?: ProblemType | null): string {
  return buildQueryHref('/book', { problem: problem ?? null })
}

export function buildSlotHref(problem: ProblemType): string {
  return buildQueryHref('/slot', { problem })
}

export function buildFormHref(problem: ProblemType, slotId: string): string {
  return buildQueryHref('/form', {
    problem,
    slotId,
  })
}

export function buildPaymentHref(bookingId: string, accessToken?: string | null): string {
  return buildQueryHref('/payment', {
    bookingId,
    access: accessToken ?? null,
  })
}
