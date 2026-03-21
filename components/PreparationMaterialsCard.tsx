'use client'

import { useId, useState } from 'react'
import {
  formatPreparationFileSize,
  PREPARATION_NOTES_MAX_LENGTH,
  PREPARATION_VIDEO_MAX_DURATION_SECONDS,
  PREPARATION_VIDEO_MAX_SIZE_BYTES,
  validatePreparationLinkUrl,
  validatePreparationNotes,
  validatePreparationVideoMeta,
} from '@/lib/preparation'

type PreparationState = {
  hasVideo: boolean
  prepVideoFilename: string | null
  prepVideoSizeBytes: number | null
  prepLinkUrl: string | null
  prepNotes: string | null
  prepUploadedAt: string | null
}

interface PreparationMaterialsCardProps extends PreparationState {
  bookingId: string
  accessToken: string
  canEdit: boolean
}

function buildVideoUrl(bookingId: string, accessToken: string) {
  return `/api/bookings/${bookingId}/prep/video?access=${encodeURIComponent(accessToken)}`
}

async function readVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl)
      video.removeAttribute('src')
      video.load()
    }

    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : null
      cleanup()
      resolve(duration)
    }
    video.onerror = () => {
      cleanup()
      resolve(null)
    }
    video.src = objectUrl
  })
}

