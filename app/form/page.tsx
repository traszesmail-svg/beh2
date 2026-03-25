import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { BookingForm } from '@/components/BookingForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import { formatDateTimeLabel, getProblemLabel, isFutureAvailabilitySlot, isProblemType } from '@/lib/data'
import { getAvailabilitySlot } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function FormPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readSearchParam(searchParams?.problem)
  const slotId = readSearchParam(searchParams?.slotId)

  if (!isProblemType(problem) || !slotId) {
    redirect('/book')
  }

  const dataMode = getDataModeStatus()
  let slot: Awaited<ReturnType<typeof getAvailabilitySlot>> = null
  let flowError: string | null = null

  if (dataMode.isValid) {
    try {
      slot = await getAvailabilitySlot(slotId)
    } catch (error) {
      console.warn('[behawior15][form] nie udało się wczytać formularza lub terminu', error)
      flowError = 'Formularz chwilowo się odświeża. Spróbuj ponownie za moment.'
    }
  } else {
    flowError = 'Formularz chwilowo się odświeża. Spróbuj ponownie za moment.'
  }

  const slotIsBookable = slot && !slot.isBooked && !slot.lockedByBookingId && isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)
  const activeSlot = slotIsBookable ? slot : null

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="two-col-section booking-layout">
          <div className="panel section-panel">
            <BookingStageEyebrow stage="details" className="section-eyebrow" />
            <h1>Uzupełnij dane do konsultacji</h1>
            <p className="muted paragraph-gap">
              Po zapisaniu formularza termin zostanie tymczasowo zablokowany. Na kolejnym ekranie wybierzesz prostą wpłatę BLIK/przelewem albo PayU.
            </p>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Temat</strong>
                <span>{getProblemLabel(problem)}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Termin rozmowy</strong>
                <span>{slot ? formatDateTimeLabel(slot.bookingDate, slot.bookingTime) : 'Termin nie jest już dostępny.'}</span>
              </div>
              <div className="list-card accent-outline tree-backed-card">
                <strong>Format</strong>
                <span>15-minutowa konsultacja głosowa online. Kamera nie jest potrzebna.</span>
              </div>
              <div className="list-card tree-backed-card">
                <PricingDisclosure stage="pre-payment" labelAs="strong" />
              </div>
            </div>
          </div>

          <div className="panel section-panel">
            {flowError ? (
              <>
                <div className="info-box">{flowError}</div>
                <div className="hero-actions top-gap">
                  <Link href={`/slot?problem=${problem}`} className="button button-primary big-button">
                    Wróć do terminów
                  </Link>
                </div>
              </>
            ) : activeSlot ? (
              <>
                <div className="section-eyebrow">Dane do potwierdzenia</div>
                <h2>Formularz konsultacji głosowej</h2>
                <BookingForm
                  problemType={problem}
                  slotId={activeSlot.id}
                  slotLabel={formatDateTimeLabel(activeSlot.bookingDate, activeSlot.bookingTime)}
                />
              </>
            ) : (
              <>
                <div className="error-box">Ten termin nie jest już dostępny. Wróć do listy i wybierz inną godzinę rozmowy.</div>
                <div className="hero-actions top-gap">
                  <Link href={`/slot?problem=${problem}`} className="button button-primary big-button">
                    Wróć do terminów
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
