'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PaymentActionsProps {
  bookingId: string
  accessToken: string
  paymentMode: 'stripe' | 'mock'
  modeSummary: string
  checkoutBlockedReason?: string | null
}

export function PaymentActions({ bookingId, accessToken, paymentMode, modeSummary, checkoutBlockedReason }: PaymentActionsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loadingMode, setLoadingMode] = useState<'pay' | 'fail' | null>(null)
  const checkoutBlocked = Boolean(checkoutBlockedReason)

  async function handlePayment(mode: 'success' | 'failed') {
    if (checkoutBlocked && mode === 'success') {
      setError(checkoutBlockedReason ?? 'Płatność jest chwilowo niedostępna.')
      return
    }

    setError('')
    setLoadingMode(mode === 'success' ? 'pay' : 'fail')

    try {
      const endpoint = paymentMode === 'stripe' ? '/api/stripe/checkout' : '/api/payments/mock'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          paymentMode === 'stripe'
            ? { bookingId, accessToken }
            : {
                bookingId,
                accessToken,
                outcome: mode,
              },
        ),
      })

      const payload = (await response.json()) as { url?: string; redirectTo?: string; error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Płatność nie mogła zostać uruchomiona.')
      }

      if (payload.url) {
        window.location.href = payload.url
        return
      }

      if (payload.redirectTo) {
        router.push(payload.redirectTo)
        return
      }

      throw new Error('Brak przekierowania po płatności.')
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd płatności.')
      setLoadingMode(null)
    }
  }

  return (
    <div className="stack-gap top-gap">
      {error ? <div className="error-box">{error}</div> : null}

      <div className="list-card accent-outline payment-next-card">
        <strong>Co wydarzy się dalej</strong>
        <span>Po płatności od razu zobaczysz potwierdzenie, link do rozmowy i spokojną instrukcję, jak przygotować się do konsultacji.</span>
      </div>

      <div className="summary-grid trust-grid payment-logo-grid">
        <div className="summary-card trust-card"><strong>Karta lub BLIK</strong><span>Dostępne metody zobaczysz dopiero w bezpiecznym oknie Stripe po kliknięciu przycisku płatności.</span></div>
        <div className="summary-card trust-card"><strong>Szyfrowane okno Stripe</strong><span>Płatność otwiera się poza aplikacją, w bezpiecznym i zgodnym z wymaganiami checkoutcie.</span></div>
        <div className="summary-card trust-card"><strong>Natychmiastowy powrót do potwierdzenia</strong><span>Po płatności wracasz do potwierdzenia terminu, linku do rozmowy i materiałów przygotowawczych.</span></div>
      </div>

      <div className="hero-actions">
        <button
          type="button"
          className="button button-primary big-button"
          onClick={() => handlePayment('success')}
          disabled={loadingMode !== null || checkoutBlocked}
        >
          {loadingMode === 'pay' ? 'Przechodzę do płatności...' : paymentMode === 'stripe' ? 'Przejdź do bezpiecznej płatności' : 'Opłać konsultację'}
        </button>

        {paymentMode === 'mock' ? (
          <button
            type="button"
            className="button button-ghost big-button"
            onClick={() => handlePayment('failed')}
            disabled={loadingMode !== null}
          >
            {loadingMode === 'fail' ? 'Symuluję błąd...' : 'Symuluj nieudaną płatność'}
          </button>
        ) : null}
      </div>

      <div className="disclaimer">
        {checkoutBlocked
          ? checkoutBlockedReason
          : paymentMode === 'stripe'
            ? 'Płatność obsługuje Stripe w bezpiecznym oknie checkout. Po anulowaniu od razu zobaczysz, jak wybrać nowy termin.'
            : modeSummary}
      </div>
    </div>
  )
}
