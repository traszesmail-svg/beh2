export const DEFAULT_PRICE_PLN = 39
export const MIN_CONSULTATION_PRICE_PLN = 2

export type ActiveConsultationPrice = {
  amount: number
  formattedAmount: string
  exactFormattedAmount: string
  updatedAt: string | null
  summary: string
}

function normalizeAmount(value: number): number {
  return Math.round(value * 100) / 100
}

export function formatPricePln(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPricePlnExact(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function createActiveConsultationPrice(amount: number, updatedAt: string | null = null): ActiveConsultationPrice {
  const normalizedAmount = normalizeAmount(amount)

  return {
    amount: normalizedAmount,
    formattedAmount: formatPricePln(normalizedAmount),
    exactFormattedAmount: formatPricePlnExact(normalizedAmount),
    updatedAt,
    summary: `Aktywna cena konsultacji: ${formatPricePln(normalizedAmount)}.`,
  }
}

export function parseConsultationPriceInput(rawValue: string | number): number {
  const raw = typeof rawValue === 'number' ? String(rawValue) : rawValue.trim()
  const normalized = raw.replace(',', '.')

  if (!normalized || !/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Podaj poprawna kwote konsultacji w PLN, np. 39 albo 49.50.')
  }

  const amount = Number(normalized)

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Cena konsultacji musi byc dodatnia.')
  }

  if (amount < MIN_CONSULTATION_PRICE_PLN) {
    throw new Error(
      `Cena konsultacji nie moze byc nizsza niz ${formatPricePlnExact(
        MIN_CONSULTATION_PRICE_PLN,
      )}, bo Stripe Checkout w PLN nie przyjmuje nizszych kwot.`,
    )
  }

  return normalizeAmount(amount)
}

export function toStripeUnitAmount(amount: number): number {
  return Math.round(normalizeAmount(amount) * 100)
}
