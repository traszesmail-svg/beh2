import { FACEBOOK_PROFILE_URL } from '@/lib/site'

export function SocialSection() {
  return (
    <section className="panel section-panel social-section" aria-labelledby="social-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Social media</div>
          <h2 id="social-heading">Sprawdź profil i podeślij stronę osobie, która też potrzebuje spokojnego wsparcia</h2>
        </div>
        <div className="muted">Pokazujemy tylko aktywne kanały, które są gotowe do publicznego ruchu.</div>
      </div>

      <div className="social-grid top-gap">
        <a
          href={FACEBOOK_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-card social-card-link"
          aria-label="Otwórz profil Krzysztofa Regulskiego na Facebooku"
        >
          <span className="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="social-svg">
              <path
                d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.6-1.6H16V4.8c-.3 0-.9-.1-1.8-.1-2.4 0-3.8 1.4-3.8 4V11H8v3h2.4v7h3.1Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <strong>Facebook</strong>
          <span>Aktualny, publiczny profil do sprawdzenia specjalisty i spokojnego udostępnienia strony dalej.</span>
        </a>
      </div>
    </section>
  )
}
