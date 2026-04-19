import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { HeroAudioSoftCta } from '@/components/HeroAudioSoftCta'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { buildBookHref } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CAPBT_POLSKA_LOGO,
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_INTL_LOGO,
  COAPE_INTL_URL,
  COAPE_ORG_URL,
  COAPE_POLSKA_LOGO,
  INSTAGRAM_PROFILE_URL,
  MEDIA_MENTIONS,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  SPECIALIST_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
  getPublicContactDetails,
} from '@/lib/site'
import { getCanonicalBaseUrl } from '@/lib/server/env'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'O mnie / metodyka / COAPE',
  path: '/o-mnie',
  description:
    'Spokojna, konkretna pomoc dla opiekunów psów i kotów. COAPE / CAPBT, publiczny profil CAPBT i inne publiczne punkty odniesienia.',
})

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

type PublicProofCard = {
  id: string
  label: string
  title: string
  copy: string
  href: string
  cta: string
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

function formatCredentialFact(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
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

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const introCallHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'
const dogsHref = '/psy'
const catsHref = '/koty'
const opinionsHref = '/opinie'
const profilePhoto = { src: '/branding/omnie3.png', width: 1024, height: 1536 } as const

const heroTrustItems: TrustItem[] = [
  { label: 'COAPE / CAPBT', icon: 'badge' },
  { label: 'Psy i koty', icon: 'paw' },
  { label: 'Publiczny profil CAPBT', icon: 'camera' },
  { label: `${MEDIA_MENTIONS.length} publiczne artykuły`, icon: 'article' },
]

const whoCards = [
  {
    title: 'Kiedy zwykle się zgłaszają',
    copy: 'Najczęściej wtedy, gdy zachowanie zaczyna realnie wpływać na spokój, relację i codzienny rytm domu.',
  },
  {
    title: 'Co robię w pierwszej rozmowie',
    copy: 'Porządkuję kontekst, sprawdzam priorytet i wybieram pierwszy ruch zamiast dorzucać kolejną warstwę chaosu.',
  },
  {
    title: 'Co ma zostać po konsultacji',
    copy: 'Jasny pierwszy krok, spokojniejsza ocena sytuacji i decyzja, czy wystarczy Kwadrans z behawiorystą, czy lepsza będzie konsultacja 60 min.',
  },
] as const

const credentialFacts = SPECIALIST_CREDENTIALS.split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const qualificationLogoTiles = [
  {
    title: 'COAPE',
    eyebrow: 'Międzynarodowe odniesienie',
    copy: 'Zaplecze szkoleniowe i punkt odniesienia dla sposobu myślenia o zachowaniu, dobrostanie i pracy z opiekunem.',
    href: COAPE_INTL_URL,
    logo: COAPE_INTL_LOGO,
    logoWidth: 1024,
    logoHeight: 254,
  },
  {
    title: 'COAPE Polska',
    eyebrow: 'Polskie zaplecze',
    copy: 'Lokalne środowisko afiliacyjne i czytelne odniesienie do pracy specjalistów COAPE w Polsce.',
    href: COAPE_ORG_URL,
    logo: COAPE_POLSKA_LOGO,
    logoWidth: 442,
    logoHeight: 104,
  },
  {
    title: 'CAPBT Polska',
    eyebrow: 'Środowisko zawodowe',
    copy: 'Stowarzyszenie Behawiorystów i Trenerów COAPE oraz kolejny punkt sprawdzenia afiliacji zawodowych.',
    href: CAPBT_ORG_URL,
    logo: CAPBT_POLSKA_LOGO,
    logoWidth: 436,
    logoHeight: 107,
  },
] as const

const publicProofCards: PublicProofCard[] = [
  {
    id: 'capbt-profile',
    label: 'Publiczny profil',
    title: 'Profil specjalisty w CAPBT',
    copy: 'Najprostszy punkt sprawdzenia afiliacji zawodowych i publicznej obecności przed pierwszym kontaktem.',
    href: CAPBT_PROFILE_URL,
    cta: 'Otwórz profil',
  },
  {
    id: 'instagram-profile',
    label: 'Publiczny profil',
    title: 'Profil marki na Instagramie',
    copy: 'Dodatkowy publiczny punkt odniesienia, jeśli chcesz zobaczyć sposób komunikacji projektu poza samą stroną.',
    href: INSTAGRAM_PROFILE_URL,
    cta: 'Otwórz Instagram',
  },
  ...MEDIA_MENTIONS.map((mention) => ({
    id: mention.id,
    label: mention.label,
    title: mention.title,
    copy: mention.summary,
    href: mention.href,
    cta: mention.cta,
  })),
]

const methodCards = [
  {
    title: 'Zaczynam od tego, co dzieje się dziś',
    copy: 'Interesuje mnie konkretna codzienność: kiedy pojawia się problem, co go poprzedza i co najbardziej obciąża dom.',
  },
  {
    title: 'Oddzielam objaw od tła',
    copy: 'Nie zatrzymuję się na samym sygnale. Sprawdzam też środowisko, relację, rytm dnia i to, co może podtrzymywać zachowanie.',
  },
  {
    title: 'Mówię wprost, kiedy warto sprawdzić zdrowie',
    copy: 'Jeśli widzę powód, żeby sprawdzić temat szerzej, mówię to jasno. To ma dawać bezpieczeństwo, a nie sztuczną pewność.',
  },
  {
    title: 'Na końcu wybieramy pierwszy ruch',
    copy: 'Po rozmowie ma zostać plan wykonalny dla opiekuna i czytelny dla psa albo kota, bez nadmiaru zadań i bez presji.',
  },
] as const

const methodTags = ['co dzieje się dziś', 'co podtrzymuje problem', 'czy sprawdzić zdrowie', 'co zrobić teraz', 'czy wystarczy 15 min', 'czy wejść w 60 min'] as const

const problemCards = [
  {
    title: 'Problemy psa na spacerach',
    copy: 'Ciężkie wyjścia, napięcie na smyczy, czujność, reaktywność i trudność z mijaniem bodźców.',
  },
  {
    title: 'Trudne zachowania psa w domu',
    copy: 'Pobudzenie, szczekanie, pilnowanie zasobów, brak wyciszenia i napięcie w codziennym funkcjonowaniu.',
  },
  {
    title: 'Zostawanie samemu i rozłąka',
    copy: 'Niepokój po wyjściu opiekuna, wokalizacja, niszczenie i napięcie związane z samotnością.',
  },
  {
    title: 'Kuweta i codzienne funkcjonowanie kota',
    copy: 'Omijanie kuwety, napięcie przy rytmie dnia, trudność w utrzymaniu przewidywalności i spokoju.',
  },
  {
    title: 'Wycofanie, stres i nagłe zmiany kota',
    copy: 'Chowanie się, nadmierna czujność, trudność z rozluźnieniem i zmiana zachowania po wydarzeniach w domu.',
  },
  {
    title: 'Relacje i napięcie w domu',
    copy: 'Konflikt między kotami albo ogólna trudna atmosfera, która wpływa na rytm całego domu.',
  },
] as const

const compareCards = [
  {
    eyebrow: 'Na początku',
    title: 'Najpierw porządkujemy, z czym naprawdę masz do czynienia',
    copy: 'To moment na zebranie obrazu sytuacji, a nie na szybkie dopisywanie gotowej recepty.',
    items: [
      'co dokładnie dzieje się dziś i kiedy problem wraca',
      'jak wygląda tło środowiskowe i rytm dnia',
      'czy trzeba wrócić też do zdrowia lub bezpieczeństwa',
      'czy 15 min wystarczy, czy lepiej wejść szerzej',
    ],
  },
  {
    eyebrow: 'Po rozmowie',
    title: 'Masz pierwszy ruch, a nie kolejną listę przypadkowych prób',
    copy: 'Dobrze ustawiony start ma zostawić porządek i czytelne priorytety, a nie chwilowe poczucie, że „coś trzeba robić”.',
    items: [
      'wiesz, co zrobić od razu',
      'wiesz, co obserwować przez najbliższe dni',
      'łatwiej ocenić sens pełnej konsultacji 60 min',
      'łatwiej wrócić do dalszej pracy bez zgadywania',
    ],
  },
] as const

const featuredOpinions = [
  {
    label: 'Spokój',
    context: 'bez presji od pierwszej rozmowy',
    quote:
      'Najbardziej uspokoiło mnie to, że od początku nie było oceniania. Zamiast presji dostałam spokojny kontakt, poczucie bezpieczeństwa i jasny kierunek.',
    signature: 'Po pierwszej konsultacji',
    note: 'bez napięcia i bez egzaminowania opiekuna',
  },
  {
    label: 'Plan',
    context: 'konkretne pierwsze kroki',
    quote:
      'Wreszcie ktoś przełożył sytuację na proste kroki. Nie musiałam zgadywać, co jest ważne, bo plan był od razu czytelny i możliwy do wdrożenia.',
    signature: 'Opiekunka psa po trudniejszym starcie',
    note: 'konkretne wnioski, które dało się wdrożyć',
  },
] as const

const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')

const faqItems = [
  {
    question: 'Czy muszę dokładnie wiedzieć, co jest problemem, zanim się odezwę?',
    answer:
      'Nie. Wystarczy krótki opis tego, co widzisz na co dzień. Na spotkaniu wspólnie uporządkujemy temat i wybierzemy najlepszy punkt startu.',
  },
  {
    question: 'Czy pracujesz tylko z bardzo trudnymi przypadkami?',
    answer:
      'Nie. Pomagam także wtedy, gdy sytuacja dopiero się zaczyna, ale już wpływa na spokój w domu albo na codzienny rytm opiekuna.',
  },
  {
    question: 'Czy podczas konsultacji dostanę konkretny kierunek działania?',
    answer:
      'Tak. Zależy mi na tym, żeby po rozmowie był jasny pierwszy krok, a nie lista przypadkowych sugestii do sprawdzania naraz.',
  },
  {
    question: 'Czy Twoje podejście uwzględnia coś więcej niż samo zachowanie?',
    answer:
      'Tak. Patrzę także na dobrostan, emocje, kontekst, zdrowie i to, co może podtrzymywać zachowanie w konkretnej sytuacji.',
  },
  {
    question: 'Czy muszę bać się oceniania albo egzaminowania z opieki nad zwierzęciem?',
    answer:
      'Nie. Rozmowa ma być spokojna i praktyczna. Interesuje mnie sytuacja i to, jak możemy ją razem uporządkować, a nie ocenianie Ciebie.',
  },
  {
    question: 'Co jeśli sytuacja mojego psa albo kota jest złożona i nie mieści się w jednym schemacie?',
    answer:
      'To normalne. W takich sytuacjach jeszcze ważniejsze jest spokojne uporządkowanie priorytetów, zamiast wciskania wszystkiego w jeden schemat.',
  },
] as const

export default function AboutPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'O mnie / metodyka / COAPE',
      description: `${SITE_NAME}. ${SITE_TAGLINE}.`,
      url: new URL('/o-mnie', baseUrl).toString(),
      mainEntity: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      jobTitle: 'Behawiorysta COAPE / CAPBT',
      description: `Spokojna, konkretna pomoc dla opiekunów psów i kotów. ${SPECIALIST_CREDENTIALS}.`,
      image: new URL(profilePhoto.src, baseUrl).toString(),
      homeLocation: { '@type': 'Place', name: SPECIALIST_LOCATION },
      knowsAbout: ['behawiorystyka psów i kotów', 'konsultacje behawioralne', 'dobrostan zwierząt'],
      sameAs: [COAPE_INTL_URL, COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL],
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
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]

  return (
    <main className="page-wrap marketing-page editorial-home-page premium-home-page authority-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />
        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Krzysztof Regulski | Behawiorysta COAPE / CAPBT</div>
              <h1>Krzysztof Regulski - behawiorysta psów i kotów</h1>
              <p className="editorial-hero-lead">
                Konsultacje online dla opiekunów, którzy chcą zrozumieć zachowanie swojego zwierzęcia i wiedzieć, co z tym zrobić.
                Kwadrans z behawiorystą to samodzielny format dla jednego pytania lub orientacji w temacie, a konsultacja online 60 min
                osobna opcja dla spraw złożonych.
              </p>

              <FunnelPrimaryActions
                audioHref={introCallHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="about-hero-audio"
                secondaryLocation="about-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions"
                noteClassName="authority-hero-cta-note"
              />

              <HeroAudioSoftCta
                href={introCallHref}
                analyticsLocation="about-hero-audio"
                className="authority-hero-soft-cta"
                title="Kwadrans z behawiorystą jest samodzielnym formatem."
                copy="Jeśli masz jedno pytanie albo chcesz ustalić priorytet, to najprostszy format. Przy temacie złożonym od razu powiem, że lepsza będzie konsultacja online 60 min."
              />

              <p className="authority-hero-support-copy">
                Najczęściej pracuję przy spacerach pełnych napięcia, rozłące, pobudzeniu, kuwecie, wycofaniu i napięciu
                między zwierzętami. Najpierw porządkuję obraz sytuacji, potem proponuję spokojny pierwszy ruch.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Portret Krzysztofa Regulskiego">
              <div className="editorial-hero-photo-frame">
                <Image
                  src={profilePhoto.src}
                  alt={`${SPECIALIST_NAME} podczas spokojnej pracy z opiekunem psa lub kota`}
                  width={profilePhoto.width}
                  height={profilePhoto.height}
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojna współpraca</span>
                  <strong>Najpierw porządkuję obraz sytuacji. Potem proponuję plan, który da się realnie wdrożyć.</strong>
                </div>
              </div>
            </aside>
          </div>

          <div className="authority-trust-strip-shell" aria-label="Najważniejsze filary zaufania">
            <ul className="premium-trust-strip authority-trust-strip">
              {heroTrustItems.map((item) => (
                <li key={item.label} className="premium-trust-strip-item authority-trust-strip-item">
                  <span className="premium-trust-strip-icon" aria-hidden="true">
                    <TrustIcon kind={item.icon} />
                  </span>
                  <span className="premium-trust-strip-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kim-jestem">
          <SectionIntro
            eyebrow="Kim jestem"
            title="Konkretny specjalista, nie ogólna wizytówka"
            description="Najważniejsze nie jest to, ile etykiet stoi w bio, tylko czy da się spokojnie sprawdzić, z kim rozmawiasz i jak wygląda rozmowa."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card authority-card authority-identity-card">
              <div className="section-eyebrow">O mnie</div>
              <h3>Pracuję z opiekunami, którzy potrzebują porządku zamiast kolejnej serii przypadkowych porad</h3>
              <p>
                Jestem {SPECIALIST_CREDENTIALS}. Wspieram opiekunów psów i kotów wtedy, gdy zachowanie zaczyna wpływać
                na spokój, relację i codzienny rytm domu.
              </p>
              <p>
                Zależy mi na tym, żeby po rozmowie było mniej chaosu, a więcej czytelności i poczucia, od czego naprawdę
                warto zacząć. Kwadrans z behawiorystą ma tu własne miejsce i jest osobnym formatem.
              </p>
            </article>

            <div className="authority-side-cards authority-who-grid">
              {whoCards.map((card) => (
                <article key={card.title} className="summary-card tree-backed-card authority-card">
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="editorial-hero-meta top-gap" aria-label="Zakres pracy">
            <span>Psy</span>
            <span>Koty</span>
            <span>Opiekunowie</span>
            <span>Konsultacje behawioralne</span>
            <span>Spokojny plan działania</span>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kwalifikacje">
          <SectionIntro
            eyebrow="Kwalifikacje i źródła"
            title="To, co warto wiedzieć przed pierwszą rozmową"
            description="Pokazuję tylko te punkty, które pomagają zrozumieć sposób pracy i sprawdzić, z kim rozmawiasz."
          />

          <div className="premium-two-column-grid authority-qualifications-grid">
            <article className="summary-card tree-backed-card authority-card authority-qualifications-copy">
              <div className="section-eyebrow">Zaplecze zawodowe</div>
              <h3>Publiczne źródła i punkty odniesienia</h3>
              <p>
                Na tej stronie pokazuję tylko te elementy, które można realnie sprawdzić przed kontaktem: profil CAPBT,
                afiliacje COAPE / CAPBT i istniejące artykuły.
              </p>
              <p>
                To nie ma robić wrażenia samą listą. Ma pomóc spokojnie ocenić, z kim rozmawiasz i czy taki styl pracy
                odpowiada Twojej sytuacji.
              </p>
              <div className="authority-fact-list" aria-label="Publiczne źródła">
                {credentialFacts.map((fact) => (
                  <div key={fact} className="authority-fact-item">
                    <strong>{formatCredentialFact(fact)}</strong>
                  </div>
                ))}
              </div>
              <p className="authority-qualifications-note">Profil CAPBT, organizacje COAPE / CAPBT i publiczne artykuły są poniżej jako osobne punkty do sprawdzenia.</p>
              <a
                href={CAPBT_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="prep-inline-link authority-profile-link"
              >
                <span className="contact-inline-label">Zobacz publiczny profil CAPBT</span>
                <span className="contact-soft-note">profil w katalogu CAPBT Polska / Stowarzyszenia Behawiorystów i Trenerów COAPE</span>
              </a>
            </article>

            <div className="authority-logo-grid">
              {qualificationLogoTiles.map((tile) => (
                <a
                  key={tile.title}
                  href={tile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="summary-card tree-backed-card authority-logo-tile"
                >
                  <div className="authority-logo-mark">
                    <Image
                      src={tile.logo.src}
                      alt={tile.logo.alt}
                      width={tile.logoWidth}
                      height={tile.logoHeight}
                      sizes="(max-width: 980px) 100vw, 320px"
                      className="authority-logo-image"
                    />
                  </div>
                  <div className="authority-logo-copy">
                    <span className="section-eyebrow">{tile.eyebrow}</span>
                    <h3>{tile.title}</h3>
                    <p>{tile.copy}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="authority-proof-grid top-gap">
            {publicProofCards.map((card) => (
              <article key={card.id} className="summary-card tree-backed-card authority-proof-card">
                <div className="section-eyebrow">{card.label}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <a href={card.href} target="_blank" rel="noopener noreferrer" className="prep-inline-link authority-proof-link">
                  {card.cta}
                </a>
              </article>
            ))}
          </div>

          <div className="authority-note-band top-gap">
            <span>
              Te linki i informacje mają dać spokojny kontekst przed kontaktem. Nie zastępują konsultacji, ale pozwalają sprawdzić profil bez opierania decyzji wyłącznie na deklaracjach.
            </span>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="metodyka">
          <SectionIntro
            eyebrow="Jak pracuję"
            title="Jak prowadzę konsultację, żeby była spokojna i konkretna"
            description="Najpierw porządkuję, co dzieje się dziś, potem wybieram pierwszy ruch i oceniam, czy temat wymaga szerszej konsultacji."
          />

          <div className="authority-method-grid">
            {methodCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card authority-card authority-method-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <article className="summary-card tree-backed-card authority-card authority-method-band top-gap">
            <div className="section-eyebrow">Co to oznacza w praktyce</div>
            <h3>Autorytet ma sens tylko wtedy, gdy prowadzi do bezpiecznego pierwszego kroku</h3>
            <p>
              Na pierwszej rozmowie chcę najpierw ustalić, co dziś najbardziej obciąża dom i jaki ruch ma sens teraz.
              Dopiero potem decydujemy, czy to wystarcza, czy temat wymaga pełnej konsultacji 60 min.
            </p>
            <div className="editorial-hero-meta authority-method-tags" aria-label="Elementy sposobu pracy">
              {methodTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="authority-method-ethics">
              <strong>Etyka pracy</strong>
              <p>
                Bez oceniania opiekuna, bez presji na szybki efekt i z jasnym powiedzeniem, kiedy lepiej wrócić do
                tła zdrowotnego albo wejść w szerszą konsultację.
              </p>
            </div>
          </article>

          <div className="hero-actions editorial-final-actions">
            <Link href="#pomagam" prefetch={false} className="prep-inline-link">
              Zobacz, w czym najczęściej pomagam
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="pomagam">
          <SectionIntro
            eyebrow="W czym najczęściej pomagam"
            title="W jakich sytuacjach najczęściej wspieram opiekunów psów i kotów"
            description="Pracuję tam, gdzie potrzebny jest spokojny start i porządek, a nie kolejna warstwa presji."
          />

          <div className="editorial-entry-grid authority-help-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card authority-help-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Nie trzeba znać fachowych nazw. Wystarczy opisać sytuację tak, jak ją widzisz na co dzień i to, co dziś najbardziej zabiera spokój.</p>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="about-help-audio"
            secondaryLocation="about-help-toolkit"
          />

          <div className="top-gap">
            <div className="section-eyebrow">Zobacz strony Pies i Kot</div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={dogsHref}
                prefetch={false}
                className="button button-ghost big-button"
              >
                Pies
              </Link>
              <Link
                href={catsHref}
                prefetch={false}
                className="button button-ghost big-button"
              >
                Kot
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="dlaczego">
          <SectionIntro
            eyebrow="Dlaczego to działa"
            title="Dlaczego spokojne i uporządkowane podejście daje lepszy start niż kolejne przypadkowe rady"
            description="Kiedy najpierw porządkujemy kontekst, łatwiej podjąć sensowną decyzję o pierwszym kroku i nie wrzucać wszystkiego do jednego worka."
          />

          <div className="premium-two-column-grid authority-compare-grid">
            {compareCards.map((card, index) => (
              <article
                key={card.title}
                className={`summary-card tree-backed-card authority-card authority-compare-card${index === 1 ? ' authority-compare-card-accent' : ''}`}
              >
                <div className="section-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <ul className="premium-bullet-list">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="muted top-gap">
            W praktyce zwykle oznacza to mniej improwizacji i szybszą decyzję, czy wystarczy spokojny start audio, czy
            lepiej od razu wejść w pełną konsultację.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie o moim stylu pracy
            </Link>
          </div>
        </section>
        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Głosy po pierwszym kontakcie"
            title="Co opiekunowie cenią w moim sposobie pracy"
            description="To tylko krótki wycinek. Pełniejsza strona opinii pokazuje też opisane sytuacje startowe i publiczne punkty odniesienia."
          />

          <div className="home-opinion-featured-grid authority-opinion-featured-grid top-gap">
            {featuredOpinions.slice(0, 2).map((opinion, index) => (
              <article key={opinion.label} className="home-quote-card authority-quote-card">
                <div className="home-quote-head authority-quote-head">
                  <div className="authority-quote-topline">
                    <span className="home-quote-label">{opinion.label}</span>
                    <span className="authority-quote-order">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="home-quote-context">{opinion.context}</span>
                </div>
                <blockquote className="home-quote-text">„{opinion.quote}”</blockquote>
                <div className="home-quote-footer authority-quote-footer">
                  <span className="home-quote-person">{opinion.signature}</span>
                  <span className="home-quote-note">{opinion.note}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={opinionsHref} prefetch={false} className="prep-inline-link">
              Zobacz pełną stronę opinii i przypadków
            </Link>
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Zobacz najczęstsze pytania o współpracę
            </Link>
          </div>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="about-opinions-audio"
            secondaryLocation="about-opinions-toolkit"
          />
        </section>

        {prepGuide ? (
          <section className="panel section-panel editorial-section" id="lekki-start">
            <SectionIntro
              eyebrow="Lekki start"
              title="Jeśli chcesz zacząć spokojniej niż od razu od rezerwacji"
              description="Na tej stronie materiał przygotowujący pomaga uporządkować myśli przed rozmową. Jeśli chcesz od razu omówić swoją sytuację, najprościej zacząć od Kwadransu z behawiorystą."
            />

            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup magnet={prepGuide} location="about-prep-guide" sourcePage="/o-mnie" />

              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Po co to tutaj</div>
                <h3>Najpierw porządek, potem decyzja</h3>
                <p>
                  Jeśli po przeczytaniu o metodzie pracy chcesz jeszcze spokojnie zebrać opis problemu, ten materiał skraca drogę do sensownej rozmowy.
                </p>
                <p className="muted top-gap-small">
                  Jeśli wiesz już, że potrzebujesz odniesienia do swojej sytuacji, nadal najprościej zacząć od Kwadransu z behawiorystą.
                </p>
                <div className="hero-actions top-gap-small">
                  <Link href="/opinie" prefetch={false} className="prep-inline-link">
                    Zobacz opinie i przykładowe historie
                  </Link>
                  <Link href="/niezbednik" prefetch={false} className="prep-inline-link">
                    Przejdź do Niezbędnika
                  </Link>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania o współpracę i sposób pracy"
            description="Krótko odpowiadam na pytania, które najczęściej pojawiają się przed pierwszym kontaktem."
          />

          <div className="premium-faq-grid authority-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band authority-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Jeśli chcesz zacząć najprościej, wybierz Kwadrans z behawiorystą.</strong>
              <p>Krótka wiadomość ma sens wtedy, gdy chcesz coś doprecyzować przed kontaktem. Jeśli sytuacja wymaga dłuższej rozmowy, możesz od razu wybrać konsultację online 60 min.</p>
            </div>
            <FunnelPrimaryActions
              audioHref={introCallHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="about-faq-audio"
              secondaryLocation="about-faq-toolkit"
            />
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli chcesz spokojnie uporządkować sytuację, zacznij od Kwadransu z behawiorystą</h2>
            <p>
              To najprostszy start. Gdy temat wymaga szerszej analizy, wybierz konsultację online 60 min.
            </p>

            <p className="muted top-gap-small">{COPY_HELPERS.startComparison}</p>

            <FunnelPrimaryActions
              audioHref={introCallHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="about-final-audio"
              secondaryLocation="about-final-toolkit"
              noteClassName="muted home-final-soft-note"
            />
          </div>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/o-mnie"
          ctaHref={introCallHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}



