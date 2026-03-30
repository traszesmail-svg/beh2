import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { afterEach, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ContactPage from '@/app/kontakt/page'
import PdfGuideDetailPage from '@/app/oferta/poradniki-pdf/[guideSlug]/page'
import PdfBundleDetailPage from '@/app/oferta/poradniki-pdf/pakiety/[bundleSlug]/page'
import PdfGuidesListingPage from '@/app/oferta/poradniki-pdf/page'
import PrivacyPolicyPage from '@/app/polityka-prywatnosci/page'
import TermsPage from '@/app/regulamin/page'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { getBookingApiErrorSnapshot } from '@/lib/server/booking-api-errors'
import { POST as bookingCompleteRoute } from '@/app/api/bookings/[id]/complete/route'
import { PATCH as bookingPreparationPatchRoute, POST as bookingPreparationPostRoute } from '@/app/api/bookings/[id]/prep/route'
import { POST as manualPaymentRoute } from '@/app/api/payments/manual/route'
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
  buildFormHref,
  buildPaymentHref,
  buildSlotHref,
  readProblemTypeSearchParam,
} from '@/lib/booking-routing'
import {
  buildExpectedMarker,
  evaluateReleaseSmokePage,
  extractBuildMarkerFromHtml,
  extractVisibleTextFromHtml,
  normalizeReleaseSmokeText,
} from '@/lib/release-smoke'
import {
  buildRollingAvailabilitySeed,
  getProblemLabel,
  getSecondsUntilRoomUnlock,
  isCallRoomUnlocked,
  isFutureAvailabilitySlot,
  isProblemType,
} from '@/lib/data'
import { normalizePolishPhone } from '@/lib/phone'
import { getDataModeStatus, getPaymentModeStatus, getSupabaseServiceRoleKeyIssue } from '@/lib/server/env'
import { getLocalStoreDataDir } from '@/lib/server/local-store-path'
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
  buildPreparationVideoStoragePath,
  canAccessPreparationMaterials,
  canEditPreparationMaterials,
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
import {
  getCustomerEmailDeliveryConfigIssue,
  sendBookingReservationCreatedEmail,
  sendManualPaymentReportedAdminEmail,
  shouldSendBookingConfirmationAfterPayment,
} from '@/lib/server/notifications'
import { getReminderAuthorizationError, runBookingReminderSweep } from '@/lib/server/reminder-runner'
import { getWarsawDateTime, shouldSendReminderForBooking } from '@/lib/server/reminders'
import { getLatestQaReportPath, readLatestQaReport } from '@/lib/server/qa-report'
import { buildPaymentConfirmationSmsMessage, sendPaymentConfirmationSms } from '@/lib/server/sms'
import { assertStripeCheckoutAmountSupported, buildCheckoutSessionParams, isStripeTestMode } from '@/lib/server/stripe'
import { getOfferByServiceSlug, getOfferBySlug, getOfferDetailCtaLabel, getOfferDetailHref } from '@/lib/offers'
import { getPdfGuideBySlug, getPdfGuideCoverSrc, getPdfPricingBadge, listPdfRoutePaths } from '@/lib/pdf-guides'
import { getManualPaymentDetailCards, getManualPaymentDisplayCopy } from '@/lib/manual-payment'
import { CATS_PAGE_PHOTO, SPECIALIST_CAT_PHOTO, SPECIALIST_EXTENDED_START_PHOTO, TOPIC_VISUALS, getContactDetails } from '@/lib/site'
import { TESTIMONIALS } from '@/lib/testimonials'
import { getPayuOptionStatus } from '@/lib/server/payment-options'

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
const localStoreDataDir = getLocalStoreDataDir()
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
  const amount = parseConsultationPriceInput('69,50')

  assert.equal(amount, 69.5)
  assert.equal(toStripeUnitAmount(amount), 6950)
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
  assert.throws(() => parseConsultationPriceInput('58.99'), /59/)
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

test('maps upstream booking gateway failures to a controlled unavailable response', () => {
  const failure = getBookingApiErrorSnapshot(
    new Error('<!DOCTYPE html><title>502: Bad gateway</title><div>Cloudflare</div><div>Error code 502</div>'),
  )

  assert.equal(failure.status, 503)
  assert.match(failure.message, /Rezerwacja chwilowo jest niedostępna/i)
})

