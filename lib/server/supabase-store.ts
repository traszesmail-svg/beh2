import { createClient } from '@supabase/supabase-js'
import { compareDateAndTime, formatDateLabel, isFutureAvailabilitySlot } from '@/lib/data'
import { createActiveConsultationPrice, DEFAULT_PRICE_PLN, parseConsultationPriceInput } from '@/lib/pricing'
import { createCustomerAccessToken, hashCustomerAccessToken } from '@/lib/server/customer-access'
import { getReservationWindowMinutes, getSupabaseServerConfig } from '@/lib/server/env'
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

type AvailabilityRow = {
  id: string
  booking_date: string
  booking_time: string
  is_booked: boolean
  locked_by_booking_id: string | null
  locked_until: string | null
  created_at: string
  updated_at: string
}

type BookingRow = {
  id: string
  user_id: string | null
  customer_access_token_hash: string | null
  owner_name: string
  animal_type: string
  problem_type: string
  pet_age: string
  duration_notes: string
  description: string
  phone: string
  email: string
  booking_date: string
  booking_time: string
  slot_id: string
  booking_status: string
  payment_status: string
  amount: number | string
  meeting_url: string
  created_at: string
  updated_at: string
  paid_at: string | null
  cancelled_at: string | null
  expired_at: string | null
  refunded_at: string | null
  checkout_session_id: string | null
  payment_intent_id: string | null
  recommended_next_step: string | null
  reminder_sent: boolean | null
  prep_video_path: string | null
  prep_video_filename: string | null
  prep_video_size_bytes: number | null
  prep_link_url: string | null
  prep_notes: string | null
  prep_uploaded_at: string | null
}

type UserRow = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

type PricingSettingsRow = {
  id: string
  consultation_price: number | string
  updated_at: string
}

function getSupabaseAdmin() {
  const config = getSupabaseServerConfig('Supabase admin client')

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function mapAvailabilityRow(row: AvailabilityRow): AvailabilitySlot {
  return {
    id: row.id,
    bookingDate: row.booking_date,
    bookingTime: row.booking_time,
    isBooked: row.is_booked,
    lockedByBookingId: row.locked_by_booking_id,
    lockedUntil: row.locked_until,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapBookingRow(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    userId: row.user_id,
    customerAccessTokenHash: row.customer_access_token_hash ?? '',
    ownerName: row.owner_name,
    animalType: row.animal_type as BookingRecord['animalType'],
    problemType: row.problem_type as BookingRecord['problemType'],
    petAge: row.pet_age,
    durationNotes: row.duration_notes,
    description: row.description,
    phone: row.phone,
    email: row.email,
    bookingDate: row.booking_date,
    bookingTime: row.booking_time,
    slotId: row.slot_id,
    bookingStatus: row.booking_status as BookingRecord['bookingStatus'],
    paymentStatus: row.payment_status as BookingRecord['paymentStatus'],
    amount: typeof row.amount === 'string' ? Number(row.amount) : row.amount,
    meetingUrl: row.meeting_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
    cancelledAt: row.cancelled_at,
    expiredAt: row.expired_at,
    refundedAt: row.refunded_at,
    checkoutSessionId: row.checkout_session_id,
    paymentIntentId: row.payment_intent_id,
    recommendedNextStep: row.recommended_next_step,
    reminderSent: row.reminder_sent ?? false,
    prepVideoPath: row.prep_video_path,
    prepVideoFilename: row.prep_video_filename,
    prepVideoSizeBytes: row.prep_video_size_bytes,
    prepLinkUrl: row.prep_link_url,
    prepNotes: row.prep_notes,
    prepUploadedAt: row.prep_uploaded_at,
  }
}

function mapPricingSettingsRow(row: PricingSettingsRow) {
  return createActiveConsultationPrice(
    typeof row.consultation_price === 'string' ? Number(row.consultation_price) : row.consultation_price,
    row.updated_at,
  )
}

function sortAvailability(left: AvailabilitySlot, right: AvailabilitySlot): number {
  return compareDateAndTime(left.bookingDate, left.bookingTime, right.bookingDate, right.bookingTime)
}

function groupAvailability(rows: AvailabilitySlot[]): GroupedAvailability[] {
  const grouped = new Map<string, AvailabilitySlot[]>()

  for (const slot of rows) {
    if (slot.isBooked || slot.lockedByBookingId || !isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)) {
      continue
    }

    const current = grouped.get(slot.bookingDate) ?? []
    current.push(slot)
    grouped.set(slot.bookingDate, current)
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, slots]) => ({
      date,
      label: formatDateLabel(date),
      slots: slots.sort(sortAvailability),
    }))
}

