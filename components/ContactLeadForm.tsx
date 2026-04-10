'use client'

import React from 'react'
import { useRef, useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { normalizePolishPhone } from '@/lib/phone'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type Species = 'pies' | 'kot'

type SubmissionPayload = {
  name: string
  contact: string
  species: Species
  message: string
  website: string
}

const INITIAL_FORM: SubmissionPayload = {
  name: '',
  contact: '',
  species: 'pies',
  message: '',
  website: '',
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeShortText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeLongText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

export function ContactLeadForm() {
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
      location: 'contact-form',
      topic: 'Kontakt i rezerwacja',
      context_label: 'Krótki formularz kontaktu',
      booking_id: null,
    })
  }

  function updateField<K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) {
    markStarted()

    if (status === 'success') {
      setStatus('idle')
      setFeedback('')
    }

    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate(): string | null {
    const normalizedName = normalizeShortText(form.name)
    const normalizedContact = normalizeShortText(form.contact)
    const normalizedMessage = normalizeLongText(form.message)
    const hasEmail = isEmailValid(normalizedContact)
    const hasPhone = normalizePolishPhone(normalizedContact) !== null

    if (!normalizedName) {
      return 'Podaj imię.'
    }

    if (!normalizedContact || (!hasEmail && !hasPhone)) {
      return 'Podaj e-mail albo numer telefonu.'
    }

    if (!form.species) {
      return 'Wybierz pies albo kot.'
    }

    if (normalizedMessage.length < 12) {
      return 'Napisz kilka zdań o sytuacji, żeby łatwiej było zacząć.'
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
          name: normalizeShortText(form.name),
          email: normalizeShortText(form.contact),
          contact: normalizeShortText(form.contact),
          topic: 'Kontakt i rezerwacja',
          contextLabel: form.species === 'kot' ? 'Kot' : 'Pies',
          species: form.species,
          message: normalizeLongText(form.message),
          website: form.website.trim(),
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
      }

      setStatus('success')
      setFeedback(payload.message ?? 'Dziękuję. Wiadomość trafiła do weryfikacji. Odpowiem na podany kontakt.')
      setForm(INITIAL_FORM)
      startedRef.current = false
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? 'Wysyłam wiadomość...'
      : status === 'success'
        ? 'Wyślij kolejną wiadomość'
        : 'Wyślij wiadomość'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <div className="info-box full-width">
        Wystarczy imię, kontakt, pies / kot i krótki opis sytuacji. Formularz trafia bezpośrednio do mnie.
      </div>

      <div className="section-eyebrow">Wiadomość dotyczy</div>

      <div className="form-field">
        <label htmlFor="contact-name">Imię</label>
        <input
          id="contact-name"
          name="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          onFocus={markStarted}
          placeholder="np. Anna"
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-contact">E-mail lub telefon</label>
        <input
          id="contact-contact"
          name="contact"
          type="text"
          value={form.contact}
          onChange={(event) => updateField('contact', event.target.value)}
          onFocus={markStarted}
          placeholder="np. anna@email.pl lub +48 500 600 700"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          enterKeyHint="next"
          spellCheck={false}
          aria-describedby="contact-contact-help"
        />
        <div className="field-help" id="contact-contact-help">
          Jeśli podasz telefon, mogę odezwać się tą drogą.
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="contact-species">Pies / kot</label>
        <select
          id="contact-species"
          name="species"
          value={form.species}
          onChange={(event) => updateField('species', event.target.value as Species)}
          onFocus={markStarted}
        >
          <option value="pies">Pies</option>
          <option value="kot">Kot</option>
        </select>
      </div>

      <div className="full-width form-field">
        <label htmlFor="contact-message">Krótki opis sytuacji</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          onFocus={markStarted}
          placeholder="Napisz krótko, co się dzieje, od kiedy to trwa i czego potrzebujesz teraz."
          enterKeyHint="next"
        />
        <div className="field-help">Krótki opis wystarczy, żeby dobrać prosty pierwszy krok.</div>
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
          name="website"
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
          <div className="muted">Im mniej do wpisania, tym łatwiej zacząć.</div>
          <div className="checkout-title">Krótka wiadomość wystarczy</div>
          <div className="muted">Jeśli podasz telefon, mogę odezwać się tą drogą.</div>
        </div>

        <div className="checkout-right">
          <button type="submit" className="button button-primary big-button" disabled={status === 'loading'}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
