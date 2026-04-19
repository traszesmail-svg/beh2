import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
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
  description: 'Aktualna oferta publiczna: Kwadrans z behawiorystą jako najprostszy start, konsultacja 60 min jako szersza opcja i Niezbędnik dla osób, które chcą najpierw uporządkować temat.',
})

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
  const fullConsultationOffer = OFFERS.find((offer) => offer.slug === 'konsultacja-behawioralna-online') ?? null
  const essentialsOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf') ?? null

  return (
    <main className="page-wrap marketing-page">
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface offer-page-panel visual-scan-page">
          <div className="offer-page-hero-grid">
            <div className="offer-page-hero-copy">
              <div className="section-eyebrow">Oferta</div>
              <h1>Najprostszy start to Kwadrans z behawiorystą. Konsultacja 60 min zostaje szerszą opcją, a Niezbędnik pomaga spokojnie uporządkować temat.</h1>
              <p className="hero-text">
                Publicznie zostają trzy czytelne wejścia: Kwadrans z behawiorystą, konsultacja online 60 min i Niezbędnik dla osób, które chcą najpierw wrócić do materiałów.
              </p>

              <div className="hero-actions top-gap">
                <Link href={buildBookHref()} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="/niezbednik" prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jeśli temat jest złożony i wiesz, że potrzebujesz szerszego wejścia, wybierz{' '}
                <Link href={buildBookHref(null, 'konsultacja-behawioralna-online')} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation.toLowerCase()}
                </Link>
                . Jeśli nie rezerwujesz od razu, użyj{' '}
                <Link href="/kontakt#formularz" prefetch={false} className="prep-inline-link">
                  krótkiej wiadomości
                </Link>
                .
              </p>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Jak zacząć</span>
              <strong>Kwadrans z behawiorystą sprawdza się na start. Konsultacja 60 min jest dla tematów szerszych, a Niezbędnik pomaga spokojnie przygotować się do rozmowy.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min / {quickStartPriceAmount} zł</span>
                  <strong>Najprostszy start</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>60 min / 350 zł</span>
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

            {fullConsultationOffer ? (
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">{fullConsultationOffer.eyebrow}</div>
                <h3>{fullConsultationOffer.title}</h3>
                <p>{fullConsultationOffer.cardSummary}</p>
                <div className="editorial-hero-meta" aria-label="Parametry usługi">
                  <span>60 min</span>
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

        <Footer
          variant="home"
          ctaHref={buildBookHref()}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
