import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getProblemLabel, isProblemType } from '@/lib/data'
import { listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function SlotPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readSearchParam(searchParams?.problem)

  if (!isProblemType(problem)) {
    redirect('/book')
  }

  const dataMode = getDataModeStatus()
  let groupedAvailability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      groupedAvailability = await listAvailability()
    } catch (error) {
      console.warn('[behawior15][slot] nie udało się odczytać dostępnych terminów', error)
      publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
    }
  } else {
    publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <BookingStageEyebrow stage="slot" className="section-eyebrow" />
          <h1>Wybierz termin szybkiej konsultacji: {getProblemLabel(problem)}</h1>
          <p className="muted paragraph-gap">
            Lista odświeża się na bieżąco. Jeśli termin zniknie po chwili, oznacza to, że został właśnie zajęty albo ktoś kończy płatność.
          </p>

          {publicFlowMessage ? (
            <div className="stack-gap top-gap">
              <div className="info-box">{publicFlowMessage}</div>
              <div className="hero-actions">
                <Link href={`/slot?problem=${problem}`} className="button button-primary big-button" aria-label="Spróbuj ponownie wczytać listę terminów">
                  Spróbuj ponownie
                </Link>
                <Link href="/book" className="button button-ghost" aria-label="Wróć do wyboru tematu konsultacji">
                  Wróć do wyboru tematu
                </Link>
              </div>
            </div>
          ) : groupedAvailability.length === 0 ? (
            <div className="stack-gap top-gap">
              <div className="empty-box">
                W tej chwili nie ma wolnych terminów dla tego flow rezerwacji. Sprawdź ponownie za jakiś czas albo wróć do wyboru tematu.
              </div>
              <div className="hero-actions">
                <Link href={`/slot?problem=${problem}`} className="button button-primary big-button" aria-label="Odśwież listę terminów dla wybranego tematu">
                  Odśwież terminy
                </Link>
                <Link href="/book" className="button button-ghost" aria-label="Wróć do wyboru tematu konsultacji">
                  Wróć do wyboru tematu
                </Link>
              </div>
            </div>
          ) : (
            <div className="stack-gap top-gap">
              {groupedAvailability.map((group) => (
                <div key={group.date} className="list-card tree-backed-card">
                  <strong>{group.label}</strong>
                  <span>Wybierasz 15-minutową rozmowę głosową online jako pierwszy etap pracy.</span>
                  <div className="time-grid top-gap-small">
                    {group.slots.map((slot) => (
                      <Link
                        key={slot.id}
                        href={`/form?problem=${problem}&slotId=${slot.id}`}
                        className="slot-button slot-link"
                        aria-label={`Wybierz termin ${group.label} o ${slot.bookingTime} dla tematu ${getProblemLabel(problem)}`}
                        data-analytics-event="slot_select"
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

        <Footer />
      </div>
    </main>
  )
}
