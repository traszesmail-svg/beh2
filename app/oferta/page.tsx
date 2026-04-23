import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { PriceDisplay } from '@/components/PriceDisplay'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { OFFERS } from '@/lib/offers'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { buildMarketingMetadata } from '@/lib/seo'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Oferta: behawiorysta online dla psa i kota',
  path: '/oferta',
  description: 'Aktualna oferta publiczna: Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl z diagnoza oraz 7 dniami wsparcia tekstowego przez WhatsApp. Priorytetowy wariant pojawia sie przy rezerwacji Kwadransu.',
})

const SERVICE_COMPARISON_ROWS = [
  {
    label: 'Najlepszy wybor, gdy',
    quick: 'masz jedno pytanie, chcesz sprawdzic pierwszy ruch albo nie wiesz jeszcze, jak szeroki jest temat',
    full: 'problem trwa dluzej, wraca albo obejmuje kilka obszarow naraz i potrzebujesz diagnozy oraz szerszego uporzadkowania',
  },
  {
    label: 'Format rozmowy',
    quick: '15 minut audio bez kamery i bez rozbudowanego wejscia',
    full: '60 minut rozmowy online + 7 dni konsultacji tekstowych przez WhatsApp',
  },
  {
    label: 'Po rozmowie wychodzisz z',
    quick: 'jasnym priorytetem i decyzja, jaki powinien byc pierwszy krok',
    full: 'diagnoza, planem poprawy i mozliwoscia konsultowania wdrozenia przez 7 dni',
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
      console.warn('[behawior15][oferta] nie udalo sie pobrac aktywnej ceny konsultacji', error)
    }
  }

  const quickStartOffer = OFFERS.find((offer) => offer.slug === 'szybka-konsultacja-15-min') ?? null
  const bridgeOffer = OFFERS.find((offer) => offer.slug === 'konsultacja-30-min') ?? null
  const fullConsultationOffer = OFFERS.find((offer) => offer.slug === 'konsultacja-behawioralna-online') ?? null
  const quickStartHref = buildBookHref()
  const fullConsultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const contactHref = '/kontakt#formularz'

  return (
    <NotatnikPageShell
      tag="Oferta / start i porownanie"
      navItems={PUBLIC_SITE_NAV_ITEMS}
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
              <h1>Trzy glowne uslugi, jedna jasna logika wyboru: start, szersze uporzadkowanie albo pelna konsultacja.</h1>
              <p className="hero-text">
                Publicznie zostaja trzy czytelne wejscia: Kwadrans z behawiorysta, Dwa kwadranse i Pelna konsultacja behawioralna. Priorytetowy wariant pojawia sie dopiero przy rezerwacji Kwadransu.
              </p>

              <div className="hero-actions top-gap">
                <Link href={quickStartHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="/cennik" prefetch={false} className="button button-ghost big-button">
                  Zobacz cennik
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jesli temat jest zlozony i wiesz, ze potrzebujesz szerszego wejscia, wybierz{' '}
                <Link href={fullConsultationHref} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation.toLowerCase()}
                </Link>
                . Jesli nie rezerwujesz od razu, uzyj{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  krotkiej wiadomosci
                </Link>
                .
              </p>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Jak zaczac</span>
              <strong>Kwadrans z behawiorysta sprawdza sie na start. Dwa kwadranse sa pomostem, a Pelna konsultacja daje diagnoze i wsparcie wdrozenia.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min / {quickStartPriceAmount} zl</span>
                  <strong>Start</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>30 min / 169 zl</span>
                  <strong>Pomost</strong>
                </div>
              <div className="offer-page-hero-stat">
                <span>60 min / 470 zl</span>
                <strong>Diagnoza + 7 dni</strong>
              </div>
              </div>
              <p className="muted top-gap-small">Priorytetowy wariant pojawia sie dopiero przy rezerwacji Kwadransu, nie jako osobna glowna usluga.</p>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Aktywna oferta</div>
              <h2>Trzy glowne wejscia</h2>
            </div>
            <p className="editorial-section-lead">Czas i cena sa widoczne przed rezerwacja. 69 zl jest najprostszym startem, 169 zl porzadkuje temat szerzej, a 470 zl daje diagnoze i 7 dni wsparcia po rozmowie. Priorytetowy wariant pojawia sie dopiero przy Kwadransie.</p>
          </div>

          <div className="card-grid three-up top-gap">
            {quickStartOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{quickStartOffer.eyebrow}</div>
                <h3>{quickStartOffer.title}</h3>
                <p>{quickStartOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry uslugi">
                  <span>15 min</span>
                  <span>
                    <PriceDisplay amount={quickStartPriceAmount} />
                  </span>
                  <span>cena wejscia</span>
                </div>
                <p className="muted">{quickStartOffer.whenToChoose}</p>
                <p className="muted">Jesli po wyborze terminu zalezy Ci na szybszym wejsciu, przy Kwadransie moze byc dostepny wariant priorytetowy.</p>
                <div className="hero-actions top-gap-small">
                  <Link href={quickStartOffer.primaryHref} prefetch={false} className="button button-primary">
                    {quickStartOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {bridgeOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{bridgeOffer.eyebrow}</div>
                <h3>{bridgeOffer.title}</h3>
                <p>{bridgeOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry uslugi">
                  <span>30 min</span>
                  <span>169 zl</span>
                  <span>pomost</span>
                </div>
                <p className="muted">{bridgeOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={bridgeOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {bridgeOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {fullConsultationOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{fullConsultationOffer.eyebrow}</div>
                <h3>{fullConsultationOffer.title}</h3>
                <p>{fullConsultationOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry uslugi premium">
                  <span>60 min</span>
                  <span>470 zl</span>
                  <span>diagnoza + 7 dni WhatsApp</span>
                </div>
                <p className="muted">{fullConsultationOffer.whenToChoose}</p>
                <div className="hero-actions top-gap-small">
                  <Link href={fullConsultationOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {FUNNEL_CTA_LABELS.consultation}
                  </Link>
                </div>
              </article>
            ) : null}
          </div>

          <p className="muted top-gap-small">Niezbednik zostaje materialem pomocniczym, a glowna drabinka sprzedazowa na tej stronie to trzy formaty: 69 / 169 / 470. Priorytetowy wariant Kwadransu pojawia sie dopiero przy rezerwacji.</p>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wybor uslugi</div>
              <h2>Kwadrans czy Pelna konsultacja</h2>
            </div>
            <p className="editorial-section-lead">
              Jesli chcesz po prostu dobrze wybrac, najbezpieczniej zaczac od Kwadransu. Pelna konsultacja ma sens wtedy, gdy juz
              wiesz, ze temat jest szerszy i potrzebuje wiekszej ilosci czasu oraz wsparcia wdrozenia.
            </p>
          </div>

          <div className="premium-two-column-grid top-gap">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kwadrans z behawiorysta</div>
              <h3>Najprostszy pierwszy krok</h3>
              <ul className="premium-bullet-list">
                <li>15 minut rozmowy audio bez kamery</li>
                <li>jedno pytanie albo pierwszy kontakt z tematem</li>
                <li>uporzadkowanie priorytetu i decyzja, co robic dalej</li>
                <li>dobry wybor, gdy nie chcesz placic za szerszy start, zanim poznasz skale problemu</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={quickStartHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Pelna konsultacja</div>
              <h3>Szersze wejscie w problem</h3>
              <ul className="premium-bullet-list">
                <li>60 minut rozmowy online audio lub video</li>
                <li>diagnoza sytuacji i plan poprawy po rozmowie</li>
                <li>7 dni konsultacji tekstowych przez WhatsApp z mozliwoscia wysylania pytan i filmow</li>
                <li>lepszy wybor przy tematach przewleklych, zlozonych albo wracajacych</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={fullConsultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Najkrotsza zasada wyboru</strong>
              <span>69 zl wybierz, gdy chcesz najprostszy start. 169 zl wybierz, gdy 15 minut to za malo. 470 zl wybierz, gdy temat jest zlozony i chcesz diagnozy oraz 7 dni wsparcia po rozmowie. Priorytetowy wariant pojawia sie dopiero przy rezerwacji Kwadransu.</span>
          </div>

          <div className="top-gap">
            {SERVICE_COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="summary-card tree-backed-card top-gap-small">
                <div className="section-eyebrow">{row.label}</div>
                <div className="premium-two-column-grid">
                  <div>
                    <strong>Kwadrans z behawiorysta</strong>
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
                  <strong>Kwadrans z behawiorysta</strong>
                  <p>
                    <PriceDisplay amount={quickStartPriceAmount} />
                  </p>
                </div>
                <div>
                  <strong>Pelna konsultacja</strong>
                  <p>470 zl</p>
                </div>
              </div>
            </div>
          </div>

          <p className="muted top-gap-small">
            Jesli nadal chcesz tylko doprecyzowac, od czego zaczac, uzyj{' '}
            <Link href={contactHref} prefetch={false} className="prep-inline-link">
              krotkiej wiadomosci
            </Link>
            . Nie trzeba zgadywac idealnego formatu juz przy pierwszym wejsciu.
          </p>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
