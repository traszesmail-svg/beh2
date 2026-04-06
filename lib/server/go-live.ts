import { getBaseUrl, getDataModeStatus } from '@/lib/server/env'
import { getCustomerEmailDeliveryStatus } from '@/lib/server/notifications'
import { getPayuOptionStatus } from '@/lib/server/payment-options'

const EXTERNAL_CUSTOMER_SMOKE_EMAIL = 'customer@example.com'

export type GoLiveCheckTone = 'ready' | 'attention'

export type GoLiveCheck = {
  id: 'data-runtime' | 'app-url' | 'customer-email' | 'payu-online'
  label: string
  statusLabel: string
  tone: GoLiveCheckTone
  summary: string
  nextStep: string
}

type PublicUrlProbeResult = {
  ok: boolean
  status: number | null
  details: string
}

function getDataRuntimeGoLiveCheck(): GoLiveCheck {
  const data = getDataModeStatus()

  if (data.isValid && data.active === 'supabase' && !data.usesFallback) {
    return {
      id: 'data-runtime',
      label: 'Warstwa danych',
      statusLabel: 'Gotowe',
      tone: 'ready',
      summary: 'Warstwa danych jest gotowa do ruchu live i korzysta z Supabase zamiast lokalnego fallbacku JSON.',
      nextStep: 'Brak blokera po stronie runtime danych.',
    }
  }

  return {
    id: 'data-runtime',
    label: 'Warstwa danych',
    statusLabel: 'Bloker',
    tone: 'attention',
    summary: `Warstwa danych nie jest gotowa do ruchu live: ${data.summary}`,
    nextStep: 'Ustaw prawidlowy runtime Supabase dla srodowiska live i potwierdz zapis bookingow oraz admina poza local fallback.',
  }
}

function getAppUrlGoLiveCheck(): GoLiveCheck {
  const baseUrl = getBaseUrl()
  let parsedUrl: URL | null = null

  try {
    parsedUrl = new URL(baseUrl)
  } catch {}

  const isHttps = parsedUrl?.protocol === 'https:'
  const isLocalHost = parsedUrl ? /^(localhost|127\.0\.0\.1)$/i.test(parsedUrl.hostname) : true

  if (parsedUrl && isHttps && !isLocalHost) {
    return {
      id: 'app-url',
      label: 'Publiczny URL',
      statusLabel: 'Gotowe',
      tone: 'ready',
      summary: `Publiczny URL aplikacji jest gotowy do linkow zwrotnych i maili: ${baseUrl}.`,
      nextStep: 'Brak blokera po stronie publicznego URL.',
    }
  }

  return {
    id: 'app-url',
    label: 'Publiczny URL',
    statusLabel: 'Bloker',
    tone: 'attention',
    summary: `Publiczny URL nie wyglada na produkcyjny HTTPS endpoint: ${baseUrl}.`,
    nextStep: 'Ustaw NEXT_PUBLIC_APP_URL na docelowy adres HTTPS uzywany w linkach mailowych i powrotach z platnosci.',
  }
}

async function probePublicAppUrl(baseUrl: string): Promise<PublicUrlProbeResult> {
  try {
    const probeUrl = new URL(baseUrl)
    probeUrl.searchParams.set('__live_readiness', Date.now().toString())

    const response = await fetch(probeUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'user-agent': 'behawior15-live-readiness/1.0',
      },
    })

    if (response.ok) {
      return {
        ok: true,
        status: response.status,
        details: `HTTP ${response.status}`,
      }
    }

    return {
      ok: false,
      status: response.status,
      details: `HTTP ${response.status}`,
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : 'unknown fetch failure'

    return {
      ok: false,
      status: null,
      details,
    }
  }
}

export async function getVerifiedDeployReadinessChecks(): Promise<GoLiveCheck[]> {
  const checks = getDeployReadinessChecks()
  const urlCheckIndex = checks.findIndex((check) => check.id === 'app-url')

  if (urlCheckIndex === -1) {
    return checks
  }

  const currentUrlCheck = checks[urlCheckIndex]

  if (currentUrlCheck.tone === 'attention') {
    return checks
  }

  const baseUrl = getBaseUrl()
  const probe = await probePublicAppUrl(baseUrl)

  if (probe.ok) {
    checks[urlCheckIndex] = {
      ...currentUrlCheck,
      summary: `Publiczny URL aplikacji jest gotowy do linkow zwrotnych i maili: ${baseUrl} (${probe.details}).`,
      nextStep: 'Brak blokera po stronie publicznego URL i jego dostepnosci HTTP.',
    }

    return checks
  }

  checks[urlCheckIndex] = {
    id: 'app-url',
    label: 'Publiczny URL',
    statusLabel: 'Bloker',
    tone: 'attention',
    summary: `Publiczny URL nie odpowiada poprawnie dla ruchu zewnetrznego: ${baseUrl} (${probe.details}).`,
    nextStep: 'Ustaw NEXT_PUBLIC_APP_URL na faktycznie publiczny adres HTTPS bez ochrony 401/SSO i potwierdz go przez npm run live-smoke.',
  }

  return checks
}

