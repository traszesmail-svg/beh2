import { createHmac, timingSafeEqual } from 'node:crypto'
import { getAdminAccessSecret } from '@/lib/admin-auth'
import { getBaseUrl } from '@/lib/server/env'

export type ManualPaymentReviewAction = 'approve' | 'reject'

function readReviewSecret(): string | null {
  return process.env.MANUAL_PAYMENT_REVIEW_SECRET?.trim() || getAdminAccessSecret()
}

function encodePayload(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decodePayload(value: string): string | null {
  try {
    return Buffer.from(value, 'base64url').toString('utf8')
  } catch {
    return null
  }
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createManualPaymentReviewToken(
  bookingId: string,
  action: ManualPaymentReviewAction,
  paymentReportedAt: string | null | undefined,
): string {
  const secret = readReviewSecret()

  if (!secret) {
    throw new Error('Brakuje sekretu do linków ręcznego potwierdzenia płatności.')
  }

  const payload = `${bookingId}|${action}|${paymentReportedAt ?? ''}`
  const encoded = encodePayload(payload)
  const signature = signPayload(encoded, secret)
  return `${encoded}.${signature}`
}

export function verifyManualPaymentReviewToken(
  bookingId: string,
  action: ManualPaymentReviewAction,
  paymentReportedAt: string | null | undefined,
  token: string | null | undefined,
): boolean {
  const secret = readReviewSecret()

  if (!secret || !token) {
    return false
  }

  const [encoded, signature] = token.split('.')

  if (!encoded || !signature) {
    return false
  }

  const decoded = decodePayload(encoded)

  if (decoded !== `${bookingId}|${action}|${paymentReportedAt ?? ''}`) {
    return false
  }

  const expected = signPayload(encoded, secret)
  const provided = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')

  if (provided.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(provided, expectedBuffer)
}

export function buildManualPaymentReviewUrl(
  bookingId: string,
  action: ManualPaymentReviewAction,
  paymentReportedAt: string | null | undefined,
): string {
  const token = createManualPaymentReviewToken(bookingId, action, paymentReportedAt)
  const url = new URL('/manual-payment/review', getBaseUrl())
  url.searchParams.set('bookingId', bookingId)
  url.searchParams.set('action', action)
  url.searchParams.set('token', token)
  return url.toString()
}
