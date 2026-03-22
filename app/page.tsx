import Image from 'next/image'
import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { faq, formatDateTimeLabel, problemOptions, steps } from '@/lib/data'
import { listAvailability, getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { COAPE_PROFILE_URL, SPECIALIST_CREDENTIALS, SPECIALIST_LOCATION, SPECIALIST_NAME } from '@/lib/site'
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

  if (dataMode.isValid) {
    ;[pricing, availability] = await Promise.all([getActiveConsultationPrice(), listAvailability()])
  }

  const nextSlot = availability[0]?.slots[0]
  const nextSlotLabel = !dataMode.isValid
    ? 'Terminarz chwilowo niedostepny'
    : nextSlot
      ? formatDateTimeLabel(nextSlot.bookingDate, nextSlot.bookingTime)
      : 'Brak wolnych terminow'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="hero-grid" id="oferta">
          <div className="panel hero-panel hero-surface">
            {!dataMode.isValid ? <div className="error-box">{dataMode.summary}</div> : null}

            <div className="pill">15-minutowa konsultacja glosowa online</div>
            <div className="hero-topline">
              Bez chaosu, bez zgadywania i bez zamieniania problemu w tygodnie sprzecznych porad.
            </div>
            <h1>
              Konkretna pomoc behawioralna dla psa lub kota. <span>Jedna rozmowa i jasny pierwszy krok.</span>
            </h1>
            <p className="hero-text">
              Placisz raz, rezerwujesz realny termin i rozmawiasz bezposrednio z jednym specjalista. To krotka, spokojna
              konsultacja audio, ktora pomaga ocenic sytuacje i wybrac najlepszy dalszy ruch.
            </p>

            <div className="hero-note-row">
              <span className="trust-chip">Audio online bez instalacji</span>
              <span className="trust-chip">Psy i koty</span>
              <span className="trust-chip">CAPBT / COAPE</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Czas rozmowy</div>
                <div className="stat-value">15 min</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Aktualna cena</div>
                <div className="stat-value">{pricing?.formattedAmount ?? 'Sprawdz panel danych'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Prowadzacy</div>
                <div className="stat-value">1 specjalista</div>
              </div>
            </div>

            <div className="hero-actions">
              {dataMode.isValid ? (
                <Link href="/problem" className="button button-primary big-button">
                  Sprawdz terminy i zarezerwuj
                </Link>
              ) : (
                <a href="#specjalista" className="button button-primary big-button">
                  Zobacz informacje o specjaliscie
                </a>
              )}
              <a href="#jak-to-dziala" className="button button-ghost big-button">
                Jak to dziala
              </a>
            </div>
          </div>

          <div className="panel side-panel hero-aside hero-credentials">
            <div className="credential-mark">
              <div className="credential-copy">
                <div className="section-eyebrow">Kwalifikacje i zaufanie</div>
                <h2>COAPE / CAPBT</h2>
                <p className="muted paragraph-gap">
                  Profil specjalisty jest publicznie dostepny w katalogu COAPE / CAPBT, bez marketplace i bez losowego
                  przekierowania do innej osoby.
                </p>
              </div>
              <Image
                src="/branding/capbt-polska.png"
                alt="Logo CAPBT Polska, Stowarzyszenie Behawiorystow i Trenerow COAPE"
                width={230}
                height={76}
                className="credential-logo"
              />
            </div>

            <div className="mini-card availability-card">
              <div className="muted">Najblizszy dostepny termin</div>
              <div className="side-title">{nextSlotLabel}</div>
              <ul className="hero-checklist">
                <li>Realny slot z terminarza, nie sztuczny licznik pilnosci.</li>
                <li>Po platnosci od razu dostajesz potwierdzenie i link do rozmowy.</li>
                <li>Jesli chcesz, przed rozmowa dodasz nagranie, link albo notatki.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Dla kogo</div>
              <h2>Gdy chcesz szybko uporzadkowac problem i wiedziec, co robic dalej</h2>
            </div>
            <div className="muted">To pierwszy, spokojny krok przed pelna konsultacja albo planem pracy.</div>
          </div>

          <div className="card-grid three-up top-gap">
            <div className="feature-card">
              <div className="simple-title">Problemy codzienne i nagle kryzysy</div>
              <div className="simple-desc">
                Szczekanie, pobudzenie, lek separacyjny, agresja, kuweta, niszczenie albo napiecie w domu.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Jeden temat, jedna decyzja, jeden kierunek</div>
              <div className="simple-desc">
                W 15 minut porzadkujesz sytuacje i wiesz, czy wystarcza pierwsze wskazowki, czy potrzeba dalszej pracy.
              </div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Bez konsultacji wideo i bez rozpraszaczy</div>
              <div className="simple-desc">
                To rozmowa audio. Kamera nie jest potrzebna, ale mozesz dodac materialy przed rozmowa, zeby lepiej
                pokazac problem.
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="tematy">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Tematy konsultacji</div>
              <h2>Wybierz punkt startowy, a potem przejdz do realnie wolnych terminow</h2>
            </div>
            <div className="muted">Kazdy temat prowadzi do tej samej konsultacji audio i tej samej ceny startowej.</div>
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
              <div className="section-eyebrow">Jak to dziala</div>
              <h2>Prosto: temat, termin, platnosc, rozmowa</h2>
            </div>
            <div className="muted">Bez osobnych rozmow wstepnych, bez czekania na oddzwonienie i bez rozbudowanego onboardingu.</div>
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
            <div className="section-eyebrow">Specjalista prowadzacy</div>
            <div className="specialist-portrait-shell top-gap">
              <Image
                src="/branding/specialist-placeholder.svg"
                alt="Portret specjalisty Behawior 15"
                width={720}
                height={840}
                className="specialist-portrait"
              />
            </div>
            <div className="list-card top-gap">
              <strong>{SPECIALIST_NAME}</strong>
              <span>
                {SPECIALIST_CREDENTIALS}. {SPECIALIST_LOCATION}. Prowadzi kazda rozmowe osobiscie od rezerwacji do
                rekomendacji kolejnego kroku.
              </span>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Dlaczego temu zaufac</div>
            <h2>Jedna osoba, jedna odpowiedzialnosc i realne kwalifikacje</h2>
            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Behawior i weterynaria w jednym obrazie sytuacji</strong>
                <span>
                  To spojrzenie laczace prace behawioralna z doswiadczeniem technika weterynarii, co pomaga szybciej
                  wychwycic, kiedy problem wymaga dalszej diagnostyki albo planu pracy.
                </span>
              </div>
              <div className="list-card">
                <strong>COAPE / CAPBT</strong>
                <span>
                  Profil specjalisty jest dostepny w katalogu COAPE / CAPBT. To publiczny punkt weryfikacji kwalifikacji
                  i zakresu pracy.
                </span>
                <a href={COAPE_PROFILE_URL} target="_blank" rel="noreferrer" className="text-link top-gap-small">
                  Otworz profil COAPE / CAPBT
                </a>
              </div>
              <div className="list-card">
                <strong>Rozmowa przygotowana pod Twoj przypadek</strong>
                <span>
                  Jesli chcesz, przed rozmowa dodasz krotkie nagranie MP4, link albo notatki. To nie jest konsultacja
                  wideo, ale bardzo pomaga szybciej zrozumiec sytuacje.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel" id="faq">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">FAQ</div>
              <h2>Najczestsze pytania przed pierwsza rozmowa</h2>
            </div>
            <div className="muted">Krotkie odpowiedzi na to, co zwykle blokuje decyzje o rezerwacji.</div>
          </div>
          <FaqAccordion items={faq} />
        </section>

        <section className="panel cta-panel">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Zacznij od 15 minut rozmowy, ktora porzadkuje sytuacje i daje kierunek.</h2>
          <p className="hero-text small-width">
            Jesli problem zaczyna sie ciagnac, najwazniejsze jest dobre otwarcie. Ta konsultacja pomaga szybko ocenic,
            co robic od razu i czy potrzebna jest dalsza, szersza praca.
          </p>
          <div className="hero-actions top-gap">
            <Link href="/problem" className="button button-primary big-button">
              Umow konsultacje
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
