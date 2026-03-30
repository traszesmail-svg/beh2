import { getBookingById, getBookingForViewer, markBookingManualPaymentPending, markBookingManualPaymentRejected, markBookingPaid } from '@/lib/server/db'
import { buildManualPaymentReviewUrl } from '@/lib/server/manual-payment-review'
import { sendManualPaymentReportedAdminEmail } from '@/lib/server/notifications'
import { getManualPaymentConfig, getManualPaymentReference } from '@/lib/server/payment-options'

export async function reportManualPayment(
  bookingId: string,
  accessToken?: string | null,
  authorizationHeader?: string | null,
) {
  const booking = await getBookingForViewer(bookingId, accessToken, authorizationHeader)

  if (!booking) {
    throw new Error('Nie znaleziono rezerwacji albo link wygasł.')
  }

  const manualPayment = getManualPaymentConfig()

  if (!manualPayment.isAvailable) {
    throw new Error(manualPayment.summary)
  }

  const updatedBooking = await markBookingManualPaymentPending(booking.id, {
    paymentReference: booking.paymentReference ?? getManualPaymentReference(booking.id),
  })

  if (!updatedBooking) {
    throw new Error('Nie udało się zapisać zgłoszenia wpłaty.')
  }

  const adminNotification = await sendManualPaymentReportedAdminEmail(updatedBooking, {
    approveUrl: buildManualPaymentReviewUrl(updatedBooking.id, 'approve', updatedBooking.paymentReportedAt),
    rejectUrl: buildManualPaymentReviewUrl(updatedBooking.id, 'reject', updatedBooking.paymentReportedAt),
  })

  if (adminNotification.status !== 'sent') {
    console.warn('[behawior15][manual-payment] admin notification not sent', {
      bookingId: updatedBooking.id,
      status: adminNotification.status,
      reason: adminNotification.reason ?? null,
    })
  }

  return {
    booking: updatedBooking,
    adminNotification,
  }
}

export async function approveManualPayment(bookingId: string) {
  const booking = await getBookingById(bookingId)

  if (!booking) {
    throw new Error('Nie znaleziono rezerwacji do potwierdzenia.')
  }

  if (booking.paymentStatus === 'paid') {
    return booking
  }

  const updatedBooking = await markBookingPaid(booking.id, {
    paymentMethod: 'manual',
    paymentReference: booking.paymentReference ?? getManualPaymentReference(booking.id),
    triggerPaymentConfirmationSms: true,
  })

  if (!updatedBooking) {
    throw new Error('Nie udało się potwierdzić płatności.')
  }
  return updatedBooking
}

export async function rejectManualPayment(bookingId: string, reason?: string) {
  const booking = await markBookingManualPaymentRejected(bookingId, reason)

  if (!booking) {
    throw new Error('Nie znaleziono rezerwacji do odrzucenia.')
  }

  return booking
}
