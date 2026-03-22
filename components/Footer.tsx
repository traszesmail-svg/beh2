import Link from 'next/link'
import { getContactDetails, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

export function Footer() {
  const contact = getContactDetails()

  return (
    <footer className="site-footer" id="kontakt">
      <div className="site-footer-grid">
        <div className="footer-card">
          <div className="section-eyebrow">Behawior 15</div>
          <h2 className="footer-title">Spokojny pierwszy krok przy problemie behawioralnym.</h2>
          <p className="muted footer-copy">
            {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacja audio online dla opiekunow psow i kotow.
          </p>
        </div>

        <div className="footer-card">
          <div className="footer-label">Kontakt</div>
          <div className="footer-links">
            {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <span>Adres e-mail ustawisz przez env.</span>}
            {contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a> : null}
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-label">Wazne linki</div>
          <div className="footer-links">
            <Link href="/problem">Umow konsultacje</Link>
            <Link href="/polityka-prywatnosci">Polityka prywatnosci</Link>
            <Link href="/regulamin">Regulamin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
