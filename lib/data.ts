import { AvailabilitySeed, ProblemOption, ProblemType } from './types'

export const problemOptions: ProblemOption[] = [
  { id: 'szczeniak', icon: 'puppy', title: 'Szczeniak i mlody pies', desc: 'gryzienie, nauka czystosci, pobudzenie i pierwsze zasady w domu' },
  { id: 'kot', icon: 'cat', title: 'Kot i trudne zachowania', desc: 'problemy z kuweta, napiecie, wokalizacja i trudnosci w domu' },
  { id: 'separacja', icon: 'home', title: 'Lek separacyjny', desc: 'wycie, niszczenie, trudnosc zostawania samemu i napiecie po wyjsciu opiekuna' },
  { id: 'agresja', icon: 'shield', title: 'Agresja i reakcje obronne', desc: 'trudne zachowania wobec ludzi, zwierzat lub w codziennych sytuacjach' },
  { id: 'niszczenie', icon: 'spark', title: 'Szczekanie, niszczenie, pobudzenie', desc: 'halas, rozregulowanie i trudnosc z wyciszeniem lub kontrola emocji' },
  { id: 'inne', icon: 'compass', title: 'Inny temat do omowienia', desc: 'gdy chcesz szybko uporzadkowac sytuacje i dostac pierwszy kierunek dzialania' },
]

export const steps = [
  { n: '01', title: 'Wybierasz temat', desc: 'Okreslasz, czego dotyczy trudnosc, i sprawdzasz realnie wolne terminy.' },
  { n: '02', title: 'Rezerwujesz i oplacasz', desc: 'Podajesz dane, blokujesz termin na czas platnosci i przechodzisz do bezpiecznego checkoutu.' },
  { n: '03', title: 'Dostajesz rozmowe i dalszy kierunek', desc: 'Po oplaceniu otrzymujesz potwierdzenie, link do rozmowy audio i jasny kolejny krok po konsultacji.' },
]

export const faq = [
  {
    q: 'Czy 15 minut wystarczy?',
    a: 'To szybka konsultacja porzadkujaca sytuacje. Jej celem jest wstepna ocena problemu i pierwszy, konkretny kierunek dzialania.',
  },
  {
    q: 'Czy konsultacja dotyczy rowniez kotow?',
    a: 'Tak. Konsultacja jest przeznaczona dla opiekunow psow i kotow, takze w sprawach dotyczacych kuwety, stresu i napiecia.',
  },
  {
    q: 'Czy musze cos instalowac?',
    a: 'Nie. Rezerwacja, platnosc i dolaczenie do rozmowy glosowej dzialaja w przegladarce telefonu albo komputera.',
  },
  {
    q: 'Co dzieje sie po rozmowie?',
    a: 'Po rozmowie otrzymujesz wskazowki, co robic dalej. W razie potrzeby kolejnym krokiem moze byc pelna konsultacja, plan pracy, wizyta domowa albo dalsze wsparcie.',
  },
  {
    q: 'Czy to jest konsultacja glosowa?',
    a: 'Tak. Ten 15-minutowy produkt jest przygotowany jako rozmowa audio online. Kamera nie jest potrzebna.',
  },
]

export const availabilitySeed: AvailabilitySeed[] = [
  { date: '2026-03-20', times: ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00'] },
  { date: '2026-03-21', times: ['09:00', '09:20', '09:40', '10:00', '10:20', '17:00', '17:20'] },
  { date: '2026-03-22', times: ['11:00', '11:20', '11:40', '18:00', '18:20'] },
  { date: '2026-03-23', times: ['09:00', '09:20', '16:00', '16:20', '16:40'] },
]

export function getProblemLabel(problem: ProblemType): string {
  return problemOptions.find((item) => item.id === problem)?.title ?? 'Konsultacja'
}

export function getBookingStatusLabel(status: 'pending' | 'confirmed' | 'done' | 'cancelled' | 'expired'): string {
  switch (status) {
    case 'pending':
      return 'Oczekuje na platnosc'
    case 'confirmed':
      return 'Potwierdzona'
    case 'done':
      return 'Zakonczona'
    case 'cancelled':
      return 'Anulowana'
    case 'expired':
      return 'Wygasla'
    default:
      return status
  }
}

export function getPaymentStatusLabel(status: 'unpaid' | 'paid' | 'failed' | 'refunded'): string {
  switch (status) {
    case 'unpaid':
      return 'Nieoplacona'
    case 'paid':
      return 'Oplacona'
    case 'failed':
      return 'Platnosc nieudana'
    case 'refunded':
      return 'Zwrocona'
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
