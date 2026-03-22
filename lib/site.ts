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
  src: '/branding/specialist-krzysztof-vet.jpg',
  alt: 'Krzysztof Regulski podczas pracy z kotem na stole zabiegowym',
}

export type RealCaseStudy = {
  id: string
  imageSrc: string
  imageAlt: string
  problem: string
  summary: string
  effect: string
}

export const REAL_CASE_STUDIES: RealCaseStudy[] = [
  {
    id: 'dog-home-material',
    imageSrc: '/branding/case-dog-home.jpg',
    imageAlt: 'Czarny pies siedzący spokojnie w domu',
    problem: 'Realny materiał klienta: pies',
    summary:
      'To jedno z prawdziwych zdjęć przekazanych do przyszłej sekcji opinii. Po konsultacji klient dostaje link do dodania krótkiej opinii i sam decyduje, czy zgadza się na publikację opisu problemu.',
    effect: 'Pełny opis efektu dodajemy dopiero po autoryzacji opiekuna.',
  },
  {
    id: 'cat-snow-material',
    imageSrc: '/branding/case-cat-snow.jpg',
    imageAlt: 'Kot stojący na śniegu nad zamarzniętą wodą',
    problem: 'Realny materiał klienta: kot',
    summary:
      'Zdjęcie zostało wybrane do sekcji realnych przypadków, ale bez zgody opiekuna nie dopowiadamy historii. Dzięki temu na stronie nie pojawiają się wymyślone opinie ani marketingowe skróty.',
    effect: 'Kiedy klient zatwierdzi publikację, uzupełnimy konkretny problem, przebieg pracy i wynik.',
  },
  {
    id: 'cat-sofa-material',
    imageSrc: '/branding/case-cat-sofa.jpg',
    imageAlt: 'Kot odpoczywający na ciemnej sofie',
    problem: 'Realny materiał klienta: historia czeka na publikację',
    summary:
      'Sekcja jest już przygotowana pod zdjęcie, krótki opis i rezultat. Po rozmowie klient otrzyma link do opinii, więc z czasem to miejsce zacznie pracować także marketingowo.',
    effect: 'Na razie pokazujemy tylko uczciwy materiał zdjęciowy i miejsce na zatwierdzoną historię.',
  },
]

export const REAL_CASES_EMPTY_STATE =
  'Po konsultacji klient dostaje link do dodania opinii i zgody na publikację historii. Pokazujemy wyłącznie zatwierdzone przypadki, bez zmyślonych opinii i bez stockowych zdjęć.'

export type MediaMention = {
  id: string
  title: string
  summary: string
  href?: string
  cta?: string
  placeholder?: boolean
}

export const MEDIA_MENTIONS: MediaMention[] = [
  {
    id: 'magwet',
    title: 'Magazyn Weterynaryjny',
    summary:
      'Zweryfikowana wzmianka autorska: artykuł „Strach, lęk i fobia u psów i kotów – różnicowanie i leczenie farmakologiczne” z podpisem Krzysztof Regulski jako współautora.',
    href: 'https://magwet.pl/31564%2Cstrach-lek-i-fobia-u-psow-i-kotow-roznicowanie-i-leczenie-farmakologiczne',
    cta: 'Otwórz publikację',
  },
  {
    id: 'publication-slot-1',
    title: 'Miejsce na screen publikacji 01',
    summary: 'Układ jest gotowy pod pierwszy screen z publikacji lub wzmianki medialnej, bez przebudowy sekcji.',
    placeholder: true,
  },
  {
    id: 'publication-slot-2',
    title: 'Miejsce na screen publikacji 02',
    summary: 'Drugi slot czeka na screen po akceptacji materiału. Zachowuje proporcje i spacing także na mobile.',
    placeholder: true,
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
