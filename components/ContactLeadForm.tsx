'use client'

import React from 'react'
import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { URGENT_NOW_INTENT, isUrgentNowIntent } from '@/lib/urgent-now'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Species = FunnelSpecies

type SubmissionPayload = {
  name: string
  contact: string
  species: Species
  topicId: string
  message: string
  requestedDate: string
  requestedTime: string
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
    requestedDate: '',
    requestedTime: '',
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
  const intent = searchParams?.get('intent') ?? searchParams?.get('service') ?? null
  const isUrgentNow = isUrgentNowIntent(intent)
  const [form, setForm] = useState<SubmissionPayload>(createInitialForm(presetSpecies ?? 'pies'))
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const startedRef = useRef(false)
  const topicOptions = getProblemOptionsForSpecies(form.species)
  const messageLength = form.message.length
  const isSubmitDisabled = status === 'loading' || !form.consentProcessing || !form.consentPolicy

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
      intent: isUrgentNow ? URGENT_NOW_INTENT : 'contact',
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
      return 'Podaj imie.'
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
      return 'Skroc opis problemu do krotkiej wiadomosci.'
    }

    if (isUrgentNow && (!form.requestedDate || !form.requestedTime)) {
      return 'Przy Kwadransie na juz podaj preferowana date i godzine.'
    }

    if (!form.consentProcessing || !form.consentPolicy) {
      return 'Zaznacz zgody na kontakt i akceptacje polityki prywatnosci.'
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
          requestedDate: isUrgentNow ? form.requestedDate : null,
          requestedTime: isUrgentNow ? form.requestedTime : null,
          intent: isUrgentNow ? URGENT_NOW_INTENT : null,
          service: isUrgentNow ? URGENT_NOW_INTENT : null,
          website: form.website.trim(),
          consentProcessing: form.consentProcessing,
          consentPolicy: form.consentPolicy,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udalo sie wyslac wiadomosci. Sprobuj ponownie pozniej.')
      }

      trackAnalyticsEvent('contact_form_submitted', {
        source_page: '/kontakt',
        species: form.species,
        problem_key: form.topicId,
        intent: isUrgentNow ? URGENT_NOW_INTENT : 'contact',
      })

      setStatus('success')
      setFeedback(
        payload.message ??
          (isUrgentNow
            ? 'Dziekuje. Prosba o Kwadrans na juz zostala przyjeta. Odpowiem na podany adres e-mail w ciagu 15 minut z propozycja terminu.'
            : 'Wyslane. Odpowiem w 1-2 dni roboczych. Sprawdz skrzynke - masz tez kopie.'),
      )
      setForm((current) => createInitialForm(presetSpecies ?? current.species))
      startedRef.current = false
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udalo sie wyslac wiadomosci. Sprobuj ponownie pozniej.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? isUrgentNow
        ? 'Wysylam prosbe o termin...'
        : 'Wysylam krotka wiadomosc...'
      : status === 'success'
        ? isUrgentNow
          ? 'Wyslij kolejna prosbe'
          : 'Wyslij kolejna krotka wiadomosc'
        : isUrgentNow
          ? 'Wyslij prosbe o termin'
          : 'Wyslij krotka wiadomosc'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <div className="info-box full-width contact-form-intro">
        {isUrgentNow
          ? 'To jest prosba o Kwadrans na juz. Wpisz gatunek, temat i preferowana date z godzina, a odpowiem w ciagu 15 minut z konkretna propozycja terminu.'
          : 'Napisz krotko: gatunek, temat i co Cie niepokoi. To wystarczy, zeby odpowiedziec na wiadomosc i wskazac wlasciwy dalszy krok.'}
      </div>

      <div className="section-eyebrow contact-form-kicker">{isUrgentNow ? 'Kwadrans na juz' : 'Krotka wiadomosc'}</div>

      <div className="form-field">
        <label htmlFor="contact-name">Imie</label>
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
          {isUrgentNow
            ? 'Na ten adres odpowiem w sprawie Kwadransa na juz w ciagu 15 minut.'
            : 'Na ten adres odpowiem w sprawie wiadomosci, zwykle w ciagu 1-2 dni roboczych.'}
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
        <div className="field-help">Dobierz temat mozliwie najblizszy sytuacji {getSpeciesLabel(form.species).toLowerCase()}.</div>
      </div>

      {isUrgentNow ? (
        <>
          <div className="form-field">
            <label htmlFor="contact-requested-date">Preferowana data</label>
            <input
              id="contact-requested-date"
              name="requestedDate"
              type="date"
              value={form.requestedDate}
              onChange={(event) => updateField('requestedDate', event.target.value)}
              onFocus={markStarted}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-requested-time">Preferowana godzina</label>
            <input
              id="contact-requested-time"
              name="requestedTime"
              type="time"
              value={form.requestedTime}
              onChange={(event) => updateField('requestedTime', event.target.value)}
              onFocus={markStarted}
            />
          </div>
        </>
      ) : null}

      <div className="full-width form-field">
        <label htmlFor="contact-message">{isUrgentNow ? 'Krotki opis i kontekst terminu' : 'Krotki opis problemu'}</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          onFocus={markStarted}
          placeholder={
            isUrgentNow
              ? 'Napisz w 2-4 zdaniach, czego dotyczy temat i czy wskazana data/godzina sa sztywne czy orientacyjne.'
              : 'Napisz w 2-4 zdaniach, co dzieje sie teraz, od kiedy to trwa i co najbardziej chcesz uporzadkowac.'
          }
          enterKeyHint="send"
          maxLength={MESSAGE_MAX_LENGTH}
          aria-describedby="contact-message-help contact-message-count"
        />
        <div className="field-help" id="contact-message-help">
          {isUrgentNow
            ? 'Krotki opis wystarczy. Na tej podstawie wracam w ciagu 15 minut z propozycja terminu i dalszym krokiem.'
            : 'Nie wysylaj dlugiej historii. Krotki opis wystarczy, zeby dobrac odpowiedz i wskazac kolejny krok.'}
        </div>
        <div className="field-help" id="contact-message-count">
          {messageLength}/{MESSAGE_MAX_LENGTH} znakow
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
          <span>
            Wyrazam zgode na przetwarzanie danych w celu odpowiedzi na wiadomosc zgodnie z{' '}
            <Link href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
              polityka prywatnosci
            </Link>
            .
          </span>
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
          <span>
            Potwierdzam, ze zapoznalem sie z{' '}
            <Link href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
              polityka prywatnosci
            </Link>{' '}
            oraz{' '}
            <Link href="/regulamin" target="_blank" rel="noopener noreferrer">
              regulaminem
            </Link>{' '}
            w zakresie potrzebnym do kontaktu.
          </span>
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
          onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
        />
      </div>

      {feedback ? (
        <div className={`info-box full-width ${status === 'error' ? 'error-box' : ''}`} role="status">
          {feedback}
        </div>
      ) : null}

      <div className="full-width">
        <button type="submit" className="button button-primary big-button" disabled={isSubmitDisabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
