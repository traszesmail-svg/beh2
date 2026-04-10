import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import { buildMailtoHref, getContactDetails, SPECIALIST_CREDENTIALS, SITE_NAME, SITE_SHORT_NAME, SITE_TAGLINE } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt / rezerwacja',
  path: '/kontakt',
  description:
    'Kontakt i rezerwacja dla marki Regulski. Zacznij od najprostszej formy: konsultacji, krótkiej wiadomości albo 15 min audio.',
})

const consultationHref = buildBookHref()
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')

// contact-feature-image

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type ListCardProps = {
  title: string
  items: readonly string[]
}

type DecisionCard = {
  pill: string
  title: string
  items: readonly string[]
  note?: string
}

const heroPreviewCards = [
  {
    pill: 'Najmocniejszy start',
    title: 'Umów konsultację',
    copy: 'Wejście prosto w termin i spokojny pierwszy plan pracy.',
  },
  {
    pill: 'Krótki opis',
    title: 'Napisz wiadomość',
    copy: 'Wystarczy kilka zdań o psie albo kocie, żeby dobrać kierunek.',
  },
  {
    pill: 'Niski próg wejścia',
    title: '15 min audio',
    copy: 'Krótka forma audio, bez potrzeby przygotowania kamery.',
  },
] as const

const contactMethods = [
  {
    pill: 'Najlepszy start',
    title: 'Umów konsultację',
    description: 'Najlepsza opcja, jeśli chcesz od razu rozpocząć pracę i wejść w jasny plan.',
    cta: 'Przejdź do rezerwacji',
    href: consultationHref,
    external: false,
  },
  {
    pill: 'Dobra na start',
    title: 'Napisz wiadomość',
    description: 'Dobra, jeśli chcesz najpierw krótko opisać sytuację psa albo kota i zadać pytanie.',
    cta: 'Napisz wiadomość',
    href: '#formularz',
    external: true,
  },
  {
    pill: 'Krótka rozmowa',
    title: 'Krótka rozmowa wstępna 15 min',
    description: 'Krótka forma audio, bez potrzeby przygotowania kamery. Dobra, jeśli nie wiesz jeszcze, czego potrzebujesz.',
    cta: 'Umów 15 min',
    href: audioHref,
    external: false,
  },
] as const

const contactSteps = [
  {
    number: '01',
    title: 'Wybierz formę startu',
    copy: 'Konsultacja, wiadomość albo 15 min audio. Każda ścieżka jest równie poprawnym początkiem.',
  },
  {
    number: '02',
    title: 'Krótko opisz sytuację',
    copy: 'Wystarczy kilka zdań o psie albo kocie. Nie trzeba pisać wszystkiego od razu.',
  },
  {
    number: '03',
    title: 'Ustalamy termin',
    copy: 'Dopasowujemy spokojny i prosty dalszy ruch, bez dodatkowego zamieszania.',
  },
  {
    number: '04',
    title: 'Zaczynamy spokojnie i konkretnie',
    copy: 'Bez presji, bez chaosu i bez zgadywania, co powinno być zrobione najpierw.',
  },
] as const

const whatToPrepare = {
  ready: [
    'Krótki opis problemu',
    'Od kiedy to trwa',
    'Najbardziej typowe sytuacje',
    'Podstawy codzienności',
    'Nagrania lub zdjęcia, jeśli są',
  ],
  notNeeded: [
    'Idealnie spisany problem',
    'Diagnoza',
    'Długie notatki',
    'Profesjonalne nagrania',
    'Pełna historia od początku życia zwierzęcia',
  ],
} as const

const decisionCards: DecisionCard[] = [
  {
    pill: 'Napisz wiadomość',
    title: 'Napisz wiadomość, jeśli...',
    items: ['chcesz krótko opisać sytuację', 'masz temat mieszany', 'wolisz najpierw zadać jedno pytanie'],
  },
  {
    pill: 'Umów konsultację',
    title: 'Umów konsultację, jeśli...',
    items: ['chcesz od razu wejść w termin', 'potrzebujesz planu działania', 'nie chcesz długiej wymiany wiadomości'],
  },
  {
    pill: '15 min audio',
    title: 'Wybierz 15 min audio, jeśli...',
    items: ['chcesz krótki start', 'nie chcesz przygotowywać kamery', 'chcesz sprawdzić najlepszą ścieżkę'],
    note: 'Krótka forma audio bez potrzeby przygotowania kamery.',
  },
] as const

