export type ProblemType =
  | 'szczeniak'
  | 'kot'
  | 'separacja'
  | 'agresja'
  | 'niszczenie'
  | 'dogoterapia'
  | 'inne'

export type AnimalType = 'Pies' | 'Kot'

export type BookingStatus = 'pending' | 'pending_manual_payment' | 'confirmed' | 'done' | 'cancelled' | 'expired'

export type PaymentStatus = 'unpaid' | 'pending_manual_review' | 'paid' | 'failed' | 'rejected' | 'refunded'

export type PaymentMethod = 'manual' | 'payu' | 'stripe' | 'mock'

export interface ProblemOption {
  id: ProblemType
  icon: string
  title: string
  desc: string
}

export interface AvailabilitySeed {
  date: string
  times: string[]
}

export interface AvailabilitySlot {
  id: string
  bookingDate: string
  bookingTime: string
  isBooked: boolean
  lockedByBookingId?: string | null
  lockedUntil?: string | null
  createdAt: string
  updatedAt: string
}

export interface BookingFormData {
  ownerName: string
  problemType: ProblemType
  animalType: AnimalType
  petAge: string
  durationNotes: string
  description: string
  phone: string
  email: string
  slotId: string
}

export interface UserRecord {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface BookingRecord {
  id: string
  userId?: string | null
  customerAccessTokenHash?: string | null
  ownerName: string
  problemType: ProblemType
  animalType: AnimalType
  petAge: string
  durationNotes: string
  description: string
  phone: string
  email: string
  bookingDate: string
  bookingTime: string
  slotId: string
  amount: number
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod | null
  paymentReference?: string | null
  meetingUrl: string
  createdAt: string
  updatedAt: string
  paidAt?: string | null
  paymentReportedAt?: string | null
  paymentRejectedAt?: string | null
  paymentRejectedReason?: string | null
  cancelledAt?: string | null
  expiredAt?: string | null
  refundedAt?: string | null
  checkoutSessionId?: string | null
  paymentIntentId?: string | null
  payuOrderId?: string | null
  payuOrderStatus?: string | null
  recommendedNextStep?: string | null
  reminderSent?: boolean
  prepVideoPath?: string | null
  prepVideoFilename?: string | null
  prepVideoSizeBytes?: number | null
  prepLinkUrl?: string | null
  prepNotes?: string | null
  prepUploadedAt?: string | null
}

export interface BookingCreateResult {
  booking: BookingRecord
  slot: AvailabilitySlot
  accessToken: string
}

export interface BookingPreparationPatch {
  prepVideoPath?: string | null
  prepVideoFilename?: string | null
  prepVideoSizeBytes?: number | null
  prepLinkUrl?: string | null
  prepNotes?: string | null
  prepUploadedAt?: string | null
}

export interface GroupedAvailability {
  date: string
  label: string
  slots: AvailabilitySlot[]
}
