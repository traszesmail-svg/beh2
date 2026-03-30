import React from 'react'
import { PdfGuideCover } from '@/components/PdfGuideCover'
import { getPdfGuideCoverStackLabel, type PdfGuide } from '@/lib/pdf-guides'

type PdfGuideCoverStackProps = {
  guides: Array<Pick<PdfGuide, 'slug' | 'title' | 'coverFileName'>>
  title: string
  className?: string
  showLegend?: boolean
}

export function PdfGuideCoverStack({ guides, title, className, showLegend = false }: PdfGuideCoverStackProps) {
  const previewGuides = guides.slice(0, 3)
  const wrapperClassName = className ? `pdf-cover-stack-group ${className}` : 'pdf-cover-stack-group'

  return (
    <div className={wrapperClassName}>
      <div className="pdf-cover-stack" role="img" aria-label={getPdfGuideCoverStackLabel(title)}>
        {previewGuides.map((guide, index) => (
          <div key={guide.slug} className={`pdf-cover-stack-item pdf-cover-stack-item-${index + 1}`}>
            <PdfGuideCover guide={guide} decorative className="pdf-cover-stack-shell" sizes="160px" />
          </div>
        ))}
      </div>
      {showLegend ? (
        <div className="pdf-cover-stack-legend" aria-hidden="true">
          {previewGuides.map((guide) => (
            <span key={guide.slug} className="pdf-cover-stack-chip">
              {guide.title}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
