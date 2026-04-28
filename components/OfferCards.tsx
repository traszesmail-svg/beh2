// handoff/components/OfferCards.tsx
// 3 karty pakietów z checkmarkami
// Strony: /, /cennik, /book

import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons-config';

interface Offer {
  slug: string;
  icon: IconName;
  title: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  bookUrl: string;
}

const offers: Offer[] = [
  {
    slug: 'kwadrans',
    icon: 'timer',
    title: 'Kwadrans',
    price: '69 zł',
    desc: '15 minut audio bez kamery — nazywamy problem i ustalamy priorytet.',
    features: ['15 min audio', 'Bez kamery', 'Pierwszy kierunek'],
    bookUrl: '/book',
  },
  {
    slug: 'kwadrans-na-juz',
    icon: 'zap',
    title: 'Kwadrans na już',
    price: '99 zł',
    desc: 'Ten sam format co Kwadrans — termin potwierdzany do 15 minut.',
    features: ['15 min audio', 'Szybki termin', 'Potwierdzenie w 15 min'],
    bookUrl: '/book?service=kwadrans-na-juz',
  },
  {
    slug: 'dwa-kwadranse',
    icon: 'search',
    title: 'Dwa kwadranse',
    price: '169 zł',
    desc: '30 minut online — obejmujemy 2–3 wątki, otrzymujesz krótką notatę.',
    features: ['30 min online', '2–3 wątki', 'Krótka notatka'],
    highlight: true,
    bookUrl: '/book?service=konsultacja-30-min',
  },
  {
    slug: 'pelna-konsultacja',
    icon: 'clipboard-list',
    title: 'Pełna konsultacja',
    price: '470 zł',
    desc: '60 minut online, diagnoza, plan poprawy i 7 dni konsultacji WhatsApp.',
    features: ['60 min online', 'Plan poprawy', '7 dni WhatsApp'],
    bookUrl: '/book?service=konsultacja-behawioralna-online',
  },
];

export function OfferCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {offers.map((o) => (
        <article
          key={o.slug}
          className={[
            'rounded-2xl p-7 flex flex-col gap-3 transition hover:-translate-y-0.5',
            o.highlight
              ? 'border-2 border-accent bg-gradient-to-b from-white to-accent-light shadow-lg'
              : 'border border-neutral-200 bg-white hover:border-accent hover:shadow-lg',
          ].join(' ')}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            o.highlight ? 'bg-accent text-white' : 'bg-accent-light text-accent'
          }`}>
            <Icon name={o.icon} size={28} />
          </div>

          <h3 className="font-serif text-xl">{o.title}</h3>
          <div className="font-serif text-2xl text-accent">{o.price}</div>
          <p className="text-sm text-neutral-600">{o.desc}</p>

          <ul className="flex flex-col gap-2.5 mt-2">
            {o.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <Icon name="check" size={18} className="text-accent" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href={o.bookUrl}
            className={[
              'inline-flex items-center justify-center gap-2 mt-4 px-5 py-3 rounded-lg font-semibold text-sm transition',
              o.highlight
                ? 'bg-neutral-900 text-white hover:bg-accent'
                : 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
            ].join(' ')}
          >
            Zarezerwuj
            <Icon name="arrow-right" size={16} />
          </Link>
        </article>
      ))}
    </section>
  );
}
