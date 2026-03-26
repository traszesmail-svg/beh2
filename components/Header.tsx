import React from 'react'
import Link from 'next/link'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export function Header() {
  const trustItems = [
    'Psy i koty',
    'COAPE / CAPBT',
    'Spokojny pierwszy krok',
    'Dalsza ścieżka pracy, jeśli potrzeba',
  ]

  const headerLinks = [
    {
      href: '/oferta',
      label: 'Oferta',
    },
    {
      href: '/koty',
      label: 'Koty',
    },
    {
      href: '/oferta/pobyty-socjalizacyjno-terapeutyczne',
      label: 'Pobyty',
    },
    {
      href: '/kontakt',
      label: 'Kontakt',
    },
  ]

  return (
    <>
      <div className="header-trust-strip" aria-label="Zakres i wiarygodność marki">
        {trustItems.map((item) => (
          <span key={item} className="header-trust-item">
            {item}
          </span>
        ))}
      </div>

      <header className="header-shell">
        <div className="header-main">
          <div className="header-branding">
            <Link href="/" className="brand-link">
              <span className="brand-mark" aria-hidden="true" />
              <div>
                <div className="eyebrow">{SITE_TAGLINE}</div>
                <div className="brand">{SITE_NAME}</div>
              </div>
            </Link>
            <div className="header-subtitle">
              Forma kontaktu ma ułatwiać otrzymanie pomocy, a nie ją spłycać.
            </div>
          </div>

          <div className="header-nav">
            <nav className="header-links" aria-label="Główna nawigacja">
              {headerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="header-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/book"
              className="button button-primary header-cta"
              data-analytics-event="reserve_click"
              data-analytics-location="header"
            >
              Umów konsultację
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
