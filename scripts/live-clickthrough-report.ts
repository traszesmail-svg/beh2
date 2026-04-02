import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'
import { chromium, type BrowserContext, type Locator, type Page } from 'playwright-core'

type StepStatus = 'passed' | 'failed' | 'skipped'

type StepResult = {
  name: string
  status: StepStatus
  startUrl: string
  endUrl: string
  notes: string[]
}

type IssueLevel = 'console' | 'pageerror' | 'requestfailed' | 'http'

type Issue = {
  level: IssueLevel
  source: string
  url: string | null
  message: string
}

function getWarsawTimestamp() {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const values: Record<string, string> = {}

  for (const part of formatter.formatToParts(new Date())) {
    if (part.type !== 'literal') {
      values[part.type] = part.value
    }
  }

  return {
    isoLike: `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second} Europe/Warsaw`,
    compact: `${values.year}${values.month}${values.day}-${values.hour}${values.minute}${values.second}`,
  }
}

function resolveBaseUrl() {
  const raw = process.env.LIVE_SMOKE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://beh2.vercel.app'
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

function sameOrigin(baseUrl: string, targetUrl: string) {
  try {
    return new URL(targetUrl).origin === new URL(baseUrl).origin
  } catch {
    return false
  }
}

function isIgnorableSameOriginAbort(url: string, message: string, resourceType?: string) {
  if (!message.includes('ERR_ABORTED')) {
    return false
  }

  if (resourceType === 'document') {
    return true
  }

  if (resourceType === 'image') {
    try {
      const parsed = new URL(url)
      return parsed.pathname === '/_next/image'
    } catch {
      return false
    }
  }

  try {
    const parsed = new URL(url)
    return parsed.searchParams.has('_rsc')
  } catch {
    return false
  }
}

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

async function resolveBrowserExecutablePath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ]

  for (const candidate of candidates) {
    try {
      await access(candidate)
      return candidate
    } catch {}
  }

  throw new Error('Nie znaleziono lokalnej przeglÄ…darki Chromium (Chrome lub Edge) do live-clickthrough-report.')
}

function pushIssue(issues: Issue[], issue: Issue, seen: Set<string>) {
  const key = `${issue.level}|${issue.source}|${issue.url ?? ''}|${issue.message}`
  if (seen.has(key)) {
    return
  }

  seen.add(key)
  issues.push(issue)
}

function attachDiagnostics(page: Page, source: string, baseUrl: string, issues: Issue[], seen: Set<string>) {
  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return
    }

    pushIssue(
      issues,
      {
        level: 'console',
        source,
        url: page.url() || null,
        message: cleanText(message.text()),
      },
      seen,
    )
  })

  page.on('pageerror', (error) => {
    pushIssue(
      issues,
      {
        level: 'pageerror',
        source,
        url: page.url() || null,
        message: cleanText(error.stack ?? error.message),
      },
      seen,
    )
  })

  page.on('requestfailed', (request) => {
    if (!sameOrigin(baseUrl, request.url())) {
      return
    }

    const message = cleanText(request.failure()?.errorText ?? 'Request failed')
    if (isIgnorableSameOriginAbort(request.url(), message, request.resourceType())) {
      return
    }

    pushIssue(
      issues,
      {
        level: 'requestfailed',
        source,
        url: request.url(),
        message,
      },
      seen,
    )
  })

  page.on('response', (response) => {
    if (!sameOrigin(baseUrl, response.url()) || response.status() < 400) {
      return
    }

    pushIssue(
      issues,
      {
        level: 'http',
        source,
        url: response.url(),
        message: `HTTP ${response.status()} ${response.statusText()}`,
      },
      seen,
    )
  })
}

async function createPage(context: BrowserContext, source: string, baseUrl: string, issues: Issue[], seen: Set<string>) {
  const page = await context.newPage()
  attachDiagnostics(page, source, baseUrl, issues, seen)
  return page
}

