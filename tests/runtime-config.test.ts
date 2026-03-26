import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { afterEach, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { GET as manualPaymentReviewRoute } from '@/app/manual-payment/review/route'
import { ADMIN_BASIC_AUTH_USERNAME, hasValidAdminAuthorization } from '@/lib/admin-auth'
import { POST as submitTestimonialRoute } from '@/app/api/testimonials/route'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import { SocialProofSection } from '@/components/SocialProofSection'
import { BUILD_MARKER_KEY, getBuildMarkerSnapshot } from '@/lib/build-marker'
import {
  buildExpectedMarker,
  evaluateReleaseSmokePage,
  extractBuildMarkerFromHtml,
  extractVisibleTextFromHtml,
  normalizeReleaseSmokeText,
} from '@/lib/release-smoke'
import { buildRollingAvailabilitySeed, getProblemLabel, isFutureAvailabilitySlot, isProblemType } from '@/lib/data'
import { normalizePolishPhone } from '@/lib/phone'
import { getDataModeStatus, getPaymentModeStatus, getSupabaseServiceRoleKeyIssue } from '@/lib/server/env'
import {
  createPendingBooking as createLocalPendingBooking,
  getBookingById as getLocalBookingById,
  listAvailability as listLocalAvailability,
  markBookingManualPaymentPending as markLocalBookingManualPaymentPending,
  markBookingPaid as markLocalBookingPaid,
} from '@/lib/server/local-store'
import { buildSeedAvailabilitySlots, hasFutureAvailabilitySlots } from '@/lib/server/availability-seed'
import { createManualPaymentReviewToken } from '@/lib/server/manual-payment-review'
import {
  BLOCKED_CONSULTATION_PRICE_PLN,
  buildPublicPricingDisclosureMessage,
  createActiveConsultationPrice,
  DEFAULT_PRICE_PLN,
  MIN_CONSULTATION_PRICE_PLN,
  PRE_TOPIC_PRICE_CONFIRMATION_COPY,
  formatPricePln,
  formatPricePlnExact,
  parseConsultationPriceInput,
  toStripeUnitAmount,
} from '@/lib/pricing'
import {
  normalizePreparationLinkUrl,
  normalizePreparationNotes,
  PREPARATION_NOTES_MAX_LENGTH,
  PREPARATION_VIDEO_MAX_SIZE_BYTES,
  validatePreparationLinkUrl,
  validatePreparationNotes,
  validatePreparationVideoMeta,
} from '@/lib/preparation'
import { canSelfCancelBooking, getRemainingSelfCancellationSeconds, SELF_CANCELLATION_WINDOW_MS } from '@/lib/self-cancellation'
import { createCustomerAccessToken, hasValidCustomerAccessToken, hashCustomerAccessToken } from '@/lib/server/customer-access'
import { sendManualPaymentReportedAdminEmail, shouldSendBookingConfirmationAfterPayment } from '@/lib/server/notifications'
import { getReminderAuthorizationError, runBookingReminderSweep } from '@/lib/server/reminder-runner'
import { getWarsawDateTime, shouldSendReminderForBooking } from '@/lib/server/reminders'
import { buildPaymentConfirmationSmsMessage, sendPaymentConfirmationSms } from '@/lib/server/sms'
import { assertStripeCheckoutAmountSupported, buildCheckoutSessionParams, isStripeTestMode } from '@/lib/server/stripe'
import { getContactDetails } from '@/lib/site'
import { TESTIMONIALS } from '@/lib/testimonials'

const originalStripeSecret = process.env.STRIPE_SECRET_KEY
const originalVercelEnv = process.env.VERCEL_ENV
const originalCommitRef = process.env.VERCEL_GIT_COMMIT_REF
const originalCommitSha = process.env.VERCEL_GIT_COMMIT_SHA
const originalCronSecret = process.env.CRON_SECRET
const originalAppDataMode = process.env.APP_DATA_MODE
const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const originalSupabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const originalBaseUrl = process.env.NEXT_PUBLIC_APP_URL
const originalResendApiKey = process.env.RESEND_API_KEY
const originalResendFromEmail = process.env.RESEND_FROM_EMAIL
const originalContactEmail = process.env.BEHAVIOR15_CONTACT_EMAIL
const originalContactPhone = process.env.BEHAVIOR15_CONTACT_PHONE
const originalSmsProvider = process.env.SMS_PROVIDER
const originalSmsApiKey = process.env.SMS_API_KEY
const originalSmsSender = process.env.SMS_SENDER
const originalSmsApiBaseUrl = process.env.SMS_API_BASE_URL
const originalSmsWebhookUrl = process.env.SMS_NOTIFICATION_WEBHOOK_URL
const originalSmsWebhookToken = process.env.SMS_NOTIFICATION_WEBHOOK_TOKEN
const originalFetch = globalThis.fetch
const localStoreDataDir = path.join(process.cwd(), 'data')
const trackedLocalStoreFiles = ['availability.json', 'bookings.json', 'users.json', 'pricing-settings.json'] as const

afterEach(() => {
  if (typeof originalStripeSecret === 'string') {
    process.env.STRIPE_SECRET_KEY = originalStripeSecret
  } else {
    delete process.env.STRIPE_SECRET_KEY
  }

  if (typeof originalVercelEnv === 'string') {
    process.env.VERCEL_ENV = originalVercelEnv
  } else {
    delete process.env.VERCEL_ENV
  }

  if (typeof originalCommitRef === 'string') {
    process.env.VERCEL_GIT_COMMIT_REF = originalCommitRef
  } else {
    delete process.env.VERCEL_GIT_COMMIT_REF
  }

  if (typeof originalCommitSha === 'string') {
    process.env.VERCEL_GIT_COMMIT_SHA = originalCommitSha
  } else {
    delete process.env.VERCEL_GIT_COMMIT_SHA
  }

  if (typeof originalCronSecret === 'string') {
    process.env.CRON_SECRET = originalCronSecret
  } else {
    delete process.env.CRON_SECRET
  }

  if (typeof originalAppDataMode === 'string') {
    process.env.APP_DATA_MODE = originalAppDataMode
  } else {
    delete process.env.APP_DATA_MODE
  }

  if (typeof originalSupabaseUrl === 'string') {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl
  } else {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  if (typeof originalSupabaseServiceRoleKey === 'string') {
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalSupabaseServiceRoleKey
  } else {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  if (typeof originalBaseUrl === 'string') {
    process.env.NEXT_PUBLIC_APP_URL = originalBaseUrl
  } else {
    delete process.env.NEXT_PUBLIC_APP_URL
  }

  if (typeof originalResendApiKey === 'string') {
    process.env.RESEND_API_KEY = originalResendApiKey
  } else {
    delete process.env.RESEND_API_KEY
  }

  if (typeof originalResendFromEmail === 'string') {
    process.env.RESEND_FROM_EMAIL = originalResendFromEmail
  } else {
    delete process.env.RESEND_FROM_EMAIL
  }

  if (typeof originalContactEmail === 'string') {
    process.env.BEHAVIOR15_CONTACT_EMAIL = originalContactEmail
  } else {
    delete process.env.BEHAVIOR15_CONTACT_EMAIL
  }

  if (typeof originalContactPhone === 'string') {
    process.env.BEHAVIOR15_CONTACT_PHONE = originalContactPhone
  } else {
    delete process.env.BEHAVIOR15_CONTACT_PHONE
  }

  if (typeof originalSmsProvider === 'string') {
    process.env.SMS_PROVIDER = originalSmsProvider
  } else {
    delete process.env.SMS_PROVIDER
  }

  if (typeof originalSmsApiKey === 'string') {
    process.env.SMS_API_KEY = originalSmsApiKey
  } else {
    delete process.env.SMS_API_KEY
  }

  if (typeof originalSmsSender === 'string') {
    process.env.SMS_SENDER = originalSmsSender
  } else {
    delete process.env.SMS_SENDER
  }

  if (typeof originalSmsApiBaseUrl === 'string') {
    process.env.SMS_API_BASE_URL = originalSmsApiBaseUrl
  } else {
    delete process.env.SMS_API_BASE_URL
  }

  if (typeof originalSmsWebhookUrl === 'string') {
    process.env.SMS_NOTIFICATION_WEBHOOK_URL = originalSmsWebhookUrl
  } else {
    delete process.env.SMS_NOTIFICATION_WEBHOOK_URL
  }

  if (typeof originalSmsWebhookToken === 'string') {
    process.env.SMS_NOTIFICATION_WEBHOOK_TOKEN = originalSmsWebhookToken
  } else {
    delete process.env.SMS_NOTIFICATION_WEBHOOK_TOKEN
  }

  globalThis.fetch = originalFetch
})

function buildBasicHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

async function backupLocalStoreFiles() {
  await mkdir(localStoreDataDir, { recursive: true })

  return Promise.all(
    trackedLocalStoreFiles.map(async (fileName) => {
      const filePath = path.join(localStoreDataDir, fileName)

      try {
        const content = await readFile(filePath, 'utf8')
        return { fileName, content, existed: true }
      } catch {
        return { fileName, content: '', existed: false }
      }
    }),
  )
}

async function restoreLocalStoreFiles(backups: Awaited<ReturnType<typeof backupLocalStoreFiles>>) {
  for (const backup of backups) {
    const filePath = path.join(localStoreDataDir, backup.fileName)

    if (!backup.existed) {
      await rm(filePath, { force: true })
      continue
    }

    await writeFile(filePath, backup.content, 'utf8')
  }
}

function extractUnitAmount(lineItem: unknown): number | null {
  if (!lineItem || typeof lineItem !== 'object' || !('price_data' in lineItem)) {
    return null
  }

  const priceData = lineItem.price_data

  if (!priceData || typeof priceData !== 'object' || !('unit_amount' in priceData)) {
    return null
  }

  return typeof priceData.unit_amount === 'number' ? priceData.unit_amount : null
}

test('accepts the configured admin basic auth header', () => {
  assert.equal(hasValidAdminAuthorization(buildBasicHeader(ADMIN_BASIC_AUTH_USERNAME, 'sekret'), 'sekret'), true)
})

test('rejects wrong password', () => {
  assert.equal(hasValidAdminAuthorization(buildBasicHeader(ADMIN_BASIC_AUTH_USERNAME, 'zly-sekret'), 'sekret'), false)
})

test('rejects malformed authorization header', () => {
  assert.equal(hasValidAdminAuthorization('Bearer abc', 'sekret'), false)
})

test('uses the default consultation price presentation when no admin change was applied', () => {
  const pricing = createActiveConsultationPrice(DEFAULT_PRICE_PLN)

  assert.equal(pricing.amount, DEFAULT_PRICE_PLN)
  assert.equal(pricing.formattedAmount, formatPricePln(DEFAULT_PRICE_PLN))
  assert.equal(pricing.exactFormattedAmount, formatPricePlnExact(DEFAULT_PRICE_PLN))
  assert.match(pricing.summary, /Aktywna cena konsultacji/)
})

test('parses an admin-entered consultation price and converts it consistently for Stripe', () => {
  const amount = parseConsultationPriceInput('49,50')

  assert.equal(amount, 49.5)
  assert.equal(toStripeUnitAmount(amount), 4950)
})

test('builds the public pricing disclosure from the stable project baseline and ignores legacy values', () => {
  const expectedMessage = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}. ${PRE_TOPIC_PRICE_CONFIRMATION_COPY}`

  assert.equal(buildPublicPricingDisclosureMessage(DEFAULT_PRICE_PLN), expectedMessage)
  assert.equal(buildPublicPricingDisclosureMessage(28.99), expectedMessage)
  assert.equal(buildPublicPricingDisclosureMessage(BLOCKED_CONSULTATION_PRICE_PLN), expectedMessage)
  assert.equal(buildPublicPricingDisclosureMessage(null), expectedMessage)
})

test('rejects invalid consultation price values', () => {
  assert.throws(() => parseConsultationPriceInput('free'), /kwotę konsultacji/)
})

test('rejects consultation prices below the project minimum and blocks the legacy cross-project amount', () => {
  assert.throws(() => parseConsultationPriceInput('38.99'), /39/)
  assert.throws(
    () => parseConsultationPriceInput(String(BLOCKED_CONSULTATION_PRICE_PLN)),
    /innego projektu/,
  )
  assert.equal(parseConsultationPriceInput(String(MIN_CONSULTATION_PRICE_PLN)), MIN_CONSULTATION_PRICE_PLN)
})

test('rejects a publishable Supabase key as an admin data source', () => {
  process.env.APP_DATA_MODE = 'supabase'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_publishable_example'

  assert.match(getSupabaseServiceRoleKeyIssue() ?? '', /publishable/i)

  const status = getDataModeStatus()
  assert.equal(status.isValid, false)
  assert.equal(status.active, null)
  assert.match(status.summary, /service role|publishable/i)
})

test('builds rolling local availability without past slots', () => {
  const now = new Date('2026-03-22T16:10:00Z')
  const seed = buildRollingAvailabilitySeed(now)

  assert.ok(seed.length > 0)
  assert.ok(seed.every((entry) => entry.times.every((time) => isFutureAvailabilitySlot(entry.date, time, now))))
})

test('backfills future availability only when the current calendar has no future slots left', () => {
  const now = new Date('2026-03-23T18:00:00+01:00')
  const pastSlots = [
    { bookingDate: '2026-03-23', bookingTime: '16:00' },
    { bookingDate: '2026-03-23', bookingTime: '16:20' },
  ]

  assert.equal(hasFutureAvailabilitySlots(pastSlots, now), false)

  const seedSlots = buildSeedAvailabilitySlots(now, '2026-03-23T17:00:00.000Z')

  assert.ok(seedSlots.length > 0)
  assert.equal(hasFutureAvailabilitySlots(seedSlots, now), true)
  assert.ok(seedSlots.every((slot) => isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime, now)))
})

test('keeps dogoterapia as a standard public topic label', () => {
  assert.equal(isProblemType('dogoterapia'), true)
  assert.equal(getProblemLabel('dogoterapia'), 'Dogoterapia')
})

test('accepts a secret Supabase service key for admin data operations', () => {
  process.env.APP_DATA_MODE = 'supabase'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_example'

  assert.equal(getSupabaseServiceRoleKeyIssue(), null)

  const status = getDataModeStatus()
  assert.equal(status.isValid, true)
  assert.equal(status.active, 'supabase')
})

test('detects Stripe test mode from the secret key prefix', () => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_example'

  assert.equal(isStripeTestMode(), true)
})

test('does not detect Stripe test mode for live keys or missing secret', () => {
  process.env.STRIPE_SECRET_KEY = 'sk_live_example'
  assert.equal(isStripeTestMode(), false)

  delete process.env.STRIPE_SECRET_KEY
  assert.equal(isStripeTestMode(), false)
})

test('blocks Stripe checkout on Vercel production when the Stripe secret is still a test key', () => {
  process.env.VERCEL_ENV = 'production'
  process.env.STRIPE_SECRET_KEY = 'sk_test_example'
  process.env.APP_PAYMENT_MODE = 'auto'

  const status = getPaymentModeStatus()

  assert.equal(status.isValid, false)
  assert.equal(status.active, null)
  assert.match(status.summary, /testowy klucz Stripe/i)
})

test('rejects Stripe Checkout amounts below the PLN minimum', () => {
  assert.throws(() => assertStripeCheckoutAmountSupported(0.01), /co najmniej/)
  assert.doesNotThrow(() => assertStripeCheckoutAmountSupported(DEFAULT_PRICE_PLN))
})

test('builds Stripe checkout params from the immutable booking snapshot amount', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://behawior15.test'

  const params = buildCheckoutSessionParams(
    {
      id: 'booking-123',
      email: 'client@example.com',
      problemType: 'szczeniak',
      bookingDate: '2026-03-22',
      bookingTime: '10:40',
      amount: 47,
    } as const,
    {
      accessToken: 'opaque-token',
    },
  )

  const lineItem = params.line_items?.[0]

  assert.equal(params.success_url, 'https://behawior15.test/confirmation?bookingId=booking-123&access=opaque-token&session_id={CHECKOUT_SESSION_ID}')
  assert.equal(params.cancel_url, 'https://behawior15.test/payment?bookingId=booking-123&access=opaque-token&cancelled=1')
  assert.equal(extractUnitAmount(lineItem), 4700)
})

test('sends the payment confirmation only for the first pending to paid transition', () => {
  assert.equal(
    shouldSendBookingConfirmationAfterPayment({
      bookingStatus: 'pending',
      paymentStatus: 'unpaid',
    }),
    true,
  )

  assert.equal(
    shouldSendBookingConfirmationAfterPayment({
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    }),
    false,
  )
})

test('selects only unpaid reminder candidates within the next hour and without duplicate flag', () => {
  const now = new Date('2026-03-21T09:00:00Z')
  const windowStart = getWarsawDateTime(now)
  const windowEnd = getWarsawDateTime(new Date(now.getTime() + 60 * 60 * 1000))

  assert.equal(
    shouldSendReminderForBooking(
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: false,
        bookingDate: windowStart.date,
        bookingTime: '10:30',
      },
      windowStart,
      windowEnd,
    ),
    true,
  )

  assert.equal(
    shouldSendReminderForBooking(
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: true,
        bookingDate: windowStart.date,
        bookingTime: '10:30',
      },
      windowStart,
      windowEnd,
    ),
    false,
  )

  assert.equal(
    shouldSendReminderForBooking(
      {
        bookingStatus: 'pending',
        paymentStatus: 'unpaid',
        reminderSent: false,
        bookingDate: windowStart.date,
        bookingTime: '10:30',
      },
      windowStart,
      windowEnd,
    ),
    false,
  )
})

test('authorizes the reminder runner only with the configured bearer secret', () => {
  process.env.CRON_SECRET = 'sekret'

  assert.equal(getReminderAuthorizationError('Bearer sekret'), null)
  assert.match(getReminderAuthorizationError('Bearer zly') ?? '', /autoryzacji remindera/)

  delete process.env.CRON_SECRET
  assert.throws(() => getReminderAuthorizationError('Bearer sekret'), /CRON_SECRET/)
})

test('reminder sweep marks only successfully delivered reminders and skips ineligible bookings', async () => {
  const sent: string[] = []
  const marked: string[] = []

  const result = await runBookingReminderSweep({
    now: () => new Date('2026-03-21T09:00:00Z'),
    listBookings: async () => [
      {
        id: 'send-ok',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: false,
        bookingDate: '2026-03-21',
        bookingTime: '10:30',
      } as never,
      {
        id: 'send-fail',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: false,
        bookingDate: '2026-03-21',
        bookingTime: '10:45',
      } as never,
      {
        id: 'already-sent',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: true,
        bookingDate: '2026-03-21',
        bookingTime: '10:30',
      } as never,
      {
        id: 'cancelled',
        bookingStatus: 'cancelled',
        paymentStatus: 'paid',
        reminderSent: false,
        bookingDate: '2026-03-21',
        bookingTime: '10:30',
      } as never,
    ],
    sendBookingReminderEmail: async (booking) => {
      sent.push(booking.id)
      return booking.id === 'send-ok'
        ? { status: 'sent' as const }
        : { status: 'failed' as const, reason: 'SMTP timeout' }
    },
    markBookingReminderSent: async (bookingId) => {
      marked.push(bookingId)
      return null
    },
  })

  assert.equal(result.checked, 4)
  assert.equal(result.candidates, 2)
  assert.equal(result.sent, 1)
  assert.equal(result.failed, 1)
  assert.equal(result.skipped, 0)
  assert.deepEqual(sent, ['send-ok', 'send-fail'])
  assert.deepEqual(marked, ['send-ok'])
})

test('reminder sweep counts skipped deliveries without setting reminder_sent', async () => {
  const marked: string[] = []

  const result = await runBookingReminderSweep({
    now: () => new Date('2026-03-21T09:00:00Z'),
    listBookings: async () => [
      {
        id: 'send-skip',
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        reminderSent: false,
        bookingDate: '2026-03-21',
        bookingTime: '10:15',
      } as never,
    ],
    sendBookingReminderEmail: async () => ({
      status: 'skipped' as const,
      reason: 'RESEND_API_KEY missing',
    }),
    markBookingReminderSent: async (bookingId) => {
      marked.push(bookingId)
      return null
    },
  })

  assert.equal(result.checked, 1)
  assert.equal(result.candidates, 1)
  assert.equal(result.sent, 0)
  assert.equal(result.failed, 0)
  assert.equal(result.skipped, 1)
  assert.deepEqual(marked, [])
})

test('accepts a valid MP4 preparation file and rejects invalid types or oversized uploads', () => {
  assert.equal(
    validatePreparationVideoMeta({
      fileName: 'zachowanie.mp4',
      contentType: 'video/mp4',
      size: 20 * 1024 * 1024,
    }),
    null,
  )

  assert.match(
    validatePreparationVideoMeta({
      fileName: 'zachowanie.mov',
      contentType: 'video/quicktime',
      size: 20 * 1024 * 1024,
    }) ?? '',
    /MP4|plik MP4/,
  )

  assert.match(
    validatePreparationVideoMeta({
      fileName: 'zachowanie.mp4',
      contentType: 'video/mp4',
      size: PREPARATION_VIDEO_MAX_SIZE_BYTES + 1,
    }) ?? '',
    /maksymalnie/,
  )
})

test('normalizes and validates preparation links', () => {
  assert.equal(normalizePreparationLinkUrl(' https://example.com/video '), 'https://example.com/video')
  assert.equal(validatePreparationLinkUrl('https://drive.google.com/file/d/123/view'), null)
  assert.match(validatePreparationLinkUrl('ftp://example.com') ?? '', /http/)
})

test('normalizes notes and rejects overly long preparation notes', () => {
  assert.equal(normalizePreparationNotes('  krotki opis  '), 'krotki opis')
  assert.equal(validatePreparationNotes('opis sytuacji'), null)
  assert.match(validatePreparationNotes('x'.repeat(PREPARATION_NOTES_MAX_LENGTH + 1)) ?? '', /maksymalnie/)
})

test('creates and verifies opaque customer access tokens', () => {
  const token = createCustomerAccessToken()

  assert.equal(typeof token.rawToken, 'string')
  assert.equal(token.tokenHash, hashCustomerAccessToken(token.rawToken))
  assert.equal(hasValidCustomerAccessToken(token.rawToken, token.tokenHash), true)
  assert.equal(hasValidCustomerAccessToken('zly-token', token.tokenHash), false)
})

test('allows self-cancellation only during the first minute after payment', () => {
  const paidAt = '2026-03-24T10:00:00.000Z'

  assert.equal(
    canSelfCancelBooking(
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'payu',
        paidAt,
      },
      new Date(Date.parse(paidAt) + 15 * 1000),
    ),
    true,
  )

  assert.equal(
    getRemainingSelfCancellationSeconds(
      {
        paidAt,
      },
      new Date(Date.parse(paidAt) + SELF_CANCELLATION_WINDOW_MS + 1000),
    ),
    0,
  )

  assert.equal(
    canSelfCancelBooking(
      {
        bookingStatus: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'payu',
        paidAt,
      },
      new Date(Date.parse(paidAt) + 15 * 1000),
    ),
    false,
  )

  assert.equal(
    canSelfCancelBooking(
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'manual',
        paidAt,
      },
      new Date(Date.parse(paidAt) + 15 * 1000),
    ),
    false,
  )
})

test('normalizes common Polish phone input variants to E.164', () => {
  assert.equal(normalizePolishPhone('500600700')?.e164, '+48500600700')
  assert.equal(normalizePolishPhone('500 600 700')?.e164, '+48500600700')
  assert.equal(normalizePolishPhone('+48 500 600 700')?.e164, '+48500600700')
  assert.equal(normalizePolishPhone('48 500 600 700')?.e164, '+48500600700')
  assert.equal(normalizePolishPhone('0048 500 600 700')?.e164, '+48500600700')
  assert.equal(normalizePolishPhone('12345'), null)
})

test('builds a short ASCII SMS confirmation message', () => {
  const message = buildPaymentConfirmationSmsMessage({
    bookingDate: '2026-03-27',
    bookingTime: '11:00',
  })

  assert.ok(message.length <= 160)
  assert.equal(/[^\x00-\x7F]/.test(message), false)
  assert.match(message, /Potwierdzenie platnosci/)
  assert.match(message, /27\.03 11:00/)
})

test('skips SMS sending when booking phone is missing or invalid', async () => {
  const missingPhoneResult = await sendPaymentConfirmationSms({
    id: 'booking-missing-phone',
    phone: '',
    customerPhoneNormalized: null,
    bookingDate: '2026-03-27',
    bookingTime: '11:00',
  })

  assert.equal(missingPhoneResult.status, 'skipped_missing_phone')
  assert.equal(missingPhoneResult.errorCode, 'PHONE_MISSING')

  const invalidPhoneResult = await sendPaymentConfirmationSms({
    id: 'booking-invalid-phone',
    phone: '12345',
    customerPhoneNormalized: null,
    bookingDate: '2026-03-27',
    bookingTime: '11:00',
  })

  assert.equal(invalidPhoneResult.status, 'skipped_invalid_phone')
  assert.equal(invalidPhoneResult.errorCode, 'PHONE_INVALID')
})

test('marks paid bookings as confirmed while handling SMS success, duplicates, invalid phone and provider failure', async () => {
  process.env.RESEND_API_KEY = ''
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.SMS_PROVIDER = 'webhook'
  process.env.SMS_NOTIFICATION_WEBHOOK_URL = 'https://sms.example.test/hook'
  process.env.SMS_NOTIFICATION_WEBHOOK_TOKEN = 'sms-test-token'

  const backups = await backupLocalStoreFiles()

  try {
    await Promise.all(
      trackedLocalStoreFiles.map((fileName) => rm(path.join(localStoreDataDir, fileName), { force: true })),
    )

    const availability = await listLocalAvailability()
    const [successSlot, invalidPhoneSlot, failureSlot] = availability.flatMap((group) => group.slots).slice(0, 3)

    assert.ok(successSlot)
    assert.ok(invalidPhoneSlot)
    assert.ok(failureSlot)

    const fetchCalls: Array<{ url: string; body: string }> = []

    globalThis.fetch = async (input, init) => {
      fetchCalls.push({
        url: String(input),
        body: typeof init?.body === 'string' ? init.body : '',
      })

      return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const successBooking = await createLocalPendingBooking({
      ownerName: 'SMS Success',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '8 miesiecy',
      durationNotes: '2 tygodnie',
      description: 'Happy path SMS after payment success.',
      phone: '500 600 700',
      email: 'sms-success@example.com',
      slotId: successSlot!.id,
    })

    const successPaid = await markLocalBookingPaid(successBooking.booking.id, {
      paymentMethod: 'payu',
      payuOrderId: 'payu-order-success',
      payuOrderStatus: 'COMPLETED',
      triggerPaymentConfirmationSms: true,
    })

    assert.equal(successPaid?.bookingStatus, 'confirmed')
    assert.equal(successPaid?.paymentStatus, 'paid')
    assert.equal(successPaid?.smsConfirmationStatus, 'sent')
    assert.equal(successPaid?.customerPhoneNormalized, '+48500600700')
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0]?.url, 'https://sms.example.test/hook')
    assert.match(fetchCalls[0]?.body ?? '', /"bookingId":"[^"]+"/)
    assert.match(fetchCalls[0]?.body ?? '', /"phone":"\+48500600700"/)

    const duplicatePaid = await markLocalBookingPaid(successBooking.booking.id, {
      paymentMethod: 'payu',
      payuOrderId: 'payu-order-success',
      payuOrderStatus: 'COMPLETED',
      triggerPaymentConfirmationSms: true,
    })

    assert.equal(duplicatePaid?.smsConfirmationStatus, 'sent')
    assert.equal(fetchCalls.length, 1)

    const invalidPhoneBooking = await createLocalPendingBooking({
      ownerName: 'SMS Invalid',
      problemType: 'kot',
      animalType: 'Kot',
      petAge: '2 lata',
      durationNotes: '3 dni',
      description: 'Payment succeeds even when stored phone is invalid.',
      phone: '12345',
      email: 'sms-invalid@example.com',
      slotId: invalidPhoneSlot!.id,
    })

    const invalidPhonePaid = await markLocalBookingPaid(invalidPhoneBooking.booking.id, {
      paymentMethod: 'manual',
      paymentReference: 'invalid-phone-payment',
      triggerPaymentConfirmationSms: true,
    })

    assert.equal(invalidPhonePaid?.paymentStatus, 'paid')
    assert.equal(invalidPhonePaid?.bookingStatus, 'confirmed')
    assert.equal(invalidPhonePaid?.smsConfirmationStatus, 'skipped_invalid_phone')
    assert.equal(fetchCalls.length, 1)

    globalThis.fetch = async () =>
      new Response('provider temporary failure', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      })

    const failureBooking = await createLocalPendingBooking({
      ownerName: 'SMS Failure',
      problemType: 'separacja',
      animalType: 'Pies',
      petAge: '4 lata',
      durationNotes: 'Od miesiaca',
      description: 'Payment should remain successful after SMS provider failure.',
      phone: '500700800',
      email: 'sms-failure@example.com',
      slotId: failureSlot!.id,
    })

    const failurePaid = await markLocalBookingPaid(failureBooking.booking.id, {
      paymentMethod: 'payu',
      payuOrderId: 'payu-order-failure',
      payuOrderStatus: 'COMPLETED',
      triggerPaymentConfirmationSms: true,
    })

    assert.equal(failurePaid?.paymentStatus, 'paid')
    assert.equal(failurePaid?.bookingStatus, 'confirmed')
    assert.equal(failurePaid?.smsConfirmationStatus, 'failed')
    assert.match(failurePaid?.smsErrorCode ?? '', /WEBHOOK_HTTP_503/)

    const storedFailureBooking = await getLocalBookingById(failureBooking.booking.id)
    assert.equal(storedFailureBooking?.smsConfirmationStatus, 'failed')
  } finally {
    await restoreLocalStoreFiles(backups)
  }
})

test('sends manual payment verification emails to ADMIN_NOTIFICATION_EMAIL', async () => {
  process.env.RESEND_API_KEY = 'resend-test-key'
  process.env.RESEND_FROM_EMAIL = 'Behawior 15 <powiadomienia@example.com>'
  process.env.ADMIN_NOTIFICATION_EMAIL = 'krzyre@gmail.com'

  let requestBody = ''

  globalThis.fetch = async (_input, init) => {
    requestBody = typeof init?.body === 'string' ? init.body : ''
    return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const result = await sendManualPaymentReportedAdminEmail(
    {
      id: 'booking-admin-email',
      ownerName: 'Jan Testowy',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '8 miesiecy',
      durationNotes: '2 tygodnie',
      description: 'Test manualnej wplaty.',
      phone: '500600700',
      email: 'client@example.com',
      bookingDate: '2026-03-27',
      bookingTime: '11:00',
      slotId: 'slot-1',
      amount: 39,
      bookingStatus: 'pending_manual_payment',
      paymentStatus: 'pending_manual_review',
      meetingUrl: 'https://meet.jit.si/behawior15-test-room',
      createdAt: '2026-03-26T10:00:00.000Z',
      updatedAt: '2026-03-26T10:00:00.000Z',
      paymentReference: 'MANUAL-BOOKING-1',
    },
    {
      approveUrl: 'https://beh2.vercel.app/manual-payment/review?bookingId=booking-admin-email&action=approve',
      rejectUrl: 'https://beh2.vercel.app/manual-payment/review?bookingId=booking-admin-email&action=reject',
    },
  )

  assert.equal(result.status, 'sent')
  assert.match(requestBody, /krzyre@gmail\.com/)
  assert.match(requestBody, /Jest wpłata - potwierdź i otwórz pokój/)
  assert.match(requestBody, /Nie ma wpłaty/)
})

test('manual payment review approve opens the room and reject says client must return to payment', async () => {
  process.env.APP_DATA_MODE = 'local'
  process.env.RESEND_API_KEY = ''
  process.env.MANUAL_PAYMENT_REVIEW_SECRET = 'review-secret'
  process.env.SMS_PROVIDER = 'disabled'

  const backups = await backupLocalStoreFiles()

  try {
    await Promise.all(
      trackedLocalStoreFiles.map((fileName) => rm(path.join(localStoreDataDir, fileName), { force: true })),
    )

    const availability = await listLocalAvailability()
    const [approveSlot, rejectSlot] = availability.flatMap((group) => group.slots).slice(0, 2)

    assert.ok(approveSlot)
    assert.ok(rejectSlot)

    const approveBooking = await createLocalPendingBooking({
      ownerName: 'Approve Manual',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '1 rok',
      durationNotes: 'Od tygodnia',
      description: 'Approve route should open the room.',
      phone: '500600700',
      email: 'approve@example.com',
      slotId: approveSlot!.id,
    })

    const approvePending = await markLocalBookingManualPaymentPending(approveBooking.booking.id, {
      paymentReference: 'APPROVE-REF',
    })

    assert.ok(approvePending?.paymentReportedAt)

    const approveToken = createManualPaymentReviewToken(
      approveBooking.booking.id,
      'approve',
      approvePending?.paymentReportedAt,
    )
    const approveResponse = await manualPaymentReviewRoute(
      new Request(
        `http://localhost/manual-payment/review?bookingId=${approveBooking.booking.id}&action=approve&token=${approveToken}`,
      ),
    )
    const approveHtml = await approveResponse.text()
    const approveStored = await getLocalBookingById(approveBooking.booking.id)

    assert.equal(approveResponse.status, 200)
    assert.equal(approveStored?.paymentStatus, 'paid')
    assert.equal(approveStored?.bookingStatus, 'confirmed')
    assert.match(approveHtml, /Otwórz pokój rozmowy/)
    assert.equal(approveHtml.includes(approveStored?.meetingUrl ?? ''), true)
    assert.match(approveHtml, /http-equiv="refresh"/)

    const rejectBooking = await createLocalPendingBooking({
      ownerName: 'Reject Manual',
      problemType: 'kot',
      animalType: 'Kot',
      petAge: '2 lata',
      durationNotes: 'Od kilku dni',
      description: 'Reject route should tell that client must return to payment.',
      phone: '500700800',
      email: 'reject@example.com',
      slotId: rejectSlot!.id,
    })

    const rejectPending = await markLocalBookingManualPaymentPending(rejectBooking.booking.id, {
      paymentReference: 'REJECT-REF',
    })

    assert.ok(rejectPending?.paymentReportedAt)

    const rejectToken = createManualPaymentReviewToken(
      rejectBooking.booking.id,
      'reject',
      rejectPending?.paymentReportedAt,
    )
    const rejectResponse = await manualPaymentReviewRoute(
      new Request(
        `http://localhost/manual-payment/review?bookingId=${rejectBooking.booking.id}&action=reject&token=${rejectToken}`,
      ),
    )
    const rejectHtml = await rejectResponse.text()
    const rejectStored = await getLocalBookingById(rejectBooking.booking.id)

    assert.equal(rejectResponse.status, 200)
    assert.equal(rejectStored?.paymentStatus, 'rejected')
    assert.equal(rejectStored?.bookingStatus, 'cancelled')
    assert.match(rejectHtml, /Nie ma wpłaty/)
    assert.match(rejectHtml, /Klient musi wrócić do płatności/)
  } finally {
    await restoreLocalStoreFiles(backups)
  }
})

