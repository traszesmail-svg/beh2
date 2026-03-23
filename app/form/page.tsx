import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookingForm } from '@/components/BookingForm'
import { Header } from '@/components/Header'
import { formatDateTimeLabel, getProblemLabel, isFutureAvailabilitySlot, isProblemType } from '@/lib/data'
import { getAvailabilitySlot, getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'

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
  const problem = readSearchParam(searchParams?.problem)
  const slotId = readSearchParam(searchParams?.slotId)

  if (!isProblemType(problem) || !slotId) {
    redirect('/book')
  }

  const dataMode = getDataModeStatus()
  let pricing: Awaited<ReturnType<typeof getActiveConsultationPrice>> | null = null
  let slot: Awaited<ReturnType<typeof getAvailabilitySlot>> = null
  let flowError: string | null = null

  if (dataMode.isValid) {
    try {
      ;[pricing, slot] = await Promise.all([getActiveConsultationPrice(), getAvailabilitySlot(slotId)])
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
            <div className="section-eyebrow">Krok 3 z 6</div>
            <h1>Uzupełnij dane do konsultacji</h1>
            <p className="muted paragraph-gap">
              Po zapisaniu formularza termin zostanie tymczasowo zablokowany na czas płatności. Po opłaceniu od razu zobaczysz potwierdzenie i link do rozmowy audio.
            </p>

            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Temat</strong>
                <span>{getProblemLabel(problem)}</span>
              </div>
              <div className="list-card">
                <strong>Termin rozmowy</strong>
                <span>{slot ? formatDateTimeLabel(slot.bookingDate, slot.bookingTime) : 'Termin nie jest już dostępny.'}</span>
              </div>
              <div className="list-card accent-outline">
                <strong>Format</strong>
                <span>15-minutowa konsultacja głosowa online. Kamera nie jest potrzebna.</span>
              </div>
              <div className="list-card">
                <strong>Kwota</strong>
                <span>{pricing?.formattedAmount ?? 'Cena chwilowo niedostępna'} – jedna płatność z góry za całą rozmowę.</span>
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
            ) : activeSlot && pricing ? (
              <>
                <div className="section-eyebrow">Dane do potwierdzenia</div>
                <h2>Formularz konsultacji głosowej</h2>
                <BookingForm
                  problemType={problem}
                  slotId={activeSlot.id}
                  slotLabel={formatDateTimeLabel(activeSlot.bookingDate, activeSlot.bookingTime)}
                  priceLabel={pricing.formattedAmount}
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
      </div>
    </main>
  )
}
