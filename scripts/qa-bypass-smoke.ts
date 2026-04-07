import assert from 'node:assert/strict'
import { access, rm } from 'node:fs/promises'
import { spawn, type ChildProcess } from 'node:child_process'
import { loadEnvConfig } from '@next/env'
import { chromium, type Locator, type Page } from 'playwright-core'
import { createLocalDataSandbox } from './lib/local-data-sandbox'

const rootDir = process.cwd()
const port = 3267
const appUrl = `http://localhost:${port}`
const adminSecret = 'codex-admin-secret'
const routeNavigationTimeoutMs = 30_000
const slowRouteTimeoutMs = 120_000
const qaSmokeOwnerName = 'QA Smoke'
const qaSmokeEmail = 'qa-smoke@example.com'
const qaSmokePhone = '500700800'

function getWarsawSlotInMinutes(offsetMinutes: number) {
  const target = new Date(Date.now() + offsetMinutes * 60 * 1000)
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const values: Record<string, string> = {}

  for (const part of formatter.formatToParts(target)) {
    if (part.type !== 'literal') {
      values[part.type] = part.value
    }
  }

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  }
}

async function cleanLocalData(dataDir: string) {
  await rm(`${dataDir}/availability.json`, { force: true })
  await rm(`${dataDir}/pricing-settings.json`, { force: true })
  await rm(`${dataDir}/bookings.json`, { force: true })
  await rm(`${dataDir}/users.json`, { force: true })
  await rm(`${dataDir}/funnel-events.json`, { force: true })
  await rm(`${dataDir}/prep-materials`, { recursive: true, force: true })
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(appUrl, { cache: 'no-store' })
      if (response.status > 0) {
        return
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('Local QA smoke server did not become ready in time.')
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

  throw new Error('Nie znaleziono lokalnej przegladarki Chromium (Chrome lub Edge) do qa-bypass-smoke.')
}

async function isVisible(locator: Locator) {
  try {
    return await locator.isVisible()
  } catch {
    return false
  }
}

async function waitForCondition(check: () => Promise<boolean>, timeoutMs: number, errorMessage: string) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    if (await check()) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(errorMessage)
}

function escapeAttributeValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function createBasicAuthHeader(password: string) {
  return `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`
}

async function waitForBookingRow(page: Page, bookingId: string, bookingEmail: string, timeout = 20_000) {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    const byId = page.locator(`[data-booking-id="${escapeAttributeValue(bookingId)}"]`).first()
    if (await isVisible(byId)) {
      return byId
    }

    const byEmail = page.locator(`[data-booking-email="${escapeAttributeValue(bookingEmail)}"]`).first()
    if (await isVisible(byEmail)) {
      return byEmail
    }

    const fallback = page.locator('.booking-row', { hasText: bookingEmail }).first()
    if (await isVisible(fallback)) {
      return fallback
    }

    await page.waitForTimeout(250)
  }

  throw new Error('Booking row was not visible in time.')
}

async function getTimerValue(page: Page) {
  try {
    return (await page.locator('.timer-box').first().innerText()).trim()
  } catch {
    return null
  }
}

async function roomIsMarkedActive(page: Page) {
  const timerValue = await getTimerValue(page)

  return (
    (await isVisible(page.getByText(/Rozmowa aktywna/i).first())) ||
    (await isVisible(page.getByRole('button', { name: /Rozmowa trwa/i }))) ||
    Boolean(timerValue && timerValue !== '15:00')
  )
}

async function startRoomTimerWithRetry(page: Page) {
  const deadline = Date.now() + 30_000
  let lastObservedTimer = (await getTimerValue(page)) ?? 'missing'
  let lastError = ''

  while (Date.now() < deadline) {
    if (await roomIsMarkedActive(page)) {
      return
    }

    const startButton = page.getByRole('button', { name: /Uruchom licznik 15 minut/i })

    if (await isVisible(startButton)) {
      try {
        await startButton.scrollIntoViewIfNeeded()
        await startButton.evaluate((button) => {
          ;(button as HTMLButtonElement).click()
        })
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
      }
    }

    await page.waitForTimeout(1000)
    lastObservedTimer = (await getTimerValue(page)) ?? lastObservedTimer
  }

  throw new Error(
    `Room timer started, but the UI did not switch to the active-room state in time. Last timer value: ${lastObservedTimer}.${lastError ? ` Last click error: ${lastError}` : ''}`,
  )
}

