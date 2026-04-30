'use client'

import { useState } from 'react'

type Props = {
  bookingId: string
  token: string
  defaultDate: string
  defaultTime: string
  slotWasParsed: boolean
}

export function QuickConfirmForm({ bookingId, token, defaultDate, defaultTime, slotWasParsed }: Props) {
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState(defaultTime)
  const [showOverride, setShowOverride] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const hasPrefilledSlot = Boolean(defaultDate && defaultTime)
  const showFields = !hasPrefilledSlot || showOverride

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) {
      setError('Podaj datę i godzinę.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/lead-bookings/${bookingId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, date, time }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Błąd serwera')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px' }}>✓</div>
        <h2 style={{ margin: '8px 0 4px', color: '#2f7667' }}>Potwierdzone!</h2>
        <p style={{ margin: 0, color: '#444' }}>
          Rezerwacja oznaczona jako opłacona.<br />
          Klient otrzymał email z terminem i linkiem do pokoju.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #d0c9be',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>

      {hasPrefilledSlot && !showOverride && (
        <div style={{ background: '#eaf4f1', border: '1px solid #b2d8cf', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>Termin do potwierdzenia</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1f1a17' }}>
            {date} o {time}
          </div>
          {slotWasParsed && (
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              (wczytany z wyboru klienta)
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowOverride(true)}
            style={{ marginTop: '10px', background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Zmień termin
          </button>
        </div>
      )}

      {showFields && (
        <>
          <label style={{ display: 'grid', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
            Data konsultacji
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'grid', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
            Godzina konsultacji
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </>
      )}

      {error && <p style={{ color: '#8a3022', margin: 0, fontSize: '14px' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? '#aaa' : '#2f7667',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '14px 20px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Potwierdzam...' : 'Potwierdzam płatność →'}
      </button>

      <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
        Klient otrzyma email z potwierdzeniem, terminem i linkiem do pokoju Jitsi.
      </p>
    </form>
  )
}