function getCustomerEmailGoLiveCheck(): GoLiveCheck {
  const status = getCustomerEmailDeliveryStatus(EXTERNAL_CUSTOMER_SMOKE_EMAIL)

  if (status.state === 'ready') {
    return {
      id: 'customer-email',
      label: 'Maile klienta',
      statusLabel: 'Gotowe',
      tone: 'ready',
      summary: status.summary,
      nextStep: status.nextStep,
    }
  }

  if (status.state === 'disabled') {
    return {
      id: 'customer-email',
      label: 'Maile klienta',
      statusLabel: 'Uwaga',
      tone: 'attention',
      summary: 'Maile klienta sa swiadomie wylaczone. Klient bedzie zalezal tylko od strony potwierdzenia.',
      nextStep: 'Wlacz CUSTOMER_EMAIL_MODE=auto i ustaw zweryfikowany RESEND_FROM_EMAIL, zeby klient dostawal maile poza confirmation page.',
    }
  }

  const issue = status.issue ?? status.summary

  if (issue.includes('testing mode')) {
    return {
      id: 'customer-email',
      label: 'Maile klienta',
      statusLabel: 'Bloker',
      tone: 'attention',
      summary: 'Wysylka maili do klientow zewnetrznych jest zablokowana, bo RESEND_FROM_EMAIL nadal korzysta z resend.dev testing mode.',
      nextStep: 'Zweryfikuj domene nadawcy w Resend i ustaw RESEND_FROM_EMAIL na adres z tej domeny.',
    }
  }

  return {
    id: 'customer-email',
    label: 'Maile klienta',
    statusLabel: 'Bloker',
    tone: 'attention',
    summary: `Wysylka maili do klientow zewnetrznych jest zablokowana: ${issue}.`,
    nextStep: 'Uzupelnij konfiguracje Resend i powtorz probe wysylki na zewnetrzny adres testowy.',
  }
}

function getPayuGoLiveCheck(): GoLiveCheck {
  const payu = getPayuOptionStatus()

  if (payu.mode === 'disabled') {
    return {
      id: 'payu-online',
      label: 'PayU online',
      statusLabel: 'Gotowe',
      tone: 'ready',
      summary: 'PayU online jest swiadomie wylaczone. Checkout dziala przez wplate reczna i potwierdzenie na stronie.',
      nextStep: 'Mozesz wystartowac na platnosci recznej. Po aktywacji produkcyjnego PayU ustaw PAYU_MODE=auto.',
    }
  }

  if (!payu.isAvailable) {
    return {
      id: 'payu-online',
      label: 'PayU online',
      statusLabel: 'Bloker',
      tone: 'attention',
      summary: `Platnosc online PayU jest zablokowana: ${payu.summary}`,
      nextStep: 'Uzupelnij brakujace zmienne PayU i uruchom npm run payu-smoke.',
    }
  }

  if (payu.environment === 'sandbox') {
    return {
      id: 'payu-online',
      label: 'PayU online',
      statusLabel: 'Bloker',
      tone: 'attention',
      summary: 'Platnosc online PayU nadal dziala w trybie testowym, bo PAYU_ENVIRONMENT=sandbox.',
      nextStep: 'Przelacz PayU na produkcyjne klucze i potwierdz live checkout przez npm run payu-smoke:production przed ruchem live.',
    }
  }

  return {
    id: 'payu-online',
    label: 'PayU online',
    statusLabel: 'Gotowe',
    tone: 'ready',
    summary: 'Platnosc online PayU jest skonfigurowana dla srodowiska production.',
    nextStep: 'Brak blokera po stronie konfiguracji PayU.',
  }
}

export function getGoLiveChecks(): GoLiveCheck[] {
  return [getCustomerEmailGoLiveCheck(), getPayuGoLiveCheck()]
}

export function getDeployReadinessChecks(): GoLiveCheck[] {
  return [getDataRuntimeGoLiveCheck(), getAppUrlGoLiveCheck(), ...getGoLiveChecks()]
}

export function hasBlockingGoLiveChecks(checks: GoLiveCheck[]): boolean {
  return checks.some((check) => check.tone === 'attention')
}
