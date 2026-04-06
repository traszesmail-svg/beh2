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

function getPagePath() {
  if (typeof window === 'undefined') {
    return null
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function isQaBookingPage() {
  if (typeof document === 'undefined') {
    return false
  }

  return Boolean(document.querySelector('[data-qa-booking="true"]'))
}

function isAnalyticsDisabledPage() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/_internal')) {
    return true
  }

  return Boolean(document.querySelector('[data-analytics-disabled="true"]'))
}

function postInternalAnalyticsEvent(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return
  }

  const body = JSON.stringify(payload)

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const ok = navigator.sendBeacon(
        '/api/analytics/events',
        new Blob([body], {
          type: 'application/json',
        }),
      )

      if (ok) {
        return
      }
    } catch {}
  }

  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => {})
}

export function trackAnalyticsEvent(
  name: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  if (readAnalyticsConsent() !== 'granted') {
    return
  }

  if (isAnalyticsDisabledPage()) {
    return
  }

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

  postInternalAnalyticsEvent({
    eventType: name,
    qaBooking: isQaBookingPage(),
    pagePath: getPagePath(),
    properties: payload,
    consent: 'granted',
  })

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload)
  }
}
