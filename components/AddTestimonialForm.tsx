'use client'

import React, { useMemo, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { TESTIMONIAL_FORM_LIMITS, TESTIMONIAL_ISSUE_OPTIONS } from '@/lib/testimonials'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type SubmissionPayload = {
  displayName: string
  email: string
  issueCategory: string
  opinion: string
  beforeAfter: string
  photoUrl: string
  consentContact: boolean
  consentPublish: boolean
  website: string
}

const INITIAL_FORM: SubmissionPayload = {
  displayName: '',
  email: '',
  issueCategory: '',
  opinion: '',
  beforeAfter: '',
  photoUrl: '',
  consentContact: false,
  consentPublish: false,
  website: '',
}

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

export function AddTestimonialForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  const submitLabel = useMemo(() => {
    if (status === 'loading') {
      return 'Wysyłam opinię...'
    }

    return 'Wyślij opinię do weryfikacji'
  }, [status])

  function updateField<K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate(): string | null {
    if (!normalizeText(form.displayName)) {
      return 'Podaj imię lub inicjały, których możemy użyć po akceptacji opinii.'
    }

    if (!isEmailValid(form.email.trim())) {
      return 'Podaj poprawny adres e-mail do weryfikacji opinii.'
    }

    if (!form.issueCategory) {
      return 'Wybierz kategorię problemu, której dotyczy opinia.'
    }

    if (normalizeText(form.opinion).length < 20) {
      return 'Napisz kilka konkretnych zdań o tym, jak pomogła konsultacja.'
    }

    if (normalizeText(form.beforeAfter).length < 20) {
      return 'Opisz krótko, co działo się wcześniej i co zmieniło się po konsultacji.'
    }

    if (!form.consentContact || !form.consentPublish) {
      return 'Zaznacz zgody wymagane do weryfikacji i ewentualnej publikacji opinii.'
    }

    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationError = validate()

    if (validationError) {
      setStatus('error')
      setMessage(validationError)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: normalizeText(form.displayName),
          email: form.email.trim(),
          issueCategory: form.issueCategory,
          opinion: normalizeText(form.opinion),
          beforeAfter: normalizeText(form.beforeAfter),
          photoUrl: form.photoUrl.trim(),
          consentContact: form.consentContact,
          consentPublish: form.consentPublish,
          website: form.website,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać opinii do weryfikacji.')
      }

      setStatus('success')
      trackAnalyticsEvent('opinion_add', { issue_category: form.issueCategory })
      setMessage(payload.message ?? 'Dziękujemy. Twoja opinia trafiła do weryfikacji. Po akceptacji dodamy ją na stronę.')
      setForm(INITIAL_FORM)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Nie udało się wysłać formularza. Spróbuj ponownie później.')
    }
  }

  return (
    <section className="panel section-panel" id="dodaj-opinie" aria-labelledby="dodaj-opinie-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Dodaj opinię</div>
          <h2 id="dodaj-opinie-heading">Wyślij opinię do ręcznej moderacji</h2>
        </div>
        <div className="muted">
          Po konsultacji możesz zostawić krótką opinię. Najpierw trafi ona do weryfikacji mailowej, a dopiero potem — po ręcznej akceptacji —
          pojawi się na stronie.
        </div>
      </div>

      <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="testimonial-display-name">Imię do publikacji</label>
          <input
            id="testimonial-display-name"
            value={form.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
            maxLength={TESTIMONIAL_FORM_LIMITS.displayName}
            placeholder="np. Anna albo A."
          />
        </div>

        <div>
          <label htmlFor="testimonial-email">Email do weryfikacji</label>
          <input
            id="testimonial-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            maxLength={TESTIMONIAL_FORM_LIMITS.email}
            placeholder="np. opiekun@email.pl"
          />
        </div>

        <div>
          <label htmlFor="testimonial-category">Kategoria problemu</label>
          <select id="testimonial-category" value={form.issueCategory} onChange={(event) => updateField('issueCategory', event.target.value)}>
            <option value="">Wybierz kategorię</option>
            {TESTIMONIAL_ISSUE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="testimonial-photo-url">Link do zdjęcia</label>
          <input
            id="testimonial-photo-url"
            type="url"
            value={form.photoUrl}
            onChange={(event) => updateField('photoUrl', event.target.value)}
            maxLength={TESTIMONIAL_FORM_LIMITS.photoUrl}
            placeholder="https://..."
          />
          <span className="field-help">Jeśli chcesz, wklej link do zdjęcia. Po akceptacji materiał zostanie ręcznie dodany na stronę.</span>
        </div>

        <div className="full-width">
          <label htmlFor="testimonial-opinion">Treść opinii</label>
          <textarea
            id="testimonial-opinion"
            rows={5}
            value={form.opinion}
            onChange={(event) => updateField('opinion', event.target.value)}
            maxLength={TESTIMONIAL_FORM_LIMITS.opinion}
            placeholder="Napisz, jak wyglądało Twoje doświadczenie po konsultacji."
          />
        </div>

        <div className="full-width">
          <label htmlFor="testimonial-before-after">Co się działo wcześniej i co zmieniło się po konsultacji</label>
          <textarea
            id="testimonial-before-after"
            rows={5}
            value={form.beforeAfter}
            onChange={(event) => updateField('beforeAfter', event.target.value)}
            maxLength={TESTIMONIAL_FORM_LIMITS.beforeAfter}
            placeholder="Krótko opisz punkt wyjścia i to, co udało się uporządkować po rozmowie."
          />
        </div>

        <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
          <label htmlFor="testimonial-website">Strona internetowa</label>
          <input id="testimonial-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField('website', event.target.value)} />
        </div>

        <div className="full-width consent-stack">
          <label className="checkbox-card" htmlFor="testimonial-consent-contact">
            <input
              id="testimonial-consent-contact"
              type="checkbox"
              checked={form.consentContact}
              onChange={(event) => updateField('consentContact', event.target.checked)}
            />
            <span>Zgadzam się na kontakt weryfikacyjny w sprawie opinii.</span>
          </label>

          <label className="checkbox-card" htmlFor="testimonial-consent-publish">
            <input
              id="testimonial-consent-publish"
              type="checkbox"
              checked={form.consentPublish}
              onChange={(event) => updateField('consentPublish', event.target.checked)}
            />
            <span>Zgadzam się na publikację opinii i zdjęcia po ręcznej akceptacji.</span>
          </label>
        </div>

        {message ? (
          <div className={status === 'success' ? 'success-inline full-width' : 'error-box full-width'} role="status" aria-live="polite">
            {message}
          </div>
        ) : null}

        <div className="checkout-box full-width">
          <div>
            <div className="muted">
              Formularz nie publikuje treści automatycznie. Najpierw wysyłamy zgłoszenie do właściciela projektu, który potwierdza zgodę i dopiero
              wtedy dodaje opinię na stronę.
            </div>
          </div>
          <div className="checkout-right">
            <button type="submit" className="button button-primary big-button" disabled={status === 'loading'}>
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
