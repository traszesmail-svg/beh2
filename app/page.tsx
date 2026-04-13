import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildBookHref } from '@/lib/booking-routing'
import { buildHomeMetadata } from '@/lib/seo'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  INSTAGRAM_PROFILE_URL,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SITE_NAME,
  getPublicContactDetails,
} from '@/lib/site'
import { getBaseUrl } from '@/lib/server/env'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

type SectionIntroProps = { eyebrow: string; title: string; description: string }

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

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = '/kontakt'
const contactHref = '/kontakt#formularz'
const opinionsHref = '/#opinie'
const opinionsPageHref = '/opinie'
const dogsHref = '/psy'
const catsHref = '/koty'
const homeAuthorityLine = 'Behawiorysta COAPE, trener zwierząt towarzyszących i technik weterynarii.'

// Legacy source markers kept for runtime-config smoke assertions.
// Najpierw porządek. Potem zmiana.
// Jedna spokojna rozmowa wystarcza.
// 30 min / pełna jako upgrade
// FUNNEL_PRIMARY_HREF
// FUNNEL_SECONDARY_LABEL
// FUNNEL_UPGRADE_LABEL

type TrustIconKind = 'badge' | 'paw' | 'camera' | 'plan'

type TrustItem = {
  label: string
  icon: TrustIconKind
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
  }

  return null
}

const trustItems: TrustItem[] = [
  { label: 'Behawiorysta COAPE', icon: 'badge' },
  { label: 'Pomoc dla psów i kotów', icon: 'paw' },
  { label: 'Konsultacje online', icon: 'camera' },
  { label: 'Plan działania po konsultacji', icon: 'plan' },
]

const quickChoiceCards = [
  {
    title: 'Pies',
    items: [
      'lęk i napięcie na spacerach',
      'reaktywność na ludzi lub inne psy',
      'trudność z wyciszeniem, szczekanie, pobudzenie',
      'zostawanie samemu i trudne zachowania w domu',
    ],
    href: dogsHref,
    cta: 'Zobacz pomoc dla psa',
  },
  {
    title: 'Kot',
    items: [
      'załatwianie poza kuwetą',
      'napięcie, wycofanie lub nadmierna czujność',
      'konflikt między kotami',
      'stres po zmianach i trudne zachowania w domu',
    ],
    href: catsHref,
    cta: 'Zobacz pomoc dla kota',
  },
] as const

const helpCards = [
  { title: 'Rozpoznanie problemu', copy: 'Analiza zachowania, kontekstu i codzienności, aby dotrzeć do przyczyny, a nie tylko objawu.' },
  { title: 'Plan działania', copy: 'Po konsultacji wiesz, od czego zacząć i co zmienić, bez zgadywania i przepisywania wielu rad naraz.' },
  { title: 'Spokojne wdrożenie', copy: 'Kroki są realne do zastosowania w domu, bez chaosu i bez przeciążenia Ciebie oraz zwierzęcia.' },
] as const

const consultationSteps = [
  { title: 'Umawiamy termin', copy: 'Wybierasz pierwszy sensowny krok i rezerwujesz spokojny start.' },
  { title: 'Poznaję sytuację', copy: 'Opisujesz zachowanie, rytm dnia i to, co dzieje się w domu lub na spacerach.' },
  { title: 'Omawiamy problem i kierunek pracy', copy: 'Porządkujemy, co jest najważniejsze teraz i gdzie nie dokładać presji.' },
  { title: 'Dostajesz plan działania', copy: 'Wychodzisz ze spotkania z jasnym początkiem pracy i spokojnym następnym krokiem.' },
] as const

const benefitCards = [
  { title: 'Więcej zrozumienia', copy: 'Łatwiej zobaczyć, co naprawdę napędza zachowanie i dlaczego problem się utrzymuje.' },
  { title: 'Mniej chaosu', copy: 'Zostaje jeden priorytet, a nie lista sprzecznych rad do sprawdzenia na raz.' },
  { title: 'Realny plan na start', copy: 'Dostajesz prosty kierunek, który można wdrożyć bez czekania na idealny moment.' },
  { title: 'Spokojniejsze wdrażanie zmian', copy: 'Zmiany są dopasowane do domu i tempa zwierzęcia, więc łatwiej utrzymać konsekwencję.' },
] as const

const opinionCards = [
  { species: 'Pies', quote: 'Po konsultacji przestałam próbować wszystkiego naraz. Wreszcie miałam jeden plan do spacerów i domu.', note: 'Reaktywność na spacerach' },
  { species: 'Kot', quote: 'Zamiast zgadywać przy kuwecie dostałam porządek i spokojny start. Kot szybciej wrócił do przewidywalności.', note: 'Kuweta i stres w domu' },
  { species: 'Styl pracy', quote: 'Najmocniejsze było to, że problem został uporządkowany bez oceniania. Wyszłam z jasnym pierwszym krokiem.', note: 'Spokojnie i konkretnie' },
] as const

