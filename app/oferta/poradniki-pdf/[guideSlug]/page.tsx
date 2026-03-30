import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCover } from '@/components/PdfGuideCover'
import {
  buildPdfInquiryHref,
  getPdfAccessDescription,
  getPdfAccessLabel,
  getPdfCategoryLabel,
  getPdfGuideBySlug,
  getPdfGuideInquiryLabel,
  getPdfKindLabel,
  getPdfPricingBadge,
  listPdfBundlesForGuide,
  listPdfGuides,
  PDF_GUIDES_LISTING_ROUTE,
} from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

type PdfGuideDetailPageProps = {
  params: {
    guideSlug: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return listPdfGuides().map((guide) => ({
    guideSlug: guide.slug,
  }))
}

export function generateMetadata({ params }: PdfGuideDetailPageProps): Metadata {
  const guide = getPdfGuideBySlug(params.guideSlug)

  if (!guide) {
    return buildMarketingMetadata({
      title: 'Poradniki PDF',
      path: PDF_GUIDES_LISTING_ROUTE,
      description: 'Listing poradników PDF dla opiekunów psów i kotów.',
    })
  }

  return buildMarketingMetadata({
    title: `${guide.title} | Poradnik PDF`,
    path: guide.routePath,
    description: guide.description,
  })
}

export default function PdfGuideDetailPage({ params }: PdfGuideDetailPageProps) {
  const guide = getPdfGuideBySlug(params.guideSlug)

  if (!guide) {
    notFound()
  }

  const relatedBundles = listPdfBundlesForGuide(guide.slug)

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section">
          <div className="panel section-panel">
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="pdf-back-link">
              Wróć do listingu poradników PDF
            </Link>

            <div className="section-eyebrow">{getPdfAccessLabel(guide.accessType)}</div>
            <h1>{guide.title}</h1>
            <p className="hero-text">{guide.subtitle}</p>

            <div
              className="hero-price-badge offer-price-box tree-backed-card top-gap"
              style={{
                borderColor: `${guide.palette.accent}55`,
                background: `${guide.palette.paper}F5`,
              }}
            >
              <strong>{getPdfPricingBadge(guide.pricing)}</strong>
              <span>{getPdfAccessDescription(guide.accessType)}</span>
            </div>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Co ten materiał porządkuje</strong>
                <span>{guide.valuePromise}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Kiedy ten materiał ma sens</strong>
                <span>{guide.audience}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Najważniejszy efekt</strong>
                <span>{guide.mainPromise}</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link href={buildPdfInquiryHref({ guideSlug: guide.slug })} prefetch={false} className="button button-primary big-button">
                {getPdfGuideInquiryLabel(guide)}
              </Link>
              <Link href="/book" prefetch={false} className="button button-ghost big-button">
                Umów konsultację 15 min
              </Link>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Zakres materiału</div>
            <h2>Co znajdziesz w poradniku</h2>

            <PdfGuideCover guide={guide} className="pdf-detail-cover top-gap" priority />

            <div className="stats-grid top-gap">
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{guide.pageCount}</strong>
                <span>stron A4 z realnym planem działania</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{guide.estimatedReadingTime} min</strong>
                <span>czytania i porządkowania obserwacji</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{getPdfKindLabel(guide.kind)}</strong>
                <span>
                  {getPdfCategoryLabel(guide.category)}. {guide.difficulty}
                </span>
              </div>
            </div>

            <div className="stack-gap top-gap">
              {guide.toc.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>To fragment materiału, który prowadzi od obserwacji do pierwszego wdrożenia.</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Fragment i kontekst</div>
            <h2>Jak ten materiał pracuje z problemem</h2>
            <p className="hero-text">{guide.description}</p>

            <div className="stack-gap top-gap">
              {guide.excerpt.map((paragraph) => (
                <div key={paragraph} className="list-card tree-backed-card">
                  <span>{paragraph}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Dalszy krok</div>
            <h2>Jeśli temat okaże się szerszy niż jeden PDF</h2>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Powiązana ścieżka pracy</strong>
                <span>{guide.relatedService}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Format</strong>
                <span>{guide.format}</span>
              </div>
            </div>

            {relatedBundles.length > 0 ? (
              <>
                <div className="section-eyebrow top-gap">Powiązane pakiety</div>
                <div className="offer-grid top-gap-small">
                  {relatedBundles.map((bundle) => (
                    <PdfBundleCard key={bundle.slug} bundle={bundle} />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Dobór ścieżki</div>
          <h2>Jeśli nie masz pewności, czy lepszy będzie PDF czy rozmowa, zacznij od kontaktu.</h2>
          <p className="hero-text">
            Ten temat możesz dobrać mailowo albo wejść od razu przez szybką konsultację, jeśli problem miesza kilka obszarów
            i wymaga krótszego rozpoznania na żywo.
          </p>
          <div className="hero-actions top-gap">
            <Link href={buildPdfInquiryHref({ guideSlug: guide.slug })} prefetch={false} className="button button-primary big-button">
              Napisz w sprawie tego poradnika
            </Link>
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="button button-ghost big-button">
              Wróć do listy PDF
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
