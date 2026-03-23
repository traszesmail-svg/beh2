import { Header } from '@/components/Header'

export default function SlotLoading() {
  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-eyebrow">Krok 2 z 6</div>
          <h1>Ładuję aktualne terminy rozmowy</h1>
          <div className="info-box top-gap">
            Sprawdzamy dostępność w kalendarzu. Jeśli termin jest wolny, pokażemy go tutaj za chwilę.
          </div>
        </section>
      </div>
    </main>
  )
}
