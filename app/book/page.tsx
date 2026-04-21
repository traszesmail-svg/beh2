import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { BookingServiceInfoCard } from '@/components/BookingServiceInfoCard'
import { NotatnikFooter, NotatnikTopbar } from '@/components/NotatnikA'
import { PriceDisplay } from '@/components/PriceDisplay'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import {
  DEFAULT_BOOKING_SERVICE,
  filterGroupedAvailabilityForService,
  getBookingServicePrice,
  getBookingServiceTitle,
  normalizeBookingServiceType,
  type BookingServiceType,
} from '@/lib/booking-services'
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
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BOOKING_NAV_ITEMS = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/faq', label: 'FAQ' },
]

const BOOKING_DECISION_STEPS = ['1. Wybierz gatunek', '2. Wybierz temat', '3. Wybierz termin', '4. Uzupelnij dane'] as const

const SPECIES_CARDS: Record<BookingSpecies, { title: string; summary: string; bullets: string[] }> = {
  pies: {
    title: 'Pies',
    summary: 'Wybierz psa, zeby zobaczyc tematy i terminy wlasciwe dla spraw psich.',
    bullets: ['Szczeniak / mlody pies', 'Spacer i reaktywnosc', 'Separacja', 'Pobudzenie / wyciszenie', 'Agresja / zasoby'],
  },
  kot: {
    title: 'Kot',
    summary: 'Wybierz kota, zeby zobaczyc tematy i terminy wlasciwe dla spraw kocich.',
    bullets: ['Kuweta', 'Wycofanie / napiecie', 'Konflikt miedzy kotami', 'Zmiany w domu', 'Wokalizacja / pobudzenie'],
  },
}

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

function getTopicSectionTitle(species: BookingSpecies) {
  return species === 'kot' ? 'Wybierz temat koci' : 'Wybierz temat psi'
}

