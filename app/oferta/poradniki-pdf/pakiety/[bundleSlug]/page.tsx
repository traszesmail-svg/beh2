import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { PdfGuideCard } from '@/components/PdfGuideCard'
import {
  buildPdfInquiryHref,
  getPdfAccessDescription,
  getPdfBundleBySlug,
  getPdfCategoryLabel,
  getPdfPricingBadge,
  listPdfBundles,
  PDF_GUIDES_LISTING_ROUTE,
} from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

type PdfBundleDetailPageProps = {
  params: {
    bundleSlug: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return listPdfBundles().map((bundle) => ({
    bundleSlug: bundle.slug,
  }))
}

export function generateMetadata({ params }: PdfBundleDetailPageProps): Metadata {
  const bundle = getPdfBundleBySlug(params.bundleSlug)

  if (!bundle) {
    return buildMarketingMetadata({
      title: 'Pakiety PDF',
      path: PDF_GUIDES_LISTING_ROUTE,
      description: 'Pakiety poradników PDF dla opiekunów psów i kotów.',
    })
  }

  return buildMarketingMetadata({
    title: `${bundle.title} | Pakiet PDF`,
    path: bundle.routePath,
    description: bundle.promise,
  })
}

export default function PdfBundleDetailPage({ params }: PdfBundleDetailPageProps) {
  const bundle = getPdfBundleBySlug(params.bundleSlug)

  if (!bundle) {
    notFound()
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section">
          <div className="panel section-panel">
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="pdf-back-link">
              Wróć do listingu poradników PDF
            </Link>

            <div className="section-eyebrow">Pakiet PDF</div>
            <h1>{bundle.title}</h1>
            <p className="hero-text">{bundle.promise}</p>

            <div className="hero-price-badge offer-price-box tree-backed-card top-gap">
              <strong>{getPdfPricingBadge(bundle.pricing)}</strong>
              <span>{getPdfAccessDescription(bundle.accessType)}</span>
            </div>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Na jaki temat</strong>
                <span>{bundle.audience}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Kategoria</strong>
                <span>{getPdfCategoryLabel(bundle.category)}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Po co</strong>
                <span>
                  Zamiast jednego PDF-u dostajesz {bundle.guides.length} materiały do jednego tematu.
                </span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link href={buildPdfInquiryHref({ bundleSlug: bundle.slug })} prefetch={false} className="button button-primary big-button">
                Napisz w sprawie tego pakietu
              </Link>
              <Link href="/book" prefetch={false} className="button button-ghost big-button">
                Umów konsultację 15 min
              </Link>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Co wchodzi w skład</div>
            <h2>Co jest w pakiecie</h2>

            <div className="top-gap">
              <PdfGuideCoverStack guides={bundle.guides} title={bundle.title} className="pdf-detail-stack" />
            </div>

            <div className="stats-grid top-gap">
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{bundle.guides.length}</strong>
                <span>poradniki w jednym pakiecie</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{getPdfPricingBadge(bundle.pricing)}</strong>
                <span>cena pakietowa za spójny zestaw materiałów</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{bundle.consult.length}</strong>
                <span>formy konsultacji, które ten pakiet najczęściej wspiera</span>
              </div>
            </div>

            <div className="stack-gap top-gap">
              {bundle.consult.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>Powiązana konsultacja</strong>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Poradniki w pakiecie</div>
          <h2>Każdy materiał możesz też obejrzeć osobno</h2>
          <p className="hero-text">
            Pakiet porządkuje jeden temat, ale każdą kartę możesz też sprawdzić osobno.
          </p>

          <div className="offer-grid top-gap">
            {bundle.guides.map((guide) => (
              <PdfGuideCard
                key={guide.slug}
                guide={guide}
                primaryHref={buildPdfInquiryHref({ bundleSlug: bundle.slug })}
                primaryLabel="Napisz w sprawie tego pakietu"
              />
            ))}
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Jeśli nie wiesz</div>
          <h2>Najpierw napisz.</h2>
          <p className="hero-text">
            W odpowiedzi dopasuję, czy lepszy będzie ten pakiet, pojedynczy poradnik czy konsultacja.
          </p>
          <div className="hero-actions top-gap">
            <Link href={buildPdfInquiryHref({ bundleSlug: bundle.slug })} prefetch={false} className="button button-primary big-button">
              Napisz w sprawie tego pakietu
            </Link>
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="button button-ghost big-button">
              Wróć do listy PDF
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
