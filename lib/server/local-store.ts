import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { compareDateAndTime, formatDateLabel, isFutureAvailabilitySlot } from '@/lib/data'
import { createActiveConsultationPrice, DEFAULT_PRICE_PLN, parseConsultationPriceInput } from '@/lib/pricing'
import { buildSeedAvailabilitySlots } from '@/lib/server/availability-seed'
import { createCustomerAccessToken, hasValidCustomerAccessToken } from '@/lib/server/customer-access'
import { getReservationWindowMinutes } from '@/lib/server/env'
import { createMeetingUrl } from '@/lib/server/jitsi'
import {
  sendBookingConfirmationEmail,
  sendBookingReservationCreatedEmail,
  shouldSendBookingConfirmationAfterPayment,
} from '@/lib/server/notifications'
import {
  AvailabilitySlot,
  BookingCreateResult,
  BookingFormData,
  BookingPreparationPatch,
  BookingRecord,
  GroupedAvailability,
  UserRecord,
} from '@/lib/types'

interface LocalStoreData {
  availability: AvailabilitySlot[]
  bookings: BookingRecord[]
  pricingSettings: {
    amount: number
    updatedAt: string | null
  }
  users: UserRecord[]
}

const dataDir = path.join(process.cwd(), 'data')
const availabilityFile = path.join(dataDir, 'availability.json')
const bookingsFile = path.join(dataDir, 'bookings.json')
const pricingSettingsFile = path.join(dataDir, 'pricing-settings.json')
const usersFile = path.join(dataDir, 'users.json')

let queue = Promise.resolve()

function withLock<T>(work: () => Promise<T>): Promise<T> {
  const next = queue.then(work, work)
  queue = next.then(
    () => undefined,
    () => undefined,
  )
  return next
}

function createSeedAvailability(nowIso: string): AvailabilitySlot[] {
  return buildSeedAvailabilitySlots(new Date(nowIso), nowIso)
}

async function ensureFile(filePath: string, fallbackValue: unknown) {
  try {
    await readFile(filePath, 'utf8')
  } catch {
    await writeJson(filePath, fallbackValue)
  }
}

async function ensureStoreFiles() {
  const nowIso = new Date().toISOString()
  await mkdir(dataDir, { recursive: true })
  await ensureFile(availabilityFile, createSeedAvailability(nowIso))
  await ensureFile(bookingsFile, [])
  await ensureFile(pricingSettingsFile, { amount: DEFAULT_PRICE_PLN, updatedAt: null })
  await ensureFile(usersFile, [])
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8')
  return JSON.parse(raw) as T
}

async function writeJson(filePath: string, value: unknown) {
  await writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}

function releaseSlot(slot: AvailabilitySlot, nowIso: string) {
  slot.isBooked = false
  slot.lockedByBookingId = null
  slot.lockedUntil = null
  slot.updatedAt = nowIso
}

function normalizeExpiredReservations(store: LocalStoreData): LocalStoreData {
  const now = Date.now()
  let changed = false

  const bookings = store.bookings.map((booking) => ({
    ...booking,
    customerAccessTokenHash: booking.customerAccessTokenHash ?? '',
    reminderSent: booking.reminderSent ?? false,
    prepVideoPath: booking.prepVideoPath ?? null,
    prepVideoFilename: booking.prepVideoFilename ?? null,
    prepVideoSizeBytes: booking.prepVideoSizeBytes ?? null,
    prepLinkUrl: booking.prepLinkUrl ?? null,
    prepNotes: booking.prepNotes ?? null,
    prepUploadedAt: booking.prepUploadedAt ?? null,
  }))
  const availability = store.availability.map((slot) => ({ ...slot }))
  const pricingSettings = {
    amount: Number.isFinite(store.pricingSettings.amount) ? store.pricingSettings.amount : DEFAULT_PRICE_PLN,
    updatedAt: store.pricingSettings.updatedAt ?? null,
  }
  const users = store.users.map((user) => ({ ...user }))

  for (const slot of availability) {
    if (slot.isBooked || !slot.lockedUntil || Date.parse(slot.lockedUntil) > now) {
      continue
    }

    const bookingId = slot.lockedByBookingId
    const nowIso = new Date().toISOString()
    releaseSlot(slot, nowIso)
    changed = true

    if (!bookingId) {
      continue
    }

    const booking = bookings.find(
      (item) => item.id === bookingId && item.bookingStatus === 'pending' && item.paymentStatus === 'unpaid',
    )

    if (!booking) {
      continue
    }

    booking.bookingStatus = 'expired'
    booking.paymentStatus = 'unpaid'
    booking.expiredAt = nowIso
    booking.updatedAt = nowIso
  }

  return changed ? { availability, bookings, pricingSettings, users } : { ...store, pricingSettings }
}

