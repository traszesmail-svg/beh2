import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'
import type { ProblemOption } from './types'

export type FunnelSpecies = 'pies' | 'kot'
export type PublicBookingServiceType =
  | 'szybka-konsultacja-15-min'
  | 'kwadrans-na-juz'
  | 'konsultacja-30-min'
  | 'konsultacja-behawioralna-online'
export type LegacyBookingServiceType = 'konsultacja-30-min'
export type AnyBookingServiceType = PublicBookingServiceType | LegacyBookingServiceType

export const FUNNEL_CTA_LABELS = {
  primary: 'Zarezerwuj Kwadrans z behawiorysta',
  bridge: 'Zarezerwuj Dwa kwadranse z behawiorysta',
  secondary: 'Przejdz do Niezbednika',
  consultation: 'Zarezerwuj pelna konsultacje behawioralna',
  contact: 'Napisz wiadomosc',
} as const

export type FunnelServiceConfig = {
  id: AnyBookingServiceType
  isPublic: boolean
  title: string
  shortTitle: string
  durationMinutes: number
  durationLabel: string
  priceAmount: number
  pricePrefix: 'Od' | null
  mode: 'audio' | 'online'
  slotSpan: number
  slotSummary: string
  slotBadge: string
  roomSummary: string
  publicSummary: string
  bookingLead: string
  availabilityLabel: string
  noAvailabilityMessage: string
  limitedAvailabilityNote: string | null
}

export const FUNNEL_SERVICE_CONFIG: Record<AnyBookingServiceType, FunnelServiceConfig> = {
  'szybka-konsultacja-15-min': {
    id: 'szybka-konsultacja-15-min',
    isPublic: true,
    title: 'Kwadrans z behawiorysta',
    shortTitle: 'Kwadrans z behawiorysta',
    durationMinutes: 15,
    durationLabel: '15 min',
    priceAmount: DEFAULT_PRICE_PLN,
    pricePrefix: null,
    mode: 'audio',
    slotSpan: 1,
    slotSummary: 'Kwadrans z behawiorysta: 15 minut rozmowy audio bez kamery.',
    slotBadge: '15 min audio',
    roomSummary: 'Kwadrans z behawiorysta: 15 minut rozmowy audio bez kamery.',
    publicSummary: '15 minut rozmowy audio bez kamery na jedno pytanie albo uporzadkowanie tematu.',
    bookingLead: 'Wybierz gatunek i temat. Potem pokaze dostepne terminy Kwadransu z behawiorysta.',
    availabilityLabel: 'Terminy pokaza sie po wyborze tematu.',
    noAvailabilityMessage: 'Jesli dzis nie ma terminu, sprawdz pozniej albo napisz wiadomosc.',
    limitedAvailabilityNote: null,
  },
  'kwadrans-na-juz': {
    id: 'kwadrans-na-juz',
    isPublic: true,
    title: 'Kwadrans na juz',
    shortTitle: 'Kwadrans na juz',
    durationMinutes: 15,
    durationLabel: '15 min',
    priceAmount: 99,
    pricePrefix: null,
    mode: 'audio',
    slotSpan: 1,
    slotSummary: 'Kwadrans na juz: termin w ciagu 15 minut, 15 minut rozmowy audio.',
    slotBadge: 'teraz / 15 min',
    roomSummary: 'Kwadrans na juz: 15 minut rozmowy audio bez kamery, start w ciagu 15 minut od potwierdzenia wplaty.',
    publicSummary: 'To ten sam 15-minutowy format co Kwadrans za 69 zl, ale z priorytetem i terminem w ciagu 15 minut od potwierdzenia wplaty.',
    bookingLead: 'Napisz krotko co sie dzieje i potwierdz wplate. Odpiszemy z terminem w ciagu 15 minut.',
    availabilityLabel: 'Dostepnosc zalezy od biezacej okazji - odpiszemy do 15 minut w godzinach dyzuru.',
    noAvailabilityMessage: 'Jesli w tej chwili nie mam wolnego okienka, pokaze Ci najblizszy wolny Kwadrans.',
    limitedAvailabilityNote: 'Termin w ciagu 15 minut w godzinach dyzuru.',
  },
  'konsultacja-30-min': {
    id: 'konsultacja-30-min',
    isPublic: true,
    title: 'Dwa kwadranse z behawiorysta',
    shortTitle: 'Dwa kwadranse',
    durationMinutes: 30,
    durationLabel: '2 x 15 min',
    priceAmount: 169,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 2,
    slotSummary: 'Dwa kwadranse z behawiorysta: 30 minut rozmowy online.',
    slotBadge: '2 x 15 min',
    roomSummary: 'Dwa kwadranse z behawiorysta: 30 minut rozmowy online.',
    publicSummary: '30 minut rozmowy online, gdy potrzebujesz spokojniejszego wejscia niz sam Kwadrans, ale jeszcze nie pelnej konsultacji.',
    bookingLead: 'Najpierw wybierz gatunek i temat. Potem pokaze dostepne terminy Dwoch kwadransow z behawiorysta.',
    availabilityLabel: 'Terminy pokaza sie po wyborze tematu.',
    noAvailabilityMessage: 'Jesli teraz nie ma terminu Dwoch kwadransow, wroc pozniej albo napisz wiadomosc.',
    limitedAvailabilityNote: null,
  },
  'konsultacja-behawioralna-online': {
    id: 'konsultacja-behawioralna-online',
    isPublic: true,
    title: 'Pelna konsultacja behawioralna',
    shortTitle: 'Pelna konsultacja',
    durationMinutes: 60,
    durationLabel: '60 min',
    priceAmount: 470,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 3,
    slotSummary: 'Pelna konsultacja behawioralna: 60 minut rozmowy online.',
    slotBadge: '60 min',
    roomSummary: 'Pelna konsultacja behawioralna online: 60 minut rozmowy, diagnoza i 7 dni konsultacji tekstowych przez WhatsApp.',
    publicSummary:
      'Pelna konsultacja behawioralna online: 60 minut rozmowy audio lub video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    bookingLead: 'Wybierz gatunek i temat. Potem pokaze najblizsze dostepne terminy pelnej konsultacji behawioralnej.',
    availabilityLabel: 'Najblizsze dostepne terminy pokaza sie po wyborze tematu.',
    noAvailabilityMessage:
      'Jesli teraz nie ma terminu pelnej konsultacji behawioralnej, wybierz Kwadrans, Dwa kwadranse albo napisz wiadomosc.',
    limitedAvailabilityNote: 'Mniej terminow niz przy Kwadransie i Dwoch kwadransach.',
  },
}

