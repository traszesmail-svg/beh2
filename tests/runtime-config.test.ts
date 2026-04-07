import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ContactPage from '@/app/kontakt/page'
import { Footer } from '@/components/Footer'
import { SocialSection } from '@/components/SocialSection'
import { buildBookHref, buildFormHref, buildPaymentHref, buildSlotHref, readQaBookingSearchParam } from '@/lib/booking-routing'
import { BUILD_MARKER_KEY } from '@/lib/build-marker'
import { getDefaultReleaseSmokeRules } from '@/lib/release-smoke'
import { INSTAGRAM_PROFILE_URL, SITE_PRODUCTION_URL } from '@/lib/site'
import { getDeployReadinessChecks, getGoLiveChecks, getVerifiedDeployReadinessChecks } from '@/lib/server/go-live'
import { getQaCheckoutEligibility, getQaCheckoutPaymentReference, getPublicManualPaymentConfig } from '@/lib/server/payment-options'
import { getDefaultProductionEnvSnapshotPath } from '@/scripts/lib/env-file'

function readSource(...parts: string[]) {
  return readFileSync(path.join(process.cwd(), ...parts), 'utf8')
}

function withEnv(
  overrides: Record<string, string | null | undefined>,
  run: () => void | Promise<void>,
) {
  const previous = new Map<string, string | undefined>()
  const restore = () => {
    for (const [key, value] of previous.entries()) {
      if (typeof value === 'string') {
        process.env[key] = value
      } else {
        delete process.env[key]
      }
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key])

    if (typeof value === 'string') {
      process.env[key] = value
    } else {
      delete process.env[key]
    }
  }

  const result = run()

  if (result && typeof (result as Promise<void>).then === 'function') {
    return (result as Promise<void>).finally(restore)
  }

  restore()
}

test('home hero stays short and decision-first', () => {
  const source = readSource('app', 'page.tsx')

  assert.match(source, /Masz psa, kota albo temat mieszany\? Zacznij od prostego wyboru\./)
  assert.match(source, /Prowadzę konsultacje osobiście/)
  assert.match(source, /confirmation i link do pokoju/)
  assert.match(source, /3 r.*wne wej.*cia/)
  assert.match(source, /Mam psa/)
  assert.match(source, /Mam kota/)
  assert.match(source, /Nie wiem, od czego zacz.*ć/)
  assert.doesNotMatch(source, /Dobierz pierwszy krok/)
  assert.doesNotMatch(source, /Wybierz start/)
  assert.doesNotMatch(source, /Piszesz do mnie/)
  assert.doesNotMatch(source, /Jak mogÄ™ pomĂłc/)
  assert.doesNotMatch(source, /Jak pracujÄ™/)
})

test('home hero uses the optimized portrait asset', () => {
  const homeSource = readSource('app', 'page.tsx')
  const siteSource = readSource('lib', 'site.ts')

  assert.match(siteSource, /HOME_HERO_PHOTO/)
  assert.match(siteSource, /specialist-krzysztof-portrait\.jpg/)
  assert.doesNotMatch(siteSource, /omnie-hero\.webp/)
  assert.match(siteSource, /cat-in-arms\.jpg/)
  assert.match(siteSource, /HOME_HELP_CHOICE_PHOTO/)
  assert.match(homeSource, /HOME_HERO_PHOTO/)
  assert.match(homeSource, /HOME_HERO_PHOTO\.src/)
  assert.doesNotMatch(homeSource, /SPECIALIST_WIDE_PHOTO\.src/)
})

test('offer and booking pages keep quick-scan language', () => {
  const offerPage = readSource('app', 'oferta', 'page.tsx')
  const pdfListingPage = readSource('app', 'oferta', 'poradniki-pdf', 'page.tsx')
  const bookingPage = readSource('app', 'book', 'page.tsx')
  const offersSource = readSource('lib', 'offers.ts')

  assert.match(offerPage, /Wybierz start dla swojej sytuacji\./)
  assert.match(offerPage, /Na każdej karcie tylko: kiedy to wybrać i co dalej\./)
  assert.match(offerPage, /PDF osobno/)
  assert.match(offerPage, /Szczegóły/)
  assert.doesNotMatch(offerPage, /Czy to dla Ciebie\?/)
  assert.doesNotMatch(offerPage, /Dobierz formę pomocy do sytuacji/)
  assert.doesNotMatch(offerPage, /dla psów/)
  assert.doesNotMatch(offerPage, /dla kotów/)
  assert.match(pdfListingPage, /PDF-y dla psów/)
  assert.match(pdfListingPage, /PDF-y dla kotów/)

  assert.match(bookingPage, /Wybierz temat na 15 min/)
  assert.match(bookingPage, /Kliknij temat najbliższy sytuacji\./)
  assert.match(bookingPage, /Temat mieszany\?/)
  assert.match(bookingPage, /Wybierz temat mieszany/)
  assert.match(bookingPage, /Przejdź do kategorii dla kota/)
  assert.match(bookingPage, /buildPublicPricingDisclosureMessage\(null\)/)
  assert.doesNotMatch(bookingPage, /@\/components\/PricingDisclosure/)
  assert.doesNotMatch(bookingPage, /SPECIALIST_NAME/)
  assert.doesNotMatch(bookingPage, /SPECIALIST_CREDENTIALS/)
  assert.doesNotMatch(bookingPage, /Jak wygląda rezerwacja/)
  assert.doesNotMatch(bookingPage, /Nie wiesz, co wybrać\?/)
  assert.doesNotMatch(bookingPage, /PayU/)

  assert.match(offersSource, /return offer\.detailCtaLabel \?\? 'Szczegóły'/)
  assert.match(offersSource, /primaryCtaLabel: 'Umów 15 min'/)
  assert.match(offersSource, /primaryCtaLabel: 'Napisz'/)
  assert.doesNotMatch(offersSource, /Czy to dla Ciebie\?/)
  assert.doesNotMatch(offersSource, /Szerszy start/)
  assert.doesNotMatch(offersSource, /kwalifikacja/)
  assert.doesNotMatch(offersSource, /forma pracy/)
  assert.doesNotMatch(offersSource, /obszar problemowy/)
})

