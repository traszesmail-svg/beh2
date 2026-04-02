import { ProblemType } from './types'

export const HOME_DOG_QUICK_CHOICE_PHOTO = {
  src: '/images/case-dog-black.jpg',
  alt: 'Czarny pies siedzÄ…cy w uporzÄ…dkowanym domowym wnÄ™trzu jako szybki wybĂłr Ĺ›cieĹĽki dla opiekuna psa',
}

export const HOME_CAT_QUICK_CHOICE_PHOTO = {
  src: '/images/case-cat-scratcher.jpg',
  alt: 'Kot przy drapaku w domowym kadrze jako szybki wybĂłr Ĺ›cieĹĽki dla opiekuna kota',
}

export const SITE_NAME = 'Regulski | Terapia behawioralna'
export const SITE_SHORT_NAME = 'Regulski'
export const SITE_URL_FALLBACK = 'http://localhost:3000'
export const PUBLIC_CONTACT_EMAIL_FALLBACK = 'coapebehawiorysta@gmail.com'
export const SITE_TAGLINE = 'Pomoc dla psów i kotów z trudnym zachowaniem'
export const SITE_DESCRIPTION = 'Pomoc dla psów i kotów z trudnym zachowaniem: konsultacje, pobyty i spokojny start.'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS =
  'behawiorysta COAPE / CAPBT, technik weterynarii, dogoterapeuta, dietetyk'
export const SPECIALIST_LOCATION = 'Olsztyn, woj. warmińsko-mazurskie'
export const COAPE_ORG_URL = 'https://coape.pl/'
export const CAPBT_ORG_URL = 'https://behawioryscicoape.pl/'
export const CAPBT_PROFILE_URL = 'https://behawioryscicoape.pl/behawiorysta/Regulski'
export const COAPE_LOGO = {
  src: '/branding/coape-polska.png',
  alt: 'Logo COAPE Polska',
}
export const CAPBT_LOGO = {
  src: '/branding/capbt-polska.png',
  alt: 'Logo CAPBT Polska, Stowarzyszenie Behawiorystów i Trenerów COAPE',
}
export const SPECIALIST_TRUST_STATEMENT = 'Pomagam spokojnie uporządkować sytuację i wybrać dobry następny krok.'
export const CONSULTATION_PRICE_COMPARE_COPY =
  'To pierwszy krok w szerszym systemie pracy, jeśli problem wymaga czegoś więcej niż jednej rozmowy.'

export const LANDING_SPECIALIST_PHOTO = {
  src: '/branding/specialist-krzysztof-portrait.jpg',
  alt: 'Krzysztof Regulski na portretowym zdjęciu do marki Regulski Terapia behawioralna',
}

export const SPECIALIST_PHOTO = LANDING_SPECIALIST_PHOTO

export const SPECIALIST_WIDE_PHOTO = {
  src: '/branding/specialist-krzysztof-wide.jpg',
  alt: 'Krzysztof Regulski trzymający kota w jasnym wnętrzu gabinetowym',
}

export const SPECIALIST_EXTENDED_START_PHOTO = {
  src: '/branding/specialist-krzysztof-about.png',
  alt: 'Krzysztof Regulski w spokojnym kadrze jako ilustracja rozszerzonej konsultacji 30 min',
}

export const SPECIALIST_ONLINE_PHOTO = {
  src: '/branding/specialist-krzysztof-social.jpg',
  alt: 'Krzysztof Regulski z kotem na szerokim kadrze jako ilustracja konsultacji online',
}

export const SITE_OG_IMAGE = {
  url: '/branding/specialist-krzysztof-social.jpg',
  width: 1200,
  height: 630,
  alt: 'Krzysztof Regulski z kotem na szerokim zdjęciu do udostępnień marki Regulski Terapia behawioralna',
} as const

export const SUPPORTING_SPECIALIST_PHOTO = {
  src: '/branding/case-dog-rest.jpg',
  alt: 'Spokojny pies odpoczywający w domowym otoczeniu',
}

export const CAT_HOME_PHOTO = {
  src: '/branding/case-cat-sofa.jpg',
  alt: 'Kot odpoczywający w spokojnym domowym otoczeniu jako ilustracja pracy z kuwetą, stresem i relacją w domu',
}

export const CATS_PAGE_PHOTO = {
  src: '/branding/specialist-krzysztof-vet.jpg',
  alt: 'Krzysztof Regulski podczas spokojnej pracy z kotem jako ilustracja konsultacji dla kotow',
}

