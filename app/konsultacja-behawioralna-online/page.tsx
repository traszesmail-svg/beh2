import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/active-lead-magnets'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import type { TrustFaqItem } from '@/lib/trust-layer'
import { PUBLIC_OFFER_DECISION_COPY, PUBLIC_OFFER_FULL_CONSULTATION_VALUE } from '@/lib/public-offer-copy'

const heroImage = { src: '/branding/omnie-hero.webp', width: 1024, height: 1536 } as const

const consultationFaqItems: TrustFaqItem[] = [
  {
    question: 'Kiedy Pełna konsultacja ma sens?',
    answer:
      'Gdy problem trwa dłużej, wraca, dotyczy kilku obszarów naraz albo od razu wiesz, że potrzebujesz diagnozy i szerszego planu poprawy.',
  },
  {
    question: 'Co dostaję po Pełnej konsultacji?',
    answer:
      'Rozmowę online, diagnozę sytuacji, indywidualny plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp, gdzie możesz zadawać pytania, wysyłać filmy i konsultować wdrożenie planu.',
  },
  {
    question: 'Czy mogę zacząć od Kwadransu zamiast Pełnej konsultacji?',
    answer:
      'Tak. Jeśli nie masz pewności, czy temat jest aż tak szeroki, zacznij od Kwadransu. Jeśli od razu wiesz, że sprawa jest złożona, wejdź prosto w Pełną konsultację.',
  },
]

const consultationSummaryCards = [
  {
    eyebrow: 'Kiedy ma sens',
    title: 'Gdy sprawa jest złożona albo wraca',
    copy: 'Problem trwa dłużej, dotyczy kilku obszarów naraz albo od razu wiesz, że potrzebujesz diagnozy i szerszego planu poprawy.',
  },
  {
    eyebrow: 'Co dostajesz',
    title: 'Diagnoza, plan i 7 dni wsparcia',
    copy: 'To osobny format pracy: rozmowa online, plan poprawy i konsultacje tekstowe przez WhatsApp po rozmowie.',
  },
  {
    eyebrow: 'Co przygotować',
    title: 'Kilka konkretow zamiast rozbudowanej dokumentacji',
    copy: 'Wystarczy opis sytuacji, rytm dnia i to, co bylo już sprawdzane. Nagranie pomaga, ale nie jest warunkiem.',
  },
] as const

const consultationDecisionCards = [
  {
    title: 'Kwadrans',
    copy: 'Wybierz, gdy masz jedno pytanie albo nie wiesz jeszcze, jak szeroki jest temat.',
  },
  {
    title: 'Dwa kwadranse',
    copy: 'Wybierz, gdy 15 minut to za mało, ale nie potrzebujesz jeszcze pełnej diagnozy i 7 dni wsparcia.',
  },
  {
    title: 'Pełna konsultacja',
    copy: 'Wybierz, gdy od razu potrzebujesz diagnozy, planu i spokojnego wsparcia wdrożenia po rozmowie.',
  },
] as const

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pełna konsultacja behawioralna online',
  path: '/konsultacja-behawioralna-online',
  description:
    'Pełna konsultacja behawioralna dla psa i kota: rozmowa online, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
})

export default function ConsultationOnlinePage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min')
  const contactHref = '/kontakt#formularz'
  const prepGuide = getLeadMagnetBySlug('30-zachowan')
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Konsultacja behawioralna online', path: '/konsultacja-behawioralna-online' },
    ]),
    getServiceJsonLd({
      name: 'Pełna konsultacja behawioralna',
      description: 'Pełna konsultacja behawioralna online dla psa lub kota: rozmowa, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
      serviceUrl: consultationHref,
      offerPrice: 470,
    }),
    getFaqPageJsonLd(consultationFaqItems),
  ]

  return (
    <NotatnikPageShell
      tag="Konsultacja / pełny opis"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={consultationHref}
      ctaLabel={FUNNEL_CTA_LABELS.consultation}
      footerPrimaryHref={consultationHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.consultation}
    >
      <Schema data={structuredData} />
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Pełna konsultacja</div>
          <h1>Pełna konsultacja behawioralna online</h1>
          <p>{PUBLIC_OFFER_DECISION_COPY.premium}</p>
          <div className="notatnik-subhero-actions">
            <Link href={consultationHref} prefetch={false} className="notatnik-btn">
              <span>{FUNNEL_CTA_LABELS.consultation}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/cennik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Cennik i porównanie</span>
            </Link>
          </div>
          <p className="notatnik-service-description">
            Jeśli nie masz jeszcze pewnosci, czy temat jest az tak szeroki, zacznij od{' '}
            <Link href={audioHref} prefetch={false} className="notatnik-inline-link">
              Kwadransu
            </Link>{' '}
            albo{' '}
            <Link href={bridgeHref} prefetch={false} className="notatnik-inline-link">
              Dwóch kwadransów
            </Link>
            . Jeśli wolisz najpierw doprecyzowac sytuację, napisz{' '}
            <Link href={contactHref} prefetch={false} className="notatnik-inline-link">
              wiadomość
            </Link>
            .
          </p>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-subhero-figure">
            <Image src={heroImage.src} alt="" aria-hidden="true" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
          </div>
          <div className="notatnik-subhero-note">
            <span>pełny zakres online</span>
            <span>diagnoza + 7 dni WhatsApp</span>
          </div>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="Pełna konsultacja w skrócie" title="Trzy rzeczy, które warto wiedzieć przed rezerwacją." />
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
          <strong>To nie jest dłuższy Kwadrans.</strong>
          <span>{PUBLIC_OFFER_FULL_CONSULTATION_VALUE}</span>
          {prepGuide ? (
            <span>
              Chcesz wejść jeszcze spokojniej? Zobacz{' '}
              <Link href={`/bezplatne-materialy/${prepGuide.slug}`} prefetch={false} className="notatnik-inline-link">
                materiał przygotowujący
              </Link>
              .
            </span>
          ) : null}
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Wybór przed rezerwacją" title="Jedna zasada wyboru przed rezerwacją." />
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
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczęstsze pytania o pełną konsultację." />
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
        title="Jeśli temat jest złożony, <em>wejdź w Pełną konsultację.</em>"
        copy="Jeśli nadal się wahasz, wybierz lżejszy format zamiast rezerwować największą usługę na siłę."
        primaryHref={consultationHref}
        primaryLabel={FUNNEL_CTA_LABELS.consultation}
        secondaryHref={audioHref}
        secondaryLabel={FUNNEL_CTA_LABELS.primary}
      />
    </NotatnikPageShell>
  )
}