export function PreparationMaterialsCard({
  bookingId,
  accessToken,
  canEdit,
  hasVideo,
  prepVideoFilename,
  prepVideoSizeBytes,
  prepLinkUrl,
  prepNotes,
}: PreparationMaterialsCardProps) {
  const fileInputId = useId()
  const [linkValue, setLinkValue] = useState(prepLinkUrl ?? '')
  const [notesValue, setNotesValue] = useState(prepNotes ?? '')
  const [videoState, setVideoState] = useState({
    hasVideo,
    prepVideoFilename,
    prepVideoSizeBytes,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function savePrepMetadata(nextValues: Record<string, unknown>) {
    const response = await fetch(`/api/bookings/${bookingId}/prep?access=${encodeURIComponent(accessToken)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextValues),
    })

    const payload = (await response.json()) as {
      error?: string
      prep?: PreparationState
    }

    if (!response.ok || !payload.prep) {
      throw new Error(payload.error ?? 'Nie udalo sie zapisac materialow.')
    }

    setLinkValue(payload.prep.prepLinkUrl ?? '')
    setNotesValue(payload.prep.prepNotes ?? '')
    setVideoState({
      hasVideo: payload.prep.hasVideo,
      prepVideoFilename: payload.prep.prepVideoFilename,
      prepVideoSizeBytes: payload.prep.prepVideoSizeBytes,
    })
  }

  async function handleSaveDetails() {
    const linkError = validatePreparationLinkUrl(linkValue)

    if (linkError) {
      setError(linkError)
      setMessage('')
      return
    }

    const notesError = validatePreparationNotes(notesValue)

    if (notesError) {
      setError(notesError)
      setMessage('')
      return
    }

    setError('')
    setMessage('')
    setIsSaving(true)

    try {
      await savePrepMetadata({
        prepLinkUrl: linkValue,
        prepNotes: notesValue,
      })
      setMessage('Zapisano materialy do rozmowy.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Nie udalo sie zapisac materialow.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const videoError = validatePreparationVideoMeta({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    })

    if (videoError) {
      setError(videoError)
      setMessage('')
      event.target.value = ''
      return
    }

    const duration = await readVideoDuration(file)

    if (duration && duration > PREPARATION_VIDEO_MAX_DURATION_SECONDS) {
      setError('Nagranie powinno trwac maksymalnie 5 minut, zeby dalo sie je szybko obejrzec przed rozmowa.')
      setMessage('')
      event.target.value = ''
      return
    }

    setError('')
    setMessage('')
    setIsUploading(true)

    try {
      const prepResponse = await fetch(`/api/bookings/${bookingId}/prep?access=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-upload-target',
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        }),
      })

      const prepPayload = (await prepResponse.json()) as {
        error?: string
        mode?: 'supabase' | 'local'
        signedUrl?: string
        storagePath?: string
      }

      if (!prepResponse.ok || !prepPayload.mode) {
        throw new Error(prepPayload.error ?? 'Nie udalo sie przygotowac uploadu nagrania.')
      }

      if (prepPayload.mode === 'local') {
        const formData = new FormData()
        formData.append('file', file)

        const localResponse = await fetch(`/api/bookings/${bookingId}/prep?access=${encodeURIComponent(accessToken)}`, {
          method: 'POST',
          body: formData,
        })

        const localPayload = (await localResponse.json()) as {
          error?: string
          prep?: PreparationState
        }

        if (!localResponse.ok || !localPayload.prep) {
          throw new Error(localPayload.error ?? 'Nie udalo sie wyslac nagrania.')
        }

        setVideoState({
          hasVideo: localPayload.prep.hasVideo,
          prepVideoFilename: localPayload.prep.prepVideoFilename,
          prepVideoSizeBytes: localPayload.prep.prepVideoSizeBytes,
        })
      } else {
        if (!prepPayload.signedUrl || !prepPayload.storagePath) {
          throw new Error('Brakuje bezpiecznego adresu uploadu do magazynu plikow.')
        }

        const uploadBody = new FormData()
        uploadBody.append('cacheControl', '3600')
        uploadBody.append('', file)

        const uploadResponse = await fetch(prepPayload.signedUrl, {
          method: 'PUT',
          headers: {
            'x-upsert': 'true',
          },
          body: uploadBody,
        })

        if (!uploadResponse.ok) {
          throw new Error('Nie udalo sie przeslac nagrania do bezpiecznego magazynu.')
        }

        await savePrepMetadata({
          prepVideoPath: prepPayload.storagePath,
          prepVideoFilename: file.name,
          prepVideoSizeBytes: file.size,
        })
      }

      setMessage('Nagranie zostalo dodane do rezerwacji.')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Nie udalo sie dodac nagrania.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <section className="panel section-panel prep-panel">
      <div className="section-eyebrow">Przygotowanie do rozmowy</div>
      <h2>Przygotuj mnie do rozmowy</h2>
      <p className="muted paragraph-gap prep-copy">
        Jesli masz nagranie zachowania psa lub kota, mozesz dodac je przed rozmowa. To nie jest konsultacja wideo -
        material sluzy tylko do lepszego przygotowania do rozmowy glosowej.
      </p>

      <div className="prep-grid top-gap">
        <div className="prep-card">
          <strong>Nagranie MP4</strong>
          <span>
            Krotki material do 5 minut bardzo pomaga szybciej zrozumiec sytuacje. Akceptujemy tylko MP4 do{' '}
            {formatPreparationFileSize(PREPARATION_VIDEO_MAX_SIZE_BYTES)}.
          </span>

          {videoState.hasVideo ? (
            <a
              href={buildVideoUrl(bookingId, accessToken)}
              target="_blank"
              rel="noreferrer"
              className="prep-inline-link top-gap-small"
            >
              {videoState.prepVideoFilename ?? 'Otworz nagranie'}{' '}
              {videoState.prepVideoSizeBytes ? `(${formatPreparationFileSize(videoState.prepVideoSizeBytes)})` : ''}
            </a>
          ) : (
            <div className="muted top-gap-small">Nie dodano jeszcze nagrania.</div>
          )}

          {canEdit ? (
            <div className="top-gap">
              <label htmlFor={fileInputId} className="button button-ghost">
                {isUploading ? 'Wysylam nagranie...' : videoState.hasVideo ? 'Zastap nagranie' : 'Dodaj nagranie MP4'}
              </label>
              <input
                id={fileInputId}
                className="prep-file-input"
                type="file"
                accept="video/mp4"
                disabled={isUploading}
                onChange={handleFileChange}
              />
            </div>
          ) : null}
        </div>

        <div className="prep-card">
          <strong>Link do materialu</strong>
          <span>Moze to byc YouTube, Google Drive albo inny link, ktory jest publiczny lub poprawnie udostepniony specjaliscie.</span>
          <input
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            placeholder="https://..."
            disabled={!canEdit || isSaving}
            className="top-gap"
          />
        </div>
      </div>

      <div className="top-gap">
        <label>Krotki opis sytuacji</label>
        <textarea
          rows={5}
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
          disabled={!canEdit || isSaving}
          placeholder="Napisz, co dokladnie widac, kiedy problem sie pojawia i co chcesz omowic podczas rozmowy."
        />
        <div className="disclaimer top-gap-small">
          Maksymalnie {PREPARATION_NOTES_MAX_LENGTH} znakow. Wystarczy kilka konkretow: co widac, kiedy to sie dzieje,
          od kiedy trwa i co chcesz omowic na rozmowie.
        </div>
      </div>

      {error ? <div className="error-box top-gap">{error}</div> : null}
      {message ? <div className="info-box top-gap">{message}</div> : null}

      {canEdit ? (
        <div className="hero-actions top-gap">
          <button type="button" className="button button-primary" onClick={handleSaveDetails} disabled={isSaving || isUploading}>
            {isSaving ? 'Zapisuje informacje...' : 'Zapisz materialy do rozmowy'}
          </button>
        </div>
      ) : (
        <div className="info-box top-gap">Ta rezerwacja jest juz zamknieta, dlatego materialy pozostaja tylko do podgladu.</div>
      )}

      <div className="prep-checklist top-gap">
        <strong>Jak przygotowac sie do rozmowy w 2 minuty</strong>
        <ul>
          <li>Przygotuj 2-3 najwazniejsze pytania, od ktorych chcesz zaczac.</li>
          <li>Zanotuj, w jakich sytuacjach problem pojawia sie najczesciej.</li>
          <li>Jesli mozesz, przypomnij sobie plan spacerow, rytm dnia lub sytuacje wyzwalajace.</li>
          <li>Wystarczy krotki opis i jedno nagranie - nie potrzebujesz konsultacji wideo.</li>
        </ul>
      </div>
    </section>
  )
}
