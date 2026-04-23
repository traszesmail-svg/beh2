import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

function readSource(...segments: string[]) {
  return readFileSync(path.join(process.cwd(), ...segments), 'utf8')
}

test('stage 2b exposes paid PDF guides and bundles directly on the essentials page', () => {
  const source = readSource('app', 'niezbednik', 'page.tsx')

  assert.match(source, /import \{ PdfBundleCard \} from '@\/components\/PdfBundleCard'/)
  assert.match(source, /import \{ PdfGuideCard \} from '@\/components\/PdfGuideCard'/)
  assert.match(source, /import \{ listPdfBundles, listPdfGuides \} from '@\/lib\/pdf-guides'/)

  assert.match(source, /const paidGuides = listPdfGuides\(\)\.filter\(\(guide\) => guide\.accessType === 'low-ticket'\)/)
  assert.match(source, /const pdfBundles = listPdfBundles\(\)/)
  assert.match(source, /const catalogShelves = \[/)

  assert.match(source, /id="pdfy-do-kupienia"/)
  assert.match(source, /id="pakiety-pdf"/)
  assert.match(source, /Nie musisz juz zgadywac, gdzie sa materialy platne\./)
  assert.match(source, /Przejdz do PDF-ow do kupienia/)
  assert.match(source, /Przejdz do pakietow PDF/)

  assert.match(source, /<PdfGuideCard key=\{guide\.slug\} guide=\{guide\} compact \/>/)
  assert.match(source, /<PdfBundleCard key=\{bundle\.slug\} bundle=\{bundle\} \/>/)
  assert.match(source, /Z top menu trafiasz tu od razu do darmowych startow, platnych PDF-ow, pakietow PDF,/)
})
