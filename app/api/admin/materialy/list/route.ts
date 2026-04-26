// GET /api/admin/materialy/list — list every order (admin view).
// Protected by middleware-level Basic Auth.

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { listAllOrders } from '@/lib/server/materialy-storage'

export async function GET() {
  const orders = await listAllOrders()
  // Most recent first.
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json({ ok: true, orders })
}
