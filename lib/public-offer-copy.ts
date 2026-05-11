export const PUBLIC_OFFER_PRICES = {
  quick: 69,
  urgent: 99,
  bridge: 169,
  premium: 470,
} as const

export const PUBLIC_OFFER_SERVICE_ORDER = [
  '15-minutowa konsultacja behawioralna',
  'Dwa kwadranse',
  'Pełna konsultacja',
] as const

export const PUBLIC_OFFER_LEAD =
  'Masz do wyboru trzy formaty konsultacji: Kwadrans (15 min, 69 zł), Dwa kwadranse (30 min, 169 zł) albo Pełna konsultacja dla spraw złożonych (470 zł). Wybierasz ten, który pasuje do skali problemu — nie zaczynasz od najdroższego.'

export const PUBLIC_OFFER_DECISION_COPY = {
  quick:
    'Kwadrans jest najprostszym startem, gdy chcesz nazwać problem, ustalić priorytet i wiedzieć, co robić dalej.',
  urgent:
    'Kwadrans na już to ten sam 15-minutowy format audio co Kwadrans za 69 zł — różnica polega tylko na szybszym potwierdzeniu terminu (do 15 minut od wpłaty). To nie jest dłuższa konsultacja.',
  bridge:
    'Dwa kwadranse są dla tematów szerszych, gdy 15 minut to za mało, ale pełna konsultacja byłaby jeszcze zbyt szerokim startem.',
  premium:
    'Pełna konsultacja jest dla spraw złożonych, przewlekłych albo wielowątkowych, gdy potrzebujesz diagnozy, planu i wsparcia wdrożenia.',
} as const

export const PUBLIC_OFFER_START_GUIDE = [
  'Nie wiesz, od czego zacząć? Zacznij od Kwadransu.',
  '15 minut to za mało? Wybierz Dwa kwadranse.',
  'Sprawa jest złożona albo przewlekła? Wybierz Pełną konsultację.',
] as const

export const PUBLIC_OFFER_PRIORITY_VARIANT_NOTE =
  'Jeśli zależy Ci na możliwie szybkim terminie, przy Kwadransie dostępny jest Kwadrans na już (99 zł) - ten sam format, termin potwierdzany do 15 minut.'

export const PUBLIC_OFFER_BOOKING_PRIORITY_PROMPT =
  'Potrzebujesz rozmowy szybciej? Kwadrans na już to ten sam 15-minutowy format audio, z terminem potwierdzanym do 15 minut od wpłaty.'

export const PUBLIC_OFFER_BOOKING_PRIORITY_NOTE =
  'Kwadrans na już ma identyczny zakres co zwykły Kwadrans. Różnica dotyczy tylko szybkości potwierdzenia terminu, nie długości ani treści rozmowy.'

export const PUBLIC_OFFER_BOOKING_LEAD =
  'Wybierasz zakres konsultacji, który pasuje do skali problemu. Kwadrans jest najprostszym startem, Dwa kwadranse są dla tematów szerszych, a Pełna konsultacja dla spraw złożonych i przewlekłych.'

export const PUBLIC_OFFER_BOOKING_REASSURANCE =
  'Nie musisz mieć gotowej diagnozy. Wystarczy krótki opis sytuacji i propozycja terminów. Po wysłaniu formularza potwierdzam, który format i termin mają w Twojej sytuacji najwięcej sensu.'

export const PUBLIC_OFFER_BOOKING_PROCESS = [
  '1. Wybierasz zakres konsultacji i wpisujesz krótki opis sytuacji.',
  '2. Wracam z potwierdzeniem terminu albo najbliższą sensowną alternatywą.',
  '3. Po potwierdzeniu dostajesz dalszy krok płatności i finalne potwierdzenie rozmowy.',
] as const

export const PUBLIC_OFFER_PAYMENT_METHODS = 'PayPal albo BLIK na telefon'

export const PUBLIC_OFFER_PAYMENT_EMAIL_STEP =
  'W mailu dostajesz przycisk do PayPal albo instrukcję BLIK na telefon.'

export const PUBLIC_OFFER_BOOKING_PAYMENT =
  `Najpierw uzgadniamy termin, dopiero potem wysyłam dane do płatności. Rezerwacje możesz opłacić przez ${PUBLIC_OFFER_PAYMENT_METHODS}. Po wpłacie wraca potwierdzenie i link do rozmowy.`

export const PUBLIC_OFFER_FULL_CONSULTATION_VALUE =
  'Pełna konsultacja nie jest dłuższą wersją Kwadransu. To osobny format dla spraw, które wymagają więcej czasu, szerszego tła i wsparcia po rozmowie. Obejmuje konsultację online, diagnozę sytuacji, aktualizowany plan pracy i 7 dni codziennych zaleceń pod nadzorem behawiorysty dostępnego 8h dziennie przez WhatsApp.'

export const PUBLIC_OFFER_CANCELLATION_COPY =
  'Krótkie formaty mają 24 godziny na bezpłatną rezygnację po potwierdzeniu wpłaty. Zmianę terminu ustalamy w tym samym oknie. Pełna konsultacja ma osobny regulamin.'

export const PUBLIC_OFFER_PRICING_DECISION_COPY = [
  'Kwadrans za 69 zł to najprostszy start, gdy chcesz nazwać problem i ustalić priorytet.',
  'Dwa kwadranse za 169 zł są dla tematów szerszych, gdy 15 minut to za mało.',
  'Pełna konsultacja za 470 zł jest dla spraw złożonych, przewlekłych albo wielowątkowych.',
] as const

export const PUBLIC_OFFER_FULL_VALUE_POINTS = [
  'Rozmowa online audio albo audio/video',
  'diagnoza sytuacji i kolejnych priorytetów',
  'aktualizowany plan pracy po rozmowie',
  '7 dni codziennych zaleceń — behawiorysta dostępny 8h dziennie przez WhatsApp',
] as const
