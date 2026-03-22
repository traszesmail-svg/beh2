import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { faq, formatDateTimeLabel, problemOptions, steps } from '@/lib/data'
import { getActiveConsultationPrice, listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import {
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  HERO_PHOTO,
  MEDIA_MENTIONS,
  REAL_CASE_STUDIES,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_LOCATION,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_TRUST_STATEMENT,
} from '@/lib/site'
import { ProblemType } from '@/lib/types'

export const dynamic = 'force-dynamic'

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
  let pricing: Awaited<ReturnType<typeof getActiveConsultationPrice>> | null = null
  let availability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      ;[pricing, availability] = await Promise.all([getActiveConsultationPrice(), listAvailability()])
    } catch {
      publicFlowMessage = 'Rezerwacja chwilowo się odświeża. Odśwież stronę za moment albo wróć za chwilę do wyboru terminu.'
    }
  } else {
    publicFlowMessage = 'Rezerwacja chwilowo się odświeża. Ofertę możesz zobaczyć już teraz, a do wyboru terminu wrócić za chwilę.'
  }

  const bookingEnabled = dataMode.isValid && !publicFlowMessage
  const nextSlot = availability[0]?.slots[0]
  const nextSlotLabel = bookingEnabled
    ? nextSlot
      ? formatDateTimeLabel(nextSlot.bookingDate, nextSlot.bookingTime)
      : 'Brak wolnych terminów'
    : 'Terminy chwilowo się odświeżają'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="hero-grid" id="oferta">
          <div className="panel hero-panel hero-surface">
            {publicFlowMessage ? <div className="info-box">{publicFlowMessage}</div> : null}

            <div className="pill">15-minutowa konsultacja głosowa online</div>
            <div className="hero-topline">Zweryfikowany behawiorysta COAPE / CAPBT dla opiekunów psów i kotów.</div>
            <h1>
              Zarezerwuj 15 minut i odzyskaj spokój w domu. <span>Jedna rozmowa, jasny pierwszy krok i realny termin.</span>
            </h1>
            <p className="hero-text">
              Bez chaosu, bez zgadywania i bez tygodni sprzecznych porad. Rezerwujesz jeden termin, płacisz raz i rozmawiasz
              bezpośrednio z jednym specjalistą, który prowadzi sprawę od pierwszego pytania do rekomendacji dalszego kroku.
            </p>

            <div className="hero-price-badge">
              <span className="hero-price-label">Aktualna cena</span>
              <strong>{pricing?.formattedAmount ?? 'Cena chwilowo niedostępna'}</strong>
              <span>za 15 minut rozmowy audio</span>
            </div>

            <div className="hero-note-row">
              <span className="trust-chip">Behawior + medyczne + terapia</span>
              <span className="trust-chip">Bezpieczna płatność</span>
              <span className="trust-chip">Audio online bez instalacji</span>
              <span className="trust-chip">Psy i koty</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Czas rozmowy</div>
                <div className="stat-value">15 min</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Aktualna cena</div>
                <div className="stat-value">{pricing?.formattedAmount ?? 'Sprawdź za moment'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Najbliższy realny termin</div>
                <div className="stat-value">{nextSlotLabel}</div>
              </div>
            </div>

            <div className="hero-actions">
              {bookingEnabled ? (
                <Link href="/problem" className="button button-primary big-button">
                  Zarezerwuj 15 minut i odzyskaj spokój w domu
                </Link>
              ) : (
                <a href="#specjalista" className="button button-primary big-button">
                  Zobacz, jak pracuję
                </a>
              )}
              <a href="#jak-to-dziala" className="button button-ghost big-button">
                Jak wygląda rezerwacja
              </a>
            </div>
          </div>

          <div className="panel side-panel hero-aside hero-credentials">
            <div className="hero-photo-card">
              <div className="section-eyebrow">Prowadzący konsultację</div>
              <div className="hero-photo-shell top-gap-small">
                <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} width={960} height={1200} className="hero-photo" priority />
              </div>
              <p className="hero-photo-caption">
                Rozmowę prowadzi {SPECIALIST_NAME}. To nie marketplace i nie losowe przekierowanie do innej osoby po płatności.
              </p>
            </div>

            <div className="credential-mark">
              <div className="credential-copy">
                <div className="section-eyebrow">Kwalifikacje i zaufanie</div>
                <h2>COAPE / CAPBT</h2>
                <p className="muted paragraph-gap">
                  Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne, a profil specjalisty jest publicznie dostępny w
                  katalogu COAPE / CAPBT.
                </p>
              </div>
              <Image
                src="/branding/capbt-polska.png"
                alt="Logo CAPBT Polska, Stowarzyszenie Behawiorystów i Trenerów COAPE"
                width={230}
                height={76}
                className="credential-logo"
              />
            </div>

            <div className="mini-card availability-card">
              <div className="muted">Najbliższy dostępny termin</div>
              <div className="side-title">{nextSlotLabel}</div>
              <ul className="hero-checklist">
                <li>Realny slot z terminarza, nie sztuczny licznik pilności.</li>
                <li>Po płatności od razu dostajesz potwierdzenie i link do rozmowy.</li>
                <li>Jeśli chcesz, przed rozmową dodasz nagranie, link albo notatki.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Spokojny pierwszy krok</div>
              <h2>Bez obietnic z kosmosu. Tylko szybka diagnoza sytuacji i realny następny krok.</h2>
            </div>
            <div className="muted">
              To krótka konsultacja, która porządkuje problem i pokazuje, co robić dalej już po pierwszej rozmowie.
            </div>
          </div>

          <div className="card-grid three-up top-gap">
            <div className="feature-card">
              <div className="simple-title">Jedna rozmowa, jasny plan</div>
              <div className="simple-desc">
                W 15 minut zbieramy najważniejsze informacje i ustalamy pierwszy sensowny kierunek działania.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Płatność i potwierdzenie od razu</div>
              <div className="simple-desc">
                Rezerwujesz termin, kończysz płatność i od razu widzisz potwierdzenie oraz link do rozmowy audio.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Materiały przed rozmową, jeśli chcesz</div>
              <div className="simple-desc">
                Możesz dodać nagranie MP4, link albo notatki, żeby specjalista szybciej zrozumiał Twój przypadek.
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Dla kogo</div>
              <h2>Gdy chcesz szybko uporządkować problem i wiedzieć, co robić dalej</h2>
            </div>
            <div className="muted">To pierwszy, spokojny krok przed pełną konsultacją, planem pracy albo dalszą diagnostyką.</div>
          </div>

          <div className="card-grid three-up top-gap">
            <div className="feature-card">
              <div className="simple-title">Problemy codzienne i nagłe kryzysy</div>
              <div className="simple-desc">Szczekanie, pobudzenie, lęk separacyjny, agresja, kuweta, niszczenie albo napięcie w domu.</div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Jeden temat, jedna decyzja, jeden kierunek</div>
              <div className="simple-desc">
                Wiesz, czy wystarczą pierwsze wskazówki, czy potrzebna jest dalsza praca i jaki powinien być następny krok.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Bez konsultacji wideo i bez rozpraszaczy</div>
              <div className="simple-desc">
                To rozmowa audio. Kamera nie jest potrzebna, ale możesz pokazać problem przez materiały dodane przed spotkaniem.
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="tematy">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Tematy konsultacji</div>
              <h2>Wybierz temat i przejdź do realnie wolnych terminów</h2>
            </div>
            <div className="muted">Każdy temat prowadzi do tej samej konsultacji audio i do tej samej aktualnej ceny dla nowych rezerwacji.</div>
          </div>

          <div className="card-grid three-up top-gap">
            {problemOptions.map((tile) => (
              <Link key={tile.id} href={`/slot?problem=${tile.id}`} className="topic-card">
                <span className="topic-icon-shell">{renderProblemIcon(tile.id)}</span>
                <div className="topic-title">{tile.title}</div>
                <div className="topic-desc">{tile.desc}</div>
                <div className="topic-link">Wybierz temat i termin</div>
              </Link>
            ))}
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
            <div className="specialist-portrait-shell top-gap">
              <Image src={SPECIALIST_PHOTO.src} alt={SPECIALIST_PHOTO.alt} width={1200} height={1778} className="specialist-portrait" />
            </div>
            <div className="list-card top-gap">
              <strong>{SPECIALIST_NAME}</strong>
              <span>
                {SPECIALIST_CREDENTIALS}. {SPECIALIST_LOCATION}. Każdą rozmowę prowadzi osobiście od rezerwacji do wskazania kolejnego kroku.
              </span>
              <span className="specialist-trust-line">{SPECIALIST_TRUST_STATEMENT}</span>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Dlaczego temu zaufać</div>
            <h2>Łączę behawior, wiedzę medyczną i doświadczenie terapeutyczne</h2>
            <div className="specialist-badge-list top-gap">
              <span className="specialist-badge">Behawior</span>
              <span className="specialist-badge">Technik weterynarii</span>
              <span className="specialist-badge">Opiekun medyczny</span>
              <span className="specialist-badge">Dogoterapia</span>
              <span className="specialist-badge">COAPE / CAPBT</span>
            </div>
            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Spójna praca na styku zachowania, zdrowia i terapii</strong>
                <span>
                  Dzięki temu łatwiej szybko ocenić, czy wystarczy pierwszy plan działania, czy potrzebna jest dalsza diagnostyka albo szersza praca.
                </span>
              </div>
              <div className="list-card">
                <strong>COAPE i CAPBT bez ściany logotypów</strong>
                <span>Trzymamy tylko te dwa znaki zaufania i dwa konkretne linki: organizacja oraz profil specjalisty.</span>
                <div className="hero-actions top-gap-small">
                  <a href={COAPE_ORG_URL} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                    COAPE
                  </a>
                  <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                    Profil CAPBT
                  </a>
                </div>
              </div>
              <div className="list-card">
                <strong>Materiały przed rozmową</strong>
                <span>
                  Jeżeli chcesz, przed konsultacją dodasz MP4, link albo notatki. To przyspiesza rozmowę i pomaga wejść od razu w sedno sprawy.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="przypadki">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Realne przypadki</div>
              <h2>Prawdziwe zdjęcia, uczciwe zasady publikacji i miejsce na opinie po konsultacji</h2>
            </div>
            <div className="muted">
              Nie wstawiamy fikcyjnych testimoniali. Po konsultacji klient dostaje link do dodania opinii i sam decyduje, czy zgadza się na publikację historii.
            </div>
          </div>

          <div className="real-case-grid top-gap">
            {REAL_CASE_STUDIES.map((caseStudy) => (
              <article key={caseStudy.id} className="real-case-card">
                <div className="real-case-image-shell">
                  <Image src={caseStudy.imageSrc} alt={caseStudy.imageAlt} width={1200} height={900} className="real-case-image" />
                </div>
                <div className="real-case-copy">
                  <div className="section-eyebrow">Materiał klienta</div>
                  <h3>{caseStudy.problem}</h3>
                  <p>{caseStudy.summary}</p>
                  <div className="real-case-result">
                    <strong>Status publikacji</strong>
                    <span>{caseStudy.effect}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="publikacje">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Publikacje i wzmianki</div>
              <h2>Miejsce pod publikacje jest gotowe na dwa screeny i kolejne potwierdzone materiały</h2>
            </div>
            <div className="muted">Na razie pokazujemy tylko jeden zweryfikowany link i dwa puste sloty, które można później uzupełnić screenami 1:1.</div>
          </div>

          <div className="media-grid top-gap">
            {MEDIA_MENTIONS.map((item) => (
              <article key={item.id} className={`media-card${item.placeholder ? ' media-card-placeholder' : ''}`}>
                <div className="section-eyebrow">{item.placeholder ? 'Slot do uzupełnienia' : 'Zweryfikowana wzmianka'}</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                {item.href && item.cta ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-link top-gap-small">
                    {item.cta}
                  </a>
                ) : null}
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

        <section className="panel cta-panel">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Wybierz temat i termin, a resztę przeprowadzę spokojnie krok po kroku.</h2>
          <p className="hero-text small-width">
            Jeżeli problem zaczyna się ciągnąć, najważniejsze jest dobre otwarcie. Ta konsultacja pomaga szybko ocenić, co zrobić od razu i czy potrzebna jest dalsza, szersza praca.
          </p>
          <div className="hero-actions top-gap">
            <Link href="/problem" className="button button-primary big-button">
              Zarezerwuj 15 minut i odzyskaj spokój w domu
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
