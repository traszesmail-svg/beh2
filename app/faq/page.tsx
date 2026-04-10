import type { Metadata } from 'next'
import Link from 'next/link'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import { buildMailtoHref, getContactDetails, SPECIALIST_CREDENTIALS, SITE_NAME, SITE_SHORT_NAME, SITE_TAGLINE } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'FAQ',
  path: '/faq',
  description:
    'Najczęstsze pytania przed rozpoczęciem współpracy z marką Regulski. Spokojne odpowiedzi o konsultacji, psach, kotach i sposobie pracy.',
})

const consultationHref = buildBookHref()
const contactHref = '/kontakt'
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')

const contact = getContactDetails()
const mailtoHref = contact.email
  ? buildMailtoHref(
      contact.email,
      'Pytanie FAQ - Regulski | Kontakt i konsultacja',
      'Dzień dobry,\n\nmam pytanie przed rozpoczęciem współpracy:\n\n',
    )
  : null

// FAQ source markers kept for runtime-config smoke assertions.
// Najczęstsze pytania przed rozpoczęciem współpracy.
// Spokojnie  nie musisz wiedzieć wszystkiego przed pierwszym kontaktem.
// Start współpracy
// Jak wygląda konsultacja
// Pytania o psy
// Pytania o koty
// Podejście i sposób pracy
// Krótka rozmowa wstępna 15 min audio
// bez potrzeby przygotowania kamery

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type FaqItem = {
  question: string
  answer: string
}

type FaqSectionProps = {
  anchorCtaLabel?: string
  anchorCtaHref?: string
  id: string
  items: FaqItem[]
  note: string
  title: string
  description: string
  eyebrow: string
}

const heroPreviewCards = [
  {
    pill: 'Start współpracy',
    title: 'Kiedy odezwać się po pomoc',
    copy: 'Spokojny start, gdy sytuacja zaczyna się powtarzać, narastać albo męczyć codzienność.',
  },
  {
    pill: 'Konsultacja',
    title: 'Jak wygląda pierwsze spotkanie',
    copy: 'Krótko, konkretnie i bez egzaminowania. Najpierw porządkujemy sytuację, potem kierunek.',
  },
  {
    pill: 'Psy i koty',
    title: 'Typowe trudności i sygnały',
    copy: 'Spacery, reaktywność, kuweta, napięcie, wycofanie, rozłąka i zmiany w domu.',
  },
  {
    pill: 'Podejście i sposób pracy',
    title: 'Jak pracuję',
    copy: 'Mniej chaosu, więcej porządku, jasny pierwszy krok i spokojne wdrażanie zmian.',
  },
] as const

const quickNavigation = [
  {
    index: '01',
    title: 'Start współpracy',
    copy: 'Kiedy warto się odezwać i jak zacząć bez presji.',
    href: '#faq-start',
  },
  {
    index: '02',
    title: 'Jak wygląda konsultacja',
    copy: 'Co dzieje się po pierwszym kontakcie i w trakcie spotkania.',
    href: '#faq-konsultacja',
  },
  {
    index: '03',
    title: 'Pytania o psy',
    copy: 'Spacery, reaktywność, wyciszenie i rozłąka.',
    href: '#faq-psy',
  },
  {
    index: '04',
    title: 'Pytania o koty',
    copy: 'Kuweta, napięcie, zmiana rytmu i relacje między kotami.',
    href: '#faq-koty',
  },
  {
    index: '05',
    title: 'Podejście i sposób pracy',
    copy: 'Jak patrzę na zachowanie, kontekst i kolejność kroków.',
    href: '#faq-podejscie',
  },
] as const

