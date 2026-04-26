import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCover } from '@/components/PdfGuideCover'
import { Schema } from '@/components/schema'
import { repairCopy } from '@/lib/copy'
import {
  buildPdfOrderHref,
  getPdfAccessDescription,
  getPdfAccessLabel,
  getPdfCategoryLabel,
  getPdfGuideCoverSrc,
  getPdfGuideBySlug,
  getPdfGuideInquiryLabel,
  getPdfKindLabel,
  getPdfPricingBadge,
  listPdfBundlesForGuide,
  listPdfGuides,
  PDF_GUIDES_LISTING_ROUTE,
} from '@/lib/pdf-guides'
import { getProductJsonLd } from '@/lib/schema'
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
    title: `${repairCopy(guide.title)} | Poradnik PDF`,
    path: guide.routePath,
    description: repairCopy(guide.description),
  })
}

export default function PdfGuideDetailPage({ params }: PdfGuideDetailPageProps) {
  const guide = getPdfGuideBySlug(params.guideSlug)

  if (!guide) {
    notFound()
  }

  const relatedBundles = listPdfBundlesForGuide(guide.slug)
  const detailPoints = guide.toc.slice(0, 3).map(repairCopy)
  const orderHref = buildPdfOrderHref({ guideSlug: guide.slug })

  return (
    <NotatnikPageShell
      tag="Poradniki PDF / detal"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/book?service=szybka-konsultacja-15-min"
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={orderHref}
      footerPrimaryLabel="Zamów ten PDF"
    >
      <Schema
        data={getProductJsonLd({
          name: repairCopy(guide.title),
          description: repairCopy(guide.description),
          url: guide.routePath,
          price: getPdfPricingBadge(guide.pricing),
          image: getPdfGuideCoverSrc(guide),
          category: 'Poradnik PDF',
        })}
      />
      <div className="container">
        <section className="two-col-section offer-detail-layout pdf-detail-layout">
          <div className="panel section-panel hero-surface offer-detail-content-panel pdf-detail-content-panel">
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="pdf-back-link">
              Wróć do listy PDF
            </Link>

            <div className="offer-detail-head">
              <div className="section-eyebrow">{repairCopy(guide.website_card?.eyebrow ?? getPdfAccessLabel(guide.accessType))}</div>
              <div className="offer-detail-pills">
                <span className="hero-proof-pill">{repairCopy(getPdfCategoryLabel(guide.category))}</span>
                <span className="hero-proof-pill">{repairCopy(getPdfKindLabel(guide.kind))}</span>
                <span className="hero-proof-pill">{guide.pageCount} stron</span>
              </div>
            </div>

            <div className="offer-detail-hero-copy">
              <h1>{repairCopy(guide.title)}</h1>
              <p className="hero-text">{repairCopy(guide.subtitle)}</p>
              <p className="muted paragraph-gap">{repairCopy(guide.description)}</p>
            </div>

            <div className="offer-detail-highlight-row top-gap">
              <div
                className="hero-price-badge offer-price-box tree-backed-card"
                style={{
                  borderColor: `${guide.palette.accent}55`,
                  background: `${guide.palette.paper}F5`,
                }}
              >
                <strong>{repairCopy(getPdfPricingBadge(guide.pricing))}</strong>
                <span>{repairCopy(getPdfAccessDescription(guide.accessType))}</span>
              </div>

              <div className="list-card tree-backed-card offer-detail-price-card">
                <strong>Najważniejszy efekt</strong>
                <span>{repairCopy(guide.mainPromise)}</span>
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
                <strong>{repairCopy(getPdfGuideInquiryLabel(guide))}</strong>
                <span>Jeśli chcesz kupić, dostać dostęp albo upewnić się, czy ten PDF ma sens na start, wyślij krótkie zamówienie przez formularz.</span>
              </div>

              <div className="hero-actions offer-detail-actions">
                <Link href={orderHref} prefetch={false} className="button button-primary big-button">
                  Zamów ten PDF
                </Link>
                <Link href="/book" prefetch={false} className="button button-ghost big-button">
                  Umów 15 min
                </Link>
              </div>
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap offer-detail-contact-card">
              <strong>Kiedy ten PDF ma sens</strong>
              <span>{repairCopy(guide.audience)}</span>
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
                <strong>{repairCopy(guide.format)}</strong>
                <span>{repairCopy(guide.difficulty)}</span>
              </div>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Co ten materiał porządkuje</strong>
              <span>{repairCopy(guide.valuePromise)}</span>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Jeśli temat okaże się szerszy</strong>
              <span>{repairCopy(guide.relatedService)}</span>
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
                  <span>{repairCopy(paragraph)}</span>
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
                <span>{repairCopy(guide.relatedService)}</span>
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
      </div>
    </NotatnikPageShell>
  )
}
