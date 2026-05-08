export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getPublicProblemOptionById, type FunnelSpecies } from '@/lib/funnel'
import { ConfigurationError } from '@/lib/server/env'
import { sendOpinionSubmissionEmail } from '@/lib/server/notifications'
import { getContactDetails } from '@/lib/site'

const SUCCESS_MESSAGE = 'Dziękuję. Opinia została zapisana do ręcznego sprawdzenia.'
const UNAVAILABLE_MESSAGE = 'Formularz opinii jest chwilowo niedostępny. Spróbuj później albo wyślij wiadomość.'
const GENERIC_ERROR_MESSAGE = 'Nie udało się zapisać opinii. Spróbuj ponownie później.'

function getUnavailableMessage(): string {
  const contact = getContactDetails()

  if (contact.email) {
    return `Formularz opinii jest chwilowo niedostępny. Spróbuj później albo napisz na ${contact.email}.`
  }

  return UNAVAILABLE_MESSAGE
}

function normalizeSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeLongText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.replace(/\r\n/g, '\n').trim()
  return normalized.length > 0 ? normalized.slice(0, maxLength) : null
}

function normalizeSpecies(value: unknown): FunnelSpecies | null {
  const species = normalizeSingleLine(value, 32)?.toLowerCase() ?? null

  if (species === 'pies' || species === 'kot') {
    return species
  }

  return null
}

function validatePayload(body: Record<string, unknown>): {
  payload?:
    | {
        displayName: string
        species: FunnelSpecies
        topic: string
        opinion: string
        consentPublish: boolean
        website?: string | null
      }
    | undefined
  error?: string
} {
  const displayName = normalizeSingleLine(body.displayName, 120)
  const species = normalizeSpecies(body.species)
  const topicId = normalizeSingleLine(body.topicId, 80)
  const topic = species ? getPublicProblemOptionById(species, topicId)?.title ?? null : null
  const opinion = normalizeLongText(body.opinion, 1200)
  const consentPublish = body.consentPublish === true
  const website = normalizeSingleLine(body.website, 120) ?? ''

  if (!displayName || !species || !topic || !opinion) {
    return { error: 'Uzupełnij imię lub inicjały, gatunek, temat i treść opinii.' }
  }

  if (opinion.length < 20) {
    return { error: 'Dodaj kilka konkretnych zdań.' }
  }

  if (!consentPublish) {
    return { error: 'Zaznacz zgodę na publikację opinii.' }
  }

  return {
    payload: {
      displayName,
      species,
      topic,
      opinion,
      consentPublish,
      website,
    },
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>

    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Nie udało się odczytać formularza opinii.' }, { status: 400 })
    }

    const { payload, error } = validatePayload(body)

    if (error || !payload) {
      return NextResponse.json({ error: error ?? GENERIC_ERROR_MESSAGE }, { status: 400 })
    }

    if (payload.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    const delivery = await sendOpinionSubmissionEmail(payload)

    if (delivery.status === 'sent') {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE })
    }

    if (delivery.status === 'skipped') {
      console.warn('[regulski-behawiorysta][opinie] submission skipped', delivery.reason)
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    console.error('[regulski-behawiorysta][opinie] submission failed', delivery.reason)
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  } catch (error) {
    console.error('[regulski-behawiorysta][opinie] unexpected error', error)

    if (error instanceof ConfigurationError) {
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 })
    }

    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 500 })
  }
}
