import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  HelpCircle,
  MessageCircle,
  Monitor,
  WalletCards,
} from 'lucide-react'
import { ReferenceContactCard, ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_SERVICE_CONFIG, type PublicBookingServiceType } from '@/lib/funnel'
import {
  PUBLIC_OFFER_BOOKING_PAYMENT,
  PUBLIC_OFFER_BOOKING_PROCESS,
  PUBLIC_OFFER_CANCELLATION_COPY,
} from '@/lib/public-offer-copy'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik konsultacji behawioralnych',
  path: '/cennik',
  description:
    'Kwadrans 69 zł, Dwa kwadranse 169 zł, Pełna konsultacja 470 zł. Kwadrans na już (99 zł) to ten sam format z szybkim terminem - dostępny przy rezerwacji.',
})

const bookHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'

const pricingCards: Array<{
  service: PublicBookingServiceType
  badge: string
  title: string
  price: string
  copy: string
  features: string[]
  cta: string
  featured?: boolean
}> = [
  {
    service: 'szybka-konsultacja-15-min',
    badge: 'najprostszy start',
    title: 'Kwadrans',
    price: '69 zł',
    copy: '15 minut audio bez kamery, gdy chcesz nazwać problem i ustalić pierwszy sensowny krok.',
    features: ['jedno pytanie albo pierwszy porządek', 'audio bez kamery', 'dobry start przed większą decyzją'],
    cta: 'Zarezerwuj Kwadrans',
    featured: true,
  },
  {
    service: 'kwadrans-na-juz',
    badge: 'priorytet',
    title: 'Kwadrans na już',
    price: '99 zł',
    copy: 'Ten sam 15-minutowy format, ale z priorytetem i możliwie szybkim potwierdzeniem terminu.',
    features: ['ten sam zakres co Kwadrans', 'szybsze potwierdzenie', 'dla tematów pilnych, ale krótkich'],
    cta: 'Sprawdź termin',
  },
  {
    service: 'konsultacja-30-min',
    badge: 'więcej czasu',
    title: 'Dwa kwadranse',
    price: '169 zł',
    copy: '30 minut online, gdy temat ma kilka wątków albo potrzebujesz spokojniejszego wejścia.',
    features: ['więcej kontekstu niż w Kwadransie', 'dla kilku pytań naraz', 'dobry most przed pełną konsultacją'],
    cta: 'Zarezerwuj 30 min',
  },
  {
    service: 'konsultacja-behawioralna-online',
    badge: 'pełny zakres',
    title: 'Pełna konsultacja',
    price: '470 zł',
    copy: 'Rozmowa online, analiza sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    features: ['sprawy złożone i przewlekłe', 'plan pracy po konsultacji', '7 dni kontaktu tekstowego'],
    cta: 'Zarezerwuj pełną konsultację',
  },
]

const pricingFaqItems = [
  {
    question: 'Czym różni się Kwadrans od Kwadransu na już?',
    answer:
      'Zakres jest taki sam: 15 minut audio bez kamery. Wariant za 99 zł dotyczy priorytetu i możliwie szybkiego terminu, a nie dłuższej konsultacji.',
  },
  {
    question: 'Kiedy wybrać Dwa kwadranse?',
    answer:
      'Gdy jedno pytanie rozlewa się na kilka wątków, a 15 minut byłoby za ciasne na spokojne uporządkowanie sytuacji.',
  },
  {
    question: 'Kiedy od razu pełna konsultacja?',
    answer:
      'Przy sprawach złożonych, przewlekłych albo takich, które wymagają diagnozy, planu pracy i dalszego kontaktu po rozmowie.',
  },
  {
    question: 'Jak wygląda płatność?',
    answer: `${PUBLIC_OFFER_BOOKING_PAYMENT} ${PUBLIC_OFFER_CANCELLATION_COPY}`,
  },
]

