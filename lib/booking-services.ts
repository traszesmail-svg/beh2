import { formatPricePln } from './pricing'
import type { AvailabilitySlot, GroupedAvailability } from './types'

export type BookingServiceType =
  | 'szybka-konsultacja-15-min'
  | 'konsultacja-30-min'
  | 'konsultacja-behawioralna-online'

type BookingServiceConfig = {
  id: BookingServiceType
  title: string
  shortTitle: string
  slotSpan: number
  roomDurationMinutes: number
  slotSummary: string
  slotBadge: string
  roomSummary: string
}

const BOOKING_SERVICE_CONFIG: Record<BookingServiceType, BookingServiceConfig> = {
  'szybka-konsultacja-15-min': {
    id: 'szybka-konsultacja-15-min',
    title: 'Szybka konsultacja 15 min',
    shortTitle: '15 min',
    slotSpan: 1,
    roomDurationMinutes: 15,
    slotSummary: '15 min, rozmowa głosowa online.',
    slotBadge: '15 min online',
    roomSummary: '15-minutowa konsultacja głosowa online.',
  },
  'konsultacja-30-min': {
    id: 'konsultacja-30-min',
    title: 'Konsultacja 30 min',
    shortTitle: '30 min',
    slotSpan: 2,
    roomDurationMinutes: 30,
    slotSummary: '30 min, rozmowa głosowa online.',
    slotBadge: '30 min online',
    roomSummary: '30-minutowa konsultacja głosowa online.',
  },
  'konsultacja-behawioralna-online': {
    id: 'konsultacja-behawioralna-online',
    title: 'Konsultacja behawioralna online',
    shortTitle: 'Online',
    slotSpan: 4,
    roomDurationMinutes: 60,
    slotSummary: '60 min, konsultacja online.',
    slotBadge: '60 min online',
    roomSummary: '60-minutowa konsultacja online.',
  },
}

export const DEFAULT_BOOKING_SERVICE: BookingServiceType = 'szybka-konsultacja-15-min'
export const BOOKING_SERVICE_30_PRICE = 119
export const BOOKING_SERVICE_ONLINE_PRICE = 350

export function isBookingServiceType(value: string | null | undefined): value is BookingServiceType {
  return value === 'szybka-konsultacja-15-min' || value === 'konsultacja-30-min' || value === 'konsultacja-behawioralna-online'
}

export function normalizeBookingServiceType(value: string | null | undefined): BookingServiceType {
  return isBookingServiceType(value) ? value : DEFAULT_BOOKING_SERVICE
}

export function getBookingServiceConfig(serviceType: BookingServiceType) {
  return BOOKING_SERVICE_CONFIG[serviceType]
}

export function getBookingServiceTitle(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).title
}

export function getBookingServiceDurationLabel(serviceType: BookingServiceType) {
  return `${getBookingServiceRoomDurationMinutes(serviceType)} min`
}

export function getBookingServiceSlotSummary(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).slotSummary
}

export function getBookingServiceSlotBadge(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).slotBadge
}

export function getBookingServiceRoomSummary(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).roomSummary
}

export function getBookingServicePrice(serviceType: BookingServiceType, quickConsultationPrice: number) {
  if (serviceType === 'konsultacja-30-min') {
    return BOOKING_SERVICE_30_PRICE
  }

  if (serviceType === 'konsultacja-behawioralna-online') {
    return BOOKING_SERVICE_ONLINE_PRICE
  }

  return quickConsultationPrice
}

export function getBookingServicePriceLabel(serviceType: BookingServiceType, quickConsultationPrice: number) {
  return formatPricePln(getBookingServicePrice(serviceType, quickConsultationPrice))
}

export function inferBookingServiceTypeFromAmount(amount: number): BookingServiceType {
  if (Math.round(amount * 100) / 100 === BOOKING_SERVICE_30_PRICE) {
    return 'konsultacja-30-min'
  }

  if (Math.round(amount * 100) / 100 === BOOKING_SERVICE_ONLINE_PRICE) {
    return 'konsultacja-behawioralna-online'
  }

  return DEFAULT_BOOKING_SERVICE
}

export function resolveBookingServiceType(serviceType: string | null | undefined, amount?: number | null) {
  if (isBookingServiceType(serviceType)) {
    return serviceType
  }

  if (typeof amount === 'number' && Number.isFinite(amount)) {
    return inferBookingServiceTypeFromAmount(amount)
  }

  return DEFAULT_BOOKING_SERVICE
}

export function getBookingServiceSlotSpan(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).slotSpan
}

export function getBookingServiceRoomDurationMinutes(serviceType: BookingServiceType) {
  return getBookingServiceConfig(serviceType).roomDurationMinutes
}

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function areSlotsConsecutive(left: AvailabilitySlot, right: AvailabilitySlot) {
  return left.bookingDate === right.bookingDate && parseTimeToMinutes(right.bookingTime) - parseTimeToMinutes(left.bookingTime) === 20
}

export function getServiceAvailabilityWindow(
  slots: AvailabilitySlot[],
  startSlotId: string,
  serviceType: BookingServiceType,
): AvailabilitySlot[] | null {
  const slotSpan = getBookingServiceSlotSpan(serviceType)
  const sortedSlots = [...slots].sort((left, right) =>
    `${left.bookingDate}T${left.bookingTime}`.localeCompare(`${right.bookingDate}T${right.bookingTime}`),
  )
  const startIndex = sortedSlots.findIndex((slot) => slot.id === startSlotId)

  if (startIndex === -1) {
    return null
  }

  const window = sortedSlots.slice(startIndex, startIndex + slotSpan)

  if (window.length !== slotSpan) {
    return null
  }

  for (let index = 1; index < window.length; index += 1) {
    if (!areSlotsConsecutive(window[index - 1], window[index])) {
      return null
    }
  }

  return window
}

export function getBookableServiceAvailabilityWindow(
  slots: AvailabilitySlot[],
  startSlotId: string,
  serviceType: BookingServiceType,
): AvailabilitySlot[] | null {
  const window = getServiceAvailabilityWindow(slots, startSlotId, serviceType)

  if (!window) {
    return null
  }

  return window.every((slot) => !slot.isBooked && !slot.lockedByBookingId) ? window : null
}

export function filterGroupedAvailabilityForService(
  groups: GroupedAvailability[],
  serviceType: BookingServiceType,
): GroupedAvailability[] {
  const slotSpan = getBookingServiceSlotSpan(serviceType)

  if (slotSpan === 1) {
    return groups
  }

  return groups
    .map((group) => {
      const eligibleSlots = group.slots.filter((slot) => getServiceAvailabilityWindow(group.slots, slot.id, serviceType))
      return {
        ...group,
        slots: eligibleSlots,
      }
    })
    .filter((group) => group.slots.length > 0)
}
