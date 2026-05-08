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
  primary: 'Zarezerwuj 15-minutową konsultację behawioralną',
  bridge: 'Zarezerwuj Dwa kwadranse z behawiorystą',
  secondary: 'Przejdz do Niezbędnika',
  consultation: 'Zarezerwuj pełną konsultację behawioralną',
  contact: 'Napisz wiadomość',
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
    title: '15-minutowa konsultacja behawioralna',
    shortTitle: '15-minutowa konsultacja behawioralna',
    durationMinutes: 15,
    durationLabel: '15 min',
    priceAmount: DEFAULT_PRICE_PLN,
    pricePrefix: null,
    mode: 'audio',
    slotSpan: 1,
    slotSummary: '15-minutowa konsultacja behawioralna: 15 minut rozmowy audio bez kamery.',
    slotBadge: '15 min audio',
    roomSummary: '15-minutowa konsultacja behawioralna: 15 minut rozmowy audio bez kamery.',
    publicSummary: '15 minut rozmowy audio bez kamery na jedno pytanie albo uporządkowanie tematu.',
    bookingLead: 'Wybierz gatunek i temat. Potem zobaczysz dostępne terminy 15-minutowej konsultacji.',
    availabilityLabel: 'Terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage: 'Jeśli dzis nie ma terminu, sprawdzić później albo napisz wiadomość.',
    limitedAvailabilityNote: null,
  },
  'kwadrans-na-juz': {
    id: 'kwadrans-na-juz',
    isPublic: true,
    title: 'Kwadrans na już',
    shortTitle: 'Kwadrans na już',
    durationMinutes: 15,
    durationLabel: '15 min',
    priceAmount: 99,
    pricePrefix: null,
    mode: 'audio',
    slotSpan: 1,
    slotSummary: 'Kwadrans na już: termin w ciągu 15 minut, 15 minut rozmowy audio.',
    slotBadge: 'teraz / 15 min',
    roomSummary: 'Kwadrans na już: 15 minut rozmowy audio bez kamery, start w ciągu 15 minut od potwierdzenia wpłaty.',
    publicSummary: 'To ten sam 15-minutowy format co Kwadrans za 69 zł, ale z priorytetem i terminem w ciągu 15 minut od potwierdzenia wpłaty.',
    bookingLead: 'Napisz krótko co się dzieje i potwierdz wpłatę. Odpiszemy z terminem w ciągu 15 minut.',
    availabilityLabel: 'Dostępność zależy od bieżącej okazji - odpiszemy do 15 minut w godzinach dyżuru.',
    noAvailabilityMessage: 'Jeśli w tej chwili nie mam wolnego okienka, pokaże Ci najbliższy wolny Kwadrans.',
    limitedAvailabilityNote: 'Termin w ciągu 15 minut w godzinach dyżuru.',
  },
  'konsultacja-30-min': {
    id: 'konsultacja-30-min',
    isPublic: true,
    title: 'Dwa kwadranse z behawiorystą',
    shortTitle: 'Dwa kwadranse',
    durationMinutes: 30,
    durationLabel: '2 x 15 min',
    priceAmount: 169,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 2,
    slotSummary: 'Dwa kwadranse z behawiorystą: 30 minut rozmowy online.',
    slotBadge: '2 x 15 min',
    roomSummary: 'Dwa kwadranse z behawiorystą: 30 minut rozmowy online.',
    publicSummary: '30 minut rozmowy online, gdy potrzebujesz spokojniejszego wejścia niz sam Kwadrans, ale jeszcze nie pełnej konsultacji.',
    bookingLead: 'Najpierw wybierz gatunek i temat. Potem zobaczysz dostępne terminy Dwóch kwadransów z behawiorystą.',
    availabilityLabel: 'Terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage: 'Jeśli teraz nie ma terminu Dwóch kwadransów, wróć później albo napisz wiadomość.',
    limitedAvailabilityNote: null,
  },
  'konsultacja-behawioralna-online': {
    id: 'konsultacja-behawioralna-online',
    isPublic: true,
    title: 'Pełna konsultacja behawioralna',
    shortTitle: 'Pełna konsultacja',
    durationMinutes: 60,
    durationLabel: 'pełny zakres',
    priceAmount: 470,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 3,
    slotSummary: 'Pełna konsultacja behawioralna: rozmowa online, diagnoza i plan pracy.',
    slotBadge: 'pełny zakres',
    roomSummary: 'Pełna konsultacja behawioralna online: rozmowa, diagnoza i 7 dni konsultacji tekstowych przez WhatsApp.',
    publicSummary:
      'Pełna konsultacja behawioralna online: rozmowa audio lub video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
    bookingLead: 'Wybierz gatunek i temat. Potem zobaczysz najbliższe dostępne terminy pełnej konsultacji behawioralnej.',
    availabilityLabel: 'Najbliższe dostępne terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage:
      'Jeśli teraz nie ma terminu pełnej konsultacji behawioralnej, wybierz Kwadrans, Dwa kwadranse albo napisz wiadomość.',
    limitedAvailabilityNote: 'Mniej terminów niz przy Kwadransie i Dwóch kwadransach.',
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
  desc: 'Jeśli temat laczy kilka wątków albo nie pasuje dokladnie do powyzszych kategorii.',
  marketingTitle: 'Inny temat',
  marketingDesc: 'Wybierz to, jeśli chcesz opisac temat po swojemu przed rozmowa.',
  examples: ['temat szerszy', 'kilka problemów naraz', 'chcę opisać to po swojemu'],
  visualLabel: 'Temat szerszy',
}