test('offer, slot and form copy stay accented', () => {
  const offersSource = readSource('lib', 'offers.ts').normalize('NFC')
  const slotPage = readSource('app', 'slot', 'page.tsx').normalize('NFC')
  const bookingForm = readSource('components', 'BookingForm.tsx').normalize('NFC')

  assert.match(offersSource, /Więcej czasu/)
  assert.match(offersSource, /Gdy już wiesz, że 15 min będzie za krótkie/)
  assert.match(offersSource, /Pełniejszy start dla trudniejszej sprawy\./)
  assert.match(offersSource, /Gdy problem trwa długo, dotyczy kilku obszarów albo chcesz od razu wejść w pełniejszą analizę\./)
  assert.match(offersSource, /Od razu rezerwujesz dłuższy termin online zamiast zaczynać od samego formularza kontaktowego\./)
  assert.match(offersSource, /Gdy chcesz zacząć od materiału bez rezerwacji rozmowy\./)
  assert.match(slotPage, /Potrzebuję pomocy/)
  assert.match(bookingForm, /To pomoże lepiej wykorzystać/)
  assert.doesNotMatch(bookingForm, /albo PayU/)
})

test('pdf surfaces keep the staged decision layout', () => {
  const pdfListingPage = readSource('app', 'oferta', 'poradniki-pdf', 'page.tsx')
  const pdfGuidePage = readSource('app', 'oferta', 'poradniki-pdf', '[guideSlug]', 'page.tsx')
  const pdfBundlePage = readSource('app', 'oferta', 'poradniki-pdf', 'pakiety', '[bundleSlug]', 'page.tsx')

  assert.match(pdfListingPage, /pdf-stage-hero-grid/)
  assert.match(pdfListingPage, /pdf-stage-entry-grid/)
  assert.match(pdfListingPage, /offer-section-block-start/)
  assert.match(pdfListingPage, /offer-section-block-moretime/)
  assert.match(pdfListingPage, /offer-section-block-further/)
  assert.match(pdfListingPage, /ctaHref=\{buildPdfInquiryHref\(\)\}/)
  assert.doesNotMatch(pdfListingPage, /cta-panel compact-sales-cta/)

  assert.match(pdfGuidePage, /offer-detail-layout pdf-detail-layout/)
  assert.match(pdfGuidePage, /offer-detail-cta-band/)
  assert.match(pdfGuidePage, /buildPdfInquiryHref\(\{ guideSlug: guide\.slug \}\)/)
  assert.doesNotMatch(pdfGuidePage, /compact-sales-cta/)

  assert.match(pdfBundlePage, /offer-detail-layout pdf-detail-layout/)
  assert.match(pdfBundlePage, /offer-detail-cta-band/)
  assert.match(pdfBundlePage, /buildPdfInquiryHref\(\{ bundleSlug: bundle\.slug \}\)/)
  assert.doesNotMatch(pdfBundlePage, /compact-sales-cta/)
})

test('contact, header, footer and legal pages stay message-first without public phone', () => {
  const contactSource = readSource('app', 'kontakt', 'page.tsx')
  const headerSource = readSource('components', 'Header.tsx')
  const footerSource = readSource('components', 'Footer.tsx')
  const legalLayoutSource = readSource('components', 'LegalPageLayout.tsx')
  const privacySource = readSource('app', 'polityka-prywatnosci', 'page.tsx')
  const termsSource = readSource('app', 'regulamin', 'page.tsx')
  const contactMarkup = renderToStaticMarkup(createElement(ContactPage, { searchParams: {} }))
  const footerMarkup = renderToStaticMarkup(createElement(Footer))

  assert.match(contactSource, /Napisz wiadomo.*./)
  assert.match(contactSource, /Napisz kr.*tko, co si.* dzieje\. Podpowiem najprostszy start\./)
  assert.match(contactSource, /Piszesz do mnie/)
  assert.doesNotMatch(contactSource, /Wybierz<\/h2>/)
  assert.match(contactSource, /contact-feature-image/)
  assert.doesNotMatch(contactSource, /contact-shortcut-grid/)
  assert.doesNotMatch(contactMarkup, /tel:/i)
  assert.doesNotMatch(footerMarkup, /tel:/i)
  assert.doesNotMatch(privacySource, /tel:/i)
  assert.doesNotMatch(termsSource, /tel:/i)
  assert.doesNotMatch(privacySource, /PayU/)
  assert.doesNotMatch(termsSource, /PayU/)
  assert.match(privacySource, /LegalPageLayout/)
  assert.match(termsSource, /LegalPageLayout/)
  assert.match(legalLayoutSource, /legal-stage-layout/)
  assert.match(legalLayoutSource, /legal-summary-grid/)
  assert.match(legalLayoutSource, /legal-section-grid/)
  assert.match(legalLayoutSource, /legal-support-panel/)
  assert.doesNotMatch(privacySource, /legal-panel/)
  assert.doesNotMatch(termsSource, /legal-panel/)

  assert.match(headerSource, /href: '\/oferta'/)
  assert.match(headerSource, /href: '\/kontakt'/)
  assert.match(headerSource, /Um.*w 15 min/)
  assert.doesNotMatch(headerSource, /label: 'Koty'/)
  assert.doesNotMatch(headerSource, /label: 'Pobyty'/)

  assert.match(footerSource, /variant = 'lean'/)
  assert.match(footerSource, /Polityka prywatno.*ci/)
  assert.match(footerSource, /Regulamin/)
  assert.doesNotMatch(footerSource, /Formy wspĂłĹ‚pracy/)
  assert.doesNotMatch(footerMarkup, /Marka i kontakt/)
})

