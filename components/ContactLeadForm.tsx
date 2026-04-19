'use client'

import React from 'react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Species = FunnelSpecies

type SubmissionPayload = {
  name: string
  contact: string
  species: Species
  topicId: string
  message: string
  website: string
  consentProcessing: boolean
  consentPolicy: boolean
}

const MESSAGE_MAX_LENGTH = 500

function createInitialForm(species: Species = 'pies'): SubmissionPayload {
  return {
    name: '',
    contact: '',
    species,
    topicId: '',
    message: '',
    website: '',
    consentProcessing: false,
    consentPolicy: false,
  }
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

function normalizeSpeciesPreset(value: string | null): Species | null {
  if (value === 'pies' || value === 'kot') {
    return value
  }

  return null
}

function getSpeciesLabel(species: Species) {
  return species === 'kot' ? 'Kot' : 'Pies'
}

export function ContactLeadForm() {
  const searchParams = useSearchParams()
  const presetSpecies = normalizeSpeciesPreset(searchParams?.get('species') ?? null)
  const [form, setForm] = useState<SubmissionPayload>(createInitialForm(presetSpecies ?? 'pies'))
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const startedRef = useRef(false)
  const topicOptions = getProblemOptionsForSpecies(form.species)
  const messageLength = form.message.length

  useEffect(() => {
    if (!presetSpecies) {
      return
    }

    setForm((current) => {
      if (current.species === presetSpecies) {
        return current
      }

      return {
        ...current,
        species: presetSpecies,
        topicId: '',
      }
    })
  }, [presetSpecies])

  useEffect(() => {
    const validTopics = new Set<string>(topicOptions.map((option) => option.id))
    setForm((current) => (current.topicId && !validTopics.has(current.topicId) ? { ...current, topicId: '' } : current))
  }, [topicOptions])

  function markStarted() {
    if (startedRef.current) {
      return
    }

    startedRef.current = true
    trackAnalyticsEvent('contact_form_started', {
      source_page: '/kontakt',
      species: form.species,
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

    if (!normalizedName) {
      return 'Podaj imię.'
    }

    if (!normalizedContact || !isEmailValid(normalizedContact)) {
      return 'Podaj poprawny adres e-mail.'
    }

    if (!form.topicId || !getPublicProblemOptionById(form.species, form.topicId)) {
      return 'Wybierz temat.'
    }

    if (normalizedMessage.length < 20) {
      return 'Opisz problem w 2-4 zdaniach.'
    }

    if (normalizedMessage.length > MESSAGE_MAX_LENGTH) {
      return 'Skróć opis problemu do krótkiej wiadomości.'
    }

    if (!form.consentProcessing || !form.consentPolicy) {
      return 'Zaznacz zgody na kontakt i akceptację polityki prywatności.'
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

    const normalizedMessage = normalizeLongText(form.message)

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
          species: form.species,
          topicId: form.topicId,
          message: normalizedMessage,
          website: form.website.trim(),
          consentProcessing: form.consentProcessing,
          consentPolicy: form.consentPolicy,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
      }

      trackAnalyticsEvent('contact_form_submitted', {
        source_page: '/kontakt',
        species: form.species,
        problem_key: form.topicId,
      })

      setStatus('success')
      setFeedback(payload.message ?? 'Dziękuję. Wiadomość została przyjęta. Odpowiem na podany adres e-mail.')
      setForm((current) => createInitialForm(presetSpecies ?? current.species))
      startedRef.current = false
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? 'Wysyłam krótką wiadomość...'
      : status === 'success'
        ? 'Wyślij kolejną krótką wiadomość'
        : 'Wyślij krótką wiadomość'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <div className="info-box full-width contact-form-intro">
        Napisz krótko: gatunek, temat i co Cię niepokoi. To wystarczy, żeby odpowiedzieć na wiadomość i wskazać właściwy dalszy krok.
      </div>

      <div className="section-eyebrow contact-form-kicker">Krótka wiadomość</div>

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
        <label htmlFor="contact-contact">E-mail</label>
        <input
          id="contact-contact"
          name="contact"
          type="email"
          value={form.contact}
          onChange={(event) => updateField('contact', event.target.value)}
          onFocus={markStarted}
          placeholder="np. anna@email.pl"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          enterKeyHint="next"
          spellCheck={false}
          aria-describedby="contact-contact-help"
        />
        <div className="field-help" id="contact-contact-help">
          Na ten adres odpowiem w sprawie wiadomości.
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="contact-species">Gatunek</label>
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

      <div className="form-field">
        <label htmlFor="contact-topic">Temat</label>
        <select
          id="contact-topic"
          name="topic"
          value={form.topicId}
          onChange={(event) => updateField('topicId', event.target.value)}
          onFocus={markStarted}
        >
          <option value="">Wybierz temat</option>
          {topicOptions.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
        <div className="field-help">Dobierz temat możliwie najbliższy sytuacji {getSpeciesLabel(form.species).toLowerCase()}.</div>
      </div>

      <div className="full-width form-field">
        <label htmlFor="contact-message">Krótki opis problemu</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          onFocus={markStarted}
          placeholder="Napisz w 2-4 zdaniach, co dzieje się teraz, od kiedy to trwa i co najbardziej chcesz uporządkować."
          enterKeyHint="send"
          maxLength={MESSAGE_MAX_LENGTH}
          aria-describedby="contact-message-help contact-message-count"
        />
        <div className="field-help" id="contact-message-help">
          Nie wysyłaj długiej historii. Krótki opis wystarczy, żeby dobrać odpowiedź i wskazać kolejny krok.
        </div>
        <div className="field-help" id="contact-message-count">
          {messageLength}/{MESSAGE_MAX_LENGTH} znaków
        </div>
      </div>

      <fieldset className="full-width form-field consent-stack">
        <legend className="field-legend">Zgody</legend>

        <label className="checkbox-card" htmlFor="contact-consent-processing">
          <input
            id="contact-consent-processing"
            name="consentProcessing"
            type="checkbox"
            checked={form.consentProcessing}
            onChange={(event) => updateField('consentProcessing', event.target.checked)}
            onFocus={markStarted}
            required
          />
          <span>Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na wiadomość.</span>
        </label>

        <label className="checkbox-card" htmlFor="contact-consent-policy">
          <input
            id="contact-consent-policy"
            name="consentPolicy"
            type="checkbox"
            checked={form.consentPolicy}
            onChange={(event) => updateField('consentPolicy', event.target.checked)}
            onFocus={markStarted}
            required
          />
          <span>Akceptuję politykę prywatności i regulamin w zakresie potrzebnym do kontaktu.</span>
        </label>
      </fieldset>

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
        <div
          className={status === 'success' ? 'success-inline full-width' : 'error-box full-width'}
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedback}
        </div>
      ) : null}

      <div className="checkout-box full-width tree-backed-card">
        <div>
          <div className="muted">Bez rozpisywania całej historii od początku.</div>
          <div className="checkout-title">Krótka wiadomość wystarczy</div>
          <div className="muted">Jeśli temat okaże się szerszy, wskażę kolejny sensowny krok albo odpowiednią usługę.</div>
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
