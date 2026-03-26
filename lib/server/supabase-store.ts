import { createClient } from '@supabase/supabase-js'
import { compareDateAndTime, formatDateLabel, isFutureAvailabilitySlot } from '@/lib/data'
import { createActiveConsultationPrice, DEFAULT_PRICE_PLN, parseConsultationPriceInput } from '@/lib/pricing'
import { normalizePolishPhone } from '@/lib/phone'
import { buildSeedAvailabilitySlots, hasFutureAvailabilitySlots } from '@/lib/server/availability-seed'
import { createCustomerAccessToken, hashCustomerAccessToken } from '@/lib/server/customer-access'
import { getReservationWindowMinutes, getSupabaseServerConfig } from '@/lib/server/env'
import { createMeetingUrl } from '@/lib/server/jitsi'
import { getManualPaymentConfig } from '@/lib/server/payment-options'
import {
  sendBookingConfirmationEmail,
  sendBookingReservationCreatedEmail,
  shouldSendBookingConfirmationAfterPayment,
} from '@/lib/server/notifications'
import { sendPaymentConfirmationSms } from '@/lib/server/sms'
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
  payment_method: string | null
  payment_reference: string | null
  amount: number | string
  meeting_url: string
  created_at: string
  updated_at: string
  paid_at: string | null
  payment_reported_at: string | null
  payment_rejected_at: string | null
  payment_rejected_reason: string | null
  cancelled_at: string | null
  expired_at: string | null
  refunded_at: string | null
  checkout_session_id: string | null
  payment_intent_id: string | null
  payu_order_id: string | null
  payu_order_status: string | null
  customer_phone_normalized: string | null
  sms_confirmation_status: string | null
  sms_confirmation_sent_at: string | null
  sms_provider_message_id: string | null
  sms_error_code: string | null
  sms_error_message: string | null
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

type LegacyPaymentMeta = {
  version: 1
  method: 'manual' | 'payu'
  paymentReference?: string | null
  paymentReportedAt?: string | null
  paymentRejectedAt?: string | null
  paymentRejectedReason?: string | null
  payuOrderId?: string | null
  payuOrderStatus?: string | null
}

const LEGACY_PAYMENT_META_PREFIX = '__beh15_payment__:' as const
const LEGACY_PAYMENT_COLUMN_NAMES = [
  'payment_method',
  'payment_reference',
  'payu_order_id',
  'payu_order_status',
  'payment_reported_at',
  'payment_rejected_at',
  'payment_rejected_reason',
] as const

let paymentSchemaMode: 'unknown' | 'modern' | 'legacy' = 'unknown'
const LEGACY_SMS_COLUMN_NAMES = [
  'customer_phone_normalized',
  'sms_confirmation_status',
  'sms_confirmation_sent_at',
  'sms_provider_message_id',
  'sms_error_code',
  'sms_error_message',
] as const

let smsSchemaMode: 'unknown' | 'modern' | 'legacy' = 'unknown'

function setPaymentSchemaMode(mode: typeof paymentSchemaMode) {
  paymentSchemaMode = mode
}

function setSmsSchemaMode(mode: typeof smsSchemaMode) {
  smsSchemaMode = mode
}

function getErrorText(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return ''
  }

  const values = ['message', 'details', 'hint']
    .map((key) => {
      const value = Reflect.get(error, key)
      return typeof value === 'string' ? value : ''
    })
    .filter(Boolean)

  return values.join(' ').toLowerCase()
}

function isLegacyPaymentColumnError(error: unknown): boolean {
  const text = getErrorText(error)

  return LEGACY_PAYMENT_COLUMN_NAMES.some((column) => text.includes(column))
}

function isLegacySmsColumnError(error: unknown): boolean {
  const text = getErrorText(error)

  return LEGACY_SMS_COLUMN_NAMES.some((column) => text.includes(column))
}

function isLegacyManualStatusError(error: unknown): boolean {
  const text = getErrorText(error)

  return (
    text.includes('bookings_booking_status_check') ||
    text.includes('bookings_payment_status_check') ||
    text.includes('pending_manual_payment') ||
    text.includes('pending_manual_review') ||
    text.includes('payment_status') && text.includes('rejected')
  )
}

