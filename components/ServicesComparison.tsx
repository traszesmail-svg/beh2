import Link from 'next/link'
import { PriceDisplay } from '@/components/PriceDisplay'
import { buildBookHref, type BookingSpecies } from '@/lib/booking-routing'

type ServicesComparisonProps = {
  species?: BookingSpecies | null
  qaBooking?: boolean
  className?: string
}

const SERVICES = [
  {
    id: 'szybka-konsultacja-15-min',
    title: 'Kwadrans z behawiorysta',
    badge: 'Cena wejscia',
    price: 69,
    duration: '15 min',
    mode: 'audio, bez kamery',
    who: 'jedno pytanie albo pierwszy ruch',
    plan: 'priorytet i pierwszy krok',
    materials: '-',
    refund: 'tak',
    cta: 'Zarezerwuj',
  },
  {
    id: 'kwadrans-na-juz',
    title: 'Kwadrans na juz',
    badge: 'Priorytet / 15 min',
    price: 99,
    duration: '15 min',
    mode: 'audio, bez kamery',
    who: 'gdy liczy sie szybszy dostep',
    plan: 'ten sam format, ale z priorytetem',
    materials: '-',
    refund: 'tak, przed startem',
    cta: 'Zarezerwuj na juz',
  },
  {
    id: 'konsultacja-30-min',
    title: 'Dwa kwadranse',
    badge: null,
    price: 169,
    duration: '30 min',
    mode: 'audio lub video',
    who: '2-3 watki albo spokojniejsze wejscie',
    plan: 'pierwsze kroki i kolejnosc dzialan',
    materials: 'krotka notatka',
    refund: 'tak',
    cta: 'Zarezerwuj',
  },
  {
    id: 'konsultacja-behawioralna-online',
    title: 'Pelna konsultacja',
    badge: null,
    price: 470,
    duration: '60 min',
    mode: 'audio lub video',
    who: 'sprawa zlozona albo przewlekla',
    plan: 'diagnoza i plan poprawy',
    materials: '7 dni konsultacji przez WhatsApp',
    refund: 'tak, przed startem',
    cta: 'Umow konsultacje',
  },
] as const

const ROWS = [
  { key: 'price', label: 'Cena' },
  { key: 'duration', label: 'Czas' },
  { key: 'mode', label: 'Forma' },
  { key: 'who', label: 'Dla kogo' },
  { key: 'plan', label: 'Plan pracy' },
  { key: 'materials', label: 'Materialy po rozmowie' },
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
                  <span className={service[row.key] === '-' ? 'services-comparison-empty' : undefined}>{service[row.key]}</span>
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
                <dt>Dla kogo</dt>
                <dd>{service.who}</dd>
              </div>
              <div>
                <dt>Plan pracy</dt>
                <dd>{service.plan}</dd>
              </div>
              <div>
                <dt>Materialy po rozmowie</dt>
                <dd className={service.materials === '-' ? 'services-comparison-empty' : undefined}>{service.materials}</dd>
              </div>
              <div>
                <dt>Zmiana / zwrot</dt>
                <dd>{service.refund}</dd>
              </div>
            </dl>

            <Link href={getHref(service.id, species, qaBooking)} prefetch={false} className="services-comparison-link">
              {service.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