async function cleanupExpiredReservations() {
  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()

  const expired = await supabase
    .from('availability')
    .select('id, locked_by_booking_id')
    .eq('is_booked', false)
    .not('locked_until', 'is', null)
    .lt('locked_until', nowIso)

  if (expired.error) {
    throw expired.error
  }

  if (!expired.data.length) {
    return
  }

  const availabilityIds = expired.data.map((row) => row.id)
  const bookingIds = expired.data.map((row) => row.locked_by_booking_id).filter(Boolean) as string[]

  await supabase
    .from('availability')
    .update({
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: nowIso,
    })
    .in('id', availabilityIds)

  if (bookingIds.length) {
    await supabase
      .from('bookings')
      .update({
        booking_status: 'expired',
        payment_status: 'unpaid',
        expired_at: nowIso,
        updated_at: nowIso,
      })
      .eq('booking_status', 'pending')
      .eq('payment_status', 'unpaid')
      .in('id', bookingIds)
  }
}

async function findOrCreateUser(email: string): Promise<UserRecord> {
  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        email,
        updated_at: nowIso,
      },
      { onConflict: 'email' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  const row = data as UserRow
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function readPricingSettings() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('pricing_settings').select('*').eq('id', 'consultation').maybeSingle()

  if (error) {
    throw error
  }

  if (data) {
    return mapPricingSettingsRow(data as PricingSettingsRow)
  }

  const nowIso = new Date().toISOString()
  const inserted = await supabase
    .from('pricing_settings')
    .insert({
      id: 'consultation',
      consultation_price: DEFAULT_PRICE_PLN,
      updated_at: nowIso,
    })
    .select('*')
    .single()

  if (inserted.error) {
    const fallback = await supabase.from('pricing_settings').select('*').eq('id', 'consultation').single()

    if (fallback.error) {
      throw inserted.error
    }

    return mapPricingSettingsRow(fallback.data as PricingSettingsRow)
  }

  return mapPricingSettingsRow(inserted.data as PricingSettingsRow)
}

export async function listAvailability(): Promise<GroupedAvailability[]> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('is_booked', false)
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (error) {
    throw error
  }

  return groupAvailability((data as AvailabilityRow[]).map(mapAvailabilityRow))
}

export async function getActiveConsultationPrice() {
  return readPricingSettings()
}

export async function updateActiveConsultationPrice(amount: number) {
  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const normalizedAmount = parseConsultationPriceInput(amount)
  const { data, error } = await supabase
    .from('pricing_settings')
    .upsert(
      {
        id: 'consultation',
        consultation_price: normalizedAmount,
        updated_at: nowIso,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapPricingSettingsRow(data as PricingSettingsRow)
}

export async function listAvailabilityAdmin(): Promise<AvailabilitySlot[]> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (error) {
    throw error
  }

  return (data as AvailabilityRow[]).map(mapAvailabilityRow)
}

export async function getAvailabilitySlot(slotId: string): Promise<AvailabilitySlot | null> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('availability').select('*').eq('id', slotId).maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const slot = mapAvailabilityRow(data as AvailabilityRow)

  return !slot.isBooked && !slot.lockedByBookingId && !isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)
    ? null
    : slot
}

