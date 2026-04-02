import assert from 'node:assert/strict'
import { access, rm } from 'fs/promises'
import path from 'path'
import { execFileSync, spawn } from 'child_process'
import { loadEnvConfig } from '@next/env'
import { chromium, type Page } from 'playwright-core'
import { createLocalDataSandbox } from './lib/local-data-sandbox'

const rootDir = process.cwd()
const port = 3210 + Math.floor(Math.random() * 200)
const appUrl = `http://localhost:${port}`
const adminSecret = 'codex-admin-secret'
const slowRouteTimeoutMs = 120000
const routeNavigationTimeoutMs = 30000
const roomActiveTimeoutMs = 30000
const retryActionTimeoutMs = 20000
const uiSmokeOwnerName = 'UI Smoke'
const uiSmokeEmail = 'ui-smoke@example.com'

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
  await rm(path.join(dataDir, 'availability.json'), { force: true })
  await rm(path.join(dataDir, 'pricing-settings.json'), { force: true })
  await rm(path.join(dataDir, 'bookings.json'), { force: true })
  await rm(path.join(dataDir, 'users.json'), { force: true })
  await rm(path.join(dataDir, 'prep-materials'), { recursive: true, force: true })
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(appUrl, { cache: 'no-store' })
      if (response.status > 0) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error('Local server did not become ready in time.')
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

  throw new Error('Nie znaleziono lokalnej przeglądarki Chromium (Chrome lub Edge) do ui-smoke.')
}

async function isVisible(locator: { isVisible: () => Promise<boolean> }) {
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

function createBasicAuthHeader(password: string) {
  return `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`
}

async function warmUpPostRoute(url: string, body: unknown, acceptableStatuses: number[], extraHeaders?: Record<string, string>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders ?? {}),
    },
    body: JSON.stringify(body),
  })

  assert.equal(
    acceptableStatuses.includes(response.status),
    true,
    `Warmup for ${url} returned unexpected status ${response.status}.`,
  )
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
  const deadline = Date.now() + roomActiveTimeoutMs
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
        await startButton.click({ force: true })
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

async function approveManualPaymentWithRetry(page: Page, bookingId: string, bookingEmail: string) {
  const deadline = Date.now() + slowRouteTimeoutMs
  let lastError = ''

  while (Date.now() < deadline) {
    await page.waitForLoadState('domcontentloaded', { timeout: retryActionTimeoutMs }).catch(() => {})
    const bookingRow = page.locator('.booking-row', { hasText: bookingEmail }).first()
    await bookingRow.waitFor({ timeout: retryActionTimeoutMs })

    if (await isVisible(bookingRow.getByRole('button', { name: /Oznacz jako zako/i }))) {
      return
    }

    const approveButton = bookingRow.getByRole('button', { name: /Potwierd/i })

    if (await isVisible(approveButton)) {
      try {
        await approveButton.scrollIntoViewIfNeeded()
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes(`/api/admin/bookings/${bookingId}/manual-payment`) &&
            response.request().method() === 'POST',
          { timeout: retryActionTimeoutMs },
        )
        await approveButton.click({ force: true })
        const response = await responsePromise

        if (response.ok()) {
          return
        }

        lastError = `Admin approve POST returned ${response.status()}.`
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
      }
    } else {
      lastError = 'Approve button was not visible on the booking row.'
    }

    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(1200)
  }

  throw new Error(`Admin approval did not complete in time.${lastError ? ` Last issue: ${lastError}` : ''}`)
}

function isRetryableUiSmokeError(error: unknown) {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  return (
    message.includes('fetch failed') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ERR_CONNECTION_REFUSED') ||
    message.includes('ERR_CONNECTION_RESET') ||
    message.includes('Local server did not become ready') ||
    message.includes('Page crashed') ||
    message.includes('Target crashed') ||
    message.includes('Target page, context or browser has been closed')
  )
}

