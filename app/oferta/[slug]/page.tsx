import React from 'react'
import type { Metadata } from 'next'
import Image from '@/components/BlankImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { OFFERS, getOfferBySlug } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { DEFAULT_PRICE_PLN, formatPricePln } from '@/lib/pricing'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

const LEGACY_OFFER_SLUGS = new Set(['konsultacja-behawioralna-online', 'poradniki-pdf'])

type OfferDetailPageProps = {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return OFFERS.filter((offer) => !LEGACY_OFFER_SLUGS.has(offer.slug)).map((offer) => ({
    slug: offer.slug,
  }))
}

export function generateMetadata({ params }: OfferDetailPageProps): Metadata {
  if (LEGACY_OFFER_SLUGS.has(params.slug)) {
    return buildMarketingMetadata({
      title: 'Oferta',
      path: '/oferta',
      description: 'Przegląd aktualnej oferty w marce Regulski.',
    })
  }

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
  if (LEGACY_OFFER_SLUGS.has(params.slug)) {
    notFound()
  }

  const offer = getOfferBySlug(params.slug)

  if (!offer) {
    notFound()
  }

  const dataMode = getDataModeStatus()
  let priceLabel = offer.priceLabel

  if (offer.slug === 'szybka-konsultacja-15-min' && dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      priceLabel = formatPricePln(quickConsultationPrice.amount)
    } catch (error) {
      console.warn('[behawior15][oferta-detail] nie udało się pobrać aktywnej ceny konsultacji', error)
      priceLabel = formatPricePln(DEFAULT_PRICE_PLN)
    }
  }

  return (
    <NotatnikPageShell
      tag="Oferta / szczegoly"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={offer.primaryHref}
      ctaLabel={offer.primaryCtaLabel}
      footerPrimaryHref={offer.primaryHref}
      footerPrimaryLabel={offer.primaryCtaLabel}
    >
      <div className="container">

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
              <p className="muted paragraph-gap">{offer.heroSummary}</p>
            </div>

            <div className="summary-grid top-gap">
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Dla kogo</div>
                <div className="summary-value">{offer.forWho}</div>
              </div>
              <div className="summary-card tree-backed-card">
                <div className="stat-label">Cena</div>
                <div className="summary-value">{priceLabel ?? 'Po wyborze ścieżki'}</div>
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
                <span>{offer.note ?? 'Jeśli nadal nie masz pewności, użyj krótkiej wiadomości i wskażę najprostszy kolejny krok.'}</span>
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
              <span>
                Jeśli po przeczytaniu nadal nie wiesz, czy wejść od razu w ten format, wybierz 15 min audio albo użyj krótkiej wiadomości kwalifikacyjnej.
              </span>
            </div>
          </div>

          <div className="panel section-panel image-panel offer-detail-media-panel">
            <div className="offer-detail-media-top">
              <Image
                src={offer.imageSrc}
                alt={offer.imageAlt}
                width={offer.imageWidth}
                height={offer.imageHeight}
                sizes="(max-width: 980px) 100vw, 42vw"
                className="section-feature-image"
              />
            </div>

            <div className="list-card tree-backed-card offer-detail-media-note">
              <strong>Jak wygląda ten start</strong>
              <span>{offer.heroSummary}</span>
            </div>

            {offer.slug === 'konsultacja-behawioralna-online' ? (
              <div className="list-card tree-backed-card offer-detail-media-note">
                <strong>Ważna uwaga</strong>
                <span>To głębsza opcja z ograniczoną liczbą terminów. Jeśli temat jest prostszy, 15 min audio zwykle wystarczy na dobry start.</span>
              </div>
            ) : (
              <div className="list-card tree-backed-card offer-detail-media-note">
                <strong>Dalszy krok</strong>
                <span>
                  Jeśli temat okaże się szerszy, po rozmowie wskażę, czy przejść do {FUNNEL_CTA_LABELS.consultation.toLowerCase()} albo wrócić do Niezbędnika.
                </span>
              </div>
            )}
          </div>
        </section>

      </div>
    </NotatnikPageShell>
  )
}
