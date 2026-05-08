// Source of truth for the public /materiały funnel.
// Keep this catalog aligned with the PDF files that are meant to be visible on the site.

export type MaterialyCategory = 'cat' | 'dog' | 'both'
export type MaterialyTier = 'free' | 'single' | 'bundle'
export type MaterialyPriceCode = 'free' | 'p19' | 'p29' | 'p49'

export type MaterialyGuide = {
  slug: string
  title: string
  subtitle: string
  category: MaterialyCategory
  tier: 'free' | 'single'
  priceCode: MaterialyPriceCode
  shortPromise: string
  forWhom: string
  pdfFile: string
  highlights: string[]
  previewPageCount: number
}

export type MaterialyBundle = {
  slug: string
  title: string
  subtitle: string
  category: Exclude<MaterialyCategory, 'both'>
  priceCode: 'p49'
  guideSlugs: string[]
  shortPromise: string
}

export const PRICE_LABEL: Record<MaterialyPriceCode, string> = {
  free: 'Bezpłatne',
  p19: '19 zł',
  p29: '29 zł',
  p49: '49 zł',
}

export const PRICE_AMOUNT_PLN: Record<MaterialyPriceCode, number> = {
  free: 0,
  p19: 19,
  p29: 29,
  p49: 49,
}

const RAW_GUIDES: MaterialyGuide[] = [
  {
    slug: 'kot-zyje-w-napieciu',
    title: 'Kot żyje w napięciu',
    subtitle: 'Jak rozpoznać kota w długim stresie i co naprawdę ma znaczenie',
    category: 'cat',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Mapa codziennych sygnałów napięcia i pierwszych reakcji środowiskowych.',
    forWhom: 'Dla opiekuna kota, który widzi wycofanie, czujność albo drobne sygnały stresu i chce zacząć od spokojnej obserwacji.',
    pdfFile: 'kot-zyje-w-napieciu.pdf',
    highlights: ['sygnały napięcia', 'pierwsze zmiany w domu', 'kiedy sprawdzić zdrowie'],
    previewPageCount: 9,
  },
  {
    slug: 'pies-ile-ruchu-potrzebuje',
    title: 'Czy Twój pies naprawdę potrzebuje więcej ruchu?',
    subtitle: 'Kiedy dokładanie aktywności pogarsza sprawę i jak to rozpoznać',
    category: 'dog',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Prosty filtr: czy psu brakuje ruchu, czy odpoczynku i regulacji.',
    forWhom: 'Dla opiekuna psa, który słyszy "dodaj ruchu", ale widzi, że po spacerach pies jest bardziej pobudzony, a nie spokojniejszy.',
    pdfFile: 'pies-ile-ruchu-potrzebuje.pdf',
    highlights: ['ruch kontra odpoczynek', 'sygnały przeciążenia', 'bezpieczniejszy rytm dnia'],
    previewPageCount: 8,
  },
  {
    slug: 'kwadrans-podstawy-kota',
    title: 'Kwadrans: podstawy kota',
    subtitle: 'Krótki materiał porządkujący pierwszą rozmowę o kocie',
    category: 'cat',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Co warto zauważyć przed Kwadransem, żeby rozmowa szybciej zeszła do konkretu.',
    forWhom: 'Dla opiekuna kota, który chce przygotować najważniejsze informacje przed krótką konsultacją.',
    pdfFile: 'kwadrans-podstawy-kota.pdf',
    highlights: ['opis problemu', 'rytm dnia', 'co przygotować przed rozmową'],
    previewPageCount: 11,
  },
  {
    slug: 'kwadrans-podstawy-psa',
    title: 'Kwadrans: podstawy psa',
    subtitle: 'Krótki materiał porządkujący pierwszą rozmowę o psie',
    category: 'dog',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Najważniejsze informacje przed Kwadransem, bez rozpisywania całej historii od zera.',
    forWhom: 'Dla opiekuna psa, który chce szybko zebrać kontekst do krótkiej konsultacji.',
    pdfFile: 'kwadrans-podstawy-psa.pdf',
    highlights: ['jedno główne pytanie', 'krótka historia problemu', 'co pomaga w diagnozie'],
    previewPageCount: 11,
  },
  {
    slug: '30-zachowan',
    title: '30 zachowań do obserwacji',
    subtitle: 'Sygnały u psa i kota, które warto zanotować przed decyzją o kolejnym kroku',
    category: 'both',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Lista zachowań i sygnałów, które pomagają oddzielić incydent od wzorca.',
    forWhom: 'Dla opiekuna psa albo kota, który chce spokojnie sprawdzić, co właściwie wraca w codzienności.',
    pdfFile: '30-zachowan.pdf',
    highlights: ['sygnały ciała', 'kiedy obserwować', 'kiedy przejść do rozmowy'],
    previewPageCount: 11,
  },
  {
    slug: 'pierwszy-tydzien-z-kotem',
    title: 'Pierwszy tydzień z kotem',
    subtitle: 'Plan spokojnego wejścia kota do domu i pierwszych dni bez presji',
    category: 'cat',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Praktyczny plan pierwszych dni: przestrzeń, rytm, kontakt i obserwacja.',
    forWhom: 'Dla opiekuna, który przyjmuje kota do domu albo chce naprawić zbyt szybki start po adopcji.',
    pdfFile: 'pierwszy-tydzien-z-kotem.pdf',
    highlights: ['pokój bezpieczny', 'pierwsze rytuały', 'czego nie przyspieszać'],
    previewPageCount: 11,
  },
  {
    slug: 'pies-sam-w-domu',
    title: 'Pies sam w domu',
    subtitle: 'Pierwsze kroki, gdy zostawanie samemu zaczyna wyglądać jak problem',
    category: 'dog',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Jak zebrać kontekst, odróżnić scenariusze i nie pogłębiać napięcia.',
    forWhom: 'Dla opiekuna psa, który widzi wycie, niszczenie, pobudzenie albo trudny powrót po wyjściu z domu.',
    pdfFile: 'pies-sam-w-domu.pdf',
    highlights: ['co nagrywać', 'pierwsze 72 godziny', 'czego nie robić na siłę'],
    previewPageCount: 11,
  },
]

