import type { Metadata } from 'next'
import { DEFAULT_BOOKING_SERVICE, getBookingServiceRoomSummary, getBookingServiceTitle, type BookingServiceType } from '@/lib/booking-services'
import { SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SPECIALIST_NAME } from '@/lib/site'

const DEFAULT_OG_IMAGE = SITE_OG_IMAGE

type MarketingMetadataInput = {
  title: string
  path: string
  description: string
  appendLocalContext?: boolean
}

type TechnicalMetadataInput = MarketingMetadataInput & {
  noIndex?: boolean
}

function appendLocalSeoContext(description: string) {
  return description
}

function buildMetadataTitle(title: string) {
  return title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_SHORT_NAME}`
}

export function buildMarketingMetadata({ title, path, description, appendLocalContext = true }: MarketingMetadataInput): Metadata {
  const localizedDescription = appendLocalContext ? appendLocalSeoContext(description) : description
  const fullTitle = buildMetadataTitle(title)

  return {
    title,
    description: localizedDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description: localizedDescription,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'pl_PL',
      url: path,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: localizedDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export function buildTechnicalMetadata({ title, path, description, noIndex = true }: TechnicalMetadataInput): Metadata {
  const localizedDescription = appendLocalSeoContext(description)
  const fullTitle = buildMetadataTitle(title)

  return {
    title,
    description: localizedDescription,
    alternates: {
      canonical: path,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description: localizedDescription,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'pl_PL',
      url: path,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: localizedDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export async function buildHomeMetadata(): Promise<Metadata> {
  const description = appendLocalSeoContext(
    'Behawiorysta online dla opiekunów psów i kotów. Spokojny pierwszy krok, konsultacje online i materiały pomocnicze bez chaosu.',
  )

  return {
    title: SITE_NAME,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: SITE_NAME,
      description,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'pl_PL',
      url: '/',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export async function buildBookMetadata(serviceType: BookingServiceType = DEFAULT_BOOKING_SERVICE): Promise<Metadata> {
  const serviceTitle = getBookingServiceTitle(serviceType)
  const serviceSummary = getBookingServiceRoomSummary(serviceType)

  return buildMarketingMetadata({
    title: serviceTitle,
    path: '/book',
    description: `${serviceTitle} w marce ${SITE_SHORT_NAME}. ${serviceSummary} Pomaga uporządkować sytuację i zdecydować, co zrobić dalej ze specjalistą ${SPECIALIST_NAME}.`,
  })
}

export function buildLegalMetadata(title: string, path: string, description: string): Metadata {
  return buildMarketingMetadata({
    title,
    path,
    description,
    appendLocalContext: false,
  })
}