async function readStore(): Promise<LocalStoreData> {
  await ensureStoreFiles()

  const [availability, bookings, pricingSettings, users] = await Promise.all([
    readJson<AvailabilitySlot[]>(availabilityFile),
    readJson<BookingRecord[]>(bookingsFile),
    readJson<{ amount: number; updatedAt: string | null }>(pricingSettingsFile),
    readJson<UserRecord[]>(usersFile),
  ])

  const normalized = normalizeExpiredReservations({ availability, bookings, pricingSettings, users })

  await Promise.all([
    writeJson(availabilityFile, normalized.availability),
    writeJson(bookingsFile, normalized.bookings),
    writeJson(pricingSettingsFile, normalized.pricingSettings),
    writeJson(usersFile, normalized.users),
  ])

  return normalized
}

async function persistStore(store: LocalStoreData) {
  await Promise.all([
    writeJson(availabilityFile, store.availability),
    writeJson(bookingsFile, store.bookings),
    writeJson(pricingSettingsFile, store.pricingSettings),
    writeJson(usersFile, store.users),
  ])
}

function sortAvailability(left: AvailabilitySlot, right: AvailabilitySlot): number {
  return compareDateAndTime(left.bookingDate, left.bookingTime, right.bookingDate, right.bookingTime)
}

function groupAvailability(slots: AvailabilitySlot[]): GroupedAvailability[] {
  const grouped = new Map<string, AvailabilitySlot[]>()

  for (const slot of slots) {
    if (slot.isBooked || slot.lockedByBookingId || !isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)) {
      continue
    }

    const current = grouped.get(slot.bookingDate) ?? []
    current.push(slot)
    grouped.set(slot.bookingDate, current)
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, dateSlots]) => ({
      date,
      label: formatDateLabel(date),
      slots: dateSlots.sort(sortAvailability),
    }))
}

function findOrCreateUser(store: LocalStoreData, email: string, nowIso: string): UserRecord {
  const existing = store.users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    existing.updatedAt = nowIso
    return existing
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    createdAt: nowIso,
    updatedAt: nowIso,
  }

  store.users.unshift(user)
  return user
}

export async function listAvailability(): Promise<GroupedAvailability[]> {
  return withLock(async () => {
    const store = await readStore()
    return groupAvailability(store.availability)
  })
}

export async function getActiveConsultationPrice() {
  return withLock(async () => {
    const store = await readStore()
    return createActiveConsultationPrice(store.pricingSettings.amount, store.pricingSettings.updatedAt)
  })
}

export async function updateActiveConsultationPrice(amount: number) {
  return withLock(async () => {
    const store = await readStore()
    const nowIso = new Date().toISOString()
    store.pricingSettings = {
      amount: parseConsultationPriceInput(amount),
      updatedAt: nowIso,
    }
    await persistStore(store)
    return createActiveConsultationPrice(store.pricingSettings.amount, store.pricingSettings.updatedAt)
  })
}

export async function listAvailabilityAdmin(): Promise<AvailabilitySlot[]> {
  return withLock(async () => {
    const store = await readStore()
    return [...store.availability].sort(sortAvailability)
  })
}

export async function getAvailabilitySlot(slotId: string): Promise<AvailabilitySlot | null> {
  return withLock(async () => {
    const store = await readStore()
    const slot = store.availability.find((item) => item.id === slotId) ?? null

    if (!slot) {
      return null
    }

    return !slot.isBooked && !slot.lockedByBookingId && !isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)
      ? null
      : slot
  })
}

