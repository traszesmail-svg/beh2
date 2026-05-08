import { mkdir, readFile, rename, rm, writeFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { resolveDataMode } from '@/lib/server/env'
import { getLocalStoreDataDir } from '@/lib/server/local-store-path'

export type GrowthSignupKind = 'newsletter' | 'lead_magnet'

export type GrowthSignupRecord = {
  id: string
  email: string
  kind: GrowthSignupKind
  leadMagnetSlug: string | null
  location: string | null
  sourcePage: string | null
  segment: string | null
  createdAt: string
  welcomeSentAt: string | null
  followUpThreeSentAt: string | null
  followUpSevenSentAt: string | null
}

type GrowthSignupInput = {
  email: string
  kind: GrowthSignupKind
  leadMagnetSlug?: string | null
  location?: string | null
  sourcePage?: string | null
  segment?: string | null
}

function getSignupId(input: GrowthSignupInput) {
  return [input.kind, input.leadMagnetSlug ?? 'none', input.email.trim().toLowerCase()].join(':')
}

function shouldUseSupabase() {
  return (
    resolveDataMode('growth signups') === 'supabase' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  )
}

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(), process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function getStorePath() {
  return path.join(getLocalStoreDataDir(), 'growth-signups.json')
}

async function ensureLocalStore() {
  const filePath = getStorePath()
  await mkdir(path.dirname(filePath), { recursive: true })

  try {
    const raw = await readFile(filePath, 'utf8')
    JSON.parse(raw)
  } catch {
    await writeLocalRecords([])
  }
}

async function readLocalRecords(): Promise<GrowthSignupRecord[]> {
  await ensureLocalStore()
  return JSON.parse(await readFile(getStorePath(), 'utf8')) as GrowthSignupRecord[]
}

async function writeLocalRecords(records: GrowthSignupRecord[]) {
  const filePath = getStorePath()
  const tempFilePath = `${filePath}.${process.pid}.${Date.now()}.tmp`
  await writeFile(tempFilePath, JSON.stringify(records, null, 2), 'utf8')

  try {
    await rename(tempFilePath, filePath)
  } finally {
    await rm(tempFilePath, { force: true })
  }
}

export async function upsertGrowthSignup(input: GrowthSignupInput): Promise<GrowthSignupRecord> {
  const nowIso = new Date().toISOString()
  const record: GrowthSignupRecord = {
    id: getSignupId(input),
    email: input.email.trim().toLowerCase(),
    kind: input.kind,
    leadMagnetSlug: input.leadMagnetSlug ?? null,
    location: input.location ?? null,
    sourcePage: input.sourcePage ?? null,
    segment: input.segment ?? null,
    createdAt: nowIso,
    welcomeSentAt: null,
    followUpThreeSentAt: null,
    followUpSevenSentAt: null,
  }

  if (shouldUseSupabase()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('growth_signups')
      .upsert(
        {
          id: record.id,
          email: record.email,
          kind: record.kind,
          lead_magnet_slug: record.leadMagnetSlug,
          location: record.location,
          source_page: record.sourcePage,
          segment: record.segment,
          created_at: nowIso,
        },
        { onConflict: 'id' },
      )
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return {
      id: data.id,
      email: data.email,
      kind: data.kind,
      leadMagnetSlug: data.lead_magnet_slug,
      location: data.location,
      sourcePage: data.source_page,
      segment: data.segment,
      createdAt: data.created_at,
      welcomeSentAt: data.welcome_sent_at,
      followUpThreeSentAt: data.followup_three_sent_at,
      followUpSevenSentAt: data.followup_seven_sent_at,
    }
  }

  const records = await readLocalRecords()
  const existingIndex = records.findIndex((item) => item.id === record.id)

  if (existingIndex >= 0) {
    record.createdAt = records[existingIndex]!.createdAt
    record.welcomeSentAt = records[existingIndex]!.welcomeSentAt
    record.followUpThreeSentAt = records[existingIndex]!.followUpThreeSentAt
    record.followUpSevenSentAt = records[existingIndex]!.followUpSevenSentAt
    records[existingIndex] = record
  } else {
    records.unshift(record)
  }

  await writeLocalRecords(records)
  return record
}

export async function listGrowthSignups(): Promise<GrowthSignupRecord[]> {
  if (shouldUseSupabase()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('growth_signups').select('*').order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      kind: row.kind,
      leadMagnetSlug: row.lead_magnet_slug,
      location: row.location,
      sourcePage: row.source_page,
      segment: row.segment,
      createdAt: row.created_at,
      welcomeSentAt: row.welcome_sent_at,
      followUpThreeSentAt: row.followup_three_sent_at,
      followUpSevenSentAt: row.followup_seven_sent_at,
    }))
  }

  return readLocalRecords()
}

export async function markGrowthSignupStageSent(
  signupId: string,
  stage: 'welcome' | 'followup_three' | 'followup_seven',
): Promise<void> {
  const nowIso = new Date().toISOString()

  if (shouldUseSupabase()) {
    const supabase = getSupabaseAdmin()
    const patch =
      stage === 'welcome'
        ? { welcome_sent_at: nowIso }
        : stage === 'followup_three'
          ? { followup_three_sent_at: nowIso }
          : { followup_seven_sent_at: nowIso }
    const { error } = await supabase.from('growth_signups').update(patch).eq('id', signupId)

    if (error) {
      throw error
    }

    return
  }

  const records = await readLocalRecords()
  const updated = records.map((record) =>
    record.id === signupId
      ? {
          ...record,
          welcomeSentAt: stage === 'welcome' ? nowIso : record.welcomeSentAt,
          followUpThreeSentAt: stage === 'followup_three' ? nowIso : record.followUpThreeSentAt,
          followUpSevenSentAt: stage === 'followup_seven' ? nowIso : record.followUpSevenSentAt,
        }
      : record,
  )

  await writeLocalRecords(updated)
}
