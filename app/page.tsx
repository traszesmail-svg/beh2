import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import {
  FUNNEL_FULL_CONSULTATION_HREF,
  FUNNEL_PRIMARY_HREF,
  FUNNEL_UPGRADE_HREF,
} from '@/lib/offers'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_PRIORITY_VARIANT_NOTE, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const serviceLandingHref = '/behawiorysta-online-polska'

const homeLead =
  'Wybierz format konsultacji dopasowany do sytuacji: Kwadrans, Dwa kwadranse albo Pelna konsultacja.'

const speciesSections = [
  {
    key: 'pies',
    headline: 'Masz psa i nie wiesz, od czego zaczac?',
    subtitle: 'Pomoge Ci uporzadkowac spacer, pobudzenie, separacje lub rytm dnia mlodego psa.',
    href: '/psy',
    ctaLabel: 'Zobacz pomoc dla psa',
    items: [
      {
        title: 'Reaktywnosc',
        href: '/psy/reaktywnosc-na-smyczy',
        copy: 'Poradnik krok po kroku, jak wprowadzic spokoj na spacerze i w codziennych sytuacjach.',
      },
      {
        title: 'Separacja',
        href: '/psy/lek-separacyjny',
        copy: 'Jak pomoc psu radzic sobie z zostawaniem samemu, bez stresu i niszczenia w domu.',
      },
      {
        title: 'Szczeniak',
        href: '/oferta/poradniki-pdf/szczeniak-pierwsze-30-dni',
        copy: 'Pierwsze tygodnie i rytm dnia szczeniaka: jak spokojnie wdrozyc codzienny plan.',
      },
    ],
  },
  {
    key: 'kot',
    headline: 'Masz kota i chcesz wprowadzic spokoj w domu?',
    subtitle: 'Przejrzymy kuwety, stres, zmiany w domu i relacje miedzy kotami.',
    href: '/koty',
    ctaLabel: 'Zobacz pomoc dla kota',
    items: [
      {
        title: 'Kuweta',
        href: '/koty/zalatwianie-poza-kuweta',
        copy: 'Jak zorganizowac kuwete i srodowisko, by kot czul sie bezpiecznie.',
      },
      {
        title: 'Stres',
        href: '/oferta/poradniki-pdf/kot-stres-srodowisko-i-bledy-opiekuna',
        copy: 'Strategie redukcji napiecia u kota w domu i po zmianach.',
      },
      {
        title: 'Konflikt',
        href: '/koty/konflikt-miedzy-kotami',
        copy: 'Jak wprowadzic nowego kota lub rozwiazac konflikt miedzy kotami.',
      },
    ],
  },
] as const

const processSteps = [
  'Wybierz jeden z trzech formatow konsultacji.',
  'Opowiedz krotko sytuacje w domu lub na spacerze.',
  'Rozmawiamy w wybranym formacie: audio albo audio/video.',
  'Wiesz, co zrobic dalej i ktore kroki sa najlepsze.',
] as const

const consultationFormats = [
  {
    title: 'Kwadrans z behawiorysta',
    eyebrow: '69 zl / pierwszy kierunek',
    description: '15 minut audio bez kamery, aby nazwac problem i ustalic priorytet.',
    whenToChoose: 'gdy chcesz zaczac od jednego pytania albo sprawdzic, ktory kierunek ma sens',
    meta: ['15 min audio', 'bez kamery', '69 zl'],
    href: FUNNEL_PRIMARY_HREF,
    ctaLabel: 'Zarezerwuj Kwadrans',
    ctaClassName: 'button button-primary',
  },
  {
    title: 'Dwa kwadranse',
    eyebrow: '169 zl / spokojniejsze uporzadkowanie',
    description: '30 minut online, aby objac 2-3 watki i otrzymac krotka notatke.',
    whenToChoose: 'gdy 15 minut to za malo, ale sprawa nie wymaga jeszcze pelnej konsultacji',
    meta: ['30 min online', '2-3 watki', '169 zl'],
    href: FUNNEL_UPGRADE_HREF,
    ctaLabel: 'Umow Dwa kwadranse',
    ctaClassName: 'button button-ghost',
  },
  {
    title: 'Pelna konsultacja',
    eyebrow: '470 zl / sprawa zlozona',
    description: '60 minut, diagnoza sytuacji, plan poprawy i 7 dni konsultacji WhatsApp.',
    whenToChoose: 'gdy problem jest zlozony, przewlekly albo obejmuje kilka obszarow naraz',
    meta: ['60 min online', 'plan poprawy', '7 dni WhatsApp'],
    href: FUNNEL_FULL_CONSULTATION_HREF,
    ctaLabel: 'Umow Pelna konsultacje',
    ctaClassName: 'button button-ghost',
  },
] as const

