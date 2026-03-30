import React from 'react'
import Link from 'next/link'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { buildPdfInquiryHref, getPdfCategoryLabel, getPdfPricingBadge, type PdfBundle } from '@/lib/pdf-guides'

type PdfBundleCardProps = {
  bundle: PdfBundle
}

export function PdfBundleCard({ bundle }: PdfBundleCardProps) {
  return (
    <article className="offer-card tree-backed-card pdf-guide-card">
      <div className="pdf-card-accent pdf-card-accent-bundle" />

      <PdfGuideCoverStack guides={bundle.guides} title={bundle.title} className="pdf-bundle-card-stack" />

      <div className="offer-card-head">
        <div>
          <div className="section-eyebrow">Pakiet PDF</div>
          <h3>{bundle.title}</h3>
        </div>
        <span className="offer-price">{getPdfPricingBadge(bundle.pricing)}</span>
      </div>

      <p className="pdf-card-subtitle">{bundle.promise}</p>
      <p>Dla: {bundle.audience}. Zamiast jednego PDF-u dostajesz gotową sekwencję materiałów dla tego samego obszaru pracy.</p>

      <div className="pdf-meta-row">
        <span className="pill subtle-pill">{getPdfCategoryLabel(bundle.category)}</span>
        <span className="pill subtle-pill">{bundle.guides.length} poradniki</span>
        <span className="pill subtle-pill">Pakiet</span>
      </div>

      <div className="pdf-bundle-guide-row">
        {bundle.guides.map((guide) => (
          <span key={guide.slug} className="pdf-bundle-guide-pill">
            {guide.title}
          </span>
        ))}
      </div>

      <div className="offer-card-actions top-gap-small">
        <Link href={bundle.routePath} prefetch={false} className="button button-ghost">
          Zobacz pakiet
        </Link>
        <Link href={buildPdfInquiryHref({ bundleSlug: bundle.slug })} prefetch={false} className="button button-primary">
          Napisz w sprawie pakietu
        </Link>
      </div>
    </article>
  )
}
