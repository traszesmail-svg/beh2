import Link from 'next/link'

export function Header() {
  const trustItems = [
    'Zweryfikowany behawiorysta COAPE / CAPBT',
    '15-minutowa konsultacja głosowa',
    'Bezpieczna płatność i szybkie potwierdzenie',
  ]

  const navItems = [
    { href: '/#oferta', label: 'Oferta' },
    { href: '/#specjalista', label: 'Specjalista' },
    { href: '/#przypadki', label: 'Przypadki' },
    { href: '/#publikacje', label: 'Publikacje' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#kontakt', label: 'Kontakt' },
  ]

  return (
    <header className="header-shell">
      <div className="header-trust-strip" aria-label="Zaufanie i bezpieczeństwo">
        {trustItems.map((item) => (
          <span key={item} className="header-trust-item">
            <span className="header-trust-dot" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>

      <div className="header-main">
        <div className="header-branding">
          <Link href="/" className="brand-link">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <div className="eyebrow">15-minutowa konsultacja głosowa dla opiekunów psów i kotów</div>
              <div className="brand">Behawior 15</div>
            </div>
          </Link>
          <div className="header-subtitle">Szybka pomoc behawioralna bez chaosu, zgadywania i martwych kroków.</div>
        </div>

        <nav className="header-nav" aria-label="Główna nawigacja">
          <div className="header-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="header-link">
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/problem" className="button button-primary header-cta">
            Zarezerwuj 15 minut i odzyskaj spokój w domu
          </Link>
        </nav>
      </div>
    </header>
  )
}
