import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getOfferDetailHref, OFFERS } from '@/lib/offers'
import { DEFAULT_PRICE_PLN, formatPricePln } from '@/lib/pricing'
import { listFeaturedPdfGuides, listPdfBundles, listPdfGuides } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Oferta',
  path: '/oferta',
  description: 'Wybierz pierwszy krok: 15 min, 30 min, konsultacja online, wizyta, terapia, pobyt albo PDF.',
})

function getOfferCardAction(offer: (typeof OFFERS)[number]) {
  if (offer.kind === 'booking') {
    return {
      href: offer.primaryHref,
      label: offer.primaryCtaLabel,
    }
  }

  return {
    href: offer.kind === 'resource' ? getOfferDetailHref(offer) : getOfferDetailHref(offer),
    label: offer.detailCtaLabel ?? 'Szczegóły',
  }
}

function renderOfferCard(
  offer: (typeof OFFERS)[number],
  tone: 'primary' | 'secondary' | 'tertiary' = 'secondary',
  quickStartPriceLabel: string | null = null,
) {
  const action = getOfferCardAction(offer)
  const priceLabel =
    offer.slug === 'szybka-konsultacja-15-min' ? quickStartPriceLabel ?? offer.priceLabel ?? 'Po wiadomości' : offer.priceLabel ?? 'Po wiadomości'

  return (
    <article key={offer.slug} className={`offer-card tree-backed-card offer-card-${tone}`} data-offer-tone={tone}>
      <Link href={getOfferDetailHref(offer)} prefetch={false} className="offer-card-media">
        <Image
          src={offer.imageSrc}
          alt={offer.imageAlt}
          width={1200}
          height={900}
          sizes="(max-width: 1100px) 100vw, 30vw"
          className="offer-card-image"
        />
      </Link>

      <div className="offer-card-head">
        <div className="offer-card-copy-block">
          <div className="offer-card-kicker-row">
            <span className="offer-card-kicker">{offer.shortTitle}</span>
            <span className={`offer-price${offer.priceLabel ? '' : ' offer-price-muted'}`}>{priceLabel}</span>
          </div>
          <Link href={getOfferDetailHref(offer)} prefetch={false} className="inline-link">
            <h3>{offer.title}</h3>
          </Link>
        </div>
      </div>

      <p className="offer-card-summary">{offer.cardSummary}</p>

      <div className="offer-card-meta-stack">
        <div className="offer-card-meta">
          <span className="offer-card-meta-label">Kiedy</span>
          <span>{offer.whenToChoose}</span>
        </div>
        <div className="offer-card-meta offer-card-meta-muted">
          <span className="offer-card-meta-label">Dalej</span>
          <span>{offer.nextStep}</span>
        </div>
      </div>

      <div className="offer-card-actions">
        <Link href={action.href} prefetch={false} className="button button-primary">
          {action.label}
        </Link>
      </div>
    </article>
  )
}

