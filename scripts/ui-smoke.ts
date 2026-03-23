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
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(appUrl, { cache: 'no-store' })
      if (response.ok) return
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
  process.env.RESEND_API_KEY = ''

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
    const homeCtaVisible = await mobilePage.getByRole('link', { name: /Zarezerwuj 15 minut i odzyskaj spokój w domu/i }).first().isVisible()
    const secondaryHeroCtaVisible = await mobilePage.getByRole('link', { name: /Wybierz temat i termin/i }).first().isVisible()
    const heroHeadingVisible = await mobilePage
      .getByRole('heading', { name: /Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut/i })
      .isVisible()
    const heroPriceVisible = await mobilePage.locator('.hero-price-badge').getByText(/Aktualna cena/i).isVisible()
    const trustStripVisible = await mobilePage.locator('.header-trust-strip').getByText(/Zwrot pieniędzy/i).isVisible()
    const heroPhotoVisible = await mobilePage.locator('.hero-aside img[alt="Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15"]').isVisible()
    const reassuranceVisible = await mobilePage.getByText(/Jedna rozmowa, jasny plan i realny następny krok/i).isVisible()
    const shareVisible = await mobilePage.getByText(/Udostępnij znajomemu, który ma problem z pupilem/i).isVisible()
    const footerLinkVisible = await mobilePage.getByRole('link', { name: /Polityka prywatności/i }).isVisible()
    const socialSectionVisible = await mobilePage.getByRole('heading', {
      name: /Sprawdź profil i podeślij stronę osobie, która też potrzebuje spokojnego wsparcia/i,
    }).isVisible()
    const socialFacebookVisible = await mobilePage.getByRole('link', { name: /Otwórz profil Krzysztofa Regulskiego na Facebooku/i }).isVisible()
    const title = await mobilePage.title()
    const description = await mobilePage.locator('meta[name="description"]').getAttribute('content')
    const ogTitle = await mobilePage.locator('meta[property="og:title"]').getAttribute('content')
    const twitterCard = await mobilePage.locator('meta[name="twitter:card"]').getAttribute('content')
    const jsonLdContent = await mobilePage.locator('script[type="application/ld+json"]').first().textContent()
    const charsetMetaPresent = (await mobilePage.locator('meta[charset]').count()) > 0
    await mobilePage.getByRole('link', { name: /Zarezerwuj 15 minut i odzyskaj spokój w domu/i }).first().click()
    await mobilePage.waitForURL(/\/book$/, { timeout: 10000 })
    const bookingCtaWorks = await mobilePage.getByRole('heading', { name: /Zarezerwuj 15 minut i przejdź do realnie wolnych terminów/i }).isVisible()
    await mobilePage.goto(appUrl, { waitUntil: 'domcontentloaded' })

    await mobilePage.goto(`${appUrl}/payment?bookingId=${bookingOne.booking.id}&access=${encodeURIComponent(bookingOne.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const paymentHeadingVisible = await mobilePage.getByRole('heading', { name: /Za chwilę przejdziesz do bezpiecznej płatności/i }).isVisible()
    const prepHeadingVisible = await mobilePage.getByRole('heading', { name: /Przygotuj mnie do rozmowy/i }).isVisible()

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

    const payButtonVisible = await mobilePage.getByRole('button', { name: /Opłać konsultację/i }).isVisible()
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

    await mobilePage.goto(`${appUrl}/call/${bookingOne.booking.id}?access=${encodeURIComponent(bookingOne.accessToken)}`, {
      waitUntil: 'domcontentloaded',
    })
    const callTimerVisible = await mobilePage.getByRole('button', { name: /Uruchom licznik 15 minut/i }).isVisible()

    const desktopPage = await desktop.newPage()
    await desktopPage.goto(appUrl, { waitUntil: 'domcontentloaded' })
    const headerOfertaVisible = await desktopPage.getByRole('link', { name: /^Oferta$/i }).isVisible()
    const specialistHeadingVisible = await desktopPage.getByText(/Specjalista prowadzący/i).isVisible()
    const specialistTrustVisible = await desktopPage.getByRole('heading', {
      name: /Behawior, wiedza medyczna i doświadczenie terapeutyczne w jednym miejscu/i,
    }).isVisible()
    const specialistPhotoVisible = await desktopPage.locator('#specjalista img[alt="Krzysztof Regulski na portretowym zdjęciu do strony Behawior 15"]').isVisible()
    const credentialAltVisible = await desktopPage.locator('img[alt*="CAPBT Polska"]').isVisible()
    const realCasesHeadingVisible = await desktopPage.getByRole('heading', {
      name: /Takie problemy najczęściej trafiają na pierwszą 15-minutową rozmowę/i,
    }).isVisible()
    const realCaseCardsCount = await desktopPage.locator('.real-case-card').count()
    const publicationsHeadingVisible = await desktopPage.getByRole('heading', {
      name: /Zweryfikowane materiały, które wzmacniają trust bez nadęcia/i,
    }).isVisible()
    const publicationLinkVisible = await desktopPage.getByRole('link', { name: /Otwórz artykuł/i }).first().isVisible()
    const noBrokenMailto = (await desktopPage.locator('a[href^="mailto:"]').count()) <= 1
    const faqButton = desktopPage.getByRole('button', { name: /Czy 15 minut wystarczy/i })
    const faqInitiallyExpanded = await faqButton.getAttribute('aria-expanded')
    const faqAnswerInitiallyVisible = await desktopPage.getByText(/To szybka konsultacja/i).isVisible()
    await faqButton.click()
    const faqExpanded = await faqButton.getAttribute('aria-expanded')
    const faqAnswerVisibleAfterToggle = await desktopPage.getByText(/To szybka konsultacja/i).isHidden()

    await desktopPage.goto(`${appUrl}/admin`, { waitUntil: 'domcontentloaded' })
    const adminPricingVisible = await desktopPage.getByRole('heading', { name: /Aktywna cena dla nowych rezerwacji/i }).isVisible()
    const adminBuildMarkerVisible = await desktopPage.getByText(new RegExp(BUILD_MARKER_KEY)).isVisible()
    await desktopPage.locator('input[type="number"]').fill('47')
    await desktopPage.getByRole('button', { name: /Zapisz now.*cen/i }).click()
    await desktopPage.getByText(/Zapisano now.*cen.*konsultacji/i).waitFor({ timeout: 10000 })

    assert.equal(homeCtaVisible, true)
    assert.equal(secondaryHeroCtaVisible, true)
    assert.equal(heroHeadingVisible, true)
    assert.equal(heroPriceVisible, true)
    assert.equal(trustStripVisible, true)
    assert.equal(heroPhotoVisible, true)
    assert.equal(reassuranceVisible, true)
    assert.equal(shareVisible, true)
    assert.equal(footerLinkVisible, true)
    assert.equal(socialSectionVisible, true)
    assert.equal(socialFacebookVisible, true)
    assert.equal(bookingCtaWorks, true)
    assert.equal(paymentHeadingVisible, true)
    assert.equal(payButtonVisible, true)
    assert.equal(prepHeadingVisible, true)
    assert.equal(confirmationVisible, true)
    assert.equal(prepCardStillVisible, true)
    assert.equal(callTimerVisible, true)
    assert.match(title, /Behawior 15/)
    assert.match(description ?? '', /Krzysztof Regulski|28,99 zł|konsultacja głosowa/i)
    assert.match(ogTitle ?? '', /Behawior 15/i)
    assert.equal(twitterCard, 'summary_large_image')
    assert.match(jsonLdContent ?? '', /"@type":"Service"/)
    assert.equal(charsetMetaPresent, true)
    assert.equal(headerOfertaVisible, true)
    assert.equal(specialistHeadingVisible, true)
    assert.equal(specialistTrustVisible, true)
    assert.equal(specialistPhotoVisible, true)
    assert.equal(credentialAltVisible, true)
    assert.equal(realCasesHeadingVisible, true)
    assert.equal(realCaseCardsCount >= 3, true)
    assert.equal(publicationsHeadingVisible, true)
    assert.equal(publicationLinkVisible, true)
    assert.equal(noBrokenMailto, true)
    assert.equal(faqInitiallyExpanded, 'true')
    assert.equal(faqAnswerInitiallyVisible, true)
    assert.equal(faqExpanded, 'false')
    assert.equal(faqAnswerVisibleAfterToggle, true)
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
            heroPhotoVisible,
            reassuranceVisible,
            footerLinkVisible,
            socialSectionVisible,
            socialFacebookVisible,
            bookingCtaWorks,
            paymentHeadingVisible,
            payButtonVisible,
            prepHeadingVisible,
            confirmationVisible,
            prepCardStillVisible,
            callTimerVisible,
            title,
            description,
            ogTitle,
            twitterCard,
            charsetMetaPresent,
          },
          landing: {
            headerOfertaVisible,
            specialistHeadingVisible,
            specialistTrustVisible,
            specialistPhotoVisible,
            credentialAltVisible,
            realCasesHeadingVisible,
            realCaseCardsCount,
            publicationsHeadingVisible,
            publicationLinkVisible,
            noBrokenMailto,
            faqInitiallyExpanded,
            faqAnswerInitiallyVisible,
            faqExpanded,
            faqAnswerVisibleAfterToggle,
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
    if (server && !server.killed) server.kill()
    await restoreData()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
