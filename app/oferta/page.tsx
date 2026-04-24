import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
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
  description:
    'Aktualna oferta publiczna: Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl z diagnoza oraz 7 dniami wsparcia tekstowego przez WhatsApp. Priorytetowy wariant pojawia sie przy rezerwacji Kwadransu.',
})

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
      <div className="container editorial-stack">
        <section className="panel section-panel hero-surface offer-page-panel visual-scan-page">
          <div className="offer-page-hero-grid">
            <div className="offer-page-hero-copy">
              <div className="section-eyebrow">Oferta</div>
              <h1>Wybierz start dla swojej sytuacji.</h1>
              <p className="hero-text">
                Trzy glowne uslugi i jedna logika wyboru. Kwadrans jest najprostszym pierwszym krokiem, 30 minut daje szersze uporzadkowanie tematu, a
                pelna konsultacja sluzy sprawom zlozonym i przewleklym.
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
                  pelna konsultacje
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
              <strong>Kwadrans z behawiorysta sprawdza sie na start. Dwa kwadranse porzadkuja temat szerzej, a Pelna konsultacja daje diagnoze i wsparcie wdrozenia.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min / {quickStartPriceAmount} zl</span>
                  <strong>Start</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>30 min / 169 zl</span>
                  <strong>Szerszy zakres</strong>
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
          <NotatnikSectionHead index="I." kicker="Aktywna oferta" title="Trzy glowne wejscia." />
          <div className="card-grid three-up top-gap">
            {quickStartOffer ? (
              <article className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <div className="section-eyebrow">{quickStartOffer.eyebrow}</div>
                    <h3>{quickStartOffer.title}</h3>
                  </div>
                  <span className="offer-price">
                    <PriceDisplay amount={quickStartPriceAmount} />
                  </span>
                </div>
                <p className="offer-card-summary">{quickStartOffer.cardSummary}</p>
                <div className="offer-card-meta">
                  <span>15 min audio</span>
                  <span>bez kamery</span>
                </div>
                <div className="offer-card-meta">
                  <span>dla startu</span>
                  <span>jedno pytanie albo pierwszy porzadek w temacie</span>
                </div>
                <p className="muted">{quickStartOffer.whenToChoose}</p>
                <p className="muted">Jesli potrzebujesz szybkiego terminu, dostepny jest Kwadrans na juz (99 zl) - termin potwierdzany do 15 minut od wplaty.</p>
                <div className="offer-card-actions top-gap-small">
                  <Link href={quickStartOffer.primaryHref} prefetch={false} className="button button-primary">
                    {quickStartOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {bridgeOffer ? (
              <article className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <div className="section-eyebrow">{bridgeOffer.shortTitle}</div>
                    <h3>Konsultacja 30 min</h3>
                  </div>
                  <span className="offer-price">169 zl</span>
                </div>
                <p className="offer-card-summary">{bridgeOffer.cardSummary}</p>
                <div className="offer-card-meta">
                  <span>30 min online</span>
                  <span>2-3 watki</span>
                </div>
                <div className="offer-card-meta">
                  <span>szerszy start</span>
                  <span>gdy 15 minut to za malo</span>
                </div>
                <p className="muted">{bridgeOffer.whenToChoose}</p>
                <div className="offer-card-actions top-gap-small">
                  <Link href={bridgeOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {bridgeOffer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ) : null}

            {fullConsultationOffer ? (
              <article className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <div className="section-eyebrow">Pelna konsultacja</div>
                    <h3>Konsultacja behawioralna online</h3>
                  </div>
                  <span className="offer-price">470 zl</span>
                </div>
                <p className="offer-card-summary">{fullConsultationOffer.cardSummary}</p>
                <div className="offer-card-meta">
                  <span>60 min online</span>
                  <span>diagnoza + plan</span>
                </div>
                <div className="offer-card-meta">
                  <span>7 dni wsparcia</span>
                  <span>WhatsApp po rozmowie</span>
                </div>
                <p className="muted">{fullConsultationOffer.whenToChoose}</p>
                <div className="offer-card-actions top-gap-small">
                  <Link href={fullConsultationOffer.primaryHref} prefetch={false} className="button button-ghost">
                    {FUNNEL_CTA_LABELS.consultation}
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <NotatnikSectionHead index="II." kicker="Wybor przed rezerwacja" title="Jedna zasada wyboru przed rezerwacja." />
          <div className="notatnik-quiet-grid">
            <article className="notatnik-quiet-card">
              <h3>69 zl</h3>
              <p>Wybierz, gdy chcesz najprostszy start, jedno pytanie albo pierwsze uporzadkowanie sytuacji.</p>
            </article>
            <article className="notatnik-quiet-card">
              <h3>169 zl</h3>
              <p>Wybierz, gdy 15 minut to za malo i potrzebujesz spokojniej przejsc przez szerszy temat.</p>
            </article>
            <article className="notatnik-quiet-card">
              <h3>470 zl</h3>
              <p>Wybierz, gdy sprawa jest zlozona, wraca albo od razu potrzebujesz diagnozy, planu i wsparcia wdrozenia.</p>
            </article>
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Chcesz wejsc lzej?</strong>
            <span>
              Niezbednik zostaje materialem pomocniczym, a nie glowna usluga. Jesli chcesz najpierw zobaczyc materialy, przejdz do{' '}
              <Link href="/niezbednik" prefetch={false} className="prep-inline-link">
                Niezbednika
              </Link>
              .
            </span>
          </div>
        </section>

        <NotatnikFinalCta
          title="Zacznij od formatu, ktory <em>pasuje do skali problemu.</em>"
          copy="Jesli nadal nie masz pewnosci, zacznij od Kwadransu. To dalej najbezpieczniejszy pierwszy ruch."
          primaryHref={quickStartHref}
          primaryLabel="Zarezerwuj Kwadrans ->"
          secondaryHref={contactHref}
          secondaryLabel="Kontakt"
        />
      </div>
    </NotatnikPageShell>
  )
}
