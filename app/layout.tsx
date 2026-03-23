import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
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
    'Behawior 15 – spokojna 15-minutowa konsultacja głosowa online dla psa lub kota. Certyfikowany behawiorysta Krzysztof Regulski (COAPE/CAPBT). Bezpieczna płatność, szybkie potwierdzenie i jasny pierwszy krok.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Behawior 15 | 15-minutowa konsultacja głosowa dla psa lub kota',
    description:
      'Behawior 15 – spokojna 15-minutowa konsultacja głosowa online dla psa lub kota. Certyfikowany behawiorysta Krzysztof Regulski (COAPE/CAPBT). 28,99 zł, bezpieczna płatność i możliwość ubiegania się o zwrot.',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Behawior 15',
    url: '/',
    images: [
      {
        url: '/images/hero-main.png',
        width: 1200,
        height: 1778,
        alt: 'Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behawior 15 | 15-minutowa konsultacja głosowa dla psa lub kota',
    description:
      'Spokojna konsultacja online dla psa lub kota: 28,99 zł, bezpieczna płatność, szybkie potwierdzenie i jasny pierwszy krok.',
    images: ['/images/hero-main.png'],
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
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null} />
      </body>
    </html>
  )
}
