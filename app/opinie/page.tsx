import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { buildBookHref } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { REAL_CASE_STUDIES } from '@/lib/real-case-studies'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { CASE_STUDY_SELECTIONS, FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'
import {
  CAPBT_PROFILE_URL,
  MEDIA_MENTIONS,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  getPublicContactDetails,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie',
  path: '/opinie',
  description:
    'Zanonimizowane głosy po konsultacjach, przykładowe sytuacje startowe i publiczne źródła prowadzące do spokojnego pierwszego kroku.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type QuoteCard = {
  quote: string
  name: string
  role: string
  tag: string
}

type FeaturedOpinion = QuoteCard & {
  label: string
  context: string
  note: string
}

type OpinionGroup = {
  title: string
  lead: string
  topics: string[]
  items: Array<{
    name: string
    role: string
    context: string
    quote: string
  }>
}

type EffectCard = {
  title: string
  copy: string
}

type ProofStat = {
  value: string
  label: string
  copy: string
}

type ProofResource = {
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

function getSpeciesLabel(species: string) {
  return species === 'pies' ? 'Pies' : 'Kot'
}

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const quickServiceAnalytics = getServiceAnalyticsParams('szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'
const profilePhoto = { src: '/branding/omnie3.png', width: 1024, height: 1536 } as const

const heroSignals = [
  'spacery',
  'reaktywność',
  'kuweta',
  'wycofanie',
  'napięcie w domu',
  'relacje między zwierzętami',
] as const

const heroLeadQuote: QuoteCard = {
  quote:
    'Po konsultacji przestałam próbować pięciu rzeczy naraz. Został jeden plan spacerów i wreszcie wiedziałam, co robić najpierw.',
  name: 'M.',
  role: 'opiekunka psa',
  tag: 'spacery i reaktywność',
}

const featuredOpinions: FeaturedOpinion[] = [
  {
    quote:
      'Po konsultacji przestałam skakać między rozwiązaniami. Został jeden plan spacerów, jasna kolejność i wreszcie wiedziałam, co naprawdę obserwować.',
    name: 'M.K.',
    role: 'pies, Warszawa',
    label: 'Pies',
    context: 'spacery, pobudzenie i pierwszy porządek działania',
    note: 'po pierwszej konsultacji',
    tag: 'problem: spacery i pobudzenie',
  },
  {
    quote:
      'Najbardziej pomogło spokojne uporządkowanie kuwety, przestrzeni i rytmu domu. Temat przestał być chaotyczny, a stał się czytelny i dużo mniej obciążający.',
    name: 'A.P.',
    role: 'kot, Gdańsk',
    label: 'Kot',
    context: 'kuweta, środowisko i napięcie w domu',
    note: 'po pierwszej konsultacji',
    tag: 'problem: kuweta i środowisko',
  },
  {
    quote:
      'To była pierwsza rozmowa, po której poczułam ulgę, a nie więcej presji. Dostałam jasny kierunek, spokojne wytłumaczenie i zero oceniania.',
    name: 'K.S.',
    role: 'pies i kot, online',
    label: 'Styl pracy',
    context: 'spokojny kontakt, jasny język i brak presji',
    note: 'po pierwszym kontakcie',
    tag: 'najczęściej cenione: styl pracy',
  },
]

const opinionGroups: OpinionGroup[] = [
  {
    title: 'Po uporządkowaniu psa',
    lead: 'Spacery, pobudzenie, trudność z mijaniem i chaos na starcie pracy.',
    topics: ['spacery', 'reaktywność', 'pobudzenie'],
    items: [
      {
        name: 'J.',
        role: 'opiekunka psa',
        context: 'po pierwszym planie spacerów',
        quote: 'Wreszcie wiem, co robimy przed spacerem, co w trakcie i jak nie dokładać mu napięcia.',
      },
      {
        name: 'T.',
        role: 'opiekun psa',
        context: 'po uproszczeniu tras i dystansu',
        quote: 'Najwięcej dało uproszczenie tras, dystansu i tempa działania na początku.',
      },
    ],
  },
  {
    title: 'Po uporządkowaniu kota',
    lead: 'Kuweta, środowisko, wycofanie i napięcie po zmianach w domu.',
    topics: ['kuweta', 'wycofanie', 'środowisko'],
    items: [
      {
        name: 'K.',
        role: 'opiekunka kota',
        context: 'po sprawdzeniu środowiska i zasobów',
        quote: 'Kuweta przestała być jedynym miejscem, wokół którego kręcił się cały stres w domu.',
      },
      {
        name: 'M.',
        role: 'opiekun kota',
        context: 'po spokojnym ustawieniu priorytetów',
        quote: 'Najbardziej pomogło spokojne sprawdzenie środowiska, zanim zaczęliśmy cokolwiek zmieniać.',
      },
    ],
  },
  {
    title: 'Po pierwszej rozmowie',
    lead: 'Spokojny kontakt, jasne tłumaczenie i konkretny pierwszy ruch bez nacisku.',
    topics: ['spokój', 'bez oceniania', 'jasny język'],
    items: [
      {
        name: 'A.',
        role: 'opiekunka psa',
        context: 'po pierwszym kontakcie',
        quote: 'Dostałam konkret, a nie ogólne hasła. W końcu wiedziałam, od czego zacząć.',
      },
    ],
  },
]

const selectedCaseStudyIds = CASE_STUDY_SELECTIONS.opinions

const selectedCaseStudies = selectedCaseStudyIds
  .map((id) => REAL_CASE_STUDIES.find((caseStudy) => caseStudy.id === id))
  .filter((caseStudy): caseStudy is (typeof REAL_CASE_STUDIES)[number] => Boolean(caseStudy))

const fallbackCaseStudy = REAL_CASE_STUDIES[0]

if (!fallbackCaseStudy) {
  throw new Error('Missing real case studies content for /opinie.')
}

const displayedCaseStudies = selectedCaseStudies.length > 0 ? selectedCaseStudies : REAL_CASE_STUDIES.slice(0, 4)

const leadCaseStudy = displayedCaseStudies[0] ?? fallbackCaseStudy

const proofStats: ProofStat[] = [
  {
    value: String(REAL_CASE_STUDIES.length),
    label: 'opisanych sytuacji',
    copy: 'z konkretnym punktem wyjścia, pierwszym ruchem i dalszym krokiem',
  },
  {
    value: String(MEDIA_MENTIONS.length),
    label: 'publiczne artykuły',
    copy: 'do sprawdzenia profilu i sposobu mówienia o trudniejszych tematach',
  },
  {
    value: '1',
    label: 'publiczny profil CAPBT',
    copy: 'najprostszy punkt sprawdzenia przed pierwszym kontaktem',
  },
]

const effectCards: EffectCard[] = [
  {
    title: 'Mniej chaosu na starcie',
    copy: 'Łatwiej odróżnić, co jest objawem, a co dziś naprawdę wymaga pierwszego ruchu.',
  },
  {
    title: 'Jeden kierunek zamiast wielu prób',
    copy: 'Po rozmowie zostaje prostsza kolejność działań, a nie lista przypadkowych testów.',
  },
  {
    title: 'Jasność, czy wystarczy 15 min',
    copy: 'Łatwiej ocenić, czy ten etap wystarczy, czy sensowniejsza będzie pełna konsultacja 60 min.',
  },
  {
    title: 'Spokojniejsza decyzja o kolejnym kroku',
    copy: 'Wiesz, co wdrożyć teraz, co obserwować i kiedy wrócić do szerszej pracy.',
  },
]

const proofResources: ProofResource[] = [
  {
    id: 'capbt-profile',
    label: 'Publiczny profil',
    title: 'Profil specjalisty w CAPBT',
    copy: 'Jeśli chcesz sprawdzić afiliację i profil zawodowy przed kontaktem, to najprostszy punkt odniesienia.',
    href: CAPBT_PROFILE_URL,
    cta: 'Otwórz profil',
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

const faqItems = FAQ_SHORTLISTS.opinions

export default function OpinionsPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()
  const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Opinie i przypadki po konsultacjach online.`,
      url: new URL('/opinie', baseUrl).toString(),
      areaServed: [
        { '@type': 'Country', name: 'Polska' },
      ],
      serviceType: [
        'Głosy po konsultacjach i przykładowe sytuacje startowe',
        'Konsultacje behawioralne dla psów i kotów',
        'Spokojny start online',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        image: new URL(profilePhoto.src, baseUrl).toString(),
        description: `${SPECIALIST_CREDENTIALS}.`,
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
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ]

  return (
    <main className="page-wrap marketing-page editorial-home-page opinions-page opinions-dowodowa-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell opinions-hero-shell" id="start">
          <div className="editorial-hero-grid opinions-hero-grid">
            <div className="editorial-hero-copy opinions-hero-copy">
              <div className="section-eyebrow">Opinie po konsultacjach</div>
              <h1>Co opiekunowie mówią o konsultacjach</h1>
              <p className="editorial-hero-lead">
                Konkretne głosy od opiekunów psów i kotów po rozmowach i konsultacjach. Krótko, rzeczowo i bez nadęcia.
              </p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="opinions-hero-audio"
                secondaryLocation="opinions-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions opinions-hero-actions"
              />

              <p className="opinions-hero-note">
                Pokazuję tu krótkie sygnały po konsultacjach, anonimowe podpisy i przykładowe sytuacje startowe. To
                materiał do oceny stylu pracy i sensu pierwszego kroku, a nie obietnica identycznego efektu.
              </p>

              <div className="opinions-hero-signals" aria-label="Najczęstsze tematy">
                {heroSignals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>

            <aside className="opinions-hero-visual" aria-label="Wybrane głosy, profil i mini przypadek">
              <article className="summary-card tree-backed-card opinions-profile-card">
                <div className="opinions-profile-media">
                  <Image
                    src={profilePhoto.src}
                    alt={`${SPECIALIST_NAME} podczas spokojnej pracy z opiekunem psa lub kota`}
                    width={profilePhoto.width}
                    height={profilePhoto.height}
                    sizes="(max-width: 980px) 100vw, 360px"
                    priority
                    loading="eager"
                    fetchPriority="high"
                    className="opinions-profile-photo"
                  />
                </div>
                <div className="opinions-profile-copy">
                  <div className="section-eyebrow">Kto prowadzi</div>
                  <h3>{SPECIALIST_NAME}</h3>
                  <p>Behawiorysta COAPE / CAPBT | psy i koty</p>
                  <span>
                    Spokojny, konkretny start rozmowy. Najpierw porządkuję sytuację, potem wskazuję pierwszy krok i
                    dalszy kierunek pracy.
                  </span>
                </div>
              </article>

              <div className="opinions-hero-proof-grid">
                <article className="summary-card tree-backed-card opinions-hero-proof-card">
                  <div className="section-eyebrow">Co pokazują te opinie</div>
                  <h3>Cytaty są tu w kontekście</h3>
                  <div className="opinions-proof-stat-list">
                    {proofStats.map((item) => (
                      <div key={item.label} className="opinions-proof-stat">
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                        <p>{item.copy}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="summary-card tree-backed-card opinions-hero-case-card">
                <div className="section-eyebrow">Przykładowa sytuacja startowa</div>
                <h3>{leadCaseStudy.headline}</h3>
                <div className="editorial-hero-meta opinions-case-meta" aria-label="Meta przykładowej sytuacji">
                  <span>{getSpeciesLabel(leadCaseStudy.species)}</span>
                  <span>{leadCaseStudy.breed}</span>
                  <span>{leadCaseStudy.age}</span>
                </div>
                <div className="opinions-hero-case-stack">
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">Sytuacja</span>
                    <p>{leadCaseStudy.summary}</p>
                  </div>
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">{leadCaseStudy.firstStepLabel}</span>
                    <p>{leadCaseStudy.firstStepText}</p>
                  </div>
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">{leadCaseStudy.nextStepLabel}</span>
                    <p>{leadCaseStudy.nextStepText}</p>
                  </div>
                </div>
              </article>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Wybrane głosy"
            title="Najczęściej wracają trzy rzeczy: ulga, porządek i spokojny kierunek dalszej pracy"
            description="To krótkie, zanonimizowane głosy po konsultacjach. Pokazują, co realnie zmienia dobrze ustawiony pierwszy kontakt."
          />

          <div className="opinions-featured-grid">
            {featuredOpinions.slice(0, 2).map((opinion, index) => (
              <article
                key={`${opinion.name}-${opinion.tag}`}
                className="summary-card tree-backed-card opinions-featured-card"
              >
                <div className="opinions-featured-head">
                  <div className="opinions-featured-topline">
                    <span className="opinions-featured-label">{opinion.label}</span>
                    <span className="opinions-featured-order">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="opinions-featured-context">{opinion.context}</span>
                </div>

                <blockquote>{opinion.quote}</blockquote>

                <div className="opinions-card-meta opinions-card-meta--featured">
                  <div className="opinions-card-signature">
                    <strong>{opinion.name}</strong>
                    <span>{opinion.role}</span>
                  </div>
                  <span className="opinions-card-note">{opinion.note}</span>
                  <span className="opinions-card-tag">{opinion.tag}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przyk?adowe sytuacje startowe
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Przykładowe sytuacje"
            title="Krótki kontekst problemu, pierwszy ruch i kierunek dalszej pracy"
            description="Te karty opierają się na istniejących opisach przypadków. Zamiast obiecywać identyczny finał pokazują, od czego zwykle zaczyna się porządkowanie tematu."
          />

          <div className="premium-two-column-grid opinions-case-grid">
            {displayedCaseStudies.map((caseStudy) => (
              <article key={caseStudy.id} className="summary-card tree-backed-card opinions-case-card">
                <div className="opinions-case-head">
                  <div className="section-eyebrow">{caseStudy.eyebrow}</div>
                  <h3>{caseStudy.headline}</h3>
                  <div className="editorial-hero-meta opinions-case-meta" aria-label={`Meta przypadku: ${caseStudy.headline}`}>
                    <span>{getSpeciesLabel(caseStudy.species)}</span>
                    <span>{caseStudy.breed}</span>
                    <span>{caseStudy.age}</span>
                  </div>
                </div>

                <div className="opinions-case-lines">
                  <div className="opinions-case-line">
                    <span className="opinions-case-label">Sytuacja</span>
                    <p>{caseStudy.summary}</p>
                  </div>
                  <div className="opinions-case-line">
                    <span className="opinions-case-label">{caseStudy.firstStepLabel}</span>
                    <p>{caseStudy.firstStepText}</p>
                  </div>
                  <div className="opinions-case-line">
                    <span className="opinions-case-label">{caseStudy.nextStepLabel}</span>
                    <p>{caseStudy.nextStepText}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#wiarygodnosc" prefetch={false} className="prep-inline-link">
              Zobacz publiczne ?r?d?a i profile
            </Link>
            <Link
              href={audioHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="funnel_entry_15_min"
              data-analytics-location="opinions-cases-audio"
              data-analytics-cta-label={FUNNEL_CTA_LABELS.primary}
              data-analytics-service="szybka-konsultacja-15-min"
              data-analytics-service-name={String(quickServiceAnalytics.service_name)}
              data-analytics-service-duration={String(quickServiceAnalytics.service_duration)}
              data-analytics-service-price={String(quickServiceAnalytics.service_price)}
            >
              {FUNNEL_CTA_LABELS.primary}
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="wiarygodnosc">
          <SectionIntro
            eyebrow="Poza samą opinią"
            title="Jeśli chcesz sprawdzić profil i publiczne źródła, znajdziesz je tutaj"
            description="Profil CAPBT i publiczne publikacje pomagają spokojnie sprawdzić sposób pracy przed kontaktem."
          />

          <div className="summary-grid opinions-proof-grid">
            {proofResources.map((resource) => (
              <article key={resource.id} className="summary-card tree-backed-card opinions-proof-card">
                <div className="section-eyebrow">{resource.label}</div>
                <h3>{resource.title}</h3>
                <p>{resource.copy}</p>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prep-inline-link opinions-proof-link"
                >
                  {resource.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Dodatkowe informacje"
          title="Dodatkowe informacje i źródła"
          description="Obok cytatów zostają anonimowe historie, publiczne źródła i jasna granica bez obietnic identycznego efektu."
          items={TRUST_SIGNAL_SETS.opinions}
        />

        {prepGuide ? (
          <section className="panel section-panel editorial-section">
            <SectionIntro
              eyebrow="Lekki następny krok"
              title="Jeśli po opiniach chcesz najpierw zobaczyć materiał"
              description="To materiał przygotowujący do rozmowy. Porządkuje start dla osób, które chcą najpierw zebrać myśli."
            />

            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup magnet={prepGuide} location="opinions-prep-guide" sourcePage="/opinie" />
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Po co ten materiał</div>
                <h3>Najpierw uporządkowanie, potem decyzja</h3>
                <p>
                  Jeśli po przeczytaniu historii widzisz, że temat dotyczy też twojej sytuacji, ale wolisz najpierw przygotować opis problemu, ten materiał skraca drogę do sensownej rozmowy.
                </p>
              </article>
            </div>
          </section>
        ) : null}

        <section className="panel section-panel editorial-section" id="efekt">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co najczęściej zmienia dobrze poprowadzona pierwsza rozmowa"
            description="Konsultacja nie obiecuje cudu. Daje zrozumienie i mniejszy chaos, żeby kolejne kroki były prostsze do podjęcia."
          />

          <div className="opinions-effect-grid">
            {effectCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card opinions-effect-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">To zwykle daje największą ulgę: temat przestaje być mgłą, a staje się planem.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Zobacz najczęstsze pytania przed kontaktem
            </Link>
            <Link
              href={audioHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="funnel_entry_15_min"
              data-analytics-location="opinions-effect-audio"
              data-analytics-cta-label={FUNNEL_CTA_LABELS.primary}
              data-analytics-service="szybka-konsultacja-15-min"
              data-analytics-service-name={String(quickServiceAnalytics.service_name)}
              data-analytics-service-duration={String(quickServiceAnalytics.service_duration)}
              data-analytics-service-price={String(quickServiceAnalytics.service_price)}
            >
              {FUNNEL_CTA_LABELS.primary}
            </Link>
          </div>
        </section>

        <EditorialFaqSection
          id="faq"
          title="Najczęstsze pytania po przeczytaniu głosów i sytuacji startowych"
          description="Tu zostaje tylko minimum potrzebne do decyzji: czy zrobić pierwszy krok, czy jeszcze wrócić do publicznych źródeł."
          items={faqItems}
          afterContent={
            <div className="premium-contact-band opinions-contact-band">
              <div className="premium-contact-band-copy">
                <div className="section-eyebrow">Kontakt</div>
                <strong>Jeśli chcesz sprawdzić, czy to dobry moment na kontakt, zacznij od Kwadransu z behawiorystą albo użyj krótkiej wiadomości.</strong>
                <p>Wystarczy krótki opis sytuacji. Jeśli będzie sens, wskażę najprostszy dalszy krok albo pełną konsultację 60 min.</p>
              </div>
              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="opinions-faq-audio"
                secondaryLocation="opinions-faq-toolkit"
              />
            </div>
          }
        />

        <section className="panel cta-panel editorial-final-panel" id="kontakt">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli widzisz w tych głosach coś bliskiego swojej sytuacji, zrób pierwszy spokojny krok</h2>
            <p>
              Nie musisz znaleźć swojej historii opisanej idealnie. Wystarczy, że czujesz, iż potrzebujesz spokojnie
              uporządkować problem i wybrać dobry kierunek działania.
            </p>

            <p className="muted top-gap-small">
              Po konsultacji link do opinii wysyłam osobno. Publicznie pokazuję tylko zanonimizowane, krótkie głosy po ręcznej akceptacji.
            </p>

            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="opinions-final-audio"
              secondaryLocation="opinions-final-toolkit"
            />
          </div>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/opinie"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
