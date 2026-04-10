import React from 'react'
import Link from 'next/link'
import { PdfGuideCover } from '@/components/PdfGuideCover'
import {
  buildPdfInquiryHref,
  getPdfAccessLabel,
  getPdfCategoryLabel,
  getPdfGuideInquiryLabel,
  getPdfKindLabel,
  getPdfPricingBadge,
  type PdfGuide,
} from '@/lib/pdf-guides'

type PdfGuideCardProps = {
  guide: PdfGuide
  primaryHref?: string
  primaryLabel?: string
  compact?: boolean
}

export function PdfGuideCard({ guide, primaryHref, primaryLabel, compact = false }: PdfGuideCardProps) {
  const cardClassName = compact ? 'offer-card tree-backed-card pdf-guide-card pdf-guide-card-compact' : 'offer-card tree-backed-card pdf-guide-card'

  return (
    <article className={cardClassName}>
      <div
        className="pdf-card-accent"
        style={{
          background: `linear-gradient(90deg, ${guide.palette.primary}, ${guide.palette.accent})`,
        }}
      />

      {compact ? null : (
        <Link href={guide.routePath} prefetch={false} className="pdf-card-cover-link" aria-label={`Zobacz poradnik PDF ${guide.title}`}>
          <PdfGuideCover guide={guide} />
        </Link>
      )}

      <div className="offer-card-head">
        <div>
          <div className="pdf-card-kicker-row">
            <div className="section-eyebrow">{guide.website_card?.eyebrow ?? getPdfAccessLabel(guide.accessType)}</div>
            <span className="pdf-card-unit-label">1 poradnik PDF</span>
          </div>
          <h3>{guide.title}</h3>
        </div>
        <span className="offer-price">{getPdfPricingBadge(guide.pricing)}</span>
      </div>

      <p className="pdf-card-subtitle">{guide.subtitle}</p>
      <p className="pdf-card-description">{compact ? guide.mainPromise : guide.description}</p>

      <div className="pdf-meta-row">
        <span className="pill subtle-pill">{getPdfCategoryLabel(guide.category)}</span>
        <span className="pill subtle-pill">{getPdfKindLabel(guide.kind)}</span>
        <span className="pill subtle-pill">{guide.pageCount} stron</span>
        <span className="pill subtle-pill">{guide.estimatedReadingTime} min</span>
      </div>

      <div className="offer-card-actions top-gap-small">
        <Link href={guide.routePath} prefetch={false} className="button button-ghost">
          Zobacz poradnik
        </Link>
        <Link href={primaryHref ?? buildPdfInquiryHref({ guideSlug: guide.slug })} prefetch={false} className="button button-primary">
          {primaryLabel ?? getPdfGuideInquiryLabel(guide)}
        </Link>
      </div>
    </article>
  )
}
