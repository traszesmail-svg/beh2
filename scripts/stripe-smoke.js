const { createClient } = require('@supabase/supabase-js')
const { loadEnvConfig } = require('@next/env')
const Stripe = require('stripe')

loadEnvConfig(process.cwd())

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const ADMIN_ACCESS_SECRET = process.env.ADMIN_ACCESS_SECRET || null

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
  throw new Error('Missing Supabase or Stripe runtime config for stripe smoke test.')
}

function createAdminAuthHeader() {
  if (!ADMIN_ACCESS_SECRET) {
    return null
  }

  return `Basic ${Buffer.from(`admin:${ADMIN_ACCESS_SECRET}`).toString('base64')}`
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
})

function uniqueStamp() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function uniqueEmail(tag) {
  return `codex+${tag}-${uniqueStamp()}@example.com`
}

async function fetchBooking(bookingId) {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', bookingId).single()
  if (error) {
    throw error
  }

  return data
}

async function fetchSlot(slotId) {
  const { data, error } = await supabase.from('availability').select('*').eq('id', slotId).single()
  if (error) {
    throw error
  }

  return data
}

async function fetchSlotMaybe(slotId) {
  const { data, error } = await supabase.from('availability').select('*').eq('id', slotId).maybeSingle()
  if (error) {
    throw error
  }

  return data
}

async function fetchLatestPaidBooking() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    throw error
  }

  return data
}

async function waitForCheckoutSessionId(bookingId, timeoutMs = 15000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    const booking = await fetchBooking(bookingId)
    if (booking.checkout_session_id) {
      return booking.checkout_session_id
    }

    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  throw new Error(`Checkout session was not attached to booking ${bookingId}.`)
}

async function fetchStripeCheckoutAmountMinor(bookingId) {
  const checkoutSessionId = await waitForCheckoutSessionId(bookingId)
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)
  return {
    checkoutSessionId,
    amountTotal: session.amount_total,
    currency: session.currency,
  }
}

async function cancelPendingBooking(bookingId) {
  const booking = await fetchBooking(bookingId)
  if (booking.payment_status === 'paid') {
    return
  }

  const now = new Date().toISOString()
  const bookingUpdate = await supabase
    .from('bookings')
    .update({
      booking_status: 'cancelled',
      payment_status: 'failed',
      cancelled_at: now,
      updated_at: now,
    })
    .eq('id', bookingId)

  if (bookingUpdate.error) {
    throw bookingUpdate.error
  }

  const slotUpdate = await supabase
    .from('availability')
    .update({
      is_booked: false,
      locked_by_booking_id: null,
      locked_until: null,
      updated_at: now,
    })
    .eq('id', booking.slot_id)

  if (slotUpdate.error) {
    throw slotUpdate.error
  }
}

async function chooseFirstSlot(page, problemSlug) {
  await page.goto(`${APP_URL}/problem`, { waitUntil: 'domcontentloaded' })
  await page.locator('.topic-card').first().click()
  await page.waitForURL(new RegExp(`/slot\\?problem=${problemSlug}`))

  const slotLinks = await page.locator('a.slot-link').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('href')).filter(Boolean),
  )

  for (const href of slotLinks) {
    const candidateUrl = new URL(href, APP_URL)
    const candidateId = candidateUrl.searchParams.get('slotId')

    if (!candidateId) {
      continue
    }

    const slot = await fetchSlot(candidateId)
    if (!slot.is_booked && !slot.locked_by_booking_id) {
      await page.goto(candidateUrl.toString(), { waitUntil: 'domcontentloaded' })
      await page.waitForURL(/\/form\?problem=.*slotId=.*/)
      return { slotId: candidateId }
    }
  }

  throw new Error('Unable to detect slotId from slot link.')
}

