import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {
  DEFAULT_BOOKING_SERVICE,
  getBookingServiceTitle,
  normalizeBookingServiceType,
  type BookingServiceType,
} from '@/lib/booking-services'
import { buildSlotHref, readBookingServiceSearchParam, readQaBookingSearchParam } from '@/lib/booking-routing'
import { CAT_PROBLEM_OPTIONS } from '@/lib/data'
import { CAT_SUPPORT_AREAS } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { CAT_TOPIC_VISUALS, CATS_PAGE_PHOTO } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Koty',
  path: '/koty',
  description: 'Kuweta, konflikt, trudny dotyk, stres albo nocna wokalizacja. Wybierz kocią kategorię i od razu przejdź do terminu.',
})

function buildCatsServiceHref(serviceType?: BookingServiceType | null, qaBooking?: boolean) {
  if (!serviceType || serviceType === DEFAULT_BOOKING_SERVICE) {
    return qaBooking ? '/koty?qa=1#kocie-kategorie' : '/koty#kocie-kategorie'
  }

  return qaBooking ? `/koty?service=${serviceType}&qa=1#kocie-kategorie` : `/koty?service=${serviceType}#kocie-kategorie`
}

function getTopicCtaLabel(serviceType: BookingServiceType) {
  switch (serviceType) {
    case 'konsultacja-30-min':
      return 'Umów 30 min dla tego tematu'
    case 'konsultacja-behawioralna-online':
      return 'Umów konsultację online dla tego tematu'
    default:
      return 'Umów 15 min dla tego tematu'
  }
}

function getCatStartOptions(selectedServiceType: BookingServiceType, qaBooking?: boolean) {
  return [
    {
      eyebrow: 'Szybki start',
      title: 'Umów 15 min',
      summary: 'Po kliknięciu kategorii przejdziesz od razu do terminów 15 min.',
      href: buildCatsServiceHref(DEFAULT_BOOKING_SERVICE, qaBooking),
      cta: 'Umów 15 min',
      isActive: selectedServiceType === DEFAULT_BOOKING_SERVICE,
    },
    {
      eyebrow: 'Więcej czasu',
      title: 'Umów 30 min',
      summary: 'Najpierw wybierasz kocią kategorię, potem widzisz terminy 30 min.',
      href: buildCatsServiceHref('konsultacja-30-min', qaBooking),
      cta: 'Umów 30 min',
      isActive: selectedServiceType === 'konsultacja-30-min',
    },
    {
      eyebrow: 'Pełniejszy obraz',
      title: 'Umów konsultację online',
      summary: 'Dla szerszego tematu. Kategorie niżej otwierają kalendarz dla konsultacji online.',
      href: buildCatsServiceHref('konsultacja-behawioralna-online', qaBooking),
      cta: 'Umów konsultację online',
      isActive: selectedServiceType === 'konsultacja-behawioralna-online',
    },
    {
      eyebrow: 'Pomoc w wyborze',
      title: 'Napisz wiadomość',
      summary: 'Jeśli temat jest mieszany albo chcesz opisać sytuację w 2-3 zdaniach.',
      href: '/kontakt',
      cta: 'Napisz wiadomość',
      isActive: false,
    },
  ] as const
}

export default function CatsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const selectedServiceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service))
  const serviceQuery = selectedServiceType === DEFAULT_BOOKING_SERVICE ? null : selectedServiceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const selectedServiceTitle = getBookingServiceTitle(selectedServiceType)
  const selectedTopicCta = getTopicCtaLabel(selectedServiceType)
  const catStartOptions = getCatStartOptions(selectedServiceType, qaBooking)

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface category-page-panel cats-page-panel">
          <div className="cats-hero-layout">
            <div className="cats-copy">
              <div className="section-eyebrow">Koty</div>
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb QA</div> : null}
              <h1>Wybierz temat dla kota i od razu przejdź do terminu.</h1>
              <p className="hero-text">Kuweta, konflikt, trudny dotyk, stres albo nocna wokalizacja. Najpierw zaznacz format startu, potem kliknij kategorie.</p>

              <div className="home-trust-pills top-gap" aria-label="Najczęstsze tematy">
                {CAT_SUPPORT_AREAS.map((item) => (
                  <span key={item} className="hero-proof-pill">
                    {item}
                  </span>
                ))}
              </div>

              <div className="cats-intro-card tree-backed-card">
                <strong>Wybrany format: {selectedServiceTitle}</strong>
                <span>Kategorie niżej prowadzą od razu do /slot z odpowiednim problemType i aktualnym formatem rozmowy.</span>
              </div>
            </div>

            <div className="contact-visual-shell cats-visual-shell">
              <Image
                src={CATS_PAGE_PHOTO.src}
                alt={CATS_PAGE_PHOTO.alt}
                width={1200}
                height={1778}
                sizes="(max-width: 980px) 100vw, 40vw"
                className="contact-feature-image"
              />
            </div>
          </div>

          <div className="card-grid three-up top-gap book-topics-grid" id="kocie-kategorie">
            {CAT_PROBLEM_OPTIONS.map((category) => {
              const topicVisual = CAT_TOPIC_VISUALS[category.id as keyof typeof CAT_TOPIC_VISUALS]

              return (
                <Link
                  key={category.id}
                  href={buildSlotHref(category.id, serviceQuery, qaBooking)}
                  prefetch={false}
                  className="topic-card tree-backed-card book-topic-card"
                  data-problem={category.id}
                  data-cat-problem={category.id}
                  data-analytics-event="topic_selected"
                  data-analytics-location="cats-topics"
                  data-analytics-problem={category.id}
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
                    {category.visualLabel ? <div className="topic-media-badge">{category.visualLabel}</div> : null}
                  </div>
                  <span className="topic-icon-shell" aria-hidden="true">
                    <svg viewBox="0 0 48 48" className="topic-svg">
                      <path d="M13 34c0-9 4.5-15 11-15s11 6 11 15" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
                      <path d="M18 17l-4-7 7 4m6 3l7-4-4 7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
                      <circle cx="21" cy="24" r="1.5" fill="currentColor" />
                      <circle cx="27" cy="24" r="1.5" fill="currentColor" />
                      <path d="M24 25.5v3.5m-7 0l5-1.5m9 1.5l-5-1.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="topic-title">{category.title}</div>
                  <div className="topic-desc">{category.desc}</div>
                  <div className="topic-link">{selectedTopicCta}</div>
                </Link>
              )
            })}
          </div>

          <div className="offer-grid top-gap cats-start-grid">
            {catStartOptions.map((option, index) => (
              <article key={option.title} className="offer-card tree-backed-card cats-start-card">
                <div className="offer-card-head">
                  <div className="cats-start-card-topline">
                    <div className="section-eyebrow">{option.eyebrow}</div>
                    <span className="cats-start-step" aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h2>{option.title}</h2>
                  </div>
                </div>
                <p className="offer-card-summary">{option.summary}</p>
                <div className="offer-card-actions">
                  <Link
                    href={option.href}
                    prefetch={false}
                    className={`button ${option.isActive || option.title === 'Napisz wiadomość' ? 'button-primary' : 'button-ghost'}`}
                  >
                    {option.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer variant="full" ctaHref="/kontakt" ctaLabel="Napisz wiadomość" />
      </div>
    </main>
  )
}
