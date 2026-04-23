import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

function readSource(...segments: string[]) {
  return readFileSync(path.join(process.cwd(), ...segments), 'utf8')
}

test('stage 7 essentials page exposes the three concrete starter materials without placeholder copy', () => {
  const source = readSource('app', 'niezbednik', 'page.tsx')

  assert.match(source, /5 pierwszych krokow, gdy pies szczeka na spacerach/)
  assert.match(source, /Checklista kuweta - krok po kroku/)
  assert.match(source, /Jak przygotowac sie do konsultacji behawioralnej/)
  assert.match(source, /\/bezplatne-materialy\/\$\{item\.magnet\.slug\}/)
  assert.doesNotMatch(source, /Sekcja jest rozwijana etapami/i)
  assert.doesNotMatch(source, /To nie jest pelny sklep/i)
})

test('stage 8 pricing page adds trust, CTA support and FAQ for Kwadrans and payment', () => {
  const source = readSource('app', 'cennik', 'page.tsx')

  assert.match(source, /ctaSupportSnippets/)
  assert.match(source, /trustSnippets/)
  assert.match(source, /pricingFaqItems/)
  assert.match(source, /Czym jest Kwadrans z behawiorysta\?/)
  assert.match(source, /Jak wyglada platnosc\?/)
  assert.match(source, /Najczestsze pytania o Kwadrans i platnosc\./)
})

test('stage 9 about page stays trust-first instead of turning into a problems or pricing page', () => {
  const source = readSource('app', 'o-mnie', 'page.tsx')

  assert.match(source, /const consultationHref = buildBookHref\(null, 'konsultacja-behawioralna-online'\)/)
  assert.match(source, /Jak wyglada konsultacja/)
  assert.match(source, /Ta strona ma pomoc Ci ocenic osobe, nie wybierac pakiet\./)
  assert.match(source, /const expectationCards = \[/)
  assert.doesNotMatch(source, /const problemCards = \[/)
  assert.doesNotMatch(source, /Problemy psa na spacerach/)
  assert.doesNotMatch(source, /Trudne zachowania psa w domu/)
})

test('stage 10 dogs and consultation pages use clearer conversion copy and preparation checklist', () => {
  const dogsSource = readSource('app', 'psy', 'page.tsx')
  const consultationSource = readSource('app', 'konsultacja-behawioralna-online', 'page.tsx')

  assert.match(dogsSource, /Twoj pies zachowuje sie w sposob, <em>ktory Cie niepokoi<\/em>\./)
  assert.match(dogsSource, /Nie musisz wiedziec, jak to nazwac\. Wystarczy, ze opiszesz, co sie dzieje\./)
  assert.match(dogsSource, /Problemy psie - lista\./)
  assert.match(dogsSource, /Rozpoznajesz swoj problem\? Zarezerwuj Kwadrans/)
  assert.match(dogsSource, /Niezbednik dla opiekuna psa/)
  assert.match(consultationSource, /const consultationFaqItems = FAQ_SHORTLISTS\.consultation\.slice\(0, 5\)/)
  assert.match(consultationSource, /Co przygotowac przed konsultacja/)
  assert.match(consultationSource, /Opis sytuacji/)
  assert.match(consultationSource, /Codzienny rytm/)
  assert.match(consultationSource, /Dotychczasowe proby/)
  assert.match(consultationSource, /Nagranie lub notatki/)
})

test('stage 10 cats and local online pages keep the same simplified conversion structure', () => {
  const catsSource = readSource('app', 'koty', 'page.tsx')
  const localSeoSource = readSource('app', 'behawiorysta-online-polska', 'page.tsx')

  assert.match(catsSource, /Twoj kot zachowuje sie w sposob, <em>ktory Cie niepokoi<\/em>\./)
  assert.match(catsSource, /Nie oceniam\. Szukam przyczyny, nie winy\./)
  assert.match(catsSource, /Problemy kocie - lista\./)
  assert.match(catsSource, /Rozpoznajesz swoj problem\? Zarezerwuj Kwadrans/)
  assert.match(catsSource, /Niezbednik dla opiekuna kota/)
  assert.match(localSeoSource, /pageData\.intro\.slice\(0, 2\)/)
  assert.match(localSeoSource, /pageData\.supportBody\.slice\(1, 3\)/)
  assert.match(localSeoSource, /Przejdz do kontaktu/)
})
