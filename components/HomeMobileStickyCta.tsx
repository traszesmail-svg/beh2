'use client'

import { useEffect, useState } from 'react'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'

export function HomeMobileStickyCta() {
  const [isVisible, setIsVisible] = useState(false)
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const quickService = getServiceAnalyticsParams('szybka-konsultacja-15-min')

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
        href={audioHref}
        className="button button-primary"
        data-home-sticky-cta="start"
        data-analytics-event="funnel_entry_15_min"
        data-analytics-location="home-sticky-audio"
        data-analytics-cta-label={FUNNEL_CTA_LABELS.primary}
        data-analytics-service="szybka-konsultacja-15-min"
        data-analytics-service-name={String(quickService.service_name)}
        data-analytics-service-duration={String(quickService.service_duration)}
        data-analytics-service-price={String(quickService.service_price)}
      >
        {FUNNEL_CTA_LABELS.primary}
      </a>
    </div>
  )
}
