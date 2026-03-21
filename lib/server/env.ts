const DEFAULT_APP_URL = 'http://localhost:3000'
const DEFAULT_JITSI_BASE_URL = 'https://meet.jit.si'
const DEFAULT_RESERVATION_WINDOW_MINUTES = 15

const DATA_MODE_VALUES = ['auto', 'supabase', 'local'] as const
const PAYMENT_MODE_VALUES = ['auto', 'stripe', 'mock'] as const

const reportedRuntimeMessages = new Set<string>()

export type DataMode = (typeof DATA_MODE_VALUES)[number]
export type PaymentMode = (typeof PAYMENT_MODE_VALUES)[number]

type ActiveDataMode = 'supabase' | 'local'
type ActivePaymentMode = 'stripe' | 'mock'

type RuntimeModeStatus<TConfigured extends string, TActive extends string> = {
  configured: TConfigured
  active: TActive | null
  isValid: boolean
  usesFallback: boolean
  missing: string[]
  summary: string
}

type StripeConfigOptions = {
  requireWebhookSecret?: boolean
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function formatEnvList(names: string[]): string {
  return names.join(', ')
}

function buildMissingConfigMessage(
  modeLabel: string,
  missing: string[],
  blockedFeature: string,
  fallbackMessage?: string,
): string {
  const base = `${modeLabel} wymaga ${formatEnvList(missing)}. Bez tego nie mozna uruchomic ${blockedFeature}.`
  return fallbackMessage ? `${base} ${fallbackMessage}` : base
}

function parseMode<T extends readonly string[]>(envName: string, allowed: T, fallback: T[number]): T[number] {
  const raw = readEnv(envName)

  if (!raw) {
    return fallback
  }

  if ((allowed as readonly string[]).includes(raw)) {
    return raw as T[number]
  }

  throw new ConfigurationError(`${envName} ma nieprawidlowa wartosc "${raw}". Dozwolone: ${allowed.join(', ')}.`)
}

function getMissingSupabaseVars(): string[] {
  return ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter((name) => !readEnv(name))
}

function getMissingStripeVars(options?: StripeConfigOptions): string[] {
  const required = ['STRIPE_SECRET_KEY']

  if (options?.requireWebhookSecret) {
    required.push('STRIPE_WEBHOOK_SECRET')
  }

  return required.filter((name) => !readEnv(name))
}

function logRuntimeMessage(key: string, summary: string, level: 'info' | 'warn') {
  if (reportedRuntimeMessages.has(key)) {
    return
  }

  reportedRuntimeMessages.add(key)
  const message = `[behawior15] ${summary}`

  if (level === 'warn') {
    console.warn(message)
    return
  }

  console.info(message)
}

export function getBaseUrl(): string {
  if (readEnv('NEXT_PUBLIC_APP_URL')) {
    return readEnv('NEXT_PUBLIC_APP_URL')!
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return DEFAULT_APP_URL
}

export function getJitsiBaseUrl(): string {
  return readEnv('JITSI_BASE_URL') ?? DEFAULT_JITSI_BASE_URL
}

export function getReservationWindowMinutes(): number {
  const raw = Number(readEnv('RESERVATION_WINDOW_MINUTES'))
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_RESERVATION_WINDOW_MINUTES
}

export function getDataModeStatus(): RuntimeModeStatus<DataMode, ActiveDataMode> {
  const configured = parseMode('APP_DATA_MODE', DATA_MODE_VALUES, 'auto')
  const missing = getMissingSupabaseVars()

  if (configured === 'local') {
    return {
      configured,
      active: 'local',
      isValid: true,
      usesFallback: true,
      missing: [],
      summary: 'APP_DATA_MODE=local -> aktywny jest local JSON fallback (development only).',
    }
  }

  if (configured === 'supabase') {
    if (missing.length > 0) {
      return {
        configured,
        active: null,
        isValid: false,
        usesFallback: false,
        missing,
        summary: buildMissingConfigMessage(
          'APP_DATA_MODE=supabase',
          missing,
          'live bookings, availability i admin na Supabase',
        ),
      }
    }

    return {
      configured,
      active: 'supabase',
      isValid: true,
      usesFallback: false,
      missing: [],
      summary: 'APP_DATA_MODE=supabase -> aktywny jest Supabase live mode.',
    }
  }

  if (missing.length > 0) {
    return {
      configured,
      active: 'local',
      isValid: true,
      usesFallback: true,
      missing,
      summary: `APP_DATA_MODE=auto -> aktywny jest local JSON fallback (development only), bo brakuje ${formatEnvList(
        missing,
      )}.`,
    }
  }

  return {
    configured,
    active: 'supabase',
    isValid: true,
    usesFallback: false,
    missing: [],
    summary: 'APP_DATA_MODE=auto -> aktywny jest Supabase live mode.',
  }
}

export function getPaymentModeStatus(): RuntimeModeStatus<PaymentMode, ActivePaymentMode> {
  const configured = parseMode('APP_PAYMENT_MODE', PAYMENT_MODE_VALUES, 'auto')
  const missing = getMissingStripeVars()

  if (configured === 'mock') {
    return {
      configured,
      active: 'mock',
      isValid: true,
      usesFallback: true,
      missing: [],
      summary: 'APP_PAYMENT_MODE=mock -> aktywny jest mock payment fallback (development only).',
    }
  }

  if (configured === 'stripe') {
    if (missing.length > 0) {
      return {
        configured,
        active: null,
        isValid: false,
        usesFallback: false,
        missing,
        summary: buildMissingConfigMessage('APP_PAYMENT_MODE=stripe', missing, 'real Stripe Checkout'),
      }
    }

    return {
      configured,
      active: 'stripe',
      isValid: true,
      usesFallback: false,
      missing: [],
      summary: 'APP_PAYMENT_MODE=stripe -> aktywny jest Stripe Checkout.',
    }
  }

  if (missing.length > 0) {
    return {
      configured,
      active: 'mock',
      isValid: true,
      usesFallback: true,
      missing,
      summary: `APP_PAYMENT_MODE=auto -> aktywny jest mock payment fallback (development only), bo brakuje ${formatEnvList(
        missing,
      )}.`,
    }
  }

  return {
    configured,
    active: 'stripe',
    isValid: true,
    usesFallback: false,
    missing: [],
    summary: 'APP_PAYMENT_MODE=auto -> aktywny jest Stripe Checkout.',
  }
}

export function getRuntimeModeSnapshot() {
  return {
    data: getDataModeStatus(),
    payment: getPaymentModeStatus(),
  }
}

export function resolveDataMode(blockedFeature: string): ActiveDataMode {
  const status = getDataModeStatus()

  if (!status.isValid || !status.active) {
    throw new ConfigurationError(
      `${status.summary} Blokowany feature: ${blockedFeature}.`,
    )
  }

  return status.active
}

export function getSupabaseServerConfig(blockedFeature: string) {
  const status = getDataModeStatus()

  if (!status.isValid || status.active !== 'supabase') {
    throw new ConfigurationError(
      `${status.summary} Blokowany feature: ${blockedFeature}.`,
    )
  }

  return {
    url: readEnv('NEXT_PUBLIC_SUPABASE_URL')!,
    serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY')!,
  }
}

export function getStripeServerConfig(blockedFeature: string, options?: StripeConfigOptions) {
  const status = getPaymentModeStatus()
  const missing = getMissingStripeVars(options)

  if (!status.isValid || status.active !== 'stripe') {
    throw new ConfigurationError(
      `${status.summary} Blokowany feature: ${blockedFeature}.`,
    )
  }

  if (missing.length > 0) {
    throw new ConfigurationError(
      buildMissingConfigMessage('Stripe', missing, blockedFeature),
    )
  }

  return {
    secretKey: readEnv('STRIPE_SECRET_KEY')!,
    webhookSecret: options?.requireWebhookSecret ? readEnv('STRIPE_WEBHOOK_SECRET')! : null,
  }
}

export function assertMockPaymentAllowed() {
  const status = getPaymentModeStatus()

  if (!status.isValid) {
    throw new ConfigurationError(status.summary)
  }

  if (status.active !== 'mock') {
    throw new ConfigurationError(
      `Mock payment endpoint jest wylaczony, bo aktywny tryb platnosci to ${status.active}.`,
    )
  }
}

export function reportRuntimeModeUsage() {
  const data = getDataModeStatus()
  const payment = getPaymentModeStatus()

  logRuntimeMessage('data-mode', `Data mode: ${data.summary}`, data.usesFallback || !data.isValid ? 'warn' : 'info')
  logRuntimeMessage(
    'payment-mode',
    `Payment mode: ${payment.summary}`,
    payment.usesFallback || !payment.isValid ? 'warn' : 'info',
  )
}
