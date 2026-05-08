'use client'

import React, { useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { GrowthSpecies } from '@/lib/growth-layer'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type NewsletterSignupProps = {
  location: string
  sourcePage: string
  compact?: boolean
  title?: string
  lead?: string
  className?: string
}

const NEWSLETTER_SIGNUP_COPY = {
  title: 'Newsletter dla opiekunów psów i kotów',
  lead: 'Piszę raz na jakiś czas, tylko kiedy mam coś konkretnego. Głównie o tym, co napędza zachowanie zwierząt i co z tym zrobić bez nadmiaru teorii.',
  buttonLabel: 'Zapisz się',
  note: 'Raz na 1-2 tygodnie. Możesz wypisac się w kazdej chwili.',
  successTitle: 'Dziękuję za zapis',
  successBody: 'Na liście zostajesz po to, żeby dostawać praktyczne treści, a nie częste kampanie sprzedażowe.',
} as const

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function NewsletterSignup({
  location,
  sourcePage,
  compact = false,
  title = NEWSLETTER_SIGNUP_COPY.title,
  lead = NEWSLETTER_SIGNUP_COPY.lead,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [segment, setSegment] = useState<GrowthSpecies>('oba')
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isEmailValid(email.trim())) {
      setStatus('error')
      setFeedback('Podaj poprawny adres e-mail.')
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('/api/growth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'newsletter',
          email: email.trim(),
          segment,
          location,
          sourcePage,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się zapisać do newslettera.')
      }

      trackAnalyticsEvent('newsletter_signup', {
        location,
        source_page: sourcePage,
        segment,
      })

      setStatus('success')
      setFeedback(payload.message ?? NEWSLETTER_SIGNUP_COPY.successBody)
      setEmail('')
      setSegment('oba')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udało się zapisać do newslettera.')
    }
  }

  return (
    <article className={className ?? 'summary-card tree-backed-card'}>
      <div className="section-eyebrow">Newsletter</div>
      <h3>{title}</h3>
      <p className="muted">{lead}</p>

      <form className={`form-grid top-gap${compact ? ' compact-form-grid' : ''}`} onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor={`newsletter-email-${location}`}>E-mail</label>
          <input
            id={`newsletter-email-${location}`}
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="twoj@email.pl"
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor={`newsletter-segment-${location}`}>Temat najbliższy</label>
          <select
            id={`newsletter-segment-${location}`}
            name="segment"
            value={segment}
            onChange={(event) => setSegment(event.target.value as GrowthSpecies)}
          >
            <option value="oba">Pies i kot / oba</option>
            <option value="pies">Pies</option>
            <option value="kot">Kot</option>
          </select>
        </div>

        <div className="full-width hero-actions top-gap-small">
          <button type="submit" className="button button-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Zapisuje...' : NEWSLETTER_SIGNUP_COPY.buttonLabel}
          </button>
        </div>

        <div className="full-width field-help">{NEWSLETTER_SIGNUP_COPY.note}</div>

        {feedback ? (
          <div className={`full-width info-box ${status === 'error' ? 'error-box' : ''}`}>
            <strong>{status === 'success' ? NEWSLETTER_SIGNUP_COPY.successTitle : 'Uwaga'}</strong>
            <span>{feedback}</span>
          </div>
        ) : null}
      </form>
    </article>
  )
}
