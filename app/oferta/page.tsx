import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { PriceDisplay } from '@/components/PriceDisplay'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { buildBookHref } from '@/lib/booking-routing'
import { getOfferDetailHref, OFFERS } from '@/lib/offers'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { buildMarketingMetadata } from '@/lib/seo'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Oferta: behawiorysta online dla psa i kota',
  path: '/oferta',
  description: 'Aktualna oferta publiczna: Kwadrans z behawiorysta jako najprostszy start, Dwa kwadranse jako etap posredni, pelna konsultacja behawioralna jako najszersza opcja i Niezbednik dla osob, ktore chca najpierw uporzadkowac temat.',
})

const SERVICE_COMPARISON_ROWS = [
  {
    label: 'Najlepszy wybór, gdy',
    quick: 'masz jedno pytanie, chcesz sprawdzić pierwszy ruch albo nie wiesz jeszcze, jak szeroki jest temat',
    full: 'problem trwa dłużej, wraca albo obejmuje kilka obszarów naraz i potrzebujesz szerszego uporządkowania',
  },
  {
    label: 'Format rozmowy',
    quick: '15 minut audio bez kamery i bez rozbudowanego wejścia',
    full: 'ok. 2 h online z wieksza iloscia czasu na kontekst, pytania i plan',
  },
  {
    label: 'Po rozmowie wychodzisz z',
    quick: 'jasnym priorytetem i decyzją, jaki powinien być pierwszy krok',
    full: 'szerszym planem działania i podsumowaniem pisemnym po konsultacji',
  },
] as const