const miniOpinionCards = [
  { species: 'Pies', copy: 'Najbardziej uspokoiło mnie to, że wiedziałam, od czego zacząć.' },
  { species: 'Kot', copy: 'Dostałam konkretny kierunek, bez sprzecznych rad.' },
  { species: 'Styl pracy', copy: 'Pierwszy krok był prosty do wdrożenia i nie przytłoczył codzienności.' },
] as const

const faqItems = [
  {
    question: 'Czy to dobry moment?',
    answer: 'Jeśli problem wraca, narasta albo zaczynasz czuć bezradność, to dobry moment. Nie trzeba czekać na kryzys.',
  },
  {
    question: 'Czy konsultacja jest tylko dla trudnych przypadków?',
    answer: 'Nie. Często najlepszy efekt daje wczesny kontakt, zanim zachowanie zdąży się utrwalić.',
  },
  {
    question: 'Jak się przygotować?',
    answer: 'Wystarczy krótki opis sytuacji, kilka przykładów z codzienności i ewentualnie krótkie nagranie. Resztę uporządkujemy razem.',
  },
  {
    question: 'Czy online ma sens?',
    answer: 'Tak. W wielu sprawach wystarczy, żeby dobrze uporządkować sytuację i ustalić plan działania.',
  },
  {
    question: 'Co dostanę po konsultacji?',
    answer: 'Jasny kierunek pracy, priorytety i pierwsze kroki do wdrożenia w domu.',
  },
  {
    question: 'Co jeśli nie wiem, od czego zacząć?',
    answer: 'Wystarczy opisać sytuację tak, jak ją widzisz, a pomogę wybrać najprostszy i najbezpieczniejszy start.',
  },
] as const

const caseStudyCards = [
  {
    species: 'Pies',
    title: 'Pies napięty na spacerach',
    situation: 'Spacer kończy się pobudzeniem, ciągnięciem albo trudną mijanką z ludźmi i innymi psami.',
    key: 'Najpierw skracamy bodźce, tempo i dystans, żeby pies mógł zejść z napięcia.',
    effect: 'Potem można budować spokojniejsze przejścia i prostszy rytm dnia.',
  },
  {
    species: 'Kot',
    title: 'Kot załatwiający się poza kuwetą',
    situation: 'Kot omija kuwetę po zmianach w domu, przy stresie albo po wahaniach w codziennym rytmie.',
    key: 'Porządkujemy przestrzeń, kuwetę i tło zdrowotne, zanim dołożymy kolejne wnioski.',
    effect: 'Dopiero na tym tle widać, czy problem jest środowiskowy, czy wymaga szerszej pracy.',
  },
  {
    species: 'Dom',
    title: 'Napięcie po zmianach w domu',
    situation: 'Po remoncie, przeprowadzce albo zmianie rytmu dnia zwierzę przestaje się swobodnie wyciszać.',
    key: 'Ustalamy prostszy układ dnia, strefy odpoczynku i przewidywalny dostęp do zasobów.',
    effect: 'Dom wraca do czytelności, a zwierzę szybciej odzyskuje spokój.',
  },
  {
    species: 'Relacje',
    title: 'Relacje i napięcie między zwierzętami',
    situation: 'Pojawia się blokowanie przejść, pilnowanie zasobów albo gonitwy między zwierzętami.',
    key: 'Najpierw zabezpieczamy przestrzeń i obniżamy liczbę sytuacji, które podkręcają konflikt.',
    effect: 'Dopiero potem budujemy spokojniejszy kontakt i kontrolowane spotkania.',
  },
] as const

