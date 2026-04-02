import React from 'react'
import Link from 'next/link'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

type HeaderProps = {
  compactHome?: boolean
}

export function Header({ compactHome = false }: HeaderProps) {
  const trustItems = ['Psy i koty', 'COAPE / CAPBT', 'Spokojny start', 'Bez zgadywania']

  const headerLinks = [
    {
      href: '/oferta',
      label: 'Oferta',
    },
    {
      href: '/kontakt',
      label: 'Kontakt',
    },
  ]

  return (
    <>
      <div
        className={`header-trust-strip${compactHome ? ' header-trust-strip-home-compact' : ''}`}
        aria-label="Wiarygodność marki"
      >
        {trustItems.map((item) => (
          <span key={item} className="header-trust-item">
            {item}
          </span>
        ))}
      </div>

      <header className={`header-shell${compactHome ? ' header-shell-home-compact' : ''}`}>
        <div className="header-main">
          <div className="header-branding">
            <Link href="/" prefetch={false} className="brand-link">
              <span className="brand-mark" aria-hidden="true" />
              <div>
                <div className="brand">{SITE_NAME}</div>
              </div>
            </Link>
            <div className="header-subtitle">{SITE_TAGLINE}</div>
          </div>

          <div className={`header-nav${compactHome ? ' header-nav-home-compact' : ''}`}>
            <nav className="header-links" aria-label="Główna nawigacja">
              {headerLinks.map((link) => (
                <Link key={link.href} href={link.href} prefetch={false} className="header-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/book"
              prefetch={false}
              className={`button button-primary header-cta${compactHome ? ' header-cta-home-compact' : ''}`}
              data-analytics-event="cta_click"
              data-analytics-location="header"
            >
              Umów 15 min
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
