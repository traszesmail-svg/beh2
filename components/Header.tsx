import Link from 'next/link'

export function Header() {
  const navItems = [
    { href: '/#oferta', label: 'Oferta' },
    { href: '/#specjalista', label: 'Specjalista' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#kontakt', label: 'Kontakt' },
  ]

  return (
    <header className="header-shell">
      <div className="header-branding">
        <Link href="/" className="brand-link">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <div className="eyebrow">Konsultacja audio dla opiekunów zwierząt</div>
            <div className="brand">Behawior 15</div>
          </div>
        </Link>
        <div className="header-subtitle">Szybka pomoc behawioralna dla opiekunów psów i kotów</div>
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
          Zarezerwuj konsultację
        </Link>
      </nav>
    </header>
  )
}
