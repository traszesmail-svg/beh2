import { AvailabilitySeed, ProblemOption, ProblemType } from './types'

const DOG_PROBLEM_OPTIONS_BASE: ProblemOption[] = [
  {
    id: 'szczeniak',
    icon: 'puppy',
    title: 'Szczeniak i młody pies',
    desc: 'Gryzienie, skakanie, pobudzenie i trudność z wyciszeniem.',
    marketingTitle: 'Szczeniak i młody pies',
    marketingDesc:
      'Podgryza dłonie, łapie za nogawki, skacze i w sekundę wkręca się na 200%. To dobry start, gdy w domu zrobiło się za głośno i trudno wrócić do spokoju.',
    examples: ['szczeniak gryzie ręce', 'szczeniak łapie za nogawki', 'młody pies nie umie odpuścić'],
    visualLabel: 'Szczeniak',
  },
  {
    id: 'separacja',
    icon: 'home',
    title: 'Problemy separacyjne',
    desc: 'Wycie, niszczenie, napięcie przy wyjściu i trudność z zostawaniem samemu.',
    marketingTitle: 'Problemy separacyjne',
    marketingDesc:
      'Jeśli pies nie radzi sobie po Twoim wyjściu, tu najłatwiej zacząć. Uporządkujemy, co jest napięciem, co rutyną, a co wygląda już jak problemy separacyjne.',
    examples: ['pies szczeka, gdy zostaje sam', 'pies drapie drzwi po wyjściu', 'nie mogę wyjść z domu bez stresu psa'],
    visualLabel: 'Separacja',
  },
  {
    id: 'spacer',
    icon: 'walking',
    title: 'Spacer i reakcje',
    desc: 'Ciągnięcie, szczekanie, rzucanie się i trudne mijanki.',
    marketingTitle: 'Spacer i reakcje',
    marketingDesc:
      'Szczeka, lunguje, warczy albo odpala się przy mijaniu. To kategoria dla reaktywności spacerowej i trudnych spotkań z psami, ludźmi, rowerami albo ruchem ulicznym.',
    examples: ['pies ciągnie na smyczy', 'pies szczeka na mijane psy', 'pies rzuca się do rowerów'],
    visualLabel: 'Spacer',
  },
  {
    id: 'pobudzenie',
    icon: 'spark',
    title: 'Pobudzenie i pogoń',
    desc: 'Nakręcanie się, pogoń za ruchem i trudność z wyhamowaniem.',
    marketingTitle: 'Pobudzenie i pogoń',
    marketingDesc:
      'Ruch, pogoń, demolka, ciągłe pobudzenie albo szczekanie z frustracji. Dobry wybór, gdy problemem jest nakręcanie się i brak wyciszenia.',
    examples: ['border collie goni wszystko', 'pies rzuca się na rowery', 'pies demoluje dom z pobudzenia'],
    visualLabel: 'Pogoń',
  },
  {
    id: 'agresja',
    icon: 'shield',
    title: 'Agresja i obrona zasobów',
    desc: 'Warknięcia, obrona jedzenia, legowiska, zabawek albo przestrzeni.',
    marketingTitle: 'Agresja i obrona zasobów',
    marketingDesc:
      'Kategoria dla reakcji obronnych, ochrony jedzenia, legowiska, zabawek albo przestrzeni. Pomaga oddzielić napięcie od samego zachowania.',
    examples: ['pies warczy przy misce', 'pies broni kanapy', 'pies rzuca się przy dotyku'],
    visualLabel: 'Obrona',
  },
]

