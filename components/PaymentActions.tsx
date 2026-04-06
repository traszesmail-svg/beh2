'use client'

import { useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getManualPaymentDetailCards, getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { HardNavLink } from '@/components/HardNavLink'
import type { QaCheckoutEligibility } from '@/lib/types'

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
  qaBooking?: boolean
  qaEligibility?: QaCheckoutEligibility | null
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
  qaBooking = false,
  qaEligibility = null,
}: PaymentActionsProps) {
  const [error, setError] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const defaultSelectedMethod: SelectedMethod = manualAvailable || !payuAvailable ? 'manual' : 'payu'
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod>(defaultSelectedMethod)
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
  const noPaymentMethodsAvailable = !manualAvailable && !payuAvailable
  const qaAvailable = Boolean(qaBooking && qaEligibility?.isAllowed)

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

      window.location.assign(payload.redirectTo)
    } catch (paymentError) {
      console.error('[behawior15][payment] manual payment submit failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd zgłoszenia wpłaty.')
      setLoadingMethod(null)
    }
  }

  async function handlePayuSubmit() {
    if (!payuAvailable) {
      setError('Płatność online jest chwilowo niedostępna.')
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
        throw new Error(payload.error ?? 'Nie udało się uruchomić płatności online.')
      }

      window.location.href = payload.url
    } catch (paymentError) {
      console.error('[behawior15][payment] payu checkout start failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd checkoutu online.')
      setLoadingMethod(null)
    }
  }

  async function handleQaSubmit() {
    if (!qaAvailable) {
      setError(qaEligibility?.reason ?? qaEligibility?.summary ?? 'Testowy checkout QA jest chwilowo niedostępny.')
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
        throw new Error(payload.error ?? 'Nie udało się uruchomić testowego checkoutu QA.')
      }

      window.location.assign(payload.redirectTo)
    } catch (paymentError) {
      console.error('[behawior15][payment] qa checkout failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd testowego checkoutu QA.')
    } finally {
      setQaLoading(false)
    }
  }

  const manualActive = selectedMethod === 'manual'
  const payuActive = selectedMethod === 'payu'

  if (qaBooking) {
    return (
      <div className="stack-gap top-gap" data-payment-method-selected={qaAvailable ? 'qa' : 'none'}>
        {error ? <div className="error-box">{error}</div> : null}

        <div className="list-card accent-outline payment-next-card tree-backed-card">
          <strong>Kontrolowany checkout QA</strong>
          <span>
            {qaEligibility?.summary ??
              'To jest booking testowy QA. Przejdziesz przez checkout bez realnego obciążenia i bez mieszania z produkcyjną sprzedażą.'}
          </span>
        </div>

        <div className="summary-grid">
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Kwota konsultacji</div>
            <div className="summary-value">{amountLabel}</div>
          </div>
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Referencja QA</div>
            <div className="summary-value payment-reference-value">{qaEligibility?.paymentReference ?? paymentReference}</div>
          </div>
          <div className="summary-card tree-backed-card">
            <div className="stat-label">Potwierdzenie</div>
            <div className="summary-value payment-summary-value">Bez realnej płatności</div>
          </div>
        </div>

        <div className="summary-grid trust-grid">
          <div className="summary-card trust-card tree-backed-card">
            <strong>Jawna flaga QA</strong>
            <span>Ten flow działa tylko dla rezerwacji oznaczonych jako testowe.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>Env gate i allowlista</strong>
            <span>TEST_CHECKOUT_ENABLED oraz allowlista emaili lub telefonów chronią przed publicznym 0 zł.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>Panel admina</strong>
            <span>W panelu masz osobną akcję do ręcznego potwierdzania bookingów QA.</span>
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
              {qaLoading ? 'Uruchamiam testowy checkout QA...' : 'Uruchom testowy checkout QA'}
            </button>
          </div>
        ) : (
          <div className="error-box">
            {qaEligibility?.reason ?? qaEligibility?.summary ?? 'Testowy checkout QA jest chwilowo zablokowany.'}
          </div>
        )}

        <div className="disclaimer">
          Ten flow pozostaje odseparowany od normalnej sprzedaży. Jeśli to ma być test, sprawdź flagę QA, TEST_CHECKOUT_ENABLED i allowlistę kontaktu.
        </div>
      </div>
    )
  }

  if (noPaymentMethodsAvailable) {
    return (
      <div className="stack-gap top-gap" data-payment-method-selected="none">
        {error ? <div className="error-box">{error}</div> : null}

        <div className="list-card accent-outline payment-next-card tree-backed-card">
          <strong>Płatność chwilowo niedostępna</strong>
          <span>Nie udało się teraz włączyć wpłaty ręcznej. Rezerwacja nadal jest zapisana, a następny krok można ustalić bez zgadywania.</span>
        </div>

        <div className="summary-grid trust-grid">
          <div className="summary-card trust-card tree-backed-card">
            <strong>Wpłata ręczna</strong>
            <span>{manualSummary}</span>
          </div>
        </div>

        <div className="list-card tree-backed-card">
          <strong>Co dalej</strong>
          <span>Napisz wiadomość, a wskażę najprostszy dalszy krok albo pomożemy wrócić do płatności, gdy konfiguracja znów będzie gotowa.</span>
        </div>

        <div className="hero-actions">
          <HardNavLink href="/kontakt" className="button button-primary big-button">
            Napisz wiadomość
          </HardNavLink>
          <HardNavLink href="/book" className="button button-ghost">
            Wróć do rezerwacji
          </HardNavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="stack-gap top-gap" data-payment-method-selected={selectedMethod}>
      {error ? <div className="error-box">{error}</div> : null}

        <div className="list-card accent-outline payment-next-card tree-backed-card">
          <strong>Wybierz metodę płatności</strong>
        <span>
          {payuAvailable
            ? manualAvailable
              ? 'Możesz wybrać wpłatę ręczną z potwierdzeniem do 60 minut albo przejść do płatności online, która potwierdzi płatność automatycznie.'
              : 'Ręczna wpłata jest chwilowo niedostępna. Możesz przejść do płatności online, która potwierdzi płatność automatycznie.'
            : manualAvailable
              ? 'Obecnie dostępna jest ścieżka wpłaty ręcznej z potwierdzeniem do 60 minut. Po zgłoszeniu wpłaty przejdziesz do potwierdzenia i linku do pokoju.'
              : 'Płatność jest chwilowo niedostępna. Napisz wiadomość, a podpowiem dalszy krok.'}
        </span>
      </div>

      <div className="payment-method-grid">
        <button
          type="button"
          className={`payment-method-card tree-backed-card ${manualActive ? 'payment-method-card-active' : ''}`}
          data-payment-method="manual"
          onClick={() => {
            if (manualAvailable) {
              setSelectedMethod('manual')
            }
          }}
          disabled={!manualAvailable}
        >
          <div className="payment-method-card-copy">
            <strong>{manualPaymentCopy.selectionTitle}</strong>
            <span>
              {manualAvailable
                ? payuAvailable
                  ? customerEmailAvailable
                    ? 'Przelew albo BLIK na telefon. Po zgłoszeniu wpłaty potwierdzimy ją do 60 minut i wyślemy link do rozmowy.'
                    : 'Przelew albo BLIK na telefon. Po zgłoszeniu wpłaty potwierdzimy ją do 60 minut, a link pokaże się na potwierdzeniu.'
                  : customerEmailAvailable
                    ? 'To dostępna ścieżka wpłaty ręcznej. Po zgłoszeniu wpłaty potwierdzimy ją do 60 minut i wyślemy link do rozmowy.'
                    : 'To dostępna ścieżka wpłaty ręcznej. Po zgłoszeniu wpłaty potwierdzimy ją do 60 minut, a link pokaże się na potwierdzeniu.'
                : 'Ta opcja wróci, gdy numer do wpłaty będzie znowu aktywny. Do tego czasu napisz wiadomość.'}
            </span>
          </div>
          <span className="payment-method-badge">
            {manualAvailable ? (payuAvailable ? 'Do 60 min' : 'Dostępne teraz') : 'Chwilowo niedostępne'}
          </span>
        </button>

        {payuAvailable ? (
          <button
            type="button"
            className={`payment-method-card tree-backed-card ${payuActive ? 'payment-method-card-active' : ''}`}
            data-payment-method="payu"
            onClick={() => setSelectedMethod('payu')}
          >
            <div className="payment-method-card-copy">
              <strong>Zapłać online</strong>
              <span>Płatność online pokaże standardowy checkout z metodami online. Po sukcesie status potwierdzi się automatycznie, a pokój odblokuje się od razu.</span>
            </div>
            <span className="payment-method-badge">Automatyczne potwierdzenie</span>
          </button>
        ) : null}
      </div>

      {!payuAvailable || manualActive ? (
        <div className="stack-gap payment-detail-shell payment-detail-shell-manual">
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
              data-payment-submit="manual"
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
        <div className="stack-gap payment-detail-shell payment-detail-shell-payu">
          <div className="summary-grid trust-grid payment-logo-grid">
            <div className="summary-card trust-card tree-backed-card">
              <strong>BLIK i karta</strong>
              <span>Płatność online pokaże standardowy checkout z metodami online. Cena pozostaje taka sama jak przy wpłacie BLIK/przelewem.</span>
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
            <span>Przejdziesz do płatności online. Po zakończeniu checkoutu wrócisz na potwierdzenie rezerwacji, a pokój odblokuje się automatycznie po statusie paid.</span>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary big-button"
              data-payment-submit="payu"
              onClick={handlePayuSubmit}
              disabled={loadingMethod !== null || !payuAvailable}
            >
              {loadingMethod === 'payu' ? 'Przechodzę do płatności online...' : 'Przejdź do płatności online'}
            </button>
          </div>

          <div className="disclaimer">{payuSummary}</div>
        </div>
      )}
    </div>
  )
}