function shouldRetryWithLegacyPaymentSchema(error: unknown, includeManualStatuses = false): boolean {
  if (isLegacyPaymentColumnError(error)) {
    setPaymentSchemaMode('legacy')
    return true
  }

  if (includeManualStatuses && isLegacyManualStatusError(error)) {
    setPaymentSchemaMode('legacy')
    return true
  }

  return false
}

function shouldRetryWithLegacySmsSchema(error: unknown): boolean {
  if (isLegacySmsColumnError(error)) {
    setSmsSchemaMode('legacy')
    return true
  }

  return false
}

function encodeLegacyPaymentMeta(meta: LegacyPaymentMeta | null | undefined): string | null {
  if (!meta) {
    return null
  }

  return `${LEGACY_PAYMENT_META_PREFIX}${Buffer.from(JSON.stringify(meta), 'utf8').toString('base64url')}`
}

function decodeLegacyPaymentMeta(value: string | null | undefined): LegacyPaymentMeta | null {
  if (!value?.startsWith(LEGACY_PAYMENT_META_PREFIX)) {
    return null
  }

  try {
    const decoded = Buffer.from(value.slice(LEGACY_PAYMENT_META_PREFIX.length), 'base64url').toString('utf8')
    const parsed = JSON.parse(decoded) as Partial<LegacyPaymentMeta>

    if (parsed.version !== 1 || (parsed.method !== 'manual' && parsed.method !== 'payu')) {
      return null
    }

    return {
      version: 1,
      method: parsed.method,
      paymentReference: parsed.paymentReference ?? null,
      paymentReportedAt: parsed.paymentReportedAt ?? null,
      paymentRejectedAt: parsed.paymentRejectedAt ?? null,
      paymentRejectedReason: parsed.paymentRejectedReason ?? null,
      payuOrderId: parsed.payuOrderId ?? null,
      payuOrderStatus: parsed.payuOrderStatus ?? null,
    }
  } catch {
    return null
  }
}

function inferPaymentMethod(row: BookingRow, legacyMeta: LegacyPaymentMeta | null): BookingRecord['paymentMethod'] | null {
  if (row.payment_method) {
    return row.payment_method as BookingRecord['paymentMethod']
  }

  if (legacyMeta?.method) {
    return legacyMeta.method
  }

  if (
    row.payment_intent_id?.startsWith('mock-') ||
    row.checkout_session_id?.startsWith('mock-')
  ) {
    return 'mock'
  }

  if (row.checkout_session_id || row.payment_intent_id) {
    return 'stripe'
  }

  return null
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

function mapAvailabilitySlotToRow(slot: AvailabilitySlot): AvailabilityRow {
  return {
    id: slot.id,
    booking_date: slot.bookingDate,
    booking_time: slot.bookingTime,
    is_booked: slot.isBooked,
    locked_by_booking_id: slot.lockedByBookingId ?? null,
    locked_until: slot.lockedUntil ?? null,
    created_at: slot.createdAt,
    updated_at: slot.updatedAt,
  }
}

function mapBookingRow(row: BookingRow): BookingRecord {
  const legacyPaymentMeta = decodeLegacyPaymentMeta(row.recommended_next_step)
  const paymentMethod = inferPaymentMethod(row, legacyPaymentMeta)
  let bookingStatus = row.booking_status as BookingRecord['bookingStatus']
  let paymentStatus = row.payment_status as BookingRecord['paymentStatus']
  const paymentReference = row.payment_reference ?? legacyPaymentMeta?.paymentReference ?? null
  const paymentReportedAt = row.payment_reported_at ?? legacyPaymentMeta?.paymentReportedAt ?? null
  const paymentRejectedAt = row.payment_rejected_at ?? legacyPaymentMeta?.paymentRejectedAt ?? null
  const paymentRejectedReason = row.payment_rejected_reason ?? legacyPaymentMeta?.paymentRejectedReason ?? null
  const payuOrderId = row.payu_order_id ?? legacyPaymentMeta?.payuOrderId ?? null
  const payuOrderStatus = row.payu_order_status ?? legacyPaymentMeta?.payuOrderStatus ?? null

  if (legacyPaymentMeta?.method === 'manual') {
    if (bookingStatus === 'pending' && paymentStatus === 'unpaid' && paymentReportedAt) {
      bookingStatus = 'pending_manual_payment'
      paymentStatus = 'pending_manual_review'
    } else if (bookingStatus === 'cancelled' && paymentStatus === 'failed') {
      paymentStatus = 'rejected'
    } else if (bookingStatus === 'expired' && paymentStatus === 'unpaid' && paymentReportedAt) {
      paymentStatus = 'rejected'
    }
  }

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
    bookingStatus,
    paymentStatus,
    paymentMethod,
    paymentReference,
    amount: typeof row.amount === 'string' ? Number(row.amount) : row.amount,
    meetingUrl: row.meeting_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
    paymentReportedAt,
    paymentRejectedAt,
    paymentRejectedReason,
    cancelledAt: row.cancelled_at,
    expiredAt: row.expired_at,
    refundedAt: row.refunded_at,
    checkoutSessionId: row.checkout_session_id,
    paymentIntentId: row.payment_intent_id,
    payuOrderId,
    payuOrderStatus,
    customerPhoneNormalized: row.customer_phone_normalized ?? normalizePolishPhone(row.phone)?.e164 ?? null,
    smsConfirmationStatus: row.sms_confirmation_status as BookingRecord['smsConfirmationStatus'] | null,
    smsConfirmationSentAt: row.sms_confirmation_sent_at,
    smsProviderMessageId: row.sms_provider_message_id,
    smsErrorCode: row.sms_error_code,
    smsErrorMessage: row.sms_error_message,
    recommendedNextStep: legacyPaymentMeta ? null : row.recommended_next_step,
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

    if (paymentSchemaMode !== 'legacy') {
      const manualExpired = await supabase
        .from('bookings')
        .update({
          booking_status: 'expired',
          payment_status: 'rejected',
          payment_rejected_at: nowIso,
          payment_rejected_reason: 'Upłynął czas na potwierdzenie wpłaty.',
          expired_at: nowIso,
          updated_at: nowIso,
        })
        .eq('booking_status', 'pending_manual_payment')
        .eq('payment_status', 'pending_manual_review')
        .in('id', bookingIds)

      if (manualExpired.error) {
        if (!shouldRetryWithLegacyPaymentSchema(manualExpired.error, true)) {
          throw manualExpired.error
        }
      } else {
        setPaymentSchemaMode('modern')
      }
    }
  }
}

