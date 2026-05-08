import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildTechnicalMetadata } from '@/lib/seo'

export const metadata: Metadata = buildTechnicalMetadata({
  title: 'Materiały PDF',
  path: '/zamow-pdf',
  description: 'Stary formularz zamówienia PDF został wycofany. Aktualne materiały są dostępne w katalogu /materiały.',
  noIndex: true,
  follow: true,
})

export default function LegacyPdfOrderPage() {
  redirect('/materialy')
}
