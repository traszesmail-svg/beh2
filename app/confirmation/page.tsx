import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { Header } from '@/components/Header'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { getBookingForViewer } from '@/lib/server/db'
import { getPaymentModeStatus } from '@/lib/server/env'
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
  const paymentMode = getPaymentModeStatus()

  if (bookingId && sessionId && paymentMode.active === 'stripe') {
    try {
      await finalizeStripeCheckoutSession(sessionId)
    } catch {
      // The webhook may already have handled the update, so we keep the page resilient.
    }
  }

  const booking = bookingId ? await getBookingForViewer(bookingId, accessToken, headers().get('authorization')) : null
  const isConfirmed =
    booking?.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          {booking ? (
            <>
              <div className="success-badge">{isConfirmed ? 'Konsultacja potwierdzona' : 'Sprawdzamy status platnosci'}</div>
              <h1>{isConfirmed ? 'Masz potwierdzona rozmowe glosowa' : 'Platnosc nie zostala jeszcze potwierdzona'}</h1>
              <p className="hero-text small-width center-text">
                {isConfirmed
                  ? 'Termin jest zapisany, a link do rozmowy audio czeka juz przy rezerwacji. Wystarczy wejsc kilka minut przed konsultacja i miec pod reka najwazniejsze obserwacje.'
                  : 'Jesli przed chwila oplaciles konsultacje, odswiez te strone za chwile. Jesli platnosc nie doszla, wroc do platnosci i sprobuj ponownie.'}
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
              </div>

              <div className="stack-gap top-gap">
                <div className="list-card">
                  <strong>Jak przygotowac sie do rozmowy</strong>
                  <span>Znajdz spokojne miejsce, miej pod reka najwazniejsze obserwacje i przygotuj 1-2 pytania, od ktorych chcesz zaczac. Jesli chcesz, ponizej dodasz nagranie, link lub notatki.</span>
                </div>
                <div className="list-card accent-outline">
                  <strong>Co dalej po 15 minutach</strong>
                  <span>Jesli sytuacja wymaga szerszej pracy, kolejnym krokiem moze byc pelna konsultacja, plan pracy, wizyta domowa albo dalsze wsparcie.</span>
                </div>
              </div>

              <div className="hero-actions centered-actions">
                {isConfirmed ? (
                  <Link
                    href={`/call/${booking.id}${accessToken ? `?access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Dolacz do rozmowy audio
                  </Link>
                ) : (
                  <Link
                    href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Wroc do platnosci
                  </Link>
                )}
                <Link href="/problem" className="button button-ghost big-button">
                  Umow kolejny termin
                </Link>
              </div>

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
          ) : (
            <>
              <div className="error-box">Ten link do potwierdzenia jest nieprawidlowy albo wygasl.</div>
              <div className="hero-actions centered-actions">
                <Link href="/problem" className="button button-primary big-button">
                  Przejdz do rezerwacji
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
