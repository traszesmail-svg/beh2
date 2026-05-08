import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildTechnicalMetadata } from '@/lib/seo'

type PdfBundleDetailPageProps = {
  params: {
    bundleSlug: string
  }
}

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: PdfBundleDetailPageProps): Metadata {
  return buildTechnicalMetadata({
    title: 'Materiały PDF',
    path: `/oferta/poradniki-pdf/pakiety/${params.bundleSlug}`,
    description: 'Stara ścieżka pakietów PDF została wycofana. Aktualny katalog znajduje się pod /materiały.',
    noIndex: true,
    follow: true,
  })
}

export default function LegacyPdfBundleDetailPage() {
  redirect('/materialy')
}
