import { AvailabilitySeed, ProblemOption, ProblemType } from './types'

export const problemOptions: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak i młody pies',
    desc: 'gryzienie, nauka czystości, pobudzenie i pierwsze zasady w domu',
  },
  {
    id: 'kot',
    icon: 'cat',
    title: 'Kot i trudne zachowania',
    desc: 'problemy z kuwetą, napięcie, wokalizacja i trudności w domu',
  },
  {
    id: 'separacja',
    icon: 'home',
    title: 'Lęk separacyjny',
    desc: 'wycie, niszczenie, trudność zostawania samemu i napięcie po wyjściu opiekuna',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja i reakcje obronne',
    desc: 'trudne zachowania wobec ludzi, zwierząt lub w codziennych sytuacjach',
  },
  {
    id: 'niszczenie',
    icon: 'spark',
    title: 'Szczekanie, niszczenie, pobudzenie',
    desc: 'hałas, rozregulowanie i trudność z wyciszeniem lub kontrolą emocji',
  },
  {
    id: 'inne',
    icon: 'compass',
    title: 'Inny temat do omówienia',
    desc: 'gdy chcesz szybko uporządkować sytuację i dostać pierwszy kierunek działania',
  },
]

export const steps = [
  {
    n: '01',
    title: 'Wybierasz temat',
    desc: 'Określasz, czego dotyczy trudność, i przechodzisz do aktualnych terminów dla tego flow rezerwacji.',
  },
  {
    n: '02',
    title: 'Blokujesz termin na czas płatności',
    desc: 'Podajesz dane, zapisujesz rezerwację i przechodzisz do bezpiecznego checkoutu bez ryzyka utraty slotu w trakcie płatności.',
  },
  {
    n: '03',
    title: 'Otrzymujesz potwierdzenie i dalszy krok',
    desc: 'Po opłaceniu widzisz potwierdzenie, link do rozmowy audio i możliwość dodania materiałów przygotowawczych.',
  },
]

export const faq = [
  {
    q: 'Czy 15 minut wystarczy?',
    a: 'To szybka konsultacja porządkująca sytuację. Jej celem jest wstępna ocena problemu i pierwszy, konkretny kierunek działania, a nie pełna terapia behawioralna.',
  },
  {
    q: 'Czy mogę ubiegać się o zwrot pieniędzy?',
    a: 'Tak. Jeśli po konsultacji uznasz, że rozmowa nie pomogła Ci zrozumieć problemu ani ustalić kolejnego kroku, możesz złożyć reklamację lub wniosek o zwrot zgodnie z regulaminem.',
  },
  {
    q: 'Czy mogę przełożyć termin?',
    a: 'Tak, o ile zrobisz to przed rozpoczęciem zarezerwowanej godziny i będzie dostępny inny wolny slot. Najszybciej skontaktować się telefonicznie albo przez publiczny profil Facebook podany w stopce.',
  },
  {
    q: 'Co jeśli nie mam MP4 albo innych materiałów?',
    a: 'Materiały są całkowicie opcjonalne. Jeśli ich nie masz, nadal możesz przejść przez cały flow rezerwacji i odbyć rozmowę audio.',
  },
  {
    q: 'Czy konsultacja jest tylko audio?',
    a: 'Tak. Behawior 15 jest zaprojektowany jako spokojna 15-minutowa rozmowa głosowa online. Kamera nie jest potrzebna.',
  },
  {
    q: 'Czy rozmowa jest nagrywana?',
    a: 'Nie zakładamy automatycznego nagrywania rozmów w standardowym flow. Jeśli pojawi się potrzeba dodatkowych ustaleń, będą one komunikowane osobno.',
  },
  {
    q: 'Co dzieje się po 15 minutach?',
    a: 'Po rozmowie masz otrzymać jasny następny krok: co wdrożyć od razu, co obserwować dalej i czy potrzebna będzie szersza konsultacja albo diagnostyka weterynaryjna.',
  },
  {
    q: 'Czy konsultacja dotyczy zarówno psa, jak i kota?',
    a: 'Tak. Rozmowa jest przeznaczona dla opiekunów psów i kotów, także w sprawach lęku, kuwety, pobudzenia, niszczenia czy relacji między zwierzętami.',
  },
  {
    q: 'Czy to zastępuje wizytę stacjonarną albo badanie weterynaryjne?',
    a: 'Nie zawsze. To pierwszy krok, który pomaga uporządkować problem. Jeśli sytuacja tego wymaga, po rozmowie dostaniesz rekomendację dalszej pracy albo konsultacji weterynaryjnej.',
  },
  {
    q: 'Jak szybko dostaję potwierdzenie rezerwacji?',
    a: 'Po skutecznej płatności od razu widzisz potwierdzenie terminu, link do rozmowy i możliwość dodania materiałów przygotowawczych.',
  },
  {
    q: 'Jak najlepiej przygotować się do rozmowy?',
    a: 'Wystarczy krótki opis problemu, najważniejsze obserwacje i 2–3 pytania. Jeśli chcesz, możesz dodać MP4, link albo notatki po zapisaniu rezerwacji.',
  },
]