export async function createAvailabilitySlot(bookingDate: string, bookingTime: string): Promise<AvailabilitySlot> {
  return withLock(async () => {
    if (!isFutureAvailabilitySlot(bookingDate, bookingTime)) {
      throw new Error('Możesz dodać tylko przyszły termin.')
    }

    const store = await readStore()
    const existing = store.availability.find(
      (slot) => slot.bookingDate === bookingDate && slot.bookingTime === bookingTime,
    )

    if (existing) {
      throw new Error('Ten slot już istnieje.')
    }

    const nowIso = new Date().toISOString()
    const slot: AvailabilitySlot = {
      id: `${bookingDate}-${bookingTime}`,
      bookingDate,
      bookingTime,
      isBooked: false,
      lockedByBookingId: null,
      lockedUntil: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    store.availability.push(slot)
    store.availability.sort(sortAvailability)
    await persistStore(store)
    return slot
  })
}

export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  return withLock(async () => {
    const store = await readStore()
    const slot = store.availability.find((item) => item.id === slotId)

    if (!slot) {
      throw new Error('Nie znaleziono slotu.')
    }

    if (slot.isBooked || slot.lockedByBookingId) {
      throw new Error('Nie można usunąć slotu, który jest zarezerwowany lub opłacony.')
    }

    store.availability = store.availability.filter((item) => item.id !== slotId)
    await persistStore(store)
  })
}

export async function createPendingBooking(form: BookingFormData): Promise<BookingCreateResult> {
  return withLock(async () => {
    const store = await readStore()
    const pricing = createActiveConsultationPrice(store.pricingSettings.amount, store.pricingSettings.updatedAt)
    const slot = store.availability.find((item) => item.id === form.slotId)

    if (!slot || slot.isBooked || slot.lockedByBookingId) {
      throw new Error('Wybrany termin nie jest już dostępny.')
    }

    if (!isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)) {
      throw new Error('Wybrany termin jest już przeszły. Wybierz nową godzinę rozmowy.')
    }

    const nowIso = new Date().toISOString()
    const user = findOrCreateUser(store, form.email, nowIso)
    const bookingId = crypto.randomUUID()
    const accessToken = createCustomerAccessToken()
    const reservationExpiresAt = new Date(Date.now() + getReservationWindowMinutes() * 60 * 1000).toISOString()
    console.info('[behawior15][pricing] booking-created', {
      bookingId,
      amount: pricing.amount,
      summary: pricing.summary,
    })

    const booking: BookingRecord = {
      id: bookingId,
      userId: user.id,
      customerAccessTokenHash: accessToken.tokenHash,
      ownerName: form.ownerName,
      problemType: form.problemType,
      animalType: form.animalType,
      petAge: form.petAge,
      durationNotes: form.durationNotes,
      description: form.description,
      phone: form.phone,
      email: form.email,
      bookingDate: slot.bookingDate,
      bookingTime: slot.bookingTime,
      slotId: slot.id,
      amount: pricing.amount,
      bookingStatus: 'pending',
      paymentStatus: 'unpaid',
      meetingUrl: createMeetingUrl(bookingId),
      createdAt: nowIso,
      updatedAt: nowIso,
      checkoutSessionId: null,
      paymentIntentId: null,
      paidAt: null,
      cancelledAt: null,
      expiredAt: null,
      refundedAt: null,
      recommendedNextStep: null,
      reminderSent: false,
      prepVideoPath: null,
      prepVideoFilename: null,
      prepVideoSizeBytes: null,
      prepLinkUrl: null,
      prepNotes: null,
      prepUploadedAt: null,
    }

    slot.lockedByBookingId = booking.id
    slot.lockedUntil = reservationExpiresAt
    slot.updatedAt = nowIso

    store.bookings.unshift(booking)
    await persistStore(store)
    await sendBookingReservationCreatedEmail(booking)

    return { booking, slot: { ...slot }, accessToken: accessToken.rawToken }
  })
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    return store.bookings.find((booking) => booking.id === id) ?? null
  })
}

export async function getBookingByCustomerAccess(id: string, accessToken: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === id)

    if (!booking) {
      return null
    }

    if (!booking.customerAccessTokenHash) {
      return booking
    }

    return hasValidCustomerAccessToken(accessToken, booking.customerAccessTokenHash) ? booking : null
  })
}

export async function listBookings(): Promise<BookingRecord[]> {
  return withLock(async () => {
    const store = await readStore()
    return [...store.bookings].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  })
}

