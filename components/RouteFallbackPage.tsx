import React from 'react'

type RouteFallbackAction = {
  href: string
  label: string
  primary?: boolean
}

type RouteFallbackPageProps = {
  code: string
  eyebrow: string
  title: string
  description: string
  highlights: [string, string]
  actions: RouteFallbackAction[]
  footerCtaHref?: string
  footerCtaLabel?: string
  footerHeadline?: string
  footerDescription?: string
}

export function RouteFallbackPage({
  code,
  eyebrow,
  title,
  description,
  highlights,
  actions,
  footerCtaHref = '/kontakt',
  footerCtaLabel = 'Napisz wiadomość',
  footerHeadline = 'Potrzebujesz pomocy z tym adresem?',
  footerDescription = 'Wróć do bezpiecznej ścieżki albo napisz, a wskażę najkrótszą drogę.',
}: RouteFallbackPageProps) {
  return (
    <main className="page-wrap">
      <div className="container">
        <section className="panel section-panel hero-surface">
          <div className="header-trust-strip" aria-label="Regulski">
            <span className="header-trust-item">Regulski</span>
            <span className="header-trust-item">{eyebrow}</span>
            <span className="header-trust-item">Spokojny start</span>
            <span className="header-trust-item">Bez zgadywania</span>
          </div>

          <div className="top-gap-small">
            <span className="offer-price">{code}</span>
          </div>

          <h1>{title}</h1>
          <p className="hero-text">{description}</p>

          <div className="offer-detail-highlight-row top-gap">
            <div className="list-card tree-backed-card">
              <strong>{highlights[0]}</strong>
              <span>{highlights[1]}</span>
            </div>

            <div className="list-card tree-backed-card">
              <strong>Najbezpieczniej teraz</strong>
              <span>Wróć do głównej ścieżki albo napisz wiadomość, jeśli chcesz, żebym wskazał kolejny krok.</span>
            </div>
          </div>

          <div className="hero-actions top-gap">
            {actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`button big-button${action.primary ? ' button-primary' : ' button-ghost'}`}
              >
                {action.label}
              </a>
            ))}
          </div>

          <div className="list-card tree-backed-card top-gap">
            <strong>{footerHeadline}</strong>
            <span>{footerDescription}</span>
            <span className="top-gap-small" style={{ display: 'block' }}>
              <a href={footerCtaHref} className="inline-link">
                {footerCtaLabel}
              </a>
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}