async function runStep(results: StepResult[], name: string, page: Page | null, work: (step: StepResult) => Promise<void>) {
  const step: StepResult = {
    name,
    status: 'passed',
    startUrl: page?.url() || 'about:blank',
    endUrl: page?.url() || 'about:blank',
    notes: [],
  }

  try {
    await work(step)
  } catch (error) {
    step.status = 'failed'
    step.notes.push(error instanceof Error ? error.message : String(error))
  }

  step.endUrl = page?.url() || step.endUrl
  results.push(step)
  return step.status === 'passed'
}

async function gotoAndWaitForHeading(page: Page, url: string, heading: RegExp) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { level: 1, name: heading }).waitFor({ timeout: 20000 })
}

async function clickAndWaitForUrl(page: Page, locator: Locator, urlPattern: RegExp) {
  await Promise.all([page.waitForURL(urlPattern, { timeout: 20000, waitUntil: 'domcontentloaded' }), locator.click()])
}

async function readHref(locator: Locator) {
  const href = await locator.first().getAttribute('href')

  if (!href) {
    throw new Error('Expected href attribute on tested link.')
  }

  return href
}

async function waitForVisible(locator: Locator, timeout: number) {
  try {
    await locator.waitFor({ timeout })
    return true
  } catch {
    return false
  }
}

async function rejectManualPaymentWithRetry(page: Page, bookingId: string, bookingEmail: string) {
  const deadline = Date.now() + 90000
  let lastError = ''

  while (Date.now() < deadline) {
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {})
    const bookingRow = page.locator('.booking-row', { hasText: bookingEmail }).first()
    await bookingRow.waitFor({ timeout: 15000 })

    const rejectButton = bookingRow.getByRole('button', { name: /OdrzuĂ„â€ˇ wpÄąâ€šatĂ„â„˘/i })
    if (await waitForVisible(rejectButton, 4000)) {
      try {
        await rejectButton.scrollIntoViewIfNeeded()
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes(`/api/admin/bookings/${bookingId}/manual-payment`) &&
            response.request().method() === 'POST',
          { timeout: 20000 },
        )
        await rejectButton.click({ force: true })
        const response = await responsePromise

        if (response.ok()) {
          return
        }

        lastError = `Admin reject POST zwrÄ‚Ĺ‚ciÄąâ€š ${response.status()}.`
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
      }
    } else {
      lastError = 'Reject button nie byÄąâ€š jeszcze widoczny w wierszu bookingu.'
    }

    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(1500)
  }

  throw new Error(`Admin reject nie doszedÄąâ€š do skutku na czas.${lastError ? ` Last issue: ${lastError}` : ''}`)
}

type DeepServiceRoute = {
  detailPath: string
  detailHeading: RegExp
  contactPath?: string
  contactHeading?: RegExp
}

