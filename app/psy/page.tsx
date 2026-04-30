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
    title: 'Reaktywnosc na smyczy',
    copy: 'Pies reaguje na inne psy, ludzi albo rowery. Najpierw porzadkujemy wyzwalacze, dystans i rytm spaceru.',
    href: '/psy/reaktywnosc-na-smyczy',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    title: 'Lek separacyjny',
    copy: 'Wycie, niszczenie, napiecie po wyjsciu opiekuna. To temat do spokojnego planu, nie do zgadywania.',
    href: '/psy/lek-separacyjny',
    label: 'Zobacz temat',
  },
  {
    number: 'iii.',
    title: 'Pobudzenie i wyciszenie',
    copy: 'Pies nie umie odpoczac, trudno mu zejsc z napiecia i zlapac codzienny rytm domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iv.',
    title: 'Mlody pies i start w domu',
    copy: 'Szczeniak, gryzienie, skakanie, pierwsze spacery i codzienne granice bez dokladania chaosu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    title: 'Sprawa zlozona albo przewlekla',
    copy: 'Gdy problem wraca, obejmuje kilka watkow naraz albo od razu widzisz, ze potrzebny jest szerszy plan.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
] as const

const consultationFormats = [
  {
    title: 'Kwadrans z behawiorysta',
    eyebrow: '69 zl / pierwszy krok',
    description: 'Najprostszy start, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, co robic dalej.',
    whenToChoose: 'gdy temat jest jeden, swiezy albo chcesz po prostu dobrze zaczac',
    meta: ['15 min audio bez kamery', '69 zl', 'na start'],
    href: quickHref,
    ctaLabel: 'Zarezerwuj Kwadrans',
    ctaClassName: 'button button-primary',
  },
  {
    title: 'Dwa kwadranse',
    eyebrow: '169 zl / szerszy start',
    description: 'Spokojniejszy etap posredni, gdy 15 minut to za malo, ale nie potrzebujesz jeszcze pelnej konsultacji.',
    whenToChoose: 'gdy chcesz uporzadkowac 2-3 watki i wejsc w rozmowe szerzej',
    meta: ['30 min online', '169 zl'],
    href: bridgeHref,
    ctaLabel: 'Wybierz Dwa kwadranse',
    ctaClassName: 'button button-ghost',
  },
  {
    title: 'Pelna konsultacja',
    eyebrow: '470 zl / zlozona sprawa',
    description: 'Format dla spraw utrwalonych albo wielowatkowych, gdy potrzebujesz diagnozy, planu i wsparcia po rozmowie.',
    whenToChoose: 'gdy problem trwa dluzej, wraca albo od razu wymaga szerszego planu',
    meta: ['60 min audio albo video', '470 zl', 'diagnoza + 7 dni WhatsApp'],
    href: consultationHref,
    ctaLabel: 'Wybierz Pelna konsultacje',
    ctaClassName: 'button button-ghost',
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

        <section className="notatnik-subhero">
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
            <HeroIllustration slug="psy" emojiPlaceholder="🐕" className="w-full h-full min-h-[340px]" />
          </div>
        </section>

        <section id="tematy">
          <NotatnikSectionHead index="I." kicker="Najczestsze tematy" title="Problemy psie - lista." />
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
            <p>Nie widzisz swojego tematu na liscie? Zacznij od Kwadransu. To dalej najprostszy pierwszy krok przy problemach psa.</p>
          </div>
        </section>

        <section id="konsultacja">
          <NotatnikSectionHead index="II." kicker="3 formaty konsultacji" title="Ktory format dla psa ma sens na start." />
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
          <NotatnikSectionHead index="III." kicker="FAQ" title="3 szybkie odpowiedzi przy tematach psich." />
          <div className="card-grid three-up top-gap-small">
            {faqItems.map((item) => (
              <article key={item.question} className="summary-card tree-backed-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <LeadMagnetSection pathname="/psy" />

        <NotatnikFinalCta
          title="Jesli temat psa Cie niepokoi, <em>zacznij spokojnie.</em>"
          copy="Nie musisz od razu wiedziec, czy chodzi o spacer, pobudzenie czy rozlake. Wystarczy dobrze wybrac pierwszy format."
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref="/kontakt?species=pies#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
