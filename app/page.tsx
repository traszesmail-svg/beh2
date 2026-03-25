import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import { faq } from '@/lib/data'
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
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const purchaseProofs = [
  {
    title: 'Sprawdzalne kompetencje',
    description:
      'Behawiorysta COAPE / CAPBT, technik weterynarii, dogoterapeuta i dietetyk w jednej, publicznie weryfikowalnej osobie.',
  },
  {
    title: 'Bezpieczny zakup',
    description: 'Szyfrowana płatność, jasne potwierdzenie rezerwacji i uczciwa minuta na samodzielne anulowanie po zakupie.',
  },
  {
    title: 'Jeden spokojny rezultat',
    description: 'Po rozmowie masz pierwszy plan działania, zamiast chaotycznego zbierania kolejnych porad z internetu.',
  },
] as const

const quietHighlights = [
  {
    title: 'Kim jestem',
    description: `${SPECIALIST_NAME} - ${SPECIALIST_CREDENTIALS}.`,
  },
  {
    title: 'Co proponuję',
    description:
      '15-minutową konsultację głosową online dla sytuacji takich jak gryzienie rąk, trudne spacery, zostawanie samemu czy kuweta.',
  },
  {
    title: 'Po co to działa',
    description:
      'Nie kupujesz długiej obietnicy. Kupujesz spokojne uporządkowanie sytuacji i pierwszy sensowny krok.',
  },
] as const

const heroProblemSignals = [
  'Szczeniak gryzie ręce',
  'Pies rzuca się do innych psów',
  'Kot zaczął sikać poza kuwetą',
  'Pies wyje i niszczy po wyjściu',
] as const

