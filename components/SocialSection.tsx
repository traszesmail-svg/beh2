import { CAPBT_PROFILE_URL } from '@/lib/site'

export function SocialSection() {
  return (
    <section className="panel section-panel social-section" aria-labelledby="social-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Profil specjalisty</div>
          <h2 id="social-heading">Sprawdź publiczny profil specjalisty i podeślij stronę osobie, która też potrzebuje spokojnego wsparcia</h2>
        </div>
        <div className="muted">Pokazujemy tylko aktywne, publiczne źródła, które realnie wzmacniają zaufanie.</div>
      </div>

      <div className="social-grid top-gap">
        <a
          href={CAPBT_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="social-card social-card-link"
          aria-label="Otwórz publiczny profil Krzysztofa Regulskiego w CAPBT"
        >
          <span className="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="social-svg">
              <path
                d="M12 2.5 4.5 5.2v6.2c0 4.9 3.1 9.4 7.5 10.9 4.4-1.5 7.5-6 7.5-10.9V5.2L12 2.5Zm0 2.1 5.3 1.9v4.9c0 3.8-2.3 7.2-5.3 8.5-3-1.3-5.3-4.7-5.3-8.5V6.5L12 4.6Zm-1 4v5.8l4.6-2.9L11 8.6Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <strong>CAPBT</strong>
          <span>Publiczny profil specjalisty do sprawdzenia profilu zawodowego i spokojnego przekazania strony dalej.</span>
        </a>
      </div>
    </section>
  )
}
