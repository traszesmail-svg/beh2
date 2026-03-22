const DEFAULT_RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'

export const SPECIALIST_NAME = 'Krzysztof Regulski'
export const SPECIALIST_CREDENTIALS = 'tech.wet., behawiorysta zwierzecy i trener COAPE'
export const SPECIALIST_LOCATION = 'Olsztyn, woj. warminsko-mazurskie'
export const COAPE_PROFILE_URL = 'https://behawioryscicoape.pl/behawiorysta/Regulski'

function extractEmailAddress(value: string): string | null {
  const match = value.match(/<([^>]+)>/)

  if (match?.[1]) {
    return match[1]
  }

  return value.includes('@') ? value : null
}

export function getContactDetails() {
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_RESEND_FROM_EMAIL
  const email = process.env.BEHAVIOR15_CONTACT_EMAIL?.trim() || extractEmailAddress(from)
  const phone = process.env.BEHAVIOR15_CONTACT_PHONE?.trim() || null

  return {
    email,
    phone,
  }
}
