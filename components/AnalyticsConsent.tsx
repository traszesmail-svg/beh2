'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
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
        problem: target.dataset.analyticsProblem,
        slot_time: target.dataset.analyticsSlot,
      })
    }

    document.addEventListener('click', handleTrackedClick)
    return () => document.removeEventListener('click', handleTrackedClick)
  }, [measurementId])

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
            <strong id="consent-title">Analityka po Twojej zgodzie</strong>
            <span id="consent-copy">
              Używamy lekkiej analityki, żeby sprawdzać, czy landing i rezerwacja są czytelne. Nic nie uruchamia się przed Twoją decyzją.
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
