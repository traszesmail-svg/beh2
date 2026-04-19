import { buildBookHref } from './booking-routing'
import { FUNNEL_CTA_LABELS } from './funnel'
import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'
import { CAT_HOME_PHOTO, SPECIALIST_ONLINE_PHOTO, SPECIALIST_WIDE_PHOTO } from './site'

export type OfferKind = 'booking' | 'resource'

export type Offer = {
  slug: string
  contactServiceSlugs?: string[]
  title: string
  shortTitle: string
  eyebrow: string
  kind: OfferKind
  priceLabel: string | null
  priceAmount: number | null
  forWho: string
  whenToChoose: string
  nextStep: string
  cardSummary: string
  heroSummary: string
  descriptions: string[]
  bestFor: string[]
  outcomes: string[]
  primaryCtaLabel: string
  primaryHref: string
  detailCtaLabel?: string
  detailHref?: string
  secondaryCtaLabel?: string
  secondaryHref?: string
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  note?: string
}

export type PdfTopic = {
  id: string
  animal: 'Pies' | 'Kot'
  title: string
  summary: string
}

const quickStartPriceLabel = formatPricePln(DEFAULT_PRICE_PLN)

export const FUNNEL_PRIMARY_HREF = buildBookHref()
export const FUNNEL_PRIMARY_LABEL = FUNNEL_CTA_LABELS.primary
export const FUNNEL_SECONDARY_HREF = '/niezbednik'
export const FUNNEL_SECONDARY_LABEL = FUNNEL_CTA_LABELS.secondary
export const FUNNEL_UPGRADE_HREF = buildBookHref(null, 'konsultacja-behawioralna-online')
export const FUNNEL_UPGRADE_LABEL = FUNNEL_CTA_LABELS.consultation

