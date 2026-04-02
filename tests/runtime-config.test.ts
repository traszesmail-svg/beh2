import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ContactPage from '@/app/kontakt/page'
import { Footer } from '@/components/Footer'
import { BUILD_MARKER_KEY } from '@/lib/build-marker'
import { getDefaultReleaseSmokeRules } from '@/lib/release-smoke'
import { getPublicManualPaymentConfig } from '@/lib/server/payment-options'

function readSource(...parts: string[]) {
  return readFileSync(path.join(process.cwd(), ...parts), 'utf8')
}

test('home hero stays short and decision-first', () => {
  const source = readSource('app', 'page.tsx')

  assert.match(source, /Masz problem z psem lub kotem\? Wybierz pierwszy krok\./)
  assert.match(source, /Umów 15 min albo napisz wiadomość\./)
  assert.match(source, /Szybki wybór/)
  assert.match(source, /Wybierz start/)
  assert.match(source, /Mam psa/)
  assert.match(source, /Mam kota/)
  assert.doesNotMatch(source, /label: 'Nie wiem'/)
  assert.doesNotMatch(source, /Nie wiem, co wybrać/)
  assert.doesNotMatch(source, /Masz psa albo kota i nie wiesz, od czego zacząć\?/)
  assert.doesNotMatch(source, /Jak mogę pomóc/)
  assert.doesNotMatch(source, /Jak pracuję/)
})

test('offer and booking pages keep quick-choice language', () => {
  const offerPage = readSource('app', 'oferta', 'page.tsx')
  const pdfListingPage = readSource('app', 'oferta', 'poradniki-pdf', 'page.tsx')
  const bookingPage = readSource('app', 'book', 'page.tsx')
  const offersSource = readSource('lib', 'offers.ts')

  assert.match(offerPage, /Wybierz, od czego zacząć\./)
  assert.match(offerPage, /Na każdej karcie: kiedy to wybrać i co dalej\./)
  assert.match(offerPage, /Kiedy to wybrać/)
  assert.match(offerPage, /Co dalej/)
  assert.doesNotMatch(offerPage, /Dobierz formę pomocy do sytuacji/)
  assert.doesNotMatch(offerPage, /offer\.cardSummary/)
  assert.match(offerPage, /dla psów/)
  assert.match(offerPage, /dla kotów/)
  assert.doesNotMatch(offerPage, /Pies i kot/)
  assert.match(pdfListingPage, /PDF-y dla psów/)
  assert.match(pdfListingPage, /PDF-y dla kotów/)
  assert.doesNotMatch(pdfListingPage, /Pies i kot/)

  assert.match(bookingPage, /Wybierz temat na 15 min/)
  assert.match(bookingPage, /Kliknij temat najbliższy sytuacji\./)
  assert.match(bookingPage, /Temat mieszany\?/)
  assert.match(bookingPage, /Wybierz inny temat/)
  assert.match(bookingPage, /Jeśli nadal nie wiesz,/)
  assert.match(bookingPage, /buildPublicPricingDisclosureMessage\(null\)/)
  assert.doesNotMatch(bookingPage, /@\/components\/PricingDisclosure/)
  assert.doesNotMatch(bookingPage, /SPECIALIST_NAME/)
  assert.doesNotMatch(bookingPage, /SPECIALIST_CREDENTIALS/)
  assert.doesNotMatch(bookingPage, /Wybierz temat konsultacji 15 min/)
  assert.doesNotMatch(bookingPage, /Jak wygląda rezerwacja/)
  assert.doesNotMatch(bookingPage, /Nie wiesz, co wybrać\?/)

  assert.match(offersSource, /return offer\.detailCtaLabel \?\? 'Czy to dla Ciebie\?'/)
  assert.doesNotMatch(offersSource, /Szerszy start/)
  assert.doesNotMatch(offersSource, /119 zl|350 zl/)
  assert.doesNotMatch(offersSource, /Zobacz szczegóły/)
  assert.doesNotMatch(offersSource, /kwalifikacja/)
  assert.doesNotMatch(offersSource, /forma pracy/)
  assert.doesNotMatch(offersSource, /obszar problemowy/)
})