const essentialsSections = [
  {
    headline: 'Materialy dla psa',
    items: [
      {
        title: '5 krokow dla reaktywnego psa',
        description: 'Uporzadkuj pierwszy tydzien obserwacji i pierwsze decyzje.',
        href: '/bezplatne-materialy/pies-reaktywnosc-5-krokow',
        cta: 'Zobacz material',
      },
      {
        title: 'Pakiet Sam w domu',
        description: 'Kompleksowy przewodnik po separacji i codziennym rytmie.',
        href: '/materialy/pakiet/pakiet-pies-zostaje-sam',
        cta: 'Kup pakiet',
      },
    ],
  },
  {
    headline: 'Materialy dla kota',
    items: [
      {
        title: 'Checklista kuweta',
        description: 'Krok po kroku przez zdrowie, srodowisko i zmiany w domu.',
        href: '/bezplatne-materialy/kot-kuweta-checklista',
        cta: 'Zobacz material',
      },
      {
        title: 'Pakiet Kot Domowy',
        description: 'Rozwiazania dla stresu, konfliktu i zachowan trudnych.',
        href: '/oferta/poradniki-pdf/pakiety/pakiet-kota-domowego',
        cta: 'Kup pakiet',
      },
    ],
  },
] as const

const quotes = [
  {
    quote: 'Po rozmowie wiedzialam, co zrobic od razu i co spokojnie odlozyc. W domu zrobilo sie lzej.',
    footer: 'Opiekunka psa / po pierwszej rozmowie',
  },
  {
    quote: 'Przy kuwecie dostalam porzadek zamiast kolejnych domyslow. Wreszcie wiedzialam, od czego zaczac.',
    footer: 'Opiekunka kota / po uporzadkowaniu tematu',
  },
] as const

const credentials = [
  {
    title: 'Behawiorysta COAPE',
    copy: 'Miedzynarodowy standard i spokojna analiza zachowania w realnej codziennosci opiekuna.',
  },
  {
    title: 'Trener zwierzat towarzyszacych',
    copy: 'Pierwszy krok ma byc wykonalny dla opiekuna i bezpieczny dla psa albo kota.',
  },
  {
    title: 'Technik weterynarii',
    copy: 'Uwzgledniam kontekst zdrowia, bezpieczenstwa i sytuacji, w ktorych najpierw potrzebny jest lekarz.',
  },
] as const

const faqItems = [
  {
    question: 'Czym rozni sie Kwadrans 69 zl od Kwadransu na juz 99 zl?',
    answer: 'Forma rozmowy jest taka sama. Przy 99 zl otrzymujesz priorytet i mozliwie szybki termin.',
  },
  {
    question: 'Kiedy wybrac Dwa kwadranse?',
    answer: 'Gdy 15 minut to za malo, temat ma kilka watkow lub chcesz spokojnie uporzadkowac sytuacje.',
  },
  {
    question: 'Co obejmuje Pelna konsultacja 470 zl?',
    answer: '60 minut online, diagnoze sytuacji, plan poprawy i 7 dni konsultacji WhatsApp.',
  },
  {
    question: 'Co jesli nie wiem, od czego zaczac?',
    answer:
      'Najprostszy start to Kwadrans 69 zl albo material z Niezbednika. Po krotkim opisie sytuacji wybierzemy najlepszy krok dla Ciebie i Twojego pupila.',
  },
] as const

const globalCtas = [
  { label: 'Zarezerwuj Kwadrans', href: FUNNEL_PRIMARY_HREF },
  { label: 'Zarezerwuj Dwa kwadranse', href: FUNNEL_UPGRADE_HREF },
  { label: 'Umow Pelna konsultacje', href: FUNNEL_FULL_CONSULTATION_HREF },
  { label: 'Zobacz Niezbednik / pobierz material', href: '/niezbednik' },
  { label: 'Zobacz pelny cennik', href: '/cennik' },
] as const

const heroTrustItems = [
  'COAPE / publiczny profil CAPBT',
  'technik weterynarii',
  'praca bez kar i przymusu',
  'bez publicznego telefonu',
  'platnosc dopiero po potwierdzeniu',
] as const