test('social trust surfaces keep CAPBT and Instagram together', () => {
  const homeSource = readSource('app', 'page.tsx')
  const footerSource = readSource('components', 'Footer.tsx')
  const socialSource = readSource('components', 'SocialSection.tsx')
  const legalLayoutSource = readSource('components', 'LegalPageLayout.tsx')
  const siteSource = readSource('lib', 'site.ts')
  const leanFooterMarkup = renderToStaticMarkup(createElement(Footer))
  const landingFooterMarkup = renderToStaticMarkup(createElement(Footer, { variant: 'landing' }))
  const fullFooterMarkup = renderToStaticMarkup(createElement(Footer, { variant: 'full' }))
  const socialMarkup = renderToStaticMarkup(createElement(SocialSection))

  assert.match(siteSource, /INSTAGRAM_PROFILE_URL/)
  assert.match(siteSource, /instagram\.com\/coapebehawiorysta/)
  assert.match(homeSource, /INSTAGRAM_PROFILE_URL/)
  assert.match(homeSource, /sameAs: \[COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL\]/)
  assert.match(homeSource, /Instagram @coapebehawiorysta/)
  assert.match(footerSource, /INSTAGRAM_PROFILE_URL/)
  assert.match(socialSource, /INSTAGRAM_PROFILE_URL/)
  assert.match(legalLayoutSource, /INSTAGRAM_PROFILE_URL/)
  assert.match(leanFooterMarkup, /behawioryscicoape\.pl\/behawiorysta\/Regulski/)
  assert.match(leanFooterMarkup, /instagram\.com\/coapebehawiorysta/)
  assert.match(landingFooterMarkup, /behawioryscicoape\.pl\/behawiorysta\/Regulski/)
  assert.match(landingFooterMarkup, /instagram\.com\/coapebehawiorysta/)
  assert.match(fullFooterMarkup, /behawioryscicoape\.pl\/behawiorysta\/Regulski/)
  assert.match(fullFooterMarkup, /instagram\.com\/coapebehawiorysta/)
  assert.match(socialMarkup, /behawioryscicoape\.pl\/behawiorysta\/Regulski/)
  assert.match(socialMarkup, /instagram\.com\/coapebehawiorysta/)
})

test('cat entry stays short and decision-led', () => {
  const catPage = readSource('app', 'koty', 'page.tsx')
  const dataSource = readSource('lib', 'data.ts')
  const siteSource = readSource('lib', 'site.ts')

  assert.match(catPage, /Wybierz temat dla kota i od razu przejdź do terminu\./)
  assert.match(catPage, /Kuweta, konflikt, trudny dotyk, stres albo nocna wokalizacja\./)
  assert.match(catPage, /Wybrany format:/)
  assert.match(catPage, /data-analytics-disabled=\{qaBooking \? 'true' : undefined\}/)
  assert.match(catPage, /Tryb QA/)
  assert.match(catPage, /CAT_PROBLEM_OPTIONS\.map/)
  assert.match(catPage, /data-cat-problem=\{category\.id\}/)
  assert.match(catPage, /buildSlotHref\(category\.id, serviceQuery, qaBooking\)/)
  assert.match(catPage, /CAT_TOPIC_VISUALS\[category\.id as keyof typeof CAT_TOPIC_VISUALS\]/)
  assert.match(catPage, /data-analytics-event="topic_selected"/)
  assert.match(catPage, /cats-start-step/)
  assert.match(catPage, /Pomoc w wyborze/)
  assert.match(dataSource, /id: 'kot-kuweta'/)
  assert.match(dataSource, /id: 'kot-konflikt'/)
  assert.match(dataSource, /id: 'kot-dotyk'/)
  assert.match(dataSource, /id: 'kot-stres'/)
  assert.match(dataSource, /id: 'kot-nocna-wokalizacja'/)
  assert.match(siteSource, /cat-litter-box\.jpg/)
  assert.match(siteSource, /cat-intercat-conflict\.jpg/)
  assert.match(siteSource, /cat-touch-defensive\.jpg/)
  assert.match(siteSource, /cat-anxious-hiding\.jpg/)
  assert.match(siteSource, /cat-night-meowing\.jpg/)
  assert.doesNotMatch(catPage, /Jak zaczyna się praca z kotem/)
  assert.doesNotMatch(catPage, /Kiedy napisać od razu/)
  assert.doesNotMatch(catPage, /Nie wiesz\? Napisz\./)
})

