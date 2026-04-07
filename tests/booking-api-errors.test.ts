import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getBookingApiErrorSnapshot } from '@/lib/server/booking-api-errors'

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[łŁ]/g, 'l')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

test('booking api conflict errors map to a clear slot unavailable response', () => {
  const snapshot = getBookingApiErrorSnapshot(new Error('Wybrany termin został przed chwilą zajęty.'))

  assert.equal(snapshot.status, 409)
  assert.equal(snapshot.code, 'slot_unavailable')
  assert.match(normalize(snapshot.message), /termin zostal wlasnie zajety/)
})

test('booking api persistence and schema failures map to a public booking unavailable response', () => {
  const snapshot = getBookingApiErrorSnapshot(
    new Error("Could not find the 'qa_booking' column of 'bookings' in the schema cache"),
  )

  assert.equal(snapshot.status, 503)
  assert.equal(snapshot.code, 'booking_unavailable')
  assert.match(normalize(snapshot.message), /rezerwacja chwilowo jest niedostepna/)
})

test('booking api transient infrastructure failures stay on the same public fallback', () => {
  const snapshot = getBookingApiErrorSnapshot(new Error('Cloudflare 503 Service Unavailable'))

  assert.equal(snapshot.status, 503)
  assert.equal(snapshot.code, 'booking_unavailable')
  assert.match(normalize(snapshot.message), /rezerwacja chwilowo jest niedostepna/)
})
