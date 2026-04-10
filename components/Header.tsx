import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COAPE_LOGO, SITE_NAME } from '@/lib/site'

type HeaderProps = {
  compactHome?: boolean
}

export function Header({ compactHome = false }: HeaderProps) {
  const headerLinks = [
    {
      href: '/oferta',
      label: 'Oferta',
    },
    {
      href: '/oferta/poradniki-pdf',
      label: 'PDF',
    },
  ]

  return (
    <>
      <header className={`header-shell${compactHome ? ' header-shell-home-compact' : ''}`}>
        <div className="header-main">
          <div className="header-branding">
            <Link href="/" prefetch={false} className="brand-link" aria-label={SITE_NAME}>
              <span className="brand-emblem-row" aria-hidden="true">
                <span className="brand-mark brand-mark-sigil">
                  <svg className="brand-sigil-svg" viewBox="0 0 72 72" role="presentation" focusable="false">
                    <path
                      d="M24 20h14.2c7.8 0 12.8 4.1 12.8 10.3 0 4.4-2.3 7.5-6.2 8.9L53 52H42.8l-7.4-11.2H32V52h-8V20zm8 7v8h5.8c3.8 0 5.8-1.5 5.8-4s-2-4-5.8-4H32z"
                      className="brand-sigil-r"
                    />
                    <path
                      d="M18 29c2.4-5.8 7.4-8.9 11.6-8.9 4.4 0 8 2 10.4 5.7 2.5-3.7 6-5.7 10.3-5.7 4.2 0 9.2 3.1 11.6 8.9"
                      className="brand-sigil-animal brand-sigil-top"
                    />
                    <path
                      d="M24 50c4.4-6.1 9.2-9.2 12-9.2s7.6 3.1 12 9.2"
                      className="brand-sigil-animal brand-sigil-bottom"
                    />
                    <circle cx="26" cy="26" r="2.2" className="brand-sigil-dog" />
                    <circle cx="46" cy="25.5" r="2.2" className="brand-sigil-cat" />
                  </svg>
                </span>
                <span className="brand-mark brand-mark-coape">
                  <Image
                    src={COAPE_LOGO.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="brand-mark-image brand-mark-coape-image"
                  />
                </span>
              </span>
            </Link>
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




