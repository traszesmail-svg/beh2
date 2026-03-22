const DEFAULT_RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS = 'opiekun medyczny, technik weterynarii, dogoterapeuta, COAPE / CAPBT'
export const SPECIALIST_LOCATION = 'Olsztyn, woj. warmińsko-mazurskie'
export const COAPE_PROFILE_URL = 'https://behawioryscicoape.pl/behawiorysta/Regulski'
export const SPECIALIST_TRUST_STATEMENT = 'Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne.'

export type RealCaseStudy = {
  id: string
  imageSrc: string
  imageAlt: string
  problem: string
  summary: string
  effect: string
}

export const REAL_CASE_STUDIES: RealCaseStudy[] = []
export const REAL_CASES_EMPTY_STATE =
  'Po konsultacji klient dostaje link do dodania opinii i zgody na publikację historii. Pokazujemy wyłącznie zatwierdzone przypadki, bez zmyślonych opinii i bez stockowych zdjęć.'

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
