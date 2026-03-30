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

  throw new Error('Nie znaleziono lokalnej przeglądarki Chromium (Chrome lub Edge) do live-clickthrough-report.')
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
  await Promise.all([page.waitForURL(urlPattern, { timeout: 20000 }), locator.click()])
}

async function readHref(locator: Locator) {
  const href = await locator.first().getAttribute('href')

  if (!href) {
    throw new Error('Expected href attribute on tested link.')
  }

  return href
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
    (result) => result.name === 'Booking live: zgłoszenie manual payment -> pending' && result.status === 'passed',
  )
  const rejectStepPassed = results.some(
    (result) => result.name === 'Admin live: odrzucenie testowej wpłaty QA' && result.status === 'passed',
  )
  const findings =
    failed === 0
      ? ['Brak krytycznych błędów w przeklikanej ścieżce live przy zachowanym bezpiecznym wariancie bez fałszywego potwierdzania płatności.']
      : results.filter((result) => result.status === 'failed').map((result) => `${result.name}: ${result.notes.join(' | ')}`)

  const lines = [
    '# Raport QA Live Clickthrough',
    '',
    `- Data: ${timestamp}`,
    `- URL: ${baseUrl}`,
    `- Wynik ogólny: ${overall}`,
    `- Kroki zaliczone: ${passed}/${results.length}`,
    `- Liczba zebranych issue z runtime: ${issues.length}`,
    `- Booking QA identity: ${qaIdentity.ownerName} / ${qaIdentity.email}`,
    `- Bezpiecznik płatności: ${paymentModeNote}`,
    '',
    '## Najważniejsze ustalenia',
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
    lines.push('- Brak zebranych błędów konsoli, pageerrorów i same-origin request failures/HTTP >= 400.')
  } else {
    lines.push(
      ...issues.map((issue) => {
        const urlSuffix = issue.url ? ` | ${issue.url}` : ''
        return `- [${issue.level}] ${issue.source}${urlSuffix} | ${issue.message}`
      }),
    )
  }

  lines.push('', '## Uwagi', '- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.')
  if (pendingStepPassed && rejectStepPassed) {
    lines.push('- Ścieżka rezerwacji na produkcji została doprowadzona do `pending manual review`, a następnie odrzucona w adminie, żeby nie zostawić sztucznie opłaconej rezerwacji.')
  } else {
    lines.push('- Ścieżka rezerwacji na produkcji nie została doprowadzona do końca bezpiecznej sekwencji manual review/reject w tym przebiegu.')
  }
  lines.push('- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.')
  lines.push('')

  return lines.join('\n')
}

