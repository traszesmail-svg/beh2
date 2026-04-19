import { PUBLIC_CAT_PROBLEM_OPTIONS, PUBLIC_DOG_PROBLEM_OPTIONS } from './funnel'
import { AvailabilitySeed, ProblemOption, ProblemType } from './types'

const LEGACY_CAT_PROBLEM_OPTIONS: ProblemOption[] = [
  {
    id: 'kot-dotyk',
    icon: 'cat',
    title: 'Dotyk, pielęgnacja i obrona',
    desc: 'Gryzienie przy dotyku, obrona przy zabiegach i trudna pielęgnacja.',
    marketingTitle: 'Dotyk, pielęgnacja i obrona',
    marketingDesc: 'Legacy kategoria utrzymana wyłącznie dla zgodności historycznych bookingów i starych linków.',
    examples: ['kot gryzie przy głaskaniu', 'kot nie daje obciąć pazurów', 'kot atakuje przy noszeniu'],
    visualLabel: 'Dotyk',
  },
  {
    id: 'kot-stres',
    icon: 'cat',
    title: 'Lęk, stres i wycofanie',
    desc: 'Chowanie się, napięcie po zmianach i trudność z powrotem do spokoju.',
    marketingTitle: 'Lęk, stres i wycofanie',
    marketingDesc: 'Legacy kategoria utrzymana wyłącznie dla zgodności historycznych bookingów i starych linków.',
    examples: ['kot chowa się cały dzień', 'kot boi się gości', 'kot po zmianie nie wraca do równowagi'],
    visualLabel: 'Stres',
  },
  {
    id: 'kot-nocna-wokalizacja',
    icon: 'cat',
    title: 'Nocna aktywność i rytm dnia',
    desc: 'Miauczenie w nocy, pobudki o świcie i rozsypany rytm domu.',
    marketingTitle: 'Nocna aktywność i rytm dnia',
    marketingDesc: 'Legacy kategoria utrzymana wyłącznie dla zgodności historycznych bookingów i starych linków.',
    examples: ['kot miauczy po nocy', 'kot budzi dom o 4 rano', 'nocne gonitwy i wokalizacja'],
    visualLabel: 'Noc',
  },
]

const LEGACY_PROBLEM_LABELS: Record<string, string> = {
  kot: 'Kot',
  niszczenie: 'Pobudzenie / wyciszenie',
}

export const problemOptions: ProblemOption[] = [
  ...PUBLIC_DOG_PROBLEM_OPTIONS,
  ...PUBLIC_CAT_PROBLEM_OPTIONS,
  ...LEGACY_CAT_PROBLEM_OPTIONS,
]

export const CAT_PROBLEM_OPTIONS: ProblemOption[] = [...PUBLIC_CAT_PROBLEM_OPTIONS]
export const DOG_PROBLEM_OPTIONS: ProblemOption[] = [...PUBLIC_DOG_PROBLEM_OPTIONS]

export const steps = [
  {
    n: '01',
    title: 'Wybierasz temat',
    desc: 'Na spokojnie wskazujesz, czego dotyczy sytuacja.',
  },
  {
    n: '02',
    title: 'Widzisz, co dalej',
    desc: 'Od razu wiesz, czy kolejnym ruchem jest termin, wiadomość czy materiał pomocniczy.',
  },
  {
    n: '03',
    title: 'Masz jasne potwierdzenie',
    desc: 'Po płatności albo kontakcie zostaje czytelny punkt startu i mniej chaosu.',
  },
]

