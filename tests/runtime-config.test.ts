import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ADMIN_BASIC_AUTH_USERNAME, hasValidAdminAuthorization } from '@/lib/admin-auth'
import { POST as submitTestimonialRoute } from '@/app/api/testimonials/route'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { BUILD_MARKER_KEY, getBuildMarkerSnapshot } from '@/lib/build-marker'
import { buildRollingAvailabilitySeed, isFutureAvailabilitySlot } from '@/lib/data'
import { getDataModeStatus, getSupabaseServiceRoleKeyIssue } from '@/lib/server/env'
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
import { assertStripeCheckoutAmountSupported, buildCheckoutSessionParams, isStripeTestMode } from '@/lib/server/stripe'
import { getContactDetails } from '@/lib/site'
import { TESTIMONIALS } from '@/lib/testimonials'

const originalStripeSecret = process.env.STRIPE_SECRET_KEY
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
})

function buildBasicHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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

test('rejects invalid consultation price values', () => {
  assert.throws(() => parseConsultationPriceInput('free'), /kwotę konsultacji/)
})

test('rejects consultation prices below the Stripe PLN minimum', () => {
  assert.throws(() => parseConsultationPriceInput('1.99'), /nie może być niższa/)
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
    email: null,
    phone: null,
  })
})

test('ignores invalid public contact email values', () => {
  process.env.BEHAVIOR15_CONTACT_EMAIL = 'kontakt.behawiorystacoape.com'
  delete process.env.BEHAVIOR15_CONTACT_PHONE

  assert.deepEqual(getContactDetails(), {
    email: null,
    phone: null,
  })
})

test('renders the testimonials section empty state when there are no approved testimonials', () => {
  const markup = renderToStaticMarkup(createElement(TestimonialsSection, { testimonials: TESTIMONIALS }))

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
