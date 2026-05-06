import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferCards } from '@/components/OfferCards'
import { RegulskiWebHero } from '@/components/RegulskiWebHero'
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

const catProblemTopics = [
  {
    id: 'problemy-kuwetowe',
    number: 'i.',
    icon: 'cat-litter',
    title: 'Kot sika albo robi kupę poza kuwetą',
    description:
      'Sikanie na łóżko, kanapę, dywan, ubrania albo załatwianie się obok kuwety. Najpierw trzeba rozdzielić zdrowie, stres, kuwetę i relacje w domu.',
    href: '/koty/zalatwianie-poza-kuweta',
    ctaLabel: 'Omów problem',
  },
  {
    id: 'agresja-gryzienie-drapanie',
    number: 'ii.',
    icon: 'cat-stress',
    title: 'Agresja, gryzienie i drapanie',
    description:
      'Kot atakuje ręce, rzuca się na domowników, gryzie przy głaskaniu albo drapie w kontakcie. Sprawdzamy, czy chodzi o ból, strach, frustrację, zabawę czy przekroczone granice.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'konflikt-miedzy-kotami',
    number: 'iii.',
    icon: 'cat-conflict',
    title: 'Koty nie dogadują się w domu',
    description:
      'Syczenie, gonitwy, blokowanie przejść, napięcie przy misce, kuwecie albo legowisku. Układamy przestrzeń, zasoby i bezpieczne zasady kontaktu.',
    href: '/koty/konflikt-miedzy-kotami',
    ctaLabel: 'Umów konsultację',
  },
  {
    id: 'dokocenie',
    number: 'iv.',
    icon: 'cat-conflict',
    title: 'Dokocenie i wprowadzenie nowego kota',
    description:
      'Nowy kot w domu, trudne zapoznanie, stres rezydenta albo konflikty po połączeniu kotów. Pomagamy zaplanować tempo, przestrzeń i pierwsze kontakty.',
    href: quickHref,
    ctaLabel: 'Omów dokocenie',
  },
  {
    id: 'lek-stres-wycofanie',
    number: 'v.',
    icon: 'cat-stress',
    title: 'Kot się boi, chowa albo żyje w napięciu',
    description:
      'Kot unika kontaktu, chowa się, zamiera, reaguje paniką na ludzi, dźwięki albo zmiany w domu. Szukamy źródła stresu i sposobu na odzyskanie poczucia bezpieczeństwa.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'miauczenie-nocna-aktywnosc',
    number: 'vi.',
    icon: 'cat-other',
    title: 'Kot miauczy, nawołuje albo budzi w nocy',
    description:
      'Nadmierne miauczenie, nocne bieganie, domaganie się uwagi albo jedzenia. Sprawdzamy rytm dnia, potrzeby, stres, zdrowie i schematy utrwalone w domu.',
    href: quickHref,
    ctaLabel: 'Zacznij od Kwadransa',
  },
  {
    id: 'drapanie-mebli-niszczenie',
    number: 'vii.',
    icon: 'cat-other',
    title: 'Kot drapie meble albo niszczy rzeczy',
    description:
      'Drapanie kanapy, foteli, dywanów, gryzienie roślin albo przedmiotów. Nie walczymy z naturalnym zachowaniem - ustawiamy środowisko tak, żeby kot miał lepsze opcje.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'wylizywanie-siersci',
    number: 'viii.',
    icon: 'cat-stress',
    title: 'Kot nadmiernie się wylizuje albo wygryza sierść',
    description:
      'Łysiejące miejsca, wygryzanie futra, kompulsywne mycie albo rany od lizania. Najpierw trzeba wykluczyć przyczyny zdrowotne, a potem ocenić stres i środowisko.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'sprawa-zlozona-kot',
    number: 'ix.',
    icon: 'cat-other',
    title: 'Nie wiesz, który temat wybrać?',
    description:
      'Problem pasuje do kilku kategorii albo trudno go nazwać jednym słowem. Zacznij od krótkiego omówienia sytuacji i ustalenia pierwszego priorytetu.',
    href: quickHref,
    ctaLabel: 'Zacznij od Kwadransa',
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

        <section className="notatnik-subhero notatnik-subhero-pet">
          <div className="notatnik-subhero-copy">
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
            <RegulskiWebHero variant="cats" priority className="notatnik-pet-hero-visual" />
          </div>
        </section>

        <section id="tematy" className="notatnik-pet-topic-section">
          <NotatnikSectionHead index="I." kicker="Najczestsze tematy" title="Najczęstsze problemy behawioralne kotów" />
          <p className="notatnik-service-description top-gap-small">
            Wybierz temat najbliższy temu, co dzieje się u Twojego kota. Nie musisz trafić idealnie - wiele problemów się łączy. Jeśli nie wiesz, od czego zacząć, wybierz Kwadrans.
          </p>
          <div className="notatnik-topic-grid notatnik-topic-grid-with-icons">
            {catProblemTopics.map((topic) => (
              <Link key={topic.id} href={topic.href} prefetch={false} className="notatnik-topic-card notatnik-topic-card-with-icon">
                <Image
                  src={`/branding/pet-topics/subcategories/${topic.icon}.png`}
                  alt=""
                  width={126}
                  height={126}
                  className="notatnik-topic-card-icon"
                />
                <div className="notatnik-topic-number">{topic.number}</div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <span className="notatnik-topic-card-action">
                  {topic.ctaLabel}
                </span>
              </Link>
            ))}
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
            <Link href={serviceLandingHref} prefetch={false} className="notatnik-inline-link">
              Przejdz do pelnego opisu konsultacji online
            </Link>
          </div>
        </section>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" showReviews={false} />
      </div>
    </main>
  )
}
