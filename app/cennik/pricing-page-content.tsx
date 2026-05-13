import Link from 'next/link'
import { CheckCircle2, WalletCards } from 'lucide-react'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_SERVICE_CONFIG, type PublicBookingServiceType } from '@/lib/funnel'

export const bookHref = '/wybor'
export const contactHref = '/kontakt#formularz'
export const fullPricingHref = '/cennik/pelny'

export const pricingCards: Array<{
  service: PublicBookingServiceType
  badge: string
  title: string
  summaryTitle: string
  price: string
  copy: string
  supportCopy: string
  features: string[]
  cta: string
  featured?: boolean
}> = [
  {
    service: 'szybka-konsultacja-15-min',
    badge: 'najprostszy start',
    title: 'Kwadrans - gdy potrzebujesz pierwszego kierunku',
    summaryTitle: 'Kwadrans  gdy potrzebujesz pierwszego kierunku',
    price: '69 zł',
    copy: '15 minut rozmowy audio bez kamery. Dobre, gdy masz jedno główne pytanie i chcesz wiedzieć, co zrobić najpierw - a czego na razie nie ruszać.',
    supportCopy:
      'Dostajesz wstępną diagnozę behawioralną na podstawie przekazanych informacji: co może być głównym mechanizmem zachowania, co warto sprawdzić i czego nie robić na ślepo.',
    features: ['jedno główne pytanie albo pierwszy porządek', 'audio bez kamery', 'wstępna diagnoza behawioralna', 'dobry start przed większą decyzją'],
    cta: 'Chcę zacząć od Kwadransa',
    featured: true,
  },
  {
    service: 'kwadrans-na-juz',
    badge: 'priorytet',
    title: 'Kwadrans priorytetowy - gdy nie chcesz czekać',
    summaryTitle: 'Kwadrans priorytetowy  gdy nie chcesz czekać',
    price: '99 zł',
    copy: 'Ten sam 15-minutowy format, tylko z szybszym potraktowaniem wiadomości i terminu. Dla sytuacji, w których potrzebujesz kierunku możliwie szybko.',
    supportCopy:
      'Na podstawie opisu i odpowiedzi dostajesz wstępną diagnozę sytuacji oraz pierwszy kierunek działania.',
    features: ['ten sam zakres co Kwadrans', 'szybsze potwierdzenie', 'wstępna diagnoza sytuacji', 'dla tematów pilnych, ale krótkich'],
    cta: 'Chcę szybszy termin',
  },
  {
    service: 'konsultacja-30-min',
    badge: 'więcej czasu',
    title: 'Dwa kwadranse - gdy jedno pytanie robi się kilkoma',
    summaryTitle: 'Dwa kwadranse  gdy jedno pytanie robi się kilkoma',
    price: '169 zł',
    copy: '30 minut rozmowy, gdy czujesz, że to nie jest jedna rzecz: zachowanie, emocje, dom, spacer albo relacje zaczynają się mieszać.',
    supportCopy:
      'Wspólnie układamy fakty, szukamy najbardziej prawdopodobnej przyczyny zachowania i tworzę diagnozę behawioralną opartą na Twoim opisie, formularzu i kontekście domu, spacerów albo relacji między zwierzętami.',
    features: ['więcej kontekstu niż w Kwadransie', 'dobre przy kilku pytaniach naraz', 'diagnoza behawioralna oparta na danych', 'dobry most przed pełną konsultacją'],
    cta: 'Chcę spokojniej omówić temat',
  },
  {
    service: 'konsultacja-behawioralna-online',
    badge: 'pełny zakres',
    title: 'Pełna konsultacja - gdy potrzebny jest plan, nie tylko podpowiedź',
    summaryTitle: 'Pełna konsultacja  gdy potrzebny jest plan, nie tylko podpowiedź',
    price: '470 zł',
    copy: 'Pełna rozmowa online, diagnoza behawioralna oparta na danych, plan działania i 7 dni wsparcia tekstowego.',
    supportCopy:
      'To najlepszy wybór, gdy zachowanie trwa długo, ma kilka warstw albo wpływa na życie całego domu. Diagnoza powstaje na podstawie formularza, rozmowy, historii zachowania, kontekstu zdrowia, diety, środowiska, nagrań i danych, które przekażesz przed konsultacją.',
    features: ['sprawy złożone albo trwające długo', 'pełniejsza diagnoza behawioralna', 'plan pracy po konsultacji', '7 dni kontaktu tekstowego'],
    cta: 'Chcę pełną konsultację',
  },
]

