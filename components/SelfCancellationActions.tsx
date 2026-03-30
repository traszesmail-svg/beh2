'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface SelfCancellationActionsProps {
  bookingId: string
  accessToken: string
  initialRemainingSeconds: number
  contactHref?: string
}

function formatRemainingWindow(remainingSeconds: number) {
  if (remainingSeconds >= 3600) {
    const hours = Math.floor(remainingSeconds / 3600)
    const minutes = Math.ceil((remainingSeconds % 3600) / 60)

    if (minutes <= 0) {
      return `${hours} godz.`
    }

    return `${hours} godz. ${minutes} min`
  }

  if (remainingSeconds >= 60) {
    return `${Math.ceil(remainingSeconds / 60)} min`
  }

  return `${remainingSeconds} s`
}

export function SelfCancellationActions({
  bookingId,
  accessToken,
  initialRemainingSeconds,
  contactHref = '/kontakt?service=szybka-konsultacja-15-min&intent=reschedule',
}: SelfCancellationActionsProps) {
  const router = useRouter()
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemainingSeconds)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (remainingSeconds <= 0 || isPending) {
      return
    }

    const timer = window.setTimeout(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [remainingSeconds, isPending])

  async function handleCancel() {
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel?access=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
      })

      const payload = (await response.json()) as { error?: string; ok?: boolean }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Nie udało się anulować rezerwacji.')
      }

      setMessage('Anulacja została przyjęta. Odświeżam potwierdzenie.')
      startTransition(() => {
        router.refresh()
      })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Nie udało się anulować rezerwacji.')
    }
  }

  if (remainingSeconds <= 0) {
    return null
  }

  return (
    <div className="list-card accent-outline top-gap">
      <strong>Masz jeszcze około {formatRemainingWindow(remainingSeconds)} na bezpłatną rezygnację</strong>
      <span>
        Jeśli klikniesz teraz, termin wróci do kalendarza, a płatność zostanie cofnięta zgodnie z aktywnym trybem płatności.
        Jeśli chcesz zamiast tego zmienić termin, napisz do mnie w tym samym 24-godzinnym oknie.
      </span>
      {error ? <div className="error-box top-gap-small">{error}</div> : null}
      {message ? <div className="info-box top-gap-small">{message}</div> : null}
      <div className="hero-actions top-gap-small">
        <button type="button" className="button button-ghost big-button" onClick={handleCancel} disabled={isPending}>
          {isPending ? 'Anuluję rezerwację...' : 'Anuluj rezerwację w 24h'}
        </button>
        <Link href={contactHref} className="button button-ghost big-button">
          Napisz w sprawie zmiany terminu
        </Link>
      </div>
    </div>
  )
}