const RAW_BUNDLES: MaterialyBundle[] = []

const guidesBySlug = new Map(RAW_GUIDES.map((guide) => [guide.slug, guide] as const))
const bundlesBySlug = new Map(RAW_BUNDLES.map((bundle) => [bundle.slug, bundle] as const))

export function listMaterialyGuides(): MaterialyGuide[] {
  return RAW_GUIDES
}

export function listMaterialyBundles(): MaterialyBundle[] {
  return RAW_BUNDLES
}

export function getMaterialyGuideBySlug(slug: string): MaterialyGuide | null {
  return guidesBySlug.get(slug) ?? null
}

export function getMaterialyBundleBySlug(slug: string): MaterialyBundle | null {
  return bundlesBySlug.get(slug) ?? null
}

export function getMaterialyGuideCoverSrc(guide: Pick<MaterialyGuide, 'slug'>): string {
  return `/branding/pdf-covers/${guide.slug}.png`
}

export function getMaterialyGuidePreviewSrcs(guide: Pick<MaterialyGuide, 'slug' | 'previewPageCount'>, limit = 3): string[] {
  const count = Math.max(0, Math.min(limit, guide.previewPageCount))

  return Array.from({ length: count }, (_, index) => {
    const page = String(index + 1).padStart(2, '0')
    return `/branding/pdf-previews/${guide.slug}/page_${page}.png`
  })
}

export function listMaterialyByTier(tier: MaterialyTier): (MaterialyGuide | MaterialyBundle)[] {
  if (tier === 'bundle') return RAW_BUNDLES
  return RAW_GUIDES.filter((guide) => guide.tier === tier)
}

export function listMaterialyByCategory(category: MaterialyCategory): MaterialyGuide[] {
  return RAW_GUIDES.filter((guide) => guide.category === category)
}

export function bundleSavings(bundle: MaterialyBundle): number {
  const sum = bundle.guideSlugs
    .map((slug) => guidesBySlug.get(slug))
    .filter((guide): guide is MaterialyGuide => guide !== undefined)
    .reduce((acc, guide) => acc + PRICE_AMOUNT_PLN[guide.priceCode], 0)

  return Math.max(0, sum - PRICE_AMOUNT_PLN[bundle.priceCode])
}

export function categoryLabel(category: MaterialyCategory): string {
  if (category === 'cat') return 'Kot'
  if (category === 'dog') return 'Pies'
  return 'Pies i kot'
}
