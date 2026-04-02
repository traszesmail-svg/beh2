import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HomeMobileStickyCta } from '@/components/HomeMobileStickyCta'
import { buildSlotHref } from '@/lib/booking-routing'
import { DEFAULT_PRICE_PLN, formatPricePln } from '@/lib/pricing'
import { buildHomeMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getBaseUrl, getDataModeStatus } from '@/lib/server/env'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  HOME_CAT_QUICK_CHOICE_PHOTO,
  HOME_DOG_QUICK_CHOICE_PHOTO,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const quickChoiceLinks = [
  {
    label: 'Mam psa',
    href: '/book',
    analyticsLocation: 'home-quick-choice-dog',
    imageSrc: HOME_DOG_QUICK_CHOICE_PHOTO.src,
    imageAlt: HOME_DOG_QUICK_CHOICE_PHOTO.alt,
    key: 'dog',
  },
  {
    label: 'Mam kota',
    href: buildSlotHref('kot'),
    analyticsLocation: 'home-quick-choice-cat',
    imageSrc: HOME_CAT_QUICK_CHOICE_PHOTO.src,
    imageAlt: HOME_CAT_QUICK_CHOICE_PHOTO.alt,
    key: 'cat',
  },
] as const

const firstStepCards = [
  {
    title: 'Pomóż mi wybrać',
    summary: 'Jeśli temat jest mieszany, zacznij tutaj.',
    cta: 'Dobierz pierwszy krok',
    href: '/kontakt',
    buttonClassName: 'button button-primary',
    analyticsLocation: 'home-first-step-match',
    key: 'match',
  },
  {
    title: 'Chcę wejść w termin',
    summary: 'Jeśli chcesz od razu rozmawiać, wybierz 15 min.',
    cta: 'Umów 15 min',
    href: '/book',
    buttonClassName: 'button button-ghost',
    analyticsLocation: 'home-first-step-book',
    key: 'book',
  },
  {
    title: 'Wolę najpierw napisać',
    summary: 'Jeśli temat jest pilny albo mieszany, napisz.',
    cta: 'Napisz wiadomość',
    href: '/kontakt',
    buttonClassName: 'button button-ghost',
    analyticsLocation: 'home-first-step-message',
    key: 'message',
  },
] as const

const trustPills = ['psy i koty', 'COAPE / CAPBT', 'piszę osobiście'] as const

export default async function HomePage() {
  const dataMode = getDataModeStatus()
  const baseUrl = getBaseUrl()
  let availabilityLabel = 'Terminy zobaczysz po wejściu do rezerwacji.'

  if (dataMode.isValid) {
    try {
      const availability = await listAvailability()
      availabilityLabel = availability.length > 0 ? 'Terminy są w rezerwacji.' : 'Jeśli dziś nie ma terminu, napisz.'
    } catch (error) {
      console.warn('[beh2][home] nie udalo sie pobrac dostepnosci na home', error)
    }
  }

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: SITE_TAGLINE,
      url: baseUrl,
      areaServed: {
        '@type': 'Country',
        name: 'Polska',
      },
      serviceType: [
        'Konsultacje behawioralne dla psów i kotów',
        'Terapia problemów w zachowaniu',
        'Pobyty socjalizacyjno-terapeutyczne',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: SPECIALIST_CREDENTIALS,
        image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: SITE_TAGLINE,
      image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
      homeLocation: {
        '@type': 'Place',
        name: SPECIALIST_LOCATION,
      },
      sameAs: [COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL],
    },
  ]

  return (
    <main className="page-wrap home-page">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header compactHome />

        <section className="hero-grid home-hero-grid" id="start">
          <div className="panel hero-panel hero-surface home-hero-panel">
            <div className="pill subtle-pill">Pies lub kot</div>

            <div className="home-hero-copy">
              <h1>Masz problem z psem lub kotem? Wybierz pierwszy krok.</h1>
              <p className="hero-text home-hero-text">Umów 15 min albo napisz wiadomość.</p>
            </div>

            <div className="home-choice-block" aria-label="Szybki wybór">
              <span className="home-choice-label">Szybki wybór</span>
              <div className="home-choice-grid">
                {quickChoiceLinks.map((choice) => (
                  <Link
                    key={choice.key}
                    href={choice.href}
                    prefetch={false}
                    className="home-choice-link"
                    data-home-quick-choice={choice.key}
                    data-analytics-event="cta_click"
                    data-analytics-location={choice.analyticsLocation}
                  >
                    <span className="home-choice-thumb-shell" aria-hidden="true">
                      <Image
                        src={choice.imageSrc}
                        alt={choice.imageAlt}
                        width={480}
                        height={360}
                        sizes="(max-width: 680px) 44vw, 220px"
                        className="home-choice-thumb"
                      />
                    </span>
                    <span>{choice.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hero-actions">
              <a
                href="#pierwszy-krok"
                className="button button-primary big-button"
                data-home-cta="match"
                data-analytics-event="cta_click"
                data-analytics-location="home-hero-match"
              >
                Dobierz pierwszy krok
              </a>
            </div>

            <p className="marketing-note home-hero-note">
              <strong>Start od {formatPricePln(DEFAULT_PRICE_PLN)}.</strong> {availabilityLabel}
            </p>
          </div>

          <aside className="panel side-panel home-hero-aside">
            <div className="home-hero-photo-shell">
              <Image
                src={SPECIALIST_PHOTO.src}
                alt={SPECIALIST_PHOTO.alt}
                width={1200}
                height={1600}
                sizes="(max-width: 980px) 100vw, 34vw"
                className="home-hero-photo"
                priority
              />
            </div>
          </aside>
        </section>

        <section className="panel section-panel home-first-step-section" id="pierwszy-krok">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Wybierz start</h2>
          <p className="hero-text home-section-text">Kliknij to, co pasuje.</p>

          <div className="home-step-grid top-gap">
            {firstStepCards.map((card) => (
              <article key={card.key} className="home-step-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <div className="offer-card-actions">
                  <Link
                    href={card.href}
                    prefetch={false}
                    className={card.buttonClassName}
                    data-home-first-step={card.key}
                    data-analytics-event="cta_click"
                    data-analytics-location={card.analyticsLocation}
                  >
                    {card.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel home-contact-panel" id="kontakt-home">
          <div className="section-eyebrow">Kontakt</div>
          <h2>Piszesz do mnie</h2>
          <p className="hero-text home-section-text">Psy i koty. COAPE / CAPBT.</p>

          <div className="home-trust-pills top-gap-small" aria-label="Zaufanie">
            {trustPills.map((pill) => (
              <span key={pill} className="hero-proof-pill">
                {pill}
              </span>
            ))}
          </div>

          <p className="marketing-note top-gap-small">
            {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Zobacz też{' '}
            <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
              profil CAPBT
            </a>
            .
          </p>

          <div className="hero-actions top-gap">
            <Link
              href="/kontakt"
              prefetch={false}
              className="button button-primary big-button"
              data-home-cta="message"
              data-analytics-event="cta_click"
              data-analytics-location="home-contact-message"
            >
              Napisz wiadomość
            </Link>
            <Link
              href="/book"
              prefetch={false}
              className="button button-ghost big-button"
              data-home-cta="contact-book"
              data-analytics-event="cta_click"
              data-analytics-location="home-contact-book"
            >
              Umów 15 min
            </Link>
          </div>
        </section>

        <HomeMobileStickyCta />

        <Footer />
      </div>
    </main>
  )
}
