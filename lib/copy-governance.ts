import { FUNNEL_CTA_LABELS } from '@/lib/funnel'

export const COPY_SERVICE_NAMES = {
  primary: 'Kwadrans z behawiorystą',
  primaryOperational: 'Kwadrans z behawiorystą, 15 minut rozmowy audio',
  consultation: 'konsultacja 60 min',
  consultationOperational: 'pełna konsultacja behawioralna online',
  toolkit: 'Niezbędnik',
  toolkitOperational: 'Niezbędnik - materiały do samodzielnej pracy',
  contact: 'krótka wiadomość',
} as const

export const COPY_CTA = {
  primary: FUNNEL_CTA_LABELS.primary,
  consultation: FUNNEL_CTA_LABELS.consultation,
  toolkit: FUNNEL_CTA_LABELS.secondary,
  contact: FUNNEL_CTA_LABELS.contact,
} as const

export const COPY_HELPERS = {
  startFromAudio: 'Jeśli nie wiesz, od czego zacząć, wybierz Kwadrans z behawiorystą.',
  startComparison:
    'Kwadrans z behawiorystą jest dobrym startem przy jednym pytaniu albo na początek. Konsultacja 60 min lepiej sprawdza się przy sprawach szerszych, dłuższych albo wielowątkowych.',
  contactResponseWindow: 'Staram się odpowiadać w ciągu 1-2 dni roboczych.',
  toolkitIntro: 'Niezbędnik to materiały do spokojnej pracy we własnym tempie. Możesz z nich skorzystać przed rozmową, po rozmowie albo wtedy, gdy chcesz uporządkować temat.',
  reviewLead: 'Jeśli konsultacja pomogła, możesz zostawić krótką opinię. Pomaga to innym opiekunom ocenić, czego mogą się spodziewać.',
  reviewPrivacy:
    'Opinie publikowane są z inicjałami, opcjonalnie z imieniem zwierzęcia albo miastem, jeśli chcesz to podać.',
  reviewInternalNote:
    'To nie jest publiczna strona. Link służy do zebrania krótkiej opinii po konsultacji i ręcznej publikacji w zanonimizowanej formie.',
  aftercareConfirmation:
    'Po potwierdzeniu wpłaty zobaczysz termin, link do rozmowy i dalszą instrukcję.',
  paymentNoSales: 'Na tej stronie opłacasz rezerwację i sprawdzasz jej status.',
} as const
