'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookingStatus, PaymentStatus } from '@/lib/types'

interface AdminBookingActionsProps {
  bookingId: string
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  meetingUrl: string
}

export function AdminBookingActions({
  bookingId,
  bookingStatus,
  paymentStatus,
  meetingUrl,
}: AdminBookingActionsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleMarkDone() {
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendedNextStep: 'Pelna konsultacja lub dalsza terapia wedlug potrzeb klienta.',
        }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udalo sie oznaczyc konsultacji jako done.')
      }

      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Wystapil blad akcji admina.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-actions">
      <a href={meetingUrl} target="_blank" rel="noreferrer" className="button button-ghost small-button">
        Link do rozmowy
      </a>

      {paymentStatus === 'paid' && bookingStatus !== 'done' ? (
        <button type="button" className="button button-primary small-button" onClick={handleMarkDone} disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Oznacz jako zakonczona'}
        </button>
      ) : null}

      {error ? <span className="booking-meta">{error}</span> : null}
    </div>
  )
}
