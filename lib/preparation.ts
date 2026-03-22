import { BookingRecord } from '@/lib/types'

export const PREPARATION_VIDEO_MAX_DURATION_SECONDS = 5 * 60
export const PREPARATION_VIDEO_MAX_SIZE_BYTES = 125 * 1024 * 1024
export const PREPARATION_NOTES_MAX_LENGTH = 1500
export const PREPARATION_STORAGE_BUCKET = 'booking-prep-materials'
export const PREPARATION_STORAGE_FILE_NAME = 'prep-video.mp4'

const ALLOWED_VIDEO_CONTENT_TYPES = new Set(['video/mp4', 'application/mp4'])

type PreparationVideoMeta = {
  fileName: string
  contentType: string | null | undefined
  size: number
}

export function buildPreparationVideoStoragePath(bookingId: string): string {
  return `${bookingId}/${PREPARATION_STORAGE_FILE_NAME}`
}

export function formatPreparationFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) {
    return '0 MB'
  }

  const sizeInMb = bytes / (1024 * 1024)

  if (sizeInMb >= 10) {
    return `${Math.round(sizeInMb)} MB`
  }

  return `${sizeInMb.toFixed(1).replace('.', ',')} MB`
}

export function hasPreparationMaterials(
  booking: Pick<BookingRecord, 'prepVideoPath' | 'prepLinkUrl' | 'prepNotes'>,
): boolean {
  return Boolean(booking.prepVideoPath || booking.prepLinkUrl || booking.prepNotes)
}

export function canEditPreparationMaterials(
  booking: Pick<BookingRecord, 'bookingStatus'>,
): boolean {
  return booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed'
}

export function normalizePreparationLinkUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  const url = new URL(trimmed)

  if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
    throw new Error('Link musi zaczynać się od http:// lub https://.')
  }

  return url.toString()
}

export function normalizePreparationNotes(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function validatePreparationNotes(value: string | null | undefined): string | null {
  const normalized = normalizePreparationNotes(value)

  if (!normalized) {
    return null
  }

  if (normalized.length > PREPARATION_NOTES_MAX_LENGTH) {
    return `Opis sytuacji może mieć maksymalnie ${PREPARATION_NOTES_MAX_LENGTH} znaków.`
  }

  return null
}

export function validatePreparationLinkUrl(value: string | null | undefined): string | null {
  try {
    normalizePreparationLinkUrl(value)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Podaj poprawny link do materiału.'
  }
}

export function validatePreparationVideoMeta({ fileName, contentType, size }: PreparationVideoMeta): string | null {
  const normalizedFileName = fileName.trim().toLowerCase()

  if (!normalizedFileName.endsWith('.mp4')) {
    return 'Akceptujemy tylko pliki MP4.'
  }

  if (!contentType || !ALLOWED_VIDEO_CONTENT_TYPES.has(contentType.toLowerCase())) {
    return 'Nagranie musi być zapisane jako plik MP4.'
  }

  if (!Number.isFinite(size) || size <= 0) {
    return 'Nagranie jest puste albo uszkodzone.'
  }

  if (size > PREPARATION_VIDEO_MAX_SIZE_BYTES) {
    return `Nagranie może mieć maksymalnie ${formatPreparationFileSize(PREPARATION_VIDEO_MAX_SIZE_BYTES)}.`
  }

  return null
}
