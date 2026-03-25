import { BookingRecord } from '@/lib/types'

type SmsDeliveryResult = {
  status: 'sent' | 'skipped' | 'failed'
  reason?: string
}

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  return value ? value : null
}

export async function sendPaymentApprovedSms(
  booking: Pick<BookingRecord, 'id' | 'phone'>,
): Promise<SmsDeliveryResult> {
  const webhookUrl = readEnv('SMS_NOTIFICATION_WEBHOOK_URL')

  if (!webhookUrl) {
    return {
      status: 'skipped',
      reason: 'SMS_NOTIFICATION_WEBHOOK_URL missing',
    }
  }

  const phone = booking.phone?.trim()

  if (!phone) {
    return {
      status: 'skipped',
      reason: 'booking phone missing',
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(readEnv('SMS_NOTIFICATION_WEBHOOK_TOKEN')
          ? { Authorization: `Bearer ${readEnv('SMS_NOTIFICATION_WEBHOOK_TOKEN')}` }
          : {}),
      },
      body: JSON.stringify({
        bookingId: booking.id,
        phone,
        message: 'Platnosc zatwierdzona. Link do rozmowy zostal wyslany na email.',
      }),
    })

    if (!response.ok) {
      return {
        status: 'failed',
        reason: `SMS webhook HTTP ${response.status}`,
      }
    }

    return { status: 'sent' }
  } catch (error) {
    return {
      status: 'failed',
      reason: error instanceof Error ? error.message : 'Unknown SMS error',
    }
  }
}
