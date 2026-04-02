import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OFFERS, getOfferBySlug } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'

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

export default function OfferDetailPage({ params }: OfferDetailPageProps) {
  const offer = getOfferBySlug(params.slug)

  if (!offer) {
    notFound()
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section offer-detail-layout">
          <div className="panel section-panel">
            <div className="section-eyebrow">{offer.eyebrow}</div>
            <h1>{offer.title}</h1>
            <p className="hero-text">{offer.heroSummary}</p>

            {offer.priceLabel ? (
              <div className="hero-price-badge offer-price-box tree-backed-card">
                <strong>{offer.priceLabel}</strong>
              </div>
            ) : (
              <div className="list-card tree-backed-card top-gap">
                <strong>Cena po wiadomości</strong>
                <span>Najpierw napisz.</span>
              </div>
            )}

            <div className="stack-gap top-gap">
              {offer.descriptions.map((paragraph) => (
                <div key={paragraph} className="list-card tree-backed-card">
                  <span>{paragraph}</span>
                </div>
              ))}
            </div>

            {offer.note ? (
              <div className="list-card accent-outline tree-backed-card top-gap">
                <strong>Ważne</strong>
                <span>{offer.note}</span>
              </div>
            ) : null}

            <div className="hero-actions top-gap">
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

          <div className="panel section-panel image-panel">
            <Image
              src={offer.imageSrc}
              alt={offer.imageAlt}
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>
        </section>

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Kiedy to wybrać</div>
            <h2>Sprawdź szybko</h2>
            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Kiedy</strong>
                <span>{offer.whenToChoose}</span>
              </div>
              {offer.bestFor.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Co potem</div>
            <h2>Po tym wiesz, co robić</h2>
            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Dalej</strong>
                <span>{offer.nextStep}</span>
              </div>
              {offer.outcomes.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Nie wiesz?</div>
          <h2>Napisz.</h2>
          <p className="hero-text">Krótki opis wystarczy.</p>
          <div className="hero-actions top-gap">
            <Link href="/kontakt" prefetch={false} className="button button-primary big-button">
              Napisz wiadomość
            </Link>
            <Link href="/book" prefetch={false} className="button button-ghost big-button">
              Umów 15 min
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
