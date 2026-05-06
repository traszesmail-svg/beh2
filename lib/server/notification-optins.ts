import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'fs/promises'
import path from 'path'
import { getLocalStoreDataDir } from '@/lib/server/local-store-path'

export type NotificationChannel = 'whatsapp' | 'sms'
export type NotificationOptInStatus = 'subscribed' | 'unsubscribed'

export type NotificationOptInRecord = {
  id: string
  phone: string
  channel: NotificationChannel
  sourcePage: string | null
  location: string | null
  context: string | null
  recommendedService: string | null
  status: NotificationOptInStatus
  createdAt: string
  updatedAt: string
  unsubscribedAt: string | null
}

type NotificationOptInInput = {
  phone: string
  channel: NotificationChannel
  sourcePage?: string | null
  location?: string | null
  context?: string | null
  recommendedService?: string | null
}

function getStorePath() {
  return path.join(getLocalStoreDataDir(), 'notification-optins.json')
}

function getSubscriptionKey(phone: string, channel: NotificationChannel) {
  return `${channel}:${phone}`
}

async function writeLocalRecords(records: NotificationOptInRecord[]) {
  const filePath = getStorePath()
  const tempFilePath = `${filePath}.${process.pid}.${Date.now()}.tmp`
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(tempFilePath, JSON.stringify(records, null, 2), 'utf8')

  try {
    await rename(tempFilePath, filePath)
  } finally {
    await rm(tempFilePath, { force: true })
  }
}

async function readLocalRecords(): Promise<NotificationOptInRecord[]> {
  const filePath = getStorePath()
  await mkdir(path.dirname(filePath), { recursive: true })

  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as NotificationOptInRecord[]
  } catch {
    await writeLocalRecords([])
    return []
  }
}

export async function upsertNotificationOptIn(input: NotificationOptInInput): Promise<NotificationOptInRecord> {
  const records = await readLocalRecords()
  const nowIso = new Date().toISOString()
  const key = getSubscriptionKey(input.phone, input.channel)
  const existingIndex = records.findIndex((record) => getSubscriptionKey(record.phone, record.channel) === key)

  const record: NotificationOptInRecord = {
    id: existingIndex >= 0 ? records[existingIndex]!.id : randomUUID(),
    phone: input.phone,
    channel: input.channel,
    sourcePage: input.sourcePage ?? null,
    location: input.location ?? null,
    context: input.context ?? null,
    recommendedService: input.recommendedService ?? null,
    status: 'subscribed',
    createdAt: existingIndex >= 0 ? records[existingIndex]!.createdAt : nowIso,
    updatedAt: nowIso,
    unsubscribedAt: null,
  }

  if (existingIndex >= 0) {
    records[existingIndex] = record
  } else {
    records.unshift(record)
  }

  await writeLocalRecords(records)
  return record
}

export async function unsubscribeNotificationOptIn(
  phone: string,
  channel: NotificationChannel,
): Promise<NotificationOptInRecord | null> {
  const records = await readLocalRecords()
  const nowIso = new Date().toISOString()
  const key = getSubscriptionKey(phone, channel)
  let updatedRecord: NotificationOptInRecord | null = null

  const updated = records.map((record) => {
    if (getSubscriptionKey(record.phone, record.channel) !== key) {
      return record
    }

    const nextRecord: NotificationOptInRecord = {
      ...record,
      status: 'unsubscribed',
      updatedAt: nowIso,
      unsubscribedAt: nowIso,
    }

    updatedRecord = nextRecord
    return nextRecord
  })

  await writeLocalRecords(updated)
  return updatedRecord
}
