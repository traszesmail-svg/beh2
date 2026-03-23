'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminPricingManagerProps {
  currentAmount: number
  currentLabel: string
  updatedAtLabel?: string | null
}

export function AdminPricingManager({ currentAmount, currentLabel, updatedAtLabel }: AdminPricingManagerProps) {
  const router = useRouter()
  const [amount, setAmount] = useState(currentAmount.toFixed(2))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setAmount(currentAmount.toFixed(2))
  }, [currentAmount])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const payload = (await response.json()) as { error?: string; price?: { amount?: number; formattedAmount?: string } }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się zapisać ceny konsultacji.')
      }

      setAmount(Number(payload.price?.amount ?? amount).toFixed(2))
      setSuccess(`Zapisano nową cenę konsultacji: ${payload.price?.formattedAmount ?? amount}. Nowa kwota obejmie tylko kolejne rezerwacje.`)
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Wystąpił błąd zapisu ceny.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stack-gap top-gap">
      <div className="summary-grid admin-price-grid">
        <div className="summary-card">
          <div className="stat-label">Aktualna cena</div>
          <div className="summary-value">{currentLabel}</div>
          <div className="admin-price-meta">
            {updatedAtLabel ? `Obowiązuje od: ${updatedAtLabel}` : 'Domyślna cena startowa dla nowych rezerwacji.'}
          </div>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label>Nowa cena konsultacji (PLN)</label>
          <input
            type="number"
            min="2"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="np. 69"
            required
          />
        </div>
        <div className="full-width">
          <button type="submit" className="button button-primary big-button" disabled={isSubmitting}>
            {isSubmitting ? 'Zapisuję cenę...' : 'Zapisz nową cenę'}
          </button>
        </div>
      </form>

      <div className="list-card">
        <strong>Jak to działa</strong>
        <span>Zmiana dotyczy tylko nowych rezerwacji. Istniejące bookingi zachowują swoją historyczną kwotę.</span>
      </div>

      {success ? <div className="success-inline">{success}</div> : null}
      {error ? <div className="error-box">{error}</div> : null}
    </div>
  )
}
