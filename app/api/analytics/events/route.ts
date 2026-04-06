import { NextResponse } from 'next/server'
import { recordFunnelEvent } from '@/lib/server/db'
import { isFunnelEventType, isInternalAnalyticsPagePath, normalizeFunnelEventProperties } from '@/lib/server/funnel-events'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  const route = '/api/analytics/events'
  const start = Date.now()

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'start',
      route,
      requestId: request.headers.get('x-vercel-id'),
    }),
  )

  try {
    const body = (await request.json()) as Record<string, unknown>

    if (body.consent !== 'granted') {
      console.log(
        JSON.stringify({
          level: 'info',
          msg: 'done',
          route,
          ms: Date.now() - start,
          ignored: true,
          reason: 'consent',
        }),
      )
      return new NextResponse(null, { status: 204 })
    }

    const eventType = typeof body.eventType === 'string' ? body.eventType : null

    if (!eventType || !isFunnelEventType(eventType)) {
      console.log(
        JSON.stringify({
          level: 'info',
          msg: 'done',
          route,
          ms: Date.now() - start,
          ignored: true,
          reason: 'event_type',
        }),
      )
      return new NextResponse(null, { status: 204 })
    }

    const pagePath = typeof body.pagePath === 'string' ? body.pagePath : null

    if (isInternalAnalyticsPagePath(pagePath)) {
      console.log(
        JSON.stringify({
          level: 'info',
          msg: 'done',
          route,
          ms: Date.now() - start,
          ignored: true,
          reason: 'internal_page',
          pagePath,
        }),
      )
      return new NextResponse(null, { status: 204 })
    }

    const properties = normalizeFunnelEventProperties(
      typeof body.properties === 'object' && body.properties && !Array.isArray(body.properties)
        ? (body.properties as Record<string, unknown>)
        : null,
    )

    const bookingId =
      typeof body.bookingId === 'string'
        ? body.bookingId
        : typeof body.booking_id === 'string'
          ? body.booking_id
          : typeof properties.booking_id === 'string'
            ? properties.booking_id
            : typeof properties.bookingId === 'string'
              ? properties.bookingId
              : null

    const qaBooking = Boolean(body.qaBooking ?? properties.qaBooking ?? properties.qa_booking)
    const location =
      typeof body.location === 'string'
        ? body.location
        : typeof properties.location === 'string'
          ? properties.location
          : null

    await recordFunnelEvent({
      eventType,
      bookingId,
      qaBooking,
      source: 'client',
      pagePath,
      location,
      properties,
    })

    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'done',
        route,
        ms: Date.now() - start,
        eventType,
        qaBooking,
      }),
    )

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        msg: 'failed',
        route,
        ms: Date.now() - start,
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return NextResponse.json({ error: 'Nie udalo sie zapisac zdarzenia.' }, { status: 500 })
  }
}
