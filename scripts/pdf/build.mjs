#!/usr/bin/env node
// Renders PDF for every guide in content/guides/sources/<slug>/ using Playwright Chromium.
// Output: content/guides/pdf/<slug>.pdf
//
// Usage:
//   node scripts/pdf/build.mjs            # all guides
//   node scripts/pdf/build.mjs <slug>     # single guide
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'
import * as cheerio from 'cheerio'

const ROOT = process.cwd()
const SOURCES = path.join(ROOT, 'content/guides/sources')
const TEMPLATE_DIR = path.join(ROOT, 'content/guides/template')
const OUTPUT_DIR = path.join(ROOT, 'content/guides/pdf')

const CATEGORY_MAP = {
  'konflikt-miedzy-kotami': 'cat',
  'kot-boi-sie-kuwety': 'cat',
  'kot-broni-sie-przy-pielegnacji': 'cat',
  'kot-budzi-dom-po-nocy': 'cat',
  'kot-chowa-sie-po-zmianach': 'cat',
  'kot-gryzie-przy-glaskaniu': 'cat',
  'kot-problem-poza-kuweta': 'cat',
  'kot-zyje-w-napieciu': 'cat',
  'koty-zabawa-czy-napiecie': 'cat',
  'miauczenie-o-swicie': 'cat',
  'szczeniak-gryzie-i-skacze': 'puppy',
  'szczeniak-wyciszanie': 'puppy',
  'pies-broni-zasobow': 'dog',
  'pies-do-pracy-z-ludzmi': 'dog',
  'pies-glupieje-na-smyczy': 'dog',
  'pies-ile-ruchu-potrzebuje': 'dog',
  'pies-niszczy-w-domu': 'dog',
  'pies-pogon-i-hamulce': 'dog',
  'pies-szczeka-na-gosci': 'dog',
  'pies-trudny-spacer': 'dog',
  'pies-zostaje-sam': 'dog',
}

const TAG_MAP = {
  cat: 'Koty · przewodnik',
  dog: 'Psy · przewodnik',
  puppy: 'Szczeniaki · przewodnik',
}

function issueDatePl() {
  const now = new Date()
  const months = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia']
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

function readingTimeMinutes(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const words = text.trim().split(' ').length
  return Math.max(5, Math.round(words / 200))
}

// Extract hero metadata (title / subtitle / lead / bullets) from the guide html.
// Two source layouts in the wild:
//  A) Cat-style (final_clean): the first single-cell table IS the hero
//     (contains <strong>title</strong>, <strong>subtitle</strong>, <p>lead</p>, <ul>bullets</ul>).
//  B) Dog-style (v2_clean): the first 2-3 paragraphs ARE the hero (no table),
//     followed by separate "Dla kogo" / "Co znajdziesz" / "Najkrócej" callout tables.
// Heuristic: if the first callout contains a <ul> AND >=2 <strong>, treat it as hero.
// Otherwise, harvest the first paragraphs.
function extractHeroAndBody(guideHtml) {
  const $ = cheerio.load(`<div id="root">${guideHtml}</div>`, { decodeEntities: false })
  const root = $('#root')

  let title = ''
  let subtitle = ''
  let lead = ''
  let bullets = []

  const firstCallout = root.find('table[data-kind="callout"]').first()
  const isCatHero =
    firstCallout.length > 0 &&
    firstCallout.find('ul').length > 0 &&
    firstCallout.find('strong').length >= 2

  if (isCatHero) {
    const cellChildren = firstCallout.find('td').first().children()
    const strongs = []
    const paras = []
    let list = null
    cellChildren.each((_i, el) => {
      const tag = el.tagName?.toLowerCase()
      if (tag === 'p') {
        const strong = $(el).find('strong').first()
        if (strong.length && $(el).children().length === 1 && $(el).text().trim() === strong.text().trim()) {
          strongs.push(strong.text().trim())
        } else {
          paras.push($(el).text().trim())
        }
      } else if (tag === 'ul' || tag === 'ol') {
        list = el
      }
    })
    title = strongs[0] || ''
    subtitle = strongs[1] || ''
    lead = paras[0] || ''
    if (list) {
      $(list)
        .find('li')
        .each((_i, el) => bullets.push($(el).text().trim()))
    }
    firstCallout.remove()
  } else {
    // Dog-style: take the first paragraphs before the first table or heading.
    const collected = []
    root.children().each((_i, el) => {
      const tag = el.tagName?.toLowerCase()
      if (tag === 'p') {
        const txt = $(el).text().trim()
        if (txt) collected.push(el)
      } else if (tag === 'table' || /^h[1-6]$/.test(tag)) {
        return false // stop iteration
      }
    })

    // First paragraph = title (plain or wrapped strong)
    if (collected[0]) {
      title = $(collected[0]).text().trim()
    }
    // Second paragraph (if it's bold) = subtitle; else use it as lead
    if (collected[1]) {
      const isBold = $(collected[1]).find('strong').length > 0 &&
        $(collected[1]).text().trim() === $(collected[1]).find('strong').first().text().trim()
      if (isBold) subtitle = $(collected[1]).text().trim()
      else lead = $(collected[1]).text().trim()
    }
    // Third paragraph: lead/disclaimer (often italics) — use only if we don't have a lead yet.
    if (!lead && collected[2]) {
      lead = $(collected[2]).text().trim()
    }

    // Remove the harvested paragraphs from body
    collected.forEach((el) => $(el).remove())
  }

  const body = root.html() || ''
  return { title, subtitle, lead, bullets, body }
}

function renderTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_m, key) => {
    const v = vars[key]
    if (v == null) return ''
    return String(v)
  })
}

