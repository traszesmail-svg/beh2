'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { URGENT_NOW_INTENT, isUrgentNowIntent } from '@/lib/urgent-now'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Species = FunnelSpecies
type SelectedSpecies = Species | ''

type SubmissionPayload = {
  name: string
  contact: string
  species: SelectedSpecies
  topicId: string
  message: string
  requestedDate: string
  requestedTime: string
  website: string
  consentProcessing: boolean
  consentPolicy: boolean
}

const MESSAGE_MAX_LENGTH = 500

function createInitialForm(species: SelectedSpecies = ''): SubmissionPayload {
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
  const presetDate = searchParams?.get('requestedDate') ?? null
  const presetTime = searchParams?.get('requestedTime') ?? null
  const isUrgentNow = isUrgentNowIntent(intent)
  const [form, setForm] = useState<SubmissionPayload>({
    ...createInitialForm(presetSpecies ?? ''),
    requestedDate: presetDate ?? '',
    requestedTime: presetTime ?? '',
  })
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const startedRef = useRef(false)
  const topicOptions = useMemo(() => (form.species ? getProblemOptionsForSpecies(form.species) : []), [form.species])
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

    if (!form.species) {
      return 'Wybierz, czy sprawa dotyczy psa czy kota.'
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

    const selectedSpecies = form.species

    if (!selectedSpecies) {
      setStatus('error')
      setFeedback('Wybierz, czy sprawa dotyczy psa czy kota.')
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
          species: selectedSpecies,
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
        species: selectedSpecies,
        problem_key: form.topicId,
        intent: isUrgentNow ? URGENT_NOW_INTENT : 'contact',
      })

      setStatus('success')
      setFeedback(
        payload.message ??
          (isUrgentNow
            ? 'Dziękuję. Prośba o Kwadrans na już została przyjęta. Odpowiem na podany adres e-mail w ciągu 15 minut z propozycją terminu.'
            : 'Wysłane. Odpowiem w 1-2 dni robocze. Sprawdź skrzynkę - masz też kopię.'),
      )
      setForm(createInitialForm(presetSpecies ?? ''))
      startedRef.current = false
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udalo sie wyslac wiadomosci. Sprobuj ponownie pozniej.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? isUrgentNow
        ? 'Wysyłam prośbę o termin...'
        : 'Wysylam krotka wiadomosc...'
      : status === 'success'
        ? isUrgentNow
          ? 'Wyslij kolejna prosbe'
          : 'Wyslij kolejna krotka wiadomosc'
        : isUrgentNow
          ? 'Wyślij prośbę o termin'
          : 'Wyslij krotka wiadomosc'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="contact-species">Gatunek</label>
        <select
          id="contact-species"
          name="species"
          value={form.species}
          onChange={(event) => updateField('species', event.target.value as SelectedSpecies)}
          onFocus={markStarted}
        >
          <option value="">Wybierz gatunek</option>
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
          disabled={!form.species}
        >
          <option value="">{form.species ? 'Wybierz temat' : 'Najpierw wybierz gatunek'}</option>
          {topicOptions.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>

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
        />
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
        <div className="contact-message-label-row">
          <label htmlFor="contact-message">{isUrgentNow ? 'Krotki opis i kontekst terminu' : 'Krotki opis problemu'}</label>
          <span className="contact-message-count" aria-live="polite">{messageLength}/{MESSAGE_MAX_LENGTH}</span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
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
        />
      </div>

      <fieldset className="full-width form-field consent-stack">
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
            Wyrazam zgode na przetwarzanie danych zgodnie z{' '}
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
            Zapoznalem sie z{' '}
            <Link href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
              polityka prywatnosci
            </Link>{' '}
            i{' '}
            <Link href="/regulamin" target="_blank" rel="noopener noreferrer">
              regulaminem
            </Link>
            .
          </span>
        </label>
      </fieldset>

      <input
        id="contact-website"
        name="website"
        type="text"
        value={form.website}
        onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      {feedback ? (
        <div className={`info-box full-width ${status === 'error' ? 'error-box' : ''}`} role="status">
          <p>{feedback}</p>
          {status === 'success' ? (
            <p style={{ marginTop: '12px' }}>
              W międzyczasie możesz zajrzeć po PDF-y w{' '}
              <a href="/materialy" className="prep-inline-link">
                /materialy
              </a>{' '}
              — od 19&nbsp;zł, bez dodatkowej rozmowy.
            </p>
          ) : null}
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
