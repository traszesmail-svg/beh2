'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  productKind: 'guide' | 'bundle'
  productSlug: string
  productTitle: string
  priceLabel: string
  priceAmount: number
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'free-ok'; orderId: string }
  | { status: 'paid-ok'; orderId: string; blikPhone: string; priceLabel: string }
  | { status: 'error'; message: string }

export function MaterialyOrderForm({ productKind, productSlug, productTitle, priceLabel, priceAmount }: Props) {
  const isFree = priceAmount === 0
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [consentProcessing, setConsentProcessing] = useState(false)
  const [consentPolicy, setConsentPolicy] = useState(false)
  const [state, setState] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state.status === 'submitting') return
    setState({ status: 'submitting' })
    try {
      const res = await fetch('/api/materialy/order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          productKind,
          productSlug,
          name,
          email,
          phone,
          notes,
          website,
          consentProcessing,
          consentPolicy,
        }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        setState({ status: 'error', message: typeof data.error === 'string' ? data.error : 'Cos poszlo nie tak.' })
        return
      }
      if (data.free === true) {
        setState({ status: 'free-ok', orderId: String(data.orderId) })
      } else {
        setState({
          status: 'paid-ok',
          orderId: String(data.orderId),
          blikPhone: String(data.blikPhone),
          priceLabel: String(data.priceLabel),
        })
      }
    } catch (err) {
      setState({ status: 'error', message: 'Brak połączenia. Spróbuj ponownie.' })
    }
  }

  if (state.status === 'free-ok') {
    return (
      <div className="materialy-success">
        <h2>Sprawdź skrzynkę e-mail</h2>
        <p>
          Wyslalem kod do pobrania na <strong>{email}</strong>. Numer zamowienia: <code>{state.orderId}</code>.
        </p>
        <p>
          Wpisz kod razem z e-mailem na stronie{' '}
          <Link href="/materialy/pobranie" className="notatnik-inline-link">
            /materialy/pobranie
          </Link>
          , zeby otworzyc PDF.
        </p>
      </div>
    )
  }

  if (state.status === 'paid-ok') {
    return (
      <div className="materialy-success">
        <h2>Zamówienie przyjęte</h2>
        <p>
          Numer: <code>{state.orderId}</code>. Kwota: <strong>{state.priceLabel}</strong>.
        </p>
        <p>
          Zaplac BLIK-iem na numer <strong>{state.blikPhone}</strong>. W tytule wpisz{' '}
          <code>{state.orderId}</code>.
        </p>
        <p>
          Po zaksięgowaniu wpłaty wyślę Ci kod do pobrania na <strong>{email}</strong>. Zwykle do 60 minut
          (pon.-pt. 8:00-18:00).
        </p>
        <p>
          Pełna instrukcja jest też w mailu, który właśnie do Ciebie poszedł.
        </p>
      </div>
    )
  }

  return (
    <form className="materialy-form" onSubmit={handleSubmit} noValidate>
      <p className="form-summary">
        Zamawiasz: <strong>{productTitle}</strong> — <strong>{priceLabel}</strong>
        {!isFree && ' (BLIK na telefon, kod przyjdzie mailem)'}
      </p>

      <label>
        Imie
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          autoComplete="given-name"
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={160}
          autoComplete="email"
        />
      </label>

      {!isFree && (
        <label>
          Telefon (opcjonalnie — przyda się, jeśli płatność BLIK idzie z innego numeru)
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </label>
      )}

      <label>
        Krótka notatka (opcjonalnie)
        <textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1200}
          rows={3}
        />
      </label>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <label className="consent-line">
        <input
          type="checkbox"
          checked={consentProcessing}
          onChange={(e) => setConsentProcessing(e.target.checked)}
          required
        />
        <span>
          Wyrazam zgode na przetwarzanie danych zgodnie z{' '}
          <Link href="/polityka-prywatnosci" className="notatnik-inline-link">
            polityka prywatnosci
          </Link>
          .
        </span>
      </label>

      <label className="consent-line">
        <input
          type="checkbox"
          checked={consentPolicy}
          onChange={(e) => setConsentPolicy(e.target.checked)}
          required
        />
        <span>
          Zapoznalem sie z{' '}
          <Link href="/polityka-prywatnosci" className="notatnik-inline-link">
            polityka prywatnosci
          </Link>{' '}
          i{' '}
          <Link href="/regulamin" className="notatnik-inline-link">
            regulaminem
          </Link>
          .
        </span>
      </label>

      {state.status === 'error' && <p className="form-error">{state.message}</p>}

      <button type="submit" className="notatnik-btn" disabled={state.status === 'submitting'}>
        <span>{state.status === 'submitting' ? 'Wysylam...' : isFree ? 'Pobierz bezplatnie' : 'Zamow i zaplac BLIK'}</span>
        {state.status !== 'submitting' && (
          <span className="notatnik-btn-arrow" aria-hidden="true">
            &rarr;
          </span>
        )}
      </button>
    </form>
  )
}
