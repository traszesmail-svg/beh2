import Link from 'next/link'
import { Icon, type IconName } from '@/components/icons-config'

interface Offer {
  slug: string
  icon: IconName
  title: string
  price: string
  desc: string
  features: string[]
  highlight?: boolean
  bookUrl: string
}

const offers: Offer[] = [
  {
    slug: 'kwadrans',
    icon: 'timer',
    title: 'Kwadrans',
    price: '69 zl',
    desc: 'Podstawowa usluga: 15 minut audio bez kamery, zeby nazwac problem i ustalic pierwszy kierunek.',
    features: ['podstawowy start', '15 min audio', '69 zl'],
    highlight: true,
    bookUrl: '/book',
  },
  {
    slug: 'kwadrans-na-juz',
    icon: 'zap',
    title: 'Kwadrans na juz',
    price: '99 zl',
    desc: 'Ten sam zakres co Kwadrans 69 zl, tylko dla pilniejszego terminu.',
    features: ['wariant pilny', '15 min audio', 'ten sam zakres'],
    bookUrl: '/book?service=kwadrans-na-juz',
  },
  {
    slug: 'dwa-kwadranse',
    icon: 'search',
    title: 'Dwa kwadranse',
    price: '169 zl',
    desc: '30 minut online - obejmujemy 2-3 watki, otrzymujesz krotka notatke.',
    features: ['30 min online', '2-3 watki', 'Krotka notatka'],
    bookUrl: '/book?service=konsultacja-30-min',
  },
  {
    slug: 'pelna-konsultacja',
    icon: 'clipboard-list',
    title: 'Pelna konsultacja',
    price: '470 zl',
    desc: 'Rozmowa online, diagnoza, plan poprawy i 7 dni konsultacji WhatsApp.',
    features: ['Pelny zakres online', 'Plan poprawy', '7 dni WhatsApp'],
    bookUrl: '/book?service=konsultacja-behawioralna-online',
  },
]

export function OfferCards() {
  return (
    <section className="offer-format-grid" aria-label="Formaty konsultacji">
      {offers.map((offer) => (
        <article key={offer.slug} className={`offer-format-card${offer.highlight ? ' is-highlighted' : ''}`}>
          <div className="offer-format-icon">
            <Icon name={offer.icon} size={28} />
          </div>

          <div className="offer-format-head">
            <h3>{offer.title}</h3>
            <div className="offer-format-price">{offer.price}</div>
          </div>
          <p className="offer-format-desc">{offer.desc}</p>

          <ul className="offer-format-features">
            {offer.features.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={18} strokeWidth={3} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link href={offer.bookUrl} prefetch={false} className="offer-format-link">
            Zarezerwuj
            <Icon name="arrow-right" size={16} />
          </Link>
        </article>
      ))}
    </section>
  )
}
