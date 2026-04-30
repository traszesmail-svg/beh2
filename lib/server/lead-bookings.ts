import { randomBytes, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getLocalStoreDataDir } from './local-store-path'

export type LeadBookingStatus =
  | 'pending' // dostalismy zgloszenie, czekamy na manualne potwierdzenie terminu
  | 'awaiting_payment' // termin potwierdzony, klient otrzymal link do platnosci
  | 'paid' // platnosc zaksiegowana, rezerwacja potwierdzona
  | 'cancelled' // rezerwacja anulowana

export type LeadBookingService =
  | 'kwadrans-na-juz'
  | 'szybka-konsultacja-15-min'
  | 'konsultacja-30-min'
  | 'konsultacja-behawioralna-online'

export type LeadBookingRecord = {
  id: string
  accessToken: string
  createdAt: string
  updatedAt: string
  status: LeadBookingStatus
  service: LeadBookingService
  serviceLabel: string
  servicePrice: string
  name: string
  email: string
  species: 'pies' | 'kot'
  description: string
  preferredSlots: string
  // Filled by admin after booking confirmed
  confirmedDate: string | null
  confirmedTime: string | null
  paymentLink: string | null
  paymentMethod: string | null
  paidAt: string | null
  callRoomUrl: string | null
  calendarUrl: string | null
  adminNotes: string | null
}

type StoreShape = {
  bookings: LeadBookingRecord[]
}

function getStorePath(rootDir = process.cwd()) {
  return path.join(getLocalStoreDataDir(rootDir), 'lead-bookings.json')
}

async function readStore(): Promise<StoreShape> {
  const filePath = getStorePath()
  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreShape>
    return {
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    }
  } catch {
    return { bookings: [] }
  }
}

async function writeStore(store: StoreShape) {
  const filePath = getStorePath()
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

function createAccessToken(): string {
  return randomBytes(24).toString('hex')
}

export type CreateLeadBookingInput = {
  service: LeadBookingService
  serviceLabel: string
  servicePrice: string
  name: string
  email: string
  species: 'pies' | 'kot'
  description: string
  preferredSlots: string
}

export async function createLeadBooking(input: CreateLeadBookingInput): Promise<LeadBookingRecord> {
  const now = new Date().toISOString()
  const store = await readStore()
  const record: LeadBookingRecord = {
    id: randomUUID(),
    accessToken: createAccessToken(),
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    service: input.service,
    serviceLabel: input.serviceLabel,
    servicePrice: input.servicePrice,
    name: input.name,
    email: input.email,
    species: input.species,
    description: input.description,
    preferredSlots: input.preferredSlots,
    confirmedDate: null,
    confirmedTime: null,
    paymentLink: null,
    paymentMethod: null,
    paidAt: null,
    callRoomUrl: null,
    calendarUrl: null,
    adminNotes: null,
  }

  store.bookings.unshift(record)
  await writeStore(store)
  return record
}

export async function listLeadBookings(): Promise<LeadBookingRecord[]> {
  const store = await readStore()
  return [...store.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getLeadBookingByToken(
  id: string,
  accessToken: string,
): Promise<LeadBookingRecord | null> {
  const store = await readStore()
  const booking = store.bookings.find((b) => b.id === id && b.accessToken === accessToken)
  return booking ?? null
}

export async function getLeadBookingById(id: string): Promise<LeadBookingRecord | null> {
  const store = await readStore()
  return store.bookings.find((b) => b.id === id) ?? null
}

export type UpdateLeadBookingInput = {
  id: string
  status?: LeadBookingStatus
  confirmedDate?: string | null
  confirmedTime?: string | null
  paymentLink?: string | null
  paymentMethod?: string | null
  paidAt?: string | null
  callRoomUrl?: string | null
  calendarUrl?: string | null
  adminNotes?: string | null
}

export async function updateLeadBooking(
  input: UpdateLeadBookingInput,
): Promise<LeadBookingRecord | null> {
  const store = await readStore()
  const booking = store.bookings.find((b) => b.id === input.id)
  if (!booking) return null

  const now = new Date().toISOString()
  if (input.status !== undefined) booking.status = input.status
  if (input.confirmedDate !== undefined) booking.confirmedDate = input.confirmedDate
  if (input.confirmedTime !== undefined) booking.confirmedTime = input.confirmedTime
  if (input.paymentLink !== undefined) booking.paymentLink = input.paymentLink
  if (input.paymentMethod !== undefined) booking.paymentMethod = input.paymentMethod
  if (input.paidAt !== undefined) booking.paidAt = input.paidAt
  if (input.callRoomUrl !== undefined) booking.callRoomUrl = input.callRoomUrl
  if (input.calendarUrl !== undefined) booking.calendarUrl = input.calendarUrl
  if (input.adminNotes !== undefined) booking.adminNotes = input.adminNotes
  booking.updatedAt = now

  await writeStore(store)
  return booking
}
