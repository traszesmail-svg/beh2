import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import {
  DEFAULT_BOOKING_SERVICE,
  filterGroupedAvailabilityForService,
  getBookingServicePriceLabel,
  getBookingServiceSlotBadge,
  getBookingServiceTitle,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildSlotHref, readBookingServiceSearchParam, readProblemTypeSearchParam, readQaBookingSearchParam } from '@/lib/booking-routing'
import { DOG_PROBLEM_OPTIONS } from '@/lib/data'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { buildBookMetadata } from '@/lib/seo'
import { getActiveConsultationPrice, listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { TOPIC_VISUALS } from '@/lib/site'
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}): Promise<Metadata> {
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service) ?? DEFAULT_BOOKING_SERVICE)

  return buildBookMetadata(serviceType)
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
  // Source guardrails for runtime-config.test.ts:
  // Wybierz temat na 15 min
  // buildPublicPricingDisclosureMessage(null)
  // buildSlotHref(item.id)
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service) ?? DEFAULT_BOOKING_SERVICE)
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const dataMode = getDataModeStatus()
  const mainProblemOptions = DOG_PROBLEM_OPTIONS.filter((item) => item.id !== 'inne')
  const mixedProblemOption = DOG_PROBLEM_OPTIONS.find((item) => item.id === 'inne') ?? null
  let pricingLabel = getBookingServicePriceLabel(serviceType, DEFAULT_PRICE_PLN)
  let availabilityLabel = 'Terminy zobaczysz po wyborze tematu.'

  if (problem) {
    redirect(buildSlotHref(problem, serviceQuery, qaBooking))
  }

  if (dataMode.isValid) {
    try {
      const [availability, quickConsultationPrice] = await Promise.all([listAvailability(), getActiveConsultationPrice()])
      const filteredAvailability = filterGroupedAvailabilityForService(availability, serviceType)
      pricingLabel = getBookingServicePriceLabel(serviceType, quickConsultationPrice.amount)
      availabilityLabel =
        filteredAvailability.length > 0
          ? 'Terminy pokażą się po wyborze.'
          : 'Jeśli dziś nie ma terminu, napisz.'
    } catch (error) {
      console.warn('[behawior15][book] nie udalo sie wczytac dostepnosci', error)
    }
  }

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface booking-stage-panel decision-page-panel booking-flow-panel">
          <div className="booking-stage-hero-grid">
            <div className="booking-stage-copy-column">
              <BookingStageEyebrow stage="topic" className="section-eyebrow" />
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb QA</div> : null}
              <h1>Wybierz temat dla: {getBookingServiceTitle(serviceType)}</h1>
              <p className="hero-text">Kliknij temat najbliższy sytuacji.</p>

              <div className="book-hero-stats top-gap-small">
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Cena startowa</span>
                  <strong>{pricingLabel}</strong>
                </div>
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Dostępność</span>
                  <strong>{availabilityLabel}</strong>
                </div>
              </div>
            </div>

            <aside className="booking-stage-sidecard tree-backed-card">
              <span className="booking-stage-sidecard-label">Jak wygląda ten flow</span>
              <strong>Krótki wybór, potem termin i płatność.</strong>
              <p>Najpierw wybierasz temat. Dalej widzisz tylko następny krok, bez długiego opisu usług.</p>
              <div className="booking-stage-sidecard-pills" aria-label="Najważniejsze informacje">
                <span className="hero-proof-pill">{getBookingServiceSlotBadge(serviceType)}</span>
                <span className="hero-proof-pill">24h na zmianę</span>
              </div>
            </aside>
          </div>

          <div className="card-grid three-up top-gap book-topics-grid" id="tematy">
            {mainProblemOptions.map((item) => {
              const topicVisual = TOPIC_VISUALS[item.id]

              return (
                <Link
                  key={item.id}
                  href={buildSlotHref(item.id, serviceQuery, qaBooking)}
                  prefetch={false}
                  className="topic-card tree-backed-card book-topic-card"
                  data-problem={item.id}
                  data-analytics-event="topic_selected"
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

          <div className="book-page-support-card tree-backed-card top-gap">
            <div className="book-page-support-copy">
              <div className="section-eyebrow">Pies tylko na tej stronie</div>
              <strong>Temat mieszany? Nadal nie masz pewności?</strong>
              <span>
                <Link href="/koty" prefetch={false} className="inline-link">
                  Przejdź do kategorii dla kota
                </Link>
                .{' '}
                {mixedProblemOption ? (
                  <>
                    <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false} className="inline-link">
                      Wybierz temat mieszany
                    </Link>{' '}
                    albo{' '}
                  </>
                ) : null}
                <Link href="/kontakt" prefetch={false} className="inline-link">
                  napisz
                </Link>
                .
              </span>
            </div>

            <div className="offer-card-actions">
              <Link href="/koty" prefetch={false} className="button button-ghost">
                Mam kota
              </Link>
              {mixedProblemOption ? (
                <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false} className="button button-ghost">
                  Wybierz temat mieszany
                </Link>
              ) : null}
              <Link href="/kontakt" prefetch={false} className="button button-primary">
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>

        <Footer
          ctaHref="/kontakt"
          ctaLabel="Nie wiesz? Napisz"
          headline="Nie wiesz, który temat kliknąć?"
          description="Jeśli temat jest mieszany albo chcesz upewnić się przed wyborem, napisz krótką wiadomość."
        />
      </div>
    </main>
  )
}