export async function createAvailabilitySlot(bookingDate: string, bookingTime: string): Promise<AvailabilitySlot> {
  if (!isFutureAvailabilitySlot(bookingDate, bookingTime)) {
    throw new Error('Możesz dodać tylko przyszły termin.')
  }

  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const payload = {
    id: `${bookingDate}-${bookingTime}`,
    booking_date: bookingDate,
    booking_time: bookingTime,
    is_booked: false,
    locked_by_booking_id: null,
    locked_until: null,
    created_at: nowIso,
    updated_at: nowIso,
  }

  const { data, error } = await supabase.from('availability').insert(payload).select('*').single()

  if (error) {
    throw error
  }

  return mapAvailabilityRow(data as AvailabilityRow)
}

export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const current = await getAvailabilitySlot(slotId)

  if (!current) {
    throw new Error('Nie znaleziono slotu.')
  }

  if (current.isBooked || current.lockedByBookingId) {
    throw new Error('Nie mozna usunac slotu, ktory jest zarezerwowany lub oplacony.')
  }

  const { error } = await supabase.from('availability').delete().eq('id', slotId)

  if (error) {
    throw error
  }
}

export async function createPendingBooking(form: BookingFormData): Promise<BookingCreateResult> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const pricing = await readPricingSettings()

  const { data: slotData, error: slotError } = await supabase.from('availability').select('*').eq('id', form.slotId).maybeSingle()

  if (slotError) {
    throw slotError
  }

  if (!slotData || slotData.is_booked || slotData.locked_by_booking_id) {
    throw new Error('Wybrany termin nie jest już dostępny.')
  }

  const slot = mapAvailabilityRow(slotData as AvailabilityRow)

  if (!isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime)) {
    throw new Error('Wybrany termin jest już przeszły. Wybierz nową godzinę rozmowy.')
  }

  const user = await findOrCreateUser(form.email)
  const bookingId = crypto.randomUUID()
  const accessToken = createCustomerAccessToken()
  const reservationExpiresAt = new Date(Date.now() + getReservationWindowMinutes() * 60 * 1000).toISOString()
  console.info('[behawior15][pricing] booking-created', {
    bookingId,
    amount: pricing.amount,
    summary: pricing.summary,
  })
  const inserted = await supabase
    .from('bookings')
    .insert({
      id: bookingId,
      user_id: user.id,
      customer_access_token_hash: accessToken.tokenHash,
      owner_name: form.ownerName,
      animal_type: form.animalType,
      problem_type: form.problemType,
      pet_age: form.petAge,
      duration_notes: form.durationNotes,
      description: form.description,
      phone: form.phone,
      email: form.email,
      booking_date: slot.bookingDate,
      booking_time: slot.bookingTime,
      slot_id: slot.id,
      booking_status: 'pending',
      payment_status: 'unpaid',
      amount: pricing.amount,
      meeting_url: createMeetingUrl(bookingId),
      prep_video_path: null,
      prep_video_filename: null,
      prep_video_size_bytes: null,
      prep_link_url: null,
      prep_notes: null,
      prep_uploaded_at: null,
      created_at: nowIso,
      updated_at: nowIso,
    })
    .select('*')
    .single()

  if (inserted.error) {
    throw inserted.error
  }

  const claimedSlot = await supabase
    .from('availability')
    .update({
      locked_by_booking_id: bookingId,
      locked_until: reservationExpiresAt,
      updated_at: nowIso,
    })
    .eq('id', form.slotId)
    .eq('is_booked', false)
    .is('locked_by_booking_id', null)
    .select('*')
    .maybeSingle()

  if (claimedSlot.error) {
    await supabase.from('bookings').delete().eq('id', bookingId)
    throw claimedSlot.error
  }

  if (!claimedSlot.data) {
    await supabase.from('bookings').delete().eq('id', bookingId)
    throw new Error('Wybrany termin zostal przed chwila zajety.')
  }

  const booking = mapBookingRow(inserted.data as BookingRow)
  await sendBookingReservationCreatedEmail(booking)

  return {
    booking,
    slot: mapAvailabilityRow(claimedSlot.data as AvailabilityRow),
    accessToken: accessToken.rawToken,
  }
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapBookingRow(data as BookingRow) : null
}

