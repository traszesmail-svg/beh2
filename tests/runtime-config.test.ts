import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { ADMIN_BASIC_AUTH_USERNAME, hasValidAdminAuthorization } from '@/lib/admin-auth'
import { POST as submitTestimonialRoute } from '@/app/api/testimonials/route'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import { SocialProofSection } from '@/components/SocialProofSection'
import { BUILD_MARKER_KEY, getBuildMarkerSnapshot } from '@/lib/build-marker'
import { buildRollingAvailabilitySeed, getProblemLabel, isFutureAvailabilitySlot, isProblemType } from '@/lib/data'
import { getDataModeStatus, getPaymentModeStatus, getSupabaseServiceRoleKeyIssue } from '@/lib/server/env'
import { buildSeedAvailabilitySlots, hasFutureAvailabilitySlots } from '@/lib/server/availability-seed'
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

test('renders the same public navigation label for the social proof section everywhere', () => {
  const markup = renderToStaticMarkup(createElement(Header))

  assert.match(markup, /Historie i efekty/)
  assert.doesNotMatch(markup, /Realne sprawy/)
})

test('homepage copy does not contain the broken calendar or mixed booking wording', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')

  assert.match(source, /we właściwym kalendarzu rezerwacji/)
  assert.doesNotMatch(source, /w właściwym kalendarzu rezerwacji/)
  assert.doesNotMatch(source, /flow rezerwacji, do tej samej ceny dla nowych bookingów/)
})

test('payment page does not expose the public test-mode banner copy', () => {
  const source = readFileSync(path.join(process.cwd(), 'app', 'payment', 'page.tsx'), 'utf8')

  assert.doesNotMatch(source, /To środowisko testowe płatności/)
})

test('public pricing disclosure keeps the amount hidden before checkout', () => {
  const homeSource = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')
  const bookSource = readFileSync(path.join(process.cwd(), 'app', 'book', 'page.tsx'), 'utf8')
  const formSource = readFileSync(path.join(process.cwd(), 'app', 'form', 'page.tsx'), 'utf8')
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

  assert.doesNotMatch(beforeTopicMarkup, /69(?:\s|\u00a0)?zł/i)
  assert.doesNotMatch(beforePaymentMarkup, /69(?:\s|\u00a0)?zł/i)
  assert.doesNotMatch(homeSource, /69(?:\s|\u00a0)?zł/i)
  assert.doesNotMatch(bookSource, /69(?:\s|\u00a0)?zł/i)
  assert.doesNotMatch(formSource, /69(?:\s|\u00a0)?zł/i)
  assert.doesNotMatch(bookSource, /getActiveConsultationPrice|formattedAmount/)
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

test('homepage keeps the main booking CTA above secondary dogoterapia and social sections', () => {
  const homeSource = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')
  const socialProofIndex = homeSource.indexOf('<SocialProofSection />')
  const publicationsIndex = homeSource.indexOf('id="publikacje"')
  const faqIndex = homeSource.indexOf('id="faq"')
  const ctaIndex = homeSource.indexOf('<section className="panel cta-panel">')
  const dogoterapiaIndex = homeSource.indexOf('id="dogoterapia"')
  const socialIndex = homeSource.indexOf('<SocialSection />')

  assert.ok(socialProofIndex > -1)
  assert.ok(publicationsIndex > socialProofIndex)
  assert.ok(faqIndex > publicationsIndex)
  assert.ok(ctaIndex > faqIndex)
  assert.ok(dogoterapiaIndex > ctaIndex)
  assert.ok(socialIndex > dogoterapiaIndex)
})

test('homepage keeps share actions below the final CTA instead of inside the hero', () => {
  const homeSource = readFileSync(path.join(process.cwd(), 'app', 'page.tsx'), 'utf8')
  const heroIndex = homeSource.indexOf('<section className="hero-grid" id="oferta">')
  const ctaIndex = homeSource.indexOf('<section className="panel cta-panel">')
  const shareIndex = homeSource.lastIndexOf('<ShareActions')

  assert.ok(heroIndex > -1)
  assert.ok(ctaIndex > heroIndex)
  assert.ok(shareIndex > ctaIndex)
})

test('footer renders a visible build marker summary', () => {
  process.env.VERCEL_GIT_COMMIT_REF = 'main'
  process.env.VERCEL_GIT_COMMIT_SHA = 'fa5563d1234567890abcdef'

  const markup = renderToStaticMarkup(createElement(Footer))

  assert.match(markup, /Wersja serwisu/)
  assert.match(markup, /main \/ fa5563d/)
  assert.match(markup, /data-build-marker="CLEAN_START_REPO_V1:main:fa5563d"/)
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
