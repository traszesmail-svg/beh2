import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { HomeMobileStickyCta } from '@/components/HomeMobileStickyCta'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { getLeadMagnetBySlug, type LeadMagnet } from '@/lib/growth-layer'
import {
  FUNNEL_CTA_LABELS,
  FUNNEL_SERVICE_CONFIG,
  PUBLIC_CAT_PROBLEM_OPTIONS,
  PUBLIC_DOG_PROBLEM_OPTIONS,
  getPublicServicePriceLabel,
} from '@/lib/funnel'
import { FUNNEL_PRIMARY_HREF, FUNNEL_SECONDARY_HREF, FUNNEL_UPGRADE_HREF, OFFERS } from '@/lib/offers'
import { buildHomeMetadata } from '@/lib/seo'
import {
  CAPBT_ORG_URL,
  CAPBT_POLSKA_LOGO,
  CAPBT_PROFILE_URL,
  COAPE_INTL_LOGO,
  COAPE_INTL_URL,
  COAPE_ORG_URL,
  COAPE_POLSKA_LOGO,
  HOME_CAT_QUICK_CHOICE_PHOTO,
  HOME_DOG_QUICK_CHOICE_PHOTO,
  INSTAGRAM_PROFILE_URL,
  SITE_HEADER_SUBTITLE,
  SITE_NAME,
  SPECIALIST_LOCATION,
  SPECIALIST_PUBLIC_STATUS,
  SPECIALIST_STATUS_EXPLANATION,
  SPECIALIST_NAME,
  getPublicContactDetails,
} from '@/lib/site'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type TrustIconKind = 'badge' | 'paw' | 'camera' | 'plan' | 'article'

type TrustItem = {
  label: string
  icon: TrustIconKind
}

type SpeciesCard = {
  label: string
  title: string
  copy: string
  topics: string[]
  href: string
  cta: string
  photo: {
    src: string
    alt: string
    width: number
    height: number
  }
}

type ProcessStep = {
  title: string
  copy: string
}

type OpinionCard = {
  species: string
  context: string
  quote: string
  signature: string
  note: string
}

type AuthoritySupportCard = {
  title: string
  copy: string
  href?: string
  cta?: string
}

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="editorial-section-head">
      <div className="editorial-section-head-copy">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p className="editorial-section-lead">{description}</p>
    </div>
  )
}

function TrustIcon({ kind }: { kind: TrustIconKind }) {
  switch (kind) {
    case 'badge':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.25" />
          <path d="M8.7 12.7 11 15l4.8-5.8" />
        </svg>
      )
    case 'paw':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="7.4" cy="8" r="1.25" />
          <circle cx="10.1" cy="6.9" r="1.25" />
          <circle cx="13.9" cy="6.9" r="1.25" />
          <circle cx="16.6" cy="8" r="1.25" />
          <path d="M8.1 15.3c0-2.2 1.7-4 3.9-4s3.9 1.8 3.9 4c0 1.2-1.7 2.2-3.9 2.2s-3.9-1-3.9-2.2Z" />
        </svg>
      )
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="4.5" y="8" width="10" height="8" rx="2" />
          <path d="m14.5 10.7 4-2.2v6.8l-4-2.2" />
        </svg>
      )
    case 'plan':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 5.5h8A1.5 1.5 0 0 1 17.5 7v10A1.5 1.5 0 0 1 16 18.5H8A1.5 1.5 0 0 1 6.5 17V7A1.5 1.5 0 0 1 8 5.5Z" />
          <path d="M9.5 9h5M9.5 12h5M9.5 15h3.4" />
        </svg>
      )
    case 'article':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7.5 5.5h9A1.5 1.5 0 0 1 18 7v10a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 17V7a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path d="M9 9.2h6M9 12h6M9 14.8h4.2" />
        </svg>
      )
  }

  return null
}

function getOffer(slug: string) {
  const offer = OFFERS.find((item) => item.slug === slug)

  if (!offer) {
    throw new Error(`Missing offer config for ${slug}`)
  }

  return offer
}

