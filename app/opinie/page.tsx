import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { CASE_STUDY_SELECTIONS, FAQ_SHORTLISTS } from '@/lib/trust-layer'
import { REAL_CASE_STUDIES, getRealCaseProofPills, getRealCaseStudyPath } from '@/lib/real-case-studies'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import {
  CAPBT_PROFILE_URL,
  MEDIA_MENTIONS,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_NAME,
  SPECIALIST_PUBLIC_PROFILE_URLS,
  SPECIALIST_PUBLIC_PROOF_SUMMARY,
  SPECIALIST_PUBLIC_STATUS,
  getPublicContactDetails,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie o konsultacjach behawioralnych',
  path: '/opinie',
  description:
    'Krótkie głosy po konsultacjach, przykładowe sytuacje startowe i publiczne sygnały zaufania przed pierwszym kontaktem.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type OpinionCard = {
  quote: string
  name: string
  signature: string
  label: string
  problemType: string
  cooperationStage: string
  format: string
  outcome: string
}

type TrustCard = {
  eyebrow: string
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
const contactHref = '/kontakt#formularz'
const profilePhoto = { src: '/branding/omnie3.png', width: 1024, height: 1536 } as const

const heroSignals = ['spacery', 'reaktywność', 'kuweta', 'wycofanie', 'napięcie w domu', 'relacje między zwierzętami'] as const

const opinionCards: OpinionCard[] = [
  {
    quote:
      'Po konsultacji przestałam skakać między rozwiązaniami. Został jeden plan spacerów, jasna kolejność i wreszcie wiedziałam, co naprawdę obserwować.',
    name: 'M.K.',
    signature: 'opiekunka psa',
    label: 'Pies',
    problemType: 'spacery i pobudzenie',
    cooperationStage: 'po pierwszej konsultacji',
    format: 'po pełnej konsultacji',
    outcome: 'jeden plan spacerów i czytelne obserwacje zamiast wielu technik naraz',
  },
  {
    quote:
      'Najbardziej pomogło spokojne uporządkowanie kuwety, przestrzeni i rytmu domu. Temat przestał być chaotyczny, a stał się czytelny i dużo mniej obciążający.',
    name: 'A.P.',
    signature: 'opiekunka kota',
    label: 'Kot',
    problemType: 'kuweta i środowisko',
    cooperationStage: 'po pierwszej konsultacji',
    format: 'po pełnej konsultacji',
    outcome: 'porządek w środowisku i mniej napięcia zamiast kolejnych losowych zmian',
  },
  {
    quote:
      'To była pierwsza rozmowa, po której poczułam ulgę, a nie więcej presji. Dostałam jasny kierunek, spokojne wytłumaczenie i zero oceniania.',
    name: 'K.S.',
    signature: 'opiekunka psa i kota',
    label: 'Styl pracy',
    problemType: 'niepewność, od czego zacząć',
    cooperationStage: 'po pierwszym kontakcie',
    format: 'po Kwadransie',
    outcome: 'jasny dalszy krok bez presji i bez oceniania',
  },
]

const selectedCaseStudies = CASE_STUDY_SELECTIONS.opinions
  .map((id) => REAL_CASE_STUDIES.find((caseStudy) => caseStudy.id === id))
  .filter((caseStudy): caseStudy is (typeof REAL_CASE_STUDIES)[number] => Boolean(caseStudy))

const featuredCaseStudies = (selectedCaseStudies.length > 0 ? selectedCaseStudies : REAL_CASE_STUDIES).slice(0, 3)
const leadCaseStudy = featuredCaseStudies[0] ?? REAL_CASE_STUDIES[0]
const faqItems = FAQ_SHORTLISTS.opinions.slice(0, 3)

if (!leadCaseStudy) {
  throw new Error('Missing real case studies content for /opinie.')
}

const trustCards: TrustCard[] = [
  {
    eyebrow: 'CAPBT',
    title: 'Publiczny profil specjalisty',
    copy: 'Status i profil są widoczne publicznie. Na stronie zostaje ta sama, ostrożna warstwa opisu kwalifikacji.',
    href: CAPBT_PROFILE_URL,
    cta: 'Otwórz profil',
  },
  {
    eyebrow: 'Publikacje',
    title: `${MEDIA_MENTIONS.length} opublikowane artykuły`,
    copy: 'Możesz sprawdzić publiczne publikacje i zobaczyć, jak opisywane są podobne tematy poza samą stroną sprzedażową.',
    href: MEDIA_MENTIONS[0]?.href ?? '/blog',
    cta: MEDIA_MENTIONS[0] ? 'Zobacz artykuł' : 'Zobacz blog',
  },
  {
    eyebrow: 'Przypadki',
    title: `${REAL_CASE_STUDIES.length} opisanych sytuacji startowych`,
    copy: 'Na tej stronie zostają skrócone historie z kontekstem problemu, pierwszym krokiem i pierwszym efektem.',
    href: '/historie',
    cta: 'Zobacz historie',
  },
]

export default function OpinionsPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Opinie i przykładowe sytuacje po konsultacjach online.`,
      url: new URL('/opinie', baseUrl).toString(),
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      serviceType: ['Opinie po konsultacjach', 'Przykładowe sytuacje startowe', 'Konsultacje behawioralne dla psów i kotów'],
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
      ctaLabel="15-minutowa konsultacja behawioralna"
      footerPrimaryHref={audioHref}
      footerPrimaryLabel="15-minutowa konsultacja behawioralna"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <section className="editorial-hero-shell opinions-hero-shell" id="start">
          <div className="editorial-hero-grid opinions-hero-grid">
            <div className="editorial-hero-copy opinions-hero-copy">
              <div className="section-eyebrow">Opinie po konsultacjach</div>
              <h1>Co opiekunowie mówią o konsultacjach</h1>
              <p className="editorial-hero-lead">
                Krótkie głosy po konsultacjach i kilka przykładowych sytuacji startowych. To ma pomóc ocenić styl pracy i pierwszy efekt, nie obiecywać
                identycznego wyniku.
              </p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="opinions-hero-audio"
                secondaryLocation="opinions-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions opinions-hero-actions"
                note={
                  <>
                    Jeśli po tych historiach widzisz coś bliskiego swojej sytuacji, zacznij od spokojnego pierwszego kroku albo użyj{' '}
                    <Link href={contactHref} prefetch={false} className="prep-inline-link">
                      krótkiej wiadomości
                    </Link>
                    .
                  </>
                }
              />

              <div className="opinions-hero-signals" aria-label="Najczęstsze tematy">
                {heroSignals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>

            <aside className="opinions-hero-visual" aria-label="Profil i przykładowy start">
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
                  <span>{SPECIALIST_PUBLIC_PROOF_SUMMARY}</span>
                </div>
              </article>

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
                </div>
              </article>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="3 głosy po konsultacjach"
            title="Najmocniejsze opinie po pierwszym etapie pracy."
            description="Krótko: co uporządkował pierwszy krok i z jakiego typu sytuacją to przyszło."
          />

          <div className="card-grid three-up">
            {opinionCards.map((opinion) => (
              <article key={`${opinion.name}-${opinion.problemType}`} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{opinion.label}</div>
                <blockquote>{opinion.quote}</blockquote>
                <div className="editorial-hero-meta top-gap-small" aria-label={`Meta opinii ${opinion.name}`}>
                  <span>{opinion.problemType}</span>
                  <span>{opinion.cooperationStage}</span>
                  <span>{opinion.format}</span>
                </div>
                <p className="top-gap-small">{opinion.outcome}</p>
                <div className="muted top-gap-small">
                  <strong>{opinion.name}</strong> | {opinion.signature}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="3 przykładowe przypadki"
            title="Kontekst problemu, pierwszy ruch i dalszy kierunek."
            description="Te karty pokazują, od czego zwykle zaczyna się porządkowanie tematu po rozmowie."
          />

          <div className="premium-two-column-grid opinions-case-grid">
            {featuredCaseStudies.map((caseStudy) => (
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
                </div>
                <div className="top-gap-small">
                  <Link href={getRealCaseStudyPath(caseStudy)} prefetch={false} className="prep-inline-link">
                    Czytaj całą historię
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="zaufanie">
          <SectionIntro
            eyebrow="3 sygnały zaufania"
            title="Co możesz sprawdzić publicznie."
            description="Bez dodatkowych warstw sprzedażowych: profil, publikacje i opisane sytuacje startowe."
          />

          <div className="card-grid three-up">
            {trustCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={card.href} prefetch={false} className="prep-inline-link">
                    {card.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <EditorialFaqSection
          id="faq"
          title="Najczęstsze pytania po przeczytaniu opinii"
          description="Trzy najważniejsze odpowiedzi przed pierwszym kontaktem."
          items={faqItems}
        />

        <section className="panel cta-panel editorial-final-panel" id="kontakt">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli widzisz tu coś bliskiego swojej sytuacji, zrób pierwszy spokojny krok</h2>
            <p>Nie musisz znaleźć historii identycznej z Twoją. Wystarczy krótki opis sytuacji i decyzja, od jakiego formatu chcesz zacząć.</p>

            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="opinions-final-audio"
              secondaryLocation="opinions-final-toolkit"
              note={
                <>
                  Jeśli nie masz pewności, czy wystarczy Kwadrans, napisz{' '}
                  <Link href={contactHref} prefetch={false} className="prep-inline-link">
                    wiadomość
                  </Link>
                  .
                </>
              }
            />
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
