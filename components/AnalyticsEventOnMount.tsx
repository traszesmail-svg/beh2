'use client'

import { useEffect, useRef } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'

type AnalyticsEventOnMountProps = {
  eventName: string
  params?: Record<string, string | number | boolean | null | undefined>
}

export function AnalyticsEventOnMount({
  eventName,
  params = {},
}: AnalyticsEventOnMountProps) {
  const trackedRef = useRef(false)

  useEffect(() => {
    if (trackedRef.current) {
      return
    }

    trackedRef.current = true
    trackAnalyticsEvent(eventName, params)
  }, [eventName, params])

  return null
}
