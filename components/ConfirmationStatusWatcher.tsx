'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface ConfirmationStatusWatcherProps {
  active: boolean
  intervalMs?: number
}

export function ConfirmationStatusWatcher({
  active,
  intervalMs = 7000,
}: ConfirmationStatusWatcherProps) {
  const router = useRouter()
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.ceil(intervalMs / 1000))
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!active) {
      return
    }

    setSecondsUntilRefresh(Math.ceil(intervalMs / 1000))
    const refreshTimer = window.setInterval(() => {
      startTransition(() => {
        router.refresh()
      })
    }, intervalMs)

    const countdownTimer = window.setInterval(() => {
      setSecondsUntilRefresh((current) => (current <= 1 ? Math.ceil(intervalMs / 1000) : current - 1))
    }, 1000)

    return () => {
      window.clearInterval(refreshTimer)
      window.clearInterval(countdownTimer)
    }
  }, [active, intervalMs, router, startTransition])

  if (!active) {
    return null
  }

  return (
    <div className="list-card accent-outline top-gap tree-backed-card">
      <strong>Sprawdzamy status automatycznie</strong>
      <span>
        Ta strona odświeża się sama co kilka sekund. Po potwierdzeniu wpłaty od razu pokaże pokój rozmowy i kolejny krok.
      </span>
      <span>{isPending ? 'Aktualizuję status...' : `Kolejne sprawdzenie za ok. ${secondsUntilRefresh} s.`}</span>
    </div>
  )
}