export const PUBLIC_DOG_PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak / młody pies',
    desc: 'Gryzienie, skakanie, pobudzenie i trudnosc z wyciszeniem.',
    marketingTitle: 'Szczeniak / młody pies',
    marketingDesc: 'Dobry start, gdy w domu zrobilo się za głośno i trudno wróćic do spokoju.',
    examples: ['szczeniak gryzie ręce', 'młody pies łapie za nogawki', 'młody pies nie umie odpuścić'],
    visualLabel: 'Szczeniak',
  },
  {
    id: 'spacer',
    icon: 'walking',
    title: 'Spacer i reaktywność',
    desc: 'Ciągnięcie, szczekanie, rzucanie się i trudne mijanki.',
    marketingTitle: 'Spacer i reaktywność',
    marketingDesc: 'Dla reaktywności spacerowej i trudnych spotkań z psami, ludźmi, ruchem albo bodźcami.',
    examples: ['pies ciągnie na smyczy', 'pies szczeka na mijane psy', 'pies rzuca się na rowery'],
    visualLabel: 'Spacer',
  },
  {
    id: 'separacja',
    icon: 'home',
    title: 'Separacja',
    desc: 'Wycie, niszczenie, napięcie przy wyjściu i trudnosc z zostawaniem samemu.',
    marketingTitle: 'Separacja',
    marketingDesc: 'Pomaga uporządkować, co jest napięciem, co rutyną, a co wygląda już jak problem separacyjny.',
    examples: ['pies szczeka, gdy zostaje sam', 'pies drapie drzwi po wyjściu', 'nie mogę wyjsc bez stresu psa'],
    visualLabel: 'Separacja',
  },
  {
    id: 'pobudzenie',
    icon: 'spark',
    title: 'Pobudzenie / wyciszenie',
    desc: 'Nakrecanie się, pogon za ruchem i trudnosc z wyhamowaniem.',
    marketingTitle: 'Pobudzenie / wyciszenie',
    marketingDesc: 'Dobry wybór, gdy problemem jest pobudzenie, frustracja albo brak spokojnego wyhamowania.',
    examples: ['pies demoluje dom z pobudzenia', 'pies goni wszystko', 'pies nie umie wyhamowac'],
    visualLabel: 'Wyciszenie',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja / zasoby',
    desc: 'Warkniecia, obrona jedzenia, legowiska, zabawek albo przestrzeni.',
    marketingTitle: 'Agresja / zasoby',
    marketingDesc: 'Kategoria dla reakcji obronnych i ochrony zasobów, gdy trzeba odróżnic napięcie od samego zachowania.',
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
    desc: 'Sikanie poza kuwetą, omijanie kuwety albo napięcie wokół toalety.',
    marketingTitle: 'Kuweta',
    marketingDesc: 'Najczęstszy start przy kuwecie: omijanie, napięcie przy zasobach albo nagła zmiana nawyku.',
    examples: ['kot sika poza kuwetą', 'kot omija kuwetę', 'nagła zmiana korzystania z kuwety'],
    visualLabel: 'Kuweta',
  },
  {
    id: 'kot-wycofanie',
    icon: 'cat',
    title: 'Wycofanie / napięcie',
    desc: 'Chowanie się, czujnosc i trudnosc z powrotem do spokoju.',
    marketingTitle: 'Wycofanie / napięcie',
    marketingDesc: 'Dla kota, który dużo się chowa, żyje w napięciu albo po zmianie nie wraca do codziennej równowagi.',
    examples: ['kot chowa się cały dzień', 'kot jest bardzo czujny', 'kot po zmianie nie wraca do równowagi'],
    visualLabel: 'Napiecie',
  },
  {
    id: 'kot-konflikt',
    icon: 'cat',
    title: 'Konflikt między kotami',
    desc: 'Gonitwy, blokowanie przejść, napięcie przy zasobach i trudna relacja.',
    marketingTitle: 'Konflikt między kotami',
    marketingDesc: 'Dla napiecia między kotami, blokowania przejść, gonitw i rozjazdu relacji w domu.',
    examples: ['kot atakuje drugiego kota', 'gonitwy po domu', 'blokowanie kuwety lub miski'],
    visualLabel: 'Konflikt',
  },
  {
    id: 'kot-zmiany-w-domu',
    icon: 'cat',
    title: 'Zmiany w domu',
    desc: 'Napięcie po przeprowadzce, nowym domowniku albo zmianie codziennego rytmu.',
    marketingTitle: 'Zmiany w domu',
    marketingDesc: 'Dla sytuacji, w których po zmianach w domu wyraźnie rozsypał się codzienny spokój kota.',
    examples: ['kot źle znosi przeprowadzke', 'po nowym domowniku kot się wycofal', 'zmiana domu nasilila napięcie'],
    visualLabel: 'Zmiany',
  },
  {
    id: 'kot-wokalizacja',
    icon: 'cat',
    title: 'Wokalizacja / pobudzenie',
    desc: 'Miauczenie, nocne pobudki i trudnosc z wyciszeniem w domu.',
    marketingTitle: 'Wokalizacja / pobudzenie',
    marketingDesc: 'Dla wokalizacji, pobudzenia i rytmu dnia, który rozsypuje spokój w domu.',
    examples: ['kot miauczy po nocy', 'kot budzi dom o swrócićie', 'kot mocno się nakreca'],
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
