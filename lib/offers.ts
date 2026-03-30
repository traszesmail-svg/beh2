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
    cardSummary:
      'Krótka rozmowa audio dla psa lub kota, żeby szybko uporządkować sytuację i dostać pierwszy kierunek.',
    heroSummary: 'Krótka rozmowa audio na start. Jeśli trzeba więcej, od razu wskażę kolejny krok.',
    descriptions: [
      'Dobry start, gdy chcesz spokojnie opisać sytuację i dostać pierwszy plan bez długiego przygotowania.',
      'Niski próg wejścia: bez pełnej konsultacji wideo i bez wchodzenia od razu w większy proces.',
    ],
    bestFor: [
      'gdy chcesz zacząć od małego kroku i szybko sprawdzić kierunek dalszej pracy',
      'gdy audio jest dla Ciebie wygodniejsze niż pełna konsultacja wideo',
      'gdy problem trzeba uporządkować, ale jeszcze nie wiesz, czy potrzebna będzie szersza terapia',
    ],
    outcomes: [
      'wstępne rozpoznanie sytuacji',
      'pierwszy plan działania na najbliższe dni',
      'jasną decyzję, czy wystarczy praca domowa, czy potrzebna jest kolejna forma wsparcia',
    ],
    primaryCtaLabel: 'Umów konsultację 15 min',
    primaryHref: '/book',
    secondaryCtaLabel: 'Zobacz pozostałe formy pracy',
    secondaryHref: '/oferta',
    imageSrc: SPECIALIST_WIDE_PHOTO.src,
    imageAlt: SPECIALIST_WIDE_PHOTO.alt,
    note: 'Rezerwacja prowadzi przez prostą ścieżkę: temat, termin, dane, płatność, potwierdzenie.',
  },
  {
    slug: 'konsultacja-30-min',
    title: 'Konsultacja 30 min',
    shortTitle: '30 min',
    eyebrow: 'Rozszerzony start',
    kind: 'inquiry',
    priceLabel: '119 zł',
    cardSummary: 'Dłuższy start, gdy 15 minut to za mało, ale pełna konsultacja nie jest jeszcze potrzebna.',
    heroSummary: 'Więcej czasu na uporządkowanie sytuacji niż w 15 minut, bez wchodzenia od razu w pełną konsultację.',
    descriptions: [
      'To osobny format na spokojniejsze opisanie sytuacji, a nie tańsza wersja pełnej konsultacji.',
      'Sprawdza się, gdy potrzebujesz dokładniejszego startu, ale nadal chcesz zacząć od zwartej rozmowy.',
    ],
    bestFor: [
      'gdy problem jest mieszany i trudno go opisać w bardzo krótkiej formule',
      'gdy potrzebujesz rozszerzonej konsultacji wstępnej przed dalszą pracą',
      'gdy zależy Ci na spokojniejszym tempie rozmowy bez wchodzenia od razu w pełną konsultację',
    ],
    outcomes: [
      'dokładniejsze rozpoznanie sytuacji wejściowej',
      'wstępną ocenę, czy kolejnym krokiem ma być konsultacja online, terapia, wizyta domowa czy pobyt',
      'konkretny plan pierwszych działań i obserwacji',
    ],
    primaryCtaLabel: 'Napisz w sprawie konsultacji 30 min',
    primaryHref: '/kontakt?service=konsultacja-30-min',
    secondaryCtaLabel: 'Porównaj formy współpracy',
    secondaryHref: '/oferta',
    imageSrc: SPECIALIST_EXTENDED_START_PHOTO.src,
    imageAlt: SPECIALIST_EXTENDED_START_PHOTO.alt,
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Konsultacja behawioralna online',
    shortTitle: 'Online',
    eyebrow: 'Pogłębiona konsultacja',
    kind: 'inquiry',
    priceLabel: '350 zł',
    cardSummary: 'Pełniejsza konsultacja wideo dla spraw, które wymagają szerszego rozpoznania.',
    heroSummary: 'Dla spraw, w których trzeba przeanalizować historię problemu, materiały i plan dalszej pracy.',
    descriptions: [
      'To inna forma pracy niż szybki start. Służy do pogłębionego rozpoznania problemu i zaplanowania dalszej terapii.',
      'Spotkanie odbywa się w formule wideo i ma osobny terminarz dopasowany do przypadku.',
    ],
    bestFor: [
      'gdy problem trwa dłużej, wraca albo dotyczy kilku obszarów jednocześnie',
      'gdy potrzebujesz pełniejszej analizy historii zwierzęcia i środowiska domowego',
      'gdy od początku wiesz, że szybka konsultacja byłaby tylko wstępem do szerszej pracy',
    ],
    outcomes: [
      'pogłębione rozpoznanie sytuacji',
      'plan dalszej pracy domowej lub terapeutycznej',
      'jasne wskazanie, czy potrzebna jest wizyta domowa, terapia ciągła albo konsultacja weterynaryjna',
    ],
    primaryCtaLabel: 'Napisz w sprawie konsultacji online',
    primaryHref: '/kontakt?service=konsultacja-behawioralna-online',
    secondaryCtaLabel: 'Zacznij od 15 minut',
    secondaryHref: '/book',
    imageSrc: SPECIALIST_ONLINE_PHOTO.src,
    imageAlt: SPECIALIST_ONLINE_PHOTO.alt,
  },
  {
    slug: 'konsultacja-domowa-wyjazdowa',
    title: 'Konsultacja domowa / wyjazdowa',
    shortTitle: 'Domowa',
    eyebrow: 'Praca w środowisku zwierzęcia',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary: 'Wizyta wtedy, gdy miejsce i codzienne warunki są ważne dla oceny problemu.',
    heroSummary: 'Forma ustalana indywidualnie, gdy trzeba pracować w środowisku zwierzęcia.',
    descriptions: [
      'Możliwa w Olsztynie i po ustaleniu także w innych lokalizacjach. Zakres i logistyka zależą od przypadku.',
      'Sprawdza się, gdy problem najlepiej ocenić w domu, ogrodzie albo innej konkretnej przestrzeni.',
    ],
    bestFor: [
      'gdy kluczowe znaczenie ma układ mieszkania, ogrodu lub spacerów',
      'gdy zachowanie trudno rzetelnie ocenić wyłącznie online',
      'gdy potrzebna jest bardziej bezpośrednia praca z organizacją środowiska',
    ],
    outcomes: [
      'ocenę zachowania w realnym kontekście',
      'dopasowane zalecenia środowiskowe i organizacyjne',
      'ustalenie dalszej ścieżki terapii lub pracy domowej',
    ],
    primaryCtaLabel: 'Napisz w sprawie konsultacji domowej',
    primaryHref: '/kontakt?service=konsultacja-domowa-wyjazdowa',
    secondaryCtaLabel: 'Zobacz formy pracy',
    secondaryHref: '/oferta',
    imageSrc: HOME_VISIT_PHOTO.src,
    imageAlt: HOME_VISIT_PHOTO.alt,
  },
  {
    slug: 'indywidualna-terapia-behawioralna',
    title: 'Indywidualna terapia behawioralna',
    shortTitle: 'Terapia',
    eyebrow: 'Dalsza praca',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary: 'Dalsza praca, gdy jedna konsultacja nie wystarcza i potrzebny jest spokojny proces.',
    heroSummary: 'Zakres i tempo terapii ustalam po rozpoznaniu sytuacji.',
    descriptions: [
      'Pojawia się wtedy, gdy po konsultacji widać potrzebę dłuższej pracy i monitorowania postępów.',
      'Plan terapii ustalam indywidualnie, żeby tempo i forma były adekwatne do przypadku.',
    ],
    bestFor: [
      'gdy problem jest utrwalony albo złożony',
      'gdy potrzeba monitorowania postępów i korekt planu',
      'gdy szybka konsultacja była dopiero pierwszym etapem rozpoznania',
    ],
    outcomes: [
      'indywidualnie ustalony plan terapii',
      'ciągłość opieki i prowadzenia procesu',
      'większą spójność działań opiekuna, specjalisty i w razie potrzeby lekarza weterynarii',
    ],
    primaryCtaLabel: 'Napisz w sprawie terapii',
    primaryHref: '/kontakt?service=indywidualna-terapia-behawioralna',
    secondaryCtaLabel: 'Umów pierwszy krok',
    secondaryHref: '/book',
    imageSrc: THERAPY_PROCESS_PHOTO.src,
    imageAlt: THERAPY_PROCESS_PHOTO.alt,
  },
  {
    slug: 'pobyty-socjalizacyjno-terapeutyczne',
    title: 'Pobyty socjalizacyjno-terapeutyczne',
    shortTitle: 'Pobyty',
    eyebrow: 'Wyróżnik marki',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary: 'Dalsza forma pracy po kwalifikacji, gdy pobyt realnie wspiera socjalizację, regulację lub terapię.',
    heroSummary: 'Pobyt nie jest przechowaniem. To element procesu, gdy naprawdę pomaga.',
    descriptions: [
      'Kwalifikacja pozwala ocenić, czy pobyt ma sens dla konkretnego psa i wspiera cały proces.',
      'To rozwiązanie dla sytuacji, w których sama konsultacja nie wystarcza i potrzeba bardziej zorganizowanego wsparcia.',
    ],
    bestFor: [
      'gdy potrzebna jest intensywniejsza organizacja pracy lub socjalizacji',
      'gdy sytuacja wymaga dalszego prowadzenia po rozpoznaniu konsultacyjnym',
      'gdy opiekun potrzebuje bezpiecznej, jasno opisanej ścieżki dalszego wsparcia',
    ],
    outcomes: [
      'ustalenie, czy pobyt jest właściwą formą pomocy',
      'plan organizacyjny pobytu i kolejnych kroków',
      'spójną ścieżkę między konsultacją, terapią a dalszą opieką',
    ],
    primaryCtaLabel: 'Napisz w sprawie pobytu',
    primaryHref: '/kontakt?service=pobyty-socjalizacyjno-terapeutyczne',
    secondaryCtaLabel: 'Zobacz wszystkie formy pracy',
    secondaryHref: '/oferta',
    imageSrc: STAYS_PHOTO.src,
    imageAlt: STAYS_PHOTO.alt,
    note: 'Kwalifikacja do pobytu odbywa się po rozmowie i ocenie sytuacji.',
  },
  {
    slug: 'poradniki-pdf',
    contactServiceSlugs: ['poradniki-pdf', 'poradnik-pdf', 'pdf', 'poradniki'],
    title: 'Poradniki PDF',
    shortTitle: 'PDF',
    eyebrow: 'Materiały wspierające',
    kind: 'resource',
    priceLabel: null,
    cardSummary: 'Praktyczne materiały dla opiekunów psów i kotów: na start albo po konsultacji.',
    heroSummary: 'PDF pomaga uporządkować temat i zrobić pierwszy krok, ale nie zastępuje diagnozy ani terapii.',
    descriptions: [
      'To katalog materiałów dla opiekunów, którzy chcą zacząć od jednego konkretnego tematu albo dobrać pakiet.',
      'Każdy poradnik jasno pokazuje, czy to dobry pierwszy krok, uzupełnienie po konsultacji czy temat do dalszej rozmowy.',
    ],
    bestFor: [
      'gdy chcesz zacząć od uporządkowanego materiału w jednym temacie',
      'gdy po konsultacji potrzebujesz prostego materiału do dalszej pracy domowej',
      'gdy nie chcesz jeszcze rezerwować rozmowy, ale zależy Ci na merytorycznym pierwszym kroku',
    ],
    outcomes: [
      'czytelny plan pierwszych działań w konkretnym problemie',
      'materiał wspierający rozmowę lub pracę domową',
      'jasny wybór między poradnikiem, pakietem a konsultacją, jeśli temat okaże się szerszy',
    ],
    primaryCtaLabel: 'Napisz w sprawie poradnika lub pakietu',
    primaryHref: buildPdfInquiryHref(),
    detailCtaLabel: 'Zobacz listę PDF',
    detailHref: '/oferta/poradniki-pdf',
    secondaryCtaLabel: 'Zobacz listę poradników PDF',
    secondaryHref: '/oferta/poradniki-pdf',
    imageSrc: CAT_HOME_PHOTO.src,
    imageAlt: CAT_HOME_PHOTO.alt,
  },
]