test('qa checkout routing stays isolated and allowlist-gated', () => {
  assert.equal(readQaBookingSearchParam('1'), true)
  assert.equal(readQaBookingSearchParam('true'), true)
  assert.equal(readQaBookingSearchParam('qa'), true)
  assert.equal(readQaBookingSearchParam('yes'), true)
  assert.equal(readQaBookingSearchParam('0'), false)
  assert.equal(readQaBookingSearchParam(undefined), false)

  assert.equal(buildBookHref(null, null, true), '/book?qa=1')
  assert.equal(buildSlotHref('szczeniak', null, true), '/slot?problem=szczeniak&qa=1')
  assert.equal(buildFormHref('szczeniak', 'slot-123', 'konsultacja-30-min', true), '/form?problem=szczeniak&slotId=slot-123&service=konsultacja-30-min&qa=1')
  assert.equal(buildPaymentHref('booking-123', 'access-token', 'konsultacja-30-min', true), '/payment?bookingId=booking-123&access=access-token&service=konsultacja-30-min&qa=1')

  withEnv(
    {
      APP_PAYMENT_MODE: 'mock',
      TEST_CHECKOUT_ENABLED: 'true',
      QA_CHECKOUT_EMAIL_ALLOWLIST: 'qa@example.com',
      QA_CHECKOUT_PHONE_ALLOWLIST: '',
      VERCEL_ENV: 'production',
    },
    () => {
      const allowed = getQaCheckoutEligibility({
        id: 'booking-123',
        qaBooking: true,
        email: 'qa@example.com',
        phone: '500000000',
      })

      assert.equal(allowed.isAllowed, true)
      assert.equal(allowed.paymentReference, getQaCheckoutPaymentReference('booking-123'))
      assert.match(allowed.summary, /QA/)

      const blockedByFlag = getQaCheckoutEligibility({
        id: 'booking-123',
        qaBooking: false,
        email: 'qa@example.com',
        phone: '500000000',
      })

      assert.equal(blockedByFlag.isAllowed, false)
      assert.match(blockedByFlag.summary, /QA/)
    },
  )

  withEnv(
    {
      APP_PAYMENT_MODE: 'mock',
      TEST_CHECKOUT_ENABLED: 'true',
      QA_CHECKOUT_EMAIL_ALLOWLIST: '',
      QA_CHECKOUT_PHONE_ALLOWLIST: '',
      VERCEL_ENV: 'production',
    },
    () => {
      const blocked = getQaCheckoutEligibility({
        id: 'booking-456',
        qaBooking: true,
        email: 'not-allowed@example.com',
        phone: '500000000',
      })

      assert.equal(blocked.isAllowed, false)
      assert.match(blocked.reason ?? '', /produkcji/)
    },
  )
})

test('qa booking schema fallback keeps public booking inserts alive', () => {
  const supabaseStoreSource = readSource('lib', 'server', 'supabase-store.ts')

  assert.match(supabaseStoreSource, /qaSchemaMode/)
  assert.match(supabaseStoreSource, /shouldRetryWithoutQaBooking/)
  assert.match(supabaseStoreSource, /withoutQaBooking/)
  assert.match(supabaseStoreSource, /legacyPaymentInsertPayload/)
})

test('booking form shows normalized slot conflict copy instead of raw api errors', () => {
  const bookingFormSource = readSource('components', 'BookingForm.tsx')
  const bookingApiErrorsSource = readSource('lib', 'server', 'booking-api-errors.ts')
  const bookingRouteSource = readSource('app', 'api', 'bookings', 'route.ts')

  assert.match(bookingFormSource, /normalizeBookingErrorMessage/)
  assert.match(bookingFormSource, /isSlotUnavailableBookingMessage/)
  assert.match(bookingFormSource, /Ten termin został właśnie zajęty/)
  assert.match(bookingApiErrorsSource, /SLOT_UNAVAILABLE_MESSAGE/)
  assert.match(bookingApiErrorsSource, /getPublicFeatureUnavailableMessage\('booking'\)/)
  assert.match(bookingRouteSource, /errorCode: failure\.code/)
})

test('cat topic images exist in the dedicated catalog', () => {
  const assetPaths = [
    ['public', 'branding', 'topic-cards', 'cats', 'cat-litter-box.jpg'],
    ['public', 'branding', 'topic-cards', 'cats', 'cat-intercat-conflict.jpg'],
    ['public', 'branding', 'topic-cards', 'cats', 'cat-touch-defensive.jpg'],
    ['public', 'branding', 'topic-cards', 'cats', 'cat-anxious-hiding.jpg'],
    ['public', 'branding', 'topic-cards', 'cats', 'cat-night-meowing.jpg'],
  ]

  for (const parts of assetPaths) {
    assert.doesNotThrow(() => readFileSync(path.join(process.cwd(), ...parts)))
  }
})

test('booking funnel sources keep canonical routing and standardized analytics events', () => {
  const homeSource = readSource('app', 'page.tsx')
  const stickyCtaSource = readSource('components', 'HomeMobileStickyCta.tsx')
  const contactSource = readSource('app', 'kontakt', 'page.tsx')
  const slotSource = readSource('app', 'slot', 'page.tsx')
  const bookSource = readSource('app', 'book', 'page.tsx')
  const catsSource = readSource('app', 'koty', 'page.tsx')
  const formSource = readSource('app', 'form', 'page.tsx')
  const legacyProblemSource = readSource('app', 'problem', 'page.tsx')
  const headerSource = readSource('components', 'Header.tsx')
  const footerSource = readSource('components', 'Footer.tsx')
  const bookingFormSource = readSource('components', 'BookingForm.tsx')
  const paymentActionsSource = readSource('components', 'PaymentActions.tsx')
  const confirmationSource = readSource('app', 'confirmation', 'page.tsx')
  const callRoomSource = readSource('components', 'CallRoom.tsx')

  assert.match(slotSource, /buildFormHref\(problem, slot\.id, serviceQuery, qaBooking\)/)
  assert.match(slotSource, /prefetch=\{false\}/)
  assert.match(slotSource, /getProblemLabel\(problem\)/)
  assert.match(bookSource, /buildSlotHref\(item\.id, serviceQuery, qaBooking\)/)
  assert.match(bookSource, /DOG_PROBLEM_OPTIONS/)
  assert.match(bookSource, /prefetch=\{false\}/)
  assert.match(bookSource, /Przejdź do kategorii dla kota/)
  assert.doesNotMatch(bookSource, /data-problem="kot"/)
  assert.match(formSource, /buildSlotHref\(problem, serviceQuery, qaBooking\)/)
  assert.match(legacyProblemSource, /buildSlotHref\(problem, null, qaBooking\)/)
  assert.doesNotMatch(legacyProblemSource, /\/book\?problem=/)
  assert.doesNotMatch(formSource, /PayU/)
  assert.match(formSource, /wpłaty ręcznej/)

  assert.match(homeSource, /home_view/)
  assert.match(homeSource, /AnalyticsEventOnMount/)
  assert.match(homeSource, /data-analytics-event="cta_click"/)
  assert.match(stickyCtaSource, /data-analytics-event="cta_click"/)
  assert.match(stickyCtaSource, /home-sticky-start/)
  assert.match(contactSource, /contact-primary-message/)
  assert.match(contactSource, /contact-primary-resource/)
  assert.match(contactSource, /contact-primary-reschedule/)

  assert.match(slotSource, /data-analytics-event="slot_selected"/)
  assert.doesNotMatch(slotSource, /data-analytics-event="slot_select"/)
  assert.match(bookSource, /data-analytics-event="topic_selected"/)
  assert.match(catsSource, /data-analytics-event="topic_selected"/)
  assert.match(headerSource, /data-analytics-event="cta_click"/)
  assert.match(footerSource, /data-analytics-event="cta_click"/)
  assert.match(bookingFormSource, /form_started/)
  assert.match(bookingFormSource, /isCatProblemType\(problemType\)/)
  assert.doesNotMatch(bookingFormSource, /problemType === 'kot'/)
  assert.match(paymentActionsSource, /payment_started/)
  assert.doesNotMatch(paymentActionsSource, /'payment_start'/)
  assert.match(confirmationSource, /payment_success/)
  assert.doesNotMatch(paymentActionsSource, /PayU jako druga opcja|Zapłać online PayU|albo PayU|PayU wróci/)
  assert.doesNotMatch(confirmationSource, /Wrocilismy z PayU/)
  assert.match(confirmationSource, /Wrocilismy z platnosci online/)
  assert.match(callRoomSource, /room_entered/)
})

