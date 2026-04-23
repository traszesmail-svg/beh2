import type { FunnelSpecies } from './funnel'
import type { ProblemType } from './types'

export const URGENT_NOW_INTENT = 'kwadrans-na-juz'

export type UrgentNowRequestStatus = 'new' | 'responded'

export type UrgentNowRequestRecord = {
  id: string
  createdAt: string
  updatedAt: string
  status: UrgentNowRequestStatus
  name: string
  email: string
  species: FunnelSpecies
  topicId: ProblemType
  topicLabel: string
  message: string
  requestedDate: string
  requestedTime: string
  respondedAt?: string | null
  proposedDate?: string | null
  proposedTime?: string | null
  responseNote?: string | null
  availabilitySlotId?: string | null
  bookingHref?: string | null
}

export function isUrgentNowIntent(value: string | null | undefined) {
  return value?.trim().toLowerCase() === URGENT_NOW_INTENT
}
