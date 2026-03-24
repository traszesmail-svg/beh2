import React from 'react'
import Link from 'next/link'

export function Header() {
  const trustItems = [
    'Behawiorysta COAPE / CAPBT',
    'Technik weterynarii',
    'Dogoterapeuta',
    'Dietetyk',
    'Bezpieczna płatność',
    '1 minuta na anulację',
  ]

  return (
    <>
      <div className="header-trust-strip" aria-label="Zaufanie i bezpieczeństwo">
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
                <div className="eyebrow">15-minutowa konsultacja audio dla psa lub kota</div>
                <div className="brand">Behawior 15</div>
              </div>
            </Link>
            <div className="header-subtitle">Spokojna, konkretna pomoc dla opiekunów psów i kotów.</div>
          </div>

          <div className="header-nav">
            <Link
              href="/book"
              className="button button-primary header-cta"
              data-analytics-event="reserve_click"
              data-analytics-location="header"
            >
              Zarezerwuj konsultację
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
