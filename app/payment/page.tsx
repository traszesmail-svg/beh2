import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { PaymentActions } from '@/components/PaymentActions'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer, markBookingPaymentFailed } from '@/lib/server/db'
import { getPaymentModeStatus } from '@/lib/server/env'
import { isStripeTestMode, MIN_STRIPE_CHECKOUT_AMOUNT_PLN } from '@/lib/server/stripe'

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
  const failed = readSearchParam(searchParams?.failed)
  const cancelled = readSearchParam(searchParams?.cancelled)
  const paymentMode = getPaymentModeStatus()
  const stripeTestMode = paymentMode.active === 'stripe' && isStripeTestMode()
  const authorizationHeader = headers().get('authorization')
  let booking = bookingId ? await getBookingForViewer(bookingId, accessToken, authorizationHeader) : null
  const bookingPriceLabel = booking ? formatPricePln(booking.amount) : null
  const checkoutBlockedReason =
    paymentMode.active === 'stripe' && booking && booking.amount < MIN_STRIPE_CHECKOUT_AMOUNT_PLN
      ? `Stripe Checkout w PLN nie przyjmuje kwot ponizej ${formatPricePln(MIN_STRIPE_CHECKOUT_AMOUNT_PLN)}. Ustaw wyzsza cene konsultacji w panelu specjalisty i zapisz nowa rezerwacje.`
      : null

  if (booking && cancelled && booking.bookingStatus === 'pending' && booking.paymentStatus === 'unpaid') {
    await markBookingPaymentFailed(booking.id)
    booking = await getBookingForViewer(booking.id, accessToken, authorizationHeader)
  }

  if (booking) {
    console.info('[behawior15][pricing] payment-page-amount', {
      bookingId: booking.id,
      displayedAmount: booking.amount,
      displayedAmountLabel: bookingPriceLabel,
      paymentMode: paymentMode.active,
      isStripeTestMode: stripeTestMode,
    })
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          <div className="section-eyebrow">Bezpieczna platnosc online</div>
          <h1>Za chwile przejdziesz do bezpiecznej platnosci</h1>
          <p className="hero-text small-width center-text">
            Platnosc obsluguje zewnetrzna, szyfrowana bramka Stripe. Po jej zakonczeniu wrocisz od razu do potwierdzenia
            rezerwacji, materialow przed rozmowa i linku do konsultacji audio.
          </p>

          {stripeTestMode ? (
            <div className="info-box top-gap">
              To srodowisko testowe platnosci. Karta nie zostanie realnie obciazona poza testowym scenariuszem.
            </div>
          ) : null}

          {!booking ? (
            <div className="error-box top-gap">
              Ten link do platnosci jest nieprawidlowy albo wygasl. Wroc do wyboru tematu i wybierz termin ponownie.
            </div>
          ) : (
            <>
              {(failed || cancelled || booking.paymentStatus === 'failed' || booking.bookingStatus === 'cancelled') && (
                <div className="error-box top-gap">
                  Platnosc nie zostala zakonczona. Termin zostal zwolniony, wiec mozesz spokojnie wybrac nowa godzine rozmowy.
                </div>
              )}

              {checkoutBlockedReason ? <div className="error-box top-gap">{checkoutBlockedReason}</div> : null}

              <div className="summary-grid top-gap">
                <div className="summary-card">
                  <div className="stat-label">Temat rozmowy</div>
                  <div className="summary-value">{getProblemLabel(booking.problemType)}</div>
                </div>
                <div className="summary-card">
                  <div className="stat-label">Termin</div>
                  <div className="summary-value">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                </div>
                <div className="summary-card">
                  <div className="stat-label">Kwota</div>
                  <div className="summary-value">{bookingPriceLabel}</div>
                </div>
              </div>

              <div className="stack-gap top-gap">
                <div className="summary-grid trust-grid">
                  <div className="summary-card trust-card">
                    <span className="trust-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="trust-svg">
                        <path d="M12 3l7 3v5c0 4.9-2.6 8.4-7 10-4.4-1.6-7-5.1-7-10V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="m9.5 12 1.8 1.8 3.8-4.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <strong>Obslugiwane przez Stripe</strong>
                    <span>Platnosc otworzy sie w hosted checkout Stripe, bez przekazywania karty przez aplikacje.</span>
                  </div>
                  <div className="summary-card trust-card">
                    <span className="trust-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="trust-svg">
                        <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M8 10V8a4 4 0 1 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <strong>Szyfrowane polaczenie</strong>
                    <span>Przejscie do platnosci odbywa sie przez bezpieczne, szyfrowane polaczenie.</span>
                  </div>
                  <div className="summary-card trust-card">
                    <span className="trust-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="trust-svg">
                        <path d="M4 8h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M7 15h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <strong>Karta nie jest zapisywana w aplikacji</strong>
                    <span>Dane karty pozostaja po stronie operatora platnosci, a w aplikacji zapisujemy tylko stan bookingu.</span>
                  </div>
                </div>

                <div className="list-card">
                  <strong>Co kupujesz</strong>
                  <span>15-minutowa konsultacja glosowa online, ktora pomaga szybko uporzadkowac problem i wybrac pierwszy sensowny krok bez chaosu i zgadywania.</span>
                </div>
                <div className="list-card">
                  <strong>Co stanie sie po platnosci</strong>
                  <span>Dostaniesz potwierdzenie, link do rozmowy i mozliwosc dodania materialow, jesli chcesz lepiej przygotowac specjaliste przed konsultacja.</span>
                </div>
              </div>

              {!paymentMode.isValid ? (
                <div className="error-box top-gap">{paymentMode.summary}</div>
              ) : booking.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done') ? (
                <div className="hero-actions centered-actions">
                  <Link
                    href={`/confirmation?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Zobacz potwierdzenie
                  </Link>
                </div>
              ) : booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'expired' ? (
                <div className="hero-actions centered-actions">
                  <Link href={`/slot?problem=${booking.problemType}`} className="button button-primary big-button">
                    Wybierz nowy termin rozmowy
                  </Link>
                </div>
              ) : (
                <PaymentActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  paymentMode={paymentMode.active!}
                  modeSummary={paymentMode.summary}
                  checkoutBlockedReason={checkoutBlockedReason}
                />
              )}

              <PreparationMaterialsCard
                bookingId={booking.id}
                accessToken={accessToken ?? ''}
                canEdit={booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed'}
                hasVideo={Boolean(booking.prepVideoPath)}
                prepVideoFilename={booking.prepVideoFilename ?? null}
                prepVideoSizeBytes={booking.prepVideoSizeBytes ?? null}
                prepLinkUrl={booking.prepLinkUrl ?? null}
                prepNotes={booking.prepNotes ?? null}
                prepUploadedAt={booking.prepUploadedAt ?? null}
              />
            </>
          )}
        </section>
      </div>
    </main>
  )
}
