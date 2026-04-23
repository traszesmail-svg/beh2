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
  cookiebotDomainGroupId?: string | null
}

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        statistics?: boolean
      }
    }
  }
}

function readCookiebotStatisticsConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') {
    return 'unset'
  }

  const statisticsConsent = window.Cookiebot?.consent?.statistics

  if (statisticsConsent === true) {
    return 'granted'
  }

  if (statisticsConsent === false) {
    return 'denied'
  }

  return 'unset'
}

export function AnalyticsConsent({ measurementId, cookiebotDomainGroupId }: AnalyticsConsentProps) {
  const [consent, setConsent] = useState<AnalyticsConsentState>('unset')
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const hasCookiebot = Boolean(cookiebotDomainGroupId)

  useEffect(() => {
    if (!measurementId) {
      return
    }

    if (hasCookiebot) {
      const syncCookiebotConsent = () => {
        const nextConsent = readCookiebotStatisticsConsent()

        if (nextConsent === 'granted' || nextConsent === 'denied') {
          persistAnalyticsConsent(nextConsent)
        }

        setConsent(nextConsent)
      }

      syncCookiebotConsent()
      window.addEventListener('CookiebotOnConsentReady', syncCookiebotConsent)
      window.addEventListener('CookiebotOnAccept', syncCookiebotConsent)
      window.addEventListener('CookiebotOnDecline', syncCookiebotConsent)

      return () => {
        window.removeEventListener('CookiebotOnConsentReady', syncCookiebotConsent)
        window.removeEventListener('CookiebotOnAccept', syncCookiebotConsent)
        window.removeEventListener('CookiebotOnDecline', syncCookiebotConsent)
      }
    }

    setConsent(readAnalyticsConsent())
  }, [hasCookiebot, measurementId])

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

  if (!measurementId && !hasCookiebot) {
    return null
  }

  function updateConsent(value: Exclude<AnalyticsConsentState, 'unset'>) {
    persistAnalyticsConsent(value)
    setConsent(value)
  }

  return (
    <>
      {hasCookiebot ? (
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid={cookiebotDomainGroupId}
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
      ) : null}

      {measurementId && consent === 'granted' ? (
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

      {!hasCookiebot && measurementId && consent === 'unset' ? (
        <div className="consent-banner" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-copy">
          <div className="consent-copy">
            <strong id="consent-title">Analityka po wyrazeniu zgody</strong>
            <span id="consent-copy">
              Analityka uruchamia sie dopiero po Twojej decyzji i sluzy wylacznie do pomiaru korzystania z serwisu oraz rezerwacji.
            </span>
          </div>
          <div className="consent-actions">
            <button type="button" className="button button-ghost small-button" onClick={() => updateConsent('denied')}>
              Odrzuc
            </button>
            <button type="button" className="button button-primary small-button" onClick={() => updateConsent('granted')}>
              Akceptuje analityke
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
