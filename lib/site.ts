const DEFAULT_RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS = 'opiekun medyczny, technik weterynarii, dogoterapeuta, COAPE / CAPBT'
export const SPECIALIST_LOCATION = 'Olsztyn, woj. warmińsko-mazurskie'
export const COAPE_ORG_URL = 'https://coape.pl'
export const COAPE_PROFILE_URL = 'https://behawioryscicoape.pl/behawiorysta/Regulski'
export const CAPBT_PROFILE_URL = COAPE_PROFILE_URL
export const SPECIALIST_TRUST_STATEMENT = 'Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne.'

export const HERO_PHOTO = {
  src: '/branding/hero-krzysztof-cat.jpg',
  alt: 'Krzysztof Regulski trzyma kota podczas sesji zdjęciowej do strony Behawior 15',
}

export const SPECIALIST_PHOTO = {
  src: '/branding/specialist-krzysztof-about.png',
  alt: 'Krzysztof Regulski trzyma kota na rękach w zdjęciu o specjaliście',
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
    imageAlt: 'Czarny pies siedzący spokojnie w domu',
    sourceLabel: 'Magazyn Weterynaryjny · 08.11.2018',
    sourceHref: 'https://magwet.pl/31564%2Cstrach-lek-i-fobia-u-psow-i-kotow-roznicowanie-i-leczenie-farmakologiczne',
    problem: 'Pies wpada w silny lęk albo fobię dźwiękową.',
    summary:
      'To realny typ sprawy opisany w Magazynie Weterynaryjnym. Przy nasilonym lęku samo „przeczekanie” zwykle tylko wydłuża problem, dlatego trzeba rozróżnić zwykły strach od zaburzenia wymagającego szerszego planu.',
    effect:
      'Po pierwszej rozmowie wiesz, czy wystarczy domowy plan działania, czy trzeba szybko połączyć pracę behawioralną z dalszą konsultacją weterynaryjną.',
  },
  {
    id: 'relationships-cat-dog',
    imageSrc: '/branding/case-cat-snow.jpg',
    imageAlt: 'Kot stojący na śniegu nad zamarzniętą wodą',
    sourceLabel: 'Profil COAPE / CAPBT',
    sourceHref: COAPE_PROFILE_URL,
    problem: 'Napięcie między zwierzętami, agresja albo rozjazd w relacji pies-kot.',
    summary:
      'To jeden z publicznie opisanych obszarów pracy specjalisty w katalogu COAPE: agresja, odbudowa relacji i złożone problemy psów oraz kotów w jednym domu.',
    effect:
      'Pierwsza rozmowa porządkuje chaos: co jest pilne, czego nie robić od dziś i jaki następny krok ma sens w Twoim konkretnym układzie domowym.',
  },
  {
    id: 'litter-box-cat',
    imageSrc: '/branding/case-cat-sofa.jpg',
    imageAlt: 'Kot odpoczywający na ciemnej sofie',
    sourceLabel: 'Magazyn Weterynaryjny · 11.10.2018',
    sourceHref: 'https://magwet.pl/31443,terapia-farmakologiczna-i-behawioralna-przy-oddawaniu-moczu-poza-kuweta-u-kota-przypadek-kliniczny',
    problem: 'Kot oddaje mocz poza kuwetą i napięcie w domu narasta z dnia na dzień.',
    summary:
      'To realny przypadek kliniczny opisany w publikacji. W takich sprawach trzeba szybko oddzielić tło medyczne od behawioralnego i ustalić kolejność działań zamiast testować losowe porady z internetu.',
    effect:
      'Po rozmowie wychodzisz z jasną listą: co sprawdzić w środowisku kota, kiedy wrócić do lekarza weterynarii i czy problem wymaga szerszej terapii.',
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
    title: 'Terapia farmakologiczna i behawioralna przy oddawaniu moczu poza kuwetą u kota. Przypadek kliniczny',
    summary:
      'Artykuł współautorski opisujący kliniczny przypadek kota oddającego mocz poza kuwetą oraz potrzebę łączenia pracy behawioralnej z tłem medycznym.',
    href: 'https://magwet.pl/31443,terapia-farmakologiczna-i-behawioralna-przy-oddawaniu-moczu-poza-kuweta-u-kota-przypadek-kliniczny',
    cta: 'Otwórz artykuł',
  },
  {
    id: 'magwet-fear',
    label: 'Publikacja · Magazyn Weterynaryjny',
    title: 'Strach, lęk i fobia u psów i kotów – różnicowanie i leczenie farmakologiczne',
    summary:
      'Artykuł współautorski o różnicowaniu strachu, lęku i fobii oraz o tym, kiedy sama porada nie wystarcza i potrzebna jest równoległa terapia behawioralna i farmakologiczna.',
    href: 'https://magwet.pl/31564%2Cstrach-lek-i-fobia-u-psow-i-kotow-roznicowanie-i-leczenie-farmakologiczne',
    cta: 'Otwórz artykuł',
  },
]

function isValidPublicEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function extractEmailAddress(value: string): string | null {
  const match = value.match(/<([^>]+)>/)
  const candidate = match?.[1]?.trim() ?? value.trim()

  return isValidPublicEmail(candidate) ? candidate : null
}

export function getContactDetails() {
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim() || null
  const from = configuredFrom ?? DEFAULT_RESEND_FROM_EMAIL
  const email =
    extractEmailAddress(process.env.BEHAVIOR15_CONTACT_EMAIL?.trim() || '') ||
    (configuredFrom ? extractEmailAddress(from) : null)
  const phone = process.env.BEHAVIOR15_CONTACT_PHONE?.trim() || null

  return {
    email,
    phone,
  }
}
