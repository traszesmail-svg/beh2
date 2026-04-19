'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  AnalyticsConsentState,
  persistAnalyticsConsent,
  readAnalyticsConsent,
  trackAnalyticsEvent,
} from '@/lib/analytics'

type AnalyticsConsentProps = {
  measurementId?: string | null
}

export function AnalyticsConsent({ measurementId }: AnalyticsConsentProps) {
  const [consent, setConsent] = useState<AnalyticsConsentState>('unset')
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) {
      return
    }

    setConsent(readAnalyticsConsent())
  }, [measurementId])

  useEffect(() => {
    if (!measurementId) {
      return
    }

    function handleTrackedClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-analytics-event]')

      if (!target) {
        return
      }

      if (target.closest('[data-analytics-disabled="true"]')) {
        return
      }

      const eventName = target.dataset.analyticsEvent
      if (!eventName) {
        return
      }

      trackAnalyticsEvent(eventName, {
        location: target.dataset.analyticsLocation,
        source_page: target.dataset.analyticsSourcePage ?? pathname,
        problem_key: target.dataset.analyticsProblem,
        species: target.dataset.analyticsSpecies,
        service_key: target.dataset.analyticsService,
        service_name: target.dataset.analyticsServiceName,
        service_duration: target.dataset.analyticsServiceDuration,
        service_price: target.dataset.analyticsServicePrice,
        cta_label: target.dataset.analyticsCtaLabel,
        slot_date: target.dataset.analyticsSlotDate,
        slot_time: target.dataset.analyticsSlotTime,
      })
    }

    document.addEventListener('click', handleTrackedClick)
    return () => document.removeEventListener('click', handleTrackedClick)
  }, [measurementId, pathname])

  useEffect(() => {
    if (!measurementId || consent !== 'granted') {
      return
    }

    const query = searchParams?.toString()

    trackAnalyticsEvent('view_page', {
      source_page: pathname,
      page_path: query ? `${pathname}?${query}` : pathname,
    })
  }, [consent, measurementId, pathname, searchParams])

  if (!measurementId) {
    return null
  }

  function updateConsent(value: Exclude<AnalyticsConsentState, 'unset'>) {
    persistAnalyticsConsent(value)
    setConsent(value)
  }

  return (
    <>
      {consent === 'granted' ? (
        <>
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === 'unset' ? (
        <div className="consent-banner" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-copy">
          <div className="consent-copy">
            <strong id="consent-title">Analityka po wyrażeniu zgody</strong>
            <span id="consent-copy">
              Analityka uruchamia się dopiero po Twojej decyzji i służy wyłącznie do pomiaru korzystania z serwisu oraz rezerwacji.
            </span>
          </div>
          <div className="consent-actions">
            <button type="button" className="button button-ghost small-button" onClick={() => updateConsent('denied')}>
              Odrzuć
            </button>
            <button type="button" className="button button-primary small-button" onClick={() => updateConsent('granted')}>
              Akceptuję analitykę
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
