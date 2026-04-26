'use client'

import { useState } from 'react'

type DownloadState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'ok'; bundleParts: number | null }
  | { status: 'error'; message: string }

export function MaterialyDownloadForm() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [part, setPart] = useState('')
  const [state, setState] = useState<DownloadState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state.status === 'submitting') return
    setState({ status: 'submitting' })
    try {
      const res = await fetch('/api/materialy/download', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code, part }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
        const msg = typeof data.error === 'string' ? data.error : 'Cos poszlo nie tak.'
        setState({ status: 'error', message: msg })
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get('content-disposition') || ''
      const match = /filename="([^"]+)"/.exec(cd)
      const filename = match ? match[1] : 'material.pdf'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      const totalParts = Number.parseInt(res.headers.get('x-bundle-parts') || '', 10)
      setState({
        status: 'ok',
        bundleParts: Number.isFinite(totalParts) && totalParts > 1 ? totalParts : null,
      })
    } catch {
      setState({ status: 'error', message: 'Brak polaczenia. Sprobuj ponownie.' })
    }
  }

  return (
    <form className="materialy-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>E-mail</span>
        <small>Ten sam adres, na który przyszedł kod.</small>
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

      <label>
        <span>Kod</span>
        <small>6 cyfr z wiadomości e-mail.</small>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          required
          maxLength={6}
          className="materialy-code-input"
        />
      </label>

      <label>
        <span>Część pakietu</span>
        <small>Opcjonalnie. Zostaw puste przy pojedynczym PDF-ie.</small>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="part"
          value={part}
          onChange={(e) => setPart(e.target.value.replace(/\D/g, '').slice(0, 2))}
          placeholder="0, 1, 2..."
          maxLength={2}
        />
      </label>

      {state.status === 'error' && <p className="form-error">{state.message}</p>}

      {state.status === 'ok' && state.bundleParts !== null && (
        <div className="materialy-success">
          <p>
            Pobieranie rozpoczęte. Pakiet ma <strong>{state.bundleParts}</strong> części. Aby pobrać
            kolejne, wpisz numer części od 1 do {state.bundleParts - 1} i kliknij ponownie.
            Każde pobranie zużywa 1 z 3 dostępnych prób.
          </p>
        </div>
      )}

      {state.status === 'ok' && state.bundleParts === null && (
        <div className="materialy-success">
          <p>Pobieranie rozpoczęte. Sprawdź folder Pobrane.</p>
        </div>
      )}

      <button type="submit" className="notatnik-btn" disabled={state.status === 'submitting'}>
        <span>{state.status === 'submitting' ? 'Sprawdzam...' : 'Pobierz PDF'}</span>
        {state.status !== 'submitting' && (
          <span className="notatnik-btn-arrow" aria-hidden="true">
            &rarr;
          </span>
        )}
      </button>
    </form>
  )
}