test('build marker includes the expected branch and short commit when Vercel env is present', () => {
  process.env.VERCEL_GIT_COMMIT_REF = 'main'
  process.env.VERCEL_GIT_COMMIT_SHA = '09d9b0281c292275c0e9d9a406b1b964bb4bf427'

  const marker = getBuildMarkerSnapshot()

  assert.equal(marker.key, BUILD_MARKER_KEY)
  assert.equal(marker.branch, 'main')
  assert.equal(marker.commit, '09d9b02')
  assert.equal(marker.value, `${BUILD_MARKER_KEY}:main:09d9b02`)
})

test('does not expose the default resend onboarding address as public contact data', () => {
  delete process.env.RESEND_FROM_EMAIL
  delete process.env.BEHAVIOR15_CONTACT_EMAIL
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: 'coapebehawiorysta@gmail.com',
    phoneDisplay: null,
    phoneHref: null,
    facebookUrl: 'https://www.facebook.com/krzysztof.regulski.148/',
  })
})

test('ignores invalid public contact email values', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt.behawiorystacoape.com'
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: 'coapebehawiorysta@gmail.com',
    phoneDisplay: null,
    phoneHref: null,
    facebookUrl: 'https://www.facebook.com/krzysztof.regulski.148/',
  })
})

test('formats public phone details for the footer and legal pages', () => {
  delete process.env.BEHAVIOR15_CONTACT_EMAIL
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'

  assert.deepEqual(getContactDetails(), {
    email: 'coapebehawiorysta@gmail.com',
    phoneDisplay: '500 600 700',
    phoneHref: '500600700',
    facebookUrl: 'https://www.facebook.com/krzysztof.regulski.148/',
  })
})