export async function updateBookingPreparation(
  bookingId: string,
  patch: BookingPreparationPatch,
): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoPath')) {
      booking.prepVideoPath = patch.prepVideoPath ?? null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoFilename')) {
      booking.prepVideoFilename = patch.prepVideoFilename ?? null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoSizeBytes')) {
      booking.prepVideoSizeBytes = patch.prepVideoSizeBytes ?? null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepLinkUrl')) {
      booking.prepLinkUrl = patch.prepLinkUrl ?? null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepNotes')) {
      booking.prepNotes = patch.prepNotes ?? null
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'prepUploadedAt')) {
      booking.prepUploadedAt = patch.prepUploadedAt ?? null
    }

    booking.updatedAt = new Date().toISOString()
    await persistStore(store)
    return booking
  })
}

export async function attachCheckoutSession(bookingId: string, checkoutSessionId: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    booking.checkoutSessionId = checkoutSessionId
    booking.updatedAt = new Date().toISOString()
    await persistStore(store)
    return booking
  })
}

export async function markBookingPaid(
  bookingId: string,
  paymentData?: { checkoutSessionId?: string | null; paymentIntentId?: string | null },
): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    if (
      !(
        (booking.bookingStatus === 'pending' && booking.paymentStatus === 'unpaid') ||
        (booking.bookingStatus === 'confirmed' && booking.paymentStatus === 'paid') ||
        (booking.bookingStatus === 'done' && booking.paymentStatus === 'paid')
      )
    ) {
      throw new Error('Ten booking nie może już zostać opłacony.')
    }

    const slot = store.availability.find((item) => item.id === booking.slotId)
    const nowIso = new Date().toISOString()
    const shouldSendConfirmation = shouldSendBookingConfirmationAfterPayment(booking)

    booking.bookingStatus = booking.bookingStatus === 'done' ? 'done' : 'confirmed'
    booking.paymentStatus = 'paid'
    booking.paidAt = nowIso
    booking.cancelledAt = null
    booking.expiredAt = null
    booking.checkoutSessionId = paymentData?.checkoutSessionId ?? booking.checkoutSessionId ?? null
    booking.paymentIntentId = paymentData?.paymentIntentId ?? booking.paymentIntentId ?? null
    booking.updatedAt = nowIso

    if (slot) {
      slot.isBooked = true
      slot.lockedByBookingId = booking.id
      slot.lockedUntil = null
      slot.updatedAt = nowIso
    }

    await persistStore(store)

    if (shouldSendConfirmation) {
      await sendBookingConfirmationEmail(booking)
    }

    return booking
  })
}

export async function markBookingPaymentFailed(bookingId: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    if (booking.paymentStatus === 'paid' || booking.bookingStatus === 'done') {
      throw new Error('Nie można oznaczyć opłaconego bookingu jako nieudany.')
    }

    const slot = store.availability.find((item) => item.id === booking.slotId)
    const nowIso = new Date().toISOString()

    booking.bookingStatus = 'cancelled'
    booking.paymentStatus = 'failed'
    booking.cancelledAt = nowIso
    booking.updatedAt = nowIso

    if (slot) {
      releaseSlot(slot, nowIso)
    }

    await persistStore(store)
    return booking
  })
}

export async function markBookingExpired(bookingId: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    const slot = store.availability.find((item) => item.id === booking.slotId)
    const nowIso = new Date().toISOString()

    booking.bookingStatus = 'expired'
    booking.paymentStatus = 'unpaid'
    booking.expiredAt = nowIso
    booking.updatedAt = nowIso

    if (slot) {
      releaseSlot(slot, nowIso)
    }

    await persistStore(store)
    return booking
  })
}

export async function markBookingDone(bookingId: string, recommendedNextStep?: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    if (booking.paymentStatus !== 'paid') {
      throw new Error('Nie można oznaczyć jako done nieopłaconej konsultacji.')
    }

    booking.bookingStatus = 'done'
    booking.paymentStatus = booking.paymentStatus === 'paid' ? 'paid' : booking.paymentStatus
    booking.recommendedNextStep = recommendedNextStep ?? booking.recommendedNextStep ?? null
    booking.updatedAt = new Date().toISOString()
    await persistStore(store)
    return booking
  })
}

export async function markBookingReminderSent(bookingId: string): Promise<BookingRecord | null> {
  return withLock(async () => {
    const store = await readStore()
    const booking = store.bookings.find((item) => item.id === bookingId)

    if (!booking) {
      return null
    }

    booking.reminderSent = true
    booking.updatedAt = new Date().toISOString()
    await persistStore(store)
    return booking
  })
}