test('keeps slot-conflict booking errors user-correctable', () => {
  const failure = getBookingApiErrorSnapshot(new Error('Wybrany termin nie jest już dostępny.'))

  assert.equal(failure.status, 409)
  assert.match(failure.message, /termin/i)
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

test('booking routing helpers keep canonical query urls and validate problem params', () => {
  assert.equal(buildSlotHref('dogoterapia'), '/slot?problem=dogoterapia')
  assert.equal(buildFormHref('szczeniak', '2026-03-28-08:10'), '/form?problem=szczeniak&slotId=2026-03-28-08%3A10')
  assert.equal(buildPaymentHref('booking-123', 'opaque token'), '/payment?bookingId=booking-123&access=opaque+token')
  assert.equal(readProblemTypeSearchParam(['kot', 'inne']), 'kot')
  assert.equal(readProblemTypeSearchParam('nie-ma-takiego'), null)
})

test('keeps the room locked until exactly 15 minutes before the consultation', () => {
  const beforeUnlock = new Date('2026-03-26T10:44:30Z')
  const atUnlock = new Date('2026-03-26T10:45:00Z')

  assert.equal(getSecondsUntilRoomUnlock('2026-03-26', '12:00', beforeUnlock), 30)
  assert.equal(isCallRoomUnlocked('2026-03-26', '12:00', beforeUnlock), false)
  assert.equal(isCallRoomUnlocked('2026-03-26', '12:00', atUnlock), true)
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
      amount: 67,
    } as const,
    {
      accessToken: 'opaque-token',
    },
  )

  const lineItem = params.line_items?.[0]

  assert.equal(params.success_url, 'https://behawior15.test/confirmation?bookingId=booking-123&access=opaque-token&session_id={CHECKOUT_SESSION_ID}')
  assert.equal(params.cancel_url, 'https://behawior15.test/payment?bookingId=booking-123&access=opaque-token&cancelled=1')
  assert.equal(extractUnitAmount(lineItem), 6700)
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

test('unlocks preparation materials only after a paid booking', () => {
  assert.equal(canAccessPreparationMaterials({ bookingStatus: 'pending', paymentStatus: 'unpaid' }), false)
  assert.equal(
    canAccessPreparationMaterials({ bookingStatus: 'pending_manual_payment', paymentStatus: 'pending_manual_review' }),
    false,
  )
  assert.equal(canAccessPreparationMaterials({ bookingStatus: 'confirmed', paymentStatus: 'paid' }), true)
  assert.equal(canEditPreparationMaterials({ bookingStatus: 'done', paymentStatus: 'paid' }), true)
})

test('preparation route blocks unpaid bookings and saves materials only after payment', async () => {
  process.env.APP_DATA_MODE = 'local'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost'
  process.env.RESEND_API_KEY = ''
  process.env.SMS_PROVIDER = 'disabled'

  const backups = await backupLocalStoreFiles()
  const prepMaterialsDir = path.join(localStoreDataDir, 'prep-materials')

  try {
    await Promise.all(trackedLocalStoreFiles.map((fileName) => rm(path.join(localStoreDataDir, fileName), { force: true })))
    await rm(prepMaterialsDir, { recursive: true, force: true })

    const availability = await listLocalAvailability()
    const [slot] = availability.flatMap((group) => group.slots)
    assert.ok(slot, 'Expected one slot for preparation route test.')

    const booking = await createLocalPendingBooking({
      ownerName: 'Prep Route',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '2 lata',
      durationNotes: 'Od tygodnia',
      description: 'Test odblokowania materiałów dopiero po płatności.',
      phone: '500600700',
      email: 'prep-route@example.com',
      slotId: slot.id,
    })

    const deniedResponse = await bookingPreparationPatchRoute(
      new Request(`http://localhost/api/bookings/${booking.booking.id}/prep?access=${booking.accessToken}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prepNotes: 'To nie powinno przejść przed płatnością.',
        }),
      }),
      { params: { id: booking.booking.id } },
    )

    assert.equal(deniedResponse.status, 409)
    assert.match(((await deniedResponse.json()) as { error?: string }).error ?? '', /potwierdzonej płatności/i)

    await markLocalBookingPaid(booking.booking.id, {
      paymentMethod: 'mock',
      triggerPaymentConfirmationSms: false,
    })

    const invalidUploadResponse = await bookingPreparationPostRoute(
      new Request(`http://localhost/api/bookings/${booking.booking.id}/prep?access=${booking.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-upload-target',
          fileName: 'zachowanie.mov',
          fileSize: 2048,
          contentType: 'video/quicktime',
        }),
      }),
      { params: { id: booking.booking.id } },
    )

    assert.equal(invalidUploadResponse.status, 400)
    assert.match(((await invalidUploadResponse.json()) as { error?: string }).error ?? '', /MP4/)

    const formData = new FormData()
    formData.append('file', new File([new Uint8Array([1, 2, 3, 4])], 'zachowanie.mp4', { type: 'video/mp4' }))

    const uploadResponse = await bookingPreparationPostRoute(
      new Request(`http://localhost/api/bookings/${booking.booking.id}/prep?access=${booking.accessToken}`, {
        method: 'POST',
        body: formData,
      }),
      { params: { id: booking.booking.id } },
    )

    assert.equal(uploadResponse.status, 200)

    const uploadPayload = (await uploadResponse.json()) as {
      ok?: boolean
      prep?: {
        hasVideo: boolean
        prepVideoFilename: string | null
      }
    }

    assert.equal(uploadPayload.ok, true)
    assert.equal(uploadPayload.prep?.hasVideo, true)
    assert.equal(uploadPayload.prep?.prepVideoFilename, 'zachowanie.mp4')

    const metadataResponse = await bookingPreparationPatchRoute(
      new Request(`http://localhost/api/bookings/${booking.booking.id}/prep?access=${booking.accessToken}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prepLinkUrl: 'https://example.com/materialy',
          prepNotes: 'Krótki opis sytuacji.',
        }),
      }),
      { params: { id: booking.booking.id } },
    )

    assert.equal(metadataResponse.status, 200)

    const storedBooking = await getLocalBookingById(booking.booking.id)
    assert.equal(storedBooking?.prepVideoPath, buildPreparationVideoStoragePath(booking.booking.id))
    assert.equal(storedBooking?.prepLinkUrl, 'https://example.com/materialy')
    assert.equal(storedBooking?.prepNotes, 'Krótki opis sytuacji.')

    const storedVideo = await readFile(
      path.join(prepMaterialsDir, ...buildPreparationVideoStoragePath(booking.booking.id).split('/')),
    )
    assert.equal(storedVideo.length, 4)
  } finally {
    await rm(prepMaterialsDir, { recursive: true, force: true })
    await restoreLocalStoreFiles(backups)
  }
})

test('creates and verifies opaque customer access tokens', () => {
  const token = createCustomerAccessToken()

  assert.equal(typeof token.rawToken, 'string')
  assert.equal(token.tokenHash, hashCustomerAccessToken(token.rawToken))
  assert.equal(hasValidCustomerAccessToken(token.rawToken, token.tokenHash), true)
  assert.equal(hasValidCustomerAccessToken('zly-token', token.tokenHash), false)
})

test('allows self-cancellation only during the first 24 hours after payment', () => {
  const paidAt = '2026-03-24T10:00:00.000Z'

  assert.equal(
    canSelfCancelBooking(
      {
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'payu',
        paidAt,
      },
      new Date(Date.parse(paidAt) + 2 * 60 * 60 * 1000),
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
      new Date(Date.parse(paidAt) + 2 * 60 * 60 * 1000),
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
      new Date(Date.parse(paidAt) + 2 * 60 * 60 * 1000),
    ),
    false,
  )
})

test('complete route requires viewer access and only closes paid active bookings', async () => {
  process.env.APP_DATA_MODE = 'local'
  process.env.RESEND_API_KEY = ''
  process.env.SMS_PROVIDER = 'disabled'

  const backups = await backupLocalStoreFiles()

  try {
    await Promise.all(
      trackedLocalStoreFiles.map((fileName) => rm(path.join(localStoreDataDir, fileName), { force: true })),
    )

    const availability = await listLocalAvailability()
    const [slot] = availability.flatMap((group) => group.slots)

    assert.ok(slot)

    const created = await createLocalPendingBooking({
      ownerName: 'Room Finish',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '2 lata',
      durationNotes: 'Od tygodnia',
      description: 'Closing the room should require a paid active booking and a valid viewer token.',
      phone: '500700800',
      email: 'room-finish@example.com',
      slotId: slot!.id,
    })

    const deniedResponse = await bookingCompleteRoute(
      new Request(`http://localhost/api/bookings/${created.booking.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendedNextStep: 'Nie powinno przejÅ›Ä‡ bez dostÄ™pu.' }),
      }),
      { params: { id: created.booking.id } },
    )

    assert.equal(deniedResponse.status, 403)
    assert.match(((await deniedResponse.json()) as { error?: string }).error ?? '', /link do rozmowy/i)

    const unpaidResponse = await bookingCompleteRoute(
      new Request(`http://localhost/api/bookings/${created.booking.id}/complete?access=${created.accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendedNextStep: 'Za wczeÅ›nie na zamkniÄ™cie.' }),
      }),
      { params: { id: created.booking.id } },
    )

    assert.equal(unpaidResponse.status, 409)
    assert.match(((await unpaidResponse.json()) as { error?: string }).error ?? '', /potwierdzonej|platnosci|płatności/i)

    await markLocalBookingPaid(created.booking.id)

    const successResponse = await bookingCompleteRoute(
      new Request(`http://localhost/api/bookings/${created.booking.id}/complete?access=${created.accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendedNextStep: 'PeÅ‚na konsultacja po pierwszej rozmowie.' }),
      }),
      { params: { id: created.booking.id } },
    )

    const stored = await getLocalBookingById(created.booking.id)

    assert.equal(successResponse.status, 200)
    assert.equal(stored?.bookingStatus, 'done')
    assert.match(stored?.recommendedNextStep ?? '', /PeÅ‚na konsultacja/)
  } finally {
    await restoreLocalStoreFiles(backups)
  }
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

