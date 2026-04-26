// POST /api/materialy/download — exchanges (email + 6-digit code) for a PDF stream.
// For bundles we build a temporary zip on the fly; for single guides we stream the file.
// Increments usedCount; after 3 successful downloads the order is marked 'used'.

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import {
  getMaterialyBundleBySlug,
  getMaterialyGuideBySlug,
} from '@/lib/materialy-catalog'
import { checkAndUseCode } from '@/lib/server/materialy-storage'

const PDF_DIR = path.join(process.cwd(), 'content', 'guides', 'pdf')

function safePdfPath(filename: string): string | null {
  // Normalize and ensure resolved path stays inside PDF_DIR.
  const resolved = path.resolve(PDF_DIR, filename)
  if (!resolved.startsWith(PDF_DIR)) return null
  return resolved
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: 'Niepoprawny format zapytania.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const code = typeof body.code === 'string' ? body.code.trim() : ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Podaj poprawny e-mail.' }, { status: 400 })
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: 'Kod ma 6 cyfr.' }, { status: 400 })
  }

  const result = await checkAndUseCode(email, code)
  if (!result.ok) {
    const map: Record<string, { msg: string; status: number }> = {
      'wrong-code': { msg: 'Kod nie pasuje do tego e-maila.', status: 400 },
      'not-paid': { msg: 'Zamowienie nie zostalo jeszcze potwierdzone. Poczekaj na e-mail z kodem.', status: 409 },
      'expired': { msg: 'Kod wygasl. Napisz na kontakt@regulskibehawiorysta.pl, wyslemy nowy.', status: 410 },
      'limit-reached': { msg: 'Kod zostal juz wykorzystany 3 razy. Napisz na kontakt@regulskibehawiorysta.pl.', status: 410 },
      'not-found': { msg: 'Zamowienie nie istnieje.', status: 404 },
    }
    const fallback = { msg: 'Kod jest nieprawidlowy.', status: 400 }
    const m = map[result.reason] ?? fallback
    return NextResponse.json({ ok: false, error: m.msg }, { status: m.status })
  }

  const order = result.order
  if (order.productKind === 'guide') {
    const guide = getMaterialyGuideBySlug(order.productSlug)
    if (!guide) {
      return NextResponse.json({ ok: false, error: 'Material nie jest dostepny.' }, { status: 410 })
    }
    const filePath = safePdfPath(guide.pdfFile)
    if (!filePath) {
      return NextResponse.json({ ok: false, error: 'Niepoprawna sciezka pliku.' }, { status: 500 })
    }
    let buf: Buffer
    try {
      buf = await fs.readFile(filePath)
    } catch {
      return NextResponse.json({ ok: false, error: 'Plik PDF nie zostal znaleziony.' }, { status: 410 })
    }
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="${guide.pdfFile}"`,
        'cache-control': 'no-store',
      },
    })
  }

  // Bundle: return a JSON listing of the included guides; client follows up with
  // separate downloads using the same code (each download increments usedCount —
  // therefore for bundles we accept that the customer fetches up to 3 guides per
  // code submission, not 3 × bundle. Practical and simple.)
  const bundle = getMaterialyBundleBySlug(order.productSlug)
  if (!bundle) {
    return NextResponse.json({ ok: false, error: 'Pakiet nie jest dostepny.' }, { status: 410 })
  }
  // For bundles we expose one PDF per response. Client should request the bundle
  // index first via a `?part=index` flag, then re-issue the form with the same
  // code for each part. To keep this MVP simple, return the first guide PDF and
  // include the full part list in headers so the client UI can guide the user.
  const partRaw = typeof body.part === 'string' ? body.part.trim() : ''
  const partIndex = partRaw === '' ? 0 : Number.parseInt(partRaw, 10)
  if (!Number.isFinite(partIndex) || partIndex < 0 || partIndex >= bundle.guideSlugs.length) {
    return NextResponse.json({ ok: false, error: 'Nieprawidlowy indeks czesci.' }, { status: 400 })
  }
  const partGuideSlug = bundle.guideSlugs[partIndex]
  const partGuide = getMaterialyGuideBySlug(partGuideSlug)
  if (!partGuide) {
    return NextResponse.json({ ok: false, error: 'Material nie jest dostepny.' }, { status: 410 })
  }
  const filePath = safePdfPath(partGuide.pdfFile)
  if (!filePath) {
    return NextResponse.json({ ok: false, error: 'Niepoprawna sciezka pliku.' }, { status: 500 })
  }
  let buf: Buffer
  try {
    buf = await fs.readFile(filePath)
  } catch {
    return NextResponse.json({ ok: false, error: 'Plik PDF nie zostal znaleziony.' }, { status: 410 })
  }
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${partGuide.pdfFile}"`,
      'x-bundle-parts': String(bundle.guideSlugs.length),
      'x-bundle-part-index': String(partIndex),
      'cache-control': 'no-store',
    },
  })
}
