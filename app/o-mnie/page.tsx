import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  INSTAGRAM_PROFILE_URL,
  SPECIALIST_NAME,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'
import { getBaseUrl } from '@/lib/server/env'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'O mnie i metodyka',
  path: '/o-mnie',
  description:
    'Spokojna, profesjonalna pomoc dla opiekunów psów i kotów. COAPE, CAPBT, publiczny profil ekspercki, technik weterynarii i metodyka MHERA.',
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
const dogsHref = '/psy'
const catsHref = '/koty'

const heroTrustItems = ['COAPE', 'profil publiczny', 'psy i koty', 'spokojne, konkretne podejście'] as const

const whoCards = [
  {
    title: 'Z kim pracuję',
    copy: 'Z opiekunami psów i kotów, gdy zachowanie zaczyna wpływać na spokój, relację i codzienny rytm domu.',
  },
  {
    title: 'W czym pomagam',
    copy: 'W uporządkowaniu trudnych zachowań, wybraniu priorytetów i znalezieniu pierwszego kroku, który ma sens.',
  },
  {
    title: 'Jak pracuję',
    copy: 'Spokojnie, konkretnie i bez oceniania. Najpierw rozumiem sytuację, potem układam plan do realnego wdrożenia.',
  },
] as const

const qualificationPillars = [
  {
    title: 'COAPE',
    copy: 'To główny punkt odniesienia dla mojego sposobu myślenia o zachowaniu i pracy z opiekunem.',
  },
  {
    title: 'Stowarzyszenie COAPE',
    copy: 'Daje osadzenie w środowisku zawodowym i spójność z podejściem stosowanym w pracy behawioralnej.',
  },
  {
    title: 'Odniesienie do CAPBT',
    copy: 'Ułatwia szybkie sprawdzenie profilu i potwierdza publiczne, zawodowe zaplecze specjalisty.',
  },
  {
    title: 'Publiczny profil ekspercki',
    copy: 'Pozwala przed kontaktem zobaczyć, kim jestem i jak wygląda moja praktyka w przestrzeni publicznej.',
  },
] as const

const methodCards = [
  {
    title: 'Najpierw rozumiem, potem układam plan',
    copy: 'Zaczynam od sytuacji, a nie od gotowego schematu. To pozwala dobrać pierwszy krok do konkretnego domu.',
  },
  {
    title: 'Patrzę szerzej niż tylko na objaw',
    copy: 'Biorę pod uwagę codzienność, emocje, relacje i tło zdrowotne. Dzięki temu nie zatrzymuję się na samym sygnale.',
  },
  {
    title: 'Dobieram działania do realnego życia',
    copy: 'Plan ma być wykonalny dla opiekuna i czytelny dla zwierzęcia. Bez nadmiaru zadań i bez przeciążania.',
  },
  {
    title: 'Pracuję spokojnie i bez oceniania',
    copy: 'Nie egzaminuję opiekuna. Pomagam uporządkować sytuację, żeby można było działać bez napięcia i chaosu.',
  },
] as const

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
    title: 'Gdy działa się po omacku',
    items: [
      'pojawia się dużo rad, ale brak kolejności',
      'łatwo skupić się na objawie zamiast na przyczynie',
      'opiekun zaczyna improwizować i szybciej się męczy',
      'problem rozlewa się na kolejne sytuacje',
    ],
  },
  {
    title: 'Gdy sytuacja zostaje dobrze uporządkowana',
    items: [
      'najpierw widać priorytety i kontekst',
      'plan odpowiada realnemu życiu w domu',
      'jest mniej presji, a więcej czytelności',
      'łatwiej zauważyć, co naprawdę działa',
    ],
  },
] as const

const featuredOpinions = [
  {
    label: 'Spokój',
    quote:
      'Najbardziej uspokoiło mnie to, że od początku nie było oceniania. Zamiast presji dostałam spokojny kontakt i jasny kierunek.',
    note: 'Bez napięcia i bez egzaminowania opiekuna.',
  },
  {
    label: 'Konkret',
    quote:
      'Wreszcie ktoś przełożył sytuację na proste kroki. Nie musiałam zgadywać, co jest ważne, bo plan był od razu czytelny.',
    note: 'Konkretne wnioski, które dało się wdrożyć.',
  },
  {
    label: 'Zrozumienie',
    quote:
      'Po rozmowie miałam poczucie, że ktoś naprawdę widzi całą sytuację, a nie tylko jeden objaw. To zmieniło sposób patrzenia na problem.',
    note: 'Szersze spojrzenie i lepszy start.',
  },
] as const

