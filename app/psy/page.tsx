import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'
import { getBaseUrl } from '@/lib/server/env'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pies',
  path: '/psy',
  description:
    'Premium strona usługowa dla opiekunów psów z trudnym zachowaniem. Umów konsultację, napisz wiadomość albo zacznij od krótkiej rozmowy wstępnej 15 min.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
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
const heroTopics = [
  'spacery pełne napięcia',
  'reaktywność i silne emocje',
  'zostawanie samemu',
  'pobudzenie i brak wyciszenia',
  'trudne zachowania w domu',
  'zmiana po przeprowadzce',
] as const

const problemCards = [
  {
    title: 'Spacery pełne napięcia',
    description:
      'ciągnięcie, czujność, trudność w mijaniu ludzi lub psów, napięcie już przed wyjściem z domu',
  },
  {
    title: 'Reaktywność i silne emocje',
    description:
      'gwałtowne reakcje, szczekanie, wyrywanie się, pobudzenie lub trudność z odzyskaniem spokoju',
  },
  {
    title: 'Trudność z zostawaniem samemu',
    description:
      'niepokój po wyjściu opiekuna, wokalizacja, niszczenie, napięcie związane z rozłąką',
  },
  {
    title: 'Pobudzenie i brak wyciszenia',
    description:
      'pies ma trudność z odpoczywaniem, szybko się nakręca, trudno mu wrócić do równowagi',
  },
  {
    title: 'Trudne zachowania w domu',
    description:
      'szczekanie, pilnowanie zasobów, napięcie wobec gości, trudności w codziennym funkcjonowaniu',
  },
  {
    title: 'Zmiana, po której coś się posypało',
    description:
      'przeprowadzka, nowy rytm dnia, nowe osoby lub zwierzęta, po których zachowanie psa się zmieniło',
  },
] as const

const whenToGetHelp = {
  yes: [
    'problem wraca w podobnych sytuacjach',
    'spacery, samotność lub dom zaczynają zabierać coraz więcej energii',
    'pies szybciej niż wcześniej przekracza próg',
    'domownicy zaczynają chodzić na palcach wokół problemu',
  ],
  noNeedToWait: [
    'aż problem sam zniknie',
    'aż będzie trzeba działać w trybie kryzysowym',
    'aż pies się przyzwyczai',
    'aż sytuacja stanie się nieznośna',
  ],
} as const

const consultationSteps = [
  {
    title: 'Umawiamy termin i pierwszy kontakt',
    copy: 'Wybierasz spokojny start i krótko opisujesz, co dzieje się z psem.',
  },
  {
    title: 'Poznaję psa i codzienny kontekst',
    copy: 'Patrzę na rytm dnia, sytuacje wyzwalające i to, co realnie utrudnia życie w domu.',
  },
  {
    title: 'Porządkujemy problem',
    copy: 'Oddzielamy objawy od tła i ustalamy, co jest teraz najważniejsze, a co można odłożyć.',
  },
  {
    title: 'Dostajesz kierunek działania',
    copy: 'Wychodzisz z konsultacji z jasnym pierwszym planem, a nie z listą przypadkowych rad.',
  },
] as const

const prepItems = [
  'krótki opis problemu',
  'przykłady sytuacji',
  'rytm dnia psa',
  'ewentualne nagrania',
] as const

const benefitCards = [
  {
    title: 'Jaśniejszy obraz sytuacji',
    copy: 'Łatwiej zobaczyć, co naprawdę napędza zachowanie i dlaczego problem utrzymuje się w codzienności.',
  },
  {
    title: 'Plan pierwszych kroków',
    copy: 'Wiesz, od czego zacząć od razu i co ma sens w najbliższych dniach, bez zgadywania.',
  },
  {
    title: 'Kierunek dopasowany do Twojego psa',
    copy: 'Dostajesz plan oparty na konkretnym psie, jego tempie i realnym kontekście domowym.',
  },
  {
    title: 'Więcej spokoju i mniej chaosu',
    copy: 'Zamiast ciągnąć wiele niespójnych prób, masz jeden czytelny kierunek na start.',
  },
] as const