export default function HomePage() {
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psow i kotow online',
      description:
        'Konsultacje behawioralne online dla opiekunow psow i kotow. Trzy glowne formaty: Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl. Kwadrans na juz (99 zl) dostepny przy rezerwacji Kwadransu.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery, najprostszy start.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Dwa kwadranse', description: '30 min online na szersze uporzadkowanie tematu.', url: '/book?service=konsultacja-30-min', price: 169 },
        {
          name: 'Pelna konsultacja',
          description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: '/book?service=konsultacja-behawioralna-online',
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd([...faqItems]),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-side-visual notatnik-side-visual-left" aria-hidden="true">
        <Image src="/branding/side-left.jpg" alt="" fill sizes="(max-width: 1600px) 180px, 280px" quality={72} />
      </div>
      <div className="notatnik-side-visual notatnik-side-visual-right" aria-hidden="true">
        <Image src="/branding/side-right.jpg" alt="" fill sizes="(max-width: 1600px) 180px, 280px" quality={72} />
      </div>
      <div className="notatnik-shell">
        <NotatnikTopbar
          tag="Terapia behawioralna / psy i koty"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref={FUNNEL_PRIMARY_HREF}
          ctaLabel="Kwadrans 69 zl"
          ctaVariant="accent"
        />

        <section className="notatnik-hero">
          <div className="notatnik-hero-kicker notatnik-mono">Konsultacje behawioralne online / psy i koty</div>

          <h1>
            Chcesz uporzadkowac zachowanie swojego psa lub kota? <em>Zacznijmy spokojnie od pierwszego kroku.</em>
          </h1>

          <div className="notatnik-hero-grid">
            <div>
              <p className="notatnik-hero-lede">{homeLead}</p>

              <div className="notatnik-hero-cta">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-btn">
                  <span>Zarezerwuj pierwszy krok</span>
                  <span className="notatnik-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/niezbednik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                  <span>Zobacz materialy startowe w Niezbedniku</span>
                </Link>
              </div>

              <div className="notatnik-hero-fine">
                Potrzebujesz szybszego terminu? Przy Kwadransie dostepny jest Kwadrans na juz (99 zl) - termin potwierdzany do 15 minut. Gdy 15 minut to za
                malo, wybierz{' '}
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false}>
                  Dwa kwadranse
                </Link>
                . Przy sprawie zlozonej albo przewleklej przejdz do{' '}
                <Link href={FUNNEL_FULL_CONSULTATION_HREF} prefetch={false}>
                  Pelnej konsultacji
                </Link>
                .
              </div>

              <div className="notatnik-hero-trust-row" aria-label="Najwazniejsze informacje o pracy i rezerwacji">
                {heroTrustItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <aside className="notatnik-hero-card">
              <div className="notatnik-hero-card-media">
                <Image
                  src="/branding/omnie-hero.webp"
                  alt="Krzysztof Regulski podczas spokojnej konsultacji"
                  fill
                  priority
                  sizes="(max-width: 1180px) 100vw, 420px"
                />
                <div className="notatnik-hero-card-media-note notatnik-mono">rozmowa audio / online</div>
              </div>
              <div className="notatnik-hero-card-body">
                <h3>Kwadrans z behawiorysta</h3>
                <p>15 minut rozmowy audio bez kamery. Najprostszy start, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, od czego zaczac.</p>
                <div className="notatnik-price-row">
                  <div className="notatnik-price-big">{PUBLIC_OFFER_PRICES.quick} zl</div>
                  <div className="notatnik-price-small">15 min / audio / bez kamery</div>
                </div>
                <p className="notatnik-hero-fine">{PUBLIC_OFFER_PRIORITY_VARIANT_NOTE}</p>
              </div>
            </aside>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="I." kicker="Pies i kot" title="Wybierz najblizszy temat." />

          <div className="notatnik-quiet-grid">
            {speciesSections.map((item) => (
              <article key={item.key} className="notatnik-quiet-card">
                <div className="notatnik-mono">{item.key === 'pies' ? 'Pies' : 'Kot'}</div>
                <h3>{item.headline}</h3>
                <p>{item.subtitle}</p>
                <div className="top-gap-small">
                  {item.items.map((landing) => (
                    <p key={landing.title}>
                      <Link href={landing.href} prefetch={false} className="notatnik-inline-link">
                        {landing.title}
                      </Link>
                      <span> - {landing.copy}</span>
                    </p>
                  ))}
                </div>
                <Link href={item.href} prefetch={false} className="notatnik-inline-link">
                  {item.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="II." kicker="Jak to dziala" title="Jak wspolnie uporzadkujemy problem Twojego pupila." />
          <div className="card-grid four-up top-gap-small">
            {processSteps.map((step, index) => (
              <article key={step} className="summary-card tree-backed-card">
                <div className="notatnik-mono">Krok {index + 1}</div>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="III." kicker="Oferta" title="Trzy formaty konsultacji." />
          <p className="notatnik-service-description">
            Wybierz najmniejszy format, ktory pasuje do sytuacji. Kwadrans na juz 99 zl pozostaje szybszym terminem tego samego Kwadransu.
          </p>

          <div className="card-grid three-up top-gap-small">
            {consultationFormats.map((format) => (
              <article key={format.title} className="summary-card tree-backed-card">
                <div className="notatnik-mono">{format.eyebrow}</div>
                <h3>{format.title}</h3>
                <p>{format.description}</p>
                <div className="editorial-hero-meta" aria-label={`Parametry uslugi ${format.title}`}>
                  {format.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <p>
                  <strong>Kiedy wybrac:</strong> {format.whenToChoose}
                </p>
                <div className="hero-actions top-gap-small">
                  <Link href={format.href} prefetch={false} className={format.ctaClassName}>
                    {format.ctaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="list-card tree-backed-card top-gap-small">
            <p>
              Jesli chcesz najpierw przeczytac szerszy opis pracy online, przejdz do{' '}
              <Link href={serviceLandingHref} prefetch={false} className="notatnik-inline-link">
                pelnego opisu konsultacji online
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="IV." kicker="Niezbednik" title="Chcesz zaczac lzej? Pobierz darmowy material lub wybierz pakiet." />
          <div className="card-grid two-up top-gap-small">
            {essentialsSections.map((section) => (
              <article key={section.headline} className="summary-card tree-backed-card">
                <h3>{section.headline}</h3>
                {section.items.map((item) => (
                  <div key={item.title} className="top-gap-small">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <Link href={item.href} prefetch={false} className="notatnik-inline-link">
                      {item.cta}
                    </Link>
                  </div>
                ))}
              </article>
            ))}
          </div>

          <div className="list-card tree-backed-card top-gap-small">
            <p>
              <strong>Przygotowanie do konsultacji online:</strong> Nie musisz miec gotowej diagnozy. Materialy pokazuja, co warto przygotowac.
            </p>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="V." kicker="Opinie" title="Co mowia opiekunowie po rozmowie." />
          <p className="notatnik-service-description">Spokoj w domu i jasny pierwszy kierunek dzieki konsultacjom.</p>

          <div className="notatnik-quote-grid">
            {quotes.map((item) => (
              <article key={item.footer} className="notatnik-quote">
                <blockquote>
                  <p>{item.quote}</p>
                  <footer>{item.footer}</footer>
                </blockquote>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VI." kicker="O mnie" title="Spokojne podejscie i konkretne doswiadczenie." />

          <div className="list-card tree-backed-card top-gap-small">
            <p>
              Pomagam krok po kroku, bez przymusu i kar, z uwzglednieniem codziennosci i dobrostanu.
            </p>
          </div>

          <div className="notatnik-cred-grid top-gap-small">
            {credentials.map((item) => (
              <article key={item.title} className="notatnik-cred">
                <div className="notatnik-cred-title">{item.title}</div>
                <div className="notatnik-cred-copy">{item.copy}</div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VII." kicker="FAQ" title="Najczestsze pytania przed pierwszym krokiem." />
          <div className="card-grid two-up top-gap-small">
            {faqItems.map((item) => (
              <article key={item.question} className="summary-card tree-backed-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VIII." kicker="Dalej" title="Wybierz kolejny krok." />
          <div className="card-grid three-up top-gap-small">
            {globalCtas.map((item) => (
              <Link key={item.label} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>Przejdz dalej</span>
              </Link>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jesli cos Cie niepokoi, <em>zacznij od pierwszego kroku.</em>"
          copy="Najczesciej wystarczy dobrze dobrac pierwszy ruch. Jesli wolisz najpierw materialy i przygotowanie, przejdz do Niezbednika."
          primaryHref={FUNNEL_PRIMARY_HREF}
          primaryLabel="Zarezerwuj Kwadrans"
          secondaryHref="/niezbednik"
          secondaryLabel="Zobacz Niezbednik"
        />

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel="Zarezerwuj Kwadrans" />
      </div>
    </main>
  )
}
