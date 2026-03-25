import type { Metadata } from 'next'
import { SITE_NAME, SPECIALIST_NAME } from '@/lib/site'

const DEFAULT_OG_IMAGE = {
  url: '/images/hero-main.png',
  width: 1200,
  height: 1778,
  alt: 'Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15',
} as const

function buildBookMarketingDescription() {
  return 'Wybierz temat najbliższy problemowi, sprawdź aktualny kalendarz i zarezerwuj konsultację Behawior 15. Gryzienie rąk, rzucanie się do psów, lęk separacyjny czy kuweta to dobry punkt startu.'
}

export async function buildHomeMetadata(): Promise<Metadata> {
  const description =
    `${SITE_NAME} – spokojna 15-minutowa konsultacja głosowa online dla psa lub kota. Szczeniak gryzie ręce? Pies rzuca się do innych psów? Kot sika poza kuwetą? Certyfikowany behawiorysta ${SPECIALIST_NAME} (COAPE/CAPBT) porządkuje sytuację i daje pierwszy sensowny krok.`

  return {
    title: `${SITE_NAME} | 15-minutowa konsultacja głosowa dla psa lub kota`,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${SITE_NAME} | 15-minutowa konsultacja głosowa dla psa lub kota`,
      description,
      url: '/',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | 15-minutowa konsultacja głosowa dla psa lub kota`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export async function buildBookMetadata(): Promise<Metadata> {
  const description = buildBookMarketingDescription()

  return {
    title: 'Rezerwacja konsultacji',
    description,
    alternates: {
      canonical: '/book',
    },
    openGraph: {
      title: `${SITE_NAME} | Rezerwacja konsultacji`,
      description,
      url: '/book',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | Rezerwacja konsultacji`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}

export function buildLegalMetadata(title: string, path: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${SITE_NAME} | ${title}`,
      description,
      url: path,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | ${title}`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  }
}
