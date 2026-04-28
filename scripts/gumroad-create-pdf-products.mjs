/**
 * Tworzy płatne produkty PDF na Gumroad — Grupy A, B, C
 * Uruchom gdy Chrome jest otwarty z --remote-debugging-port=9222
 *
 * Grupy:
 *   A — 17 pojedynczych PDF tematycznych (12–14 zł)
 *   B — 6 zestawów ZIP (29–39 zł)
 *   C — 3 biblioteki ZIP (99–149 zł)
 */

import { chromium } from 'playwright-core'
import { existsSync, createWriteStream, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')
const PDF_DIR = join(ROOT, 'content', 'guides', 'pdf')
const ZIP_DIR = join(ROOT, 'tmp', 'gumroad-zips')

mkdirSync(ZIP_DIR, { recursive: true })

// ─── GRUPA A — pojedyncze PDF ─────────────────────────────────────────────────
const GRUPA_A = [
  { name: 'Kot boi się kuwety — poradnik behawioralny', price: '12', file: 'kot-boi-sie-kuwety.pdf',
    desc: `Praktyczny poradnik (PDF, ~6 stron) — dlaczego kot unika kuwety i jak to naprawić.\n\nCo zawiera:\n— Najczęstsze przyczyny problemów z kuwetą\n— Jak sprawdzić czy to stres, ból czy zły nawyk\n— Plan działania krok po kroku\n— Kiedy potrzebna jest konsultacja weterynaryjna` },
  { name: 'Konflikt między kotami — jak zatrzymać wojnę w domu', price: '12', file: 'konflikt-miedzy-kotami.pdf',
    desc: `Poradnik PDF (~6 stron) — jak rozróżnić zabawę od prawdziwej agresji i jak przywrócić spokój.\n\nCo zawiera:\n— Sygnały ostrzegawcze, których nie możesz przeoczyć\n— Fazy eskalacji konfliktu\n— Procedura separacji i ponownego wprowadzenia\n— Kiedy konflikt jest nieodwracalny` },
  { name: 'Kot chowa się po zmianach w domu — co robić', price: '12', file: 'kot-chowa-sie-po-zmianach.pdf',
    desc: `Poradnik PDF (~5 stron) — przeprowadzka, nowy człowiek, nowe zwierzę. Jak pomóc kotu wrócić do normalności.\n\nCo zawiera:\n— Dlaczego koty reagują wycofaniem\n— Jak skrócić czas adaptacji\n— Czego NIE robić (częste błędy)\n— Plan na pierwsze 2 tygodnie` },
  { name: 'Kot budzi dom po nocy — poradnik behawioralny', price: '12', file: 'kot-budzi-dom-po-nocy.pdf',
    desc: `Poradnik PDF (~5 stron) — dlaczego kot nie śpi w nocy i jak odzyskać spokój.\n\nCo zawiera:\n— Przyczyny nocnej aktywności (z podziałem na wiek)\n— Czego nie robić, żeby nie utrwalić złego nawyku\n— Plan wygaszania nocnych zachowań\n— Kiedy warto sprawdzić zdrowie kota` },
  { name: 'Kot gryzie przy głaskaniu — dlaczego i jak reagować', price: '12', file: 'kot-gryzie-przy-glaskaniu.pdf',
    desc: `Poradnik PDF (~5 stron) — agresja redyrekcyjna i próg tolerancji dotyku.\n\nCo zawiera:\n— Czym jest „petting-induced aggression"\n— Sygnały poprzedzające ukąszenie\n— Jak stopniowo zwiększać tolerancję\n— Techniki bezpiecznego głaskania` },
  { name: 'Miauczenie kota o świcie — jak to zatrzymać', price: '12', file: 'miauczenie-o-swicie.pdf',
    desc: `Poradnik PDF (~5 stron) — dlaczego kot miauczy o 4–6 rano i jak to wygasić.\n\nCo zawiera:\n— Przyczyny wczesnego miauczenia\n— Dlaczego odpowiadanie nasila problem\n— Procedura wygaszania\n— Rutyna wieczorna, która naprawdę pomaga` },
  { name: 'Koty — zabawa czy napięcie? Jak rozróżnić', price: '12', file: 'koty-zabawa-czy-napiecie.pdf',
    desc: `Poradnik PDF (~5 stron) — jak czytać interakcje między kotami i wiedzieć kiedy interweniować.\n\nCo zawiera:\n— Mowa ciała w zabawie vs. w konflikcie\n— Sygnały deeskalacji\n— Kiedy i jak przerywać interakcję\n— Zasady bezpiecznej wielokociej przestrzeni` },
  { name: 'Kot żyje w napięciu — jak obniżyć stres przewlekły', price: '12', file: 'kot-zyje-w-napieciu.pdf',
    desc: `Poradnik PDF (~6 stron) — chroniczny stres u kota: objawy, przyczyny, plan działania.\n\nCo zawiera:\n— Jak rozpoznać stres przewlekły (vs. akutowy)\n— Czego koty potrzebują, a co im zabieramy\n— Modyfikacje środowiska krok po kroku\n— Kiedy warto sięgnąć po feromony lub suplementy` },
  { name: 'Kot problem poza kuwetą — poradnik', price: '12', file: 'kot-problem-poza-kuweta.pdf',
    desc: `Poradnik PDF (~6 stron) — znacznikowanie terenu vs. nieodpowiednie korzystanie z kuwety.\n\nCo zawiera:\n— Jak odróżnić spray od zwykłego brudzenia\n— Przyczyny nieużywania kuwety\n— Jak wyczyścić zapachy (żeby kot nie wracał)\n— Plan diagnostyczny i naprawczy` },
  { name: 'Kot broni się przy pielęgnacji — jak to zmienić', price: '12', file: 'kot-broni-sie-przy-pielegnacji.pdf',
    desc: `Poradnik PDF (~5 stron) — szczotkowanie, obcinanie pazurów, kąpiel bez stresu.\n\nCo zawiera:\n— Desensytyzacja krok po kroku\n— Technika low-stress handling\n— Jak ćwiczyć dotyk od małego\n— Narzędzia, które ułatwiają pielęgnację` },
  { name: 'Pies — trudny spacer. Jak chodzić bez szarpania', price: '12', file: 'pies-trudny-spacer.pdf',
    desc: `Poradnik PDF (~7 stron) — ciągnięcie na smyczy i reaktywność na spacerze.\n\nCo zawiera:\n— Dlaczego pies ciągnie i co wzmacnia ten nawyk\n— Techniki luzowania smyczy bez klikerów\n— Jak reagować na inne psy, rowerzystów, dzieci\n— Plan treningowy na 3 tygodnie` },
  { name: 'Pies zostaje sam — jak zredukować lęk separacyjny', price: '12', file: 'pies-zostaje-sam.pdf',
    desc: `Poradnik PDF (~7 stron) — od drobnego niepokoju do pełnego lęku separacyjnego.\n\nCo zawiera:\n— Jak ocenić poziom problemu\n— Czego NIE robić przy pożegnaniu i powrocie\n— Protokół desensytyzacji na samotność\n— Kiedy potrzebna jest konsultacja lub farmakologia` },
  { name: 'Pies szczeka na gości — jak to ograniczyć', price: '12', file: 'pies-szczeka-na-gosci.pdf',
    desc: `Poradnik PDF (~6 stron) — szczekanie na dzwonek, wejście do domu, obcych ludzi.\n\nCo zawiera:\n— Przyczyny szczekania (terytorializm, strach, ekscytacja)\n— Ćwiczenia progowe i desensytyzacja dzwonka\n— Jak uczyć psa alternatywnego zachowania\n— Plan na „niespodziewaną wizytę"` },
  { name: 'Szczeniak gryzie i skacze — jak reagować', price: '12', file: 'szczeniak-gryzie-i-skacze.pdf',
    desc: `Poradnik PDF (~6 stron) — kontrola gryzienia i uczenie czterech łap na podłodze.\n\nCo zawiera:\n— Dlaczego szczeniak gryzie ręce (i co to normalnego)\n— Techniki bite inhibition\n— Jak reagować gdy skacze (i dlaczego „off" nie działa)\n— Plan na pierwsze 4 tygodnie` },
  { name: 'Szczeniak — wyciszanie i spokój w domu', price: '12', file: 'szczeniak-wyciszanie.pdf',
    desc: `Poradnik PDF (~6 stron) — jak uczyć szczeniaka spokoju, relaksu i samodzielności.\n\nCo zawiera:\n— Ćwiczenie „place" i mat training\n— Dlaczego szczeniak nie może być ciągle pobudzony\n— Rutyna dzień-noc dla szczeniaka\n— Jak unikać nadmiernego przywiązania` },
  { name: 'Pies broni zasobów — jak bezpiecznie zarządzać agresją', price: '14', file: 'pies-broni-zasobow.pdf',
    desc: `Poradnik PDF (~7 stron) — warczenie, kłapanie i ataki przy misce, zabawce, leżanku.\n\nCo zawiera:\n— Skala zagrożenia i ocena ryzyka\n— Dlaczego karanie nasila problem\n— Protokół zarządzania środowiskiem\n— Technika „trade and drop"\n— Kiedy konieczna jest konsultacja behawioralna` },
  { name: 'Pies głupieje na smyczy — reaktywność i frustracja', price: '14', file: 'pies-glupieje-na-smyczy.pdf',
    desc: `Poradnik PDF (~7 stron) — szczekanie, szarpanie, rzucanie się na smyczy na inne psy.\n\nCo zawiera:\n— Reaktywność vs. agresja — różnica i znaczenie\n— Technika „look at that" i LAT bez klikera\n— Zarządzanie dystansem i progiem reaktywności\n— Plan treningowy na 4 tygodnie` },
]

// ─── GRUPA B — zestawy ZIP ────────────────────────────────────────────────────
const GRUPA_B = [
  {
    name: 'Zestaw KOT — podstawy zachowania (3 PDF)',
    price: '29',
    zipName: 'zestaw-kot-podstawy.zip',
    files: ['kwadrans-podstawy-kota.pdf', 'kot-zyje-w-napieciu.pdf', 'koty-zabawa-czy-napiecie.pdf'],
    desc: `Zestaw 3 PDF (~18 stron łącznie) — podstawy rozumienia zachowania kota.\n\nZawiera:\n— Kwadrans z behawiorystą: podstawy kota (co motywuje koty, jak się komunikują)\n— Kot żyje w napięciu (stres przewlekły — objawy i rozwiązania)\n— Koty: zabawa czy napięcie (jak czytać interakcje)\n\nFormat: ZIP z 3 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Zestaw PIES — podstawy zachowania (3 PDF)',
    price: '29',
    zipName: 'zestaw-pies-podstawy.zip',
    files: ['kwadrans-podstawy-psa.pdf', 'pies-zostaje-sam.pdf', 'pies-trudny-spacer.pdf'],
    desc: `Zestaw 3 PDF (~20 stron łącznie) — podstawy rozumienia zachowania psa.\n\nZawiera:\n— Kwadrans z behawiorystą: podstawy psa (potrzeby, komunikacja, nauka)\n— Pies zostaje sam (lęk separacyjny — skala i rozwiązania)\n— Trudny spacer (ciągnięcie i reaktywność)\n\nFormat: ZIP z 3 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Zestaw KOT — problemy z kuwetą i terytorium (4 PDF)',
    price: '39',
    zipName: 'zestaw-kot-kuweta.zip',
    files: ['kot-boi-sie-kuwety.pdf', 'kot-problem-poza-kuweta.pdf', 'konflikt-miedzy-kotami.pdf', 'koty-zabawa-czy-napiecie.pdf'],
    desc: `Zestaw 4 PDF (~22 strony łącznie) — kompleksowe opracowanie problemów z kuwetą i terytorium.\n\nZawiera:\n— Kot boi się kuwety\n— Kot problem poza kuwetą (znacznikowanie vs. brudzenie)\n— Konflikt między kotami\n— Koty: zabawa czy napięcie\n\nFormat: ZIP z 4 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Zestaw KOT — stres i zmiany w domu (3 PDF)',
    price: '29',
    zipName: 'zestaw-kot-stres.zip',
    files: ['kot-chowa-sie-po-zmianach.pdf', 'kot-zyje-w-napieciu.pdf', 'kot-gryzie-przy-glaskaniu.pdf'],
    desc: `Zestaw 3 PDF (~16 stron łącznie) — jak pomóc kotu przez stres i zmiany.\n\nZawiera:\n— Kot chowa się po zmianach (przeprowadzka, nowe osoby, nowe zwierzę)\n— Kot żyje w napięciu (stres przewlekły)\n— Kot gryzie przy głaskaniu (przekraczanie progu tolerancji)\n\nFormat: ZIP z 3 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Zestaw PIES — spacer i reaktywność (3 PDF)',
    price: '39',
    zipName: 'zestaw-pies-spacer.zip',
    files: ['pies-trudny-spacer.pdf', 'pies-glupieje-na-smyczy.pdf', 'pies-pogon-i-hamulce.pdf'],
    desc: `Zestaw 3 PDF (~20 stron łącznie) — spacer bez szarpania i reaktywność na smyczy.\n\nZawiera:\n— Trudny spacer (ciągnięcie, ogólne zasady)\n— Pies głupieje na smyczy (reaktywność na inne psy)\n— Pies: pogoń i hamulce (instynkt pogoni, jak go kontrolować)\n\nFormat: ZIP z 3 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Zestaw SZCZENIAK — pierwsze tygodnie (3 PDF)',
    price: '39',
    zipName: 'zestaw-szczeniak.zip',
    files: ['szczeniak-gryzie-i-skacze.pdf', 'szczeniak-wyciszanie.pdf', 'kwadrans-podstawy-psa.pdf'],
    desc: `Zestaw 3 PDF (~18 stron łącznie) — kompletny starter dla właściciela szczeniaka.\n\nZawiera:\n— Szczeniak gryzie i skacze (bite inhibition, cztery łapy na podłodze)\n— Szczeniak: wyciszanie i spokój (mat training, rutyna)\n— Podstawy zachowania psa (żeby rozumieć co robi i czego potrzebuje)\n\nFormat: ZIP z 3 plikami PDF. Pobierasz od razu po zakupie.`,
  },
]

// ─── GRUPA C — biblioteki ZIP ─────────────────────────────────────────────────
const KOT_FILES = [
  'kot-boi-sie-kuwety.pdf', 'konflikt-miedzy-kotami.pdf', 'kot-chowa-sie-po-zmianach.pdf',
  'kot-budzi-dom-po-nocy.pdf', 'kot-gryzie-przy-glaskaniu.pdf', 'miauczenie-o-swicie.pdf',
  'koty-zabawa-czy-napiecie.pdf', 'kot-zyje-w-napieciu.pdf', 'kot-problem-poza-kuweta.pdf',
  'kot-broni-sie-przy-pielegnacji.pdf', 'kwadrans-podstawy-kota.pdf',
]
const PIES_FILES = [
  'pies-trudny-spacer.pdf', 'pies-zostaje-sam.pdf', 'pies-szczeka-na-gosci.pdf',
  'szczeniak-gryzie-i-skacze.pdf', 'szczeniak-wyciszanie.pdf', 'pies-broni-zasobow.pdf',
  'pies-glupieje-na-smyczy.pdf', 'pies-pogon-i-hamulce.pdf', 'pies-niszczy-w-domu.pdf',
  'kwadrans-podstawy-psa.pdf',
]

const GRUPA_C = [
  {
    name: 'Biblioteka KOT — wszystkie poradniki (ZIP, 11 PDF)',
    price: '99',
    zipName: 'biblioteka-kot.zip',
    files: KOT_FILES,
    desc: `Kompletna biblioteka PDF dla właściciela kota — 11 poradników behawioralnych w jednym pakiecie.\n\nZawiera:\n— Podstawy zachowania kota\n— Problemy z kuwetą i terytorium\n— Konflikty między kotami\n— Stres, zmiany w domu, wycofanie\n— Nocna aktywność i miauczenie\n— Agresja przy głaskaniu i pielęgnacji\n\nFormat: ZIP z 11 plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Biblioteka PIES — wszystkie poradniki (ZIP, 10 PDF)',
    price: '99',
    zipName: 'biblioteka-pies.zip',
    files: PIES_FILES.filter(f => existsSync(join(PDF_DIR, f))),
    desc: `Kompletna biblioteka PDF dla właściciela psa — 10 poradników behawioralnych w jednym pakiecie.\n\nZawiera:\n— Podstawy zachowania psa\n— Spacer, reaktywność, smycz\n— Lęk separacyjny\n— Szczekanie na gości\n— Obrona zasobów\n— Szczeniak — pierwsze tygodnie\n\nFormat: ZIP z plikami PDF. Pobierasz od razu po zakupie.`,
  },
  {
    name: 'Kompletna biblioteka PIES + KOT (ZIP, wszystkie poradniki)',
    price: '149',
    zipName: 'biblioteka-pies-kot.zip',
    files: [...new Set([...KOT_FILES, ...PIES_FILES])].filter(f => existsSync(join(PDF_DIR, f))),
    desc: `Wszystkie poradniki behawioralne w jednym miejscu — dla właścicieli psa i kota, szkoleniowców i behawiorystów.\n\nZawiera:\n— Wszystkie poradniki kotowe (~11 PDF)\n— Wszystkie poradniki psie (~10 PDF)\n\nFormat: ZIP ze wszystkimi plikami PDF. Pobierasz od razu po zakupie.`,
  },
]

// ─── Tworzenie ZIPów ──────────────────────────────────────────────────────────
async function buildZip(zipName, files) {
  const zipPath = join(ZIP_DIR, zipName)
  if (existsSync(zipPath)) {
    console.log(`  ZIP już istnieje: ${zipName}`)
    return zipPath
  }
  const existing = files.filter(f => existsSync(join(PDF_DIR, f)))
  if (!existing.length) {
    console.warn(`  ⚠ Brak plików dla ${zipName}`)
    return null
  }

  // PowerShell Compress-Archive wymaga tablicy @(...) dla wielu plików
  const psArray = existing.map(f => `'${join(PDF_DIR, f).replace(/\\/g, '\\\\')}'`).join(',')
  const dest = zipPath.replace(/\\/g, '\\\\')
  await execAsync(`powershell -Command "Compress-Archive -Path @(${psArray}) -DestinationPath '${dest}' -Force"`)
  console.log(`  ZIP: ${zipName} (${existing.length} plików)`)
  return zipPath
}

// ─── Tworzenie produktu na Gumroad ────────────────────────────────────────────
async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function createProduct(page, name, price, description, filePath, totalCount, index) {
  console.log(`\n[${index + 1}/${totalCount}] ${name}`)

  await page.goto('https://gumroad.com/products/new')
  await page.waitForLoadState('networkidle')
  await wait(3000)

  // Nazwa
  const inputs = page.locator('input[type="text"]')
  await inputs.nth(0).waitFor({ timeout: 10000 })
  await inputs.nth(0).fill(name)
  await wait(500)

  // Cena
  if (await inputs.nth(1).isVisible({ timeout: 3000 }).catch(() => false)) {
    await inputs.nth(1).fill(price)
    await wait(500)
  }

  // Next: Customize
  const nextBtn = page.locator('button:has-text("Next")')
  await nextBtn.waitFor({ timeout: 8000 })
  await nextBtn.click()
  await page.waitForURL(url => !url.includes('/products/new'), { timeout: 15000 }).catch(async () => {
    await nextBtn.click().catch(() => {})
  })
  await page.waitForLoadState('networkidle')
  await wait(2000)

  const afterNextUrl = page.url()
  if (afterNextUrl.includes('/products/new')) {
    throw new Error('Nie udało się przejść do kroku customize')
  }
  console.log(`  krok customize: ${afterNextUrl}`)

  // Opis — contenteditable lub textarea
  const descEditor = page.locator('div[contenteditable="true"]').first()
  const descTextarea = page.locator('textarea').first()
  if (await descEditor.isVisible({ timeout: 4000 }).catch(() => false)) {
    await descEditor.click()
    await wait(300)
    await descEditor.press('Control+a')
    await wait(100)
    await page.keyboard.type(description)
    console.log(`  opis: ok (contenteditable)`)
  } else if (await descTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await descTextarea.fill(description)
    console.log(`  opis: ok (textarea)`)
  }

  // Upload pliku — szukamy input[type=file] (może być ukryty)
  if (filePath && existsSync(filePath)) {
    // Kliknij zakładkę Content jeśli istnieje
    const contentTab = page.locator('a:has-text("Content"), button:has-text("Content")').first()
    if (await contentTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await contentTab.click()
      await wait(1500)
    }

    // Spróbuj znaleźć ukryty input type=file
    const fileInput = page.locator('input[type="file"]').first()
    try {
      await fileInput.setInputFiles(filePath, { timeout: 10000 })
      await wait(8000)
      console.log(`  plik: przesłany`)
    } catch {
      // Szukaj label lub przycisku upload i kliknij żeby odsłonić input
      const uploadTrigger = page.locator('label[for], button:has-text("Upload"), button:has-text("Add"), label:has-text("Upload")').first()
      if (await uploadTrigger.isVisible({ timeout: 2000 }).catch(() => false)) {
        await uploadTrigger.click()
        await wait(500)
      }
      await page.locator('input[type="file"]').first().setInputFiles(filePath, { timeout: 10000 })
      await wait(8000)
      console.log(`  plik: przesłany (v2)`)
    }
  }

  // Publish / Save
  const pub = page.locator('button:has-text("Publish"), button:has-text("Save changes"), button:has-text("Save and continue")').first()
  if (await pub.isVisible({ timeout: 8000 }).catch(() => false)) {
    await pub.click()
    await page.waitForLoadState('networkidle')
    await wait(2000)
  }

  const url = page.url()
  console.log(`  ✓ ${url}`)
  return url
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Buduj ZIPy dla grup B i C
  console.log('Tworzę ZIPy dla zestawów...')
  for (const p of [...GRUPA_B, ...GRUPA_C]) {
    p.zipPath = await buildZip(p.zipName, p.files)
  }

  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const context = browser.contexts()[0]
  const page = context.pages()[0]

  await page.goto('https://gumroad.com/products')
  await page.waitForLoadState('networkidle')
  if (page.url().includes('login')) {
    console.error('Niezalogowany.')
    process.exit(1)
  }
  console.log('✓ Zalogowany\n')

  // KROK 0: sprawdz limit przed jakimkolwiek dzialaniem
  await page.goto('https://gumroad.com/products/new')
  await page.waitForLoadState('networkidle')
  await wait(2000)
  const pageText = await page.locator('body').innerText()
  if (pageText.includes('10 products per day') || pageText.includes('per day')) {
    console.error('STOP: Gumroad limit dzienny osiagniety. Wznow jutro.')
    await browser.close()
    process.exit(1)
  }
  console.log('✓ Limit dzienny OK — mozna tworzyc produkty\n')

  const all = [
    ...GRUPA_A.map(p => ({ name: p.name, price: p.price, desc: p.desc, file: join(PDF_DIR, p.file) })),
    ...GRUPA_B.map(p => ({ name: p.name, price: p.price, desc: p.desc, file: p.zipPath })),
    ...GRUPA_C.map(p => ({ name: p.name, price: p.price, desc: p.desc, file: p.zipPath })),
  ]

  // Pomiń pierwsze 7 (już istnieją na koncie z plikami)
  const START_FROM = 7
  // Max 10 produktów dziennie — limit Gumroad
  const MAX_PER_RUN = 10
  const remaining = all.slice(START_FROM, START_FROM + MAX_PER_RUN)

  console.log(`Tworzę ${remaining.length} produktów (pomijam ${START_FROM} już istniejących, max ${MAX_PER_RUN}/dzień)...\n`)

  const results = []
  for (let i = 0; i < remaining.length; i++) {
    try {
      const url = await createProduct(page, remaining[i].name, remaining[i].price, remaining[i].desc, remaining[i].file, remaining.length, i)
      results.push({ name: remaining[i].name, url, ok: true })
    } catch (err) {
      console.error(`  ✗ ${err.message.split('\n')[0]}`)
      results.push({ name: remaining[i].name, ok: false })
    }
    await wait(2000)
  }

  console.log('\n══════════════════════════════════')
  console.log('PODSUMOWANIE:')
  const ok = results.filter(r => r.ok).length
  console.log(`${ok}/${results.length} produktów utworzonych`)
  for (const r of results) {
    console.log(`${r.ok ? '✓' : '✗'} ${r.name}`)
  }

  await browser.close()
}

main().catch(e => { console.error(e.message); process.exit(1) })