test('prefers a valid configured public email over the fallback address', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt@behawior15.pl'
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: 'kontakt@behawior15.pl',
    phoneDisplay: null,
    phoneHref: null,
    facebookUrl: 'https://www.facebook.com/krzysztof.regulski.148/',
  })
})

test('header keeps the sales CTA and the updated trust strip', () => {
  const markup = renderToStaticMarkup(createElement(Header))

  assert.match(markup, /Umów konsultację/)
  assert.match(markup, /Psy i koty/)
  assert.match(markup, /COAPE \/ CAPBT/)
  assert.match(markup, /Spokojny pierwszy krok/)
  assert.match(markup, /Dalsza ścieżka pracy, jeśli potrzeba/)
})

test('homepage copy stays sales-first and removes legacy secondary sections', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')

  assert.match(source, /Mały krok na start\. Szersza ścieżka pracy, gdy sytuacja tego wymaga\./)
  assert.match(source, /Nie sprzedaję przypadkowych porad\. Dobieram właściwą formę pomocy\./)
  assert.match(source, /Jak mogę pomóc/)
  assert.match(source, /Formy współpracy/)
  assert.match(source, /Pobyty socjalizacyjno-terapeutyczne/)
  assert.match(source, /Terapia kotów/)
  assert.match(source, /Pytania przed pierwszym kontaktem/)
  assert.doesNotMatch(source, /SocialProofSection/)
  assert.doesNotMatch(source, /SocialSection/)
  assert.doesNotMatch(source, /ShareActions/)
  assert.doesNotMatch(source, /id="publikacje"/)
  assert.doesNotMatch(source, /Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut/)
  assert.doesNotMatch(source, /Ma być prosto, uczciwie i bez niepewności/)
})

