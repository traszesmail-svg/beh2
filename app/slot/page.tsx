import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import {
  DEFAULT_BOOKING_SERVICE,
  filterGroupedAvailabilityForService,
  getBookingServiceSlotBadge,
  getBookingServiceSlotSummary,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import {
  buildBookHref,
  buildFormHref,
  buildSlotHref,
  readBookingServiceSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
} from '@/lib/booking-routing'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getProblemLabel } from '@/lib/data'
import { listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SlotPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service))
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)

  if (!problem) {
    redirect(buildBookHref(null, serviceQuery, qaBooking))
  }

  const dataMode = getDataModeStatus()
  let groupedAvailability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      groupedAvailability = filterGroupedAvailabilityForService(await listAvailability(), serviceType)
    } catch (error) {
      console.warn('[behawior15][slot] failed to load availability', error)
      publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
    }
  } else {
    publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
  }

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface booking-stage-panel slot-page-panel booking-flow-panel">
          <div className="booking-stage-hero-grid">
            <div className="booking-stage-copy-column">
              <BookingStageEyebrow stage="slot" className="section-eyebrow" />
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb testowy</div> : null}
              <h1>Wybierz termin: {getProblemLabel(problem)}</h1>
              <p className="hero-text">{getBookingServiceSlotSummary(serviceType)} Kliknij godzinę.</p>
            </div>

            <aside className="booking-stage-sidecard tree-backed-card">
              <span className="booking-stage-sidecard-label">Ten etap</span>
              <strong>Najpierw godzina, potem dane do rezerwacji.</strong>
              <p>Po kliknięciu terminu od razu przejdziesz do formularza i wyboru płatności.</p>
              <div className="booking-stage-sidecard-pills" aria-label="Najważniejsze informacje">
                <span className="hero-proof-pill">{getBookingServiceSlotBadge(serviceType)}</span>
                <span className="hero-proof-pill">bez kamery</span>
              </div>
            </aside>
          </div>

          {publicFlowMessage ? (
            <div className="stack-gap top-gap slot-state-stack">
              <div className="info-box">
                {publicFlowMessage} Jeśli temat jest pilny, napisz wiadomość, a wskażę najprostszy dalszy krok.
              </div>
              <div className="hero-actions">
                <Link href={buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                  Spróbuj ponownie
                </Link>
                <Link href={buildBookHref(null, serviceQuery, qaBooking)} prefetch={false} className="button button-ghost">
                  Wróć do tematów
                </Link>
                <Link href="/kontakt" prefetch={false} className="button button-ghost">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          ) : groupedAvailability.length === 0 ? (
            <div className="stack-gap top-gap slot-state-stack">
              <div className="empty-box">Teraz nie ma wolnych terminów dla tej ścieżki. Sprawdź później, wybierz inny temat albo napisz wiadomość.</div>
              <div className="hero-actions">
                <Link href={buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                  Odśwież terminy
                </Link>
                <Link href={buildBookHref(null, serviceQuery, qaBooking)} prefetch={false} className="button button-ghost">
                  Wróć do tematów
                </Link>
                <Link href="/kontakt" prefetch={false} className="button button-ghost">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          ) : (
            <div className="slot-list top-gap">
              {groupedAvailability.map((group) => (
                <div key={group.date} className="slot-day-card tree-backed-card">
                  <div className="slot-day-head">
                    <div className="slot-day-copy">
                      <strong>{group.label}</strong>
                      <span>{getBookingServiceSlotSummary(serviceType)}</span>
                    </div>
                    <span className="slot-day-format">{getBookingServiceSlotBadge(serviceType)}</span>
                  </div>
                  <div className="time-grid">
                    {group.slots.map((slot) => (
                      <Link
                        key={slot.id}
                        href={buildFormHref(problem, slot.id, serviceQuery, qaBooking)}
                        prefetch={false}
                        className="slot-button slot-link"
                        data-slot-id={slot.id}
                        data-slot-problem={problem}
                        aria-label={`Wybierz termin ${group.label} o ${slot.bookingTime} dla tematu ${getProblemLabel(problem)}`}
                        data-analytics-event="slot_selected"
                        data-analytics-location="slot-list"
                        data-analytics-problem={problem}
                        data-analytics-slot={`${group.label} ${slot.bookingTime}`}
                      >
                        {slot.bookingTime}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer
          ctaHref="/kontakt"
          ctaLabel="Potrzebuję pomocy"
          headline="Jeśli żaden termin nie pasuje"
          description="Napisz wiadomość, jeśli potrzebujesz doprecyzować temat albo sprawdzić inny dalszy krok."
        />
      </div>
    </main>
  )
}
