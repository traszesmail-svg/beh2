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
  const detailPoints = guide.toc.slice(0, 3)

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section offer-detail-layout pdf-detail-layout">
          <div className="panel section-panel hero-surface offer-detail-content-panel pdf-detail-content-panel">
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="pdf-back-link">
              Wróć do listy PDF
            </Link>

            <div className="offer-detail-head">
              <div className="section-eyebrow">{getPdfAccessLabel(guide.accessType)}</div>
              <div className="offer-detail-pills">
                <span className="hero-proof-pill">{getPdfCategoryLabel(guide.category)}</span>
                <span className="hero-proof-pill">{getPdfKindLabel(guide.kind)}</span>
                <span className="hero-proof-pill">{guide.pageCount} stron</span>
              </div>
            </div>

            <div className="offer-detail-hero-copy">
              <h1>{guide.title}</h1>
              <p className="hero-text">{guide.subtitle}</p>
              <p className="muted paragraph-gap">{guide.description}</p>
            </div>

            <div className="offer-detail-highlight-row top-gap">
              <div
                className="hero-price-badge offer-price-box tree-backed-card"
                style={{
                  borderColor: `${guide.palette.accent}55`,
                  background: `${guide.palette.paper}F5`,
                }}
              >
                <strong>{getPdfPricingBadge(guide.pricing)}</strong>
                <span>{getPdfAccessDescription(guide.accessType)}</span>
              </div>

              <div className="list-card tree-backed-card offer-detail-price-card">
                <strong>Najważniejszy efekt</strong>
                <span>{guide.mainPromise}</span>
              </div>
            </div>

            <ul className="detail-points-list top-gap">
              {detailPoints.map((item) => (
                <li key={item} className="detail-point tree-backed-card">
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="offer-detail-cta-band tree-backed-card top-gap">
              <div className="offer-detail-cta-copy">
                <span className="section-eyebrow">Pierwszy ruch</span>
                <strong>{getPdfGuideInquiryLabel(guide)}</strong>
                <span>Jeśli chcesz kupić, dostać dostęp albo upewnić się, czy ten PDF ma sens na start, napisz krótką wiadomość.</span>
              </div>

              <div className="hero-actions offer-detail-actions">
                <Link href={buildPdfInquiryHref({ guideSlug: guide.slug })} prefetch={false} className="button button-primary big-button">
                  {getPdfGuideInquiryLabel(guide)}
                </Link>
                <Link href="/book" prefetch={false} className="button button-ghost big-button">
                  Umów 15 min
                </Link>
              </div>
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap offer-detail-contact-card">
              <strong>Kiedy ten PDF ma sens</strong>
              <span>{guide.audience}</span>
            </div>
          </div>

          <div className="panel section-panel image-panel offer-detail-media-panel pdf-detail-media-panel">
            <div className="offer-detail-media-top pdf-detail-cover-shell">
              <PdfGuideCover guide={guide} className="pdf-detail-cover" priority />
            </div>

            <div className="stats-grid top-gap pdf-detail-mini-grid">
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{guide.pageCount}</strong>
                <span>stron z planem działania</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{guide.estimatedReadingTime} min</strong>
                <span>czytania i porządkowania obserwacji</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{guide.format}</strong>
                <span>{guide.difficulty}</span>
              </div>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Co ten materiał porządkuje</strong>
              <span>{guide.valuePromise}</span>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Jeśli temat okaże się szerszy</strong>
              <span>{guide.relatedService}</span>
            </div>
          </div>
        </section>

        <section className="two-col-section pdf-detail-followup-grid">
          <div className="panel section-panel">
            <div className="section-eyebrow">Fragment i kontekst</div>
            <h2>Jak ten materiał prowadzi dalej</h2>

            <div className="stack-gap top-gap">
              {guide.excerpt.map((paragraph) => (
                <div key={paragraph} className="list-card tree-backed-card">
                  <span>{paragraph}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Jeśli trzeba więcej</div>
            <h2>Gdy jeden PDF to za mało</h2>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Najbliższa forma pomocy</strong>
                <span>{guide.relatedService}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Dalszy krok</strong>
                <span>Najpierw możesz zacząć od tego materiału, a jeśli temat okaże się szerszy, przejść do rozmowy albo pakietu.</span>
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

        <Footer variant="full" ctaHref={buildPdfInquiryHref({ guideSlug: guide.slug })} ctaLabel="Napisz o tym PDF" />
      </div>
    </main>
  )
}