const CAT_PROBLEM_OPTIONS_BASE: ProblemOption[] = [
  {
    id: 'kot-kuweta',
    icon: 'cat',
    title: 'Kuweta i zachowania toaletowe',
    desc: 'Sikanie poza kuwetą, omijanie kuwety albo napięcie wokół toalety.',
    marketingTitle: 'Kuweta i zachowania toaletowe',
    marketingDesc:
      'Najczęstszy start przy kuwecie: omijanie kuwety, napięcie przy zasobach albo sygnały, które trzeba szybko odróżnić od alarmu weterynaryjnego.',
    examples: ['kot sika poza kuwetą', 'kot omija kuwetę', 'nagła zmiana korzystania z kuwety'],
    visualLabel: 'Kuweta',
  },
  {
    id: 'kot-konflikt',
    icon: 'cat',
    title: 'Konflikt między kotami',
    desc: 'Gonitwy, blokowanie przejść, napięcie przy zasobach i trudna relacja.',
    marketingTitle: 'Konflikt między kotami',
    marketingDesc:
      'Dla napięcia między kotami, blokowania przejść, gonitw i sygnałów, że wspólne mieszkanie przestaje być spokojne.',
    examples: ['kot atakuje drugiego kota', 'gonitwy po domu', 'blokowanie kuwety lub miski'],
    visualLabel: 'Konflikt',
  },
  {
    id: 'kot-dotyk',
    icon: 'cat',
    title: 'Dotyk, pielęgnacja i obrona',
    desc: 'Gryzienie przy dotyku, obrona przy zabiegach i trudna pielęgnacja.',
    marketingTitle: 'Dotyk, pielęgnacja i obrona',
    marketingDesc:
      'Na start przy trudnym dotyku, obronie przy głaskaniu, noszeniu albo domowych zabiegach pielęgnacyjnych.',
    examples: ['kot gryzie przy głaskaniu', 'kot nie daje obciąć pazurów', 'kot atakuje przy noszeniu'],
    visualLabel: 'Dotyk',
  },
  {
    id: 'kot-stres',
    icon: 'cat',
    title: 'Lęk, stres i wycofanie',
    desc: 'Chowanie się, napięcie po zmianach i trudność z powrotem do spokoju.',
    marketingTitle: 'Lęk, stres i wycofanie',
    marketingDesc:
      'Dla kota, który żyje w napięciu, dużo się chowa, źle znosi zmiany albo stale wysyła sygnały przeciążenia.',
    examples: ['kot chowa się cały dzień', 'kot boi się gości', 'kot po zmianie nie wraca do równowagi'],
    visualLabel: 'Stres',
  },
  {
    id: 'kot-nocna-wokalizacja',
    icon: 'cat',
    title: 'Nocna aktywność i rytm dnia',
    desc: 'Miauczenie w nocy, pobudki o świcie i rozsypany rytm domu.',
    marketingTitle: 'Nocna aktywność i rytm dnia',
    marketingDesc:
      'Dla nocnego miauczenia, pobudek o świcie i rytmu dnia, który rozsypuje spokój w domu.',
    examples: ['kot miauczy po nocy', 'kot budzi dom o 4 rano', 'nocne gonitwy i wokalizacja'],
    visualLabel: 'Noc',
  },
]

const MISC_PROBLEM_OPTION: ProblemOption = {
  id: 'inne',
  icon: 'compass',
  title: 'Inny problem lub temat pokrewny',
  desc: 'Jeśli problem nie pasuje dokładnie do powyższych kategorii.',
  marketingTitle: 'Inny problem lub temat pokrewny',
  marketingDesc:
    'Wybierz to, jeśli temat jest szerszy, łączy kilka wątków albo chcesz opisać go po swojemu przed rozmową.',
  examples: ['temat szerszy', 'kilka problemów naraz', 'chcę opisać po swojemu'],
  visualLabel: 'Temat szerszy',
}

const LEGACY_PROBLEM_LABELS: Record<string, string> = {
  kot: 'Kot',
  niszczenie: 'Pobudzenie i pogoń',
}

export const problemOptions: ProblemOption[] = [...DOG_PROBLEM_OPTIONS_BASE, ...CAT_PROBLEM_OPTIONS_BASE, MISC_PROBLEM_OPTION]

export const CAT_PROBLEM_OPTIONS: ProblemOption[] = CAT_PROBLEM_OPTIONS_BASE

export const DOG_PROBLEM_OPTIONS: ProblemOption[] = [...DOG_PROBLEM_OPTIONS_BASE, MISC_PROBLEM_OPTION]

export const steps = [
  {
    n: '01',
    title: 'Wybierasz temat',
    desc: 'Na spokojnie wskazujesz, czego dotyczy sytuacja.',
  },
  {
    n: '02',
    title: 'Widzisz, co dalej',
    desc: 'Od razu wiesz, czy kolejnym ruchem jest termin, wiadomość czy materiał PDF.',
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
    a: 'To szybka konsultacja porządkująca sytuację. Jej celem jest wstępna ocena problemu i pierwszy, konkretny kierunek działania, a nie pełna terapia behawioralna.',
  },
  {
    q: 'Czy zakup jest bezpieczny?',
    a: 'Tak. Możesz wybrać prostą wpłatę BLIK/przelewem, a link do rozmowy odblokowuje się dopiero po potwierdzeniu wpłaty.',
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

export function getProblemLabel(problem: string): string {
  return problemOptions.find((item) => item.id === problem)?.title ?? LEGACY_PROBLEM_LABELS[problem] ?? 'Konsultacja'
}

export function isCatProblemType(value: string | null | undefined): value is ProblemType {
  return CAT_PROBLEM_OPTIONS.some((option) => option.id === value)
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