test('sends payment confirmation request emails to ADMIN_NOTIFICATION_EMAIL', async () => {
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
      description: 'Test wplaty do potwierdzenia.',
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
  assert.match(requestBody, /Płatność do potwierdzenia do 60 min/)
  assert.match(requestBody, /Jest wpłata - potwierdź i otwórz pokój/)
  assert.match(requestBody, /Nie ma wpłaty/)
})

test('manual payment route keeps the booking pending and redirects with a warning when admin notification is not sent', async () => {
  process.env.APP_DATA_MODE = 'local'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost'
  process.env.RESEND_API_KEY = ''
  process.env.ADMIN_NOTIFICATION_EMAIL = 'ops@example.com'
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_REVIEW_SECRET = 'review-secret'
  process.env.SMS_PROVIDER = 'disabled'

  const backups = await backupLocalStoreFiles()

  try {
    await Promise.all(trackedLocalStoreFiles.map((fileName) => rm(path.join(localStoreDataDir, fileName), { force: true })))

    const availability = await listLocalAvailability()
    const [slot] = availability.flatMap((group) => group.slots)
    assert.ok(slot, 'Expected one slot for manual payment route test.')

    const booking = await createLocalPendingBooking({
      ownerName: 'Manual Route',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '2 lata',
      durationNotes: 'Od tygodnia',
      description: 'Test ostrzezenia o niedostarczonym mailu do obslugi po zgloszeniu wplaty.',
      phone: '500600700',
      email: 'manual-route@example.com',
      slotId: slot.id,
    })

    const response = await manualPaymentRoute(
      new Request('http://localhost/api/payments/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.booking.id,
          accessToken: booking.accessToken,
        }),
      }),
    )

    assert.equal(response.status, 200)

    const payload = (await response.json()) as { redirectTo?: string }
    assert.match(payload.redirectTo ?? '', /manual=reported/)
    assert.match(payload.redirectTo ?? '', /adminNotice=skipped/)

    const updated = await getLocalBookingById(booking.booking.id)
    assert.equal(updated?.bookingStatus, 'pending_manual_payment')
    assert.equal(updated?.paymentStatus, 'pending_manual_review')
  } finally {
    await restoreLocalStoreFiles(backups)
  }
})

test('marks resend.dev customer delivery as restricted until a domain is verified', () => {
  process.env.RESEND_API_KEY = 'resend-test-key'
  process.env.RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'coapebehawiorysta@gmail.com'

  assert.match(
    getCustomerEmailDeliveryConfigIssue('klient@example.com') ?? '',
    /resend\.dev testing mode|verify a domain/i,
  )
  assert.equal(getCustomerEmailDeliveryConfigIssue('coapebehawiorysta@gmail.com'), null)
})

