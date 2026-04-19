'use client'

import { useState } from 'react'
import { getBookingAnalyticsContextParams } from '@/lib/analytics-schema'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { buildBookHref } from '@/lib/booking-routing'
import { getManualPaymentDetailCards, getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { HardNavLink } from '@/components/HardNavLink'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
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
  manualAvailable,
  manualPhoneDisplay,
  manualPaypalMeDisplay,
  manualPaypalMeHref,
  manualAccountName,
  manualInstructions,
  manualSummary,
  customerEmailAvailable,
  serviceType,
  amount,
  animalType,
  problemType,
  bookingStatus,
  qaBooking = false,
  qaEligibility = null,
}: PaymentActionsProps) {
  const [error, setError] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const [loadingMethod, setLoadingMethod] = useState<'manual' | null>(null)
  const manualPaymentCopy = getManualPaymentDisplayCopy({
    phoneDisplay: manualPhoneDisplay,
    paypalMeDisplay: manualPaypalMeDisplay,
  })
  const manualPaymentDetailCards = getManualPaymentDetailCards({
    phoneDisplay: manualPhoneDisplay,
    paypalMeDisplay: manualPaypalMeDisplay,
    paypalMeHref: manualPaypalMeHref,
    accountName: manualAccountName,
  })
  const quickAudioHref = buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking)
  const qaAvailable = Boolean(qaBooking && qaEligibility?.isAllowed)
  const analyticsContext = getBookingAnalyticsContextParams({
    serviceType,
    quickConsultationPrice: amount,
    animalType,
    problemType,
    bookingStatus,
  })

  async function handleManualSubmit() {
    if (!manualAvailable) {
      setError(manualSummary)
      return
    }

    setError('')
    setLoadingMethod('manual')

    try {
      trackAnalyticsEvent('payment_started', {
        booking_id: bookingId,
        source_page: '/payment',
        ...analyticsContext,
        payment_mode: 'manual',
      })
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
        throw new Error(payload.error ?? 'Nie udało się zgłosić wpłaty.')
      }

      window.location.assign(payload.redirectTo)
    } catch (paymentError) {
      console.error('[behawior15][payment] manual payment submit failed', paymentError)
      setError(paymentError instanceof Error ? paymentError.message : 'Wystąpił błąd zgłoszenia wpłaty.')
      setLoadingMethod(null)
    }
  }

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

  if (!manualAvailable) {
    return (
      <div className="stack-gap top-gap" data-payment-method-selected="none">
        {error ? <div className="error-box">{error}</div> : null}

        <div className="list-card accent-outline payment-next-card tree-backed-card">
          <strong>Płatność chwilowo niedostępna</strong>
          <span>Rezerwacja i dane terminu są zapisane, ale na tym wdrożeniu nie udało się teraz odblokować płatności ręcznej.</span>
        </div>

        <div className="summary-grid trust-grid">
          <div className="summary-card trust-card tree-backed-card">
            <strong>Co dalej</strong>
            <span>Użyj krótkiej wiadomości, a wskażę najprostszy dalszy krok albo pomogę wrócić do płatności, gdy konfiguracja znów będzie gotowa.</span>
          </div>
        </div>

        <div className="hero-actions">
          <HardNavLink href="/kontakt#formularz" className="button button-primary big-button">
            {FUNNEL_CTA_LABELS.contact}
          </HardNavLink>
          <HardNavLink href={quickAudioHref} className="button button-ghost">
            Wróć do rezerwacji
          </HardNavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="stack-gap top-gap" data-payment-method-selected="manual">
      {error ? <div className="error-box">{error}</div> : null}

      <div className="list-card accent-outline payment-next-card tree-backed-card">
        <strong>Wpłata ręczna jest dostępna</strong>
        <span>
          Płatność odbywa się ręcznie. Opłać rezerwację zgodnie z danymi poniżej, a potwierdzenie wpłaty nastąpi po ręcznej weryfikacji.
        </span>
      </div>

      <div className="payment-method-grid">
        <div className="payment-method-card tree-backed-card payment-method-card-active" data-payment-method="manual">
          <div className="payment-method-card-copy">
            <strong>{manualPaymentCopy.selectionTitle}</strong>
            <span>
              {customerEmailAvailable
                ? `Opłać rezerwację zgodnie z danymi poniżej. Po zgłoszeniu wpłaty potwierdzimy ją ręcznie do 60 minut, a szczegóły i ${roomAccessLabel} pokażemy na potwierdzeniu oraz wyślemy mailowo.`
                : `Opłać rezerwację zgodnie z danymi poniżej. Po zgłoszeniu wpłaty potwierdzimy ją ręcznie do 60 minut, a szczegóły i ${roomAccessLabel} pokażemy na potwierdzeniu.`}
            </span>
          </div>
          <span className="payment-method-badge">Dostępne teraz</span>
        </div>
      </div>

      <div className="stack-gap payment-detail-shell payment-detail-shell-manual">
        <div className="list-card tree-backed-card">
          <strong>Jak wygląda ten krok</strong>
          <span>
            1. Opłać rezerwację zgodnie z danymi poniżej. 2. Kliknij przycisk poniżej i zgłoś wpłatę. 3. Po ręcznym potwierdzeniu pokażemy dalszą instrukcję i {roomAccessLabel}.
          </span>
        </div>

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
            <div className="summary-value payment-summary-value">Ręcznie do 60 min</div>
          </div>
        </div>

        <div className="summary-grid trust-grid">
          {manualPaymentDetailCards.map((card) => (
            <div key={card.key} className="summary-card trust-card tree-backed-card">
              <strong>{card.label}</strong>
              {card.href ? (
                <span>
                  <a href={card.href} target="_blank" rel="noreferrer">
                    {card.value}
                  </a>
                </span>
              ) : (
                <span>{card.value}</span>
              )}
            </div>
          ))}
        </div>

        <div className="summary-grid trust-grid">
          <div className="summary-card trust-card tree-backed-card">
            <strong>1. Opłać rezerwację</strong>
            <span>Skorzystaj z danych płatności poniżej i zachowaj tytuł płatności bez zmian.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>2. Zgłoś wpłatę</strong>
            <span>Po wysłaniu wpłaty kliknij przycisk poniżej. Ten ekran od razu przeniesie Cię do potwierdzenia.</span>
          </div>
          <div className="summary-card trust-card tree-backed-card">
            <strong>3. Poczekaj spokojnie na potwierdzenie</strong>
            <span>
          {customerEmailAvailable
                ? `Po akceptacji pokażemy ${roomAccessLabel}, dalszą instrukcję i wyślemy potwierdzenie mailowo.`
                : `Po akceptacji pokażemy ${roomAccessLabel} i dalszą instrukcję na stronie potwierdzenia.`}
            </span>
          </div>
        </div>

        <div className="list-card tree-backed-card">
          <strong>Co stanie się dalej</strong>
          <span>
            {customerEmailAvailable ? (
              <>
                Wyślij płatność z tytułem <strong>{paymentReference}</strong>, kliknij przycisk poniżej i poczekaj na ręczne potwierdzenie do 60 minut. Po akceptacji dostaniesz mail, a na stronie potwierdzenia od razu zobaczysz {roomAccessLabel}.
              </>
            ) : (
              <>
                Wyślij płatność z tytułem <strong>{paymentReference}</strong>, kliknij przycisk poniżej i poczekaj na ręczne potwierdzenie do 60 minut. Po akceptacji zobaczysz aktywne potwierdzenie i {roomAccessLabel} na tej stronie, więc zachowaj ten link.
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
            disabled={loadingMethod !== null}
          >
            {loadingMethod === 'manual' ? 'Zapisuję zgłoszenie wpłaty...' : 'Zgłoś wpłatę i pokaż status'}
          </button>
        </div>

        <div className="disclaimer">
          {manualSummary}{' '}
          {customerEmailAvailable
            ? `Dostęp do ${roomAccessLabel} odblokuje się dopiero po potwierdzeniu wpłaty.`
            : `Zachowaj link do strony potwierdzenia, bo to tam pokażemy ${roomAccessLabel} po potwierdzeniu wpłaty.`}
        </div>
      </div>
    </div>
  )
}

