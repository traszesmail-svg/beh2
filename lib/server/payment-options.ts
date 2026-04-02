import { SPECIALIST_NAME, getContactDetails } from '@/lib/site'

const DEFAULT_MANUAL_PAYMENT_HOLD_MINUTES = 12 * 60

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function formatBankAccount(value: string | null): string | null {
  if (!value) {
    return null
  }

  const compact = value.replace(/\s+/g, '')

  if (/^\d{26}$/.test(compact)) {
    return compact.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  return value
}

function formatPhone(value: string | null): string | null {
  if (!value) {
    return null
  }

  const digits = value.replace(/\D/g, '')

  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  if (digits.length === 11 && digits.startsWith('48')) {
    return `+48 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }

  return value
}

export type ManualPaymentConfig = {
  isAvailable: boolean
  phone: string | null
  phoneDisplay: string | null
  bankAccount: string | null
  bankAccountDisplay: string | null
  accountName: string
  instructions: string | null
  holdMinutes: number
  summary: string
}

export type PayuEnvironment = 'production' | 'sandbox'

export type PayuOptionStatus = {
  isAvailable: boolean
  environment: PayuEnvironment
  apiBaseUrl: string
  oauthUrl: string
  posId: string | null
  clientId: string | null
  clientSecret: string | null
  secondKey: string | null
  summary: string
  missing: string[]
}

export function getManualPaymentReference(bookingId: string): string {
  const compactId = bookingId.replace(/-/g, '').slice(0, 12).toUpperCase()
  return `B15-${compactId}`
}

export function getManualPaymentConfig(): ManualPaymentConfig {
  const contact = getContactDetails()
  const phone = readEnv('MANUAL_PAYMENT_BLIK_PHONE') ?? contact.phoneHref ?? null
  const bankAccount = readEnv('MANUAL_PAYMENT_BANK_ACCOUNT')
  const instructions = readEnv('MANUAL_PAYMENT_INSTRUCTIONS')
  const accountName = readEnv('MANUAL_PAYMENT_ACCOUNT_NAME') ?? SPECIALIST_NAME
  const holdMinutesRaw = Number(readEnv('MANUAL_PAYMENT_HOLD_MINUTES'))
  const holdMinutes =
    Number.isFinite(holdMinutesRaw) && holdMinutesRaw > 0 ? holdMinutesRaw : DEFAULT_MANUAL_PAYMENT_HOLD_MINUTES

  if (!phone && !bankAccount) {
    return {
      isAvailable: false,
      phone: null,
      phoneDisplay: null,
      bankAccount: null,
      bankAccountDisplay: null,
      accountName,
      instructions,
      holdMinutes,
      summary: 'Wpłata BLIK/przelewem wymaga przynajmniej numeru telefonu do BLIK lub numeru konta do przelewu.',
    }
  }

  const parts = []
  if (phone) {
    parts.push('BLIK na telefon jest skonfigurowany')
  }
  if (bankAccount) {
    parts.push('przelew tradycyjny jest skonfigurowany')
  }

  return {
    isAvailable: true,
    phone,
    phoneDisplay: formatPhone(phone),
    bankAccount,
    bankAccountDisplay: formatBankAccount(bankAccount),
    accountName,
    instructions,
    holdMinutes,
    summary: `Wpłata BLIK/przelewem jest dostępna: ${parts.join(' i ')}.`,
  }
}

export function getPublicManualPaymentConfig(): ManualPaymentConfig {
  const manual = getManualPaymentConfig()

  if (!manual.isAvailable) {
    return manual
  }

  if (manual.phone && manual.bankAccount) {
    return {
      ...manual,
      summary: 'BLIK na telefon i przelew tradycyjny są dostępne z ręcznym potwierdzeniem do 60 minut.',
    }
  }

  if (manual.bankAccount) {
    return {
      ...manual,
      summary: 'Przelew tradycyjny jest dostępny z ręcznym potwierdzeniem do 60 minut.',
    }
  }

  return {
    ...manual,
    summary: 'BLIK na telefon jest dostępny z ręcznym potwierdzeniem do 60 minut.',
  }
}

export function getPayuOptionStatus(): PayuOptionStatus {
  const environment = readEnv('PAYU_ENVIRONMENT') === 'sandbox' ? 'sandbox' : 'production'
  const apiBaseUrl = environment === 'sandbox' ? 'https://secure.snd.payu.com' : 'https://secure.payu.com'
  const oauthUrl = `${apiBaseUrl}/pl/standard/user/oauth/authorize`
  const clientId = readEnv('PAYU_CLIENT_ID')
  const clientSecret = readEnv('PAYU_CLIENT_SECRET')
  const posId = readEnv('PAYU_POS_ID') ?? clientId
  const secondKey = readEnv('PAYU_SECOND_KEY')
  const missing = ['PAYU_CLIENT_ID', 'PAYU_CLIENT_SECRET', 'PAYU_SECOND_KEY'].filter((name) => !readEnv(name))

  if (!posId) {
    missing.push('PAYU_POS_ID')
  }

  const dedupedMissing = Array.from(new Set(missing))

  if (dedupedMissing.length > 0) {
    return {
      isAvailable: false,
      environment,
      apiBaseUrl,
      oauthUrl,
      posId,
      clientId,
      clientSecret,
      secondKey,
      summary: `PayU wymaga: ${dedupedMissing.join(', ')}.`,
      missing: dedupedMissing,
    }
  }

  return {
    isAvailable: true,
    environment,
    apiBaseUrl,
    oauthUrl,
    posId,
    clientId,
    clientSecret,
    secondKey,
    summary: `PayU jest gotowe w środowisku ${environment}.`,
    missing: [],
  }
}

export function getPaymentOptionsSummary() {
  const manual = getManualPaymentConfig()
  const payu = getPayuOptionStatus()

  return {
    manual,
    payu,
    summary: [manual.summary, payu.summary].join(' '),
  }
}