async function listAvailabilityRows(): Promise<AvailabilityRow[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (error) {
    throw error
  }

  return (data as AvailabilityRow[]) ?? []
}

async function ensureFutureAvailabilityRows(): Promise<AvailabilitySlot[]> {
  const currentRows = await listAvailabilityRows()
  const currentSlots = currentRows.map(mapAvailabilityRow)

  if (hasFutureAvailabilitySlots(currentSlots)) {
    return currentSlots
  }

  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const seedRows = buildSeedAvailabilitySlots(new Date(nowIso), nowIso).map(mapAvailabilitySlotToRow)

  if (seedRows.length > 0) {
    const { error } = await supabase.from('availability').upsert(seedRows, { onConflict: 'id' })

    if (error) {
      throw error
    }
  }

  return (await listAvailabilityRows()).map(mapAvailabilityRow)
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
  return groupAvailability((await ensureFutureAvailabilityRows()).filter((slot) => !slot.isBooked))
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
  return await ensureFutureAvailabilityRows()
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
    throw new Error('Nie można usunąć slotu, który jest zarezerwowany lub opłacony.')
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
  const commonInsertPayload = {
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
    recommended_next_step: null,
    prep_video_path: null,
    prep_video_filename: null,
    prep_video_size_bytes: null,
    prep_link_url: null,
    prep_notes: null,
    prep_uploaded_at: null,
    created_at: nowIso,
    updated_at: nowIso,
  }
  const smsInsertPayload = {
    ...commonInsertPayload,
    customer_phone_normalized: normalizePolishPhone(form.phone)?.e164 ?? null,
    sms_confirmation_status: null,
    sms_confirmation_sent_at: null,
    sms_provider_message_id: null,
    sms_error_code: null,
    sms_error_message: null,
  }
  const paymentOnlyInsertPayload = {
    ...commonInsertPayload,
    payment_method: null,
    payment_reference: null,
    payment_reported_at: null,
    payment_rejected_at: null,
    payment_rejected_reason: null,
    payu_order_id: null,
    payu_order_status: null,
  }
  const paymentModernInsertPayload = {
    ...paymentOnlyInsertPayload,
    customer_phone_normalized: normalizePolishPhone(form.phone)?.e164 ?? null,
    sms_confirmation_status: null,
    sms_confirmation_sent_at: null,
    sms_provider_message_id: null,
    sms_error_code: null,
    sms_error_message: null,
  }
  const legacyInsertPayload = {
    ...commonInsertPayload,
  }
  let inserted

  if (paymentSchemaMode === 'legacy' && smsSchemaMode === 'legacy') {
    inserted = await supabase.from('bookings').insert(legacyInsertPayload).select('*').single()
  } else if (paymentSchemaMode === 'legacy') {
    inserted = await supabase.from('bookings').insert(smsInsertPayload).select('*').single()

    if (inserted.error && shouldRetryWithLegacySmsSchema(inserted.error)) {
      inserted = await supabase.from('bookings').insert(legacyInsertPayload).select('*').single()
    } else if (!inserted.error) {
      setSmsSchemaMode('modern')
    }
  } else if (smsSchemaMode === 'legacy') {
    inserted = await supabase.from('bookings').insert(paymentOnlyInsertPayload).select('*').single()

    if (inserted.error && shouldRetryWithLegacyPaymentSchema(inserted.error)) {
      inserted = await supabase.from('bookings').insert(legacyInsertPayload).select('*').single()
    } else if (!inserted.error) {
      setPaymentSchemaMode('modern')
    }
  } else {
    inserted = await supabase.from('bookings').insert({
      ...paymentModernInsertPayload,
    }).select('*').single()

    if (inserted.error && shouldRetryWithLegacySmsSchema(inserted.error)) {
      inserted = await supabase.from('bookings').insert(paymentOnlyInsertPayload).select('*').single()

      if (inserted.error && shouldRetryWithLegacyPaymentSchema(inserted.error)) {
        inserted = await supabase.from('bookings').insert(legacyInsertPayload).select('*').single()
      } else if (!inserted.error) {
        setPaymentSchemaMode('modern')
      }
    } else if (inserted.error && shouldRetryWithLegacyPaymentSchema(inserted.error)) {
      inserted = await supabase.from('bookings').insert(legacyInsertPayload).select('*').single()
    } else if (!inserted.error) {
      setPaymentSchemaMode('modern')
      setSmsSchemaMode('modern')
    }
  }

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

export async function attachPayuOrder(
  bookingId: string,
  paymentData: { payuOrderId: string; payuOrderStatus?: string | null },
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const nowIso = new Date().toISOString()
  const legacyMeta = encodeLegacyPaymentMeta({
    version: 1,
    method: 'payu',
    payuOrderId: paymentData.payuOrderId,
    payuOrderStatus: paymentData.payuOrderStatus ?? null,
  })
  let result

  if (paymentSchemaMode === 'legacy') {
    result = await supabase
      .from('bookings')
      .update({
        recommended_next_step: legacyMeta,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
  } else {
    result = await supabase
      .from('bookings')
      .update({
        payment_method: 'payu',
        payu_order_id: paymentData.payuOrderId,
        payu_order_status: paymentData.payuOrderStatus ?? null,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (result.error && shouldRetryWithLegacyPaymentSchema(result.error)) {
      result = await supabase
        .from('bookings')
        .update({
          recommended_next_step: legacyMeta,
          updated_at: nowIso,
        })
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!result.error) {
      setPaymentSchemaMode('modern')
    }
  }

  if (result.error) {
    throw result.error
  }

  return result.data ? mapBookingRow(result.data as BookingRow) : null
}

export async function markBookingManualPaymentPending(
  bookingId: string,
  paymentData?: { paymentReference?: string | null },
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (
    !(
      (current.bookingStatus === 'pending' && current.paymentStatus === 'unpaid') ||
      (current.bookingStatus === 'pending_manual_payment' && current.paymentStatus === 'pending_manual_review')
    )
  ) {
    throw new Error('Tę rezerwację można zgłosić do potwierdzenia wpłaty tylko przed opłaceniem.')
  }

  const nowIso = new Date().toISOString()
  const holdUntil = new Date(Date.now() + getManualPaymentConfig().holdMinutes * 60 * 1000).toISOString()
  const paymentReference = paymentData?.paymentReference ?? current.paymentReference ?? null
  const legacyMeta = encodeLegacyPaymentMeta({
    version: 1,
    method: 'manual',
    paymentReference,
    paymentReportedAt: nowIso,
  })
  let bookingUpdate

  if (paymentSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'pending',
        payment_status: 'unpaid',
        recommended_next_step: legacyMeta,
        cancelled_at: null,
        expired_at: null,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
  } else {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'pending_manual_payment',
        payment_status: 'pending_manual_review',
        payment_method: 'manual',
        payment_reference: paymentReference,
        payment_reported_at: nowIso,
        payment_rejected_at: null,
        payment_rejected_reason: null,
        cancelled_at: null,
        expired_at: null,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error, true)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update({
          booking_status: 'pending',
          payment_status: 'unpaid',
          recommended_next_step: legacyMeta,
          cancelled_at: null,
          expired_at: null,
          updated_at: nowIso,
        })
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!bookingUpdate.error) {
      setPaymentSchemaMode('modern')
    }
  }

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  const slotUpdate = await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: bookingId,
      locked_until: holdUntil,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  if (slotUpdate.error) {
    throw slotUpdate.error
  }

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingPaid(
  bookingId: string,
  paymentData?: {
    checkoutSessionId?: string | null
    paymentIntentId?: string | null
    paymentMethod?: BookingRecord['paymentMethod']
    paymentReference?: string | null
    payuOrderId?: string | null
    payuOrderStatus?: string | null
    triggerPaymentConfirmationSms?: boolean
  },
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (
      !(
        (current.bookingStatus === 'pending' && current.paymentStatus === 'unpaid') ||
        (current.bookingStatus === 'pending_manual_payment' && current.paymentStatus === 'pending_manual_review') ||
        (current.bookingStatus === 'confirmed' && current.paymentStatus === 'paid') ||
        (current.bookingStatus === 'done' && current.paymentStatus === 'paid')
      )
  ) {
    throw new Error('Ten booking nie może już zostać opłacony.')
  }

  const nowIso = new Date().toISOString()
  const shouldSendConfirmation = shouldSendBookingConfirmationAfterPayment(current)
  const shouldAttemptSms = Boolean(paymentData?.triggerPaymentConfirmationSms) && !current.smsConfirmationStatus
  const paymentMethod = paymentData?.paymentMethod ?? current.paymentMethod ?? null
  const customerPhoneNormalized = current.customerPhoneNormalized ?? normalizePolishPhone(current.phone)?.e164 ?? null
  const legacyMeta =
    paymentMethod === 'manual'
      ? encodeLegacyPaymentMeta({
          version: 1,
          method: 'manual',
          paymentReference: paymentData?.paymentReference ?? current.paymentReference ?? null,
          paymentReportedAt: current.paymentReportedAt ?? nowIso,
        })
      : paymentMethod === 'payu'
        ? encodeLegacyPaymentMeta({
            version: 1,
            method: 'payu',
            payuOrderId: paymentData?.payuOrderId ?? current.payuOrderId ?? null,
            payuOrderStatus: paymentData?.payuOrderStatus ?? current.payuOrderStatus ?? 'COMPLETED',
        })
      : null
  const smsProcessingUpdate = shouldAttemptSms
    ? {
        customer_phone_normalized: customerPhoneNormalized,
        sms_confirmation_status: 'processing',
        sms_confirmation_sent_at: null,
        sms_provider_message_id: null,
        sms_error_code: null,
        sms_error_message: null,
      }
    : {
        customer_phone_normalized: customerPhoneNormalized,
      }
  const basePaymentUpdate = {
    booking_status: current.bookingStatus === 'done' ? 'done' : 'confirmed',
    payment_status: 'paid',
    paid_at: nowIso,
    cancelled_at: null,
    expired_at: null,
    updated_at: nowIso,
    checkout_session_id: paymentData?.checkoutSessionId ?? current.checkoutSessionId ?? null,
    payment_intent_id: paymentData?.paymentIntentId ?? current.paymentIntentId ?? null,
  }
  const paymentModernUpdate = {
    ...basePaymentUpdate,
    payment_method: paymentMethod,
    payment_reference: paymentData?.paymentReference ?? current.paymentReference ?? null,
    payment_rejected_at: null,
    payment_rejected_reason: null,
    payu_order_id: paymentData?.payuOrderId ?? current.payuOrderId ?? null,
    payu_order_status: paymentData?.payuOrderStatus ?? current.payuOrderStatus ?? null,
  }
  const legacyPaymentUpdate = {
    ...basePaymentUpdate,
    recommended_next_step: legacyMeta,
  }
  const paymentModernWithSmsUpdate = {
    ...paymentModernUpdate,
    ...smsProcessingUpdate,
  }
  const legacyPaymentWithSmsUpdate = {
    ...legacyPaymentUpdate,
    ...smsProcessingUpdate,
  }
  let bookingUpdate

  if (paymentSchemaMode === 'legacy' && smsSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update(legacyPaymentUpdate)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
  } else if (paymentSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update(legacyPaymentWithSmsUpdate)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacySmsSchema(bookingUpdate.error)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update(legacyPaymentUpdate)
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()

      if (!bookingUpdate.error) {
        setSmsSchemaMode('legacy')
      }
    } else if (!bookingUpdate.error) {
      setSmsSchemaMode('modern')
    }
  } else if (smsSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update(paymentModernUpdate)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update(legacyPaymentUpdate)
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!bookingUpdate.error) {
      setPaymentSchemaMode('modern')
    }
  } else {
    bookingUpdate = await supabase
      .from('bookings')
      .update(paymentModernWithSmsUpdate)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacySmsSchema(bookingUpdate.error)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update(paymentModernUpdate)
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()

      if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error)) {
        bookingUpdate = await supabase
          .from('bookings')
          .update(legacyPaymentUpdate)
          .eq('id', bookingId)
          .select('*')
          .maybeSingle()
      } else if (!bookingUpdate.error) {
        setPaymentSchemaMode('modern')
        setSmsSchemaMode('legacy')
      }
    } else if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update(legacyPaymentUpdate)
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!bookingUpdate.error) {
      setPaymentSchemaMode('modern')
      setSmsSchemaMode('modern')
    }
  }

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

  let booking = bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null

  if (shouldAttemptSms && booking && smsSchemaMode !== 'legacy') {
    const smsResult = await sendPaymentConfirmationSms(booking)
    const smsUpdatePayload = {
      customer_phone_normalized: smsResult.normalizedPhone ?? booking.customerPhoneNormalized ?? null,
      sms_confirmation_status: smsResult.status,
      sms_confirmation_sent_at: smsResult.status === 'sent' ? new Date().toISOString() : null,
      sms_provider_message_id: smsResult.providerMessageId ?? null,
      sms_error_code: smsResult.errorCode ?? null,
      sms_error_message: smsResult.errorMessage ?? null,
      updated_at: new Date().toISOString(),
    }
    const smsUpdate = await supabase
      .from('bookings')
      .update(smsUpdatePayload)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
    let smsUpdateData = smsUpdate.data
    let smsUpdateError = smsUpdate.error

    if (smsUpdateError && shouldRetryWithLegacySmsSchema(smsUpdateError)) {
      smsUpdateData = bookingUpdate.data
      smsUpdateError = null
    } else if (!smsUpdateError) {
      setSmsSchemaMode('modern')
    }

    if (smsUpdateError) {
      throw smsUpdateError
    }

    booking = smsUpdateData ? mapBookingRow(smsUpdateData as BookingRow) : booking
  }

  return booking
}