async function createAvailabilitySlotViaApi(bookingDate: string, bookingTime: string) {
  const response = await fetch(`${appUrl}/api/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: createBasicAuthHeader(adminSecret),
    },
    body: JSON.stringify({ bookingDate, bookingTime }),
  })

  const bodyText = await response.text()
  let payload: { slot?: { id?: string }; error?: string } = {}

  if ((response.headers.get('content-type') ?? '').includes('application/json')) {
    try {
      payload = JSON.parse(bodyText) as { slot?: { id?: string }; error?: string }
    } catch {}
  }

  assert.equal(
    response.ok,
    true,
    `POST /api/availability returned ${response.status}${payload.error ? `: ${payload.error}` : `: ${bodyText}`}.`,
  )
  assert.ok(payload.slot?.id, 'Expected slot id from availability API.')

  return payload.slot.id
}

async function createQaBookingViaApi(slotId: string, ownerName: string, problemType: 'szczeniak' | 'kot-stres') {
  const response = await fetch(`${appUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerName,
      serviceType: null,
      problemType,
      animalType: problemType === 'kot-stres' ? 'Kot' : 'Pies',
      petAge: problemType === 'kot-stres' ? '3 lata' : '2 lata',
      durationNotes: 'QA smoke flow',
      description:
        problemType === 'kot-stres'
          ? 'Testowa rezerwacja QA dla sciezki bez realnej platnosci.'
          : 'Testowa rezerwacja QA dla sciezki adminowego potwierdzenia.',
      phone: qaSmokePhone,
      email: qaSmokeEmail,
      slotId,
      qaBooking: true,
    }),
  })

  const bodyText = await response.text()
  let payload: { bookingId?: string; accessToken?: string; error?: string } = {}

  if ((response.headers.get('content-type') ?? '').includes('application/json')) {
    try {
      payload = JSON.parse(bodyText) as { bookingId?: string; accessToken?: string; error?: string }
    } catch {}
  }

  assert.equal(
    response.ok,
    true,
    `POST /api/bookings returned ${response.status}${payload.error ? `: ${payload.error}` : `: ${bodyText}`}.`,
  )
  assert.ok(payload.bookingId, 'Expected bookingId from QA booking API.')
  assert.ok(payload.accessToken, 'Expected access token from QA booking API.')

  return {
    bookingId: payload.bookingId,
    accessToken: payload.accessToken,
  }
}

function isRetryableSmokeError(error: unknown) {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  return (
    message.includes('fetch failed') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ERR_CONNECTION_REFUSED') ||
    message.includes('ERR_CONNECTION_RESET') ||
    message.includes('Local QA smoke server did not become ready') ||
    message.includes('Page crashed') ||
    message.includes('Target crashed') ||
    message.includes('Target page, context or browser has been closed')
  )
}