export const HOME_HELP_AREAS = [
  {
    title: 'Problemy psów',
    description: 'Reaktywność, zostawanie samemu, pobudzenie, szczenięcy chaos i trudne spacery.',
  },
  {
    title: 'Problemy kotów',
    description: 'Problemy kuwetowe, stres, wycofanie, konflikty między kotami i trudny dotyk.',
  },
  {
    title: 'Szersze rozpoznanie',
    description: 'Sprawy, w których trzeba połączyć zachowanie, warunki domowe i tło weterynaryjne.',
  },
  {
    title: 'Dalsza praca',
    description: 'Od pierwszej konsultacji po terapię, pobyty i materiały do pracy domowej.',
  },
] as const

export const HOME_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Dobry próg wejścia',
    description: 'Możesz zacząć od 15 min, 30 min albo pełniejszej konsultacji online.',
  },
  {
    step: '02',
    title: 'Rozpoznaję, czego wymaga sprawa',
    description: 'Najpierw ustalamy, czy wystarczy pierwszy plan, czy potrzeba dalszej pracy.',
  },
  {
    step: '03',
    title: 'Dobieramy dalszy krok',
    description: 'Jeśli potrzeba więcej niż jednej rozmowy, przechodzimy do konsultacji pogłębionej, terapii, wizyty albo pobytu.',
  },
  {
    step: '04',
    title: 'Spokojny i odpowiedzialny proces',
    description: 'W uzasadnionych przypadkach uwzględniam też tło medyczne i współpracę z lekarzem weterynarii.',
  },
] as const

