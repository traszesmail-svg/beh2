import { formatPricePln } from '@/lib/pricing'

type PriceDisplayProps = {
  amount: number
  prefix?: string
  className?: string
}

export function PriceDisplay({ amount, prefix, className }: PriceDisplayProps) {
  const amountLabel = formatPricePln(amount)
  const value = prefix ? `${prefix} ${amountLabel}` : amountLabel

  return <span className={className}>{value}</span>
}
