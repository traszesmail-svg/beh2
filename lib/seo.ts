import type { Metadata } from 'next'
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

export async function buildBookMetadata(): Promise<Metadata> {
  return buildMarketingMetadata({
    title: 'Szybka konsultacja 15 min',
    path: '/book',
    description:
      `Umów 15 min w marce ${SITE_SHORT_NAME}. Krótka konsultacja audio dla psa lub kota pomaga uporządkować sytuację i zdecydować, co zrobić dalej ze specjalistą ${SPECIALIST_NAME}.`,
  })
}

export function buildLegalMetadata(title: string, path: string, description: string): Metadata {
  return buildMarketingMetadata({
    title,
    path,
    description,
  })
}