export const TRUST_SIGNAL_ITEMS = [
  {
    title: 'COAPE i kwalifikacje',
    description: 'COAPE pokazuję jako sygnał jakości pracy, nie cały przekaz marki.',
  },
  {
    title: 'Współpraca z lekarzem weterynarii',
    description: 'Jeśli przypadek tego wymaga, terapia uwzględnia tło medyczne i współpracę z lekarzem weterynarii.',
  },
  {
    title: 'Psychofarmakologia tylko jako wsparcie procesu',
    description: 'W uzasadnionych przypadkach farmakoterapia może wspierać terapię, ale jej nie zastępuje.',
  },
  {
    title: 'Jasne zasady i spokojny ton',
    description: 'Bez obiecywania cudów i bez agresywnego marketingu. Ma być jasno, czego się spodziewać.',
  },
] as const

export const CAT_SUPPORT_AREAS = [
  'problemy kuwetowe i załatwianie się poza kuwetą',
  'napięcie, stres i wycofanie',
  'konflikty między kotami w domu',
  'trudności w codziennym funkcjonowaniu domowym',
  'zachowania przy dotyku, pielęgnacji i badaniu',
] as const

export const CAT_CONTENT_ROADMAP = [
  {
    slug: 'kot-sika-poza-kuweta',
    title: 'Kot sika poza kuwetą',
  },
  {
    slug: 'kot-poza-kuweta-behawior-czy-wet',
    title: 'Poza kuwetą: kiedy problem jest behawioralny, a kiedy weterynaryjny',
  },
  {
    slug: 'konflikt-miedzy-kotami',
    title: 'Konflikt między kotami w domu',
  },
  {
    slug: 'kot-lekowy-wycofany',
    title: 'Kot lękowy lub wycofany',
  },
  {
    slug: 'kot-agresywny-przy-dotyku',
    title: 'Kot agresywny przy dotyku lub pielęgnacji',
  },
] as const

