import { buildBookHref } from './booking-routing'
import { FUNNEL_CTA_LABELS } from './funnel'
import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'
import { CAT_HOME_PHOTO, SPECIALIST_ONLINE_PHOTO, SPECIALIST_WIDE_PHOTO } from './site'
import { PUBLIC_OFFER_FULL_CONSULTATION_VALUE } from './public-offer-copy'

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
export const FUNNEL_UPGRADE_HREF = buildBookHref(null, 'konsultacja-30-min')
export const FUNNEL_UPGRADE_LABEL = FUNNEL_CTA_LABELS.bridge
export const FUNNEL_FULL_CONSULTATION_HREF = buildBookHref(null, 'konsultacja-behawioralna-online')
export const FUNNEL_FULL_CONSULTATION_LABEL = FUNNEL_CTA_LABELS.consultation
export const FUNNEL_SECONDARY_HREF = '/niezbednik'
export const FUNNEL_SECONDARY_LABEL = FUNNEL_CTA_LABELS.secondary

export const OFFERS: Offer[] = [
  {
    slug: 'szybka-konsultacja-15-min',
    title: 'Kwadrans z behawiorysta',
    shortTitle: 'Kwadrans z behawiorysta',
    eyebrow: 'Pierwszy krok',
    kind: 'booking',
    priceLabel: quickStartPriceLabel,
    priceAmount: DEFAULT_PRICE_PLN,
    forWho: 'Dla psa albo kota, gdy chcesz szybko uporzadkowac temat i wybrac wlasciwy pierwszy krok.',
    whenToChoose: 'Gdy masz jedno pytanie, potrzebujesz orientacji w temacie albo chcesz zaczac bez kamery i bez dlugiego przygotowania.',
    nextStep: 'Wybierasz temat, termin i platnosc. Po rozmowie wiesz, co zrobic teraz i czy ten format wystarczy.',
    cardSummary: 'Najprostszy start i cena wejscia.',
    heroSummary: '15 minut rozmowy audio bez kamery, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, co robic dalej.',
    descriptions: [
      'To dobry wybor, gdy temat jest swiezy, waski albo nie wiesz jeszcze, jak duzy jest problem.',
      'Po rozmowie masz pierwszy plan: co zrobic od razu, co obserwowac i czy ten format wystarczy.',
    ],
    bestFor: ['jedno pytanie', 'orientacja w temacie', 'spokojny pierwszy krok'],
    outcomes: ['co zrobic dzis', 'co obserwowac przez najblizsze dni', 'czy zostac przy 15 min czy przejsc dalej'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    primaryHref: buildBookHref(),
    secondaryCtaLabel: FUNNEL_CTA_LABELS.bridge,
    secondaryHref: buildBookHref(null, 'konsultacja-30-min'),
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    imageWidth: SPECIALIST_WIDE_PHOTO.width,
    imageHeight: SPECIALIST_WIDE_PHOTO.height,
    note: 'Jesli temat okaze sie szerszy, od razu wskaze, czy lepsze beda Dwa kwadranse z behawiorysta albo pelna konsultacja behawioralna.',
  },
  {
    slug: 'kwadrans-na-juz',
    contactServiceSlugs: ['kwadrans-na-juz', 'pilny-kwadrans', 'na-juz'],
    title: 'Kwadrans na juz',
    shortTitle: 'Kwadrans na juz',
    eyebrow: 'Termin w 15 min',
    kind: 'booking',
    priceLabel: formatPricePln(99),
    priceAmount: 99,
    forWho: 'Dla psa albo kota, gdy potrzebujesz tego samego 15-minutowego formatu co Kwadrans, ale z priorytetem i szybszym terminem.',
    whenToChoose: 'Gdy sprawa jest pilna, chcesz rozmawiac jeszcze dzis albo po prostu zalezy Ci na terminie w 15 minut.',
    nextStep: 'Wybierasz ten sam format 15 minut, ale w sciezce priorytetowej. Po potwierdzeniu terminu przechodzisz przez ten sam proces rezerwacji.',
    cardSummary: 'Ten sam format, ale z priorytetem.',
    heroSummary: '15 minut audio bez kamery z priorytetem i mozliwie szybkim terminem.',
    descriptions: [
      'To ta sama forma co Kwadrans za 69 zl: 15 minut audio bez kamery, tylko realizowana priorytetowo.',
      'Zakres rozmowy jest taki sam jak w zwyklym Kwadransie. Roznica dotyczy tylko tempa wejscia i priorytetu obslugi.',
    ],
    bestFor: ['pilna rozmowa', 'szybki dostep', 'ten sam zakres co w Kwadransie'],
    outcomes: ['pierwszy kierunek bez czekania na zwykly termin', 'ten sam format 15 minut co w Kwadransie', 'jasna decyzja, czy potrzebny jest kolejny krok'],
    primaryCtaLabel: 'Zarezerwuj Kwadrans na juz',
    primaryHref: buildBookHref(null, 'kwadrans-na-juz'),
    detailHref: '/oferta/kwadrans-na-juz',
    secondaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    secondaryHref: buildBookHref(),
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    imageWidth: SPECIALIST_WIDE_PHOTO.width,
    imageHeight: SPECIALIST_WIDE_PHOTO.height,
    note: 'To ten sam format 15 minut co Kwadrans za 69 zl, ale z priorytetem i terminem w 15 minut.',
  },
  {
    slug: 'konsultacja-30-min',
    title: 'Dwa kwadranse z behawiorysta',
    shortTitle: 'Dwa kwadranse',
    eyebrow: 'Spokojniejszy start',
    kind: 'booking',
    priceLabel: formatPricePln(169),
    priceAmount: 169,
    forWho: 'Dla spraw, ktore potrzebuja wiecej czasu niz sam Kwadrans, ale nie wymagaja od razu pelnej konsultacji.',
    whenToChoose: 'Gdy temat jest szerszy niz jedno pytanie, chcesz spokojniej wejsc w rozmowe online albo potrzebujesz 30 minut na uporzadkowanie dwoch-trzech watkow.',
    nextStep: 'Od razu rezerwujesz 30-minutowy termin online i przechodzisz do formularza oraz platnosci.',
    cardSummary: 'Pomost miedzy startem a pelnym wejsciem.',
    heroSummary: '30 minut rozmowy online, gdy 15 minut to za malo, ale pelna konsultacja bylaby jeszcze za szerokim startem.',
    descriptions: [
      'To format dla sytuacji, w ktorych potrzebujesz chwili wiecej na kontekst i pytania, ale nadal zalezy Ci na prostym starcie.',
      'Po rozmowie masz jasniejszy kierunek, pierwsze zalecenia, krotka notatke i decyzje, czy kolejny krok to juz pelna konsultacja behawioralna.',
    ],
    bestFor: ['spokojniejszy start online', 'dwa-trzy watki naraz', 'gdy 15 min to za malo'],
    outcomes: ['wiecej czasu na uporzadkowanie sytuacji', 'wstepne zalecenia i krotka notatka po rozmowie', 'decyzja, czy potrzebna jest pelna konsultacja'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.bridge,
    primaryHref: buildBookHref(null, 'konsultacja-30-min'),
    detailHref: '/oferta/konsultacja-30-min',
    secondaryCtaLabel: FUNNEL_CTA_LABELS.primary,
    secondaryHref: buildBookHref(),
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
    imageWidth: SPECIALIST_ONLINE_PHOTO.width,
    imageHeight: SPECIALIST_ONLINE_PHOTO.height,
    note: 'To spokojniejszy etap posredni. Jesli temat od razu wymaga bardzo szerokiej pracy, lepsza bedzie pelna konsultacja behawioralna.',
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Pelna konsultacja behawioralna',
    shortTitle: 'Pelna konsultacja',
    eyebrow: 'Najszersza opcja',
    kind: 'booking',
    priceLabel: formatPricePln(470),
    priceAmount: 470,
    forWho: 'Dla spraw zlozonych, utrwalonych albo wielowatkowych, gdy od razu potrzebujesz szerokiego wejscia w temat.',
    whenToChoose: 'Gdy problem trwa dluzej, wraca albo obejmuje kilka obszarow naraz i potrzebuje pelniejszej analizy.',
    nextStep: 'Rezerwujesz 60-minutowy termin online. Po rozmowie dostajesz diagnoze, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    cardSummary: 'Diagnoza, plan i 7 dni wsparcia.',
    heroSummary: '60 minut rozmowy online dla tematow zlozonych, z diagnoza, planem i 7 dniami wsparcia.',
    descriptions: [
      'To format dla sytuacji, w ktorych szybki start bylby zbyt plytki: problem wraca, narasta albo dotyka kilku rzeczy naraz.',
      'Po rozmowie otrzymujesz diagnoze sytuacji, indywidualny plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    ],
    bestFor: ['temat zlozony', 'kilka problemow naraz', 'gdy potrzebujesz diagnozy i wsparcia wdrozenia'],
    outcomes: ['diagnoza sytuacji i priorytetow', 'plan poprawy krok po kroku', '7 dni konsultacji tekstowych z mozliwoscia wysylania pytan i filmow'],
    primaryCtaLabel: FUNNEL_CTA_LABELS.consultation,
    primaryHref: buildBookHref(null, 'konsultacja-behawioralna-online'),
    detailHref: '/konsultacja-behawioralna-online',
    secondaryCtaLabel: FUNNEL_CTA_LABELS.bridge,
    secondaryHref: buildBookHref(null, 'konsultacja-30-min'),
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
    imageWidth: SPECIALIST_ONLINE_PHOTO.width,
    imageHeight: SPECIALIST_ONLINE_PHOTO.height,
    note: PUBLIC_OFFER_FULL_CONSULTATION_VALUE + ' Po pelnej konsultacji mozesz przez 7 dni pisac przez WhatsApp, zadawac pytania, wysylac filmy i konsultowac wdrazanie planu.',
  },
  {
    slug: 'poradniki-pdf',
    contactServiceSlugs: ['poradniki-pdf', 'poradnik-pdf', 'pdf', 'poradniki', 'niezbednik'],
    title: 'Niezbednik',
    shortTitle: 'Niezbednik',
    eyebrow: 'Materialy pomocnicze',
    kind: 'resource',
    priceLabel: null,
    priceAmount: null,
    forWho: 'Dla osob, ktore chca wracac do materialow i rekomendacji miedzy rozmowami.',
    whenToChoose: 'Gdy chcesz spokojnie wrocic do tematu, przygotowac sie do rozmowy albo sprawdzic, czy z czyms da sie ruszyc samodzielnie.',
    nextStep: 'Najpierw porzadkujesz temat, a potem latwiej decydujesz, czy wystarczy material, czy lepiej wejsc w rozmowe.',
    cardSummary: 'Materialy do samodzielnej pracy jako drugi krok.',
    heroSummary: 'Materialy do samodzielnej pracy: wlasne przewodniki, ksiazki i narzedzia dobrane pod konkretne sytuacje.',
    descriptions: [
      'Znajdziesz tu materialy, do ktorych mozesz wrocic przed rozmowa, po rozmowie albo miedzy kolejnymi krokami.',
      'To miejsce z przewodnikami i narzedziami dobranymi pod konkretne sytuacje.',
    ],
    bestFor: ['powrot do zalecen', 'materialy pomocnicze', 'spokojne poglebienie tematu'],
    outcomes: ['czytelny material na pozniej', 'mniej chaosu miedzy krokami', 'latwiejsza decyzja o kolejnym ruchu'],
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
    note: 'Niezbednik pomaga przygotowac sie do rozmowy albo wrocic do zalecen po konsultacji.',
  },
]

export const CAT_SUPPORT_AREAS = [
  'sika poza kuweta',
  'konflikt miedzy kotami',
  'zyje w napieciu albo sie chowa',
  'zle znosi zmiany w domu',
  'budzi dom po nocy',
] as const

export const CAT_POPULAR_CATEGORIES = [
  {
    title: 'Kuweta i sikanie poza kuweta',
    summary: 'Najczestszy start: omijanie kuwety, napiecie przy kuwecie albo nagla zmiana nawyku.',
  },
  {
    title: 'Konflikt miedzy kotami',
    summary: 'Gonitwy, blokowanie przejsc, napiecie przy zasobach albo rozjazd relacji w domu.',
  },
  {
    title: 'Wycofanie i napiecie',
    summary: 'Wycofanie, stres po zmianie i trudnosc z powrotem do codziennego spokoju.',
  },
  {
    title: 'Wokalizacja i pobudzenie',
    summary: 'Miauczenie, nocne pobudki i rytm dnia, ktory rozsypuje spokoj w domu.',
  },
] as const

export const PDF_TOPICS: PdfTopic[] = [
  {
    id: 'pies-ciagnie-na-smyczy',
    animal: 'Pies',
    title: 'Pies ciagnie na smyczy',
    summary: 'Na pierwszy start ze spacerem i napieciem.',
  },
  {
    id: 'pies-zostaje-sam',
    animal: 'Pies',
    title: 'Pies zostaje sam',
    summary: 'Na pierwszy porzadek przy wyciu, szczekaniu i chaosie po wyjsciu.',
  },
  {
    id: 'pies-rzuca-sie-do-psow',
    animal: 'Pies',
    title: 'Pies rzuca sie do innych psow',
    summary: 'Na start przy trudnych spacerach i reaktywnosci.',
  },
  {
    id: 'szczeniak-gryzie',
    animal: 'Pies',
    title: 'Szczeniak gryzie i nie umie sie wyciszyc',
    summary: 'Na start przy gryzieniu, skakaniu i chaosie w domu.',
  },
  {
    id: 'pies-boi-sie',
    animal: 'Pies',
    title: 'Pies boi sie ludzi albo dzwiekow',
    summary: 'Na pierwszy porzadek przy leku i przeciazeniu.',
  },
  {
    id: 'kot-poza-kuweta-plan',
    animal: 'Kot',
    title: 'Kot sika poza kuweta',
    summary: 'Na pierwszy porzadek przy kuwecie i stresie.',
  },
  {
    id: 'kot-kuweta-wet-czy-behawior',
    animal: 'Kot',
    title: 'Kuweta: wet czy zachowanie',
    summary: 'Na szybkie odroznienie alarmu od stresu.',
  },
  {
    id: 'konflikt-miedzy-kotami-pdf',
    animal: 'Kot',
    title: 'Konflikt miedzy kotami',
    summary: 'Na start przy napieciu i gonitwach w domu.',
  },
  {
    id: 'kot-wycofany',
    animal: 'Kot',
    title: 'Kot lekowy albo wycofany',
    summary: 'Na prosty start przy chowaniu sie i napieciu.',
  },
  {
    id: 'kot-przy-dotyku',
    animal: 'Kot',
    title: 'Kot przy trudnym dotyku i pielegnacji',
    summary: 'Na start przy pielegnacji i trudnym kontakcie.',
  },
]

export function getOfferBySlug(slug: string) {
  return OFFERS.find((offer) => offer.slug === slug) ?? null
}

export function getOfferDetailHref(offer: Pick<Offer, 'slug' | 'detailHref'>) {
  return offer.detailHref ?? `/oferta/${offer.slug}`
}

export function getOfferDetailCtaLabel(offer: Pick<Offer, 'detailCtaLabel'>) {
  return offer.detailCtaLabel ?? 'Zobacz szczegoly'
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
