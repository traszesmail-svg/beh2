import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta online dla całej Polski',
  path: '/behawiorysta-online-polska',
  description: pageData?.description ?? 'Behawiorysta online dla całej Polski. Pomoc dla opiekunów psów i kotów, spokojny start i konsultacje online.',
  appendLocalContext: false,
})

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="editorial-section-head">
      <div className="editorial-section-head-copy">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p className="editorial-section-lead">{description}</p>
    </div>
  )
}

export default function LocalSeoPolandOnlinePage() {
  if (!pageData) {
    return null
  }

  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const toolkitHref = '/niezbednik'
  const contactHref = '/kontakt#formularz'
  const structuredData = [
    getServiceJsonLd({
      name: pageData.h1,
      description: pageData.description,
      serviceUrl: 'https://regulskibehawiorysta.pl/behawiorysta-online-polska',
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorystą',
          description: '15 minut rozmowy audio bez kamery jako spokojny pierwszy krok.',
          url: audioHref,
          price: 69,
        },
        {
          name: 'Pełna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematów wielowątkowych albo długotrwałych.',
          url: consultationHref,
          price: 350,
        },
      ],
    }),
    getFaqPageJsonLd(pageData.faq),
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Behawiorysta psów i kotów online', path: '/behawiorysta-online-polska' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Behawiorysta online / cala Polska"
      navItems={[
        { href: '/psy', label: 'Pies' },
        { href: '/koty', label: 'Kot' },
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/o-mnie', label: 'O mnie' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <Schema data={structuredData} />
      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Konsultacje online</div>
              <h1>{pageData.h1}</h1>
              <p className="editorial-hero-lead">{pageData.description}</p>

              <div className="stack-gap top-gap-small">
                {pageData.intro.slice(0, 2).map((paragraph) => (
                  <p key={paragraph} className="muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="hero-actions editorial-final-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href={toolkitHref} prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jeśli temat od razu wymaga dłuższej rozmowy, możesz wybrać{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation.toLowerCase()}
                </Link>
                . Jeśli chcesz najpierw zadać krótkie pytanie, napisz{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  wiadomość
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Zakres" title="Wybierz właściwą ścieżkę wejścia" description="To jest główna strona usługi online. Stąd przechodzisz dalej do problemów psa, problemów kota albo do opisu dłuższej konsultacji." />
          <div className="card-grid two-up top-gap-small">
            {pageData.problemCards.map((item) => (
              <article key={item.title} className="summary-card tree-backed-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.href ? (
                  <Link href={item.href} prefetch={false} className="prep-inline-link">
                    Przejdz do tematu
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Rola strony" title={pageData.supportTitle} description={pageData.supportBody[0] ?? ''} />
          <div className="stack-gap top-gap-small">
            {pageData.supportBody.slice(1, 3).map((paragraph) => (
              <div key={paragraph} className="list-card tree-backed-card">
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Formaty" title="Najprostszy start to Kwadrans z behawiorystą" description="Jeśli wolisz najpierw przeczytać materiały, zajrzyj do Niezbędnika. Przy sprawach szerszych możesz wybrać Dwa kwadranse albo pełną konsultację." />
          <div className="card-grid three-up top-gap-small">
            {pageData.firstStepCards.map((item) => (
              <article key={item.title} className="summary-card tree-backed-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro eyebrow="FAQ" title="Najczęstsze pytania przed rezerwacją" description="Krótko o tym, jak wygląda start, konsultacja online i kontakt przed rezerwacją." />
          <div className="premium-faq-grid top-gap">
            {pageData.faq.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">
                  <span>{item.question}</span>
                </summary>
                <div className="premium-faq-content">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="panel section-panel blog-related-panel">
          <SectionIntro eyebrow="Architektura" title="Przejdź dalej tam, gdzie to ma sens" description="Tutaj znajdziesz strony, które mają różne role: kategorie problemów, opis pełnej konsultacji, cennik i kontakt." />
          <div className="blog-related-grid top-gap-small">
            {pageData.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>{item.copy}</span>
              </Link>
            ))}
          </div>
          <div className="hero-actions top-gap-small">
            <Link href={contactHref} prefetch={false} className="prep-inline-link">
              Przejdz do kontaktu
            </Link>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
