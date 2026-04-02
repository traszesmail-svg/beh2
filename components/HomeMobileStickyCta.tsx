'use client'

import { useEffect, useState } from 'react'

export function HomeMobileStickyCta() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 280)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className={`mobile-sticky-cta home-mobile-sticky-cta${isVisible ? ' is-visible' : ''}`}>
      <a
        href="#pierwszy-krok"
        className="button button-primary"
        data-home-sticky-cta="match"
        data-analytics-event="cta_click"
        data-analytics-location="home-sticky-match"
      >
        Dobierz pierwszy krok
      </a>
    </div>
  )
}
