import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { FunnelSpecies } from '@/lib/funnel'
import type { ProblemType } from '@/lib/types'
import { type UrgentNowRequestRecord } from '@/lib/urgent-now'
import { getLocalStoreDataDir } from './local-store-path'

type CreateUrgentNowRequestInput = {
  name: string
  email: string
  species: FunnelSpecies
  topicId: ProblemType
  topicLabel: string
  message: string
  requestedDate: string
  requestedTime: string
}

type RespondUrgentNowRequestInput = {
  id: string
  proposedDate: string
  proposedTime: string
  responseNote?: string | null
  availabilitySlotId?: string | null
  bookingHref?: string | null
}

type StoreShape = {
  requests: UrgentNowRequestRecord[]
}

function getUrgentRequestsPath(rootDir = process.cwd()) {
  return path.join(getLocalStoreDataDir(rootDir), 'urgent-now-requests.json')
}

async function readStore(): Promise<StoreShape> {
  const filePath = getUrgentRequestsPath()

  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as Partial<StoreShape>
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
    }
  } catch {
    return { requests: [] }
  }
}

async function writeStore(store: StoreShape) {
  const filePath = getUrgentRequestsPath()
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function listUrgentNowRequests() {
  const store = await readStore()
  return [...store.requests].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export async function createUrgentNowRequest(input: CreateUrgentNowRequestInput) {
  const now = new Date().toISOString()
  const store = await readStore()
  const record: UrgentNowRequestRecord = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'new',
    name: input.name,
    email: input.email,
    species: input.species,
    topicId: input.topicId,
    topicLabel: input.topicLabel,
    message: input.message,
    requestedDate: input.requestedDate,
    requestedTime: input.requestedTime,
    respondedAt: null,
    proposedDate: null,
    proposedTime: null,
    responseNote: null,
    availabilitySlotId: null,
    bookingHref: null,
  }

  store.requests.unshift(record)
  await writeStore(store)
  return record
}

export async function respondUrgentNowRequest(input: RespondUrgentNowRequestInput) {
  const store = await readStore()
  const request = store.requests.find((item) => item.id === input.id)

  if (!request) {
    return null
  }

  const now = new Date().toISOString()
  request.status = 'responded'
  request.updatedAt = now
  request.respondedAt = now
  request.proposedDate = input.proposedDate
  request.proposedTime = input.proposedTime
  request.responseNote = input.responseNote ?? null
  request.availabilitySlotId = input.availabilitySlotId ?? null
  request.bookingHref = input.bookingHref ?? null

  await writeStore(store)
  return request
}
