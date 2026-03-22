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
    default: 'Behawior 15 | 15-minutowa konsultacja głosowa',
    template: '%s | Behawior 15',
  },
  description: 'Szybka konsultacja głosowa dla opiekunów psów i kotów. Rezerwujesz termin, opłacasz rozmowę i od razu dostajesz potwierdzenie oraz link do spotkania.',
  openGraph: {
    title: 'Behawior 15 | 15-minutowa konsultacja głosowa',
    description:
      'Konkretna pomoc behawioralna dla psa lub kota. Jedna rozmowa, jasny pierwszy krok i szybki dostęp do wolnych terminów.',
    type: 'website',
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