export const faq = [
  {
    q: 'Czy 15 minut wystarczy?',
    a: 'To szybka konsultacja porządkująca sytuację. Jej celem jest wstępna ocena problemu i pierwszy konkretny kierunek działania, a nie pełna terapia behawioralna.',
  },
  {
    q: 'Czy zakup jest bezpieczny?',
    a: 'Tak. Możesz wybrać prostą wpłatę BLIK/przelewem, a link do rozmowy odblokowuje się dopiero po potwierdzeniu wpłaty.',
  },
  {
    q: 'Czy mogę anulować zakup?',
    a: 'Po potwierdzeniu wpłaty masz krótkie okno na zgłoszenie rezygnacji lub zmiany terminu. Przy obecnym modelu BLIK na telefon ewentualny zwrot wymaga kontaktu i indywidualnej decyzji.',
  },
  {
    q: 'Co dostaję po rozmowie?',
    a: 'Jasny pierwszy plan: co zrobić od razu, co obserwować dalej i czy wystarczy ten start, czy lepsza będzie dłuższa konsultacja albo diagnostyka weterynaryjna.',
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

function getWarsawDateTimeParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const values: Record<string, string> = {}

  for (const part of formatter.formatToParts(now)) {
    if (part.type !== 'literal') {
      values[part.type] = part.value
    }
  }

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
    second: Number(values.second ?? '0'),
  }
}

function getPseudoUtcTimestamp(date: string, time: string, second = 0): number {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)

  return Date.UTC(year, month - 1, day, hour, minute, second)
}

export function getWarsawNowBoundary(now = new Date()) {
  return {
    date: formatWarsawDate(now),
    time: formatWarsawTime(now),
  }
}

export function isFutureAvailabilitySlot(bookingDate: string, bookingTime: string, now = new Date()): boolean {
  const boundary = getWarsawNowBoundary(now)
  return `${bookingDate}T${bookingTime}` >= `${boundary.date}T${boundary.time}`
}

export function buildRollingAvailabilitySeed(now = new Date(), dayCount = 6): AvailabilitySeed[] {
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(now.getTime() + index * 24 * 60 * 60 * 1000)
    const bookingDate = formatWarsawDate(date)
    return {
      date: bookingDate,
      times: [...rollingAvailabilityTimeGroups[index % rollingAvailabilityTimeGroups.length]].filter((time) =>
        isFutureAvailabilitySlot(bookingDate, time, now),
      ),
    }
  }).filter((entry) => entry.times.some((time) => isFutureAvailabilitySlot(entry.date, time, now)))
}

export function getSecondsUntilBookingStart(bookingDate: string, bookingTime: string, now = new Date()): number {
  const currentBoundary = getWarsawDateTimeParts(now)
  const bookingTimestamp = getPseudoUtcTimestamp(bookingDate, bookingTime)
  const currentTimestamp = getPseudoUtcTimestamp(currentBoundary.date, currentBoundary.time, currentBoundary.second)

  return Math.floor((bookingTimestamp - currentTimestamp) / 1000)
}

export function getSecondsUntilRoomUnlock(bookingDate: string, bookingTime: string, now = new Date()): number {
  return getSecondsUntilBookingStart(bookingDate, bookingTime, now) - 15 * 60
}

export function isCallRoomUnlocked(bookingDate: string, bookingTime: string, now = new Date()): boolean {
  return getSecondsUntilRoomUnlock(bookingDate, bookingTime, now) <= 0
}

export function getProblemLabel(problem: string): string {
  return problemOptions.find((item) => item.id === problem)?.title ?? LEGACY_PROBLEM_LABELS[problem] ?? 'Konsultacja'
}

export function isCatProblemType(value: string | null | undefined): value is ProblemType {
  return [...PUBLIC_CAT_PROBLEM_OPTIONS, ...LEGACY_CAT_PROBLEM_OPTIONS].some((option) => option.id === value)
}

export function getProblemSpecies(problem: ProblemType): 'pies' | 'kot' {
  return isCatProblemType(problem) ? 'kot' : 'pies'
}

export function getBookingStatusLabel(
  status: 'pending' | 'pending_manual_payment' | 'confirmed' | 'done' | 'cancelled' | 'expired',
): string {
  switch (status) {
    case 'pending':
      return 'Oczekuje na płatność'
    case 'pending_manual_payment':
      return 'Czeka na potwierdzenie wpłaty'
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
      return 'Zgłoszona, potwierdzenie do 60 min'
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

export function compareDateAndTime(leftDate: string, leftTime: string, rightDate: string, rightTime: string): number {
  return `${leftDate}T${leftTime}`.localeCompare(`${rightDate}T${rightTime}`)
}
