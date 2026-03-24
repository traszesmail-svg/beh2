import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import { problemOptions } from '@/lib/data'
import { buildBookMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { SPECIALIST_NAME, SPECIALIST_PHOTO, SPECIALIST_TRUST_STATEMENT, TOPIC_VISUALS } from '@/lib/site'
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return buildBookMetadata()
}

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
    case 'dogoterapia':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M15 30c0-6 3.6-11 9-11 5.1 0 9 4 9 10.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 18c.6-3.4 2.7-5 6-5 3.2 0 5.2 1.6 6 4.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M16 35c2.2-3 5-4.5 8-4.5s5.8 1.5 8 4.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="m24 22.5 1.8 2.4 2.9-.9-1.8 2.4 1.8 2.4-2.9-.9-1.8 2.4-1.8-2.4-2.9.9 1.8-2.4-1.8-2.4 2.9.9Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
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
  noStore()
  const problem = readSearchParam(searchParams?.problem)
  const dataMode = getDataModeStatus()
  let availabilityLabel = 'Najbliższe realnie dostępne terminy zobaczysz po wyborze tematu konsultacji.'

  if (problem) {
    redirect(`/slot?problem=${problem}`)
  }

  if (dataMode.isValid) {
    try {
      const availability = await listAvailability()
      availabilityLabel =
        availability.length > 0
          ? 'Wolne terminy zobaczysz po wyborze tematu konsultacji.'
          : 'Brak wolnych terminów'
    } catch (error) {
      console.warn('[behawior15][book] nie udało się wczytać dostępności', error)
    }
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="booking-layout">
          <div className="panel section-panel">
            <BookingStageEyebrow stage="topic" className="section-eyebrow" />
            <h1>Zarezerwuj 15 minut i przejdź do realnie wolnych terminów</h1>
            <p className="hero-text">
              Najpierw wybierasz temat, potem widzisz aktualne sloty, wypełniasz dane i przechodzisz do płatności.
              Po opłaceniu od razu dostajesz potwierdzenie z linkiem do rozmowy audio i możliwością dodania materiałów.
            </p>

            <div className="booking-mobile-photo" aria-label="Zdjęcie prowadzącego konsultację">
              <div className="booking-photo-shell booking-photo-shell-mobile top-gap-small">
                <Image
                  src={SPECIALIST_PHOTO.src}
                  alt={SPECIALIST_PHOTO.alt}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 980px) 82vw, 30vw"
                  className="booking-photo"
                  priority
                />
              </div>
            </div>

            <div className="summary-grid top-gap">
              <div className="summary-card">
                <PricingDisclosure
                  stage="pre-topic"
                  labelAs="div"
                  labelClassName="stat-label"
                  messageAs="div"
                  messageClassName="summary-value"
                />
              </div>
              <div className="summary-card">
                <div className="stat-label">Dostępność</div>
                <div className="summary-value">{availabilityLabel}</div>
              </div>
              <div className="summary-card">
                <div className="stat-label">Po płatności</div>
                <div className="summary-value">Potwierdzenie + link</div>
              </div>
            </div>

            <div className="list-card top-gap">
              <PricingDisclosure
                stage="pre-topic"
                labelAs="strong"
                noteClassName="muted top-gap-small"
                compareClassName="price-compare-text"
                showLabel={false}
                showMessage={false}
                showNote
                showCompare
              />
            </div>

            <div className="list-card accent-outline top-gap">
              <strong>Niski próg ryzyka</strong>
              <span>
                Po opłaceniu masz 1 minutę na samodzielną rezygnację przyciskiem anulacji na ekranie potwierdzenia.
                Jeśli zrezygnujesz później albo po rozmowie uznasz, że usługa nie spełniła swojej roli, nadal działa reklamacja lub wniosek o zwrot zgodnie z regulaminem.
              </span>
            </div>

            <div className="list-card top-gap">
              <strong>Dlaczego warto wejść teraz</strong>
              <span>Widzisz tylko realne sloty z terminarza po wyborze tematu. Jeśli termin zniknie, oznacza to po prostu, że nie jest już dostępny.</span>
            </div>

            <div className="card-grid three-up top-gap" id="tematy">
              {problemOptions.map((item) => {
                const topicVisual = TOPIC_VISUALS[item.id]

                return (
                  <Link
                    key={item.id}
                    href={`/slot?problem=${item.id}`}
                    className="topic-card"
                    data-analytics-event="topic_select"
                    data-analytics-location="book-topics"
                    data-analytics-problem={item.id}
                  >
                    <div className="topic-media-shell">
                      <Image
                        src={topicVisual.src}
                        alt={topicVisual.alt}
                        width={1200}
                        height={900}
                        sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
                        className="topic-media-image"
                      />
                    </div>
                    <span className="topic-icon-shell">{renderProblemIcon(item.id)}</span>
                    <div className="topic-title">{item.title}</div>
                    <div className="topic-desc">{item.desc}</div>
                    <div className="topic-link">Wybierz ten temat i zarezerwuj termin</div>
                  </Link>
                )
              })}
            </div>
          </div>

          <aside className="panel side-panel booking-side-panel">
            <div className="section-eyebrow">Prowadzący konsultację</div>
            <div className="booking-photo-shell top-gap-small">
              <Image
                src={SPECIALIST_PHOTO.src}
                alt={SPECIALIST_PHOTO.alt}
                width={1200}
                height={1600}
                sizes="(max-width: 980px) 88vw, 30vw"
                className="booking-photo"
              />
            </div>
            <div className="list-card top-gap">
              <strong>{SPECIALIST_NAME}</strong>
              <span>{SPECIALIST_TRUST_STATEMENT} Jedna rozmowa, jedna osoba i jeden spójny kierunek działania.</span>
            </div>
            <ul className="hero-checklist top-gap">
              <li>Rezerwacja prowadzi do tego samego działającego flow terminów i płatności.</li>
              <li>Po opłaceniu od razu zobaczysz potwierdzenie i wejście do rozmowy.</li>
              <li>Jeśli chcesz, dodasz MP4, link albo notatki jeszcze przed konsultacją.</li>
            </ul>
          </aside>
        </section>

        <Footer />
      </div>
    </main>
  )
}
