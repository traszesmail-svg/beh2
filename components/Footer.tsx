import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import {
  COAPE_LOGO,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  getContactDetails,
} from '@/lib/site'

export function Footer() {
  const contact = getContactDetails()
  const buildMarker = getBuildMarkerSnapshot()

  return (
    <footer className="site-footer" id="kontakt">
      <div className="site-footer-grid">
        <div className="footer-card">
          <div className="section-eyebrow">Behawior 15</div>
          <h2 className="footer-title">Spokojny pierwszy krok przy problemie behawioralnym.</h2>
          <p className="muted footer-copy">
            {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacja audio online dla opiekunów psów i kotów.
          </p>
        </div>

        <div className="footer-card">
          <div className="footer-label">Kontakt i wsparcie</div>
          <div className="footer-links contact-links">
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="contact-item">
                <span className="contact-label">E-mail</span>
                <span>{contact.email}</span>
              </a>
            ) : null}

            {contact.phoneDisplay && contact.phoneHref ? (
              <a href={`tel:${contact.phoneHref}`} className="contact-item">
                <span className="contact-label">Telefon</span>
                <span>{contact.phoneDisplay}</span>
              </a>
            ) : null}

            <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-label">Facebook</span>
              <span>Publiczny profil Krzysztofa Regulskiego</span>
            </a>
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-label">Ważne linki</div>
          <div className="footer-links">
            <Link href="/book" data-analytics-event="reserve_click" data-analytics-location="footer">
              Zarezerwuj konsultację
            </Link>
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link href="/regulamin">Regulamin</Link>
          </div>
        </div>
      </div>
      <div className="footer-certification">
        <div className="footer-certification-copy">
          <span className="footer-label">Certyfikacja</span>
          <span>Zweryfikowany behawiorysta COAPE / CAPBT</span>
        </div>
        <Image
          src={COAPE_LOGO.src}
          alt={COAPE_LOGO.alt}
          width={442}
          height={104}
          className="footer-certification-logo"
        />
      </div>
      <div className="footer-runtime" data-build-marker={buildMarker.value}>
        <span className="footer-runtime-label">Wersja serwisu</span>
        <span className="footer-runtime-value">
          {buildMarker.branch} / {buildMarker.commit}
        </span>
      </div>
    </footer>
  )
}