test('reports an invalid configured resend sender instead of masking it as resend testing mode', () => {
  process.env.RESEND_API_KEY = 'resend-test-key'
  process.env.RESEND_FROM_EMAIL = 'Behawior 15 <mail.behawiorystacoape.com>'
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'coapebehawiorysta@gmail.com'

  assert.equal(getCustomerEmailDeliveryConfigIssue('klient@example.com'), 'RESEND_FROM_EMAIL missing or invalid')
})

test('skips customer booking emails for external recipients when resend is still in testing mode', async () => {
  process.env.RESEND_API_KEY = 'resend-test-key'
  process.env.RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'coapebehawiorysta@gmail.com'

  let fetchCalled = false
  globalThis.fetch = async () => {
    fetchCalled = true
    throw new Error('fetch should not be called for blocked testing-mode customer emails')
  }

  const result = await sendBookingReservationCreatedEmail({
    id: 'booking-customer-email-skip',
    ownerName: 'Jan Testowy',
    problemType: 'szczeniak',
    animalType: 'Pies',
    petAge: '8 miesiecy',
    durationNotes: '2 tygodnie',
    description: 'Test blokady wysylki do zewnetrznego adresu.',
    phone: '500600700',
    email: 'klient@example.com',
    bookingDate: '2026-03-27',
    bookingTime: '11:00',
    slotId: 'slot-1',
    amount: 39,
    bookingStatus: 'pending',
    paymentStatus: 'unpaid',
    meetingUrl: 'https://meet.jit.si/behawior15-test-room',
    createdAt: '2026-03-26T10:00:00.000Z',
    updatedAt: '2026-03-26T10:00:00.000Z',
  })

  assert.equal(fetchCalled, false)
  assert.equal(result.status, 'skipped')
  assert.match(result.reason ?? '', /resend\.dev testing mode|verify a domain/i)
})

test('skips customer booking emails when RESEND_FROM_EMAIL is malformed', async () => {
  process.env.RESEND_API_KEY = 'resend-test-key'
  process.env.RESEND_FROM_EMAIL = 'Behawior 15 <mail.behawiorystacoape.com>'
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'coapebehawiorysta@gmail.com'

  let fetchCalled = false
  globalThis.fetch = async () => {
    fetchCalled = true
    throw new Error('fetch should not be called for malformed resend sender config')
  }

  const result = await sendBookingReservationCreatedEmail({
    id: 'booking-customer-email-invalid-from',
    ownerName: 'Jan Testowy',
    problemType: 'szczeniak',
    animalType: 'Pies',
    petAge: '8 miesiecy',
    durationNotes: '2 tygodnie',
    description: 'Test blokady wysylki przy niepoprawnym nadawcy Resend.',
    phone: '500600700',
    email: 'klient@example.com',
    bookingDate: '2026-03-27',
    bookingTime: '11:00',
    slotId: 'slot-1',
    amount: 39,
    bookingStatus: 'pending',
    paymentStatus: 'unpaid',
    meetingUrl: 'https://meet.jit.si/behawior15-test-room',
    createdAt: '2026-03-26T10:00:00.000Z',
    updatedAt: '2026-03-26T10:00:00.000Z',
  })

  assert.equal(fetchCalled, false)
  assert.equal(result.status, 'skipped')
  assert.equal(result.reason, 'RESEND_FROM_EMAIL missing or invalid')
})

test('payment review approve opens the room and reject says client must return to payment', async () => {
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
      ownerName: 'Approve Payment',
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
      ownerName: 'Reject Payment',
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

test('payment review does not show a generic failure after a stale approve click on a rejected booking', async () => {
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
    const [slot] = availability.flatMap((group) => group.slots)

    assert.ok(slot)

    const booking = await createLocalPendingBooking({
      ownerName: 'Stale Approve',
      problemType: 'kot',
      animalType: 'Kot',
      petAge: '3 lata',
      durationNotes: 'Od tygodnia',
      description: 'Approve link after reject should not show generic failure.',
      phone: '500900800',
      email: 'stale@example.com',
      slotId: slot!.id,
    })

    const pending = await markLocalBookingManualPaymentPending(booking.booking.id, {
      paymentReference: 'STALE-REF',
    })

    assert.ok(pending?.paymentReportedAt)

    const approveToken = createManualPaymentReviewToken(booking.booking.id, 'approve', pending?.paymentReportedAt)
    await manualPaymentReviewRoute(
      new Request(
        `http://localhost/manual-payment/review?bookingId=${booking.booking.id}&action=reject&token=${createManualPaymentReviewToken(booking.booking.id, 'reject', pending?.paymentReportedAt)}`,
      ),
    )

    const staleApproveResponse = await manualPaymentReviewRoute(
      new Request(
        `http://localhost/manual-payment/review?bookingId=${booking.booking.id}&action=approve&token=${approveToken}`,
      ),
    )
    const staleApproveHtml = await staleApproveResponse.text()

    assert.equal(staleApproveResponse.status, 200)
    assert.match(staleApproveHtml, /Nie ma wpłaty - wróć do płatności/)
    assert.doesNotMatch(staleApproveHtml, /Akcja nie powiodła się/)
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
  })
})

test('ignores invalid public contact email values', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt.behawiorystacoape.com'
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: 'coapebehawiorysta@gmail.com',
    phoneDisplay: null,
    phoneHref: null,
  })
})

test('formats public phone details for the footer and legal pages', () => {
  delete process.env.BEHAVIOR15_CONTACT_EMAIL
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'

  assert.deepEqual(getContactDetails(), {
    email: 'coapebehawiorysta@gmail.com',
    phoneDisplay: '500 600 700',
    phoneHref: '500600700',
  })
})