export default async function OfferPage() {
  const dataMode = getDataModeStatus()
  let quickStartPriceAmount = DEFAULT_PRICE_PLN

  if (dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      quickStartPriceAmount = quickConsultationPrice.amount
    } catch (error) {
      console.warn('[behawior15][oferta] nie udało się pobrać aktywnej ceny konsultacji', error)
    }
  }

  const quickStartOffer = OFFERS.find((offer) => offer.slug === 'szybka-konsultacja-15-min') ?? null
  const urgentOffer = OFFERS.find((offer) => offer.slug === 'kwadrans-na-juz') ?? null
  const fullConsultationOffer = OFFERS.find((offer) => offer.slug === 'konsultacja-behawioralna-online') ?? null
  const essentialsOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf') ?? null
  const quickStartHref = buildBookHref()
  const fullConsultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const contactHref = '/kontakt#formularz'

  return (
    <NotatnikPageShell
      tag="Oferta / start i porownanie"
      navItems={[
        { href: '/psy', label: 'Pies' },
        { href: '/koty', label: 'Kot' },
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/o-mnie', label: 'O mnie' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={quickStartHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={quickStartHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <div className="container">

        <section className="panel section-panel hero-surface offer-page-panel visual-scan-page">
          <div className="offer-page-hero-grid">
            <div className="offer-page-hero-copy">
              <div className="section-eyebrow">Oferta</div>
              <h1>Najprostszy start to Kwadrans z behawiorysta. Dwa kwadranse sa etapem posrednim, a pelna konsultacja behawioralna zostaje najszersza opcja.</h1>
              <p className="hero-text">
                Publicznie zostaja cztery czytelne wejscia: Kwadrans z behawiorysta, Dwa kwadranse, pelna konsultacja behawioralna i Niezbednik dla osob, ktore chca najpierw wrocic do materialow.
              </p>

              <div className="hero-actions top-gap">
                <Link href={quickStartHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="/niezbednik" prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jeśli temat jest złożony i wiesz, że potrzebujesz szerszego wejścia, wybierz{' '}
                <Link href={fullConsultationHref} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation.toLowerCase()}
                </Link>
                . Jeśli nie rezerwujesz od razu, użyj{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  krótkiej wiadomości
                </Link>
                .
              </p>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Jak zacząć</span>
              <strong>Kwadrans z behawiorysta sprawdza sie na start. Dwa kwadranse sa etapem posrednim, a pelna konsultacja behawioralna jest dla tematow najszerszych.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min / {quickStartPriceAmount} zł</span>
                  <strong>Najprostszy start</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>ok. 2 h / 350 zl</span>
                  <strong>Szersza opcja</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>Niezbędnik</span>
                  <strong>Materiały na start</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Aktywna oferta</div>
              <h2>Trzy czytelne sposoby rozpoczęcia</h2>
            </div>
            <p className="editorial-section-lead">Czas i cena są widoczne przed rezerwacją, a najlżejszy pierwszy krok pozostaje na pierwszym miejscu.</p>
          </div>

          <div className="card-grid three-up top-gap">
            {quickStartOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{quickStartOffer.eyebrow}</div>
                <h3>{quickStartOffer.title}</h3>
                <p>{quickStartOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry usługi">
                  <span>15 min</span>
                  <span>
                    <PriceDisplay amount={quickStartPriceAmount} />
                  </span>
                  <span>bez kamery</span>
                </div>
                <p className="muted">{quickStartOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={quickStartOffer.primaryHref} prefetch={false} className="button button-primary">
                    {quickStartOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {urgentOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{urgentOffer.eyebrow}</div>
                <h3>{urgentOffer.title}</h3>
                <p>{urgentOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry uslugi">
                  <span>preferowana data</span>
                  <span>preferowana godzina</span>
                  <span>odpowiedz mailowa</span>
                </div>
                <p className="muted">{urgentOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={urgentOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {urgentOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {fullConsultationOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{fullConsultationOffer.eyebrow}</div>
                <h3>{fullConsultationOffer.title}</h3>
                <p>{fullConsultationOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry usługi">
                  <span>ok. 2 h</span>
                  <span>350 zł</span>
                  <span>ograniczona dostępność</span>
                </div>
                <p className="muted">{fullConsultationOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={fullConsultationOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {FUNNEL_CTA_LABELS.consultation}
                  </Link>
                </div>
              </article>
            ) : null}

            {essentialsOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{essentialsOffer.eyebrow}</div>
                <h3>{essentialsOffer.title}</h3>
                <p>{essentialsOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry ścieżki pomocniczej">
                  <span>PDF-y</span>
                  <span>książki</span>
                  <span>rekomendacje</span>
                </div>
                <p className="muted">{essentialsOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={getOfferDetailHref(essentialsOffer)} prefetch={false} className="button button-ghost">
                    {FUNNEL_CTA_LABELS.secondary}
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wybór usługi</div>
              <h2>Kwadrans czy pelna konsultacja</h2>
            </div>
            <p className="editorial-section-lead">
              Jesli chcesz po prostu dobrze wybrac, najbezpieczniej zaczac od Kwadransu. Pelna konsultacja ma sens wtedy, gdy juz
              wiesz, ze temat jest szerszy i potrzebuje wiekszej ilosci czasu.
            </p>
          </div>

          <div className="premium-two-column-grid top-gap">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kwadrans z behawiorystą</div>
              <h3>Najprostszy pierwszy krok</h3>
              <ul className="premium-bullet-list">
                <li>15 minut rozmowy audio bez kamery</li>
                <li>jedno pytanie albo pierwszy kontakt z tematem</li>
                <li>uporządkowanie priorytetu i decyzja, co robić dalej</li>
                <li>dobry wybór, gdy nie chcesz przepłacać za zbyt szeroki start</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={quickStartHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Pelna konsultacja</div>
              <h3>Szersze wejście w problem</h3>
              <ul className="premium-bullet-list">
                <li>ok. 2 h rozmowy online lacznie</li>
                <li>więcej czasu na kontekst, pytania i kilka wątków naraz</li>
                <li>plan i podsumowanie pisemne po rozmowie</li>
                <li>lepszy wybór przy tematach przewlekłych, złożonych albo wracających</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={fullConsultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Najkrótsza zasada wyboru</strong>
            <span>
              Jesli nie masz pewnosci, zacznij od Kwadransu. Jesli juz teraz wiesz, ze temat jest wielowatkowy albo od dawna nie rusza
              z miejsca, wybierz pelna konsultacje.
            </span>
          </div>

          <div className="top-gap">
            {SERVICE_COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="summary-card tree-backed-card top-gap-small">
                <div className="section-eyebrow">{row.label}</div>
                <div className="premium-two-column-grid">
                  <div>
                    <strong>Kwadrans z behawiorystą</strong>
                    <p>{row.quick}</p>
                  </div>
                  <div>
                    <strong>Pelna konsultacja</strong>
                    <p>{row.full}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="summary-card tree-backed-card top-gap-small">
              <div className="section-eyebrow">Cena</div>
              <div className="premium-two-column-grid">
                <div>
                  <strong>Kwadrans z behawiorystą</strong>
                  <p>
                    <PriceDisplay amount={quickStartPriceAmount} />
                  </p>
                </div>
                <div>
                  <strong>Pelna konsultacja</strong>
                  <p>350 zł</p>
                </div>
              </div>
            </div>
          </div>

          <p className="muted top-gap-small">
            Jeśli nadal chcesz tylko doprecyzować, od czego zacząć, użyj{' '}
            <Link href={contactHref} prefetch={false} className="prep-inline-link">
              krótkiej wiadomości
            </Link>
            . Nie trzeba zgadywać idealnego formatu już przy pierwszym wejściu.
          </p>
        </section>

      </div>
    </NotatnikPageShell>
  )
}
