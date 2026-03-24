import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { SelfCancellationActions } from '@/components/SelfCancellationActions'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { canSelfCancelBooking, getRemainingSelfCancellationSeconds } from '@/lib/self-cancellation'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus, getPaymentModeStatus } from '@/lib/server/env'
import { finalizeStripeCheckoutSession } from '@/lib/server/stripe'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const bookingId = readSearchParam(searchParams?.bookingId)
  const accessToken = readSearchParam(searchParams?.access)
  const sessionId = readSearchParam(searchParams?.session_id)
  const dataMode = getDataModeStatus()
  const paymentMode = getPaymentModeStatus()
  let booking: Awaited<ReturnType<typeof getBookingForViewer>> = null
  let flowError: string | null = null

  if (!dataMode.isValid) {
    flowError = 'Potwierdzenie chwilowo nie jest dostępne. Spróbuj ponownie za kilka minut.'
  }

  if (!flowError && bookingId && sessionId && paymentMode.active === 'stripe') {
    try {
      await finalizeStripeCheckoutSession(sessionId)
    } catch {
      // Webhook mógł już zaktualizować booking, więc nie wywalamy całego potwierdzenia.
    }
  }

  if (!flowError && bookingId) {
    try {
      booking = await getBookingForViewer(bookingId, accessToken, headers().get('authorization'))
    } catch {
      flowError = 'Nie udało się wczytać potwierdzenia. Spróbuj ponownie za moment.'
    }
  }

  const isConfirmed =
    booking?.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')
  const isSelfCancelled = booking?.paymentStatus === 'refunded' && booking.bookingStatus === 'cancelled'
  const canSelfCancel = Boolean(booking && accessToken && canSelfCancelBooking(booking))
  const initialRemainingSeconds = booking ? getRemainingSelfCancellationSeconds(booking) : 0

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          {flowError ? (
            <div className="error-box">{flowError}</div>
          ) : booking ? (
            <>
              <div className="success-badge">
                {isSelfCancelled ? 'Zakup anulowany' : isConfirmed ? 'Konsultacja potwierdzona' : 'Sprawdzamy status płatności'}
              </div>
              <h1>
                {isSelfCancelled
                  ? 'Rezerwacja została anulowana'
                  : isConfirmed
                    ? 'Masz potwierdzoną rozmowę głosową'
                    : 'Płatność nie została jeszcze potwierdzona'}
              </h1>
              <p className="hero-text small-width center-text">
                {isSelfCancelled
                  ? 'Termin wrócił do kalendarza, a płatność została cofnięta. Jeśli chcesz, możesz od razu wybrać nowy termin albo wrócić później.'
                  : isConfirmed
                    ? 'Termin jest zapisany, a link do rozmowy audio czeka już przy rezerwacji. Wystarczy wejść kilka minut przed konsultacją i mieć pod ręką najważniejsze obserwacje.'
                    : 'Jeśli przed chwilą opłaciłeś konsultację, odśwież tę stronę za chwilę. Jeśli płatność nie doszła, wróć do płatności i spróbuj ponownie.'}
              </p>

              <div className="summary-grid">
                <div className="summary-card">
                  <div className="stat-label">Temat rozmowy</div>
                  <div className="summary-value">{getProblemLabel(booking.problemType)}</div>
                </div>
                <div className="summary-card">
                  <div className="stat-label">Termin</div>
                  <div className="summary-value">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                </div>
                <div className="summary-card">
                  <div className="stat-label">Kontakt</div>
                  <div className="summary-value">{booking.email}</div>
                </div>
                <div className="summary-card">
                  <div className="stat-label">Kwota</div>
                  <div className="summary-value">{formatPricePln(booking.amount)}</div>
                </div>
              </div>

              {canSelfCancel ? (
                <SelfCancellationActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  initialRemainingSeconds={initialRemainingSeconds}
                />
              ) : null}

              {!isSelfCancelled ? (
                <div className="stack-gap top-gap">
                  <div className="list-card">
                    <strong>Jak przygotować się do rozmowy</strong>
                    <span>Znajdź spokojne miejsce, miej pod ręką najważniejsze obserwacje i przygotuj 1-2 pytania, od których chcesz zacząć. Jeśli chcesz, poniżej dodasz nagranie, link lub notatki.</span>
                  </div>
                  <div className="list-card accent-outline">
                    <strong>Co dalej po 15 minutach</strong>
                    <span>Jeśli sytuacja wymaga szerszej pracy, kolejnym krokiem może być pełna konsultacja, plan pracy, wizyta domowa albo dalsze wsparcie.</span>
                  </div>
                </div>
              ) : (
                <div className="list-card accent-outline top-gap">
                  <strong>Co stało się po anulacji</strong>
                  <span>To anulowanie zwolniło termin i zakończyło ten booking. Jeśli wrócisz do rezerwacji, przejdziesz przez zwykły wybór tematu i nowego slotu.</span>
                </div>
              )}

              <div className="hero-actions centered-actions">
                {isSelfCancelled ? (
                  <Link href="/book" className="button button-primary big-button">
                    Wybierz nowy termin
                  </Link>
                ) : isConfirmed ? (
                  <Link
                    href={`/call/${booking.id}${accessToken ? `?access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Dołącz do rozmowy audio
                  </Link>
                ) : (
                  <Link
                    href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Wróć do płatności
                  </Link>
                )}
                <Link href="/book" className="button button-ghost big-button">
                  Umów kolejny termin
                </Link>
              </div>

              {!isSelfCancelled ? (
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
              ) : null}
            </>
          ) : (
            <>
              <div className="error-box">Ten link do potwierdzenia jest nieprawidłowy albo wygasł.</div>
              <div className="hero-actions centered-actions">
                <Link href="/book" className="button button-primary big-button">
                  Przejdź do rezerwacji
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
