import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { buildSlotHref, readSearchParam } from '@/lib/booking-routing'
import { Header } from '@/components/Header'
import { PaymentActions } from '@/components/PaymentActions'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { getCustomerEmailDeliveryConfigIssue } from '@/lib/server/notifications'
import { getManualPaymentReference, getPayuOptionStatus, getPublicManualPaymentConfig } from '@/lib/server/payment-options'

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
      console.warn('[behawior15][payment] nie udało się wczytać bookingu do płatności', error)
      flowError = 'Nie udało się wczytać rezerwacji do płatności. Spróbuj ponownie za moment.'
    }
  }

  const bookingPriceLabel = booking ? formatPricePln(booking.amount) : null
  const customerEmailAvailable = booking ? !getCustomerEmailDeliveryConfigIssue(booking.email) : false
  const isConfirmed =
    booking?.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')
  const isWaitingManual =
    booking?.bookingStatus === 'pending_manual_payment' && booking.paymentStatus === 'pending_manual_review'
  const isClosed =
    booking?.bookingStatus === 'cancelled' ||
    booking?.bookingStatus === 'expired' ||
    booking?.paymentStatus === 'failed' ||
    booking?.paymentStatus === 'rejected'

  const postPaymentMaterialsCopy = isConfirmed
    ? 'Na ekranie potwierdzenia możesz już dodać materiał do sprawy.'
    : isWaitingManual
      ? 'Dodawanie materiałów odblokuje się od razu po potwierdzeniu wpłaty.'
      : isClosed
        ? 'Dodawanie materiałów nie jest dostępne dla zamkniętej rezerwacji.'
        : 'Po opłaceniu dodasz nagranie MP4, link do materiału albo krótki opis sytuacji, jeśli chcesz lepiej przygotować rozmowę.'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          <div className="section-eyebrow">
            {isWaitingManual ? 'Czekamy na potwierdzenie wpłaty' : 'Wybór płatności'}
          </div>
          <h1>{isWaitingManual ? 'Wpłata została zgłoszona' : 'Wybierz sposób płatności za szybki pierwszy krok'}</h1>
          <p className="hero-text small-width center-text">
            {isWaitingManual
              ? customerEmailAvailable
                ? 'Sprawdzimy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacona, klient dostanie mail z linkiem do pokoju rozmowy i odblokuje się dalszy etap sprawy.'
                : 'Sprawdzimy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacona, ta strona pokaże pokój rozmowy i dalszy etap sprawy, więc zachowaj ten link.'
              : payuAvailable && manualPayment.isAvailable
                ? 'Możesz wybrać przelew z ręcznym potwierdzeniem do 60 minut albo PayU. Obie opcje pokazują tę samą cenę i prowadzą do tego samego etapu po płatności.'
                : payuAvailable
                  ? 'PayU jest dostępne od razu. Ręczna wpłata wróci, gdy będzie dostępny numer konta do przelewu.'
                  : manualPayment.isAvailable
                    ? 'Chwilowo dostępny jest przelew z ręcznym potwierdzeniem do 60 minut. Po potwierdzeniu płatności przejdziesz do tego samego etapu po zakupie.'
                    : 'Płatność jest chwilowo niedostępna. Napisz wiadomość, a podpowiem najprostszy dalszy krok.'}
          </p>

          {flowError ? (
            <div className="error-box top-gap">{flowError}</div>
          ) : !booking ? (
            <div className="error-box top-gap">
              Ten link do płatności jest nieprawidłowy albo wygasł. Wróć do wyboru tematu i wybierz termin ponownie.
            </div>
          ) : (
            <>
              {cancelled ? (
                <div className="info-box top-gap">
                  Checkout online został przerwany. Możesz wrócić do wyboru metody i dokończyć płatność później.
                </div>
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
                  <div className="summary-value">Szybka konsultacja 15 min</div>
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
                <div className="summary-grid trust-grid">
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>{manualPaymentCopy.summaryTitle}</strong>
                    <span>{manualPaymentCopy.description}</span>
                  </div>
                  {payuAvailable ? (
                    <div className="summary-card trust-card tree-backed-card">
                      <strong>PayU jako druga opcja</strong>
                      <span>BLIK i karta w nowoczesnym checkoutcie, z automatycznym potwierdzeniem po sukcesie.</span>
                    </div>
                  ) : null}
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>Etap po płatności</strong>
                    <span>Po statusie paid zobaczysz potwierdzenie, status SMS i sekcję do dodania materiałów do sprawy.</span>
                  </div>
                </div>

                <div className="list-card tree-backed-card">
                  <strong>Co kupujesz</strong>
                  <span>
                    Kupujesz 15-minutową konsultację głosową online, która ma uporządkować sytuację i pomóc zdecydować, czy ten start wystarczy, czy lepsza będzie dłuższa rozmowa. Po płatności online masz 24 godziny na bezpłatną rezygnację, a zmianę terminu ustalimy przez kontakt w tym samym oknie.
                  </span>
                </div>

                <div className="list-card accent-outline tree-backed-card">
                  <strong>Dodawanie materiałów dopiero po płatności</strong>
                  <span>{postPaymentMaterialsCopy}</span>
                </div>
              </div>

              {isConfirmed ? (
                <div className="hero-actions centered-actions">
                  <Link
                    href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
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
                      href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}&manual=reported`}
                      className="button button-primary big-button"
                    >
                      Odśwież status
                    </Link>
                    <Link
                      href={`/kontakt?service=szybka-konsultacja-15-min&intent=reschedule&bookingId=${encodeURIComponent(booking.id)}`}
                      className="button button-ghost big-button"
                    >
                      Napisz w sprawie zmiany terminu
                    </Link>
                  </div>
                </div>
              ) : isClosed ? (
                <div className="hero-actions centered-actions">
                  <Link href={buildSlotHref(booking.problemType)} prefetch={false} className="button button-primary big-button">
                    Wybierz nowy termin rozmowy
                  </Link>
                </div>
              ) : (
                <PaymentActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  amountLabel={bookingPriceLabel ?? ''}
                  paymentReference={booking.paymentReference ?? getManualPaymentReference(booking.id)}
                  manualAvailable={manualPayment.isAvailable}
                  manualPhoneDisplay={manualPayment.phoneDisplay}
                  manualBankAccountDisplay={manualPayment.bankAccountDisplay}
                  manualAccountName={manualPayment.accountName}
                  manualInstructions={manualPayment.instructions}
                  manualSummary={manualPayment.summary}
                  customerEmailAvailable={customerEmailAvailable}
                  payuAvailable={payuAvailable}
                  payuSummary={payuOption.summary}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
