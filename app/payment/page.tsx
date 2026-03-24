import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { PaymentActions } from '@/components/PaymentActions'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getBookingForViewer, markBookingPaymentFailed } from '@/lib/server/db'
import { getDataModeStatus, getPaymentModeStatus, getPublicFeatureUnavailableMessage } from '@/lib/server/env'
import { MIN_STRIPE_CHECKOUT_AMOUNT_PLN } from '@/lib/server/stripe'

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
  const dataMode = getDataModeStatus()
  const paymentMode = getPaymentModeStatus()
  const authorizationHeader = headers().get('authorization')
  const isMockPayment = paymentMode.active === 'mock'
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
  const checkoutBlockedReason =
    paymentMode.active === 'stripe' && booking && booking.amount < MIN_STRIPE_CHECKOUT_AMOUNT_PLN
      ? 'Płatność dla tej rezerwacji chwilowo jest niedostępna. Wróć do wyboru terminu i spróbuj ponownie za moment.'
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
    })
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          <div className="section-eyebrow">
            {isMockPayment ? 'Test flow bez bramki płatności' : 'Bezpieczna płatność online'}
          </div>
          <h1>{isMockPayment ? 'Możesz przejść dalej bez płatności' : 'Za chwilę przejdziesz do bezpiecznej płatności'}</h1>
          <p className="hero-text small-width center-text">
            {isMockPayment
              ? 'Stripe jest tutaj celowo odłączony. Ten tryb pozwala przejść cały flow rezerwacji, potwierdzenia, materiałów i linku do rozmowy bez realnego obciążenia karty.'
              : 'Płatność obsługuje zewnętrzna, szyfrowana bramka Stripe. Po jej zakończeniu wrócisz od razu do potwierdzenia rezerwacji, materiałów przed rozmową i linku do konsultacji audio.'}
          </p>

          {flowError ? (
            <div className="error-box top-gap">{flowError}</div>
          ) : !booking ? (
            <div className="error-box top-gap">
              Ten link do płatności jest nieprawidłowy albo wygasł. Wróć do wyboru tematu i wybierz termin ponownie.
            </div>
          ) : (
            <>
              {(failed || cancelled || booking.paymentStatus === 'failed' || booking.bookingStatus === 'cancelled') && (
                <div className="error-box top-gap">
                  {isMockPayment
                    ? 'Testowe potwierdzenie nie zostało zakończone. Termin został zwolniony, więc możesz spokojnie wybrać nową godzinę rozmowy.'
                    : 'Płatność nie została zakończona. Termin został zwolniony, więc możesz spokojnie wybrać nową godzinę rozmowy.'}
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
                  {isMockPayment ? (
                    <>
                      <div className="summary-card trust-card">
                        <strong>Tryb testowy jest aktywny</strong>
                        <span>Na tym etapie nie otwieramy żadnej zewnętrznej bramki płatności.</span>
                      </div>
                      <div className="summary-card trust-card">
                        <strong>Pełny dalszy flow zostaje</strong>
                        <span>Po sukcesie przejdziesz do potwierdzenia, materiałów przygotowawczych i linku do rozmowy.</span>
                      </div>
                      <div className="summary-card trust-card">
                        <strong>Możesz też sprawdzić błąd</strong>
                        <span>Tryb testowy pozwala zasymulować nieudane potwierdzenie i sprawdzić powrót slotu do puli.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="summary-card trust-card">
                        <span className="trust-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" className="trust-svg">
                            <path d="M12 3l7 3v5c0 4.9-2.6 8.4-7 10-4.4-1.6-7-5.1-7-10V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <path d="m9.5 12 1.8 1.8 3.8-4.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <strong>Obsługiwane przez Stripe</strong>
                        <span>Płatność otworzy się w hosted checkout Stripe, bez przekazywania karty przez aplikację.</span>
                      </div>
                      <div className="summary-card trust-card">
                        <span className="trust-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" className="trust-svg">
                            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M8 10V8a4 4 0 1 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </span>
                        <strong>Szyfrowane połączenie</strong>
                        <span>Przejście do płatności odbywa się przez bezpieczne, szyfrowane połączenie.</span>
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
                        <span>Dane karty pozostają po stronie operatora płatności, a w aplikacji zapisujemy tylko stan bookingu.</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="list-card">
                  <strong>{isMockPayment ? 'Co testujesz w tym kroku' : 'Co kupujesz'}</strong>
                  <span>
                    {isMockPayment
                      ? 'Pełny flow od zablokowania terminu do potwierdzenia i linku do rozmowy, tylko bez realnej płatności.'
                      : '15-minutową konsultację głosową online, która pomaga szybko uporządkować problem i wybrać pierwszy sensowny krok bez chaosu i zgadywania.'}
                  </span>
                </div>
                <div className="list-card">
                  <strong>{isMockPayment ? 'Co stanie się po potwierdzeniu testowym' : 'Co stanie się po płatności'}</strong>
                  <span>
                    {isMockPayment
                      ? 'Dostaniesz potwierdzenie, link do rozmowy i możliwość dodania materiałów, tak samo jak w finalnym flow po prawdziwej płatności.'
                      : 'Dostaniesz potwierdzenie, link do rozmowy i możliwość dodania materiałów, jeśli chcesz lepiej przygotować specjalistę przed konsultacją.'}
                  </span>
                </div>
              </div>

              {!paymentMode.isValid ? (
                <div className="error-box top-gap">{getPublicFeatureUnavailableMessage('payment')}</div>
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
