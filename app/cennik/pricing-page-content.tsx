import Link from 'next/link'
import { CheckCircle2, WalletCards } from 'lucide-react'
import { FUNNEL_SERVICE_CONFIG, type PublicBookingServiceType } from '@/lib/funnel'
import { PUBLIC_OFFER_BOOKING_PAYMENT, PUBLIC_OFFER_CANCELLATION_COPY } from '@/lib/public-offer-copy'

export const bookHref = '/wybor'
export const contactHref = '/kontakt#formularz'
export const fullPricingHref = '/cennik/pelny'

export const pricingCards: Array<{
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
    features: ['diagnoza behawioralna na podstawie informacji z rozmowy', 'audio bez kamery', 'dobry start przed większą decyzją'],
    cta: 'Wybierz ścieżkę',
    featured: true,
  },
  {
    service: 'kwadrans-na-juz',
    badge: 'priorytet',
    title: 'Kwadrans na już',
    price: '99 zł',
    copy: 'Ten sam 15-minutowy format, ale z priorytetem i możliwie szybkim potwierdzeniem terminu.',
    features: ['diagnoza w tym samym 15-minutowym zakresie', 'szybsze potwierdzenie', 'dla tematów pilnych, ale krótkich'],
    cta: 'Wybierz ścieżkę',
  },
  {
    service: 'konsultacja-30-min',
    badge: 'więcej czasu',
    title: 'Dwa kwadranse',
    price: '169 zł',
    copy: '30 minut online, gdy temat ma kilka wątków albo potrzebujesz spokojniejszego wejścia.',
    features: ['diagnoza z większą ilością kontekstu', 'dla kilku pytań naraz', 'dobry most przed pełną konsultacją'],
    cta: 'Wybierz ścieżkę',
  },
  {
    service: 'konsultacja-behawioralna-online',
    badge: 'pełny zakres',
    title: 'Pełna konsultacja',
    price: '470 zł',
    copy: 'Rozmowa online, analiza sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    features: ['diagnoza, prawdopodobna etiologia i przebieg problemu', 'plan pracy po konsultacji', '7 dni kontaktu tekstowego'],
    cta: 'Wybierz ścieżkę',
  },
]

export const pricingFaqItems = [
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

export function getPricingOfferCatalog() {
  return pricingCards.map((card) => {
    const service = FUNNEL_SERVICE_CONFIG[card.service]

    return {
      name: service.title,
      description: service.publicSummary,
      url: bookHref,
      price: service.priceAmount,
    }
  })
}

export function PricingSummaryCard() {
  return (
    <div className="reference-pricing-summary" aria-label="Skrót cennika">
      <div className="reference-pricing-badge">
        <WalletCards size={24} strokeWidth={1.7} aria-hidden="true" />
        <span>od 69 zł</span>
      </div>
      <div className="reference-price-ladder">
        {pricingCards.map((card) => (
          <Link key={card.service} href={bookHref} prefetch={false}>
            <span>{card.title}</span>
            <strong>{card.price}</strong>
          </Link>
        ))}
      </div>
      <div className="reference-pricing-summary-action">
        <Link href={fullPricingHref} prefetch={false} className="reference-btn reference-btn-secondary">
          Zobacz pełny cennik
        </Link>
      </div>
    </div>
  )
}

export function PricingCardsSection({ className = '' }: { className?: string }) {
  return (
    <section className={`reference-section-card ${className}`.trim()}>
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
              href={bookHref}
              prefetch={false}
              className={card.featured ? 'reference-btn reference-btn-primary' : 'reference-btn reference-btn-secondary'}
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
