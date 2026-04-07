import { buildBookHref } from './booking-routing'
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
    priceAmount: DEFAULT_PRICE_PLN,
    forWho: 'Dla psa lub kota, gdy potrzebujesz szybkiego startu.',
    whenToChoose: 'Gdy chcesz szybko wejść w termin i dostać pierwszy konkretny krok jeszcze tego samego dnia.',
    nextStep: 'Wybierasz temat, termin i płatność. Potem wiesz, czy ten format wystarczy, czy trzeba wejść szerzej.',
    cardSummary: 'Najprostszy pierwszy krok.',
    heroSummary: 'Krótka rozmowa, gdy trzeba szybko uporządkować temat.',
    descriptions: [
      'To dobry wybór, gdy temat jest świeży, wąski albo chcesz najpierw sprawdzić najlepszy kierunek bez długiego wejścia.',
      'Po rozmowie masz pierwszy plan: co zrobić od razu, co obserwować i czy ten format wystarczy.',
    ],
    bestFor: ['krótki temat na start', 'szybka decyzja', 'pierwsza rozmowa'],
    outcomes: ['co zrobić dziś', 'co obserwować przez najbliższe dni', 'czy zostać przy 15 min czy wejść głębiej'],
    primaryCtaLabel: 'Umów 15 min',
    primaryHref: buildBookHref(),
    secondaryCtaLabel: 'Napisz wiadomość',
    secondaryHref: '/kontakt',
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    note: 'Jeśli temat okaże się szerszy, od razu wskażę, czy lepsze będzie 30 min, pełna konsultacja online czy inny dalszy krok.',
  },
  {
    slug: 'konsultacja-30-min',
    title: 'Konsultacja 30 min',
    shortTitle: '30 min',
    eyebrow: 'Więcej czasu',
    kind: 'booking',
    priceLabel: formatPricePln(119),
    priceAmount: 119,
    forWho: 'Dla psa lub kota z szerszym, ale nadal startowym tematem.',
    whenToChoose: 'Gdy wiesz, że 15 min będzie za krótkie, ale nie potrzebujesz jeszcze pełnej konsultacji online.',
    nextStep: 'Od razu rezerwujesz termin 30 min i przechodzisz przez ten sam prosty proces co w 15 min.',
    cardSummary: 'Więcej czasu na spokojny start.',
    heroSummary: 'Dłuższa rozmowa, gdy temat wymaga spokojniejszego omówienia.',
    descriptions: [
      'To pomost między 15 min a pełną konsultacją online, gdy chcesz omówić więcej bez wchodzenia od razu w najdłuższy format.',
      'Po rozmowie masz jaśniejszy obraz sytuacji, pierwszy plan i decyzję, czy ten poziom był wystarczający.',
    ],
    bestFor: ['temat mieszany', 'więcej czasu na start', 'gdy 15 min to za mało'],
    outcomes: ['spokojniejsze omówienie bez pośpiechu', 'jasny pierwszy plan pracy', 'czy potrzeba pełnej konsultacji online albo terapii'],
    primaryCtaLabel: 'Umów 30 min',
    primaryHref: buildBookHref(null, 'konsultacja-30-min'),
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: buildBookHref(),
    imageSrc: SPECIALIST_EXTENDED_START_PHOTO.src,
    imageAlt: SPECIALIST_EXTENDED_START_PHOTO.alt,
    note: 'To dobry wybór, gdy chcesz spokojniej wejść w temat, ale nie potrzebujesz jeszcze najdłuższego formatu.',
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Konsultacja behawioralna online',
    shortTitle: 'Online',
    eyebrow: 'Więcej czasu',
    kind: 'booking',
    priceLabel: formatPricePln(350),
    priceAmount: 350,
    forWho: 'Dla spraw złożonych, utrwalonych albo wielowątkowych.',
    whenToChoose: 'Gdy problem trwa długo, dotyczy kilku obszarów albo chcesz od razu wejść w pełniejszą analizę.',
    nextStep: 'Od razu rezerwujesz dłuższy termin online zamiast zaczynać od samego formularza kontaktowego.',
    cardSummary: 'Pełniejszy start dla trudniejszej sprawy.',
    heroSummary: 'Pełna konsultacja online, gdy temat wymaga szerszej analizy już na wejściu.',
    descriptions: [
      'To format dla sytuacji, w których szybki start byłby zbyt płytki: problem wraca, narasta albo dotyka kilku rzeczy naraz.',
      'Po konsultacji masz pełniejszy obraz sytuacji, plan pierwszych zmian i decyzję o dalszej pracy, jeśli będzie potrzebna.',
    ],
    bestFor: ['temat złożony', 'kilka problemów naraz', 'gdy 15 i 30 min to za mało'],
    outcomes: ['pełniejszy obraz sytuacji i priorytetów', 'co zrobić najpierw bez zgadywania', 'czy dalej potrzebna jest wizyta, terapia albo kolejna konsultacja'],
    primaryCtaLabel: 'Umów konsultację online',
    primaryHref: buildBookHref(null, 'konsultacja-behawioralna-online'),
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: buildBookHref(),
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
    note: 'To najszerszy start online. Jeśli temat okazałby się prostszy, nie dopłacasz tu za chaos, tylko za spokojniejsze wejście.',
  },
  {
    slug: 'konsultacja-domowa-wyjazdowa',
    title: 'Konsultacja domowa / wyjazdowa',
    shortTitle: 'Domowa',
    eyebrow: 'Na miejscu',
    kind: 'inquiry',
    priceLabel: null,
    priceAmount: null,
    forWho: 'Dla sytuacji, które najlepiej widać na miejscu.',
    whenToChoose: 'Gdy problem najlepiej widać w domu, ogrodzie albo na spacerze.',
    nextStep: 'Najpierw piszesz, potem ustalamy, czy wizyta na miejscu ma sens i jak ją przygotować.',
    cardSummary: 'Gdy trzeba zobaczyć sytuację na miejscu.',
    heroSummary: 'Wizyta na miejscu, gdy sam opis to za mało.',
    descriptions: [
      'Wybierz to, jeśli miejsce ma duże znaczenie dla problemu albo oceny zachowania.',
      'Najpierw napisz, żebym mógł ocenić, czy to dobry wybór i czy nie lepiej zacząć od innego kroku.',
    ],
    bestFor: ['problem w konkretnym miejscu', 'dom, ogród albo spacer', 'gdy sam opis nie wystarcza'],
    outcomes: ['widzimy sytuację na miejscu', 'proste zmiany do wdrożenia', 'wiadomo, co robić dalej'],
    primaryCtaLabel: 'Napisz wiadomość',
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
    priceAmount: null,
    forWho: 'Dla tematów, które nie kończą się na jednej rozmowie.',
    whenToChoose: 'Gdy po starcie widać, że trzeba wracać do tematu i prowadzić zmiany dalej.',
    nextStep: 'Najpierw piszesz albo zaczynasz od rozmowy. Potem ustalamy najrozsądniejszy dalszy krok.',
    cardSummary: 'Na temat, który nie mieści się w jednym spotkaniu.',
    heroSummary: 'Opcja na temat, do którego trzeba wracać i prowadzić go dłużej.',
    descriptions: [
      'Wybierz to, jeśli problem jest utrwalony albo wraca mimo prób działania na własną rękę.',
      'Najpierw sprawdzamy, czy taki start ma sens i co będzie najbardziej realistyczne dalej.',
    ],
    bestFor: ['problem wraca', 'trzeba wracać do tematu', 'jedna rozmowa to za mało'],
    outcomes: ['jasny kierunek', 'mniej chaosu', 'kolejne kroki dopasowane do sytuacji'],
    primaryCtaLabel: 'Napisz wiadomość',
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
    priceAmount: null,
    forWho: 'Dla psa, któremu pobyt może realnie pomóc.',
    whenToChoose: 'Gdy po rozmowie albo opisie sytuacji widać, że pobyt może pomóc psu, a nie tylko zastąpić opiekę.',
    nextStep: 'Najpierw sprawdzamy, czy pobyt ma sens. Dopiero potem ustalamy, jak wygląda i co ma dać po powrocie.',
    cardSummary: 'Nie jako hotel. Tylko wtedy, gdy to pomaga.',
    heroSummary: 'Pobyt terapeutyczny ma sens tylko wtedy, gdy realnie pomaga psu i daje dalszy plan po zakończeniu.',
    descriptions: [
      'To nie jest hotel i nie działa jako skrót dla każdego problemu. Najpierw sprawdzamy, czy taki kierunek ma sens dla konkretnego psa.',
      'Jeśli ten kierunek ma sens, ustalamy przebieg pobytu, cel pracy i to, co opiekun dostaje po odbiorze psa.',
    ],
    bestFor: ['pies potrzebuje spokojniejszego rytmu', 'po rozmowie widać sens pobytu', 'to nie jest hotel'],
    outcomes: ['czy pobyt ma sens dla tego psa', 'jasne zasady przebiegu', 'co opiekun dostaje po pobycie i jak wdrożyć dalszą pracę'],
    primaryCtaLabel: 'Napisz wiadomość',
    primaryHref: '/kontakt?service=pobyty-socjalizacyjno-terapeutyczne',
    secondaryCtaLabel: 'Umów 15 min',
    secondaryHref: '/book',
    imageSrc: STAYS_PHOTO.src,
    imageAlt: STAYS_PHOTO.alt,
    note: 'Jeśli pobyt nie ma sensu, nie będę go wciskał. Powiem wprost, czy lepszy będzie inny start.',
  },
  {
    slug: 'poradniki-pdf',
    contactServiceSlugs: ['poradniki-pdf', 'poradnik-pdf', 'pdf', 'poradniki'],
    title: 'Poradniki PDF',
    shortTitle: 'PDF',
    eyebrow: 'Na jeden temat',
    kind: 'resource',
    priceLabel: null,
    priceAmount: null,
    forWho: 'Dla jednego konkretnego tematu.',
    whenToChoose: 'Gdy chcesz zacząć od materiału bez rezerwacji rozmowy.',
    nextStep: 'Wybierasz poradnik albo pakiet. Jeśli to za mało, łatwo przechodzisz do wiadomości albo konsultacji.',
    cardSummary: 'Na jeden temat.',
    heroSummary: 'Poradnik albo pakiet na start.',
    descriptions: [
      'Wybierz to, jeśli chcesz ogarnąć jeden temat bez rezerwacji rozmowy.',
      'Jeśli to za mało, łatwo przejdziesz do wiadomości albo konsultacji.',
    ],
    bestFor: ['jeden temat', 'materiał do domu', 'gdy nie chcesz jeszcze rezerwować rozmowy'],
    outcomes: ['prosty materiał', 'mniej chaosu na starcie', 'czy wystarczy poradnik'],
    primaryCtaLabel: 'Napisz wiadomość',
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
  'sika poza kuwetę',
  'gryzie przy dotyku albo pielęgnacji',
  'konflikt między kotami',
  'żyje w napięciu albo się chowa',
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
    title: 'Lęk, napięcie i chowanie się',
    summary: 'Wycofanie, stres po zmianie, napięcie przy gościach albo trudność z powrotem do spokoju.',
  },
  {
    title: 'Trudny dotyk i pielęgnacja',
    summary: 'Gryzienie przy głaskaniu, noszeniu, obcinaniu pazurów albo przy domowych zabiegach.',
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
