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
    'Oferta: Kwadrans 69 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł. Kwadrans to pierwszy krok, a Pełna konsultacja daje diagnozę i 7 dni wsparcia przez WhatsApp.',
})

export default async function OfferPage() {
  const dataMode = getDataModeStatus()
  let quickStartPriceAmount = DEFAULT_PRICE_PLN

  if (dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      quickStartPriceAmount = quickConsultationPrice.amount
    } catch (error) {
      console.warn('[regulski-behawiorysta][oferta] nie udało się pobrac aktywnej ceny konsultacji', error)
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
                Trzy główne usługi i jedna logika wyboru. Kwadrans jest najprostszym pierwszym krokiem, 30 minut daje szersze uporządkowanie tematu, a
                pełna konsultacja służy sprawom złożonym i przewlekłym.
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
                Jeśli temat jest złożony i wiesz, że potrzebujesz szerszego wejścia, przejdź niżej do pełnej konsultacji. Jeśli nie rezerwujesz od razu,
                napisz krótką wiadomość.
              </p>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Jak zacząć</span>
              <strong>15-minutowa konsultacja behawioralna to najprostszy start. Dwa kwadranse porządkują temat szerzej, a Pełna konsultacja daje diagnozę i wsparcie wdrożenia.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min / {quickStartPriceAmount} zł</span>
                  <strong>Start</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>30 min / 169 zł</span>
                  <strong>Szerszy zakres</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>470 zł / pełny zakres</span>
                  <strong>Diagnoza + 7 dni</strong>
                </div>
              </div>
              <p className="muted top-gap-small">Priorytetowy wariant pojawia się dopiero przy rezerwacji Kwadransu, nie jako osobna główna usługa.</p>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <NotatnikSectionHead index="I." kicker="Aktywna oferta" title="Trzy główne wejścia." />
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
                  <span>jedno pytanie albo pierwszy porządek w temacie</span>
                </div>
                <p className="muted">{quickStartOffer.whenToChoose}</p>
                <p className="muted">Jeśli potrzebujesz szybkiego terminu, dostępny jest Kwadrans na już (99 zł) - termin potwierdzany do 15 minut od wpłaty.</p>
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
                  <span className="offer-price">169 zł</span>
                </div>
                <p className="offer-card-summary">{bridgeOffer.cardSummary}</p>
                <div className="offer-card-meta">
                  <span>30 min online</span>
                  <span>2-3 wątki</span>
                </div>
                <div className="offer-card-meta">
                  <span>szerszy start</span>
                  <span>gdy 15 minut to za mało</span>
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
                    <div className="section-eyebrow">Pełna konsultacja</div>
                    <h3>Konsultacja behawioralna online</h3>
                  </div>
                  <span className="offer-price">470 zł</span>
                </div>
                <p className="offer-card-summary">{fullConsultationOffer.cardSummary}</p>
                <div className="offer-card-meta">
                  <span>pełny zakres online</span>
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
          <NotatnikSectionHead index="II." kicker="Wybór przed rezerwacją" title="Jedna zasada wyboru przed rezerwacją." />
          <div className="notatnik-quiet-grid">
            <article className="notatnik-quiet-card">
              <h3>69 zł</h3>
              <p>Wybierz, gdy chcesz najprostszy start, jedno pytanie albo pierwsze uporządkowanie sytuacji.</p>
            </article>
            <article className="notatnik-quiet-card">
              <h3>169 zł</h3>
              <p>Wybierz, gdy 15 minut to za mało i potrzebujesz spokojniej przejść przez szerszy temat.</p>
            </article>
            <article className="notatnik-quiet-card">
              <h3>470 zł</h3>
              <p>Wybierz, gdy sprawa jest złożona, wraca albo od razu potrzebujesz diagnozy, planu i wsparcia wdrożenia.</p>
            </article>
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Chcesz wejść lżej?</strong>
            <span>
              Niezbędnik zostaje materiałem pomocniczym, a nie główną usługą. Jeśli chcesz najpierw zobaczyć materiały, przejdź do{' '}
              <Link href="/niezbednik" prefetch={false} className="prep-inline-link">
                Niezbędnika
              </Link>
              .
            </span>
          </div>
        </section>

        <NotatnikFinalCta
          title="Zacznij od formatu, który <em>pasuje do skali problemu.</em>"
          copy="Jeśli nadal nie masz pewnosci, zacznij od Kwadransu. To dalej najbezpieczniejszy pierwszy ruch."
          primaryHref={quickStartHref}
          primaryLabel="Zarezerwuj Kwadrans"
          secondaryHref={contactHref}
          secondaryLabel="Kontakt"
        />
      </div>
    </NotatnikPageShell>
  )
}