const dogsHref = '/psy'
const catsHref = '/koty'
const opinionsPageHref = '/opinie'
const aboutPageHref = '/o-mnie'
const contactHref = '/kontakt#formularz'
const specialistImage = { src: '/branding/omnie-hero.webp', width: 1024, height: 1536 } as const
const consultationImage = { src: '/branding/omnie2.png', width: 1024, height: 1536 } as const
const aboutImage = { src: '/branding/specialist-krzysztof-portrait.jpg', width: 1200, height: 1500 } as const
const preciseAuthorityLine = `${SPECIALIST_PUBLIC_STATUS}, trener zwierząt towarzyszących i technik weterynarii.`

const toolkitOffer = getOffer('poradniki-pdf')

const fullConsultationService = FUNNEL_SERVICE_CONFIG['konsultacja-behawioralna-online']

const trustItems: TrustItem[] = [
  { label: SPECIALIST_PUBLIC_STATUS, icon: 'badge' },
  { label: 'Profil publiczny CAPBT', icon: 'camera' },
  { label: 'Publikacje branżowe', icon: 'article' },
  { label: 'Bez kar i bez obietnic cudów', icon: 'plan' },
]

const speciesCards: SpeciesCard[] = [
  {
    label: 'Pies',
    title: 'Pomoc dla opiekuna psa',
    copy: 'Najczęściej start dotyczy spacerów, pobudzenia, separacji albo młodego psa, z którym trudno złapać codzienny rytm.',
    topics: PUBLIC_DOG_PROBLEM_OPTIONS.filter((option) => option.id !== 'inne')
      .slice(0, 4)
      .map((option) => option.title),
    href: dogsHref,
    cta: 'Zobacz pomoc dla psa',
    photo: { ...HOME_DOG_QUICK_CHOICE_PHOTO, width: 1024, height: 1536 },
  },
  {
    label: 'Kot',
    title: 'Pomoc dla opiekuna kota',
    copy: 'Tu zwykle chodzi o kuwetę, wycofanie, napięcie po zmianach w domu albo trudne relacje między kotami.',
    topics: PUBLIC_CAT_PROBLEM_OPTIONS.filter((option) => option.id !== 'inne')
      .slice(0, 4)
      .map((option) => option.title),
    href: catsHref,
    cta: 'Zobacz pomoc dla kota',
    photo: { ...HOME_CAT_QUICK_CHOICE_PHOTO, width: 1024, height: 1536 },
  },
]

const processSteps: ProcessStep[] = [
  {
    title: 'Zaczynasz od Kwadransu',
    copy: 'Najpierw wybierasz krótki start, żeby spokojnie ustalić priorytet i kolejny krok.',
  },
  {
    title: 'Krótko opisujesz sytuację',
    copy: 'Mówisz, co dzieje się dziś w domu, na spacerze albo przy kuwecie i co najbardziej Cię blokuje.',
  },
  {
    title: 'Wiesz, co zrobić dalej',
    copy: 'Po rozmowie wiesz, od czego zacząć, co obserwować i czy temat wymaga szerszej konsultacji.',
  },
]

const opinionCards: OpinionCard[] = [
  {
    species: 'Pies',
    context: 'Spacer i codzienność',
    quote: 'Po rozmowie wiedziałam, co zrobić od razu i co spokojnie odłożyć. W domu zrobiło się dużo lżej.',
    signature: 'Opiekunka psa reaktywnego',
    note: 'Po pierwszym kontakcie audio',
  },
  {
    species: 'Kot',
    context: 'Kuweta i napięcie',
    quote: 'Przy kuwecie dostałam porządek zamiast kolejnych domysłów. To był pierwszy moment, kiedy wiedziałam, od czego zacząć.',
    signature: 'Opiekunka kota niewychodzącego',
    note: 'Po uporządkowaniu tematu',
  },
]