export const OFFERS: Offer[] = [
  {
    slug: 'szybka-konsultacja-15-min',
    title: 'Kwadrans z behawiorystą',
    shortTitle: 'Kwadrans z behawiorystą',
    eyebrow: 'Pierwszy krok',
    kind: 'booking',
    priceLabel: quickStartPriceLabel,
    priceAmount: DEFAULT_PRICE_PLN,
    forWho: 'Dla psa albo kota, gdy chcesz szybko uporządkować temat i wybrać właściwy pierwszy krok.',
    whenToChoose: 'Gdy masz jedno pytanie, potrzebujesz orientacji w temacie albo chcesz zacząć bez kamery i bez długiego przygotowania.',
    nextStep: 'Wybierasz temat, termin i płatność. Po rozmowie wiesz, co zrobić teraz i czy ten format wystarczy.',
    cardSummary: 'Najprostszy pierwszy krok.',
    heroSummary: 'Najlżejszy pierwszy krok: rozmowa głosem bez kamery, gdy trzeba szybko ustalić priorytet i ruszyć bez chaosu.',
    descriptions: [
      'To dobry wybór, gdy temat jest świeży, wąski albo nie wiesz jeszcze, jak duży jest problem.',
      'Po rozmowie masz pierwszy plan: co zrobić od razu, co obserwować i czy ten format wystarczy.',
    ],
    bestFor: ['jedno pytanie', 'orientacja w temacie', 'spokojny pierwszy krok'],
    outcomes: ['co zrobić dziś', 'co obserwować przez najbliższe dni', 'czy zostać przy 15 min czy wejść głębiej'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    primaryHref: buildBookHref(),
    secondaryCtaLabel: FUNNEL_CTA_LABELS.secondary,
    secondaryHref: FUNNEL_SECONDARY_HREF,
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    imageWidth: SPECIALIST_WIDE_PHOTO.width,
    imageHeight: SPECIALIST_WIDE_PHOTO.height,
    note: 'Jeśli temat okaże się szerszy, od razu wskażę, czy lepsza będzie konsultacja online 60 min albo Niezbędnik.',
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Konsultacja online 60 min',
    shortTitle: '60 min online',
    eyebrow: 'Głębsza opcja',
    kind: 'booking',
    priceLabel: formatPricePln(350),
    priceAmount: 350,
    forWho: 'Dla spraw złożonych, utrwalonych albo wielowątkowych.',
    whenToChoose: 'Gdy problem trwa dłużej, wraca albo obejmuje kilka obszarów naraz i potrzebuje pełniejszej analizy.',
    nextStep: 'Od razu rezerwujesz dłuższy termin online zamiast zaczynać od samego formularza kontaktowego.',
    cardSummary: 'Pełniejszy start dla trudniejszej sprawy.',
    heroSummary: 'Pełna rozmowa online, gdy temat wymaga szerszej analizy już na wejściu.',
    descriptions: [
      'To format dla sytuacji, w których szybki start byłby zbyt płytki: problem wraca, narasta albo dotyka kilku rzeczy naraz.',
      'Po konsultacji masz pełniejszy obraz sytuacji, plan pierwszych zmian i decyzję o dalszej pracy, jeśli będzie potrzebna.',
    ],
    bestFor: ['temat złożony', 'kilka problemów naraz', 'gdy 15 min to za mało'],
    outcomes: ['pełniejszy obraz sytuacji i priorytetów', 'co zrobić najpierw bez zgadywania', 'czy dalej potrzebna jest kolejna konsultacja albo materiał pomocniczy'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.consultation,
    primaryHref: buildBookHref(null, 'konsultacja-behawioralna-online'),
    detailHref: '/konsultacja-behawioralna-online',
    secondaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    secondaryHref: buildBookHref(),
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
    imageWidth: SPECIALIST_ONLINE_PHOTO.width,
    imageHeight: SPECIALIST_ONLINE_PHOTO.height,
    note: 'To szersza i dłuższa opcja dla spraw złożonych. Jeśli temat jest węższy, często wystarczy Kwadrans z behawiorystą.',
  },
  {
    slug: 'poradniki-pdf',
    contactServiceSlugs: ['poradniki-pdf', 'poradnik-pdf', 'pdf', 'poradniki', 'niezbednik'],
    title: 'Niezbędnik',
    shortTitle: 'Niezbędnik',
    eyebrow: 'Materiały pomocnicze',
    kind: 'resource',
    priceLabel: null,
    priceAmount: null,
    forWho: 'Dla osób, które chcą wracać do materiałów i rekomendacji między rozmowami.',
    whenToChoose: 'Gdy chcesz spokojnie wrócić do tematu, przygotować się do rozmowy albo sprawdzić, czy z czymś da się ruszyć samodzielnie.',
    nextStep: 'Najpierw porządkujesz temat, a potem łatwiej decydujesz, czy wystarczy materiał, czy lepiej wejść w rozmowę.',
    cardSummary: 'Materiały do samodzielnej pracy jako drugi krok.',
    heroSummary: 'Materiały do samodzielnej pracy: własne przewodniki, książki i narzędzia dobrane pod konkretne sytuacje.',
    descriptions: [
      'Znajdziesz tu materiały, do których możesz wrócić przed rozmową, po rozmowie albo między kolejnymi krokami.',
      'To miejsce z przewodnikami i narzędziami dobranymi pod konkretne sytuacje.',
    ],
    bestFor: ['powrót do zaleceń', 'materiały pomocnicze', 'spokojne pogłębienie tematu'],
    outcomes: ['czytelny materiał na później', 'mniej chaosu między krokami', 'łatwiejsza decyzja o kolejnym ruchu'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.secondary,
    primaryHref: '/niezbednik',
    detailCtaLabel: FUNNEL_CTA_LABELS.secondary,
    detailHref: '/niezbednik',
    secondaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    secondaryHref: buildBookHref(),
    imageSrc: CAT_HOME_PHOTO.src,
    imageAlt: CAT_HOME_PHOTO.alt,
    imageWidth: CAT_HOME_PHOTO.width,
    imageHeight: CAT_HOME_PHOTO.height,
    note: 'Niezbędnik pomaga przygotować się do rozmowy albo wrócić do zaleceń po konsultacji.',
  },
]

export const CAT_SUPPORT_AREAS = [
  'sika poza kuwetą',
  'konflikt między kotami',
  'żyje w napięciu albo się chowa',
  'źle znosi zmiany w domu',
  'budzi dom po nocy',
] as const

export const CAT_POPULAR_CATEGORIES = [
  {
    title: 'Kuweta i sikanie poza kuwetą',
    summary: 'Najczęstszy start: omijanie kuwety, napięcie przy kuwecie albo nagła zmiana nawyku.',
  },
  {
    title: 'Konflikt między kotami',
    summary: 'Gonitwy, blokowanie przejść, napięcie przy zasobach albo rozjazd relacji w domu.',
  },
  {
    title: 'Wycofanie i napięcie',
    summary: 'Wycofanie, stres po zmianie i trudność z powrotem do codziennego spokoju.',
  },
  {
    title: 'Wokalizacja i pobudzenie',
    summary: 'Miauczenie, nocne pobudki i rytm dnia, który rozsypuje spokój w domu.',
  },
] as const

export const PDF_TOPICS: PdfTopic[] = [
  {
    id: 'pies-ciagnie-na-smyczy',
    animal: 'Pies',
    title: 'Pies ciągnie na smyczy',
    summary: 'Na pierwszy start ze spacerem i napięciem.',
  },
  {
    id: 'pies-zostaje-sam',
    animal: 'Pies',
    title: 'Pies zostaje sam',
    summary: 'Na pierwszy porządek przy wyciu, szczekaniu i chaosie po wyjściu.',
  },
  {
    id: 'pies-rzuca-sie-do-psow',
    animal: 'Pies',
    title: 'Pies rzuca się do innych psów',
    summary: 'Na start przy trudnych spacerach i reaktywności.',
  },
  {
    id: 'szczeniak-gryzie',
    animal: 'Pies',
    title: 'Szczeniak gryzie i nie umie się wyciszyć',
    summary: 'Na start przy gryzieniu, skakaniu i chaosie w domu.',
  },
  {
    id: 'pies-boi-sie',
    animal: 'Pies',
    title: 'Pies boi się ludzi albo dźwięków',
    summary: 'Na pierwszy porządek przy lęku i przeciążeniu.',
  },
  {
    id: 'kot-poza-kuweta-plan',
    animal: 'Kot',
    title: 'Kot sika poza kuwetą',
    summary: 'Na pierwszy porządek przy kuwecie i stresie.',
  },
  {
    id: 'kot-kuweta-wet-czy-behawior',
    animal: 'Kot',
    title: 'Kuweta: wet czy zachowanie',
    summary: 'Na szybkie odróżnienie alarmu od stresu.',
  },
  {
    id: 'konflikt-miedzy-kotami-pdf',
    animal: 'Kot',
    title: 'Konflikt między kotami',
    summary: 'Na start przy napięciu i gonitwach w domu.',
  },
  {
    id: 'kot-wycofany',
    animal: 'Kot',
    title: 'Kot lękowy albo wycofany',
    summary: 'Na prosty start przy chowaniu się i napięciu.',
  },
  {
    id: 'kot-przy-dotyku',
    animal: 'Kot',
    title: 'Kot przy trudnym dotyku i pielęgnacji',
    summary: 'Na start przy pielęgnacji i trudnym kontakcie.',
  },
] as const

export function getOfferBySlug(slug: string) {
  return OFFERS.find((offer) => offer.slug === slug) ?? null
}

export function getOfferDetailHref(offer: Pick<Offer, 'slug' | 'detailHref'>) {
  return offer.detailHref ?? `/oferta/${offer.slug}`
}

export function getOfferDetailCtaLabel(offer: Pick<Offer, 'detailCtaLabel'>) {
  return offer.detailCtaLabel ?? 'Zobacz szczegóły'
}

export function getOfferByServiceSlug(serviceSlug: string) {
  const normalizedServiceSlug = serviceSlug.trim().toLowerCase()

  return (
    OFFERS.find((offer) => {
      const aliases = [offer.slug, ...(offer.contactServiceSlugs ?? [])].map((value) => value.trim().toLowerCase())
      return aliases.includes(normalizedServiceSlug)
    }) ?? null
  )
}
