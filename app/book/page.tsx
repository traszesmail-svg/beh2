import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { formatPricePln, DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { problemOptions } from '@/lib/data'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'
import { ProblemType } from '@/lib/types'

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function renderProblemIcon(problem: ProblemType) {
  switch (problem) {
    case 'szczeniak':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M10 32c0-8.8 6.4-14 14-14s14 5.2 14 14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M17 17l-5-5m19 5l5-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="19" cy="24" r="1.6" fill="currentColor" />
          <circle cx="29" cy="24" r="1.6" fill="currentColor" />
          <path d="M21 29c2.2 1.8 3.8 1.8 6 0" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M13 34c0-9 4.5-15 11-15s11 6 11 15" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 17l-4-7 7 4m6 3l7-4-4 7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <circle cx="21" cy="24" r="1.5" fill="currentColor" />
          <circle cx="27" cy="24" r="1.5" fill="currentColor" />
          <path d="M24 25.5v3.5m-7 0l5-1.5m9 1.5l-5-1.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      )
    case 'separacja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M13 22.5 24 13l11 9.5V35H13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M24 35V25" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M10 36c3-4.3 7.7-6 14-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'agresja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M24 10l12 5v8c0 8.3-4.5 13.6-12 15-7.5-1.4-12-6.7-12-15v-8Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M18 25h12m-9 4h6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'niszczenie':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M15 31c0-6.6 3.8-12 9-12 4.7 0 9 4.2 9 10.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 17c.8-3.4 3-5 6-5 2.8 0 5 1.4 6 4.6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M14 34h20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="m20 26 2 2 6-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'inne':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <path d="M24 18v12m6-6H18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export default async function BookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const problem = readSearchParam(searchParams?.problem)
  let priceLabel = formatPricePln(DEFAULT_PRICE_PLN)

  if (problem) {
    redirect(`/slot?problem=${problem}`)
  }

  if (getDataModeStatus().isValid) {
    try {
      const pricing = await getActiveConsultationPrice()
      priceLabel = pricing.formattedAmount
    } catch {}
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-eyebrow">Rezerwacja</div>
          <h1>Zarezerwuj 15 minut i przejdź do realnie wolnych terminów</h1>
          <p className="hero-text">
            To jest pierwszy krok do 15-minutowej konsultacji. Najpierw wybierasz temat, potem widzisz tylko wolne sloty,
            wypełniasz dane, przechodzisz do płatności i od razu dostajesz potwierdzenie z linkiem do rozmowy.
          </p>

          <div className="summary-grid top-gap">
            <div className="summary-card">
              <div className="stat-label">Format</div>
              <div className="summary-value">15 min</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Terminy</div>
              <div className="summary-value">Realne sloty</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Po płatności</div>
              <div className="summary-value">Potwierdzenie + link</div>
            </div>
          </div>

          <div className="price-context top-gap">
            <strong>{priceLabel}</strong>
            <span>{CONSULTATION_PRICE_COMPARE_COPY}</span>
          </div>

          <div className="list-card accent-outline top-gap">
            <strong>Gwarancja</strong>
            <span>
              Jeśli rozmowa nie pomoże Ci zrozumieć problemu, możesz ubiegać się o zwrot. To ma być użyteczne 15 minut,
              a nie kolejna płatność za chaos.
            </span>
          </div>

          <div className="card-grid three-up top-gap">
            {problemOptions.map((item) => (
              <Link key={item.id} href={`/slot?problem=${item.id}`} className="topic-card">
                <span className="topic-icon-shell">{renderProblemIcon(item.id)}</span>
                <div className="topic-title">{item.title}</div>
                <div className="topic-desc">{item.desc}</div>
                <div className="topic-link">Wybierz ten temat i zarezerwuj termin</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
