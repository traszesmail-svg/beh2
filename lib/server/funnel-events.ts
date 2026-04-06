import { randomUUID } from 'node:crypto'
import type { FunnelEventInput, FunnelEventProperties, FunnelEventRecord, FunnelEventType } from '@/lib/types'

const FUNNEL_EVENT_TYPES = new Set<FunnelEventType>([
  'home_view',
  'cta_click',
  'topic_selected',
  'slot_selected',
  'form_started',
  'payment_opened',
  'manual_pending',
  'paid',
  'confirmed',
  'reject_cancel',
  'payment_started',
  'payment_success',
  'payment_failed',
  'faq_open',
  'opinion_add',
  'room_entered',
])

export type FunnelEventQueryWindow = '24h' | '7d' | 'all'

export function isFunnelEventType(value: string): value is FunnelEventType {
  return FUNNEL_EVENT_TYPES.has(value as FunnelEventType)
}

export function getFunnelEventTypes(): FunnelEventType[] {
  return Array.from(FUNNEL_EVENT_TYPES)
}

export function normalizeFunnelEventProperties(
  properties: Record<string, unknown> | null | undefined,
): FunnelEventProperties {
  if (!properties) {
    return {}
  }

  const normalized: FunnelEventProperties = {}

  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === 'string') {
      if (value.trim().length > 0) {
        normalized[key] = value.trim()
      }
      continue
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      normalized[key] = value
      continue
    }

    if (value === null) {
      normalized[key] = null
    }
  }

  return normalized
}

export function createFunnelEventRecord(input: FunnelEventInput): FunnelEventRecord {
  return {
    id: randomUUID(),
    eventType: input.eventType,
    bookingId: input.bookingId ?? null,
    qaBooking: Boolean(input.qaBooking),
    source: input.source ?? 'client',
    pagePath: input.pagePath ?? null,
    location: input.location ?? null,
    properties: input.properties ?? {},
    createdAt: input.createdAt ?? new Date().toISOString(),
  }
}

export function isInternalAnalyticsPagePath(pagePath: string | null | undefined): boolean {
  if (!pagePath) {
    return false
  }

  return (
    pagePath.startsWith('/admin') ||
    pagePath.startsWith('/_internal') ||
    pagePath.startsWith('/__internal') ||
    pagePath.startsWith('/qa-share') ||
    pagePath.startsWith('/api/')
  )
}
