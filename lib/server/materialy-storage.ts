// File-based storage for /materiały orders. Append-only JSON in data/materiały-orders.json.
// Trade-offs: zero infra, no concurrency control beyond a single Node process.
// Acceptable for low-volume manual BLIK fulfillment; promote to Supabase later if needed.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export type OrderStatus = 'pending' | 'paid' | 'used' | 'cancelled'

export type MaterialyOrder = {
  id: string                     // e.g. "M-LK4ZX9-7H3M"
  productKind: 'guide' | 'bundle'
  productSlug: string
  priceLabel: string             // human-readable label, e.g. "29 zł"
  priceAmount: number            // PLN integer
  customerName: string
  customerEmail: string
  customerPhone: string | null
  notes: string | null
  consents: { processing: boolean; policy: boolean }
  code: string | null            // 6-digit numeric, set when status -> 'paid'
  status: OrderStatus
  createdAt: string              // ISO
  paidAt: string | null
  usedCount: number              // increments on each successful download
  expiresAt: string | null       // ISO; set when paid (paidAt + 72h)
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'materialy-orders.json')

async function readAll(): Promise<MaterialyOrder[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(raw) as MaterialyOrder[]
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code?: string }).code === 'ENOENT') return []
    throw e
  }
}

async function writeAll(orders: MaterialyOrder[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

function makeId(): string {
  // 6 chars from timestamp base36 + 4 random — collisions vanishingly unlikely at scale.
  const ts = Date.now().toString(36).toUpperCase().slice(-6)
  const rnd = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4)
  return `M-${ts}-${rnd}`
}

function makeCode(): string {
  // 6-digit code sent to the customer after payment confirmation.
  return crypto.randomInt(100000, 999999).toString()
}

export async function createOrder(input: Omit<MaterialyOrder, 'id' | 'code' | 'status' | 'createdAt' | 'paidAt' | 'usedCount' | 'expiresAt'>): Promise<MaterialyOrder> {
  const orders = await readAll()
  const order: MaterialyOrder = {
    ...input,
    id: makeId(),
    code: null,
    status: input.priceAmount === 0 ? 'paid' : 'pending', // free items skip the BLIK step
    createdAt: new Date().toISOString(),
    paidAt: input.priceAmount === 0 ? new Date().toISOString() : null,
    usedCount: 0,
    expiresAt: input.priceAmount === 0
      ? new Date(Date.now() + 72 * 3600 * 1000).toISOString()
      : null,
  }
  if (input.priceAmount === 0) order.code = makeCode()
  orders.push(order)
  await writeAll(orders)
  return order
}

export async function getOrderById(id: string): Promise<MaterialyOrder | null> {
  const orders = await readAll()
  return orders.find((o) => o.id === id) ?? null
}

// Idempotent: if the order is already 'paid' or 'used', return it unchanged
// (preserving the previously issued code). Only flips 'pending' -> 'paid'.
export async function confirmPayment(id: string): Promise<MaterialyOrder | null> {
  const orders = await readAll()
  const i = orders.findIndex((o) => o.id === id)
  if (i < 0) return null
  if (orders[i].status === 'cancelled') return null
  if (orders[i].status === 'paid' || orders[i].status === 'used') {
    return orders[i]
  }
  orders[i].code = makeCode()
  orders[i].status = 'paid'
  orders[i].paidAt = new Date().toISOString()
  orders[i].expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString()
  await writeAll(orders)
  return orders[i]
}

export type DownloadCheckResult =
  | { ok: true; order: MaterialyOrder }
  | { ok: false; reason: 'not-found' | 'wrong-code' | 'not-paid' | 'expired' | 'limit-reached' }

export async function checkAndUseCode(email: string, code: string): Promise<DownloadCheckResult> {
  const orders = await readAll()
  const i = orders.findIndex(
    (o) => o.customerEmail.toLowerCase() === email.toLowerCase() && o.code === code,
  )
  if (i < 0) return { ok: false, reason: 'wrong-code' }
  const order = orders[i]
  if (order.status === 'cancelled') return { ok: false, reason: 'not-found' }
  if (order.status === 'pending') return { ok: false, reason: 'not-paid' }
  if (order.expiresAt && Date.now() > Date.parse(order.expiresAt)) {
    return { ok: false, reason: 'expired' }
  }
  if (order.usedCount >= 3) return { ok: false, reason: 'limit-reached' }
  orders[i].usedCount += 1
  if (orders[i].usedCount >= 3) orders[i].status = 'used'
  await writeAll(orders)
  return { ok: true, order: orders[i] }
}

export async function listPendingOrders(): Promise<MaterialyOrder[]> {
  const orders = await readAll()
  return orders.filter((o) => o.status === 'pending')
}

export async function listAllOrders(): Promise<MaterialyOrder[]> {
  return readAll()
}
