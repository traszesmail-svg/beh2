import { FUNNEL_CTA_LABELS } from '@/lib/funnel'

export const COPY_SERVICE_NAMES = {
  primary: 'Kwadrans z behawiorystą',
  primaryOperational: 'Kwadrans z behawiorystą, 15 min audio bez kamery',
  consultation: 'konsultacja 60 min',
  consultationOperational: 'konsultacja behawioralna online 60 min',
  toolkit: 'Niezbędnik',
  toolkitOperational: 'Niezbędnik - materiały do samodzielnej pracy',
  contact: 'wiadomość',
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
    'Kwadrans z behawiorystą to najprostszy start, gdy chcesz omówić jedno pytanie albo spokojnie uporządkować temat. Konsultacja 60 min lepiej sprawdza się przy sprawach szerszych, dłuższych albo wielowątkowych.',
  contactResponseWindow: 'Staram się odpowiadać w ciągu 1-2 dni roboczych.',
  toolkitIntro:
    'Niezbędnik to materiały, do których możesz wrócić przed rozmową, po rozmowie albo wtedy, gdy chcesz spokojnie uporządkować temat.',
  reviewLead:
    'Jeśli konsultacja była pomocna, możesz zostawić krótką opinię. Wystarczy kilka zdań o samej rozmowie.',
  reviewPrivacy:
    'Opinie publikowane są z inicjałami, opcjonalnie z imieniem zwierzęcia albo miastem, jeśli chcesz to podać.',
  reviewInternalNote:
    'To ukryty formularz do zebrania krótkiej opinii po konsultacji.',
  aftercareConfirmation:
    'Po potwierdzeniu wpłaty zobaczysz termin, link do rozmowy i dalszą instrukcję.',
  paymentNoSales: 'Na tej stronie opłacasz rezerwację i sprawdzasz jej status.',
} as const
