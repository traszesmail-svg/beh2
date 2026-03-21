export const ADMIN_BASIC_AUTH_USERNAME = 'admin'
export const ADMIN_ACCESS_SECRET_ENV = 'ADMIN_ACCESS_SECRET'
export const ADMIN_BASIC_AUTH_REALM = 'Behawior15 Admin'

function readAdminAccessSecret(): string | null {
  const value = process.env[ADMIN_ACCESS_SECRET_ENV]?.trim()
  return value ? value : null
}

function decodeBase64(value: string): string | null {
  try {
    if (typeof atob === 'function') {
      return atob(value)
    }

    if (typeof Buffer !== 'undefined') {
      return Buffer.from(value, 'base64').toString('utf8')
    }

    return null
  } catch {
    return null
  }
}

function safeCompare(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false
  }

  let mismatch = 0

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

export function getAdminAccessSecret(): string | null {
  return readAdminAccessSecret()
}

export function getAdminAuthChallengeHeaders(): Record<string, string> {
  return {
    'WWW-Authenticate': `Basic realm="${ADMIN_BASIC_AUTH_REALM}", charset="UTF-8"`,
    'Cache-Control': 'no-store',
  }
}

export function hasValidAdminAuthorization(authHeader: string | null, secret = readAdminAccessSecret()): boolean {
  if (!secret || !authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  const encoded = authHeader.slice('Basic '.length).trim()
  const decoded = decodeBase64(encoded)

  if (!decoded) {
    return false
  }

  const separatorIndex = decoded.indexOf(':')

  if (separatorIndex === -1) {
    return false
  }

  const username = decoded.slice(0, separatorIndex)
  const password = decoded.slice(separatorIndex + 1)

  return safeCompare(username, ADMIN_BASIC_AUTH_USERNAME) && safeCompare(password, secret)
}
