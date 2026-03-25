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
  const [loadingAction, setLoadingAction] = useState<'approve' | 'reject' | 'done' | null>(null)

  async function handleMarkDone() {
    setError('')
    setLoadingAction('done')

    try {
      const response = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendedNextStep: 'Pełna konsultacja lub dalsza terapia według potrzeb klienta.',
        }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się oznaczyć konsultacji jako done.')
      }

      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Wystąpił błąd akcji admina.')
    } finally {
      setLoadingAction(null)
    }
  }

  async function handleManualPaymentAction(action: 'approve' | 'reject') {
    setError('')
    setLoadingAction(action)

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/manual-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reason: action === 'reject' ? 'Nie znaleziono wpłaty.' : undefined,
        }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się zaktualizować płatności.')
      }

      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Wystąpił błąd akcji admina.')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="booking-actions">
      <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
        Link do rozmowy
      </a>

      {paymentStatus === 'pending_manual_review' ? (
        <>
          <button
            type="button"
            className="button button-primary small-button"
            onClick={() => handleManualPaymentAction('approve')}
            disabled={loadingAction !== null}
          >
            {loadingAction === 'approve' ? 'Potwierdzam...' : 'Potwierdź płatność'}
          </button>
          <button
            type="button"
            className="button button-ghost small-button"
            onClick={() => handleManualPaymentAction('reject')}
            disabled={loadingAction !== null}
          >
            {loadingAction === 'reject' ? 'Odrzucam...' : 'Odrzuć wpłatę'}
          </button>
        </>
      ) : null}

      {paymentStatus === 'paid' && bookingStatus !== 'done' ? (
        <button type="button" className="button button-primary small-button" onClick={handleMarkDone} disabled={loadingAction !== null}>
          {loadingAction === 'done' ? 'Zapisywanie...' : 'Oznacz jako zakończoną'}
        </button>
      ) : null}

      {error ? <span className="booking-meta">{error}</span> : null}
    </div>
  )
}
