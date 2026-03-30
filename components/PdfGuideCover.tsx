import React from 'react'
import Image from 'next/image'
import { getPdfGuideCoverAlt, getPdfGuideCoverSrc, type PdfGuide } from '@/lib/pdf-guides'

type PdfGuideCoverProps = {
  guide: Pick<PdfGuide, 'title' | 'coverFileName'>
  className?: string
  sizes?: string
  priority?: boolean
  decorative?: boolean
}

export function PdfGuideCover({ guide, className, sizes, priority = false, decorative = false }: PdfGuideCoverProps) {
  return (
    <div className={className ? `pdf-cover-shell ${className}` : 'pdf-cover-shell'}>
      <Image
        src={getPdfGuideCoverSrc(guide)}
        alt={decorative ? '' : getPdfGuideCoverAlt(guide)}
        aria-hidden={decorative}
        width={620}
        height={877}
        sizes={sizes ?? '(max-width: 760px) 70vw, 240px'}
        className="pdf-cover-image"
        priority={priority}
        unoptimized
      />
    </div>
  )
}