test('payment, confirmation and call sources keep visible fallbacks instead of silent failure', () => {
  const paymentPageSource = readSource('app', 'payment', 'page.tsx')
  const paymentActionsSource = readSource('components', 'PaymentActions.tsx')
  const confirmationSource = readSource('app', 'confirmation', 'page.tsx')
  const manualPaymentRouteSource = readSource('app', 'api', 'payments', 'manual', 'route.ts')
  const callPageSource = readSource('app', 'call', '[id]', 'page.tsx')

  assert.match(paymentPageSource, /customerEmailAvailable/)
  assert.match(paymentPageSource, /payment_opened/)
  assert.match(paymentPageSource, /AnalyticsEventOnMount/)
  assert.match(paymentActionsSource, /customerEmailAvailable/)
  assert.match(confirmationSource, /customerEmailAvailable/)
  assert.match(paymentPageSource, /wpłaty ręcznej/)
  assert.doesNotMatch(paymentPageSource, /PayU jest dostępne od razu|Gdy płatność online PayU wróci|albo PayU/)
  assert.match(paymentActionsSource, /zachowaj ten link/i)
  assert.match(paymentPageSource, /poka.*emy link do pokoju bezpo.*rednio na stronie potwierdzenia/i)
  assert.match(confirmationSource, /poka.*emy aktywny link do rozmowy bezpo.*rednio na tej stronie/i)
  assert.match(manualPaymentRouteSource, /adminNotice/)
  assert.match(confirmationSource, /adminNotice/)
  assert.match(confirmationSource, /automatyczne powiadomienie obs.*ugi/i)
  assert.match(confirmationSource, /onlineSyncWarning/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] stripe return finalize failed/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] payu return sync failed/)
  assert.match(callPageSource, /flowError/)
  assert.match(callPageSource, /\[behawior15\]\[call\] failed to load booking/)
  assert.match(callPageSource, /Nie udalo sie wczytac pokoju rozmowy|Nie udaĹ‚o siÄ™ wczytaÄ‡ pokoju rozmowy/)
})

test('public manual payment stays available when only BLIK phone is configured', () => {
  const originalBlikPhone = process.env.MANUAL_PAYMENT_BLIK_PHONE
  const originalBankAccount = process.env.MANUAL_PAYMENT_BANK_ACCOUNT

  process.env.MANUAL_PAYMENT_BLIK_PHONE = '500600700'
  delete process.env.MANUAL_PAYMENT_BANK_ACCOUNT

  try {
    const manual = getPublicManualPaymentConfig()

    assert.equal(manual.isAvailable, true)
    assert.equal(manual.phoneDisplay, '500 600 700')
    assert.equal(manual.bankAccountDisplay, null)
    assert.match(manual.summary, /BLIK na telefon jest dost.*pny/i)
  } finally {
    if (typeof originalBlikPhone === 'string') {
      process.env.MANUAL_PAYMENT_BLIK_PHONE = originalBlikPhone
    } else {
      delete process.env.MANUAL_PAYMENT_BLIK_PHONE
    }

    if (typeof originalBankAccount === 'string') {
      process.env.MANUAL_PAYMENT_BANK_ACCOUNT = originalBankAccount
    } else {
      delete process.env.MANUAL_PAYMENT_BANK_ACCOUNT
    }
  }
})

