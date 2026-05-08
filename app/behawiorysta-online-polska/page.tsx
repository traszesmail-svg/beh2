import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')
const pageTitle = 'Behawiorysta online dla opiekunów psów i kotów'
const pageLead =
  'Pomoc online dla całej Polski. Wybierasz wejście: pies, kot albo bezpośrednio format konsultacji.'

const pageEntryCards = [
  {
    title: 'Problem dotyczy psa',
    copy: 'Spacery, reaktywność, rozłąka, pobudzenie albo trudne zachowania w domu.',
    href: '/psy',
    cta: 'Przejdź do strony psa',
  },
  {
    title: 'Problem dotyczy kota',
    copy: 'Kuweta, stres, wycofanie, napięcie w domu albo relacje między kotami.',
    href: '/koty',
    cta: 'Przejdź do strony kota',
  },
  {
    title: 'Nie wiesz jeszcze, od czego zacząć',
    copy: 'Jeśli chcesz najpierw dobrać format rozmowy albo zobaczyć różnice między 69 / 169 / 470, zacznij od oferty.',
    href: '/oferta',
    cta: 'Przejdź do oferty',
  },
] as const

const onlineDecisionCards = [
  {
    title: '69 zł',
    copy: 'Kwadrans jest najprostszym startem, gdy chcesz nazwać problem i ustalić pierwszy krok.',
  },
  {
    title: '169 zł',
    copy: 'Dwa kwadranse są dla tematów szerszych, gdy 15 minut to za mało, ale pełna konsultacja byłaby jeszcze zbyt szeroka.',
  },
  {
    title: '470 zł',
    copy: 'Pełna konsultacja zostaje dla spraw złożonych, przewlekłych albo wielowątkowych.',
  },
] as const

const pageFaqItems = [
  {
    question: 'Czy konsultacja online jest dostępna dla całej Polski?',
    answer: 'Tak. Pracuję online z opiekunami z całej Polski, w tej samej formule niezależnie od miejsca.',
  },
  {
    question: 'Czy potrzebuję kamery albo specjalnego sprzętu?',
    answer: 'Nie. Przy Kwadransie wystarcza rozmowa głosowa. Przy dłuższej konsultacji wideo może pomóc, ale nie jest obowiązkowe.',
  },
  {
    question: 'Od czego najlepiej zacząć?',
    answer: 'Jeśli nie wiesz jeszcze, jak duży jest temat, zacznij od Kwadransu. Jeśli problem jest złożony i trwa od dawna, wybierz pełną konsultację.',
  },
]

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta online dla całej Polski',
  path: '/behawiorysta-online-polska',
  description:
    'Behawiorysta online dla całej Polski. Pies, kot albo spokojny start od Kwadransu 69 zł, Dwóch kwadransów 169 zł i Pełnej konsultacji 470 zł.',
  appendLocalContext: false,
})

export default function LocalSeoPolandOnlinePage() {
  if (!pageData) {
    return null
  }

  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const structuredData = [
    getServiceJsonLd({
      name: pageTitle,
      description:
        'Behawiorysta online dla całej Polski. Kwadrans 69 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł dla opiekunów psów i kotów.',
      serviceUrl: 'https://regulskibehawiorysta.pl/behawiorysta-online-polska',
      offerPrice: 69,
      offerCatalog: [
        {
          name: '15-minutowa konsultacja behawioralna',
          description: '15 minut rozmowy audio bez kamery jako najprostszy pierwszy krok.',
          url: audioHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na szersze uporządkowanie tematu i krótką notatkę.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pełna konsultacja behawioralna',
          description: 'Rozmowa online, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(pageFaqItems),
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Behawiorysta psów i kotów online', path: '/behawiorysta-online-polska' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Behawiorysta online / cała Polska"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <Schema data={structuredData} />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Behawiorysta online / cała Polska</div>
          <h1>{pageTitle}</h1>
          <p>{pageLead}</p>
          <div className="notatnik-subhero-actions">
            <Link href={audioHref} prefetch={false} className="notatnik-btn">
              <span>{FUNNEL_CTA_LABELS.primary}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/oferta" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Zobacz ofertę</span>
            </Link>
          </div>
          <p className="notatnik-service-description">
            Jeśli 15 minut to za mało, dalej jest szerszy format. Jeśli chcesz najpierw zadać krótkie pytanie, napisz wiadomość.
          </p>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-subhero-figure">
            <Image src="/branding/side-visuals/general-dog-walk.jpg" alt="Opiekun na spacerze z psem — konsultacja behawioralna online dla całej Polski" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
          </div>
          <div className="notatnik-subhero-note">
            <span>Psy i koty / online</span>
            <span>cała Polska</span>
          </div>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="3 wejścia online" title="Wybierz wejście, które pasuje do Twojej sytuacji." />
        <div className="card-grid three-up top-gap-small">
          {pageEntryCards.map((item) => (
            <article key={item.title} className="summary-card tree-backed-card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <Link href={item.href} prefetch={false} className="notatnik-inline-link">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Wybór przed rezerwacją" title="Jedna logika wyboru przed rezerwacją." />
        <div className="notatnik-quiet-grid">
          {onlineDecisionCards.map((card) => (
            <article key={card.title} className="notatnik-quiet-card">
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="list-card accent-outline tree-backed-card top-gap-small">
          <strong>Do startu wystarczy krótki opis sytuacji.</strong>
          <span>
            Nagrania bywają pomocne, ale nie są warunkiem. Kamera nie jest potrzebna przy Kwadransie, a przy dłuższej konsultacji ustalamy po prostu
            najprostszy sensowny format rozmowy.
          </span>
        </div>
      </section>

      <section id="faq">
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczęstsze pytania przed pierwszym ruchem." />
        <div className="card-grid three-up top-gap-small">
          {pageFaqItems.map((item) => (
            <article key={item.question} className="summary-card tree-backed-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <NotatnikFinalCta
        title="Jeśli nadal nie wiesz, gdzie wejść, <em>zacznij od Kwadransu.</em>"
        copy="Ta strona ma tylko uporządkować wejście. Najprostszy pierwszy ruch dalej zostaje ten sam."
        primaryHref={audioHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zł"
        secondaryHref="/oferta"
        secondaryLabel="Zobacz oferte"
      />
    </NotatnikPageShell>
  )
}