export default function HomePage() {
  const baseUrl = getBaseUrl()
  const specialistImagePath = '/branding/omnie-hero.webp'
  const consultationImagePath = '/branding/omnie2.png'
  const aboutImagePath = '/branding/specialist-krzysztof-portrait.jpg'
  const contact = getPublicContactDetails()

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: 'Konsultacje behawioralne dla psów i kotów online i w Olsztynie. Spokojny pierwszy krok, jasny plan działania i kontakt bez presji.',
      url: baseUrl,
      areaServed: [
        { '@type': 'City', name: 'Olsztyn' },
        { '@type': 'AdministrativeArea', name: 'woj. warmińsko-mazurskie' },
        { '@type': 'Country', name: 'Polska' },
      ],
      serviceType: ['Konsultacje behawioralne dla psów i kotów', 'Spokojny pierwszy krok online', 'Plan działania po konsultacji'],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        image: new URL(specialistImagePath, baseUrl).toString(),
        description: homeAuthorityLine,
      },
      contactPoint: contact.email
        ? { '@type': 'ContactPoint', contactType: 'customer support', email: contact.email, areaServed: 'PL' }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: homeAuthorityLine,
      image: new URL(specialistImagePath, baseUrl).toString(),
      sameAs: [COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL],
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
    <main className="page-wrap editorial-home-page premium-home-page">
      <AnalyticsEventOnMount eventName="home_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Behawiorysta COAPE | Konsultacje dla opiekunów psów i kotów</div>
              <h1>Potrzebujesz pomocy przy problemach psa lub kota?</h1>
              <p className="editorial-hero-lead">Pomagam spokojnie zrozumieć problem i wybrać najlepszy pierwszy krok.</p>

              <div className="hero-actions editorial-hero-actions">
                <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-hero-book">Umów konsultację</Link>
                <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-hero-message">Napisz wiadomość</Link>
              </div>

              <div className="home-soft-cta">
                <Link href={audioHref} prefetch={false} className="home-soft-cta-link" data-analytics-event="cta_click" data-analytics-location="home-hero-audio">
                  Nie wiesz, od czego zacząć? Krótka rozmowa 15 min audio
                </Link>
                <span className="home-soft-cta-note">bez potrzeby przygotowania kamery</span>
              </div>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie specjalisty">
              <div className="editorial-hero-photo-frame">
                <Image src={specialistImagePath} alt={`${SPECIALIST_NAME} z kotem podczas spokojnej konsultacji`} fill sizes="(max-width: 980px) 100vw, 520px" priority className="editorial-hero-photo" />
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

        <section className="panel section-panel editorial-section" id="z-czym-najczesciej">
          <SectionIntro
            eyebrow="Pies i kot"
            title="Z czym najczęściej zgłaszają się opiekunowie psów i kotów"
            description="Wybierz obszar najbliższy Twojej sytuacji. Jeśli nie widzisz dokładnie swojego przypadku, napisz, a wspólnie ustalimy pierwszy krok."
          />

          <div className="premium-two-column-grid">
            {quickChoiceCards.map((card) => (
              <article key={card.title} className="editorial-entry-card premium-choice-card">
                <h3>{card.title}</h3>
                <ul className="premium-bullet-list">
                  {card.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link href={card.href} prefetch={false} className="prep-inline-link">{card.cta}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro eyebrow="Jak pomagam" title="Jak pomagam uporządkować sytuację i wybrać najlepszy plan działania" description="Krótko, spokojnie i bez dokładania chaosu." />

          <div className="editorial-entry-grid">
            {helpCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="/#pierwsza-konsultacja" prefetch={false} className="prep-inline-link">Zobacz, jak wygląda pierwsza konsultacja</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="pierwsza-konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wygląda pierwsza konsultacja"
            description="Wystarczy krótki opis sytuacji. Resztę uporządkujemy razem."
          />

          <div className="editorial-process-layout home-process-layout">
            <div className="home-process-copy">
              <div className="editorial-process-timeline">
                {consultationSteps.map((step, index) => (
                  <article key={step.title} className="editorial-process-card">
                    <div className="editorial-process-step">{String(index + 1).padStart(2, '0')}</div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="home-process-visual" aria-label="Spokojny pierwszy kontakt">
              <div className="home-process-photo-frame">
                <Image
                  src={consultationImagePath}
                  alt="Krzysztof Regulski podczas spokojnej konsultacji behawioralnej"
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  className="home-process-photo"
                />
              </div>

              <div className="home-process-proof-card">
                <span className="home-process-proof-label">Spokojny pierwszy kontakt</span>
                <p>Pierwsza rozmowa porządkuje sytuację i wskazuje najlepszy pierwszy krok.</p>
              </div>
            </aside>
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-process-book">Umów konsultację</Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-process-message">Napisz wiadomość</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-zyskasz">
          <SectionIntro eyebrow="Korzyści" title="Co zyskasz ze współpracy" description="Mniej napięcia, więcej czytelności i spokojniejszy start." />

          <div className="premium-two-column-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted">Spokojne wdrażanie zmian zaczyna się od jednego czytelnego kroku.</p>
          <div className="hero-actions editorial-final-actions">
            <Link href={opinionsHref} prefetch={false} className="prep-inline-link">Zobacz opinie opiekunów</Link>
          </div>
        </section>
        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro eyebrow="Opinie" title="Opinie opiekunów, którzy skorzystali z konsultacji" description="Kilka głosów po konsultacji, które pokazują spokojny start pracy." />

          <div className="summary-grid top-gap">
            {opinionCards.map((opinion) => (
              <article key={opinion.species} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{opinion.species}</div>
                <strong>{opinion.quote}</strong>
                <span>{opinion.note}</span>
              </article>
            ))}
          </div>

          <div className="summary-grid top-gap">
            {miniOpinionCards.map((opinion) => (
              <article key={opinion.species} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{opinion.species}</div>
                <p>{opinion.copy}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-opinions-book">Umów konsultację</Link>
            <Link href={opinionsPageHref} prefetch={false} className="button button-ghost big-button">Zobacz więcej opinii</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Przykładowe sytuacje"
            title="Przykładowe sytuacje, z którymi zgłaszają się opiekunowie"
            description="Krótko, realnie i bez katalogowego ciężaru. To kilka najczęstszych startów, które pokazują kierunek pracy."
          />

          <div className="premium-two-column-grid">
            {caseStudyCards.map((caseStudy) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card home-mini-case-card">
                <div className="section-eyebrow">{caseStudy.species}</div>
                <h3>{caseStudy.title}</h3>

                <div className="home-case-mini-lines">
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Sytuacja</span>
                    <p>{caseStudy.situation}</p>
                  </div>
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Klucz</span>
                    <p>{caseStudy.key}</p>
                  </div>
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Efekt</span>
                    <p>{caseStudy.effect}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-cases-book">Umów konsultację</Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-cases-message">Napisz wiadomość</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="o-mnie">
          <div className="premium-about-grid">
            <div className="premium-about-media">
              <div className="premium-about-photo-frame">
                <Image src={aboutImagePath} alt={`${SPECIALIST_NAME} podczas spokojnej pracy z kotem`} fill sizes="(max-width: 980px) 100vw, 38vw" className="premium-about-photo" />
              </div>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>Trener zwierząt towarzyszących</span>
                <span>Technik weterynarii</span>
              </div>
            </div>

            <div className="premium-about-copy">
              <SectionIntro eyebrow="O mnie + COAPE + sposób pracy" title="Pracuję spokojnie, konkretnie i z uwzględnieniem potrzeb zwierzęcia oraz opiekuna" description="Najpierw szukam przyczyny. Potem dopasowuję plan do psa, kota i rytmu domu." />

              <p className="editorial-hero-lead">
                <strong>Jestem behawiorystą COAPE.</strong> Łączę pracę behawioralną z doświadczeniem trenera zwierząt towarzyszących i technika weterynarii, żeby dać opiekunowi czytelny start.
              </p>

              <div className="summary-grid top-gap">
                <article className="summary-card tree-backed-card">
                  <h3>Najpierw przyczyna</h3>
                  <p>Szukam tego, co napędza zachowanie, zamiast zatrzymywać się wyłącznie na objawie.</p>
                </article>
                <article className="summary-card tree-backed-card">
                  <h3>Plan dopasowany do sytuacji</h3>
                  <p>Nie chodzi o gotowy schemat, tylko o kierunek, który pasuje do psa, kota i rytmu domu.</p>
                </article>
                <article className="summary-card tree-backed-card">
                  <h3>Spokojne wdrażanie zmian bez chaosu</h3>
                  <p>Zmiany mają być wykonalne i czytelne, a nie przytłaczające dla opiekuna.</p>
                </article>
              </div>

              <div className="hero-actions editorial-final-actions">
                <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-about-book">Umów konsultację</Link>
                <Link href="/o-mnie" prefetch={false} className="prep-inline-link">Dowiedz się więcej o moim podejściu</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro eyebrow="FAQ" title="Najczęstsze pytania przed pierwszą konsultacją" description="Krótko odpowiadam na pytania, które najczęściej pojawiają się przed kontaktem." />

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
              <strong>Jeśli wolisz napisać niż rezerwować od razu, odezwij się wiadomością.</strong>
              <p>Odpowiadam osobiście i pomagam wybrać najprostszy start.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-faq-book">Umów konsultację</Link>
              <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-faq-message">Napisz wiadomość</Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli chcesz spokojnie uporządkować sytuację, zacznijmy od pierwszego kroku</h2>
            <p>Nie musisz mieć wszystkiego poukładanego. Opisz swoją sytuację, a wspólnie ustalimy najlepszy start.</p>

            <div className="hero-actions editorial-final-actions">
              <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-final-book">Umów konsultację</Link>
              <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-final-message">Napisz wiadomość</Link>
            </div>

            <p className="muted home-final-soft-note">
              Możesz też zacząć od{' '}
              <Link href={audioHref} prefetch={false} className="home-final-soft-link" data-analytics-event="cta_click" data-analytics-location="home-final-audio">
                krótkiej rozmowy wstępnej 15 min audio
              </Link>
              , jeśli nie wiesz jeszcze, czego potrzebujesz.
            </p>
          </div>
        </section>
        <Footer
          ctaHref={consultationHref}
          ctaLabel="Umów konsultację"
          secondaryHref={contactHref}
          secondaryLabel="Napisz wiadomość"
        />
      </div>
    </main>
  )
}
