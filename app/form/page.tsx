import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookingForm } from '@/components/BookingForm'
import { Header } from '@/components/Header'
import { formatDateTimeLabel, getProblemLabel, isProblemType } from '@/lib/data'
import { getAvailabilitySlot, getActiveConsultationPrice } from '@/lib/server/db'

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
    redirect('/problem')
  }

  const pricing = await getActiveConsultationPrice()
  const slot = await getAvailabilitySlot(slotId)

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="two-col-section booking-layout">
          <div className="panel section-panel">
            <div className="section-eyebrow">Krok 3 z 6</div>
            <h1>Uzupelnij dane do konsultacji</h1>
            <p className="muted paragraph-gap">
              Po zapisaniu formularza termin zostanie tymczasowo zablokowany na czas platnosci. Po oplaceniu od razu
              zobaczysz potwierdzenie i link do rozmowy audio.
            </p>

            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Temat</strong>
                <span>{getProblemLabel(problem)}</span>
              </div>
              <div className="list-card">
                <strong>Termin rozmowy</strong>
                <span>{slot ? formatDateTimeLabel(slot.bookingDate, slot.bookingTime) : 'Termin nie jest juz dostepny.'}</span>
              </div>
              <div className="list-card accent-outline">
                <strong>Format</strong>
                <span>15-minutowa konsultacja glosowa online. Kamera nie jest potrzebna.</span>
              </div>
              <div className="list-card">
                <strong>Kwota</strong>
                <span>{pricing.formattedAmount} - jedna platnosc z gory za cala rozmowe.</span>
              </div>
            </div>
          </div>

          <div className="panel section-panel">
            {slot && !slot.isBooked && !slot.lockedByBookingId ? (
              <>
                <div className="section-eyebrow">Dane do potwierdzenia</div>
                <h2>Formularz konsultacji glosowej</h2>
                <BookingForm
                  problemType={problem}
                  slotId={slot.id}
                  slotLabel={formatDateTimeLabel(slot.bookingDate, slot.bookingTime)}
                  priceLabel={pricing.formattedAmount}
                />
              </>
            ) : (
              <>
                <div className="error-box">Ten termin nie jest juz dostepny. Wroc do listy i wybierz inna godzine rozmowy.</div>
                <div className="hero-actions top-gap">
                  <Link href={`/slot?problem=${problem}`} className="button button-primary big-button">
                    Wroc do terminow
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
