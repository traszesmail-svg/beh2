import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { CustomerEmailStatusNotice } from '@/components/CustomerEmailStatusNotice'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PaymentActions } from '@/components/PaymentActions'
import { getBookingServiceRoomSummary, getBookingServiceTitle, resolveBookingServiceType } from '@/lib/booking-services'
import { buildSlotHref, readQaBookingSearchParam, readSearchParam } from '@/lib/booking-routing'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { getCustomerEmailDeliveryStatus } from '@/lib/server/notifications'
import {
  getManualPaymentReference,
  getPayuOptionStatus,
  getPublicManualPaymentConfig,
  getQaCheckoutEligibility,
} from '@/lib/server/payment-options'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  const payuOption = getPayuOptionStatus()
  const payuAvailable = payuOption.isAvailable
  const manualPaymentCopy = getManualPaymentDisplayCopy({
    phoneDisplay: manualPayment.phoneDisplay,
    bankAccountDisplay: manualPayment.bankAccountDisplay,
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
      ? 'Na ekranie potwierdzenia możesz już dodać materiały do sprawy.'
      : isWaitingManual
        ? 'Dodawanie materiałów odblokuje się od razu po potwierdzeniu wpłaty.'
        : isClosed
          ? 'Dodawanie materiałów nie jest dostępne dla zamkniętej rezerwacji.'
          : 'Po opłaceniu dodasz nagranie MP4, link do materiału albo krótki opis sytuacji, jeśli chcesz lepiej przygotować rozmowę.'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
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
              eventName="payment_opened"
              params={{
                booking_id: booking.id,
                booking_status: booking.bookingStatus,
                payment_status: booking.paymentStatus,
                qa_booking: qaBooking,
              }}
            />
          ) : null}
          <BookingStageEyebrow stage={isConfirmed ? 'confirmation' : 'payment'} className="section-eyebrow" />
          <div className="status-pill transaction-status-pill">
            {qaBooking ? 'Tryb testowy' : isWaitingManual ? 'Czekamy na potwierdzenie wpłaty' : 'Wybór płatności'}
          </div>
          <h1>{qaBooking ? 'Kontrolowany test płatności' : isWaitingManual ? 'Wpłata została zgłoszona' : 'Wybierz sposób płatności za rezerwację'}</h1>
          <p className="hero-text small-width center-text">
            {qaBooking
              ? 'Ta rezerwacja jest oznaczona jako testowa i przejdzie przez bezpieczną ścieżkę bez realnego obciążenia klienta.'
              : isWaitingManual
                ? customerEmailAvailable
                  ? 'Sprawdzimy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacony, klient dostanie mail z linkiem do pokoju rozmowy i odblokuje się dalszy etap sprawy.'
                  : 'Sprawdzimy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacony, ta strona pokaże pokój rozmowy i dalszy etap sprawy, więc zachowaj ten link.'
                : payuAvailable && manualPayment.isAvailable
                  ? 'Możesz wybrać wpłatę ręczną z potwierdzeniem do 60 minut albo płatność online. Obie opcje pokazują tę samą cenę i prowadzą do tego samego etapu po płatności.'
                  : payuAvailable
                    ? 'Płatność online jest dostępna od razu. Ręczna wpłata wróci, gdy będzie dostępny numer konta do przelewu.'
                    : manualPayment.isAvailable
                      ? 'Obecnie dostępna jest ścieżka wpłaty ręcznej z potwierdzeniem do 60 minut. Po potwierdzeniu płatności przejdziesz do potwierdzenia i linku do pokoju.'
                      : 'Płatność jest chwilowo niedostępna. Napisz wiadomość, a podpowiem najprostszy dalszy krok.'}
          </p>

          {flowError ? (
            <div className="stack-gap top-gap">
              <div className="error-box">
                {flowError}{' '}
                {qaBooking
                  ? 'To jest rezerwacja testowa. Sprawdź TEST_CHECKOUT_ENABLED, allowlistę kontaktu albo użyj akcji „Potwierdź QA” w panelu admina.'
                  : 'Jeśli chcesz, napisz wiadomość i wróć do rezerwacji, gdy będziesz gotowy.'}
              </div>
              <div className="hero-actions">
                <Link href="/book" className="button button-primary big-button">
                  Wróć do rezerwacji
                </Link>
                <Link href="/kontakt" className="button button-ghost">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          ) : !booking ? (
            <div className="stack-gap top-gap">
              <div className="error-box">Ten link do płatności jest nieprawidłowy albo wygasł. Wróć do wyboru tematu, wybierz termin ponownie albo napisz wiadomość.</div>
              <div className="hero-actions">
                <Link href="/book" className="button button-primary big-button">
                  Wróć do wyboru tematu
                </Link>
                <Link href="/kontakt" className="button button-ghost">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          ) : (
            <>
              {cancelled ? <div className="info-box top-gap">Płatność online została przerwana. Możesz wrócić do wyboru metody i dokończyć płatność później.</div> : null}

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
                      <span>Po zakończeniu zobaczysz standardowe potwierdzenie, status płatności i link do pokoju rozmowy.</span>
                    </div>
                  </div>
                ) : (
                  <div className="summary-grid trust-grid">
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>{manualPaymentCopy.summaryTitle}</strong>
                      <span>{manualPaymentCopy.description}</span>
                    </div>
                    {payuAvailable ? (
                      <div className="summary-card trust-card tree-backed-card">
                        <strong>Płatność online jako druga opcja</strong>
                        <span>BLIK i karta w nowoczesnej płatności online, z automatycznym potwierdzeniem po sukcesie.</span>
                      </div>
                    ) : null}
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>Etap po płatności</strong>
                      <span>Po statusie opłacone zobaczysz potwierdzenie, status SMS i sekcję do dodania materiałów do sprawy.</span>
                    </div>
                  </div>
                )}

                <div className="list-card tree-backed-card">
                  <strong>Co kupujesz</strong>
                  <span>
                    {bookingServiceSummary
                      ? `${bookingServiceSummary} Po płatności online masz 24 godziny na bezpłatną rezygnację, a zmianę terminu ustalimy przez kontakt w tym samym oknie.`
                      : 'Po płatności online masz 24 godziny na bezpłatną rezygnację, a zmianę terminu ustalimy przez kontakt w tym samym oknie.'}
                  </span>
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
                      ? `Po potwierdzeniu wyślemy link do pokoju na adres ${booking.email}.`
                      : 'Po potwierdzeniu pokażemy link do pokoju bezpośrednio na stronie potwierdzenia.'}
                  </div>
                  <div className="list-card tree-backed-card">
                    <strong>Zmiana terminu lub rezygnacja</strong>
                    <span>Jeśli w ciągu 24 godzin chcesz zmienić termin albo zrezygnować, napisz do mnie. Przy wpłacie manualnej ustalamy to przez kontakt.</span>
                  </div>
                  <div className="hero-actions centered-actions">
                    <Link
                      href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}&manual=reported${qaBooking ? '&qa=1' : ''}`}
                      className="button button-primary big-button"
                    >
                      Odśwież status
                    </Link>
                    <Link
                      href={`/kontakt?service=${encodeURIComponent(bookingServiceType ?? 'szybka-konsultacja-15-min')}&intent=reschedule&bookingId=${encodeURIComponent(booking.id)}`}
                      className="button button-ghost big-button"
                    >
                      Napisz w sprawie zmiany terminu
                    </Link>
                  </div>
                </div>
              ) : isClosed ? (
                <div className="hero-actions centered-actions">
                  <Link href={buildSlotHref(booking.problemType, bookingServiceType, qaBooking)} prefetch={false} className="button button-primary big-button">
                    Wybierz nowy termin rozmowy
                  </Link>
                  <Link href="/kontakt" className="button button-ghost big-button">
                    Napisz wiadomość
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
                  manualBankAccountDisplay={manualPayment.bankAccountDisplay}
                  manualAccountName={manualPayment.accountName}
                  manualInstructions={manualPayment.instructions}
                  manualSummary={manualPayment.summary}
                  customerEmailAvailable={customerEmailAvailable}
                  payuAvailable={payuAvailable}
                  payuSummary={payuOption.summary}
                  qaBooking={qaBooking}
                  qaEligibility={qaEligibility}
                />
              )}
            </>
          )}
        </section>

        <Footer ctaHref="/kontakt" ctaLabel="Pytanie o płatność" />
      </div>
    </main>
  )
}