test('contact, header, footer and legal pages stay message-first without public phone', () => {
  const contactSource = readSource('app', 'kontakt', 'page.tsx')
  const headerSource = readSource('components', 'Header.tsx')
  const footerSource = readSource('components', 'Footer.tsx')
  const privacySource = readSource('app', 'polityka-prywatnosci', 'page.tsx')
  const termsSource = readSource('app', 'regulamin', 'page.tsx')
  const contactMarkup = renderToStaticMarkup(createElement(ContactPage, { searchParams: {} }))
  const footerMarkup = renderToStaticMarkup(createElement(Footer))

  assert.match(contactSource, /Napisz albo umów 15 min/)
  assert.match(contactSource, /Opisz krótko sytuację psa albo kota\. Wskażę start\./)
  assert.match(contactSource, /<h2 className="top-gap">Wybierz<\/h2>/)
  assert.doesNotMatch(contactSource, /Zobacz całą ofertę/)
  assert.doesNotMatch(contactMarkup, /tel:/i)
  assert.doesNotMatch(footerMarkup, /tel:/i)
  assert.doesNotMatch(privacySource, /tel:/i)
  assert.doesNotMatch(termsSource, /tel:/i)

  assert.match(headerSource, /href: '\/oferta'/)
  assert.match(headerSource, /href: '\/kontakt'/)
  assert.match(headerSource, /Umów 15 min/)
  assert.doesNotMatch(headerSource, /label: 'Koty'/)
  assert.doesNotMatch(headerSource, /label: 'Pobyty'/)

  assert.match(footerSource, /Marka i kontakt/)
  assert.doesNotMatch(footerSource, /Formy współpracy/)
})

test('cat entry stays short and decision-led', () => {
  const catPage = readSource('app', 'koty', 'page.tsx')

  assert.match(catPage, /Masz problem z kotem\? Wybierz pierwszy krok\./)
  assert.match(catPage, /Kuweta, napięcie, konflikt albo trudny dotyk\./)
  assert.match(catPage, /Nie wiesz\? Napisz\./)
  assert.doesNotMatch(catPage, /Jak zaczyna się praca z kotem/)
  assert.doesNotMatch(catPage, /Kiedy napisać od razu/)
  assert.doesNotMatch(catPage, /Najczęstsze tematy/)
})

test('booking funnel sources keep canonical routing and standardized analytics events', () => {
  const homeSource = readSource('app', 'page.tsx')
  const stickyCtaSource = readSource('components', 'HomeMobileStickyCta.tsx')
  const contactSource = readSource('app', 'kontakt', 'page.tsx')
  const slotSource = readSource('app', 'slot', 'page.tsx')
  const bookSource = readSource('app', 'book', 'page.tsx')
  const formSource = readSource('app', 'form', 'page.tsx')
  const legacyProblemSource = readSource('app', 'problem', 'page.tsx')
  const headerSource = readSource('components', 'Header.tsx')
  const footerSource = readSource('components', 'Footer.tsx')
  const bookingFormSource = readSource('components', 'BookingForm.tsx')
  const paymentActionsSource = readSource('components', 'PaymentActions.tsx')
  const confirmationSource = readSource('app', 'confirmation', 'page.tsx')
  const callRoomSource = readSource('components', 'CallRoom.tsx')

  assert.match(slotSource, /buildFormHref\(problem, slot\.id\)/)
  assert.match(slotSource, /prefetch=\{false\}/)
  assert.match(bookSource, /buildSlotHref\(item\.id\)/)
  assert.match(bookSource, /prefetch=\{false\}/)
  assert.match(formSource, /buildSlotHref\(problem\)/)
  assert.match(legacyProblemSource, /buildSlotHref\(problem\)/)
  assert.doesNotMatch(legacyProblemSource, /\/book\?problem=/)

  assert.match(homeSource, /data-analytics-event="cta_click"/)
  assert.match(stickyCtaSource, /data-analytics-event="cta_click"/)
  assert.match(stickyCtaSource, /home-sticky-match/)
  assert.match(contactSource, /contact-primary-message/)
  assert.match(contactSource, /contact-primary-resource/)
  assert.match(contactSource, /contact-primary-reschedule/)
  assert.match(contactSource, /contact-shortcut-book/)
  assert.match(contactSource, /contact-shortcut-message/)

  assert.match(slotSource, /data-analytics-event="slot_selected"/)
  assert.doesNotMatch(slotSource, /data-analytics-event="slot_select"/)
  assert.match(bookSource, /data-analytics-event="cta_click"/)
  assert.match(headerSource, /data-analytics-event="cta_click"/)
  assert.match(footerSource, /data-analytics-event="cta_click"/)
  assert.match(bookingFormSource, /form_started/)
  assert.match(paymentActionsSource, /payment_started/)
  assert.doesNotMatch(paymentActionsSource, /'payment_start'/)
  assert.match(confirmationSource, /payment_success/)
  assert.match(callRoomSource, /room_entered/)
})

