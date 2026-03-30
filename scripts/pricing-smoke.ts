import assert from 'node:assert/strict'
import { readFile, rm } from 'fs/promises'
import path from 'path'
import { loadEnvConfig } from '@next/env'
import { DEFAULT_PRICE_PLN, toStripeUnitAmount } from '../lib/pricing'
import { createLocalDataSandbox } from './lib/local-data-sandbox'

const rootDir = process.cwd()

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

async function cleanLocalData(dataDir: string) {
  await rm(path.join(dataDir, 'availability.json'), { force: true })
  await rm(path.join(dataDir, 'pricing-settings.json'), { force: true })
  await rm(path.join(dataDir, 'bookings.json'), { force: true })
  await rm(path.join(dataDir, 'users.json'), { force: true })
}

async function readBookingsFile(dataDir: string) {
  const raw = await readFile(path.join(dataDir, 'bookings.json'), 'utf8')
  return JSON.parse(raw) as Array<{ id: string; amount: number; checkoutSessionId?: string | null }>
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'mock'
  process.env.NEXT_PUBLIC_APP_URL = 'http://127.0.0.1:3101'
  process.env.RESEND_API_KEY = ''
  const updatedAdminPrice = DEFAULT_PRICE_PLN + 8
  const sandbox = await createLocalDataSandbox('pricing-smoke', rootDir)
  const { dataDir } = sandbox

  const { getActiveConsultationPrice, listAvailability, createPendingBooking, getBookingById } = await import('../lib/server/db')
  const { buildCheckoutSessionParams } = await import('../lib/server/stripe')
  const { POST: updatePricingRoute } = await import('../app/api/admin/pricing/route')

  try {
    await cleanLocalData(dataDir)

    const initialPrice = await getActiveConsultationPrice()
    assert.equal(initialPrice.amount, DEFAULT_PRICE_PLN)

    const availability = await listAvailability()
    const firstThreeSlots = availability.flatMap((group) => group.slots).slice(0, 3)
    assert.equal(firstThreeSlots.length, 3, 'Expected at least 3 free slots for pricing smoke test.')

    const bookingOneCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[0].id, 1))
    assert.equal(bookingOneCreate.booking.amount, DEFAULT_PRICE_PLN)
    const checkoutOne = buildCheckoutSessionParams(bookingOneCreate.booking, {
      accessToken: bookingOneCreate.accessToken,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
    const checkoutOneLineItem = checkoutOne.line_items?.[0]
    assert.equal(extractUnitAmount(checkoutOneLineItem), toStripeUnitAmount(DEFAULT_PRICE_PLN))

    const routeUpdateResponse = await updatePricingRoute(
      new Request('http://localhost/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: String(updatedAdminPrice) }),
      }),
    )
    assert.equal(routeUpdateResponse.status, 200)
    const routeUpdatePayload = await routeUpdateResponse.json()
    assert.equal(routeUpdatePayload.price.amount, updatedAdminPrice)

    const updatedPrice = await getActiveConsultationPrice()
    assert.equal(updatedPrice.amount, updatedAdminPrice)

    const bookingTwoCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[1].id, 2))
    assert.equal(bookingTwoCreate.booking.amount, updatedAdminPrice)
    const checkoutTwo = buildCheckoutSessionParams(bookingTwoCreate.booking, {
      accessToken: bookingTwoCreate.accessToken,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
    const checkoutTwoLineItem = checkoutTwo.line_items?.[0]
    assert.equal(extractUnitAmount(checkoutTwoLineItem), toStripeUnitAmount(updatedAdminPrice))

    const bookingOneSnapshot = await getBookingById(bookingOneCreate.booking.id)
    assert.equal(bookingOneSnapshot?.amount, DEFAULT_PRICE_PLN)

    const restorePriceResponse = await updatePricingRoute(
      new Request('http://localhost/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: String(DEFAULT_PRICE_PLN) }),
      }),
    )
    assert.equal(restorePriceResponse.status, 200)

    const restoredPrice = await getActiveConsultationPrice()
    assert.equal(restoredPrice.amount, DEFAULT_PRICE_PLN)

    const bookingThreeCreate = await createPendingBooking(testBookingPayload(firstThreeSlots[2].id, 3))
    assert.equal(bookingThreeCreate.booking.amount, DEFAULT_PRICE_PLN)

    const bookingsFile = await readBookingsFile(dataDir)

    console.log(
      JSON.stringify(
        {
          initialPrice: initialPrice.amount,
          afterAdminChange: updatedPrice.amount,
          afterRestore: restoredPrice.amount,
          bookingOne: {
            id: bookingOneCreate.booking.id,
            amount: bookingOneCreate.booking.amount,
            checkoutUnitAmount: toStripeUnitAmount(DEFAULT_PRICE_PLN),
          },
          bookingTwo: {
            id: bookingTwoCreate.booking.id,
            amount: bookingTwoCreate.booking.amount,
            checkoutUnitAmount: toStripeUnitAmount(updatedAdminPrice),
          },
          bookingThree: {
            id: bookingThreeCreate.booking.id,
            amount: bookingThreeCreate.booking.amount,
          },
          oldBookingKeptHistoricalPrice: bookingOneSnapshot?.amount === DEFAULT_PRICE_PLN,
          bookingCount: bookingsFile.length,
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
