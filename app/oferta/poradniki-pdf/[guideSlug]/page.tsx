import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildTechnicalMetadata } from '@/lib/seo'

type PdfGuideDetailPageProps = {
  params: {
    guideSlug: string
  }
}

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: PdfGuideDetailPageProps): Metadata {
  return buildTechnicalMetadata({
    title: 'Materiały PDF',
    path: `/oferta/poradniki-pdf/${params.guideSlug}`,
    description: 'Stara ścieżka poradników PDF została wycofana. Aktualny katalog znajduje się pod /materiały.',
    noIndex: true,
    follow: true,
  })
}

export default function LegacyPdfGuideDetailPage() {
  redirect('/materialy')
}
