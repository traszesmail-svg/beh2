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
    whenToChoose: 'Gdy chcesz szybko wejść w termin i dostać pierwszy konkretny ruch jeszcze tego samego dnia.',
    nextStep: 'Wybierasz temat, termin i płatność. Po rozmowie wiesz, czy wystarczy szybki start, czy trzeba wejść szerzej.',
    cardSummary: 'Najprostszy i najszybszy start.',
    heroSummary: 'Krótka rozmowa na start, gdy trzeba szybko uporządkować temat.',
    descriptions: [
      'To dobry wybór, gdy temat jest świeży, wąski albo chcesz najpierw sprawdzić najlepszy kierunek bez długiego wejścia.',
      'Po rozmowie dostajesz pierwszy plan: co zrobić od razu, co obserwować i czy ten format wystarczy.',
    ],
    bestFor: ['krótki temat na start', 'szybka decyzja', 'pierwsza rozmowa'],
    outcomes: ['co zrobić dziś', 'co obserwować przez najbliższe dni', 'czy zostać przy 15 min czy wejść głębiej'],
    primaryCtaLabel: 'Umów 15 min',
    primaryHref: buildBookHref(),
    secondaryCtaLabel: 'Napisz',
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
    forWho: 'Dla psa lub kota z szerszym, ale nadal startowym tematem.',
    whenToChoose: 'Gdy już wiesz, że 15 min będzie za krótkie, ale nie potrzebujesz jeszcze pełnej konsultacji online.',
    nextStep: 'Od razu rezerwujesz termin 30 min i przechodzisz przez ten sam prosty checkout co w 15 min.',
    cardSummary: 'Więcej czasu na spokojny start.',
    heroSummary: 'Dłuższa rozmowa na start, gdy temat wymaga spokojniejszego omówienia.',
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
    forWho: 'Dla spraw zlozonych, utrwalonych albo wielowatkowych.',
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
    note: 'To najszerszy start online. Jeśli temat okazałby się prostszy, nie dopłacisz tu za chaos tylko za spokojniejsze wejście.',
  },
  {
    slug: 'konsultacja-domowa-wyjazdowa',
    title: 'Konsultacja domowa / wyjazdowa',
    shortTitle: 'Domowa',
    eyebrow: 'Na miejscu',
    kind: 'inquiry',
    priceLabel: null,
    forWho: 'Dla sytuacji, ktore najlepiej widac na miejscu.',
    whenToChoose: 'Gdy problem najlepiej widac w domu, ogrodzie albo na spacerze.',
    nextStep: 'Najpierw piszesz, potem ustalamy czy wizyta na miejscu ma sens i jak ja przygotowac.',
    cardSummary: 'Gdy trzeba zobaczyc sytuacje na miejscu.',
    heroSummary: 'Wizyta na miejscu, gdy sam opis to za malo.',
    descriptions: [
      'Wybierz to, jesli miejsce ma duze znaczenie dla problemu albo oceny zachowania.',
      'Najpierw napisz, zebym mogl ocenic, czy to dobry wybor i czy nie lepiej zaczac od innego kroku.',
    ],
    bestFor: ['problem w konkretnym miejscu', 'dom, ogrod albo spacer', 'gdy sam opis nie wystarcza'],
    outcomes: ['widze sytuacje na miejscu', 'proste zmiany do wdrozenia', 'wiadomo, co robic dalej'],
    primaryCtaLabel: 'Napisz',
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
    forWho: 'Dla tematow, ktore nie koncza sie na jednej rozmowie.',
    whenToChoose: 'Gdy po starcie widac, ze trzeba wracac do tematu i prowadzic zmiany dalej.',
    nextStep: 'Najpierw piszesz albo zaczynasz od rozmowy. Potem ustalamy najrozsądniejszy dalszy krok.',
    cardSummary: 'Na temat, ktory nie miesci sie w jednym spotkaniu.',
    heroSummary: 'To opcja na temat, do którego trzeba wracać i prowadzić go dłużej.',
    descriptions: [
      'Wybierz to, jeśli problem jest utrwalony albo wraca mimo prób działania na własną rękę.',
      'Najpierw sprawdzamy, czy taki start ma sens i co będzie najbardziej realistyczne dalej.',
    ],
    bestFor: ['problem wraca', 'trzeba wracać do tematu', 'jedna rozmowa to za mało'],
    outcomes: ['jasny kierunek', 'mniej chaosu', 'kolejne kroki dopasowane do sytuacji'],
    primaryCtaLabel: 'Napisz',
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
    forWho: 'Dla psa, ktoremu pobyt moze realnie pomoc.',
    whenToChoose: 'Gdy po rozmowie albo opisie sytuacji widac, ze pobyt moze realnie pomoc psu, a nie tylko zastapic opieke.',
    nextStep: 'Najpierw sprawdzamy, czy pobyt ma sens. Dopiero potem ustalamy, jak wyglada i co ma dac po powrocie.',
    cardSummary: 'Nie jako hotel. Tylko wtedy, gdy to pomaga.',
    heroSummary: 'Pobyt terapeutyczny ma sens tylko wtedy, gdy realnie pomaga psu i daje dalszy plan po zakonczeniu.',
    descriptions: [
      'To nie jest hotel i nie dziala jako skrot dla kazdego problemu. Najpierw sprawdzamy, czy taki kierunek ma sens dla konkretnego psa.',
      'Jesli ten kierunek ma sens, ustalamy przebieg pobytu, cel pracy i to, co opiekun dostaje po odbiorze psa.',
    ],
    bestFor: ['pies potrzebuje spokojniejszego rytmu', 'po rozmowie widac sens pobytu', 'to nie jest hotel'],
    outcomes: ['czy pobyt ma sens dla tego psa', 'jasne zasady przebiegu', 'co opiekun dostaje po pobycie i jak wdrozyc dalsza prace'],
    primaryCtaLabel: 'Napisz',
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
    primaryCtaLabel: 'Napisz',
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
  'sika poza kuweta',
  'gryzie przy dotyku albo pielegnacji',
  'konflikt miedzy kotami',
  'zyje w napieciu albo sie chowa',
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
    title: 'Lek, napiecie i chowanie sie',
    summary: 'Wycofanie, stres po zmianie, napiecie przy gosciach albo trudnosc z powrotem do spokoju.',
  },
  {
    title: 'Trudny dotyk i pielegnacja',
    summary: 'Gryzienie przy glaskaniu, noszeniu, obcinaniu pazurow albo przy domowych zabiegach.',
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
    title: 'Kot agresywny przy dotyku',
    summary: 'Na start przy pielegnacji i trudnym kontakcie.',
  },
] as const

export function getOfferBySlug(slug: string) {
  return OFFERS.find((offer) => offer.slug === slug) ?? null
}

export function getOfferDetailHref(offer: Pick<Offer, 'slug' | 'detailHref'>) {
  return offer.detailHref ?? `/oferta/${offer.slug}`
}

export function getOfferDetailCtaLabel(offer: Pick<Offer, 'detailCtaLabel'>) {
  return offer.detailCtaLabel ?? 'Szczegóły'
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
