import assert from 'node:assert/strict'
import { cp, mkdir, rm } from 'fs/promises'
import path from 'path'
import { execFileSync, spawn } from 'child_process'
import { loadEnvConfig } from '@next/env'
import { chromium } from 'playwright-core'
import { BUILD_MARKER_KEY } from '../lib/build-marker'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const backupDir = path.join(rootDir, '.tmp-ui-data-backup')
const port = 3210 + Math.floor(Math.random() * 200)
const appUrl = `http://127.0.0.1:${port}`
const adminSecret = 'codex-admin-secret'

function bookingPayload(slotId: string, index: number) {
  return {
    ownerName: `UI Smoke ${index}`,
    problemType: 'szczeniak' as const,
    animalType: 'Pies' as const,
    petAge: '3 lata',
    durationNotes: 'Od kilku tygodni',
    description: 'Pies reaguje szczekaniem na wyjście opiekuna i trudno mu się później uspokoić po powrocie do domu.',
    phone: `50070080${index}`,
    email: `ui-smoke-${index}@example.com`,
    slotId,
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

async function fetchPublicPageState(url: string) {
  const response = await fetch(url, { cache: 'no-store' })
  const content = await response.text()

  return {
    ok: response.ok,
    hasInternalError: content.includes('Internal Error'),
    hasLegacyPrice: content.includes('28,99') || content.includes('28.99'),
    hasFormHeading: content.includes('Formularz konsultacji'),
    hasBookingHeaderCta: content.includes('Zarezerwuj konsultację'),
    hasTrustStrip: content.includes('COAPE / CAPBT'),
    hasLegacyHeader: content.includes('Realne sprawy'),
    hasContactEmail: content.includes('coapebehawiorysta@gmail.com'),
  }
}

async function main() {
  loadEnvConfig(rootDir)
  process.env.APP_DATA_MODE = 'local'
  process.env.APP_PAYMENT_MODE = 'mock'
  process.env.NEXT_PUBLIC_APP_URL = appUrl
  process.env.ADMIN_ACCESS_SECRET = adminSecret
  process.env.RESEND_API_KEY = ''
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TESTLOCAL'

  const localStore = await import('../lib/server/local-store')

  await backupData()

  let server: ReturnType<typeof spawn> | null = null
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    await cleanLocalData()
    const availability = await localStore.listAvailability()
    const freeSlots = availability.flatMap((group) => group.slots)
    assert.ok(freeSlots.length >= 3, 'Expected at least three free slots for UI smoke test.')

    const bookingOne = await localStore.createPendingBooking(bookingPayload(freeSlots[0].id, 1))
    const bookingTwo = await localStore.createPendingBooking(bookingPayload(freeSlots[1].id, 2))
    const availabilityAfterBookings = await localStore.listAvailability()
    const nextPublicSlot = availabilityAfterBookings.flatMap((group) => group.slots)[0]
    assert.ok(nextPublicSlot, 'Expected at least one public slot after locking smoke bookings.')

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

    const desktop = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 1440, height: 1200 },
      httpCredentials: { username: 'admin', password: adminSecret },
    })

    const mobile = await browser.newContext({
      locale: 'pl-PL',
      viewport: { width: 390, height: 844 },
      isMobile: true,
      httpCredentials: { username: 'admin', password: adminSecret },
    })

    const mobilePage = await mobile.newPage()
    await mobilePage.goto(appUrl, { waitUntil: 'domcontentloaded' })

    const homepageText = await mobilePage.locator('body').innerText()
    const homeCtaVisible = await mobilePage.getByRole('link', { name: /Zarezerwuj konsultację/i }).first().isVisible()
    const secondaryHeroCtaVisible = (await mobilePage.getByRole('link', { name: /Zobacz, jak wygląda rezerwacja/i }).count()) > 0
    const heroHeadingVisible = await mobilePage
      .getByRole('heading', { name: /Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut/i })
      .isVisible()
    const heroPriceVisible = await mobilePage.locator('.hero-price-badge').getByText(/Oferta i płatność/i).isVisible()
    const trustStripVisible = await mobilePage.locator('.header-trust-strip').getByText(/1 minuta na anulację/i).isVisible()
    const dietitianVisible = await mobilePage.getByText(/Dietetyk/i).first().isVisible()
    const heroPhotoVisible = await mobilePage.locator('.hero-spotlight-image').isVisible()
    const certaintyHeadingVisible = await mobilePage.getByRole('heading', { name: /Ma być prosto, uczciwie i bez niepewności/i }).isVisible()
    const aboutHeadingVisible = await mobilePage.getByRole('heading', { name: /Krótko o tym, jak pracuję/i }).isVisible()
    const faqHeadingVisible = await mobilePage.getByRole('heading', { name: /Pytania przed kliknięciem/i }).isVisible()
    const finalCtaHeadingVisible = await mobilePage
      .getByRole('heading', { name: /Jeśli chcesz to uporządkować, przejdź do rezerwacji/i })
      .isVisible()
    const shareVisible = homepageText.includes('Udostępnij znajomemu')
    const socialSectionVisible = homepageText.includes('Sprawdź profil i podeślij stronę osobie')
    const socialFacebookVisible = (await mobilePage.locator('a[href*="facebook.com"]').count()) > 0
    const footerLinkVisible = await mobilePage.getByRole('link', { name: /Polityka prywatności/i }).isVisible()
    const homeAvailabilityVisible =
      (await mobilePage
        .locator('.hero-spotlight-meta')
        .filter({ hasText: /Wolne terminy|Najbliższe realnie dostępne terminy|Brak wolnych terminów/i })
        .count()) > 0

    const consentDialog = mobilePage.getByRole('dialog')
    let consentVisible = false
    try {
      await consentDialog.waitFor({ state: 'visible', timeout: 5000 })
      consentVisible = true
    } catch {
      consentVisible = false
    }
    const gaScriptBeforeConsent = await mobilePage.locator('script[src*="googletagmanager"]').count()
    if (consentVisible) {
      await mobilePage.getByRole('button', { name: /Odrzuć/i }).click({ force: true })
    }
    const consentDismissed = consentVisible ? await consentDialog.isHidden() : true
    const gaScriptAfterReject = await mobilePage.locator('script[src*="googletagmanager"]').count()
    const title = await mobilePage.title()
    const description = await mobilePage.locator('meta[name="description"]').getAttribute('content')
    const ogTitle = await mobilePage.locator('meta[property="og:title"]').getAttribute('content')
    const twitterCard = await mobilePage.locator('meta[name="twitter:card"]').getAttribute('content')
    const jsonLdContent = await mobilePage.locator('script[type="application/ld+json"]').first().textContent()
    const charsetMetaPresent = (await mobilePage.locator('meta[charset]').count()) > 0
    const primaryBookingHref = await mobilePage.getByRole('link', { name: /Zarezerwuj konsultację/i }).first().getAttribute('href')

    await mobilePage.goto(`${appUrl}/book`, { waitUntil: 'domcontentloaded' })
    const bookingPageText = await mobilePage.locator('body').innerText()
    const bookingHeadingVisible = await mobilePage.getByRole('heading', { name: /Wybierz temat i przejdź do terminu/i }).isVisible()
    const bookingAvailabilityVisible = /Wolne terminy są dostępne i pokażą się od razu po wyborze tematu|Najbliższe realnie dostępne terminy zobaczysz po kliknięciu w wybrany temat|Brak wolnych terminów/i.test(
      bookingPageText,
    )
    const bookingTopicCardsCount = await mobilePage.locator('#tematy .topic-card').count()
    const bookingTitle = await mobilePage.title()

    await mobilePage.goto(`${appUrl}/slot?problem=szczeniak`, { waitUntil: 'domcontentloaded' })
    const slotHeadingVisible = await mobilePage.getByRole('heading', { name: /Wybierz termin rozmowy/i }).isVisible()
    const slotOptionVisible =
      (await mobilePage.locator('.slot-link').count()) > 0 ||
      (await mobilePage.getByRole('link', { name: /Odśwież terminy|Spróbuj ponownie|Wróć do wyboru tematu/i }).count()) > 0

    const currentPublicSlotHrefs = Array.from(
      new Set(
        await mobilePage.locator('.slot-link').evaluateAll((elements) =>
          elements
            .map((element) => element.getAttribute('href'))
            .filter((href): href is string => Boolean(href)),
        ),
      ),
    )

    const currentFormResponses = [] as Array<{
      href: string
      ok: boolean
      hasInternalError: boolean
      hasFormHeading: boolean
      hasLegacyPrice: boolean
      hasBookingHeaderCta: boolean
      hasTrustStrip: boolean
      hasLegacyHeader: boolean
      hasContactEmail: boolean
    }>

    for (const href of currentPublicSlotHrefs) {
      const response = await fetchPublicPageState(`${appUrl}${href}`)
      currentFormResponses.push({
        href,
        ok: response.ok,
        hasInternalError: response.hasInternalError,
        hasFormHeading: response.hasFormHeading,
        hasLegacyPrice: response.hasLegacyPrice,
        hasBookingHeaderCta: response.hasBookingHeaderCta,
        hasTrustStrip: response.hasTrustStrip,
        hasLegacyHeader: response.hasLegacyHeader,
        hasContactEmail: response.hasContactEmail,
      })
    }

    const homepageHasWrongCalendarCopy = homepageText.includes('Aktualną godzinę zobaczysz dopiero w właściwym kalendarzu rezerwacji.')
    const homepageHasMixedBookingCopy = homepageText.includes(
      'Każdy temat prowadzi do tego samego flow rezerwacji, do tej samej ceny dla nowych bookingów i do realnie dostępnych terminów.',
    )

    await mobilePage.goto(`${appUrl}/payment?bookingId=${bookingOne.booking.id}&access=${encodeURIComponent(bookingOne.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const paymentPageText = await mobilePage.locator('body').innerText()
    const paymentHeadingVisible = await mobilePage
      .getByRole('heading', { name: /Możesz przejść dalej bez płatności|Za chwilę przejdziesz do bezpiecznej płatności/i })
      .isVisible()
    const prepHeadingVisible = await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).isVisible()
    const paymentPageHasTestBanner = paymentPageText.includes(
      'To środowisko testowe płatności. Karta nie zostanie realnie obciążona poza testowym scenariuszem.',
    )

    await mobilePage.locator('input[type="file"]').setInputFiles({
      name: 'zachowanie.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('behawior15-mp4-smoke'),
    })
    await mobilePage.getByText(/Nagranie zostało dodane do rezerwacji/i).waitFor({ timeout: 10000 })

    await mobilePage.locator('input[placeholder="https://..."]').fill('https://example.com/material')
    await mobilePage.locator('textarea').fill('Na nagraniu widać szczekanie przy wychodzeniu opiekuna i pobudzenie po jego powrocie.')
    await mobilePage.getByRole('button', { name: /Zapisz materiały do rozmowy/i }).click({ force: true })
    await mobilePage.getByText(/Zapisano materiały do rozmowy/i).waitFor({ timeout: 10000 })

    const payButtonVisible = await mobilePage
      .getByRole('button', { name: /Przejdź dalej bez płatności|Przejdź do bezpiecznej płatności/i })
      .isVisible()
    const paymentResponse = await fetch(`${appUrl}/api/payments/mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: bookingOne.booking.id, accessToken: bookingOne.accessToken, outcome: 'success' }),
    })
    const paymentPayload = (await paymentResponse.json()) as { redirectTo?: string; error?: string }

    assert.equal(paymentResponse.ok, true, paymentPayload.error ?? 'Mock payment route should succeed during UI smoke.')
    assert.equal(Boolean(paymentPayload.redirectTo), true, 'Mock payment route should return redirectTo.')

    await mobilePage.goto(`${appUrl}${paymentPayload.redirectTo}`, { waitUntil: 'domcontentloaded' })
    const confirmationVisible = await mobilePage.getByRole('heading', { name: /Masz potwierdzoną rozmowę głosową/i }).isVisible()
    const prepCardStillVisible = await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).isVisible()
    const selfCancelButtonVisible = await mobilePage.getByRole('button', { name: /Anuluj zakup w 1 minutę/i }).isVisible()
    await mobilePage.getByRole('button', { name: /Anuluj zakup w 1 minutę/i }).click({ force: true })
    await mobilePage.getByRole('heading', { name: /Rezerwacja została anulowana/i }).waitFor({ timeout: 10000 })
    const cancellationVisible = await mobilePage.getByRole('heading', { name: /Rezerwacja została anulowana/i }).isVisible()
    const prepCardHiddenAfterCancel = (await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).count()) === 0

    const secondPaymentResponse = await fetch(`${appUrl}/api/payments/mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: bookingTwo.booking.id, accessToken: bookingTwo.accessToken, outcome: 'success' }),
    })
    const secondPaymentPayload = (await secondPaymentResponse.json()) as { redirectTo?: string; error?: string }

    assert.equal(secondPaymentResponse.ok, true, secondPaymentPayload.error ?? 'Second mock payment should succeed during UI smoke.')
    assert.equal(Boolean(secondPaymentPayload.redirectTo), true, 'Second mock payment should return redirectTo.')

    await mobilePage.goto(`${appUrl}${secondPaymentPayload.redirectTo}`, { waitUntil: 'domcontentloaded' })
    const secondConfirmationVisible = await mobilePage.getByRole('heading', { name: /Masz potwierdzoną rozmowę głosową/i }).isVisible()

    await mobilePage.goto(`${appUrl}/call/${bookingTwo.booking.id}?access=${encodeURIComponent(bookingTwo.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const callTimerVisible = await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()
    const roomIframeSrc = await mobilePage.locator('iframe[title="Panel rozmowy głosowej"]').getAttribute('src')
    const roomIframeHasMeetingConfig =
      Boolean(roomIframeSrc?.includes('config.startAudioOnly=true')) &&
      Boolean(roomIframeSrc?.includes('config.startWithVideoMuted=true')) &&
      Boolean(roomIframeSrc?.includes('config.prejoinPageEnabled=false'))
    const roomOpenLinkHref = await mobilePage.getByRole('link', { name: /Otwórz rozmowę w nowej karcie/i }).getAttribute('href')
    const roomOpenLinkValid = Boolean(roomOpenLinkHref && roomOpenLinkHref.startsWith('https://meet.jit.si/'))

    await mobilePage.goto(`${appUrl}/room/${bookingTwo.booking.id}?access=${encodeURIComponent(bookingTwo.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    await mobilePage.waitForURL(new RegExp(`/call/${bookingTwo.booking.id}`), { timeout: 10000 })
    await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).waitFor({ timeout: 10000 })
    const legacyRoomRedirected = mobilePage.url().includes(`/call/${bookingTwo.booking.id}`)
    const legacyRoomTimerVisible = await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()

    const desktopPage = await desktop.newPage()
    await desktopPage.goto(appUrl, { waitUntil: 'domcontentloaded' })
    const headerLinkTexts = await desktopPage.locator('.header-nav a').allTextContents()
    const headerOfertaVisible = (await desktopPage.locator('.header-links').count()) === 0
    const specialistNameVisible = await desktopPage.locator('#specjalista').getByRole('heading', { name: /Krzysztof Regulski/i }).isVisible()
    const specialistTrustVisible = await desktopPage.getByRole('heading', { name: /Ma być prosto, uczciwie i bez niepewności/i }).isVisible()
    const specialistPhotoVisible = await desktopPage.locator('.hero-spotlight-image').first().isVisible()
    const credentialAltVisible = await desktopPage.locator('img[alt*="CAPBT Polska"]').first().isVisible()
    const proofCardsCount = await desktopPage.locator('#pewnosc-zakupu .trust-card').count()
    const aboutSectionVisible = await desktopPage.getByRole('heading', { name: /Krótko o tym, jak pracuję/i }).isVisible()
    const desktopFaqVisible = await desktopPage.getByRole('heading', { name: /Pytania przed kliknięciem/i }).isVisible()
    const desktopFinalCtaVisible = await desktopPage
      .getByRole('heading', { name: /Jeśli chcesz to uporządkować, przejdź do rezerwacji/i })
      .isVisible()
    const socialProofHeadingVisible = (await desktopPage.getByRole('heading', { name: /Historie opiekunów i efekty konsultacji/i }).count()) > 0
    const socialProofSummaryVisible = (await desktopPage.getByText(/To miejsce zbiera realne opisy efektów pierwszej konsultacji/i).count()) > 0
    const socialProofFormHeadingVisible = (await desktopPage.getByRole('heading', { name: /Dodaj swoją opinię do ręcznej weryfikacji/i }).count()) > 0
    const socialProofSubmitVisible = (await desktopPage.getByRole('button', { name: /Wyślij opinię do weryfikacji/i }).count()) > 0
    const socialProofDisclaimerVisible = (await desktopPage.getByText(/Publikujemy wyłącznie opinie zaakceptowane po weryfikacji/i).count()) > 0
    const socialProofSectionOrder = false
    const testimonialRouteResponse = await fetch(`${appUrl}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'UI Smoke',
        email: 'ui-smoke@example.com',
        issueCategory: 'lek-separacyjny',
        opinion: 'To test kontrolowanego błędu formularza opinii w środowisku smoke.',
        beforeAfter: 'Przed testem sprawdzamy walidację i kontrolowany fallback, po teście nadal nie ma publikacji automatycznej.',
        photoUrl: '',
        consentContact: true,
        consentPublish: true,
        website: '',
      }),
    })
    const testimonialRoutePayload = (await testimonialRouteResponse.json()) as { error?: string }
    const faviconResponse = await fetch(`${appUrl}/favicon.ico`)
    const robotsResponse = await fetch(`${appUrl}/robots.txt`)
    const robotsText = await robotsResponse.text()
    const sitemapResponse = await fetch(`${appUrl}/sitemap.xml`)
    const sitemapText = await sitemapResponse.text()
    const publicationsHeadingVisible = (await desktopPage.getByRole('heading', { name: /Zweryfikowane materiały, które wzmacniają trust bez nadęcia/i }).count()) > 0
    const publicationLinkVisible = (await desktopPage.getByRole('link', { name: /Otwórz artykuł/i }).count()) > 0
    const noBrokenMailto = (await desktopPage.locator('a[href^="mailto:"]').count()) <= 1
    const faqButton = desktopPage.getByRole('button', { name: /Czy 15 minut wystarczy/i })
    const faqInitiallyExpanded = await faqButton.getAttribute('aria-expanded')
    const faqAnswerInitiallyVisible = await desktopPage.getByText(/To szybka konsultacja/i).isVisible()
    await faqButton.click()
    const faqExpanded = await faqButton.getAttribute('aria-expanded')
    const faqAnswerVisibleAfterToggle = await desktopPage.getByText(/To szybka konsultacja/i).isHidden()

    await desktopPage.goto(`${appUrl}/polityka-prywatnosci`, { waitUntil: 'domcontentloaded' })
    const privacyHeadingVisible = await desktopPage.getByRole('heading', { name: /Jak przetwarzane są dane w Behawior 15/i }).isVisible()
    const privacyTitle = await desktopPage.title()
    const privacyContactVisible = await desktopPage.getByText(/coapebehawiorysta@gmail.com/i).first().isVisible()

    await desktopPage.goto(`${appUrl}/regulamin`, { waitUntil: 'domcontentloaded' })
    const termsHeadingVisible = await desktopPage.getByRole('heading', { name: /Zasady rezerwacji konsultacji Behawior 15/i }).isVisible()
    const termsTitle = await desktopPage.title()
    const termsContactVisible = await desktopPage.getByText(/coapebehawiorysta@gmail.com/i).first().isVisible()

    await desktopPage.goto(`${appUrl}/slot?problem=dogoterapia`, { waitUntil: 'domcontentloaded' })
    const dogotherapySlotHeadingVisible = await desktopPage.getByRole('heading', { name: /Wybierz termin rozmowy: Dogoterapia/i }).isVisible()

    await desktopPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    const adminPricingVisible = await desktopPage.getByRole('heading', { name: /Aktywna cena dla nowych rezerwacji/i }).isVisible()
    const adminBuildMarkerVisible = await desktopPage.getByText(new RegExp(BUILD_MARKER_KEY)).isVisible()
    await desktopPage.locator('input[type="number"]').fill('47')
    await desktopPage.getByRole('button', { name: /Zapisz now.*cen/i }).click()
    await desktopPage.getByText(/Zapisano now.*cen.*konsultacji/i).waitFor({ timeout: 10000 })

    assert.equal(homeCtaVisible, true)
    assert.equal(secondaryHeroCtaVisible, false)
    assert.equal(heroHeadingVisible, true)
    assert.equal(heroPriceVisible, true)
    assert.equal(trustStripVisible, true)
    assert.equal(dietitianVisible, true)
    assert.equal(heroPhotoVisible, true)
    assert.equal(certaintyHeadingVisible, true)
    assert.equal(aboutHeadingVisible, true)
    assert.equal(faqHeadingVisible, true)
    assert.equal(finalCtaHeadingVisible, true)
    assert.equal(shareVisible, false)
    assert.equal(footerLinkVisible, true)
    assert.equal(socialSectionVisible, false)
    assert.equal(socialFacebookVisible, true)
    assert.equal(homeAvailabilityVisible, true)
    assert.equal(consentVisible || gaScriptBeforeConsent === 0, true)
    assert.equal(gaScriptBeforeConsent, 0)
    assert.equal(consentDismissed, true)
    assert.equal(gaScriptAfterReject, 0)
    assert.equal(bookingHeadingVisible, true)
    assert.equal(bookingAvailabilityVisible, true)
    assert.equal(bookingTopicCardsCount >= 7, true)
    assert.equal(slotHeadingVisible || slotOptionVisible, true)
    assert.equal(slotOptionVisible, true)
    assert.equal(currentPublicSlotHrefs.length > 0, true)
    assert.equal(
      currentFormResponses.every(
        (entry) =>
          entry.ok &&
          entry.hasFormHeading &&
          !entry.hasInternalError &&
          !entry.hasLegacyPrice &&
          entry.hasBookingHeaderCta &&
          entry.hasTrustStrip &&
          !entry.hasLegacyHeader &&
          entry.hasContactEmail,
      ),
      true,
    )
    assert.equal(homepageHasWrongCalendarCopy, false)
    assert.equal(homepageHasMixedBookingCopy, false)
    assert.equal(paymentHeadingVisible, true)
    assert.equal(payButtonVisible, true)
    assert.equal(prepHeadingVisible, true)
    assert.equal(paymentPageHasTestBanner, false)
    assert.equal(confirmationVisible, true)
    assert.equal(prepCardStillVisible, true)
    assert.equal(selfCancelButtonVisible, true)
    assert.equal(cancellationVisible, true)
    assert.equal(prepCardHiddenAfterCancel, true)
    assert.equal(secondConfirmationVisible, true)
    assert.equal(callTimerVisible, true)
    assert.equal(roomIframeHasMeetingConfig, true)
    assert.equal(roomOpenLinkValid, true)
    assert.equal(legacyRoomRedirected, true)
    assert.equal(legacyRoomTimerVisible, true)
    assert.match(title, /Behawior 15/)
    assert.match(description ?? '', /Krzysztof Regulski|konsultacja głosowa/i)
    assert.match(ogTitle ?? '', /Behawior 15/i)
    assert.equal(twitterCard, 'summary_large_image')
    assert.match(jsonLdContent ?? '', /"@type":"Service"/)
    assert.equal(charsetMetaPresent, true)
    assert.equal(primaryBookingHref, '/book')
    assert.match(bookingTitle, /Rezerwacja konsultacji/i)
    assert.equal(headerOfertaVisible, true)
    assert.equal(headerLinkTexts.includes('Opinie'), false)
    assert.equal(headerLinkTexts.includes('Historie i efekty'), false)
    assert.equal(headerLinkTexts.includes('Zarezerwuj konsultację'), true)
    assert.equal(specialistNameVisible, true)
    assert.equal(specialistTrustVisible, true)
    assert.equal(specialistPhotoVisible, true)
    assert.equal(credentialAltVisible, true)
    assert.equal(proofCardsCount >= 3, true)
    assert.equal(aboutSectionVisible, true)
    assert.equal(desktopFaqVisible, true)
    assert.equal(desktopFinalCtaVisible, true)
    assert.equal(socialProofHeadingVisible, false)
    assert.equal(socialProofSummaryVisible, false)
    assert.equal(socialProofFormHeadingVisible, false)
    assert.equal(socialProofSubmitVisible, false)
    assert.equal(socialProofDisclaimerVisible, false)
    assert.equal(socialProofSectionOrder, false)
    assert.equal(dogotherapySlotHeadingVisible, true)
    assert.equal(testimonialRouteResponse.status, 503)
    assert.match(testimonialRoutePayload.error ?? '', /Formularz opinii jest chwilowo niedostępny/i)
    assert.equal(faviconResponse.ok, true)
    assert.equal(robotsResponse.ok, true)
    assert.match(robotsText, /Sitemap:\s*https?:\/\/.+\/sitemap\.xml/i)
    assert.equal(sitemapResponse.ok, true)
    assert.match(sitemapText, /<loc>https?:\/\/.+\/book<\/loc>/i)
    assert.equal(publicationsHeadingVisible, false)
    assert.equal(publicationLinkVisible, false)
    assert.equal(noBrokenMailto, true)
    assert.equal(faqInitiallyExpanded, 'true')
    assert.equal(faqAnswerInitiallyVisible, true)
    assert.equal(faqExpanded, 'false')
    assert.equal(faqAnswerVisibleAfterToggle, true)
    assert.equal(privacyHeadingVisible, true)
    assert.equal(privacyContactVisible, true)
    assert.match(privacyTitle, /Polityka prywatności/i)
    assert.equal(termsHeadingVisible, true)
    assert.equal(termsContactVisible, true)
    assert.match(termsTitle, /Regulamin/i)
    assert.equal(adminPricingVisible, true)
    assert.equal(adminBuildMarkerVisible, true)

    console.log(
      JSON.stringify(
        {
          mobile: {
            homeCtaVisible,
            secondaryHeroCtaVisible,
            heroHeadingVisible,
            heroPriceVisible,
            trustStripVisible,
            dietitianVisible,
            heroPhotoVisible,
            certaintyHeadingVisible,
            aboutHeadingVisible,
            faqHeadingVisible,
            finalCtaHeadingVisible,
            footerLinkVisible,
            socialSectionVisible,
            socialFacebookVisible,
            homeAvailabilityVisible,
            consentVisible,
            consentDismissed,
            bookingHeadingVisible,
            bookingAvailabilityVisible,
            bookingTopicCardsCount,
            slotHeadingVisible,
            slotOptionVisible,
            currentSlotCount: currentPublicSlotHrefs.length,
            homepageHasWrongCalendarCopy,
            homepageHasMixedBookingCopy,
            currentFormResponses,
            paymentHeadingVisible,
            payButtonVisible,
            prepHeadingVisible,
            paymentPageHasTestBanner,
            confirmationVisible,
            prepCardStillVisible,
            selfCancelButtonVisible,
            cancellationVisible,
            prepCardHiddenAfterCancel,
            secondConfirmationVisible,
            callTimerVisible,
            roomIframeHasMeetingConfig,
            roomOpenLinkValid,
            legacyRoomRedirected,
            legacyRoomTimerVisible,
            title,
            bookingTitle,
            description,
            ogTitle,
            twitterCard,
            charsetMetaPresent,
          },
          landing: {
            headerOfertaVisible,
            headerLinkTexts,
            specialistNameVisible,
            specialistTrustVisible,
            specialistPhotoVisible,
            credentialAltVisible,
            proofCardsCount,
            aboutSectionVisible,
            desktopFaqVisible,
            desktopFinalCtaVisible,
            socialProofHeadingVisible,
            socialProofSummaryVisible,
            socialProofFormHeadingVisible,
            socialProofSubmitVisible,
            socialProofDisclaimerVisible,
            dogotherapySlotHeadingVisible,
            robotsOk: robotsResponse.ok,
            sitemapOk: sitemapResponse.ok,
            publicationsHeadingVisible,
            publicationLinkVisible,
            noBrokenMailto,
            faqInitiallyExpanded,
            faqAnswerInitiallyVisible,
            faqExpanded,
            faqAnswerVisibleAfterToggle,
            privacyHeadingVisible,
            privacyContactVisible,
            privacyTitle,
            termsHeadingVisible,
            termsContactVisible,
            termsTitle,
          },
          admin: {
            pricingVisible: adminPricingVisible,
            buildMarkerVisible: adminBuildMarkerVisible,
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
