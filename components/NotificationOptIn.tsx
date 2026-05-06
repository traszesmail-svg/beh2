'use client'

import { useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type NotificationOptInProps = {
  sourcePage: string
  location: string
  context?: string
  recommendedService?: string
}

function isPhoneValid(value: string) {
  const digitCount = value.replace(/\D/g, '').length
  return digitCount >= 7 && digitCount <= 15
}

export function NotificationOptIn({
  sourcePage,
  location,
  context,
  recommendedService,
}: NotificationOptInProps) {
  const [phone, setPhone] = useState('')
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isPhoneValid(phone)) {
      setStatus('error')
      setFeedback('Podaj poprawny numer telefonu.')
      return
    }

    if (!consent) {
      setStatus('error')
      setFeedback('Zaznacz zgode na kontakt.')
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          channel,
          consent,
          sourcePage,
          location,
          context,
          recommendedService,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udalo sie zapisac powiadomienia.')
      }

      trackAnalyticsEvent('notification_optin_submitted', {
        location,
        channel,
        context: context ?? null,
      })

      setStatus('success')
      setFeedback(payload.message ?? 'Zapis przyjety.')
      setPhone('')
      setConsent(false)
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udalo sie zapisac powiadomienia.')
    }
  }

  return (
    <article className="summary-card tree-backed-card notification-optin-card">
      <div className="section-eyebrow">Opcjonalne przypomnienie</div>
      <h3>Dostan krotkie przypomnienie o wyniku.</h3>
      <p className="muted">
        Zapis jest dobrowolny. Bez konfiguracji zewnetrznego kanalu numer zostaje tylko zapisany jako opt-in.
      </p>

      <form className="form-grid top-gap-small compact-form-grid" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="notification-phone">Telefon</label>
          <input
            id="notification-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            placeholder="+48..."
          />
        </div>

        <div className="form-field">
          <label htmlFor="notification-channel">Kanal</label>
          <select
            id="notification-channel"
            name="channel"
            value={channel}
            onChange={(event) => setChannel(event.target.value === 'sms' ? 'sms' : 'whatsapp')}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        <label className="full-width checkbox-field">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>Wyrazam zgode na jednorazowy kontakt w sprawie wyniku quizu i wiem, ze moge sie wypisac.</span>
        </label>

        <div className="full-width hero-actions">
          <button type="submit" className="button button-ghost" disabled={status === 'loading'}>
            {status === 'loading' ? 'Zapisuje...' : 'Zapisz przypomnienie'}
          </button>
        </div>

        {feedback ? (
          <div className={`full-width info-box ${status === 'error' ? 'error-box' : ''}`}>
            <strong>{status === 'success' ? 'Gotowe' : 'Uwaga'}</strong>
            <span>{feedback}</span>
          </div>
        ) : null}
      </form>
    </article>
  )
}
