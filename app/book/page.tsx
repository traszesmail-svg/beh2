import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildSlotHref, readProblemTypeSearchParam } from '@/lib/booking-routing'
import { problemOptions } from '@/lib/data'
import { buildPublicPricingDisclosureMessage } from '@/lib/pricing'
import { buildBookMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { TOPIC_VISUALS } from '@/lib/site'
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return buildBookMetadata()
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
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const dataMode = getDataModeStatus()
  const mainProblemOptions = problemOptions.filter((item) => item.id !== 'inne')
  const mixedProblemOption = problemOptions.find((item) => item.id === 'inne') ?? null
  const pricingLabel = buildPublicPricingDisclosureMessage(null)
  let availabilityLabel = 'Terminy zobaczysz po wyborze tematu.'

  if (problem) {
    redirect(buildSlotHref(problem))
  }

  if (dataMode.isValid) {
    try {
      const availability = await listAvailability()
      availabilityLabel =
        availability.length > 0
          ? 'Terminy pokażą się po wyborze.'
          : 'Jeśli dziś nie ma terminu, napisz.'
    } catch (error) {
      console.warn('[behawior15][book] nie udalo sie wczytac dostepnosci', error)
    }
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <BookingStageEyebrow stage="topic" className="section-eyebrow" />
          <h1>Wybierz temat na 15 min</h1>
          <p className="hero-text">Kliknij temat najbliższy sytuacji.</p>
          <div className="topic-selection-note top-gap-small">
            <strong>{availabilityLabel}</strong> {pricingLabel}
          </div>

          <div className="card-grid three-up top-gap book-topics-grid" id="tematy">
            {mainProblemOptions.map((item) => {
              const topicVisual = TOPIC_VISUALS[item.id]

              return (
                <Link
                  key={item.id}
                  href={buildSlotHref(item.id)}
                  prefetch={false}
                  className="topic-card tree-backed-card book-topic-card"
                  data-problem={item.id}
                  data-analytics-event="cta_click"
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
                    <div className="topic-media-overlay" aria-hidden="true" />
                    {item.visualLabel ? <div className="topic-media-badge">{item.visualLabel}</div> : null}
                  </div>
                  <span className="topic-icon-shell">{renderProblemIcon(item.id)}</span>
                  <div className="topic-title">{item.title}</div>
                  <div className="topic-desc">{item.desc}</div>
                  <div className="topic-link">Wybierz temat</div>
                </Link>
              )
            })}
          </div>

          <p className="marketing-note top-gap">
            {mixedProblemOption ? (
              <>
                Temat mieszany?{' '}
                <Link href={buildSlotHref(mixedProblemOption.id)} prefetch={false} className="inline-link">
                  Wybierz inny temat
                </Link>
                .{' '}
              </>
            ) : null}
            Jeśli nadal nie wiesz,{' '}
            <Link href="/kontakt" prefetch={false} className="inline-link">
              napisz
            </Link>
            .
          </p>
        </section>

        <Footer />
      </div>
    </main>
  )
}
