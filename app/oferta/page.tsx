import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getOfferDetailCtaLabel, getOfferDetailHref, OFFERS } from '@/lib/offers'
import { listFeaturedPdfGuides, listPdfBundles, listPdfGuides, listPdfGuidesByCategory } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Oferta',
  path: '/oferta',
  description: 'Wybierz pierwszy krok: 15 min, 30 min, konsultacja online, wizyta, terapia, pobyt albo PDF.',
})

function renderOfferCard(offer: (typeof OFFERS)[number]) {
  const primaryLabel =
    offer.kind === 'booking' ? 'Umów 15 min' : offer.kind === 'resource' ? 'Napisz o PDF' : 'Napisz'

  return (
    <article key={offer.slug} className="offer-card tree-backed-card">
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
        <div>
          <div className="section-eyebrow">{offer.eyebrow}</div>
          <Link href={getOfferDetailHref(offer)} prefetch={false} className="inline-link">
            <h3>{offer.title}</h3>
          </Link>
        </div>
        {offer.priceLabel ? <span className="offer-price">{offer.priceLabel}</span> : null}
      </div>

      <div className="stack-gap top-gap-small">
        <div className="list-card tree-backed-card">
          <strong>Kiedy to wybrać</strong>
          <span>{offer.whenToChoose}</span>
        </div>
        <div className="list-card tree-backed-card">
          <strong>Co dalej</strong>
          <span>{offer.nextStep}</span>
        </div>
      </div>

      <div className="offer-card-actions">
        <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost">
          {getOfferDetailCtaLabel(offer)}
        </Link>
        <Link href={offer.primaryHref} prefetch={false} className="button button-primary">
          {primaryLabel}
        </Link>
      </div>
    </article>
  )
}

export default function OfferPage() {
  const featuredPdfGuides = listFeaturedPdfGuides()
  const pdfGuideCount = listPdfGuides().length
  const pdfBundleCount = listPdfBundles().length
  const dogPdfCount = listPdfGuidesByCategory('dog').length
  const catPdfCount = listPdfGuidesByCategory('cat').length
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
          <div className="section-eyebrow">Oferta</div>
          <h1>Wybierz, od czego zacząć.</h1>
          <p className="hero-text">Na każdej karcie: kiedy to wybrać i co dalej.</p>

          <div className="offer-page-stack top-gap">
            <section className="offer-section-block">
              <div className="section-eyebrow">Na start</div>
              <h2>Najprostszy start</h2>

              <div className="offer-grid top-gap offer-grid-balanced">
                {startOffers.map((offer) => renderOfferCard(offer))}
              </div>
            </section>

            <section className="offer-section-block">
              <div className="section-eyebrow">Gdy trzeba więcej</div>
              <h2>Więcej niż szybki start</h2>

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
                    <span className="pill subtle-pill offer-feature-pill">{pdfGuideCount} PDF</span>
                    <span className="pill subtle-pill offer-feature-pill">{pdfBundleCount} pakietów</span>
                    <span className="pill subtle-pill offer-feature-pill">{dogPdfCount} dla psów</span>
                    <span className="pill subtle-pill offer-feature-pill">{catPdfCount} dla kotów</span>
                  </div>
                </div>

                <div className="offer-feature-content">
                  <div className="section-eyebrow">{pdfOffer.eyebrow}</div>
                  <h2>{pdfOffer.title}</h2>
                  <div className="stack-gap top-gap-small">
                    <div className="list-card tree-backed-card">
                      <strong>Kiedy to wybrać</strong>
                      <span>{pdfOffer.whenToChoose}</span>
                    </div>
                    <div className="list-card tree-backed-card">
                      <strong>Co dalej</strong>
                      <span>{pdfOffer.nextStep}</span>
                    </div>
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
