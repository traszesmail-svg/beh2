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
            <div className="eyebrow">Konsultacja audio dla opiekunow zwierzat</div>
            <div className="brand">Behawior 15</div>
          </div>
        </Link>
        <div className="header-subtitle">Szybka pomoc behawioralna dla opiekunow psow i kotow</div>
      </div>

      <nav className="header-nav" aria-label="Glowna nawigacja">
        <div className="header-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="header-link">
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/problem" className="button button-primary header-cta">
          Umow konsultacje
        </Link>
      </nav>
    </header>
  )
}
