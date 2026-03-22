import assert from 'node:assert/strict'
import { cp, mkdir, readFile, rm } from 'fs/promises'
import path from 'path'
import { loadEnvConfig } from '@next/env'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const backupDir = path.join(rootDir, '.tmp-pricing-data-backup')

function extractUnitAmount(lineItem: unknown): number | null {
  if (!lineItem || typeof lineItem !== 'object' || !('price_data' in lineItem)) {
    return null
  }

  const priceData = lineItem.price_data

  if (!priceData || typeof priceData !== 'object' || !('unit_amount' in priceData)) {
    return null
  }

  return typeof priceData.unit_amount === 'number' ? priceData.unit_amount : null
}

function testBookingPayload(slotId: string, index: number) {
  return {
    ownerName: `Test Price ${index}`,
    problemType: 'szczeniak' as const,
    animalType: 'Pies' as const,
    petAge: '2 lata',
    durationNotes: 'Od 2 tygodni',
    description: 'Pies szczeka po wyjsciu opiekuna i trudno mu sie wyciszyc po powrocie do domu.',
    phone: `50060070${index}`,
    email: `pricing-${index}@example.com`,
    slotId,
  }
}

async function backupData() {
  await rm(backupDir, { recursive: true, force: true })
  try {
    await cp(dataDir, backupDir, { recursive: true, force: true })
  } catch {
    // Fresh repo may not have runtime-local data yet.
  }
}

async function restoreData() {
  await rm(dataDir, { recursive: true, force: true })
  try {
    await mkdir(rootDir, { recursive: true })
    await cp(backupDir, dataDir, { recursive: true, force: true })
  } catch {
    // Nothing to restore when there was no local runtime data before the smoke test.
  }
  await rm(backupDir, { recursive: true, force: true })
}

async function cleanLocalData() {
  await rm(path.join(dataDir, 'availability.json'), { force: true })
  await rm(path.join(dataDir, 'pricing-settings.json'), { force: true })
  await rm(path.join(dataDir, 'bookings.json'), { force: true })
  await rm(path.join(dataDir, 'users.json'), { force: true })
}

async function readBookingsFile() {
  const raw = await readFile(path.join(dataDir, 'bookings.json'), 'utf8')
  return JSON.parse(raw) as Array<{ id: string; amount: number; checkoutSessionId?: string | null }>
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'mock'
  process.env.NEXT_PUBLIC_APP_URL = 'http://127.0.0.1:3101'
  process.env.RESEND_API_KEY = ''

  const { getActiveConsultationPrice, listAvailability, createPendingBooking, getBookingById } = await import('../lib/server/db')
  const { buildCheckoutSessionParams } = await import('../lib/server/stripe')
  const { POST: updatePricingRoute } = await import('../app/api/admin/pricing/route')

  await backupData()

  try {
    await cleanLocalData()

    const initialPrice = await getActiveConsultationPrice()
    assert.equal(initialPrice.amount, 39)

    const availability = await listAvailability()
    const firstThreeSlots = availability.flatMap((group) => group.slots).slice(0, 3)
    assert.equal(firstThreeSlots.length, 3, 'Expected at least 3 free slots for pricing smoke test.')

    const bookingOneCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[0].id, 1))
    assert.equal(bookingOneCreate.booking.amount, 39)
    const checkoutOne = buildCheckoutSessionParams(bookingOneCreate.booking, {
      accessToken: bookingOneCreate.accessToken,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
    const checkoutOneLineItem = checkoutOne.line_items?.[0]
    assert.equal(extractUnitAmount(checkoutOneLineItem), 3900)

    const routeUpdateResponse = await updatePricingRoute(
      new Request('http://localhost/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: '47' }),
      }),
    )
    assert.equal(routeUpdateResponse.status, 200)
    const routeUpdatePayload = await routeUpdateResponse.json()
    assert.equal(routeUpdatePayload.price.amount, 47)

    const updatedPrice = await getActiveConsultationPrice()
    assert.equal(updatedPrice.amount, 47)

    const bookingTwoCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[1].id, 2))
    assert.equal(bookingTwoCreate.booking.amount, 47)
    const checkoutTwo = buildCheckoutSessionParams(bookingTwoCreate.booking, {
      accessToken: bookingTwoCreate.accessToken,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
    const checkoutTwoLineItem = checkoutTwo.line_items?.[0]
    assert.equal(extractUnitAmount(checkoutTwoLineItem), 4700)

    const bookingOneSnapshot = await getBookingById(bookingOneCreate.booking.id)
    assert.equal(bookingOneSnapshot?.amount, 39)

    const restorePriceResponse = await updatePricingRoute(
      new Request('http://localhost/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: '39' }),
      }),
    )
    assert.equal(restorePriceResponse.status, 200)

    const restoredPrice = await getActiveConsultationPrice()
    assert.equal(restoredPrice.amount, 39)

    const bookingThreeCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[2].id, 3))
    assert.equal(bookingThreeCreate.booking.amount, 39)

    const bookingsFile = await readBookingsFile()

    console.log(
      JSON.stringify(
        {
          initialPrice: initialPrice.amount,
          afterAdminChange: updatedPrice.amount,
          afterRestore: restoredPrice.amount,
          bookingOne: {
            id: bookingOneCreate.booking.id,
            amount: bookingOneCreate.booking.amount,
            checkoutUnitAmount: 3900,
          },
          bookingTwo: {
            id: bookingTwoCreate.booking.id,
            amount: bookingTwoCreate.booking.amount,
            checkoutUnitAmount: 4700,
          },
          bookingThree: {
            id: bookingThreeCreate.booking.id,
            amount: bookingThreeCreate.booking.amount,
          },
          oldBookingKeptHistoricalPrice: bookingOneSnapshot?.amount === 39,
          bookingCount: bookingsFile.length,
        },
        null,
        2,
      ),
    )
  } finally {
    await restoreData()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
