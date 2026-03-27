import assert from 'node:assert/strict'
import { access, cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { execFileSync, spawn } from 'node:child_process'
import { loadEnvConfig } from '@next/env'
import { chromium } from 'playwright-core'
import { problemOptions } from '../lib/data'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const backupDir = path.join(rootDir, '.tmp-slot-form-matrix-backup')
const port = 3410 + Math.floor(Math.random() * 200)
const appUrl = `http://localhost:${port}`

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

  throw new Error('Nie znaleziono lokalnej przegladarki Chromium (Chrome lub Edge) do slot-form-matrix.')
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'auto'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.RESEND_API_KEY = ''
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_BANK_ACCOUNT = '11112222333344445555666677'
  process.env.MANUAL_PAYMENT_ACCOUNT_NAME = 'Krzysztof Regulski'
  process.env.SMS_PROVIDER = 'disabled'

  const localStore = await import('../lib/server/local-store')

  await backupData()

  let server: ReturnType<typeof spawn> | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData()

    const seededSlots = await Promise.all(
      [120, 140].map(async (offsetMinutes) => {
        const slot = getWarsawSlotInMinutes(offsetMinutes)
        return localStore.createAvailabilitySlot(slot.date, slot.time)
      }),
    )

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'start', '--', '--port', String(port)], {
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

    const context = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1100 },
    })

    const results: Array<{
      topic: string
      label: string
      slots: Array<{
        slotId: string
        slotLabel: string
        url: string
      }>
    }> = []

    for (const topic of problemOptions) {
      const page = await context.newPage()
      const capturedConsole: string[] = []
      const capturedPageErrors: string[] = []

      page.on('console', (message) => {
        const text = message.text()

        if (/Cache miss/i.test(text) || /Failed to fetch RSC payload/i.test(text)) {
          capturedConsole.push(`${message.type()}: ${text}`)
        }
      })

      page.on('pageerror', (error) => {
        capturedPageErrors.push(error.message)
      })

      await page.goto(`${appUrl}/slot?problem=${encodeURIComponent(topic.id)}`, { waitUntil: 'domcontentloaded' })
      await page.locator('a.slot-link').first().waitFor()

      const slotResults: Array<{ slotId: string; slotLabel: string; url: string }> = []

      for (const slot of seededSlots) {
        const slotHref = `/form?problem=${encodeURIComponent(topic.id)}&slotId=${encodeURIComponent(slot.id)}`
        const slotLink = page.locator(`a[href="${slotHref}"]`)

        await slotLink.waitFor()
        await slotLink.click()
        await page.waitForURL(new RegExp(`/form\\?problem=${topic.id}&slotId=`), { timeout: 10000 })
        await page.locator('form').waitFor({ timeout: 10000 })
        await page.locator('form input[placeholder="np. Anna"]').waitFor({ timeout: 10000 })
        await page.locator('form button[type="submit"]').waitFor({ timeout: 10000 })

        assert.equal(capturedConsole.length, 0, `Unexpected slot->form console errors for ${topic.id}: ${capturedConsole.join(' | ')}`)
        assert.equal(capturedPageErrors.length, 0, `Unexpected slot->form page errors for ${topic.id}: ${capturedPageErrors.join(' | ')}`)

        slotResults.push({
          slotId: slot.id,
          slotLabel: slot.bookingTime,
          url: page.url(),
        })

        await page.goto(`${appUrl}/slot?problem=${encodeURIComponent(topic.id)}`, { waitUntil: 'domcontentloaded' })
        await page.locator('a.slot-link').first().waitFor()
      }

      results.push({
        topic: topic.id,
        label: topic.title,
        slots: slotResults,
      })

      await page.close()
    }

    console.log(
      JSON.stringify(
        {
          appUrl,
          topicCount: results.length,
          topics: results,
        },
        null,
        2,
      ),
    )

    await context.close()
  } finally {
    if (browser) {
      await browser.close()
    }

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
