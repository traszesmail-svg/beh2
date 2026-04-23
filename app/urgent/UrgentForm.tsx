'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { getProblemOptionsForSpecies, getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'

type Species = FunnelSpecies
type SelectedSpecies = Species | ''
type FormState = 'idle' | 'loading' | 'success' | 'error'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getNowTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function formatCountdown(secondsLeft: number): string {
  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function UrgentForm() {
  const [species, setSpecies] = useState<SelectedSpecies>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topicId, setTopicId] = useState('')
  const [message, setMessage] = useState('')
  const [requestedDate, setRequestedDate] = useState(getTodayDate)
  const [requestedTime, setRequestedTime] = useState(getNowTime)
  const [consentProcessing, setConsentProcessing] = useState(false)
  const [consentPolicy, setConsentPolicy] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const topics = species ? getProblemOptionsForSpecies(species) : []

  useEffect(() => {
    if (!species) {
      if (topicId) {
        setTopicId('')
      }
      return
    }

    const currentTopics = getProblemOptionsForSpecies(species)
    if (!currentTopics.find((topic) => topic.id === topicId)) {
      setTopicId('')
    }
  }, [species, topicId])

  useEffect(() => {
    if (status === 'success' && secondsLeft === null) {
      setSecondsLeft(15 * 60)
    }
  }, [status, secondsLeft])

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) {
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [secondsLeft])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')

    if (!species) {
      setFeedback('Wybierz, czy sprawa dotyczy psa czy kota.')
      return
    }

    if (!topicId || !getPublicProblemOptionById(species, topicId)) {
      setFeedback('Wybierz temat.')
      return
    }

    if (!name.trim()) {
      setFeedback('Podaj imie.')
      return
    }

    if (!email.trim() || !isEmailValid(email.trim())) {
      setFeedback('Podaj poprawny adres e-mail.')
      return
    }

    if (message.trim().length < 10) {
      setFeedback('Opisz krotko sytuacje (minimum 10 znakow).')
      return
    }

    if (!consentProcessing || !consentPolicy) {
      setFeedback('Zaznacz zgody.')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/urgent-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          species,
          topicId,
          message: message.trim(),
          requestedDate,
          requestedTime,
          consentProcessing,
          consentPolicy,
          website: honeypot,
        }),
      })

      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !data.ok) {
        setStatus('error')
        setFeedback(data.error ?? 'Nie udalo sie wyslac prosby. Sprobuj ponownie.')
        return
      }

      setStatus('success')
    } catch {
      setStatus('error')
      setFeedback('Blad sieci. Sprawdz polaczenie i sprobuj ponownie.')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form-card urgent-success">
        <div className="urgent-success-head">
          <div className="notatnik-mono notatnik-kicker-spaced">Prosba wyslana</div>
          <h2>Dostalem Twoja prosbe. Odpowiem w ciagu 15 minut.</h2>
          <p>Sprawdz skrzynke e-mail - zaraz powinna pojawic sie wiadomosc z potwierdzeniem. Termin wysle na ten sam adres.</p>
        </div>

        {secondsLeft !== null && secondsLeft > 0 && (
          <div className="urgent-countdown">
            <div className="urgent-countdown-label notatnik-mono">Czas do odpowiedzi</div>
            <div className="urgent-countdown-clock" aria-live="polite" aria-label={`Pozostalo ${formatCountdown(secondsLeft)}`}>
              {formatCountdown(secondsLeft)}
            </div>
            <p className="urgent-countdown-note">Jesli nic nie dostaniesz po tym czasie, napisz bezposrednio.</p>
          </div>
        )}

        {secondsLeft === 0 && (
          <div className="urgent-countdown urgent-countdown-expired">
            <p>Czas minal. Jesli nie dostales odpowiedzi, napisz bezposrednio przez formularz kontaktu.</p>
            <a href="/kontakt#formularz" className="notatnik-inline-link">Formularz kontaktu</a>
          </div>
        )}
      </div>
    )
  }

  return (
    <form className="contact-form-card urgent-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <div className="form-field">
        <label htmlFor="urgent-species" className="form-label">Gatunek</label>
        <select id="urgent-species" value={species} onChange={(event) => setSpecies(event.target.value as SelectedSpecies)}>
          <option value="">Wybierz gatunek</option>
          <option value="pies">Pies</option>
          <option value="kot">Kot</option>
        </select>
        <div className="notatnik-field-help">
          {species
            ? `Po wyborze gatunku lista tematow pokazuje tylko opcje dla ${species === 'kot' ? 'kota' : 'psa'}.`
            : 'Najpierw wybierz, czy sprawa dotyczy psa czy kota. Potem pokaze wlasciwe tematy.'}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="urgent-topic" className="form-label">Temat</label>
        <select id="urgent-topic" value={topicId} onChange={(event) => setTopicId(event.target.value)} disabled={!species}>
          <option value="">{species ? 'Wybierz temat' : 'Najpierw wybierz gatunek'}</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
        <div className="notatnik-field-help">
          {species ? 'Wybierz temat najblizszy temu, co dzieje sie teraz.' : 'Po wyborze gatunku pojawi sie lista tematow tylko dla psa albo kota.'}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="urgent-name" className="form-label">Imie</label>
        <input
          id="urgent-name"
          type="text"
          placeholder="Twoje imie"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="given-name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="urgent-email" className="form-label">Adres e-mail</label>
        <input
          id="urgent-email"
          type="email"
          placeholder="adres@email.pl"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="form-field">
        <label htmlFor="urgent-phone" className="form-label">
          Telefon <span className="form-label-optional">(opcjonalnie, do SMS z potwierdzeniem)</span>
        </label>
        <input
          id="urgent-phone"
          type="tel"
          placeholder="600 000 000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
        />
      </div>

      <div className="form-field">
        <label htmlFor="urgent-message" className="form-label">Krotki opis sytuacji</label>
        <textarea
          id="urgent-message"
          rows={3}
          placeholder="2-3 zdania o tym, co sie dzieje i co Cie niepokoi."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className="form-field-row">
        <div className="form-field">
          <label htmlFor="urgent-date" className="form-label">Preferowana data</label>
          <input id="urgent-date" type="date" value={requestedDate} min={getTodayDate()} onChange={(event) => setRequestedDate(event.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="urgent-time" className="form-label">Godzina</label>
          <input id="urgent-time" type="time" value={requestedTime} onChange={(event) => setRequestedTime(event.target.value)} />
        </div>
      </div>

      <div className="form-field form-field-checkbox">
        <label className="form-checkbox-label">
          <input type="checkbox" checked={consentProcessing} onChange={(event) => setConsentProcessing(event.target.checked)} />
          <span>Wyrazam zgode na przetwarzanie danych osobowych w celu odpowiedzi na moja prosbe.</span>
        </label>
      </div>

      <div className="form-field form-field-checkbox">
        <label className="form-checkbox-label">
          <input type="checkbox" checked={consentPolicy} onChange={(event) => setConsentPolicy(event.target.checked)} />
          <span>
            Zapoznalam/em sie z{' '}
            <a href="/polityka-prywatnosci" target="_blank" className="notatnik-inline-link">polityka prywatnosci</a>
            {' '}i akceptuje jej warunki.
          </span>
        </label>
      </div>

      {feedback && (
        <div className="form-feedback form-feedback-error" role="alert">
          {feedback}
        </div>
      )}

      <button type="submit" className="notatnik-btn urgent-submit-btn" disabled={status === 'loading'}>
        <span>{status === 'loading' ? 'Wysylanie...' : 'Wyslij prosbe o Kwadrans na juz'}</span>
        {status !== 'loading' && (
          <span className="notatnik-btn-arrow" aria-hidden="true">&rarr;</span>
        )}
      </button>

      <p className="form-submit-note">
        Platnosc przychodzi dopiero po potwierdzeniu terminu. Termin dostaniesz mailem w ciagu 15 minut.
      </p>
    </form>
  )
}