test('prefers a valid configured public email over the fallback address', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt@behawior15.pl'
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: 'kontakt@behawior15.pl',
    phoneDisplay: null,
    phoneHref: null,
  })
})

test('normalizes public PDF pricing badges for cards and detail headers', () => {
  assert.equal(getPdfPricingBadge('49 zł albo dostęp po konsultacji 30 min'), '49 zł')
  assert.equal(getPdfPricingBadge('0 zł po zapisie na listę lub jako materiał po pierwszym kontakcie'), '0 zł')
  assert.equal(getPdfPricingBadge('dostęp po konsultacji dla kota lub 29 zł jako dodatek'), '29 zł jako dodatek')
  assert.equal(getPdfPricingBadge('79 zł'), '79 zł')
})

test('resolves offer contact routes from canonical and alias service slugs', () => {
  assert.equal(getOfferByServiceSlug('poradniki-pdf')?.slug, 'poradniki-pdf')
  assert.equal(getOfferByServiceSlug('pdf')?.slug, 'poradniki-pdf')
  assert.equal(getOfferByServiceSlug('poradnik-pdf')?.slug, 'poradniki-pdf')
  assert.equal(getOfferByServiceSlug('konsultacja-behawioralna-online')?.slug, 'konsultacja-behawioralna-online')
})

test('pdf offer routes distinguish the listing from the inquiry action', () => {
  const pdfOffer = getOfferBySlug('poradniki-pdf')

  assert.equal(pdfOffer?.primaryHref, '/kontakt?service=poradniki-pdf')
  assert.equal(pdfOffer?.primaryCtaLabel, 'Napisz w sprawie poradnika lub pakietu')
  assert.equal(getOfferDetailHref(pdfOffer!), '/oferta/poradniki-pdf')
  assert.equal(getOfferDetailCtaLabel(pdfOffer!), 'Zobacz listę PDF')
  assert.equal(pdfOffer?.secondaryHref, '/oferta/poradniki-pdf')
  assert.equal(pdfOffer?.secondaryCtaLabel, 'Zobacz listę poradników PDF')
  assert.doesNotMatch(pdfOffer?.descriptions.join(' ') ?? '', /lejka marki/i)
})

test('offer imagery keeps adjacent service tiers visually distinct', () => {
  const quickStart = getOfferBySlug('szybka-konsultacja-15-min')
  const extendedStart = getOfferBySlug('konsultacja-30-min')
  const online = getOfferBySlug('konsultacja-behawioralna-online')
  const therapy = getOfferBySlug('indywidualna-terapia-behawioralna')
  const homeVisit = getOfferBySlug('konsultacja-domowa-wyjazdowa')
  const stays = getOfferBySlug('pobyty-socjalizacyjno-terapeutyczne')

  assert.notEqual(quickStart?.imageSrc, extendedStart?.imageSrc)
  assert.notEqual(online?.imageSrc, therapy?.imageSrc)
  assert.notEqual(homeVisit?.imageSrc, stays?.imageSrc)
})

test('topic visuals keep the weakest topic cards on the updated, better-fitting local assets', () => {
  assert.equal(TOPIC_VISUALS.separacja.src, '/branding/topic-cards/dog-window-alone.jpg')
  assert.equal(TOPIC_VISUALS.dogoterapia.src, '/branding/case-dog-home.jpg')
  assert.equal(TOPIC_VISUALS.inne.src, SPECIALIST_EXTENDED_START_PHOTO.src)
  assert.notEqual(TOPIC_VISUALS.dogoterapia.src, '/branding/topic-cards/dog-checkup.jpg')
  assert.notEqual(TOPIC_VISUALS.inne.src, '/branding/topic-cards/cat-in-arms.jpg')
})

test('contact page adapts copy for pdf inquiries and accepts alias service slugs', () => {
  const markup = renderToStaticMarkup(
    createElement(ContactPage, {
      searchParams: {
        service: 'pdf',
      },
    }),
  )

  assert.match(markup, /Zapytanie o: Poradniki PDF/)
  assert.match(markup, /Przejdź do listy poradników PDF/)
  assert.match(markup, /poradnik PDF|materiał czy konsultacja/i)
})

test('contact page keeps context for a specific pdf guide inquiry', () => {
  const markup = renderToStaticMarkup(
    createElement(ContactPage, {
      searchParams: {
        service: 'pdf',
        guide: 'pies-zostaje-sam-plan-pierwszych-krokow',
      },
    }),
  )

  assert.match(markup, /Wybrany poradnik PDF/)
  assert.match(markup, /Pies zostaje sam/)
  assert.match(markup, /Wróć do poradnika PDF/)
  assert.match(markup, /mailto:.*Pies\+zostaje\+sam/)
})

test('contact page shortcut cards use direct mail actions instead of looping back into kontakt routes', () => {
  const markup = renderToStaticMarkup(createElement(ContactPage))

  assert.match(markup, /mailto:.*Zapytanie\+-\+Konsultacja\+30\+min/)
  assert.match(markup, /Napisz w sprawie tej usługi/)
  assert.doesNotMatch(markup, /href="\/kontakt\?service=konsultacja-30-min"/)
})