const shortOpinions = [
  'Spokój od pierwszej minuty.',
  'Bez oceniania, bez presji.',
  'Konkret zamiast chaosu.',
  'Jasny pierwszy krok.',
  'Wreszcie zrozumiałam priorytety.',
  'Plan był realny do wdrożenia.',
  'Nikt mnie nie egzaminował.',
  'Dostałam prosty porządek.',
  'Widać było całą sytuację.',
  'Mniej zgadywania, więcej sensu.',
  'Spokojna rozmowa, konkretne wnioski.',
  'Najpierw zrozumienie, potem działanie.',
  'To nie był ciężki wykład.',
  'Poczułam ulgę po pierwszym kontakcie.',
  'Plan pasował do naszego domu.',
  'Było rzeczowo i spokojnie.',
  'Bez nadmiaru informacji.',
  'Bez obwiniania opiekuna.',
  'Widzę teraz, co jest ważne.',
  'Łatwiej mi obserwować zachowanie.',
  'Temat przestał być mglisty.',
  'Pierwszy ruch miał sens.',
  'Nie musiałam znać fachowych nazw.',
  'Wszystko zostało uporządkowane.',
  'Zmniejszył się chaos w domu.',
  'Rozmowa była bardzo ludzka.',
  'Dostałam spójne wskazówki.',
  'Nie było pośpiechu ani nacisku.',
  'Zobaczyłam, od czego zacząć.',
  'Najlepiej działała prostota.',
  'Ktoś uwzględnił też kontekst.',
  'Plan nie był oderwany od życia.',
  'Spokojny ton miał znaczenie.',
  'Wreszcie rozumiem zależności.',
  'Nie dostałam przypadkowych rad.',
  'To było naprawdę konkretne.',
  'Łatwiej nam wrócić do równowagi.',
  'Nie czułam się oceniana.',
  'Porządek zamiast mnożenia teorii.',
  'Dobrze poprowadzony pierwszy kontakt.',
  'Kierunek był bardzo czytelny.',
  'To dało nam oddech.',
  'Nie wszystko naraz, tylko po kolei.',
  'Szybko zrozumiałam, co dalej.',
  'Mniej napięcia po rozmowie.',
  'Pierwszy krok był jasny.',
] as const

const faqItems = [
  {
    question: 'Czy muszę dokładnie wiedzieć, co jest problemem, zanim się odezwę?',
    answer:
      'Nie. Wystarczy krótki opis tego, co widzisz na co dzień. Na spotkaniu wspólnie uporządkujemy temat i zdecydujemy, od czego zacząć.',
  },
  {
    question: 'Czy pracujesz tylko z bardzo trudnymi przypadkami?',
    answer:
      'Nie. Pomagam też wtedy, gdy sytuacja dopiero się zaczyna, ale już wpływa na spokój w domu albo na codzienny rytm opiekuna.',
  },
  {
    question: 'Czy podczas konsultacji dostanę konkretny kierunek działania?',
    answer:
      'Tak. Zależy mi na tym, żeby po rozmowie był jasny pierwszy krok, a nie lista przypadkowych sugestii do sprawdzenia naraz.',
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
      'To normalne. Wtedy jeszcze ważniejsze jest spokojne uporządkowanie priorytetów, zamiast wciskania wszystkiego w jeden szablon.',
  },
] as const

