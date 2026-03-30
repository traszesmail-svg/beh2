import { rm } from 'fs/promises'
import path from 'path'
import { isFutureAvailabilitySlot } from '../lib/data'
import { createLocalDataSandbox } from './lib/local-data-sandbox'
import {
  attachPayuOrder,
  createAvailabilitySlot,
  createPendingBooking,
  deleteAvailabilitySlot,
  getBookingById,
  listAvailability,
  listAvailabilityAdmin,
  markBookingDone,
  markBookingManualPaymentPending,
  markBookingManualPaymentRejected,
  markBookingPaid,
} from '../lib/server/local-store'
import { getManualPaymentReference } from '../lib/server/payment-options'

const rootDir = process.cwd()
const trackedFiles = ['availability.json', 'bookings.json', 'users.json', 'pricing-settings.json']

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  process.env.RESEND_API_KEY = ''
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_BANK_ACCOUNT = '11112222333344445555666677'
  process.env.SMS_PROVIDER = 'disabled'
  const sandbox = await createLocalDataSandbox('verify-flow', rootDir)
  const { dataDir } = sandbox

  try {
    await Promise.all(trackedFiles.map((fileName) => rm(path.join(dataDir, fileName), { force: true })))

    const initialAvailability = await listAvailability()
    const [manualSuccessSlot, manualRejectedSlot, payuSlot] = initialAvailability.flatMap((group) => group.slots).slice(0, 3)
    const allInitialSlots = initialAvailability.flatMap((group) => group.slots)

    assert(manualSuccessSlot, 'Brak pierwszego slotu testowego.')
    assert(manualRejectedSlot, 'Brak drugiego slotu testowego.')
    assert(payuSlot, 'Brak trzeciego slotu testowego.')
    assert(
      allInitialSlots.every((slot) => isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)),
      'W local mode nie powinny pojawiac sie terminy z przeszlosci.',
    )

    const manualBooking = await createPendingBooking({
      ownerName: 'Manual Success',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '8 miesiecy',
      durationNotes: '2 tygodnie',
      description: 'Testowe zachowanie do weryfikacji recznej platnosci.',
      phone: '500000000',
      email: 'manual-success@example.com',
      slotId: manualSuccessSlot.id,
    })

    assert(manualBooking.booking.bookingStatus === 'pending', 'Booking nie zaczyna od statusu pending.')
    assert(manualBooking.booking.paymentStatus === 'unpaid', 'Booking nie zaczyna od payment status unpaid.')

    const manualPending = await markBookingManualPaymentPending(manualBooking.booking.id, {
      paymentReference: getManualPaymentReference(manualBooking.booking.id),
    })

    assert(manualPending?.bookingStatus === 'pending_manual_payment', 'Booking nie przeszedl do statusu pending_manual_payment.')
    assert(manualPending?.paymentStatus === 'pending_manual_review', 'Payment status nie przeszedl do pending_manual_review.')

    const manualPaid = await markBookingPaid(manualBooking.booking.id, {
      paymentMethod: 'manual',
      paymentReference: getManualPaymentReference(manualBooking.booking.id),
      triggerPaymentConfirmationSms: true,
    })

    assert(manualPaid?.bookingStatus === 'confirmed', 'Booking po recznej akceptacji nie przeszedl do statusu confirmed.')
    assert(manualPaid?.paymentStatus === 'paid', 'Booking po recznej akceptacji nie ma statusu paid.')
    assert(manualPaid?.meetingUrl.startsWith('https://meet.jit.si/behawior15-'), 'Nie wygenerowano linku Jitsi.')
    assert(
      manualPaid?.smsConfirmationStatus === 'skipped_not_configured',
      'Manual payment success powinien zapisac kontrolowany status SMS przy braku providera.',
    )

    const rejectedBooking = await createPendingBooking({
      ownerName: 'Manual Reject',
      problemType: 'kot',
      animalType: 'Kot',
      petAge: '2 lata',
      durationNotes: '3 dni',
      description: 'Test odrzucenia manualnej platnosci po zgloszeniu.',
      phone: '501000000',
      email: 'manual-reject@example.com',
      slotId: manualRejectedSlot.id,
    })

    await markBookingManualPaymentPending(rejectedBooking.booking.id, {
      paymentReference: getManualPaymentReference(rejectedBooking.booking.id),
    })
    const rejectedResult = await markBookingManualPaymentRejected(rejectedBooking.booking.id, 'Nie znaleziono wplaty.')

    assert(rejectedResult?.bookingStatus === 'cancelled', 'Booking po odrzuceniu wplaty nie ma statusu cancelled.')
    assert(rejectedResult?.paymentStatus === 'rejected', 'Booking po odrzuceniu wplaty nie ma payment status rejected.')

    const availabilityAfterReject = await listAvailability()
    const rejectedSlotVisibleAgain = availabilityAfterReject.some((group) =>
      group.slots.some((slot) => slot.id === manualRejectedSlot.id),
    )
    assert(rejectedSlotVisibleAgain, 'Slot po odrzuceniu manualnej platnosci nie wrocil do puli.')

    const payuBooking = await createPendingBooking({
      ownerName: 'PayU Success',
      problemType: 'separacja',
      animalType: 'Pies',
      petAge: '3 lata',
      durationNotes: 'Od miesiaca',
      description: 'Test automatycznego przejscia do paid po sukcesie PayU.',
      phone: '502000000',
      email: 'payu-success@example.com',
      slotId: payuSlot.id,
    })

    await attachPayuOrder(payuBooking.booking.id, {
      payuOrderId: 'payu-order-test-001',
      payuOrderStatus: 'NEW',
    })
    const payuPaid = await markBookingPaid(payuBooking.booking.id, {
      paymentMethod: 'payu',
      payuOrderId: 'payu-order-test-001',
      payuOrderStatus: 'COMPLETED',
      triggerPaymentConfirmationSms: true,
    })

    assert(payuPaid?.bookingStatus === 'confirmed', 'Booking po sukcesie PayU nie przeszedl do confirmed.')
    assert(payuPaid?.paymentStatus === 'paid', 'Booking po sukcesie PayU nie ma statusu paid.')
    assert(
      payuPaid?.smsConfirmationStatus === 'skipped_not_configured',
      'PayU success powinien zapisac kontrolowany status SMS przy braku providera.',
    )

    const doneBooking = await markBookingDone(manualBooking.booking.id, 'Pelna konsultacja')
    assert(doneBooking?.bookingStatus === 'done', 'Booking nie przeszedl do statusu done.')
    assert(doneBooking?.paymentStatus === 'paid', 'Booking done powinien zachowac payment status paid.')

    const futureAdminSlotDate = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))
    const adminSlot = await createAvailabilitySlot(futureAdminSlotDate, '08:00')
    const adminAvailability = await listAvailabilityAdmin()
    assert(adminAvailability.some((slot) => slot.id === adminSlot.id), 'Admin slot nie zostal dodany.')

    await deleteAvailabilitySlot(adminSlot.id)
    const adminAvailabilityAfterDelete = await listAvailabilityAdmin()
    assert(!adminAvailabilityAfterDelete.some((slot) => slot.id === adminSlot.id), 'Admin slot nie zostal usuniety.')

    const finalManualBooking = await getBookingById(manualBooking.booking.id)

    console.log(
      JSON.stringify(
        {
          manualPaymentFlow: {
            pendingStatus: manualPending?.bookingStatus ?? null,
            pendingPaymentStatus: manualPending?.paymentStatus ?? null,
            finalBookingStatus: manualPaid?.bookingStatus ?? null,
            finalPaymentStatus: manualPaid?.paymentStatus ?? null,
          },
          manualRejectFlow: {
            bookingStatus: rejectedResult?.bookingStatus ?? null,
            paymentStatus: rejectedResult?.paymentStatus ?? null,
            slotReleased: rejectedSlotVisibleAgain,
          },
          payuFlow: {
            bookingStatus: payuPaid?.bookingStatus ?? null,
            paymentStatus: payuPaid?.paymentStatus ?? null,
            orderId: payuPaid?.payuOrderId ?? null,
          },
          adminAvailabilityAddRemove: true,
          noPastSlotsInAvailability: true,
          jitsiLinkAssigned: finalManualBooking?.meetingUrl ?? null,
          finalDoneStatus: doneBooking?.bookingStatus ?? null,
        },
        null,
        2,
      ),
    )
  } finally {
    await sandbox.cleanup()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
