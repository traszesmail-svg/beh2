'use client'

import { useState } from 'react'
import type { AnimalType, BookingStatus, ProblemType, QaCheckoutEligibility } from '@/lib/types'
import type { BookingServiceType } from '@/lib/booking-services'

interface PaymentActionsProps {
  bookingId: string
  accessToken: string
  amountLabel: string
  roomAccessLabel: string
  paymentReference: string
  manualAvailable: boolean
  manualPhoneDisplay?: string | null
  manualPaypalMeDisplay?: string | null
  manualPaypalMeHref?: string | null
  manualAccountName?: string | null
  manualInstructions?: string | null
  manualSummary: string
  customerEmailAvailable: boolean
  serviceType: BookingServiceType
  amount: number
  animalType: AnimalType
  problemType: ProblemType
  bookingStatus: BookingStatus
  qaBooking?: boolean
  qaEligibility?: QaCheckoutEligibility | null
}

export function PaymentActions({
  bookingId,
  accessToken,
  amountLabel,
  roomAccessLabel,
  paymentReference,
  qaBooking = false,
  qaEligibility = null,
}: PaymentActionsProps) {
  const [error, setError] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const [commerceLoading, setCommerceLoading] = useState(false)
  const qaAvailable = Boolean(qaBooking && qaEligibility?.isAllowed)

  async function handleQaSubmit() {
    if (!qaAvailable) {
      setError(qaEligibility?.reason ?? qaEligibility?.summary ?? 'Testowa płatność jest chwilowo niedostępna.')
      return
    }

    setError('')
    setQaLoading(true)

    try {
      const response = await fetch('/api/payments/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          accessToken,
        }),
      })
      const payload = (await response.json()) as { redirectTo?: string; error?: string }

      if (!response.ok || !payload.redirectTo) {
        throw new Error(payload.error ?? 'Nie udało się uruchomić testowej płatności.')
      }

      window.location.assign(payload.redirectTo)
    } catch (paymentError) {
      console.error('[behawior15][payment] qa checkout failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd testowej płatności.')
    } finally {
      setQaLoading(false)
    }
  }

  async function handleCommerceCheckout() {
    setError('')
    setCommerceLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'consultation',
          bookingId,
          accessToken,
        }),
      })
      const payload = (await response.json()) as { redirectTo?: string; error?: string }

      if (!response.ok || !payload.redirectTo) {
        throw new Error(payload.error ?? 'Nie udało się przygotować płatności.')
      }

      window.location.assign(payload.redirectTo)
    } catch (paymentError) {
      console.error('[commerce][payment] checkout create failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd przygotowania płatności.')
      setCommerceLoading(false)
    }
  }

  if (qaBooking) {
    return (
      <div className="stack-gap top-gap" data-payment-method-selected={qaAvailable ? 'qa' : 'none'}>
        {error ? <div className="error-box">{error}</div> : null}

        <div className="list-card accent-outline payment-next-card tree-backed-card">
          <strong>Kontrolowany test płatności</strong>
          <span>
            {qaEligibility?.summary ??
              'To jest rezerwacja testowa. Przejdziesz przez płatność bez realnego obciążenia i bez mieszania z produkcyjną sprzedażą.'}
          </span>
        </div>

        <div className="summary-grid">
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Kwota konsultacji</div>
            <div className="summary-value">{amountLabel}</div>
          </div>
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Referencja testowa</div>
            <div className="summary-value payment-reference-value">{qaEligibility?.paymentReference ?? paymentReference}</div>
          </div>
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Potwierdzenie</div>
            <div className="summary-value payment-summary-value">Bez realnej płatności</div>
          </div>
        </div>

        <div className="summary-grid trust-grid">
          <div className="summary-card trust-card tree-backed-card">
            <strong>Jawny tryb testowy</strong>
            <span>Ta ścieżka działa tylko dla rezerwacji oznaczonych jako testowe.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>Blokada środowiskowa</strong>
            <span>TEST_CHECKOUT_ENABLED oraz allowlista kontaktów chronią przed publicznym 0 zł od prawdziwego ruchu.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>Panel admina</strong>
            <span>W panelu masz osobną akcję do ręcznego potwierdzania rezerwacji testowych.</span>
          </div>
        </div>

        {qaAvailable ? (
          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary big-button"
              data-payment-submit="qa"
              onClick={handleQaSubmit}
              disabled={qaLoading}
            >
              {qaLoading ? 'Uruchamiam testową płatność...' : 'Uruchom testową płatność'}
            </button>
          </div>
        ) : (
          <div className="error-box">{qaEligibility?.reason ?? qaEligibility?.summary ?? 'Testowa płatność jest chwilowo zablokowana.'}</div>
        )}

        <div className="disclaimer">
          Ta ścieżka pozostaje odseparowana od normalnej sprzedaży. Jeśli to ma być test, sprawdź flagę QA, TEST_CHECKOUT_ENABLED i allowlistę kontaktu.
        </div>
      </div>
    )
  }

  return (
    <div className="stack-gap top-gap" data-payment-method-selected="commerce">
      {error ? <div className="error-box">{error}</div> : null}

      <div className="list-card accent-outline payment-next-card tree-backed-card">
        <strong>Wybierz metodę płatności</strong>
        <span>
          Przejdziesz do nowego checkoutu: płatność online albo BLIK na telefon. Po potwierdzeniu dostaniesz kod dostępu i link do {roomAccessLabel}.
        </span>
      </div>

      <div className="summary-grid trust-grid">
        <div className="summary-card trust-card tree-backed-card">
          <strong>Płatność online</strong>
          <span>Karta, Apple Pay, Google Pay albo BLIK online, jeśli jest dostępny w bramce. Dostęp po płatności automatycznie.</span>
        </div>
        <div className="summary-card trust-card tree-backed-card payment-method-card-active">
          <strong>BLIK na telefon</strong>
          <span>Tańsza opcja z ręcznym potwierdzeniem. Po kliknięciu „Zapłaciłem/am” dostaję e-mail z przyciskiem potwierdzenia.</span>
        </div>
      </div>

      <div className="hero-actions">
        <button
          type="button"
          className="button button-primary big-button"
          onClick={handleCommerceCheckout}
          disabled={commerceLoading}
        >
          {commerceLoading ? 'Przygotowuję płatność...' : 'Przejdź do płatności'}
        </button>
      </div>
    </div>
  )
}