const faqItems = FAQ_SHORTLISTS.home
const featuredLeadMagnets = [
  getLeadMagnetBySlug('pies-reaktywnosc-5-krokow'),
  getLeadMagnetBySlug('kot-kuweta-checklista'),
  getLeadMagnetBySlug('przygotowanie-do-konsultacji-online'),
].filter((magnet): magnet is LeadMagnet => magnet !== null)

const authorityRoleCards = [
  {
    title: SPECIALIST_PUBLIC_STATUS,
    copy: 'uczciwie nazwany status widoczny w publicznym źródle',
  },
  {
    title: 'Profil publiczny CAPBT',
    copy: 'czytelny punkt odniesienia dla kwalifikacji i afiliacji',
  },
  {
    title: 'Technik weterynarii',
    copy: 'szerszy kontekst zdrowia i bezpieczeństwa',
  },
] as const

const authoritySupportCards: AuthoritySupportCard[] = [
  {
    title: 'Jak najuczciwiej nazwać kwalifikacje',
    copy: SPECIALIST_STATUS_EXPLANATION,
  },
  {
    title: 'Plan dopasowany do domu',
    copy: 'Pierwszy krok ma być wykonalny dla opiekuna i realny dla psa albo kota w codziennym rytmie.',
  },
  {
    title: toolkitOffer.title,
    copy: 'Materiały, do których można wrócić między konsultacjami.',
    href: FUNNEL_SECONDARY_HREF,
    cta: FUNNEL_CTA_LABELS.secondary,
  },
]

const authorityLogoTiles = [
  {
    title: 'COAPE',
    note: 'międzynarodowy standard kształcenia behawiorystów',
    href: COAPE_INTL_URL,
    image: COAPE_INTL_LOGO,
    width: COAPE_INTL_LOGO.width,
    height: COAPE_INTL_LOGO.height,
  },
  {
    title: 'COAPE Polska',
    note: 'polska licencja i ścieżka edukacji COAPE',
    href: COAPE_ORG_URL,
    image: COAPE_POLSKA_LOGO,
    width: COAPE_POLSKA_LOGO.width,
    height: COAPE_POLSKA_LOGO.height,
  },
  {
    title: 'CAPBT Polska',
    note: 'stowarzyszenie behawiorystów i trenerów COAPE',
    href: CAPBT_ORG_URL,
    image: CAPBT_POLSKA_LOGO,
    width: CAPBT_POLSKA_LOGO.width,
    height: CAPBT_POLSKA_LOGO.height,
  },
] as const

