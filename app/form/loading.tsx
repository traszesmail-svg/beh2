import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Header } from '@/components/Header'

export default function FormLoading() {
  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section booking-layout">
          <div className="panel section-panel">
            <BookingStageEyebrow stage="details" className="section-eyebrow" />
            <h1>Ładuję formularz konsultacji</h1>
            <div className="info-box top-gap">
              Sprawdzamy wybrany termin i przygotowujemy formularz, żebyś mógł spokojnie przejść do kolejnego kroku.
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
