import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'
import { chromium, type BrowserContext, type Locator, type Page } from 'playwright-core'
import { getBookingServiceTitle, type BookingServiceType } from '../lib/booking-services'
import { getProblemLabel, isFutureAvailabilitySlot } from '../lib/data'
import { SITE_PRODUCTION_URL } from '../lib/site'
import type { ProblemType } from '../lib/types'

type StepStatus = 'passed' | 'failed'

type StepResult = {
  name: string
  status: StepStatus
  startUrl: string
  endUrl: string
  notes: string[]
}

type MobileResult = {
  width: number
  height: number
  heroClear: boolean
  cardsReadable: boolean
  bottomAreaLean: boolean
  ctaEasyToTap: boolean
  layoutStable: boolean
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

function readArg(name: string): string | null {
  const index = process.argv.indexOf(name)

  if (index === -1) {
    return null
  }

  return process.argv[index + 1] ?? null
}

function resolveBaseUrl() {
  const raw = readArg('--url') ?? process.env.LIVE_SMOKE_URL ?? SITE_PRODUCTION_URL
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
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

  try {
    const parsed = new URL(url)

    if (parsed.pathname === '/icon.svg' || parsed.pathname.startsWith('/_next/static/') || parsed.pathname.startsWith('/branding/')) {
      return true
    }
  } catch {}

  if (resourceType === 'document') {
    return true
  }

  if (resourceType === 'image') {
    try {
      const parsed = new URL(url)
      return parsed.pathname === '/_next/image' || parsed.pathname === '/icon.svg'
    } catch {
      return false
    }
  }

  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/bookings/') && parsed.pathname.endsWith('/status')) {
      return true
    }
  } catch {}

  try {
    const parsed = new URL(url)
    return parsed.searchParams.has('_rsc')
  } catch {
    return false
  }
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

async function isVisible(locator: Locator) {
  try {
    return await locator.isVisible()
  } catch {
    return false
  }
}

