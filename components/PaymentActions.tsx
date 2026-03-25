'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

interface PaymentActionsProps {
  bookingId: string
  accessToken: string
  amountLabel: string
  paymentReference: string
  manualAvailable: boolean
  manualPhoneDisplay?: string | null
  manualBankAccountDisplay?: string | null
  manualAccountName?: string | null
  manualInstructions?: string | null
  manualSummary: string
  payuAvailable: boolean
  payuSummary: string
}

type SelectedMethod = 'manual' | 'payu'

export function PaymentActions({
  bookingId,
  accessToken,
  amountLabel,
  paymentReference,
  manualAvailable,
  manualPhoneDisplay,
  manualBankAccountDisplay,
  manualAccountName,
  manualInstructions,
  manualSummary,
  payuAvailable,
  payuSummary,
}: PaymentActionsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>('manual')
  const [loadingMethod, setLoadingMethod] = useState<SelectedMethod | null>(null)

  async function handleManualSubmit() {
    if (!manualAvailable) {
      setError(manualSummary)
      return
    }

    setError('')
    setLoadingMethod('manual')

    try {
      trackAnalyticsEvent('payment_start', { payment_mode: 'manual' })
      const response = await fetch('/api/payments/manual', {
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
        throw new Error(payload.error ?? 'Nie udało się zgłosić płatności.')
      }

      router.push(payload.redirectTo)
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd zgłoszenia wpłaty.')
      setLoadingMethod(null)
    }
  }

  async function handlePayuSubmit() {
    if (!payuAvailable) {
      setError(payuSummary)
      return
    }

    setError('')
    setLoadingMethod('payu')

    try {
      trackAnalyticsEvent('payment_start', { payment_mode: 'payu' })
      const response = await fetch('/api/payments/payu/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          accessToken,
        }),
      })
      const payload = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? 'Nie udało się uruchomić PayU.')
      }

      window.location.href = payload.url
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd checkoutu PayU.')
      setLoadingMethod(null)
    }
  }

  const manualActive = selectedMethod === 'manual'
  const payuActive = selectedMethod === 'payu'

  return (
    <div className="stack-gap top-gap">
      {error ? <div className="error-box">{error}</div> : null}

      <div className="list-card accent-outline payment-next-card tree-backed-card">
        <strong>Wybierz metodę płatności</strong>
        <span>
          Możesz zgłosić prostą wpłatę BLIK/przelewem i poczekać na ręczne potwierdzenie albo przejść do PayU, które potwierdzi płatność automatycznie.
        </span>
      </div>

      <div className="payment-method-grid">
        <button
          type="button"
          className={`payment-method-card tree-backed-card ${manualActive ? 'payment-method-card-active' : ''}`}
          onClick={() => setSelectedMethod('manual')}
        >
          <div className="payment-method-card-copy">
            <strong>BLIK na telefon / przelew</strong>
            <span>Najprostsza opcja. Po kliknięciu „Zapłaciłem” sprawdzimy wpłatę ręcznie i dopiero wtedy wyślemy link do rozmowy.</span>
          </div>
          <span className="payment-method-badge">{manualAvailable ? 'Domyślna opcja' : 'Brak konfiguracji'}</span>
        </button>

        <button
          type="button"
          className={`payment-method-card tree-backed-card ${payuActive ? 'payment-method-card-active' : ''}`}
          onClick={() => setSelectedMethod('payu')}
        >
          <div className="payment-method-card-copy">
            <strong>Zapłać online PayU</strong>
            <span>BLIK i karta w klasycznym checkoutcie. Po sukcesie status zmieni się automatycznie, a pokój odblokuje się od razu.</span>
          </div>
          <span className="payment-method-badge">{payuAvailable ? 'Automatyczne potwierdzenie' : 'Chwilowo niedostępne'}</span>
        </button>
      </div>

      {manualActive ? (
        <div className="stack-gap">
          <div className="summary-grid">
            <div className="summary-card tree-backed-card">
              <div className="stat-label">Kwota</div>
              <div className="summary-value">{amountLabel}</div>
            </div>
            <div className="summary-card tree-backed-card">
              <div className="stat-label">Tytuł płatności</div>
              <div className="summary-value payment-reference-value">{paymentReference}</div>
            </div>
            <div className="summary-card tree-backed-card">
              <div className="stat-label">Potwierdzenie</div>
              <div className="summary-value payment-summary-value">Ręczne</div>
            </div>
          </div>

          <div className="summary-grid trust-grid">
            <div className="summary-card trust-card tree-backed-card">
              <strong>BLIK na telefon</strong>
              <span>{manualPhoneDisplay ?? 'Brak numeru telefonu do BLIK.'}</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Numer konta do przelewu</strong>
              <span>{manualBankAccountDisplay ?? 'Brak numeru konta do przelewu.'}</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Odbiorca</strong>
              <span>{manualAccountName ?? 'Behawior 15'}</span>
            </div>
          </div>

          <div className="list-card tree-backed-card">
            <strong>Co stanie się dalej</strong>
            <span>
              Wyślij wpłatę z tytułem <strong>{paymentReference}</strong>, kliknij przycisk poniżej i poczekaj na ręczne potwierdzenie. Po akceptacji dostaniesz mail z linkiem do pokoju.
            </span>
          </div>

          {manualInstructions ? (
            <div className="list-card tree-backed-card">
              <strong>Dodatkowa instrukcja</strong>
              <span>{manualInstructions}</span>
            </div>
          ) : null}

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary big-button"
              onClick={handleManualSubmit}
              disabled={loadingMethod !== null || !manualAvailable}
            >
              {loadingMethod === 'manual' ? 'Zapisuję zgłoszenie wpłaty...' : 'Zapłaciłem, czekam na potwierdzenie'}
            </button>
          </div>

          <div className="disclaimer">
            {manualSummary} Link do pokoju odblokuje się dopiero po ręcznym potwierdzeniu płatności.
          </div>
        </div>
      ) : (
        <div className="stack-gap">
          <div className="summary-grid trust-grid payment-logo-grid">
            <div className="summary-card trust-card tree-backed-card">
              <strong>BLIK i karta</strong>
              <span>PayU pokaże standardowy checkout z metodami online. Cena pozostaje taka sama jak przy wpłacie ręcznej.</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Automatyczne potwierdzenie</strong>
              <span>Po sukcesie booking przejdzie do statusu paid, a link do pokoju rozmowy odblokuje się bez czekania na ręczną decyzję.</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Ten sam link do pokoju</strong>
              <span>Bez dopłat za metodę płatności i bez osobno pokazywanej prowizji operatora.</span>
            </div>
          </div>

          <div className="list-card tree-backed-card">
            <strong>Co stanie się dalej</strong>
            <span>Przejdziesz do PayU. Po zakończeniu checkoutu wrócisz na potwierdzenie rezerwacji, a pokój odblokuje się po statusie paid.</span>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary big-button"
              onClick={handlePayuSubmit}
              disabled={loadingMethod !== null || !payuAvailable}
            >
              {loadingMethod === 'payu' ? 'Przechodzę do PayU...' : 'Przejdź do PayU'}
            </button>
          </div>

          <div className="disclaimer">{payuSummary}</div>
        </div>
      )}
    </div>
  )
}
