import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
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
    redirect('/problem')
  }

  const dataMode = getDataModeStatus()
  const groupedAvailability = dataMode.isValid ? await listAvailability() : []

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-eyebrow">Krok 2 z 6</div>
          <h1>Wybierz termin rozmowy: {getProblemLabel(problem)}</h1>
          <p className="muted paragraph-gap">
            Lista odswieza sie na biezaco. Jesli termin zniknie po chwili, oznacza to, ze zostal wlasnie zajety albo ktos konczy platnosc.
          </p>

          {!dataMode.isValid ? (
            <div className="error-box top-gap">{dataMode.summary}</div>
          ) : groupedAvailability.length === 0 ? (
            <div className="empty-box top-gap">
              W tej chwili nie ma wolnych terminow. Wroc pozniej albo sprawdz ponownie, gdy pojawia sie nowe godziny.
            </div>
          ) : (
            <div className="stack-gap top-gap">
              {groupedAvailability.map((group) => (
                <div key={group.date} className="list-card">
                  <strong>{group.label}</strong>
                  <span>Wybierasz 15-minutowa rozmowe glosowa online.</span>
                  <div className="time-grid top-gap-small">
                    {group.slots.map((slot) => (
                      <Link
                        key={slot.id}
                        href={`/form?problem=${problem}&slotId=${slot.id}`}
                        className="slot-button slot-link"
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
      </div>
    </main>
  )
}