export const SPECIALIST_CAT_PHOTO = {
  src: '/branding/specialist-krzysztof-vet.jpg',
  alt: 'Krzysztof Regulski podczas spokojnej pracy z kotem jako ilustracja konsultacji behawioralnej i terapii kotów',
}

export const THERAPY_PROCESS_PHOTO = {
  src: '/branding/specialist-krzysztof-vet.jpg',
  alt: 'Krzysztof Regulski podczas spokojnej pracy z kotem jako ilustracja dluzszego wsparcia',
}

export const HOME_VISIT_PHOTO = {
  src: '/branding/case-dog-home.jpg',
  alt: 'Pies w swoim domowym otoczeniu jako ilustracja konsultacji prowadzonej w miejscu codziennego funkcjonowania',
}

export const STAYS_PHOTO = {
  src: '/branding/case-dog-rest.jpg',
  alt: 'Spokojny pies odpoczywajacy w uporzadkowanej przestrzeni jako ilustracja pobytow socjalizacyjno-terapeutycznych',
}

export const HERO_SUPPORT_IMAGES = [
  {
    id: 'hero-dog',
    src: '/branding/case-dog-rest.jpg',
    alt: 'Spokojny pies odpoczywający w jasnym, domowym otoczeniu',
    label: 'Pies w domowym środowisku',
  },
  {
    id: 'hero-cat',
    src: '/branding/case-cat-sofa.jpg',
    alt: 'Kot odpoczywający w jasnym wnętrzu',
    label: 'Kot w spokojnym kadrze',
  },
] as const

export const TOPIC_VISUALS: Record<ProblemType, { src: string; alt: string }> = {
  szczeniak: {
    src: '/branding/topic-cards/puppy-hands.jpg',
    alt: 'Szczeniak przy dłoni opiekuna jako ilustracja gryzienia rąk i nauki wyciszenia',
  },
  kot: {
    src: '/branding/case-cat-sofa.jpg',
    alt: 'Kot odpoczywający w domowym otoczeniu jako ilustracja pracy z kuwetą, stresem i zachowaniem',
  },
  separacja: {
    src: '/branding/topic-cards/dog-window-alone.jpg',
    alt: 'Pies odpoczywający w domu jako ilustracja zostawania samemu, wyciszenia i pracy nad napięciem',
  },
  agresja: {
    src: '/branding/topic-cards/french-bulldog-leash.jpg',
    alt: 'Buldog francuski na smyczy w napięciu jako ilustracja reaktywności i trudnych spacerów',
  },
  niszczenie: {
    src: '/branding/topic-cards/border-collie-running.jpg',
    alt: 'Border collie w biegu jako ilustracja pogoni za ruchem i silnego pobudzenia',
  },
  dogoterapia: {
    src: HOME_VISIT_PHOTO.src,
    alt: 'Spokojny pies w domowym otoczeniu jako ilustracja przygotowania psa do pracy i bezpiecznego planu dogoterapii',
  },
  inne: {
    src: SPECIALIST_EXTENDED_START_PHOTO.src,
    alt: 'Krzysztof Regulski w spokojnym kadrze jako ilustracja konsultacji przy mieszanym lub nietypowym temacie',
  },
}

export type RealCaseStudy = {
  id: string
  imageSrc: string
  imageAlt: string
  sourceLabel: string
  sourceHref?: string
  problem: string
  summary: string
  effect: string
}

