'use client'

import { useState } from 'react'

type ShareActionsProps = {
  url: string
  text: string
  label?: string
}

export function ShareActions({ url, text, label = 'Udostępnij znajomemu, który ma problem z pupilem' }: ShareActionsProps) {
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle')

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('done')
    } catch {
      setCopyState('error')
    }

    window.setTimeout(() => setCopyState('idle'), 2200)
  }

  return (
    <div className="share-actions" aria-label="Udostępnianie strony">
      <span className="share-label">{label}</span>
      <div className="share-links">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="share-chip">
          WhatsApp
        </a>
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" className="share-chip">
          Facebook
        </a>
        <button type="button" className="share-chip" onClick={handleCopyLink}>
          {copyState === 'done' ? 'Skopiowano link' : copyState === 'error' ? 'Nie udało się skopiować' : 'Kopiuj link'}
        </button>
      </div>
    </div>
  )
}
