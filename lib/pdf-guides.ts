import { readFileSync } from 'node:fs'
import path from 'node:path'

export type PdfGuideAccessType = 'low-ticket' | 'lead magnet' | 'bonus'
export type PdfGuideCategory = 'dog' | 'cat' | 'mixed'
export type PdfGuideKind = 'main' | 'quick'

export type PdfGuidePalette = {
  primary: string
  secondary: string
  accent: string
  ink: string
  paper: string
}

export type PdfGuide = {
  slug: string
  title: string
  subtitle: string
  audience: string
  valuePromise: string
  format: string
  accessType: PdfGuideAccessType
  pricing: string
  mainPromise: string
  status: string
  relatedService: string
  difficulty: string
  estimatedReadingTime: number
  pageCount: number
  description: string
  sourcePath: string
  pdfPath: string
  coverPath: string
  category: PdfGuideCategory
  kind: PdfGuideKind
  palette: PdfGuidePalette
  routePath: string
  pagePath: string
  pageHref: string
  pdfFileName: string
  coverFileName: string
  pdfHrefFromListing: string
  pdfHrefFromPage: string
  coverHrefFromListing: string
  coverHrefFromPage: string
  toc: string[]
  excerpt: string[]
}

export type PdfBundle = {
  slug: string
  title: string
  audience: string
  accessType: 'bundle'
  pricing: string
  guideSlugs: string[]
  promise: string
  routePath: string
  pagePath: string
  pageHref: string
  category: PdfGuideCategory
  guides: PdfGuide[]
  consult: string[]
}

export type PdfFaqItem = {
  question: string
  answer: string
}

export type PdfGuidesSiteData = {
  generatedAt: string
  listing: {
    routePath: string
    pagePath: string
  }
  hero: {
    badge: string
    title: string
    lead: string
  }
  featuredSlugs: string[]
  guideGroups: Record<PdfGuideCategory, string[]>
  faq: PdfFaqItem[]
  cta: {
    title: string
    body: string
    primaryLabel: string
    secondaryLabel: string
  }
  guides: PdfGuide[]
  bundles: PdfBundle[]
}

const pdfGuidesSiteDataPath = path.join(process.cwd(), 'content', 'guides', 'site', 'guides-site-data.json')
const pdfGuidesSiteData = JSON.parse(readFileSync(pdfGuidesSiteDataPath, 'utf8')) as PdfGuidesSiteData

const guidesBySlug = new Map(pdfGuidesSiteData.guides.map((guide) => [guide.slug, guide] as const))
const bundlesBySlug = new Map(pdfGuidesSiteData.bundles.map((bundle) => [bundle.slug, bundle] as const))
const PDF_GUIDE_COVER_PUBLIC_BASE = '/branding/pdf-covers'

export const PDF_GUIDES_SITE_DATA = pdfGuidesSiteData
export const PDF_GUIDES_LISTING_ROUTE = pdfGuidesSiteData.listing.routePath

export function listPdfGuides(): PdfGuide[] {
  return pdfGuidesSiteData.guides
}

export function listPdfBundles(): PdfBundle[] {
  return pdfGuidesSiteData.bundles
}

export function listPdfRoutePaths(): string[] {
  return [
    pdfGuidesSiteData.listing.routePath,
    ...pdfGuidesSiteData.guides.map((guide) => guide.routePath),
    ...pdfGuidesSiteData.bundles.map((bundle) => bundle.routePath),
  ]
}

export function getPdfGuideBySlug(slug: string): PdfGuide | null {
  return guidesBySlug.get(slug) ?? null
}

export function getPdfBundleBySlug(slug: string): PdfBundle | null {
  return bundlesBySlug.get(slug) ?? null
}

export function listFeaturedPdfGuides(): PdfGuide[] {
  return pdfGuidesSiteData.featuredSlugs
    .map((slug) => guidesBySlug.get(slug) ?? null)
    .filter((guide): guide is PdfGuide => guide !== null)
}