test('pdf listing page renders generated guide and bundle sections from the snapshot data', () => {
  const markup = renderToStaticMarkup(createElement(PdfGuidesListingPage))

  assert.match(markup, /Gotowe materiały dla opiekunów psów i kotów/)
  assert.match(markup, /Napisz w sprawie poradnika lub pakietu/)
  assert.match(markup, /Umów konsultację 15 min/)
  assert.match(markup, /Pojedyncze poradniki, od których najłatwiej zacząć/)
  assert.match(markup, /Pakiety, gdy jeden PDF to za mało/)
  assert.match(markup, /Pozostałe tematy według obszaru/)
  assert.match(markup, /Co wybrać na start/)
  assert.match(markup, /Przejdź do pojedynczych poradników/)
  assert.match(markup, /Pies zostaje sam/)
  assert.match(markup, /Pakiet Startowy Psa/)
  assert.match(markup, /href="\/oferta\/poradniki-pdf#poradniki-startowe"/)
  assert.match(markup, /href="\/oferta\/poradniki-pdf#pakiety-pdf"/)
  assert.doesNotMatch(markup, /Tematy, od których najłatwiej zacząć/)
  assert.doesNotMatch(markup, /Jak wybrać między listą, kontaktem i konsultacją/)
  assert.doesNotMatch(markup, /Zobacz szczegóły/)
  assert.doesNotMatch(markup, /lead magnet/i)
  assert.doesNotMatch(markup, /bonus po konsultacji/i)
  assert.doesNotMatch(markup, /lejka marki/i)
  assert.doesNotMatch(markup, /wpiętych do oferty/i)
  assert.doesNotMatch(markup, /wydmuszk/i)
})

test('pdf guide and bundle detail pages render public offer routes from the integrated snapshot', () => {
  const guideMarkup = renderToStaticMarkup(
    createElement(PdfGuideDetailPage, {
      params: {
        guideSlug: 'pies-zostaje-sam-plan-pierwszych-krokow',
      },
    }),
  )
  const bundleMarkup = renderToStaticMarkup(
    createElement(PdfBundleDetailPage, {
      params: {
        bundleSlug: 'pakiet-startowy-psa',
      },
    }),
  )

  assert.match(guideMarkup, /Wróć do listingu poradników PDF/)
  assert.match(guideMarkup, /Napisz w sprawie zakupu i dostępu/)
  assert.match(guideMarkup, /Powiązana ścieżka pracy/)
  assert.match(bundleMarkup, /Pakiet Startowy Psa/)
  assert.match(bundleMarkup, /Napisz w sprawie tego pakietu/)
  assert.match(bundleMarkup, /Szczeniak: pierwsze 30 dni/)
})

test('legal pages render clickable public contact links', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt@behawior15.pl'
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'

  const privacyMarkup = renderToStaticMarkup(createElement(PrivacyPolicyPage))
  const termsMarkup = renderToStaticMarkup(createElement(TermsPage))

  assert.match(privacyMarkup, /href="mailto:kontakt@behawior15\.pl\?subject=/)
  assert.match(privacyMarkup, /href="tel:500600700"/)
  assert.match(termsMarkup, /href="mailto:kontakt@behawior15\.pl\?subject=/)
  assert.match(termsMarkup, /href="tel:500600700"/)
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

  assert.match(source, /Mały krok na start\. Szersza praca, gdy sytuacja tego wymaga\./)
  assert.match(source, /Dobieram formę pomocy do sytuacji/)
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

test('cats page copy avoids internal architecture language', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'koty', 'page.tsx'), 'utf8')

  assert.match(source, /Najczęstsze tematy/)
  assert.match(source, /Najważniejsze obszary pracy z kotami są już jasno rozpisane\./)
  assert.doesNotMatch(source, /landing pages/i)
  assert.doesNotMatch(source, /architekturze marki/i)
})

test('cats page keeps the route-level hero image mapped to the dedicated specialist-with-cat asset', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'koty', 'page.tsx'), 'utf8')

  assert.match(source, /CATS_PAGE_PHOTO/)
  assert.equal(CATS_PAGE_PHOTO.src, SPECIALIST_CAT_PHOTO.src)
})

test('offer page pdf block exposes product-style catalog cues around the cover stack', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'oferta', 'page.tsx'), 'utf8')

  assert.match(source, /showLegend/)
  assert.match(source, /pdfGuideCount/)
  assert.match(source, /pdfBundleCount/)
  assert.match(source, /tematów PDF|tematow PDF/)
  assert.match(source, /pakietów|pakietow/)
})

test('payment page does not expose the public test-mode banner copy and keeps the 24-hour cancellation promise', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'payment', 'page.tsx'), 'utf8')

  assert.doesNotMatch(source, /To środowisko testowe płatności/)
  assert.match(source, /24 godziny na bezpłatną rezygnację/)
})

test('reports PayU as unavailable when required production config is missing', () => {
  delete process.env.PAYU_CLIENT_ID
  delete process.env.PAYU_CLIENT_SECRET
  delete process.env.PAYU_POS_ID
  delete process.env.PAYU_SECOND_KEY

  const status = getPayuOptionStatus()

  assert.equal(status.isAvailable, false)
  assert.match(status.summary, /PAYU_CLIENT_ID/i)
  assert.match(status.summary, /PAYU_CLIENT_SECRET/i)
})

test('payment source falls back to manual-only copy when PayU is unavailable', () => {
  const paymentPageSource = readFileSync(path.join(process.cwd(), 'app', 'payment', 'page.tsx'), 'utf8')
  const paymentActionsSource = readFileSync(path.join(process.cwd(), 'components', 'PaymentActions.tsx'), 'utf8')

  assert.match(paymentPageSource, /payuAvailable\s*\?/)
  assert.match(paymentPageSource, /Chwilowo dostępna jest ręczna wpłata/)
  assert.match(paymentActionsSource, /payuAvailable\s*\?/)
  assert.match(paymentActionsSource, /Obecnie dostępna jest ręczna wpłata/)
})