function buildReportMarkdown({
  baseUrl,
  timestamp,
  results,
  issues,
  qaIdentity,
  paymentModeNote,
}: {
  baseUrl: string
  timestamp: string
  results: StepResult[]
  issues: Issue[]
  qaIdentity: { ownerName: string; email: string }
  paymentModeNote: string
}) {
  const passed = results.filter((result) => result.status === 'passed').length
  const failed = results.filter((result) => result.status === 'failed').length
  const overall = failed === 0 ? 'PASS' : 'FAIL'
  const pendingStepPassed = results.some(
    (result) => result.name === 'Booking live: zgĹ‚oszenie manual payment -> pending' && result.status === 'passed',
  )
  const rejectStepPassed = results.some(
    (result) => result.name === 'Admin live: odrzucenie testowej wpĹ‚aty QA' && result.status === 'passed',
  )
  const findings =
    failed === 0
      ? ['Brak krytycznych bĹ‚Ä™dĂłw w przeklikanej Ĺ›cieĹĽce live przy zachowanym bezpiecznym wariancie bez faĹ‚szywego potwierdzania pĹ‚atnoĹ›ci.']
      : results.filter((result) => result.status === 'failed').map((result) => `${result.name}: ${result.notes.join(' | ')}`)

  const lines = [
    '# Raport QA Live Clickthrough',
    '',
    `- Data: ${timestamp}`,
    `- URL: ${baseUrl}`,
    `- Wynik ogĂłlny: ${overall}`,
    `- Kroki zaliczone: ${passed}/${results.length}`,
    `- Liczba zebranych issue z runtime: ${issues.length}`,
    `- Booking QA identity: ${qaIdentity.ownerName} / ${qaIdentity.email}`,
    `- Bezpiecznik pĹ‚atnoĹ›ci: ${paymentModeNote}`,
    '',
    '## NajwaĹĽniejsze ustalenia',
    ...findings.map((finding) => `- ${finding}`),
    '',
    '## Kroki',
    ...results.flatMap((result) => {
      const header = `### ${result.status === 'passed' ? 'PASS' : result.status === 'failed' ? 'FAIL' : 'SKIP'} - ${result.name}`
      const detailLines = [
        header,
        `- Start URL: ${result.startUrl}`,
        `- End URL: ${result.endUrl}`,
      ]

      if (result.notes.length > 0) {
        detailLines.push(...result.notes.map((note) => `- Note: ${note}`))
      }

      detailLines.push('')
      return detailLines
    }),
    '## Runtime issues',
  ]

  if (issues.length === 0) {
    lines.push('- Brak zebranych bĹ‚Ä™dĂłw konsoli, pageerrorĂłw i same-origin request failures/HTTP >= 400.')
  } else {
    lines.push(
      ...issues.map((issue) => {
        const urlSuffix = issue.url ? ` | ${issue.url}` : ''
        return `- [${issue.level}] ${issue.source}${urlSuffix} | ${issue.message}`
      }),
    )
  }

  lines.push('', '## Uwagi', '- `mailto:` zostaĹ‚o zweryfikowane po href-ie; nie otwieraĹ‚em zewnÄ™trznego klienta poczty.')
  if (pendingStepPassed && rejectStepPassed) {
    lines.push('- ĹšcieĹĽka rezerwacji na produkcji zostaĹ‚a doprowadzona do `pending manual review`, a nastÄ™pnie odrzucona w adminie, ĹĽeby nie zostawiÄ‡ sztucznie opĹ‚aconej rezerwacji.')
  } else {
    lines.push('- ĹšcieĹĽka rezerwacji na produkcji nie zostaĹ‚a doprowadzona do koĹ„ca bezpiecznej sekwencji manual review/reject w tym przebiegu.')
  }
  lines.push('- Nie wykonywaĹ‚em realnej pĹ‚atnoĹ›ci PayU ani faĹ‚szywego potwierdzenia wpĹ‚aty na live.')
  lines.push('')

  return lines.join('\n')
}