test('payment, confirmation and call sources keep visible fallbacks instead of silent failure', () => {
  const paymentPageSource = readSource('app', 'payment', 'page.tsx')
  const paymentActionsSource = readSource('components', 'PaymentActions.tsx')
  const confirmationSource = readSource('app', 'confirmation', 'page.tsx')
  const manualPaymentRouteSource = readSource('app', 'api', 'payments', 'manual', 'route.ts')
  const callPageSource = readSource('app', 'call', '[id]', 'page.tsx')

  assert.match(paymentPageSource, /customerEmailAvailable/)
  assert.match(paymentActionsSource, /customerEmailAvailable/)
  assert.match(confirmationSource, /customerEmailAvailable/)
  assert.match(paymentActionsSource, /zachowaj ten link/i)
  assert.match(paymentPageSource, /pokażemy link do pokoju bezpośrednio na stronie potwierdzenia/i)
  assert.match(confirmationSource, /pokażemy aktywny link do rozmowy bezpośrednio na tej stronie/i)
  assert.match(manualPaymentRouteSource, /adminNotice/)
  assert.match(confirmationSource, /adminNotice/)
  assert.match(confirmationSource, /automatyczne powiadomienie obsługi/i)
  assert.match(confirmationSource, /onlineSyncWarning/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] stripe return finalize failed/)
  assert.match(confirmationSource, /\[behawior15\]\[confirmation\] payu return sync failed/)
  assert.match(callPageSource, /flowError/)
  assert.match(callPageSource, /\[behawior15\]\[call\] failed to load booking/)
  assert.match(callPageSource, /Nie udalo sie wczytac pokoju rozmowy|Nie udało się wczytać pokoju rozmowy/)
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
    assert.match(manual.summary, /BLIK na telefon jest dostępny/i)
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

  assert.ok(homeRule)
  assert.ok(bookRule)

  assert.equal(homeRule?.required?.includes('Szybki wybór'), true)
  assert.equal(homeRule?.required?.includes('Wybierz start'), true)
  assert.equal(homeRule?.forbidden?.includes('Udostępnij znajomemu'), true)
  assert.deepEqual(homeRule?.ordered, [
    'Regulski | Terapia behawioralna',
    'Masz problem z psem lub kotem? Wybierz pierwszy krok.',
    'Wybierz start',
    'Piszesz do mnie',
  ])

  assert.equal(bookRule?.required?.includes('Wybierz temat na 15 min'), true)
  assert.equal(
    bookRule?.required?.includes('Od 59 zł. Dokładną kwotę potwierdzisz po wyborze tematu konsultacji.'),
    true,
  )
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

test('contact page keeps the specialist trust visual next to the action shortcuts', () => {
  const markup = renderToStaticMarkup(createElement(ContactPage, { searchParams: {} }))

  assert.match(markup, /Kto odpowiada/)
  assert.match(markup, /Piszesz do mnie/)
  assert.match(markup, />Wybierz<\/h2>/)
  assert.match(markup, /specialist-krzysztof-wide\.jpg/)
})
