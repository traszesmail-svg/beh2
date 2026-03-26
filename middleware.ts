import { NextResponse, type NextRequest } from 'next/server'
import {
  getAdminAccessSecret,
  getAdminAuthChallengeHeaders,
  hasValidAdminAuthorization,
} from '@/lib/admin-auth'
import { getPublicFeatureUnavailableMessage } from '@/lib/server/env'

function createUnauthorizedResponse(message: string, status: number) {
  return new NextResponse(message, {
    status,
    headers: getAdminAuthChallengeHeaders(),
  })
}

export function middleware(request: NextRequest) {
  const secret = getAdminAccessSecret()

  if (!secret) {
    return createUnauthorizedResponse(getPublicFeatureUnavailableMessage('admin'), 503)
  }

  if (hasValidAdminAuthorization(request.headers.get('authorization'), secret)) {
    return NextResponse.next()
  }

  return createUnauthorizedResponse('Dostep do panelu specjalisty wymaga autoryzacji.', 401)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/availability/:path*'],
}
