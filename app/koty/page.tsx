import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferCards } from '@/components/OfferCards'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta kotow online - kuweta i stres',
  path: '/koty',
  description: 'Pomoc behawioralna online dla opiekunow kotow. Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, 'kot')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  {
    number: 'i.',
    icon: 'cat-litter',
    title: 'Kuweta',
    copy: 'Sikanie poza kuweta, wybor miejsca, zwirek i liczba kuwet. Najpierw porzadek, potem zmiany.',
    href: '/koty/zalatwianie-poza-kuweta',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    icon: 'cat-conflict',
    title: 'Konflikt miedzy kotami',
    copy: 'Syk, pogon, blokowanie przejsc albo napiecie stale wiszace w domu. Tu liczy sie kolejnosc zmian.',
    href: '/koty/konflikt-miedzy-kotami',
    label: 'Zobacz temat',
  },
  {
    number: 'iii.',
    icon: 'cat-stress',
    title: 'Wycofanie i napiecie',
    copy: 'Kot chowa sie, jest bardziej czujny albo trudniej mu odpoczac po zmianach w domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iv.',
    icon: 'cat-stress',
    title: 'Zmiany w domu',
    copy: 'Przeprowadzka, dziecko, remont, nowy domownik albo rozchwiany rytm dnia potrafia mocno obciazyc kota.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    icon: 'cat-other',
    title: 'Niepewny albo szerszy temat',
    copy: 'Jesli nie wiesz, czy chodzi o kuwete, stres, zdrowie czy relacje, najpierw ustalamy priorytet i zakres dalszej pracy.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
] as const

export default function CatsPage() {
  const faqItems = FAQ_SHORTLISTS.cats.slice(0, 3)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Koty', path: '/koty' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunow kotow online',
      description: 'Konsultacje online dla opiekunow kotow: kuweta, wycofanie, stres po zmianach i napiecie miedzy kotami.',
      serviceUrl: serviceLandingHref,
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery dla opiekuna kota.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na spokojniejsze uporzadkowanie tematu kota.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematow kocich wielowatkowych albo dlugotrwalych.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="cat" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Kot / strona gatunku" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />
        <Breadcrumbs items={[{ name: 'Koty', url: '/koty' }]} />

        <section className="notatnik-subhero notatnik-subhero-pet">
          <div className="notatnik-subhero-copy">
            <div className="notatnik-subhero-tag notatnik-mono">Kot / strona gatunku</div>
            <h1>
              Twoj kot zachowuje sie w sposob, <em>ktory Cie niepokoi</em>.
            </h1>
            <p>
              Pomagam opiekunom kotow zrozumiec, co stoi za trudnym zachowaniem i jak zaczac to porzadkowac bez stresu dla kota i dla Ciebie. Nie
              oceniam. Szukam przyczyny, nie winy.
            </p>
            <NextSlot className="top-gap-small" />
            <p className="notatnik-service-description">
              Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl. Dla kota obowiazuje ta sama logika 3 formatow.
            </p>
            <div className="info-box top-gap-small">
              Przy naglej zmianie zachowania albo problemie z kuweta pierwszym krokiem bywa weterynarz. To dalej moze byc poczatek dobrej diagnozy, nie
              przeszkoda.
            </div>
            <div className="notatnik-subhero-actions">
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj Kwadrans</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Umow Pelna konsultacje</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-subhero-pet-figure notatnik-subhero-consultation-figure" aria-hidden="true">
              <Image
                src="/2.png"
                alt=""
                width={1024}
                height={1536}
                priority
                className="notatnik-subhero-consultation-image"
              />
            </div>
          </div>
        </section>

        <section id="tematy" className="notatnik-dog-topic-section">
          <NotatnikSectionHead index="I." kicker="Najczestsze tematy" title="Problemy kocie - lista." />
          <div className="notatnik-topic-grid notatnik-topic-grid-with-icons">
            {topics.map((topic) => (
              <Link key={topic.title} href={topic.href} prefetch={false} className="notatnik-topic-card notatnik-topic-card-with-icon">
                <Image
                  src={`/branding/pet-topics/subcategories/${topic.icon}.png`}
                  alt=""
                  width={126}
                  height={126}
                  className="notatnik-topic-card-icon"
                />
                <div className="notatnik-topic-number">{topic.number}</div>
                <h3>{topic.title}</h3>
                <p>{topic.copy}</p>
                <span className="notatnik-topic-card-action">
                  {topic.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="list-card tree-backed-card top-gap-small">
            <p>Nie widzisz swojego tematu na liscie? Zacznij od Kwadransu. To dalej najprostszy pierwszy krok przy problemach kota.</p>
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="II." kicker="FAQ" title="3 szybkie odpowiedzi przy tematach kocich." />
          <div className="card-grid three-up top-gap-small">
            {faqItems.map((item) => (
              <article key={item.question} className="summary-card tree-backed-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cennik">
          <NotatnikSectionHead index="III." kicker="Cennik / wybor sciezki" title="Najpierw cena, potem najprostsza sciezka." />
          <div className="top-gap-small">
            <OfferCards />
          </div>
          <div className="notatnik-pdf-fallback top-gap-small">
            <span>Jesli nie rezerwujesz rozmowy, przejdz do materialow PDF.</span>
            <Link href="/materialy" prefetch={false} className="notatnik-inline-link">
              Zobacz materialy
            </Link>
          </div>
        </section>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" showReviews={false} />
      </div>
    </main>
  )
}