export function listPdfGuidesByCategory(category: PdfGuideCategory): PdfGuide[] {
  return pdfGuidesSiteData.guideGroups[category]
    .map((slug) => guidesBySlug.get(slug) ?? null)
    .filter((guide): guide is PdfGuide => guide !== null)
}

export function listPdfBundlesForGuide(slug: string): PdfBundle[] {
  return pdfGuidesSiteData.bundles.filter((bundle) => bundle.guideSlugs.includes(slug))
}

export function buildPdfInquiryHref({
  guideSlug,
  bundleSlug,
}: {
  guideSlug?: string | null
  bundleSlug?: string | null
} = {}) {
  const params = new URLSearchParams({
    service: 'poradniki-pdf',
  })

  if (guideSlug) {
    params.set('guide', guideSlug)
  }

  if (bundleSlug) {
    params.set('bundle', bundleSlug)
  }

  return `/kontakt?${params.toString()}`
}

export function getPdfGuideCoverSrc(guide: Pick<PdfGuide, 'coverFileName'>): string {
  return `${PDF_GUIDE_COVER_PUBLIC_BASE}/${guide.coverFileName}`
}

export function getPdfGuideCoverAlt(guide: Pick<PdfGuide, 'title'>): string {
  return `Okładka poradnika PDF ${guide.title}`
}

export function getPdfGuideCoverStackLabel(title: string): string {
  return `Podgląd okładek poradników PDF: ${title}`
}

export function getPdfPricingBadge(pricing: string): string {
  const normalizedPricing = pricing.replace(/\s+/g, ' ').trim()

  if (/^0\s*zł/i.test(normalizedPricing)) {
    return '0 zł'
  }

  const addonMatch = normalizedPricing.match(/(\d+(?:[.,]\d{1,2})?\s*zł)\s+jako dodatek/i)

  if (addonMatch) {
    return `${addonMatch[1]} jako dodatek`
  }

  const priceMatch = normalizedPricing.match(/\d+(?:[.,]\d{1,2})?\s*zł/i)

  return priceMatch?.[0] ?? normalizedPricing
}

export function getPdfAccessLabel(accessType: PdfGuideAccessType | 'bundle'): string {
  switch (accessType) {
    case 'lead magnet':
      return 'Materiał startowy'
    case 'bonus':
      return 'Dostęp po konsultacji'
    case 'bundle':
      return 'Pakiet PDF'
    case 'low-ticket':
    default:
      return 'Płatny poradnik'
  }
}

export function getPdfAccessDescription(accessType: PdfGuideAccessType | 'bundle'): string {
  switch (accessType) {
    case 'lead magnet':
      return 'To materiał startowy udostępniany po kontakcie albo jako spokojne wejście przed konsultacją.'
    case 'bonus':
      return 'To materiał dostępny po konsultacji albo jako uzupełnienie dalszej pracy. Napisz, jeśli chcesz sprawdzić, czy pasuje do Twojej sytuacji.'
    case 'bundle':
      return 'To pakiet kilku materiałów dobieranych do konkretnego problemu albo etapu współpracy.'
    case 'low-ticket':
    default:
      return 'To materiał płatny albo dokładany po konsultacji. Dostęp ustalamy przez kontakt, a nie przez automatyczny checkout na stronie.'
  }
}

export function getPdfGuideInquiryLabel(guide: Pick<PdfGuide, 'accessType'>): string {
  switch (guide.accessType) {
    case 'lead magnet':
      return 'Napisz w sprawie tego materiału'
    case 'bonus':
      return 'Napisz w sprawie dostępu po konsultacji'
    case 'low-ticket':
    default:
      return 'Napisz w sprawie zakupu i dostępu'
  }
}

export function getPdfCategoryLabel(category: PdfGuideCategory): string {
  switch (category) {
    case 'dog':
      return 'Pies'
    case 'cat':
      return 'Kot'
    case 'mixed':
    default:
      return 'Pies i kot'
  }
}

export function getPdfKindLabel(kind: PdfGuideKind): string {
  switch (kind) {
    case 'quick':
      return 'Szybki materiał'
    case 'main':
    default:
      return 'Temat główny'
  }
}
