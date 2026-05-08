'use client'

import { useState } from 'react'

type AdminUrgentRequestActionsProps = {
  requestId: string
  disabled?: boolean
}

export function AdminUrgentRequestActions({ requestId, disabled = false }: AdminUrgentRequestActionsProps) {
  const [proposedDate, setProposedDate] = useState('')
  const [proposedTime, setProposedTime] = useState('')
  const [responseNote, setResponseNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleRespond() {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`/api/admin/urgent-requests/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposedDate,
          proposedTime,
          responseNote,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; bookingHref?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać odpowiedzi.')
      }

      setMessage(`Wysłano klientowi odpowiedź i dodano slot do terminarza. Link: ${payload.bookingHref ?? ''}`.trim())
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nie udało się wysłać odpowiedzi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="booking-actions" data-urgent-request-actions={requestId}>
      <input type="date" value={proposedDate} onChange={(event) => setProposedDate(event.target.value)} disabled={disabled || loading} />
      <input type="time" value={proposedTime} onChange={(event) => setProposedTime(event.target.value)} disabled={disabled || loading} />
      <input
        type="text"
        value={responseNote}
        onChange={(event) => setResponseNote(event.target.value)}
        placeholder="Opcjonalna wiadomość do klienta"
        disabled={disabled || loading}
      />
      <button type="button" className="button button-primary" onClick={handleRespond} disabled={disabled || loading}>
        {loading ? 'Wysyłam...' : 'Dodaj termin i wyślij'}
      </button>
      {message ? <span className="booking-meta">{message}</span> : null}
      {error ? <span className="booking-meta">{error}</span> : null}
    </div>
  )
}
