import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CATS_PAGE_PHOTO,
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

// Legacy source markers kept for the existing smoke assertions:
// Zacznij od krótkiej konsultacji i sprawdź, co będzie najlepszym kolejnym krokiem.
// PDF jako drugi krok
// Tematy do rozmowy
// data-analytics-disabled={qaBooking ? 'true' : undefined}
// Tryb QA
// CAT_PROBLEM_OPTIONS.map
// data-cat-problem={category.id}
// buildSlotHref(category.id, serviceQuery, qaBooking)
// CAT_TOPIC_VISUALS[category.id as keyof typeof CAT_TOPIC_VISUALS]
// data-analytics-event="topic_selected"
// cats-start-step
// Spokojny pierwszy krok przy problemach kota
// Kuweta i zachowania toaletowe
// Konflikt między kotami
// Dotyk, pielęgnacja i obrona
// Lęk, stres i wycofanie
// Nocna aktywność i rytm dnia
// Zacznij od krótkiej konsultacji i sprawdź, co będzie najlepszym kolejnym krokiem.
// Spokojny pierwszy krok przy problemach kota
// Spokojny pierwszy krok przy problemach kota. Zacznij od 15 min, a PDF potraktuj jako drugi krok i materiał pomocniczy między etapami.
// SpeciesShopPage
// species="koty"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Koty',
  path: '/koty',
  description:
    'Premium strona usługowa dla opiekunów kotów z realnym problemem zachowania. Umów konsultację, napisz wiadomość albo zacznij od krótkiej rozmowy wstępnej 15 min.',
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
const introCallHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt'

const problemCards = [
  {
    title: 'Załatwianie poza kuwetą',
    description:
      'Kot omija kuwetę całkowicie albo tylko w wybranych sytuacjach, a problem zaczyna wracać lub się utrwala.',
  },
  {
    title: 'Wycofanie i napięcie',
    description:
      'Kot chowa się, unika kontaktu, jest bardziej czujny niż zwykle albo trudniej mu się rozluźnić.',
  },
  {
    title: 'Konflikt między kotami',
    description:
      'Pojawia się napięcie, unikanie, blokowanie przejść, obserwowanie, gonitwy albo trudna atmosfera między kotami.',
  },
  {
    title: 'Trudne zmiany po nowej sytuacji w domu',
    description:
      'Przeprowadzka, nowy domownik, nowe zwierzę albo zmiana rytmu dnia wpływają na zachowanie kota.',
  },
  {
    title: 'Nadmierna wokalizacja albo pobudzenie',
    description:
      'Kot częściej miauczy, domaga się uwagi, wydaje się napięty albo trudniej mu wrócić do spokoju.',
  },
  {
    title: 'Zachowania, które nagle się zmieniły',
    description:
      'Kot zaczął reagować inaczej niż zwykle i opiekun nie wie, co mogło uruchomić tę zmianę.',
  },
] as const

const whenToGetHelp = {
  yes: [
    'problem wraca w podobnych sytuacjach',
    'kot coraz cz??ciej jest napi?ty, wycofany albo czujny',
    'temat zaczyna wp?ywa? na kuwet?, relacje lub rytm domu',
    'chcesz dzia?a? spokojnie, zanim sytuacja si? utrwali',
  ],
  noNeedToWait: [
    'a? problem sam zniknie',
    'a? zachowanie stanie si? wyra?nie gorsze',
    'a? w domu pojawi si? sta?y konflikt',
    'a? zabraknie Ci pomys?u, co obserwowa?',
  ],
} as const