export async function markBookingPaymentFailed(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (current.paymentStatus === 'paid' || current.bookingStatus === 'done') {
    throw new Error('Nie można oznaczyć opłaconego bookingu jako nieudany.')
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

export async function markBookingManualPaymentRejected(
  bookingId: string,
  reason?: string,
): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (current.paymentStatus === 'paid' || current.bookingStatus === 'done') {
    throw new Error('Nie można odrzucić wpłaty dla opłaconej konsultacji.')
  }

  const nowIso = new Date().toISOString()
  const rejectionReason = reason ?? 'Nie znaleziono wpłaty.'
  const legacyMeta = encodeLegacyPaymentMeta({
    version: 1,
    method: 'manual',
    paymentReference: current.paymentReference ?? null,
    paymentReportedAt: current.paymentReportedAt ?? null,
    paymentRejectedAt: nowIso,
    paymentRejectedReason: rejectionReason,
  })
  let bookingUpdate

  if (paymentSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        payment_status: 'failed',
        cancelled_at: nowIso,
        updated_at: nowIso,
        recommended_next_step: legacyMeta,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
  } else {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        payment_status: 'rejected',
        payment_method: current.paymentMethod ?? 'manual',
        payment_rejected_at: nowIso,
        payment_rejected_reason: rejectionReason,
        cancelled_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error, true)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update({
          booking_status: 'cancelled',
          payment_status: 'failed',
          cancelled_at: nowIso,
          updated_at: nowIso,
          recommended_next_step: legacyMeta,
        })
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!bookingUpdate.error) {
      setPaymentSchemaMode('modern')
    }
  }

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  const slotUpdate = await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  if (slotUpdate.error) {
    throw slotUpdate.error
  }

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingRefunded(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  if (current.paymentStatus !== 'paid' || current.bookingStatus !== 'confirmed') {
    throw new Error('Tylko świeżo opłacona, potwierdzona rezerwacja może zostać anulowana z automatycznym zwrotem.')
  }

  const nowIso = new Date().toISOString()
  const bookingUpdate = await supabase
    .from('bookings')
    .update({
      booking_status: 'cancelled',
      payment_status: 'refunded',
      cancelled_at: nowIso,
      refunded_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', bookingId)
    .select('*')
    .maybeSingle()

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  const slotUpdate = await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: nowIso,
    })
    .eq('id', current.slotId)

  if (slotUpdate.error) {
    throw slotUpdate.error
  }

  return bookingUpdate.data ? mapBookingRow(bookingUpdate.data as BookingRow) : null
}

