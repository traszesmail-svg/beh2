import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CAT_CONTENT_ROADMAP, CAT_SUPPORT_AREAS, getOfferDetailCtaLabel, getOfferDetailHref, OFFERS } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { CATS_PAGE_PHOTO } from '@/lib/site'

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
            <div className="section-eyebrow">Koty jako osobny obszar pracy</div>
            <h1>Terapia kotów wymaga osobnego spojrzenia.</h1>
            <p className="hero-text">
              Problemy kocie często łączą zachowanie, stres, warunki domowe i tło weterynaryjne. Dlatego wymagają
              osobnego rozpoznania.
            </p>
            <div className="stack-gap top-gap">
              {CAT_SUPPORT_AREAS.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                  <span>To temat, od którego można zacząć konsultację albo dalszą pracę.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel image-panel">
            <Image
              src={CATS_PAGE_PHOTO.src}
              alt={CATS_PAGE_PHOTO.alt}
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>
        </section>

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Jak zaczyna się praca z kotem</div>
            <h2>Najpierw porządkujemy przyczynę, nie sam objaw.</h2>
            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Tło medyczne przed zgadywaniem</strong>
                <span>
                  Przy kuwecie, nagłej obronie, wokalizacji albo zmianie tolerancji dotyku najpierw trzeba wykluczyć
                  ból i tło zdrowotne.
                </span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Środowisko i zasoby</strong>
                <span>
                  Układ kuwet, kryjówek, przejść, misek i miejsc odpoczynku często decyduje o napięciu bardziej niż
                  pojedyncza wskazówka.
                </span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Małe kroki i obserwacja</strong>
                <span>Plan pracy z kotem zwykle opiera się na przewidywalności, spokojnym kontakcie i wzmacnianiu właściwych zachowań.</span>
              </div>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Kiedy napisać od razu</div>
            <h2>Nie każdy problem można bezpiecznie przeczekać.</h2>
            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Kuweta i mocz</strong>
                <span>
                  Jeśli temat jest nagły, pojawia się ból, krew, wokalizacja albo częste bezskuteczne próby oddania
                  moczu, weterynarz powinien być pierwszym ruchem.
                </span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Dotyk, pielęgnacja, obrona</strong>
                <span>
                  Nagła zmiana tolerancji dotyku albo zabiegów pielęgnacyjnych często wymaga spojrzenia na ból, stres i
                  organizację kontaktu w domu.
                </span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Konflikt w domu wielokotowym</strong>
                <span>Im szybciej uporządkujemy zasoby, przejścia i kontakt między kotami, tym mniejsze ryzyko utrwalenia napięcia.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Formy pracy z kotami</div>
          <h2>Możesz zacząć małym krokiem albo pełniejszą konsultacją.</h2>
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
                  <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost">
                    {getOfferDetailCtaLabel(offer)}
                  </Link>
                  <Link href={offer.primaryHref} prefetch={false} className="button button-primary">
                    {offer.primaryCtaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Najczęstsze tematy</div>
          <h2>Najważniejsze obszary pracy z kotami są już jasno rozpisane.</h2>
          <p className="hero-text">
            Nie każdy temat potrzebuje osobnej strony. Już teraz widać jednak, od jakich problemów najczęściej zaczyna
            się konsultacja, PDF albo dalsza praca.
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
          <h2>Jeśli sprawa dotyczy kota i nie wiesz, od czego zacząć, napisz.</h2>
          <div className="hero-actions top-gap">
            <Link href="/book" prefetch={false} className="button button-primary big-button">
              Umów pierwszy krok
            </Link>
            <Link href="/kontakt" prefetch={false} className="button button-ghost big-button">
              Napisz i opisz sytuację kota
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
