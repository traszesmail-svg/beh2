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
    '15-minutowa konsultacja głosowa z behawiorystą COAPE/CAPBT dla opiekunów psów i kotów. Spokojny pierwszy krok, bezpieczna płatność, szybkie potwierdzenie i możliwość dodania materiałów przed rozmową.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Behawior 15 – spokojna 15-minutowa konsultacja dla psa lub kota',
    description:
      'Spokojna konsultacja głosowa z behawiorystą COAPE/CAPBT. Rezerwacja, bezpieczna płatność, potwierdzenie i jasny pierwszy krok dla opiekuna psa lub kota.',
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Behawior 15',
    images: [
      {
        url: '/images/hero-main.jpg',
        width: 1200,
        height: 1600,
        alt: 'Krzysztof Regulski z kotem na zdjęciu do strony Behawior 15',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behawior 15 – spokojna 15-minutowa konsultacja dla psa lub kota',
    description:
      'Spokojny pierwszy krok, bezpieczna płatność i szybkie potwierdzenie dla opiekunów psów i kotów.',
    images: ['/images/hero-main.jpg'],
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
