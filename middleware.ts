import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_ACCESS_SECRET_ENV,
  getAdminAccessSecret,
  getAdminAuthChallengeHeaders,
  hasValidAdminAuthorization,
} from '@/lib/admin-auth'

function createUnauthorizedResponse(message: string, status: number) {
  return new NextResponse(message, {
    status,
    headers: getAdminAuthChallengeHeaders(),
  })
}

export function middleware(request: NextRequest) {
  const secret = getAdminAccessSecret()

  if (!secret) {
    return createUnauthorizedResponse(
      `Brak konfiguracji ochrony panelu. Ustaw ${ADMIN_ACCESS_SECRET_ENV}, aby odblokowac /admin i adminowe API.`,
      503,
    )
  }

  if (hasValidAdminAuthorization(request.headers.get('authorization'), secret)) {
    return NextResponse.next()
  }

  return createUnauthorizedResponse('Dostep do panelu specjalisty wymaga autoryzacji.', 401)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/availability/:path*', '/api/bookings/:path*/complete'],
}
