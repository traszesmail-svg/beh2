import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { REAL_CASE_STUDIES, getRealCaseProofPills } from '@/lib/real-case-studies'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { CASE_STUDY_SELECTIONS, FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'
import {
  CAPBT_PROFILE_URL,
  MEDIA_MENTIONS,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_NAME,
  SPECIALIST_PUBLIC_PROFILE_URLS,
  SPECIALIST_PUBLIC_PROOF_SUMMARY,
  SPECIALIST_PUBLIC_STATUS,
  SPECIALIST_STATUS_EXPLANATION,
  getPublicContactDetails,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie o konsultacjach behawioralnych',
  path: '/opinie',
  description:
    'Krótkie głosy po konsultacjach, przykładowe sytuacje i spokojny obraz tego, jak zwykle wygląda pierwszy kontakt.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type OpinionCaseCard = {
  quote: string
  name: string
  signature: string
  label: string
  problemType: string
  cooperationStage: string
  format: string
  context: string
  outcome: string
  note: string
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

const opinionCaseCards: OpinionCaseCard[] = [
  {
    quote:
      'Po konsultacji przestałam skakać między rozwiązaniami. Został jeden plan spacerów, jasna kolejność i wreszcie wiedziałam, co naprawdę obserwować.',
    name: 'M.K.',
    signature: 'opiekunka psa, Warszawa',
    label: 'Pies',
    problemType: 'spacery, pobudzenie, mijanki',
    cooperationStage: 'po pierwszej konsultacji',
    format: 'po 60 min',
    context: 'start od chaosu na spacerach i kilku niespójnych prób działania',
    outcome: 'jeden plan spacerów i czytelne obserwacje zamiast wielu technik naraz',
    note: 'po pierwszej konsultacji',
  },
  {
    quote:
      'Najbardziej pomogło spokojne uporządkowanie kuwety, przestrzeni i rytmu domu. Temat przestał być chaotyczny, a stał się czytelny i dużo mniej obciążający.',
    name: 'A.P.',
    signature: 'opiekunka kota, Gdańsk',
    label: 'Kot',
    problemType: 'kuweta, środowisko, napięcie w domu',
    cooperationStage: 'po pierwszej konsultacji',
    format: 'po 60 min',
    context: 'temat wracał mimo zmian żwirku i ustawienia kuwety',
    outcome: 'porządek w środowisku i mniej napięcia zamiast kolejnych losowych zmian',
    note: 'po pierwszej konsultacji',
  },
  {
    quote:
      'To była pierwsza rozmowa, po której poczułam ulgę, a nie więcej presji. Dostałam jasny kierunek, spokojne wytłumaczenie i zero oceniania.',
    name: 'K.S.',
    signature: 'opiekunka psa i kota, konsultacja online',
    label: 'Styl pracy',
    problemType: 'niepewność od czego zacząć',
    cooperationStage: 'po pierwszym kontakcie',
    format: 'po Kwadransie',
    context: 'potrzeba spokojnego uporządkowania sytuacji przed decyzją o dalszej pracy',
    outcome: 'jasny dalszy krok bez presji i bez oceniania',
    note: 'po pierwszym kontakcie',
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
    label: 'przykładowych sytuacji',
    copy: 'każda z opisanym typem problemu, formatem pracy, etapem i przybliżonym czasem',
  },
  {
    value: String(MEDIA_MENTIONS.length),
    label: 'opublikowane artykuły',
    copy: 'dla osób, które chcą przeczytać więcej o podobnych tematach',
  },
  {
    value: '1',
    label: 'publiczny profil CAPBT',
    copy: 'krótka informacja o kwalifikacjach i obecności w katalogu',
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
    copy: SPECIALIST_STATUS_EXPLANATION,
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
        jobTitle: SPECIALIST_PUBLIC_STATUS,
        image: new URL(profilePhoto.src, baseUrl).toString(),
        description: SPECIALIST_PUBLIC_PROOF_SUMMARY,
        sameAs: [...SPECIALIST_PUBLIC_PROFILE_URLS],
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
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Opinie', path: '/opinie' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Opinie / historie po rozmowie"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
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
                To krótkie głosy po konsultacjach i przykładowe sytuacje, które pokazują, jak zwykle zaczyna się taka
                praca. Przy kartach zostają też typ problemu, format kontaktu, etap współpracy i przybliżony czas
                pierwszych zmian. Każda sprawa wymaga osobnej oceny.
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
                    alt=""
                    aria-hidden="true"
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
                  <p>{SPECIALIST_PUBLIC_STATUS} | psy i koty</p>
                  <span>
                    {SPECIALIST_PUBLIC_PROOF_SUMMARY} Spokojny, konkretny start rozmowy: najpierw porządek w sytuacji,
                    potem pierwszy krok i dalszy kierunek pracy.
                  </span>
                </div>
              </article>

              <div className="opinions-hero-proof-grid">
                <article className="summary-card tree-backed-card opinions-hero-proof-card">
                  <div className="section-eyebrow">Co pokazują te opinie</div>
                  <h3>Najczęściej wraca ulga, porządek i jaśniejszy dalszy krok</h3>
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
                  {getRealCaseProofPills(leadCaseStudy).map((pill) => (
                    <span key={`${leadCaseStudy.id}-${pill}`}>{pill}</span>
                  ))}
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
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">Źródło kontekstu i pierwszy efekt</span>
                    <p>
                      {leadCaseStudy.proof.sourceContext}. Efekt pierwszego etapu: {leadCaseStudy.proof.outcomeSnapshot}.
                    </p>
                  </div>
                </div>
              </article>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Półzweryfikowane case cards"
            title="Nie same cytaty, tylko krótki obraz sytuacji, etapu współpracy i pierwszego efektu"
            description="Każda karta łączy głos opiekuna z kontekstem problemu, formatem kontaktu i tym, co realnie uporządkował pierwszy krok."
          />

          <div className="opinions-featured-grid">
            {opinionCaseCards.map((opinion, index) => (
              <article
                key={`${opinion.name}-${opinion.problemType}`}
                className="summary-card tree-backed-card opinions-featured-card"
              >
                <div className="opinions-featured-head">
                  <div className="opinions-featured-topline">
                    <span className="opinions-featured-label">{opinion.label}</span>
                    <span className="opinions-featured-order">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="opinions-featured-context">{opinion.context}</span>
                  <div className="opinions-featured-pills" aria-label={`Metadane opinii ${opinion.name}`}>
                    <span>{opinion.problemType}</span>
                    <span>{opinion.cooperationStage}</span>
                    <span>{opinion.format}</span>
                  </div>
                </div>

                <blockquote>{opinion.quote}</blockquote>

                <div className="opinions-featured-outcome">
                  <span className="opinions-case-label">Co uporządkował pierwszy krok</span>
                  <p>{opinion.outcome}</p>
                </div>

                <div className="opinions-card-meta opinions-card-meta--featured">
                  <div className="opinions-card-signature">
                    <strong>{opinion.name}</strong>
                    <span>{opinion.signature}</span>
                  </div>
                  <span className="opinions-card-note">{opinion.note}</span>
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
            description="Te karty pokazują, od czego zwykle zaczyna się porządkowanie tematu, w jakim formacie toczył się pierwszy etap i jaki ruch bywa sensowny."
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
                    {getRealCaseProofPills(caseStudy).map((pill) => (
                      <span key={`${caseStudy.id}-${pill}`}>{pill}</span>
                    ))}
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
                  <div className="opinions-case-line">
                    <span className="opinions-case-label">Źródło kontekstu i pierwszy efekt</span>
                    <p>
                      {caseStudy.proof.sourceContext}. Efekt pierwszego etapu: {caseStudy.proof.outcomeSnapshot}.
                    </p>
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
            eyebrow="Profil i publikacje"
            title="Jeśli chcesz, możesz zajrzeć też tutaj"
            description="Krótko: publiczny profil CAPBT, spójny opis statusu i opublikowane artykuły."
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
          eyebrow="Warto wiedzieć"
          title="Kilka ważnych dopowiedzeń"
          description="Krótko o tym, jak czytać te głosy i przykłady."
          items={TRUST_SIGNAL_SETS.opinions}
        />

        {prepGuide ? (
          <section className="panel section-panel editorial-section">
            <SectionIntro
              eyebrow="Lekki następny krok"
              title="Jeśli po opiniach chcesz najpierw sięgnąć po materiał"
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
            title="Co najczęściej daje pierwsza rozmowa"
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

          <p className="muted top-gap">Najczęściej o to właśnie chodzi na starcie: mniej chaosu i jaśniejszy plan.</p>

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
          description="Tu zostają najważniejsze odpowiedzi przed pierwszym kontaktem."
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
              Pokazuję tu tylko krótkie głosy po konsultacjach i kilka przykładowych sytuacji.
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

      </div>
    </NotatnikPageShell>
  )
}