export const PDF_TOPICS: PdfTopic[] = [
  {
    id: 'pies-ciagnie-na-smyczy',
    animal: 'Pies',
    title: 'Pies ciągnie na smyczy - 5 błędów, które utrwalają problem',
    summary: 'Materiał o najczęstszych błędach opiekuna i o tym, od czego zacząć spokojniejszą pracę spacerową.',
  },
  {
    id: 'pies-zostaje-sam',
    animal: 'Pies',
    title: 'Pies zostaje sam i szczeka lub wyje - od czego zacząć',
    summary: 'Pierwszy plan działań dla opiekuna, który chce ograniczyć chaos i lepiej rozpoznać napięcie po wyjściu.',
  },
  {
    id: 'pies-rzuca-sie-do-psow',
    animal: 'Pies',
    title: 'Pies rzuca się do innych psów na spacerze - pierwsze kroki',
    summary: 'Prosty materiał o zarządzaniu spacerem, bodźcami i pierwszym porządku działań.',
  },
  {
    id: 'szczeniak-gryzie',
    animal: 'Pies',
    title: 'Szczeniak gryzie i nie potrafi się wyciszyć',
    summary: 'Checklist dla opiekuna młodego psa, który potrzebuje uporządkowania rytmu dnia, granic i pracy nad pobudzeniem.',
  },
  {
    id: 'pies-boi-sie',
    animal: 'Pies',
    title: 'Pies boi się ludzi, gości lub dźwięków - jak pracować z lękiem',
    summary: 'Wprowadzenie do bezpiecznej pracy z lękiem bez przeciążania psa i opiekuna.',
  },
  {
    id: 'kot-poza-kuweta-plan',
    animal: 'Kot',
    title: 'Kot sika poza kuwetą - pierwszy plan działania',
    summary: 'Pierwszy porządek diagnostyczny i środowiskowy dla opiekuna, który chce zacząć bez przypadkowych porad.',
  },
  {
    id: 'kot-kuweta-wet-czy-behawior',
    animal: 'Kot',
    title: 'Kot załatwia się poza kuwetą - kiedy problem jest behawioralny, a kiedy weterynaryjny',
    summary: 'Materiał porządkujący sygnały alarmowe i decyzje o dalszej konsultacji.',
  },
  {
    id: 'konflikt-miedzy-kotami-pdf',
    animal: 'Kot',
    title: 'Konflikt między kotami w domu - jak zacząć pracę',
    summary: 'Przewodnik po pierwszych zmianach środowiskowych i organizacyjnych w domu wielokotowym.',
  },
  {
    id: 'kot-wycofany',
    animal: 'Kot',
    title: 'Kot lękowy lub wycofany - jak budować poczucie bezpieczeństwa',
    summary: 'Podstawy pracy z kotem, który unika kontaktu, kryje się lub funkcjonuje w stałym napięciu.',
  },
  {
    id: 'kot-przy-dotyku',
    animal: 'Kot',
    title: 'Kot agresywny przy dotyku lub pielęgnacji - co robić',
    summary: 'Materiał o bezpiecznym kontakcie, sygnałach ostrzegawczych i pierwszych zmianach w codziennej obsłudze kota.',
  },
] as const