function getServiceLead(serviceType: BookingServiceType) {
  return FUNNEL_SERVICE_CONFIG[serviceType].bookingLead
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
      console.warn('[behawior15][book] nie udalo sie wczytac dostepnosci', error)
    }
  }

  return (
    <main className="notatnik-page" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Rezerwacja konsultacji" navItems={BOOKING_NAV_ITEMS} ctaHref="/" ctaLabel="Wroc na strone" ctaVariant="ghost" />

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

        <div className="notatnik-booking">
          <div className="notatnik-booking-left">
            <div className="notatnik-mono">{selectedSpecies ? 'Krok 01 / 04 · Usluga' : 'Krok 01 / 04 · Wybierz usluge'}</div>
            {qaBooking ? (
              <div className="notatnik-contact-note" style={{ marginTop: 18 }}>
                <strong>Tryb testowy</strong>
                <p>To jest booking testowy bez realnego obciazenia klienta.</p>
              </div>
            ) : null}

            <h1>
              Wybierz <em>najprostszy start</em>.
            </h1>
            <p className="notatnik-booking-lede">
              {selectedSpecies
                ? `Masz juz wybrany gatunek. ${getTopicSectionTitle(selectedSpecies)} i przejdz do realnych terminow.`
                : 'Nie musisz znac odpowiedzi od razu. Kwadrans pomaga zdecydowac, czy wystarczy krotki start, Dwa kwadranse, czy od razu pelna konsultacja.'}
            </p>

            <div className="notatnik-option-grid">
              <Link
                href={buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking, selectedSpecies)}
                prefetch={false}
                className="notatnik-option-card"
                data-active={serviceType === 'szybka-konsultacja-15-min'}
              >
                <div className="notatnik-option-title">Kwadrans z behawiorysta</div>
                <span className="sr-only">nazwa uslugi: Kwadrans z behawiorysta; format: 15 min audio bez kamery.</span>
                <div className="notatnik-option-price">
                  <PriceDisplay amount={getBookingServicePrice('szybka-konsultacja-15-min', pricingAmount)} />
                </div>
                <div className="notatnik-option-copy">
                  15 min · rozmowa audio bez kamery. Jedno pytanie albo uporzadkowanie tematu. Najprostszy start.
                </div>
              </Link>

              <Link
                href={buildBookHref(null, 'konsultacja-30-min', qaBooking, selectedSpecies)}
                prefetch={false}
                className="notatnik-option-card"
                data-active={serviceType === 'konsultacja-30-min'}
              >
                <div className="notatnik-option-title">Dwa kwadranse z behawiorysta</div>
                <div className="notatnik-option-price">
                  <PriceDisplay amount={getBookingServicePrice('konsultacja-30-min', pricingAmount)} />
                </div>
                <div className="notatnik-option-copy">
                  2 x 15 min · rozmowa online. Spokojniejszy etap posredni, gdy sam Kwadrans to za malo, ale nie potrzebujesz jeszcze pelnej konsultacji.
                </div>
              </Link>

              <Link
                href={buildBookHref(null, 'konsultacja-behawioralna-online', qaBooking, selectedSpecies)}
                prefetch={false}
                className="notatnik-option-card"
                data-active={serviceType === 'konsultacja-behawioralna-online'}
              >
                <div className="notatnik-option-title">Pelna konsultacja behawioralna</div>
                <div className="notatnik-option-price">
                  <PriceDisplay amount={getBookingServicePrice('konsultacja-behawioralna-online', pricingAmount)} />
                </div>
                <div className="notatnik-option-copy">
                  ok. 2 h · online. Zawiera wstepny Kwadrans z behawiorysta dla rozpoznania problematyki i pierwszych zaleceń.
                </div>
              </Link>

              <Link href={messageHref} prefetch={false} className="notatnik-option-card" data-active={false}>
                <div className="notatnik-option-title">Wiadomosc przed rezerwacja</div>
                <div className="notatnik-option-price">bezplatnie</div>
                <div className="notatnik-option-copy">
                  Jesli nie wiesz, co wybrac, napisz krotko co sie dzieje. W odpowiedzi wskaze najlepszy start.
                </div>
              </Link>
            </div>

            <div className="notatnik-booking-summary">
              <div className="notatnik-booking-note">
                <strong>Wybrana usluga</strong>
                <p>{serviceTitle}</p>
              </div>
              <div className="notatnik-booking-note">
                <strong>Cena i dostepnosc</strong>
                <p>
                  <PriceDisplay amount={pricingAmount} /> · {availabilityLabel}
                </p>
              </div>
              <div className="notatnik-booking-note">
                <strong>Ta usluga</strong>
                <p>{getServiceLead(serviceType)}</p>
              </div>
              <div className="notatnik-booking-note">
                <strong>Kroki rezerwacji</strong>
                <p>{BOOKING_DECISION_STEPS.join(' · ')}</p>
              </div>
            </div>
          </div>

          <div className="notatnik-booking-right">
            <div className="notatnik-booking-panel">
              <div className="notatnik-mono">{selectedSpecies ? 'Krok 02 / 04 · Wybierz temat' : 'Krok 02 / 04 · Wybierz gatunek'}</div>

              <BookingServiceInfoCard
                serviceType={serviceType}
                quickConsultationPrice={pricingAmount}
                title={selectedSpecies ? 'Teraz wybierasz temat' : 'Najpierw wybierasz gatunek'}
                stageLabel="Ta usluga"
                emphasis={
                  selectedSpecies
                    ? 'Po wyborze tematu od razu pokazemy najblizsze terminy tej uslugi.'
                    : 'Wybierz, czy sprawa dotyczy psa czy kota, a potem pokaze wlasciwe tematy.'
                }
              />

              {!selectedSpecies ? (
                <div className="notatnik-choice-grid">
                  {(Object.keys(SPECIES_CARDS) as BookingSpecies[]).map((species) => {
                    const card = SPECIES_CARDS[species]

                    return (
                      <article key={species} className="notatnik-choice-card">
                        <span className="notatnik-choice-kicker">{species === 'kot' ? 'Tematy kota' : 'Tematy psa'}</span>
                        <h2>{card.title}</h2>
                        <p>{card.summary}</p>
                        <ul className="notatnik-choice-list">
                          {card.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="notatnik-choice-actions">
                          <Link href={buildBookHref(null, serviceQuery, qaBooking, species)} prefetch={false} className="notatnik-btn">
                            {species === 'kot' ? 'Wybierz kota' : 'Wybierz psa'}
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <>
                  <div className="notatnik-topic-choice-grid" id="tematy">
                    {mainProblemOptions.map((item) => (
                      <Link
                        key={item.id}
                        href={buildSlotHref(item.id, serviceQuery, qaBooking)}
                        prefetch={false}
                        className="notatnik-topic-choice-card"
                        data-problem={item.id}
                      >
                        <div className="notatnik-topic-choice-head">
                          <span className="notatnik-choice-kicker">
                            {item.visualLabel ?? (selectedSpecies === 'kot' ? 'Temat kota' : 'Temat psa')}
                          </span>
                          <span className="notatnik-topic-choice-icon">{renderProblemIcon(item.id)}</span>
                        </div>
                        <div className="notatnik-topic-choice-title">{item.title}</div>
                        <div className="notatnik-topic-choice-copy">{item.desc}</div>
                        <div className="notatnik-topic-choice-link">Wybierz temat</div>
                      </Link>
                    ))}
                  </div>

                  <div className="notatnik-contact-note">
                    <strong>Nie musisz znac idealnej nazwy problemu.</strong>
                    <p>
                      Jesli temat jest mieszany, wybierz{' '}
                      {mixedProblemOption ? (
                        <Link href={buildSlotHref(mixedProblemOption.id, serviceQuery, qaBooking)} prefetch={false}>
                          {mixedProblemOption.title}
                        </Link>
                      ) : (
                        'inny temat'
                      )}{' '}
                      albo uzyj <Link href={messageHref}>krotkiej wiadomosci</Link>. Mozesz tez{' '}
                      <Link href={switchSpeciesHref}>zmienic gatunek</Link>.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <NotatnikFooter
          primaryHref={buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking, selectedSpecies)}
          primaryLabel={FUNNEL_CTA_LABELS.primary}
        />
      </div>
    </main>
  )
}