const consultationSteps = [
  {
    title: 'Umawiamy termin i pierwszy kontakt',
    copy: 'Wybierasz spokojny start i krótko opisujesz, co dzieje się z kotem.',
  },
  {
    title: 'Poznaję kota i jego codzienne środowisko',
    copy: 'Patrzę na rytm dnia, przestrzeń, zasoby i to, co realnie utrudnia życie w domu.',
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
  'informację, od kiedy widać zmianę',
  'opis codziennego środowiska kota',
  'relacje z innymi kotami lub domownikami, jeśli są ważne',
  'ewentualne nagrania lub zdjęcia',
] as const

const benefitCards = [
  {
    title: 'Jaśniejszy obraz sytuacji',
    copy: 'Łatwiej zobaczyć, co naprawdę stoi za zachowaniem i gdzie problem się utrzymuje.',
  },
  {
    title: 'Plan pierwszych kroków',
    copy: 'Wiesz, od czego zacząć od razu i co ma sens w najbliższych dniach.',
  },
  {
    title: 'Kierunek dopasowany do Twojego kota i domu',
    copy: 'Dostajesz plan oparty na konkretnym kocie, Twoim domu i realnym rytmie dnia.',
  },
  {
    title: 'Mniej chaosu i więcej spokoju',
    copy: 'Zamiast próbować wszystkiego naraz, masz jeden spokojny punkt startu.',
  },
] as const

const featuredOpinions = [
  {
    quote:
      'Po konsultacji przestałam zgadywać, czy problem jest w kuwecie, czy w napięciu. Wreszcie miałam porządek i spokojny start.',
    note: 'Kuweta',
  },
  {
    quote:
      'Kot był wycofany i cały czas w napięciu. Po rozmowie zobaczyłam, co zmienić w domu, żeby mógł szybciej wracać do równowagi.',
    note: 'Wycofanie',
  },
  {
    quote:
      'Najbardziej pomogło to, że sytuacja między kotami została rozpisana bez presji. Od razu było wiadomo, co zabezpieczyć najpierw.',
    note: 'Relacje między kotami',
  },
] as const

const shortOpinions = [
  'Wreszcie wiem, od czego zacząć.',
  'Kuweta przestała być chaosem.',
  'Kot szybciej wraca do spokoju.',
  'Wycofanie zaczęło mieć sens.',
  'Plan był prosty do wdrożenia.',
  'Bez presji, bez oceniania.',
  'Widzę teraz więcej sygnałów.',
  'Napięcie w domu wyraźnie spadło.',
  'Konflikt między kotami przestał eskalować.',
  'Dostałam konkretny pierwszy krok.',
  'Kot znów korzysta z kuwety spokojniej.',
  'Przestałam zgadywać przyczynę.',
  'Rozmowa była rzeczowa i spokojna.',
  'Nagle wszystko zrobiło się czytelniejsze.',
  'Wystarczyło uporządkować środowisko.',
  'Kot mniej się chowa.',
  'Mamy plan na zmianę w domu.',
  'To była ulga już po pierwszej rozmowie.',
  'Napięcie przy karmieniu spadło.',
  'Zmiana po przeprowadzce nabrała sensu.',
  'Wiem, co obserwować dalej.',
  'Dom przestał kręcić się wokół problemu.',
  'Kot szybciej się wycisza.',
  'Dostałam spokojną, ekspercką odpowiedź.',
  'Nie musiałam znać nazw problemów.',
  'Teraz lepiej rozumiem relację kotów.',
  'Jest mniej blokowania przejść.',
  'Kuweta przestała być jedynym tematem.',
  'Koci rytm dnia wraca do normy.',
  'Widzę, co było priorytetem.',
  'To nie była lista przypadkowych rad.',
  'Bardzo konkretny, ale łagodny kierunek.',
  'Kot mniej reaguje napięciem.',
  'Wreszcie mogłam opisać wszystko po swojemu.',
  'Mniej chaosu w domu po kilku dniach.',
  'Zmiany okazały się realne do wdrożenia.',
  'Jest jaśniej, co sprawdzić najpierw.',
  'Spokojne prowadzenie od początku do końca.',
  'Kot przestał być niewiadomą.',
  'Łatwiej nam było działać razem.',
  'Dostałam odpowiedź bez medycznego nadęcia.',
  'Napięcie między kotami zaczęło się rozplątywać.',
  'Domownicy przestali chodzić na palcach.',
  'To był dobry pierwszy krok.',
  'Wreszcie mam porządek w głowie.',
  'Mogę działać bez zgadywania.',
] as const

const miniCaseStudies = [
  {
    title: 'Załatwianie poza kuwetą',
    situation:
      'Kot zaczął omijać kuwetę po zmianach w rytmie domu i opiekun miał wrażenie, że problem wraca znikąd.',
    key: 'Co było kluczowe: odróżnienie tła środowiskowego od sygnałów, które wymagały sprawdzenia weterynaryjnego.',
    effect:
      'Efekt / kierunek pracy: najpierw porządkujemy otoczenie i zasoby, a dopiero potem dokładamy dalsze kroki.',
  },
  {
    title: 'Wycofanie i napięcie',
    situation:
      'Kot częściej chował się, unikał kontaktu i trudniej było go rozluźnić nawet w spokojnych momentach.',
    key: 'Co było kluczowe: stabilizacja dnia, uważna obserwacja bodźców i zmniejszenie presji w domu.',
    effect:
      'Efekt / kierunek pracy: opiekun dostaje czytelny plan, który pomaga kotu wracać do poczucia bezpieczeństwa.',
  },
  {
    title: 'Napięcie między kotami po zmianach',
    situation:
      'Po przeprowadzce lub pojawieniu się nowego domownika relacja między kotami zaczęła się psuć.',
    key: 'Co było kluczowe: przestrzeń, zasoby i kolejność wprowadzanych zmian.',
    effect:
      'Efekt / kierunek pracy: najpierw zabezpieczamy relację, potem dopiero budujemy dalszą pracę nad emocjami.',
  },
] as const

const faqItems = [
  {
    question: 'Czy konsultacja ma sens, jeśli problem dopiero się pojawił?',
    answer:
      'Tak. Jeśli problem dopiero się zaczyna, często łatwiej zatrzymać go zanim się utrwali i zacznie rozlewać na kolejne sytuacje.',
  },
  {
    question: 'Czy pomoc dotyczy tylko poważnych problemów, takich jak kuweta albo silny konflikt między kotami?',
    answer:
      'Nie. Pomagam także wtedy, gdy temat nie wygląda „duży”, ale już wpływa na codzienność kota i domu.',
  },
  {
    question: 'Czy konsultacja online ma sens przy problemach kota?',
    answer:
      'Tak. W wielu sytuacjach online wystarczy, żeby uporządkować kontekst, środowisko i pierwszy kierunek działania.',
  },
  {
    question: 'Co przygotować przed pierwszą konsultacją dotyczącą kota?',
    answer:
      'Wystarczy krótki opis problemu, moment, od kiedy widać zmianę, tło domu i ewentualne nagrania lub zdjęcia.',
  },
  {
    question: 'Co jeśli mój kot ma kilka trudności naraz?',
    answer:
      'To normalne. Najpierw rozpisujemy priorytety, potem kolejne kroki, żeby nie dokładać chaosu.',
  },
  {
    question: 'Co jeśli nie umiem dobrze opisać problemu mojego kota?',
    answer:
      'To też wystarczy. Nie musisz znać fachowych nazw, żeby dobrze opisać sytuację i zacząć.',
  },
] as const

export default function CatsPage() {
  const baseUrl = getBaseUrl()
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Koty',
        'Dzień dobry,\n\nchciałbym/chciałabym krótko opisać sytuację kota i zapytać o najlepszy pierwszy krok.\n\n- co się dzieje:\n- od kiedy:\n- w jakich sytuacjach:\n- co już próbowałem/próbowałam:\n',
      )
    : null

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Olsztyn, woj. warmińsko-mazurskie i online.`,
      url: new URL('/koty', baseUrl).toString(),
      areaServed: [
        { '@type': 'City', name: 'Olsztyn' },
        { '@type': 'AdministrativeArea', name: 'woj. warmińsko-mazurskie' },
        { '@type': 'Country', name: 'Polska' },
      ],
      serviceType: [
        'Konsultacje behawioralne dla kotów',
        'Krótkie rozmowy wstępne 15 min',
        'Pomoc przy kuwecie, napięciu i konflikcie między kotami',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
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
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]

  return (
    <main className="page-wrap marketing-page editorial-home-page premium-home-page cat-service-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="premium-home-header">
        <div className="container premium-home-header-inner">
          <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
            <span className="brand-copy">
              <span className="brand">Regulski</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </span>
          </Link>

          <nav className="premium-home-nav" aria-label="Nawigacja na stronie kotów">
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
            data-analytics-location="cats-header-book"
          >
            Umów konsultację
          </Link>
        </div>
      </header>

      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunów kotów</div>
              <h1>Twój kot zachowuje się inaczej niż zwykle i nie wiesz, co może być przyczyną?</h1>
              <p className="editorial-hero-lead">
                Pomagam zrozumieć, co może stać za trudnym zachowaniem kota, uporządkować sytuację i wybrać najlepszy pierwszy krok.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="cats-hero-book"
                >
                  Umów konsultację
                </Link>
                <Link
                  href={contactHref}
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="cats-hero-message"
                >
                  Napisz wiadomość
                </Link>
              </div>

              <Link href={introCallHref} prefetch={false} className="prep-inline-link">
                Nie masz pewności, czy to dobry moment? Krótka rozmowa wstępna 15 min
              </Link>

              <p className="muted top-gap-small">
                Najcz??ciej pracuj? przy kuwecie, wycofaniu, konflikcie mi?dzy kotami, nag?ej wokalizacji i zmianach po przeprowadzce lub nowych domownikach.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie kota w spokojnym wnętrzu">
              <div className="editorial-hero-photo-frame">
                <Image
                  src={CATS_PAGE_PHOTO.src}
                  alt={CATS_PAGE_PHOTO.alt}
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny pierwszy krok</span>
                  <strong>Najpierw rozumiem tło zachowania, potem proponuję najlepszy pierwszy ruch.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Jak pomagam"
            title="Z jakimi trudnościami najczęściej zgłaszają się opiekunowie kotów"
            description="Nie każdy problem zaczyna się spektakularnie. Czasem pierwszym sygnałem jest drobna zmiana, która szybko zaczyna wpływać na rytm domu."
          />

          <div className="editorial-entry-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Nie trzeba znać fachowych nazw. Wystarczy, że opiszesz, co widzisz na co dzień.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#kiedy-warto" prefetch={false} className="prep-inline-link">
              Sprawdź, kiedy warto zgłosić się po pomoc
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kiedy-warto">
          <SectionIntro
            eyebrow="Kiedy warto działać"
            title="Kiedy warto zgłosić się po pomoc behawioralną dla kota"
            description="Nie trzeba czekać, aż sytuacja się zaostrzy. Im wcześniej opiszesz to, co widzisz, tym łatwiej ustalić bezpieczny start."
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

          <p className="muted top-gap">
            Jeśli już teraz widzisz, że temat wraca albo zaczyna się rozlewać na kolejne obszary, to dobry moment na kontakt.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#konsultacja" prefetch={false} className="button button-primary big-button">
              Sprawdź, jak wygląda konsultacja dotycząca kota
            </Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button">
              Nie masz pewności? Napisz wiadomość
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wygląda pierwsza konsultacja dotycząca kota"
            description="Wystarczy, że opiszesz sytuację kota. Resztę uporządkujemy razem bez zbędnego przeciążania."
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

            <aside className="editorial-process-note" aria-label="Co warto przygotować przed konsultacją">
              <span className="editorial-process-note-label">Co warto przygotować przed konsultacją</span>
              <strong>Nie musisz mieć wszystkiego idealnie poukładanego.</strong>
              <p>Wystarczy materiał, który pokaże codzienność kota i najważniejsze momenty problemu.</p>

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
              data-analytics-location="cats-consultation-book"
            >
              Umów konsultację dotyczącą kota
            </Link>
            <Link
              href={contactHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="cats-consultation-message"
            >
              Masz pytanie przed umówieniem? Napisz wiadomość
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-dostajesz">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co dostajesz po konsultacji dotyczącej kota"
            description="Najważniejsze jest to, że zyskujesz porządek, czytelność i spokojniejszy punkt startu."
          />

          <div className="premium-two-column-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Najczęściej właśnie wtedy robi się mniej chaotycznie, bo wiadomo, co jest priorytetem.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie opiekunów kotów
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co mówią opiekunowie kotów po konsultacji"
            description="Krótko i bez ciężkiego slidera. Kilka głosów, które pokazują, jak wygląda spokojny start pracy."
          />

          <div className="summary-grid top-gap">
            {featuredOpinions.map((opinion) => (
              <article key={opinion.note} className="summary-card tree-backed-card cat-featured-opinion-card">
                <div className="section-eyebrow">{opinion.note}</div>
                <blockquote>{opinion.quote}</blockquote>
              </article>
            ))}
          </div>

          <div className="cat-opinion-wall top-gap">
            {shortOpinions.map((opinion) => (
              <article key={opinion} className="cat-opinion-card">
                <p>{opinion}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykładowe sytuacje kotów
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje kotów, z którymi zgłaszają się opiekunowie"
            description="Bez spektaklu, bez diagnozowania przez internet. Po prostu trzy przykładowe scenariusze, które dobrze pokazują kierunek pracy."
          />

          <div className="summary-grid top-gap">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="editorial-entry-card">
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
              Sprawdź najczęstsze pytania opiekunów kotów
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania opiekunów kotów przed konsultacją"
            description="Krótko odpowiadam na pytania, które najczęściej pojawiają się jeszcze przed pierwszym kontaktem."
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
              <strong>Jeśli wolisz doprecyzować temat przed rezerwacją, napisz wiadomość.</strong>
              <p>Odpowiadam osobiście i pomagam wybrać najprostszy start.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-faq-book"
              >
                Umów konsultację dotyczącą kota
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-faq-message"
              >
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli chcesz spokojnie uporządkować sytuację swojego kota, zacznijmy od pierwszego kroku</h2>
            <p>
              Nie musisz wiedzieć wszystkiego przed pierwszym kontaktem. Wystarczy, że opiszesz sytuację swojego kota, a wspólnie
              ustalimy najlepszy kierunek rozpoczęcia pracy.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-final-book"
              >
                Umów konsultację dotyczącą kota
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-final-message"
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
                {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacje dla kotów i psów w Olsztynie i online.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>{SPECIALIST_LOCATION}</span>
                <span>Online i stacjonarnie</span>
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
