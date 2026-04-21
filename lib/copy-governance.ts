import { FUNNEL_CTA_LABELS } from '@/lib/funnel'

export const COPY_SERVICE_NAMES = {
  primary: 'Kwadrans z behawiorysta',
  primaryShort: 'Kwadrans',
  primaryDescriptor: '15 min audio bez kamery',
  primaryOperational: 'Kwadrans z behawiorysta: 15 min audio bez kamery',
  bridge: 'Dwa kwadranse z behawiorysta',
  bridgeOperational: 'Dwa kwadranse z behawiorysta: 30 min online',
  consultation: 'pelna konsultacja behawioralna',
  consultationOperational: 'pelna konsultacja behawioralna online, ok. 2 h',
  toolkit: 'Niezbednik',
  toolkitOperational: 'Niezbednik - materialy do samodzielnej pracy',
  contact: 'wiadomosc',
} as const

export const COPY_CTA = {
  primary: FUNNEL_CTA_LABELS.primary,
  bridge: FUNNEL_CTA_LABELS.bridge,
  consultation: FUNNEL_CTA_LABELS.consultation,
  toolkit: FUNNEL_CTA_LABELS.secondary,
  contact: FUNNEL_CTA_LABELS.contact,
} as const

export const COPY_HELPERS = {
  primaryLead: 'Kwadrans z behawiorysta to 15 min audio bez kamery.',
  startFromAudio: 'Jesli nie wiesz, od czego zaczac, wybierz Kwadrans z behawiorysta.',
  startComparison:
    'Kwadrans z behawiorysta jest nazwa uslugi. 15 min audio bez kamery opisuje tylko jej format. Dwa kwadranse daja spokojniejszy start online, a pelna konsultacja behawioralna sprawdza sie przy sprawach szerszych, dluzszych albo wielowatkowych.',
  contactResponseWindow: 'Staram sie odpowiadac w ciagu 1-2 dni roboczych.',
  toolkitIntro:
    'Niezbednik to materialy, do ktorych mozesz wrocic przed rozmowa, po rozmowie albo wtedy, gdy chcesz spokojnie uporzadkowac temat.',
  reviewLead:
    'Jesli konsultacja byla pomocna, mozesz zostawic krotka opinie. Wystarczy kilka zdan o samej rozmowie.',
  reviewPrivacy:
    'Opinie publikowane sa z inicjalami, opcjonalnie z imieniem zwierzecia albo miastem, jesli chcesz to podac.',
  reviewInternalNote: 'To ukryty formularz do zebrania krotkiej opinii po konsultacji.',
  aftercareConfirmation:
    'Po potwierdzeniu wplaty zobaczysz termin, link do rozmowy i dalsza instrukcje.',
  paymentNoSales: 'Na tej stronie oplacasz rezerwacje i sprawdzasz jej status.',
} as const
