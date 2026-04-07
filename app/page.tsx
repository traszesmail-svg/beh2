import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HomeMobileStickyCta } from '@/components/HomeMobileStickyCta'
import { PriceDisplay } from '@/components/PriceDisplay'
import { SocialProofSection } from '@/components/SocialProofSection'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { buildHomeMetadata } from '@/lib/seo'
import { getActiveConsultationPrice, listAvailability } from '@/lib/server/db'
import { getBaseUrl, getDataModeStatus } from '@/lib/server/env'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  HOME_CAT_QUICK_CHOICE_PHOTO,
  HOME_DOG_QUICK_CHOICE_PHOTO,
  HOME_HELP_CHOICE_PHOTO,
  HOME_HERO_PHOTO,
  INSTAGRAM_PROFILE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_TRUST_STATEMENT,
} from '@/lib/site'
import { OFFERS, getOfferDetailHref } from '@/lib/offers'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const quickChoiceLinks = [
  {
    label: 'Mam psa',
    badge: 'Rezerwacja',
    href: '/book',
    summary: 'Chcę od razu wybrać temat i termin.',
    cta: 'Przejdź do rezerwacji',
    analyticsLocation: 'home-entry-dog',
    imageSrc: HOME_DOG_QUICK_CHOICE_PHOTO.src,
    imageAlt: HOME_DOG_QUICK_CHOICE_PHOTO.alt,
    key: 'dog',
  },
  {
    label: 'Mam kota',
    badge: 'Koty',
    href: '/koty',
    summary: 'Chcę zobaczyć prosty start dla kota.',
    cta: 'Przejdź do kotów',
    analyticsLocation: 'home-entry-cat',
    imageSrc: HOME_CAT_QUICK_CHOICE_PHOTO.src,
    imageAlt: HOME_CAT_QUICK_CHOICE_PHOTO.alt,
    key: 'cat',
  },
  {
    label: 'Nie wiem, od czego zacząć',
    badge: 'Kontakt',
    href: '/kontakt',
    summary: 'Temat jest mieszany albo wolę najpierw napisać.',
    cta: 'Pomóż mi wybrać',
    analyticsLocation: 'home-entry-help',
    imageSrc: HOME_HELP_CHOICE_PHOTO.src,
    imageAlt: HOME_HELP_CHOICE_PHOTO.alt,
    key: 'help',
  },
] as const

const trustBadges = ['COAPE / CAPBT', 'Technik weterynarii', 'Psy i koty', 'Olsztyn + online', 'Prowadzę osobiście'] as const

const homeSteps = [
  {
    n: '01',
    title: 'Wybierasz temat',
    desc: 'Dzięki prostym wejściom nie musisz zgadywać, od czego zacząć.',
  },
  {
    n: '02',
    title: 'Widzisz następny krok',
    desc: 'Zostajesz przy jednym prostym ruchu: termin, wiadomość albo materiał PDF.',
  },
  {
    n: '03',
    title: 'Dostajesz potwierdzenie',
    desc: 'Po opłaceniu lub kontakcie masz jasny dalszy ruch i mniej chaosu.',
  },
] as const

