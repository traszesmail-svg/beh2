import Link from 'next/link'
import { PriceDisplay } from '@/components/PriceDisplay'
import { buildBookHref, type BookingSpecies } from '@/lib/booking-routing'
import { PUBLIC_OFFER_CANCELLATION_COPY, PUBLIC_OFFER_FULL_VALUE_POINTS, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'

type ServicesComparisonProps = {
  species?: BookingSpecies | null
  qaBooking?: boolean
  className?: string
}

const SERVICES = [
  {
    id: 'szybka-konsultacja-15-min',
    title: 'Kwadrans z behawiorysta',
    badge: 'Najprostszy start',
    price: PUBLIC_OFFER_PRICES.quick,
    duration: '15 min',
    mode: 'audio, bez kamery',
    who: 'gdy chcesz najprosciej zaczac od jednego pytania albo pierwszego uporzadkowania tematu',
    plan: 'pierwszy kierunek, priorytet i decyzja, czy ten format wystarczy',
    materials: 'jasne wskazanie, co zrobic teraz i co obserwowac dalej',
    refund: PUBLIC_OFFER_CANCELLATION_COPY,
    cta: 'Wybierz Kwadrans',
  },
  {
    id: 'konsultacja-30-min',
    title: 'Dwa kwadranse',
    badge: null,
    price: PUBLIC_OFFER_PRICES.bridge,
    duration: '30 min',
    mode: 'audio lub video',
    who: 'gdy temat jest szerszy i chcesz spokojniej uporzadkowac 2-3 watki',
    plan: 'wiecej miejsca na kontekst, kolejnosc dzialan i decyzje co dalej',
    materials: 'krotka notatka po rozmowie',
    refund: PUBLIC_OFFER_CANCELLATION_COPY,
    cta: 'Wybierz Dwa kwadranse',
  },
  {
    id: 'konsultacja-behawioralna-online',
    title: 'Pelna konsultacja',
    badge: null,
    price: PUBLIC_OFFER_PRICES.premium,
    duration: 'pelny zakres',
    mode: 'audio lub video',
    who: 'gdy sprawa jest zlozona, przewlekla albo obejmuje kilka obszarow naraz',
    plan: 'diagnoza sytuacji, plan poprawy i ustalenie priorytetow',
    materials: '7 dni konsultacji tekstowych przez WhatsApp',
    refund: 'Osobny regulamin dla pelnej konsultacji.',
    cta: 'Wybierz Pelna konsultacje',
  },
] as const

const ROWS = [
  { key: 'price', label: 'Cena' },
  { key: 'duration', label: 'Czas' },
  { key: 'mode', label: 'Forma' },
  { key: 'who', label: 'Kiedy wybrac' },
  { key: 'plan', label: 'Po co ten format' },
  { key: 'materials', label: 'Po rozmowie' },
  { key: 'refund', label: 'Zmiana / zwrot' },
  { key: 'cta', label: 'CTA' },
] as const

function getHref(serviceId: (typeof SERVICES)[number]['id'], species?: BookingSpecies | null, qaBooking?: boolean) {
  return buildBookHref(null, serviceId === 'szybka-konsultacja-15-min' ? null : serviceId, qaBooking ?? false, species ?? null)
}

export function ServicesComparison({ species = null, qaBooking = false, className }: ServicesComparisonProps) {
  return (
    <section className={className ? `services-comparison ${className}` : 'services-comparison'} aria-label="Porownanie uslug">
      <div className="services-comparison-desktop" role="table" aria-label="Tabela porownawcza uslug">
        <div className="services-comparison-grid services-comparison-grid-head" role="rowgroup">
          <div className="services-comparison-cell services-comparison-feature" role="columnheader">
            Cecha
          </div>
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={`services-comparison-cell services-comparison-service${service.id === 'szybka-konsultacja-15-min' ? ' is-featured' : ''}`}
              role="columnheader"
            >
              <div className="services-comparison-service-head">
                <span>{service.title}</span>
                {service.badge ? <span className="services-comparison-badge">{service.badge}</span> : null}
              </div>
            </div>
          ))}
        </div>

        {ROWS.map((row) => (
          <div key={row.key} className="services-comparison-grid" role="row">
            <div className="services-comparison-cell services-comparison-feature" role="rowheader">
              {row.label}
            </div>
            {SERVICES.map((service) => (
              <div
                key={`${row.key}-${service.id}`}
                className={`services-comparison-cell${service.id === 'szybka-konsultacja-15-min' ? ' is-featured' : ''}`}
                role="cell"
              >
                {row.key === 'price' ? (
                  <PriceDisplay amount={service.price} />
                ) : row.key === 'cta' ? (
                  <Link href={getHref(service.id, species, qaBooking)} prefetch={false} className="services-comparison-link">
                    {service.cta}
                  </Link>
        ) : (
          <span>{service[row.key]}</span>
        )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="services-comparison-mobile">
        {SERVICES.map((service) => (
          <article key={service.id} className={`services-mobile-card${service.id === 'szybka-konsultacja-15-min' ? ' is-featured' : ''}`}>
            <div className="services-mobile-card-head">
              <div>
                <div className="notatnik-mono">{service.title}</div>
                <h3>{service.title}</h3>
              </div>
              {service.badge ? <span className="services-comparison-badge">{service.badge}</span> : null}
            </div>

            <div className="services-mobile-price">
              <PriceDisplay amount={service.price} />
            </div>

            <dl className="services-mobile-list">
              <div>
                <dt>Czas</dt>
                <dd>{service.duration}</dd>
              </div>
              <div>
                <dt>Forma</dt>
                <dd>{service.mode}</dd>
              </div>
              <div>
                <dt>Kiedy wybrac</dt>
                <dd>{service.who}</dd>
              </div>
              <div>
                <dt>Po co ten format</dt>
                <dd>{service.plan}</dd>
              </div>
              <div>
                <dt>Po rozmowie</dt>
                <dd>{service.materials}</dd>
              </div>
              <div>
                <dt>Zmiana / zwrot</dt>
                <dd>{service.refund}</dd>
              </div>
            </dl>

            {service.id === 'konsultacja-behawioralna-online' ? (
              <div className="notatnik-service-note top-gap-small" aria-label="Zakres pelnej konsultacji">
                <ul className="notatnik-service-list">
                  {PUBLIC_OFFER_FULL_VALUE_POINTS.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link href={getHref(service.id, species, qaBooking)} prefetch={false} className="services-comparison-link">
              {service.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
