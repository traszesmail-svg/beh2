import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { faq, formatDateTimeLabel, problemOptions, steps } from '@/lib/data'
import { createActiveConsultationPrice, DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { listAvailability, getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
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
  const pricing = dataMode.isValid ? await getActiveConsultationPrice() : createActiveConsultationPrice(DEFAULT_PRICE_PLN)
  const availability = dataMode.isValid ? await listAvailability() : []
  const nextSlot = availability[0]?.slots[0]
  const nextSlotLabel = !dataMode.isValid
    ? 'Brak dostepu do terminarza'
    : nextSlot
      ? formatDateTimeLabel(nextSlot.bookingDate, nextSlot.bookingTime)
      : 'Brak wolnych terminow'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="hero-grid">
          <div className="panel hero-panel hero-surface">
            {!dataMode.isValid ? <div className="error-box">{dataMode.summary}</div> : null}
            <div className="pill">Pierwszy krok przy problemie behawioralnym</div>
            <div className="hero-topline">Krotka konsultacja glosowa, ktora pomaga szybko uporzadkowac sytuacje i wybrac dobry nastepny krok.</div>
            <h1>
              Szybka pomoc behawioralna. <span>15 minut i pierwszy konkretny plan.</span>
            </h1>
            <p className="hero-text">
              Behawior 15 to platna z gory konsultacja glosowa online prowadzona przez Krzysztofa Regulskiego, tech.wet., behawioryste zwierzecego i trenera COAPE. W jednej krotkiej rozmowie porzadkujesz problem, uspokajasz chaos i dostajesz pierwszy sensowny kierunek dzialania.
            </p>

            <div className="hero-note-row">
              <span className="trust-chip">Rozmowa audio, bez instalacji</span>
              <span className="trust-chip">Jeden specjalista od poczatku do konca</span>
              <span className="trust-chip">Psy i koty</span>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Czas</div>
                <div className="stat-value">15 min</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Cena</div>
                <div className="stat-value">{pricing.formattedAmount}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Format</div>
                <div className="stat-value">Audio online</div>
              </div>
            </div>

            <div className="hero-actions">
              <Link href="/problem" className="button button-primary big-button">
                Sprawdz wolne terminy
              </Link>
              <a href="#jak-to-dziala" className="button button-ghost big-button">
                Zobacz jak to wyglada
              </a>
            </div>
          </div>

          <div className="panel side-panel hero-aside hero-credentials">
            <div className="credential-mark">
              <div className="credential-copy">
                <div className="section-eyebrow">Kwalifikacje</div>
                <h2>COAPE / CAPBT</h2>
              </div>
              <Image
                src="/branding/capbt-polska.png"
                alt="Logo CAPBT Polska, Stowarzyszenie Behawiorystow i Trenerow COAPE"
                width={230}
                height={76}
                className="credential-logo"
              />
            </div>

            <div className="mini-card specialist-card">
              <div className="muted">Specjalista prowadzacy</div>
              <div className="side-title">Krzysztof Regulski, tech.wet.</div>
              <div className="accent-text">
                Behawiorysta zwierzecy i trener COAPE. Pracuje z trudnymi przypadkami psow i kotow, laczac spojrzenie
                behawioralne z wiedza technika weterynarii.
              </div>
              <a
                href="https://behawioryscicoape.pl/behawiorysta/Regulski"
                target="_blank"
                rel="noreferrer"
                className="text-link top-gap-small"
              >
                Zobacz profil w katalogu COAPE / CAPBT
              </a>
            </div>

            <div className="mini-card availability-card">
              <div className="muted">Najblizszy wolny termin</div>
              <div className="side-title">{nextSlotLabel}</div>
              <ul className="hero-checklist">
                <li>Pierwsza ocena sytuacji i uspokojenie chaosu informacyjnego</li>
                <li>Wstepne wskazowki do wdrozenia jeszcze tego samego dnia</li>
                <li>Decyzja, czy potrzebna jest pelna konsultacja lub plan pracy</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Dla kogo jest ta usluga</div>
              <h2>Gdy potrzebujesz szybkiego, profesjonalnego pierwszego kroku</h2>
            </div>
            <div className="muted">Bez przeciagania decyzji i bez zgadywania, od czego zaczac.</div>
          </div>
          <div className="card-grid three-up top-gap">
            <div className="feature-card">
              <div className="simple-title">Dla opiekunow psow i kotow</div>
              <div className="simple-desc">Problemy domowe, napiecie, agresja, trudnosci separacyjne, pobudzenie, kuweta albo relacje z otoczeniem.</div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Dla osob, ktore chca szybko ruszyc dalej</div>
              <div className="simple-desc">W 15 minut porzadkujesz sytuacje i dostajesz pierwszy kierunek, zamiast tygodniami szukac sprzecznych porad.</div>
            </div>
            <div className="feature-card">
              <div className="simple-title">Dla tych, ktorzy chca wiedziec, co potem</div>
              <div className="simple-desc">Jesli potrzeba wiecej pracy, kolejnym krokiem moze byc pelna konsultacja, plan zachowan albo dalsze wsparcie.</div>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Tematy konsultacji</div>
              <h2>Wybierz temat, od ktorego chcesz zaczac</h2>
            </div>
            <div className="muted">Kazdy temat prowadzi od razu do realnie wolnych terminow i tej samej 15-minutowej rozmowy audio.</div>
          </div>
          <div className="card-grid three-up">
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
          <div className="section-eyebrow">Jak to dziala</div>
          <h2>Prosty proces, bez niejasnosci i bez instalowania dodatkowych narzedzi</h2>
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

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">O specjaliscie</div>
            <h2>Krzysztof Regulski, tech.wet., behawiorysta zwierzecy i trener COAPE</h2>
            <p className="muted paragraph-gap">Olsztyn, woj. warminsko-mazurskie</p>
            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Praca z trudnymi przypadkami</strong>
                <span>Na co dzien pracuje z psami i kotami z trudnymi problemami behawioralnymi, w tym z agresja, napieciem i zaburzonymi relacjami.</span>
              </div>
              <div className="list-card">
                <strong>Polaczenie wiedzy behawioralnej i weterynaryjnej</strong>
                <span>Jako technik weterynarii laczy spojrzenie behawioralne z medycznym, co pomaga lepiej ocenic sytuacje i zaplanowac dalsze kroki.</span>
              </div>
              <div className="list-card">
                <strong>Jedna osoba, jedna odpowiedzialnosc</strong>
                <span>Konsultacja trafia do jednego specjalisty. To nie marketplace ani losowy system przekierowan.</span>
              </div>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Przed rozmowa</div>
            <h2>Co warto przygotowac</h2>
            <div className="stack-gap top-gap">
              <div className="list-card">
                <strong>Krotki opis sytuacji</strong>
                <span>Zastanow sie, kiedy problem wystepuje najczesciej i co go nasila.</span>
              </div>
              <div className="list-card">
                <strong>Najwazniejsze pytanie</strong>
                <span>W 15 minut najlepiej sprawdza sie jedna glowna trudnosc albo decyzja, ktora chcesz podjac.</span>
              </div>
              <div className="list-card">
                <strong>Spokojne miejsce do rozmowy</strong>
                <span>To konsultacja glosowa. Kamera nie jest potrzebna, ale dobrze miec chwile spokoju i notatki pod reka.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">FAQ</div>
          <h2>Najczestsze pytania przed pierwsza konsultacja</h2>
          <div className="stack-gap top-gap">
            {faq.map((item) => (
              <div key={item.q} className="list-card">
                <strong>{item.q}</strong>
                <span>{item.a}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel cta-panel">
          <div className="section-eyebrow">Pierwszy krok</div>
          <h2>Jesli chcesz szybko uporzadkowac sytuacje, zacznij od 15-minutowej konsultacji glosowej</h2>
          <p className="hero-text small-width">
            To spokojny, konkretny pierwszy kontakt, po ktorym od razu wiesz, czy wystarcza proste wskazowki, czy warto
            przejsc do pelnej konsultacji albo dalszego planu pracy.
          </p>
          <div className="hero-actions top-gap">
            <Link href="/problem" className="button button-primary big-button">
              Umow konsultacje
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