export default async function HomePage() {
  const dataMode = getDataModeStatus()
  const baseUrl = getBaseUrl()
  let availability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      availability = await listAvailability()
    } catch (error) {
      console.warn('[behawior15][home] nie udalo sie wczytac kalendarza', error)
      publicFlowMessage = 'Kalendarz rezerwacji odświeża się. Możesz przejść dalej do wyboru tematu, a sloty pojawią się w następnym kroku.'
    }

  } else {
    publicFlowMessage = 'Kalendarz rezerwacji odświeża się. Możesz przejść dalej do wyboru tematu, a sloty pojawią się w następnym kroku.'
  }

  const availabilityPreviewLabel =
    dataMode.isValid && !publicFlowMessage
      ? availability.length > 0
        ? 'Wolne terminy są dostępne. Pokażę je dopiero po kliknięciu w rezerwację i wyborze tematu.'
        : 'Brak wolnych terminów'
      : 'Najbliższe realnie dostępne terminy zobaczysz dopiero po kliknięciu w rezerwację.'

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Behawior 15',
      serviceType: '15-minutowa konsultacja głosowa online dla psa lub kota',
      url: baseUrl,
      description:
        'Sprzedażowa strona konsultacji Behawior 15 dla problemów takich jak gryzienie rąk, reaktywność na spacerze, lęk separacyjny czy kuweta u kota.',
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

  return (
    <main className="page-wrap">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header />

        <section className="hero-grid sales-hero-grid" id="oferta">
          <div className="panel hero-panel hero-surface sales-home-panel">
            {publicFlowMessage ? <div className="info-box">{publicFlowMessage}</div> : null}

            <div className="pill subtle-pill">15-minutowa konsultacja audio online</div>
            <div className="hero-topline">Szczeniak gryzie ręce? Pies rzuca się do innych psów? Kot zaczął sikać poza kuwetą?</div>
            <h1>Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut</h1>

            <p className="hero-text hero-text-tight">
              Rozmawiasz bezpośrednio ze specjalistą. W 15 minut porządkujemy sytuację, wybieramy pierwszy sensowny krok i
              odcinamy chaos kolejnych, sprzecznych porad.
            </p>

            <div className="hero-problem-strip top-gap-small" aria-label="Przykładowe problemy, z którymi możesz zacząć">
              {heroProblemSignals.map((signal) => (
                <span key={signal} className="hero-problem-pill">
                  {signal}
                </span>
              ))}
            </div>

            <div className="sales-mini-grid top-gap">
              {quietHighlights.map((item) => (
                <div key={item.title} className="list-card tree-backed-card">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>

            <div className="hero-price-badge hero-price-badge-compact tree-backed-card">
              <PricingDisclosure
                stage="pre-topic"
                labelClassName="hero-price-label"
                messageAs="strong"
                showNote
                noteClassName="hero-price-note"
              />
            </div>

            <div className="hero-proof-row top-gap-small">
              <span className="hero-proof-pill">Behawiorysta COAPE / CAPBT</span>
              <span className="hero-proof-pill">Technik weterynarii</span>
              <span className="hero-proof-pill">Dogoterapeuta</span>
              <span className="hero-proof-pill">Dietetyk</span>
              <span className="hero-proof-pill">Bezpieczna płatność</span>
              <span className="hero-proof-pill">1 minuta na anulację</span>
            </div>

            <div className="hero-actions top-gap">
              <Link
                href="/book"
                className="button button-primary big-button"
                data-analytics-event="reserve_click"
                data-analytics-location="hero"
              >
                Zarezerwuj konsultację
              </Link>
            </div>

            <div className="marketing-note top-gap-small">
              Po kliknięciu wybierzesz temat najbliższy Twojej sytuacji i od razu zobaczysz realnie wolne terminy.
            </div>
          </div>

          <aside className="panel side-panel hero-aside hero-spotlight sales-home-aside">
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

            <div className="hero-spotlight-card tree-backed-card" id="specjalista">
              <div className="section-eyebrow">Kim jestem</div>
              <h2>{SPECIALIST_NAME}</h2>
              <div className="hero-spotlight-role">{SPECIALIST_CREDENTIALS}</div>

              <div className="hero-spotlight-meta">
                <strong>{SPECIALIST_TRUST_STATEMENT}</strong>
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
                <span>Publiczny profil COAPE / CAPBT potwierdza, że za tą stroną stoi realna osoba.</span>
              </a>
            </div>
          </aside>
        </section>

        <section className="panel section-panel" id="pewnosc-zakupu">
          <div className="section-eyebrow">Pewność jakości i zakupu</div>
          <h2>Ma być prosto, uczciwie i bez niepewności</h2>
          <p className="hero-text">
            Tutaj najważniejsze są trzy rzeczy: kto prowadzi konsultację, co realnie kupujesz i czy sam zakup jest bezpieczny.
          </p>

          <div className="summary-grid trust-grid proof-grid top-gap">
            {purchaseProofs.map((item) => (
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
              <span className="credential-logo-label">Profil specjalisty COAPE / CAPBT</span>
            </a>
          </div>
        </section>

        <section className="two-col-section compact-info-section" id="dla-zainteresowanych">
          <div className="panel section-panel">
            <div className="section-eyebrow">Dla zainteresowanych</div>
            <h2>Krótko o tym, jak pracuję</h2>

            <div className="list-card tree-backed-card top-gap">
              <strong>Łączę zachowanie, tło weterynaryjne, relację i dietę</strong>
              <span>
                To ważne zwłaszcza wtedy, gdy problem nie kończy się na samym objawie. W praktyce oznacza to spokojniejsze
                rozróżnienie, czy wystarczy pierwszy plan pracy w domu, czy trzeba myśleć szerzej o zdrowiu, środowisku,
                napięciu albo modyfikacji diety w celu wsparcia terapii behawioralnej.
              </span>
            </div>

            <div className="summary-grid top-gap compact-proof-grid">
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Co proponuję</div>
                <div className="summary-value">Pierwszy spokojny krok</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Forma</div>
                <div className="summary-value">15 minut audio online</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Po rozmowie</div>
                <div className="summary-value">Jasny plan działania</div>
              </div>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">FAQ</div>
            <h2>Pytania przed kliknięciem</h2>
            <FaqAccordion items={faq} />
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Decyzja</div>
          <h2>Jeśli chcesz to uporządkować, przejdź do rezerwacji</h2>
          <p className="hero-text">
            Na następnym ekranie zobaczysz wyłącznie tematy konsultacji i wybierzesz ten, od którego chcesz zacząć.
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

        <div className="mobile-sticky-cta" aria-label="Mobilne CTA rezerwacji">
          <Link
            href="/book"
            className="button button-primary big-button"
            data-analytics-event="reserve_click"
            data-analytics-location="mobile-sticky"
          >
            Zarezerwuj konsultację
          </Link>
        </div>
      </div>
    </main>
  )
}
