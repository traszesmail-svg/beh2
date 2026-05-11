'use client'

import { useState } from 'react'
import { TESTIMONIAL_ISSUE_OPTIONS } from '@/lib/testimonials'

export default function AddOpinionPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fields, setFields] = useState({
    displayName: '',
    email: '',
    issueCategory: '',
    opinion: '',
    photoUrl: '',
    consentPublish: false,
    website: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await response.json() as { ok?: boolean; message?: string; error?: string }

      if (response.ok && data.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMessage(data.error ?? 'Wystąpił nieoczekiwany błąd.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Błąd połączenia. Sprawdź internet i spróbuj ponownie.')
    }
  }

  if (status === 'sent') {
    return (
      <main style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#1f1a17' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Dzięki za opinię</h1>
        <p>Opinia trafiła do weryfikacji. Odezwę się po sprawdzeniu - najczęściej w ciągu 1-2 dni roboczych.</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#1f1a17' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Dodaj opinię</h1>
      <p style={{ color: '#6b625b', marginBottom: 32 }}>
        Ta strona jest dostępna tylko dla osób, które przeszły konsultacje. Opinia trafia do weryfikacji przed
        publikacja.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input type="text" name="website" value={fields.website} onChange={handleChange} style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="displayName" style={{ fontWeight: 600 }}>Imię lub inicjały do publikacji *</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={fields.displayName}
            onChange={handleChange}
            required
            maxLength={60}
            placeholder="np. Anna K."
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>Adres e-mail (do kontaktu, nie publikowany) *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            required
            maxLength={120}
            placeholder="twoj@email.pl"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="issueCategory" style={{ fontWeight: 600 }}>Czego dotyczyła konsultacja? *</label>
          <select id="issueCategory" name="issueCategory" value={fields.issueCategory} onChange={handleChange} required style={inputStyle}>
            <option value="">Wybierz temat</option>
            {TESTIMONIAL_ISSUE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="opinion" style={{ fontWeight: 600 }}>Tresc opinii *</label>
          <textarea
            id="opinion"
            name="opinion"
            value={fields.opinion}
            onChange={handleChange}
            required
            maxLength={600}
            rows={5}
            placeholder="Co konkretnie pomogło? Co się zmieniło po konsultacji?"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <span style={{ fontSize: 12, color: '#6b625b' }}>{fields.opinion.length}/600 znaków</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="photoUrl" style={{ fontWeight: 600 }}>Link do zdjecia psa / kota (opcjonalnie)</label>
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            value={fields.photoUrl}
            onChange={handleChange}
            maxLength={500}
            placeholder="https://..."
            style={inputStyle}
          />
          <span style={{ fontSize: 12, color: '#6b625b' }}>Możesz wrzucić zdjęcie na Google Drive, Dropbox itp. i wkleić link.</span>
        </div>

        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="consentPublish"
            checked={fields.consentPublish}
            onChange={handleChange}
            required
            style={{ marginTop: 3, flexShrink: 0 }}
          />
          <span style={{ fontSize: 14 }}>
            Wyrażam zgodę na publikację tej opinii na stronie regulskibehawiorysta.pl pod podanym imieniem lub inicjałami. *
          </span>
        </label>

        {status === 'error' && errorMessage && (
          <p style={{ color: '#b91c1c', background: '#fef2f2', padding: '12px 16px', borderRadius: 8, margin: 0 }}>
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            background: status === 'sending' ? '#9c8c80' : '#1f1a17',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'sending' ? 'Wysyłam...' : 'Wyślij opinię'}
        </button>

        <p style={{ fontSize: 12, color: '#6b625b' }}>
          Pola oznaczone * są wymagane. Opinia trafia do weryfikacji przed publikacją - nie pojawia się automatycznie na
          stronie.
        </p>
      </form>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #d9cfc3',
  fontSize: 15,
  color: '#1f1a17',
  background: '#fafaf8',
  width: '100%',
  boxSizing: 'border-box',
}
