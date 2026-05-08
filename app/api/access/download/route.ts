export const dynamic = 'force-dynamic'
export const revalidate = 0

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import {
  getMaterialyBundleBySlug,
  getMaterialyGuideBySlug,
} from '@/lib/materialy-catalog'
import {
  canUseCommerceAccess,
  getCommerceOrderByAccessCode,
  recordCommerceAccessUse,
} from '@/lib/server/commerce-store'

const PDF_DIR = path.join(process.cwd(), 'content', 'guides', 'pdf')

function safePdfPath(filename: string): string | null {
  const resolved = path.resolve(PDF_DIR, filename)
  return resolved.startsWith(PDF_DIR) ? resolved : null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')?.trim().toUpperCase() ?? ''
  const email = url.searchParams.get('email')?.trim().toLowerCase() ?? ''
  const partRaw = url.searchParams.get('part') ?? '0'
  const part = Number.parseInt(partRaw, 10)

  const order = await getCommerceOrderByAccessCode(code, email)

  if (!order || order.productType !== 'ebook' || !canUseCommerceAccess(order)) {
    return NextResponse.json({ error: 'Kod jest nieprawidłowy albo wygasł.' }, { status: 400 })
  }

  let pdfFile: string | null = null

  if (order.meta.productKind === 'guide' && order.meta.productSlug) {
    const guide = getMaterialyGuideBySlug(order.meta.productSlug)
    pdfFile = guide?.pdfFile ?? null
  }

  if (order.meta.productKind === 'bundle' && order.meta.productSlug) {
    const bundle = getMaterialyBundleBySlug(order.meta.productSlug)
    const guideSlug = bundle?.guideSlugs[Number.isFinite(part) ? part : 0]
    const guide = guideSlug ? getMaterialyGuideBySlug(guideSlug) : null
    pdfFile = guide?.pdfFile ?? null
  }

  if (!pdfFile) {
    return NextResponse.json({ error: 'Materiał nie jest dostępny.' }, { status: 410 })
  }

  const filePath = safePdfPath(pdfFile)
  if (!filePath) {
    return NextResponse.json({ error: 'Niepoprawna ścieżka pliku.' }, { status: 500 })
  }

  let buffer: Buffer
  try {
    buffer = await fs.readFile(filePath)
  } catch {
    return NextResponse.json({ error: 'Plik PDF nie został znaleziony.' }, { status: 410 })
  }

  await recordCommerceAccessUse(order.orderNumber)

  return new NextResponse(buffer, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${pdfFile}"`,
      'cache-control': 'no-store',
    },
  })
}