const trustCards = [
  {
    pill: 'Behawiorysta COAPE',
    title: 'Ramy pracy oparte na doświadczeniu i uporządkowanym spojrzeniu na zachowanie.',
  },
  {
    pill: 'Psy i koty',
    title: 'Jedna strona kontaktu dla obu gatunków, bez rozbijania sprawy na dwa różne wejścia.',
  },
  {
    pill: 'Spokojne podejście',
    title: 'Mniej formalności, więcej czytelnego kierunku i spokojnego startu.',
  },
  {
    pill: 'Technik weterynarii',
    title: 'Szersze spojrzenie na zachowanie, codzienność i dobrostan zwierzęcia.',
  },
] as const

const faqItems = [
  {
    question: 'Czy muszę dokładnie opisać cały problem już w pierwszej wiadomości?',
    answer: 'Nie. Wystarczy krótki opis sytuacji, od kiedy to trwa i co najbardziej Cię niepokoi.',
  },
  {
    question: 'Co jeśli nie wiem, czy wybrać wiadomość, konsultację czy 15 min?',
    answer: 'Jeśli masz wątpliwość, zacznij od wiadomości albo 15 min audio. To najprostsze wejście.',
  },
  {
    question: 'Czy rozmowa 15 min wymaga włączenia kamery?',
    answer: 'Nie. To forma audio, bez potrzeby przygotowania kamery.',
  },
  {
    question: 'Czy mogę najpierw tylko zadać pytanie, zanim umówię konsultację?',
    answer: 'Tak. Krótka wiadomość wystarczy, żeby sprawdzić, jaki start ma sens.',
  },
  {
    question: 'Czy muszę mieć nagrania, zdjęcia albo notatki przed kontaktem?',
    answer: 'Nie. Jeśli coś masz, pomoże. Jeśli nie, nadal możesz napisać.',
  },
  {
    question: 'Co jeśli nadal nie jestem pewny, czy to dobry moment?',
    answer: 'Jeśli problem wraca, narasta albo chcesz go spokojnie uporządkować, to dobry moment, by się odezwać.',
  },
] as const

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

