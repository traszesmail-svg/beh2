'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'

type FormState = 'idle' | 'loading' | 'success' | 'error'
type Species = FunnelSpecies

type SubmissionPayload = {
  displayName: string
  species: Species
  topicId: string
  opinion: string
  website: string
  consentPublish: boolean
}

const OPINION_MAX_LENGTH = 700

function createInitialForm(species: Species = 'pies'): SubmissionPayload {
  return {
    displayName: '',
    species,
    topicId: '',
    opinion: '',
    website: '',
    consentPublish: false,
  }
}

function normalizeShortText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeLongText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

function getSpeciesLabel(species: Species) {
  return species === 'kot' ? 'Kot' : 'Pies'
}

export function InternalOpinionForm() {
  const [form, setForm] = useState<SubmissionPayload>(createInitialForm('pies'))
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const startedRef = useRef(false)
  const topicOptions = getProblemOptionsForSpecies(form.species)
  const opinionLength = form.opinion.length

  useEffect(() => {
    const validTopics = new Set<string>(topicOptions.map((option) => option.id))
    setForm((current) => (current.topicId && !validTopics.has(current.topicId) ? { ...current, topicId: '' } : current))
  }, [topicOptions])

  function markStarted() {
    if (startedRef.current) {
      return
    }

    startedRef.current = true
    trackAnalyticsEvent('opinion_form_started', {
      source_page: '/__internal/opinie',
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
    const normalizedName = normalizeShortText(form.displayName)
    const normalizedOpinion = normalizeLongText(form.opinion)

    if (!normalizedName) {
      return 'Podaj imię albo inicjały.'
    }

    if (!form.topicId || !getPublicProblemOptionById(form.species, form.topicId)) {
      return 'Wybierz temat.'
    }

    if (normalizedOpinion.length < 20) {
      return 'Napisz kilka konkretnych zdań.'
    }

    if (normalizedOpinion.length > OPINION_MAX_LENGTH) {
      return 'Skróć opinię do krótszej wypowiedzi.'
    }

    if (!form.consentPublish) {
      return 'Zaznacz zgodę na publikację opinii.'
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

    const normalizedOpinion = normalizeLongText(form.opinion)

    try {
      const response = await fetch('/api/__internal/opinie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: normalizeShortText(form.displayName),
          species: form.species,
          topicId: form.topicId,
          opinion: normalizedOpinion,
          website: form.website.trim(),
          consentPublish: form.consentPublish,
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się wysłać opinii.')
      }

      trackAnalyticsEvent('opinion_form_submitted', {
        source_page: '/__internal/opinie',
        species: form.species,
        problem_key: form.topicId,
      })

      setStatus('success')
      setFeedback(payload.message ?? 'Dziękuję. Opinia została zapisana do ręcznego sprawdzenia.')
      setForm(createInitialForm(form.species))
      startedRef.current = false
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać opinii. Spróbuj ponownie później.')
    }
  }

  const submitLabel =
    status === 'loading'
      ? 'Wysyłam opinię...'
      : status === 'success'
        ? 'Wyślij kolejną opinię'
        : 'Wyślij opinię'

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit} noValidate>
      <div className="info-box full-width contact-form-intro">
        {COPY_HELPERS.reviewLead} Wystarczy krótka opinia, temat i zgoda na publikację po ręcznej akceptacji.
      </div>

      <div className="section-eyebrow contact-form-kicker">Po konsultacji</div>

      <div className="form-field">
        <label htmlFor="internal-opinion-name">Imię lub inicjały</label>
        <input
          id="internal-opinion-name"
          name="displayName"
          value={form.displayName}
          onChange={(event) => updateField('displayName', event.target.value)}
          onFocus={markStarted}
          placeholder="np. Marta K. albo A.K. - możesz też zostać przy samych inicjałach"
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="internal-opinion-species">Gatunek</label>
        <select
          id="internal-opinion-species"
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
        <label htmlFor="internal-opinion-topic">Temat</label>
        <select
          id="internal-opinion-topic"
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
        <div className="field-help">Wybierz temat możliwie najbliższy sytuacji {getSpeciesLabel(form.species).toLowerCase()}.</div>
      </div>

      <div className="full-width form-field">
        <label htmlFor="internal-opinion-text">Treść opinii</label>
        <textarea
          id="internal-opinion-text"
          name="opinion"
          rows={5}
          value={form.opinion}
          onChange={(event) => updateField('opinion', event.target.value.slice(0, OPINION_MAX_LENGTH))}
          onFocus={markStarted}
          placeholder="Napisz, co było dla Ciebie pomocne lub co zmieniłaś albo zmieniłeś po rozmowie..."
          maxLength={OPINION_MAX_LENGTH}
          aria-describedby="internal-opinion-help internal-opinion-count"
        />
        <div className="field-help" id="internal-opinion-help">
          Napisz krótko, jak wyglądała rozmowa z Twojej perspektywy. Nie musisz pisać wiele - kilka zdań wystarczy.
        </div>
        <div className="field-help" id="internal-opinion-count">
          {opinionLength}/{OPINION_MAX_LENGTH} znaków
        </div>
      </div>

      <fieldset className="full-width form-field consent-stack">
        <legend className="field-legend">Zgoda na publikację</legend>

        <label className="checkbox-card" htmlFor="internal-opinion-consent">
          <input
            id="internal-opinion-consent"
            name="consentPublish"
            type="checkbox"
            checked={form.consentPublish}
            onChange={(event) => updateField('consentPublish', event.target.checked)}
            onFocus={markStarted}
            required
          />
            <span>Wyrażam zgodę na opublikowanie tej opinii na stronie - w całości albo w skróconej formie, z inicjałami albo innym zakresem wynikającym z treści opinii i mojej zgody.</span>
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
        <label htmlFor="internal-opinion-website">Strona internetowa</label>
        <input
          id="internal-opinion-website"
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
          <div className="muted">Link służy wyłącznie do zebrania opinii po konsultacji.</div>
          <div className="checkout-title">Krótka opinia wystarczy</div>
          <div className="muted">{COPY_HELPERS.reviewPrivacy}</div>
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
