import { ProblemType } from './types'

export const SITE_NAME = 'Behawior 15'
export const SITE_URL_FALLBACK = 'http://localhost:3000'
export const FACEBOOK_PROFILE_URL = 'https://www.facebook.com/krzysztof.regulski.148/'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS =
  'behawiorysta, technik weterynarii, opiekun medyczny, dogoterapeuta, COAPE/CAPBT'
export const SPECIALIST_LOCATION = 'Olsztyn, woj. warmińsko-mazurskie'
export const COAPE_ORG_URL = 'https://coape.pl'
export const COAPE_PROFILE_URL = 'https://behawioryscicoape.pl/behawiorysta/Regulski'
export const CAPBT_PROFILE_URL = COAPE_PROFILE_URL
export const SPECIALIST_TRUST_STATEMENT =
  'Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne.'
export const CONSULTATION_PRICE_COMPARE_COPY =
  'To krótki pierwszy krok przed pełną konsultacją, planem pracy albo dalszą diagnostyką.'

export const LANDING_SPECIALIST_PHOTO = {
  src: '/images/hero-main.png',
  alt: 'Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15',
}

export const HERO_PHOTO = LANDING_SPECIALIST_PHOTO
export const SPECIALIST_PHOTO = LANDING_SPECIALIST_PHOTO

export const SUPPORTING_SPECIALIST_PHOTO = {
  src: '/images/krzysztof-vet-action.jpg',
  alt: 'Krzysztof Regulski podczas pracy z kotem w gabinecie',
}

export const HERO_SUPPORT_IMAGES = [
  {
    id: 'hero-dog',
    src: '/images/case-dog-bed.jpg',
    alt: 'Biały pies leżący spokojnie na łóżku w świetle dziennym',
    label: 'Pies w domowym środowisku',
  },
  {
    id: 'hero-cat',
    src: '/images/case-cat-scratcher.jpg',
    alt: 'Kot siedzący przy drapaku i patrzący w obiektyw',
    label: 'Kot w spokojnym kadrze',
  },
] as const

export const TOPIC_VISUALS: Record<ProblemType, { src: string; alt: string }> = {
  szczeniak: {
    src: '/images/case-dog-bed.jpg',
    alt: 'Biały pies odpoczywający na łóżku',
  },
  kot: {
    src: '/images/case-cat-scratcher.jpg',
    alt: 'Kot siedzący przy drapaku',
  },
  separacja: {
    src: '/images/case-dog-black.jpg',
    alt: 'Czarny pies siedzący w domu i patrzący w stronę opiekuna',
  },
  agresja: {
    src: '/images/case-cat-snow.jpg',
    alt: 'Kot stojący na śniegu i obserwujący otoczenie',
  },
  niszczenie: {
    src: '/images/case-cat-sofa.jpg',
    alt: 'Kot odpoczywający na sofie w domu',
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
    imageSrc: '/images/case-dog-black.jpg',
    imageAlt: 'Czarny pies siedzący w domu',
    sourceLabel: 'Kategoria: lęk separacyjny i pobudzenie',
    problem: 'Pies szczeka, nie wycisza się i trudno mu zostać samemu.',
    summary:
      'To typowa sprawa na pierwszą rozmowę: trzeba odróżnić napięcie, brak rutyny i możliwy lęk separacyjny od zwykłego pobudzenia.',
    effect:
      'Po 15 minutach opiekun wie, co wdrożyć od razu w domu, czego nie dokładać i czy temat wymaga szerszej pracy.',
  },
  {
    id: 'litter-box-cat',
    imageSrc: '/images/case-cat-scratcher.jpg',
    imageAlt: 'Kot siedzący przy drapaku i patrzący w obiektyw',
    sourceLabel: 'Kategoria: kot i kuweta',
    problem: 'Kot omija kuwetę albo wyraźnie sygnalizuje stres w domu.',
    summary:
      'W takich sytuacjach trzeba szybko uporządkować tło środowiskowe, napięcie w domu i moment, w którym warto wrócić do lekarza weterynarii.',
    effect:
      'Rozmowa daje jasny plan: co sprawdzić w domu, co zanotować i jaki następny krok ma sens.',
  },
  {
    id: 'multi-animal-home',
    imageSrc: '/images/case-cat-snow.jpg',
    imageAlt: 'Kot stojący na śniegu i obserwujący otoczenie',
    sourceLabel: 'Kategoria: konflikt między zwierzętami',
    problem: 'Napięcie między zwierzętami, konflikt albo rozjazd relacji w domu.',
    summary:
      'Pierwsza konsultacja pomaga oddzielić sygnały ostrzegawcze od codziennych napięć i ustalić, co trzeba zabezpieczyć natychmiast.',
    effect:
      'Opiekun wychodzi z konkretem: co uspokoić dziś, jak zarządzić przestrzenią i kiedy potrzebna będzie dalsza praca.',
  },
  {
    id: 'overstimulation-home',
    imageSrc: '/images/case-cat-sofa.jpg',
    imageAlt: 'Kot odpoczywający na sofie',
    sourceLabel: 'Kategoria: niszczenie i pobudzenie',
    problem: 'Pobudzenie, hałas, niszczenie albo trudność z wyhamowaniem po bodźcach.',
    summary:
      'To częsty punkt startowy, gdy opiekun ma poczucie chaosu i nie wie już, które porady z internetu są bezpieczne, a które tylko dokładają napięcia.',
    effect:
      'Po rozmowie ma pierwszy spokojny plan i wie, czy wystarczy praca domowa, czy potrzebna będzie pełna konsultacja.',
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
    extractConfiguredEmail(process.env.BEHAVIOR15_CONTACT_EMAIL?.trim() || null) ??
    extractConfiguredEmail(process.env.RESEND_FROM_EMAIL?.trim() || null)
  const phoneCandidate = process.env.BEHAVIOR15_CONTACT_PHONE?.trim() || null
  const phone = normalizePublicPhone(phoneCandidate)

  return {
    email: emailCandidate,
    phoneDisplay: phone.display,
    phoneHref: phone.href,
    facebookUrl: FACEBOOK_PROFILE_URL,
  }
}
