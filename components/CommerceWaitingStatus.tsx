'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type StatusPayload = {
  status: string
  accessReady: boolean
  accessCode: string | null
  accessUrl: string | null
  testAdminConfirmUrl: string | null
  error?: string
}

type Props = {
  orderNumber: string
  initialStatus: string
  initialAccessCode: string | null
  initialAccessUrl: string | null
  initialTestAdminConfirmUrl: string | null
}

export function CommerceWaitingStatus({
  orderNumber,
  initialStatus,
  initialAccessCode,
  initialAccessUrl,
  initialTestAdminConfirmUrl,
}: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [accessCode, setAccessCode] = useState(initialAccessCode)
  const [accessUrl, setAccessUrl] = useState(initialAccessUrl)
  const [testAdminConfirmUrl, setTestAdminConfirmUrl] = useState(initialTestAdminConfirmUrl)
  const [error, setError] = useState('')

  useEffect(() => {
    if (accessCode) return

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}/status`, {
          cache: 'no-store',
        })
        const payload = (await response.json()) as StatusPayload
        if (!response.ok) throw new Error(payload.error ?? 'Nie udało się sprawdzić statusu.')
        setStatus(payload.status)
        if (payload.accessReady && payload.accessCode && payload.accessUrl) {
          setAccessCode(payload.accessCode)
          setAccessUrl(payload.accessUrl)
        }
        setTestAdminConfirmUrl(payload.testAdminConfirmUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nie udało się sprawdzić statusu.')
      }
    }, 4000)

    return () => window.clearInterval(timer)
  }, [accessCode, orderNumber])

  if (accessCode && accessUrl) {
    return (
      <div className="list-card accent-outline tree-backed-card top-gap">
        <strong>Dostęp jest aktywny</strong>
        <span>Twój kod dostępu: <code>{accessCode}</code></span>
        <Link href={accessUrl} className="button button-primary big-button">
          Przejdź do dostępu
        </Link>
      </div>
    )
  }

  return (
    <div className="list-card tree-backed-card top-gap">
      <strong>Zgłoszenie płatności zostało wysłane.</strong>
      <span>
        Aktualny status: <code>{status}</code>. Nie musisz odświeżać strony, status sprawdzi się automatycznie.
      </span>
      {testAdminConfirmUrl ? (
        <div className="list-card accent-outline tree-backed-card">
          <strong>Tryb testowy</strong>
          <span>Ten link symuluje kliknięcie przycisku „Potwierdzam płatność” z maila administratora.</span>
          <a href={testAdminConfirmUrl} className="button button-ghost" target="_blank" rel="noreferrer">
            Potwierdź płatność testowo
          </a>
        </div>
      ) : null}
      {error ? <span className="form-error">{error}</span> : null}
    </div>
  )
}
