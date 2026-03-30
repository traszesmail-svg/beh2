import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {
  CAT_CONTENT_ROADMAP,
  CAT_SUPPORT_AREAS,
  HOME_FAQ,
  HOME_HELP_AREAS,
  HOME_PROCESS_STEPS,
  getOfferDetailCtaLabel,
  getOfferDetailHref,
  OFFERS,
  TRUST_SIGNAL_ITEMS,
} from '@/lib/offers'
import { buildHomeMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getBaseUrl, getDataModeStatus } from '@/lib/server/env'
import {
  CAPBT_LOGO,
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  CAT_HOME_PHOTO,
  COAPE_LOGO,
  COAPE_ORG_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_TRUST_STATEMENT,
  SUPPORTING_SPECIALIST_PHOTO,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const heroSummary = [
  'Pomagam psom i kotom w trudnościach związanych z zachowaniem: od pierwszej rozmowy po terapię i pobyty.',
  'Jeśli potrzeba więcej, od razu wskazuję kolejny krok.',
] as const

const heroSignals = ['psy i koty', 'niski próg wejścia', 'dalszy plan pracy', 'spokojna, ekspercka pomoc'] as const

const dogIssues = [
  'reaktywność i trudne spacery',
  'zostawanie samemu, szczekanie i wycie',
  'szczenięce gryzienie i trudność w wyciszeniu',
  'pobudzenie, pogoń i zachowania obronne',
] as const

const catIssues = ['problemy kuwetowe', 'stres, wycofanie i napięcie', 'konflikty między kotami', 'trudności przy dotyku i pielęgnacji'] as const

export default async function HomePage() {
  const dataMode = getDataModeStatus()
  const baseUrl = getBaseUrl()
  let availabilityLabel = 'Aktualne terminy sprawdzisz po wejściu do rezerwacji.'

  if (dataMode.isValid) {
    try {
      const availability = await listAvailability()
      availabilityLabel =
        availability.length > 0
          ? 'Aktualne terminy zobaczysz od razu po wejściu do rezerwacji.'
          : 'Terminy odświeżają się na bieżąco. Wejdź do rezerwacji albo napisz, jeśli chcesz dobrać pierwszy krok.'
    } catch (error) {
      console.warn('[beh2][home] nie udalo sie pobrac dostepnosci na home', error)
    }
  }

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: SITE_TAGLINE,
      url: baseUrl,
      areaServed: {
        '@type': 'Country',
        name: 'Polska',
      },
      serviceType: [
        'Konsultacje behawioralne dla psów i kotów',
        'Terapia problemów w zachowaniu',
        'Pobyty socjalizacyjno-terapeutyczne',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: SPECIALIST_CREDENTIALS,
        image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SPECIALIST_NAME,
      description: SPECIALIST_TRUST_STATEMENT,
      image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
      homeLocation: {
        '@type': 'Place',
        name: SPECIALIST_LOCATION,
      },
      sameAs: [COAPE_ORG_URL, CAPBT_ORG_URL, CAPBT_PROFILE_URL],
    },
  ]

  return (
    <main className="page-wrap">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header />

        <section className="hero-grid brand-hero-grid" id="start">
          <div className="panel hero-panel hero-surface brand-home-panel">
            <div className="pill subtle-pill">Konsultacje, terapia i pobyty dla psów i kotów</div>
            <div className="hero-topline">Mały krok na start. Szersza praca, gdy sytuacja tego wymaga.</div>
            <h1>{SITE_NAME}</h1>

            <p className="hero-text brand-subtitle">{SITE_TAGLINE}</p>

            <div className="stack-gap top-gap">
              {heroSummary.map((paragraph) => (
                <p key={paragraph} className="hero-text hero-text-tight compact-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="hero-proof-row top-gap-small" aria-label="Najważniejsze sygnały marki">
              {heroSignals.map((signal) => (
                <span key={signal} className="hero-proof-pill">
                  {signal}
                </span>
              ))}
            </div>

            <div className="sales-mini-grid top-gap">
              <div className="list-card tree-backed-card">
                <strong>Psy</strong>
                <span>{dogIssues.join(', ')}.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Koty</strong>
                <span>{catIssues.join(', ')}.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Jak zaczynać</strong>
                <span>Od 15 lub 30 minut albo pełnej konsultacji online.</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link
                href="/book"
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="hero"
              >
                Umów konsultację
              </Link>
              <Link href="/oferta" prefetch={false} className="button button-ghost big-button">
                Zobacz formy pracy
              </Link>
            </div>
          </div>

          <aside className="panel side-panel hero-aside hero-spotlight brand-home-aside">
            <div className="hero-spotlight-media">
              <Image
                src={SPECIALIST_PHOTO.src}
                alt={SPECIALIST_PHOTO.alt}
                width={1200}
                height={1600}
                sizes="(max-width: 980px) 88vw, 38vw"
                className="hero-spotlight-image"
                priority
              />
            </div>

            <div className="hero-spotlight-card tree-backed-card">
              <div className="section-eyebrow">Jak wygląda pierwszy krok</div>
              <h2>Pomoc ma być dopasowana do sytuacji</h2>

              <div className="hero-spotlight-meta">
                <strong>{availabilityLabel}</strong>
                <span>Zaczynasz od formy, która ułatwia pierwszy kontakt. Jeśli trzeba, dobieramy kolejny etap.</span>
              </div>

              <div className="hero-proof-column">
                <span className="hero-proof-pill">Szybka konsultacja 15 min</span>
                <span className="hero-proof-pill">Konsultacja 30 min</span>
                <span className="hero-proof-pill">Konsultacja behawioralna online</span>
                <span className="hero-proof-pill">Terapia, wizyty i pobyty</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="panel section-panel" id="jak-moge-pomoc">
          <div className="section-eyebrow">Jak mogę pomóc</div>
          <h2>Dobieram formę pomocy do sytuacji</h2>
          <p className="hero-text">Najpierw porządkujemy problem, potem wybieramy pierwszy krok.</p>

          <div className="summary-grid trust-grid top-gap offer-help-grid">
            {HOME_HELP_AREAS.map((item) => (
              <div key={item.title} className="summary-card trust-card tree-backed-card">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="formy-wspolpracy">
          <div className="section-eyebrow">Formy współpracy</div>
          <h2>Jak zacząć i co może być dalej</h2>
          <p className="hero-text">Ceny pokazuję tam, gdzie ścieżka jest z góry określona. Resztę dobieramy po rozpoznaniu sytuacji.</p>

          <div className="offer-grid top-gap">
            {OFFERS.map((offer) => (
              <article key={offer.slug} className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <div className="section-eyebrow">{offer.eyebrow}</div>
                    <h3>{offer.title}</h3>
                  </div>
                  {offer.priceLabel ? <span className="offer-price">{offer.priceLabel}</span> : null}
                </div>
                <p>{offer.cardSummary}</p>
                <div className="offer-card-actions">
                  <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost">
                    {getOfferDetailCtaLabel(offer)}
                  </Link>
                  <Link href={offer.primaryHref} prefetch={false} className="button button-primary">
                    {offer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="two-col-section" id="pobyty">
          <div className="panel section-panel">
            <div className="section-eyebrow">Pobyty socjalizacyjno-terapeutyczne</div>
            <h2>To osobna forma pracy, nie dodatek.</h2>
            <p className="hero-text">Pobyt rozważam wtedy, gdy realnie wspiera proces. To nie hotel i nie skrót.</p>
            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Najpierw kwalifikacja</strong>
                <span>Najpierw sprawdzamy, czy pobyt jest właściwą formą pomocy.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Spójność procesu</strong>
                <span>Pobyt może być kolejnym etapem po konsultacji lub terapii, jeśli ma to sens.</span>
              </div>
            </div>
            <div className="hero-actions top-gap">
              <Link href="/oferta/pobyty-socjalizacyjno-terapeutyczne" prefetch={false} className="button button-ghost big-button">
                Zobacz pobyty
              </Link>
              <Link href="/kontakt?service=pobyty-socjalizacyjno-terapeutyczne" prefetch={false} className="button button-primary big-button">
                Napisz w sprawie pobytu
              </Link>
            </div>
          </div>

          <div className="panel section-panel image-panel">
            <Image
              src={SUPPORTING_SPECIALIST_PHOTO.src}
              alt={SUPPORTING_SPECIALIST_PHOTO.alt}
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>
        </section>

        <section className="two-col-section" id="koty">
          <div className="panel section-panel image-panel">
            <Image
              src={CAT_HOME_PHOTO.src}
              alt={CAT_HOME_PHOTO.alt}
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Terapia kotów</div>
            <h2>Koty są osobnym obszarem pracy.</h2>
            <p className="hero-text">Koty wymagają osobnego rozpoznania i często współpracy z lekarzem weterynarii.</p>

            <div className="stack-gap top-gap">
              {CAT_SUPPORT_AREAS.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>To temat, który może wymagać konsultacji albo dalszego planu pracy.</span>
                </div>
              ))}
            </div>

            <div className="roadmap-list top-gap">
              {CAT_CONTENT_ROADMAP.map((item) => (
                <span key={item.slug} className="topic-example-chip">
                  {item.title}
                </span>
              ))}
            </div>

            <div className="hero-actions top-gap">
              <Link href="/koty" prefetch={false} className="button button-ghost big-button">
                Zobacz stronę o kotach
              </Link>
              <Link href="/kontakt" prefetch={false} className="button button-primary big-button">
                Napisz i opisz sytuację kota
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="jak-pracuje">
          <div className="section-eyebrow">Jak pracuję</div>
          <h2>Od rozpoznania do dalszej pracy</h2>

          <div className="process-grid top-gap">
            {HOME_PROCESS_STEPS.map((item) => (
              <div key={item.step} className="summary-card tree-backed-card process-card">
                <div className="process-step">{item.step}</div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Współpraca z lekarzem weterynarii i wsparcie farmakologiczne</strong>
            <span>Jeśli sytuacja tego wymaga, pracuję z lekarzem weterynarii. Farmakoterapia ma wspierać proces, nie go zastępować.</span>
          </div>
        </section>

        <section className="panel section-panel" id="zaufanie">
          <div className="section-eyebrow">Zaufanie i kwalifikacje</div>
          <h2>Kwalifikacje są ważne, ale liczy się sposób prowadzenia sprawy.</h2>
          <p className="hero-text">Pokazuję je jako sygnał wiarygodności, nie całą historię marki.</p>

          <div className="summary-grid trust-grid top-gap">
            {TRUST_SIGNAL_ITEMS.map((item) => (
              <div key={item.title} className="summary-card trust-card tree-backed-card">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>

          <div className="credential-logo-grid top-gap">
            <a
              href={COAPE_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="credential-logo-link tree-backed-card"
              aria-label="Otwórz oficjalną stronę COAPE Polska"
            >
              <Image src={COAPE_LOGO.src} alt={COAPE_LOGO.alt} width={442} height={104} className="credential-logo" />
              <span className="credential-logo-label">Oficjalna strona COAPE Polska</span>
            </a>
            <a
              href={CAPBT_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="credential-logo-link tree-backed-card"
              aria-label="Otwórz profil Krzysztofa Regulskiego w CAPBT"
            >
              <Image src={CAPBT_LOGO.src} alt={CAPBT_LOGO.alt} width={442} height={104} className="credential-logo" />
              <span className="credential-logo-label">Publiczny profil specjalisty w CAPBT</span>
            </a>
          </div>
        </section>

        <section className="two-col-section" id="faq">
          <div className="panel section-panel">
            <div className="section-eyebrow">FAQ</div>
            <h2>Pytania przed pierwszym kontaktem</h2>
            <FaqAccordion items={[...HOME_FAQ]} />
          </div>

          <div className="panel cta-panel compact-sales-cta">
            <div className="section-eyebrow">Kontakt</div>
            <h2>Możesz zacząć małym krokiem albo po prostu napisać.</h2>
            <p className="hero-text">Jeśli chcesz wejść przez szybki booking, przejdź do 15 minut. Jeśli nie wiesz, co wybrać, napisz.</p>
            <div className="hero-actions top-gap">
              <Link
                href="/book"
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="home-final-cta"
              >
                Umów konsultację
              </Link>
              <Link href="/kontakt" prefetch={false} className="button button-ghost big-button">
                Napisz i dobierz pierwszy krok
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
