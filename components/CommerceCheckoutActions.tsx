'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatCommercePrice } from '@/lib/commerce'

type Props = {
  orderNumber: string
  productName: string
  onlineAmount: number
  manualAmount: number
  testModeAllowed: boolean
  stripeAvailable: boolean
}

export function CommerceCheckoutActions({
  orderNumber,
  productName,
  onlineAmount,
  manualAmount,
  testModeAllowed,
  stripeAvailable,
}: Props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<'online' | 'mock' | null>(null)

  async function startOnline(mock = false) {
    setError('')
    setLoading(mock ? 'mock' : 'online')

    try {
      const response = await fetch('/api/payments/online/create-checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderNumber, mock }),
      })
      const payload = (await response.json()) as { url?: string; redirectTo?: string; error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się uruchomić płatności online.')
      }

      window.location.assign(payload.url ?? payload.redirectTo ?? `/oczekiwanie/${encodeURIComponent(orderNumber)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się uruchomić płatności.')
      setLoading(null)
    }
  }

  return (
    <div className="stack-gap top-gap">
      <div className="summary-grid trust-grid">
        <div className="summary-card trust-card tree-backed-card">
          <strong>Płatność online - {formatCommercePrice(onlineAmount)}</strong>
          <span>Karta, Apple Pay, Google Pay lub BLIK online, jeśli bramka go udostępnia. Dostęp nadamy automatycznie po płatności.</span>
          <button
            type="button"
            className="button button-primary big-button"
            onClick={() => startOnline(false)}
            disabled={loading !== null || !stripeAvailable}
          >
            {loading === 'online' ? 'Otwieram checkout...' : 'Zapłać online'}
          </button>
          {!stripeAvailable ? <span className="muted">Stripe/naffy nie jest jeszcze skonfigurowany w środowisku.</span> : null}
        </div>

        <div className="summary-card trust-card tree-backed-card payment-method-card-active">
          <strong>BLIK na telefon - {formatCommercePrice(manualAmount)}</strong>
          <span>
            {manualAmount < onlineAmount
              ? `Oszczędzasz ${formatCommercePrice(onlineAmount - manualAmount)}. `
              : ''}
            Płacisz BLIK-iem na telefon. Dostęp aktywujemy po ręcznym potwierdzeniu.
          </span>
          <Link href={`/platnosc/blik/${encodeURIComponent(orderNumber)}`} className="button button-primary big-button">
            Wybieram BLIK na telefon
          </Link>
        </div>
      </div>

      {testModeAllowed ? (
        <div className="list-card tree-backed-card">
          <strong>Test bez realnej płatności</strong>
          <span>Do sprawdzenia flow: symuluje udaną płatność online, wysyłkę kodu i stronę dostępu.</span>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => startOnline(true)}
            disabled={loading !== null}
          >
            {loading === 'mock' ? 'Symuluję...' : 'Symuluj zakup online'}
          </button>
        </div>
      ) : null}

      {error ? <div className="error-box">{error}</div> : null}

      <div className="disclaimer">
        Zamówienie: <strong>{orderNumber}</strong>. Produkt: <strong>{productName}</strong>.
      </div>
    </div>
  )
}
