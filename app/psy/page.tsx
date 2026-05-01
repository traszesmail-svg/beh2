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
  title: 'Behawiorysta psow online',
  path: '/psy',
  description: 'Pomoc behawioralna online dla opiekunow psow. Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, 'pies')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  {
    number: 'i.',
    icon: 'dog-reactivity',
    title: 'Reaktywnosc na smyczy',
    copy: 'Pies reaguje na inne psy, ludzi albo rowery. Najpierw porzadkujemy wyzwalacze, dystans i rytm spaceru.',
    href: '/psy/reaktywnosc-na-smyczy',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    icon: 'dog-separation',
    title: 'Lek separacyjny',
    copy: 'Wycie, niszczenie, napiecie po wyjsciu opiekuna. To temat do spokojnego planu, nie do zgadywania.',
    href: '/psy/lek-separacyjny',
    label: 'Zobacz temat',
  },
  {
    number: 'iii.',
    icon: 'dog-puppy',
    title: 'Pobudzenie i wyciszenie',
    copy: 'Pies nie umie odpoczac, trudno mu zejsc z napiecia i zlapac codzienny rytm domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iv.',
    icon: 'dog-puppy',
    title: 'Mlody pies i start w domu',
    copy: 'Szczeniak, gryzienie, skakanie, pierwsze spacery i codzienne granice bez dokladania chaosu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    icon: 'topic-other',
    title: 'Sprawa zlozona albo przewlekla',
    copy: 'Gdy problem wraca, obejmuje kilka watkow naraz albo od razu widzisz, ze potrzebny jest szerszy plan.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
] as const

export default function DogsPage() {
  const faqItems = FAQ_SHORTLISTS.dogs.slice(0, 3)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Psy', path: '/psy' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunow psow online',
      description: 'Konsultacje online dla opiekunow psow: spacery, reaktywnosc, rozlaka, pobudzenie i pierwszy spokojny krok.',
      serviceUrl: serviceLandingHref,
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery dla opiekuna psa.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na spokojniejsze uporzadkowanie tematu psa.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematow psich wielowatkowych albo dlugotrwalych.',
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
      <NotatnikSideVisuals variant="dog" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Pies / strona gatunku" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />
        <Breadcrumbs items={[{ name: 'Psy', url: '/psy' }]} />

        <section className="notatnik-subhero notatnik-subhero-pet">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Pies / strona gatunku</div>
            <h1>
              Twoj pies zachowuje sie w sposob, <em>ktory Cie niepokoi</em>.
            </h1>
            <p>
              Pomagam opiekunom psow zrozumiec, co stoi za trudnym zachowaniem i jak zaczac to porzadkowac bez przymusu i bez karania. Nie musisz
              wiedziec, jak to nazwac. Wystarczy, ze opiszesz, co sie dzieje.
            </p>
            <NextSlot className="top-gap-small" />
            <p className="notatnik-service-description">
              Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl. Dla psa obowiazuje ta sama logika 3 formatow.
            </p>
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
          <NotatnikSectionHead index="I." kicker="Najczestsze tematy" title="Problemy psie - lista." />
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
            <p>Nie widzisz swojego tematu na liscie? Zacznij od Kwadransu. To dalej najprostszy pierwszy krok przy problemach psa.</p>
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="II." kicker="FAQ" title="3 szybkie odpowiedzi przy tematach psich." />
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