export default function AboutPage() {
  const baseUrl = getBaseUrl()
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | O mnie i metodyka',
        'Dzień dobry,\n\nchciałbym/chciałabym opisać sytuację psa lub kota i ustalić najlepszy pierwszy krok.\n\n- gatunek:\n- co się dzieje:\n- od kiedy:\n- co najbardziej mnie niepokoi:\n',
      )
    : null

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'O mnie i metodyka',
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
      jobTitle: 'Behawiorysta i trener zwierząt towarzyszących',
      description: 'COAPE, CAPBT, technik weterynarii i spokojna pomoc dla opiekunów psów oraz kotów.',
      image: new URL('/branding/specialist-krzysztof-portrait.jpg', baseUrl).toString(),
      homeLocation: { '@type': 'Place', name: 'Olsztyn, woj. warmińsko-mazurskie' },
      knowsAbout: ['behawiorystyka psów i kotów', 'konsultacje behawioralne', 'MHERA'],
      sameAs: [COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL],
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
    <main className="page-wrap marketing-page editorial-home-page premium-home-page authority-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="premium-home-header">
        <div className="container premium-home-header-inner">
          <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
            <span className="brand-copy">
              <span className="brand">Regulski</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </span>
          </Link>

          <nav className="premium-home-nav" aria-label="Nawigacja na stronie o mnie">
            <a href="#kim-jestem" className="header-link">
              Kim jestem
            </a>
            <a href="#metodyka" className="header-link">
              Metodyka
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
            data-analytics-location="about-header"
          >
            Umów konsultację
          </Link>
        </div>
      </header>

      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Krzysztof Regulski | Behawiorysta i trener zwierząt towarzyszących</div>
              <h1>Spokojna, profesjonalna pomoc w pracy z problemami zachowania psów i kotów</h1>
              <p className="editorial-hero-lead">
                Pracuję jako behawiorysta zwierzęcy i trener, wspierając opiekunów psów oraz kotów w spokojnym
                zrozumieniu problemu, uporządkowaniu sytuacji i dobraniu sensownego planu działania.
              </p>

              <div className="premium-trust-strip" aria-label="Najważniejsze filary zaufania">
                {heroTrustItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="about-hero-book"
                >
                  Umów konsultację
                </Link>
                <Link
                  href="#metodyka"
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="about-hero-method"
                >
                  Zobacz, jak pracuję
                </Link>
              </div>

              <Link href={introCallHref} prefetch={false} className="prep-inline-link">
                Nie masz pewności, czy to dobry moment? Krótka rozmowa wstępna 15 min
              </Link>

              <p className="muted top-gap-small">
                Najczęściej pracuję przy spacerach pełnych napięcia, rozłące, pobudzeniu, kuwecie, wycofaniu i napięciu
                między zwierzętami.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Portret Krzysztofa Regulskiego">
              <div className="editorial-hero-photo-frame">
                <Image
                  src="/branding/specialist-krzysztof-portrait.jpg"
                  alt={`${SPECIALIST_NAME} podczas spokojnej pracy z opiekunem psa lub kota`}
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojna współpraca</span>
                  <strong>Najpierw porządkuję obraz sytuacji, potem proponuję pierwszy krok.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kim-jestem">
          <SectionIntro
            eyebrow="Kim jestem"
            title="Pomagam opiekunom psów i kotów lepiej zrozumieć trudne zachowania i spokojnie uporządkować sytuację"
            description="To strona zaufania i autorytetu. Nie biografia, tylko jasne wyjaśnienie, jak pracuję i komu mogę pomóc."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card authority-card">
              <div className="section-eyebrow">O mnie</div>
              <p>
                Jestem behawiorystą i trenerem zwierząt towarzyszących. Pracuję z opiekunami psów i kotów wtedy, gdy
                zachowanie zaczyna wpływać na spokój, relację i codzienny rytm domu.
              </p>
              <p>
                Łączę praktyczne spojrzenie na zachowanie z uważnością na zdrowie, kontekst i możliwości opiekuna. Nie
                robię z konsultacji wykładu ani egzaminu.
              </p>
            </article>

            <div className="authority-side-cards">
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
            eyebrow="Kwalifikacje i afiliacje"
            title="Kwalifikacje i afiliacje, które stoją za moją pracą"
            description="Nie buduję zaufania badge’ami. Pokazuję tylko to, co realnie wzmacnia sposób pracy i ułatwia weryfikację."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card authority-card">
              <div className="section-eyebrow">Zaplecze zawodowe</div>
              <h3>Behawiorysta COAPE, trener zwierząt towarzyszących i technik weterynarii</h3>
              <p>
                To połączenie pomaga mi widzieć zarówno zachowanie, jak i granicę, przy której warto sprawdzić zdrowie
                lub tło medyczne.
              </p>
              <ul className="premium-bullet-list">
                <li>COAPE</li>
                <li>Stowarzyszenie Behawiorystów i Trenerów COAPE</li>
                <li>odniesienie do CAPBT</li>
                <li>publiczny profil ekspercki</li>
              </ul>
              <Link
                href={CAPBT_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="prep-inline-link"
              >
                Zobacz mój profil w katalogu COAPE
              </Link>
            </article>

            <div className="authority-four-grid">
              {qualificationPillars.map((pillar) => (
                <article key={pillar.title} className="summary-card tree-backed-card authority-card">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="authority-note-band top-gap">
            <span>
              Pracuję etycznie, spokojnie i odpowiedzialnie. Najpierw bezpieczeństwo, potem plan, potem wdrożenie.
            </span>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="metodyka">
          <SectionIntro
            eyebrow="Metodyka"
            title="Pracuję spokojnie, konkretnie i z uwzględnieniem całej sytuacji zwierzęcia"
            description="Najpierw porządkuję obraz problemu, dopiero potem dobieram działania. Tak łatwiej wybrać pierwszy sensowny krok."
          />

          <div className="authority-four-grid">
            {methodCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card authority-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <article className="summary-card tree-backed-card authority-card top-gap">
            <div className="section-eyebrow">Podejście oparte na szerszym spojrzeniu</div>
            <div className="editorial-hero-meta" aria-label="Ramy pracy">
              <span>behawiorysta</span>
              <span>trener</span>
              <span>technik weterynarii</span>
            </div>
            <p>
              MHERA pomaga mi patrzeć szerzej: na dobrostan, emocjonalność, kontekst i to, co podtrzymuje zachowanie.
              Dzięki temu plan nie kończy się na samym objawie.
            </p>
            <p>
              To nie jest ciężki framework do cytowania. To praktyczny porządek myślenia, który pomaga wybrać właściwy
              pierwszy krok.
            </p>
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

          <div className="editorial-entry-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Nie trzeba znać fachowych nazw. Wystarczy opisać sytuację tak, jak ją widzisz na co dzień.</p>

          <div className="hero-actions editorial-final-actions">
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="cta_click"
              data-analytics-location="about-help-book"
            >
              Umów konsultację
            </Link>
          </div>

          <div className="top-gap">
            <div className="section-eyebrow">Zobacz strony Pies i Kot</div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={dogsHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-help-dogs"
              >
                Pies
              </Link>
              <Link
                href={catsHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-help-cats"
              >
                Kot
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="dlaczego">
          <SectionIntro
            eyebrow="Dlaczego to działa"
            title="Dlaczego spokojne i uporządkowane podejście działa lepiej w praktyce"
            description="Kiedy jest mniej napięcia, łatwiej zobaczyć, co rzeczywiście podtrzymuje zachowanie i jak rozsądnie zacząć pracę."
          />

          <div className="premium-two-column-grid">
            {compareCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card authority-card">
                <div className="section-eyebrow">{card.title}</div>
                <ul className="premium-bullet-list">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="muted top-gap">
            Spokojne, kontekstowe podejście uwzględnia dobrostan, emocje i to, co naprawdę podtrzymuje zachowanie.
            W praktyce zwykle oznacza mniej chaosu i bardziej sensowny plan.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie o moim stylu pracy
            </Link>
          </div>
        </section>
        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co opiekunowie cenią w moim sposobie pracy"
            description="Krótko i bez ciężkiego slidera. Kilka głosów, które pokazują, jak wygląda spokojny start współpracy."
          />

          <div className="summary-grid top-gap">
            {featuredOpinions.map((opinion) => (
              <article key={opinion.label} className="authority-featured-opinion-card">
                <div className="section-eyebrow">{opinion.label}</div>
                <blockquote>{opinion.quote}</blockquote>
                <p>{opinion.note}</p>
              </article>
            ))}
          </div>

          <div className="authority-opinion-wall top-gap">
            {shortOpinions.map((opinion) => (
              <article key={opinion} className="authority-opinion-card">
                <p>{opinion}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Zobacz najczęstsze pytania o współpracę
            </Link>
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="about-opinions-book"
            >
              Umów konsultację
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania o współpracę i sposób pracy"
            description="Krótko odpowiadam na pytania, które najczęściej pojawiają się przed pierwszym kontaktem."
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
              <strong>Jeśli wolisz napisać niż rezerwować od razu, odezwij się wiadomością.</strong>
              <p>Odpowiadam osobiście i pomagam wybrać najprostszy start.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-faq-book"
              >
                Umów konsultację
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-faq-message"
              >
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli szukasz spokojnej, profesjonalnej pomocy, zacznijmy od pierwszego kroku</h2>
            <p>
              Nie musisz mieć wszystkiego uporządkowanego przed pierwszym kontaktem. Opisz swoją sytuację, a wspólnie
              ustalimy najlepszy kierunek rozpoczęcia pracy z psem albo kotem.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-final-book"
              >
                Umów konsultację
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="about-final-message"
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
                {SITE_TAGLINE}. Krzysztof Regulski, behawiorysta COAPE / CAPBT, technik weterynarii. Konsultacje dla
                psów i kotów w Olsztynie i online.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>Technik weterynarii</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Skrócona nawigacja</div>
              <div className="premium-footer-links">
                <a href="#kim-jestem">Kim jestem</a>
                <a href="#metodyka">Metodyka</a>
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
                <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                  Zobacz mój profil w katalogu COAPE
                </a>
                <a href={COAPE_ORG_URL} target="_blank" rel="noopener noreferrer">
                  COAPE
                </a>
                <a href={CAPBT_ORG_URL} target="_blank" rel="noopener noreferrer">
                  CAPBT
                </a>
                <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
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
              <a href={CAPBT_ORG_URL} target="_blank" rel="noopener noreferrer">
                behawioryscicoape.pl
              </a>
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}



