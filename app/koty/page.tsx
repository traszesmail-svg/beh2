import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CAT_CONTENT_ROADMAP, CAT_SUPPORT_AREAS, OFFERS } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Terapia kotów',
  path: '/koty',
  description:
    'Osobna strona o pracy z kotami: problemy kuwetowe, stres, wycofanie, konflikty między kotami i trudne zachowania przy dotyku lub pielęgnacji.',
})

export default function CatsPage() {
  const catRelevantOffers = OFFERS.filter((offer) =>
    [
      'szybka-konsultacja-15-min',
      'konsultacja-30-min',
      'konsultacja-behawioralna-online',
      'indywidualna-terapia-behawioralna',
      'poradniki-pdf',
    ].includes(offer.slug),
  )

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Koty jako pełnoprawny filar</div>
            <h1>Terapia kotów wymaga osobnego spojrzenia, a nie dopisku do pracy z psem.</h1>
            <p className="hero-text">
              Problemy kocie często łączą zachowanie, stres, środowisko domowe i tło weterynaryjne. Dlatego koty są w tej
              marce obecne od pierwszego ekranu i mają własną ścieżkę komunikacji.
            </p>
            <div className="stack-gap top-gap">
              {CAT_SUPPORT_AREAS.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>To temat, od którego można zacząć konsultację albo dalszą, bardziej indywidualną pracę.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel image-panel">
            <Image
              src="/branding/specialist-krzysztof-vet.jpg"
              alt="Krzysztof Regulski podczas pracy z kotem"
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Formy pracy z kotami</div>
          <h2>Możesz zacząć małym krokiem albo od razu wejść w pełniejszą konsultację.</h2>
          <div className="offer-grid top-gap">
            {catRelevantOffers.map((offer) => (
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

        <section className="panel section-panel">
          <div className="section-eyebrow">Struktura pod dalszy content</div>
          <h2>Przyszłe landing pages dla kotów są przygotowane w architekturze marki.</h2>
          <p className="hero-text">
            Nie wszystkie tematy muszą być publikowane od razu, ale już teraz mają przygotowaną logiczną strukturę do
            dalszego rozwoju contentu i PDF.
          </p>
          <div className="roadmap-list top-gap">
            {CAT_CONTENT_ROADMAP.map((item) => (
              <span key={item.slug} className="topic-example-chip">
                {item.title}
              </span>
            ))}
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Kontakt</div>
          <h2>Jeśli sprawa dotyczy kota, możesz zacząć od krótkiej konsultacji albo od razu opisać swoją sytuację.</h2>
          <div className="hero-actions top-gap">
            <Link href="/book" className="button button-primary big-button">
              Umów pierwszy krok
            </Link>
            <Link href="/kontakt" className="button button-ghost big-button">
              Przejdź do kontaktu
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
