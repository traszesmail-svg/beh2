import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import {
  buildPreparationVideoStoragePath,
  canEditPreparationMaterials,
  normalizePreparationLinkUrl,
  normalizePreparationNotes,
  PREPARATION_STORAGE_BUCKET,
  validatePreparationLinkUrl,
  validatePreparationNotes,
  validatePreparationVideoMeta,
} from '@/lib/preparation'
import { getBookingForViewer, updateBookingPreparation } from '@/lib/server/db'
import { ConfigurationError, getDataModeStatus, getSupabaseServerConfig } from '@/lib/server/env'
import { BookingPreparationPatch, BookingRecord } from '@/lib/types'

export const runtime = 'nodejs'

function resolveAccessToken(request: Request): string | null {
  return new URL(request.url).searchParams.get('access')
}

function buildPrepPayload(booking: BookingRecord) {
  return {
    hasVideo: Boolean(booking.prepVideoPath),
    prepVideoFilename: booking.prepVideoFilename ?? null,
    prepVideoSizeBytes: booking.prepVideoSizeBytes ?? null,
    prepLinkUrl: booking.prepLinkUrl ?? null,
    prepNotes: booking.prepNotes ?? null,
    prepUploadedAt: booking.prepUploadedAt ?? null,
    canEdit: canEditPreparationMaterials(booking),
  }
}

async function resolveViewerBooking(request: Request, bookingId: string) {
  return getBookingForViewer(bookingId, resolveAccessToken(request), request.headers.get('authorization'))
}

function getLocalVideoAbsolutePath(bookingId: string) {
  return path.join(process.cwd(), 'data', 'prep-materials', ...buildPreparationVideoStoragePath(bookingId).split('/'))
}

function getSupabaseAdmin() {
  const config = getSupabaseServerConfig('materialy przygotowawcze do rozmowy')

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Nie udalo sie zapisac materialow przygotowawczych.'
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await resolveViewerBooking(request, params.id)

    if (!booking) {
      return NextResponse.json({ error: 'Ten link do materialow jest nieprawidlowy albo wygasl.' }, { status: 403 })
    }

    if (!canEditPreparationMaterials(booking)) {
      return NextResponse.json(
        { error: 'Materialy mozna dodawac lub zmieniac tylko przed rozpoczeciem albo w trakcie aktywnej rezerwacji.' },
        { status: 409 },
      )
    }

    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      const dataMode = getDataModeStatus()

      if (dataMode.active !== 'local') {
        return NextResponse.json(
          { error: 'W tym trybie nagranie przesylane jest bezposrednio do bezpiecznego magazynu plikow.' },
          { status: 400 },
        )
      }

      const formData = await request.formData()
      const file = formData.get('file')

      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Wybierz plik MP4 do wyslania.' }, { status: 400 })
      }

      const validationError = validatePreparationVideoMeta({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      })

      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 })
      }

      const absolutePath = getLocalVideoAbsolutePath(booking.id)
      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

      const updatedBooking = await updateBookingPreparation(booking.id, {
        prepVideoPath: buildPreparationVideoStoragePath(booking.id),
        prepVideoFilename: file.name,
        prepVideoSizeBytes: file.size,
        prepUploadedAt: new Date().toISOString(),
      })

      if (!updatedBooking) {
        return NextResponse.json({ error: 'Nie znaleziono rezerwacji do zapisania materialow.' }, { status: 404 })
      }

      return NextResponse.json({ ok: true, prep: buildPrepPayload(updatedBooking) })
    }

    const body = (await request.json()) as {
      action?: string
      fileName?: string
      fileSize?: number
      contentType?: string
    }

    if (body.action !== 'get-upload-target') {
      return NextResponse.json({ error: 'Niepoprawna akcja materialow.' }, { status: 400 })
    }

    const validationError = validatePreparationVideoMeta({
      fileName: body.fileName ?? '',
      contentType: body.contentType,
      size: body.fileSize ?? 0,
    })

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const dataMode = getDataModeStatus()

    if (dataMode.active === 'local') {
      return NextResponse.json({ ok: true, mode: 'local' as const })
    }

    const supabase = getSupabaseAdmin()
    const storagePath = buildPreparationVideoStoragePath(booking.id)
    const { data, error } = await supabase.storage
      .from(PREPARATION_STORAGE_BUCKET)
      .createSignedUploadUrl(storagePath, { upsert: true })

    if (error || !data) {
      throw error ?? new Error('Nie udalo sie przygotowac bezpiecznego uploadu nagrania.')
    }

    return NextResponse.json({
      ok: true,
      mode: 'supabase' as const,
      signedUrl: data.signedUrl,
      storagePath: data.path,
    })
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: error instanceof ConfigurationError ? 503 : 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await resolveViewerBooking(request, params.id)

    if (!booking) {
      return NextResponse.json({ error: 'Ten link do materialow jest nieprawidlowy albo wygasl.' }, { status: 403 })
    }

    if (!canEditPreparationMaterials(booking)) {
      return NextResponse.json(
        { error: 'Materialy mozna zmieniac tylko dla aktywnej rezerwacji lub potwierdzonej rozmowy.' },
        { status: 409 },
      )
    }

    const body = (await request.json()) as {
      prepLinkUrl?: string
      prepNotes?: string
      prepVideoPath?: string
      prepVideoFilename?: string
      prepVideoSizeBytes?: number
    }

    const patch: BookingPreparationPatch = {}

    if (Object.prototype.hasOwnProperty.call(body, 'prepLinkUrl')) {
      const linkError = validatePreparationLinkUrl(body.prepLinkUrl)

      if (linkError) {
        return NextResponse.json({ error: linkError }, { status: 400 })
      }

      patch.prepLinkUrl = normalizePreparationLinkUrl(body.prepLinkUrl)
    }

    if (Object.prototype.hasOwnProperty.call(body, 'prepNotes')) {
      const notesError = validatePreparationNotes(body.prepNotes)

      if (notesError) {
        return NextResponse.json({ error: notesError }, { status: 400 })
      }

      patch.prepNotes = normalizePreparationNotes(body.prepNotes)
    }

    if (Object.prototype.hasOwnProperty.call(body, 'prepVideoPath')) {
      const expectedStoragePath = buildPreparationVideoStoragePath(booking.id)

      if (body.prepVideoPath !== expectedStoragePath) {
        return NextResponse.json({ error: 'Sciezka nagrania jest nieprawidlowa.' }, { status: 400 })
      }

      const videoError = validatePreparationVideoMeta({
        fileName: body.prepVideoFilename ?? '',
        contentType: 'video/mp4',
        size: body.prepVideoSizeBytes ?? 0,
      })

      if (videoError) {
        return NextResponse.json({ error: videoError }, { status: 400 })
      }

      patch.prepVideoPath = expectedStoragePath
      patch.prepVideoFilename = body.prepVideoFilename ?? null
      patch.prepVideoSizeBytes = body.prepVideoSizeBytes ?? null
      patch.prepUploadedAt = new Date().toISOString()
    }

    const updatedBooking = await updateBookingPreparation(booking.id, patch)

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Nie znaleziono rezerwacji do aktualizacji.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, prep: buildPrepPayload(updatedBooking) })
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: error instanceof ConfigurationError ? 503 : 500 },
    )
  }
}
