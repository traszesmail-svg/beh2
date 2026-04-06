'use client'

import { useEffect, useMemo, useState } from 'react'
import { HardNavLink } from '@/components/HardNavLink'

interface ConfirmationStatusWatcherProps {
  active: boolean
  bookingId: string
  accessToken?: string | null
  currentState: string
  intervalMs?: number
}

export function ConfirmationStatusWatcher({
  active,
  bookingId,
  accessToken,
  currentState,
  intervalMs = 7000,
}: ConfirmationStatusWatcherProps) {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.ceil(intervalMs / 1000))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pollFailureCount, setPollFailureCount] = useState(0)
  const [pollWarning, setPollWarning] = useState<string | null>(null)
  const statusUrl = useMemo(() => {
    const searchParams = new URLSearchParams()

    if (accessToken) {
      searchParams.set('access', accessToken)
    }

    const query = searchParams.toString()
    return `/api/bookings/${bookingId}/status${query ? `?${query}` : ''}`
  }, [accessToken, bookingId])

  useEffect(() => {
    if (!active) {
      return
    }

    let cancelled = false
    let lastKnownState = currentState

    setSecondsUntilRefresh(Math.ceil(intervalMs / 1000))
    const refreshTimer = window.setInterval(() => {
      void fetch(statusUrl, { cache: 'no-store' })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Status request failed with ${response.status}.`)
          }

          return (await response.json()) as {
            bookingStatus: string
            paymentStatus: string
          }
        })
        .then((payload) => {
          if (cancelled) {
            return
          }

          setPollFailureCount(0)
          setPollWarning(null)

          const nextState = `${payload.bookingStatus}:${payload.paymentStatus}`

          if (nextState !== lastKnownState) {
            lastKnownState = nextState
            setIsRefreshing(true)
            window.location.reload()
          }
        })
      .catch((error) => {
        if (cancelled) {
          return
        }

        console.warn('[behawior15][confirmation-status] polling failed', error)
        setPollFailureCount((current) => {
          const next = current + 1

          if (next >= 2) {
            setPollWarning(
              'Automatyczne sprawdzanie statusu ma chwilowy problem. Możesz odświeżyć stronę ręcznie albo wrócić tu za chwilę. Rezerwacja nadal jest zapisana.',
            )
          }

          return next
        })
      })
    }, intervalMs)

    const countdownTimer = window.setInterval(() => {
      setSecondsUntilRefresh((current) => (current <= 1 ? Math.ceil(intervalMs / 1000) : current - 1))
    }, 1000)

    return () => {
      cancelled = true
      window.clearInterval(refreshTimer)
      window.clearInterval(countdownTimer)
    }
  }, [active, currentState, intervalMs, statusUrl])

  if (!active) {
    return null
  }

  return (
    <div className="top-gap stack-gap">
      <div className="list-card accent-outline tree-backed-card">
        <strong>Sprawdzamy status automatycznie</strong>
        <span>Ta strona odswieza sie sama co kilka sekund. Po potwierdzeniu wplaty od razu pokaze pokoj rozmowy i kolejny krok.</span>
        <span>{isRefreshing ? 'Aktualizuje status...' : `Kolejne sprawdzenie za ok. ${secondsUntilRefresh} s.`}</span>
      </div>

      {pollWarning ? (
        <div className="error-box tree-backed-card">
          <strong>Nie przegapisz zmiany statusu</strong>
          <span>
            {pollWarning} Zanotowano {pollFailureCount} nieudane sprawdzenia z rzedu.
          </span>
          <div className="hero-actions top-gap">
            <button type="button" className="button button-ghost" onClick={() => window.location.reload()}>
              Odswiez teraz
            </button>
            <HardNavLink href="/kontakt" className="button button-primary">
              Napisz wiadomość
            </HardNavLink>
          </div>
        </div>
      ) : null}
    </div>
  )
}
