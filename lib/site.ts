import { ProblemType } from './types'

export const SITE_NAME = 'Behawior 15'
export const SITE_URL_FALLBACK = 'http://localhost:3000'
export const FACEBOOK_PROFILE_URL = 'https://www.facebook.com/krzysztof.regulski.148/'
export const PUBLIC_CONTACT_EMAIL_FALLBACK = 'coapebehawiorysta@gmail.com'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS =
  'behawiorysta, technik weterynarii, opiekun medyczny, dogoterapeuta, COAPE/CAPBT'
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
export const SPECIALIST_TRUST_STATEMENT =
  'Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne.'
export const CONSULTATION_PRICE_COMPARE_COPY =
  'To krótki pierwszy krok przed pełną konsultacją, planem pracy albo dalszą diagnostyką.'

export const LANDING_SPECIALIST_PHOTO = {
  src: '/images/hero-main.png',
  alt: 'Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15',
}

export const SPECIALIST_PHOTO = LANDING_SPECIALIST_PHOTO

export const SUPPORTING_SPECIALIST_PHOTO = {
  src: '/branding/specialist-krzysztof-vet.jpg',
  alt: 'Krzysztof Regulski podczas pracy z kotem w gabinecie',
}

export const HERO_SUPPORT_IMAGES = [
  {
    id: 'hero-dog',
    src: '/branding/case-dog-home.jpg',
    alt: 'Spokojny pies w jasnym, domowym otoczeniu',
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
    src: '/branding/case-dog-home.jpg',
    alt: 'Spokojny pies odpoczywający w domowym otoczeniu',
  },
  kot: {
    src: '/branding/case-cat-sofa.jpg',
    alt: 'Kot odpoczywający w jasnym wnętrzu',
  },
  separacja: {
    src: '/images/case-dog-black.jpg',
    alt: 'Czarny pies siedzący w domu i patrzący w stronę opiekuna',
  },
  agresja: {
    src: '/branding/case-cat-snow.jpg',
    alt: 'Kot stojący na śniegu i obserwujący otoczenie',
  },
  niszczenie: {
    src: '/branding/case-cat-sofa.jpg',
    alt: 'Kot odpoczywający na sofie w domu',
  },
  dogoterapia: {
    src: '/branding/case-dog-home.jpg',
    alt: 'Spokojny pies w domowym otoczeniu jako ilustracja dogoterapii',
  },
  inne: {
    src: '/images/case-dog-black.jpg',
    alt: 'Czarny pies w spokojnym ujęciu domowym',
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
    imageSrc: '/branding/case-dog-home.jpg',
    imageAlt: 'Spokojny pies w domowym otoczeniu',
    sourceLabel: 'Najczęstszy start: napięcie i zostawanie samemu',
    problem: 'Pies szczeka, nie wycisza się i trudno mu zostać samemu.',
    summary:
      'To typowa sprawa na pierwszą rozmowę: trzeba odróżnić przeciążenie, brak rutyny i możliwy lęk separacyjny od zwykłego pobudzenia.',
    effect:
      'Po 15 minutach opiekun wie, co wdrożyć od razu w domu, czego nie dokładać i czy temat wymaga spokojniejszej, szerszej pracy.',
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
      'Opiekun wychodzi z konkretem: co uspokoić dziś, jak zarządzić przestrzenią i kiedy potrzebna będzie dalsza praca.',
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
    facebookUrl: FACEBOOK_PROFILE_URL,
  }
}
