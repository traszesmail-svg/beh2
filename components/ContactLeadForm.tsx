 'use client'

import React from 'react'
import Link from 'next/link'
import { useRef, useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type ContactLeadFormProps = {
  topic: string
  contextLabel: string
  bookingId?: string | null
  followupHref: string
  followupLabel: string
  analyticsLocation?: string
}

type SubmissionPayload = {
  name: string
  email: string
  message: string
  website: string
}

const INITIAL_FORM: SubmissionPayload = {
  name: '',
  email: '',
  message: '',
  website: '',
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

export function ContactLeadForm({
  topic,
  contextLabel,
  bookingId,
  followupHref,
  followupLabel,
  analyticsLocation = 'contact-lead-form',
}: ContactLeadFormProps) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const startedRef = useRef(false)

  function markStarted() {
    if (startedRef.current) {
      return
    }

    startedRef.current = true
    trackAnalyticsEvent('form_started', {
      location: analyticsLocation,
      topic,
      context_label: contextLabel,
      booking_id: bookingId ?? null,
    })
  }

  function updateField<K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) {
    markStarted()
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate(): string | null {
    const normalizedName = normalizeText(form.name)
    const normalizedEmail = form.email.trim()
    const normalizedMessage = normalizeText(form.message)

    if (!normalizedName) {
      return 'Podaj imię i nazwisko albo same inicjały.'
    }

    if (!isEmailValid(normalizedEmail)) {
      return 'Podaj poprawny adres e-mail.'
    }

    if (normalizedMessage.length < 20) {
      return 'Napisz kilka zdań o sytuacji, aby łatwiej było wybrać kolejny krok.'
    }

    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    markStarted()

    const validationError = validate()

    if (validationError) {
      setStatus('error')
      setFeedback(validationError)
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: normalizeText(form.name),
          email: form.email.trim(),
          topic: normalizeText(topic) || 'Ogólne pytanie',
          contextLabel: normalizeText(contextLabel) || 'Kontakt ogólny',
          message: normalizeText(form.message),
          bookingId: bookingId?.trim() ?? '',
          website: form.website.trim(),
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
      }

      setStatus('success')
      setFeedback(payload.message ?? 'Dziękujemy. Wiadomość została wysłana. Odpowiem na podany adres e-mail.')
      setForm(INITIAL_FORM)
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
    }
  }

  const submitLabel =
    status === 'loading' ? 'Wysyłam wiadomość...' : status === 'success' ? 'Wyślij kolejną wiadomość' : 'Wyślij wiadomość'

  return (
    <section className="top-gap" aria-labelledby="contact-lead-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Napisz wiadomość</div>
          <h2 id="contact-lead-heading">Wyślij krótki opis sytuacji</h2>
        </div>
        <div className="muted">Formularz trafia bezpośrednio do mnie. Odpowiadam osobiście na podany adres e-mail.</div>
      </div>

      <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
        <div className="list-card accent-outline tree-backed-card full-width">
          <strong>Wiadomość dotyczy</strong>
          <span>{contextLabel}</span>
          {bookingId ? <span>Numer rezerwacji: {bookingId}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="contact-name">Imię i nazwisko</label>
          <input
            id="contact-name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            onFocus={markStarted}
            placeholder="np. Anna Nowak"
            autoComplete="name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">E-mail</label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            onFocus={markStarted}
            placeholder="np. klient@email.pl"
            autoComplete="email"
          />
        </div>

        <div className="full-width form-field">
          <label htmlFor="contact-message">Wiadomość</label>
          <textarea
            id="contact-message"
            rows={6}
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            onFocus={markStarted}
            placeholder="Napisz krótko, co się dzieje, co już próbowałaś lub próbowałeś i czego potrzebujesz teraz."
          />
          <div className="field-help">Im konkretniej opiszesz sytuację, tym łatwiej będzie wybrać prosty kolejny krok.</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <label htmlFor="contact-website">Strona internetowa</label>
          <input
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField('website', event.target.value)}
          />
        </div>

        {feedback ? (
          <div className={status === 'success' ? 'success-inline full-width' : 'error-box full-width'} role="status" aria-live="polite">
            {feedback}
          </div>
        ) : null}

        <div className="checkout-box full-width tree-backed-card">
          <div>
            <div className="muted">Jeśli wolisz najpierw wrócić do ścieżki z ofertą lub rezerwacją, masz to obok.</div>
            <div className="checkout-title">Dalej: odpowiedź albo powrót do następnego kroku</div>
            <div className="muted">Po wysłaniu wiadomość trafi na skrzynkę kontaktową, a ja odpiszę na wskazany adres.</div>
          </div>

          <div className="checkout-right">
            <button type="submit" className="button button-primary big-button" disabled={status === 'loading'}>
              {submitLabel}
            </button>
            <Link
              href={followupHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location={analyticsLocation}
            >
              {followupLabel}
            </Link>
          </div>
        </div>
      </form>
    </section>
  )
}
