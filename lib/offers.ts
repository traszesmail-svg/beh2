import { buildPdfInquiryHref } from './pdf-guides'
import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'
import {
  CAT_HOME_PHOTO,
  HOME_VISIT_PHOTO,
  SPECIALIST_EXTENDED_START_PHOTO,
  SPECIALIST_ONLINE_PHOTO,
  SPECIALIST_WIDE_PHOTO,
  STAYS_PHOTO,
  THERAPY_PROCESS_PHOTO,
} from './site'

export type OfferKind = 'booking' | 'inquiry' | 'resource'

export type Offer = {
  slug: string
  contactServiceSlugs?: string[]
  title: string
  shortTitle: string
  eyebrow: string
  kind: OfferKind
  priceLabel: string | null
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
  note?: string
}

export type PdfTopic = {
  id: string
  animal: 'Pies' | 'Kot'
  title: string
  summary: string
}

const quickStartPriceLabel = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}`

export const OFFERS: Offer[] = [
  {
    slug: 'szybka-konsultacja-15-min',
    title: 'Szybka konsultacja 15 min',
    shortTitle: '15 min',
    eyebrow: 'Pierwszy krok',
    kind: 'booking',
    priceLabel: quickStartPriceLabel,
    forWho: 'Dla psa lub kota.',
    whenToChoose: 'Gdy chcesz szybko wejść w termin.',
    nextStep: 'Rezerwujesz termin. Po rozmowie wiesz, czy to wystarczy.',
    cardSummary: 'Najprostszy start.',
    heroSummary: 'Krótka rozmowa na start.',
    descriptions: [
      'Wybierz to, jeśli chcesz szybko opisać temat.',
      'Po rozmowie wiesz, co zrobić od razu albo czy trzeba więcej czasu.',
    ],
    bestFor: ['krótki temat na start', 'szybka decyzja', 'pierwsza rozmowa'],
    outcomes: ['co zrobić dziś', 'co obserwować', 'czy 15 min wystarczy'],
    primaryCtaLabel: 'Umów konsultację 15 min',
    primaryHref: '/book',
    secondaryCtaLabel: 'Napisz wiadomość',
    secondaryHref: '/kontakt',
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    note: 'Jeśli trzeba więcej czasu, powiem co wybrać dalej.',
  },
  {
    slug: 'konsultacja-30-min',
    title: 'Konsultacja 30 min',
    shortTitle: '30 min',
    eyebrow: 'Więcej czasu',
    kind: 'inquiry',
    priceLabel: '119 zł',
    forWho: 'Dla psa lub kota z szerszym tematem.',
    whenToChoose: 'Gdy temat nie mieści się w 15 min.',
    nextStep: 'Najpierw piszesz. Potem ustalamy rozmowę.',
    cardSummary: 'Więcej czasu na start.',
    heroSummary: 'Dłuższa rozmowa, gdy temat nie mieści się w 15 min.',
    descriptions: [
      'Wybierz to, jeśli chcesz spokojniej opisać temat.',
      'Po rozmowie łatwiej zdecydować, co wybrać dalej.',
    ],
    bestFor: ['temat mieszany', 'więcej czasu na start', 'gdy 15 min to za mało'],
    outcomes: ['spokojniejsze omówienie', 'jasny start', 'co zrobić najpierw'],
    primaryCtaLabel: 'Napisz w sprawie konsultacji 30 min',
    primaryHref: '/kontakt?service=konsultacja-30-min',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: SPECIALIST_EXTENDED_START_PHOTO.src,
    imageAlt: SPECIALIST_EXTENDED_START_PHOTO.alt,
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Konsultacja behawioralna online',
    shortTitle: 'Online',
    eyebrow: 'Więcej czasu',
    kind: 'inquiry',
    priceLabel: '350 zł',
    forWho: 'Dla spraw złożonych.',
    whenToChoose: 'Gdy problem trwa długo albo dotyczy kilku rzeczy.',
    nextStep: 'Najpierw piszesz. Potem ustalamy rozmowę online.',
    cardSummary: 'Na trudniejszy temat.',
    heroSummary: 'Dłuższa konsultacja online, gdy sprawa jest szersza.',
    descriptions: [
      'Wybierz to, jeśli problem wraca, trwa długo albo dotyczy kilku rzeczy.',
      'Po rozmowie wiesz, co zrobić najpierw i czy potrzebny jest kolejny krok.',
    ],
    bestFor: ['temat złożony', 'kilka problemów naraz', 'gdy 15 i 30 min to za mało'],
    outcomes: ['pełniejszy obraz sytuacji', 'co zrobić najpierw', 'czy potrzebna jest wizyta albo kolejna rozmowa'],
    primaryCtaLabel: 'Napisz w sprawie konsultacji online',
    primaryHref: '/kontakt?service=konsultacja-behawioralna-online',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
  },
  {
    slug: 'konsultacja-domowa-wyjazdowa',
    title: 'Konsultacja domowa / wyjazdowa',
    shortTitle: 'Domowa',
    eyebrow: 'Na miejscu',
    kind: 'inquiry',
    priceLabel: null,
    forWho: 'Dla sytuacji, które najlepiej widać na miejscu.',
    whenToChoose: 'Gdy problem najlepiej widać na miejscu.',
    nextStep: 'Najpierw piszesz, potem ustalamy wizytę.',
    cardSummary: 'Gdy trzeba zobaczyć to na miejscu.',
    heroSummary: 'Wizyta na miejscu, gdy sam opis to za mało.',
    descriptions: [
      'Wybierz to, jeśli miejsce ma duże znaczenie.',
      'Najpierw napisz, żebym mógł ocenić, czy to dobry wybór.',
    ],
    bestFor: ['problem w konkretnym miejscu', 'dom, ogród albo spacer', 'gdy sam opis nie wystarcza'],
    outcomes: ['widzę sytuację na miejscu', 'proste zmiany do wdrożenia', 'wiadomo, co robić dalej'],
    primaryCtaLabel: 'Napisz w sprawie konsultacji domowej',
    primaryHref: '/kontakt?service=konsultacja-domowa-wyjazdowa',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: HOME_VISIT_PHOTO.src,
    imageAlt: HOME_VISIT_PHOTO.alt,
  },
  {
    slug: 'indywidualna-terapia-behawioralna',
    title: 'Indywidualna terapia behawioralna',
    shortTitle: 'Terapia',
    eyebrow: 'Gdy trzeba więcej',
    kind: 'inquiry',
    priceLabel: null,
    forWho: 'Dla tematów, które nie kończą się na jednej rozmowie.',
    whenToChoose: 'Gdy po starcie widać, że trzeba wracać do tematu.',
    nextStep: 'Najpierw piszesz albo zaczynasz od rozmowy.',
    cardSummary: 'Na temat, który nie mieści się w jednym spotkaniu.',
    heroSummary: 'To opcja na temat, do którego trzeba wracać.',
    descriptions: [
      'Wybierz to, jeśli problem jest utrwalony albo wraca.',
      'Najpierw sprawdzamy, czy taki start ma sens.',
    ],
    bestFor: ['problem wraca', 'trzeba wracać do tematu', 'jedna rozmowa to za mało'],
    outcomes: ['jasny kierunek', 'mniej chaosu', 'kolejne kroki dopasowane do sytuacji'],
    primaryCtaLabel: 'Napisz w sprawie terapii',
    primaryHref: '/kontakt?service=indywidualna-terapia-behawioralna',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: THERAPY_PROCESS_PHOTO.src,
    imageAlt: THERAPY_PROCESS_PHOTO.alt,
  },
  {
    slug: 'pobyty-socjalizacyjno-terapeutyczne',
    title: 'Pobyty socjalizacyjno-terapeutyczne',
    shortTitle: 'Pobyty',
    eyebrow: 'Po rozmowie',
    kind: 'inquiry',
    priceLabel: null,
    forWho: 'Dla psa, któremu pobyt może realnie pomóc.',
    whenToChoose: 'Gdy po rozmowie widać, że pobyt może pomóc.',
    nextStep: 'Najpierw piszesz. Potem sprawdzamy, czy pobyt ma sens.',
    cardSummary: 'Nie jako hotel. Tylko wtedy, gdy to pomaga.',
    heroSummary: 'Pobyt ma sens tylko wtedy, gdy realnie pomaga psu.',
    descriptions: [
      'Wybierz to, jeśli po rozmowie widać, że pobyt coś zmieni.',
      'Najpierw sprawdzamy, czy to dobry wybór dla psa.',
    ],
    bestFor: ['pies potrzebuje spokojniejszego rytmu', 'po rozmowie widać sens pobytu', 'to nie jest hotel'],
    outcomes: ['czy pobyt ma sens', 'jasne zasady pobytu', 'co po odbiorze psa'],
    primaryCtaLabel: 'Napisz w sprawie pobytu',
    primaryHref: '/kontakt?service=pobyty-socjalizacyjno-terapeutyczne',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: STAYS_PHOTO.src,
    imageAlt: STAYS_PHOTO.alt,
    note: 'Najpierw napisz. Jeśli pobyt nie ma sensu, powiem lepszy start.',
  },
  {
    slug: 'poradniki-pdf',
    contactServiceSlugs: ['poradniki-pdf', 'poradnik-pdf', 'pdf', 'poradniki'],
    title: 'Poradniki PDF',
    shortTitle: 'PDF',
    eyebrow: 'Na jeden temat',
    kind: 'resource',
    priceLabel: null,
    forWho: 'Dla jednego konkretnego tematu.',
    whenToChoose: 'Gdy chcesz zacząć od materiału.',
    nextStep: 'Wybierasz poradnik albo pakiet. Jeśli to za mało, piszesz.',
    cardSummary: 'Na jeden temat.',
    heroSummary: 'Poradnik albo pakiet na start.',
    descriptions: [
      'Wybierz to, jeśli chcesz ogarnąć jeden temat bez rezerwacji rozmowy.',
      'Jeśli to za mało, łatwo przejdziesz do wiadomości albo konsultacji.',
    ],
    bestFor: ['jeden temat', 'materiał do domu', 'gdy nie chcesz jeszcze rezerwować rozmowy'],
    outcomes: ['prosty materiał', 'mniej chaosu na starcie', 'czy wystarczy poradnik'],
    primaryCtaLabel: 'Napisz w sprawie poradnika lub pakietu',
    primaryHref: buildPdfInquiryHref(),
    detailCtaLabel: 'Zobacz PDF',
    detailHref: '/oferta/poradniki-pdf',
    secondaryCtaLabel: 'Zobacz PDF',
    secondaryHref: '/oferta/poradniki-pdf',
    imageSrc: CAT_HOME_PHOTO.src,
    imageAlt: CAT_HOME_PHOTO.alt,
  },
]

export const CAT_SUPPORT_AREAS = [
  'sika poza kuwetą',
  'gryzie przy dotyku albo pielęgnacji',
  'atakuje drugiego kota',
  'żyje w napięciu albo się chowa',
  'budzi dom po nocy',
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
    title: 'Kot agresywny przy dotyku',
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
  return offer.detailCtaLabel ?? 'Czy to dla Ciebie?'
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
