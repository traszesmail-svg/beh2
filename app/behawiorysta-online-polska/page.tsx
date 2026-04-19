import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta online dla psa i kota',
  path: '/behawiorysta-online-polska',
  description: pageData?.description ?? 'Konsultacje behawioralne online dla opiekunów psów i kotów z całej Polski.',
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
  ]

  return (
    <main className="page-wrap editorial-home-page premium-home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container editorial-stack">
        <Header />

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
          <SectionIntro eyebrow="Zakres" title="Najczęstsze powody kontaktu" description="To strona dla opiekunów z całej Polski, którzy chcą omówić problem psa albo kota w formule online." />
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
          <SectionIntro eyebrow="Jak to działa" title={pageData.supportTitle} description={pageData.supportBody[0] ?? ''} />
          <div className="stack-gap top-gap-small">
            {pageData.supportBody.slice(1).map((paragraph) => (
              <div key={paragraph} className="list-card tree-backed-card">
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Od czego zacząć" title="Najprostszy start to Kwadrans z behawiorystą" description="Jeśli wolisz najpierw przeczytać materiały, zajrzyj do Niezbędnika. Przy sprawach szerszych możesz od razu wybrać konsultację 60 min." />
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
          <SectionIntro eyebrow="Powiązane strony" title="Przejdź dalej tam, gdzie to ma sens" description="Tutaj znajdziesz najbliższe strony ofertowe i kontakt, bez zbędnych objazdów." />
          <div className="blog-related-grid top-gap-small">
            {pageData.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>{item.copy}</span>
              </Link>
            ))}
          </div>
        </section>

        <Footer
          variant="lean"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={toolkitHref}
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}

