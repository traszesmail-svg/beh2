import crypto from 'crypto'

export function generateConfirmToken(bookingId: string): string | null {
  const secret = process.env.ADMIN_ACCESS_SECRET?.trim()
  if (!secret) return null
  return crypto.createHmac('sha256', secret).update(bookingId).digest('hex')
}

export function verifyConfirmToken(bookingId: string, token: string): boolean {
  const expected = generateConfirmToken(bookingId)
  if (!expected || token.length !== expected.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}
