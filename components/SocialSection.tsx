export function SocialSection() {
  return (
    <section className="panel section-panel social-section" aria-labelledby="social-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Social media</div>
          <h2 id="social-heading">Sprawdź profil i podeślij stronę osobie, która też potrzebuje spokojnego wsparcia</h2>
        </div>
        <div className="muted">
          Publikujemy tylko kanały, które są już gotowe do pokazania. Kolejne profile dołączymy po uruchomieniu oficjalnych kont.
        </div>
      </div>

      <div className="social-grid top-gap">
        <a
          href="https://www.facebook.com/krzysztof.regulski.148/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-card social-card-link"
          aria-label="Otwórz profil Krzysztofa Regulskiego na Facebooku"
        >
          <span className="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="social-svg">
              <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.6-1.6H16V4.8c-.3 0-.9-.1-1.8-.1-2.4 0-3.8 1.4-3.8 4V11H8v3h2.4v7h3.1Z" fill="currentColor" />
            </svg>
          </span>
          <strong>Facebook</strong>
          <span>Aktualny, publiczny profil do sprawdzenia specjalisty i udostępnienia strony dalej.</span>
        </a>

        {/* TODO: podłącz oficjalny link po uruchomieniu prawdziwego konta Instagram. */}
        <div className="social-card">
          <span className="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="social-svg">
              <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="16.8" cy="7.4" r="1.1" fill="currentColor" />
            </svg>
          </span>
          <strong>Instagram</strong>
          <span>Profil do dodania po publikacji oficjalnego konta. Na razie nie pokazujemy niezweryfikowanego linku.</span>
        </div>

        {/* TODO: podłącz oficjalny link po uruchomieniu prawdziwego konta TikTok. */}
        <div className="social-card">
          <span className="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="social-svg">
              <path d="M14.8 5.7c.7.6 1.2 1 2.1 1.2v2.5c-1.2-.1-2.2-.5-3.2-1.2v4.6c0 2.5-1.8 4.4-4.4 4.4A4.4 4.4 0 0 1 7.8 8.7v2.8a1.9 1.9 0 1 0 2 1.9V4.8h2.7c0 .4.1.7.3.9.3.1.6.4 2 .9Z" fill="currentColor" />
            </svg>
          </span>
          <strong>TikTok</strong>
          <span>Miejsce pod przyszły kanał edukacyjny. Dodamy link dopiero wtedy, gdy profil będzie gotowy do publicznego ruchu.</span>
        </div>
      </div>
    </section>
  )
}
