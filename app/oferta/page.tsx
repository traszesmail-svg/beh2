import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OFFERS } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Formy współpracy',
  path: '/oferta',
  description:
    'Przegląd ścieżek pracy w marce Regulski: szybka konsultacja 15 min, konsultacja 30 min, konsultacja online, wizyty domowe, terapia, pobyty i poradniki PDF.',
})

export default function OfferPage() {
  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-eyebrow">Formy współpracy</div>
          <h1>Dobierz formę pomocy do sytuacji, a nie odwrotnie.</h1>
          <p className="hero-text">
            To nie jest klasyczny cennik. Każda ścieżka ma inną rolę: od małego kroku na start po terapię, wizyty domowe
            i pobyty socjalizacyjno-terapeutyczne.
          </p>

          <div className="offer-grid top-gap">
            {OFFERS.map((offer) => (
              <article key={offer.slug} className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <div className="section-eyebrow">{offer.eyebrow}</div>
                    <h3>{offer.title}</h3>
                  </div>
                  {offer.priceLabel ? <span className="offer-price">{offer.priceLabel}</span> : null}
                </div>
                <p>{offer.cardSummary}</p>
                <div className="offer-card-actions">
                  <Link href={`/oferta/${offer.slug}`} className="button button-ghost">
                    Szczegóły
                  </Link>
                  <Link href={offer.primaryHref} className="button button-primary">
                    {offer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
