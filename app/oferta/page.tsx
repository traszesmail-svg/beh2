import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getOfferDetailCtaLabel, getOfferDetailHref, OFFERS } from '@/lib/offers'
import { listFeaturedPdfGuides, listPdfBundles, listPdfGuides } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Formy współpracy',
  path: '/oferta',
  description:
    'Przegląd ścieżek pracy w marce Regulski: szybka konsultacja 15 min, konsultacja 30 min, konsultacja online, wizyty domowe, terapia, pobyty i poradniki PDF.',
})

function renderOfferCard(offer: (typeof OFFERS)[number]) {
  return (
    <article key={offer.slug} className="offer-card tree-backed-card">
      <div className="offer-card-media">
        <Image
          src={offer.imageSrc}
          alt={offer.imageAlt}
          width={1200}
          height={900}
          sizes="(max-width: 1100px) 100vw, 30vw"
          className="offer-card-image"
        />
      </div>

      <div className="offer-card-head">
        <div>
          <div className="section-eyebrow">{offer.eyebrow}</div>
          <h3>{offer.title}</h3>
        </div>
        {offer.priceLabel ? <span className="offer-price">{offer.priceLabel}</span> : null}
      </div>
      <p>{offer.cardSummary}</p>
      <div className="offer-card-actions">
        <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost">
          {getOfferDetailCtaLabel(offer)}
        </Link>
        <Link href={offer.primaryHref} prefetch={false} className="button button-primary">
          {offer.primaryCtaLabel}
        </Link>
      </div>
    </article>
  )
}

export default function OfferPage() {
  const featuredPdfGuides = listFeaturedPdfGuides()
  const pdfGuideCount = listPdfGuides().length
  const pdfBundleCount = listPdfBundles().length
  const startOffers = OFFERS.filter((offer) =>
    ['szybka-konsultacja-15-min', 'konsultacja-30-min', 'konsultacja-behawioralna-online'].includes(offer.slug),
  )
  const deeperOffers = OFFERS.filter((offer) =>
    ['konsultacja-domowa-wyjazdowa', 'indywidualna-terapia-behawioralna', 'pobyty-socjalizacyjno-terapeutyczne'].includes(
      offer.slug,
    ),
  )
  const pdfOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf')

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel offer-page-panel">
          <div className="section-eyebrow">Formy współpracy</div>
          <h1>Dobierz formę pomocy do sytuacji, a nie odwrotnie.</h1>
          <p className="hero-text">
            To nie jest zwykły cennik. Każda ścieżka ma inną rolę: od małego kroku na start po terapię, wizyty domowe
            i pobyty socjalizacyjno-terapeutyczne.
          </p>

          <div className="offer-page-stack top-gap">
            <section className="offer-section-block">
              <div className="section-eyebrow">Na start</div>
              <h2>Najpierw dobry próg wejścia</h2>
              <p className="hero-text offer-section-intro">
                Te formy pomagają wejść w temat bez zgadywania, czy od razu potrzebna jest większa praca.
              </p>

              <div className="offer-grid top-gap offer-grid-balanced">
                {startOffers.map((offer) => renderOfferCard(offer))}
              </div>
            </section>

            <section className="offer-section-block">
              <div className="section-eyebrow">Dalsza praca</div>
              <h2>Gdy potrzeba więcej niż jednej rozmowy</h2>
              <p className="hero-text offer-section-intro">
                Te ścieżki uruchamiamy wtedy, gdy po rozpoznaniu widać potrzebę terapii, pracy w środowisku albo pobytu.
              </p>

              <div className="offer-grid top-gap offer-grid-balanced">
                {deeperOffers.map((offer) => renderOfferCard(offer))}
              </div>
            </section>

            {pdfOffer ? (
              <section className="offer-feature-card tree-backed-card">
                <div className="offer-feature-media">
                  <PdfGuideCoverStack
                    guides={featuredPdfGuides}
                    title="Poradniki PDF"
                    className="offer-card-stack offer-feature-stack"
                    showLegend
                  />
                  <div className="offer-feature-media-meta">
                    <span className="pill subtle-pill offer-feature-pill">{pdfGuideCount} tematów PDF</span>
                    <span className="pill subtle-pill offer-feature-pill">{pdfBundleCount} pakietów</span>
                    <span className="pill subtle-pill offer-feature-pill">Pies i kot</span>
                  </div>
                </div>

                <div className="offer-feature-content">
                  <div className="section-eyebrow">{pdfOffer.eyebrow}</div>
                  <h2>{pdfOffer.title}</h2>
                  <p>{pdfOffer.cardSummary}</p>
                  <div className="list-card tree-backed-card offer-feature-note">
                    <strong>Dobry wybór, gdy chcesz zacząć spokojniej</strong>
                    <span>PDF porządkuje jeden temat i pomaga wejść w pracę bez rezerwowania rozmowy od razu.</span>
                  </div>
                  <div className="offer-card-actions">
                    <Link href={getOfferDetailHref(pdfOffer)} prefetch={false} className="button button-ghost">
                      {getOfferDetailCtaLabel(pdfOffer)}
                    </Link>
                    <Link href={pdfOffer.primaryHref} prefetch={false} className="button button-primary">
                      {pdfOffer.primaryCtaLabel}
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
