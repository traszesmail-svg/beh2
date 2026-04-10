import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SocialProofSection } from '@/components/SocialProofSection'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import { getBaseUrl } from '@/lib/server/env'
import {
  buildMailtoHref,
  getPublicContactDetails,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie i przypadki',
  path: '/opinie',
  description:
    'Premium strona dowodowa marki Regulski z opiniami opiekunów, mini przypadkami i FAQ, prowadząca do konsultacji lub wiadomości.',
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

type OpinionGroup = {
  title: string
  lead: string
  topics: string[]
  items: Array<{
    name: string
    role: string
    quote: string
  }>
}

type MiniCaseStudy = {
  title: string
  label: string
  situation: string
  key: string
  effect: string
}

type EffectCard = {
  title: string
  copy: string
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

const consultationHref = buildBookHref()
const contactHref = '/kontakt'

const heroProblemPills = [
  'spacery',
  'reaktywność',
  'kuweta',
  'wycofanie',
  'napięcie w domu',
  'relacje między zwierzętami',
] as const

const heroReviewCards: QuoteCard[] = [
  {
    quote:
      'Po konsultacji przestałam szukać kolejnych trików. Został jeden plan na spacer i jasne zasady, dzięki czemu pies szybciej się uspokajał.',
    name: 'M.',
    role: 'opiekunka psa',
    tag: 'spacery i reaktywność',
  },
  {
    quote:
      'Najwięcej dało uporządkowanie kuwet, kryjówek i rytmu domu. Kot przestał być stale napięty, a ja przestałam zgadywać.',
    name: 'A.',
    role: 'opiekunka kota',
    tag: 'kuweta i napięcie',
  },
]

const featuredOpinions: QuoteCard[] = [
  {
    quote:
      'Po konsultacji przestałam wymieniać metodę co dwa dni. Został jeden plan na spacer i dokładnie wiedziałam, co obserwować.',
    name: 'M.',
    role: 'opiekunka psa',
    tag: 'spacery i reaktywność',
  },
  {
    quote:
      'Najbardziej pomogło uporządkowanie kuwet, kryjówek i całego rytmu domu. Kot przestał być stale napięty, a ja wiedziałam, co sprawdzić po kolei.',
    name: 'A.',
    role: 'opiekunka kota',
    tag: 'kuweta i napięcie',
  },
  {
    quote:
      'Spokojne wyjaśnienie całego procesu zrobiło dużą różnicę. Zamiast poczucia, że robię wszystko źle, dostałam prosty plan i logiczny kierunek.',
    name: 'K.',
    role: 'opiekunka psa i kota',
    tag: 'styl pracy',
  },
]

const groupedOpinionSections: OpinionGroup[] = [
  {
    title: 'Pies',
    lead: 'Spacery, reaktywność, pobudzenie, zachowania w domu i rozłąka.',
    topics: ['spacery', 'reaktywność', 'pobudzenie', 'rozłąka'],
    items: [
      { name: 'J.', role: 'opiekunka psa', quote: 'Spacer przestał zaczynać się od napięcia.' },
      { name: 'M.', role: 'opiekun psa', quote: 'Wreszcie wiem, kiedy odpuścić, a kiedy działać.' },
      { name: 'A.', role: 'opiekunka psa', quote: 'Mniej improwizacji, więcej porządku w domu.' },
      { name: 'T.', role: 'opiekun psa', quote: 'Najbardziej pomogło uproszczenie kolejności kroków.' },
    ],
  },
  {
    title: 'Kot',
    lead: 'Kuweta, wycofanie, napięcie, relacje między kotami i zmiana zachowania.',
    topics: ['kuweta', 'wycofanie', 'napięcie', 'relacje'],
    items: [
      { name: 'K.', role: 'opiekunka kota', quote: 'Kuweta przestała być jedynym punktem napięcia.' },
      { name: 'A.', role: 'opiekun kota', quote: 'Po raz pierwszy widzę, co sprawdzać po kolei.' },
      { name: 'M.', role: 'opiekunka kota', quote: 'Kot szybciej wraca do spokoju po zmianach w domu.' },
      { name: 'P.', role: 'opiekun kota', quote: 'Nie czułem presji, tylko jasny kierunek.' },
    ],
  },
  {
    title: 'Styl pracy',
    lead: 'Spokój, brak oceniania, jasne tłumaczenie i konkretne wskazówki.',
    topics: ['spokój', 'brak oceniania', 'jasne tłumaczenie', 'konkretne wskazówki'],
    items: [
      { name: 'J.', role: 'opiekunka psa', quote: 'Spokojnie, bez oceniania i bez pośpiechu.' },
      { name: 'M.', role: 'opiekun kota', quote: 'Wszystko było wyjaśnione prostym językiem.' },
      { name: 'A.', role: 'opiekunka psa', quote: 'Najpierw zrozumienie, potem konkretne kroki.' },
      { name: 'K.', role: 'opiekunka psa i kota', quote: 'Dostałam plan, który dało się wdrożyć od razu.' },
    ],
  },
]

const miniCaseStudies: MiniCaseStudy[] = [
  {
    title: 'Pies napięty na spacerach',
    label: 'Pies',
    situation:
      'Na spacerze pies napinał się już przed wyjściem, ciągnął do bodźców i po powrocie wciąż nie mógł odpuścić.',
    key: 'Kluczowe było skrócenie najbardziej pobudzających tras, większy dystans od wyzwalaczy i spokojniejszy rytm wyjścia.',
    effect: 'Najpierw pies ma przestrzeń do myślenia, dopiero potem dokładamy kolejne kroki.',
  },
  {
    title: 'Kot załatwiający się poza kuwetą',
    label: 'Kot',
    situation:
      'Po zmianach w domu kot zaczął omijać kuwetę, częściej się chował i wyraźnie zmienił rytm korzystania z przestrzeni.',
    key: 'Kluczowe było sprawdzenie tła zdrowotnego, ustawienia kuwet, zapachów i tego, czy kot ma wystarczająco spokojny dostęp do zasobów.',
    effect: 'Najpierw porządek w środowisku, potem dopiero ocena, co jeszcze wymaga dalszej pracy.',
  },
  {
    title: 'Napięcie po zmianach w domu',
    label: 'Dom',
    situation:
      'Po przeprowadzce albo remoncie zwierzę staje się bardziej czujne i trudniej mu wrócić do odpoczynku.',
    key: 'Kluczowe było uproszczenie otoczenia, przewidywalny rytm dnia i ograniczenie sytuacji, które stale podnoszą napięcie.',
    effect: 'Na spokojniejszym tle łatwiej ocenić, czy temat wygasa, czy trzeba prowadzić go dalej.',
  },
  {
    title: 'Relacje i napięcie między zwierzętami',
    label: 'Relacje',
    situation:
      'Między zwierzętami nie musi być otwartej bójki, żeby dom był napięty: wystarczą blokowanie przejść, pilnowanie zasobów i czujność przy mijaniu.',
    key: 'Kluczowe było rozdzielenie zasobów, uproszczenie kontaktu i przywrócenie przewidywalności.',
    effect: 'Dopiero potem ma sens planowanie bezpiecznych, krótkich spotkań na warunkach obu zwierząt.',
  },
]

const effectCards: EffectCard[] = [
  {
    title: 'Więcej jasności',
    copy: 'Łatwiej zobaczyć, co naprawdę napędza zachowanie i od czego zacząć.',
  },
  {
    title: 'Mniej przypadkowych prób',
    copy: 'Zamiast skakać między rozwiązaniami, masz jeden kierunek i kolejne kroki.',
  },
  {
    title: 'Spokojniejszy start pracy',
    copy: 'Pierwsze zmiany są prostsze do wdrożenia i mniej obciążają dom.',
  },
  {
    title: 'Większe poczucie kierunku',
    copy: 'Wiesz, co ma sens teraz, a co można odłożyć bez straty.',
  },
]

const faqItems = [
  {
    question: 'Co jeśli moja sytuacja nie wygląda dokładnie jak pokazane przypadki?',
    answer:
      'To normalne. Pokazuję podobne sytuacje, ale plan zawsze dopasowuję do konkretnego domu, rytmu dnia i zwierzęcia.',
  },
  {
    question: 'Czy opinie i przypadki oznaczają, że u mnie będzie dokładnie tak samo?',
    answer:
      'Nie. To nie są obietnice identycznego efektu, tylko praktyczne przykłady tego, jak zwykle porządkuje się temat na początku.',
  },
  {
    question: 'Czy konsultacja ma sens, jeśli problem mojego psa albo kota jest bardziej złożony?',
    answer:
      'Tak. Złożone sprawy często najbardziej potrzebują spokojnego ustawienia priorytetów i pierwszego czytelnego kierunku.',
  },
  {
    question: 'Co najczęściej daje pierwsza konsultacja?',
    answer:
      'Najczęściej daje większe zrozumienie sytuacji, mniejszy chaos i plan pierwszych kroków, który da się wdrożyć bez zgadywania.',
  },
  {
    question: 'Czy muszę mieć już wszystko dobrze opisane przed kontaktem?',
    answer:
      'Nie. Wystarczy krótki opis, kilka przykładów i to, co widzisz na co dzień. Resztę porządkujemy razem.',
  },
  {
    question: 'Skąd mam wiedzieć, czy to dobry moment, żeby się odezwać?',
    answer:
      'Jeśli temat wraca, zaczyna zabierać spokój albo czujesz, że potrzebujesz uporządkować problem, to dobry moment na kontakt.',
  },
] as const

export default function OpinionsPage() {
  const baseUrl = getBaseUrl()
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Opinie i przypadki',
        `Dzień dobry,\n\nchciałbym/chciałabym opisać sytuację psa lub kota i zapytać o najprostszy kolejny krok.\n\n- co się dzieje:\n- od kiedy trwa:\n- co już próbowałem/próbowałam:\n- czego teraz potrzebuję:\n`,
      )
    : null

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
      serviceType: [
        'Konsultacje behawioralne dla psów i kotów',
        'Pomoc przy spacerach, reaktywności i kuwecie',
        'Krótka rozmowa wstępna 15 min',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        image: new URL('/images/hero-main.png', baseUrl).toString(),
        description: `${SPECIALIST_CREDENTIALS}.`,
      },
      contactPoint: contact.email
        ? {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email,
            areaServed: 'PL',
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
    <main className="page-wrap marketing-page editorial-home-page opinions-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <header className="premium-home-header">
          <div className="premium-home-header-inner">
            <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
              <span className="brand">Regulski</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </Link>

            <nav className="premium-home-nav" aria-label="Nawigacja na stronie opinii">
              <a href="#opinie" className="header-link">
                Opinie
              </a>
              <a href="#przypadki" className="header-link">
                Przypadki
              </a>
              <a href="#faq" className="header-link">
                FAQ
              </a>
              <a href="#kontakt" className="header-link">
                Kontakt
              </a>
            </nav>

            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button premium-home-header-cta"
              data-analytics-event="cta_click"
              data-analytics-location="opinions-header-book"
            >
              Umów konsultację
            </Link>
          </div>
        </header>

        <section className="editorial-hero-shell opinions-hero-shell" id="start">
          <div className="editorial-hero-grid opinions-hero-grid">
            <div className="editorial-hero-copy opinions-hero-copy">
              <div className="section-eyebrow">Opinie opiekunów i przykładowe sytuacje z konsultacji</div>
              <h1>Prawdziwe opinie i realne sytuacje opiekunów psów i kotów</h1>
              <p className="editorial-hero-lead">
                Ta strona pokazuje, z jakimi problemami zgłaszają się opiekunowie oraz co najczęściej daje dobrze
                poprowadzona konsultacja: więcej zrozumienia, mniej chaosu i jaśniejszy plan działania.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="opinions-hero-book"
                >
                  Umów konsultację
                </Link>
                <Link
                  href="#opinie"
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="opinions-hero-opinions"
                >
                  Zobacz opinie
                </Link>
              </div>

              <p className="opinions-hero-note">
                Najczęściej wracają tematy: spacery, reaktywność, kuweta, wycofanie, napięcie w domu i relacje
                między zwierzętami.
              </p>

              <div className="editorial-hero-meta opinions-hero-meta" aria-label="Najczęstsze problemy">
                {heroProblemPills.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <aside className="opinions-hero-visual" aria-label="Wybrane opinie i mini przypadek">
              <article className="summary-card tree-backed-card opinions-hero-card opinions-hero-card--review opinions-hero-card--dog">
                <div className="section-eyebrow">Opiekunka psa</div>
                <blockquote>{heroReviewCards[0].quote}</blockquote>
                <div className="opinions-card-meta">
                  <strong>{heroReviewCards[0].name}</strong>
                  <span>{heroReviewCards[0].role}</span>
                  <span className="opinions-card-tag">{heroReviewCards[0].tag}</span>
                </div>
              </article>

              <article className="summary-card tree-backed-card opinions-hero-card opinions-hero-card--review opinions-hero-card--cat">
                <div className="section-eyebrow">Opiekunka kota</div>
                <blockquote>{heroReviewCards[1].quote}</blockquote>
                <div className="opinions-card-meta">
                  <strong>{heroReviewCards[1].name}</strong>
                  <span>{heroReviewCards[1].role}</span>
                  <span className="opinions-card-tag">{heroReviewCards[1].tag}</span>
                </div>
              </article>

              <article className="summary-card tree-backed-card opinions-hero-card opinions-hero-card--case">
                <div className="section-eyebrow">Mini przypadek</div>
                <h3>{miniCaseStudies[0].title}</h3>
                <div className="opinions-hero-case-stack">
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">Sytuacja</span>
                    <p>{miniCaseStudies[0].situation}</p>
                  </div>
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">Co było kluczowe</span>
                    <p>{miniCaseStudies[0].key}</p>
                  </div>
                  <div className="opinions-case-detail">
                    <span className="opinions-case-label">Efekt / kierunek pracy</span>
                    <p>{miniCaseStudies[0].effect}</p>
                  </div>
                </div>
              </article>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Wybrane opinie"
            title="Najczęściej powtarza się jedno: po konsultacji robi się jaśniej i spokojniej"
            description="To nie są ogólne pochwały. To krótkie, konkretne głosy o tym, co realnie zmienia pierwszy porządek w problemie."
          />

          <div className="summary-grid opinions-featured-grid">
            {featuredOpinions.map((opinion) => (
              <article
                key={`${opinion.name}-${opinion.tag}`}
                className="summary-card tree-backed-card opinions-featured-card"
              >
                <blockquote>{opinion.quote}</blockquote>
                <div className="opinions-card-meta">
                  <strong>{opinion.name}</strong>
                  <span>{opinion.role}</span>
                  <span className="opinions-card-tag">{opinion.tag}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie-pogrupowane" prefetch={false} className="prep-inline-link">
              Zobacz więcej opinii psów i kotów
            </Link>
          </div>
        </section>

        <SocialProofSection />

        <section className="panel section-panel editorial-section" id="opinie-pogrupowane">
          <SectionIntro
            eyebrow="Opinie w grupach"
            title="Opinie, które najczęściej powtarzają się w trzech obszarach"
            description="Żeby łatwiej znaleźć coś podobnego do własnej sytuacji, zebrane są tu krótsze, pogrupowane głosy opiekunów."
          />

          <div className="summary-grid opinions-group-grid">
            {groupedOpinionSections.map((group) => (
              <article key={group.title} className="summary-card tree-backed-card opinions-group-card">
                <div className="section-eyebrow">Najczęstsze głosy</div>
                <h3>{group.title}</h3>
                <p className="opinions-group-lead">{group.lead}</p>

                <div className="editorial-hero-meta opinions-group-topics" aria-label={`Najczęstsze tematy: ${group.title}`}>
                  {group.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>

                <div className="opinions-mini-list">
                  {group.items.map((item) => (
                    <div key={`${group.title}-${item.name}-${item.quote}`} className="opinions-mini-item">
                      <strong>
                        {item.name}, {item.role}
                      </strong>
                      <span>{item.quote}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykładowe sytuacje z konsultacji
            </Link>
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="opinions-group-book"
            >
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje, z którymi zgłaszają się opiekunowie"
            description="Krótkie, realne scenariusze pokazujące punkt wyjścia, co było kluczowe i jaki kierunek pracy zwykle ma sens na początku."
          />

          <div className="premium-two-column-grid opinions-case-grid">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card opinions-case-card">
                <div className="section-eyebrow">{caseStudy.label}</div>
                <h3>{caseStudy.title}</h3>
                <p>
                  <strong>Sytuacja:</strong> {caseStudy.situation}
                </p>
                <p>
                  <strong>Co było kluczowe:</strong> {caseStudy.key}
                </p>
                <p>
                  <strong>Efekt / kierunek pracy:</strong> {caseStudy.effect}
                </p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#co-zmienia-konsultacja" prefetch={false} className="prep-inline-link">
              Zobacz, co najczęściej zmienia dobrze poprowadzona konsultacja
            </Link>
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="opinions-cases-book"
            >
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-zmienia-konsultacja">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co najczęściej zmienia dobrze poprowadzona konsultacja"
            description="Konsultacja nie obiecuje cudu. Daje zrozumienie i mniejszy chaos, żeby kolejne kroki były prostsze do podjęcia."
          />

          <div className="premium-two-column-grid opinions-effect-grid">
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
              href={consultationHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="opinions-effect-book"
            >
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania po przeczytaniu opinii i przykładów sytuacji"
            description="Tu zbieram obawy, które zwykle pojawiają się, kiedy ktoś widzi siebie w tych historiach, ale jeszcze chce się upewnić."
          />

          <div className="premium-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band opinions-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Jeśli chcesz sprawdzić, czy to dobry moment na kontakt, napisz wiadomość.</strong>
              <p>Wystarczy krótki opis sytuacji. Jeśli będzie sens, wskażę najprostszy dalszy krok.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="opinions-faq-book"
              >
                Umów konsultację
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="opinions-faq-message"
              >
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="kontakt">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>
              Jeśli widzisz w tych historiach coś podobnego do swojej sytuacji, zacznijmy od pierwszego kroku
            </h2>
            <p>
              Nie musisz znaleźć swojej sytuacji idealnie opisanej w jednym przypadku. Wystarczy, że czujesz, że
              potrzebujesz spokojnie uporządkować problem i wybrać dobry kierunek działania.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="opinions-final-book"
              >
                Umów konsultację
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="opinions-final-message"
              >
                Napisz wiadomość
              </Link>
            </div>

            <p className="muted">
              Jeśli nie masz jeszcze pewności, możesz zacząć od krótkiej rozmowy wstępnej 15 min.
            </p>
          </div>
        </section>

        <footer className="premium-home-footer" aria-label="Stopka">
          <div className="premium-footer-grid">
            <div>
              <div className="section-eyebrow">Regulski</div>
              <h3>{SITE_NAME}</h3>
              <p>
                {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacje dla psów i kotów w Olsztynie
                i online.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>{SPECIALIST_LOCATION}</span>
                <span>Psy i koty</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Nawigacja</div>
              <div className="premium-footer-links">
                <a href="#opinie">Opinie</a>
                <a href="#przypadki">Przypadki</a>
                <a href="#faq">FAQ</a>
                <a href="#kontakt">Kontakt</a>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Kontakt</div>
              <div className="premium-footer-links">
                <Link href={consultationHref} prefetch={false}>
                  Umów konsultację
                </Link>
                <Link href={contactHref} prefetch={false}>
                  Napisz wiadomość
                </Link>
                {contact.email && mailtoHref ? <a href={mailtoHref}>{contact.email}</a> : null}
              </div>
            </div>
          </div>

          <div className="premium-footer-bottom">
            <div className="premium-footer-legal">
              <Link href="/polityka-prywatnosci" prefetch={false}>
                Polityka prywatności
              </Link>
              <span>·</span>
              <Link href="/regulamin" prefetch={false}>
                Regulamin
              </Link>
            </div>

            <div className="premium-footer-credit">
              <span>
                © {new Date().getFullYear()} {SITE_SHORT_NAME}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
