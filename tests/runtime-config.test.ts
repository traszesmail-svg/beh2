import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { ADMIN_BASIC_AUTH_USERNAME, hasValidAdminAuthorization } from '@/lib/admin-auth'
import { BUILD_MARKER_KEY, getBuildMarkerSnapshot } from '@/lib/build-marker'
import {
  createActiveConsultationPrice,
  DEFAULT_PRICE_PLN,
  MIN_CONSULTATION_PRICE_PLN,
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
import { createCustomerAccessToken, hasValidCustomerAccessToken, hashCustomerAccessToken } from '@/lib/server/customer-access'
import { shouldSendBookingConfirmationAfterPayment } from '@/lib/server/notifications'
import { getReminderAuthorizationError, runBookingReminderSweep } from '@/lib/server/reminder-runner'
import { getWarsawDateTime, shouldSendReminderForBooking } from '@/lib/server/reminders'
import { assertStripeCheckoutAmountSupported, isStripeTestMode } from '@/lib/server/stripe'

const originalStripeSecret = process.env.STRIPE_SECRET_KEY
const originalCommitRef = process.env.VERCEL_GIT_COMMIT_REF
const originalCommitSha = process.env.VERCEL_GIT_COMMIT_SHA
const originalCronSecret = process.env.CRON_SECRET

afterEach(() => {
  if (typeof originalStripeSecret === 'string') {
    process.env.STRIPE_SECRET_KEY = originalStripeSecret
  } else {
    delete process.env.STRIPE_SECRET_KEY
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
})

function buildBasicHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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

test('rejects invalid consultation price values', () => {
  assert.throws(() => parseConsultationPriceInput('free'), /kwote konsultacji/)
})

test('rejects consultation prices below the Stripe PLN minimum', () => {
  assert.throws(() => parseConsultationPriceInput('1.99'), /nie moze byc nizsza/)
  assert.equal(parseConsultationPriceInput(String(MIN_CONSULTATION_PRICE_PLN)), MIN_CONSULTATION_PRICE_PLN)
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

test('rejects Stripe Checkout amounts below the PLN minimum', () => {
  assert.throws(() => assertStripeCheckoutAmountSupported(0.01), /co najmniej/)
  assert.doesNotThrow(() => assertStripeCheckoutAmountSupported(DEFAULT_PRICE_PLN))
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

test('build marker includes the expected branch and short commit when Vercel env is present', () => {
  process.env.VERCEL_GIT_COMMIT_REF = 'main'
  process.env.VERCEL_GIT_COMMIT_SHA = '09d9b0281c292275c0e9d9a406b1b964bb4bf427'

  const marker = getBuildMarkerSnapshot()

  assert.equal(marker.key, BUILD_MARKER_KEY)
  assert.equal(marker.branch, 'main')
  assert.equal(marker.commit, '09d9b02')
  assert.equal(marker.value, `${BUILD_MARKER_KEY}:main:09d9b02`)
})
