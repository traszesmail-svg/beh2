import { getAdminAccessSecret, hasValidAdminAuthorization } from '@/lib/admin-auth'
import * as localStore from '@/lib/server/local-store'
import { reportRuntimeModeUsage, resolveDataMode } from '@/lib/server/env'
import * as supabaseStore from '@/lib/server/supabase-store'

type StoreProvider = typeof localStore

function getProvider(): StoreProvider {
  reportRuntimeModeUsage()

  return resolveDataMode('booking, availability i admin data layer') === 'supabase'
    ? supabaseStore
    : localStore
}

export async function listAvailability() {
  return getProvider().listAvailability()
}

export async function getActiveConsultationPrice() {
  return getProvider().getActiveConsultationPrice()
}

export async function updateActiveConsultationPrice(amount: number) {
  return getProvider().updateActiveConsultationPrice(amount)
}

export async function listAvailabilityAdmin() {
  return getProvider().listAvailabilityAdmin()
}

export async function getAvailabilitySlot(slotId: string) {
  return getProvider().getAvailabilitySlot(slotId)
}

export async function createAvailabilitySlot(bookingDate: string, bookingTime: string) {
  return getProvider().createAvailabilitySlot(bookingDate, bookingTime)
}

export async function deleteAvailabilitySlot(slotId: string) {
  return getProvider().deleteAvailabilitySlot(slotId)
}

export async function createPendingBooking(form: Parameters<StoreProvider['createPendingBooking']>[0]) {
  return getProvider().createPendingBooking(form)
}

export async function getBookingById(id: string) {
  return getProvider().getBookingById(id)
}

export async function getBookingByCustomerAccess(id: string, accessToken: string) {
  return getProvider().getBookingByCustomerAccess(id, accessToken)
}

export async function getBookingForViewer(
  id: string,
  accessToken?: string | null,
  authorizationHeader?: string | null,
) {
  const adminSecret = getAdminAccessSecret()

  if (adminSecret && hasValidAdminAuthorization(authorizationHeader ?? null, adminSecret)) {
    return getBookingById(id)
  }

  const booking = await getBookingById(id)

  if (!booking) {
    return null
  }

  if (!booking.customerAccessTokenHash) {
    return booking
  }

  if (!accessToken) {
    return null
  }

  return getBookingByCustomerAccess(id, accessToken)
}

export async function listBookings() {
  return getProvider().listBookings()
}

export async function updateBookingPreparation(
  bookingId: string,
  patch: Parameters<StoreProvider['updateBookingPreparation']>[1],
) {
  return getProvider().updateBookingPreparation(bookingId, patch)
}

export async function attachCheckoutSession(bookingId: string, checkoutSessionId: string) {
  return getProvider().attachCheckoutSession(bookingId, checkoutSessionId)
}

export async function attachPayuOrder(
  bookingId: string,
  paymentData: Parameters<StoreProvider['attachPayuOrder']>[1],
) {
  return getProvider().attachPayuOrder(bookingId, paymentData)
}

export async function markBookingManualPaymentPending(
  bookingId: string,
  paymentData?: Parameters<StoreProvider['markBookingManualPaymentPending']>[1],
) {
  return getProvider().markBookingManualPaymentPending(bookingId, paymentData)
}

export async function markBookingPaid(
  bookingId: string,
  paymentData?: Parameters<StoreProvider['markBookingPaid']>[1],
) {
  return getProvider().markBookingPaid(bookingId, paymentData)
}

export async function markBookingPaymentFailed(bookingId: string) {
  return getProvider().markBookingPaymentFailed(bookingId)
}

export async function markBookingManualPaymentRejected(bookingId: string, reason?: string) {
  return getProvider().markBookingManualPaymentRejected(bookingId, reason)
}

export async function markBookingRefunded(bookingId: string) {
  return getProvider().markBookingRefunded(bookingId)
}

export async function markBookingExpired(bookingId: string) {
  return getProvider().markBookingExpired(bookingId)
}

export async function markBookingDone(bookingId: string, recommendedNextStep?: string) {
  return getProvider().markBookingDone(bookingId, recommendedNextStep)
}

export async function markBookingReminderSent(bookingId: string) {
  return getProvider().markBookingReminderSent(bookingId)
}
