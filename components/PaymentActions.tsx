'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

interface PaymentActionsProps {
  bookingId: string
  accessToken: string
  paymentMode: 'stripe' | 'mock'
  checkoutBlockedReason?: string | null
}

export function PaymentActions({ bookingId, accessToken, paymentMode, checkoutBlockedReason }: PaymentActionsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loadingMode, setLoadingMode] = useState<'pay' | 'fail' | null>(null)
  const checkoutBlocked = Boolean(checkoutBlockedReason)
  const isMockPayment = paymentMode === 'mock'

  async function handlePayment(mode: 'success' | 'failed') {
    if (checkoutBlocked && mode === 'success') {
      setError(checkoutBlockedReason ?? 'Płatność jest chwilowo niedostępna.')
      return
    }

    setError('')
    setLoadingMode(mode === 'success' ? 'pay' : 'fail')

    if (mode === 'success') {
      trackAnalyticsEvent('payment_start', { payment_mode: paymentMode })
    }

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
        <strong>{isMockPayment ? 'Co wydarzy się po potwierdzeniu testowym' : 'Co wydarzy się dalej'}</strong>
        <span>
          {isMockPayment
            ? 'Po potwierdzeniu testowym od razu zobaczysz potwierdzenie, link do rozmowy i spokojną instrukcję, jak przygotować się do konsultacji bez przechodzenia przez Stripe.'
            : 'Po płatności od razu zobaczysz potwierdzenie, link do rozmowy i spokojną instrukcję, jak przygotować się do konsultacji.'}
        </span>
      </div>

      <div className="summary-grid trust-grid payment-logo-grid">
        {isMockPayment ? (
          <>
            <div className="summary-card trust-card">
              <strong>Stripe jest odłączony</strong>
              <span>To tryb testowy do przejścia całego flow bez realnej bramki płatności.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Ten sam dalszy ekran</strong>
              <span>Po sukcesie zobaczysz dokładnie potwierdzenie, materiały i link do rozmowy, jak po realnym checkoutcie.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Możesz zasymulować błąd</strong>
              <span>Drugi przycisk pozwala sprawdzić, jak zachowuje się flow po nieudanym potwierdzeniu.</span>
            </div>
          </>
        ) : (
          <>
            <div className="summary-card trust-card">
              <strong>Karta lub BLIK</strong>
              <span>Dostępne metody zobaczysz dopiero w bezpiecznym oknie Stripe po kliknięciu przycisku płatności.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Szyfrowane okno Stripe</strong>
              <span>Płatność otwiera się poza aplikacją, w bezpiecznym i zgodnym z wymaganiami checkoutcie.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Natychmiastowy powrót do potwierdzenia</strong>
              <span>Po płatności wracasz do potwierdzenia terminu, linku do rozmowy i materiałów przygotowawczych.</span>
            </div>
          </>
        )}
      </div>

      <div className="hero-actions">
        <button
          type="button"
          className="button button-primary big-button"
          onClick={() => handlePayment('success')}
          disabled={loadingMode !== null || checkoutBlocked}
        >
          {loadingMode === 'pay'
            ? isMockPayment
              ? 'Potwierdzam testowo...'
              : 'Przechodzę do płatności...'
            : isMockPayment
              ? 'Przejdź dalej bez płatności'
              : 'Przejdź do bezpiecznej płatności'}
        </button>

        {isMockPayment ? (
          <button
            type="button"
            className="button button-ghost big-button"
            onClick={() => handlePayment('failed')}
            disabled={loadingMode !== null}
          >
            {loadingMode === 'fail' ? 'Symuluję błąd...' : 'Symuluj nieudane potwierdzenie'}
          </button>
        ) : null}
      </div>

      <div className="disclaimer">
        {checkoutBlocked
          ? checkoutBlockedReason
          : isMockPayment
            ? 'To testowy bypass płatności. Po sukcesie zobaczysz ten sam ekran potwierdzenia, materiały i link do rozmowy co po realnym checkoutcie.'
            : 'Płatność obsługuje Stripe w bezpiecznym oknie checkout. Po anulowaniu od razu zobaczysz, jak wybrać nowy termin.'}
      </div>
    </div>
  )
}