export const PUBLIC_FUNNEL_SERVICE_ORDER: PublicBookingServiceType[] = [
  'szybka-konsultacja-15-min',
  'kwadrans-na-juz',
  'konsultacja-30-min',
  'konsultacja-behawioralna-online',
] as const

const MISC_PROBLEM_OPTION: ProblemOption = {
  id: 'inne',
  icon: 'compass',
  title: 'Inny temat',
  desc: 'Jesli temat laczy kilka watkow albo nie pasuje dokladnie do powyzszych kategorii.',
  marketingTitle: 'Inny temat',
  marketingDesc: 'Wybierz to, jesli chcesz opisac temat po swojemu przed rozmowa.',
  examples: ['temat szerszy', 'kilka problemow naraz', 'chce opisac to po swojemu'],
  visualLabel: 'Temat szerszy',
}

export const PUBLIC_DOG_PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak / mlody pies',
    desc: 'Gryzienie, skakanie, pobudzenie i trudnosc z wyciszeniem.',
    marketingTitle: 'Szczeniak / mlody pies',
    marketingDesc: 'Dobry start, gdy w domu zrobilo sie za glosno i trudno wrocic do spokoju.',
    examples: ['szczeniak gryzie rece', 'mlody pies lapie za nogawki', 'mlody pies nie umie odpuscic'],
    visualLabel: 'Szczeniak',
  },
  {
    id: 'spacer',
    icon: 'walking',
    title: 'Spacer i reaktywnosc',
    desc: 'Ciagniecie, szczekanie, rzucanie sie i trudne mijanki.',
    marketingTitle: 'Spacer i reaktywnosc',
    marketingDesc: 'Dla reaktywnosci spacerowej i trudnych spotkan z psami, ludzmi, ruchem albo bodzcami.',
    examples: ['pies ciagnie na smyczy', 'pies szczeka na mijane psy', 'pies rzuca sie na rowery'],
    visualLabel: 'Spacer',
  },
  {
    id: 'separacja',
    icon: 'home',
    title: 'Separacja',
    desc: 'Wycie, niszczenie, napiecie przy wyjsciu i trudnosc z zostawaniem samemu.',
    marketingTitle: 'Separacja',
    marketingDesc: 'Pomaga uporzadkowac, co jest napieciem, co rutyna, a co wyglada juz jak problem separacyjny.',
    examples: ['pies szczeka, gdy zostaje sam', 'pies drapie drzwi po wyjsciu', 'nie moge wyjsc bez stresu psa'],
    visualLabel: 'Separacja',
  },
  {
    id: 'pobudzenie',
    icon: 'spark',
    title: 'Pobudzenie / wyciszenie',
    desc: 'Nakrecanie sie, pogon za ruchem i trudnosc z wyhamowaniem.',
    marketingTitle: 'Pobudzenie / wyciszenie',
    marketingDesc: 'Dobry wybor, gdy problemem jest pobudzenie, frustracja albo brak spokojnego wyhamowania.',
    examples: ['pies demoluje dom z pobudzenia', 'pies goni wszystko', 'pies nie umie wyhamowac'],
    visualLabel: 'Wyciszenie',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja / zasoby',
    desc: 'Warkniecia, obrona jedzenia, legowiska, zabawek albo przestrzeni.',
    marketingTitle: 'Agresja / zasoby',
    marketingDesc: 'Kategoria dla reakcji obronnych i ochrony zasobow, gdy trzeba odroznic napiecie od samego zachowania.',
    examples: ['pies warczy przy misce', 'pies broni kanapy', 'pies reaguje obronnie przy dotyku'],
    visualLabel: 'Zasoby',
  },
  MISC_PROBLEM_OPTION,
] as const

