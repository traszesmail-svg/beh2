import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { PdfGuideCard } from '@/components/PdfGuideCard'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { Schema } from '@/components/schema'
import { repairCopy } from '@/lib/copy'
import {
  buildPdfOrderHref,
  getPdfAccessDescription,
  getPdfBundleBySlug,
  getPdfCategoryLabel,
  getPdfPricingBadge,
  listPdfBundles,
  PDF_GUIDES_LISTING_ROUTE,
} from '@/lib/pdf-guides'
import { getProductJsonLd } from '@/lib/schema'
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
    title: `${repairCopy(bundle.title)} | Pakiet PDF`,
    path: bundle.routePath,
    description: repairCopy(bundle.promise),
  })
}

export default function PdfBundleDetailPage({ params }: PdfBundleDetailPageProps) {
  const bundle = getPdfBundleBySlug(params.bundleSlug)

  if (!bundle) {
    notFound()
  }

  const orderHref = buildPdfOrderHref({ bundleSlug: bundle.slug })

  return (
    <NotatnikPageShell
      tag="Poradniki PDF / pakiet"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/book?service=szybka-konsultacja-15-min"
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={orderHref}
      footerPrimaryLabel="Zamów pakiet"
    >
      <Schema
        data={getProductJsonLd({
          name: repairCopy(bundle.title),
          description: repairCopy(bundle.promise),
          url: bundle.routePath,
          price: getPdfPricingBadge(bundle.pricing),
          image: bundle.guides[0] ? `/branding/pdf-covers/${bundle.guides[0].coverFileName}` : null,
          category: 'Pakiet PDF',
        })}
      />
      <div className="container">
        <section className="two-col-section offer-detail-layout pdf-detail-layout">
          <div className="panel section-panel hero-surface offer-detail-content-panel pdf-detail-content-panel">
            <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="pdf-back-link">
              Wróć do listy PDF
            </Link>

            <div className="offer-detail-head">
              <div className="section-eyebrow">Pakiet PDF</div>
              <div className="offer-detail-pills">
                <span className="hero-proof-pill">{repairCopy(getPdfCategoryLabel(bundle.category))}</span>
                <span className="hero-proof-pill">{bundle.guides.length} poradniki</span>
                <span className="hero-proof-pill">spójny zestaw</span>
              </div>
            </div>

            <div className="offer-detail-hero-copy">
              <h1>{repairCopy(bundle.title)}</h1>
              <p className="hero-text">{repairCopy(bundle.promise)}</p>
              <p className="muted paragraph-gap">{repairCopy(bundle.audience)}</p>
            </div>

            <div className="offer-detail-highlight-row top-gap">
              <div className="hero-price-badge offer-price-box tree-backed-card">
                <strong>{repairCopy(getPdfPricingBadge(bundle.pricing))}</strong>
                <span>{repairCopy(getPdfAccessDescription(bundle.accessType))}</span>
              </div>

              <div className="list-card tree-backed-card offer-detail-price-card">
                <strong>Po co ten pakiet</strong>
                <span>Zamiast jednego PDF-u dostajesz {bundle.guides.length} materiały do jednego, szerszego tematu.</span>
              </div>
            </div>

            <ul className="detail-points-list top-gap">
              {bundle.guides.slice(0, 3).map((guide) => (
                <li key={guide.slug} className="detail-point tree-backed-card">
                  <span>{repairCopy(guide.title)}</span>
                </li>
              ))}
            </ul>

            <div className="offer-detail-cta-band tree-backed-card top-gap">
              <div className="offer-detail-cta-copy">
                <span className="section-eyebrow">Pierwszy ruch</span>
                <strong>Zamów ten pakiet</strong>
                <span>Jeśli chcesz kupić pakiet, dostać dostęp albo upewnić się, że to lepszy wybór niż jeden PDF, wyślij krótkie zamówienie przez formularz.</span>
              </div>

              <div className="hero-actions offer-detail-actions">
                <Link href={orderHref} prefetch={false} className="button button-primary big-button">
                  Zamów pakiet
                </Link>
                <Link href="/book" prefetch={false} className="button button-ghost big-button">
                  Umów 15 min
                </Link>
              </div>
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap offer-detail-contact-card">
              <strong>Kiedy ten pakiet ma sens</strong>
              <span>{repairCopy(bundle.audience)}</span>
            </div>
          </div>

          <div className="panel section-panel image-panel offer-detail-media-panel pdf-detail-media-panel">
            <div className="offer-detail-media-top pdf-detail-cover-shell">
              <PdfGuideCoverStack guides={bundle.guides} title={repairCopy(bundle.title)} className="pdf-detail-stack" />
            </div>

            <div className="stats-grid top-gap pdf-detail-mini-grid">
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{bundle.guides.length}</strong>
                <span>poradniki w jednym pakiecie</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{repairCopy(getPdfPricingBadge(bundle.pricing))}</strong>
                <span>cena za spójny zestaw materiałów</span>
              </div>
              <div className="stat-card tree-backed-card pdf-stat-card">
                <strong>{bundle.consult.length}</strong>
                <span>ścieżki rozmowy, które ten pakiet najczęściej wspiera</span>
              </div>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Co zawiera pakiet</strong>
              <span>Pakiet zbiera materiały z jednego obszaru pracy, zamiast rozrzucać wybór na kilka osobnych decyzji.</span>
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Najczęstsze dalsze kroki</strong>
              <span>{bundle.consult.map(repairCopy).join(', ')}</span>
            </div>
          </div>
        </section>

        <section className="two-col-section pdf-detail-followup-grid">
          <div className="panel section-panel">
            <div className="section-eyebrow">Poradniki w pakiecie</div>
            <h2>Każdy materiał możesz obejrzeć osobno</h2>

            <div className="offer-grid top-gap">
              {bundle.guides.map((guide) => (
                <PdfGuideCard key={guide.slug} guide={guide} primaryHref={orderHref} primaryLabel="Zamów pakiet" />
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Jeśli trzeba więcej</div>
            <h2>Gdy nadal nie wiesz, od czego zacząć</h2>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Kontakt</strong>
                <span>W wiadomości dopasuję, czy lepszy będzie ten pakiet, pojedynczy poradnik czy od razu konsultacja.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Konsultacja 15 min</strong>
                <span>Lepsza ścieżka, jeśli temat jest mieszany albo trzeba szybko poukładać całą sytuację przed doborem materiału.</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link href={orderHref} prefetch={false} className="button button-primary big-button">
                Zamów pakiet
              </Link>
              <Link href={PDF_GUIDES_LISTING_ROUTE} prefetch={false} className="button button-ghost big-button">
                Wróć do listy PDF
              </Link>
            </div>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
