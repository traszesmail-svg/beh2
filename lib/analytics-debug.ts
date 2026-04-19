export type DebugAnalyticsEvent = {
  eventType: string
  pagePath: string | null
  properties: Record<string, string | number | boolean | null>
  createdAt: string
}

declare global {
  interface Window {
    __behawiorAnalyticsEvents?: DebugAnalyticsEvent[]
  }
}

export function pushDebugAnalyticsEvent(event: DebugAnalyticsEvent) {
  if (typeof window === 'undefined') {
    return
  }

  const events = window.__behawiorAnalyticsEvents ?? []
  events.push(event)
  window.__behawiorAnalyticsEvents = events.slice(-50)
}
