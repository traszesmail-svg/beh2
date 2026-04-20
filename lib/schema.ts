import {
  INSTAGRAM_PROFILE_URL,
  PUBLIC_CONTACT_EMAIL_FALLBACK,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PRODUCTION_URL,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PUBLIC_STATUS,
} from '@/lib/site'

type BreadcrumbInput = {
  name: string
  path: string
}

type ServiceSchemaInput = {
  name: string
  description: string
  serviceUrl: string
  offerPrice?: number | null
  offerPriceCurrency?: string
  areaServed?: string
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_PRODUCTION_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_PRODUCTION_URL,
    description: SITE_TAGLINE,
    email: PUBLIC_CONTACT_EMAIL_FALLBACK,
    sameAs: [INSTAGRAM_PROFILE_URL],
    logo: {
      '@type': 'ImageObject',
      url: new URL(SITE_OG_IMAGE.url, SITE_PRODUCTION_URL).toString(),
      width: SITE_OG_IMAGE.width,
      height: SITE_OG_IMAGE.height,
    },
  }
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_PRODUCTION_URL}/#website`,
    url: SITE_PRODUCTION_URL,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    description: SITE_TAGLINE,
    publisher: {
      '@id': `${SITE_PRODUCTION_URL}/#organization`,
    },
    inLanguage: 'pl-PL',
  }
}

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_PRODUCTION_URL}/o-mnie#person`,
    name: SPECIALIST_NAME,
    jobTitle: SPECIALIST_PUBLIC_STATUS,
    description: `${SPECIALIST_CREDENTIALS}.`,
    url: `${SITE_PRODUCTION_URL}/o-mnie`,
    homeLocation: {
      '@type': 'Place',
      name: SPECIALIST_LOCATION,
    },
    worksFor: {
      '@id': `${SITE_PRODUCTION_URL}/#organization`,
    },
  }
}

export function getBreadcrumbJsonLd(items: BreadcrumbInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? SITE_PRODUCTION_URL : `${SITE_PRODUCTION_URL}${item.path}`,
    })),
  }
}

export function getServiceJsonLd({
  name,
  description,
  serviceUrl,
  offerPrice = null,
  offerPriceCurrency = 'PLN',
  areaServed = 'Polska',
}: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: serviceUrl,
    provider: {
      '@id': `${SITE_PRODUCTION_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    ...(typeof offerPrice === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: offerPrice,
            priceCurrency: offerPriceCurrency,
            url: serviceUrl,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

export function getItemListJsonLd(
  items: Array<{
    name: string
    url: string
  }>,
  itemListOrder = 'https://schema.org/ItemListOrderAscending',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
