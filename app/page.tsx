import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import {
  FUNNEL_FULL_CONSULTATION_HREF,
  FUNNEL_FULL_CONSULTATION_LABEL,
  FUNNEL_PRIMARY_HREF,
  FUNNEL_PRIMARY_LABEL,
  FUNNEL_UPGRADE_HREF,
  FUNNEL_UPGRADE_LABEL,
} from '@/lib/offers'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_PRIORITY_VARIANT_NOTE, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const serviceLandingHref = '/behawiorysta-online-polska'

const homeLead =
  'Masz problem z psem albo kotem i chcesz wiedziec, od czego zaczac? Najpierw wybierz wlasciwe wejscie, a dopiero potem format rozmowy.'

const entryCards = [
  {
    title: 'Pies',
    eyebrow: 'Strona gatunku',
    copy: 'Spacery, pobudzenie, separacja albo chaos mlodego psa, z ktorym trudno zlapac codzienny rytm.',
    href: '/psy',
    ctaLabel: 'Zobacz pomoc dla psa',
  },
  {
    title: 'Kot',
    eyebrow: 'Strona gatunku',
    copy: 'Kuweta, wycofanie, napiecie po zmianach w domu albo trudne relacje miedzy kotami.',
    href: '/koty',
    ctaLabel: 'Zobacz pomoc dla kota',
  },
  {
    title: 'Niezbednik',
    eyebrow: 'Materialy i przygotowanie',
    copy: 'Darmowe starty, PDF-y, ksiazki i przybory, gdy chcesz najpierw spokojnie poczytac albo przygotowac sie do rozmowy.',
    href: '/niezbednik',
    ctaLabel: 'Przejdz do Niezbednika',
  },
] as const

const quotes = [
  {
    quote: 'Po rozmowie wiedzialam, co zrobic od razu i co spokojnie odlozyc. W domu zrobilo sie duzo lzej.',
    footer: 'Opiekunka psa reaktywnego / po pierwszym kontakcie audio',
  },
  {
    quote: 'Przy kuwecie dostalam porzadek zamiast kolejnych domyslow. To byl pierwszy moment, kiedy wiedzialam, od czego zaczac.',
    footer: 'Opiekunka kota niewychodzacego / po uporzadkowaniu tematu',
  },
] as const

const credentials = [
  {
    title: 'Behawiorysta COAPE',
    copy: 'Miedzynarodowy standard ksztalcenia behawiorystow. Praca z realna codziennoscia opiekuna i zwierzecia.',
  },
  {
    title: 'Trener zwierzat towarzyszacych',
    copy: 'Pierwszy krok ma byc wykonalny dla opiekuna i realny dla psa albo kota.',
  },
  {
    title: 'Technik weterynarii',
    copy: 'Szerszy kontekst zdrowia, bezpieczenstwa i tego, kiedy najpierw trzeba wykluczyc podloze medyczne.',
  },
] as const

const consultationFormats = [
  {
    title: 'Kwadrans z behawiorysta',
    eyebrow: '69 zl / pierwszy krok',
    description: 'Najprostszy start, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, od czego zaczac.',
    whenToChoose: 'gdy masz jedno pytanie, swiezy problem albo nie wiesz jeszcze, jak szeroki jest temat',
    meta: ['15 min audio bez kamery', '69 zl', 'na start'],
    href: FUNNEL_PRIMARY_HREF,
    ctaLabel: FUNNEL_PRIMARY_LABEL,
    ctaClassName: 'button button-primary',
  },
  {
    title: 'Dwa kwadranse',
    eyebrow: '169 zl / szerszy zakres',
    description: 'Format dla tematow szerszych, gdy 15 minut to za malo, ale pelna konsultacja bylaby jeszcze zbyt szerokim startem.',
    whenToChoose: 'gdy chcesz uporzadkowac 2-3 watki i dostac krotka notatke po rozmowie',
    meta: ['30 min online', '169 zl', 'szerszy zakres'],
    href: FUNNEL_UPGRADE_HREF,
    ctaLabel: FUNNEL_UPGRADE_LABEL,
    ctaClassName: 'button button-ghost',
  },
  {
    title: 'Pelna konsultacja',
    eyebrow: '470 zl / zlozona sprawa',
    description: 'Format dla spraw przewleklych albo wielowatkowych, gdy potrzebujesz diagnozy, planu i wsparcia wdrozenia.',
    whenToChoose: 'gdy problem wraca, trwa dluzej albo dotyczy kilku obszarow naraz',
    meta: ['60 min audio albo video', '470 zl', 'diagnoza + 7 dni WhatsApp'],
    href: FUNNEL_FULL_CONSULTATION_HREF,
    ctaLabel: FUNNEL_FULL_CONSULTATION_LABEL,
    ctaClassName: 'button button-ghost',
  },
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
            Problem z zachowaniem psa albo kota? <em>Zacznij od spokojnego pierwszego kroku.</em>
          </h1>

          <div className="notatnik-hero-grid">
            <div>
              <p className="notatnik-hero-lede">{homeLead}</p>

              <div className="notatnik-hero-cta">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-btn">
                  <span>{FUNNEL_PRIMARY_LABEL}</span>
                  <span className="notatnik-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/niezbednik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                  <span>Przejdz do Niezbednika</span>
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
          <NotatnikSectionHead index="I." kicker="3 wejscia" title="Pies, kot albo Niezbednik." />

          <div className="notatnik-quiet-grid">
            {entryCards.map((item) => (
              <article key={item.title} className="notatnik-quiet-card">
                <div className="notatnik-mono">{item.eyebrow}</div>
                <h3>
                  <em>{item.title}</em>
                </h3>
                <p>{item.copy}</p>
                <Link href={item.href} prefetch={false} className="notatnik-inline-link">
                  {item.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="II." kicker="3 formaty konsultacji" title="Trzy formaty konsultacji. Jedna logika wyboru." />
          <p className="notatnik-service-description">
            Trzy wejscia. Jasne roznice przed rezerwacja. Kwadrans na juz 99 zl pojawia sie tylko przy Kwadransie jako szybszy termin tego samego formatu.
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
          <NotatnikSectionHead index="III." kicker="Zaufanie" title="Po rozmowie ma zostac porzadek, nie wiecej chaosu." />

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

          <div className="list-card tree-backed-card top-gap-small">
            <p>
              Pracuje spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok. Jesli chcesz zobaczyc wiecej historii i
              opinii, przejdz do{' '}
              <Link href="/opinie" prefetch={false} className="notatnik-inline-link">
                strony opinii
              </Link>
              .
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

        <NotatnikFinalCta
          title="Jesli cos Cie niepokoi, <em>zacznij od Kwadransu.</em>"
          copy="Najczesciej wystarczy dobrze dobrac pierwszy ruch. Jesli wolisz najpierw materialy i przygotowanie, przejdz do Niezbednika."
          primaryHref={FUNNEL_PRIMARY_HREF}
          primaryLabel={FUNNEL_PRIMARY_LABEL}
          secondaryHref="/niezbednik"
          secondaryLabel="Przejdz do Niezbednika"
        />

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel={FUNNEL_PRIMARY_LABEL} />
      </div>
    </main>
  )
}