export async function markBookingExpired(bookingId: string): Promise<BookingRecord | null> {
  const supabase = getSupabaseAdmin()
  const current = await getBookingById(bookingId)

  if (!current) {
    return null
  }

  const nowIso = new Date().toISOString()
  const manualExpiryReason = current.paymentRejectedReason ?? 'Upłynął czas na potwierdzenie wpłaty.'
  const legacyMeta =
    current.paymentStatus === 'pending_manual_review'
      ? encodeLegacyPaymentMeta({
          version: 1,
          method: 'manual',
          paymentReference: current.paymentReference ?? null,
          paymentReportedAt: current.paymentReportedAt ?? null,
          paymentRejectedAt: nowIso,
          paymentRejectedReason: manualExpiryReason,
        })
      : current.paymentMethod === 'payu'
        ? encodeLegacyPaymentMeta({
            version: 1,
            method: 'payu',
            payuOrderId: current.payuOrderId ?? null,
            payuOrderStatus: current.payuOrderStatus ?? null,
          })
        : null
  let bookingUpdate

  if (paymentSchemaMode === 'legacy') {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'expired',
        payment_status: 'unpaid',
        expired_at: nowIso,
        updated_at: nowIso,
        recommended_next_step: legacyMeta,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()
  } else {
    bookingUpdate = await supabase
      .from('bookings')
      .update({
        booking_status: 'expired',
        payment_status: current.paymentStatus === 'pending_manual_review' ? 'rejected' : 'unpaid',
        payment_rejected_at: current.paymentStatus === 'pending_manual_review' ? nowIso : current.paymentRejectedAt ?? null,
        payment_rejected_reason:
          current.paymentStatus === 'pending_manual_review'
            ? manualExpiryReason
            : current.paymentRejectedReason ?? null,
        expired_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (bookingUpdate.error && shouldRetryWithLegacyPaymentSchema(bookingUpdate.error, true)) {
      bookingUpdate = await supabase
        .from('bookings')
        .update({
          booking_status: 'expired',
          payment_status: 'unpaid',
          expired_at: nowIso,
          updated_at: nowIso,
          recommended_next_step: legacyMeta,
        })
        .eq('id', bookingId)
        .select('*')
        .maybeSingle()
    } else if (!bookingUpdate.error) {
      setPaymentSchemaMode('modern')
    }
  }

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
    throw new Error('Nie można oznaczyć jako done nieopłaconej konsultacji.')
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