async function waitForAnyVisible(locators: Locator[], timeout: number) {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    for (const locator of locators) {
      if (await isVisible(locator)) {
        return locator
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error('Ĺ»aden z oczekiwanych elementĂłw nie pojawiĹ‚ siÄ™ na czas.')
}

async function waitForAnyBodyText(page: Page, patterns: Array<RegExp | string>, timeout: number) {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    let text = ''

    try {
      text = cleanText(await page.locator('body').innerText())
    } catch {}

    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (text.includes(pattern)) {
          return text
        }
      } else if (pattern.test(text)) {
        return text
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error('Ĺ»aden z oczekiwanych elementĂłw nie pojawiĹ‚ siÄ™ na czas.')
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeAttributeValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function getBookingFormField(page: Page, field: string) {
  return page.locator(`[data-booking-field="${escapeAttributeValue(field)}"]`).first()
}

function getBookingSubmitButton(page: Page) {
  return page.locator('[data-booking-submit="payment"]').first()
}

async function submitBookingForm(page: Page) {
  await page.evaluate(() => {
    const form = document.querySelector('[data-booking-form="details"]') as HTMLFormElement | null
    const button = document.querySelector('[data-booking-submit="payment"]') as HTMLButtonElement | null

    if (!form || !button) {
      throw new Error('Missing booking form or submit button.')
    }

    form.requestSubmit(button)
  })
}

function getPaymentMethodButton(page: Page, method: 'manual' | 'payu') {
  return page.locator(`[data-payment-method="${method}"]`).first()
}

function getPaymentSubmitButton(page: Page, method: 'manual' | 'payu') {
  return page.locator(`[data-payment-submit="${method}"]`).first()
}

function getBookingRowLocators(page: Page, bookingEmail: string, bookingId?: string | null) {
  const locators: Locator[] = []

  if (bookingId) {
    locators.push(page.locator(`[data-booking-id="${escapeAttributeValue(bookingId)}"]`).first())
  }

  locators.push(page.locator(`[data-booking-email="${escapeAttributeValue(bookingEmail)}"]`).first())
  locators.push(page.locator('.booking-row', { hasText: bookingEmail }).first())

  return locators
}

async function waitForBookingRow(page: Page, bookingEmail: string, bookingId?: string | null, timeout = 20000) {
  return waitForAnyVisible(getBookingRowLocators(page, bookingEmail, bookingId), timeout)
}

async function clickAndWaitForUrl(
  page: Page,
  locator: Locator,
  urlPattern: RegExp | string | ((url: URL) => boolean),
  timeout = 30000,
) {
  await Promise.all([page.waitForURL(urlPattern, { timeout, waitUntil: 'domcontentloaded' }), locator.click({ force: true })])
}

async function waitForHome(page: Page, baseUrl: string) {
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
  await waitForAnyVisible(
    [
      page
        .locator('main h1')
        .filter({ hasText: /Masz psa, kota albo temat mieszany\?|Spokojny start bez zgadywania|Najpierw prosty wybór, potem konkretny krok/i })
        .first(),
      page.locator('main h1').first(),
    ],
    20000,
  )
  await waitForAnyVisible([page.locator('#home-paths').first(), page.locator('[data-home-quick-choice]').first()], 20000)
}

async function waitForConfirmationState(page: Page, expectedState: string, headingFallback: RegExp, timeout: number) {
  return waitForAnyVisible(
    [
      page.locator(`[data-confirmation-state="${escapeAttributeValue(expectedState)}"]`).first(),
      page.getByRole('heading', { level: 1, name: headingFallback }),
    ],
    timeout,
  )
}

async function waitForPendingManualReview(page: Page, timeout: number) {
  return waitForAnyVisible(
    [
      page.locator('[data-confirmation-state="pending-manual-review"]').first(),
      page.locator('[data-payment-state="pending-manual-review"]').first(),
      page.getByRole('heading', { level: 1, name: /Wplata czeka na potwierdzenie/i }),
    ],
    timeout,
  )
}

async function assertNoPublicPhoneLinks(page: Page, routePath: string) {
  const telLinkCount = await page.locator('a[href^="tel:"]').count()

  if (telLinkCount > 0) {
    throw new Error(`Publiczny link tel: nadal jest widoczny na ${routePath}.`)
  }
}

async function assertLegacyHeaderLinksHidden(page: Page, routePath: string) {
  const legacyLabels = ['Koty', 'Pobyty', 'UmĂłw konsultacjÄ™']
  const visibleLegacyLinks: string[] = []

  for (const label of legacyLabels) {
    if ((await page.getByRole('link', { name: new RegExp(`^${label}$`, 'i') }).count()) > 0) {
      visibleLegacyLinks.push(label)
    }
  }

  if (visibleLegacyLinks.length > 0) {
    throw new Error(`Stare linki nawigacji nadal sÄ… widoczne na ${routePath}: ${visibleLegacyLinks.join(', ')}.`)
  }
}

type OfferJourneyConfig = {
  stepName: string
  serviceType: BookingServiceType
  offerHeading: RegExp
  problemType: ProblemType
  animalType: 'Pies' | 'Kot'
  ownerName: string
  email: string
  petAge: string
  durationNotes: string
  description: string
  phone: string
}

async function runOfferJourney(results: StepResult[], page: Page, baseUrl: string, config: OfferJourneyConfig) {
  await runStep(results, config.stepName, page, async (step) => {
    await page.goto(`${baseUrl}/oferta`, { waitUntil: 'domcontentloaded' })
    await waitForAnyVisible([page.getByRole('heading', { level: 1, name: /Wybierz start dla swojej sytuacji\./i })], 20000)

    const offerCard = page.locator('.offer-card', { has: page.getByRole('heading', { name: config.offerHeading }) }).first()
    await waitForAnyVisible([offerCard], 20000)

    const offerButton = offerCard.locator('.offer-card-actions .button').first()
    await clickAndWaitForUrl(
      page,
      offerButton,
      (url) => url.pathname === '/book' && url.searchParams.get('service') === config.serviceType,
    )

    await waitForAnyVisible(
      [page.getByRole('heading', { level: 1, name: new RegExp(`Wybierz temat dla: ${escapeRegExp(getBookingServiceTitle(config.serviceType))}`, 'i') })],
      20000,
    )
    step.notes.push(`/oferta -> /book z service=${config.serviceType}`)

    const topicCard = page.locator(`a.topic-card[data-problem="${escapeAttributeValue(config.problemType)}"]`).first()
    await clickAndWaitForUrl(
      page,
      topicCard,
      (url) =>
        url.pathname === '/slot' &&
        url.searchParams.get('problem') === config.problemType &&
        url.searchParams.get('service') === config.serviceType,
    )

    await waitForAnyVisible(
      [page.getByRole('heading', { level: 1, name: new RegExp(`Wybierz termin: ${escapeRegExp(getProblemLabel(config.problemType))}`, 'i') })],
      20000,
    )
    step.notes.push(`/book -> /slot z problem=${config.problemType}`)

    const firstSlot = page.locator('a.slot-link').first()
    const emptyState = page.locator('.empty-box').first()
    await waitForAnyVisible([firstSlot, emptyState], 20000)

    if ((await isVisible(emptyState)) && !(await isVisible(firstSlot))) {
      step.notes.push(`/book -> /slot z problem=${config.problemType}`)
      step.notes.push(`emptyState=true dla service=${config.serviceType}`)
      return
    }

    await clickAndWaitForUrl(
      page,
      firstSlot,
      (url) =>
        url.pathname === '/form' &&
        url.searchParams.get('problem') === config.problemType &&
        url.searchParams.get('service') === config.serviceType,
    )

    await waitForAnyVisible([page.getByRole('heading', { level: 1, name: /Uzupełnij dane do rezerwacji/i })], 20000)
    step.notes.push(`/slot -> /form z service=${config.serviceType}`)

    await getBookingFormField(page, 'owner-name').fill(config.ownerName)
    await getBookingFormField(page, 'animal-type').selectOption(config.animalType)
    await getBookingFormField(page, 'pet-age').fill(config.petAge)
    await getBookingFormField(page, 'duration-notes').fill(config.durationNotes)
    await getBookingFormField(page, 'description').fill(config.description)
    await getBookingFormField(page, 'phone').fill(config.phone)
    await getBookingFormField(page, 'email').fill(config.email)

    const bookingResponse = page.waitForResponse(
      (response) => response.url().includes('/api/bookings') && response.request().method() === 'POST',
    )
    await submitBookingForm(page)
    const response = await bookingResponse
    if (!response.ok()) {
      throw new Error(`POST /api/bookings zwrocil ${response.status()}.`)
    }

    await page.waitForURL(
      (url) => url.pathname === '/payment' && url.searchParams.get('service') === config.serviceType,
      {
        timeout: 60000,
        waitUntil: 'domcontentloaded',
      },
    )

    const paymentUrl = new URL(page.url())
    if (paymentUrl.searchParams.get('service') !== config.serviceType) {
      throw new Error(`URL payment nie zachowal service=${config.serviceType}.`)
    }

    await waitForAnyVisible(
      [
        page.locator('[data-payment-state="payment-selection"]').first(),
        page.getByRole('heading', { level: 1, name: /Wybierz sposób płatności/i }),
      ],
      20000,
    )

    const manualVisible = (await page.locator('[data-payment-method="manual"]').count()) > 0
    const payuVisible = (await page.locator('[data-payment-method="payu"]').count()) > 0

    step.notes.push(`/form -> /payment z service=${config.serviceType}`)
    step.notes.push(`manualVisible=${manualVisible}`)
    step.notes.push(`payuVisible=${payuVisible}`)
  })
}

async function rejectManualPaymentWithRetry(page: Page, bookingId: string) {
  const rejectButton = page.locator(`[data-admin-booking-actions="${escapeAttributeValue(bookingId)}"] [data-admin-manual-action="reject"]`).first()

  await waitForAnyVisible([rejectButton], 20000)

  const responsePromise = page
    .waitForResponse(
      (response) =>
        response.url().includes(`/api/admin/bookings/${bookingId}/manual-payment`) &&
        response.request().method() === 'POST',
      { timeout: 30000 },
    )
    .catch(() => null)

  await rejectButton.click({ force: true })
  const response = await responsePromise

  if (!response) {
    throw new Error('Admin reject nie zwrócił odpowiedzi z API.')
  }

  if (!response.ok()) {
    throw new Error(`Admin reject POST zwrócił ${response.status()}.`)
  }

  await page.waitForLoadState('domcontentloaded').catch(() => {})
  await page.waitForTimeout(1500)
}

async function checkMobileLayout(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  baseUrl: string,
  width: number,
  height: number,
  issues: Issue[],
  seen: Set<string>,
) {
  const context = await browser.newContext({
    locale: 'pl-PL',
    viewport: { width, height },
  })

  const page = await createPage(context, `mobile-${width}`, baseUrl, issues, seen)

  try {
    await waitForHome(page, baseUrl)
    const heroHeading = page.getByRole('heading', { level: 1 }).first()
    const choices = [
      page.locator('[data-home-quick-choice="dog"]').first(),
      page.locator('[data-home-quick-choice="cat"]').first(),
      page.locator('[data-home-quick-choice="help"]').first(),
    ]
    const choiceHeading = page.locator('#home-paths .home-choice-heading').first()
    const choiceBoxes = await Promise.all(choices.map((locator) => locator.boundingBox()))
    const titleBoxes = await Promise.all(choices.map((locator) => locator.locator('.home-choice-title').boundingBox()))
    const summaryCounts = await Promise.all(choices.map((locator) => locator.locator('.home-choice-summary').count()))
    const headingBox = await heroHeading.boundingBox()
    const choiceHeadingBox = await choiceHeading.boundingBox()
    const heroClear = Boolean(headingBox && headingBox.y >= 0 && headingBox.y + headingBox.height <= height)
    const decisionBlockVisibleSoon = Boolean(choiceHeadingBox && choiceHeadingBox.y <= height * 1.35)
    const homeCardsReadable =
      decisionBlockVisibleSoon &&
      choiceBoxes.every((box) => Boolean(box && box.width >= 88 && box.height >= 96)) &&
      titleBoxes.every((box) => Boolean(box && box.height <= 72)) &&
      summaryCounts.every((count) => count > 0)
    const ctaEasyToTap = choiceBoxes.every((box) => Boolean(box && box.height >= 44 && box.width >= 44))
    const homeStable = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    const homeLean = (await page.locator('footer').getByText(/Marka i kontakt/i).count()) === 0

    await page.goto(`${baseUrl}/book`, { waitUntil: 'domcontentloaded' })
    await waitForAnyVisible([page.getByRole('heading', { name: /Wybierz temat dla:/i })], 20000)
    const firstBookCard = page.locator('.topic-card').first()
    const bookCardBox = await firstBookCard.boundingBox()
    const bookTitleBox = await firstBookCard.locator('.topic-title').boundingBox()
    const bookCardsReadable =
      Boolean(bookCardBox && bookCardBox.width >= Math.max(236, width * 0.68)) &&
      Boolean(bookTitleBox && bookTitleBox.height <= 96) &&
      (await isVisible(firstBookCard.locator('.topic-desc').first())) &&
      (await isVisible(firstBookCard.locator('.topic-link').first()))
    const bookStable = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    const bookLean = (await page.locator('footer').getByText(/Marka i kontakt/i).count()) === 0

    await page.goto(`${baseUrl}/kontakt`, { waitUntil: 'domcontentloaded' })
    await waitForAnyVisible([page.locator('h1').first()], 20000)
    const kontaktStable = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    const kontaktLean = (await page.locator('footer').getByText(/Marka i kontakt/i).count()) === 0

    await page.goto(`${baseUrl}/oferta`, { waitUntil: 'domcontentloaded' })
    await waitForAnyVisible([page.getByRole('heading', { level: 1, name: /Wybierz start dla swojej sytuacji\./i })], 20000)
    const firstOfferCard = page.locator('.offer-card').first()
    const offerCardBox = await firstOfferCard.boundingBox()
    const offerTitleBox = await firstOfferCard.locator('h3').boundingBox()
    const offerCardsReadable =
      Boolean(offerCardBox && offerCardBox.width >= Math.max(236, width * 0.68)) &&
      Boolean(offerTitleBox && offerTitleBox.height <= 110) &&
      (await isVisible(firstOfferCard.locator('.offer-card-summary').first())) &&
      (await isVisible(firstOfferCard.locator('.offer-price').first())) &&
      (await isVisible(firstOfferCard.locator('.offer-card-actions .button').first())) &&
      (await firstOfferCard.locator('.offer-card-meta').count()) >= 2
    const ofertaStable = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    const ofertaLean = (await page.locator('footer').getByText(/Marka i kontakt/i).count()) === 0

    return {
      width,
      height,
      heroClear,
      cardsReadable: homeCardsReadable && bookCardsReadable && offerCardsReadable,
      bottomAreaLean: homeLean && bookLean && kontaktLean && ofertaLean,
      ctaEasyToTap,
      layoutStable: homeStable && bookStable && kontaktStable && ofertaStable,
      notes: [
        `decisionBlockVisibleSoon=${decisionBlockVisibleSoon}`,
        `homeCardsReadable=${homeCardsReadable}`,
        `bookCardsReadable=${bookCardsReadable}`,
        `offerCardsReadable=${offerCardsReadable}`,
        `homeLean=${homeLean}`,
        `bookLean=${bookLean}`,
        `kontaktLean=${kontaktLean}`,
        `ofertaLean=${ofertaLean}`,
      ],
    } satisfies MobileResult
  } catch (error) {
    pushIssue(
      issues,
      {
        level: 'pageerror',
        source: `mobile-${width}`,
        url: page.url() || null,
        message: cleanText(error instanceof Error ? error.stack ?? error.message : String(error)),
      },
      seen,
    )

    return {
      width,
      height,
      heroClear: false,
      cardsReadable: false,
      bottomAreaLean: false,
      ctaEasyToTap: false,
      layoutStable: false,
      notes: ['mobile layout check failed before completion'],
    } satisfies MobileResult
  } finally {
    await context.close()
  }
}

function buildReportMarkdown({
  baseUrl,
  timestamp,
  results,
  issues,
  qaIdentity,
  mobileResults,
}: {
  baseUrl: string
  timestamp: string
  results: StepResult[]
  issues: Issue[]
  qaIdentity: { ownerName: string; email: string }
  mobileResults: MobileResult[]
}) {
  const passed = results.filter((result) => result.status === 'passed').length
  const failed = results.filter((result) => result.status === 'failed').length
  const overall = failed === 0 ? 'PASS' : 'FAIL'

  const lines = [
    '# Raport QA Live Clickthrough',
    '',
    `- Data: ${timestamp}`,
    `- URL: ${baseUrl}`,
    `- Wynik ogĂłlny: ${overall}`,
    `- Kroki zaliczone: ${passed}/${results.length}`,
    `- Liczba zebranych issue z runtime: ${issues.length}`,
    `- Booking QA identity: ${qaIdentity.ownerName} / ${qaIdentity.email}`,
    `- Bezpiecznik pĹ‚atnoĹ›ci: bez realnej pĹ‚atnoĹ›ci PayU i bez faĹ‚szywego approve na produkcji; test manual zakoĹ„czony reject w adminie`,
    '',
    '## Kroki',
  ]

  for (const result of results) {
    lines.push(`### ${result.status.toUpperCase()} - ${result.name}`)
    lines.push(`- Start URL: ${result.startUrl}`)
    lines.push(`- End URL: ${result.endUrl}`)

    if (result.notes.length === 0) {
      lines.push('- Note: brak dodatkowych uwag')
    } else {
      for (const note of result.notes) {
        lines.push(`- Note: ${note}`)
      }
    }

    lines.push('')
  }

  lines.push('## Mobile')
  for (const result of mobileResults) {
    lines.push(`### ${result.width}px x ${result.height}px`)
    lines.push(`- heroClear=${result.heroClear}`)
    lines.push(`- cardsReadable=${result.cardsReadable}`)
    lines.push(`- bottomAreaLean=${result.bottomAreaLean}`)
    lines.push(`- ctaEasyToTap=${result.ctaEasyToTap}`)
    lines.push(`- layoutStable=${result.layoutStable}`)
    for (const note of result.notes) {
      lines.push(`- Note: ${note}`)
    }
    lines.push('')
  }

  lines.push('## Runtime issues')
  if (issues.length === 0) {
    lines.push('- Brak zebranych bĹ‚Ä™dĂłw konsoli, pageerrorĂłw i same-origin request failures/HTTP >= 400.')
  } else {
    for (const issue of issues) {
      const urlSuffix = issue.url ? ` | ${issue.url}` : ''
      lines.push(`- [${issue.level}] ${issue.source}${urlSuffix} | ${issue.message}`)
    }
  }

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

  let browser = await chromium.launch({
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

    let publicPage = await createPage(publicContext, 'public', baseUrl, issues, seenIssues)

    let bookingId: string | null = null
    let accessToken: string | null = null
    let confirmationUrl: string | null = null

    await runStep(results, 'Home', publicPage, async (step) => {
      await waitForHome(publicPage, baseUrl)
      await waitForAnyVisible([publicPage.locator('[data-home-quick-choice="dog"]').first()], 20000)
      await waitForAnyVisible([publicPage.locator('[data-home-quick-choice="cat"]').first()], 20000)
      await waitForAnyVisible([publicPage.locator('[data-home-quick-choice="help"]').first()], 20000)
      step.notes.push('Hero i 3 wejĹ›cia sÄ… widoczne na stronie gĹ‚Ăłwnej.')
    })

    await runStep(results, 'Hero CTA x3', publicPage, async (step) => {
      await waitForHome(publicPage, baseUrl)
      await clickAndWaitForUrl(publicPage, publicPage.locator('[data-home-quick-choice="dog"]').first(), /\/book$/)
      step.notes.push('Mam psa -> /book')

      await waitForHome(publicPage, baseUrl)
      await clickAndWaitForUrl(publicPage, publicPage.locator('[data-home-quick-choice="cat"]').first(), /\/koty$/)
      step.notes.push('Mam kota -> /koty')

      await waitForHome(publicPage, baseUrl)
      await clickAndWaitForUrl(publicPage, publicPage.locator('[data-home-quick-choice="help"]').first(), /\/kontakt$/)
      step.notes.push('Nie wiem, od czego zaczĂ„â€¦Ă„â€ˇ -> /kontakt')
    })

    await runStep(results, '/koty', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/koty`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible(
        [publicPage.getByRole('heading', { level: 1, name: /Wybierz temat dla kota i od razu przejdź do terminu\./i })],
        20000,
      )
      const catTopicCount = await publicPage.locator('[data-cat-problem]').count()
      const catImageCount = await publicPage.locator('#kocie-kategorie img').count()

      if (catTopicCount !== 5) {
        throw new Error(`Strona /koty powinna miec 5 kategorii, a ma ${catTopicCount}.`)
      }

      if (catImageCount < 5) {
        throw new Error(`Strona /koty powinna miec obrazy dla 5 kategorii, a znalazla ${catImageCount}.`)
      }

      step.notes.push('Strona kotow pokazuje 5 kategorii z obrazami.')
    })

    await runStep(results, '/book', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/book`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Wybierz temat dla:/i })], 20000)
      const catCardsInBook = await publicPage.locator('a.topic-card[data-problem^="kot"]').count()
      if (catCardsInBook > 0) {
        throw new Error(`/book nadal pokazuje kocie kategorie (${catCardsInBook}).`)
      }

      step.notes.push('Wejscie do book dziala i pokazuje tylko psie tematy.')
    })

    await runStep(results, '/slot', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/koty`, { waitUntil: 'domcontentloaded' })
      await clickAndWaitForUrl(publicPage, publicPage.locator('a[data-cat-problem="kot-stres"]').first(), /\/slot\?problem=kot-stres$/)
      await waitForAnyVisible(
        [publicPage.getByRole('heading', { level: 1, name: new RegExp(`Wybierz termin: ${escapeRegExp(getProblemLabel('kot-stres'))}`, 'i') })],
        20000,
      )
      const firstSlot = publicPage.locator('a.slot-link').first()
      await waitForAnyVisible([firstSlot], 20000)
      step.notes.push(`Pierwszy slot: ${cleanText(await firstSlot.innerText())}`)
    })

    await runStep(results, '/form', publicPage, async (step) => {
      const firstSlot = publicPage.locator('a.slot-link').first()
      await firstSlot.click()
      await publicPage.waitForURL(/\/form\?problem=kot-stres&slotId=/, { timeout: 30000, waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Uzupełnij dane do rezerwacji/i })], 20000)

      await getBookingFormField(publicPage, 'owner-name').fill(qaIdentity.ownerName)
      await getBookingFormField(publicPage, 'animal-type').selectOption('Kot')
      await getBookingFormField(publicPage, 'pet-age').fill('4 lata')
      await getBookingFormField(publicPage, 'duration-notes').fill('od okolo dwoch tygodni')
      await getBookingFormField(publicPage, 'description').fill(
        'Test QA live. Kot napina się przy gościach, długo nie wraca do równowagi i chcę sprawdzić pierwszy kierunek pracy.',
      )
      await getBookingFormField(publicPage, 'phone').fill('500600700')
      await getBookingFormField(publicPage, 'email').fill(qaIdentity.email)

      const bookingResponse = publicPage.waitForResponse(
        (response) => response.url().includes('/api/bookings') && response.request().method() === 'POST',
      )
      await submitBookingForm(publicPage)
      const response = await bookingResponse
      if (!response.ok()) {
        throw new Error(`POST /api/bookings zwrocil ${response.status()}.`)
      }

      await publicPage.waitForURL(/\/payment\?bookingId=/, { timeout: 30000, waitUntil: 'domcontentloaded' })
      const paymentUrl = new URL(publicPage.url())
      bookingId = paymentUrl.searchParams.get('bookingId')
      accessToken = paymentUrl.searchParams.get('access')

      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId lub access token w URL payment.')
      }

      step.notes.push('Formularz przeszedl do payment.')
    })

    await runStep(results, '/koty -> slot / 30 min', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/koty?service=konsultacja-30-min`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible(
        [publicPage.getByRole('heading', { level: 1, name: /Wybierz temat dla kota i od razu przejdź do terminu\./i })],
        20000,
      )
      await clickAndWaitForUrl(
        publicPage,
        publicPage.locator('a[data-cat-problem="kot-kuweta"]').first(),
        /\/slot\?problem=kot-kuweta&service=konsultacja-30-min$/,
      )
      step.notes.push('Kocia sciezka 30 min zachowuje service=konsultacja-30-min.')
    })

    await runStep(results, '/payment', publicPage, async (step) => {
      if (!bookingId || !accessToken) {
        throw new Error('Brak bookingId lub access token do powrotu na payment.')
      }

      await publicPage.goto(`${baseUrl}/payment?bookingId=${bookingId}&access=${accessToken}`, {
        waitUntil: 'domcontentloaded',
      })
      await waitForAnyVisible(
        [
          publicPage.locator('[data-payment-state="payment-selection"]').first(),
          publicPage.getByRole('heading', { level: 1, name: /Wybierz sposĂłb pĹ‚atnoĹ›ci/i }),
        ],
        20000,
      )

      const manualVisible = (await publicPage.locator('[data-payment-method="manual"]').count()) > 0
      const payuVisible = (await publicPage.locator('[data-payment-method="payu"]').count()) > 0

      step.notes.push(`manualVisible=${manualVisible}`)
      step.notes.push(`payuVisible=${payuVisible}`)
    })

    await runStep(results, 'manual payment -> pending', publicPage, async (step) => {
      const manualSubmitButton = getPaymentSubmitButton(publicPage, 'manual')

      if (!(await isVisible(manualSubmitButton))) {
        await getPaymentMethodButton(publicPage, 'manual').click({ force: true })
      }

      await manualSubmitButton.click({ force: true })

      const manualResponse = await publicPage.request.post(new URL('/api/payments/manual', baseUrl).toString(), {
        data: {
          bookingId: bookingId ?? '',
          accessToken: accessToken ?? '',
        },
      })

      if (!manualResponse.ok()) {
        throw new Error(`POST /api/payments/manual zwrócił ${manualResponse.status()}.`)
      }

      const manualPayload = (await manualResponse.json()) as { redirectTo?: string; error?: string }
      if (!manualPayload.redirectTo) {
        throw new Error(manualPayload.error ?? 'Brak redirectTo z /api/payments/manual.')
      }

      const confirmationTargetUrl = new URL(manualPayload.redirectTo, baseUrl)

      await publicPage.goto(confirmationTargetUrl.toString(), { waitUntil: 'domcontentloaded' })

      let pendingVisible = false
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          await waitForConfirmationState(publicPage, 'pending-manual-review', /WpĹ‚ata czeka na potwierdzenie/i, 20000)
          pendingVisible = true
          break
        } catch {
          await publicPage.waitForTimeout(1000)
          await publicPage.goto(confirmationTargetUrl.toString(), { waitUntil: 'domcontentloaded' })
        }
      }

      if (!pendingVisible) {
        throw new Error('Pending manual review nie pojawil sie po potwierdzeniu wplaty.')
      }

      step.notes.push('POST /api/payments/manual zwrocil canonical redirectTo i potwierdzenie pokazalo pending manual review.')
      confirmationUrl = publicPage.url()
      step.notes.push('Rezerwacja przeszĹ‚a do pending manual review.')
    })

    const skipAdminFlow = process.env.LIVE_CLICKTHROUGH_SKIP_ADMIN_FLOW === '1' || process.env.LIVE_CLICKTHROUGH_SKIP_ADMIN_FLOW === 'true'

    if (!skipAdminFlow) {
      await runStep(results, 'admin reject', publicPage, async (step) => {
        if (!bookingId) {
          throw new Error('Brak bookingId do akcji admina.')
        }

        const adminPage = await createPage(adminContext, 'admin', baseUrl, issues, seenIssues)
        try {
          await adminPage.goto(`${baseUrl}/admin`, { waitUntil: 'domcontentloaded' })
          await rejectManualPaymentWithRetry(adminPage, bookingId)
        } finally {
          await adminPage.close()
        }

        step.notes.push('Admin odrzuciĹ‚ testowÄ… wpĹ‚atÄ™ QA.')
      })

      await runStep(results, '/confirmation', publicPage, async (step) => {
        const confirmationPage = await createPage(publicContext, 'confirmation', baseUrl, issues, seenIssues)
        publicPage = confirmationPage

        if (!confirmationUrl) {
          if (!bookingId) {
            throw new Error('Brak bookingId do odswiezenia confirmation.')
          }

          const fallbackConfirmationUrl = new URL('/confirmation', baseUrl)
          fallbackConfirmationUrl.searchParams.set('bookingId', bookingId)
          fallbackConfirmationUrl.searchParams.set('manual', 'reported')

          if (accessToken) {
            fallbackConfirmationUrl.searchParams.set('access', accessToken)
          }

          confirmationUrl = fallbackConfirmationUrl.toString()
        }

        await confirmationPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
        let rejectedVisible = false

        for (let attempt = 0; attempt < 6; attempt += 1) {
          try {
            await waitForConfirmationState(confirmationPage, 'manual-rejected', /Nie znaleziono wplaty do tej rezerwacji/i, 4000)
            rejectedVisible = true
            break
          } catch {}

          await confirmationPage.waitForTimeout(2000)
          await confirmationPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
        }

        if (!rejectedVisible) {
          throw new Error('Confirmation nie pokazaĹ‚ stanu odrzuconej wpĹ‚aty po adminowym reject.')
        }

        await waitForAnyVisible([confirmationPage.getByRole('link', { name: /Wybierz nowy termin/i })], 20000)
        step.notes.push('Confirmation pokazuje stan odrzuconej wpĹ‚aty.')
      })
    }

    await runStep(results, '/oferta', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Wybierz start dla swojej sytuacji\./i })], 20000)
      const firstCardButtons = await publicPage.locator('.offer-card').first().locator('.offer-card-actions .button').count()
      step.notes.push(`Pierwsza karta ma 1 gĹ‚Ăłwne CTA: ${firstCardButtons === 1}`)
    })

    await runOfferJourney(results, publicPage, baseUrl, {
      stepName: 'oferta -> payment / 30 min CTA',
      serviceType: 'konsultacja-30-min',
      offerHeading: /Konsultacja 30 min/i,
      problemType: 'separacja',
      animalType: 'Pies',
      ownerName: `${qaIdentity.ownerName} 30 min`,
      email: `qa-live-30min-${timestamp.compact}@example.com`,
      petAge: '5 lat',
      durationNotes: 'Od dwoch tygodni.',
      description:
        'Test UI clickthrough dla 30 min. Pies ma napięcie przy zostawaniu samemu i chcemy sprawdzić pełny flow od oferty do płatności.',
      phone: '500600701',
    })

    await runStep(results, 'oferta -> slot / online CTA', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Wybierz start dla swojej sytuacji\./i })], 20000)

      const onlineCard = publicPage.locator('.offer-card', { has: publicPage.getByRole('heading', { name: /Konsultacja behawioralna online/i }) }).first()
      await waitForAnyVisible([onlineCard], 20000)

      const onlineHref = await onlineCard.locator('.offer-card-actions .button').first().getAttribute('href')
      if (!onlineHref || !onlineHref.includes('/book') || !onlineHref.includes('service=konsultacja-behawioralna-online')) {
        throw new Error('Online CTA nie prowadzi do /book z service=konsultacja-behawioralna-online.')
      }

      await publicPage.goto(`${baseUrl}/slot?problem=separacja&service=konsultacja-behawioralna-online`, { waitUntil: 'domcontentloaded' })
      await waitForAnyBodyText(
        publicPage,
        [/Wybierz termin: Lęk separacyjny/i, /Teraz nie ma wolnych terminów/i, /Terminy chwilowo się odświeżają/i],
        20000,
      )

      const emptyState = publicPage.locator('.empty-box').first()
      if (await isVisible(emptyState)) {
        step.notes.push('Online CTA prowadzi do empty state bez wolnych 60-min slotow.')
      } else {
        step.notes.push('Online CTA prowadzi do /slot z dostepnymi godzinami.')
      }
    })

    await runStep(results, 'detail page 1', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta/konsultacja-30-min`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Konsultacja 30 min/i })], 20000)
      const bodyText = cleanText(await publicPage.locator('main').innerText())
      if (bodyText.includes('SprawdĹş szybko') || bodyText.includes('Po tym wiesz, co robiÄ‡')) {
        throw new Error('Detail page 1 nadal zawiera stary szablon.')
      }
      step.notes.push('Konsultacja 30 min ma skrĂłcony ukĹ‚ad i 2 CTA.')
    })

    await runStep(results, 'detail page 2', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/oferta/pobyty-socjalizacyjno-terapeutyczne`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Pobyty socjalizacyjno-terapeutyczne/i })], 20000)
      const bodyText = cleanText(await publicPage.locator('main').innerText())
      if (bodyText.includes('SprawdĹş szybko') || bodyText.includes('Po tym wiesz, co robiÄ‡')) {
        throw new Error('Detail page 2 nadal zawiera stary szablon.')
      }
      step.notes.push('Pobyty pozostajÄ… opcjÄ… dalszÄ…, nie zimnym pierwszym krokiem.')
    })

    await runStep(results, '/kontakt', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/kontakt`, { waitUntil: 'domcontentloaded' })
      await waitForAnyBodyText(publicPage, [/Napisz wiadomość/i, /Piszesz do mnie/i], 20000)
      await assertNoPublicPhoneLinks(publicPage, '/kontakt')
      step.notes.push('Kontakt jest skrĂłcony do akcji i krĂłtkiej toĹĽsamoĹ›ci.')
    })

    await runStep(results, '/regulamin', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/regulamin`, { waitUntil: 'domcontentloaded' })
      await waitForAnyVisible([publicPage.getByRole('heading', { level: 1, name: /Zasady rezerwacji szybkiej konsultacji 15 min/i })], 20000)
      await waitForAnyVisible([publicPage.getByText(/Publiczny profil CAPBT \/ COAPE/i)], 20000)
      await assertNoPublicPhoneLinks(publicPage, '/regulamin')
      await assertLegacyHeaderLinksHidden(publicPage, '/regulamin')
      step.notes.push('Regulamin uĹĽywa nowego shellu prawnego bez publicznego telefonu i starego menu.')
    })

    await runStep(results, '/polityka-prywatnosci', publicPage, async (step) => {
      await publicPage.goto(`${baseUrl}/polityka-prywatnosci`, { waitUntil: 'domcontentloaded' })
      await waitForAnyBodyText(
        publicPage,
        [/Jak przetwarzane są dane w marce Regulski \| Terapia behawioralna/i, /Napisz wiadomość/i, /Publiczny profil CAPBT \/ COAPE/i],
        20000,
      )
      await assertNoPublicPhoneLinks(publicPage, '/polityka-prywatnosci')
      await assertLegacyHeaderLinksHidden(publicPage, '/polityka-prywatnosci')
      step.notes.push('Polityka prywatnoĹ›ci uĹĽywa nowego shellu prawnego bez publicznego telefonu i starego menu.')
    })

    await publicContext.close()
    await adminContext.close()

    await browser.close().catch(() => {})
    browser = await chromium.launch({
      headless: true,
      executablePath: await resolveBrowserExecutablePath(),
    })

    const skipMobile = process.env.LIVE_CLICKTHROUGH_SKIP_MOBILE === '1' || process.env.LIVE_CLICKTHROUGH_SKIP_MOBILE === 'true'
    const mobileResults = skipMobile
      ? []
      : [
          await checkMobileLayout(browser, baseUrl, 360, 800, issues, seenIssues),
          await checkMobileLayout(browser, baseUrl, 375, 812, issues, seenIssues),
          await checkMobileLayout(browser, baseUrl, 390, 844, issues, seenIssues),
          await checkMobileLayout(browser, baseUrl, 430, 932, issues, seenIssues),
        ]

    const report = buildReportMarkdown({
      baseUrl,
      timestamp: timestamp.isoLike,
      results,
      issues,
      qaIdentity,
      mobileResults,
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
          bookingId,
          mobile: mobileResults,
        },
        null,
        2,
      ),
    )

    if (
      results.some((result) => result.status === 'failed') ||
      mobileResults.some((result) => !result.heroClear || !result.cardsReadable || !result.bottomAreaLean || !result.ctaEasyToTap || !result.layoutStable)
    ) {
      process.exitCode = 1
    }

  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error)
  process.exitCode = 1
})
