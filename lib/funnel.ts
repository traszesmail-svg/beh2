import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'
import type { ProblemOption } from './types'

export type FunnelSpecies = 'pies' | 'kot'
export type PublicBookingServiceType = 'szybka-konsultacja-15-min' | 'konsultacja-behawioralna-online'
export type LegacyBookingServiceType = 'konsultacja-30-min'
export type AnyBookingServiceType = PublicBookingServiceType | LegacyBookingServiceType

export const FUNNEL_CTA_LABELS = {
  primary: 'Zarezerwuj Kwadrans z behawiorystą',
  secondary: 'Przejdź do Niezbędnika',
  consultation: 'Umów konsultację 60 min',
  contact: 'Napisz wiadomość',
} as const

export type FunnelServiceConfig = {
  id: AnyBookingServiceType
  isPublic: boolean
  title: string
  shortTitle: string
  durationMinutes: number
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
    title: 'Kwadrans z behawiorystą',
    shortTitle: 'Kwadrans z behawiorystą',
    durationMinutes: 15,
    priceAmount: DEFAULT_PRICE_PLN,
    pricePrefix: null,
    mode: 'audio',
    slotSpan: 1,
    slotSummary: 'Kwadrans z behawiorystą: 15 minut rozmowy audio bez kamery.',
    slotBadge: '15 min audio',
    roomSummary: 'Kwadrans z behawiorystą: 15 minut rozmowy audio bez kamery.',
    publicSummary: '15 minut rozmowy audio bez kamery na jedno pytanie albo uporządkowanie tematu.',
    bookingLead: 'Wybierz gatunek i temat. Potem pokażę dostępne terminy Kwadransu z behawiorystą.',
    availabilityLabel: 'Terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage: 'Jeśli dziś nie ma terminu, sprawdź później albo napisz wiadomość.',
    limitedAvailabilityNote: null,
  },
  'konsultacja-30-min': {
    id: 'konsultacja-30-min',
    isPublic: false,
    title: 'Konsultacja 30 min',
    shortTitle: '30 min online',
    durationMinutes: 30,
    priceAmount: 119,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 2,
    slotSummary: '30 min, rozmowa online.',
    slotBadge: '30 min online',
    roomSummary: '30-minutowa konsultacja online.',
    publicSummary: 'Legacy format utrzymany wyłącznie dla zgodności historycznych rezerwacji.',
    bookingLead: 'Najpierw wybierz gatunek i temat. Potem pokażę dostępne terminy rozmowy 30 min.',
    availabilityLabel: 'Terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage: 'Jeśli teraz nie ma terminu, wróć później.',
    limitedAvailabilityNote: null,
  },
  'konsultacja-behawioralna-online': {
    id: 'konsultacja-behawioralna-online',
    isPublic: true,
    title: 'Konsultacja online 60 min',
    shortTitle: 'Konsultacja 60 min',
    durationMinutes: 60,
    priceAmount: 350,
    pricePrefix: null,
    mode: 'online',
    slotSpan: 4,
    slotSummary: 'Konsultacja 60 min online.',
    slotBadge: '60 min',
    roomSummary: '60 minut konsultacji online.',
    publicSummary: 'Szersza konsultacja online z większą ilością czasu na temat i podsumowaniem pisemnym.',
    bookingLead: 'Wybierz gatunek i temat. Potem pokażę najbliższe dostępne terminy konsultacji 60 min.',
    availabilityLabel: 'Najbliższe dostępne terminy pokażą się po wyborze tematu.',
    noAvailabilityMessage:
      'Jeśli teraz nie ma terminu konsultacji 60 min, wybierz Kwadrans z behawiorystą albo napisz wiadomość.',
    limitedAvailabilityNote: 'Mniej terminów niż przy Kwadransie z behawiorystą.',
  },
}

export const PUBLIC_FUNNEL_SERVICE_ORDER: PublicBookingServiceType[] = [
  'szybka-konsultacja-15-min',
  'konsultacja-behawioralna-online',
] as const

