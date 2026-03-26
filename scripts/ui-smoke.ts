import assert from 'node:assert/strict'
import { cp, mkdir, rm } from 'fs/promises'
import path from 'path'
import { execFileSync, spawn } from 'child_process'
import { loadEnvConfig } from '@next/env'
import { chromium } from 'playwright-core'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const backupDir = path.join(rootDir, '.tmp-ui-data-backup')
const port = 3210 + Math.floor(Math.random() * 200)
const appUrl = `http://127.0.0.1:${port}`
const adminSecret = 'codex-admin-secret'

async function backupData() {
  await rm(backupDir, { recursive: true, force: true })
  try {
    await cp(dataDir, backupDir, { recursive: true, force: true })
  } catch {}
}

async function restoreData() {
  await rm(dataDir, { recursive: true, force: true })
  try {
    await mkdir(rootDir, { recursive: true })
    await cp(backupDir, dataDir, { recursive: true, force: true })
  } catch {}
  await rm(backupDir, { recursive: true, force: true })
}

async function cleanLocalData() {
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

async function main() {
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

  const localStore = await import('../lib/server/local-store')

  await backupData()

  let server: ReturnType<typeof spawn> | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData()
    const availability = await localStore.listAvailability()
    const [slot] = availability.flatMap((group) => group.slots)
    assert.ok(slot, 'Expected at least one free slot for UI smoke test.')

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'start', '--', '--port', String(port)], {
      cwd: rootDir,
      env: process.env,
      stdio: 'ignore',
      windowsHide: true,
    })

    await waitForServer()

    browser = await chromium.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
    await publicPage.locator('main').getByRole('heading', { level: 1, name: /Regulski\s+\|\s+Terapia behawioralna/i }).waitFor()

    await publicPage.goto(`${appUrl}/book`, { waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('heading', { name: /Wybierz temat szybkiej konsultacji 15 min/i }).waitFor()

    await publicPage.goto(`${appUrl}/slot?problem=szczeniak`, { waitUntil: 'domcontentloaded' })
    await publicPage.getByRole('heading', { name: /Wybierz termin szybkiej konsultacji: Szczeniak i młody pies/i }).waitFor()

    await publicPage.goto(
      `${appUrl}/form?problem=szczeniak&slotId=${encodeURIComponent(slot.id)}`,
      { waitUntil: 'domcontentloaded' },
    )
    await publicPage.getByRole('heading', { name: /Formularz konsultacji głosowej/i }).waitFor()

    await publicPage.getByPlaceholder('np. Anna').fill('UI Smoke')
    await publicPage.getByPlaceholder('np. 8 miesięcy lub 4 lata').fill('2 lata')
    await publicPage.getByPlaceholder('np. od 3 tygodni').fill('Od dwóch tygodni')
    await publicPage
      .getByPlaceholder('Napisz, co się dzieje, kiedy problem występuje i co jest dla Ciebie najtrudniejsze.')
      .fill('Pies pobudza się przy wychodzeniu opiekuna i długo nie potrafi się wyciszyć po powrocie do domu.')
    await publicPage.getByPlaceholder('np. 500 000 000').fill('500700800')
    await publicPage.getByPlaceholder('np. klient@email.pl').fill('ui-smoke@example.com')
    await publicPage.getByRole('button', { name: /Zablokuj termin i przejdź do płatności/i }).click()
    await publicPage.waitForURL(/\/payment\?bookingId=/, { timeout: 10000 })

    const paymentUrl = new URL(publicPage.url())
    const bookingId = paymentUrl.searchParams.get('bookingId')
    const accessToken = paymentUrl.searchParams.get('access')

    assert.ok(bookingId, 'Expected bookingId in payment URL.')
    assert.ok(accessToken, 'Expected access token in payment URL.')

    await publicPage.getByRole('heading', { name: /Wybierz sposób płatności za szybki pierwszy krok/i }).waitFor()
    assert.equal(await publicPage.getByText(/BLIK na telefon \/ przelew/i).isVisible(), true)
    assert.equal(await publicPage.getByText(/Zapłać online PayU/i).isVisible(), true)
    assert.equal(await publicPage.getByText(/1111 2222 3333 4444 5555 6666 77/i).isVisible(), true)
    assert.equal(await publicPage.getByText(/500 600 700/i).isVisible(), true)

    await publicPage.getByRole('button', { name: /Zapłaciłem, czekam na potwierdzenie/i }).click()
    await publicPage.waitForURL(/\/confirmation\?bookingId=.*manual=reported/, { timeout: 10000 })
    await publicPage.getByRole('heading', { name: /Wpłata czeka na ręczne sprawdzenie/i }).waitFor()

    await publicPage.goto(`${appUrl}/call/${bookingId}?access=${encodeURIComponent(accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    assert.equal(
      await publicPage.getByText(/Dostęp do pokoju rozmowy odblokowuje się dopiero po statusie paid/i).isVisible(),
      true,
    )

    const adminPage = await adminContext.newPage()
    await adminPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    await adminPage.getByRole('heading', { name: /Rezerwacje, płatności i terminy/i }).waitFor()
    await adminPage.getByText(/Ręczne płatności do weryfikacji/i).waitFor()
    await adminPage.getByRole('button', { name: /Potwierdź płatność/i }).first().click()
    await adminPage.getByRole('button', { name: /Oznacz jako zakończoną/i }).first().waitFor({ timeout: 10000 })

    await publicPage.goto(
      `${appUrl}/confirmation?bookingId=${bookingId}&access=${encodeURIComponent(accessToken)}`,
      { waitUntil: 'domcontentloaded' },
    )
    await publicPage.getByRole('heading', { name: /Masz potwierdzoną rozmowę głosową/i }).waitFor()
    assert.equal(
      await publicPage
        .getByText(/Platnosc potwierdzona\. Potwierdzenie rezerwacji jest zapisane\./i)
        .isVisible(),
      true,
    )
    assert.equal((await publicPage.getByRole('button', { name: /Anuluj zakup w 1 minutę/i }).count()) === 0, true)

    await publicPage.getByRole('link', { name: /Dołącz do rozmowy audio/i }).click()
    await publicPage.waitForURL(new RegExp(`/call/${bookingId}`), { timeout: 10000 })
    await publicPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10000 })

    const paymentRoomIframeSrc = await publicPage.locator('iframe[title="Panel rozmowy głosowej"]').getAttribute('src')
    const roomIframeHasMeetingConfig =
      Boolean(paymentRoomIframeSrc?.includes('config.startAudioOnly=true')) &&
      Boolean(paymentRoomIframeSrc?.includes('config.startWithVideoMuted=true'))

    assert.equal(roomIframeHasMeetingConfig, true)

    console.log(
      JSON.stringify(
        {
          homeVisible: true,
          bookingFlowStarted: true,
          paymentPageShowsTwoMethods: true,
          manualPaymentReported: true,
          roomBlockedBeforeApproval: true,
          adminApprovedManualPayment: true,
          confirmationUnlocked: true,
          confirmationSmsFallbackVisible: true,
          roomIframeHasMeetingConfig,
          payuCardVisible: true,
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
    await restoreData()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
