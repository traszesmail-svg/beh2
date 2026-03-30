'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getManualPaymentDetailCards, getManualPaymentDisplayCopy } from '@/lib/manual-payment'

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
  customerEmailAvailable: boolean
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
  customerEmailAvailable,
  payuAvailable,
  payuSummary,
}: PaymentActionsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>('manual')
  const [loadingMethod, setLoadingMethod] = useState<SelectedMethod | null>(null)
  const manualPaymentCopy = getManualPaymentDisplayCopy({
    phoneDisplay: manualPhoneDisplay,
    bankAccountDisplay: manualBankAccountDisplay,
  })
  const manualPaymentDetailCards = getManualPaymentDetailCards({
    phoneDisplay: manualPhoneDisplay,
    bankAccountDisplay: manualBankAccountDisplay,
    accountName: manualAccountName,
  })

  async function handleManualSubmit() {
    if (!manualAvailable) {
      setError(manualSummary)
      return
    }

    setError('')
    setLoadingMethod('manual')

    try {
      trackAnalyticsEvent('payment_started', { payment_mode: 'manual' })
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
      console.error('[behawior15][payment] manual payment submit failed', paymentError)
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
      trackAnalyticsEvent('payment_started', { payment_mode: 'payu' })
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
      console.error('[behawior15][payment] payu checkout start failed', paymentError)
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
          {payuAvailable
            ? 'Możesz zgłosić ręczną wpłatę z potwierdzeniem do 60 minut albo przejść do PayU, które potwierdzi płatność automatycznie.'
            : 'Obecnie dostępna jest ręczna wpłata z potwierdzeniem do 60 minut. Gdy płatność online PayU wróci, pokażemy ją tutaj.'}
        </span>
      </div>

      <div className="payment-method-grid">
        <button
          type="button"
          className={`payment-method-card tree-backed-card ${manualActive ? 'payment-method-card-active' : ''}`}
          onClick={() => setSelectedMethod('manual')}
        >
          <div className="payment-method-card-copy">
            <strong>{manualPaymentCopy.selectionTitle}</strong>
            <span>
              {payuAvailable
                ? customerEmailAvailable
                  ? 'Najprostsza opcja, jeśli chcesz potwierdzić wpłatę ręcznie. Po kliknięciu „Zapłaciłem” sprawdzimy przelew i potwierdzimy go do 60 minut. Wtedy wyślemy link do rozmowy.'
                  : 'Najprostsza opcja, jeśli chcesz potwierdzić wpłatę ręcznie. Po kliknięciu „Zapłaciłem” sprawdzimy przelew i potwierdzimy go do 60 minut. Link do rozmowy i dalsze kroki będą od razu dostępne na stronie potwierdzenia.'
                : customerEmailAvailable
                  ? 'Aktualnie to dostępna metoda płatności. Po kliknięciu „Zapłaciłem” sprawdzimy przelew i potwierdzimy go do 60 minut. Wtedy wyślemy link do rozmowy.'
                  : 'Aktualnie to dostępna metoda płatności. Po kliknięciu „Zapłaciłem” sprawdzimy przelew i potwierdzimy go do 60 minut. Link do rozmowy i dalsze kroki będą od razu dostępne na stronie potwierdzenia.'}
            </span>
          </div>
          <span className="payment-method-badge">
            {manualAvailable ? (payuAvailable ? 'Potwierdzenie do 60 min' : 'Dostępne teraz') : 'Brak konfiguracji'}
          </span>
        </button>

        {payuAvailable ? (
          <button
            type="button"
            className={`payment-method-card tree-backed-card ${payuActive ? 'payment-method-card-active' : ''}`}
            onClick={() => setSelectedMethod('payu')}
          >
            <div className="payment-method-card-copy">
              <strong>Zapłać online PayU</strong>
              <span>BLIK i karta w klasycznym checkoutcie. Po sukcesie status zmieni się automatycznie, a pokój odblokuje się od razu.</span>
            </div>
            <span className="payment-method-badge">Automatyczne potwierdzenie</span>
          </button>
        ) : null}
      </div>

      {!payuAvailable || manualActive ? (
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
              <div className="summary-value payment-summary-value">Do 60 min</div>
            </div>
          </div>

          <div className="summary-grid trust-grid">
            {manualPaymentDetailCards.map((card) => (
              <div key={card.key} className="summary-card trust-card tree-backed-card">
                <strong>{card.label}</strong>
                <span>{card.value}</span>
              </div>
            ))}
          </div>

          <div className="list-card tree-backed-card">
            <strong>Co stanie się dalej</strong>
            <span>
              {customerEmailAvailable ? (
                <>
                  Wyślij wpłatę z tytułem <strong>{paymentReference}</strong>, kliknij przycisk poniżej i poczekaj na potwierdzenie do 60 minut. Po akceptacji dostaniesz mail z linkiem do pokoju.
                </>
              ) : (
                <>
                  Wyślij wpłatę z tytułem <strong>{paymentReference}</strong>, kliknij przycisk poniżej i poczekaj na potwierdzenie do 60 minut. Po akceptacji zobaczysz aktywne potwierdzenie i link do pokoju na tej stronie, więc zachowaj ten link.
                </>
              )}
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
            {manualSummary}{' '}
            {customerEmailAvailable
              ? 'Link do pokoju odblokuje się dopiero po potwierdzeniu płatności.'
              : 'Zachowaj ten link do strony potwierdzenia, bo przy obecnej konfiguracji mailowej to tam pokażemy dostęp do pokoju po potwierdzeniu płatności.'}
          </div>
        </div>
      ) : (
        <div className="stack-gap">
          <div className="summary-grid trust-grid payment-logo-grid">
            <div className="summary-card trust-card tree-backed-card">
              <strong>BLIK i karta</strong>
              <span>PayU pokaże standardowy checkout z metodami online. Cena pozostaje taka sama jak przy wpłacie BLIK/przelewem.</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Automatyczne potwierdzenie</strong>
              <span>Po sukcesie booking przejdzie do statusu paid, a link do pokoju rozmowy odblokuje się bez czekania na dodatkowe potwierdzenie.</span>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Ten sam link do pokoju</strong>
              <span>Bez dopłat za metodę płatności i bez osobno pokazywanej prowizji operatora.</span>
            </div>
          </div>

          <div className="list-card tree-backed-card">
            <strong>Co stanie się dalej</strong>
            <span>Przejdziesz do PayU. Po zakończeniu checkoutu wrócisz na potwierdzenie rezerwacji, a pokój odblokuje się automatycznie po statusie paid.</span>
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