function getDirectBookingHref(service: PublicBookingServiceType) {
  return buildBookHref(null, service)
}

export const pricingFaqItems = [
  {
    question: 'Czy w Kwadransie też dostanę diagnozę behawioralną?',
    answer:
      'Tak, ale zakres diagnozy behawioralnej zależy od ilości informacji. W Kwadransie dostajesz wstępną diagnozę behawioralną i pierwszy kierunek działania. Przy sprawach złożonych pełniejsza diagnoza behawioralna wymaga dłuższej rozmowy, formularza, historii zachowania i czasem nagrań.',
  },
  {
    question: 'Kiedy wybrać Dwa kwadranse?',
    answer:
      'Gdy jedno pytanie zaczyna łączyć się z kilkoma rzeczami: spacerem, emocjami, domem, relacją, dietą albo zdrowiem. 30 minut daje więcej miejsca na uporządkowanie faktów i spokojniejszą diagnozę behawioralną opartą na danych.',
  },
  {
    question: 'Kiedy od razu pełna konsultacja?',
    answer:
      'Gdy zachowanie trwa długo, wraca mimo prób, wpływa na życie domowników albo dotyczy kilku obszarów naraz. Pełna konsultacja ma sens wtedy, gdy potrzebujesz nie tylko odpowiedzi, ale diagnozy behawioralnej, planu i możliwości dopytania po rozmowie.',
  },
  {
    question: 'Czy diagnoza behawioralna zastępuje wizytę u lekarza weterynarii?',
    answer:
      'Nie. Diagnoza behawioralna opiera się na informacjach o zachowaniu, środowisku, rutynie, diecie i historii zwierzęcia. Jeśli coś może mieć tło zdrowotne, warto równolegle skonsultować się z lekarzem weterynarii.',
  },
]

export function getPricingOfferCatalog() {
  return pricingCards.map((card) => {
    const service = FUNNEL_SERVICE_CONFIG[card.service]

    return {
      name: service.title,
      description: service.publicSummary,
      url: getDirectBookingHref(card.service),
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
          <Link key={card.service} href={getDirectBookingHref(card.service)} prefetch={false} className="reference-price-ladder-row">
            <span>{card.summaryTitle}</span>
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

export function PricingDirectBookingSection() {
  return (
    <section className="reference-section-card reference-pricing-direct-section">
      <div className="reference-section-split-head">
        <div>
          <h2>Wiesz już, czego potrzebujesz?</h2>
          <p>
            Możesz od razu przejść do konkretnego formatu. Jeśli nie masz pewności,
            zostaje spokojny wybór przez kilka pytań.
          </p>
        </div>
        <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-secondary">
          Pomóż mi dobrać pierwszy krok
        </Link>
      </div>
      <div className="reference-pricing-direct-grid">
        {pricingCards.map((card) => (
          <Link key={card.service} href={getDirectBookingHref(card.service)} prefetch={false} className="reference-pricing-direct-card">
            <span>{card.badge}</span>
            <strong>{card.title}</strong>
            <small>{card.price}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function PricingCardsSection({ className = '' }: { className?: string }) {
  return (
    <section className={`reference-section-card ${className}`.trim()}>
      <h2>Wybierz konkretną rozmowę</h2>
      <div className="reference-pricing-grid">
        {pricingCards.map((card) => (
          <article key={card.service} className={`reference-price-card${card.featured ? ' is-featured' : ''}`}>
            <span className="reference-price-badge">{card.badge}</span>
            <div className="reference-price-heading">
              <h3>{card.title}</h3>
              <strong>{card.price}</strong>
            </div>
            <p>{card.copy}</p>
            <p>{card.supportCopy}</p>
            <ul>
              {card.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="reference-price-actions">
              <Link
                href={getDirectBookingHref(card.service)}
                prefetch={false}
                className={card.featured ? 'reference-btn reference-btn-primary' : 'reference-btn reference-btn-secondary'}
              >
                {card.cta}
              </Link>
              <Link href={bookHref} prefetch={false} className="reference-price-helper-link">
                Nie wiem, pomóż dobrać
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
