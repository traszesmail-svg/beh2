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
  return OFFERS.map((offer) => ({
    slug: offer.slug,
  }))
}

export function generateMetadata({ params }: OfferDetailPageProps): Metadata {
  const offer = getOfferBySlug(params.slug)

  if (!offer) {
    return buildMarketingMetadata({
      title: 'Oferta',
      path: '/oferta',
      description: 'Przegląd aktualnych form współpracy w marce Regulski.',
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
                <span>Cena jawna dla tej ścieżki startowej lub konsultacyjnej.</span>
              </div>
            ) : (
              <div className="list-card tree-backed-card top-gap">
                <strong>Zakres ustalany indywidualnie</strong>
                <span>Ta forma pracy jest dobierana po rozpoznaniu sytuacji i nie ma jednej publicznej ceny dla każdego przypadku.</span>
              </div>
            )}

            <div className="stack-gap top-gap">
              {offer.descriptions.map((paragraph) => (
                <p key={paragraph} className="hero-text hero-text-tight compact-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {offer.note ? (
              <div className="list-card accent-outline tree-backed-card top-gap">
                <strong>Ważna uwaga</strong>
                <span>{offer.note}</span>
              </div>
            ) : null}

            <div className="hero-actions top-gap">
              <Link href={offer.primaryHref} className="button button-primary big-button">
                {offer.primaryCtaLabel}
              </Link>
              {offer.secondaryHref && offer.secondaryCtaLabel ? (
                <Link href={offer.secondaryHref} className="button button-ghost big-button">
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
            <div className="section-eyebrow">Dla kogo</div>
            <h2>Kiedy ta ścieżka ma najwięcej sensu</h2>
            <div className="stack-gap top-gap">
              {offer.bestFor.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>To dobry sygnał, że właśnie ta forma może być właściwym następnym krokiem.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Rezultat</div>
            <h2>Co ma dać ten etap pracy</h2>
            <div className="stack-gap top-gap">
              {offer.outcomes.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>Efektem ma być większy porządek, lepsze rozpoznanie i adekwatna decyzja o dalszych krokach.</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Dalszy krok</div>
          <h2>Jeśli nie masz pewności, która ścieżka będzie właściwa, zacznij od kontaktu.</h2>
          <p className="hero-text">
            Możesz przejść do kontaktu albo wrócić do przeglądu całej oferty. Najważniejsze jest dobranie pomocy do
            sytuacji, a nie odwrotnie.
          </p>
          <div className="hero-actions top-gap">
            <Link href="/kontakt" className="button button-primary big-button">
              Przejdź do kontaktu
            </Link>
            <Link href="/oferta" className="button button-ghost big-button">
              Wróć do form współpracy
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