async function createBookingViaApi(problemType, slotId, ownerName, email) {
  const response = await fetch(`${APP_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerName,
      problemType,
      animalType: 'Pies',
      petAge: '2 lata',
      durationNotes: 'Od 2 tygodni',
      description: 'Pies szczeka po wyjsciu opiekuna i ma trudnosc z wyciszeniem po powrocie do domu.',
      phone: '500600700',
      email,
      slotId,
    }),
  })
  const payload = await response.json()

  if (!response.ok || !payload.bookingId) {
    throw new Error(payload.error ?? 'Booking API did not return bookingId.')
  }

  return payload.bookingId
}

async function createAvailabilityViaApi(slotId, bookingDate, bookingTime) {
  const adminAuthHeader = createAdminAuthHeader()
  const headers = {
    'Content-Type': 'application/json',
  }

  if (adminAuthHeader) {
    headers.Authorization = adminAuthHeader
  }

  const response = await fetch(`${APP_URL}/api/availability`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      bookingDate,
      bookingTime,
    }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `Availability POST failed for ${slotId} with HTTP ${response.status}.`)
  }
}

async function chooseAdminAvailabilitySlot() {
  const bookingDate = '2026-05-05'
  const candidateTimes = ['19:20', '19:40', '20:00', '20:20', '20:40']

  for (const bookingTime of candidateTimes) {
    const slotId = `${bookingDate}-${bookingTime}`
    const existing = await fetchSlotMaybe(slotId)

    if (!existing) {
      return {
        slotId,
        bookingDate,
        bookingTime,
      }
    }
  }

  throw new Error('No free admin smoke slot candidate was available.')
}

async function waitForStripeCheckout(page) {
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 45000 })
}

async function fillStripeAndPay(page) {
  const cardRadio = page.getByRole('radio', { name: /Karta/i })
  const cardLabel = page.getByText(/^Karta$/)

  if (await cardLabel.count()) {
    await cardLabel.click({ force: true })
    await page.waitForTimeout(1200)
  }

  if (await cardRadio.count()) {
    await cardRadio.check({ force: true })
    await page.waitForTimeout(1500)
  } else {
    const paymentMethodRadio = page.locator('input[type="radio"][name="payment-method-accordion-item-title"]').nth(1)
    if (await paymentMethodRadio.count()) {
      await paymentMethodRadio.check({ force: true })
      await page.waitForTimeout(1500)
    }
  }

  const inlineCardNumber = page.locator('input[name="cardNumber"]')
  if (await inlineCardNumber.count()) {
    await inlineCardNumber.fill('4242424242424242')
    await page.locator('input[name="cardExpiry"]').fill('1234')
    await page.locator('input[name="cardCvc"]').fill('123')
  } else {
    const frameHandles = await page.locator('iframe').elementHandles()
    let cardFrame = null

    for (const handle of frameHandles) {
      const frame = await handle.contentFrame()
      if (!frame) {
        continue
      }

      if (await frame.locator('input[name="cardnumber"]').count()) {
        cardFrame = frame
        break
      }
    }

    if (!cardFrame) {
      const bodyText = await page.locator('body').innerText()
      const iframeTitles = await page.locator('iframe').evaluateAll((nodes) =>
        nodes.map((node) => ({
          title: node.getAttribute('title'),
          name: node.getAttribute('name'),
          src: node.getAttribute('src'),
        })),
      )
      const inputs = await page.locator('input').evaluateAll((nodes) =>
        nodes.map((node) => ({
          name: node.getAttribute('name'),
          placeholder: node.getAttribute('placeholder'),
          type: node.getAttribute('type'),
        })),
      )
      throw new Error(`Stripe card fields not found. body=${JSON.stringify(bodyText)} iframes=${JSON.stringify(iframeTitles)} inputs=${JSON.stringify(inputs)}`)
    }

    await cardFrame.locator('input[name="cardnumber"]').fill('4242424242424242')
    await cardFrame.locator('input[name="exp-date"]').fill('1234')
    await cardFrame.locator('input[name="cvc"]').fill('123')
  }

  if (await page.locator('input[name="billingName"]').count()) {
    await page.locator('input[name="billingName"]').fill('Anna Testowa')
  }

  await page.getByTestId('hosted-payment-submit-button').click()
}

async function run() {
  const { chromium } = require('playwright-core')
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  })

  const desktop = await browser.newContext({
    locale: 'pl-PL',
    viewport: { width: 1440, height: 1200 },
    httpCredentials: ADMIN_ACCESS_SECRET
      ? {
          username: 'admin',
          password: ADMIN_ACCESS_SECRET,
        }
      : undefined,
  })

  const mobile = await browser.newContext({
    locale: 'pl-PL',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    httpCredentials: ADMIN_ACCESS_SECRET
      ? {
          username: 'admin',
          password: ADMIN_ACCESS_SECRET,
        }
      : undefined,
  })

  const result = {
    successFlow: {},
    cancelFlow: {},
    admin: {},
    callRoom: {},
    mobile: {},
  }

  try {
    const successPage = await desktop.newPage()
    await successPage.goto(APP_URL, { waitUntil: 'domcontentloaded' })
    result.successFlow.homeLoaded = await successPage.getByRole('heading', { name: /Szybka pomoc behawioralna/i }).isVisible()
    await successPage.locator('a[href="/problem"].button-primary').first().click()
    await successPage.waitForURL(/\/problem/)
    await successPage.locator('.topic-card').first().click()

    const successEmail = uniqueEmail('success')
    const successOwner = `Anna Smoke ${uniqueStamp()}`
    const { slotId: successSlotId } = await chooseFirstSlot(successPage, 'szczeniak')
    result.successFlow.formLoaded = await successPage.getByRole('heading', { name: /Formularz konsultacji glosowej/i }).isVisible()
    const successBookingId = await createBookingViaApi('szczeniak', successSlotId, successOwner, successEmail)
    await successPage.goto(`${APP_URL}/payment?bookingId=${successBookingId}`, { waitUntil: 'domcontentloaded' })
    let paidBookingIdForUi = successBookingId
    let paidSlotIdForUi = successSlotId
    result.successFlow.bookingId = successBookingId
    result.successFlow.slotId = successSlotId
    result.successFlow.paymentPageLoaded = await successPage.getByRole('heading', { name: /Za chwile przejdziesz do bezpiecznej platnosci/i }).isVisible()

    await successPage.getByRole('button', { name: /Przejdz do bezpiecznej platnosci/i }).click()
    await waitForStripeCheckout(successPage)
    result.successFlow.checkoutStarted = /checkout\.stripe\.com/.test(successPage.url())
    result.successFlow.stripeSession = await fetchStripeCheckoutAmountMinor(successBookingId)

    try {
      await fillStripeAndPay(successPage)
      await successPage.waitForURL(/\/confirmation\?bookingId=.*session_id=.*/, { timeout: 90000 })
      result.successFlow.confirmationLoaded = await successPage.getByRole('heading', { name: /Masz potwierdzona rozmowe glosowa/i }).isVisible()
    } catch (error) {
      result.successFlow.paymentCompletionBlocked = error instanceof Error ? error.message : 'Stripe checkout UI blocked automation.'
      await cancelPendingBooking(successBookingId)
      const fallbackBooking = await fetchLatestPaidBooking()
      paidBookingIdForUi = fallbackBooking.id
      paidSlotIdForUi = fallbackBooking.slot_id
      await successPage.goto(`${APP_URL}/confirmation?bookingId=${paidBookingIdForUi}`, { waitUntil: 'domcontentloaded' })
      result.successFlow.confirmationLoaded = await successPage.getByRole('heading', { name: /Masz potwierdzona rozmowe glosowa/i }).isVisible()
      result.successFlow.fallbackPaidBookingId = paidBookingIdForUi
    }

    const paidBooking = await fetchBooking(paidBookingIdForUi)
    const paidSlot = await fetchSlot(paidSlotIdForUi)
    result.successFlow.finalState = {
      bookingStatus: paidBooking.booking_status,
      paymentStatus: paidBooking.payment_status,
      amount: paidBooking.amount,
      meetingUrlPresent: Boolean(paidBooking.meeting_url),
      slotBooked: paidSlot.is_booked,
      slotLockedBy: paidSlot.locked_by_booking_id === paidBookingIdForUi ? 'same-booking' : paidSlot.locked_by_booking_id,
    }

    await successPage.goto(`${APP_URL}/call/${paidBookingIdForUi}`, { waitUntil: 'domcontentloaded' })
    result.callRoom.pageLoaded = await successPage.getByRole('heading', { name: /Panel rozmowy glosowej/i }).isVisible()
    result.callRoom.timerButtonVisible = await successPage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()

    await successPage.goto(`${APP_URL}/slot?problem=szczeniak`, { waitUntil: 'domcontentloaded' })
    result.successFlow.bookedSlotHidden = (await successPage.locator(`a[href*="slotId=${paidSlotIdForUi}"]`).count()) === 0

    const cancelPage = await desktop.newPage()
    await cancelPage.goto(`${APP_URL}/problem`, { waitUntil: 'domcontentloaded' })
    await cancelPage.locator('.topic-card').first().click()
    const cancelEmail = uniqueEmail('cancel')
    const { slotId: cancelSlotId } = await chooseFirstSlot(cancelPage, 'szczeniak')
    result.cancelFlow.formLoaded = await cancelPage.getByRole('heading', { name: /Formularz konsultacji glosowej/i }).isVisible()
    const cancelBookingId = await createBookingViaApi('szczeniak', cancelSlotId, `Anna Cancel ${uniqueStamp()}`, cancelEmail)
    await cancelPage.goto(`${APP_URL}/payment?bookingId=${cancelBookingId}`, { waitUntil: 'domcontentloaded' })
    result.cancelFlow.bookingId = cancelBookingId
    result.cancelFlow.slotId = cancelSlotId

    await cancelPage.getByRole('button', { name: /Przejdz do bezpiecznej platnosci/i }).click()
    await waitForStripeCheckout(cancelPage)
    result.cancelFlow.checkoutStarted = /checkout\.stripe\.com/.test(cancelPage.url())
    result.cancelFlow.stripeSession = await fetchStripeCheckoutAmountMinor(cancelBookingId)

    await cancelPage.goto(`${APP_URL}/payment?bookingId=${cancelBookingId}&cancelled=1`, { waitUntil: 'domcontentloaded' })
    await cancelPage.waitForURL(new RegExp(`/payment\\?bookingId=${cancelBookingId}&cancelled=1`))
    result.cancelFlow.cancelMessageVisible = await cancelPage.getByText(/Platnosc nie zostala zakonczona/i).isVisible()

    const failedBooking = await fetchBooking(cancelBookingId)
    const failedSlot = await fetchSlot(cancelSlotId)
    result.cancelFlow.finalState = {
      bookingStatus: failedBooking.booking_status,
      paymentStatus: failedBooking.payment_status,
      slotBooked: failedSlot.is_booked,
      slotLockedBy: failedSlot.locked_by_booking_id,
    }

    await cancelPage.goto(`${APP_URL}/slot?problem=szczeniak`, { waitUntil: 'domcontentloaded' })
    result.cancelFlow.slotVisibleAgain = (await cancelPage.locator(`a[href*="slotId=${cancelSlotId}"]`).count()) > 0

    try {
      const adminPage = await desktop.newPage()
      await adminPage.goto(`${APP_URL}/admin`, { waitUntil: 'domcontentloaded' })
      result.admin.pageLoaded = await adminPage.getByRole('heading', { name: /Rezerwacje, platnosci i terminy/i }).isVisible()
      result.admin.paymentStatusVisible = await adminPage.getByText(/Status platnosci:/).first().isVisible()
      result.admin.bookingStatusVisible = await adminPage.getByText(/Status rezerwacji:/).first().isVisible()

      const adminSlot = await chooseAdminAvailabilitySlot()
      const adminSlotId = adminSlot.slotId

      try {
        await adminPage.evaluate(
          ([dateValue, timeValue]) => {
            const dateInput = document.querySelector('input[type="date"]')
            const timeInput = document.querySelector('input[type="time"]')
            if (!(dateInput instanceof HTMLInputElement) || !(timeInput instanceof HTMLInputElement)) {
              throw new Error('Admin inputs not found.')
            }

            const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
            descriptor.set.call(dateInput, dateValue)
            descriptor.set.call(timeInput, timeValue)
            dateInput.dispatchEvent(new Event('input', { bubbles: true }))
            dateInput.dispatchEvent(new Event('change', { bubbles: true }))
            timeInput.dispatchEvent(new Event('input', { bubbles: true }))
            timeInput.dispatchEvent(new Event('change', { bubbles: true }))
          },
          [adminSlot.bookingDate, adminSlot.bookingTime],
        )
        await adminPage.getByRole('button', { name: /Dodaj termin/i }).click()
        await adminPage.waitForLoadState('networkidle')
        result.admin.slotAddedVia = 'ui'
      } catch (error) {
        await createAvailabilityViaApi(adminSlotId, adminSlot.bookingDate, adminSlot.bookingTime)
        result.admin.slotAddedVia = `api-fallback:${error instanceof Error ? error.message : 'unknown'}`
      }

      result.admin.slotAdded = Boolean(await fetchSlotMaybe(adminSlotId))

      if (result.admin.slotAdded) {
        const adminAuthHeader = createAdminAuthHeader()
        const deleteHeaders = adminAuthHeader
          ? {
              Authorization: adminAuthHeader,
            }
          : undefined
        const deleteResponse = await fetch(`${APP_URL}/api/availability/${adminSlotId}`, { method: 'DELETE', headers: deleteHeaders })
        result.admin.slotRemoved = deleteResponse.ok && !(await fetchSlotMaybe(adminSlotId))
      } else {
        result.admin.slotRemoved = false
      }

      result.admin.markDoneVisible = (await adminPage.getByRole('button', { name: /Oznacz jako zakonczona/i }).count()) > 0
      if (result.admin.markDoneVisible) {
        await adminPage.getByRole('button', { name: /Oznacz jako zakonczona/i }).first().click()
        await adminPage.waitForLoadState('networkidle')
        result.admin.markDoneWorked = await adminPage.getByText(/Zakonczona/).first().isVisible()
      }
    } catch (error) {
      result.admin.error = error instanceof Error ? error.message : 'Admin smoke failed.'
    }

    const mobilePage = await mobile.newPage()
    await mobilePage.goto(APP_URL, { waitUntil: 'domcontentloaded' })
    result.mobile.homeCtaVisible = await mobilePage.locator('a[href="/problem"].button-primary').first().isVisible()
    await mobilePage.locator('a[href="/problem"].button-primary').first().click()
    await mobilePage.waitForURL(/\/problem/)
    result.mobile.problemCardsVisible = await mobilePage.locator('.topic-card').first().isVisible()
    await mobilePage.locator('.topic-card').first().click()
    await mobilePage.waitForURL(/\/slot\?problem=szczeniak/)
    result.mobile.slotVisible = await mobilePage.locator('.slot-link').first().isVisible()
    await mobilePage.goto(`${APP_URL}/payment?bookingId=${paidBookingIdForUi}`, { waitUntil: 'domcontentloaded' })
    result.mobile.paymentCtaVisible = await mobilePage.getByRole('link', { name: /Zobacz potwierdzenie/i }).isVisible()
    await mobilePage.goto(`${APP_URL}/confirmation?bookingId=${paidBookingIdForUi}`, { waitUntil: 'domcontentloaded' })
    result.mobile.confirmationCtaVisible = await mobilePage.getByRole('heading', { name: /Masz potwierdzona rozmowe glosowa/i }).isVisible()
    await mobilePage.goto(`${APP_URL}/call/${paidBookingIdForUi}`, { waitUntil: 'domcontentloaded' })
    result.mobile.callTimerVisible = await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()

    console.log(JSON.stringify(result, null, 2))
  } finally {
    await desktop.close()
    await mobile.close()
    await browser.close()
  }
}

run().catch((error) => {
  console.error(JSON.stringify({ error: error.message, stack: error.stack }, null, 2))
  process.exit(1)
})
