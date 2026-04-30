'use client'

import { useState } from 'react'
import type { LeadBookingRecord, LeadBookingStatus } from '@/lib/server/lead-bookings'

type LeadBookingActionsProps = {
  booking: LeadBookingRecord
}

type LoadingAction = 'save' | 'confirm' | 'paid' | 'cancel' | null

function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function LeadBookingActions({ booking }: LeadBookingActionsProps) {
  const [confirmedDate, setConfirmedDate] = useState(booking.confirmedDate ?? '')
  const [confirmedTime, setConfirmedTime] = useState(booking.confirmedTime ?? '')
  const [paymentLink, setPaymentLink] = useState(booking.paymentLink ?? '')
  const [paymentMethod, setPaymentMethod] = useState(booking.paymentMethod ?? '')
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes ?? '')
  const [error, setError] = useState('')
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)

  function buildPayload(status?: LeadBookingStatus, markPaid?: boolean) {
    const payload: Record<string, unknown> = {
      confirmedDate: trimOrUndefined(confirmedDate),
      confirmedTime: trimOrUndefined(confirmedTime),
      paymentLink: trimOrUndefined(paymentLink),
      paymentMethod: trimOrUndefined(paymentMethod),
      adminNotes: trimOrUndefined(adminNotes),
    }

    for (const key of Object.keys(payload)) {
      if (payload[key] === undefined) {
        delete payload[key]
      }
    }

    if (status) {
      payload.status = status
    }

    if (markPaid) {
      payload.markPaid = true
    }

    return payload
  }

  async function submit(payload: Record<string, unknown>, nextAction: LoadingAction) {
    setError('')
    setLoadingAction(nextAction)

    try {
      const response = await fetch(`/api/admin/lead-bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(result.error ?? 'Nie udało się zaktualizować rezerwacji.')
      }

      window.location.reload()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Wystąpił błąd akcji admina.')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="lead-booking-actions" data-admin-lead-booking-actions={booking.id}>
      <div className="lead-booking-grid">
        <label>
          <span>Potwierdzona data</span>
          <input type="date" value={confirmedDate} onChange={(event) => setConfirmedDate(event.target.value)} />
        </label>
        <label>
          <span>Potwierdzona godzina</span>
          <input type="time" value={confirmedTime} onChange={(event) => setConfirmedTime(event.target.value)} />
        </label>
        <label className="lead-booking-wide">
          <span>Link płatności</span>
          <input
            type="url"
            value={paymentLink}
            onChange={(event) => setPaymentLink(event.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className="lead-booking-wide">
          <span>Metoda płatności</span>
          <input
            type="text"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            placeholder="Przelew / BLIK / PayU"
          />
        </label>
        <label className="lead-booking-wide">
          <span>Notatki admina</span>
          <textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={4} />
        </label>
      </div>

      <div className="lead-booking-buttons">
        <button type="button" className="button button-ghost small-button" onClick={() => submit(buildPayload(), 'save')} disabled={loadingAction !== null}>
          {loadingAction === 'save' ? 'Zapisywanie...' : 'Zapisz pola'}
        </button>
        <button
          type="button"
          className="button button-primary small-button"
          onClick={() => submit(buildPayload('awaiting_payment'), 'confirm')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'confirm' ? 'Potwierdzam...' : 'Potwierdź termin'}
        </button>
        <button
          type="button"
          className="button button-primary small-button"
          onClick={() => submit(buildPayload('paid', true), 'paid')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'paid' ? 'Oznaczam...' : 'Oznacz jako opłacona'}
        </button>
        <button
          type="button"
          className="button button-ghost small-button"
          onClick={() => submit({ status: 'cancelled' }, 'cancel')}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'cancel' ? 'Anuluję...' : 'Anuluj rezerwację'}
        </button>
      </div>

      {error ? <div className="booking-meta">{error}</div> : null}

      <style jsx>{`
        .lead-booking-actions {
          display: grid;
          gap: 16px;
        }

        .lead-booking-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 14px;
        }

        .lead-booking-grid label {
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: rgba(31, 26, 23, 0.72);
        }

        .lead-booking-grid label span {
          font-weight: 600;
        }

        .lead-booking-grid input,
        .lead-booking-grid textarea {
          width: 100%;
          border: 1px solid rgba(92, 76, 58, 0.16);
          border-radius: 8px;
          padding: 10px 12px;
          background: #fff;
          color: #1f1a17;
          font: inherit;
        }

        .lead-booking-grid textarea {
          resize: vertical;
        }

        .lead-booking-wide {
          grid-column: 1 / -1;
        }

        .lead-booking-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .booking-meta {
          color: #8a3022;
          font-size: 13px;
        }

        @media (max-width: 680px) {
          .lead-booking-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
