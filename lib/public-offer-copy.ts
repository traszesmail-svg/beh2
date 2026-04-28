export const PUBLIC_OFFER_PRICES = {
  quick: 69,
  urgent: 99,
  bridge: 169,
  premium: 470,
} as const

export const PUBLIC_OFFER_SERVICE_ORDER = [
  'Kwadrans z behawiorysta',
  'Dwa kwadranse',
  'Pelna konsultacja',
] as const

export const PUBLIC_OFFER_LEAD =
  'Masz do wyboru trzy formaty konsultacji: Kwadrans (15 min, 69 zl), Dwa kwadranse (30 min, 169 zl) albo Pelna konsultacja dla spraw zlozonych (60 min, 470 zl). Wybierasz ten, ktory pasuje do skali problemu — nie zaczynasz od najdrozszego.'

export const PUBLIC_OFFER_DECISION_COPY = {
  quick:
    'Kwadrans jest najprostszym startem, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, co robic dalej.',
  urgent:
    'Kwadrans na juz to ten sam 15-minutowy format audio co Kwadrans za 69 zl — roznica polega tylko na szybszym potwierdzeniu terminu (do 15 minut od wplaty). To nie jest dluzsza konsultacja.',
  bridge:
    'Dwa kwadranse sa dla tematow szerszych, gdy 15 minut to za malo, ale pelna konsultacja bylaby jeszcze zbyt szerokim startem.',
  premium:
    'Pelna konsultacja jest dla spraw zlozonych, przewleklych albo wielowatkowych, gdy potrzebujesz diagnozy, planu i wsparcia wdrozenia.',
} as const

export const PUBLIC_OFFER_START_GUIDE = [
  'Nie wiesz, od czego zaczac? Zacznij od Kwadransu.',
  '15 minut to za malo? Wybierz Dwa kwadranse.',
  'Sprawa jest zlozona albo przewlekla? Wybierz Pelna konsultacje.',
] as const

export const PUBLIC_OFFER_PRIORITY_VARIANT_NOTE =
  'Jesli zalezy Ci na mozliwie szybkim terminie, przy Kwadransie dostepny jest Kwadrans na juz (99 zl) — ten sam format, termin potwierdzany do 15 minut.'

export const PUBLIC_OFFER_BOOKING_PRIORITY_PROMPT =
  'Potrzebujesz rozmowy szybciej? Kwadrans na juz to ten sam 15-minutowy format audio, z terminem potwierdzanym do 15 minut od wplaty.'

export const PUBLIC_OFFER_BOOKING_PRIORITY_NOTE =
  'Kwadrans na juz ma identyczny zakres co zwykly Kwadrans. Roznica dotyczy tylko szybkosci potwierdzenia terminu, nie dlugosci ani tresci rozmowy.'

export const PUBLIC_OFFER_BOOKING_LEAD =
  'Wybierasz zakres konsultacji, ktory pasuje do skali problemu. Kwadrans jest najprostszym startem, Dwa kwadranse sa dla tematow szerszych, a Pelna konsultacja dla spraw zlozonych i przewleklych.'

export const PUBLIC_OFFER_BOOKING_REASSURANCE =
  'Nie musisz miec gotowej diagnozy. Wystarczy krotki opis sytuacji i propozycja terminow. Po wyslaniu formularza potwierdzam, ktory format i termin maja w Twojej sytuacji najwiecej sensu.'

export const PUBLIC_OFFER_BOOKING_PROCESS = [
  '1. Wybierasz zakres konsultacji i wpisujesz krotki opis sytuacji.',
  '2. Wracam z potwierdzeniem terminu albo najblizsza sensowna alternatywa.',
  '3. Po potwierdzeniu dostajesz dalszy krok platnosci i finalne potwierdzenie rozmowy.',
] as const

export const PUBLIC_OFFER_PAYMENT_METHODS = 'PayPal albo BLIK na telefon'

export const PUBLIC_OFFER_PAYMENT_EMAIL_STEP =
  'W mailu dostajesz przycisk do PayPal albo instrukcje BLIK na telefon.'

export const PUBLIC_OFFER_BOOKING_PAYMENT =
  `Najpierw uzgadniamy termin, dopiero potem wysylam dane do platnosci. Rezerwacje mozesz oplacic przez ${PUBLIC_OFFER_PAYMENT_METHODS}. Po wplacie wraca potwierdzenie i link do rozmowy.`

export const PUBLIC_OFFER_FULL_CONSULTATION_VALUE =
  'Pelna konsultacja nie jest dluzsza wersja Kwadransu. To osobny format dla spraw, ktore wymagaja wiecej czasu, szerszego tla i wsparcia po rozmowie. Obejmuje 60 minut konsultacji online, diagnoze sytuacji, aktualizowany plan pracy i 7 dni codziennych zalecen pod nadzorem behawiorysty dostepnego 8h dziennie przez WhatsApp.'

export const PUBLIC_OFFER_CANCELLATION_COPY =
  'Krotkie formaty maja 24 godziny na bezplatna rezygnacje po potwierdzeniu wplaty. Zmiane terminu ustalamy w tym samym oknie. Pelna konsultacja ma osobny regulamin.'

export const PUBLIC_OFFER_PRICING_DECISION_COPY = [
  'Kwadrans za 69 zl to najprostszy start, gdy chcesz nazwac problem i ustalic priorytet.',
  'Dwa kwadranse za 169 zl sa dla tematow szerszych, gdy 15 minut to za malo.',
  'Pelna konsultacja za 470 zl jest dla spraw zlozonych, przewleklych albo wielowatkowych.',
] as const

export const PUBLIC_OFFER_FULL_VALUE_POINTS = [
  '60 minut rozmowy online audio albo audio/video',
  'diagnoza sytuacji i kolejnych priorytetow',
  'aktualizowany plan pracy po rozmowie',
  '7 dni codziennych zalecen — behawiorysta dostepny 8h/dzien przez WhatsApp',
] as const
