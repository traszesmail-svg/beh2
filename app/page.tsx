import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ShareActions } from '@/components/ShareActions'
import { SocialProofSection } from '@/components/SocialProofSection'
import { SocialSection } from '@/components/SocialSection'
import { faq, problemOptions, steps } from '@/lib/data'
import { buildHomeMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getBaseUrl, getDataModeStatus } from '@/lib/server/env'
import {
  CAPBT_LOGO,
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  COAPE_LOGO,
  COAPE_ORG_URL,
  CONSULTATION_PRICE_COMPARE_COPY,
  HERO_PHOTO,
  HERO_SUPPORT_IMAGES,
  MEDIA_MENTIONS,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_TRUST_STATEMENT,
  SUPPORTING_SPECIALIST_PHOTO,
  TOPIC_VISUALS,
} from '@/lib/site'
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

function renderProblemIcon(problem: ProblemType) {
  switch (problem) {
    case 'szczeniak':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M10 32c0-8.8 6.4-14 14-14s14 5.2 14 14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M17 17l-5-5m19 5l5-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="19" cy="24" r="1.6" fill="currentColor" />
          <circle cx="29" cy="24" r="1.6" fill="currentColor" />
          <path d="M21 29c2.2 1.8 3.8 1.8 6 0" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'kot':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M13 34c0-9 4.5-15 11-15s11 6 11 15" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 17l-4-7 7 4m6 3l7-4-4 7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <circle cx="21" cy="24" r="1.5" fill="currentColor" />
          <circle cx="27" cy="24" r="1.5" fill="currentColor" />
          <path d="M24 25.5v3.5m-7 0l5-1.5m9 1.5l-5-1.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      )
    case 'separacja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M13 22.5 24 13l11 9.5V35H13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M24 35V25" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M10 36c3-4.3 7.7-6 14-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'agresja':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M24 10l12 5v8c0 8.3-4.5 13.6-12 15-7.5-1.4-12-6.7-12-15v-8Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M18 25h12m-9 4h6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case 'niszczenie':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M15 31c0-6.6 3.8-12 9-12 4.7 0 9 4.2 9 10.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 17c.8-3.4 3-5 6-5 2.8 0 5 1.4 6 4.6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M14 34h20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="m20 26 2 2 6-6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'dogoterapia':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M15 30c0-6 3.6-11 9-11 5.1 0 9 4 9 10.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M18 18c.6-3.4 2.7-5 6-5 3.2 0 5.2 1.6 6 4.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M16 35c2.2-3 5-4.5 8-4.5s5.8 1.5 8 4.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="m24 22.5 1.8 2.4 2.9-.9-1.8 2.4 1.8 2.4-2.9-.9-1.8 2.4-1.8-2.4-2.9.9 1.8-2.4-1.8-2.4 2.9.9Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        </svg>
      )
    case 'inne':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <path d="M24 18v12m6-6H18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export default async function HomePage() {
  const dataMode = getDataModeStatus()
  const baseUrl = getBaseUrl()
  let availability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      availability = await listAvailability()
    } catch (error) {
      console.warn('[behawior15][home] nie udało się wczytać ceny lub dostępności', error)
      publicFlowMessage = 'Rezerwacja chwilowo się odświeża. Sprawdź kalendarz za moment albo przejdź od razu do wyboru tematu.'
    }
  } else {
    publicFlowMessage = 'Rezerwacja chwilowo się odświeża. Ofertę możesz zobaczyć już teraz, a aktualny kalendarz sprawdzić w kolejnym kroku.'
  }

  const bookingEnabled = dataMode.isValid && !publicFlowMessage
  const availabilityPreviewLabel = bookingEnabled
    ? availability.length > 0
      ? 'Wolne terminy dostępne dziś — sprawdź aktualny kalendarz.'
      : 'Brak wolnych terminów'
    : 'Najbliższe realnie dostępne terminy zobaczysz w kolejnym kroku rezerwacji.'

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Behawior 15',
      serviceType: '15-minutowa konsultacja głosowa online dla psa lub kota',
      url: baseUrl,
      description:
        'Spokojna 15-minutowa konsultacja głosowa online dla psa lub kota. Certyfikowany behawiorysta Krzysztof Regulski (COAPE/CAPBT).',
      areaServed: {
        '@type': 'City',
        name: 'Olsztyn',
      },
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: SPECIALIST_CREDENTIALS,
        image: new URL(SPECIALIST_PHOTO.src, baseUrl).toString(),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Olsztyn',
          addressCountry: 'PL',
        },
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

        <section className="hero-grid" id="oferta">
          <div className="panel hero-panel hero-surface">
            {publicFlowMessage ? <div className="info-box">{publicFlowMessage}</div> : null}

            <div className="pill">15-minutowa konsultacja audio online</div>
            <div className="hero-note-row">
              <span className="trust-chip">Behawior + medyczne + terapia</span>
              <span className="trust-chip">Pies lub kot • jeden specjalista • jeden konkretny pierwszy krok</span>
            </div>
            <div className="hero-topline">Zweryfikowany behawiorysta COAPE/CAPBT dla opiekunów psów i kotów.</div>
            <h1>Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut</h1>
            <p className="hero-text">
              Bez chaosu, bez zgadywania i bez przeciążenia poradami z internetu. Rezerwujesz rozmowę z jedną osobą,
              płacisz bezpiecznie i od razu dostajesz pierwszy konkretny kierunek działania.
            </p>

            <div className="hero-price-badge">
              <span className="hero-price-label">Aktualna cena i płatność</span>
              <strong>Kwotę potwierdzisz po wyborze tematu konsultacji</strong>
              <span className="hero-price-note">15 minut rozmowy audio z jednym specjalistą</span>
              <span className="hero-price-compare">{CONSULTATION_PRICE_COMPARE_COPY}</span>
            </div>

            <div className="hero-inline-facts">
              <div className="hero-inline-fact">
                <strong>{availabilityPreviewLabel}</strong>
                <span>Aktualną godzinę zobaczysz dopiero w właściwym kalendarzu rezerwacji.</span>
              </div>
              <div className="hero-inline-fact">
                <strong>Bezpieczna płatność</strong>
                <span>Po opłaceniu od razu dostajesz potwierdzenie i link do rozmowy.</span>
              </div>
              <div className="hero-inline-fact">
                <strong>Niski próg ryzyka</strong>
                <span>Jeśli rozmowa nie pomoże zrozumieć problemu, możesz ubiegać się o zwrot pieniędzy.</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link
                href="/book"
                className="button button-primary big-button"
                data-analytics-event="reserve_click"
                data-analytics-location="hero-primary"
              >
                Zarezerwuj 15 minut i odzyskaj spokój w domu
              </Link>
              <Link
                href="/book#tematy"
                className="button button-ghost big-button"
                data-analytics-event="reserve_click"
                data-analytics-location="hero-secondary"
              >
                Wybierz temat i termin
              </Link>
            </div>

            <ShareActions
              url={baseUrl}
              text="Behawior 15 — szybka konsultacja dla opiekunów psów i kotów"
            />
          </div>

          <div className="panel side-panel hero-aside hero-credentials">
            <div className="hero-photo-card">
              <div className="section-eyebrow">Prowadzący konsultację</div>
              <div className="hero-photo-shell top-gap-small">
                <Image
                  src={HERO_PHOTO.src}
                  alt={HERO_PHOTO.alt}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 980px) 82vw, 30vw"
                  className="hero-photo"
                  priority
                />
              </div>
              <p className="hero-photo-caption">
                Konsultację prowadzi osobiście {SPECIALIST_NAME}. Rezerwujesz rozmowę z konkretną osobą, bez losowego marketplace i bez
                przepychania między specjalistami.
              </p>
            </div>

            <div className="hero-animal-row">
              {HERO_SUPPORT_IMAGES.map((item) => (
                <div key={item.id} className="hero-animal-card">
                  <div className="hero-animal-shell">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={1200}
                      height={900}
                      sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 18vw"
                      className="hero-animal-image"
                    />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="credential-mark">
              <div className="credential-copy">
                <div className="section-eyebrow">Kwalifikacje i zaufanie</div>
                <h2>COAPE / CAPBT</h2>
                <p className="muted paragraph-gap">
                  {SPECIALIST_TRUST_STATEMENT} Profil specjalisty i organizację możesz sprawdzić publicznie, zanim przejdziesz do rezerwacji.
                </p>
              </div>
              <div className="credential-logo-grid">
                <a
                  href={COAPE_ORG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credential-logo-link"
                  aria-label="Otwórz oficjalną stronę COAPE Polska"
                >
                  <Image
                    src={COAPE_LOGO.src}
                    alt={COAPE_LOGO.alt}
                    width={442}
                    height={104}
                    className="credential-logo"
                  />
                  <span className="credential-logo-label">Oficjalna strona COAPE Polska</span>
                </a>
                <a
                  href={CAPBT_ORG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credential-logo-link"
                  aria-label="Otwórz stronę CAPBT Polska"
                >
                  <Image
                    src={CAPBT_LOGO.src}
                    alt={CAPBT_LOGO.alt}
                    width={436}
                    height={107}
                    className="credential-logo"
                  />
                  <span className="credential-logo-label">Strona CAPBT Polska</span>
                </a>
              </div>
              <div className="credential-links-row">
                <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                  Profil Krzysztofa w CAPBT
                </a>
              </div>
            </div>

            <div className="mini-card availability-card">
              <div className="muted">Dostępność</div>
              <div className="side-title">{availabilityPreviewLabel}</div>
              <ul className="hero-checklist">
                <li>Realny kalendarz z aktualnymi slotami, bez sztucznego licznika pilności.</li>
                <li>Po płatności od razu dostajesz potwierdzenie i link do rozmowy.</li>
                <li>Jeśli chcesz, przed rozmową dodasz nagranie MP4, link albo notatki.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Spokojny pierwszy krok</div>
              <h2>Jedna rozmowa, jasny plan i realny następny krok zamiast chaosu</h2>
            </div>
            <div className="muted">
              To krótka konsultacja, która pomaga uporządkować sytuację i zdecydować, czy wystarczy plan domowy, czy potrzebna będzie dalsza praca.
            </div>
          </div>

          <div className="card-grid three-up top-gap">
            <div className="feature-card">
              <div className="simple-title">Jedna rozmowa, bez rozmywania tematu</div>
              <div className="simple-desc">
                W 15 minut zbieramy kluczowe informacje i ustalamy pierwszy sensowny kierunek działania.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Potwierdzenie i link od razu po płatności</div>
              <div className="simple-desc">
                Rezerwujesz termin, kończysz płatność i od razu widzisz potwierdzenie oraz link do rozmowy audio.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Materiały przed rozmową, jeśli ich potrzebujesz</div>
              <div className="simple-desc">
                MP4, link albo krótkie notatki pomagają wejść w sedno sprawy bez przeciążania konsultacji.
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel guarantee-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Niski próg ryzyka</div>
              <h2>Jeśli rozmowa nie pomoże Ci zrozumieć problemu, możesz ubiegać się o zwrot pieniędzy.</h2>
            </div>
            <div className="muted">
              Nie obiecujemy automatycznego zwrotu jednym kliknięciem, bo taki mechanizm nie jest częścią produktu.
              Obiecujemy uczciwie, że ta konsultacja ma dać Ci użyteczne 15 minut i jasny kolejny krok.
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="tematy">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Tematy konsultacji</div>
              <h2>Wybierz temat i przejdź do realnej rezerwacji</h2>
            </div>
            <div className="muted">
              Każdy temat prowadzi do tego samego flow rezerwacji, do tej samej ceny dla nowych bookingów i do realnie dostępnych terminów.
            </div>
          </div>

          <div className="card-grid three-up top-gap">
            {problemOptions.map((tile) => {
              const topicVisual = TOPIC_VISUALS[tile.id]

              return (
                <Link
                  key={tile.id}
                  href={`/book?problem=${tile.id}`}
                  className="topic-card"
                  data-analytics-event="topic_select"
                  data-analytics-location="home-topics"
                  data-analytics-problem={tile.id}
                >
                  <div className="topic-media-shell">
                    <Image
                      src={topicVisual.src}
                      alt={topicVisual.alt}
                      width={1200}
                      height={900}
                      sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
                      className="topic-media-image"
                    />
                  </div>
                  <span className="topic-icon-shell">{renderProblemIcon(tile.id)}</span>
                  <div className="topic-title">{tile.title}</div>
                  <div className="topic-desc">{tile.desc}</div>
                  <div className="topic-link">Wybierz ten temat i zarezerwuj termin</div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="panel section-panel" id="jak-to-dziala">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Jak to działa</div>
              <h2>Temat, termin, płatność i spokojna rozmowa</h2>
            </div>
            <div className="muted">Bez osobnych rozmów wstępnych, bez czekania na oddzwonienie i bez rozbudowanego onboardingu.</div>
          </div>

          <div className="card-grid three-up top-gap">
            {steps.map((step) => (
              <div key={step.n} className="simple-card">
                <div className="step-number">{step.n}</div>
                <div className="simple-title">{step.title}</div>
                <div className="simple-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="two-col-section" id="specjalista">
          <div className="panel section-panel specialist-visual-card">
            <div className="section-eyebrow">Specjalista prowadzący</div>
            <div className="specialist-portrait-shell top-gap-small">
              <Image
                src={SPECIALIST_PHOTO.src}
                alt={SPECIALIST_PHOTO.alt}
                width={1200}
                height={1600}
                sizes="(max-width: 980px) 88vw, 42vw"
                className="specialist-portrait"
              />
            </div>
            <div className="list-card top-gap specialist-summary-card">
              <strong>{SPECIALIST_NAME}</strong>
              <span>
                {SPECIALIST_CREDENTIALS}. {SPECIALIST_LOCATION}. Każdą rozmowę prowadzi osobiście od rezerwacji do wskazania kolejnego kroku.
              </span>
              <span className="specialist-trust-line">{SPECIALIST_TRUST_STATEMENT}</span>
            </div>
          </div>

          <div className="panel section-panel specialist-copy-panel">
            <div className="section-eyebrow">Dlaczego temu zaufać</div>
            <h2>Behawior, wiedza medyczna i doświadczenie terapeutyczne w jednym miejscu</h2>
            <div className="specialist-badge-list top-gap">
              <span className="specialist-badge">Behawior</span>
              <span className="specialist-badge">Technik weterynarii</span>
              <span className="specialist-badge">Opiekun medyczny</span>
              <span className="specialist-badge">Dogoterapia</span>
              <span className="specialist-badge">COAPE/CAPBT</span>
            </div>
            <div className="stack-gap top-gap">
              <div className="list-card specialist-inline-photo-card">
                <div className="specialist-inline-photo-shell">
                  <Image
                    src={SUPPORTING_SPECIALIST_PHOTO.src}
                    alt={SUPPORTING_SPECIALIST_PHOTO.alt}
                    width={1200}
                    height={1778}
                    sizes="(max-width: 680px) 100vw, (max-width: 980px) 80vw, 16vw"
                    className="specialist-inline-photo"
                  />
                </div>
                <div className="specialist-inline-copy">
                  <strong>Spójna praca na styku zachowania, zdrowia i terapii</strong>
                  <span>
                    Dzięki temu łatwiej szybko ocenić, czy wystarczy pierwszy plan domowy, czy trzeba połączyć behawior z dalszą diagnostyką albo wizytą u lekarza weterynarii.
                  </span>
                </div>
              </div>
              <div className="list-card">
                <strong>COAPE i CAPBT weryfikujesz publicznie</strong>
                <span>Logo COAPE i CAPBT prowadzą bezpośrednio do oficjalnych stron organizacji, a obok zostaje publiczny profil specjalisty.</span>
                <div className="hero-actions top-gap-small">
                  <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                    Profil Krzysztofa
                  </a>
                </div>
              </div>
              <div className="list-card">
                <strong>Materiały przed rozmową</strong>
                <span>Jeżeli chcesz, po rezerwacji dodasz MP4, link albo notatki. To przyspiesza rozmowę i pomaga wejść od razu w sedno sprawy.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="two-col-section" id="dogoterapia">
          <div className="panel section-panel specialist-visual-card">
            <div className="section-eyebrow">Dogoterapia</div>
            <h2>Umów wstępną rozmowę o dogoterapii</h2>
            <p className="muted">
              Jeśli chcesz sprawdzić, czy dogoterapia będzie dobrym następnym krokiem, możesz przejść przez to samo,
              działające flow rezerwacji. Najpierw wybierasz temat dogoterapii i termin rozmowy, a potem w formularzu
              doprecyzowujesz cel spotkania, odbiorców i kontekst pracy.
            </p>
            <div className="hero-animal-shell top-gap">
              <Image
                src="/branding/case-dog-home.jpg"
                alt="Spokojny pies w domowym otoczeniu jako ilustracja sekcji o dogoterapii"
                width={1200}
                height={900}
                sizes="(max-width: 980px) 100vw, 42vw"
                className="hero-animal-image"
              />
            </div>
          </div>

          <div className="panel section-panel specialist-copy-panel">
            <div className="section-eyebrow">Jak wejść w rezerwację</div>
            <h2>Jedno wejście do kalendarza, bez osobnej ścieżki technicznej</h2>
            <div className="stack-gap top-gap">
              <div className="list-card accent-outline">
                <strong>Co wpiszesz w formularzu</strong>
                <span>
                  Po wyborze terminu dopiszesz, dla kogo ma być przygotowane spotkanie, jaki jest najważniejszy cel
                  rozmowy i jakiego wsparcia potrzebujesz na starcie.
                </span>
              </div>
              <div className="list-card">
                <strong>Co ustalisz na starcie</strong>
                <span>
                  Taka pierwsza rozmowa pomaga ocenić, czy dogoterapia ma sens w Twojej sytuacji, jak się przygotować i
                  jaki następny krok będzie najbardziej użyteczny.
                </span>
              </div>
              <div className="list-card">
                <strong>Ta sama bezpieczna rezerwacja</strong>
                <span>
                  Nie dokładamy osobnego systemu terminów. Korzystasz z tego samego kalendarza, płatności i potwierdzenia,
                  które działają już dla całej usługi Behawior 15.
                </span>
              </div>
            </div>
            <div className="hero-actions top-gap">
              <Link
                href="/book?problem=dogoterapia"
                className="button button-primary big-button"
                data-analytics-event="reserve_click"
                data-analytics-location="dogotherapy-section"
              >
                Umów dogoterapię
              </Link>
              <Link href="/book" className="button button-ghost big-button">
                Zobacz kalendarz rezerwacji
              </Link>
            </div>
            <p className="muted top-gap-small">Dogoterapia ma już własny temat w kalendarzu, ale korzysta z tego samego, działającego flow rezerwacji Behawior 15.</p>
          </div>
        </section>

        <SocialProofSection />

        <section className="panel section-panel" id="publikacje">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Publikacje / Media</div>
              <h2>Zweryfikowane materiały, które wzmacniają zaufanie bez nadęcia</h2>
            </div>
            <div className="muted">Pokazujemy tylko treści, które da się obronić nazwą medium albo publicznym linkiem.</div>
          </div>

          <div className="media-grid top-gap">
            {MEDIA_MENTIONS.map((item) => (
              <article key={item.id} className="media-card">
                <div className="section-eyebrow">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-link top-gap-small">
                  {item.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="faq">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">FAQ</div>
              <h2>Najczęstsze pytania przed pierwszą rozmową</h2>
            </div>
            <div className="muted">Krótkie odpowiedzi na to, co zwykle blokuje decyzję o rezerwacji.</div>
          </div>
          <FaqAccordion items={faq} />
        </section>

        <SocialSection />

        <section className="panel cta-panel">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Zarezerwuj 15 minut i odzyskaj spokój w domu.</h2>
          <p className="hero-text small-width">
            Jeżeli problem zaczyna się ciągnąć, najważniejsze jest dobre otwarcie. Ta konsultacja pomaga szybko ocenić, co zrobić od razu i czy
            potrzebna jest dalsza, szersza praca.
          </p>
          <div className="hero-actions top-gap">
            <Link
              href="/book"
              className="button button-primary big-button"
              data-analytics-event="reserve_click"
              data-analytics-location="final-cta"
            >
              Zarezerwuj 15 minut i odzyskaj spokój w domu
            </Link>
            <Link
              href="/book#tematy"
              className="button button-ghost big-button"
              data-analytics-event="reserve_click"
              data-analytics-location="final-cta-secondary"
            >
              Wybierz temat i termin
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
