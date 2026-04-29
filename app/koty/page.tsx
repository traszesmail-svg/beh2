import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeroIllustration } from '@/components/HeroIllustration'
import { NextSlot } from '@/components/NextSlot'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LeadMagnetSection } from '@/components/LeadMagnetSection'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
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
    title: 'Kuweta',
    copy: 'Sikanie poza kuweta, wybor miejsca, zwirek i liczba kuwet. Najpierw porzadek, potem zmiany.',
    href: '/koty/zalatwianie-poza-kuweta',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    title: 'Konflikt miedzy kotami',
    copy: 'Syk, pogon, blokowanie przejsc albo napiecie stale wiszace w domu. Tu liczy sie kolejnosc zmian.',
    href: '/koty/konflikt-miedzy-kotami',
    label: 'Zobacz temat',
  },
  {
    number: 'iii.',
    title: 'Wycofanie i napiecie',
    copy: 'Kot chowa sie, jest bardziej czujny albo trudniej mu odpoczac po zmianach w domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iv.',
    title: 'Zmiany w domu',
    copy: 'Przeprowadzka, dziecko, remont, nowy domownik albo rozchwiany rytm dnia potrafia mocno obciazyc kota.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    title: 'Niepewny albo szerszy temat',
    copy: 'Jesli nie wiesz, czy chodzi o kuwete, stres, zdrowie czy relacje, najpierw ustalamy priorytet i zakres dalszej pracy.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
] as const

const consultationFormats = [
  {
    title: 'Kwadrans z behawiorysta',
    eyebrow: '69 zl / pierwszy krok',
    description: 'Najprostszy start, gdy chcesz ustalic pierwszy priorytet i zobaczyc, od czego najlepiej zaczac.',
    whenToChoose: 'gdy temat jest jeden, swiezy albo chcesz najpierw uporzadkowac sytuacje kota',
    meta: ['15 min audio bez kamery', '69 zl', 'na start'],
    href: quickHref,
    ctaLabel: 'Zarezerwuj Kwadrans',
    ctaClassName: 'button button-primary',
  },
  {
    title: 'Dwa kwadranse',
    eyebrow: '169 zl / szerszy start',
    description: 'Spokojniejszy etap posredni, gdy 15 minut to za malo, ale nie potrzebujesz jeszcze pelnej konsultacji.',
    whenToChoose: 'gdy temat ma kilka warstw i chcesz wejsc szerzej w dom, zasoby i rytm dnia',
    meta: ['30 min online', '169 zl'],
    href: bridgeHref,
    ctaLabel: 'Wybierz Dwa kwadranse',
    ctaClassName: 'button button-ghost',
  },
  {
    title: 'Pelna konsultacja',
    eyebrow: '470 zl / zlozona sprawa',
    description: 'Format dla spraw utrwalonych albo wielowatkowych, gdy potrzebujesz diagnozy, planu i wsparcia po rozmowie.',
    whenToChoose: 'gdy problem wraca, obejmuje relacje, srodowisko i codziennosc albo wymaga szerszego planu',
    meta: ['60 min audio albo video', '470 zl', 'diagnoza + 7 dni WhatsApp'],
    href: consultationHref,
    ctaLabel: 'Wybierz Pelna konsultacje',
    ctaClassName: 'button button-ghost',
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

        <section className="notatnik-subhero">
          <div>
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
              <Link href="/niezbednik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Niezbednik dla opiekuna kota</span>
              </Link>
              <Link href={serviceLandingHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>pelnego opisu konsultacji online</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <HeroIllustration slug="koty" emojiPlaceholder="🐈" className="w-full h-full min-h-[340px]" />
          </div>
        </section>

        <section id="tematy">
          <NotatnikSectionHead index="I." kicker="Najczestsze tematy" title="Problemy kocie - lista." />
          <div className="notatnik-topic-grid">
            {topics.map((topic) => (
              <article key={topic.title} className="notatnik-topic-card">
                <div className="notatnik-topic-number">{topic.number}</div>
                <h3>{topic.title}</h3>
                <p>{topic.copy}</p>
                <Link href={topic.href} prefetch={false}>
                  {topic.label}
                </Link>
              </article>
            ))}
          </div>
          <div className="list-card tree-backed-card top-gap-small">
            <p>Nie widzisz swojego tematu na liscie? Zacznij od Kwadransu. To dalej najprostszy pierwszy krok przy problemach kota.</p>
          </div>
        </section>

        <section id="konsultacja">
          <NotatnikSectionHead index="II." kicker="3 formaty konsultacji" title="Ktory format dla kota ma sens na start." />
          <p className="notatnik-service-description">
            Kwadrans na jedno pytanie albo pierwsza orientacje. Dwa kwadranse przy szerszym temacie. Pelna konsultacja przy sprawie trwajacej lub zlozonej.
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
              Potrzebujesz szybszego terminu? Przy rezerwacji Kwadransu dostepny jest wariant na juz (99 zl) — ten sam format, termin potwierdzany do 15
              minut.
            </p>
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="III." kicker="FAQ" title="3 szybkie odpowiedzi przy tematach kocich." />
          <div className="card-grid three-up top-gap-small">
            {faqItems.map((item) => (
              <article key={item.question} className="summary-card tree-backed-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <LeadMagnetSection pathname="/koty" />

        <NotatnikFinalCta
          title="Jesli temat kota Ci nie daje spokoju, <em>zacznij od porzadku.</em>"
          copy="Nie musisz od razu wiedziec, czy chodzi o kuwete, stres czy relacje. Wystarczy dobrze wybrac pierwszy format."
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref="/kontakt?species=kot#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