export const REAL_CASE_STUDIES: RealCaseStudy[] = [
  {
    id: 'fear-dog',
    imageSrc: '/branding/case-dog-rest.jpg',
    imageAlt: 'Spokojny pies odpoczywający w domowym otoczeniu',
    sourceLabel: 'Najczęstszy start: napięcie i zostawanie samemu',
    problem: 'Pies szczeka, nie wycisza się i trudno mu zostać samemu.',
    summary:
      'To typowa sprawa na pierwszą rozmowę: trzeba odróżnić przeciążenie, brak rutyny i możliwy lęk separacyjny od zwykłego pobudzenia.',
    effect:
      'Po 15 minutach opiekun wie, co wdrożyć od razu w domu, czego nie dokładać i czy lepsza będzie dłuższa rozmowa.',
  },
  {
    id: 'litter-box-cat',
    imageSrc: '/branding/case-cat-sofa.jpg',
    imageAlt: 'Kot odpoczywający w jasnym wnętrzu',
    sourceLabel: 'Najczęstszy start: kot, napięcie i kuweta',
    problem: 'Kot omija kuwetę albo wyraźnie sygnalizuje stres w domu.',
    summary:
      'W takich sytuacjach trzeba szybko uporządkować tło środowiskowe, napięcie w domu i moment, w którym warto wrócić do lekarza weterynarii.',
    effect:
      'Rozmowa daje jasny plan: co sprawdzić w domu, co zanotować i jaki następny krok ma sens bez chaotycznych porad.',
  },
  {
    id: 'multi-animal-home',
    imageSrc: '/branding/case-cat-snow.jpg',
    imageAlt: 'Kot stojący na śniegu i obserwujący otoczenie',
    sourceLabel: 'Najczęstszy start: konflikt i napięcie w domu',
    problem: 'Napięcie między zwierzętami, konflikt albo rozjazd relacji w domu.',
    summary:
      'Pierwsza konsultacja pomaga oddzielić sygnały ostrzegawcze od codziennych napięć i ustalić, co trzeba zabezpieczyć natychmiast.',
    effect:
      'Opiekun wychodzi z konkretem: co uspokoić dziś, jak zarządzić przestrzenią i czy trzeba umówić dłuższą rozmowę.',
  },
]

export type MediaMention = {
  id: string
  label: string
  title: string
  summary: string
  href: string
  cta: string
}

export const MEDIA_MENTIONS: MediaMention[] = [
  {
    id: 'magwet-litter-box',
    label: 'Publikacja · Magazyn Weterynaryjny',
    title:
      'Terapia farmakologiczna i behawioralna przy oddawaniu moczu poza kuwetą u kota. Przypadek kliniczny',
    summary:
      'Artykuł współautorski o klinicznym przypadku kota oddającego mocz poza kuwetą i o potrzebie łączenia pracy behawioralnej z tłem medycznym.',
    href: 'https://magwet.pl/31443,terapia-farmakologiczna-i-behawioralna-przy-oddawaniu-moczu-poza-kuweta-u-kota-przypadek-kliniczny',
    cta: 'Otwórz artykuł',
  },
  {
    id: 'magwet-fear',
    label: 'Publikacja · Magazyn Weterynaryjny',
    title: 'Strach, lęk i fobia u psów i kotów – różnicowanie i leczenie farmakologiczne',
    summary:
      'Artykuł współautorski o rozróżnianiu strachu, lęku i fobii oraz o momentach, kiedy sama rozmowa nie wystarcza i trzeba połączyć behawior z dalszym wsparciem weterynaryjnym.',
    href: 'https://magwet.pl/31564%2Cstrach-lek-i-fobia-u-psow-i-kotow-roznicowanie-i-leczenie-farmakologiczne',
    cta: 'Otwórz artykuł',
  },
]

type PublicPhone = {
  display: string | null
  href: string | null
}

function isValidPublicEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function extractConfiguredEmail(value: string | null): string | null {
  if (!value) {
    return null
  }

  const match = value.match(/<([^>]+)>/)
  const candidate = (match?.[1] ?? value).trim()

  return isValidPublicEmail(candidate) ? candidate : null
}

function normalizePublicPhone(value: string | null): PublicPhone {
  if (!value) {
    return { display: null, href: null }
  }

  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')

  if (!digits) {
    return { display: null, href: null }
  }

  if (digits.length === 9) {
    return {
      display: `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`,
      href: digits,
    }
  }

  if (digits.length === 11 && digits.startsWith('48')) {
    return {
      display: `+48 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`,
      href: `+${digits}`,
    }
  }

  return {
    display: trimmed,
    href: trimmed.replace(/\s+/g, ''),
  }
}

export function getContactDetails() {
  const emailCandidate =
    extractConfiguredEmail(process.env.BEHAVIOR15_CONTACT_EMAIL?.trim() || null) ?? PUBLIC_CONTACT_EMAIL_FALLBACK
  const phoneCandidate = process.env.BEHAVIOR15_CONTACT_PHONE?.trim() || null
  const phone = normalizePublicPhone(phoneCandidate)

  return {
    email: emailCandidate,
    phoneDisplay: phone.display,
    phoneHref: phone.href,
  }
}

export function getPublicContactDetails() {
  const contact = getContactDetails()

  return {
    email: contact.email,
    phoneDisplay: null,
    phoneHref: null,
  }
}

export function buildMailtoHref(email: string, subject: string, body?: string) {
  const params = new URLSearchParams({
    subject,
  })

  if (body) {
    params.set('body', body)
  }

  return `mailto:${email}?${params.toString()}`
}
