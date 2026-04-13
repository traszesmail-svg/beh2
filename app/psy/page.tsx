import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import { getBaseUrl } from '@/lib/server/env'
import { getPublicContactDetails, SITE_NAME, SITE_TAGLINE, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pies',
  path: '/psy',
  description:
    'Premium podstrona problemowa dla opiekunów psów. Pomoc przy spacerach, reaktywności, rozłące, pobudzeniu i trudnych zachowaniach w domu.',
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

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const contactHref = '/kontakt#formularz'
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')

const problemCards = [
  {
    title: 'Spacery pełne napięcia',
    description: 'Pies ciągnie, zatrzymuje się albo reaguje jeszcze przed wyjściem z domu.',
  },
  {
    title: 'Reaktywność i silne emocje',
    description: 'Szczekanie, wyrywanie się i gwałtowne reakcje na ludzi, psy albo inne bodźce.',
  },
  {
    title: 'Trudność z zostawaniem samemu',
    description: 'Niepokój po wyjściu opiekuna, wokalizacja, niszczenie lub panika przy rozłące.',
  },
  {
    title: 'Pobudzenie i brak wyciszenia',
    description: 'Pies nie odpoczywa, szybko się nakręca i trudno mu zejść z emocji.',
  },
  {
    title: 'Trudne zachowania w domu',
    description: 'Szczekanie, pilnowanie zasobów, skakanie, napięcie wobec gości lub domowników.',
  },
  {
    title: 'Zmiana, po której coś się posypało',
    description: 'Przeprowadzka, nowy rytm dnia, nowi domownicy albo zmiana otoczenia.',
  },
] as const

const whenToGetHelp = {
  yes: [
    'zachowanie psa zaczyna Cię regularnie niepokoić',
    'spacery robią się coraz trudniejsze',
    'pies ma problem z wyciszeniem albo z rozłąką',
    'sytuacja w domu staje się napięta',
    'różne rady tylko zwiększają chaos',
    'po zmianie w domu coś się rozsypało',
  ],
  noNeedToWait: [
    'chcesz zatrzymać problem, zanim się utrwali',
    'różne rady tylko zwiększają chaos',
    'widzisz, że temat wraca mimo prób',
    'potrzebujesz spokojnego pierwszego planu',
    'chcesz wiedzieć, od czego zacząć dziś',
    'zależy Ci na sensownym kierunku, a nie przypadkowych poradach',
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
      'Po konsultacji przestałam wymieniać metodę co dwa dni. Został jeden plan na spacer i dokładnie wiedziałam, co obserwować.',
    note: 'Spacery / reaktywność',
  },
  {
    quote:
      'Największą zmianę dało uporządkowanie rytmu dnia. Pies szybciej się wyciszał, a dom przestał być stale na wysokim obrocie.',
    note: 'Pobudzenie / dom',
  },
  {
    quote:
      'Spokojne wyjaśnienie całego procesu zrobiło dużą różnicę. Zamiast poczucia, że robię wszystko źle, dostałam prosty plan i logiczny kierunek.',
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
      'Na spacerze pies napinał się już przed wyjściem, ciągnął do bodźców i po powrocie wciąż nie mógł odpuścić.',
    key: 'Kluczowe było skrócenie najbardziej pobudzających tras, większy dystans od wyzwalaczy i spokojniejszy rytm wyjścia.',
    effect: 'Najpierw pies ma przestrzeń do myślenia, dopiero potem dokładamy kolejne kroki.',
  },
  {
    title: 'Pies, który nie radzi sobie z zostawaniem samemu',
    situation:
      'Po wyjściu opiekuna pies szczekał, wył i nie umiał zejść z emocji, nawet gdy na zewnątrz wydawało się, że wszystko jest w porządku.',
    key: 'Kluczowe było sprawdzenie rytuału wyjścia, progu trudności i tego, czy problem wynika z lęku, przeciążenia czy frustracji.',
    effect: 'Opiekun dostaje bezpieczny pierwszy plan i wie, czy potrzebny jest dłuższy proces.',
  },
  {
    title: 'Pies, który rozsypał się po zmianach',
    situation: 'Po przeprowadzce, nowym rytmie dnia albo zmianie domowników pies stał się bardziej czujny i trudniej było mu odpocząć.',
    key: 'Kluczowe było ustabilizowanie otoczenia, zasobów i przewidywalności dnia.',
    effect: 'Dopiero potem dokładamy dalszą pracę nad emocjami i reakcjami.',
  },
] as const

const faqItems = [
  {
    question: 'Czy konsultacja jest dla mojego psa, jeśli problem dopiero się zaczyna?',
    answer:
      'Tak. Wczesny kontakt bywa najlepszy, bo łatwiej zatrzymać wzorzec zanim zacznie się utrwalać i rozlewać na kolejne sytuacje.',
  },
  {
    question: 'Czy pomoc dotyczy tylko bardzo trudnych przypadków?',
    answer:
      'Nie. Często najlepiej działa wtedy, gdy problem jest jeszcze świeży, niejednoznaczny albo dopiero zaczyna wpływać na codzienność.',
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
      'To normalne. Opisz wszystko po prostu jako kilka wątków naraz, a ja pomogę ustawić priorytety i kolejność działania.',
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
        'Pomoc przy spacerach, reaktywności i rozłące',
        'Spokojny plan działania po konsultacji',
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
    <main className="page-wrap editorial-home-page premium-home-page dog-service-page">
      <AnalyticsEventOnMount eventName="dogs_page_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunów psów</div>
              <h1>Twój pies sprawia trudność, a Ty nie wiesz, od czego zacząć?</h1>
              <p className="editorial-hero-lead">
                Pomagam zrozumieć, skąd biorą się trudne zachowania psa, uporządkować sytuację i wybrać realny plan działania.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="dogs-hero-book">
                  Umów konsultację
                </Link>
                <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="dogs-hero-message">
                  Napisz wiadomość
                </Link>
              </div>

              <div className="home-soft-cta">
                <Link href={audioHref} prefetch={false} className="home-soft-cta-link" data-analytics-event="cta_click" data-analytics-location="dogs-hero-audio">
                  Nie masz pewności, czy to dobry moment? Krótka rozmowa wstępna 15 min audio
                </Link>
                <span className="home-soft-cta-note">bez potrzeby przygotowania kamery</span>
              </div>

              <p className="contact-support-copy">Spacer, lęk, pobudzenie, reaktywność, trudności w domu — zacznijmy od uporządkowania sytuacji.</p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie psa w spokojnym, naturalnym kontekście">
              <div className="editorial-hero-photo-frame">
                <Image
                  src="/branding/case-dog-home.jpg"
                  alt="Spokojny pies w domowym kadrze"
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Naturalny kontekst</span>
                  <strong>Najpierw porządkujemy sytuację, potem budujemy konkretny plan pracy.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Typowe trudności"
            title="Z jakimi trudnościami najczęściej zgłaszają się opiekunowie psów"
            description="Nie każda trudność zaczyna się spektakularnie. Często to zestaw sygnałów, który z czasem coraz bardziej obciąża codzienność."
          />

          <div className="editorial-entry-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">To zwykle nie jest jeden objaw, tylko układ napięć, który zaczyna wpływać na cały dom.</p>

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
              <h3>To też dobry moment, jeśli</h3>
              <ul className="premium-bullet-list">
                {whenToGetHelp.noNeedToWait.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="muted top-gap">Jeśli już teraz widzisz, że temat wraca albo zaczyna rozlewać się na więcej sytuacji, to dobry moment na kontakt.</p>

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
            description="Wystarczy, że opiszesz sytuację psa. Resztę porządkujemy razem, bez zbędnego przeciążania i bez szukania idealnego opisu."
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
              <strong>Nie musisz opisywać wszystkiego idealnie.</strong>
              <p>Wystarczy materiał, który pokaże codzienność psa i najważniejsze momenty problemu.</p>

              <ul className="premium-bullet-list top-gap-small">
                {prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p>To wystarczy, żeby zacząć spokojnie i nie gubić się już na wejściu.</p>
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
            description="Trzy wyróżnione opinie i krótsze głosy pokazują, jak pierwszy porządek w problemie przekłada się na codzienność."
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
              Umów konsultację dotyczącą psa
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje psów, z którymi zgłaszają się opiekunowie"
            description="Trzy krótkie scenariusze pokazują, jak zwykle zaczyna się porządkowanie tematu."
          />

          <div className="summary-grid top-gap">
            {miniCaseStudies.map((caseStudy, index) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card">
                <div className="section-eyebrow">Przypadek {String(index + 1).padStart(2, '0')}</div>
                <h3>{caseStudy.title}</h3>
                <p>
                  <strong>Sytuacja:</strong> {caseStudy.situation}
                </p>
                <p>
                  <strong>Co było kluczowe:</strong> {caseStudy.key}
                </p>
                <p>
                  <strong>Efekt:</strong> {caseStudy.effect}
                </p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Sprawdź najczęstsze pytania opiekunów psów
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              Umów konsultację dotyczącą psa
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
              <strong>Jeśli chcesz doprecyzować sytuację przed rezerwacją, napisz wiadomość.</strong>
              <p>Jeden krótki opis często wystarcza, żeby wskazać najprostszy kolejny krok.</p>
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
            <h2>Jeśli chcesz spokojnie uporządkować sytuację swojego psa, zacznijmy od pierwszego kroku</h2>
            <p>
              Nie musisz wiedzieć wszystkiego przed pierwszym kontaktem. Wystarczy, że opiszesz sytuację swojego psa, a wspólnie
              ustalimy najlepszy kierunek rozpoczęcia pracy.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link href={consultationHref} prefetch={false} className="button button-primary big-button" data-analytics-event="cta_click" data-analytics-location="dogs-final-book">
                Umów konsultację dotyczącą psa
              </Link>
              <Link href={contactHref} prefetch={false} className="button button-ghost big-button" data-analytics-event="cta_click" data-analytics-location="dogs-final-message">
                Napisz wiadomość
              </Link>
            </div>

            <p className="muted">Jeśli nie masz jeszcze pewności, możesz zacząć od krótkiej rozmowy wstępnej 15 min audio.</p>
          </div>
        </section>

        <Footer
          sectionBasePath="/psy"
          ctaHref={consultationHref}
          ctaLabel="Umów konsultację dotyczącą psa"
          secondaryHref={contactHref}
          secondaryLabel="Napisz wiadomość"
        />
      </div>
    </main>
  )
}