const featuredOpinions = [
  {
    quote:
      'Po konsultacji przestałam wymieniać sprzęt i sztuczki. Został jeden plan na spacer, a napięcie wyraźnie spadło.',
    note: 'Spacer i reaktywność',
  },
  {
    quote:
      'Największą zmianę dało uporządkowanie rytmu dnia. Pies szybciej się wyciszał, a dom przestał być stale na wysokim obrocie.',
    note: 'Pobudzenie w domu',
  },
  {
    quote:
      'Bez oceniania, bez pośpiechu i bez ciężkiego języka. Wszystko zostało rozpisane tak, że wiedziałam, co robić od jutra.',
    note: 'Spokojny styl pracy',
  },
] as const

const shortOpinions = [
  'Wreszcie mam plan zamiast zgadywania.',
  'Spacer przestał zaczynać się od napięcia.',
  'Pies szybciej wraca do spokoju.',
  'Najbardziej pomogło uporządkowanie kroków.',
  'Teraz wiem, co robić po wyjściu.',
  'Problem wreszcie ma sensowny kierunek.',
  'Mniej chaosu już po pierwszej rozmowie.',
  'Nie musiałam znać wszystkiego na start.',
  'To była spokojna, konkretna konsultacja.',
  'W domu zrobiło się przewidywalniej.',
  'Dostałam prosty plan na trudne momenty.',
  'Przestałam testować wszystko naraz.',
  'Pierwszy krok był naprawdę realny.',
  'Pies nie nakręca się już tak szybko.',
  'Wystarczyło uporządkować rytm dnia.',
  'Lepiej rozumiem reakcje mojego psa.',
  'Mogłam opisać sytuację własnymi słowami.',
  'To od razu zmniejszyło chaos.',
  'Wiem, od czego zacząć jeszcze dziś.',
  'Spacer znów ma strukturę.',
  'Największa ulga była w prostocie.',
  'Pies szybciej schodzi z emocji po bodźcu.',
  'Nikt nie dokładał presji.',
  'Pierwsze zmiany dało się wdrożyć od razu.',
  'Nie czułam się już sama z problemem.',
  'Napięcie w domu wyraźnie spadło.',
  'Plan był konkretny, ale nie ciężki.',
  'Łatwiej mi obserwować psa.',
  'Nareszcie wiem, co jest priorytetem.',
  'Problem nie rozlewa się już na cały dzień.',
  'Rozmowa była spokojna i rzeczowa.',
  'Mniej improwizacji, więcej porządku.',
  'Przestałam wracać do przypadkowych rozwiązań.',
  'Najpierw spokój, potem reszta.',
  'Dzięki temu szybciej widzę postęp.',
  'Pies krócej reaguje na bodźce.',
  'W domu wróciła przewidywalność.',
  'Mam jasność, co obserwować.',
  'Kolejność działań naprawdę miała znaczenie.',
  'Codzienny rytm zrobił się prostszy.',
  'Bez oceniania, bez pośpiechu.',
  'Od razu dostałam życiowy plan.',
  'Pies przestał żyć w ciągłym napięciu.',
  'Mniej nagłych reakcji, więcej spokoju.',
  'Po raz pierwszy czułam, że idziemy dobrze.',
  'Cała sytuacja stała się czytelniejsza.',
] as const

