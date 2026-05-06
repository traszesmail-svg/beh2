'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { URGENT_NOW_INTENT, isUrgentNowIntent } from '@/lib/urgent-now'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Species = FunnelSpecies
type UnknownSpecies = 'nie-wiem'
type SelectedSpecies = Species | UnknownSpecies | ''

type SubmissionPayload = {
  name: string
  contact: string
  species: SelectedSpecies
  topicId: string
  customTopic: string
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
    customTopic: '',
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
  const knownSpecies = form.species === 'pies' || form.species === 'kot' ? form.species : null
  const topicOptions = useMemo(() => (knownSpecies ? getProblemOptionsForSpecies(knownSpecies) : []), [knownSpecies])
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
        customTopic: '',
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

  function chooseSpecies(species: Species | UnknownSpecies) {
    markStarted()

    if (status === 'success') {
      setStatus('idle')
      setFeedback('')
    }

    setForm((current) => ({
      ...current,
      species,
      topicId: current.species === species ? current.topicId : '',
      customTopic: current.species === species ? current.customTopic : '',
    }))
  }

  function validate(): string | null {
    const normalizedName = normalizeShortText(form.name)
    const normalizedContact = normalizeShortText(form.contact)
    const normalizedMessage = normalizeLongText(form.message)
    const normalizedCustomTopic = normalizeShortText(form.customTopic)

    if (!normalizedName) {
      return 'Podaj imię.'
    }

    if (!normalizedContact || !isEmailValid(normalizedContact)) {
      return 'Podaj poprawny adres e-mail.'
    }

    if (!form.species) {
      return 'Wybierz psa, kota albo Nie wiem.'
    }

    if (form.species === 'nie-wiem') {
      if (normalizedCustomTopic.length < 3) {
        return 'Wpisz własny temat.'
      }
    } else if (!form.topicId || !getPublicProblemOptionById(form.species, form.topicId)) {
      return 'Wybierz temat.'
    }

    if (normalizedMessage.length < 20) {
      return 'Opisz problem w 2-4 zdaniach.'
    }

    if (normalizedMessage.length > MESSAGE_MAX_LENGTH) {
      return 'Skróć opis problemu do krótkiej wiadomości.'
    }

    if (isUrgentNow && (!form.requestedDate || !form.requestedTime)) {
      return 'Przy Kwadransie na już podaj preferowaną datę i godzinę.'
    }

    if (isUrgentNow && form.species === 'nie-wiem') {
      return 'Przy prośbie o pilny termin wybierz, czy sprawa dotyczy psa czy kota.'
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

    const selectedSpecies = form.species

    if (!selectedSpecies) {
      setStatus('error')
      setFeedback('Wybierz psa, kota albo Nie wiem.')
      return
    }

    setStatus('loading')
    setFeedback('')

    const normalizedMessage = normalizeLongText(form.message)
    const isUnknownSpecies = selectedSpecies === 'nie-wiem'
    const normalizedCustomTopic = normalizeShortText(form.customTopic)

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
          topicId: isUnknownSpecies ? 'inne' : form.topicId,
          topic: isUnknownSpecies ? normalizedCustomTopic : undefined,
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
        throw new Error(payload.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
      }

      trackAnalyticsEvent('contact_form_submitted', {
        source_page: '/kontakt',
        species: selectedSpecies,
        problem_key: isUnknownSpecies ? 'wlasny-temat' : form.topicId,
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
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? isUrgentNow
        ? 'Wysyłam prośbę...'
        : 'Wysyłam...'
      : status === 'success'
        ? isUrgentNow
          ? 'Wyślij kolejną prośbę'
          : 'Wyślij kolejną'
        : isUrgentNow
          ? 'Wyślij prośbę'
          : 'Wyślij'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <fieldset className="full-width form-field contact-species-field">
        <legend>Gatunek</legend>
        <div className="contact-species-toggle" aria-label="Wybierz gatunek">
          <button
            type="button"
            className={`contact-species-card${form.species === 'pies' ? ' is-selected' : ''}`}
            aria-pressed={form.species === 'pies'}
            onClick={() => chooseSpecies('pies')}
            onFocus={markStarted}
          >
            <Image src="/branding/homepage/choice-dog-clean.png" alt="" width={44} height={38} aria-hidden="true" />
            <span>Pies</span>
          </button>
          <button
            type="button"
            className={`contact-species-card${form.species === 'kot' ? ' is-selected' : ''}`}
            aria-pressed={form.species === 'kot'}
            onClick={() => chooseSpecies('kot')}
            onFocus={markStarted}
          >
            <Image src="/branding/homepage/choice-cat-clean.png" alt="" width={40} height={46} aria-hidden="true" />
            <span>Kot</span>
          </button>
          <button
            type="button"
            className={`contact-species-card${form.species === 'nie-wiem' ? ' is-selected' : ''}`}
            aria-pressed={form.species === 'nie-wiem'}
            onClick={() => chooseSpecies('nie-wiem')}
            onFocus={markStarted}
          >
            <Image src="/branding/homepage/choice-question-clean.png" alt="" width={38} height={38} aria-hidden="true" />
            <span>Nie wiem</span>
          </button>
        </div>
      </fieldset>

      {form.species === 'nie-wiem' ? (
        <div className="form-field">
          <label htmlFor="contact-custom-topic">Własny temat</label>
          <input
            id="contact-custom-topic"
            name="topic"
            value={form.customTopic}
            onChange={(event) => updateField('customTopic', event.target.value.slice(0, 120))}
            onFocus={markStarted}
            placeholder="np. nie wiem, od czego zacząć"
            autoComplete="off"
          />
        </div>
      ) : (
        <div className="form-field">
          <label htmlFor="contact-topic">Temat</label>
          <select
            id="contact-topic"
            name="topic"
            value={form.topicId}
            onChange={(event) => updateField('topicId', event.target.value)}
            onFocus={markStarted}
            disabled={!knownSpecies}
          >
            <option value="">{knownSpecies ? 'Wybierz temat' : 'Najpierw wybierz gatunek'}</option>
            {topicOptions.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>
      )}

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
          <label htmlFor="contact-message">{isUrgentNow ? 'Krótki opis i kontekst terminu' : 'Krótki opis problemu'}</label>
          <span className="contact-message-count" aria-live="polite">
            {messageLength}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          onFocus={markStarted}
          placeholder={
            isUrgentNow
              ? 'Napisz w 2-4 zdaniach, czego dotyczy temat i czy wskazana data/godzina są sztywne czy orientacyjne.'
              : form.species === 'nie-wiem'
                ? 'Opisz po swojemu, co się dzieje i czego nie jesteś pewien/pewna.'
                : 'Napisz w 2-4 zdaniach, co dzieje się teraz, od kiedy to trwa i co najbardziej chcesz uporządkować.'
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
            Wyrażam zgodę na przetwarzanie danych zgodnie z{' '}
            <Link href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
              polityką prywatności
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
            Zapoznałem się z{' '}
            <Link href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer">
              polityką prywatności
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
              - od 19&nbsp;zł, bez dodatkowej rozmowy.
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
