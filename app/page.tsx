import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { buildBookHref } from '@/lib/booking-routing'
import { REAL_CASE_STUDIES } from '@/lib/real-case-studies'
import { buildHomeMetadata } from '@/lib/seo'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  INSTAGRAM_PROFILE_URL,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  buildMailtoHref,
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

const consultationHref = buildBookHref()
const contactHref = '/kontakt'
const opinionsHref = '/opinie'
const dogsHref = '/psy'
const catsHref = '/koty'

// Legacy source markers kept for runtime-config smoke assertions.
// Najpierw porządek. Potem zmiana.
// Jedna spokojna rozmowa wystarcza.
// PDF będzie drugim krokiem, a nie pierwszym skrótem.
// 15 minut na start
// PDF jako spokojny drugi krok
// 30 min / pełna jako upgrade
// FUNNEL_PRIMARY_HREF
// FUNNEL_SECONDARY_LABEL
// FUNNEL_UPGRADE_LABEL

const trustItems = ['Behawiorysta COAPE', 'Pomoc dla psów i kotów', 'Online i stacjonarnie w Olsztynie', 'Plan działania po konsultacji']

const quickChoiceCards = [
  {
    title: 'Pies',
    intro: 'Najczęściej zgłaszane tematy:',
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
    intro: 'Najczęściej zgłaszane tematy:',
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
  { species: 'Ogólna', quote: 'Najmocniejsze było to, że problem został uporządkowany bez oceniania. Wyszłam z jasnym pierwszym krokiem.', note: 'Najważniejsza opinia' },
] as const

const miniOpinionCards = [
  { species: 'Pies', copy: 'Najbardziej uspokoiło mnie to, że wiedziałam, od czego zacząć.' },
  { species: 'Kot', copy: 'Dostałam konkretny kierunek, bez sprzecznych rad.' },
  { species: 'Dom', copy: 'Pierwszy krok był prosty do wdrożenia i nie przytłoczył codzienności.' },
] as const

const faqItems = [
  {
    question: 'Skąd mam wiedzieć, czy to dobry moment na konsultację?',
    answer: 'Jeśli problem wraca, narasta albo zaczynasz czuć, że kręcisz się w kółko, to dobry moment. Nie trzeba czekać, aż sytuacja stanie się skrajna.',
  },
  {
    question: 'Czy konsultacja jest tylko dla trudnych, poważnych przypadków?',
    answer: 'Nie. Często najlepszy efekt daje wczesny kontakt, zanim zachowanie zdąży się utrwalić albo rozlać na kolejne sytuacje.',
  },
  {
    question: 'Jak przygotować się do pierwszego spotkania?',
    answer: 'Wystarczy krótki opis sytuacji, kilka przykładów z codzienności i jeśli masz - krótkie nagranie zachowania. Resztę uporządkujemy razem.',
  },
  {
    question: 'Czy konsultacja online ma sens?',
    answer: 'Tak, szczególnie kiedy trzeba uporządkować sytuację, zobaczyć rytm dnia i ustalić plan działania. W wielu sprawach to w pełni wystarcza na dobry start.',
  },
  {
    question: 'Co dostanę po konsultacji?',
    answer: 'Dostajesz jasny kierunek pracy, priorytety i kolejne kroki do wdrożenia w domu. Celem jest porządek, a nie przytłoczenie listą zaleceń.',
  },
  {
    question: 'Co jeśli nie wiem, od czego zacząć?',
    answer: 'To wystarczy napisać. Opisz sytuację tak, jak ją widzisz, a pomogę wybrać najprostszy i najbezpieczniejszy pierwszy krok.',
  },
] as const

const caseStudyOrder = ['case-02', 'case-06', 'case-05'] as const
export default function HomePage() {
  const baseUrl = getBaseUrl()
  const specialistImagePath = '/branding/omnie-hero.webp'
  const aboutImagePath = '/branding/specialist-krzysztof-portrait.jpg'
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Behawiorysta COAPE',
        'Dzień dobry,\n\nchciałbym opisać sytuację psa lub kota i ustalić najlepszy pierwszy krok.\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- co najbardziej mnie niepokoi:\n',
      )
    : null

  const caseStudies = caseStudyOrder
    .map((id) => REAL_CASE_STUDIES.find((caseStudy) => caseStudy.id === id))
    .filter((caseStudy): caseStudy is (typeof REAL_CASE_STUDIES)[number] => Boolean(caseStudy))

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Olsztyn, woj. warmińsko-mazurskie i online.`,
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
        description: `${SPECIALIST_CREDENTIALS}.`,
      },
      contactPoint: contact.email
        ? { '@type': 'ContactPoint', contactType: 'customer support', email: contact.email, areaServed: 'PL' }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: `${SITE_TAGLINE}.`,
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

      <header className="premium-home-header">
        <div className="container premium-home-header-inner">
          <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
            <span className="brand-copy">
              <span className="brand">{SITE_SHORT_NAME}</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </span>
          </Link>

          <nav className="premium-home-nav" aria-label="Główna nawigacja">
            <a href="#jak-pomagam" className="header-link">Jak pomagam</a>
            <a href="#pierwsza-konsultacja" className="header-link">Pierwsza konsultacja</a>
            <a href="#opinie" className="header-link">Opinie</a>
            <a href="#faq" className="header-link">FAQ</a>
          </nav>

          <Link
            href={consultationHref}
            prefetch={false}
            className="button button-primary big-button premium-home-header-cta"
            data-analytics-event="cta_click"
            data-analytics-location="header"
          >
            Umów konsultację
          </Link>
        </div>
      </header>

      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Behawiorysta COAPE | Konsultacje dla opiekunów psów i kotów</div>
              <h1>Potrzebujesz pomocy przy problemach psa lub kota?</h1>
              <p className="editorial-hero-lead">Pomagam spokojnie zrozumieć problem, uporządkować sytuację i wybrać najlepszy pierwszy krok.</p>

              <div className="hero-actions editorial-hero-actions">
                <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-hero-book">Umów konsultację</Link>
                <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-hero-message">Napisz wiadomość</Link>
              </div>

              <Link href={consultationHref} prefetch={false} className="prep-inline-link">Nie wiesz, od czego zacząć? Krótka rozmowa wstępna 15 min</Link>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie specjalisty">
              <div className="editorial-hero-photo-frame">
                <Image src={specialistImagePath} alt={`${SPECIALIST_NAME} z kotem podczas spokojnej konsultacji`} fill sizes="(max-width: 980px) 100vw, 520px" priority className="editorial-hero-photo" />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny pierwszy krok</span>
                  <strong>Jedna rozmowa pomaga zobaczyć, co napędza problem i od czego zacząć.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="premium-trust-strip panel">
          {trustItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <section className="panel section-panel editorial-section" id="z-czym-najczesciej">
          <SectionIntro eyebrow="Szybki wybór pies / kot" title="Z czym najczęściej zgłaszają się opiekunowie psów i kotów" description="Najpierw patrzę, co naprawdę obciąża codzienność, a dopiero potem wybieram najlepszy start." />

          <div className="premium-two-column-grid">
            {quickChoiceCards.map((card) => (
              <article key={card.title} className="editorial-entry-card premium-choice-card">
                <div className="section-eyebrow">{card.intro}</div>
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
          <SectionIntro eyebrow="Jak pomagam" title="Jak pomagam uporządkować sytuację i wybrać najlepszy plan działania" description="Krótko, spokojnie i bez dokładania kolejnej warstwy chaosu." />

          <div className="editorial-entry-grid">
            {helpCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#pierwsza-konsultacja" prefetch={false} className="prep-inline-link">Zobacz, jak wygląda pierwsza konsultacja</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="pierwsza-konsultacja">
          <SectionIntro eyebrow="Pierwsza konsultacja" title="Jak wygląda pierwsza konsultacja krok po kroku" description="Wystarczy opis sytuacji. Resztę uporządkujemy razem." />

          <div className="editorial-process-layout">
            <div className="editorial-process-timeline">
              {consultationSteps.map((step, index) => (
                <article key={step.title} className="editorial-process-card">
                  <div className="editorial-process-step">{String(index + 1).padStart(2, '0')}</div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>

            <aside className="editorial-process-note" aria-label="Ważna notatka">
              <span className="editorial-process-note-label">Ważne</span>
              <strong>Nie musisz wszystkiego wiedzieć przed spotkaniem.</strong>
              <p>Wystarczy, że opiszesz swoją sytuację - resztę uporządkujemy razem.</p>
            </aside>
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-process-book">Umów pierwszą konsultację</Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-process-message">Napisz wiadomość</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-zyskasz">
          <SectionIntro eyebrow="Co zyskasz ze współpracy" title="Co zyskasz ze współpracy" description="Mniej napięcia, więcej czytelności i spokojniejszy start pracy." />

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
          <SectionIntro eyebrow="Opinie" title="Opinie opiekunów, którzy skorzystali z konsultacji" description="Krótko i bez ciężkiego slidera. Kilka głosów, które pokazują, jak zmienia się start pracy." />

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
            <Link href={opinionsHref} prefetch={false} className="button button-ghost big-button">Zobacz więcej opinii</Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro eyebrow="Przypadki" title="Przykładowe sytuacje, z którymi zgłaszają się opiekunowie" description="Nie jako spektakl. Po prostu kilka realnych startów, które dobrze pokazują kierunek pracy." />

          <div className="real-case-grid">
            {caseStudies.map((caseStudy) => (
              <article key={caseStudy.id} className="real-case-card" data-case-id={caseStudy.id}>
                <div className="real-case-gallery" aria-label={`${caseStudy.headline} - zdjęcia`}>
                  {caseStudy.images.map((image, index) => (
                    <figure key={`${caseStudy.id}-${index}`} className="real-case-gallery-item">
                      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 32vw" loading="lazy" className="real-case-gallery-image" />
                    </figure>
                  ))}
                </div>

                <div className="real-case-copy">
                  <div className="section-eyebrow">{caseStudy.eyebrow}</div>
                  <div className="real-case-meta" aria-label="Meta przypadku">
                    <span>{caseStudy.breed}</span>
                    <span>{caseStudy.age}</span>
                  </div>
                  <h3>{caseStudy.headline}</h3>
                  <p>{caseStudy.summary}</p>

                  <div className="real-case-detail">
                    <strong>{caseStudy.firstStepLabel}</strong>
                    <span>{caseStudy.firstStepText}</span>
                  </div>

                  <div className="real-case-next">
                    <strong>{caseStudy.nextStepLabel}</strong>
                    <span>{caseStudy.nextStepText}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-cases-book">Umów konsultację</Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-cases-message">Masz podobną sytuację? Napisz wiadomość</Link>
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
                <span>{SPECIALIST_LOCATION}</span>
                <span>Online i stacjonarnie</span>
              </div>
            </div>

            <div className="premium-about-copy">
              <SectionIntro eyebrow="O mnie + COAPE + sposób pracy" title="Pracuję spokojnie, konkretnie i z uwzględnieniem potrzeb zwierzęcia oraz opiekuna" description="Najpierw szukam przyczyny, potem dopasowuję plan i dbam o to, żeby wdrożenie było realne." />

              <p className="editorial-hero-lead"><strong>Jestem behawiorystą COAPE.</strong> Pracuję z psami i kotami tak, żeby lepiej zrozumieć zachowanie, uporządkować codzienność i wybrać pierwszy krok, który ma sens w konkretnym domu.</p>

              <div className="summary-grid top-gap">
                <article className="summary-card tree-backed-card">
                  <h3>Zrozumienie przyczyny, nie tylko objawu</h3>
                  <p>Szukam tego, co napędza zachowanie, zamiast zatrzymywać się wyłącznie na widocznym problemie.</p>
                </article>
                <article className="summary-card tree-backed-card">
                  <h3>Plan dopasowany do konkretnej sytuacji</h3>
                  <p>Nie chodzi o gotowy schemat, tylko o kierunek, który pasuje do psa, kota i rytmu domu.</p>
                </article>
                <article className="summary-card tree-backed-card">
                  <h3>Spokojne wdrażanie zmian bez chaosu</h3>
                  <p>Zmiany mają być wykonalne i czytelne, a nie przytłaczające dla opiekuna.</p>
                </article>
              </div>

              <div className="hero-actions editorial-final-actions">
                <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-about-book">Umów konsultację</Link>
                <Link href="/o-mnie" prefetch={false} className="prep-inline-link">Zobacz, jak pracuję</Link>
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
            <p>Nie musisz mieć wszystkiego poukładanego przed kontaktem. Opisz swoją sytuację, a wspólnie ustalimy najlepszy sposób rozpoczęcia pracy.</p>

            <div className="hero-actions editorial-final-actions">
              <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="home-final-book">Umów konsultację</Link>
              <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="home-final-message">Napisz wiadomość</Link>
            </div>

            <div className="editorial-final-badges" aria-label="Dodatkowa informacja">
              <span>Behawiorysta COAPE</span>
              <span>Psy i koty</span>
              <span>Możesz zacząć od 15 min</span>
            </div>

            <p className="muted">Możesz też zacząć od krótkiej rozmowy wstępnej 15 min, jeśli nie wiesz jeszcze, czego potrzebujesz.</p>
          </div>
        </section>
        <footer className="premium-home-footer editorial-home-footer" aria-label="Stopka">
          <div className="premium-footer-grid">
            <div>
              <div className="section-eyebrow">Regulski</div>
              <h3>{SITE_NAME}</h3>
              <p>{SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacje dla psów i kotów w Olsztynie i online.</p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>{SPECIALIST_LOCATION}</span>
                <span>COAPE / CAPBT</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Skrócona nawigacja</div>
              <div className="premium-footer-links editorial-home-footer-links">
                <a href="#jak-pomagam">Jak pomagam</a>
                <a href="#pierwsza-konsultacja">Pierwsza konsultacja</a>
                <a href="#opinie">Opinie</a>
                <a href="#faq">FAQ</a>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Kontakt</div>
              <div className="premium-footer-links">
                <Link href={consultationHref} prefetch={false}>Umów konsultację</Link>
                <Link href={contactHref} prefetch={false}>Napisz wiadomość</Link>
                {contact.email && mailtoHref ? <a href={mailtoHref}>{contact.email}</a> : <Link href={contactHref} prefetch={false}>Przejdź do kontaktu</Link>}
                <a href={COAPE_ORG_URL} target="_blank" rel="noopener noreferrer">COAPE</a>
                <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">CAPBT</a>
              </div>
            </div>
          </div>

          <div className="premium-footer-bottom">
            <div className="premium-footer-legal">
              <Link href="/polityka-prywatnosci" prefetch={false}>Polityka prywatności</Link>
              <span>·</span>
              <Link href="/regulamin" prefetch={false}>Regulamin</Link>
            </div>

            <div className="premium-footer-credit">
              <span>© {new Date().getFullYear()} {SITE_SHORT_NAME}</span>
              <a href={CAPBT_ORG_URL} target="_blank" rel="noopener noreferrer">behawioryscicoape.pl</a>
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