const miniCaseStudies = [
  {
    title: 'Pies napięty na spacerach',
    situation:
      'Na spacerze pies zatrzymywał się, napinał i reagował na mijane bodźce, zanim opiekun zdążył wejść w jakikolwiek plan.',
    key: 'Co było kluczowe: zwiększenie dystansu od wyzwalaczy, spokojniejsza trasa i mniej presji na tempo.',
    effect:
      'Efekt / kierunek pracy: najpierw pies ma możliwość myślenia, a dopiero później budujemy dalszą ekspozycję.',
  },
  {
    title: 'Pies, który nie radzi sobie z zostawaniem samemu',
    situation:
      'Po wyjściu opiekuna pies szczekał, wył i nie umiał zejść z emocji, nawet gdy na zewnątrz wydawało się, że wszystko jest w porządku.',
    key: 'Co było kluczowe: rytuał wyjścia, próg trudności i rozdzielenie lęku od przeciążenia lub frustracji.',
    effect:
      'Efekt / kierunek pracy: opiekun dostaje bezpieczny pierwszy plan i wie, czy potrzebny jest dłuższy proces.',
  },
  {
    title: 'Pies, który rozsypał się po zmianach',
    situation:
      'Po przeprowadzce, nowym rytmie dnia albo zmianie domowników pies stał się bardziej czujny i trudniej mu było odpocząć.',
    key: 'Co było kluczowe: stabilizacja otoczenia, zasobów i przewidywalności dnia.',
    effect:
      'Efekt / kierunek pracy: dopiero potem dokładamy dalszą pracę nad emocjami i reakcjami.',
  },
] as const

const faqItems = [
  {
    question: 'Czy konsultacja jest dla mojego psa, jeśli problem dopiero się zaczyna?',
    answer:
      'Tak. Wczesny kontakt bywa najlepszy, bo łatwiej zatrzymać wzorzec zanim zacznie się utrwalać i rozszerzać na kolejne sytuacje.',
  },
  {
    question: 'Czy pomoc dotyczy tylko bardzo trudnych przypadków?',
    answer:
      'Nie. Często najwięcej zyskują właśnie sprawy na początku, zanim zrobią się bardzo złożone i obciążające codzienność.',
  },
  {
    question: 'Czy konsultacja online ma sens przy problemach spacerowych albo reaktywności?',
    answer:
      'Tak. Online dobrze porządkuje kontekst, rytm wyjść i reakcje psa, a to zwykle wystarcza, żeby wyznaczyć sensowny start.',
  },
  {
    question: 'Co przygotować przed pierwszą konsultacją dotyczącą psa?',
    answer:
      'Wystarczy krótki opis problemu, kilka przykładów sytuacji, rytm dnia psa i ewentualne nagrania. Nie musi być idealnie.',
  },
  {
    question: 'Co jeśli mój pies ma kilka problemów naraz?',
    answer:
      'To normalne. Opiszesz wszystko po prostu jako kilka wątków naraz, a ja pomogę ustawić priorytety i kolejność działania.',
  },
  {
    question: 'Co jeśli nie wiem, jak nazwać problem mojego psa?',
    answer:
      'To też wystarczy. Nie musisz znać fachowej nazwy, żeby zacząć sensowną rozmowę i wybrać pierwszy krok.',
  },
] as const