function ListCard({ title, items }: ListCardProps) {
  return (
    <article className="summary-card tree-backed-card">
      <h3>{title}</h3>
      <ul className="premium-bullet-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default function ContactPage() {
  const contact = getContactDetails()
  const mailtoHref = buildMailtoHref(
    contact.email,
    'Zapytanie - Regulski | Kontakt i rezerwacja',
    'Dzień dobry,\n\nkrótko opisuję sytuację psa albo kota:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- co najbardziej mnie niepokoi:\n',
  )

  return (
    <main className="page-wrap editorial-home-page premium-home-page contact-page">
      <header className="premium-home-header">
        <div className="container premium-home-header-inner">
          <Link href="/" prefetch={false} className="premium-home-brand" aria-label={SITE_NAME}>
            <span className="brand-copy">
              <span className="brand">{SITE_SHORT_NAME}</span>
              <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
            </span>
          </Link>

          <nav className="premium-home-nav" aria-label="Główna nawigacja">
            <a href="#kontakt" className="header-link">
              Kontakt
            </a>
            <a href="#jak-umowic-konsultacje" className="header-link">
              Jak umówić konsultację
            </a>
            <a href="#faq" className="header-link">
              FAQ
            </a>
            <a href="#rezerwacja" className="header-link">
              Rezerwacja
            </a>
          </nav>

          <Link
            href={consultationHref}
            prefetch={false}
            className="button button-primary big-button premium-home-header-cta"
            data-analytics-event="cta_click"
            data-analytics-location="contact-header-book"
          >
            Umów konsultację
          </Link>
        </div>
      </header>

      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell contact-hero-shell" id="kontakt">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Kontakt i rezerwacja konsultacji</div>
              <h1>Zacznij od najprostszego pierwszego kroku</h1>
              <p className="editorial-hero-lead">
                Możesz od razu umówić konsultację albo po prostu napisać wiadomość. Nie musisz mieć wszystkiego
                uporządkowanego - wystarczy krótki opis sytuacji psa albo kota.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="contact-lead-general"
                >
                  Umów konsultację
                </Link>
                <a
                  href="#formularz"
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="contact-lead-resource"
                >
                  Napisz wiadomość
                </a>
              </div>

              <Link
                href={audioHref}
                prefetch={false}
                className="prep-inline-link contact-audio-link"
                data-analytics-event="cta_click"
                data-analytics-location="contact-lead-reschedule"
              >
                <span className="contact-inline-label">Krótka rozmowa wstępna 15 min</span>
                <span className="contact-soft-note">forma audio - bez potrzeby przygotowania kamery</span>
              </Link>

              <p className="contact-support-copy">Napisz krótko, co się dzieje. Podpowiem najprostszy start.</p>

              <div className="contact-identity-line">
                <span>Piszesz do mnie</span>
                <strong>Krzysztof Regulski</strong>
                <span>COAPE / CAPBT</span>
              </div>

              <div className="editorial-hero-meta">
                <span className="pill">Pies</span>
                <span className="pill">Kot</span>
                <span className="pill">Problemy zachowania</span>
                <span className="pill">Spokojny pierwszy krok</span>
              </div>
            </div>

            <aside className="contact-hero-side" aria-label="Najprostsze wejścia">
              {heroPreviewCards.map((card) => (
                <article key={card.title} className="summary-card tree-backed-card contact-hero-card">
                  <span className="pill subtle-pill">{card.pill}</span>
                  <h3>{card.title}</h3>
                  <p className="muted">{card.copy}</p>
                </article>
              ))}
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="wybierz-sposob-rozpoczecia">
          <SectionIntro
            eyebrow="Sposób startu"
            title="Wybierz najwygodniejszy sposób rozpoczęcia"
            description="Każdy wariant prowadzi do tego samego celu: spokojnego pierwszego kroku bez presji i bez chaosu."
          />

          <div className="card-grid three-up top-gap">
            {contactMethods.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <span className="pill subtle-pill">{card.pill}</span>
                <h3>{card.title}</h3>
                <p className="muted">{card.description}</p>
                {card.external ? (
                  <a
                    href={card.href}
                    className="prep-inline-link"
                    data-analytics-event="cta_click"
                    data-analytics-location={`contact-method-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {card.cta}
                  </a>
                ) : (
                  <Link
                    href={card.href}
                    prefetch={false}
                    className="prep-inline-link"
                    data-analytics-event="cta_click"
                    data-analytics-location={`contact-method-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {card.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>

          <p className="muted top-gap-small">Im mniej napięcia na wejściu, tym łatwiej zacząć spokojnie.</p>
        </section>

        <section className="panel section-panel editorial-section" id="jak-umowic-konsultacje">
          <SectionIntro
            eyebrow="Jak zacząć"
            title="Jak umówić konsultację krok po kroku"
            description="Wystarczy krótki opis sytuacji. Resztę uporządkujemy po stronie ustalenia terminu i pierwszego kierunku pracy."
          />

          <div className="card-grid four-up top-gap">
            {contactSteps.map((step) => (
              <article key={step.number} className="summary-card tree-backed-card">
                <span className="pill subtle-pill">{step.number}</span>
                <h3>{step.title}</h3>
                <p className="muted">{step.copy}</p>
              </article>
            ))}
          </div>

          <div className="premium-contact-band top-gap">
            <div className="premium-contact-band-copy">
              <strong>Nie musisz mieć gotowego opisu całej sytuacji.</strong>
              <p>Wystarczy, że napiszesz kilka zdań i wybierzesz najwygodniejszą formę startu.</p>
            </div>
            <div className="hero-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="contact-lead-guide"
              >
                Przejdź do rezerwacji
              </Link>
              <a
                href="#formularz"
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="contact-lead-bundle"
              >
                Najpierw chcę napisać wiadomość
              </a>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-warto-przygotowac">
          <SectionIntro
            eyebrow="Przygotowanie"
            title="Co warto przygotować przed pierwszą wiadomością lub rozmową"
            description="To tylko ułatwia start. Nie jest warunkiem kontaktu ani nie blokuje rezerwacji."
          />

          <div className="premium-two-column-grid top-gap">
            <ListCard title="Warto przygotować" items={whatToPrepare.ready} />
            <ListCard title="Na start nie musisz mieć" items={whatToPrepare.notNeeded} />
          </div>

          <div className="premium-contact-band top-gap">
            <div className="premium-contact-band-copy">
              <strong>Im mniej presji na wejściu, tym łatwiej zacząć.</strong>
              <p>Jeśli chcesz, możesz od razu wysłać krótką wiadomość albo wejść w 15 min audio.</p>
            </div>
            <div className="hero-actions">
              <a href="#formularz" className="button button-primary big-button">
                Napisz wiadomość
              </a>
              <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
                Wolę od razu umówić konsultację
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="nie-wiesz-od-czego-zaczac">
          <SectionIntro
            eyebrow="Wybór wariantu"
            title="Nie wiesz, od czego zacząć? Wybierz najprostszy wariant dla swojej sytuacji"
            description="To nie jest test. Wystarczy wybrać ścieżkę, która teraz daje najmniej napięcia i najwięcej jasności."
          />

          <div className="card-grid three-up top-gap">
            {decisionCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <span className="pill subtle-pill">{card.pill}</span>
                <h3>{card.title}</h3>
                <ul className="premium-bullet-list">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {card.note ? <p className="muted">{card.note}</p> : null}
              </article>
            ))}
          </div>

          <p className="muted top-gap-small">Najprościej: jeśli masz wątpliwość, zacznij od wiadomości albo 15 min audio.</p>

          <div className="hero-actions top-gap-small">
            <a href="#formularz" className="button button-primary big-button">
              Przejdź do danych kontaktowych i rezerwacji
            </a>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="zaufanie">
          <SectionIntro
            eyebrow="Zaufanie"
            title="Spokojny pierwszy krok oparty na doświadczeniu i jasnym sposobie pracy"
            description="Ta strona ma zmniejszać stres przed kontaktem. W centrum jest prosty start, a nie formalność."
          />

          <div className="card-grid four-up top-gap">
            {trustCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <span className="pill subtle-pill">{card.pill}</span>
                <p className="muted">{card.title}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap-small">Szersze spojrzenie na zachowanie i dobrostan pomaga wybrać pierwszy ruch bez zgadywania.</p>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania przed kontaktem i rezerwacją"
            description="Krótko odpowiadam na rzeczy, które najczęściej zatrzymują ludzi tuż przed pierwszym krokiem."
          />

          <div className="premium-faq-grid top-gap">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band">
            <div className="premium-contact-band-copy">
              <strong>Jeśli wolisz najpierw doprecyzować sytuację, napisz wiadomość albo od razu umów konsultację.</strong>
              <p>Odpowiadam osobiście i pomagam wybrać najprostszy start.</p>
            </div>
            <div className="hero-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="contact-lead-guide"
              >
                Przejdź do rezerwacji
              </Link>
              <a
                href="#formularz"
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="contact-lead-resource"
              >
                Najpierw chcę napisać wiadomość
              </a>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="rezerwacja">
          <SectionIntro
            eyebrow="Rezerwacja"
            title="Wybierz najprostszy sposób kontaktu i zacznijmy od pierwszego kroku"
            description="Nie musisz mieć wszystkiego idealnie przygotowanego. Wystarczy, że wybierzesz najwygodniejszą formę kontaktu i krótko opiszesz sytuację psa albo kota."
          />

          <div className="premium-two-column-grid top-gap">
            <article className="summary-card tree-backed-card contact-booking-card">
              <span className="pill">Umów konsultację</span>
              <h3>Jeśli chcesz, zacznijmy od rezerwacji</h3>
              <p className="muted">Po rezerwacji wspólnie ustalimy najlepszy pierwszy krok. To najprostsza droga, gdy chcesz wejść od razu w działanie.</p>

              <ul className="premium-bullet-list">
                <li>jasny termin bez chaosu</li>
                <li>spokojny start pracy</li>
                <li>dobór dalszego kierunku do konkretnej sytuacji</li>
              </ul>

              <div className="hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="contact-final-book"
                >
                  Przejdź do rezerwacji
                </Link>
                <Link
                  href={audioHref}
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="contact-lead-bundle"
                >
                  Umów 15 min audio
                </Link>
              </div>

              <span className="contact-soft-note">Krótka forma audio bez potrzeby przygotowania kamery.</span>
            </article>

            <article className="summary-card tree-backed-card" id="formularz">
              <span className="pill subtle-pill">Napisz wiadomość</span>
              <h3>Krótki formularz</h3>
              <p className="muted">Wystarczy imię, kontakt, pies / kot i krótki opis sytuacji.</p>
              <ContactLeadForm />
            </article>
          </div>

          <p className="muted top-gap-small">
            Jeśli nie wiesz, którą opcję wybrać, najprościej zacząć od wiadomości albo 15 min audio.
          </p>
        </section>

        <footer className="premium-home-footer" aria-label="Stopka">
          <div className="premium-footer-grid">
            <div>
              <div className="section-eyebrow">Regulski</div>
              <h3>{SITE_NAME}</h3>
              <p>
                {SITE_TAGLINE}. {SPECIALIST_CREDENTIALS}. Konsultacje dla psów i kotów w Olsztynie i online.
              </p>
              <div className="editorial-hero-meta">
                <span>Behawiorysta COAPE</span>
                <span>Psy i koty</span>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Nawigacja</div>
              <div className="premium-footer-links">
                <a href="#kontakt">Kontakt</a>
                <a href="#jak-umowic-konsultacje">Jak umówić konsultację</a>
                <a href="#faq">FAQ</a>
                <a href="#rezerwacja">Rezerwacja</a>
              </div>
            </div>

            <div>
              <div className="section-eyebrow">Kontakt</div>
              <div className="premium-footer-links">
                <a href={mailtoHref}>{contact.email}</a>
                {contact.phoneDisplay && contact.phoneHref ? (
                  <a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a>
                ) : (
                  <span>Telefon po wiadomości</span>
                )}
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
              <a href={mailtoHref}>Napisz wiadomość</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
