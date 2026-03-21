'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMeetingEmbedUrl } from '@/lib/server/jitsi'

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

interface CallRoomProps {
  bookingId: string
  meetingUrl: string
  ownerName: string
}

export function CallRoom({ bookingId, meetingUrl, ownerName }: CallRoomProps) {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState('')
  const embedUrl = useMemo(() => createMeetingEmbedUrl(meetingUrl), [meetingUrl])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (!running || finished) {
          return prev
        }

        if (prev <= 1) {
          window.clearInterval(timer)
          setFinished(true)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finished, running])

  async function handleFinish() {
    setError('')

    try {
      const response = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendedNextStep: 'W razie potrzeby kolejnym krokiem moze byc pelna konsultacja, wizyta domowa albo dalsza praca wedlug ustalonego planu.',
        }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error ?? 'Nie udalo sie zamknac konsultacji.')
      }

      setRunning(false)
      setFinished(true)
      router.refresh()
    } catch (finishError) {
      setError(finishError instanceof Error ? finishError.message : 'Wystapil blad podczas zamykania konsultacji.')
    }
  }

  return (
    <section className="two-col-section booking-layout">
      <div className="panel room-panel">
        <div className="section-eyebrow">Krok 6 z 6</div>
        <h1>Panel rozmowy glosowej</h1>
        <p className="muted paragraph-gap">
          To jest link do 15-minutowej konsultacji audio. Kamera nie jest potrzebna. Przygotuj spokojne miejsce,
          najwazniejsze obserwacje o zwierzeciu i otworz rozmowe kilka minut przed czasem.
        </p>

        <div className="video-shell">
          <iframe
            title="Panel rozmowy glosowej"
            src={embedUrl}
            className="video-frame"
            allow="camera; microphone; fullscreen; display-capture"
          />
        </div>

        <div className="hero-actions top-gap">
          <button type="button" onClick={() => setRunning(true)} className="button button-primary big-button" disabled={running || finished}>
            {running ? 'Rozmowa trwa' : finished ? 'Rozmowa zakonczona' : 'Uruchom licznik 15 minut'}
          </button>
          <a href={meetingUrl} target="_blank" rel="noreferrer" className="button button-ghost big-button">
            Otworz rozmowe w nowej karcie
          </a>
          <button type="button" onClick={handleFinish} className="button button-ghost big-button">
            Zakoncz rozmowe
          </button>
        </div>

        {error ? <div className="error-box top-gap">{error}</div> : null}
      </div>

      <div className="panel section-panel room-sidebar">
        <div className="timer-box">{formatTime(secondsLeft)}</div>
        <div className="status-box">{running ? 'Rozmowa aktywna' : finished ? 'Rozmowa zakonczona' : 'Oczekiwanie na dolaczenie'}</div>

        <div className="stack-gap top-gap">
          <div className="list-card">
            <strong>Opiekun</strong>
            <span>{ownerName}</span>
          </div>
          <div className="list-card">
            <strong>Link do rozmowy</strong>
            <span>{meetingUrl}</span>
          </div>
          <div className="list-card accent-outline">
            <strong>Po rozmowie</strong>
            <span>Po tej konsultacji mozna zaplanowac pelna konsultacje, wizyte domowa albo dalsze wsparcie, jesli sytuacja wymaga szerszej pracy.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