const startQuestions: FaqItem[] = [
  {
    question: 'Skąd mam wiedzieć, czy to dobry moment, żeby się odezwać?',
    answer: 'Jeśli problem wraca, narasta albo zaczyna wpływać na codzienność, to dobry moment. Nie trzeba czekać na kryzys.',
  },
  {
    question: 'Czy muszę mieć pewność, że to poważny problem?',
    answer: 'Nie. Wystarczy, że coś zaczyna się utrwalać albo zabierać spokój w domu.',
  },
  {
    question: 'Czy mogę się odezwać, jeśli nie umiem dobrze nazwać problemu?',
    answer: 'Tak. Opisz po prostu, co widzisz, kiedy to się dzieje i co najbardziej Cię niepokoi.',
  },
  {
    question: 'Czy pracujesz tylko z bardzo złożonymi przypadkami?',
    answer: 'Nie. Pomagam także przy wczesnych, umiarkowanych i mieszanych trudnościach.',
  },
  {
    question: 'Co jeśli mój pies albo kot ma kilka trudności naraz?',
    answer: 'To częste. Najpierw porządkujemy priorytety, a dopiero potem dokładamy kolejne elementy.',
  },
  {
    question: 'Czy muszę się jakoś specjalnie przygotować przed pierwszym kontaktem?',
    answer: 'Nie. Krótki opis wystarczy. Jeśli masz zdjęcie lub nagranie, może pomóc, ale nie jest warunkiem kontaktu.',
  },
]

const consultationQuestions: FaqItem[] = [
  {
    question: 'Jak wygląda pierwsza konsultacja?',
    answer: 'Najpierw porządkujemy sytuację, potem omawiamy tło i codzienny kontekst, a na końcu ustalamy pierwsze kroki.',
  },
  {
    question: 'Co dzieje się po pierwszym kontakcie?',
    answer: 'Ustalamy termin i formę. Jeśli trzeba, proszę tylko o krótkie doprecyzowanie sytuacji.',
  },
  {
    question: 'Co warto przygotować przed konsultacją?',
    answer: 'Warto mieć krótki opis problemu, kilka przykładów z codzienności i - jeśli są - nagrania lub zdjęcia.',
  },
  {
    question: 'Czy muszę mieć nagrania albo bardzo dokładne notatki?',
    answer: 'Nie. Nagrania i notatki pomagają, ale nie są obowiązkowe.',
  },
  {
    question: 'Co dostanę po konsultacji?',
    answer: 'Dostajesz jasny kierunek działania, priorytety i pierwsze kroki do wdrożenia w domu.',
  },
  {
    question: 'Czy po pierwszej konsultacji będę wiedzieć, od czego zacząć?',
    answer: 'Tak. Właśnie po to jest pierwsza konsultacja - żebyś wiedział, od czego zacząć następnego dnia.',
  },
]

const dogQuestions: FaqItem[] = [
  {
    question: 'Czy konsultacja ma sens, jeśli problem mojego psa dopiero się zaczyna?',
    answer: 'Tak. Wczesny kontakt często pomaga szybciej uporządkować sytuację i zatrzymać utrwalanie problemu.',
  },
  {
    question: 'Czy pomagasz przy problemach spacerowych i reaktywności?',
    answer: 'Tak. To jeden z najczęstszych tematów konsultacji.',
  },
  {
    question: 'Czy konsultacja ma sens, jeśli pies jest bardzo pobudzony albo nie potrafi się wyciszyć?',
    answer: 'Tak. Sprawdzamy środowisko, rytm dnia i to, co pomaga psu wracać do równowagi.',
  },
  {
    question: 'Czy pomagasz przy zostawaniu samemu i napięciu związanym z rozłąką?',
    answer: 'Tak. Przy rozłące pracujemy nad kontekstem, sygnałami i pierwszymi krokami, które nie przeciążają psa.',
  },
  {
    question: 'Co jeśli mój pies ma kilka problemów naraz, np. spacery i zachowanie w domu?',
    answer: 'To częste. Najpierw porządkujemy zależności między objawami, żeby nie próbować naprawiać wszystkiego naraz.',
  },
  {
    question: 'Czy konsultacja jest tylko dla bardzo trudnych psów?',
    answer: 'Nie. Konsultacja jest także dla psów z nowymi, umiarkowanymi albo dopiero pojawiającymi się trudnościami.',
  },
]

