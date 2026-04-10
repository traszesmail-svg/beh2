import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OFFERS, getOfferBySlug } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { DEFAULT_PRICE_PLN, formatPricePln } from '@/lib/pricing'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

type OfferDetailPageProps = {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return OFFERS.filter((offer) => offer.slug !== 'poradniki-pdf').map((offer) => ({
    slug: offer.slug,
  }))
}

export function generateMetadata({ params }: OfferDetailPageProps): Metadata {
  const offer = getOfferBySlug(params.slug)

  if (!offer) {
    return buildMarketingMetadata({
      title: 'Oferta',
      path: '/oferta',
      description: 'Przegląd aktualnej oferty w marce Regulski.',
    })
  }

  return buildMarketingMetadata({
    title: offer.title,
    path: `/oferta/${offer.slug}`,
    description: offer.heroSummary,
  })
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const offer = getOfferBySlug(params.slug)

  if (!offer) {
    notFound()
  }

  const dataMode = getDataModeStatus()
  let priceLabel = offer.priceLabel

  if (offer.slug === 'szybka-konsultacja-15-min' && dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      priceLabel = `Od ${formatPricePln(quickConsultationPrice.amount)}`
    } catch (error) {
      console.warn('[behawior15][oferta-detail] nie udało się pobrać aktywnej ceny konsultacji', error)
      priceLabel = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}`
    }
  }

  const detailPoints = offer.outcomes.slice(0, 3)
  const secondarySentence = offer.heroSummary

  return (
    <main className="page-wrap marketing-page">
      <div className="container">
        <Header />

        <section className="two-col-section offer-detail-layout">
          <div className="panel section-panel hero-surface offer-detail-content-panel">
            <div className="offer-detail-head">
              <div className="section-eyebrow">{offer.eyebrow}</div>
              <div className="offer-detail-pills">
                <span className="hero-proof-pill">{offer.shortTitle}</span>
                <span className="hero-proof-pill">{offer.forWho}</span>
              </div>
            </div>

            <div className="offer-detail-hero-copy">
              <h1>{offer.title}</h1>
              <p className="hero-text">{offer.whenToChoose}</p>
              <p className="muted paragraph-gap">{secondarySentence}</p>
            </div>

            <div className="summary-grid top-gap">
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Dla kogo</div>
                <div className="summary-value">{offer.forWho}</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Kiedy wybrać</div>
                <div className="summary-value">{offer.whenToChoose}</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Co dostajesz</div>
                <div className="summary-value">{offer.outcomes[0] ?? offer.nextStep}</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Dalej</div>
                <div className="summary-value">{offer.nextStep}</div>
              </div>
            </div>

            <div className="offer-detail-highlight-row top-gap">
              {priceLabel ? (
                <div className="hero-price-badge offer-price-box tree-backed-card">
                  <strong>{priceLabel}</strong>
                </div>
              ) : (
                <div className="list-card tree-backed-card offer-detail-price-card">
                  <strong>Najpierw napisz</strong>
                  <span>Cenę i dalszy krok ustalimy po wiadomości.</span>
                </div>
              )}

              <div className="list-card tree-backed-card offer-detail-price-card">
                <strong>Co dalej po tym starcie</strong>
                <span>{offer.nextStep}</span>
              </div>
            </div>

            <ul className="detail-points-list top-gap">
              {detailPoints.map((item) => (
                <li key={item} className="detail-point tree-backed-card">
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="stack-gap top-gap">
              {offer.descriptions.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>Co to daje</strong>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="offer-detail-cta-band tree-backed-card top-gap">
              <div className="offer-detail-cta-copy">
                <span className="section-eyebrow">Pierwszy ruch</span>
                <strong>{offer.primaryCtaLabel}</strong>
                <span>{offer.note ?? 'Jeśli nadal nie masz pewności, napisz dwie linijki. Powiem, czy ten start ma sens i co zrobić dalej.'}</span>
              </div>

              <div className="hero-actions offer-detail-actions">
                <Link href={offer.primaryHref} prefetch={false} className="button button-primary big-button">
                  {offer.primaryCtaLabel}
                </Link>
                {offer.secondaryHref && offer.secondaryCtaLabel ? (
                  <Link href={offer.secondaryHref} prefetch={false} className="button button-ghost big-button">
                    {offer.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap offer-detail-contact-card">
              <strong>Fallback bez zgadywania</strong>
              <span>Jeśli nadal nie masz pewności, napisz dwie linijki. Powiem, czy ten start ma sens, czy lepiej wejść od kontaktu albo innej usługi.</span>
            </div>
          </div>

          <div className="panel section-panel image-panel offer-detail-media-panel">
            <div className="offer-detail-media-top">
              <Image
                src={offer.imageSrc}
                alt={offer.imageAlt}
                width={1200}
                height={900}
                sizes="(max-width: 980px) 100vw, 42vw"
                className="section-feature-image"
              />
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Jak wygląda ten start</strong>
              <span>{offer.heroSummary}</span>
            </div>

            {offer.note ? (
              <div className="list-card tree-backed-card offer-detail-media-note">
                <strong>Ważna uwaga</strong>
                <span>{offer.note}</span>
              </div>
            ) : null}
          </div>
        </section>

        <Footer variant="full" ctaHref={offer.primaryHref} ctaLabel={offer.primaryCtaLabel} />
      </div>
    </main>
  )
}
