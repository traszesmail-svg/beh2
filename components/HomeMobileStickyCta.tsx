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
        href="/book"
        className="button button-primary"
        data-home-sticky-cta="start"
        data-analytics-event="cta_click"
        data-analytics-location="home-sticky-book"
      >
        Umów 15 min
      </a>
    </div>
  )
}