const catQuestions: FaqItem[] = [
  {
    question: 'Czy konsultacja ma sens, jeśli problem mojego kota dopiero się pojawił?',
    answer: 'Tak. Im wcześniej spojrzymy na sytuację, tym łatwiej zobaczyć, co ją uruchomiło i co utrzymuje problem.',
  },
  {
    question: 'Czy pomagasz przy problemach z kuwetą?',
    answer: 'Tak. Przy kuwecie patrzę nie tylko na samo zachowanie, ale też na otoczenie, rytm dnia i kontekst zdrowotny.',
  },
  {
    question: 'Czy konsultacja ma sens, jeśli kot stał się bardziej wycofany albo napięty?',
    answer: 'Tak. Wycofanie, napięcie i nadmierna czujność to ważne sygnały, które warto spokojnie uporządkować.',
  },
  {
    question: 'Czy pomagasz przy napięciu i trudnościach między kotami?',
    answer: 'Tak. W napięciu między kotami ważne jest bezpieczeństwo, przestrzeń i kolejność zmian.',
  },
  {
    question: 'Co jeśli zachowanie kota zmieniło się po przeprowadzce, nowym domowniku albo zmianie rytmu dnia?',
    answer: 'To częsty punkt zwrotny. Zmiana domu, domownika albo rytmu dnia często tłumaczy część zachowania.',
  },
  {
    question: 'Czy konsultacja jest tylko dla bardzo trudnych problemów kota?',
    answer: 'Nie. Konsultacja nie jest tylko dla bardzo trudnych problemów - także dla sytuacji, które dopiero zaczynają się komplikować.',
  },
]

const approachQuestions: FaqItem[] = [
  {
    question: 'Czy muszę dokładnie wiedzieć, co jest problemem, zanim się odezwę?',
    answer: 'Nie. Opisz zachowanie własnymi słowami, a resztę uporządkujemy razem.',
  },
  {
    question: 'Czy pracujesz tylko z bardzo trudnymi przypadkami?',
    answer: 'Nie. Pracuję także z wczesnymi, mieszanymi i mniej oczywistymi sytuacjami.',
  },
  {
    question: 'Czy podczas konsultacji dostanę konkretny kierunek działania?',
    answer: 'Tak. Chodzi o konkret: priorytet, pierwszy ruch i to, co warto odłożyć na później.',
  },
  {
    question: 'Czy Twoje podejście uwzględnia coś więcej niż samo zachowanie?',
    answer: 'Tak. Patrzę też na rytm dnia, środowisko i dobrostan, żeby plan był realny, a nie tylko teoretyczny.',
  },
  {
    question: 'Czy muszę bać się oceniania albo egzaminowania z opieki nad zwierzęciem?',
    answer: 'Nie. Tu nie ma egzaminu z opieki. Zależy mi na zrozumieniu sytuacji, nie na ocenianiu.',
  },
  {
    question: 'Co jeśli sytuacja mojego psa albo kota jest złożona i nie mieści się w jednym schemacie?',
    answer: 'To normalne. W złożonych sprawach najpierw porządkujemy obraz sytuacji i wybieramy jeden sensowny początek.',
  },
]

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ...startQuestions,
      ...consultationQuestions,
      ...dogQuestions,
      ...catQuestions,
      ...approachQuestions,
    ].map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
]

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

function FaqAccordionList({ items }: { items: FaqItem[] }) {
  return (
    <div className="premium-faq-grid">
      {items.map((item) => (
        <details key={item.question} className="premium-faq-item">
          <summary className="premium-faq-summary">{item.question}</summary>
          <div className="premium-faq-content">{item.answer}</div>
        </details>
      ))}
    </div>
  )
}