async function main() {
  const rootDir = process.cwd()
  loadEnvConfig(rootDir)

  const baseUrl = resolveBaseUrl()
  const adminSecret = process.env.ADMIN_ACCESS_SECRET?.trim()
  if (!adminSecret) {
    throw new Error('Brak ADMIN_ACCESS_SECRET w środowisku lokalnym.')
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
    let telHref: string | null = null
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

    await runStep(results, 'Home hero + CTA do oferty', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(publicPage, publicPage.getByRole('link', { name: /Zobacz formy pracy/i }), /\/oferta$/)
      await publicPage.getByRole('heading', { level: 1, name: /Dobierz formę pomocy do sytuacji/i }).waitFor({ timeout: 20000 })
      step.notes.push('CTA hero "Zobacz formy pracy" prowadzi poprawnie do /oferta.')
    })

    await runStep(results, 'Home hero + CTA do bookingu', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(publicPage, publicPage.getByRole('link', { name: /^Umów konsultację$/i }).first(), /\/book$/)
      await publicPage.getByRole('heading', { level: 1, name: /Wybierz temat szybkiej konsultacji 15 min/i }).waitFor({ timeout: 20000 })
      step.notes.push('CTA hero "Umów konsultację" otwiera osobną ścieżkę rezerwacji.')
    })

    await runStep(results, 'Header: Oferta', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.header-link[href="/oferta"]').first(), /\/oferta$/)
      await publicPage.getByRole('heading', { level: 1, name: /Dobierz formę pomocy do sytuacji/i }).waitFor({ timeout: 20000 })
      step.notes.push('Link w headerze działa.')
    })

    await runStep(results, 'Header: Koty', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.header-link[href="/koty"]').first(), /\/koty$/)
      await publicPage.getByRole('heading', { level: 1, name: /Terapia kotów wymaga osobnego spojrzenia/i }).waitFor({ timeout: 20000 })
      step.notes.push('Link w headerze działa.')
    })

    await runStep(results, 'Header: Pobyty', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(
        publicPage,
        publicPage.locator('a.header-link[href="/oferta/pobyty-socjalizacyjno-terapeutyczne"]').first(),
        /\/oferta\/pobyty-socjalizacyjno-terapeutyczne$/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Pobyty socjalizacyjno-terapeutyczne/i }).waitFor({ timeout: 20000 })
      step.notes.push('Link w headerze działa.')
    })

    await runStep(results, 'Header: Kontakt + href mailto/tel', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.header-link[href="/kontakt"]').first(), /\/kontakt$/)
      await publicPage
        .getByRole('heading', { level: 1, name: /Opisz sytuację i dobierz pierwszy krok|Opisz swoją sytuację i dobierz formę współpracy/i })
        .waitFor({ timeout: 20000 })
      mailtoHref = await readHref(publicPage.locator('a[href^="mailto:"]'))
      telHref = await readHref(publicPage.locator('a[href^="tel:"]'))
      step.notes.push(`mailto ok: ${mailtoHref}`)
      step.notes.push(`tel ok: ${telHref}`)
    })

    await runStep(results, 'Deep routes usług: bezpośrednie wejścia do detali i kontaktu', publicPage, async (step) => {
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
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/oferta`, /Dobierz formę pomocy do sytuacji/i)
      await clickAndWaitForUrl(
        publicPage,
        publicPage.locator('a[href="/oferta/konsultacja-30-min"]').first(),
        /\/oferta\/konsultacja-30-min$/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Konsultacja 30 min/i }).waitFor({ timeout: 20000 })
      await clickAndWaitForUrl(
        publicPage,
        publicPage.getByRole('link', { name: /Zapytaj o konsultację 30 min|Napisz w sprawie konsultacji 30 min/i }).first(),
        /\/kontakt\?service=konsultacja-30-min$/,
      )
      await publicPage.getByRole('heading', { level: 1, name: /Zapytanie o: Konsultacja 30 min/i }).waitFor({ timeout: 20000 })
      step.notes.push('Detail page i CTA do /kontakt działają poprawnie.')
    })

    await runStep(results, 'PDF listing -> poradnik -> kontakt', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta/poradniki-pdf`, { waitUntil: 'domcontentloaded' })
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const guideLink = publicPage.locator('a[href^="/oferta/poradniki-pdf/"]:not([href*="/pakiety/"])').first()
      const guideHref = await readHref(guideLink)
      await clickAndWaitForUrl(publicPage, guideLink, /\/oferta\/poradniki-pdf\/(?!pakiety\/).+/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const guideTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      await clickAndWaitForUrl(publicPage, publicPage.getByRole('link', { name: /Napisz w sprawie tego poradnika|Napisz w sprawie zakupu i dostępu|Napisz w sprawie tego materiału|Napisz w sprawie dostępu po konsultacji|Zapytaj o/i }).first(), /\/kontakt\?service=poradniki-pdf&guide=/)
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

    await runStep(results, 'Footer: polityka prywatności i regulamin', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/`, /Regulski\s+\|\s+Terapia behawioralna/i)
      await publicPage.locator('footer').scrollIntoViewIfNeeded()
      await clickAndWaitForUrl(publicPage, publicPage.locator('footer a[href="/polityka-prywatnosci"]').first(), /\/polityka-prywatnosci$/)
      await publicPage.getByRole('heading', { level: 1 }).waitFor({ timeout: 20000 })
      const privacyTitle = cleanText(await publicPage.getByRole('heading', { level: 1 }).innerText())
      const privacyBody = cleanText(await publicPage.locator('main').innerText())
      if (/Facebook/i.test(privacyBody)) {
        throw new Error('Polityka prywatności nadal zawiera publiczne odniesienie do Facebooka.')
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
      step.notes.push(`Polityka prywatności: ${privacyTitle}`)
      step.notes.push(`Regulamin: ${termsTitle}`)
    })

    await runStep(results, 'Booking live: wybór tematu i slotu', publicPage, async (step) => {
      await gotoAndWaitForHeading(publicPage, `${baseUrl}/book`, /Wybierz temat szybkiej konsultacji 15 min/i)
      await clickAndWaitForUrl(publicPage, publicPage.locator('a.topic-card[data-problem="kot"]').first(), /\/slot\?problem=kot$/)
      await publicPage.getByRole('heading', { level: 1, name: /Wybierz termin szybkiej konsultacji: Kot/i }).waitFor({ timeout: 20000 })
      const firstSlot = publicPage.locator('a.slot-link').first()
      await firstSlot.waitFor({ timeout: 20000 })
      const slotLabel = cleanText(await firstSlot.innerText())
      await clickAndWaitForUrl(publicPage, firstSlot, /\/form\?problem=kot&slotId=/)
      await publicPage.getByRole('button', { name: /Zablokuj termin i przejdź do płatności/i }).waitFor({ timeout: 20000 })
      step.notes.push(`Wybrany temat: kot`)
      step.notes.push(`Wybrany slot: ${slotLabel}`)
    })

    await runStep(results, 'Booking live: formularz -> payment', publicPage, async (step) => {
      await publicPage.getByPlaceholder('np. Anna').fill(qaIdentity.ownerName)
      await publicPage.locator('select').first().selectOption('Kot')
      await publicPage.getByPlaceholder('np. 8 miesięcy lub 4 lata').fill('4 lata')
      await publicPage.getByPlaceholder('np. od 3 tygodni').fill('od około dwóch tygodni')
      await publicPage
        .getByPlaceholder('Napisz, co się dzieje, kiedy problem występuje i co jest dla Ciebie najtrudniejsze.')
        .fill('Test QA live. Kot napina się przy gościach, długo nie wraca do równowagi i chcę sprawdzić pierwszy kierunek pracy.')
      await publicPage.getByPlaceholder('np. 500 000 000').fill('500600700')
      await publicPage.getByPlaceholder('np. klient@email.pl').fill(qaIdentity.email)
      const submitButton = publicPage.getByRole('button', { name: /Zablokuj termin i przejdź do płatności/i })
      const bookingResponse = publicPage.waitForResponse(
        (response) => response.url().includes('/api/bookings') && response.request().method() === 'POST',
      )
      await submitButton.click()
      const response = await bookingResponse
      if (!response.ok()) {
        throw new Error(`POST /api/bookings zwrócił ${response.status()}.`)
      }
      await publicPage.waitForURL(/\/payment\?bookingId=/, { timeout: 20000 })
      const paymentUrl = new URL(publicPage.url())
      bookingId = paymentUrl.searchParams.get('bookingId')
      accessToken = paymentUrl.searchParams.get('access')

      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId lub access token w URL payment.')
      }

      await publicPage.getByRole('heading', { level: 1, name: /Wybierz sposób płatności za szybki pierwszy krok/i }).waitFor({ timeout: 20000 })
      manualVisible =
        (await publicPage.getByRole('button', { name: /BLIK na telefon|Wpłata manualna/i }).count()) > 0 ||
        (await publicPage.getByText(/BLIK na telefon|BLIK \/ przelew|wpłata manualna/i).count()) > 0
      payuVisible = (await publicPage.getByText(/PayU jako druga opcja|Zapłać online PayU/i).count()) > 0
      step.notes.push(`manualVisible=${manualVisible}`)
      step.notes.push(`payuVisible=${payuVisible}`)
    })

    await runStep(results, 'Booking live: pokój zablokowany przed paid', publicPage, async (step) => {
      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId/accessToken do testu pokoju.')
      }

      const roomPage = await createPage(publicContext, 'room-before-paid', baseUrl, issues, seenIssues)
      try {
        await roomPage.goto(`${baseUrl}/call/${bookingId}?access=${encodeURIComponent(accessToken)}`, {
          waitUntil: 'domcontentloaded',
        })
        await roomPage.getByText(/Dostęp do pokoju rozmowy odblokowuje się dopiero po statusie paid/i).waitFor({ timeout: 20000 })
      } finally {
        await roomPage.close()
      }

      step.notes.push('Pokój nie wpuszcza przed statusem paid.')
    })

    await runStep(results, 'Booking live: zgłoszenie manual payment -> pending', publicPage, async (step) => {
      await publicPage.getByRole('button', { name: /BLIK na telefon|Wpłata manualna/i }).first().click()
      const manualSubmitButton = publicPage.getByRole('button', { name: /Zapłaciłem, czekam na potwierdzenie/i })
      await manualSubmitButton.waitFor({ timeout: 20000 })
      await manualSubmitButton.scrollIntoViewIfNeeded()
      await manualSubmitButton.click({ force: true })
      await publicPage.waitForURL(/\/confirmation\?bookingId=.*manual=reported/, { timeout: 20000 })
      await publicPage.getByRole('heading', { level: 1, name: /Wpłata czeka na potwierdzenie do 60 min/i }).waitFor({ timeout: 20000 })
      confirmationUrl = publicPage.url()
      step.notes.push('Rezerwacja przeszła do pending manual review.')
    })

    await runStep(results, 'Admin live: odrzucenie testowej wpłaty QA', publicPage, async (step) => {
      if (!bookingId) {
        throw new Error('Brak bookingId do akcji admina.')
      }

      const adminPage = await createPage(adminContext, 'admin', baseUrl, issues, seenIssues)
      try {
        await adminPage.goto(`${baseUrl}/admin`, { waitUntil: 'domcontentloaded' })
        await adminPage.getByRole('heading', { level: 1, name: /Rezerwacje, płatności i terminy/i }).waitFor({ timeout: 20000 })
        const bookingRow = adminPage.locator('.booking-row', { hasText: qaIdentity.email }).first()
        await bookingRow.waitFor({ timeout: 20000 })
        const rejectButton = bookingRow.getByRole('button', { name: /Odrzuć wpłatę/i })
        await rejectButton.waitFor({ timeout: 20000 })
        await rejectButton.scrollIntoViewIfNeeded()
        const rejectResponsePromise = adminPage.waitForResponse(
          (response) =>
            response.url().includes(`/api/admin/bookings/${bookingId}/manual-payment`) &&
            response.request().method() === 'POST',
        )
        await rejectButton.click({ force: true })
        const rejectResponse = await rejectResponsePromise
        if (!rejectResponse.ok()) {
          throw new Error(`Admin reject POST zwrócił ${rejectResponse.status()}.`)
        }
        await adminPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {})
        await adminPage.getByRole('heading', { level: 1, name: /Rezerwacje, płatności i terminy/i }).waitFor({ timeout: 20000 })
        await adminPage.locator('.booking-row', { hasText: qaIdentity.email }).first().waitFor({ timeout: 20000 })
      } finally {
        await adminPage.close()
      }

      step.notes.push('Testowa wpłata została odrzucona zamiast potwierdzenia, żeby nie zostawić sztucznie opłaconej rezerwacji.')
    })

    await runStep(results, 'Confirmation live: stan po odrzuceniu', publicPage, async (step) => {
      if (!confirmationUrl) {
        throw new Error('Brak URL confirmation do odświeżenia.')
      }

      await publicPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
      const rejectedHeading = publicPage.getByRole('heading', { level: 1, name: /Nie znaleziono wpłaty do tej rezerwacji/i })
      const waitingHeading = publicPage.getByRole('heading', { level: 1, name: /Wpłata czeka na potwierdzenie do 60 min/i })
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
        throw new Error('Confirmation nie pokazał stanu odrzuconej wpłaty po adminowym reject.')
      }
      await publicPage.getByRole('link', { name: /Wybierz nowy termin/i }).waitFor({ timeout: 20000 })
      step.notes.push('Publiczny ekran poprawnie pokazuje stan odrzuconej wpłaty.')
    })

    const report = buildReportMarkdown({
      baseUrl,
      timestamp: timestamp.isoLike,
      results,
      issues,
      qaIdentity,
      paymentModeNote: 'bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie',
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
          telHref,
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
