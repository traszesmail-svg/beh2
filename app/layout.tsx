import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ui',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
})

const metadataBase = new URL(process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Behawior 15 | 15-minutowa konsultacja głosowa dla psa lub kota',
    template: '%s | Behawior 15',
  },
  description:
    '15-minutowa konsultacja audio z behawiorystą COAPE / CAPBT. Szybka pomoc dla psa lub kota: szczekanie, kuweta, lęk separacyjny, agresja i trudne zachowania w domu.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Behawior 15 – 15-minutowa konsultacja głosowa',
    description:
      'Szybka pomoc behawioralna dla psa lub kota. Jedna rozmowa, jasny pierwszy krok i realnie wolne terminy bez sztucznej pilności.',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Behawior 15',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behawior 15 – 15-minutowa konsultacja głosowa',
    description:
      'Szybka pomoc behawioralna dla psa lub kota. Jedna rozmowa, jasny pierwszy krok i realnie wolne terminy bez sztucznej pilności.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`${manrope.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  )
}