export default function PricingPage() {
  return (
    <ReferencePageShell className="reference-pricing-page" ctaHref={bookHref}>
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
          ]),
          getServiceJsonLd({
            name: 'Cennik konsultacji behawioralnych - psy i koty',
            description:
              'Formaty konsultacji: Kwadrans, Kwadrans na już, Dwa kwadranse i Pełna konsultacja behawioralna online.',
            serviceUrl: '/cennik',
            offerCatalog: pricingCards.map((card) => {
              const service = FUNNEL_SERVICE_CONFIG[card.service]

              return {
                name: service.title,
                description: service.publicSummary,
                url: buildBookHref(null, card.service),
                price: service.priceAmount,
              }
            }),
          }),
        ]}
      />

      <section className="reference-hero reference-pricing-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">Cennik</span>
          <h1>Cennik konsultacji behawioralnych.</h1>
          <p>
            Wybierz najmniejszy format, który pasuje do sytuacji. Kwadrans jest pierwszym krokiem, Dwa kwadranse dają
            więcej miejsca, a pełna konsultacja obejmuje plan i dalsze wsparcie.
          </p>
          <div className="reference-hero-actions">
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href={contactHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Wyślij krótką wiadomość
            </Link>
          </div>
        </div>
        <div className="reference-pricing-summary" aria-label="Skrót cennika">
          <div className="reference-pricing-badge">
            <WalletCards size={24} strokeWidth={1.7} aria-hidden="true" />
            <span>od 69 zł</span>
          </div>
          <div className="reference-price-ladder">
            {pricingCards.map((card) => (
              <Link key={card.service} href={buildBookHref(null, card.service)} prefetch={false}>
                <span>{card.title}</span>
                <strong>{card.price}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="reference-category-grid" aria-label="Najważniejsze informacje o płatności">
        <article className="reference-category-card reference-static-card">
          <CalendarCheck size={25} strokeWidth={1.7} aria-hidden="true" />
          <span>
            <strong>Termin po wyborze</strong>
            <small>Rezerwujesz format i wybierasz dostępny termin.</small>
          </span>
        </article>
        <article className="reference-category-card reference-static-card">
          <CreditCard size={25} strokeWidth={1.7} aria-hidden="true" />
          <span>
            <strong>Płatność ręczna</strong>
            <small>Po potwierdzeniu widzisz instrukcję płatności.</small>
          </span>
        </article>
        <article className="reference-category-card reference-static-card">
          <Monitor size={25} strokeWidth={1.7} aria-hidden="true" />
          <span>
            <strong>Online w Polsce</strong>
            <small>Spokojna rozmowa bez stresu dla zwierzęcia.</small>
          </span>
        </article>
      </section>

      <section className="reference-main-layout">
        <div className="reference-content-column">
          <section className="reference-section-card">
            <h2>Wybierz format</h2>
            <div className="reference-pricing-grid">
              {pricingCards.map((card) => (
                <article key={card.service} className={`reference-price-card${card.featured ? ' is-featured' : ''}`}>
                  <span className="reference-price-badge">{card.badge}</span>
                  <div className="reference-price-heading">
                    <h3>{card.title}</h3>
                    <strong>{card.price}</strong>
                  </div>
                  <p>{card.copy}</p>
                  <ul>
                    {card.features.map((feature) => (
                      <li key={feature}>
                        <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={buildBookHref(null, card.service)}
                    prefetch={false}
                    className={card.featured ? 'reference-btn reference-btn-primary' : 'reference-btn reference-btn-secondary'}
                  >
                    {card.cta}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="reference-section-card">
            <h2>Jak wygląda rezerwacja</h2>
            <div className="reference-steps">
              {PUBLIC_OFFER_BOOKING_PROCESS.map((step, index) => (
                <article key={step} className="reference-step">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="reference-section-card">
            <h2>Najczęstsze pytania przed wyborem</h2>
            <div className="reference-compact-faq">
              {pricingFaqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.question}
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="reference-sidebar">
          <div className="reference-side-card reference-help-card">
            <h2>Nie wiesz, co wybrać?</h2>
            <p>
              Zacznij od Kwadransu, jeśli chcesz nazwać problem i ustalić pierwszy kierunek. Jeśli temat jest większy,
              wybierz Dwa kwadranse albo pełną konsultację.
            </p>
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href={contactHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Wyślij pytanie
            </Link>
          </div>

          <div className="reference-side-card">
            <h2>Szybkie odpowiedzi</h2>
            <div className="reference-info-list">
              <div className="reference-info-row">
                <Clock3 size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>15 albo 30 minut</strong>
                  <small>Krótki format pomaga uporządkować decyzję bez dużego zobowiązania.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <FileText size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Regulaminy</strong>
                  <small>
                    <Link href="/regulamin" prefetch={false}>
                      Regulamin rezerwacji
                    </Link>{' '}
                    i{' '}
                    <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
                      pełnej konsultacji
                    </Link>
                    .
                  </small>
                </span>
              </div>
              <div className="reference-info-row">
                <HelpCircle size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Materiały zamiast rozmowy</strong>
                  <small>
                    Jeśli nie chcesz jeszcze rezerwować, sprawdź{' '}
                    <Link href="/niezbednik" prefetch={false}>
                      Niezbędnik
                    </Link>
                    .
                  </small>
                </span>
              </div>
              <div className="reference-info-row">
                <MessageCircle size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Krótka wiadomość</strong>
                  <small>Napisz, jeśli wahasz się między formatami.</small>
                </span>
              </div>
            </div>
          </div>

          <ReferenceContactCard />
        </aside>
      </section>

      <ReferenceFinalCta
        title="Gotowy na pierwszy krok?"
        copy="Wybierz dogodny termin albo napisz krótko, co się dzieje - podpowiem, od którego formatu zacząć."
        primaryHref={bookHref}
        primaryLabel="Umów pierwszy krok"
        secondaryHref={contactHref}
        secondaryLabel="Wyślij krótką wiadomość"
      />
    </ReferencePageShell>
  )
}