test('manual payment copy reflects the actually configured methods without promising missing details', () => {
  const phoneOnlyCopy = getManualPaymentDisplayCopy({
    phoneDisplay: '512 992 026',
    bankAccountDisplay: null,
  })
  const phoneOnlyCards = getManualPaymentDetailCards({
    phoneDisplay: '512 992 026',
    bankAccountDisplay: null,
    accountName: 'Regulski',
  })
  const bankOnlyCopy = getManualPaymentDisplayCopy({
    phoneDisplay: null,
    bankAccountDisplay: '12 3456 7890 1234 5678 9012 3456',
  })
  const bankOnlyCards = getManualPaymentDetailCards({
    phoneDisplay: null,
    bankAccountDisplay: '12 3456 7890 1234 5678 9012 3456',
    accountName: 'Regulski',
  })

  assert.equal(phoneOnlyCopy.selectionTitle, 'BLIK na telefon')
  assert.equal(phoneOnlyCards.some((card) => card.label === 'Numer konta do przelewu'), false)
  assert.equal(bankOnlyCopy.selectionTitle, 'Przelew tradycyjny')
  assert.equal(bankOnlyCards.some((card) => card.label === 'BLIK na telefon'), false)
})

test('payment and confirmation source avoid promising customer emails when resend is still in testing mode', () => {
  const paymentPageSource = readFileSync(path.join(process.cwd(), 'app', 'payment', 'page.tsx'), 'utf8')
  const paymentActionsSource = readFileSync(path.join(process.cwd(), 'components', 'PaymentActions.tsx'), 'utf8')
  const confirmationSource = readFileSync(path.join(process.cwd(), 'app', 'confirmation', 'page.tsx'), 'utf8')

  assert.match(paymentPageSource, /customerEmailAvailable/)
  assert.match(paymentActionsSource, /customerEmailAvailable/)
  assert.match(confirmationSource, /customerEmailAvailable/)
  assert.match(paymentActionsSource, /zachowaj ten link/i)
  assert.match(paymentPageSource, /pokażemy link do pokoju bezpośrednio na stronie potwierdzenia/i)
  assert.match(confirmationSource, /pokażemy aktywny link do rozmowy bezpośrednio na tej stronie/i)
})

test('manual payment confirmation source surfaces admin notification delivery issues to the customer', () => {
  const manualPaymentRouteSource = readFileSync(path.join(process.cwd(), 'app', 'api', 'payments', 'manual', 'route.ts'), 'utf8')
  const confirmationSource = readFileSync(path.join(process.cwd(), 'app', 'confirmation', 'page.tsx'), 'utf8')

  assert.match(manualPaymentRouteSource, /adminNotice/)
  assert.match(confirmationSource, /adminNotice/)
  assert.match(confirmationSource, /automatyczne powiadomienie obsługi/i)
})

test('confirmation source auto-refreshes online checkout returns and logs sync failures', () => {
  const confirmationSource = readFileSync(path.join(process.cwd(), 'app', 'confirmation', 'page.tsx'), 'utf8')

  assert.match(confirmationSource, /returnedFromOnlineCheckout/)
  assert.match(confirmationSource, /isAwaitingOnlineConfirmation/)
  assert.match(confirmationSource, /ConfirmationStatusWatcher active=\{isWaitingManual \|\| isAwaitingOnlineConfirmation\}/)
  assert.match(confirmationSource, /onlineSyncWarning/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] stripe return finalize failed/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] payu return sync failed/)
  assert.match(confirmationSource, /booking\.paymentStatus === 'failed'/)
})

test('call page source distinguishes runtime load failures from an invalid room link', () => {
  const callPageSource = readFileSync(path.join(process.cwd(), 'app', 'call', '[id]', 'page.tsx'), 'utf8')

  assert.match(callPageSource, /flowError/)
  assert.match(callPageSource, /\[behawior15\]\[call\] failed to load booking/)
  assert.match(callPageSource, /Nie udalo sie wczytac pokoju rozmowy/)
  assert.match(callPageSource, /Ten link do rozmowy jest nieprawid/)
})

