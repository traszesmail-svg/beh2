import React from 'react'
import Link from 'next/link'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import { getPublicContactDetails, SITE_SHORT_NAME, SPECIALIST_NAME } from '@/lib/site'

type FooterProps = {
  variant?: 'landing' | 'lean' | 'full' | 'home' | 'legal'
  ctaHref?: string
  ctaLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  sectionBasePath?: '/' | '/blog' | '/psy' | '/koty' | '/opinie' | '/o-mnie' | '/faq' | '/kontakt' | '/materialy' | '/niezbednik'
}

const FOOTER_NAV_ITEMS = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/niezbednik', label: 'Niezbednik' },
] as const

export function Footer(props: FooterProps) {
  const contact = getPublicContactDetails()
  const buildMarker = getBuildMarkerSnapshot()

  return (
    <footer className="site-footer" aria-label="Stopka" data-build-marker={buildMarker.value}>
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <div className="section-eyebrow">Regulski</div>
          <h3>{SITE_SHORT_NAME}</h3>
          <p>Spokojna pomoc w zrozumieniu problemow zachowania psow i kotow.</p>
        </div>

        <div className="site-footer-nav">
          <div className="section-eyebrow">Nawigacja</div>
          <div className="site-footer-links">
            {FOOTER_NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="site-footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="site-footer-contact">
          <div className="section-eyebrow">Kontakt</div>
          <div className="site-footer-links">
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="site-footer-link site-footer-link-primary">
                {contact.email}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-credit">
          <span>&copy; 2026 {SPECIALIST_NAME}</span>
        </div>

        <div className="site-footer-legal">
          <Link href="/polityka-prywatnosci" prefetch={false}>
            Polityka prywatności
          </Link>
          <span>&bull;</span>
          <Link href="/regulamin" prefetch={false}>
            Regulamin
          </Link>
          <span>&bull;</span>
          <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
            Regulamin Pełnej konsultacji
          </Link>
        </div>
      </div>
    </footer>
  )
}
