import { NextResponse } from 'next/server'
import { handlePayuNotification, verifyPayuNotificationSignature } from '@/lib/server/payu'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()

    if (!verifyPayuNotificationSignature(rawBody, request.headers.get('openpayu-signature'))) {
      return NextResponse.json({ error: 'Nieprawidłowy podpis PayU.' }, { status: 400 })
    }

    const payload = JSON.parse(rawBody) as Parameters<typeof handlePayuNotification>[0]
    await handlePayuNotification(payload)

    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook PayU zwrócił błąd.' },
      { status: 400 },
    )
  }
}
