import { getBookingServiceTitle, resolveBookingServiceType } from '@/lib/booking-services'
import { maskPhoneForLogs, normalizePolishPhone } from '@/lib/phone'
import { SITE_PRODUCTION_URL } from '@/lib/site'
import { BookingRecord, SmsConfirmationStatus } from '@/lib/types'

type SmsProvider = 'smsapi' | 'webhook'

type SmsProviderConfig =
  | {
      provider: 'smsapi'
      isAvailable: boolean
      summary: string
      apiBaseUrl: string
      apiKey: string | null
      sender: string | null
    }
  | {
      provider: 'webhook'
      isAvailable: boolean
      summary: string
      webhookUrl: string | null
      webhookToken: string | null
    }
  | {
      provider: null
      isAvailable: boolean
      summary: string
    }

export type PaymentConfirmationSmsResult = {
  status: SmsConfirmationStatus
  normalizedPhone: string | null
  providerMessageId?: string | null
  errorCode?: string | null
  errorMessage?: string | null
}

type SmsApiSuccessPayload = {
  list?: Array<{
    id?: string
    status?: string
    number?: string
  }>
}

type SmsApiFailurePayload = {
  error?: number | string
  message?: string
}

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}

function getSmsProviderConfig(): SmsProviderConfig {
  const configuredProvider = readEnv('SMS_PROVIDER')
  const resolvedProvider =
    configuredProvider === 'smsapi' || configuredProvider === 'webhook' || configuredProvider === 'disabled'
      ? configuredProvider
      : readEnv('SMS_API_KEY')
        ? 'smsapi'
        : readEnv('SMS_NOTIFICATION_WEBHOOK_URL')
          ? 'webhook'
          : 'disabled'

  if (resolvedProvider === 'disabled') {
    return {
      provider: null,
      isAvailable: false,
      summary: 'SMS provider is not configured.',
    }
  }

  if (resolvedProvider === 'webhook') {
    const webhookUrl = readEnv('SMS_NOTIFICATION_WEBHOOK_URL')

    if (!webhookUrl) {
      return {
        provider: 'webhook',
        isAvailable: false,
        summary: 'SMS webhook provider requires SMS_NOTIFICATION_WEBHOOK_URL.',
        webhookUrl: null,
        webhookToken: readEnv('SMS_NOTIFICATION_WEBHOOK_TOKEN'),
      }
    }

    return {
      provider: 'webhook',
      isAvailable: true,
      summary: 'SMS webhook provider is configured.',
      webhookUrl,
      webhookToken: readEnv('SMS_NOTIFICATION_WEBHOOK_TOKEN'),
    }
  }

  const apiKey = readEnv('SMS_API_KEY')
  const sender = readEnv('SMS_SENDER')

  if (!apiKey || !sender) {
    const missing = ['SMS_API_KEY', 'SMS_SENDER'].filter((name) => !readEnv(name))
    return {
      provider: 'smsapi',
      isAvailable: false,
      summary: `SMSAPI requires ${missing.join(', ')}.`,
      apiBaseUrl: readEnv('SMS_API_BASE_URL') ?? 'https://api.smsapi.com',
      apiKey,
      sender,
    }
  }

  return {
    provider: 'smsapi',
    isAvailable: true,
    summary: 'SMSAPI is configured.',
    apiBaseUrl: readEnv('SMS_API_BASE_URL') ?? 'https://api.smsapi.com',
    apiKey,
    sender,
  }
}

function getPaymentServiceName(booking: Pick<BookingRecord, 'serviceType' | 'amount'>): string {
  return getBookingServiceTitle(resolveBookingServiceType(booking.serviceType, booking.amount))
}

function formatBookingDateTimeForSms(bookingDate: string, bookingTime: string): string {
  const match = bookingDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return `${bookingDate} ${bookingTime}`
  }

  const [, , month, day] = match
  return `${day}.${month} ${bookingTime}`
}

export function buildPaymentConfirmationSmsMessage(
  booking: Pick<BookingRecord, 'bookingDate' | 'bookingTime' | 'serviceType' | 'amount'>,
): string {
  const serviceName = getPaymentServiceName(booking)
  const withDetails = `Potwierdzenie płatności: ${serviceName}, termin: ${formatBookingDateTimeForSms(
    booking.bookingDate,
    booking.bookingTime,
  )}. Szczegoly: ${SITE_PRODUCTION_URL}. Dziekuje, Krzysztof Regulski`

  if (withDetails.length <= 160) {
    return withDetails
  }

  return `Potwierdzenie płatności: ${serviceName}, termin: ${formatBookingDateTimeForSms(
    booking.bookingDate,
    booking.bookingTime,
  )}. Dziekuje, Krzysztof Regulski`
}

