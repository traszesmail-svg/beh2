import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { PaymentActions } from '@/components/PaymentActions'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { getManualPaymentConfig, getManualPaymentReference, getPayuOptionStatus } from '@/lib/server/payment-options'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
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
  const dataMode = getDataModeStatus()
  const authorizationHeader = headers().get('authorization')
  const manualPayment = getManualPaymentConfig()
  const payuOption = getPayuOptionStatus()
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
    ? 'Sekcja materialow jest juz gotowa na ekranie potwierdzenia platnosci.'
    : isWaitingManual
      ? 'Sekcja materialow odblokuje sie od razu po potwierdzeniu wplaty.'
      : isClosed
        ? 'Materialy nie sa dostepne dla zamknietej rezerwacji.'
        : 'Nagranie MP4, link do zdjec albo krotki opis sytuacji dodasz dopiero po potwierdzonej platnosci, juz w kontekscie oplaconej sprawy.'

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
              ? 'Sprawdzimy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacona, klient dostanie mail z linkiem do pokoju rozmowy i odblokuje się etap po zakupie.'
              : 'Najpierw zobaczysz prostą wpłatę BLIK/przelewem z potwierdzeniem do 60 minut, a niżej PayU. Obie opcje pokazują tę samą cenę publiczną i prowadzą do tego samego, dopracowanego etapu po płatności.'}
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
                    <strong>BLIK / przelew z potwierdzeniem do 60 min</strong>
                    <span>Najprostszy start: BLIK na telefon albo zwykły przelew z tytułem bookingu.</span>
                  </div>
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>PayU jako druga opcja</strong>
                    <span>BLIK i karta w nowoczesnym checkoutcie, z automatycznym potwierdzeniem po sukcesie.</span>
                  </div>
                  <div className="summary-card trust-card tree-backed-card">
                    <strong>Etap po płatności</strong>
                    <span>Po statusie paid zobaczysz potwierdzenie, status SMS i sekcję do dodania materiałów do sprawy.</span>
                  </div>
                </div>

                <div className="list-card tree-backed-card">
                  <strong>Co kupujesz</strong>
                  <span>
                    15-minutową konsultację głosową online, która ma uporządkować sytuację i pomóc zdecydować, czy wystarczy ten pierwszy krok, czy potrzebna będzie szersza forma pracy. Po płatności online nadal masz 1 minutę na samodzielne anulowanie zakupu.
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
                    Zgłoszenie wpłaty jest zapisane pod tytułem <strong>{booking.paymentReference ?? getManualPaymentReference(booking.id)}</strong>. Po potwierdzeniu wyślemy link do pokoju na adres {booking.email}.
                  </div>
                  <div className="hero-actions centered-actions">
                    <Link
                      href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}&manual=reported`}
                      className="button button-primary big-button"
                    >
                      Odśwież status
                    </Link>
                  </div>
                </div>
              ) : isClosed ? (
                <div className="hero-actions centered-actions">
                  <Link href={`/slot?problem=${booking.problemType}`} className="button button-primary big-button">
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
                  payuAvailable={payuOption.isAvailable}
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