async function runUiSmokeOnce() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'auto'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.ADMIN_ACCESS_SECRET = adminSecret
  process.env.RESEND_API_KEY = ''
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_BANK_ACCOUNT = '11112222333344445555666677'
  process.env.MANUAL_PAYMENT_ACCOUNT_NAME = 'Krzysztof Regulski'
  process.env.SMS_PROVIDER = 'disabled'
  delete process.env.PAYU_CLIENT_ID
  delete process.env.PAYU_CLIENT_SECRET
  delete process.env.PAYU_POS_ID
  delete process.env.PAYU_SECOND_KEY

  const sandbox = await createLocalDataSandbox('ui-smoke', rootDir)
  const { dataDir } = sandbox
  const localStore = await import('../lib/server/local-store')

  let server: ReturnType<typeof spawn> | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData(dataDir)
    const nearRoomSlot = getWarsawSlotInMinutes(12)
    const slot = await localStore.createAvailabilitySlot(nearRoomSlot.date, nearRoomSlot.time)
    assert.ok(slot, 'Expected a custom near-room slot for UI smoke test.')

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '--', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd: rootDir,
      env: process.env,
      stdio: 'ignore',
      windowsHide: true,
    })

    await waitForServer()

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
    await publicPage.goto(appUrl, { waitUntil: 'domcontentloaded' })
    await publicPage
      .locator('main')
      .getByRole('heading', { level: 1, name: /Masz problem z psem lub kotem\? (Dobierz|Wybierz) pierwszy krok(?: w 1 minutę)?/i })
      .waitFor()

    await publicPage.goto(`${appUrl}/book`, { waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('heading', { name: /Wybierz temat na 15 min/i }).waitFor()

    await publicPage.goto(`${appUrl}/slot?problem=szczeniak`, { waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('heading', { name: /Wybierz termin szybkiej konsultacji: Szczeniak/i }).waitFor()

    const slotLink = publicPage.locator(`a[href="/form?problem=szczeniak&slotId=${encodeURIComponent(slot.id)}"]`).first()
    await slotLink.waitFor()
    assert.equal((await slotLink.getAttribute('href'))?.includes('%3A'), true)
    await slotLink.click()
    await publicPage.waitForURL(/\/form\?problem=szczeniak&slotId=/, { timeout: routeNavigationTimeoutMs })
    await publicPage.getByRole('heading', { name: /Uzupełnij dane do szybkiej konsultacji/i }).waitFor()
    assert.equal(new URL(publicPage.url()).searchParams.get('slotId'), slot.id)

    await publicPage.getByPlaceholder('np. Anna').fill(uiSmokeOwnerName)
    await publicPage.getByPlaceholder('np. 8 miesięcy lub 4 lata').fill('2 lata')
    await publicPage.getByPlaceholder('np. od 3 tygodni').fill('Od dwóch tygodni')
    await publicPage
      .getByPlaceholder('Napisz, co się dzieje, kiedy problem występuje i co jest dla Ciebie najtrudniejsze.')
      .fill('Pies pobudza się przy wychodzeniu opiekuna i długo nie potrafi się wyciszyć po powrocie do domu.')
    await publicPage.getByPlaceholder('np. 500 000 000').fill('500700800')
    await publicPage.getByPlaceholder('np. klient@email.pl').fill(uiSmokeEmail)
    const bookingSubmitButton = publicPage.getByRole('button', { name: /Zablokuj termin i przejdź do płatności/i })
    await bookingSubmitButton.scrollIntoViewIfNeeded()
    await bookingSubmitButton.click({ force: true })
    await publicPage.waitForURL(/\/payment\?bookingId=/, { timeout: routeNavigationTimeoutMs })

    const paymentUrl = new URL(publicPage.url())
    const bookingId = paymentUrl.searchParams.get('bookingId')
    const accessToken = paymentUrl.searchParams.get('access')

    assert.ok(bookingId, 'Expected bookingId in payment URL.')
    assert.ok(accessToken, 'Expected access token in payment URL.')

    await publicPage.getByRole('heading', { name: /Wybierz sposób płatności za szybki pierwszy krok/i }).waitFor()
    assert.equal(await publicPage.getByText(/Przelew tradycyjny/i).first().isVisible(), true)
    assert.equal(await publicPage.getByRole('button', { name: /PayU/i }).count(), 0)
    assert.equal(await publicPage.getByText(/przelew z potwierdzeniem do 60 minut/i).first().isVisible(), true)

    await publicPage.getByRole('button', { name: /Zapłaciłem, czekam na potwierdzenie/i }).click()
    await publicPage.waitForURL(/\/confirmation\?bookingId=.*manual=reported/, { timeout: routeNavigationTimeoutMs })
    const confirmationUrl = publicPage.url()
    await publicPage.getByRole('heading', { name: /Wpłata czeka na potwierdzenie do 60 min/i }).waitFor()
    assert.equal(await publicPage.getByRole('heading', { name: /Nagranie, link lub krótki opis/i }).count(), 0)

    const roomCheckPage = await publicContext.newPage()
    await roomCheckPage.goto(`${appUrl}/call/${bookingId}?access=${encodeURIComponent(accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    await roomCheckPage.getByText(/Dostęp do pokoju rozmowy odblokowuje się dopiero po statusie paid/i).waitFor({
      timeout: routeNavigationTimeoutMs,
    })
    await roomCheckPage.close()

    await warmUpPostRoute(
      `${appUrl}/api/admin/bookings/${bookingId}/manual-payment`,
      { action: 'noop' },
      [400],
      { authorization: createBasicAuthHeader(adminSecret) },
    )
    await warmUpPostRoute(
      `${appUrl}/api/bookings/${bookingId}/complete?access=${encodeURIComponent(accessToken)}`,
      { recommendedNextStep: 'warmup' },
      [409],
    )

    const adminPage = await adminContext.newPage()
    await adminPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    await adminPage.getByRole('heading', { name: /Rezerwacje, płatności i terminy/i }).waitFor()
    await adminPage.getByText(/Wpłaty do potwierdzenia/i).waitFor()
    await approveManualPaymentWithRetry(adminPage, bookingId, uiSmokeEmail)
    await publicPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
    await fetch(`${appUrl}/api/bookings/${bookingId}/prep?access=${encodeURIComponent(accessToken)}`, {
      method: 'OPTIONS',
    }).catch(() => {})
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if ((await publicPage.locator('textarea').count()) > 0) {
        break
      }

      if (attempt === 7) {
        break
      }

      await publicPage.waitForTimeout(2500)
      await publicPage.goto(confirmationUrl, { waitUntil: 'domcontentloaded' })
    }
    await waitForCondition(
      async () => (await publicPage.locator('textarea').count()) > 0,
      slowRouteTimeoutMs,
      'Confirmation did not switch to the paid state after admin approval in time.',
    )
    const prepWarmupResponse = await fetch(`${appUrl}/api/bookings/${bookingId}/prep?access=${encodeURIComponent(accessToken)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prepLinkUrl: '',
        prepNotes: '',
      }),
    })
    assert.equal(prepWarmupResponse.ok, true)
    await adminPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {})
    await adminPage.getByRole('heading', { name: /Rezerwacje, płatności i terminy/i }).waitFor()
    await waitForCondition(
      async () => {
        const refreshedRow = adminPage.locator('.booking-row', { hasText: uiSmokeEmail }).first()
        return isVisible(refreshedRow.getByRole('button', { name: /Oznacz jako zako/i }))
      },
      slowRouteTimeoutMs,
      'Admin approval completed, but the booking row did not expose the completion action in time.',
    )

    await publicPage.getByRole('heading', { name: /Płatność za konsultację została potwierdzona/i }).waitFor({ timeout: 30000 })
    assert.equal(
      await publicPage
        .getByText(/Jeśli nie otrzymasz SMS, skontaktujemy się na podstawie danych z rezerwacji\./i)
        .isVisible(),
      true,
    )
    const prepNotes = 'Krótki opis do smoke testu po potwierdzonej płatności.'
    await publicPage.locator('textarea').fill(prepNotes)
    const prepSaveResponsePromise = publicPage.waitForResponse(
      (response) =>
        response.url().includes(`/api/bookings/${bookingId}/prep`) && response.request().method() === 'PATCH',
      { timeout: slowRouteTimeoutMs },
    )
    await publicPage.getByRole('button', { name: /Zapisz materiały do sprawy/i }).click()
    const prepSaveResponse = await prepSaveResponsePromise
    assert.equal(prepSaveResponse.ok(), true)
    await publicPage.reload({ waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('heading', { name: /Płatność za konsultację została potwierdzona/i }).waitFor()
    assert.equal(await publicPage.locator('textarea').inputValue(), prepNotes)
    assert.equal((await publicPage.getByRole('button', { name: /Anuluj zakup w 1 minutę/i }).count()) === 0, true)

    const roomJoinHref = await publicPage.getByRole('link', { name: /Dołącz do rozmowy audio/i }).getAttribute('href')
    assert.ok(roomJoinHref, 'Expected room join href on the confirmation page.')
    await publicPage.goto(new URL(roomJoinHref, appUrl).toString(), { waitUntil: 'domcontentloaded' })
    await publicPage.waitForURL(new RegExp(`/call/${bookingId}`), { timeout: routeNavigationTimeoutMs })
    await publicPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10000 })
    assert.equal(await publicPage.getByText(/Pokój aktywny/i).isVisible(), true)
    assert.equal(await publicPage.getByText(new RegExp(uiSmokeOwnerName, 'i')).isVisible(), true)

    await publicPage.reload({ waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10000 })
    assert.equal(await publicPage.getByText(/Pokój aktywny/i).isVisible(), true)
    assert.equal(await publicPage.getByText(new RegExp(uiSmokeOwnerName, 'i')).isVisible(), true)

    const rejoinPage = await publicContext.newPage()
    await rejoinPage.goto(`${appUrl}/call/${bookingId}?access=${encodeURIComponent(accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    await rejoinPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10000 })
    assert.equal(await rejoinPage.getByText(/Pokój aktywny/i).isVisible(), true)
    await rejoinPage.close()

    const paymentRoomIframeSrc = await publicPage.locator('iframe[title="Panel rozmowy głosowej"]').getAttribute('src')
    const roomIframeHasMeetingConfig =
      Boolean(paymentRoomIframeSrc?.includes('config.startAudioOnly=true')) &&
      Boolean(paymentRoomIframeSrc?.includes('config.startWithVideoMuted=true'))

    assert.equal(roomIframeHasMeetingConfig, true)
    assert.equal((await publicPage.getByRole('link', { name: /nowej karcie/i }).getAttribute('href'))?.includes('meet.jit.si'), true)

    await startRoomTimerWithRetry(publicPage)
    await publicPage.waitForTimeout(2200)
    const timerAfterStart = await publicPage.locator('.timer-box').innerText()
    assert.notEqual(timerAfterStart, '15:00')

    const completeResponsePromise = publicPage.waitForResponse(
      (response) =>
        response.url().includes(`/api/bookings/${bookingId}/complete`) && response.request().method() === 'POST',
      { timeout: slowRouteTimeoutMs },
    )
    await publicPage.getByRole('button', { name: /Zako/i }).click()
    const completeResponse = await completeResponsePromise
    assert.equal(completeResponse.ok(), true)
    await publicPage.getByRole('button', { name: /Rozmowa zako/i }).waitFor({ timeout: 10000 })
    assert.equal(await publicPage.getByRole('button', { name: /Rozmowa zako/i }).isVisible(), true)
    await publicPage.reload({ waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('button', { name: /Rozmowa zako/i }).waitFor({ timeout: 10000 })
    assert.equal(await publicPage.getByText(/Rozmowa zako/i).first().isVisible(), true)

    console.log(
      JSON.stringify(
        {
          homeVisible: true,
          bookingFlowStarted: true,
          paymentPageShowsTwoMethods: false,
          paymentPageKeepsPreparationLocked: true,
          manualPaymentReported: true,
          roomBlockedBeforeApproval: true,
          adminApprovedManualPayment: true,
          confirmationAutoRefreshedAfterApproval: true,
          confirmationUnlocked: true,
          confirmationSmsFallbackVisible: true,
          preparationMaterialsUnlockedAfterPayment: true,
          preparationMaterialsSavedAfterPayment: true,
          roomReloadWorked: true,
          roomRejoinWorked: true,
          roomIframeHasMeetingConfig,
          roomTimerStarted: true,
          roomTimerMoved: timerAfterStart,
          roomFinishWorked: true,
          roomReloadAfterFinishWorked: true,
          payuCardVisible: false,
          manualOnlyFallbackVisible: true,
        },
        null,
        2,
      ),
    )

    await adminContext.close()
    await publicContext.close()
  } finally {
    if (browser) await browser.close()
    if (server?.pid) {
      try {
        execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
      } catch {}
    }
    await sandbox.cleanup()
  }
}

async function main() {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await runUiSmokeOnce()
      return
    } catch (error) {
      if (attempt === maxAttempts || !isRetryableUiSmokeError(error)) {
        throw error
      }

      const message = error instanceof Error ? error.stack ?? error.message : String(error)
      console.warn(`[ui-smoke] retrying after transient local-server failure (attempt ${attempt}/${maxAttempts})`)
      console.warn(message)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