test('release smoke rules track the current home and booking copy', () => {
  const rules = getDefaultReleaseSmokeRules()
  const homeRule = rules.find((rule) => rule.path === '/')
  const bookRule = rules.find((rule) => rule.path === '/book')
  const catsRule = rules.find((rule) => rule.path === '/koty')
  const termsRule = rules.find((rule) => rule.path === '/regulamin')
  const privacyRule = rules.find((rule) => rule.path === '/polityka-prywatnosci')

  assert.ok(homeRule)
  assert.ok(bookRule)
  assert.ok(catsRule)
  assert.ok(termsRule)
  assert.ok(privacyRule)

  assert.equal(homeRule?.required?.includes('Masz psa, kota albo temat mieszany? Zacznij od prostego wyboru.'), true)
  assert.equal(homeRule?.required?.includes('Prowadzę konsultacje osobiście'), true)
  assert.equal(homeRule?.required?.includes('3 r\u00f3wne wej\u015bcia'), true)
  assert.equal(homeRule?.required?.includes('Nie wiem, od czego zacz\u0105\u0107'), true)
  assert.equal(homeRule?.forbidden?.includes('Udost\u0119pnij znajomemu'), true)
  assert.deepEqual(homeRule?.ordered, [
    'Regulski | Terapia behawioralna',
    'Masz psa, kota albo temat mieszany? Zacznij od prostego wyboru.',
    '3 r\u00f3wne wej\u015bcia',
  ])

  assert.equal(bookRule?.required?.includes('Wybierz temat dla:'), true)
  assert.equal(bookRule?.required?.includes('Temat mieszany?'), true)
  assert.equal(bookRule?.required?.includes('Wybierz temat mieszany'), true)
  assert.equal(bookRule?.forbidden?.includes('Kot i trudne zachowania'), true)

  assert.equal(catsRule?.required?.includes('Wybierz temat dla kota i od razu przejdź do terminu.'), true)
  assert.equal(catsRule?.required?.includes('Kot i kuweta'), true)
  assert.equal(catsRule?.required?.includes('Konflikt miedzy kotami'), true)
  assert.equal(catsRule?.required?.includes('Dotyk, gryzienie i pielegnacja'), true)
  assert.equal(catsRule?.required?.includes('Kot lekowy, napiety albo wycofany'), true)
  assert.equal(catsRule?.required?.includes('Budzi dom po nocy / nocna wokalizacja'), true)
  assert.equal(catsRule?.forbidden?.includes('Masz problem z kotem? Wybierz start.'), true)

  assert.equal(termsRule?.required?.includes('Zasady rezerwacji szybkiej konsultacji 15 min'), true)
  assert.equal(termsRule?.forbidden?.includes('Koty'), true)
  assert.equal(termsRule?.forbidden?.includes('Pobyty'), true)
  assert.equal(termsRule?.forbidden?.includes('Telefon'), true)
  assert.equal(termsRule?.forbiddenRaw?.includes('tel:'), true)

  assert.equal(privacyRule?.required?.includes('Jak przetwarzane s\u0105 dane w marce Regulski | Terapia behawioralna'), true)
  assert.equal(privacyRule?.forbidden?.includes('Koty'), true)
  assert.equal(privacyRule?.forbidden?.includes('Pobyty'), true)
  assert.equal(privacyRule?.forbidden?.includes('Telefon'), true)
  assert.equal(privacyRule?.forbiddenRaw?.includes('tel:'), true)
})

test('go-live checks expose external blockers for Resend testing mode and PayU sandbox', () => {
  withEnv(
    {
      RESEND_API_KEY: 're_test_key',
      RESEND_FROM_EMAIL: 'Behawior 15 <onboarding@resend.dev>',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_ENVIRONMENT: 'sandbox',
      PAYU_CLIENT_ID: 'sandbox-client',
      PAYU_CLIENT_SECRET: 'sandbox-secret',
      PAYU_POS_ID: 'sandbox-pos',
      PAYU_SECOND_KEY: 'sandbox-second',
    },
    () => {
      const checks = getGoLiveChecks()
      const emailCheck = checks.find((check) => check.id === 'customer-email')
      const payuCheck = checks.find((check) => check.id === 'payu-online')

      assert.equal(emailCheck?.tone, 'attention')
      assert.match(emailCheck?.summary ?? '', /resend\.dev testing mode/i)
      assert.match(emailCheck?.nextStep ?? '', /Zweryfikuj domene nadawcy w Resend/i)

      assert.equal(payuCheck?.tone, 'attention')
      assert.match(payuCheck?.summary ?? '', /PAYU_ENVIRONMENT=sandbox/)
      assert.match(payuCheck?.nextStep ?? '', /produkcyjne klucze/i)
      assert.match(payuCheck?.nextStep ?? '', /payu-smoke:production/i)
    },
  )
})

test('go-live checks mark verified Resend and production PayU as ready', () => {
  withEnv(
    {
      RESEND_API_KEY: 're_live_key',
      RESEND_FROM_EMAIL: 'Behawior 15 <kontakt@example.com>',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_ENVIRONMENT: 'production',
      PAYU_CLIENT_ID: 'live-client',
      PAYU_CLIENT_SECRET: 'live-secret',
      PAYU_POS_ID: 'live-pos',
      PAYU_SECOND_KEY: 'live-second',
    },
    () => {
      const checks = getGoLiveChecks()
      const emailCheck = checks.find((check) => check.id === 'customer-email')
      const payuCheck = checks.find((check) => check.id === 'payu-online')

      assert.equal(emailCheck?.tone, 'ready')
      assert.match(emailCheck?.summary ?? '', /gotowa z aktualnej konfiguracji Resend/i)

      assert.equal(payuCheck?.tone, 'ready')
      assert.match(payuCheck?.summary ?? '', /srodowiska production/i)
    },
  )
})

test('go-live checks mark Gmail SMTP customer email delivery as ready', () => {
  withEnv(
    {
      MAIL_PROVIDER: 'gmail',
      CUSTOMER_EMAIL_MODE: 'auto',
      GMAIL_SMTP_USER: 'coapebehawiorysta@gmail.com',
      GMAIL_SMTP_APP_PASSWORD: 'gmail-app-password',
      GMAIL_FROM_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_ENVIRONMENT: 'production',
      PAYU_CLIENT_ID: 'live-client',
      PAYU_CLIENT_SECRET: 'live-secret',
      PAYU_POS_ID: 'live-pos',
      PAYU_SECOND_KEY: 'live-second',
    },
    () => {
      const checks = getGoLiveChecks()
      const emailCheck = checks.find((check) => check.id === 'customer-email')

      assert.equal(emailCheck?.tone, 'ready')
      assert.match(emailCheck?.summary ?? '', /Gmail SMTP/i)
    },
  )
})