export default async function HomePage() {
  const dataMode = getDataModeStatus()
  const baseUrl = getBaseUrl()
  let availabilityLabel = 'Terminy zobaczysz po wejściu do rezerwacji.'
  let consultationPriceAmount = DEFAULT_PRICE_PLN

  if (dataMode.isValid) {
    try {
      const [availability, quickConsultationPrice] = await Promise.all([listAvailability(), getActiveConsultationPrice()])
      availabilityLabel = availability.length > 0 ? 'Terminy są w rezerwacji.' : 'Jeśli dziś nie ma terminu, napisz.'
      consultationPriceAmount = quickConsultationPrice.amount
    } catch (error) {
      console.warn('[beh2][home] nie udało się pobrać dostępności na home', error)
    }
  }

  const featuredOffers = [
    OFFERS.find((offer) => offer.slug === 'szybka-konsultacja-15-min'),
    OFFERS.find((offer) => offer.slug === 'konsultacja-30-min'),
    OFFERS.find((offer) => offer.slug === 'konsultacja-behawioralna-online'),
    OFFERS.find((offer) => offer.slug === 'poradniki-pdf'),
  ].filter((offer): offer is NonNullable<typeof offer> => offer != null)

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Olsztyn, woj. warmińsko-mazurskie i online.`,
      url: baseUrl,
      areaServed: [
        {
          '@type': 'City',
          name: 'Olsztyn',
        },
        {
          '@type': 'AdministrativeArea',
          name: 'woj. warmińsko-mazurskie',
        },
        {
          '@type': 'Country',
          name: 'Polska',
        },
      ],
      serviceType: ['Konsultacje behawioralne dla psów i kotów', 'Terapia problemów w zachowaniu', 'Pobyty socjalizacyjno-terapeutyczne'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Olsztyn',
        addressRegion: 'woj. warmińsko-mazurskie',
        addressCountry: 'PL',
      },
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: SPECIALIST_CREDENTIALS,
        image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Olsztyn',
          addressRegion: 'woj. warmińsko-mazurskie',
          addressCountry: 'PL',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: `${SITE_TAGLINE}. Olsztyn, woj. warmińsko-mazurskie i online.`,
      image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
      homeLocation: {
        '@type': 'Place',
        name: SPECIALIST_LOCATION,
      },
      sameAs: [COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL],
    },
  ]

  return (
    <main className="page-wrap home-page">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header compactHome />
        <AnalyticsEventOnMount eventName="home_view" />

        <section className="panel hero-panel hero-surface home-hero-shell" id="start">
          <div className="home-hero-grid">
            <div className="home-hero-panel">
              <div className="home-hero-topline">
                <div className="pill subtle-pill">Krzysztof Regulski</div>
                <div className="home-hero-availability-pill">{availabilityLabel}</div>
              </div>

              <div className="home-hero-copy">
                <span className="home-hero-kicker">Spokojny start bez zgadywania</span>
                <h1>Masz psa, kota albo temat mieszany? Zacznij od prostego wyboru.</h1>
                <p className="hero-text home-hero-text">
                  Krzysztof Regulski prowadzi konsultacje osobiście. Najpierw wybierasz ścieżkę, potem termin i płatność.
                  Po opłaceniu dostajesz potwierdzenie i link do pokoju.
                </p>
              </div>

              <div className="hero-actions home-hero-actions">
                <a
                  href="#home-paths"
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="home-hero-paths"
                >
                  Wybierz ścieżkę
                </a>
                <Link
                  href="/book"
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="home-hero-book"
                >
                  Umów 15 min
                </Link>
              </div>

              <div className="home-hero-trust-bar tree-backed-card">
                <div className="home-hero-proof-grid home-hero-proof-grid-inline">
                  {trustBadges.map((pill) => (
                    <span key={pill} className="hero-proof-pill home-hero-proof-pill">
                      {pill}
                    </span>
                  ))}
                </div>
                <strong>{SPECIALIST_TRUST_STATEMENT}</strong>
                <span>Prowadzę konsultacje osobiście w {SPECIALIST_LOCATION} i online.</span>
                <span>
                  Zobacz też{' '}
                  <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
                    profil CAPBT
                  </a>{' '}
                  i{' '}
                  <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
                    Instagram @coapebehawiorysta
                  </a>
                  .
                </span>
              </div>
            </div>

            <aside className="home-hero-aside tree-backed-card" aria-label="Zaufanie i prowadzenie">
              <div className="home-hero-photo-shell">
                <Image
                  src={HOME_HERO_PHOTO.src}
                  alt={HOME_HERO_PHOTO.alt}
                  width={1024}
                  height={1536}
                  sizes="(max-width: 980px) 100vw, 420px"
                  priority
                  className="home-hero-photo"
                />
                <div className="home-hero-photo-badge">
                  <span className="home-hero-meta-label">Prowadzi osobiście</span>
                  <strong>{SPECIALIST_NAME}</strong>
                </div>
              </div>

              <div className="home-hero-aside-stack">
                <div className="home-hero-spotlight tree-backed-card">
                  <span className="home-hero-meta-label">Kto prowadzi</span>
                  <strong>{SPECIALIST_NAME}</strong>
                  <span>{SPECIALIST_CREDENTIALS}.</span>
                </div>

                <div className="home-hero-meta home-hero-meta-accent">
                  <span className="home-hero-meta-label">
                    Start od <PriceDisplay amount={consultationPriceAmount} />
                  </span>
                  <strong>15 min na pierwszy spokojny krok.</strong>
                  <span>{availabilityLabel}</span>
                </div>
              </div>
            </aside>
          </div>

          <div className="home-choice-block" aria-label="Start" id="home-paths">
            <div className="home-choice-heading">
              <span className="home-choice-label">3 równe wejścia</span>
              <h2>Wybierz ścieżkę pasującą do sytuacji.</h2>
              <p>Każda karta prowadzi od razu do kolejnego kroku.</p>
            </div>

            <div className="home-choice-grid home-choice-grid-wide">
              {quickChoiceLinks.map((choice, index) => (
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
                      sizes="(max-width: 680px) 96px, (max-width: 980px) 50vw, 30vw"
                      className="home-choice-thumb"
                    />
                    <span className="home-choice-index">{index + 1}</span>
                  </span>

                  <span className="home-choice-copy">
                    <span className="home-choice-topline">
                      <span className="home-choice-badge">{choice.badge}</span>
                      <span className="home-choice-step">wejście 0{index + 1}</span>
                    </span>
                    <span className="home-choice-title">{choice.label}</span>
                    <span className="home-choice-summary">{choice.summary}</span>
                    <span className="home-choice-footer">
                      <span className="home-choice-cta">{choice.cta}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="panel section-panel top-gap">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Jak to działa</div>
              <h2>Trzy proste kroki.</h2>
            </div>
            <div className="muted">Bez długiego formularza i bez zgadywania.</div>
          </div>

          <div className="summary-grid top-gap">
            {homeSteps.map((step) => (
              <div key={step.n} className="summary-card tree-backed-card">
                <div className="stat-label">{step.n}</div>
                <strong>{step.title}</strong>
                <span>{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel hero-surface top-gap">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Skrót oferty</div>
              <h2>Najważniejsze kierunki w jednym miejscu.</h2>
            </div>
            <div className="muted">Z tych kart przechodzisz do oferty albo bezpośrednio dalej.</div>
          </div>

          <div className="summary-grid top-gap">
            {featuredOffers.map((offer) => (
              <article key={offer.slug} className="summary-card tree-backed-card">
                <div className="stat-label">{offer.shortTitle}</div>
                <strong>{offer.title}</strong>
                <span>{offer.cardSummary}</span>
                <div className="offer-card-actions top-gap-small">
                  <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost small-button">
                    Zobacz więcej
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SocialProofSection showSubmissionForm={false} />

        <HomeMobileStickyCta />

        <Footer
          variant="landing"
          ctaHref="/book"
          ctaLabel="Umów 15 min"
          secondaryHref="/kontakt"
          secondaryLabel="Napisz wiadomość"
          headline="Najpierw prosty wybór, potem konkretny krok"
          description="Jeśli chcesz wejść od razu w rezerwację, wybierz ścieżkę. Jeśli temat jest mieszany, napisz wiadomość. Prowadzę to osobiście."
        />
      </div>
    </main>
  )
}
