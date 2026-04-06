import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { CallRoom } from '@/components/CallRoom'
import { Header } from '@/components/Header'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { getBookingServiceTitle, resolveBookingServiceType } from '@/lib/booking-services'
import { getProblemLabel } from '@/lib/data'
import { canEditPreparationMaterials } from '@/lib/preparation'
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
  let flowError: string | null = null

  if (!dataMode.isValid) {
    flowError = 'Pokoj rozmowy chwilowo nie jest dostepny. Sprobuj ponownie za kilka minut.'
  } else {
    try {
      booking = await getBookingForViewer(params.id, accessToken, headers().get('authorization'))
    } catch (error) {
      console.warn('[behawior15][call] failed to load booking', {
        bookingId: params.id,
        hasAccessToken: Boolean(accessToken),
        error,
      })
      flowError = 'Nie udalo sie wczytac pokoju rozmowy. Sprobuj ponownie za moment.'
    }
  }

  if (flowError) {
    return (
      <main className="page-wrap">
        <div className="container">
          <Header />
          <section className="panel centered-panel">
            <div className="stack-gap">
              <div className="error-box">
                {flowError} Jesli chcesz, napisz wiadomość i wroc do rezerwacji, gdy bedzie to wygodniejsze.
              </div>
              <div className="hero-actions centered-actions">
                <Link href="/book" className="button button-primary big-button">
                  Wroc do rezerwacji
                </Link>
                <Link href="/kontakt" className="button button-ghost big-button">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="page-wrap">
        <div className="container">
          <Header />
          <section className="panel centered-panel">
            <div className="stack-gap">
              <div className="error-box">Ten link do rozmowy jest nieprawidlowy albo wygasl.</div>
              <div className="hero-actions centered-actions">
                <Link href="/book" className="button button-primary big-button">
                  Wroc do rezerwacji
                </Link>
                <Link href="/kontakt" className="button button-ghost big-button">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const hasAccess = booking.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')
  const serviceType = resolveBookingServiceType(booking.serviceType, booking.amount)
  const qaBooking = Boolean(booking.qaBooking)

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />

        {hasAccess ? (
          <>
            <div className="panel section-panel">
              <div className="section-eyebrow">Twoja rozmowa</div>
              <h2>{getProblemLabel(booking.problemType)}</h2>
              <p className="muted paragraph-gap">
                {getBookingServiceTitle(serviceType)}. To jest podsumowanie sprawy, z ktora przychodzisz na rozmowe. Jesli po oplaceniu chcesz jeszcze cos doprecyzowac, materialy do sprawy pozostaja ponizej.
              </p>
              <div className="list-card top-gap">
                <strong>Opis zgloszenia</strong>
                <span>{booking.description}</span>
              </div>
            </div>
            <CallRoom
              bookingId={booking.id}
              accessToken={accessToken ?? null}
              meetingUrl={booking.meetingUrl}
              ownerName={booking.ownerName}
              bookingDate={booking.bookingDate}
              bookingTime={booking.bookingTime}
              bookingStatus={booking.bookingStatus}
              serviceType={serviceType}
              qaBooking={qaBooking}
            />
            <PreparationMaterialsCard
              bookingId={booking.id}
              accessToken={accessToken ?? ''}
              canEdit={canEditPreparationMaterials(booking)}
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
            <div className="stack-gap">
              <div className="error-box">Dostep do pokoju rozmowy odblokowuje sie dopiero po statusie paid: po potwierdzeniu wplaty albo po sukcesie PayU.</div>
              <div className="hero-actions centered-actions">
                <Link
                  href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                  className="button button-primary big-button"
                >
                  Wroc do platnosci
                </Link>
                <Link href="/kontakt" className="button button-ghost big-button">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