export default async function OfferPage() {
  const featuredPdfGuides = listFeaturedPdfGuides()
  const pdfGuideCount = listPdfGuides().length
  const pdfBundleCount = listPdfBundles().length
  const quickStartOffer = OFFERS.find((offer) => offer.slug === 'szybka-konsultacja-15-min') ?? null
  const dataMode = getDataModeStatus()
  let quickStartPriceLabel = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}`

  if (dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      quickStartPriceLabel = `Od ${formatPricePln(quickConsultationPrice.amount)}`
    } catch (error) {
      console.warn('[behawior15][oferta] nie udalo sie pobrac aktywnej ceny konsultacji', error)
    }
  }
  const moreTimeOffers = OFFERS.filter((offer) =>
    ['konsultacja-30-min', 'konsultacja-behawioralna-online'].includes(offer.slug),
  )
  const furtherOffers = OFFERS.filter((offer) =>
    ['konsultacja-domowa-wyjazdowa', 'indywidualna-terapia-behawioralna', 'pobyty-socjalizacyjno-terapeutyczne'].includes(
      offer.slug,
    ),
  )
  const pdfOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf')

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface offer-page-panel visual-scan-page">
          <div className="offer-page-hero-grid">
            <div className="offer-page-hero-copy">
              <div className="section-eyebrow">Oferta</div>
              <h1>Wybierz start dla swojej sytuacji.</h1>
              <p className="hero-text">Na każdej karcie tylko: kiedy to wybrać i co dalej.</p>

              <div className="offer-page-hero-pills" aria-label="Poziomy wejścia">
                <span className="hero-proof-pill">Start szybki</span>
                <span className="hero-proof-pill">Więcej czasu</span>
                <span className="hero-proof-pill">Dalsze opcje</span>
                <span className="hero-proof-pill">PDF osobno</span>
              </div>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Najpierw wybierz poziom wejścia</span>
              <strong>Krótka konsultacja, więcej czasu, dalsze opcje albo osobny materiał PDF.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>Start szybki</span>
                  <strong>1 karta</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>Więcej czasu</span>
                  <strong>{moreTimeOffers.length} ścieżki</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>Dalsze opcje</span>
                  <strong>{furtherOffers.length} kierunki</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>PDF</span>
                  <strong>
                    {pdfGuideCount} + {pdfBundleCount}
                  </strong>
                </div>
              </div>
            </aside>
          </div>

          <div className="offer-page-stack top-gap">
            {quickStartOffer ? (
              <section className="offer-section-block offer-section-block-start">
                <div className="offer-section-head">
                  <div className="offer-section-title-block">
                    <span className="offer-section-marker" aria-hidden="true">
                      01
                    </span>
                    <div>
                      <div className="section-eyebrow offer-section-eyebrow">Start szybki</div>
                      <h2>Najprostszy pierwszy ruch</h2>
                    </div>
                  </div>
                  <p className="offer-section-intro">
                    To najkrótsza droga, jeśli chcesz od razu wejść w termin i sprawdzić, czy szybki start wystarczy.
                  </p>
                </div>

                <div className="offer-grid offer-grid-featured top-gap">{renderOfferCard(quickStartOffer, 'primary', quickStartPriceLabel)}</div>
              </section>
            ) : null}

            <section className="offer-section-block offer-section-block-moretime">
              <div className="offer-section-head">
                <div className="offer-section-title-block">
                  <span className="offer-section-marker" aria-hidden="true">
                    02
                  </span>
                  <div>
                    <div className="section-eyebrow offer-section-eyebrow">Więcej czasu</div>
                    <h2>Gdy temat nie mieści się w szybkim wejściu</h2>
                  </div>
                </div>
                <p className="offer-section-intro">
                  Tu obie droższe usługi prowadzą już do realnej rezerwacji, a nie tylko do samego kontaktu.
                </p>
              </div>

              <div className="offer-grid top-gap offer-grid-balanced">
                {moreTimeOffers.map((offer) => renderOfferCard(offer, 'secondary'))}
              </div>
            </section>

            <section className="offer-section-block offer-section-block-further">
              <div className="offer-section-head">
                <div className="offer-section-title-block">
                  <span className="offer-section-marker" aria-hidden="true">
                    03
                  </span>
                  <div>
                    <div className="section-eyebrow offer-section-eyebrow">Dalsze opcje</div>
                    <h2>Jeśli sytuacja wymaga kolejnego poziomu wsparcia</h2>
                  </div>
                </div>
                <p className="offer-section-intro">
                  To ścieżki na dalszy etap: praca na miejscu, terapia albo pobyt, gdy widać sens takiego kroku.
                </p>
              </div>

              <div className="offer-grid top-gap offer-grid-balanced">
                {furtherOffers.map((offer) => renderOfferCard(offer, 'tertiary'))}
              </div>
            </section>

            {pdfOffer ? (
              <section className="offer-feature-card tree-backed-card offer-feature-card-pdf">
                <div className="offer-feature-media">
                  <PdfGuideCoverStack
                    guides={featuredPdfGuides}
                    title="Poradniki PDF"
                    className="offer-card-stack offer-feature-stack"
                    showLegend
                  />
                </div>

                <div className="offer-feature-content">
                  <div className="offer-card-kicker-row">
                    <span className="offer-card-kicker">PDF osobno</span>
                    <div className="offer-feature-pills" aria-label="Zawartość PDF">
                      <span className="pill subtle-pill offer-feature-pill">{pdfGuideCount} PDF</span>
                      <span className="pill subtle-pill offer-feature-pill">{pdfBundleCount} pakiety</span>
                    </div>
                  </div>
                  <h2>{pdfOffer.title}</h2>
                  <p className="offer-feature-summary">
                    {pdfGuideCount} poradników i {pdfBundleCount} pakietów. To osobna ścieżka, jeśli chcesz zacząć od materiału, a nie
                    od rozmowy.
                  </p>
                  <div className="offer-card-meta-stack">
                    <div className="offer-card-meta">
                      <span className="offer-card-meta-label">Kiedy</span>
                      <span>{pdfOffer.whenToChoose}</span>
                    </div>
                    <div className="offer-card-meta offer-card-meta-muted">
                      <span className="offer-card-meta-label">Dalej</span>
                      <span>{pdfOffer.nextStep}</span>
                    </div>
                  </div>
                  <div className="offer-card-actions">
                    <Link href={getOfferDetailHref(pdfOffer)} prefetch={false} className="button button-primary">
                      {pdfOffer.detailCtaLabel ?? 'Szczegóły'}
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <Footer variant="full" ctaHref="/book" ctaLabel="Umów 15 min" />
      </div>
    </main>
  )
}
