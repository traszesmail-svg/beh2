import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, JetBrains_Mono, Manrope } from 'next/font/google'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
import { getOrganizationJsonLd, getWebsiteJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl, shouldBlockSearchIndexing } from '@/lib/server/env'
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SITE_TAGLINE } from '@/lib/site'
import './globals.css'
import './notatnik-a.css'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ui',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
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
  robots: blockSearchIndexing
    ? {
        index: false,
        follow: false,
        noarchive: true,
      }
    : {
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
  const rootJsonLd = [getOrganizationJsonLd(), getWebsiteJsonLd()]

  return (
    <html lang="pl">
      <body className={`${manrope.variable} ${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }} />
        {children}
        <Suspense fallback={null}>
          <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null} />
        </Suspense>
      </body>
    </html>
  )
}
