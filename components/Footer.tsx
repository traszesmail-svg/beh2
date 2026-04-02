import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import {
  CAPBT_PROFILE_URL,
  COAPE_LOGO,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'

export function Footer() {
  const contact = getPublicContactDetails()
  const buildMarker = getBuildMarkerSnapshot()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Terapia behawioralna',
        'Dzień dobry,\n\nopisuję krótko swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- od czego chcę zacząć:\n',
      )
    : null

  return (
    <footer className="site-footer" id="kontakt">
      <div className="site-footer-grid">
        <div className="footer-card">
          <div className="section-eyebrow">Marka i kontakt</div>
          <h2 className="footer-title">{SITE_NAME}</h2>
          <p className="muted footer-copy">
            {SITE_TAGLINE}. {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
          </p>
        </div>

        <div className="footer-card">
          <div className="footer-label">Kontakt</div>
          <div className="footer-links contact-links">
            {contact.email && mailtoHref ? (
              <a href={mailtoHref} className="contact-item">
                <span className="contact-label">E-mail</span>
                <span>{contact.email}</span>
              </a>
            ) : null}

            <Link href="/kontakt" prefetch={false} className="contact-item">
              <span className="contact-label">Kontakt</span>
              <span>Napisz wiadomość</span>
            </Link>
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-label">Skróty</div>
          <div className="footer-links">
            <Link href="/oferta" prefetch={false}>
              Oferta
            </Link>
            <Link href="/koty" prefetch={false}>
              Terapia kotów
            </Link>
            <Link href="/oferta/pobyty-socjalizacyjno-terapeutyczne" prefetch={false}>
              Pobyty
            </Link>
            <Link href="/book" prefetch={false} data-analytics-event="cta_click" data-analytics-location="footer">
              Umów 15 min
            </Link>
            <Link href="/polityka-prywatnosci" prefetch={false}>
              Polityka prywatności
            </Link>
            <Link href="/regulamin" prefetch={false}>
              Regulamin
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-certification">
        <div className="footer-certification-copy">
          <span className="footer-label">Zaufanie</span>
          <span>
            COAPE / CAPBT.{' '}
            <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="inline-link">
              Zobacz publiczny profil specjalisty w CAPBT
            </a>
          </span>
        </div>
        <Image
          src={COAPE_LOGO.src}
          alt={COAPE_LOGO.alt}
          width={442}
          height={104}
          className="footer-certification-logo"
        />
      </div>

      <div data-build-marker={buildMarker.value} hidden aria-hidden="true" />
    </footer>
  )
}
