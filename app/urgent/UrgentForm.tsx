'use client'

import { useEffect, useRef, useState } from 'react'

type Species = 'pies' | 'kot'
type FormState = 'idle' | 'loading' | 'success' | 'error'

const DOG_TOPICS = [
  { id: 'szczeniak', label: 'Szczeniak / mlody pies' },
  { id: 'spacer', label: 'Spacer i reaktywnosc' },
  { id: 'separacja', label: 'Separacja' },
  { id: 'pobudzenie', label: 'Pobudzenie / wyciszenie' },
  { id: 'agresja', label: 'Agresja / zasoby' },
  { id: 'inne', label: 'Inny temat' },
]

const CAT_TOPICS = [
  { id: 'kot-kuweta', label: 'Kuweta' },
  { id: 'kot-stres', label: 'Stres i wycofanie' },
  { id: 'kot-agresja', label: 'Agresja' },
  { id: 'kot-napiecia', label: 'Napiecia miedzy kotami' },
  { id: 'inne', label: 'Inny temat' },
]

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
  const [species, setSpecies] = useState<Species>('pies')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topicId, setTopicId] = useState('inne')
  const [message, setMessage] = useState('')
  const [requestedDate, setRequestedDate] = useState(getTodayDate)
  const [requestedTime, setRequestedTime] = useState(getNowTime)
  const [consentProcessing, setConsentProcessing] = useState(false)
  const [consentPolicy, setConsentPolicy] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const [requestId, setRequestId] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const topics = species === 'pies' ? DOG_TOPICS : CAT_TOPICS

  useEffect(() => {
    const currentTopics = species === 'pies' ? DOG_TOPICS : CAT_TOPICS
    if (!currentTopics.find((t) => t.id === topicId)) {
      setTopicId(currentTopics[0].id)
    }
  }, [species, topicId])

  useEffect(() => {
    if (status === 'success' && secondsLeft === null) {
      setSecondsLeft(15 * 60)
    }
  }, [status, secondsLeft])

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback('')

    if (!name.trim()) { setFeedback('Podaj imie.'); return }
    if (!email.trim() || !isEmailValid(email.trim())) { setFeedback('Podaj poprawny adres e-mail.'); return }
    if (message.trim().length < 10) { setFeedback('Opisz krotko sytuacje (minimum 10 znakow).'); return }
    if (!consentProcessing || !consentPolicy) { setFeedback('Zaznacz zgody.'); return }

    setStatus('loading')

    try {
      const res = await fetch('/api/urgent-requests', {
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

      const data = (await res.json()) as { ok?: boolean; message?: string; requestId?: string; error?: string }

      if (!res.ok || !data.ok) {
        setStatus('error')
        setFeedback(data.error ?? 'Nie udalo sie wyslac prosby. Sprobuj ponownie.')
        return
      }

      setStatus('success')
      setRequestId(data.requestId ?? null)
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
          <h2>Dostalem Twoja prosbe. Odpiszę w ciagu 15 minut.</h2>
          <p>Sprawdz skrzynke e-mail — zaraz powinna pojawic sie wiadomosc z potwierdzeniem. Termin wyslę na ten sam adres.</p>
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
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <div className="form-field">
        <label htmlFor="urgent-species" className="form-label">Gatunek</label>
        <div className="form-radio-group">
          {(['pies', 'kot'] as Species[]).map((s) => (
            <label key={s} className={`form-radio-option${species === s ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="species"
                value={s}
                checked={species === s}
                onChange={() => setSpecies(s)}
              />
              {s === 'pies' ? 'Pies' : 'Kot'}
            </label>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="urgent-topic" className="form-label">Temat</label>
        <select
          id="urgent-topic"
          className="form-select"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="urgent-name" className="form-label">Imie</label>
        <input
          id="urgent-name"
          type="text"
          className="form-input"
          placeholder="Twoje imie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="urgent-email" className="form-label">Adres e-mail</label>
        <input
          id="urgent-email"
          type="email"
          className="form-input"
          placeholder="adres@email.pl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className="form-input"
          placeholder="600 000 000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </div>

      <div className="form-field">
        <label htmlFor="urgent-message" className="form-label">Krotki opis sytuacji</label>
        <textarea
          id="urgent-message"
          className="form-textarea"
          rows={3}
          placeholder="2-3 zdania o tym, co sie dzieje i co Cie niepokoi."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="form-field-row">
        <div className="form-field">
          <label htmlFor="urgent-date" className="form-label">Preferowana data</label>
          <input
            id="urgent-date"
            type="date"
            className="form-input"
            value={requestedDate}
            min={getTodayDate()}
            onChange={(e) => setRequestedDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="urgent-time" className="form-label">Godzina</label>
          <input
            id="urgent-time"
            type="time"
            className="form-input"
            value={requestedTime}
            onChange={(e) => setRequestedTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field form-field-checkbox">
        <label className="form-checkbox-label">
          <input
            type="checkbox"
            checked={consentProcessing}
            onChange={(e) => setConsentProcessing(e.target.checked)}
          />
          <span>Wyrazam zgode na przetwarzanie danych osobowych w celu odpowiedzi na moja prosbe.</span>
        </label>
      </div>

      <div className="form-field form-field-checkbox">
        <label className="form-checkbox-label">
          <input
            type="checkbox"
            checked={consentPolicy}
            onChange={(e) => setConsentPolicy(e.target.checked)}
          />
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

      <button
        type="submit"
        className="notatnik-btn urgent-submit-btn"
        disabled={status === 'loading'}
      >
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