export const PUBLIC_CAT_PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: 'kot-kuweta',
    icon: 'cat',
    title: 'Kuweta',
    desc: 'Sikanie poza kuweta, omijanie kuwety albo napiecie wokol toalety.',
    marketingTitle: 'Kuweta',
    marketingDesc: 'Najczestszy start przy kuwecie: omijanie, napiecie przy zasobach albo nagla zmiana nawyku.',
    examples: ['kot sika poza kuweta', 'kot omija kuwete', 'nagla zmiana korzystania z kuwety'],
    visualLabel: 'Kuweta',
  },
  {
    id: 'kot-wycofanie',
    icon: 'cat',
    title: 'Wycofanie / napiecie',
    desc: 'Chowanie sie, czujnosc i trudnosc z powrotem do spokoju.',
    marketingTitle: 'Wycofanie / napiecie',
    marketingDesc: 'Dla kota, ktory duzo sie chowa, zyje w napieciu albo po zmianie nie wraca do codziennej rownowagi.',
    examples: ['kot chowa sie caly dzien', 'kot jest bardzo czujny', 'kot po zmianie nie wraca do rownowagi'],
    visualLabel: 'Napiecie',
  },
  {
    id: 'kot-konflikt',
    icon: 'cat',
    title: 'Konflikt miedzy kotami',
    desc: 'Gonitwy, blokowanie przejsc, napiecie przy zasobach i trudna relacja.',
    marketingTitle: 'Konflikt miedzy kotami',
    marketingDesc: 'Dla napiecia miedzy kotami, blokowania przejsc, gonitw i rozjazdu relacji w domu.',
    examples: ['kot atakuje drugiego kota', 'gonitwy po domu', 'blokowanie kuwety lub miski'],
    visualLabel: 'Konflikt',
  },
  {
    id: 'kot-zmiany-w-domu',
    icon: 'cat',
    title: 'Zmiany w domu',
    desc: 'Napiecie po przeprowadzce, nowym domowniku albo zmianie codziennego rytmu.',
    marketingTitle: 'Zmiany w domu',
    marketingDesc: 'Dla sytuacji, w ktorych po zmianach w domu wyraznie rozsypal sie codzienny spokoj kota.',
    examples: ['kot zle znosi przeprowadzke', 'po nowym domowniku kot sie wycofal', 'zmiana domu nasilila napiecie'],
    visualLabel: 'Zmiany',
  },
  {
    id: 'kot-wokalizacja',
    icon: 'cat',
    title: 'Wokalizacja / pobudzenie',
    desc: 'Miauczenie, nocne pobudki i trudnosc z wyciszeniem w domu.',
    marketingTitle: 'Wokalizacja / pobudzenie',
    marketingDesc: 'Dla wokalizacji, pobudzenia i rytmu dnia, ktory rozsypuje spokoj w domu.',
    examples: ['kot miauczy po nocy', 'kot budzi dom o swicie', 'kot mocno sie nakreca'],
    visualLabel: 'Wokalizacja',
  },
  MISC_PROBLEM_OPTION,
] as const

export const PUBLIC_PROBLEM_OPTIONS_BY_SPECIES: Record<FunnelSpecies, ProblemOption[]> = {
  pies: [...PUBLIC_DOG_PROBLEM_OPTIONS],
  kot: [...PUBLIC_CAT_PROBLEM_OPTIONS],
}

export function getFunnelServiceConfig(serviceType: AnyBookingServiceType) {
  return FUNNEL_SERVICE_CONFIG[serviceType]
}

export function getPublicServicePriceAmount(serviceType: PublicBookingServiceType, quickConsultationPrice = DEFAULT_PRICE_PLN) {
  return serviceType === 'szybka-konsultacja-15-min' ? quickConsultationPrice : FUNNEL_SERVICE_CONFIG[serviceType].priceAmount
}

export function getPublicServicePriceLabel(serviceType: PublicBookingServiceType, quickConsultationPrice = DEFAULT_PRICE_PLN) {
  return formatPricePln(getPublicServicePriceAmount(serviceType, quickConsultationPrice))
}

export function getProblemOptionsForSpecies(species: FunnelSpecies) {
  return PUBLIC_PROBLEM_OPTIONS_BY_SPECIES[species]
}

export function getPublicProblemOptionById(species: FunnelSpecies, topicId: string | null | undefined) {
  if (!topicId) {
    return null
  }

  return getProblemOptionsForSpecies(species).find((option) => option.id === topicId) ?? null
}
