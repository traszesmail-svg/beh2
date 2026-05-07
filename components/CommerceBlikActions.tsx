'use client'

import { useState } from 'react'

type Props = {
  orderNumber: string
  phone: string
  maskedPhone: string
}

export function CommerceBlikActions({ orderNumber, phone, maskedPhone }: Props) {
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phone)
      setCopied(true)
    } catch {
      setError('Nie udało się skopiować numeru. Pokaż numer i skopiuj go ręcznie.')
    }
  }

  async function reportPayment() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}/report-payment`, {
        method: 'POST',
      })
      const payload = (await response.json()) as { redirectTo?: string; error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się zgłosić płatności.')
      }

      window.location.assign(payload.redirectTo ?? `/oczekiwanie/${encodeURIComponent(orderNumber)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zgłosić płatności.')
      setLoading(false)
    }
  }

  return (
    <div className="stack-gap">
      <div className="summary-grid">
        <div className="summary-card tree-backed-card">
          <div className="stat-label">Numer telefonu</div>
          <div className="summary-value">{shown ? phone : maskedPhone}</div>
        </div>
        <div className="summary-card tree-backed-card">
          <div className="stat-label">Tytuł przelewu</div>
          <div className="summary-value payment-reference-value">{orderNumber}</div>
        </div>
      </div>

      <div className="hero-actions centered-actions">
        <button type="button" className="button button-ghost big-button" onClick={() => setShown(true)}>
          Pokaż numer
        </button>
        <button type="button" className="button button-ghost big-button" onClick={copyPhone}>
          {copied ? 'Skopiowano' : 'Kopiuj numer'}
        </button>
        <button type="button" className="button button-primary big-button" onClick={reportPayment} disabled={loading}>
          {loading ? 'Wysyłam zgłoszenie...' : 'Zapłaciłem/am'}
        </button>
      </div>

      {error ? <div className="error-box">{error}</div> : null}
    </div>
  )
}
