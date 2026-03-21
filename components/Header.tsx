import Link from 'next/link'

export function Header() {
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
      <nav className="nav-actions header-nav">
        <Link href="/problem" className="button button-primary">
          Sprawdz terminy
        </Link>
      </nav>
    </header>
  )
}
