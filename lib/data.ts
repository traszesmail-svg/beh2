import { AvailabilitySeed, ProblemOption, ProblemType } from './types'

export const problemOptions: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak i młody pies',
    desc: 'gryzie, skacze i trudno mu się wyciszyć',
    marketingTitle: 'Szczeniak gryzie ręce, skacze i trudno mu się wyciszyć',
    marketingDesc:
      'Podgryza dłonie, łapie za nogawki, skacze i w sekundę wkręca się na 200%. To dobry start, gdy w domu zrobiło się za głośno i trudno wrócić do spokoju.',
    examples: ['buldog francuski gryzie ręce', 'szczeniak łapie za nogawki', 'młody pies nie umie odpuścić'],
    visualLabel: 'Gryzie i skacze',
  },
  {
    id: 'kot',
    icon: 'cat',
    title: 'Kot i trudne zachowania',
    desc: 'kuweta, napięcie, wokalizacja i trudny kontakt',
    marketingTitle: 'Kot omija kuwetę, gryzie albo budzi dom po nocy',
    marketingDesc:
      'Kuweta, napięcie w domu, trudny dotyk albo konflikt między kotami. Najpierw porządkujemy sygnały i możliwe przyczyny, zamiast zgadywać.',
    examples: ['kot sika poza kuwetą', 'kot gryzie przy głaskaniu', 'kot atakuje drugiego kota'],
    visualLabel: 'Kot i dom',
  },
  {
    id: 'separacja',
    icon: 'home',
    title: 'Lęk separacyjny',
    desc: 'wyje, niszczy i źle znosi zostawanie samemu',
    marketingTitle: 'Gdy zostaje sam, wyje, szczeka albo niszczy',
    marketingDesc:
      'Jeśli pies nie radzi sobie po Twoim wyjściu, tu najłatwiej zacząć. Uporządkujemy, co jest napięciem, co rutyną, a co wygląda już jak lęk separacyjny.',
    examples: ['pies szczeka, gdy zostaje sam', 'pies drapie drzwi po wyjściu', 'nie mogę wyjść z domu bez stresu psa'],
    visualLabel: 'Zostaje sam',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja i reakcje obronne',
    desc: 'warczy, rzuca się albo broni zasobów',
    marketingTitle: 'Na spacerze napina się, warczy albo rzuca do psów',
    marketingDesc:
      'Szczeka, lunguje, warczy albo odpala się przy mijaniu. To kategoria dla reaktywności spacerowej, obrony zasobów i trudnych zachowań wobec ludzi lub zwierząt.',
    examples: ['owczarek agresywny do psów', 'pies warczy na gości', 'pies broni miski lub kanapy'],
    visualLabel: 'Trudny spacer',
  },
  {
    id: 'niszczenie',
    icon: 'spark',
    title: 'Pobudzenie, pogoń i niszczenie',
    desc: 'goni, demoluje i trudno mu się zatrzymać',
    marketingTitle: 'Goni auta, rowery i trudno mu się zatrzymać',
    marketingDesc:
      'Ruch, pogoń, demolka, ciągłe pobudzenie albo szczekanie z frustracji. Dobry wybór, gdy problemem jest nakręcanie się i brak wyciszenia.',
    examples: ['border collie goni wszystko', 'pies rzuca się na rowery', 'pies demoluje dom z pobudzenia'],
    visualLabel: 'Pogoń i pobudzenie',
  },
  {
    id: 'dogoterapia',
    icon: 'heart-paw',
    title: 'Dogoterapia',
    desc: 'rozmowa o celu, bezpieczeństwie i starcie z psem',
    marketingTitle: 'Dogoterapia i przygotowanie psa do spokojnej pracy',
    marketingDesc:
      'Pierwsza rozmowa o celu spotkań, odbiorcach, bezpieczeństwie i tym, jak ułożyć sensowny plan bez przeciążania psa.',
    examples: ['pierwsza rozmowa o spotkaniach', 'przygotowanie psa do pracy', 'jak ułożyć bezpieczny plan'],
    visualLabel: 'Praca z psem',
  },
  {
    id: 'inne',
    icon: 'compass',
    title: 'Inny temat do omówienia',
    desc: 'temat mieszany albo nietypowy',
    marketingTitle: 'Nie widzisz tu swojego przypadku?',
    marketingDesc:
      'Wybierz to, jeśli temat jest mieszany, zmienia się w czasie albo po prostu chcesz opisać go po swojemu przed rozmową.',
    examples: ['temat mieszany', 'dziwne zachowanie w domu', 'nie wiem, od czego zacząć'],
    visualLabel: 'Temat mieszany',
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
    desc: 'Po opłaceniu lub potwierdzeniu wpłaty widzisz link do rozmowy, materiały przygotowawcze i dalsze kroki.',
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
    a: 'Płatność online potwierdzona automatycznie nadal daje krótkie okno na samodzielną rezygnację. Przy wpłacie BLIK/przelewem potwierdzanej do 60 minut ewentualny zwrot wymaga kontaktu i indywidualnej decyzji.',
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

export function getSecondsUntilBookingStart(
  bookingDate: string,
  bookingTime: string,
  now = new Date(),
): number {
  const currentBoundary = getWarsawDateTimeParts(now)
  const bookingTimestamp = getPseudoUtcTimestamp(bookingDate, bookingTime)
  const currentTimestamp = getPseudoUtcTimestamp(currentBoundary.date, currentBoundary.time, currentBoundary.second)

  return Math.floor((bookingTimestamp - currentTimestamp) / 1000)
}

export function getSecondsUntilRoomUnlock(
  bookingDate: string,
  bookingTime: string,
  now = new Date(),
): number {
  return getSecondsUntilBookingStart(bookingDate, bookingTime, now) - 15 * 60
}

export function isCallRoomUnlocked(
  bookingDate: string,
  bookingTime: string,
  now = new Date(),
): boolean {
  return getSecondsUntilRoomUnlock(bookingDate, bookingTime, now) <= 0
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

export function compareDateAndTime(
  leftDate: string,
  leftTime: string,
  rightDate: string,
  rightTime: string,
): number {
  return `${leftDate}T${leftTime}`.localeCompare(`${rightDate}T${rightTime}`)
}
