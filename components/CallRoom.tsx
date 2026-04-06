'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  type BookingServiceType,
  getBookingServiceRoomDurationMinutes,
  getBookingServiceRoomSummary,
  getBookingServiceTitle,
} from '@/lib/booking-services'
import { formatDateTimeLabel, getSecondsUntilRoomUnlock } from '@/lib/data'
import { createMeetingEmbedUrl } from '@/lib/server/jitsi'
import { CAPBT_LOGO, COAPE_LOGO, SITE_NAME } from '@/lib/site'
import { BookingRecord } from '@/lib/types'

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

type AudioContextWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext
}

interface CallRoomProps {
  bookingId: string
  accessToken: string | null
  meetingUrl: string
  ownerName: string
  bookingDate: string
  bookingTime: string
  bookingStatus: BookingRecord['bookingStatus']
  serviceType: BookingServiceType
  qaBooking?: boolean
}

export function CallRoom({
  bookingId,
  accessToken,
  meetingUrl,
  ownerName,
  bookingDate,
  bookingTime,
  bookingStatus,
  serviceType,
  qaBooking = false,
}: CallRoomProps) {
  const router = useRouter()
  const trackedEntryRef = useRef(false)
  const roomDurationMinutes = getBookingServiceRoomDurationMinutes(serviceType)
  const serviceTitle = getBookingServiceTitle(serviceType)
  const serviceSummary = getBookingServiceRoomSummary(serviceType)
  const [secondsLeft, setSecondsLeft] = useState(roomDurationMinutes * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(bookingStatus === 'done')
  const [error, setError] = useState('')
  const [ambienceEnabled, setAmbienceEnabled] = useState(false)
  const [unlockInSeconds, setUnlockInSeconds] = useState(() =>
    Math.max(0, getSecondsUntilRoomUnlock(bookingDate, bookingTime)),
  )
  const embedUrl = useMemo(() => createMeetingEmbedUrl(meetingUrl), [meetingUrl])
  const roomEntryLabel = useMemo(() => formatDateTimeLabel(bookingDate, bookingTime), [bookingDate, bookingTime])
  const roomUnlocked = finished || unlockInSeconds === 0
  const roomStatusLabel = roomUnlocked
    ? finished
      ? 'Rozmowa zakonczona'
      : running
        ? 'Rozmowa aktywna'
        : 'Pokoj aktywny'
    : 'Przedpokoj aktywny'
  const completeUrl = useMemo(
    () =>
      accessToken
        ? `/api/bookings/${bookingId}/complete?access=${encodeURIComponent(accessToken)}`
        : `/api/bookings/${bookingId}/complete`,
    [accessToken, bookingId],
  )

  useEffect(() => {
    if (qaBooking) {
      return
    }

    if (trackedEntryRef.current) {
      return
    }

    trackedEntryRef.current = true
    trackAnalyticsEvent('room_entered', {
      booking_id: bookingId,
      booking_status: bookingStatus,
      room_unlocked: roomUnlocked,
      service_type: serviceType,
    })
  }, [bookingId, bookingStatus, qaBooking, roomUnlocked, serviceType])

  useEffect(() => {
    setSecondsLeft(roomDurationMinutes * 60)
  }, [roomDurationMinutes])

  useEffect(() => {
    if (bookingStatus === 'done') {
      setRunning(false)
      setFinished(true)
      setUnlockInSeconds(0)
      setSecondsLeft(0)
    }
  }, [bookingStatus])

  useEffect(() => {
    if (finished) {
      setUnlockInSeconds(0)
      return
    }

    const refreshUnlockTime = () => {
      setUnlockInSeconds(Math.max(0, getSecondsUntilRoomUnlock(bookingDate, bookingTime)))
    }

    refreshUnlockTime()
    const timer = window.setInterval(refreshUnlockTime, 1000)
    return () => window.clearInterval(timer)
  }, [bookingDate, bookingTime, finished])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (!running || finished) {
          return previous
        }

        if (previous <= 1) {
          window.clearInterval(timer)
          setFinished(true)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finished, running])

  useEffect(() => {
    if (!ambienceEnabled || roomUnlocked) {
      return
    }

    const audioWindow = window as AudioContextWindow
    const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext

    if (!AudioContextConstructor) {
      return
    }

    const context = new AudioContextConstructor()
    const masterGain = context.createGain()
    const lowPad = context.createOscillator()
    const midPad = context.createOscillator()
    const shimmer = context.createOscillator()
    const shimmerGain = context.createGain()
    const pulse = context.createOscillator()
    const pulseGain = context.createGain()

    masterGain.gain.value = 0.016
    lowPad.type = 'sine'
    lowPad.frequency.value = 196
    midPad.type = 'triangle'
    midPad.frequency.value = 293.66
    shimmer.type = 'sine'
    shimmer.frequency.value = 392
    shimmerGain.gain.value = 0.003
    pulse.type = 'sine'
    pulse.frequency.value = 0.08
    pulseGain.gain.value = 0.008

    pulse.connect(pulseGain)
    pulseGain.connect(masterGain.gain)
    lowPad.connect(masterGain)
    midPad.connect(masterGain)
    shimmer.connect(shimmerGain)
    shimmerGain.connect(masterGain)
    masterGain.connect(context.destination)

    lowPad.start()
    midPad.start()
    shimmer.start()
    pulse.start()

    if (context.state === 'suspended') {
      void context.resume().catch(() => {})
    }

    return () => {
      lowPad.stop()
      midPad.stop()
      shimmer.stop()
      pulse.stop()
      void context.close().catch(() => {})
    }
  }, [ambienceEnabled, roomUnlocked])

  async function handleFinish() {
    setError('')

    try {
      const response = await fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendedNextStep:
            'W razie potrzeby kolejnym krokiem moze byc pelna konsultacja, wizyta domowa albo kolejna rozmowa.',
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
      console.error('[behawior15][room] finish failed', finishError)
      setError(finishError instanceof Error ? finishError.message : 'Wystapil blad podczas zamykania konsultacji.')
    }
  }

  return (
    <section className="two-col-section booking-layout">
      <div className="panel room-panel">
        <div className="section-eyebrow">{roomUnlocked ? 'Panel rozmowy audio' : 'Przedpokoj konsultacji'}</div>
        <h1>{roomUnlocked ? `Panel rozmowy: ${serviceTitle}` : 'Pokoj rozmowy otworzy sie 15 minut przed terminem'}</h1>
        <p className="muted paragraph-gap">
          {roomUnlocked
            ? `To jest link do ${serviceSummary.toLowerCase()} Kamera nie jest potrzebna. Przygotuj spokojne miejsce, najwazniejsze obserwacje o zwierzeciu i otworz rozmowe kilka minut przed czasem.`
            : 'Jestes juz we wlasciwym miejscu. Przedpokoj pokazuje pokoj przez szklana warstwe, a pelne wejscie odblokuje sie automatycznie dokladnie 15 minut przed startem konsultacji.'}
        </p>

        <div className={`video-shell room-stage ${roomUnlocked ? 'room-stage-live' : 'room-stage-locked'}`}>
          <div className="room-preview-frame">
            <iframe
              title="Panel rozmowy glosowej"
              src={embedUrl}
              className={`video-frame ${roomUnlocked ? '' : 'video-frame-muted'}`}
              allow="camera; microphone; fullscreen; display-capture"
              tabIndex={roomUnlocked ? 0 : -1}
            />
            {!roomUnlocked ? (
              <div className="room-preview-overlay">
                <div className="waiting-room-badge">{SITE_NAME}</div>
                <div className="waiting-room-copy">
                  <span className="waiting-room-kicker">Przedpokoj konsultacji</span>
                  <strong>Wejscie otworzy sie za {formatCountdown(unlockInSeconds)}</strong>
                  <span>
                    Widzisz wlasciwy pokoj jak przez szybe. Pelny dostep pojawi sie automatycznie 15 minut przed terminem {roomEntryLabel}.
                  </span>
                </div>
                <div className="waiting-room-logos" aria-label="Certyfikacje specjalisty">
                  <div className="waiting-room-logo">
                    <Image src={COAPE_LOGO.src} alt={COAPE_LOGO.alt} width={221} height={52} />
                  </div>
                  <div className="waiting-room-logo">
                    <Image src={CAPBT_LOGO.src} alt={CAPBT_LOGO.alt} width={221} height={52} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="hero-actions top-gap">
          {roomUnlocked ? (
            <>
              <button
                type="button"
                onClick={() => setRunning(true)}
                className="button button-primary big-button"
                disabled={running || finished}
              >
                {running ? 'Rozmowa trwa' : finished ? 'Rozmowa zakonczona' : `Uruchom licznik ${roomDurationMinutes} minut`}
              </button>
              {!finished ? (
                <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="button button-ghost big-button">
                  Otworz rozmowe w nowej karcie
                </a>
              ) : null}
              <button type="button" onClick={handleFinish} className="button button-ghost big-button" disabled={finished}>
                Zakoncz rozmowe
              </button>
            </>
          ) : (
            <>
              <button type="button" className="button button-primary big-button" disabled>
                Pokoj odblokuje sie za {formatCountdown(unlockInSeconds)}
              </button>
              <button
                type="button"
                className="button button-ghost big-button"
                onClick={() => setAmbienceEnabled((current) => !current)}
              >
                {ambienceEnabled ? 'Wycisz dzwiek oczekiwania' : 'Wlacz delikatny dzwiek oczekiwania'}
              </button>
            </>
          )}
        </div>

        {error ? <div className="error-box top-gap">{error}</div> : null}
      </div>

      <div className="panel section-panel room-sidebar">
        <div className="timer-box tree-backed-card">{roomUnlocked ? formatTime(secondsLeft) : formatCountdown(unlockInSeconds)}</div>
        <div className="status-box tree-backed-card">{roomStatusLabel}</div>

        <div className="stack-gap top-gap">
          <div className="list-card tree-backed-card">
            <strong>{roomUnlocked ? 'Termin rozmowy' : 'Aktywacja pokoju'}</strong>
            <span>
              {roomUnlocked
                ? roomEntryLabel
                : `Przedpokoj jest juz gotowy. Wlasciwy pokoj odblokuje sie automatycznie 15 minut przed terminem ${roomEntryLabel}.`}
            </span>
          </div>
          <div className="list-card tree-backed-card">
            <strong>Opiekun</strong>
            <span>{ownerName}</span>
          </div>
          <div className="list-card tree-backed-card">
            <strong>{roomUnlocked ? 'Link do rozmowy' : 'Co przygotowac'}</strong>
            <span>
              {roomUnlocked
                ? meetingUrl
                : `Spokojne miejsce, sluchawki albo glosnik oraz 2-3 najwazniejsze obserwacje o zwierzeciu, zeby ${roomDurationMinutes} minut wykorzystac konkretnie.`}
            </span>
          </div>
          <div className="list-card accent-outline tree-backed-card">
            <strong>{roomUnlocked ? 'Po rozmowie' : 'Co stanie sie dalej'}</strong>
            <span>
              {roomUnlocked
                ? 'Po tej rozmowie mozna zaplanowac pelna konsultacje, wizyte domowa albo terapie, jesli temat wymaga wiecej.'
                : `Gdy wybije okno wejscia, warstwa szkła zniknie, pokoj audio zrobi sie aktywny i bedzie mozna uruchomic licznik ${roomDurationMinutes} minut.`}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
