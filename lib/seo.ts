import type { Metadata } from 'next'
import { DEFAULT_BOOKING_SERVICE, getBookingServiceRoomSummary, getBookingServiceTitle, type BookingServiceType } from '@/lib/booking-services'
import { SITE_NAME, SITE_OG_IMAGE, SITE_SHORT_NAME, SITE_TAGLINE, SPECIALIST_NAME } from '@/lib/site'

const DEFAULT_OG_IMAGE = SITE_OG_IMAGE

type MarketingMetadataInput = {
  title: string
  path: string
  description: string
}

export function buildMarketingMetadata({ title, path, description }: MarketingMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_SHORT_NAME}`,
      description,
      url: path,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_SHORT_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export async function buildHomeMetadata(): Promise<Metadata> {
  const description =
    `${SITE_NAME}. ${SITE_TAGLINE}. Spokojna, ekspercka pomoc dla opiekunów psów i kotów: od pierwszej konsultacji po terapię, wizyty domowe i pobyty.`

  return {
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: SITE_NAME,
      description,
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
    description:
      `${serviceTitle} w marce ${SITE_SHORT_NAME}. ${serviceSummary} Pomaga uporządkować sytuację i zdecydować, co zrobić dalej ze specjalistą ${SPECIALIST_NAME}.`,
  })
}

export function buildLegalMetadata(title: string, path: string, description: string): Metadata {
  return buildMarketingMetadata({
    title,
    path,
    description,
  })
}