async function buildOne(slug, browser, tpl, css) {
  const srcDir = path.join(SOURCES, slug)
  const guideHtmlRaw = await fs.readFile(path.join(srcDir, 'guide.html'), 'utf8')
  const { title, subtitle, lead, bullets, body } = extractHeroAndBody(guideHtmlRaw)

  const category = CATEGORY_MAP[slug] || 'dog'
  const tag = TAG_MAP[category]
  const readingTime = readingTimeMinutes(body)
  const bulletsHtml = bullets.map((b) => `<li>${b}</li>`).join('\n      ')

  const html = renderTemplate(tpl, {
    title,
    subtitle,
    lead,
    bullets: bulletsHtml,
    content: body,
    category,
    tag,
    readingTime,
    issueDate: issueDatePl(),
    styles: css,
  })

  // Save HTML for debugging
  await fs.writeFile(path.join(srcDir, 'render.html'), html, 'utf8')

  const page = await browser.newPage()
  try {
    await page.setContent(html, { waitUntil: 'load' })
    const pdfPath = path.join(OUTPUT_DIR, `${slug}.pdf`)
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    })
    return pdfPath
  } finally {
    await page.close()
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const tpl = await fs.readFile(path.join(TEMPLATE_DIR, 'template.html'), 'utf8')
  const css = await fs.readFile(path.join(TEMPLATE_DIR, 'styles.css'), 'utf8')

  const only = process.argv[2]
  const slugs = only
    ? [only]
    : (await fs.readdir(SOURCES, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name)

  // Use locally installed Chrome to avoid downloading the chromium-headless-shell
  // bundle (~200 MB). Falls back to PLAYWRIGHT_CHROME env var if set.
  const chromePath =
    process.env.PLAYWRIGHT_CHROME ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const browser = await chromium.launch({ headless: true, executablePath: chromePath })
  try {
    for (const slug of slugs) {
      try {
        const out = await buildOne(slug, browser, tpl, css)
        const stat = await fs.stat(out)
        console.log(`OK  ${slug.padEnd(36)} ${(stat.size / 1024).toFixed(1)} KB`)
      } catch (e) {
        console.error(`ERR ${slug}: ${e.message}`)
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
