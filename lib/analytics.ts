export const ANALYTICS_CONSENT_STORAGE_KEY = 'behawior15.analytics.consent'
export const ANALYTICS_CONSENT_COOKIE = 'behawior15_analytics_consent'

export type AnalyticsConsentState = 'granted' | 'denied' | 'unset'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function readConsentCookie(): AnalyticsConsentState {
  if (typeof document === 'undefined') {
    return 'unset'
  }

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))

  if (!cookie) {
    return 'unset'
  }

  const value = cookie.split('=')[1]
  return value === 'granted' || value === 'denied' ? value : 'unset'
}

export function readAnalyticsConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') {
    return 'unset'
  }

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') {
      return stored
    }
  } catch {}

  return readConsentCookie()
}

export function persistAnalyticsConsent(consent: Exclude<AnalyticsConsentState, 'unset'>) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent)
  } catch {}

  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; Max-Age=31536000; Path=/; SameSite=Lax`
}

export function trackAnalyticsEvent(
  name: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  if (readAnalyticsConsent() !== 'granted') {
    return
  }

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

  window.gtag('event', name, payload)
}
