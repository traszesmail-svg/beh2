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
    id: 'dogoterapia',
    icon: 'heart-paw',
    title: 'Dogoterapia',
    desc: 'wstępna rozmowa o celu spotkania, odbiorcach, przygotowaniu psa i dalszym planie',
  },
  {
    id: 'inne',
    icon: 'compass',
    title: 'Inny temat do omówienia',
    desc: 'nietypowa sytuacja, którą chcesz szybko uporządkować i dobrze opisać w formularzu',
  },
]

export const steps = [
  {
    n: '01',
    title: 'Wybierasz temat',
    desc: 'Określasz, czego dotyczy trudność, i od razu przechodzisz do właściwego wejścia w rezerwację.',
  },
  {
    n: '02',
    title: 'Wybierasz termin i finalizujesz zakup',
    desc: 'Widzisz realne sloty, podajesz krótki opis problemu i przechodzisz do płatności lub zgłoszenia wpłaty.',
  },
  {
    n: '03',
    title: 'Dostajesz potwierdzenie i link do rozmowy',
    desc: 'Po opłaceniu lub ręcznym potwierdzeniu wpłaty widzisz link do rozmowy, materiały przygotowawcze i dalsze kroki.',
  },
]

export const faq = [
  {
    q: 'Czy 15 minut wystarczy?',
    a: 'To szybka konsultacja porządkująca sytuację. Jej celem jest wstępna ocena problemu i pierwszy, konkretny kierunek działania, a nie pełna terapia behawioralna.',
  },
  {
    q: 'Czy zakup jest bezpieczny?',
    a: 'Tak. Możesz wybrać prostą wpłatę BLIK/przelewem albo checkout PayU, a link do rozmowy odblokowuje się dopiero po potwierdzeniu płatności.',
  },
  {
    q: 'Czy mogę anulować zakup?',
    a: 'Płatność online potwierdzona automatycznie nadal daje krótkie okno na samodzielną rezygnację. Przy wpłacie ręcznej ewentualny zwrot wymaga kontaktu i ręcznej decyzji.',
  },
  {
    q: 'Co dostaję po rozmowie?',
    a: 'Jasny pierwszy plan: co zrobić od razu, co obserwować dalej i czy potrzebna będzie szersza konsultacja, plan pracy albo diagnostyka weterynaryjna.',
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
  status: 'pending' | 'pending_manual_payment' | 'confirmed' | 'done' | 'cancelled' | 'expired',
): string {
  switch (status) {
    case 'pending':
      return 'Oczekuje na płatność'
    case 'pending_manual_payment':
      return 'Czeka na ręczne potwierdzenie'
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

export function getPaymentStatusLabel(
  status: 'unpaid' | 'pending_manual_review' | 'paid' | 'failed' | 'rejected' | 'refunded',
): string {
  switch (status) {
    case 'unpaid':
      return 'Nieopłacona'
    case 'pending_manual_review':
      return 'Zgłoszona, czeka na weryfikację'
    case 'paid':
      return 'Opłacona'
    case 'failed':
      return 'Płatność nieudana'
    case 'rejected':
      return 'Wpłata niepotwierdzona'
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