async function main() {
  const rootDir = process.cwd()
  loadEnvConfig(rootDir)

  const baseUrl = resolveBaseUrl()
  const adminSecret = process.env.ADMIN_ACCESS_SECRET?.trim()
  if (!adminSecret) {
    throw new Error('Brak ADMIN_ACCESS_SECRET w Ĺ›rodowisku lokalnym.')
  }

  const timestamp = getWarsawTimestamp()
  const qaIdentity = {
    ownerName: `QA LIVE ${timestamp.compact}`,
    email: `qa-live-${timestamp.compact}@example.com`,
  }
  const issues: Issue[] = []
  const seenIssues = new Set<string>()
  const results: StepResult[] = []
  const reportDir = path.join(rootDir, 'qa-reports')
  const archivePath = path.join(reportDir, `live-clickthrough-${timestamp.compact}.md`)
  const latestPath = path.join(reportDir, 'latest-report.md')

  await mkdir(reportDir, { recursive: true })

  const browser = await chromium.launch({
    headless: true,
    executablePath: await resolveBrowserExecutablePath(),
  })

  try {
    const publicContext = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1200 },
    })
    const adminContext = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1200 },
      httpCredentials: { username: 'admin', password: adminSecret },
    })

    const publicPage = await createPage(publicContext, 'public', baseUrl, issues, seenIssues)

    let bookingId: string | null = null
    let accessToken: string | null = null
    let confirmationUrl: string | null = null
    let payuVisible = false
    let manualVisible = false
    let mailtoHref: string | null = null
    const deepServiceRoutes: DeepServiceRoute[] = [
      {
        detailPath: '/oferta/szybka-konsultacja-15-min',
        detailHeading: /Szybka konsultacja 15 min/i,
      },
      {
        detailPath: '/oferta/konsultacja-30-min',
        detailHeading: /Konsultacja 30 min/i,
        contactPath: '/kontakt?service=konsultacja-30-min',
        contactHeading: /Zapytanie o: Konsultacja 30 min/i,
      },
      {
        detailPath: '/oferta/konsultacja-behawioralna-online',
        detailHeading: /Konsultacja behawioralna online/i,
        contactPath: '/kontakt?service=konsultacja-behawioralna-online',
        contactHeading: /Zapytanie o: Konsultacja behawioralna online/i,
      },
      {
        detailPath: '/oferta/konsultacja-domowa-wyjazdowa',
        detailHeading: /Konsultacja domowa \/ wyjazdowa/i,
        contactPath: '/kontakt?service=konsultacja-domowa-wyjazdowa',
        contactHeading: /Zapytanie o: Konsultacja domowa \/ wyjazdowa/i,
      },
      {
        detailPath: '/oferta/indywidualna-terapia-behawioralna',
        detailHeading: /Indywidualna terapia behawioralna/i,
        contactPath: '/kontakt?service=indywidualna-terapia-behawioralna',
        contactHeading: /Zapytanie o: Indywidualna terapia behawioralna/i,
      },
      {
        detailPath: '/oferta/pobyty-socjalizacyjno-terapeutyczne',
        detailHeading: /Pobyty socjalizacyjno-terapeutyczne/i,
        contactPath: '/kontakt?service=pobyty-socjalizacyjno-terapeutyczne',
        contactHeading: /Zapytanie o: Pobyty socjalizacyjno-terapeutyczne/i,
      },
    ]

    await runStep(results, 'Home hero + CTA do wyboru pierwszego kroku', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      await Promise.all([
        publicPage.waitForURL(/#pierwszy-krok$/, { timeout: 20000 }),
        publicPage.locator('a[data-home-cta="match"]').first().click(),
      ])
      await publicPage.locator('section#pierwszy-krok').waitFor({ timeout: 20000 })
      step.notes.push('CTA hero "Dobierz pierwszy krok" przewija poprawnie do sekcji wyboru.')
    })

    await runStep(results, 'Home szybki wybĂłr psa -> booking', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a[data-home-quick-choice="dog"]').first(), /\/book$/)
      await publicPage.getByRole('heading', { level: 1, name: /Wybierz temat na 15 min/i }).waitFor({ timeout: 20000 })
      step.notes.push('Szybki wybĂłr "Mam psa" otwiera Ĺ›cieĹĽkÄ™ rezerwacji.')
    })

    await runStep(results, 'Header: Oferta', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.header-link[href="/oferta"]').first(), /\/oferta$/)
      await publicPage.getByRole('heading', { level: 1, name: /Wybierz(?:, od czego zaczÄ…Ä‡| start dla swojej sytuacji)/i }).waitFor({ timeout: 20000 })
      step.notes.push('Link w headerze dziaĹ‚a.')
    })

    await runStep(results, 'Header: Koty ukryte', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      const catHeaderLinkCount = await publicPage.locator('a.header-link[href="/koty"]').count()
      if (catHeaderLinkCount > 0) {
        throw new Error('Link "Koty" nadal jest widoczny w gĹ‚Ăłwnym pasku.')
      }
      step.notes.push('Link "Koty" nie jest juĹĽ pokazywany w gĹ‚Ăłwnym pasku.')
    })

    await runStep(results, 'Header: Pobyty ukryte', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      const staysHeaderLinkCount = await publicPage
        .locator('a.header-link[href="/oferta/pobyty-socjalizacyjno-terapeutyczne"]')
        .count()
      if (staysHeaderLinkCount > 0) {
        throw new Error('Link "Pobyty" nadal jest widoczny w gĹ‚Ăłwnym pasku.')
      }
      step.notes.push('Link "Pobyty" nie jest juĹĽ pokazywany w gĹ‚Ăłwnym pasku.')
    })

    await runStep(results, 'Header: Kontakt + href mailto', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.header-link[href="/kontakt"]').first(), /\/kontakt$/)
      await publicPage
        .getByRole('heading', {
          level: 1,
          name: /Napisz albo umĂłw 15 min|Napisz i dobierz pierwszy krok|Opisz sytuacjÄ™ i dobierz pierwszy krok|Opisz swojÄ… sytuacjÄ™ i dobierz formÄ™ wspĂłĹ‚pracy/i,
        })
        .waitFor({ timeout: 20000 })
      mailtoHref = await readHref(publicPage.locator('a[href^="mailto:"]'))
      step.notes.push(`mailto ok: ${mailtoHref}`)
      const telLinkCount = await publicPage.locator('a[href^="tel:"]').count()
      if (telLinkCount > 0) {
        throw new Error('Publiczny link tel: nadal jest widoczny na /kontakt.')
      }
      step.notes.push('brak publicznego tel: ok')
    })

    await runStep(results, 'Deep routes usĹ‚ug: bezpoĹ›rednie wejĹ›cia do detali i kontaktu', publicPage, async (step) => {
      for (const route of deepServiceRoutes) {
        await gotoAndWaitForHeading(publicPage, `${baseUrl}${route.detailPath}`, route.detailHeading)
        step.notes.push(`detail ok: ${route.detailPath}`)

        if (route.contactPath && route.contactHeading) {
          await gotoAndWaitForHeading(publicPage, `${baseUrl}${route.contactPath}`, route.contactHeading)
          step.notes.push(`contact ok: ${route.contactPath}`)
        }
      }
    })

    await runStep(results, 'Oferta -> detal konsultacji 30 min -> kontakt', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/oferta`, /Wybierz(?:, od czego zaczÄ…Ä‡| start dla swojej sytuacji)/i)
      await clickAndWaitForUrl(
        publicPage,
        publicPage.locator('a[href="/oferta/konsultacja-30-min"]').first(),
        /\/oferta\/konsultacja-30-min$/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Konsultacja 30 min/i }).waitFor({ timeout: 20000 })
      await clickAndWaitForUrl(
        publicPage,
        publicPage.getByRole('link', { name: /Zapytaj o konsultacjÄ™ 30 min|Napisz w sprawie konsultacji 30 min/i }).first(),
        /\/kontakt\?service=konsultacja-30-min$/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Zapytanie o: Konsultacja 30 min/i }).waitFor({ timeout: 20000 })
      step.notes.push('Detail page i CTA do /kontakt dziaĹ‚ajÄ… poprawnie.')
    })

    await runStep(results, 'PDF listing -> poradnik -> kontakt', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta/poradniki-pdf`, { waitUntil: 'domcontentloaded' })
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const guideLink = publicPage.locator('a[href^="/oferta/poradniki-pdf/"]:not([href*="/pakiety/"])').first()
      const guideHref = await readHref(guideLink)
      await clickAndWaitForUrl(publicPage, guideLink, /\/oferta\/poradniki-pdf\/(?!pakiety\/).+/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const guideTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      await clickAndWaitForUrl(publicPage, publicPage.getByRole('link', { name: /Napisz w sprawie tego poradnika|Napisz w sprawie zakupu i dostÄ™pu|Napisz w sprawie tego materiaĹ‚u|Napisz w sprawie dostÄ™pu po konsultacji|Zapytaj o/i }).first(), /\/kontakt\?service=poradniki-pdf&guide=/)
      await publicPage.getByRole('heading', { level: 1, name: /Zapytanie o: Poradniki PDF/i }).waitFor({ timeout: 20000 })
      step.notes.push(`Poradnik: ${guideTitle} (${guideHref})`)
    })

    await runStep(results, 'PDF listing -> pakiet -> kontakt', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta/poradniki-pdf`, { waitUntil: 'domcontentloaded' })
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const bundleLink = publicPage.locator('a[href*="/oferta/poradniki-pdf/pakiety/"]').first()
      const bundleHref = await readHref(bundleLink)
      await clickAndWaitForUrl(publicPage, bundleLink, /\/oferta\/poradniki-pdf\/pakiety\/.+/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const bundleTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      await clickAndWaitForUrl(
        publicPage,
        publicPage.getByRole('link', { name: /Zapytaj o ten pakiet|Napisz w sprawie (tego )?pakietu/i }).first(),
        /\/kontakt\?service=poradniki-pdf&bundle=/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Zapytanie o: Poradniki PDF/i }).waitFor({ timeout: 20000 })
      step.notes.push(`Pakiet: ${bundleTitle} (${bundleHref})`)
    })

    await runStep(results, 'Footer: polityka prywatnoĹ›ci i regulamin', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutÄ™)?/i)
      await publicPage.locator('footer').scrollIntoViewIfNeeded()
      await clickAndWaitForUrl(publicPage, publicPage.locator('footer a[href="/polityka-prywatnosci"]').first(), /\/polityka-prywatnosci$/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const privacyTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      const privacyBody = cleanText(await publicPage.locator('main').innerText())
      if (/Facebook/i.test(privacyBody)) {
        throw new Error('Polityka prywatnoĹ›ci nadal zawiera publiczne odniesienie do Facebooka.')
      }
      await publicPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
      await publicPage.locator('footer').scrollIntoViewIfNeeded()
      await clickAndWaitForUrl(publicPage, publicPage.locator('footer a[href="/regulamin"]').first(), /\/regulamin$/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const termsTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      const termsBody = cleanText(await publicPage.locator('main').innerText())
      if (/Facebook/i.test(termsBody)) {
        throw new Error('Regulamin nadal zawiera publiczne odniesienie do Facebooka.')
      }
      step.notes.push(`Polityka prywatnoĹ›ci: ${privacyTitle}`)
      step.notes.push(`Regulamin: ${termsTitle}`)
    })

    await runStep(results, 'Booking live: wybĂłr tematu i slotu', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/book`, /Wybierz temat na 15 min/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.topic-card[data-problem="kot"]').first(), /\/slot\?problem=kot$/)
      await publicPage.getByRole('heading', { level: 1, name: /Wybierz termin szybkiej konsultacji: Kot/i }).waitFor({ timeout: 20000 })
      const firstSlot = publicPage.locator('a.slot-link').first()
      await firstSlot.waitFor({ timeout: 20000 })
      const slotLabel = cleanText(await firstSlot.innerText())
      await clickAndWaitForUrl(publicPage, firstSlot, /\/form\?problem=kot&slotId=/)
      await publicPage.getByRole('button', { name: /Zablokuj termin i przejdĹş do pĹ‚atnoĹ›ci/i }).waitFor({ timeout: 20000 })
      step.notes.push(`Wybrany temat: kot`)
      step.notes.push(`Wybrany slot: ${slotLabel}`)
    })

    await runStep(results, 'Booking live: formularz -> payment', publicPage, async (step) => {
      await publicPage.getByPlaceholder('np. Anna').fill(qaIdentity.ownerName)
      await publicPage.locator('select').first().selectOption('Kot')
      await publicPage.getByPlaceholder('np. 8 miesiÄ™cy lub 4 lata').fill('4 lata')
      await publicPage.getByPlaceholder('np. od 3 tygodni').fill('od okoĹ‚o dwĂłch tygodni')
      await publicPage
        .getByPlaceholder('Napisz, co siÄ™ dzieje, kiedy problem wystÄ™puje i co jest dla Ciebie najtrudniejsze.')
        .fill('Test QA live. Kot napina siÄ™ przy goĹ›ciach, dĹ‚ugo nie wraca do rĂłwnowagi i chcÄ™ sprawdziÄ‡ pierwszy kierunek pracy.')
      await publicPage.getByPlaceholder('np. 500 000 000').fill('500600700')
      await publicPage.getByPlaceholder('np. klient@email.pl').fill(qaIdentity.email)
      const submitButton = publicPage.getByRole('button', { name: /Zablokuj termin i przejdĹş do pĹ‚atnoĹ›ci/i })
      const bookingResponse = publicPage.waitForResponse(
        (response) => response.url().includes('/api/bookings') && response.request().method() === 'POST',
      )
      await submitButton.click()
      const response = await bookingResponse
      if (!response.ok()) {
        throw new Error(`POST /api/bookings zwrĂłciĹ‚ ${response.status()}.`)
      }
      await publicPage.waitForURL(/\/payment\?bookingId=/, { timeout: 20000 })
      const paymentUrl = new URL(publicPage.url())
      bookingId = paymentUrl.searchParams.get('bookingId')
      accessToken = paymentUrl.searchParams.get('access')

      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId lub access token w URL payment.')
      }

      await publicPage.getByRole('heading', { level: 1, name: /Wybierz sposĂłb pĹ‚atnoĹ›ci za szybki pierwszy krok/i }).waitFor({ timeout: 20000 })
      manualVisible =
        (await publicPage.getByRole('button', { name: /Przelew tradycyjny|WpĹ‚ata manualna/i }).count()) > 0 ||
        (await publicPage.getByText(/Przelew tradycyjny|przelew z rÄ™cznym potwierdzeniem|wpĹ‚ata manualna/i).count()) > 0
      payuVisible = (await publicPage.getByText(/PayU jako druga opcja|ZapĹ‚aÄ‡ online PayU/i).count()) > 0
      step.notes.push(`manualVisible=${manualVisible}`)
      step.notes.push(`payuVisible=${payuVisible}`)
    })

    await runStep(results, 'Booking live: pokĂłj zablokowany przed paid', publicPage, async (step) => {
      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId/accessToken do testu pokoju.')
      }

      const roomPage = await createPage(publicContext, 'room-before-paid', baseUrl, issues, seenIssues)
      try {
        await roomPage.goto(`${baseUrl}/call/${bookingId}?access=${encodeURIComponent(accessToken)}`, {
          waitUntil: 'domcontentloaded',
        })
        await roomPage.getByText(/DostÄ™p do pokoju rozmowy odblokowuje siÄ™ dopiero po statusie paid/i).waitFor({ timeout: 20000 })
      } finally {
        await roomPage.close()
      }

      step.notes.push('PokĂłj nie wpuszcza przed statusem paid.')
    })

    await runStep(results, 'Booking live: zgĹ‚oszenie manual payment -> pending', publicPage, async (step) => {
      
      const manualSubmitButton = publicPage.getByRole('button', { name: /ZapĹ‚aciĹ‚em, czekam na potwierdzenie/i })
      if (!(await waitForVisible(manualSubmitButton, 2000))) {
        const manualMethodButton = publicPage
          .getByRole('button', { name: /BLIK na telefon \/ przelew|BLIK na telefon|Przelew tradycyjny|Wpłata manualna/i })
          .first()
        await manualMethodButton.waitFor({ timeout: 20000 })
        await manualMethodButton.click({ force: true })
      }
      await manualSubmitButton.waitFor({ timeout: 20000 })
      if (!(await manualSubmitButton.isEnabled())) {
        throw new Error('Manual payment jest widoczna na ekranie, ale akcja zgĹ‚oszenia wpĹ‚aty pozostaje nieaktywna.')
      }
      await manualSubmitButton.scrollIntoViewIfNeeded()
      const manualSubmitResponsePromise = publicPage.waitForResponse(
        (response) => response.url().includes('/api/payments/manual') && response.request().method() === 'POST',
        { timeout: 60000 },
      )
      await manualSubmitButton.click({ force: true })
      const manualSubmitResponse = await manualSubmitResponsePromise
      if (!manualSubmitResponse.ok()) {
        throw new Error(`POST /api/payments/manual zwrĂłciĹ‚ ${manualSubmitResponse.status()}.`)
      }
      await publicPage.waitForURL(/\/confirmation\?bookingId=.*manual=reported/, {
        timeout: 60000,
        waitUntil: 'domcontentloaded',
      })
      await publicPage.getByRole('heading', { level: 1, name: /WpĹ‚ata czeka na potwierdzenie do 60 min/i }).waitFor({ timeout: 20000 })
      confirmationUrl = publicPage.url()
      step.notes.push('Rezerwacja przeszĹ‚a do pending manual review.')
    })

    await runStep(results, 'Admin live: odrzucenie testowej wpĹ‚aty QA', publicPage, async (step) => {
      if (!bookingId) {
        throw new Error('Brak bookingId do akcji admina.')
      }

      const adminPage = await createPage(adminContext, 'admin', baseUrl, issues, seenIssues)
      try {
        await adminPage.goto(`${baseUrl}/admin`, { waitUntil: 'domcontentloaded' })
        await adminPage.getByRole('heading', { level: 1, name: /Rezerwacje, pĹ‚atnoĹ›ci i terminy/i }).waitFor({ timeout: 20000 })
        const bookingRow = adminPage.locator('.booking-row', { hasText: qaIdentity.email }).first()
        await bookingRow.waitFor({ timeout: 60000 })
        const rejectButton = bookingRow.getByRole('button', { name: /OdrzuÄ‡ wpĹ‚atÄ™/i })
        await rejectButton.waitFor({ timeout: 60000 })
        await rejectButton.scrollIntoViewIfNeeded()
        const rejectResponsePromise = adminPage.waitForResponse(
          (response) =>
            response.url().includes(`/api/admin/bookings/${bookingId}/manual-payment`) &&
            response.request().method() === 'POST',
          { timeout: 60000 },
        )
        await rejectButton.click({ force: true })
        const rejectResponse = await rejectResponsePromise
        if (!rejectResponse.ok()) {
          throw new Error(`Admin reject POST zwrĂłciĹ‚ ${rejectResponse.status()}.`)
        }
        await adminPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {})
        await adminPage.getByRole('heading', { level: 1, name: /Rezerwacje, pĹ‚atnoĹ›ci i terminy/i }).waitFor({ timeout: 20000 })
        await adminPage.locator('.booking-row', { hasText: qaIdentity.email }).first().waitFor({ timeout: 20000 })
      } finally {
        await adminPage.close()
      }

      step.notes.push('Testowa wpĹ‚ata zostaĹ‚a odrzucona zamiast potwierdzenia, ĹĽeby nie zostawiÄ‡ sztucznie opĹ‚aconej rezerwacji.')
    })

    await runStep(results, 'Confirmation live: stan po odrzuceniu', publicPage, async (step) => {
      if (!confirmationUrl) {
        throw new Error('Brak URL confirmation do odĹ›wieĹĽenia.')
      }

      await publicPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
      const rejectedHeading = publicPage.getByRole('heading', { level: 1, name: /Nie znaleziono wpĹ‚aty do tej rezerwacji/i })
      const waitingHeading = publicPage.getByRole('heading', { level: 1, name: /WpĹ‚ata czeka na potwierdzenie do 60 min/i })
      let rejectedVisible = false

      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await rejectedHeading.waitFor({ timeout: 3000 })
          rejectedVisible = true
          break
        } catch {}

        if (attempt === 4) {
          break
        }

        if (await waitingHeading.count()) {
          await publicPage.waitForTimeout(2500)
        } else {
          await publicPage.waitForTimeout(1500)
        }

        await publicPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
      }

      if (!rejectedVisible) {
        throw new Error('Confirmation nie pokazaĹ‚ stanu odrzuconej wpĹ‚aty po adminowym reject.')
      }
      await publicPage.getByRole('link', { name: /Wybierz nowy termin/i }).waitFor({ timeout: 20000 })
      step.notes.push('Publiczny ekran poprawnie pokazuje stan odrzuconej wpĹ‚aty.')
    })

    const report = buildReportMarkdown({
      baseUrl,
      timestamp: timestamp.isoLike,
      results,
      issues,
      qaIdentity,
      paymentModeNote: 'bez realnej pĹ‚atnoĹ›ci PayU i bez faĹ‚szywego approve na produkcji; test manual zakoĹ„czony reject w adminie',
    })

    await writeFile(archivePath, report, 'utf8')
    await writeFile(latestPath, report, 'utf8')

    console.log(
      JSON.stringify(
        {
          archivePath,
          latestPath,
          passed: results.filter((result) => result.status === 'passed').length,
          failed: results.filter((result) => result.status === 'failed').length,
          issues: issues.length,
          payuVisible,
          manualVisible,
          mailtoHref,
          bookingId,
        },
        null,
        2,
      ),
    )

    if (results.some((result) => result.status === 'failed')) {
      process.exitCode = 1
    }

    await publicContext.close()
    await adminContext.close()
  } finally {
    await browser.close()
  }
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error)
  process.exitCode = 1
})
