import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

function toHashBuffer(value: string): Buffer | null {
  if (!value || value.length % 2 !== 0) {
    return null
  }

  try {
    return Buffer.from(value, 'hex')
  } catch {
    return null
  }
}

export function hashCustomerAccessToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function createCustomerAccessToken() {
  const rawToken = randomBytes(24).toString('base64url')

  return {
    rawToken,
    tokenHash: hashCustomerAccessToken(rawToken),
  }
}

export function hasValidCustomerAccessToken(
  providedToken: string | null | undefined,
  expectedTokenHash: string | null | undefined,
): boolean {
  if (!providedToken || !expectedTokenHash) {
    return false
  }

  const left = toHashBuffer(hashCustomerAccessToken(providedToken))
  const right = toHashBuffer(expectedTokenHash)

  if (!left || !right || left.length !== right.length) {
    return false
  }

  return timingSafeEqual(left, right)
}