test('go-live checks flag disabled customer emails as attention while PayU disabled stays ready', () => {
  withEnv(
    {
      CUSTOMER_EMAIL_MODE: 'disabled',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_MODE: 'disabled',
      PAYU_ENVIRONMENT: 'sandbox',
      PAYU_CLIENT_ID: 'sandbox-client',
      PAYU_CLIENT_SECRET: 'sandbox-secret',
      PAYU_POS_ID: 'sandbox-pos',
      PAYU_SECOND_KEY: 'sandbox-second',
    },
    () => {
      const checks = getGoLiveChecks()
      const emailCheck = checks.find((check) => check.id === 'customer-email')
      const payuCheck = checks.find((check) => check.id === 'payu-online')

      assert.equal(emailCheck?.tone, 'attention')
      assert.match(emailCheck?.summary ?? '', /swiadomie wylaczone/i)
      assert.match(emailCheck?.nextStep ?? '', /CUSTOMER_EMAIL_MODE=auto/i)

      assert.equal(payuCheck?.tone, 'ready')
      assert.match(payuCheck?.summary ?? '', /PayU online jest swiadomie wylaczone/i)
    },
  )
})

test('deploy readiness checks fail on local fallback and localhost base url', () => {
  withEnv(
    {
      APP_DATA_MODE: 'local',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SUPABASE_URL: null,
      SUPABASE_SERVICE_ROLE_KEY: null,
      RESEND_API_KEY: 're_test_key',
      RESEND_FROM_EMAIL: 'Behawior 15 <onboarding@resend.dev>',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_ENVIRONMENT: 'sandbox',
      PAYU_CLIENT_ID: 'sandbox-client',
      PAYU_CLIENT_SECRET: 'sandbox-secret',
      PAYU_POS_ID: 'sandbox-pos',
      PAYU_SECOND_KEY: 'sandbox-second',
    },
    () => {
      const checks = getDeployReadinessChecks()
      const dataCheck = checks.find((check) => check.id === 'data-runtime')
      const urlCheck = checks.find((check) => check.id === 'app-url')

      assert.equal(dataCheck?.tone, 'attention')
      assert.match(dataCheck?.summary ?? '', /localnego fallbacku JSON|local JSON fallback/i)

      assert.equal(urlCheck?.tone, 'attention')
      assert.match(urlCheck?.summary ?? '', /localhost:3000/i)
    },
  )
})

test('deploy readiness checks pass for live-like runtime, url, Resend and PayU', () => {
  withEnv(
    {
      APP_DATA_MODE: 'supabase',
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_live_example',
      NEXT_PUBLIC_APP_URL: SITE_PRODUCTION_URL,
      RESEND_API_KEY: 're_live_key',
      RESEND_FROM_EMAIL: 'Behawior 15 <kontakt@example.com>',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_ENVIRONMENT: 'production',
      PAYU_CLIENT_ID: 'live-client',
      PAYU_CLIENT_SECRET: 'live-secret',
      PAYU_POS_ID: 'live-pos',
      PAYU_SECOND_KEY: 'live-second',
    },
    () => {
      const checks = getDeployReadinessChecks()
      const blockingChecks = checks.filter((check) => check.tone === 'attention')

      assert.equal(blockingChecks.length, 0)
      assert.equal(checks.length >= 4, true)
    },
  )
})

