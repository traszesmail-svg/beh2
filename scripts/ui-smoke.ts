import assert from 'node:assert/strict'
import { cp, mkdir, rm } from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'
import { loadEnvConfig } from '@next/env'
import { chromium } from 'playwright-core'
import { BUILD_MARKER_KEY } from '../lib/build-marker'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const backupDir = path.join(rootDir, '.tmp-ui-data-backup')
const appUrl = 'http://127.0.0.1:3210'
const adminSecret = 'codex-admin-secret'

function bookingPayload(slotId: string, index: number) {
  return {
    ownerName: `UI Smoke ${index}`,
    problemType: 'szczeniak' as const,
    animalType: 'Pies' as const,
    petAge: '3 lata',
    durationNotes: 'Od kilku tygodni',
    description: 'Pies reaguje szczekaniem na wyjscie opiekuna i trudno mu sie pozniej uspokoic po powrocie do domu.',
    phone: `50070080${index}`,
    email: `ui-smoke-${index}@example.com`,
    slotId,
  }
}

async function backupData() {
  await rm(backupDir, { recursive: true, force: true })
  await cp(dataDir, backupDir, { recursive: true, force: true })
}

async function restoreData() {
  await rm(dataDir, { recursive: true, force: true })
  await mkdir(rootDir, { recursive: true })
  await cp(backupDir, dataDir, { recursive: true, force: true })
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
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(appUrl, { cache: 'no-store' })
      if (response.ok) {
        return
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('Local server did not become ready in time.')
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'mock'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.ADMIN_ACCESS_SECRET = adminSecret

  const localStore = await import('../lib/server/local-store')

  await backupData()

  let server: ReturnType<typeof spawn> | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData()
    const availability = await localStore.listAvailability()
    const freeSlots = availability.flatMap((group) => group.slots)
    assert.ok(freeSlots.length >= 2, 'Expected at least two free slots for UI smoke test.')

    const bookingOne = await localStore.createPendingBooking(bookingPayload(freeSlots[0].id, 1))

    server = spawn(process.execPath, [path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '--port', '3210'], {
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

    const desktop = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1200 },
      httpCredentials: {
        username: 'admin',
        password: adminSecret,
      },
    })

    const mobile = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 390, height: 844 },
      isMobile: true,
      httpCredentials: {
        username: 'admin',
        password: adminSecret,
      },
    })

    const mobilePage = await mobile.newPage()
    await mobilePage.goto(appUrl, { waitUntil: 'domcontentloaded' })
    const homeCtaVisible = await mobilePage.getByRole('link', { name: /Sprawdz terminy/i }).isVisible()

    await mobilePage.goto(`${appUrl}/payment?bookingId=${bookingOne.booking.id}&access=${encodeURIComponent(bookingOne.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const paymentHeadingVisible = await mobilePage.getByRole('heading', { name: /Za chwile przejdziesz do bezpiecznej platnosci/i }).isVisible()
    const prepHeadingVisible = await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).isVisible()

    await mobilePage.locator('input[type="file"]').setInputFiles({
      name: 'zachowanie.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('behawior15-mp4-smoke'),
    })
    await mobilePage.getByText(/Nagranie zostalo dodane do rezerwacji/i).waitFor({ timeout: 10000 })

    await mobilePage.locator('input[placeholder="https://..."]').fill('https://example.com/material')
    await mobilePage.locator('textarea').fill('Na nagraniu widac szczekanie przy wychodzeniu opiekuna i pobudzenie po jego powrocie.')
    await mobilePage.getByRole('button', { name: /Zapisz materialy do rozmowy/i }).click({ force: true })
    await mobilePage.getByText(/Zapisano materialy do rozmowy/i).waitFor({ timeout: 10000 })

    await mobilePage.getByRole('button', { name: /Oplac konsultacje/i }).click()
    await mobilePage.waitForURL(/\/confirmation\?bookingId=/, { timeout: 15000 })
    const confirmationVisible = await mobilePage.getByRole('heading', { name: /Masz potwierdzona rozmowe glosowa/i }).isVisible()
    const prepCardStillVisible = await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).isVisible()

    await mobilePage.goto(`${appUrl}/call/${bookingOne.booking.id}?access=${encodeURIComponent(bookingOne.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const callTimerVisible = await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()

    const desktopPage = await desktop.newPage()
    await desktopPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    const adminPricingVisible = await desktopPage.getByRole('heading', { name: /Aktywna cena dla nowych rezerwacji/i }).isVisible()
    const adminBuildMarkerVisible = await desktopPage.getByText(new RegExp(BUILD_MARKER_KEY)).isVisible()
    await desktopPage.locator('input[type="number"]').fill('47')
    await desktopPage.getByRole('button', { name: /Zapisz nowa cene/i }).click()
    await desktopPage.getByText(/Zapisano nowa cene konsultacji/i).waitFor({ timeout: 10000 })

    const bookingTwo = await localStore.createPendingBooking(bookingPayload(freeSlots[1].id, 2))
    const bookingOneAmount = bookingOne.booking.amount
    const bookingTwoAmount = bookingTwo.booking.amount

    assert.equal(bookingOneAmount, 39)
    assert.equal(bookingTwoAmount, 47)

    console.log(
      JSON.stringify(
        {
          mobile: {
            homeCtaVisible,
            paymentHeadingVisible,
            prepHeadingVisible,
            confirmationVisible,
            prepCardStillVisible,
            callTimerVisible,
          },
          admin: {
            pricingVisible: adminPricingVisible,
            buildMarkerVisible: adminBuildMarkerVisible,
            bookingOneAmount,
            bookingTwoAmount,
          },
          materials: {
            videoUploaded: true,
            linkSaved: true,
            notesSaved: true,
          },
        },
        null,
        2,
      ),
    )

    await desktop.close()
    await mobile.close()
  } finally {
    if (browser) {
      await browser.close()
    }

    if (server && !server.killed) {
      server.kill()
    }

    await restoreData()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