const MISC_PROBLEM_OPTION: ProblemOption = {
  id: 'inne',
  icon: 'compass',
  title: 'Inny temat',
  desc: 'Jeśli temat łączy kilka wątków albo nie pasuje dokładnie do powyższych kategorii.',
  marketingTitle: 'Inny temat',
  marketingDesc: 'Wybierz to, jeśli chcesz opisać temat po swojemu przed rozmową.',
  examples: ['temat szerszy', 'kilka problemów naraz', 'chcę opisać to po swojemu'],
  visualLabel: 'Temat szerszy',
}

export const PUBLIC_DOG_PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak / młody pies',
    desc: 'Gryzienie, skakanie, pobudzenie i trudność z wyciszeniem.',
    marketingTitle: 'Szczeniak / młody pies',
    marketingDesc: 'Dobry start, gdy w domu zrobiło się za głośno i trudno wrócić do spokoju.',
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
    desc: 'Wycie, niszczenie, napięcie przy wyjściu i trudność z zostawaniem samemu.',
    marketingTitle: 'Separacja',
    marketingDesc: 'Pomaga uporządkować, co jest napięciem, co rutyną, a co wygląda już jak problem separacyjny.',
    examples: ['pies szczeka, gdy zostaje sam', 'pies drapie drzwi po wyjściu', 'nie mogę wyjść bez stresu psa'],
    visualLabel: 'Separacja',
  },
  {
    id: 'pobudzenie',
    icon: 'spark',
    title: 'Pobudzenie / wyciszenie',
    desc: 'Nakręcanie się, pogoń za ruchem i trudność z wyhamowaniem.',
    marketingTitle: 'Pobudzenie / wyciszenie',
    marketingDesc: 'Dobry wybór, gdy problemem jest pobudzenie, frustracja albo brak spokojnego wyhamowania.',
    examples: ['pies demoluje dom z pobudzenia', 'pies goni wszystko', 'pies nie umie wyhamować'],
    visualLabel: 'Wyciszenie',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja / zasoby',
    desc: 'Warknięcia, obrona jedzenia, legowiska, zabawek albo przestrzeni.',
    marketingTitle: 'Agresja / zasoby',
    marketingDesc: 'Kategoria dla reakcji obronnych i ochrony zasobów, gdy trzeba odróżnić napięcie od samego zachowania.',
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
    desc: 'Chowanie się, czujność i trudność z powrotem do spokoju.',
    marketingTitle: 'Wycofanie / napięcie',
    marketingDesc: 'Dla kota, który dużo się chowa, żyje w napięciu albo po zmianie nie wraca do codziennej równowagi.',
    examples: ['kot chowa się cały dzień', 'kot jest bardzo czujny', 'kot po zmianie nie wraca do równowagi'],
    visualLabel: 'Napięcie',
  },
  {
    id: 'kot-konflikt',
    icon: 'cat',
    title: 'Konflikt między kotami',
    desc: 'Gonitwy, blokowanie przejść, napięcie przy zasobach i trudna relacja.',
    marketingTitle: 'Konflikt między kotami',
    marketingDesc: 'Dla napięcia między kotami, blokowania przejść, gonitw i rozjazdu relacji w domu.',
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
    examples: ['kot źle znosi przeprowadzkę', 'po nowym domowniku kot się wycofał', 'zmiana domu nasiliła napięcie'],
    visualLabel: 'Zmiany',
  },
  {
    id: 'kot-wokalizacja',
    icon: 'cat',
    title: 'Wokalizacja / pobudzenie',
    desc: 'Miauczenie, nocne pobudki i trudność z wyciszeniem w domu.',
    marketingTitle: 'Wokalizacja / pobudzenie',
    marketingDesc: 'Dla wokalizacji, pobudzenia i rytmu dnia, który rozsypuje spokój w domu.',
    examples: ['kot miauczy po nocy', 'kot budzi dom o świcie', 'kot mocno się nakręca'],
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
