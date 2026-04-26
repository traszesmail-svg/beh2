#!/usr/bin/env node
// Normalizes source.html from each guide into guide.html ready for PDF rendering.
// - Removes internal jargon ("Core PDF • ścieżka X", "flagship")
// - Deduplicates repeated "Dla kogo" / "Co znajdziesz" sections (mammoth produces box + heading duplicate)
// - Rewrites contact and service names to current marketing names
// - Classifies tables into semantic blocks (hero, callout, grid, data)
import { promises as fs } from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'

const SOURCES_ROOT = path.join(process.cwd(), 'content/guides/sources')

const TEXT_REPLACEMENTS = [
  // Contact
  [/coapebehawiorysta@gmail\.com/gi, 'kontakt@regulskibehawiorysta.pl'],
  [/beh2\.vercel\.app/gi, 'regulskibehawiorysta.pl'],
  [/coapebehawiorysta\.vercel\.app/gi, 'regulskibehawiorysta.pl'],
  // Service names (current marketing)
  [/szybka konsultacja 15\s*min/gi, 'Kwadrans z behawiorystą'],
  [/konsultacja 15\s*min/gi, 'Kwadrans z behawiorystą'],
  [/konsultacja 30\s*min/gi, 'Dwa kwadranse'],
  [/konsultacja dla kota/gi, 'Pełna konsultacja behawioralna'],
  [/konsultacja behawioralna online/gi, 'Pełna konsultacja behawioralna'],
  // Internal jargon — order matters; longest match first
  [/po szerszy pełny przewodnik o problemie poza kuwetą/gi, 'po pełny przewodnik o problemie poza kuwetą'],
  [/przejdź do flagshipu „Problem poza kuwetą"/gi, 'sięgnij po pełny przewodnik „Problem poza kuwetą"'],
  [/przejdź do flagshipu/gi, 'sięgnij po pełny przewodnik'],
  [/flagshipu/gi, 'pełnego przewodnika'],
  [/flagshipie/gi, 'pełnym przewodniku'],
  [/flagshipem/gi, 'pełnym przewodnikiem'],
  [/\bflagship\b/gi, 'pełny przewodnik'],
  [/To Przewodnik ścieżki [\p{L}]+:/giu, 'Ten przewodnik:'],
  [/To Przewodnik ścieżki [\p{L}]+/giu, 'Ten przewodnik'],
  [/\bCore PDF\b/gi, 'Przewodnik'],
]

function applyReplacements($) {
  $('*').each((_i, el) => {
    const node = $(el)
    if (node.children().length === 0) {
      let text = node.text()
      let changed = false
      for (const [re, out] of TEXT_REPLACEMENTS) {
        if (re.test(text)) {
          text = text.replace(re, out)
          changed = true
        }
      }
      if (changed) node.text(text)
    }
  })
  // Also normalize text nodes directly (for text inside elements with mixed children)
  const html = $.html()
  let out = html
  for (const [re, replacement] of TEXT_REPLACEMENTS) {
    out = out.replace(re, replacement)
  }
  return out
}

function normalizeHtml(rawHtml, spec) {
  // Load with a wrapper so cheerio keeps us tree-safe even without body
  const $ = cheerio.load(`<div id="root">${rawHtml}</div>`, { decodeEntities: false })
  const root = $('#root')

  // 1. Remove the first breadcrumb-like line: "Core PDF • ścieżka X" / "Materiał edukacyjny..."
  // These appear as <p><em>...</em></p> at the very top of the document before the hero table.
  root.children().slice(0, 3).each((_i, el) => {
    const n = $(el)
    const txt = n.text().trim()
    if (!txt) return
    const isBreadcrumb = /^(Core PDF|Materiał edukacyjny|Przewodnik)/i.test(txt)
    if (isBreadcrumb && n.find('em,i').length > 0) {
      n.remove()
    }
  })

  // 2. Classify tables
  root.find('table').each((_i, el) => {
    const table = $(el)
    const rows = table.find('tr')
    const cols = table.find('tr').first().find('td,th').length

    // Single-cell tables are callouts
    if (rows.length === 1 && cols === 1) {
      table.attr('data-kind', 'callout')
      // Detect the first strong as a label for styling
      const label = table.find('strong').first().text().trim()
      if (label) table.attr('data-label', label)
      return
    }

    // 1-column, multiple rows = a stack of callouts → keep as callouts per row
    if (cols === 1 && rows.length > 1) {
      table.attr('data-kind', 'callout-stack')
      return
    }

    // Multi-col with 1 row only = inline grid (like hero "co znajdziesz" layout)
    if (rows.length === 1 && cols > 1) {
      table.attr('data-kind', 'grid')
      return
    }

    // Multi-col with header row = data table
    table.attr('data-kind', 'data')
  })

  // 3. Deduplicate sections that mammoth produced twice — once as a callout-box
  // (single-cell table with <strong>HEADING</strong>) and once as <h1>HEADING</h1>
  // followed by a paragraph. Strategy: collect every callout label in the document,
  // then remove any h1/h2/h3/h4 + immediately-following <p> whose heading text
  // matches one of those labels (case-insensitive, strip trailing punctuation).
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/[„""''«»:?!.,;]+$/u, '')
      .replace(/[„""''«»]/gu, '')
      .trim()
  const calloutLabels = new Set()
  root.find('table[data-kind="callout"], table[data-kind="callout-stack"], strong').each((_i, el) => {
    if (el.tagName?.toLowerCase() === 'strong') {
      const t = $(el).text().trim()
      if (t.length >= 4 && t.length <= 60) calloutLabels.add(norm(t))
    } else {
      // table — also pull its data-label
      const lbl = $(el).attr('data-label') || ''
      if (lbl) calloutLabels.add(norm(lbl))
    }
  })

  root.find('h1,h2,h3,h4').each((_i, el) => {
    const h = $(el)
    const txt = norm(h.text())
    if (!txt) return
    if (calloutLabels.has(txt)) {
      const next = h.next()
      h.remove()
      if (next.is('p')) {
        // Only drop the paragraph if it's short (likely a subtitle to the duplicate
        // heading, not the actual flowing content of the next section).
        const pText = next.text().trim()
        if (pText.length < 600) next.remove()
      }
    }
  })

  // 4. Also drop the very first h1 if its text repeats the hero title (product name from spec).
  const heroTitle = spec?.source_spec_markdown?.match(/Nowa nazwa produktu\s*[\*\n]+([^\n]+)/i)?.[1]?.trim()
  if (heroTitle) {
    root.find('h1').each((_i, el) => {
      const h = $(el)
      if (h.text().trim().toLowerCase() === heroTitle.toLowerCase().replace(/\*\*/g, '').trim()) {
        const next = h.next()
        h.remove()
        if (next.is('p')) next.remove()
      }
    })
  }

  // 5. Apply global text replacements
  const normalizedHtml = applyReplacements($)
  // Strip the wrapper
  const m = normalizedHtml.match(/<div id="root">([\s\S]*)<\/div>/)
  return m ? m[1] : normalizedHtml
}

async function readJsonSafe(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function main() {
  const slugs = (await fs.readdir(SOURCES_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const slug of slugs) {
    const dir = path.join(SOURCES_ROOT, slug)
    const srcHtml = await fs.readFile(path.join(dir, 'source.html'), 'utf8')
    const spec = await readJsonSafe(path.join(dir, 'spec.json'))
    const normalized = normalizeHtml(srcHtml, spec)
    await fs.writeFile(path.join(dir, 'guide.html'), normalized, 'utf8')
    console.log(`OK  ${slug.padEnd(36)} ${normalized.length}B`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
