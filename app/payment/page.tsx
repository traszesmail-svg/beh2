import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { getBookingAnalyticsContextParams } from '@/lib/analytics-schema'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { CustomerEmailStatusNotice } from '@/components/CustomerEmailStatusNotice'
import { PaymentActions } from '@/components/PaymentActions'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { COPY_HELPERS } from '@/lib/copy-governance'
import {
  getBookingServiceRoomAccessLabel,
  getBookingServiceRoomSummary,
  getBookingServiceTitle,
  resolveBookingServiceType,
} from '@/lib/booking-services'
import { buildBookHref, buildSlotHref, readQaBookingSearchParam, readSearchParam } from '@/lib/booking-routing'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { getCustomerEmailDeliveryStatus } from '@/lib/server/notifications'
import {
  getManualPaymentReference,
  getPublicManualPaymentConfig,
  getQaCheckoutEligibility,
} from '@/lib/server/payment-options'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Płatność i potwierdzenie',
    path: '/payment',
    description: 'Opłać rezerwację ręcznie i przejdź do potwierdzenia statusu.',
    noIndex: false,
    follow: true,
  })
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const bookingId = readSearchParam(searchParams?.bookingId)
  const accessToken = readSearchParam(searchParams?.access)
  const cancelled = readSearchParam(searchParams?.cancelled)
  const qaBookingHint = readQaBookingSearchParam(searchParams?.qa)
  const dataMode = getDataModeStatus()
  const authorizationHeader = headers().get('authorization')
  const manualPayment = getPublicManualPaymentConfig()
  const manualPaymentCopy = getManualPaymentDisplayCopy({
    phoneDisplay: manualPayment.phoneDisplay,
    paypalMeDisplay: manualPayment.paypalMeDisplay,
  })
  let booking: Awaited<ReturnType<typeof getBookingForViewer>> = null
  let flowError: string | null = null

  if (!dataMode.isValid) {
    flowError = getPublicFeatureUnavailableMessage('payment')
  } else if (bookingId) {
    try {
      booking = await getBookingForViewer(bookingId, accessToken, authorizationHeader)
    } catch (error) {
      console.warn('[behawior15][payment] failed to load booking', error)
      flowError = 'Nie udało się wczytać rezerwacji do płatności. Spróbuj ponownie za moment.'
    }
  }

  const qaBooking = Boolean(booking?.qaBooking ?? qaBookingHint)
  const qaEligibility = booking ? getQaCheckoutEligibility(booking) : null

  if (!flowError && qaBooking && qaEligibility && !qaEligibility.isAllowed) {
    flowError = qaEligibility.reason ?? qaEligibility.summary
  }

  const bookingPriceLabel = booking ? formatPricePln(booking.amount) : null
  const bookingServiceType = booking ? resolveBookingServiceType(booking.serviceType, booking.amount) : null
  const bookingServiceTitle = bookingServiceType ? getBookingServiceTitle(bookingServiceType) : null
  const bookingServiceSummary = bookingServiceType ? getBookingServiceRoomSummary(bookingServiceType) : null
  const roomAccessLabel = bookingServiceType ? getBookingServiceRoomAccessLabel(bookingServiceType) : 'pokój rozmowy'
  const quickAudioHref = buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking)
  const customerEmailStatus = booking ? getCustomerEmailDeliveryStatus(booking.email) : null
  const customerEmailAvailable = customerEmailStatus?.state === 'ready'
  const isConfirmed = booking?.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')
  const isWaitingManual = booking?.bookingStatus === 'pending_manual_payment' && booking.paymentStatus === 'pending_manual_review'
  const isClosed =
    booking?.bookingStatus === 'cancelled' ||
    booking?.bookingStatus === 'expired' ||
    booking?.paymentStatus === 'failed' ||
    booking?.paymentStatus === 'rejected'

  const postPaymentMaterialsCopy = qaBooking
    ? 'To jest rezerwacja testowa. Po potwierdzeniu zobaczysz standardowe potwierdzenie bez realnej płatności.'
    : isConfirmed
      ? 'Na ekranie potwierdzenia możesz od razu dodać materiały do sprawy.'
      : isWaitingManual
        ? 'Dodawanie materiałów odblokuje się od razu po potwierdzeniu wpłaty.'
        : isClosed
          ? 'Dodawanie materiałów nie jest dostępne dla zamkniętej rezerwacji.'
          : 'Po opłaceniu możesz dodać nagranie MP4, link do materiału albo krótki opis sytuacji.'

  const heroLead = qaBooking
    ? 'Ta rezerwacja jest testowa i przejdzie przez bezpieczną ścieżkę bez realnego obciążenia klienta.'
    : isWaitingManual
      ? `Wpłata jest już zgłoszona. Potwierdzimy ją ręcznie do 15 minut. Po zmianie statusu zobaczysz ${roomAccessLabel} i dalszą instrukcję.`
      : manualPayment.isAvailable
        ? `Opłać rezerwację i zgłoś wpłatę. Po potwierdzeniu pokażemy ${roomAccessLabel} i dalszą instrukcję.`
        : 'Płatność jest chwilowo niedostępna. Napisz wiadomość i wróć do rezerwacji później.'

  return (
    <NotatnikPageShell
      tag="Platnosc"
      navItems={[
        { href: '/psy', label: 'Pies' },
        { href: '/koty', label: 'Kot' },
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/o-mnie', label: 'O mnie' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={quickAudioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={quickAudioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <div className="container">
        <section
          className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel"
          data-payment-state={
            qaBooking
              ? 'qa-checkout'
              : isConfirmed
                ? 'confirmed'
                : isWaitingManual
                  ? 'pending-manual-review'
                  : isClosed
                    ? 'closed'
                    : 'payment-selection'
          }
          data-analytics-disabled={qaBooking ? 'true' : undefined}
          data-qa-booking={qaBooking ? 'true' : 'false'}
          data-customer-email-state={customerEmailStatus?.state ?? 'unknown'}
        >
          {booking && !flowError ? (
            <AnalyticsEventOnMount
              eventName="payment_viewed"
              params={{
                booking_id: booking.id,
                payment_status: booking.paymentStatus,
                qa_booking: qaBooking,
                source_page: '/payment',
                ...getBookingAnalyticsContextParams({
                  serviceType: bookingServiceType ?? 'szybka-konsultacja-15-min',
                  quickConsultationPrice: booking.amount,
                  animalType: booking.animalType,
                  problemType: booking.problemType,
                  bookingStatus: booking.bookingStatus,
                  paymentMode: booking.paymentMethod ?? 'unknown',
                }),
              }}
            />
          ) : null}
          <BookingStageEyebrow stage={isConfirmed ? 'confirmation' : 'payment'} className="section-eyebrow" />
          <div className="status-pill transaction-status-pill">
            {qaBooking ? 'Tryb testowy' : isWaitingManual ? 'Czekamy na potwierdzenie wpłaty' : 'Wpłata ręczna'}
          </div>
          <h1>{qaBooking ? 'Test płatności' : isWaitingManual ? 'Wpłata została zgłoszona' : 'Opłać rezerwację'}</h1>
          <p className="hero-text small-width center-text">{heroLead}</p>
          {!qaBooking && !isWaitingManual ? <p className="muted top-gap-small">{COPY_HELPERS.paymentNoSales}</p> : null}

          {flowError ? (
            <div className="stack-gap top-gap">
              <div className="error-box">
                {flowError}{' '}
                {qaBooking
                  ? 'To jest rezerwacja testowa. Sprawdź TEST_CHECKOUT_ENABLED, allowlistę kontaktu albo użyj akcji „Potwierdź QA” w panelu admina.'
                  : 'Jeśli chcesz, przejdź do krótkiej wiadomości i wróć do rezerwacji później.'}
              </div>
              <div className="hero-actions">
                <Link href={quickAudioHref} className="button button-primary big-button">
                  Wróć do rezerwacji
                </Link>
                <Link href="/kontakt#formularz" className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </div>
          ) : !booking ? (
            <div className="stack-gap top-gap">
              <div className="error-box">Ten link do płatności jest nieprawidłowy albo wygasł. Wróć do wyboru tematu albo użyj krótkiej wiadomości.</div>
              <div className="hero-actions">
                <Link href={quickAudioHref} className="button button-primary big-button">
                  Wróć do tematów
                </Link>
                <Link href="/kontakt#formularz" className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {cancelled ? <div className="info-box top-gap">Ten etap płatności został przerwany. Możesz wrócić do instrukcji płatności i dokończyć zgłoszenie wpłaty później.</div> : null}

              {!qaBooking && customerEmailStatus && !isClosed ? (
                <CustomerEmailStatusNotice
                  status={customerEmailStatus}
                  recipientEmail={booking.email}
                  context="payment"
                  className="top-gap"
                />
              ) : null}

              {isClosed ? (
                <div className="error-box top-gap">
                  {booking.paymentStatus === 'rejected'
                    ? booking.paymentRejectedReason ?? 'Nie znaleziono wpłaty dla tej rezerwacji.'
                    : 'Ta rezerwacja nie jest już aktywna. Termin wrócił do kalendarza.'}
                </div>
              ) : null}

              <div className="summary-grid top-gap">
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Usługa</div>
                  <div className="summary-value">{bookingServiceTitle ?? 'Konsultacja'}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Temat rozmowy</div>
                  <div className="summary-value">{getProblemLabel(booking.problemType)}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Termin</div>
                  <div className="summary-value">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Kwota</div>
                  <div className="summary-value">{bookingPriceLabel}</div>
                </div>
              </div>

              <div className="stack-gap top-gap">
                {qaBooking ? (
                  <div className="summary-grid trust-grid">
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Kontrolowany test</strong>
                      <span>Ta rezerwacja jest jawnie oznaczona jako testowa i nie trafia do publicznej ścieżki sprzedaży.</span>
                    </div>
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Blokada środowiskowa</strong>
                      <span>TEST_CHECKOUT_ENABLED i allowlista kontaktu odcinają publiczne 0 zł od prawdziwego ruchu.</span>
                    </div>
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Etap po teście</strong>
                      <span>Po zakończeniu zobaczysz potwierdzenie, status płatności i link do pokoju rozmowy.</span>
                    </div>
                  </div>
                ) : (
                  <div className="summary-grid trust-grid">
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>{manualPaymentCopy.summaryTitle}</strong>
                      <span>{manualPaymentCopy.description}</span>
                    </div>
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Szczegóły wpłaty</strong>
                      <span>Dane do wpłaty masz poniżej. Po zgłoszeniu wpłaty potwierdzimy ją ręcznie do 15 minut.</span>
                    </div>
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Po potwierdzeniu</strong>
                      <span>{`Po statusie opłacone zobaczysz potwierdzenie rezerwacji, ${roomAccessLabel} i sekcję materiałów.`}</span>
                    </div>
                  </div>
                )}

                <div className="list-card tree-backed-card">
                  <strong>Co kupujesz</strong>
                  <span>
                    {bookingServiceSummary
                      ? `${bookingServiceSummary} Po ręcznym potwierdzeniu wpłaty masz 24 godziny na bezpłatną rezygnację, a zmianę terminu ustalimy przez krótki kontakt w tym samym oknie.`
                      : 'Po ręcznym potwierdzeniu wpłaty masz 24 godziny na bezpłatną rezygnację, a zmianę terminu ustalimy przez krótki kontakt w tym samym oknie.'}
                  </span>
                </div>

                <div className="summary-grid trust-grid">
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>1. Płatność</strong>
                    <span>Opłacasz rezerwację zgodnie z danymi poniżej i zachowujesz tytuł płatności bez zmian.</span>
                  </div>
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>2. Potwierdzenie</strong>
                    <span>{isWaitingManual ? 'Gdy status wpłaty się zmieni, potwierdzenie od razu pokaże kolejny krok.' : 'Po zgłoszeniu płatności zobaczysz jedno potwierdzenie z terminem, statusem i dalszym krokiem.'}</span>
                  </div>
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>3. Dalszy krok</strong>
                    <span>{`Po statusie opłacone odblokuje się ${roomAccessLabel}, a jeśli chcesz, także sekcja materiałów do sprawy i spokojne przygotowanie w Niezbędniku.`}</span>
                  </div>
                </div>

                <div className="list-card accent-outline tree-backed-card">
                  <strong>{qaBooking ? 'Dodawanie materiałów po teście' : 'Dodawanie materiałów dopiero po płatności'}</strong>
                  <span>{postPaymentMaterialsCopy}</span>
                </div>
              </div>

              {isConfirmed ? (
                <div className="hero-actions centered-actions">
                  <Link
                    href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}${qaBooking ? '&qa=1' : ''}`}
                    className="button button-primary big-button"
                  >
                    Zobacz potwierdzenie
                  </Link>
                </div>
              ) : isWaitingManual ? (
                <div className="stack-gap top-gap">
                  <div className="info-box">
                    Zgłoszenie wpłaty jest zapisane pod tytułem <strong>{booking.paymentReference ?? getManualPaymentReference(booking.id)}</strong>.{' '}
                    {customerEmailAvailable
                      ? `Po potwierdzeniu wyślemy link do ${roomAccessLabel} na adres ${booking.email}.`
                      : `Po potwierdzeniu pokażemy link do ${roomAccessLabel} bezpośrednio na stronie potwierdzenia.`}
                  </div>
                  <div className="list-card tree-backed-card">
                    <strong>Zmiana terminu lub rezygnacja</strong>
                    <span>Jeśli w ciągu 24 godzin chcesz zmienić termin albo zrezygnować, użyj krótkiej wiadomości.</span>
                  </div>
                  <div className="hero-actions centered-actions">
                    <Link
                      href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}&manual=reported${qaBooking ? '&qa=1' : ''}`}
                      className="button button-primary big-button"
                    >
                      Odśwież status
                    </Link>
                    <Link
                      href={`/kontakt?service=${encodeURIComponent(bookingServiceType ?? 'szybka-konsultacja-15-min')}&intent=reschedule&bookingId=${encodeURIComponent(booking.id)}#formularz`}
                      className="button button-ghost big-button"
                    >
                      Zgłoś zmianę terminu
                    </Link>
                  </div>
                </div>
              ) : isClosed ? (
                <div className="hero-actions centered-actions">
                  <Link href={buildSlotHref(booking.problemType, bookingServiceType, qaBooking)} prefetch={false} className="button button-primary big-button">
                    Wybierz nowy termin
                  </Link>
                  <Link href="/kontakt#formularz" className="button button-ghost big-button">
                    {FUNNEL_CTA_LABELS.contact}
                  </Link>
                </div>
              ) : (
              <PaymentActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  amountLabel={bookingPriceLabel ?? ''}
                  paymentReference={
                    booking.paymentReference ??
                    (qaBooking ? qaEligibility?.paymentReference ?? getQaCheckoutEligibility(booking).paymentReference : getManualPaymentReference(booking.id))
                  }
                  manualAvailable={manualPayment.isAvailable}
                  manualPhoneDisplay={manualPayment.phoneDisplay}
                  manualPaypalMeDisplay={null}
                  manualPaypalMeHref={null}
                  manualAccountName={manualPayment.accountName}
                  manualInstructions={manualPayment.instructions}
                  manualSummary={manualPayment.summary}
                  customerEmailAvailable={customerEmailAvailable}
                  serviceType={bookingServiceType ?? 'szybka-konsultacja-15-min'}
                  amount={booking.amount}
                  animalType={booking.animalType}
                  problemType={booking.problemType}
                  bookingStatus={booking.bookingStatus}
                  qaBooking={qaBooking}
                  qaEligibility={qaEligibility}
                  roomAccessLabel={roomAccessLabel}
                />
              )}
            </>
          )}
        </section>

      </div>
    </NotatnikPageShell>
  )
}

