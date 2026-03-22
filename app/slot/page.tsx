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
    redirect('/book')
  }

  const dataMode = getDataModeStatus()
  let groupedAvailability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      groupedAvailability = await listAvailability()
    } catch {
      publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za kilka minut.'
    }
  } else {
    publicFlowMessage = 'Terminy chwilowo się odświeżają. Spróbuj ponownie za kilka minut.'
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-eyebrow">Krok 2 z 6</div>
          <h1>Wybierz termin rozmowy: {getProblemLabel(problem)}</h1>
          <p className="muted paragraph-gap">
            Lista odświeża się na bieżąco. Jeżeli termin zniknie po chwili, oznacza to, że został właśnie zajęty albo ktoś kończy płatność.
          </p>

          {publicFlowMessage ? (
            <div className="info-box top-gap">{publicFlowMessage}</div>
          ) : groupedAvailability.length === 0 ? (
            <div className="empty-box top-gap">
              W tej chwili nie ma wolnych terminów. Wróć później albo sprawdź ponownie, gdy pojawią się nowe godziny.
            </div>
          ) : (
            <div className="stack-gap top-gap">
              {groupedAvailability.map((group) => (
                <div key={group.date} className="list-card">
                  <strong>{group.label}</strong>
                  <span>Wybierasz 15-minutową rozmowę głosową online.</span>
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
