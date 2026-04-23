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
  follow?: boolean
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

export function buildTechnicalMetadata({ title, path, description, noIndex = true, follow = false }: TechnicalMetadataInput): Metadata {
  const localizedDescription = appendLocalSeoContext(description)
  const fullTitle = buildMetadataTitle(title)

  return {
    title,
    description: localizedDescription,
    alternates: {
      canonical: path,
    },
    robots: noIndex ? { index: false, follow } : undefined,
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
    'Behawiorysta psow i kotow online. Kwadrans z behawiorysta za 69 zl - BLIK, bez kamery, konkretny pierwszy krok.',
  )
  const title = 'Behawiorysta psow i kotow online'
  const fullTitle = buildMetadataTitle(title)

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'pl_PL',
      url: '/',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export async function buildBookMetadata(serviceType: BookingServiceType = DEFAULT_BOOKING_SERVICE): Promise<Metadata> {
  const serviceTitle = getBookingServiceTitle(serviceType)
  const serviceSummary = getBookingServiceRoomSummary(serviceType)
  const isQuick = serviceType === 'szybka-konsultacja-15-min'

  return buildTechnicalMetadata({
    title: isQuick ? 'Rezerwacja konsultacji - Kwadrans z behawiorysta' : `Rezerwacja konsultacji: ${serviceTitle}`,
    path: '/book',
    description: isQuick
      ? 'Zarezerwuj Kwadrans z behawiorysta: 15 minut audio bez kamery, pierwszy krok i spokojne uporzadkowanie tematu.'
      : `${serviceSummary} Wybierz gatunek i temat konsultacji, a potem przejdz do terminow i kolejnego kroku rezerwacji ze specjalista ${SPECIALIST_NAME}.`,
    noIndex: true,
    follow: true,
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