export default function HomePage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: 'Konsultacje behawioralne dla psów i kotów online. Spokojny pierwszy krok, jasny plan działania i kontakt bez presji.',
      url: baseUrl,
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      serviceType: ['Konsultacje behawioralne dla psów i kotów', 'Spokojny pierwszy krok online', 'Plan działania po konsultacji'],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: SPECIALIST_PUBLIC_STATUS,
        image: new URL(specialistImage.src, baseUrl).toString(),
        description: preciseAuthorityLine,
      },
      contactPoint: contact.email
        ? {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email,
            areaServed: [{ '@type': 'Country', name: 'Polska' }],
          }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: preciseAuthorityLine,
      image: new URL(specialistImage.src, baseUrl).toString(),
      sameAs: [COAPE_INTL_URL, COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL],
      homeLocation: { '@type': 'Place', name: SPECIALIST_LOCATION },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]

  return (
    <main className="page-wrap home-page editorial-home-page premium-home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="panel home-hero-shell" id="start">
          <div className="home-hero-grid">
            <div className="home-hero-panel">
              <div className="section-eyebrow home-hero-eyebrow">{SITE_HEADER_SUBTITLE}</div>

              <div className="home-hero-copy">
                <h1>Jeśli coś w zachowaniu Twojego psa albo kota Cię niepokoi, zacznij od spokojnej rozmowy.</h1>
                <p className="home-hero-text">
                  Pomagam opiekunom, którzy widzą problem i chcą wiedzieć, co zrobić dalej. Kwadrans z behawiorystą to
                  najprostszy start, gdy chcesz krótko opisać sytuację i dostać jasny kierunek.
                </p>
              </div>

              <div className="hero-actions home-hero-actions">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="button button-primary big-button home-primary-cta">
                  Umów Kwadrans z behawiorystą
                </Link>
                <Link href="#pies-i-kot" prefetch={false} className="button button-ghost big-button home-secondary-cta">
                  Nie wiem, od czego zacząć
                </Link>
              </div>

              <div className="editorial-hero-meta" aria-label="Wybór ścieżki startowej">
                <Link href={dogsHref} prefetch={false} className="prep-inline-link">
                  Pies
                </Link>
                <Link href={catsHref} prefetch={false} className="prep-inline-link">
                  Kot
                </Link>
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  Krótkie pytanie
                </Link>
              </div>

              <p className="muted">
                Konsultacja 60 min, kontakt i Niezbędnik zostają niżej. Na pierwszym ekranie najprościej wybrać Kwadrans albo wejść w ścieżkę psa lub kota.
              </p>
            </div>

            <aside className="home-hero-aside" aria-label="Zdjęcie specjalisty">
              <div className="home-hero-photo-shell">
                <Image
                  src={specialistImage.src}
                  alt={`${SPECIALIST_NAME} podczas spokojnej konsultacji dla opiekuna psa lub kota`}
                  width={specialistImage.width}
                  height={specialistImage.height}
                  sizes="(max-width: 980px) 100vw, 480px"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="home-hero-photo"
                />
              </div>

              <div className="editorial-hero-meta" aria-label="Najważniejsze informacje o współpracy">
                <span>pies i kot</span>
                <span>online</span>
                <span>spokojny pierwszy krok</span>
              </div>
            </aside>
          </div>
        </section>

        <ul className="premium-trust-strip" aria-label="Najważniejsze filary zaufania">
          {trustItems.map((item) => (
            <li key={item.label} className="premium-trust-strip-item">
              <span className="premium-trust-strip-icon" aria-hidden="true">
                <TrustIcon kind={item.icon} />
              </span>
              <span className="premium-trust-strip-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <section className="panel section-panel editorial-section" id="pies-i-kot">
          <SectionIntro
            eyebrow="Pies i kot"
            title="Wybierz stronę dla psa albo kota"
            description="Znajdziesz tam najczęstsze tematy, Kwadrans z behawiorystą, Niezbędnik i konsultację 60 min przy szerszych sprawach."
          />

          <div className="premium-two-column-grid top-gap">
            {speciesCards.map((card) => (
              <article key={card.label} className="home-entry-card">
                <div className="home-entry-media-shell">
                  <Image
                    src={card.photo.src}
                    alt={card.photo.alt}
                    width={card.photo.width}
                    height={card.photo.height}
                    sizes="(max-width: 980px) 100vw, 48vw"
                    className="home-entry-media"
                  />
                </div>

                <div className="home-entry-copy">
                  <div className="home-entry-topline">
                    <span className="home-entry-kind">{card.label}</span>
                    <span className="editorial-signal-pill">strona gatunku</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  <ul className="premium-bullet-list">
                    {card.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <Link href={card.href} prefetch={false} className="home-entry-cta prep-inline-link">
                    {card.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Jak wygląda start"
            title="Zacznij od Kwadransu z behawiorystą"
            description="Reaktywność na spacerze, lęk separacyjny, problemy z kuwetą czy konflikty między kotami warto najpierw spokojnie uporządkować."
          />

          <div className="editorial-process-layout home-process-layout">
            <div className="home-process-copy">
              <div className="editorial-process-timeline">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="editorial-process-card">
                    <div className="editorial-process-step">{String(index + 1).padStart(2, '0')}</div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="home-process-visual" aria-label="Pełna konsultacja jako druga opcja">
              <div className="home-process-photo-frame">
                <Image
                  src={consultationImage.src}
                  alt="Krzysztof Regulski podczas spokojnej konsultacji behawioralnej online"
                  width={consultationImage.width}
                  height={consultationImage.height}
                  sizes="(max-width: 980px) 100vw, 520px"
                  className="home-process-photo"
                />
              </div>

              <div className="home-process-proof-card">
                <span className="home-process-proof-label">Konsultacja 60 min</span>
                <p>{fullConsultationService.publicSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry pełnej konsultacji">
                  <span>{fullConsultationService.durationMinutes} min</span>
                  <span>{getPublicServicePriceLabel('konsultacja-behawioralna-online')}</span>
                  <span>ograniczona dostępność</span>
                </div>
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </aside>
          </div>

          <FunnelPrimaryActions
            audioHref={FUNNEL_PRIMARY_HREF}
            consultationHref={FUNNEL_UPGRADE_HREF}
            contactHref={contactHref}
            primaryLocation="home-process-audio"
            secondaryLocation="home-process-toolkit"
            note={
              <>
                Jeśli nie chcesz jeszcze rezerwować, możesz wysłać{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.contact.toLowerCase()}
                </Link>
                .
              </>
            }
          />
        </section>

        <section className="panel section-panel editorial-section" id="bezplatne-materialy">
          <SectionIntro
            eyebrow="Bezpłatne materiały"
            title="Jeśli chcesz, możesz najpierw sięgnąć po krótki materiał startowy"
            description="To dodatkowa opcja dla osób, które chcą uporządkować temat przed rozmową. Kwadrans z behawiorystą pozostaje najprostszym startem."
          />

          <div className="card-grid three-up top-gap">
            {featuredLeadMagnets.map((magnet) => (
              <article key={magnet.slug} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{magnet.categoryLabel}</div>
                <h3>{magnet.shortTitle}</h3>
                <p>{magnet.lead}</p>
                <ul className="premium-bullet-list">
                  {magnet.bullets.slice(0, 3).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href={`/bezplatne-materialy/${magnet.slug}`} prefetch={false} className="prep-inline-link">
                  Zobacz materiał
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co opiekunowie mówią o konsultacjach"
            description="Krótkie głosy po pierwszym kontakcie i po pełniejszych konsultacjach."
          />

          <div className="home-opinion-featured-grid top-gap">
            {opinionCards.map((opinion) => (
              <article key={opinion.species} className="home-quote-card">
                <div className="home-quote-head">
                  <span className="home-quote-label">{opinion.species}</span>
                  <span className="home-quote-context">{opinion.context}</span>
                </div>
                <blockquote className="home-quote-text">„{opinion.quote}”</blockquote>
                <div className="home-quote-footer">
                  <span className="home-quote-person">{opinion.signature}</span>
                  <span className="home-quote-note">{opinion.note}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions top-gap-small">
            <Link href={opinionsPageHref} prefetch={false} className="prep-inline-link">
              Zobacz więcej opinii
            </Link>
            <Link href={aboutPageHref} prefetch={false} className="prep-inline-link">
              Zobacz, jak pracuję
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="o-mnie">
          <div className="premium-about-grid">
            <div className="premium-about-media">
              <div className="premium-about-photo-frame">
                <Image
                  src={aboutImage.src}
                  alt={`${SPECIALIST_NAME} podczas spokojnej pracy z kotem`}
                  width={aboutImage.width}
                  height={aboutImage.height}
                  sizes="(max-width: 980px) 100vw, 38vw"
                  className="premium-about-photo"
                />
              </div>

              <div className="home-authority-role-grid" aria-label="Główne filary doświadczenia">
                {authorityRoleCards.map((card) => (
                  <article key={card.title} className="home-authority-role-card">
                    <strong>{card.title}</strong>
                    <span>{card.copy}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="premium-about-copy">
              <SectionIntro
                eyebrow="O mnie"
                title="Spokojne podejście, konkretne doświadczenie i materiały, do których można wrócić"
                description="Pracuję spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok."
              />

              <p className="editorial-hero-lead">
                <strong>Najpierw porządkuję tło zachowania.</strong> Dopiero potem dobieram pierwszy krok, który da się wdrożyć w domu bez
                dokładania chaosu opiekunowi i zwierzęciu.
              </p>

              <p className="premium-authority-links-intro">
                Poniżej są organizacje, z którymi jestem związany, oraz link do profilu CAPBT.
              </p>

              <div className="home-authority-proof-grid" aria-label="Publiczne źródła i afiliacje">
                {authorityLogoTiles.map((tile) => (
                  <Link
                    key={tile.title}
                    href={tile.href}
                    prefetch={false}
                    target="_blank"
                  rel="noopener noreferrer"
                  className="home-authority-logo-tile"
                >
                  <span className="home-authority-logo-mark">
                    <Image
                      src={tile.image.src}
                      alt={tile.image.alt}
                      width={tile.width}
                      height={tile.height}
                      sizes="150px"
                      className="home-authority-logo-image"
                    />
                  </span>
                  <span className="home-authority-logo-copy">
                    <strong>{tile.title}</strong>
                      <span>{tile.note}</span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="specialist-badge-list">
                <Link href={CAPBT_PROFILE_URL} prefetch={false} target="_blank" rel="noopener noreferrer" className="specialist-badge">
                  Zobacz profil CAPBT
                </Link>
              </div>

              <div className="summary-grid top-gap">
                {authoritySupportCards.map((card) => (
                  <article key={card.title} className="summary-card tree-backed-card">
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    {card.href && card.cta ? (
                      <div className="hero-actions top-gap-small">
                        <Link href={card.href} prefetch={false} className="prep-inline-link">
                          {card.cta}
                        </Link>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="hero-actions editorial-final-actions top-gap-small">
                <Link href={aboutPageHref} prefetch={false} className="prep-inline-link">
                  Więcej o mnie
                </Link>
                <Link href={FUNNEL_SECONDARY_HREF} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania przed pierwszym kontaktem"
            description="Krótko o pytaniach, które najczęściej pojawiają się przed rozmową, Niezbędnikiem albo wiadomością."
          />

          <div className="premium-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Jeśli chcesz najpierw zapytać, napisz krótką wiadomość.</strong>
              <p>Wystarczy gatunek, temat i kilka zdań. {COPY_HELPERS.contactResponseWindow}</p>
            </div>

            <div className="hero-actions editorial-final-actions">
              <Link href={contactHref} prefetch={false} className="prep-inline-link">
                {FUNNEL_CTA_LABELS.contact}
              </Link>
              <Link href={FUNNEL_UPGRADE_HREF} prefetch={false} className="prep-inline-link">
                {FUNNEL_CTA_LABELS.consultation}
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Kwadrans z behawiorystą</div>
            <h2>Zacznij od Kwadransu z behawiorystą</h2>
            <p>
              Jeśli coś Cię niepokoi, ale nie wiesz jeszcze, jak duży to problem, krótka rozmowa głosem bez kamery wystarczy, żeby ustalić
              priorytet i wiedzieć, co zrobić dalej.
            </p>

            <FunnelPrimaryActions
              audioHref={FUNNEL_PRIMARY_HREF}
              consultationHref={FUNNEL_UPGRADE_HREF}
              contactHref={contactHref}
              primaryLocation="home-final-audio"
              secondaryLocation="home-final-toolkit"
              note={
                <>
                  Jeśli chcesz tylko krótko doprecyzować temat, użyj{' '}
                  <Link href={contactHref} prefetch={false} className="prep-inline-link">
                    {FUNNEL_CTA_LABELS.contact.toLowerCase()}
                  </Link>
                  .
                </>
              }
            />
          </div>
        </section>

        <HomeMobileStickyCta />
        <Footer
          variant="home"
          ctaHref={FUNNEL_PRIMARY_HREF}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={FUNNEL_SECONDARY_HREF}
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