async function runQaSmokeOnce() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'mock'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.ADMIN_ACCESS_SECRET = adminSecret
  process.env.TEST_CHECKOUT_ENABLED = 'true'
  process.env.QA_CHECKOUT_EMAIL_ALLOWLIST = qaSmokeEmail
  process.env.QA_CHECKOUT_PHONE_ALLOWLIST = qaSmokePhone
  process.env.VERCEL_ENV = 'production'
  process.env.RESEND_API_KEY = ''
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_BANK_ACCOUNT = '11112222333344445555666677'
  process.env.MANUAL_PAYMENT_ACCOUNT_NAME = 'Krzysztof Regulski'
  process.env.SMS_PROVIDER = 'disabled'
  delete process.env.PAYU_CLIENT_ID
  delete process.env.PAYU_CLIENT_SECRET
  delete process.env.PAYU_POS_ID
  delete process.env.PAYU_SECOND_KEY

  const sandbox = await createLocalDataSandbox('qa-bypass-smoke', rootDir)
  const { dataDir } = sandbox

  let server: ChildProcess | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData(dataDir)

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '--', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd: rootDir,
      env: process.env,
      stdio: 'ignore',
      windowsHide: true,
    })

    await waitForServer()

    const checkoutSlot = getWarsawSlotInMinutes(12)
    const adminSlot = getWarsawSlotInMinutes(32)
    const checkoutAvailabilityId = await createAvailabilitySlotViaApi(checkoutSlot.date, checkoutSlot.time)
    const adminAvailabilityId = await createAvailabilitySlotViaApi(adminSlot.date, adminSlot.time)

    assert.ok(checkoutAvailabilityId, 'Expected a custom QA checkout slot.')
    assert.ok(adminAvailabilityId, 'Expected a custom QA admin slot.')

    browser = await chromium.launch({
      headless: true,
      executablePath: await resolveBrowserExecutablePath(),
    })

    const publicContext = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 390, height: 844 },
    })
    const adminContext = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1200 },
      httpCredentials: { username: 'admin', password: adminSecret },
    })

    const publicPage = await publicContext.newPage()
    const adminPage = await adminContext.newPage()

    const checkoutBooking = await createQaBookingViaApi(checkoutAvailabilityId, `${qaSmokeOwnerName} Checkout`, 'kot-stres')
    await publicPage.goto(
      `${appUrl}/payment?bookingId=${encodeURIComponent(checkoutBooking.bookingId)}&access=${encodeURIComponent(
        checkoutBooking.accessToken,
      )}&qa=1`,
      { waitUntil: 'domcontentloaded' },
    )
    await publicPage.getByRole('heading', { name: /Kontrolowany checkout testowy/i }).waitFor()
    await publicPage.locator('[data-payment-method-selected="qa"]').waitFor()
    assert.equal(await publicPage.locator('[data-qa-booking="true"]').count(), 1)
    assert.equal(await publicPage.locator('[data-payment-submit="qa"]').count(), 1)
    assert.equal(await publicPage.locator('[data-payment-submit="manual"]').count(), 0)
    assert.equal(await publicPage.locator('[data-payment-submit="payu"]').count(), 0)

    await Promise.all([
      publicPage.waitForURL(/\/confirmation\?bookingId=/, {
        timeout: routeNavigationTimeoutMs,
        waitUntil: 'domcontentloaded',
      }),
      publicPage.locator('[data-payment-submit="qa"]').click(),
    ])

    await publicPage.locator('[data-confirmation-state="confirmed"]').waitFor()
    await publicPage.getByRole('heading', { name: /Testowy checkout QA zostal potwierdzony/i }).waitFor()
    assert.equal(await publicPage.locator('textarea').count() > 0, true)
    const roomJoinHref = await publicPage.getByRole('link', { name: /Dolacz do rozmowy audio/i }).getAttribute('href')
    assert.ok(roomJoinHref, 'Expected QA confirmation page to expose room link.')

    await publicPage.goto(new URL(roomJoinHref, appUrl).toString(), { waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10_000 })
    await startRoomTimerWithRetry(publicPage)
    assert.equal(await publicPage.getByText(/Pokoj aktywny/i).isVisible(), true)

    const adminBooking = await createQaBookingViaApi(adminAvailabilityId, `${qaSmokeOwnerName} Admin`, 'szczeniak')
    await adminPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    await adminPage.getByRole('heading', { name: /Rezerwacje.*terminy/i }).waitFor()
    const bookingRow = await waitForBookingRow(adminPage, adminBooking.bookingId, qaSmokeEmail)
    const qaConfirmButton = bookingRow.locator('[data-admin-booking-action="qa-confirm"]').first()
    await qaConfirmButton.waitFor()

    const qaConfirmResponsePromise = adminPage.waitForResponse(
      (response) =>
        response.url().includes(`/api/admin/bookings/${adminBooking.bookingId}/qa-confirm`) &&
        response.request().method() === 'POST',
      { timeout: routeNavigationTimeoutMs },
    )
    await qaConfirmButton.click({ force: true })
    const qaConfirmResponse = await qaConfirmResponsePromise
    assert.equal(qaConfirmResponse.ok(), true)

    await adminPage.reload({ waitUntil: 'domcontentloaded' })
    const refreshedRow = await waitForBookingRow(adminPage, adminBooking.bookingId, qaSmokeEmail)
    await waitForCondition(
      async () => isVisible(refreshedRow.locator('[data-admin-booking-action="done"]').first()),
      slowRouteTimeoutMs,
      'QA confirm did not expose the done action in admin in time.',
    )

    const adminConfirmationPage = await publicContext.newPage()
    await adminConfirmationPage.goto(
      `${appUrl}/confirmation?bookingId=${encodeURIComponent(adminBooking.bookingId)}&access=${encodeURIComponent(
        adminBooking.accessToken,
      )}&qa=1`,
      { waitUntil: 'domcontentloaded' },
    )
    await adminConfirmationPage.locator('[data-confirmation-state="confirmed"]').waitFor()
    await adminConfirmationPage.getByRole('heading', { name: /Testowy checkout QA zostal potwierdzony/i }).waitFor()
    assert.equal(await adminConfirmationPage.locator('textarea').count() > 0, true)

    console.log(
      JSON.stringify(
        {
          qaCheckoutVisible: true,
          qaCheckoutConfirmed: true,
          qaRoomActive: true,
          qaAdminConfirmWorked: true,
        },
        null,
        2,
      ),
    )

    await adminConfirmationPage.close()
    await adminPage.close()
    await publicPage.close()
    await publicContext.close()
    await adminContext.close()
  } finally {
    if (browser) {
      await browser.close().catch(() => {})
    }

    if (server) {
      server.kill()
    }

    await sandbox.cleanup().catch(() => {})
  }
}

async function main() {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await runQaSmokeOnce()
      return
    } catch (error) {
      if (attempt === 2 || !isRetryableSmokeError(error)) {
        throw error
      }
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error)
  process.exitCode = 1
})
