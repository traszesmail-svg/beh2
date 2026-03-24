import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
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
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_TRUST_STATEMENT,
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
    default:
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <path d="M24 18v12m6-6H18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
  }
}

function renderProcessIcon(step: string) {
  switch (step) {
    case '01':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <path d="M19 24h10m-5-5v10" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    case '02':
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <rect x="10" y="13" width="28" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2.3" />
          <path d="M16 10v6m16-6v6M16 22h16" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 48 48" className="topic-svg" aria-hidden="true">
          <path d="M10 24 18 32 38 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
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

  const availabilityPreviewLabel =
    dataMode.isValid && !publicFlowMessage
      ? availability.length > 0
        ? 'Wolne terminy są dostępne. Aktualny kalendarz zobaczysz po wejściu do rezerwacji.'
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
        'Spokojna 15-minutowa konsultacja głosowa online dla psa lub kota. Realny specjalista, bezpieczny zakup i jasny pierwszy krok po rozmowie.',
      areaServed: {
        '@type': 'City',
        name: 'Olsztyn',
      },
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

  const salesTopics = problemOptions.filter((item) =>
    ['szczeniak', 'kot', 'separacja', 'agresja'].includes(item.id),
  )

  const outcomeHighlights = [
    {
      title: 'Porządek w problemie',
      description: 'Po 15 minutach wiesz, co jest najważniejsze teraz, a co może spokojnie poczekać.',
    },
    {
      title: 'Pierwszy konkretny plan',
      description: 'Dostajesz prosty następny krok zamiast kolejnej porcji ogólnych porad z internetu.',
    },
    {
      title: 'Decyzję, co dalej',
      description: 'Od razu wiesz, czy wystarczy spokojna praca w domu, czy trzeba iść szerzej w konsultację albo diagnostykę.',
    },
  ]

  return (
    <main className="page-wrap">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header />

        <section className="hero-grid" id="oferta">
          <div className="panel hero-panel hero-surface hero-sales-panel">
            {publicFlowMessage ? <div className="info-box">{publicFlowMessage}</div> : null}

            <div className="pill subtle-pill">15-minutowa konsultacja audio online</div>
            <div className="hero-topline">Dla opiekunów psów i kotów, którzy chcą szybko kupić spokojny pierwszy krok, a nie kolejną chaotyczną obietnicę.</div>
            <h1>15 minut, które porządkują problem psa lub kota i dają pierwszy plan działania</h1>

            <p className="hero-text hero-text-tight">
              To krótka, konkretna konsultacja na moment, w którym chcesz zrozumieć problem, przestać zgadywać i wiedzieć, co zrobić dalej bez chaosu i przeciążenia poradami.
            </p>

            <div className="hero-price-badge hero-price-badge-compact">
              <PricingDisclosure
                stage="pre-topic"
                labelClassName="hero-price-label"
                messageAs="strong"
                showNote
                noteClassName="hero-price-note"
              />
            </div>

            <div className="hero-inline-facts">
              <div className="hero-inline-fact">
                <strong>Technik weterynarii</strong>
                <span>Łączę zachowanie z myśleniem o zdrowiu, bezpieczeństwie i tle medycznym.</span>
              </div>
              <div className="hero-inline-fact">
                <strong>Dogoterapeuta</strong>
                <span>Łączę świat ludzi i zwierząt, więc patrzę nie tylko na objaw, ale też na relację i kontekst.</span>
              </div>
              <div className="hero-inline-fact">
                <strong>1 minuta na anulację</strong>
                <span>Po zakupie dostajesz uczciwy czas na samodzielne cofnięcie płatności przyciskiem anulacji.</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link
                href="/book"
                className="button button-primary big-button"
                data-analytics-event="reserve_click"
                data-analytics-location="hero"
              >
                Zarezerwuj 15 minut
              </Link>
            </div>
          </div>

          <div className="panel side-panel hero-aside hero-spotlight">
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

            <div className="hero-spotlight-card" id="specjalista">
              <div className="section-eyebrow">Konsultację prowadzi osobiście</div>
              <h2>{SPECIALIST_NAME}</h2>
              <div className="hero-spotlight-role">{SPECIALIST_CREDENTIALS}</div>

              <div className="hero-spotlight-meta">
                <strong>Jedna rozmowa, jedna osoba i jeden spokojny kierunek działania.</strong>
                <span>{availabilityPreviewLabel}</span>
              </div>

              <a
                href={CAPBT_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-spotlight-proof"
                aria-label="Otwórz publiczny profil COAPE CAPBT"
              >
                <Image src={CAPBT_LOGO.src} alt={CAPBT_LOGO.alt} width={442} height={104} className="hero-coape-logo" />
                <span>COAPE / CAPBT możesz sprawdzić publicznie jeszcze przed zakupem.</span>
              </a>
            </div>
          </div>
        </section>

        <section className="panel section-panel guarantee-panel" id="bezpieczenstwo">
          <div className="section-eyebrow">Pewność zakupu</div>
          <h2>Dlaczego ten zakup jest bezpieczny i uczciwy</h2>
          <p className="hero-text">
            To nie jest obietnica cudu w 15 minut. To spokojny pierwszy krok z realnym specjalistą, publicznie sprawdzalnymi kompetencjami i jasnymi zasadami zakupu.
          </p>

          <div className="summary-grid trust-grid top-gap">
            <div className="summary-card trust-card">
              <strong>Technik weterynarii</strong>
              <span>Jeśli temat dotyka zdrowia, napięcia albo przeciążenia, łatwiej od razu ustawić bezpieczny kierunek dalszych decyzji.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Dogoterapeuta</strong>
              <span>To ważne tam, gdzie problem nie dotyczy tylko zwierzęcia, ale też relacji człowiek-zwierzę i sposobu prowadzenia wsparcia.</span>
            </div>
            <div className="summary-card trust-card">
              <strong>Bezpieczna płatność i minuta na anulację</strong>
              <span>Po opłaceniu widzisz potwierdzenie, link do rozmowy i przycisk anulacji działający przez 1 minutę.</span>
            </div>
          </div>

          <div className="list-card accent-outline top-gap">
            <strong>COAPE i CAPBT sprawdzisz publicznie</strong>
            <span>To nie jest anonimowy marketplace. Poniżej masz oficjalne miejsca do weryfikacji organizacji i profilu specjalisty.</span>

            <div className="credential-logo-grid top-gap-small">
              <a
                href={COAPE_ORG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="credential-logo-link"
                aria-label="Otwórz oficjalną stronę COAPE Polska"
              >
                <Image src={COAPE_LOGO.src} alt={COAPE_LOGO.alt} width={442} height={104} className="credential-logo" />
                <span className="credential-logo-label">Oficjalna strona COAPE Polska</span>
              </a>
              <a
                href={CAPBT_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="credential-logo-link"
                aria-label="Otwórz profil Krzysztofa Regulskiego w CAPBT"
              >
                <Image src={CAPBT_LOGO.src} alt={CAPBT_LOGO.alt} width={442} height={104} className="credential-logo" />
                <span className="credential-logo-label">Profil COAPE / CAPBT</span>
              </a>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="tematy">
          <div className="section-eyebrow">Najczęstsze sprawy</div>
          <h2>W jakich problemach ta rozmowa pomaga</h2>
          <p className="hero-text">
            To dobra rozmowa na pierwszy krok, kiedy chcesz przestać zgadywać i szybko ustalić, od czego zacząć w domu, w relacji ze zwierzęciem albo w dalszej diagnostyce.
          </p>

          <div className="card-grid three-up top-gap">
            {salesTopics.map((item) => {
              const topicVisual = TOPIC_VISUALS[item.id]

              return (
                <Link
                  key={item.id}
                  href={`/slot?problem=${item.id}`}
                  className="topic-card"
                  data-analytics-event="topic_select"
                  data-analytics-location="home-sales-topics"
                  data-analytics-problem={item.id}
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
                  <span className="topic-icon-shell">{renderProblemIcon(item.id)}</span>
                  <div className="topic-title">{item.title}</div>
                  <div className="topic-desc">{item.desc}</div>
                  <div className="topic-link">Wybierz ten temat i przejdź do terminu</div>
                </Link>
              )
            })}
          </div>

          <div className="list-card top-gap">
            <strong>Jeśli temat jest inny albo dotyczy dogoterapii</strong>
            <span>Też wejdziesz przez ten sam, prosty flow rezerwacji. Temat wybierzesz po kliknięciu w rezerwację.</span>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Efekt rozmowy</div>
          <h2>Co dostajesz po 15 minutach</h2>

          <div className="summary-grid top-gap">
            {outcomeHighlights.map((item) => (
              <div key={item.title} className="summary-card">
                <div className="stat-label">{item.title}</div>
                <div className="summary-value">{item.description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="jak-to-dziala">
          <div className="section-eyebrow">Prosty proces</div>
          <h2>Jak wygląda zakup konsultacji</h2>

          <div className="card-grid three-up top-gap">
            {steps.map((step) => (
              <div key={step.n} className="topic-card">
                <span className="topic-icon-shell">{renderProcessIcon(step.n)}</span>
                <div className="topic-title">{step.title}</div>
                <div className="topic-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="faq">
          <div className="section-eyebrow">FAQ</div>
          <h2>Najczęstsze pytania przed zakupem</h2>
          <FaqAccordion items={faq} />
        </section>

        <section className="panel cta-panel guarantee-panel">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Zarezerwuj 15 minut i kup spokojny pierwszy krok</h2>
          <p className="hero-text">
            Bez marketplace, bez zbędnych dodatków, z prawdziwym specjalistą po drugiej stronie i uczciwą minutą na anulację po zakupie.
          </p>
          <div className="hero-actions top-gap">
            <Link
              href="/book"
              className="button button-primary big-button"
              data-analytics-event="reserve_click"
              data-analytics-location="home-final-cta"
            >
              Zarezerwuj konsultację
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