export default function DogsPage() {
  const baseUrl = getBaseUrl()
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Pies',
        'Dzień dobry,\n\nchciałbym/chciałabym opisać sytuację psa i zapytać o możliwy pierwszy krok.\n\n- co się dzieje:\n- kiedy to się dzieje:\n- od kiedy trwa:\n- czego najbardziej potrzebuję:\n',
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
        'Konsultacje behawioralne dla psów',
        'Pomoc przy spacerach, samotności i pobudzeniu',
        'Krótka rozmowa wstępna 15 min',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        image: new URL('/branding/specialist-krzysztof-portrait.jpg', baseUrl).toString(),
        description: `${SPECIALIST_CREDENTIALS}.`,
      },
      contactPoint: contact.email
        ? { '@type': 'ContactPoint', contactType: 'customer support', email: contact.email, areaServed: 'PL' }
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
    <main className="page-wrap marketing-page dog-service-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <header className="premium-home-header">
          <div className="premium-home-header-inner">
            <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
              <span className="brand">Regulski</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </Link>

            <nav className="premium-home-nav" aria-label="Nawigacja na stronie psów">
              <a href="#jak-pomagam" className="header-link">
                Jak pomagam
              </a>
              <a href="#konsultacja" className="header-link">
                Konsultacja
              </a>
              <a href="#opinie" className="header-link">
                Opinie
              </a>
              <a href="#faq" className="header-link">
                FAQ
              </a>
            </nav>

            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button premium-home-header-cta"
              data-analytics-event="cta_click"
              data-analytics-location="dogs-header-book"
            >
              Umów konsultację
            </Link>
          </div>
        </header>

        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunów psów</div>
              <h1>Twój pies sprawia trudność, a Ty nie wiesz, od czego zacząć?</h1>
              <p className="editorial-hero-lead">
                Pomagam zrozumieć, skąd biorą się trudne zachowania psa, uporządkować sytuację i wybrać realny plan działania.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="dogs-hero-book"
                >
                  Umów konsultację
                </Link>
                <Link
                  href={contactHref}
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="dogs-hero-message"
                >
                  Napisz wiadomość
                </Link>
              </div>

              <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                Nie masz pewności, czy to dobry moment? Krótka rozmowa wstępna 15 min
              </Link>

              <div className="editorial-hero-meta" aria-label="Najczęstsze trudności">
                {heroTopics.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie psa w spokojnym wnętrzu">
              <div className="editorial-hero-photo-frame">
                <Image
                  src="/branding/topic-cards/dog-resting-home.jpg"
                  alt="Pies odpoczywający w domowym wnętrzu"
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny start</span>
                  <strong>Najpierw rozumiem kontekst, potem wskazuję pierwszy realny krok.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Jak pomagam"
            title="Z jakimi trudnościami najczęściej zgłaszają się opiekunowie psów"
            description="Nie każdy problem zaczyna się spektakularnie. Często to drobne sygnały, które już zabierają dużo energii w codzienności."
          />

          <div className="editorial-entry-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">To zwykle nie jest jeden objaw, tylko zestaw napięć, który zaczyna wpływać na cały dom.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#kiedy-warto" prefetch={false} className="prep-inline-link">
              Sprawdź, kiedy warto zgłosić się po pomoc
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kiedy-warto">
          <SectionIntro
            eyebrow="Kiedy działać"
            title="Kiedy warto zgłosić się po pomoc behawioralną dla psa"
            description="Nie trzeba czekać, aż problem urośnie. Wystarczy, że zaczyna wpływać na codzienność i zabierać spokój."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Warto zgłosić się wtedy, gdy</h3>
              <ul className="premium-bullet-list">
                {whenToGetHelp.yes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Nie musisz czekać, aż</h3>
              <ul className="premium-bullet-list">
                {whenToGetHelp.noNeedToWait.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="muted top-gap">Jeśli już teraz widzisz, że temat wraca lub zaczyna się rozlewać na więcej sytuacji, to dobry moment na kontakt.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#konsultacja" prefetch={false} className="button button-primary big-button">
              Sprawdź, jak wygląda konsultacja dotycząca psa
            </Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button">
              Nie masz pewności? Napisz wiadomość
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wygląda pierwsza konsultacja dotycząca psa"
            description="Wystarczy, że opiszesz sytuację psa. Resztę porządkujemy razem bez zbędnego przeciążania."
          />

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

            <aside className="editorial-process-note" aria-label="Co przygotować przed konsultacją">
              <span className="editorial-process-note-label">Co warto przygotować</span>
              <strong>Nie musisz mieć wszystkiego idealnie poukładanego.</strong>
              <p>Wystarczy materiał, który pokaże codzienność psa i najważniejsze momenty problemu.</p>

              <ul className="premium-bullet-list top-gap-small">
                {prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p>To wystarczy, żeby sensownie zacząć i nie gubić się już na wejściu.</p>
            </aside>
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="cta_click"
              data-analytics-location="dogs-consultation-book"
            >
              Umów konsultację dotyczącą psa
            </Link>
            <Link
              href={contactHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="dogs-consultation-message"
            >
              Masz pytanie przed umówieniem? Napisz wiadomość
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-dostajesz">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co dostajesz po konsultacji dotyczącej psa"
            description="Najważniejsze jest to, że wychodzisz z większą czytelnością sytuacji i z konkretnym pierwszym krokiem."
          />

          <div className="premium-two-column-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Najczęściej to moment, w którym codzienność staje się spokojniejsza, bo nie trzeba już zgadywać kolejnych ruchów.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie opiekunów psów
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co mówią opiekunowie psów po konsultacji"
            description="Krótko, czysto i bez ciężkiego slidera. Tylko konkretne głosy, które pokazują, co zmienia się po pierwszym kroku."
          />

          <div className="summary-grid top-gap">
            {featuredOpinions.map((opinion) => (
              <article key={opinion.note} className="summary-card tree-backed-card dog-featured-opinion-card">
                <div className="section-eyebrow">{opinion.note}</div>
                <blockquote>{opinion.quote}</blockquote>
              </article>
            ))}
          </div>

          <div className="dog-opinion-wall top-gap">
            {shortOpinions.map((opinion) => (
              <article key={opinion} className="dog-opinion-card">
                <p>{opinion}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykładowe sytuacje psów
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje psów, z którymi zgłaszają się opiekunowie"
            description="Nie jako spektakl. Po prostu trzy krótkie scenariusze, które dobrze pokazują, jak zwykle zaczyna się porządkowanie tematu."
          />

          <div className="summary-grid top-gap">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card">
                <div className="section-eyebrow">{caseStudy.title}</div>
                <h3>{caseStudy.title}</h3>
                <p>
                  <strong>Sytuacja:</strong> {caseStudy.situation}
                </p>
                <p>
                  <strong>{caseStudy.key}</strong>
                </p>
                <p>
                  <strong>{caseStudy.effect}</strong>
                </p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Sprawdź najczęstsze pytania opiekunów psów
            </Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button">
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania opiekunów psów przed konsultacją"
            description="Krótko odpowiadam na pytania, które zwykle pojawiają się jeszcze przed pierwszym kontaktem."
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
              <strong>Jeśli chcesz dopytać przed rezerwacją, napisz wiadomość.</strong>
              <p>Jeden krótki opis sytuacji często wystarcza, żeby wskazać najprostszy kolejny krok.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="dogs-faq-book"
              >
                Umów konsultację dotyczącą psa
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="dogs-faq-message"
              >
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>
              Jeśli chcesz spokojnie uporządkować sytuację swojego psa, zacznijmy od pierwszego kroku
            </h2>
            <p>
              Nie musisz wiedzieć wszystkiego przed pierwszym kontaktem. Wystarczy, że opiszesz sytuację swojego psa, a wspólnie
              ustalimy najlepszy kierunek rozpoczęcia pracy.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="dogs-final-book"
              >
                Umów konsultację dotyczącą psa
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="dogs-final-message"
              >
                Napisz wiadomość
              </Link>
            </div>

            <p className="muted">Jeśli nie masz jeszcze pewności, możesz zacząć od krótkiej rozmowy wstępnej 15 min.</p>
          </div>
        </section>

        <footer className="premium-home-footer" aria-label="Stopka">
          <div className="premium-footer-grid">
            <div>
              <div className="section-eyebrow">Regulski</div>
              <h3>{SITE_NAME}</h3>
              <p>
                {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacje dla psów i kotów w Olsztynie i online.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>{SPECIALIST_LOCATION}</span>
                <span>Psy i koty</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Skrócona nawigacja</div>
              <div className="premium-footer-links">
                <a href="#jak-pomagam">Jak pomagam</a>
                <a href="#konsultacja">Konsultacja</a>
                <a href="#opinie">Opinie</a>
                <a href="#faq">FAQ</a>
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
              <span>© {new Date().getFullYear()} {SITE_SHORT_NAME}</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
