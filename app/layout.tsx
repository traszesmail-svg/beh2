import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
import { getCanonicalBaseUrl, shouldBlockSearchIndexing } from '@/lib/server/env'
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SITE_TAGLINE } from '@/lib/site'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ui',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
})

const metadataBase = new URL(getCanonicalBaseUrl())
const blockSearchIndexing = shouldBlockSearchIndexing()

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
    index: !blockSearchIndexing,
    follow: true,
    noarchive: blockSearchIndexing,
  },
  openGraph: {
    title: SITE_NAME,
    description: `${SITE_TAGLINE}. ${SITE_DESCRIPTION}`,
    type: 'website',
    locale: 'pl_PL',
    siteName: SITE_NAME,
    url: '/',
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
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
        <Suspense fallback={null}>
          <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null} />
        </Suspense>
      </body>
    </html>
  )
}