test('payment page does not expose the public test-mode banner copy', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'payment', 'page.tsx'), 'utf8')

  assert.doesNotMatch(source, /To środowisko testowe płatności/)
  assert.match(source, /1 minutę na samodzielne anulowanie zakupu/)
})

test('public pricing disclosure stays fixed at the 39 zl baseline on public steps and keeps generic checkout copy', () => {
  const homeSource = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')
  const formSource = readFileSync(path.join(process.cwd(), 'app', 'form', 'page.tsx'), 'utf8')
  const expectedMessage = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}. ${PRE_TOPIC_PRICE_CONFIRMATION_COPY}`
  const blockedPricePattern = new RegExp(`${BLOCKED_CONSULTATION_PRICE_PLN}(?:\\s|\\u00a0)?zł`, 'i')
  const beforeTopicMarkup = renderToStaticMarkup(
    createElement(PricingDisclosure, {
      stage: 'pre-topic',
      labelClassName: 'hero-price-label',
      messageAs: 'strong',
      showNote: true,
      showCompare: true,
    }),
  )
  const beforePaymentMarkup = renderToStaticMarkup(
    createElement(PricingDisclosure, {
      stage: 'pre-payment',
      labelAs: 'strong',
    }),
  )
  const fallbackTopicMarkup = renderToStaticMarkup(createElement(PricingDisclosure, { stage: 'pre-topic' }))
  const dynamicTopicMarkup = renderToStaticMarkup(
    createElement(PricingDisclosure, {
      stage: 'pre-topic',
      message: buildPublicPricingDisclosureMessage(DEFAULT_PRICE_PLN),
      messageAs: 'strong',
    }),
  )

  assert.doesNotMatch(beforeTopicMarkup, blockedPricePattern)
  assert.doesNotMatch(beforePaymentMarkup, blockedPricePattern)
  assert.doesNotMatch(homeSource, blockedPricePattern)
  assert.doesNotMatch(bookSource, blockedPricePattern)
  assert.doesNotMatch(formSource, blockedPricePattern)
  assert.equal(beforeTopicMarkup.includes(expectedMessage), true)
  assert.equal(fallbackTopicMarkup.includes(expectedMessage), true)
  assert.equal(dynamicTopicMarkup.includes(expectedMessage), true)
  assert.doesNotMatch(homeSource, /getActiveConsultationPrice/)
  assert.doesNotMatch(bookSource, /getActiveConsultationPrice/)
})

test('booking flow uses neutral stage labels instead of a conflicting six-step counter', () => {
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')
  const slotSource = readFileSync(path.join(process.cwd(), 'app', 'slot', 'page.tsx'), 'utf8')
  const slotLoadingSource = readFileSync(path.join(process.cwd(), 'app', 'slot', 'loading.tsx'), 'utf8')
  const formSource = readFileSync(path.join(process.cwd(), 'app', 'form', 'page.tsx'), 'utf8')
  const formLoadingSource = readFileSync(path.join(process.cwd(), 'app', 'form', 'loading.tsx'), 'utf8')
  const topicStageMarkup = renderToStaticMarkup(createElement(BookingStageEyebrow, { stage: 'topic' }))
  const slotStageMarkup = renderToStaticMarkup(createElement(BookingStageEyebrow, { stage: 'slot' }))
  const detailsStageMarkup = renderToStaticMarkup(createElement(BookingStageEyebrow, { stage: 'details' }))

  assert.match(topicStageMarkup, /Etap rezerwacji: wybór tematu/)
  assert.match(slotStageMarkup, /Etap rezerwacji: wybór terminu/)
  assert.match(detailsStageMarkup, /Etap rezerwacji: dane do konsultacji/)
  assert.doesNotMatch(`${slotSource}\n${formSource}`, /Krok\s+\d+\s+z\s+\d+/)
  assert.doesNotMatch(slotLoadingSource, /Krok\s+\d+\s+z\s+\d+/)
  assert.doesNotMatch(formLoadingSource, /Krok\s+\d+\s+z\s+\d+/)
  assert.doesNotMatch(bookSource, /ShareActions/)
})

test('homepage keeps the simplified section order for the sales flow', () => {
  const homeSource = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')
  const heroIndex = homeSource.indexOf('id="start"')
  const helpIndex = homeSource.indexOf('id="jak-moge-pomoc"')
  const offersIndex = homeSource.indexOf('id="formy-wspolpracy"')
  const staysIndex = homeSource.indexOf('id="pobyty"')
  const catsIndex = homeSource.indexOf('id="koty"')
  const processIndex = homeSource.indexOf('id="jak-pracuje"')
  const trustIndex = homeSource.indexOf('id="zaufanie"')
  const faqIndex = homeSource.indexOf('id="faq"')
  const ctaIndex = homeSource.indexOf('Przejdź do kontaktu')

  assert.ok(heroIndex > -1)
  assert.ok(helpIndex > heroIndex)
  assert.ok(offersIndex > helpIndex)
  assert.ok(staysIndex > offersIndex)
  assert.ok(catsIndex > staysIndex)
  assert.ok(processIndex > catsIndex)
  assert.ok(trustIndex > processIndex)
  assert.ok(faqIndex > trustIndex)
  assert.ok(ctaIndex > faqIndex)
})

test('book page exposes the updated 1-minute self-cancel promise instead of the old disclaimer', () => {
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')

  assert.match(bookSource, /Po opłaceniu masz 1 minutę na samodzielną rezygnację/)
  assert.doesNotMatch(bookSource, /automatycznego anulowania w 60 sekund/)
})

test('footer keeps a hidden build marker without exposing technical copy to the client', () => {
  process.env.VERCEL_GIT_COMMIT_REF = 'main'
  process.env.VERCEL_GIT_COMMIT_SHA = 'fa5563d1234567890abcdef'

  const markup = renderToStaticMarkup(createElement(Footer))

  assert.doesNotMatch(markup, /Wersja serwisu/)
  assert.doesNotMatch(markup, /main \/ fa5563d/)
  assert.match(markup, /data-build-marker="CLEAN_START_REPO_V1:main:fa5563d"/)
})

test('release smoke normalizes visible text and extracts the build marker from html', () => {
  const html = `
    <section>
      <h1>Formy współpracy</h1>
      <p>Dobierz formę pomocy do sytuacji.</p>
      <script>window.__ignore = "Cena konsultacji"</script>
      <div data-build-marker="${BUILD_MARKER_KEY}:main:9bf474c" hidden></div>
    </section>
  `

  const visibleText = extractVisibleTextFromHtml(html)

  assert.equal(normalizeReleaseSmokeText(visibleText).includes('Formy współpracy'), true)
  assert.equal(normalizeReleaseSmokeText(visibleText).includes('Cena konsultacji'), false)
  assert.equal(extractBuildMarkerFromHtml(html), `${BUILD_MARKER_KEY}:main:9bf474c`)
})

test('release smoke detects missing, forbidden and out-of-order phrases', () => {
  const html = `
    <main data-build-marker="${BUILD_MARKER_KEY}:main:9bf474c">
      <section>Formy współpracy</section>
      <section>Jak mogę pomóc</section>
      <section>Kontakt</section>
      <section>Udostępnij znajomemu</section>
    </main>
  `

  const result = evaluateReleaseSmokePage(html, 'https://beh2.vercel.app/', {
    path: '/',
    required: ['Terapia kotów'],
    forbidden: ['Udostępnij znajomemu'],
    ordered: ['Jak mogę pomóc', 'Formy współpracy'],
    requireBuildMarker: true,
  })

  assert.equal(result.url, 'https://beh2.vercel.app/')
  assert.deepEqual(result.missing, ['Terapia kotów'])
  assert.deepEqual(result.forbiddenFound, ['Udostępnij znajomemu'])
  assert.deepEqual(result.orderFailures, ['wrong order around: Formy współpracy'])
  assert.equal(result.ok, false)
})

test('release smoke builds the expected marker from branch and short commit', () => {
  assert.equal(buildExpectedMarker('main', '9bf474c'), `${BUILD_MARKER_KEY}:main:9bf474c`)
})

test('builds a robots response that points to the sitemap', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://beh2.vercel.app'

  const config = robots()

  assert.equal(config.host, 'https://beh2.vercel.app')
  assert.equal(config.sitemap, 'https://beh2.vercel.app/sitemap.xml')
})

test('builds a sitemap with the core public routes', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://beh2.vercel.app'

  const entries = sitemap()
  const urls = entries.map((entry) => entry.url)

  assert.deepEqual(urls, [
    'https://beh2.vercel.app/',
    'https://beh2.vercel.app/oferta',
    'https://beh2.vercel.app/oferta/szybka-konsultacja-15-min',
    'https://beh2.vercel.app/oferta/konsultacja-30-min',
    'https://beh2.vercel.app/oferta/konsultacja-behawioralna-online',
    'https://beh2.vercel.app/oferta/konsultacja-domowa-wyjazdowa',
    'https://beh2.vercel.app/oferta/indywidualna-terapia-behawioralna',
    'https://beh2.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne',
    'https://beh2.vercel.app/oferta/poradniki-pdf',
    'https://beh2.vercel.app/koty',
    'https://beh2.vercel.app/kontakt',
    'https://beh2.vercel.app/book',
    'https://beh2.vercel.app/polityka-prywatnosci',
    'https://beh2.vercel.app/regulamin',
  ])
})

test('renders the combined social proof section when there are no approved testimonials yet', () => {
  const markup = renderToStaticMarkup(createElement(SocialProofSection))

  if (TESTIMONIALS.length === 0) {
    assert.match(markup, /Opinie i realne przypadki/)
    assert.match(markup, /Historie opiekunów i efekty konsultacji/)
    assert.match(markup, /To miejsce zbiera realne opisy efektów pierwszej konsultacji/)
    assert.match(markup, /Publikujemy wyłącznie opinie zaakceptowane po weryfikacji/)
    return
  }

  assert.match(markup, /Opinie klientów/)
  assert.match(markup, /Pierwsze zweryfikowane opinie pojawią się tutaj wkrótce/)
  assert.match(markup, /Publikujemy wyłącznie opinie zaakceptowane po weryfikacji/)
})

test('rejects testimonial submission when required consents are missing', async () => {
  const response = await submitTestimonialRoute(
    new Request('http://localhost/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'Anna',
        email: 'anna@example.com',
        issueCategory: 'lek-separacyjny',
        opinion: 'Rozmowa pomogła mi uporządkować pierwszy plan działania i wrócić do spokojniejszej pracy w domu.',
        beforeAfter: 'Wcześniej nie wiedziałam, od czego zacząć. Po konsultacji miałam jasny plan na kolejne dni.',
        photoUrl: '',
        consentContact: true,
        consentPublish: false,
        website: '',
      }),
    }),
  )

  const payload = (await response.json()) as { error?: string }

  assert.equal(response.status, 400)
  assert.match(payload.error ?? '', /obie zgody/i)
})

test('rejects testimonial submission with invalid email', async () => {
  const response = await submitTestimonialRoute(
    new Request('http://localhost/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'Anna',
        email: 'anna-at-example.com',
        issueCategory: 'lek-separacyjny',
        opinion: 'Rozmowa pomogła mi uporządkować pierwszy plan działania i wrócić do spokojniejszej pracy w domu.',
        beforeAfter: 'Wcześniej nie wiedziałam, od czego zacząć. Po konsultacji miałam jasny plan na kolejne dni.',
        photoUrl: '',
        consentContact: true,
        consentPublish: true,
        website: '',
      }),
    }),
  )

  const payload = (await response.json()) as { error?: string }

  assert.equal(response.status, 400)
  assert.match(payload.error ?? '', /adres e-mail/i)
})

test('returns a controlled unavailable message when testimonial mail env is missing', async () => {
  delete process.env.RESEND_API_KEY
  delete process.env.RESEND_FROM_EMAIL
  delete process.env.BEHAVIOR15_CONTACT_EMAIL

  const response = await submitTestimonialRoute(
    new Request('http://localhost/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'Anna',
        email: 'anna@example.com',
        issueCategory: 'lek-separacyjny',
        opinion: 'Rozmowa pomogła mi uporządkować pierwszy plan działania i wrócić do spokojniejszej pracy w domu.',
        beforeAfter: 'Wcześniej nie wiedziałam, od czego zacząć. Po konsultacji miałam jasny plan na kolejne dni.',
        photoUrl: '',
        consentContact: true,
        consentPublish: true,
        website: '',
      }),
    }),
  )

  const payload = (await response.json()) as { error?: string }

  assert.equal(response.status, 503)
  assert.match(payload.error ?? '', /Formularz opinii jest chwilowo niedostępny/i)
})
