import React from 'react'
import Link from 'next/link'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import {
  CAPBT_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'

type FooterProps = {
  variant?: 'landing' | 'lean' | 'full'
  ctaHref?: string
  ctaLabel?: string
  headline?: string
  description?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function Footer({
  variant = 'lean',
  ctaHref = '/kontakt',
  ctaLabel = 'Napisz wiadomość',
  headline = 'Potrzebujesz pomocy z tym etapem?',
  description = 'Jeśli temat jest mieszany albo trzeba doprecyzować kolejny ruch, napisz wiadomość.',
  secondaryHref,
  secondaryLabel,
}: FooterProps) {
  const contact = getPublicContactDetails()
  const buildMarker = getBuildMarkerSnapshot()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Terapia behawioralna',
        'Dzień dobry,\n\nopisuję krótko swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- od czego chcę zacząć:\n',
      )
    : null
  const effectiveSecondaryHref = secondaryHref ?? (mailtoHref ? mailtoHref : '/kontakt')
  const effectiveSecondaryLabel = secondaryLabel ?? (mailtoHref ? 'Napisz wiadomość' : 'Kontakt')

  if (variant === 'landing') {
    return (
      <footer className="site-footer site-footer-landing" id="kontakt">
        <div className="site-footer-landing-grid">
          <div className="site-footer-landing-copy">
            <div className="footer-label">Start i kontakt</div>
            <h2 className="footer-landing-title">{headline}</h2>
            <p className="footer-landing-text">{description}</p>
            <div className="footer-landing-pills" aria-label="Zaufanie i zakres">
              <span className="hero-proof-pill">Prowadzę osobiście</span>
              <span className="hero-proof-pill">Olsztyn / online</span>
              <span className="hero-proof-pill">COAPE / CAPBT</span>
            </div>
          </div>

          <div className="site-footer-landing-actions">
            <Link
              href={ctaHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="cta_click"
              data-analytics-location="footer"
            >
              {ctaLabel}
            </Link>

            {effectiveSecondaryHref.startsWith('mailto:') ? (
              <a href={effectiveSecondaryHref} className="button button-ghost big-button">
                {effectiveSecondaryLabel}
              </a>
            ) : (
              <Link href={effectiveSecondaryHref} prefetch={false} className="button button-ghost big-button">
                {effectiveSecondaryLabel}
              </Link>
            )}

            <div className="footer-landing-note tree-backed-card">
              <strong>{SITE_NAME}</strong>
              <span>
                {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
              </span>
            </div>
          </div>
        </div>

        <div className="site-footer-landing-meta">
          <div className="footer-simple-legal">
            <Link href="/polityka-prywatnosci" prefetch={false}>
              Polityka prywatności
            </Link>
            <span>•</span>
            <Link href="/regulamin" prefetch={false}>
              Regulamin
            </Link>
          </div>

          <div className="footer-simple-links" aria-label="Profile publiczne">
            <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
              Publiczny profil CAPBT
            </a>
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
              Instagram @coapebehawiorysta
            </a>
          </div>
        </div>

        <div data-build-marker={buildMarker.value} hidden aria-hidden="true" />
      </footer>
    )
  }

  if (variant === 'lean') {
    return (
      <footer className="site-footer site-footer-lean site-footer-funnel" id="kontakt">
        <div className="site-footer-funnel-grid">
          <div className="site-footer-funnel-copy">
            <div className="footer-label">Dalszy krok</div>
            <h2 className="footer-funnel-title">{headline}</h2>
            <p className="footer-funnel-text">{description}</p>
          </div>

          <div className="site-footer-funnel-actions">
            <Link
              href={ctaHref}
              prefetch={false}
              className="button button-primary footer-funnel-primary"
              data-analytics-event="cta_click"
              data-analytics-location="footer"
            >
              {ctaLabel}
            </Link>

            {effectiveSecondaryHref.startsWith('mailto:') ? (
              <a href={effectiveSecondaryHref} className="button button-ghost footer-funnel-secondary">
                {effectiveSecondaryLabel}
              </a>
            ) : (
              <Link href={effectiveSecondaryHref} prefetch={false} className="button button-ghost footer-funnel-secondary">
                {effectiveSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="site-footer-funnel-meta">
          <div className="footer-funnel-trust">
            COAPE / CAPBT. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Prowadzę osobiście.{' '}
            <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
              Publiczny profil CAPBT
            </a>{' '}
            <span aria-hidden="true">•</span>{' '}
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
              Instagram @coapebehawiorysta
            </a>
          </div>

          <div className="footer-funnel-legal">
            <Link href="/polityka-prywatnosci" prefetch={false}>
              Polityka prywatności
            </Link>
            <span>•</span>
            <Link href="/regulamin" prefetch={false}>
              Regulamin
            </Link>
          </div>
        </div>

        <div data-build-marker={buildMarker.value} hidden aria-hidden="true" />
      </footer>
    )
  }

  return (
    <footer className="site-footer site-footer-full" id="kontakt">
      <div className="site-footer-simple-grid">
        <div className="footer-simple-brand">
          <div className="section-eyebrow">Regulski</div>
          <h2 className="footer-title">{SITE_NAME}</h2>
          <p className="muted footer-copy">
            {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
          </p>
        </div>

        <div className="footer-simple-meta">
          <div className="footer-simple-links">
            <Link
              href={ctaHref}
              prefetch={false}
              className="footer-simple-link footer-simple-link-primary"
              data-analytics-event="cta_click"
              data-analytics-location="footer"
            >
              {ctaLabel}
            </Link>
            <Link href="/oferta" prefetch={false} className="footer-simple-link">
              Oferta
            </Link>
            {contact.email && mailtoHref ? (
              <a href={mailtoHref} className="footer-simple-link">
                {contact.email}
              </a>
            ) : (
              <Link href="/kontakt" prefetch={false} className="footer-simple-link">
                Przejdź do kontaktu
              </Link>
            )}
          </div>

          <div className="footer-simple-bottom">
            <div className="footer-simple-legal">
              <Link href="/polityka-prywatnosci" prefetch={false}>
                Polityka prywatności
              </Link>
              <span>•</span>
              <Link href="/regulamin" prefetch={false}>
                Regulamin
              </Link>
            </div>

            <div className="footer-simple-trust">
              <span>COAPE / CAPBT. Prowadzę osobiście.</span>
            </div>

            <div className="footer-simple-links" aria-label="Profile publiczne">
              <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
                Publiczny profil CAPBT
              </a>
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="footer-simple-profile">
                Instagram @coapebehawiorysta
              </a>
            </div>
          </div>
        </div>
      </div>

      <div data-build-marker={buildMarker.value} hidden aria-hidden="true" />
    </footer>
  )
}
