import Link from 'next/link'

export function Header() {
  const trustItems = [
    'Zweryfikowany behawiorysta COAPE/CAPBT',
    'Bezpieczna płatność',
    'Zwrot zgodnie z regulaminem',
  ]

  const navItems = [
    { href: '/#oferta', label: 'Oferta' },
    { href: '/#jak-to-dziala', label: 'Jak to działa' },
    { href: '/#specjalista', label: 'Specjalista' },
    { href: '/#przypadki', label: 'Realne sprawy' },
    { href: '/#publikacje', label: 'Publikacje' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#kontakt', label: 'Kontakt' },
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
            <div className="header-subtitle">
              Spokojna, konkretna konsultacja dla opiekunów psów i kotów.
            </div>
          </div>

          <nav className="header-nav" aria-label="Główna nawigacja">
            <div className="header-links">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="header-link">
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="/book" className="button button-primary header-cta" data-analytics-event="reserve_click" data-analytics-location="header">
              Zarezerwuj 15 minut i odzyskaj spokój w domu
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