async function sendViaSmsApi(
  config: Extract<SmsProviderConfig, { provider: 'smsapi' }>,
  booking: Pick<BookingRecord, 'id'>,
  normalizedPhoneDigits: string,
  message: string,
): Promise<PaymentConfirmationSmsResult> {
  const payload = new URLSearchParams({
    to: normalizedPhoneDigits,
    from: config.sender!,
    message,
    format: 'json',
    encoding: 'utf-8',
    idx: `booking-${booking.id}`,
    check_idx: '1',
  })

  try {
    const response = await fetch(`${config.apiBaseUrl}/sms.do`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey!}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    })

    const raw = await response.text()
    const parsed = raw ? (JSON.parse(raw) as SmsApiSuccessPayload & SmsApiFailurePayload) : {}

    if (!response.ok) {
      return {
        status: 'failed',
        normalizedPhone: `+${normalizedPhoneDigits}`,
        errorCode: parsed.error ? String(parsed.error) : `HTTP_${response.status}`,
        errorMessage: parsed.message ?? `SMSAPI HTTP ${response.status}`,
      }
    }

    if (parsed.error || !parsed.list?.[0]?.id) {
      return {
        status: 'failed',
        normalizedPhone: `+${normalizedPhoneDigits}`,
        errorCode: parsed.error ? String(parsed.error) : 'SMSAPI_INVALID_RESPONSE',
        errorMessage: parsed.message ?? 'SMSAPI did not return a message id.',
      }
    }

    return {
      status: 'sent',
      normalizedPhone: `+${normalizedPhoneDigits}`,
      providerMessageId: parsed.list[0].id ?? null,
      errorCode: null,
      errorMessage: null,
    }
  } catch (error) {
    return {
      status: 'failed',
      normalizedPhone: `+${normalizedPhoneDigits}`,
      errorCode: 'SMSAPI_FETCH_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Unknown SMSAPI error',
    }
  }
}

async function sendViaWebhook(
  config: Extract<SmsProviderConfig, { provider: 'webhook' }>,
  booking: Pick<BookingRecord, 'id'>,
  normalizedPhone: string,
  message: string,
): Promise<PaymentConfirmationSmsResult> {
  try {
    const response = await fetch(config.webhookUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.webhookToken ? { Authorization: `Bearer ${config.webhookToken}` } : {}),
      },
      body: JSON.stringify({
        bookingId: booking.id,
        phone: normalizedPhone,
        message,
      }),
    })

    if (!response.ok) {
      return {
        status: 'failed',
        normalizedPhone,
        errorCode: `WEBHOOK_HTTP_${response.status}`,
        errorMessage: `SMS webhook HTTP ${response.status}`,
      }
    }

    return {
      status: 'sent',
      normalizedPhone,
      providerMessageId: null,
      errorCode: null,
      errorMessage: null,
    }
  } catch (error) {
    return {
      status: 'failed',
      normalizedPhone,
      errorCode: 'WEBHOOK_FETCH_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Unknown SMS webhook error',
    }
  }
}

export async function sendPaymentConfirmationSms(
  booking: Pick<BookingRecord, 'id' | 'phone' | 'customerPhoneNormalized' | 'bookingDate' | 'bookingTime' | 'serviceType' | 'amount'>,
): Promise<PaymentConfirmationSmsResult> {
  const hasPhone = Boolean(booking.customerPhoneNormalized?.trim() || booking.phone?.trim())

  if (!hasPhone) {
    console.warn('[behawior15][sms] skip', {
      bookingId: booking.id,
      reason: 'booking phone missing',
    })
    return {
      status: 'skipped_missing_phone',
      normalizedPhone: null,
      errorCode: 'PHONE_MISSING',
      errorMessage: 'Booking phone missing.',
    }
  }

  const normalizedPhone = normalizePolishPhone(booking.customerPhoneNormalized ?? booking.phone)

  if (!normalizedPhone) {
    console.warn('[behawior15][sms] skip', {
      bookingId: booking.id,
      reason: 'invalid phone',
      phoneHint: maskPhoneForLogs(booking.phone),
    })
    return {
      status: 'skipped_invalid_phone',
      normalizedPhone: null,
      errorCode: 'PHONE_INVALID',
      errorMessage: 'Phone number could not be normalized to PL E.164.',
    }
  }

  const config = getSmsProviderConfig()

  if (!config.isAvailable || !config.provider) {
    console.warn('[behawior15][sms] skip', {
      bookingId: booking.id,
      reason: config.summary,
      phoneHint: maskPhoneForLogs(normalizedPhone.e164),
    })
    return {
      status: 'skipped_not_configured',
      normalizedPhone: normalizedPhone.e164,
      errorCode: 'SMS_NOT_CONFIGURED',
      errorMessage: config.summary,
    }
  }

  const message = buildPaymentConfirmationSmsMessage(booking)
  const result =
    config.provider === 'smsapi'
      ? await sendViaSmsApi(config, booking, normalizedPhone.digits, message)
      : await sendViaWebhook(config, booking, normalizedPhone.e164, message)

  const level = result.status === 'sent' ? 'info' : 'error'
  console[level]('[behawior15][sms] payment-confirmation', {
    bookingId: booking.id,
    status: result.status,
    phoneHint: maskPhoneForLogs(normalizedPhone.e164),
    provider: config.provider,
    providerMessageId: result.providerMessageId ?? null,
    errorCode: result.errorCode ?? null,
    errorMessage: result.errorMessage ?? null,
  })

  return result
}
