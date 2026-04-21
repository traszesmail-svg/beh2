import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta psow i kotow online - cala Polska',
  path: '/behawiorysta-online-polska',
  description: pageData?.description ?? 'Behawiorysta psow i kotow online dla opiekunow z calej Polski.',
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
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: pageData.h1,
      description: pageData.description,
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      availableLanguage: 'pl',
      url: new URL('/behawiorysta-online-polska', getCanonicalBaseUrl()).toString(),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pageData.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Behawiorysta psow i kotow online', path: '/behawiorysta-online-polska' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Konsultacje online</div>
              <h1>{pageData.h1}</h1>
              <p className="editorial-hero-lead">{pageData.description}</p>

              <div className="stack-gap top-gap-small">
                {pageData.intro.map((paragraph) => (
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
          <SectionIntro eyebrow="Zakres" title="Wybierz wlasciwa sciezke wejscia" description="To jest glowna strona uslugi online. Stad przechodzisz dalej do problemow psa, problemow kota albo do opisu dluzszej konsultacji." />
          <div className="card-grid two-up top-gap-small">
            {pageData.problemCards.map((item) => (
              <article key={item.title} className="summary-card tree-backed-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.href ? (
                  <Link href={item.href} prefetch={false} className="prep-inline-link">
                    Przejdź do tematu
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Rola strony" title={pageData.supportTitle} description={pageData.supportBody[0] ?? ''} />
          <div className="stack-gap top-gap-small">
            {pageData.supportBody.slice(1).map((paragraph) => (
              <div key={paragraph} className="list-card tree-backed-card">
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Formaty" title="Najprostszy start to Kwadrans z behawiorysta" description="Jesli wolisz najpierw przeczytac materialy, zajrzyj do Niezbednika. Przy sprawach szerszych mozesz wybrac Dwa kwadranse albo pelna konsultacje." />
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
          <SectionIntro eyebrow="FAQ" title="Najczestsze pytania przed rezerwacja" description="Krotko o tym, jak wyglada start, konsultacja online i kontakt przed rezerwacja." />
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
          <SectionIntro eyebrow="Architektura" title="Przejdz dalej tam, gdzie to ma sens" description="Tutaj znajdziesz strony, ktore maja rozne role: kategorie problemow, opis pelnej konsultacji, cennik i kontakt." />
          <div className="blog-related-grid top-gap-small">
            {pageData.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>{item.copy}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </NotatnikPageShell>
  )
}

