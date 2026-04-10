import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import {
  DEFAULT_BOOKING_SERVICE,
  filterGroupedAvailabilityForService,
  getBookingServicePrice,
  getBookingServiceSlotBadge,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PriceDisplay } from '@/components/PriceDisplay'
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
    case 'separacja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M13 22.5 24 13l11 9.5V35H13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M24 35V25" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M10 36c3-4.3 7.7-6 14-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'spacer':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M10 29c5.2-6.4 10.6-9.4 18-9.4 4.8 0 8.7 1.6 12 4.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M30 14.5l8.5 2.2-3 7.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M18 18.5l-5.5-3.2 2.2 8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
        </svg>
      )
    case 'pobudzenie':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M24 9 17 23h7l-2 16 10-17h-7Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M12 18c1.7-1.8 3.3-2.6 5.5-2.6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M30.5 12.5c2 0 3.8.8 5.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
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

const BOOK_TOPIC_COPY: Record<string, { title: string; desc: string }> = {
  szczeniak: {
    title: 'Szczeniak i młody pies',
    desc: 'Gryzienie, skakanie, pobudzenie i trudność z wyciszeniem.',
  },
  separacja: {
    title: 'Problemy separacyjne',
    desc: 'Wycie, niszczenie, napięcie przy wyjściu i trudność z zostawaniem samemu.',
  },
  spacer: {
    title: 'Spacer i reakcje',
    desc: 'Ciągnięcie, szczekanie, rzucanie się i trudne mijanki.',
  },
  agresja: {
    title: 'Agresja i obrona zasobów',
    desc: 'Warknięcia, obrona jedzenia, legowiska, zabawek albo przestrzeni.',
  },
  pobudzenie: {
    title: 'Pobudzenie i pogoń',
    desc: 'Nakręcanie się, pogoń za ruchem i trudność z wyhamowaniem.',
  },
  inne: {
    title: 'Inny problem lub temat pokrewny',
    desc: 'Jeśli temat nie pasuje dokładnie do powyższych kategorii.',
  },
}

export default async function BookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service) ?? DEFAULT_BOOKING_SERVICE)
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const dataMode = getDataModeStatus()
  const mainProblemOptions = DOG_PROBLEM_OPTIONS.filter((item) => item.id !== 'inne')
  const mixedProblemOption = DOG_PROBLEM_OPTIONS.find((item) => item.id === 'inne') ?? null
  let pricingAmount = DEFAULT_PRICE_PLN
  let availabilityLabel = 'Terminy zobaczysz po wyborze tematu.'

  if (problem) {
    redirect(buildSlotHref(problem, serviceQuery, qaBooking))
  }

  if (dataMode.isValid) {
    try {
      const [availability, quickConsultationPrice] = await Promise.all([listAvailability(), getActiveConsultationPrice()])
      const filteredAvailability = filterGroupedAvailabilityForService(availability, serviceType)
      pricingAmount = getBookingServicePrice(serviceType, quickConsultationPrice.amount)
      availabilityLabel = filteredAvailability.length > 0 ? 'Terminy pokażą się po wyborze.' : 'Jeśli dziś nie ma terminu, napisz.'
    } catch (error) {
      console.warn('[behawior15][book] nie udało się wczytać dostępności', error)
    }
  } else {
    pricingAmount = getBookingServicePrice(serviceType, DEFAULT_PRICE_PLN)
  }

  return (
    <main
      className="page-wrap marketing-page"
      data-analytics-disabled={qaBooking ? 'true' : undefined}
      data-qa-booking={qaBooking ? 'true' : 'false'}
    >
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface booking-stage-panel decision-page-panel booking-flow-panel">
          <div className="booking-stage-hero-grid">
            <div className="booking-stage-copy-column">
              <BookingStageEyebrow stage="topic" className="section-eyebrow" />
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb testowy</div> : null}
              <h1>Wybierz temat na 15 min</h1>
              <p className="hero-text">Wybierz temat najbliższy sytuacji. Potem pokażę Ci terminy.</p>

              <div className="book-hero-stats top-gap-small">
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Cena startowa</span>
                  <strong>
                    <PriceDisplay amount={pricingAmount} prefix="Od" />
                  </strong>
                </div>
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Dostępność</span>
                  <strong>{availabilityLabel}</strong>
                </div>
              </div>
            </div>

            <aside className="booking-stage-sidecard tree-backed-card">
              <span className="booking-stage-sidecard-label">Następny krok</span>
              <strong>Najpierw wybierasz temat.</strong>
              <p>Potem pokazuję terminy i kolejny krok.</p>
              <div className="booking-stage-sidecard-pills" aria-label="Najważniejsze informacje">
                <span className="hero-proof-pill">{getBookingServiceSlotBadge(serviceType)}</span>
                <span className="hero-proof-pill">24h na zmianę</span>
              </div>
            </aside>
          </div>

          <div className="card-grid three-up top-gap book-topics-grid" id="tematy">
            {mainProblemOptions.map((item) => {
              const topicVisual = TOPIC_VISUALS[item.id]
              const topicCopy = BOOK_TOPIC_COPY[item.id as ProblemType]

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
                  <div className="topic-title">{topicCopy.title}</div>
                  <div className="topic-desc">{topicCopy.desc}</div>
                  <div className="topic-link">Wybierz temat</div>
                </Link>
              )
            })}
          </div>

          <div className="book-page-support-card tree-backed-card top-gap">
            <div className="book-page-support-copy">
              <div className="section-eyebrow">{mixedProblemOption?.title ?? 'Inny problem lub temat pokrewny'}</div>
              <strong>Nie musisz znać dokładnej nazwy problemu.</strong>
              <span>
                {mixedProblemOption ? (
                  <>
                    <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false} className="inline-link">
                      {mixedProblemOption.title}
                    </Link>{' '}
                    albo{' '}
                  </>
                ) : null}
                <Link href="/kontakt" prefetch={false} className="inline-link">
                  napisz wiadomość
                </Link>
                .
              </span>
            </div>

            <div className="offer-card-actions">
              {mixedProblemOption ? (
                <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false} className="button button-ghost">
                  {mixedProblemOption.title}
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
          ctaLabel="Napisz wiadomość"
          headline="Nie widzisz dokładnego tematu?"
          description="Jeśli temat jest szerszy albo chcesz opisać go własnymi słowami, napisz krótką wiadomość."
        />
      </div>
    </main>
  )
}
