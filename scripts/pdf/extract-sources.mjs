#!/usr/bin/env node
// Extracts DOCX v2 + spec.json from /c/tmp/pdf_sources/raw/*/ into content/guides/sources/<slug>/
// Each destination gets: source.docx, source.html, spec.json, prompt.txt
import { promises as fs } from 'node:fs'
import path from 'node:path'
import mammoth from 'mammoth'

const RAW_ROOT = 'C:/tmp/pdf_sources/raw'
const DEST_ROOT = path.join(process.cwd(), 'content/guides/sources')

// Map raw package folder name -> canonical slug used in the catalog.
// Keep slugs stable; they appear in URLs, filenames, and lib/pdf-guides.ts.
const PACKAGE_TO_SLUG = {
  'czy_twoj_pies_naprawde_potrzebuje_wiecej_ruchu_v2_paczka_clean': 'pies-ile-ruchu-potrzebuje',
  'dlaczego_pies_glupieje_na_smyczy_v2_paczka_clean': 'pies-glupieje-na-smyczy',
  'konflikt_miedzy_kotami_v2_paczka_final_clean': 'konflikt-miedzy-kotami',
  'kot_boi_sie_kuwety_v2_paczka_final_clean': 'kot-boi-sie-kuwety',
  'kot_broni_sie_przy_pielegnacji_albo_noszeniu_v2_paczka_final_clean': 'kot-broni-sie-przy-pielegnacji',
  'kot_budzi_dom_po_nocy_v2_paczka_final_clean': 'kot-budzi-dom-po-nocy',
  'kot_chowa_sie_po_zmianach_v2_paczka_final_clean': 'kot-chowa-sie-po-zmianach',
  'kot_gryzie_przy_glaskaniu_v2_paczka_final_clean': 'kot-gryzie-przy-glaskaniu',
  'kot_zyje_w_napieciu_v3_paczka_final_clean': 'kot-zyje-w-napieciu',
  'koty_zabawa_czy_napiecie_v2_paczka_final_clean': 'koty-zabawa-czy-napiecie',
  'miauczenie_o_swicie_v2_paczka_final_clean': 'miauczenie-o-swicie',
  'pies_broni_zasobow_v2_paczka_clean': 'pies-broni-zasobow',
  'pies_do_pracy_z_ludzmi_v2_paczka_clean': 'pies-do-pracy-z-ludzmi',
  'pies_niszczy_w_domu_v2_paczka_clean': 'pies-niszczy-w-domu',
  'pies_szczeka_na_gosci_i_dzwonek_v2_paczka_clean': 'pies-szczeka-na-gosci',
  'pies_zostaje_sam_i_wpada_w_panike_v2_paczka_clean': 'pies-zostaje-sam',
  'pogon_demolka_i_brak_hamulcow_v2_paczka_clean': 'pies-pogon-i-hamulce',
  'problem_poza_kuweta_v2_paczka_final_clean': 'kot-problem-poza-kuweta',
  'szczeniak_gryzie_i_skacze_v2_paczka_clean': 'szczeniak-gryzie-i-skacze',
  'szczeniak_nie_umie_sie_wyciszyc_v2_paczka_clean': 'szczeniak-wyciszanie',
  'trudny_spacer_v2_paczka_clean': 'pies-trudny-spacer',
}

async function extractPackage(pkgName, slug) {
  const src = path.join(RAW_ROOT, pkgName)
  const dest = path.join(DEST_ROOT, slug)
  await fs.mkdir(dest, { recursive: true })

  const files = await fs.readdir(src)
  const docx = files.find((f) => f.endsWith('.docx'))
  if (!docx) throw new Error(`No DOCX in ${pkgName}`)

  const docxPath = path.join(src, docx)
  const docxBuf = await fs.readFile(docxPath)
  await fs.writeFile(path.join(dest, 'source.docx'), docxBuf)

  // DOCX -> HTML via mammoth. Preserves headings, lists, tables.
  const result = await mammoth.convertToHtml({ buffer: docxBuf })
  await fs.writeFile(path.join(dest, 'source.html'), result.value, 'utf8')

  // Copy spec.json if present
  const specFile = files.find((f) => f === 'spec.json')
  if (specFile) {
    const spec = await fs.readFile(path.join(src, specFile), 'utf8')
    await fs.writeFile(path.join(dest, 'spec.json'), spec, 'utf8')
  }

  // Copy prompt.txt if present (for manual reference)
  const promptFile = files.find((f) => f === 'prompt.txt')
  if (promptFile) {
    const prompt = await fs.readFile(path.join(src, promptFile), 'utf8')
    await fs.writeFile(path.join(dest, 'prompt.txt'), prompt, 'utf8')
  }

  const warnings = result.messages.filter((m) => m.type !== 'info').length
  return { slug, html: result.value.length, warnings }
}

async function main() {
  await fs.mkdir(DEST_ROOT, { recursive: true })
  const results = []
  for (const [pkg, slug] of Object.entries(PACKAGE_TO_SLUG)) {
    try {
      const r = await extractPackage(pkg, slug)
      results.push(r)
      console.log(`OK  ${slug.padEnd(36)} html=${String(r.html).padStart(6)}B warn=${r.warnings}`)
    } catch (e) {
      console.error(`ERR ${slug}: ${e.message}`)
      results.push({ slug, error: e.message })
    }
  }
  const ok = results.filter((r) => !r.error).length
  console.log(`\nDone. ${ok}/${results.length} extracted to ${DEST_ROOT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