export const HOME_FAQ = [
  {
    q: 'Czy nadal mogę zacząć od krótkiej konsultacji 15 min?',
    a: 'Tak. Szybka konsultacja 15 min nadal jest pierwszym krokiem o niskim progu wejścia. To część szerszego systemu pracy, nie jedyna oś strony.',
  },
  {
    q: 'Czy pracujesz także z kotami?',
    a: 'Tak. Koty są pełnoprawnym obszarem pracy: od problemów kuwetowych i stresu, przez konflikty między kotami, po trudne zachowania przy dotyku lub pielęgnacji.',
  },
  {
    q: 'Skąd mam wiedzieć, którą formę współpracy wybrać?',
    a: 'Najbezpieczniej zacząć od progu adekwatnego do sytuacji i gotowości. Jeśli po pierwszym etapie okaże się, że temat wymaga więcej, wskażę kolejny krok zamiast zostawiać Cię z przypadkową poradą.',
  },
  {
    q: 'Czy każda sprawa kończy się terapią albo pobytem?',
    a: 'Nie. Część spraw wymaga tylko dobrego rozpoznania i pierwszego planu. Dalsza terapia, konsultacja domowa albo pobyt pojawiają się dopiero wtedy, gdy mają realny sens.',
  },
  {
    q: 'Jak wygląda kwestia farmakoterapii?',
    a: 'Jeśli sytuacja tego wymaga, pracuję we współpracy z lekarzem weterynarii. Farmakoterapia może wspierać proces, ale nie zastępuje terapii behawioralnej.',
  },
  {
    q: 'Czy ceny są jawne?',
    a: 'Publicznie pokazuję ceny dla ścieżek startowych i konsultacji online: 15 min, 30 min oraz konsultacji behawioralnej online. Wizyty domowe, terapia i pobyty ustalam po rozpoznaniu sytuacji.',
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
