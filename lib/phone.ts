export type NormalizedPolishPhone = {
  e164: string
  digits: string
  display: string
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizePolishPhone(value: string | null | undefined): NormalizedPolishPhone | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const digits = extractDigits(trimmed)
  let countryDigits: string | null = null
  let localDigits: string | null = null

  if (/^\d{9}$/.test(digits)) {
    countryDigits = `48${digits}`
    localDigits = digits
  } else if (/^48\d{9}$/.test(digits)) {
    countryDigits = digits
    localDigits = digits.slice(2)
  } else if (/^0048\d{9}$/.test(digits)) {
    countryDigits = digits.slice(2)
    localDigits = digits.slice(4)
  }

  if (!countryDigits || !localDigits) {
    return null
  }

  return {
    e164: `+${countryDigits}`,
    digits: countryDigits,
    display: `+48 ${localDigits.slice(0, 3)} ${localDigits.slice(3, 6)} ${localDigits.slice(6)}`,
  }
}

export function isValidPolishPhone(value: string | null | undefined): boolean {
  return normalizePolishPhone(value) !== null
}

export function formatPolishPhoneDisplay(value: string | null | undefined): string | null {
  const normalized = normalizePolishPhone(value)
  return normalized?.display ?? null
}

export function maskPhoneForLogs(value: string | null | undefined): string | null {
  const normalized = normalizePolishPhone(value)

  if (!normalized) {
    return null
  }

  return `${normalized.display.slice(0, 7)} *** ${normalized.display.slice(-3)}`
}
