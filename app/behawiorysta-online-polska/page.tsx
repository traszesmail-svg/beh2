import type { Metadata } from 'next'
import Image from '@/components/BlankImage'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')
const pageTitle = 'Behawiorysta online dla opiekunow psow i kotow'
const pageLead =
  'Pomoc online dla calej Polski. Wybierasz wejscie: pies, kot albo bezposrednio format konsultacji.'

const pageEntryCards = [
  {
    title: 'Problem dotyczy psa',
    copy: 'Spacery, reaktywnosc, rozlaka, pobudzenie albo trudne zachowania w domu.',
    href: '/psy',
    cta: 'Przejdz do strony psa',
  },
  {
    title: 'Problem dotyczy kota',
    copy: 'Kuweta, stres, wycofanie, napiecie w domu albo relacje miedzy kotami.',
    href: '/koty',
    cta: 'Przejdz do strony kota',
  },
  {
    title: 'Nie wiesz jeszcze, od czego zaczac',
    copy: 'Jesli chcesz najpierw dobrac format rozmowy albo zobaczyc roznice miedzy 69 / 169 / 470, zacznij od oferty.',
    href: '/oferta',
    cta: 'Przejdz do oferty',
  },
] as const

const onlineDecisionCards = [
  {
    title: '69 zl',
    copy: 'Kwadrans jest najprostszym startem, gdy chcesz nazwac problem i ustalic pierwszy krok.',
  },
  {
    title: '169 zl',
    copy: 'Dwa kwadranse sa dla tematow szerszych, gdy 15 minut to za malo, ale pelna konsultacja bylaby jeszcze zbyt szeroka.',
  },
  {
    title: '470 zl',
    copy: 'Pelna konsultacja zostaje dla spraw zlozonych, przewleklych albo wielowatkowych.',
  },
] as const

const pageFaqItems = [
  {
    question: 'Czy konsultacja online jest dostepna dla calej Polski?',
    answer: 'Tak. Pracuje online z opiekunami z calej Polski, w tej samej formule niezaleznie od miejsca.',
  },
  {
    question: 'Czy potrzebuje kamery albo specjalnego sprzetu?',
    answer: 'Nie. Przy Kwadransie wystarcza rozmowa glosowa. Przy dluzszej konsultacji wideo moze pomoc, ale nie jest obowiazkowe.',
  },
  {
    question: 'Od czego najlepiej zaczac?',
    answer: 'Jesli nie wiesz jeszcze, jak duzy jest temat, zacznij od Kwadransu. Jesli problem jest zlozony i trwa od dawna, wybierz pelna konsultacje.',
  },
]

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta online dla calej Polski',
  path: '/behawiorysta-online-polska',
  description:
    'Behawiorysta online dla calej Polski. Pies, kot albo spokojny start od Kwadransu 69 zl, Dwoch kwadransow 169 zl i Pelnej konsultacji 470 zl.',
  appendLocalContext: false,
})

export default function LocalSeoPolandOnlinePage() {
  if (!pageData) {
    return null
  }

  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const contactHref = '/kontakt#formularz'
  const structuredData = [
    getServiceJsonLd({
      name: pageTitle,
      description:
        'Behawiorysta online dla calej Polski. Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl dla opiekunow psow i kotow.',
      serviceUrl: 'https://regulskibehawiorysta.pl/behawiorysta-online-polska',
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery jako najprostszy pierwszy krok.',
          url: audioHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na szersze uporzadkowanie tematu i krotka notatke.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: '60 minut rozmowy, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(pageFaqItems),
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Behawiorysta psow i kotow online', path: '/behawiorysta-online-polska' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Behawiorysta online / cala Polska"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <Schema data={structuredData} />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Behawiorysta online / cala Polska</div>
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
              <span>Zobacz oferte</span>
            </Link>
          </div>
          <p className="notatnik-service-description">
            Jesli 15 minut to za malo, przejdz do{' '}
            <Link href={bridgeHref} prefetch={false} className="notatnik-inline-link">
              Dwoch kwadransow
            </Link>{' '}
            albo{' '}
            <Link href={consultationHref} prefetch={false} className="notatnik-inline-link">
              Pelnej konsultacji
            </Link>
            . Jesli chcesz najpierw zadac krotkie pytanie, napisz{' '}
            <Link href={contactHref} prefetch={false} className="notatnik-inline-link">
              wiadomosc
            </Link>
            .
          </p>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-subhero-figure">
            <Image src="/branding/side-visuals/general-dog-walk.jpg" alt="Opiekun na spacerze z psem — konsultacja behawioralna online dla całej Polski" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
          </div>
          <div className="notatnik-subhero-note">
            <span>Psy i koty / online</span>
            <span>cala Polska</span>
          </div>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="3 wejscia online" title="Wybierz wejscie, ktore pasuje do Twojej sytuacji." />
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
        <NotatnikSectionHead index="II." kicker="Wybor przed rezerwacja" title="Jedna logika wyboru przed rezerwacja." />
        <div className="notatnik-quiet-grid">
          {onlineDecisionCards.map((card) => (
            <article key={card.title} className="notatnik-quiet-card">
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="list-card accent-outline tree-backed-card top-gap-small">
          <strong>Do startu wystarczy krotki opis sytuacji.</strong>
          <span>
            Nagrania bywaja pomocne, ale nie sa warunkiem. Kamera nie jest potrzebna przy Kwadransie, a przy dluzszej konsultacji ustalamy po prostu
            najprostszy sensowny format rozmowy.
          </span>
        </div>
      </section>

      <section id="faq">
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania przed pierwszym ruchem." />
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
        title="Jesli nadal nie wiesz, gdzie wejsc, <em>zacznij od Kwadransu.</em>"
        copy="Ta strona ma tylko uporzadkowac wejscie. Najprostszy pierwszy ruch dalej zostaje ten sam."
        primaryHref={audioHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref="/oferta"
        secondaryLabel="Zobacz oferte"
      />
    </NotatnikPageShell>
  )
}