test('public pricing disclosure stays fixed at the 59 zl baseline on public steps and keeps generic checkout copy', () => {
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
  assert.doesNotMatch(homeSource, /jest aktywna, ale w tej chwili nie ma wolnych terminów/i)
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
  const ctaIndex = homeSource.indexOf('compact-sales-cta')

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

test('book page exposes the updated 24-hour cancellation promise instead of the old disclaimer', () => {
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')

  assert.match(bookSource, /Po opłaceniu masz 24 godziny na bezpłatną rezygnację/)
  assert.doesNotMatch(bookSource, /automatycznego anulowania w 60 sekund/)
})

test('booking funnel source keeps encoded slot links and standardized analytics events', () => {
  const slotSource = readFileSync(path.join(process.cwd(), 'app', 'slot', 'page.tsx'), 'utf8')
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')
  const formSource = readFileSync(path.join(process.cwd(), 'app', 'form', 'page.tsx'), 'utf8')
  const legacyProblemSource = readFileSync(path.join(process.cwd(), 'app', 'problem', 'page.tsx'), 'utf8')
  const headerSource = readFileSync(path.join(process.cwd(), 'components', 'Header.tsx'), 'utf8')
  const footerSource = readFileSync(path.join(process.cwd(), 'components', 'Footer.tsx'), 'utf8')
  const bookingFormSource = readFileSync(path.join(process.cwd(), 'components', 'BookingForm.tsx'), 'utf8')
  const paymentActionsSource = readFileSync(path.join(process.cwd(), 'components', 'PaymentActions.tsx'), 'utf8')
  const callRoomSource = readFileSync(path.join(process.cwd(), 'components', 'CallRoom.tsx'), 'utf8')
  const confirmationSource = readFileSync(path.join(process.cwd(), 'app', 'confirmation', 'page.tsx'), 'utf8')

  assert.match(slotSource, /buildFormHref\(problem, slot\.id\)/)
  assert.match(slotSource, /prefetch=\{false\}/)
  assert.match(bookSource, /buildSlotHref\(item\.id\)/)
  assert.match(bookSource, /prefetch=\{false\}/)
  assert.match(formSource, /buildSlotHref\(problem\)/)
  assert.match(legacyProblemSource, /buildSlotHref\(problem\)/)
  assert.doesNotMatch(legacyProblemSource, /\/book\?problem=/)
  assert.match(slotSource, /data-analytics-event="slot_selected"/)
  assert.doesNotMatch(slotSource, /data-analytics-event="slot_select"/)
  assert.match(bookSource, /data-analytics-event="cta_click"/)
  assert.doesNotMatch(bookSource, /data-analytics-event="topic_select"/)
  assert.match(headerSource, /data-analytics-event="cta_click"/)
  assert.match(footerSource, /data-analytics-event="cta_click"/)
  assert.doesNotMatch(headerSource, /data-analytics-event="reserve_click"/)
  assert.doesNotMatch(footerSource, /data-analytics-event="reserve_click"/)
  assert.match(bookingFormSource, /form_started/)
  assert.match(paymentActionsSource, /payment_started/)
  assert.doesNotMatch(paymentActionsSource, /'payment_start'/)
  assert.match(confirmationSource, /payment_success/)
  assert.match(callRoomSource, /room_entered/)
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
  const rules = Array.isArray(config.rules) ? config.rules : [config.rules]
  const publicRule = rules[0]

  assert.equal(config.host, 'https://beh2.vercel.app')
  assert.equal(config.sitemap, 'https://beh2.vercel.app/sitemap.xml')
  assert.equal(rules.length, 1)
  assert.equal(publicRule.userAgent, '*')
  assert.equal(publicRule.allow, '/')
  assert.ok(Array.isArray(publicRule.disallow))
  assert.ok(publicRule.disallow.includes('/admin/'))
  assert.ok(publicRule.disallow.includes('/__internal/'))
  assert.ok(publicRule.disallow.some((path) => path.startsWith('/qa-share-')))
})

test('qa report helper reads the internal markdown artifact from the repo path', async () => {
  const tempRoot = path.join(process.cwd(), '.tmp-qa-report-helper')
  const reportPath = getLatestQaReportPath(tempRoot)

  await rm(tempRoot, { recursive: true, force: true })
  await mkdir(path.dirname(reportPath), { recursive: true })
  await writeFile(reportPath, '# Test QA\n\nprivate', 'utf8')

  try {
    const report = await readLatestQaReport(tempRoot)

    assert.equal(report.exists, true)
    assert.equal(report.filePath, reportPath)
    assert.equal(report.content, '# Test QA\n\nprivate')
    assert.equal(Boolean(report.updatedAt), true)
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
})

test('qa report helper returns a controlled fallback when the internal artifact is missing', async () => {
  const tempRoot = path.join(process.cwd(), '.tmp-qa-report-helper-missing')

  await rm(tempRoot, { recursive: true, force: true })

  const report = await readLatestQaReport(tempRoot)

  assert.equal(report.exists, false)
  assert.equal(report.filePath, getLatestQaReportPath(tempRoot))
  assert.match(report.content, /Brak raportu QA/i)
  assert.equal(report.updatedAt, null)
})

test('builds a sitemap with the core public routes', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://beh2.vercel.app'

  const entries = sitemap()
  const urls = entries.map((entry) => entry.url)
  const pdfUrls = listPdfRoutePaths().map((routePath) => `https://beh2.vercel.app${routePath}`)

  assert.deepEqual(urls, [
    'https://beh2.vercel.app/',
    'https://beh2.vercel.app/oferta',
    'https://beh2.vercel.app/oferta/szybka-konsultacja-15-min',
    'https://beh2.vercel.app/oferta/konsultacja-30-min',
    'https://beh2.vercel.app/oferta/konsultacja-behawioralna-online',
    'https://beh2.vercel.app/oferta/konsultacja-domowa-wyjazdowa',
    'https://beh2.vercel.app/oferta/indywidualna-terapia-behawioralna',
    'https://beh2.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne',
    ...pdfUrls,
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

test('contact page keeps the specialist trust visual next to the contact shortcuts', () => {
  const markup = renderToStaticMarkup(createElement(ContactPage, { searchParams: {} }))

  assert.equal(markup.includes('Kto odpowiada'), true)
  assert.equal(markup.includes('Odpowiadam osobiście'), true)
  assert.equal(markup.includes('Najczęstsze wejścia'), true)
  assert.equal(markup.includes('specialist-krzysztof-wide.jpg'), true)
})
test('public PDF pages render copied cover assets from the branding directory', () => {
  const guide = getPdfGuideBySlug('pies-zostaje-sam-plan-pierwszych-krokow')
  const listingMarkup = renderToStaticMarkup(createElement(PdfGuidesListingPage))
  const guideMarkup = renderToStaticMarkup(
    createElement(PdfGuideDetailPage, {
      params: { guideSlug: 'pies-zostaje-sam-plan-pierwszych-krokow' },
    }),
  )
  const bundleMarkup = renderToStaticMarkup(
    createElement(PdfBundleDetailPage, {
      params: { bundleSlug: 'pakiet-spokojny-dom-pies' },
    }),
  )

  assert.ok(guide)
  assert.equal(getPdfGuideCoverSrc(guide), '/branding/pdf-covers/pies-zostaje-sam-plan-pierwszych-krokow.svg')
  assert.match(listingMarkup, /\/branding\/pdf-covers\//)
  assert.match(guideMarkup, /\/branding\/pdf-covers\//)
  assert.match(bundleMarkup, /\/branding\/pdf-covers\//)
})
