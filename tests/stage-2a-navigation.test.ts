import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

function readSource(...segments: string[]) {
  return readFileSync(path.join(process.cwd(), ...segments), 'utf8')
}

test('stage 2a centralizes public top navigation and keeps booking flow on a shared special profile', () => {
  const notatnikSource = readSource('components', 'NotatnikA.tsx')
  const homeSource = readSource('app', 'page.tsx')
  const blogSource = readSource('app', 'blog', 'page.tsx')
  const contactSource = readSource('app', 'kontakt', 'page.tsx')
  const bookingSource = readSource('app', 'book', 'page.tsx')
  const essentialsSource = readSource('app', 'niezbednik', 'page.tsx')
  const slotSource = readSource('app', 'slot', 'page.tsx')
  const formSource = readSource('app', 'form', 'page.tsx')

  assert.match(notatnikSource, /export const PUBLIC_SITE_NAV_ITEMS/)
  assert.match(notatnikSource, /href: '\/blog', label: 'Blog'/)
  assert.match(notatnikSource, /export const PUBLIC_BOOKING_FLOW_NAV_ITEMS/)
  assert.match(notatnikSource, /href: '\/cennik', label: 'Cennik'/)

  assert.match(homeSource, /navItems=\{PUBLIC_SITE_NAV_ITEMS\}/)
  assert.match(blogSource, /navItems=\{PUBLIC_SITE_NAV_ITEMS\}/)
  assert.match(contactSource, /navItems=\{PUBLIC_SITE_NAV_ITEMS\}/)
  assert.match(bookingSource, /navItems=\{PUBLIC_SITE_NAV_ITEMS\}/)
  assert.match(essentialsSource, /navItems=\{PUBLIC_SITE_NAV_ITEMS\}/)

  assert.match(slotSource, /navItems=\{PUBLIC_BOOKING_FLOW_NAV_ITEMS\}/)
  assert.match(formSource, /navItems=\{PUBLIC_BOOKING_FLOW_NAV_ITEMS\}/)

  assert.doesNotMatch(homeSource, /const navItems = \[/)
  assert.doesNotMatch(contactSource, /const navItems = \[/)
  assert.doesNotMatch(bookingSource, /const navItems = \[/)
  assert.doesNotMatch(essentialsSource, /const navItems = \[/)
})
