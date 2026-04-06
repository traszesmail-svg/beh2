import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createAvailabilitySlot, createPendingBooking, markBookingManualPaymentPending, markBookingManualPaymentRejected, markBookingPaid, markBookingPaymentFailed } from '@/lib/server/local-store'
import { createLocalDataSandbox } from '@/scripts/lib/local-data-sandbox'

type ResendEmailPayload = {
  from?: string
  to?: string[]
  subject?: string
  html?: string
  text?: string
}

function withEnv(
  overrides: Record<string, string | null | undefined>,
  run: () => void | Promise<void>,
) {
  const previous = new Map<string, string | undefined>()
  const restore = () => {
    for (const [key, value] of previous.entries()) {
      if (typeof value === 'string') {
        process.env[key] = value
      } else {
        delete process.env[key]
      }
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key])

    if (typeof value === 'string') {
      process.env[key] = value
    } else {
      delete process.env[key]
    }
  }

  const result = run()

  if (result && typeof (result as Promise<void>).then === 'function') {
    return (result as Promise<void>).finally(restore)
  }

  restore()
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function includesNormalized(value: string | undefined, expected: string) {
  return typeof value === 'string' && normalize(value).includes(normalize(expected))
}

function makeBookingForm(slotId: string) {
  return {
    ownerName: 'Testowy Klient',
    serviceType: 'szybka-konsultacja-15-min' as const,
    problemType: 'kot' as const,
    animalType: 'Kot' as const,
    petAge: '3 lata',
    durationNotes: 'Szybki test dostarczenia maili',
    description: 'Sprawdzam customer emails na stage 5.',
    phone: '+48 500 600 700',
    email: 'klient@example.com',
    slotId,
    qaBooking: true,
  }
}

test('customer emails cover reservation, review, confirmation and cancel outcomes', async () => {
  const sentEmails: ResendEmailPayload[] = []
  const originalFetch = globalThis.fetch
  const sandbox = await createLocalDataSandbox('customer-emails', process.cwd())

  try {
    const mockFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {}
      sentEmails.push(body)
      return new Response('{}', {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
    }

    ;(globalThis as typeof globalThis & { fetch: typeof fetch }).fetch = mockFetch as typeof fetch

    await withEnv(
      {
        MAIL_PROVIDER: 'resend',
        RESEND_API_KEY: 're_test_key',
        RESEND_FROM_EMAIL: 'Behawior 15 <kontakt@behawior15.pl>',
        CUSTOMER_EMAIL_MODE: 'auto',
        BEHAVIOR15_CONTACT_EMAIL: 'kontakt@behawior15.pl',
      },
      async () => {
        const bookingDate = '2030-01-15'

        await createAvailabilitySlot(bookingDate, '10:00')
        await createAvailabilitySlot(bookingDate, '10:20')
        await createAvailabilitySlot(bookingDate, '10:40')

        const bookingA = await createPendingBooking(makeBookingForm(`${bookingDate}-10:00`))
        assert.equal(sentEmails.length, 1)
        assert.equal(bookingA.booking.bookingStatus, 'pending')
        assert.equal(bookingA.booking.paymentStatus, 'unpaid')
        assert.equal(Array.isArray(sentEmails[0].to), true)
        assert.equal(sentEmails[0].to?.[0], 'klient@example.com')
        assert.equal(includesNormalized(sentEmails[0].subject, 'Behawior 15'), true)

        const reviewBooking = await markBookingManualPaymentPending(bookingA.booking.id, {
          paymentReference: 'MANUAL-A',
        })
        assert.equal(reviewBooking?.bookingStatus, 'pending_manual_payment')
        assert.equal(reviewBooking?.paymentStatus, 'pending_manual_review')
        assert.equal(sentEmails.length, 2)
        assert.equal(includesNormalized(sentEmails[1].subject, 'Behawior 15'), true)
        assert.equal(sentEmails[1].text?.includes('MANUAL-A'), true)

        const reviewBookingRepeat = await markBookingManualPaymentPending(bookingA.booking.id, {
          paymentReference: 'MANUAL-A',
        })
        assert.equal(reviewBookingRepeat?.paymentStatus, 'pending_manual_review')
        assert.equal(sentEmails.length, 2)

        const paidBooking = await markBookingPaid(bookingA.booking.id, {
          paymentMethod: 'manual',
          paymentReference: 'MANUAL-A',
        })
        assert.equal(paidBooking?.bookingStatus, 'confirmed')
        assert.equal(paidBooking?.paymentStatus, 'paid')
        assert.equal(sentEmails.length, 3)
        assert.equal(includesNormalized(sentEmails[2].subject, 'Behawior 15'), true)
        assert.equal(sentEmails[2].text?.includes('Sprawdzam customer emails na stage 5.'), true)
        assert.equal(sentEmails[2].text?.includes(paidBooking?.meetingUrl ?? ''), true)

        const bookingB = await createPendingBooking(makeBookingForm(`${bookingDate}-10:20`))
        assert.equal(sentEmails.length, 4)
        assert.equal(includesNormalized(sentEmails[3].subject, 'Behawior 15'), true)

        const rejectedBooking = await markBookingManualPaymentRejected(bookingB.booking.id, 'Brak potwierdzenia wplaty')
        assert.equal(rejectedBooking?.bookingStatus, 'cancelled')
        assert.equal(rejectedBooking?.paymentStatus, 'rejected')
        assert.equal(sentEmails.length, 5)
        assert.equal(includesNormalized(sentEmails[4].subject, 'Behawior 15'), true)
        assert.equal(includesNormalized(sentEmails[4].text, 'Powod: Brak potwierdzenia wplaty'), true)

        const rejectedRepeat = await markBookingManualPaymentRejected(bookingB.booking.id, 'Brak potwierdzenia wplaty')
        assert.equal(rejectedRepeat?.paymentStatus, 'rejected')
        assert.equal(sentEmails.length, 5)

        const bookingC = await createPendingBooking(makeBookingForm(`${bookingDate}-10:40`))
        assert.equal(sentEmails.length, 6)
        assert.equal(includesNormalized(sentEmails[5].subject, 'Behawior 15'), true)

        const failedBooking = await markBookingPaymentFailed(bookingC.booking.id)
        assert.equal(failedBooking?.bookingStatus, 'cancelled')
        assert.equal(failedBooking?.paymentStatus, 'failed')
        assert.equal(sentEmails.length, 7)
        assert.equal(includesNormalized(sentEmails[6].subject, 'Behawior 15'), true)
      },
    )
  } finally {
    ;(globalThis as typeof globalThis & { fetch: typeof fetch }).fetch = originalFetch
    await sandbox.cleanup()
  }
})
