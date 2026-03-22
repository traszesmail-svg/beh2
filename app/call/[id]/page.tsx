import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { CallRoom } from '@/components/CallRoom'
import { Header } from '@/components/Header'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { getProblemLabel } from '@/lib/data'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function CallPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const accessToken = readSearchParam(searchParams?.access)
  const dataMode = getDataModeStatus()
  let booking: Awaited<ReturnType<typeof getBookingForViewer>> = null

  if (dataMode.isValid) {
    try {
      booking = await getBookingForViewer(params.id, accessToken, headers().get('authorization'))
    } catch {
      booking = null
    }
  }

  if (!booking) {
    return (
      <main className="page-wrap">
        <div className="container">
          <Header />
          <section className="panel centered-panel">
            <div className="error-box">Ten link do rozmowy jest nieprawidłowy albo wygasł.</div>
            <div className="hero-actions centered-actions">
              <Link href="/book" className="button button-primary big-button">
                Wróć do rezerwacji
              </Link>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const hasAccess = booking.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        {hasAccess ? (
          <>
            <div className="panel section-panel">
              <div className="section-eyebrow">Twoja rozmowa</div>
              <h2>{getProblemLabel(booking.problemType)}</h2>
              <p className="muted paragraph-gap">To jest podsumowanie sprawy, z którą przychodzisz na rozmowę. W razie potrzeby uzupełnij jeszcze materiały przygotowawcze poniżej.</p>
              <div className="list-card top-gap">
                <strong>Opis zgłoszenia</strong>
                <span>{booking.description}</span>
              </div>
            </div>
            <CallRoom bookingId={booking.id} meetingUrl={booking.meetingUrl} ownerName={booking.ownerName} />
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
          <section className="panel centered-panel">
            <div className="error-box">Dostęp do rozmowy głosowej jest aktywny dopiero po poprawnej płatności.</div>
            <div className="hero-actions centered-actions">
              <Link
                href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                className="button button-primary big-button"
              >
                Wróć do płatności
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
