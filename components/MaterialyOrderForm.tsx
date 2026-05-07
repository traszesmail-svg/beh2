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
  | { status: 'error'; message: string }

export function MaterialyOrderForm({ productKind, productSlug, productTitle, priceLabel, priceAmount }: Props) {
  const isFree = priceAmount === 0
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('')
  const [consentProcessing, setConsentProcessing] = useState(false)
  const [consentPolicy, setConsentPolicy] = useState(false)
  const [state, setState] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state.status === 'submitting') return
    setState({ status: 'submitting' })

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'ebook',
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
        setState({ status: 'error', message: typeof data.error === 'string' ? data.error : 'Coś poszło nie tak.' })
        return
      }

      if (data.free === true) {
        setState({ status: 'free-ok', orderId: String(data.orderNumber ?? data.orderId) })
        return
      }

      window.location.assign(String(data.redirectTo ?? '/checkout'))
    } catch {
      setState({ status: 'error', message: 'Brak połączenia. Spróbuj ponownie.' })
    }
  }

  if (state.status === 'free-ok') {
    return (
      <div className="materialy-success">
        <h2>Sprawdź skrzynkę e-mail</h2>
        <p>
          Wysłałem kod dostępu na <strong>{email}</strong>. Numer zamówienia: <code>{state.orderId}</code>.
        </p>
        <p>
          Wpisz kod razem z e-mailem na stronie{' '}
          <Link href="/dostep" className="notatnik-inline-link">
            /dostep
          </Link>
          , żeby otworzyć materiał.
        </p>
      </div>
    )
  }

  return (
    <form className="materialy-form" onSubmit={handleSubmit} noValidate>
      <p className="form-summary">
        Zamawiasz: <strong>{productTitle}</strong> - <strong>{priceLabel}</strong>
        {!isFree && ' (płatność online albo BLIK na telefon w kolejnym kroku)'}
      </p>

      <label>
        Imię
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

      {!isFree ? (
        <label>
          Telefon (opcjonalnie, jeśli płatność BLIK idzie z innego numeru)
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </label>
      ) : null}

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
          Wyrażam zgodę na przetwarzanie danych zgodnie z{' '}
          <Link href="/polityka-prywatnosci" className="notatnik-inline-link">
            polityką prywatności
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
          Zapoznałem się z{' '}
          <Link href="/polityka-prywatnosci" className="notatnik-inline-link">
            polityką prywatności
          </Link>{' '}
          i{' '}
          <Link href="/regulamin" className="notatnik-inline-link">
            regulaminem
          </Link>
          .
        </span>
      </label>

      {state.status === 'error' ? <p className="form-error">{state.message}</p> : null}

      <button type="submit" className="notatnik-btn" disabled={state.status === 'submitting'}>
        <span>{state.status === 'submitting' ? 'Wysyłam...' : isFree ? 'Pobierz bezpłatnie' : 'Przejdź do płatności'}</span>
        {state.status !== 'submitting' ? (
          <span className="notatnik-btn-arrow" aria-hidden="true">
            &rarr;
          </span>
        ) : null}
      </button>
    </form>
  )
}