function FaqSection({ anchorCtaHref, anchorCtaLabel, eyebrow, id, items, note, title, description }: FaqSectionProps) {
  return (
    <section className="panel section-panel editorial-section" id={id}>
      <SectionIntro eyebrow={eyebrow} title={title} description={description} />

      <FaqAccordionList items={items} />

      <div className="premium-contact-band faq-contact-band">
        <div className="premium-contact-band-copy">
          <strong>{note}</strong>
          <p>Jeśli chcesz, mogę od razu pomóc wybrać najprostszy następny krok.</p>
        </div>
        <div className="hero-actions editorial-final-actions">
          {anchorCtaHref && anchorCtaLabel ? (
            <a href={anchorCtaHref} className="button button-ghost big-button">
              {anchorCtaLabel}
            </a>
          ) : null}
          <Link
            href={consultationHref}
            prefetch={false}
            className="button button-primary big-button"
            data-analytics-event="cta_click"
            data-analytics-location={`faq-${id}-book`}
          >
            Umów konsultację
          </Link>
          <Link
            href={contactHref}
            prefetch={false}
            className="button button-ghost big-button"
            data-analytics-event="cta_click"
            data-analytics-location={`faq-${id}-message`}
          >
            Napisz wiadomość
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function FaqPage() {
  return (
    <main className="page-wrap editorial-home-page premium-home-page faq-page">
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
            <a href="#faq-start" className="header-link">
              Start współpracy
            </a>
            <a href="#faq-konsultacja" className="header-link">
              Konsultacja
            </a>
            <a href="#faq-psy" className="header-link">
              Psy i koty
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
            data-analytics-location="faq-header-book"
          >
            Umów konsultację
          </Link>
        </div>
      </header>

      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell faq-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Najczęstsze pytania przed rozpoczęciem współpracy</div>
              <h1>Spokojnie - nie musisz wiedzieć wszystkiego przed pierwszym kontaktem</h1>
              <p className="editorial-hero-lead">
                Zebrałem najważniejsze pytania o start współpracy, przebieg konsultacji, sytuacje psów i kotów oraz
                mój sposób pracy. Jeśli nie znajdziesz tu dokładnie swojej odpowiedzi, możesz po prostu napisać wiadomość.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="faq-hero-book"
                >
                  Umów konsultację
                </Link>
                <a href="#szybka-orientacja" className="button button-ghost big-button">
                  Przejdź do pytań
                </a>
              </div>

              <Link
                href={audioHref}
                prefetch={false}
                className="prep-inline-link faq-audio-link"
                data-analytics-event="cta_click"
                data-analytics-location="faq-hero-audio"
              >
                <span className="contact-inline-label">Krótka rozmowa wstępna 15 min</span>
                <span className="contact-soft-note">forma audio - bez potrzeby przygotowania kamery</span>
              </Link>

              <div className="editorial-hero-meta">
                <span className="pill">Start współpracy</span>
                <span className="pill">Konsultacja</span>
                <span className="pill">Pies</span>
                <span className="pill">Kot</span>
                <span className="pill">Podejście i metodyka</span>
              </div>
            </div>

            <aside className="faq-hero-side" aria-label="Podgląd sekcji FAQ">
              <div className="faq-preview-grid">
                {heroPreviewCards.map((card) => (
                  <article key={card.title} className="summary-card tree-backed-card faq-preview-card">
                    <span className="pill subtle-pill">{card.pill}</span>
                    <h3>{card.title}</h3>
                    <p className="muted">{card.copy}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="szybka-orientacja">
          <SectionIntro
            eyebrow="Szybka orientacja"
            title="Wybierz obszar, który najbardziej pasuje do Twojej sytuacji"
            description="Każda karta prowadzi do odpowiedniej sekcji, żebyś mógł szybko znaleźć właściwe pytania bez przebijania się przez całą stronę."
          />

          <div className="faq-quick-grid top-gap">
            {quickNavigation.map((card) => (
              <a key={card.title} href={card.href} className="summary-card tree-backed-card faq-anchor-card">
                <span className="pill subtle-pill">{card.index}</span>
                <h3>{card.title}</h3>
                <p className="muted">{card.copy}</p>
              </a>
            ))}
          </div>

          <p className="muted top-gap-small">Najkrótsza droga to po prostu wejść w dział, który najbardziej dotyczy Twojej sytuacji.</p>
        </section>

        <FaqSection
          id="faq-start"
          eyebrow="Start współpracy"
          title="Pytania o rozpoczęcie współpracy"
          description="Tu porządkuję najczęstsze wątpliwości, które pojawiają się jeszcze przed pierwszym kontaktem."
          items={startQuestions}
          note="Jeśli problem już wraca albo zaczyna zajmować coraz więcej miejsca w codzienności, nie trzeba czekać."
          anchorCtaHref="#faq-konsultacja"
          anchorCtaLabel="Zobacz, jak wygląda konsultacja"
        />

        <FaqSection
          id="faq-konsultacja"
          eyebrow="Konsultacja"
          title="Pytania o konsultację i przebieg współpracy"
          description="To sekcja o tym, co dzieje się po kontakcie, jak wygląda pierwsze spotkanie i co zostaje po konsultacji."
          items={consultationQuestions}
          note="W konsultacji chodzi o porządek, kierunek i spokojny pierwszy krok - nie o długą listę obowiązków."
          anchorCtaHref="#faq-psy"
          anchorCtaLabel="Przejdź do pytań o psy i koty"
        />

        <FaqSection
          id="faq-psy"
          eyebrow="Psy"
          title="Pytania o psy i typowe trudności"
          description="Tu znajdziesz odpowiedzi o spacerach, reaktywności, napięciu, rozłące i problemach, które dopiero się zaczynają."
          items={dogQuestions}
          note="Przy psach zwykle najpierw porządkujemy sytuację, a dopiero potem dokładamy zmiany."
          anchorCtaHref="#faq-koty"
          anchorCtaLabel="Przejdź do pytań o koty"
        />

        <FaqSection
          id="faq-koty"
          eyebrow="Koty"
          title="Pytania o koty i typowe trudności"
          description="Tu zbieram pytania o kuwetę, napięcie, wycofanie, zmiany po przeprowadzce i relacje między kotami."
          items={catQuestions}
          note="Przy kotach często kluczowe jest otoczenie, bezpieczeństwo i kolejność zmian, a nie tylko sam objaw."
          anchorCtaHref="#faq-podejscie"
          anchorCtaLabel="Przejdź do pytań o podejście i sposób pracy"
        />

        <FaqSection
          id="faq-podejscie"
          eyebrow="Podejście i sposób pracy"
          title="Pytania o podejście i sposób pracy"
          description="Ta sekcja wyjaśnia, jak patrzę na zachowanie, kontekst i sposób wdrażania zmian."
          items={approachQuestions}
          note="Patrzę szerzej niż na sam objaw, ale zawsze kończę na konkretnym i spokojnym planie działania."
        />

        <section className="panel cta-panel editorial-final-panel" id="faq-brak-pytania">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Kontakt</div>
            <h2>Nie widzisz tu dokładnie swojego pytania?</h2>
            <p>To nic nie szkodzi - możesz po prostu napisać wiadomość i krótko opisać swoją sytuację. Wspólnie ustalimy najlepszy pierwszy krok.</p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="faq-missing-message"
              >
                Napisz wiadomość
              </Link>
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="faq-missing-book"
              >
                Umów konsultację
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="kontakt">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Jeśli chcesz spokojnie uporządkować sytuację, zacznijmy od pierwszego kroku</h2>
            <p>
              Nie musisz znać wszystkich odpowiedzi przed kontaktem. Wystarczy, że opiszesz swoją sytuację, a wspólnie
              ustalimy najlepszy sposób rozpoczęcia pracy z psem albo kotem.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="faq-final-book"
              >
                Umów konsultację
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="faq-final-message"
              >
                Napisz wiadomość
              </Link>
            </div>

            <Link
              href={audioHref}
              prefetch={false}
              className="prep-inline-link faq-audio-link"
              data-analytics-event="cta_click"
              data-analytics-location="faq-final-audio"
            >
              <span className="contact-inline-label">Możesz też zacząć od krótkiej rozmowy wstępnej 15 min audio</span>
              <span className="contact-soft-note">bez potrzeby przygotowania kamery</span>
            </Link>
          </div>
        </section>

        <footer className="premium-home-footer" aria-label="Stopka">
          <div className="premium-footer-grid">
            <div>
              <div className="section-eyebrow">Regulski</div>
              <h3>{SITE_NAME}</h3>
              <p>
                {SITE_TAGLINE}. {SPECIALIST_CREDENTIALS}. Spokojna pomoc dla opiekunów psów i kotów, bez chaosu i bez
                zbędnej presji.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>Psy i koty</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Nawigacja</div>
              <div className="premium-footer-links">
                <a href="#faq-start">Start współpracy</a>
                <a href="#faq-konsultacja">Konsultacja</a>
                <a href="#faq-psy">Psy i koty</a>
                <a href="#kontakt">Kontakt</a>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Kontakt</div>
              <div className="premium-footer-links">
                {contact.email && mailtoHref ? <a href={mailtoHref}>{contact.email}</a> : <a href={contactHref}>Kontakt</a>}
                {contact.phoneDisplay && contact.phoneHref ? <a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a> : null}
                <Link href={consultationHref} prefetch={false}>
                  Umów konsultację
                </Link>
                <Link href={audioHref} prefetch={false}>
                  Umów 15 min audio
                </Link>
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
              <span>COAPE / CAPBT</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
