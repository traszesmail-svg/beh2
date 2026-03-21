import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import path from 'path'
import {
  createAvailabilitySlot,
  createPendingBooking,
  deleteAvailabilitySlot,
  getBookingById,
  listAvailability,
  listAvailabilityAdmin,
  markBookingDone,
  markBookingPaid,
  markBookingPaymentFailed,
} from '../lib/server/local-store'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const trackedFiles = ['availability.json', 'bookings.json', 'users.json']

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

async function backupFiles() {
  await mkdir(dataDir, { recursive: true })

  const backups = await Promise.all(
    trackedFiles.map(async (fileName) => {
      const filePath = path.join(dataDir, fileName)

      try {
        const content = await readFile(filePath, 'utf8')
        return { fileName, content, existed: true }
      } catch {
        return { fileName, content: '', existed: false }
      }
    }),
  )

  return backups
}

async function restoreFiles(backups: Awaited<ReturnType<typeof backupFiles>>) {
  for (const backup of backups) {
    const filePath = path.join(dataDir, backup.fileName)
    if (!backup.existed) {
      await rm(filePath, { force: true })
      continue
    }

    await writeFile(filePath, backup.content, 'utf8')
  }
}

async function main() {
  const backups = await backupFiles()

  try {
    await Promise.all(trackedFiles.map((fileName) => rm(path.join(dataDir, fileName), { force: true })))

    const initialAvailability = await listAvailability()
    const firstSlot = initialAvailability[0]?.slots[0]
    const secondSlot = initialAvailability[0]?.slots[1] ?? initialAvailability[1]?.slots[0]

    assert(firstSlot, 'Brak pierwszego slotu testowego.')
    assert(secondSlot, 'Brak drugiego slotu testowego.')

    const created = await createPendingBooking({
      ownerName: 'Test Owner',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '8 miesiecy',
      durationNotes: '2 tygodnie',
      description: 'Testowe zachowanie do weryfikacji flow.',
      phone: '500000000',
      email: 'test+paid@example.com',
      slotId: firstSlot.id,
    })

    assert(created.booking.bookingStatus === 'pending', 'Booking nie zaczyna od statusu pending.')
    assert(created.booking.paymentStatus === 'unpaid', 'Booking nie zaczyna od payment status unpaid.')

    const availabilityAfterReserve = await listAvailability()
    const firstSlotStillVisible = availabilityAfterReserve.some((group) =>
      group.slots.some((slot) => slot.id === firstSlot.id),
    )

    assert(!firstSlotStillVisible, 'Zarezerwowany slot nadal jest widoczny na liscie.')

    const paidBooking = await markBookingPaid(created.booking.id, {
      checkoutSessionId: 'test-checkout-success',
      paymentIntentId: 'test-intent-success',
    })

    assert(paidBooking?.bookingStatus === 'confirmed', 'Booking nie przeszedl do statusu confirmed.')
    assert(paidBooking?.paymentStatus === 'paid', 'Payment status nie przeszedl do paid.')
    assert(paidBooking.meetingUrl.startsWith('https://meet.jit.si/behawior15-'), 'Nie wygenerowano linku Jitsi.')

    const createdFailed = await createPendingBooking({
      ownerName: 'Test Failed',
      problemType: 'kot',
      animalType: 'Kot',
      petAge: '2 lata',
      durationNotes: '3 dni',
      description: 'Test nieudanej platnosci.',
      phone: '501000000',
      email: 'test+failed@example.com',
      slotId: secondSlot.id,
    })

    const failedBooking = await markBookingPaymentFailed(createdFailed.booking.id)
    assert(failedBooking?.bookingStatus === 'cancelled', 'Booking po fail nie ma statusu cancelled.')
    assert(failedBooking?.paymentStatus === 'failed', 'Booking po fail nie ma payment status failed.')

    let paymentOnFailedThrows = false
    try {
      await markBookingPaid(createdFailed.booking.id)
    } catch {
      paymentOnFailedThrows = true
    }

    assert(paymentOnFailedThrows, 'Booking po nieudanej platnosci nadal daje sie oznaczyc jako paid.')

    const availabilityAfterFailedPayment = await listAvailability()
    const secondSlotVisibleAgain = availabilityAfterFailedPayment.some((group) =>
      group.slots.some((slot) => slot.id === secondSlot.id),
    )

    assert(secondSlotVisibleAgain, 'Slot po nieudanej platnosci nie wrocil do puli.')

    const doneBooking = await markBookingDone(created.booking.id, 'Pelna konsultacja')
    assert(doneBooking?.bookingStatus === 'done', 'Booking nie przeszedl do statusu done.')
    assert(doneBooking?.paymentStatus === 'paid', 'Booking done powinien zachowac payment status paid.')

    const adminSlot = await createAvailabilitySlot('2026-03-24', '08:00')
    const adminAvailability = await listAvailabilityAdmin()
    assert(adminAvailability.some((slot) => slot.id === adminSlot.id), 'Admin slot nie zostal dodany.')

    await deleteAvailabilitySlot(adminSlot.id)
    const adminAvailabilityAfterDelete = await listAvailabilityAdmin()
    assert(!adminAvailabilityAfterDelete.some((slot) => slot.id === adminSlot.id), 'Admin slot nie zostal usuniety.')

    const finalBooking = await getBookingById(created.booking.id)

    console.log(
      JSON.stringify(
        {
          bookingFlow: 'ok',
          reservedSlotDisappears: true,
          paymentFailureReleasesSlot: true,
          adminAvailabilityAddRemove: true,
          jitsiLinkAssigned: finalBooking?.meetingUrl ?? null,
          bookingStatus: finalBooking?.bookingStatus ?? null,
          paymentStatus: finalBooking?.paymentStatus ?? null,
        },
        null,
        2,
      ),
    )
  } finally {
    await restoreFiles(backups)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