test('verified deploy readiness can block a syntactically valid URL when external probe fails', async () => {
  const originalFetch = globalThis.fetch
  const blockedResponse = new Response('Protected', { status: 401 })

  globalThis.fetch = async () => blockedResponse

  try {
    await withEnv(
      {
      APP_DATA_MODE: 'supabase',
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_live_example',
      NEXT_PUBLIC_APP_URL: SITE_PRODUCTION_URL,
      CUSTOMER_EMAIL_MODE: 'disabled',
      BEHAVIOR15_CONTACT_EMAIL: 'coapebehawiorysta@gmail.com',
      PAYU_MODE: 'disabled',
      },
      async () => {
        const checks = await getVerifiedDeployReadinessChecks()
        const urlCheck = checks.find((check) => check.id === 'app-url')

        assert.equal(urlCheck?.tone, 'attention')
        assert.match(urlCheck?.summary ?? '', /HTTP 401/i)
        assert.match(urlCheck?.nextStep ?? '', /401\/SSO/i)
      },
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('live clickthrough keeps legal pages inside public production QA', () => {
  const liveClickthroughSource = readSource('scripts', 'live-clickthrough-report.ts')

  assert.match(liveClickthroughSource, /\/regulamin/)
  assert.match(liveClickthroughSource, /\/polityka-prywatnosci/)
  assert.match(liveClickthroughSource, /oferta -> payment \/ 30 min CTA/)
  assert.match(liveClickthroughSource, /oferta -> slot \/ online CTA/)
  assert.match(liveClickthroughSource, /konsultacja-30-min/)
  assert.match(liveClickthroughSource, /konsultacja-behawioralna-online/)
  assert.match(liveClickthroughSource, /CAPBT/)
  assert.match(liveClickthroughSource, /a\[href\^="tel:"\]/)
  assert.match(liveClickthroughSource, /Stare linki nawigacji nadal sÄ… widoczne/)
})

test('footer keeps a hidden build marker without exposing technical copy to the client', () => {
  const originalBranch = process.env.VERCEL_GIT_COMMIT_REF
  const originalCommit = process.env.VERCEL_GIT_COMMIT_SHA

  process.env.VERCEL_GIT_COMMIT_REF = 'main'
  process.env.VERCEL_GIT_COMMIT_SHA = 'fa5563d1234567890abcdef'

  try {
    const markup = renderToStaticMarkup(createElement(Footer))

    assert.doesNotMatch(markup, /Wersja serwisu/)
    assert.doesNotMatch(markup, /main \/ fa5563d/)
    assert.match(markup, new RegExp(`data-build-marker="${BUILD_MARKER_KEY}:main:fa5563d"`))
  } finally {
    if (typeof originalBranch === 'string') {
      process.env.VERCEL_GIT_COMMIT_REF = originalBranch
    } else {
      delete process.env.VERCEL_GIT_COMMIT_REF
    }

    if (typeof originalCommit === 'string') {
      process.env.VERCEL_GIT_COMMIT_SHA = originalCommit
    } else {
      delete process.env.VERCEL_GIT_COMMIT_SHA
    }
  }
})

test('funnel loading shell stays lightweight without duplicating header or footer', () => {
  const loadingSource = readSource('components', 'FunnelLoadingPage.tsx')

  assert.match(loadingSource, /loading-panel-light/)
  assert.doesNotMatch(loadingSource, /@\/components\/Header/)
  assert.doesNotMatch(loadingSource, /@\/components\/Footer/)
  assert.doesNotMatch(loadingSource, /<Header/)
  assert.doesNotMatch(loadingSource, /<Footer/)
})

test('contact page keeps the compact identity block next to the action panel', () => {
  const markup = renderToStaticMarkup(createElement(ContactPage, { searchParams: {} }))

  assert.match(markup, /Piszesz do mnie/)
  assert.match(markup, /Krzysztof Regulski/)
  assert.match(markup, /COAPE \/ CAPBT/)
  assert.doesNotMatch(markup, /specialist-krzysztof-wide\.jpg/)
})

test('admin page renders explicit go-live status cards', () => {
  const adminSource = readSource('app', 'admin', 'page.tsx')
  const qaReportSource = readSource('app', '%5F%5Finternal', 'qa-report', 'page.tsx')

  assert.match(adminSource, /getGoLiveChecks/)
  assert.match(adminSource, /Go-live/)
  assert.match(adminSource, /Stan go-live/)
  assert.match(adminSource, /goLiveChecks\.map/)
  assert.match(adminSource, /Dalej: \{check\.nextStep\}/)
  assert.match(adminSource, /Analityka i operacje/)
  assert.match(adminSource, /funnelMetricsSnapshot/)
  assert.match(adminSource, /data-analytics-disabled="true"/)
  assert.match(qaReportSource, /data-analytics-disabled="true"/)
  assert.match(qaReportSource, /readLatestQaReport/)
})

test('build script keeps explicit no-cache lint before next build', () => {
  const packageJson = JSON.parse(readSource('package.json')) as {
    scripts?: Record<string, string>
  }

  assert.equal(packageJson.scripts?.build, 'next lint --no-cache && next build --no-lint')
  assert.equal(packageJson.scripts?.['funnel-metrics'], 'node --import tsx scripts/funnel-metrics.ts')
  assert.equal(packageJson.scripts?.['live-readiness'], 'node --import tsx scripts/live-readiness.ts')
  assert.equal(packageJson.scripts?.['payu-smoke:production'], 'node --import tsx scripts/payu-smoke.ts --production')
})

test('payu smoke script supports a production checkout target without sandbox defaults', () => {
  const source = readSource('scripts', 'payu-smoke.ts')

  assert.match(source, /--production/)
  assert.match(source, /PAYU_SMOKE_ENVIRONMENT/)
  assert.match(source, /smokeEnvironment === 'production'/)
  assert.match(source, /ALLOWED_PAYU_SANDBOX_HOSTS/)
  assert.match(source, /isProductionRedirectHost/)
  assert.match(source, /secure\.snd\.payu\.com/)
})

test('live readiness script writes the expected QA artifact and supports report-only mode', () => {
  const source = readSource('scripts', 'live-readiness.ts')

  assert.match(source, /getVerifiedDeployReadinessChecks/)
  assert.match(source, /latest-live-readiness\.md/)
  assert.match(source, /--report-only/)
  assert.match(source, /Applied default production env snapshot/)
  assert.match(source, /Zrodlo env:/)
  assert.match(source, /Go-live readiness detected blockers/)
})

test('go-live source keeps the verified external URL probe path', () => {
  const source = readSource('lib', 'server', 'go-live.ts')

  assert.match(source, /async function probePublicAppUrl/)
  assert.match(source, /getVerifiedDeployReadinessChecks/)
  assert.match(source, /Publiczny URL nie odpowiada poprawnie dla ruchu zewnetrznego/)
  assert.match(source, /npm run live-smoke/)
})

test('default production env snapshot path prefers the current production snapshot', () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'behawior15-live-readiness-'))

  try {
    const vercelDir = path.join(tempRoot, '.vercel')
    mkdirSync(vercelDir, { recursive: true })
    const localSnapshotPath = path.join(vercelDir, '.env.production.local')
    const currentSnapshotPath = path.join(vercelDir, '.env.production.current')
    writeFileSync(localSnapshotPath, 'PAYU_ENVIRONMENT=sandbox\n', 'utf8')
    writeFileSync(currentSnapshotPath, `NEXT_PUBLIC_APP_URL=${SITE_PRODUCTION_URL}\n`, 'utf8')

    assert.equal(getDefaultProductionEnvSnapshotPath(tempRoot), currentSnapshotPath)
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})
