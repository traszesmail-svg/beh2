import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_TAGLINE } from '@/lib/site'
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
    default: SITE_NAME,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_NAME,
    description: `${SITE_TAGLINE}. ${SITE_DESCRIPTION}`,
    type: 'website',
    locale: 'pl_PL',
    siteName: SITE_NAME,
    url: '/',
    images: [
      {
        url: '/images/hero-main.png',
        width: 1200,
        height: 1778,
        alt: 'Krzysztof Regulski na portretowym zdjęciu do marki Regulski Terapia behawioralna',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
      <body className={`${manrope.variable} ${fraunces.variable}`}>
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null} />
      </body>
    </html>
  )
}
