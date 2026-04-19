import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import {
  DEFAULT_BOOKING_SERVICE,
  type BookingServiceType,
  filterGroupedAvailabilityForService,
  getBookingServicePrice,
  getBookingServiceTitle,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { BookingServiceInfoCard } from '@/components/BookingServiceInfoCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PriceDisplay } from '@/components/PriceDisplay'
import {
  buildBookHref,
  buildSlotHref,
  readBookingServiceSearchParam,
  readBookingSpeciesSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
  type BookingSpecies,
} from '@/lib/booking-routing'
import { CAT_PROBLEM_OPTIONS, DOG_PROBLEM_OPTIONS } from '@/lib/data'
import { FUNNEL_CTA_LABELS, FUNNEL_SERVICE_CONFIG } from '@/lib/funnel'
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
    case 'kot-wokalizacja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M24 9 17 23h7l-2 16 10-17h-7Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M12 18c1.7-1.8 3.3-2.6 5.5-2.6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M30.5 12.5c2 0 3.8.8 5.5 2.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'agresja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M11 31c2.2-8 7.1-12 13-12s10.8 4 13 12" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M16 18.2 12 13m20 5.2 4-5.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18.5 31.5h11" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot-kuweta':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M11 31h26l-2.2 6H13.2Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M14 18h20l3 13H11Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M18 13h12" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot-wycofanie':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M12 28c2.6-8.8 8.2-13.2 12-13.2 6 0 12 5.6 12 14.7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 18 14 13m16 5 4-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 32c1.8 1.4 3.9 2.1 6 2.1 2.2 0 4.3-.7 6.2-2.1" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot-konflikt':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M10 29c2.5-7.4 6.8-11 12-11 3.8 0 7 2.2 9 6.7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M38 29c-2.5-7.4-6.8-11-12-11-3.8 0-7 2.2-9 6.7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M20 15 16 10m12 5 4-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot-zmiany-w-domu':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M12 22.5 24 12l12 10.5V35H12Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M24 35V25" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M34 15.5 38 11.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
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

const SPECIES_CARDS: Record<BookingSpecies, { title: string; summary: string; bullets: string[] }> = {
  pies: {
    title: 'Pies',
    summary: 'Wybierz psa, żeby zobaczyć tematy i terminy właściwe dla spraw psich.',
    bullets: ['Szczeniak / młody pies', 'Spacer i reaktywność', 'Separacja', 'Pobudzenie / wyciszenie', 'Agresja / zasoby'],
  },
  kot: {
    title: 'Kot',
    summary: 'Wybierz kota, żeby zobaczyć tematy i terminy właściwe dla spraw kocich.',
    bullets: ['Kuweta', 'Wycofanie / napięcie', 'Konflikt między kotami', 'Zmiany w domu', 'Wokalizacja / pobudzenie'],
  },
}

function getServiceLead(serviceType: BookingServiceType) {
  return FUNNEL_SERVICE_CONFIG[serviceType].bookingLead
}

function getTopicSectionTitle(species: BookingSpecies) {
  return species === 'kot' ? 'Wybierz temat koci' : 'Wybierz temat psi'
}

export default async function BookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service) ?? DEFAULT_BOOKING_SERVICE)
  const selectedSpecies = readBookingSpeciesSearchParam(searchParams?.species)
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const dataMode = getDataModeStatus()
  const serviceTitle = getBookingServiceTitle(serviceType)
  const serviceConfig = FUNNEL_SERVICE_CONFIG[serviceType]
  const topicOptions = selectedSpecies === 'kot' ? CAT_PROBLEM_OPTIONS : selectedSpecies === 'pies' ? DOG_PROBLEM_OPTIONS : []
  const mainProblemOptions = topicOptions.filter((item) => item.id !== 'inne')
  const mixedProblemOption = topicOptions.find((item) => item.id === 'inne') ?? null
  const messageHref = selectedSpecies ? `/kontakt?species=${selectedSpecies}#formularz` : '/kontakt#formularz'
  const switchSpeciesHref = buildBookHref(null, serviceQuery, qaBooking)
  let pricingAmount = getBookingServicePrice(serviceType, DEFAULT_PRICE_PLN)
  let availabilityLabel = serviceConfig.availabilityLabel

  if (problem) {
    redirect(buildSlotHref(problem, serviceQuery, qaBooking))
  }

  if (dataMode.isValid) {
    try {
      const [availability, quickConsultationPrice] = await Promise.all([listAvailability(), getActiveConsultationPrice()])
      const filteredAvailability = filterGroupedAvailabilityForService(availability, serviceType)
      pricingAmount = getBookingServicePrice(serviceType, quickConsultationPrice.amount)
      availabilityLabel = filteredAvailability.length > 0 ? serviceConfig.availabilityLabel : serviceConfig.noAvailabilityMessage
    } catch (error) {
      pricingAmount = getBookingServicePrice(serviceType, DEFAULT_PRICE_PLN)
      console.warn('[behawior15][book] nie udało się wczytać dostępności', error)
    }
  }

  return (
    <main
      className="page-wrap marketing-page"
      data-analytics-disabled={qaBooking ? 'true' : undefined}
      data-qa-booking={qaBooking ? 'true' : 'false'}
    >
      <div className="container">
        <Header />
        <AnalyticsEventOnMount
          eventName="booking_start"
          params={{
            source_page: '/book',
            species: selectedSpecies,
            ...getServiceAnalyticsParams(serviceType, pricingAmount),
          }}
        />
        <AnalyticsEventOnMount
          eventName="booking_service_selected"
          params={{
            source_page: '/book',
            species: selectedSpecies,
            ...getServiceAnalyticsParams(serviceType, pricingAmount),
          }}
        />

        <section className="panel section-panel hero-surface booking-stage-panel decision-page-panel booking-flow-panel">
          <div className="booking-stage-hero-grid">
            <div className="booking-stage-copy-column">
              <BookingStageEyebrow stage="topic" className="section-eyebrow" />
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb testowy</div> : null}
              <h1>{selectedSpecies ? getTopicSectionTitle(selectedSpecies) : 'Wybierz, czy konsultacja dotyczy psa czy kota'}</h1>
              <p className="hero-text">{getServiceLead(serviceType)}</p>

              <div className="book-hero-stats top-gap-small">
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Wybrana usługa</span>
                  <strong>{serviceTitle}</strong>
                </div>
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Cena</span>
                  <strong>
                    <PriceDisplay amount={pricingAmount} />
                  </strong>
                </div>
                <div className="book-hero-stat tree-backed-card">
                  <span className="book-hero-stat-label">Dostępność</span>
                  <strong>{availabilityLabel}</strong>
                </div>
              </div>
            </div>

            <BookingServiceInfoCard
              serviceType={serviceType}
              quickConsultationPrice={pricingAmount}
              title={selectedSpecies ? 'Teraz wybierasz temat' : 'Najpierw wybierasz gatunek'}
              stageLabel="Ta usługa"
              emphasis={
                selectedSpecies
                  ? 'Po wyborze tematu od razu pokażę najbliższe terminy tej usługi.'
                  : 'Wybierz, czy sprawa dotyczy psa czy kota, a pokażę właściwe tematy.'
              }
            />
          </div>

          {!selectedSpecies ? (
            <div className="card-grid two-up top-gap">
              {(Object.keys(SPECIES_CARDS) as BookingSpecies[]).map((species) => {
                const card = SPECIES_CARDS[species]

                return (
                  <article key={species} className="summary-card tree-backed-card">
                    <div className="section-eyebrow">{species === 'kot' ? 'Tematy kota' : 'Tematy psa'}</div>
                    <h2>{card.title}</h2>
                    <p>{card.summary}</p>
                    <ul className="premium-bullet-list">
                      {card.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="hero-actions top-gap-small">
                      <Link href={buildBookHref(null, serviceQuery, qaBooking, species)} prefetch={false} className="button button-primary">
                        {species === 'kot' ? 'Wybierz kota' : 'Wybierz psa'}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <>
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
                    >
                      <div className="topic-media-shell">
                        <Image
                          src={topicVisual.src}
                          alt={topicVisual.alt}
                          width={topicVisual.width}
                          height={topicVisual.height}
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
                  <div className="section-eyebrow">{mixedProblemOption?.title ?? 'Inny temat'}</div>
                  <strong>Nie musisz znać idealnej nazwy problemu.</strong>
                  <span>
                    Jeśli temat jest mieszany, wybierz{' '}
                    {mixedProblemOption ? (
                      <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false} className="inline-link">
                        {mixedProblemOption.title}
                      </Link>
                    ) : (
                      'inny temat'
                    )}{' '}
                    albo użyj{' '}
                    <Link href={messageHref} prefetch={false} className="inline-link">
                      krótkiej wiadomości
                    </Link>
                    .
                  </span>
                </div>

                <div className="offer-card-actions">
                  <Link href={switchSpeciesHref} prefetch={false} className="button button-ghost">
                    Zmień gatunek
                  </Link>
                  <Link href={messageHref} prefetch={false} className="button button-ghost">
                    {FUNNEL_CTA_LABELS.contact}
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        <Footer
          ctaHref={buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking, selectedSpecies)}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
          headline="Masz temat mieszany albo pytanie przed rezerwacją?"
          description="Jeśli nie widzisz idealnej kategorii albo chcesz najpierw krótko opisać sprawę, napisz wiadomość."
        />
      </div>
    </main>
  )
}
