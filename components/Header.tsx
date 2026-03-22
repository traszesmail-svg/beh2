import Link from 'next/link'

export function Header() {
  const trustItems = [
    '✅ Zweryfikowany behawiorysta COAPE/CAPBT',
    'Bezpieczna płatność',
    'Zwrot pieniędzy',
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
            {item}
          </span>
        ))}
      </div>

      <div className="header-main">
        <div className="header-branding">
          <Link href="/" className="brand-link">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <div className="eyebrow">15-minutowa konsultacja audio dla psa lub kota</div>
              <div className="brand">Behawior 15</div>
            </div>
          </Link>
          <div className="header-subtitle">Szybka pomoc behawioralna bez chaosu i zgadywania.</div>
        </div>

        <nav className="header-nav" aria-label="Główna nawigacja">
          <div className="header-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="header-link">
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/book" className="button button-primary header-cta">
            Zarezerwuj 15 minut
          </Link>
        </nav>
      </div>
    </header>
  )
}