export async function getBookingByCustomerAccess(id: string, accessToken: string): Promise<BookingRecord | null> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const tokenHash = hashCustomerAccessToken(accessToken)
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .eq('customer_access_token_hash', tokenHash)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (data) {
    return mapBookingRow(data as BookingRow)
  }

  const legacyBooking = await getBookingById(id)

  if (legacyBooking && !legacyBooking.customerAccessTokenHash) {
    return legacyBooking
  }

  return null
}

export async function listBookings(): Promise<BookingRecord[]> {
  await cleanupExpiredReservations()
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as BookingRow[]).map(mapBookingRow)
}

export async function updateBookingPreparation(
  bookingId: string,
  patch: BookingPreparationPatch,
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoPath')) {
    updatePayload.prep_video_path = patch.prepVideoPath ?? null
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoFilename')) {
    updatePayload.prep_video_filename = patch.prepVideoFilename ?? null
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepVideoSizeBytes')) {
    updatePayload.prep_video_size_bytes = patch.prepVideoSizeBytes ?? null
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepLinkUrl')) {
    updatePayload.prep_link_url = patch.prepLinkUrl ?? null
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepNotes')) {
    updatePayload.prep_notes = patch.prepNotes ?? null
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'prepUploadedAt')) {
    updatePayload.prep_uploaded_at = patch.prepUploadedAt ?? null
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updatePayload)
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapBookingRow(data as BookingRow) : null
}

export async function attachCheckoutSession(bookingId: string, checkoutSessionId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('bookings')
    .update({
      checkout_session_id: checkoutSessionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapBookingRow(data as BookingRow) : null
}

export async function markBookingPaid(
  bookingId: string,
  paymentData?: { checkoutSessionId?: string | null; paymentIntentId?: string | null },
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (
    !(
      (current.bookingStatus === 'pending' && current.paymentStatus === 'unpaid') ||
      (current.bookingStatus === 'confirmed' && current.paymentStatus === 'paid') ||
      (current.bookingStatus === 'done' && current.paymentStatus === 'paid')
    )
  ) {
    throw new Error('Ten booking nie moze juz zostac oplacony.')
  }

  const nowIso = new Date().toISOString()
  const shouldSendConfirmation = shouldSendBookingConfirmationAfterPayment(current)
  const bookingUpdate = await supabase
    .from('bookings')
    .update({
      booking_status: current.bookingStatus === 'done' ? 'done' : 'confirmed',
      payment_status: 'paid',
      paid_at: nowIso,
      cancelled_at: null,
      expired_at: null,
      updated_at: nowIso,
      checkout_session_id: paymentData?.checkoutSessionId ?? current.checkoutSessionId ?? null,
      payment_intent_id: paymentData?.paymentIntentId ?? current.paymentIntentId ?? null,
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  await supabase
    .from('availability')
    .update({
      is_booked: true,
      locked_by_booking_id: bookingId,
      locked_until: null,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  if (shouldSendConfirmation && bookingUpdate.data) {
    await sendBookingConfirmationEmail(mapBookingRow(bookingUpdate.data as BookingRow))
  }

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingPaymentFailed(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (current.paymentStatus === 'paid' || current.bookingStatus === 'done') {
    throw new Error('Nie mozna oznaczyc oplaconego bookingu jako nieudany.')
  }

  const nowIso = new Date().toISOString()
  const bookingUpdate = await supabase
    .from('bookings')
    .update({
      booking_status: 'cancelled',
      payment_status: 'failed',
      cancelled_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingExpired(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  const nowIso = new Date().toISOString()
  const bookingUpdate = await supabase
    .from('bookings')
    .update({
      booking_status: 'expired',
      payment_status: 'unpaid',
      expired_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingDone(bookingId: string, recommendedNextStep?: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (current.paymentStatus !== 'paid') {
    throw new Error('Nie mozna oznaczyc jako done nieoplaconej konsultacji.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({
      booking_status: 'done',
      recommended_next_step: recommendedNextStep ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapBookingRow(data as BookingRow) : null
}

export async function markBookingReminderSent(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('bookings')
    .update({
      reminder_sent: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapBookingRow(data as BookingRow) : null
}
