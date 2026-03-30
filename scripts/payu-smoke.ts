import { rm } from 'fs/promises'
import path from 'path'
import { execFileSync, spawn } from 'child_process'
import { loadEnvConfig } from '@next/env'
import { createLocalDataSandbox } from './lib/local-data-sandbox'
import { createAvailabilitySlot, getBookingById } from '../lib/server/local-store'

const rootDir = process.cwd()
const trackedFiles = ['availability.json', 'bookings.json', 'users.json', 'pricing-settings.json']
const port = 3230 + Math.floor(Math.random() * 100)
const appUrl = `http://localhost:${port}`

const PUBLIC_PAYU_SANDBOX = {
  environment: 'sandbox',
  posId: '300746',
  clientId: '300746',
  clientSecret: '2ee86a66e5d97e3fadc400c9f19b065d',
  secondKey: 'b6ca15b0d1020e8094d9b5f8d163db54',
} as const

const ALLOWED_PAYU_SANDBOX_HOSTS = new Set(['secure.snd.payu.com', 'merch-prod.snd.payu.com'])

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

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

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetchWithTimeout(appUrl, { cache: 'no-store' }, 5_000)
      if (response.status > 0) {
        return
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error('Local server did not become ready in time.')
}

function appendLog(buffer: string, chunk: Buffer | string) {
  const next = `${buffer}${chunk.toString()}`
  return next.slice(-4000)
}

async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 60_000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

function killProcessTree(server: ReturnType<typeof spawn> | null) {
  if (!server?.pid) {
    return
  }

  try {
    execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    })
  } catch {}
}

async function createBooking(slotId: string) {
  const response = await fetchWithTimeout(`${appUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerName: 'PayU Smoke',
      problemType: 'szczeniak',
      animalType: 'Pies',
      petAge: '3 lata',
      durationNotes: 'Od wczoraj',
      description: 'Test server-side checkoutu PayU sandbox dla predeploy smoke.',
      phone: '500700800',
      email: 'payu-sandbox@example.com',
      slotId,
    }),
  })

  const payload = (await response.json()) as {
    bookingId?: string
    accessToken?: string
    error?: string
  }

  if (!response.ok || !payload.bookingId || !payload.accessToken) {
    throw new Error(payload.error ?? 'Nie udało się utworzyć testowego bookingu PayU.')
  }

  return {
    bookingId: payload.bookingId,
    accessToken: payload.accessToken,
  }
}

async function startPayuCheckout(bookingId: string, accessToken: string) {
  const response = await fetchWithTimeout(`${appUrl}/api/payments/payu/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookingId,
      accessToken,
    }),
  })

  const payload = (await response.json()) as {
    url?: string
    error?: string
  }

  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? 'Nie udało się uruchomić checkoutu PayU.')
  }

  return {
    url: payload.url,
  }
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'auto'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.RESEND_API_KEY = ''
  process.env.SMS_PROVIDER = 'disabled'
  process.env.BEHAVIOR15_CONTACT_PHONE = '500600700'
  process.env.MANUAL_PAYMENT_BANK_ACCOUNT = '11112222333344445555666677'
  process.env.MANUAL_PAYMENT_ACCOUNT_NAME = 'Krzysztof Regulski'
  process.env.PAYU_ENVIRONMENT = process.env.PAYU_ENVIRONMENT?.trim() || PUBLIC_PAYU_SANDBOX.environment
  process.env.PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID?.trim() || PUBLIC_PAYU_SANDBOX.clientId
  process.env.PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET?.trim() || PUBLIC_PAYU_SANDBOX.clientSecret
  process.env.PAYU_POS_ID = process.env.PAYU_POS_ID?.trim() || PUBLIC_PAYU_SANDBOX.posId
  process.env.PAYU_SECOND_KEY = process.env.PAYU_SECOND_KEY?.trim() || PUBLIC_PAYU_SANDBOX.secondKey

  const sandbox = await createLocalDataSandbox('payu-smoke', rootDir)
  const { dataDir } = sandbox
  let server: ReturnType<typeof spawn> | null = null
  let serverStdout = ''
  let serverStderr = ''

  try {
    await Promise.all(trackedFiles.map((fileName) => rm(path.join(dataDir, fileName), { force: true })))

    const slotTime = getWarsawSlotInMinutes(45)
    const slot = await createAvailabilitySlot(slotTime.date, slotTime.time)
    assert(slot, 'Nie udało się utworzyć slotu do testu PayU.')

    server = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '--', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd: rootDir,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })

    server.stdout?.on('data', (chunk) => {
      serverStdout = appendLog(serverStdout, chunk)
    })
    server.stderr?.on('data', (chunk) => {
      serverStderr = appendLog(serverStderr, chunk)
    })

    try {
      await waitForServer()
    } catch (error) {
      throw new Error(
        [
          error instanceof Error ? error.message : 'Local server did not become ready in time.',
          serverStdout ? `stdout:\n${serverStdout}` : null,
          serverStderr ? `stderr:\n${serverStderr}` : null,
        ]
          .filter(Boolean)
          .join('\n\n'),
      )
    }

    const booking = await createBooking(slot.id)
    const checkout = await startPayuCheckout(booking.bookingId, booking.accessToken)
    const redirectUrl = new URL(checkout.url)
    const storedBooking = await getBookingById(booking.bookingId)

    assert(ALLOWED_PAYU_SANDBOX_HOSTS.has(redirectUrl.hostname), `Nieoczekiwany host PayU redirect: ${redirectUrl.hostname}`)
    assert(storedBooking, 'Nie znaleziono bookingu po uruchomieniu checkoutu PayU.')
    assert(storedBooking.paymentMethod === 'payu', 'Booking nie zapisał paymentMethod=payu.')
    assert(Boolean(storedBooking.payuOrderId), 'Booking nie zapisał payuOrderId.')
    assert(Boolean(storedBooking.payuOrderStatus), 'Booking nie zapisał payuOrderStatus.')
    assert(storedBooking.bookingStatus === 'pending', 'Booking po starcie checkoutu PayU nie powinien zmieniać bookingStatus.')
    assert(storedBooking.paymentStatus === 'unpaid', 'Booking po starcie checkoutu PayU nie powinien mieć statusu paid.')

    console.log(
      JSON.stringify(
        {
          ok: true,
          environment: process.env.PAYU_ENVIRONMENT,
          usedPublicSandboxDefaults:
            process.env.PAYU_CLIENT_ID === PUBLIC_PAYU_SANDBOX.clientId &&
            process.env.PAYU_POS_ID === PUBLIC_PAYU_SANDBOX.posId,
          bookingId: storedBooking.id,
          payuOrderId: storedBooking.payuOrderId,
          payuOrderStatus: storedBooking.payuOrderStatus,
          redirectHost: redirectUrl.hostname,
          redirectPath: redirectUrl.pathname,
        },
        null,
        2,
      ),
    )
  } finally {
    killProcessTree(server)
    server?.stdout?.destroy()
    server?.stderr?.destroy()

    await sandbox.cleanup()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