const rollingAvailabilityTimeGroups = [
  ['09:00', '09:20', '09:40', '10:00', '10:20', '10:40'],
  ['11:00', '11:20', '11:40', '16:00', '16:20', '16:40'],
  ['09:00', '09:20', '17:00', '17:20', '17:40', '18:00'],
  ['10:00', '10:20', '10:40', '11:00', '18:00', '18:20'],
] as const

function formatWarsawDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatWarsawTime(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function getWarsawNowBoundary(now = new Date()) {
  return {
    date: formatWarsawDate(now),
    time: formatWarsawTime(now),
  }
}

export function isFutureAvailabilitySlot(
  bookingDate: string,
  bookingTime: string,
  now = new Date(),
): boolean {
  const boundary = getWarsawNowBoundary(now)
  return `${bookingDate}T${bookingTime}` >= `${boundary.date}T${boundary.time}`
}

export function buildRollingAvailabilitySeed(now = new Date(), dayCount = 6): AvailabilitySeed[] {
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(now.getTime() + index * 24 * 60 * 60 * 1000)
    const bookingDate = formatWarsawDate(date)
    return {
      date: bookingDate,
      times: [...rollingAvailabilityTimeGroups[index % rollingAvailabilityTimeGroups.length]].filter(
        (time) => isFutureAvailabilitySlot(bookingDate, time, now),
      ),
    }
  }).filter((entry) => entry.times.some((time) => isFutureAvailabilitySlot(entry.date, time, now)))
}

export function getProblemLabel(problem: ProblemType): string {
  return problemOptions.find((item) => item.id === problem)?.title ?? 'Konsultacja'
}

export function getBookingStatusLabel(
  status: 'pending' | 'confirmed' | 'done' | 'cancelled' | 'expired',
): string {
  switch (status) {
    case 'pending':
      return 'Oczekuje na płatność'
    case 'confirmed':
      return 'Potwierdzona'
    case 'done':
      return 'Zakończona'
    case 'cancelled':
      return 'Anulowana'
    case 'expired':
      return 'Wygasła'
    default:
      return status
  }
}

export function getPaymentStatusLabel(status: 'unpaid' | 'paid' | 'failed' | 'refunded'): string {
  switch (status) {
    case 'unpaid':
      return 'Nieopłacona'
    case 'paid':
      return 'Opłacona'
    case 'failed':
      return 'Płatność nieudana'
    case 'refunded':
      return 'Zwrócona'
    default:
      return status
  }
}

export function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${date}T12:00:00`))
}

export function formatDateTimeLabel(date: string, time: string): string {
  return `${formatDateLabel(date)} - ${time}`
}

export function isProblemType(value: string | null | undefined): value is ProblemType {
  return problemOptions.some((option) => option.id === value)
}

export function compareDateAndTime(
  leftDate: string,
  leftTime: string,
  rightDate: string,
  rightTime: string,
): number {
  return `${leftDate}T${leftTime}`.localeCompare(`${rightDate}T${rightTime}`)
}
