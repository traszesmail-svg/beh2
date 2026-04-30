import type { Metadata } from 'next'
import Image from '@/components/BlankImage'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import type { TrustFaqItem } from '@/lib/trust-layer'
import { PUBLIC_OFFER_DECISION_COPY, PUBLIC_OFFER_FULL_CONSULTATION_VALUE } from '@/lib/public-offer-copy'

const heroImage = { src: '/branding/omnie-hero.webp', width: 1024, height: 1536 } as const

const consultationFaqItems: TrustFaqItem[] = [
  {
    question: 'Kiedy Pelna konsultacja ma sens?',
    answer:
      'Gdy problem trwa dluzej, wraca, dotyczy kilku obszarow naraz albo od razu wiesz, ze potrzebujesz diagnozy i szerszego planu poprawy.',
  },
  {
    question: 'Co dostaje po Pelnej konsultacji?',
    answer:
      '60 minut rozmowy online, diagnoze sytuacji, indywidualny plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp, gdzie mozesz zadawac pytania, wysylac filmy i konsultowac wdrozenie planu.',
  },
  {
    question: 'Czy moge zaczac od Kwadransu zamiast Pelnej konsultacji?',
    answer:
      'Tak. Jesli nie masz pewnosci, czy temat jest az tak szeroki, zacznij od Kwadransu. Jesli od razu wiesz, ze sprawa jest zlozona, wejdz prosto w Pelna konsultacje.',
  },
]

const consultationSummaryCards = [
  {
    eyebrow: 'Kiedy ma sens',
    title: 'Gdy sprawa jest zlozona albo wraca',
    copy: 'Problem trwa dluzej, dotyczy kilku obszarow naraz albo od razu wiesz, ze potrzebujesz diagnozy i szerszego planu poprawy.',
  },
  {
    eyebrow: 'Co dostajesz',
    title: '60 minut, diagnoza i 7 dni wsparcia',
    copy: 'To osobny format pracy: rozmowa online, plan poprawy i konsultacje tekstowe przez WhatsApp po rozmowie.',
  },
  {
    eyebrow: 'Co przygotowac',
    title: 'Kilka konkretow zamiast rozbudowanej dokumentacji',
    copy: 'Wystarczy opis sytuacji, rytm dnia i to, co bylo juz sprawdzane. Nagranie pomaga, ale nie jest warunkiem.',
  },
] as const

const consultationDecisionCards = [
  {
    title: 'Kwadrans',
    copy: 'Wybierz, gdy masz jedno pytanie albo nie wiesz jeszcze, jak szeroki jest temat.',
  },
  {
    title: 'Dwa kwadranse',
    copy: 'Wybierz, gdy 15 minut to za malo, ale nie potrzebujesz jeszcze pelnej diagnozy i 7 dni wsparcia.',
  },
  {
    title: 'Pelna konsultacja',
    copy: 'Wybierz, gdy od razu potrzebujesz diagnozy, planu i spokojnego wsparcia wdrozenia po rozmowie.',
  },
] as const

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pelna konsultacja behawioralna online',
  path: '/konsultacja-behawioralna-online',
  description:
    'Pelna konsultacja behawioralna dla psa i kota: 60 minut rozmowy, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
})

export default function ConsultationOnlinePage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min')
  const contactHref = '/kontakt#formularz'
  const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Konsultacja behawioralna online', path: '/konsultacja-behawioralna-online' },
    ]),
    getServiceJsonLd({
      name: 'Pelna konsultacja behawioralna',
      description: 'Pelna konsultacja behawioralna online dla psa lub kota: 60 minut rozmowy, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
      serviceUrl: consultationHref,
      offerPrice: 470,
    }),
    getFaqPageJsonLd(consultationFaqItems),
  ]

  return (
    <NotatnikPageShell
      tag="Konsultacja / pelny opis"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={consultationHref}
      ctaLabel={FUNNEL_CTA_LABELS.consultation}
      footerPrimaryHref={consultationHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.consultation}
    >
      <Schema data={structuredData} />
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Pelna konsultacja / 60 min</div>
          <h1>Pelna konsultacja behawioralna online</h1>
          <p>{PUBLIC_OFFER_DECISION_COPY.premium}</p>
          <div className="notatnik-subhero-actions">
            <Link href={consultationHref} prefetch={false} className="notatnik-btn">
              <span>{FUNNEL_CTA_LABELS.consultation}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/cennik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Cennik i porownanie</span>
            </Link>
          </div>
          <p className="notatnik-service-description">
            Jesli nie masz jeszcze pewnosci, czy temat jest az tak szeroki, zacznij od{' '}
            <Link href={audioHref} prefetch={false} className="notatnik-inline-link">
              Kwadransu
            </Link>{' '}
            albo{' '}
            <Link href={bridgeHref} prefetch={false} className="notatnik-inline-link">
              Dwoch kwadransow
            </Link>
            . Jesli wolisz najpierw doprecyzowac sytuacje, napisz{' '}
            <Link href={contactHref} prefetch={false} className="notatnik-inline-link">
              wiadomosc
            </Link>
            .
          </p>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-subhero-figure">
            <Image src={heroImage.src} alt="" aria-hidden="true" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
          </div>
          <div className="notatnik-subhero-note">
            <span>60 min online</span>
            <span>diagnoza + 7 dni WhatsApp</span>
          </div>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="Pelna konsultacja w skrocie" title="Trzy rzeczy, ktore warto wiedziec przed rezerwacja." />
        <div className="card-grid three-up top-gap-small">
          {consultationSummaryCards.map((card) => (
            <article key={card.title} className="summary-card tree-backed-card">
              <div className="section-eyebrow">{card.eyebrow}</div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="list-card accent-outline tree-backed-card top-gap-small">
          <strong>To nie jest dluzszy Kwadrans.</strong>
          <span>{PUBLIC_OFFER_FULL_CONSULTATION_VALUE}</span>
          {prepGuide ? (
            <span>
              Chcesz wejsc jeszcze spokojniej? Zobacz{' '}
              <Link href={`/bezplatne-materialy/${prepGuide.slug}`} prefetch={false} className="notatnik-inline-link">
                material przygotowujacy
              </Link>
              .
            </span>
          ) : null}
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Wybor przed rezerwacja" title="Jedna zasada wyboru przed rezerwacja." />
        <div className="notatnik-quiet-grid">
          {consultationDecisionCards.map((card) => (
            <article key={card.title} className="notatnik-quiet-card">
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq">
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania o pelna konsultacje." />
        <div className="card-grid three-up top-gap-small">
          {consultationFaqItems.map((item) => (
            <article key={item.question} className="summary-card tree-backed-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli temat jest zlozony, <em>wejdz w Pelna konsultacje.</em>"
        copy="Jesli nadal sie wahasz, wybierz lzejszy format zamiast rezerwowac najwieksza usluge na sile."
        primaryHref={consultationHref}
        primaryLabel={FUNNEL_CTA_LABELS.consultation}
        secondaryHref={audioHref}
        secondaryLabel={FUNNEL_CTA_LABELS.primary}
      />
    </NotatnikPageShell>
  )
}
