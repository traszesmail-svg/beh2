import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PriceDisplay } from '@/components/PriceDisplay'
import { ShopEntranceCardView } from '@/components/ShopCatalog'
import { getOfferDetailHref, OFFERS } from '@/lib/offers'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { listFeaturedPdfGuides, listPdfBundles, listPdfGuides } from '@/lib/pdf-guides'
import { SHOP_ENTRANCE_CARDS } from '@/lib/shop-catalog'
import { buildMarketingMetadata } from '@/lib/seo'
import { getActiveConsultationPrice } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { SPECIALIST_CAT_SUPPORT_PHOTO } from '@/lib/site'
import {
  FUNNEL_PRIMARY_HREF,
  FUNNEL_PRIMARY_LABEL,
  FUNNEL_SECONDARY_HREF,
  FUNNEL_SECONDARY_LABEL,
  FUNNEL_UPGRADE_HREF,
  FUNNEL_UPGRADE_LABEL,
} from '@/lib/offers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Oferta',
  path: '/oferta',
  description: 'Wybierz pierwszy krok: 15 min, 30 min, konsultacja online, wizyta, terapia, pobyt albo PDF.',
})

function getOfferCardAction(offer: (typeof OFFERS)[number]) {
  if (offer.kind === 'booking') {
    return {
      href: offer.primaryHref,
      label: offer.primaryCtaLabel,
    }
  }

  return {
    href: getOfferDetailHref(offer),
    label: offer.detailCtaLabel ?? 'Zobacz szczegóły',
  }
}

function renderOfferCard(
  offer: (typeof OFFERS)[number],
  tone: 'primary' | 'secondary' | 'tertiary' = 'secondary',
  priceAmountOverride?: number,
) {
  const action = getOfferCardAction(offer)
  const effectivePriceAmount = priceAmountOverride ?? offer.priceAmount
  const priceLabel =
    effectivePriceAmount !== null ? <PriceDisplay amount={effectivePriceAmount} prefix="Od" /> : offer.priceLabel ?? 'Po wiadomości'
  const whatYouGet = offer.outcomes.slice(0, 3).join(' · ')

  return (
    <article key={offer.slug} className={`offer-card tree-backed-card offer-card-${tone}`} data-offer-tone={tone}>
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
        <div className="offer-card-copy-block">
          <div className="offer-card-kicker-row">
            <span className="offer-card-kicker">{offer.shortTitle}</span>
            <span className={`offer-price${offer.priceAmount !== null ? '' : ' offer-price-muted'}`}>{priceLabel}</span>
          </div>
          <Link href={getOfferDetailHref(offer)} prefetch={false} className="inline-link">
            <h3>{offer.title}</h3>
          </Link>
        </div>
      </div>

      <p className="offer-card-summary">{offer.cardSummary}</p>

      <div className="offer-card-meta-stack">
        <div className="offer-card-meta">
          <span className="offer-card-meta-label">Dla kogo</span>
          <span>{offer.forWho}</span>
        </div>
        <div className="offer-card-meta">
          <span className="offer-card-meta-label">Kiedy wybrać</span>
          <span>{offer.whenToChoose}</span>
        </div>
        <div className="offer-card-meta">
          <span className="offer-card-meta-label">Co dostajesz</span>
          <span>{whatYouGet}</span>
        </div>
        <div className="offer-card-meta offer-card-meta-muted">
          <span className="offer-card-meta-label">Dalej</span>
          <span>{offer.nextStep}</span>
        </div>
      </div>

      <div className="offer-card-actions">
        <Link href={action.href} prefetch={false} className="button button-primary">
          {action.label}
        </Link>
      </div>
    </article>
  )
}

export default async function OfferPage() {
  const featuredPdfGuides = listFeaturedPdfGuides()
  const pdfGuideCount = listPdfGuides().length
  const pdfBundleCount = listPdfBundles().length
  const quickStartOffer = OFFERS.find((offer) => offer.slug === 'szybka-konsultacja-15-min') ?? null
  const dataMode = getDataModeStatus()
  let quickStartPriceAmount = DEFAULT_PRICE_PLN

  if (dataMode.isValid) {
    try {
      const quickConsultationPrice = await getActiveConsultationPrice()
      quickStartPriceAmount = quickConsultationPrice.amount
    } catch (error) {
      console.warn('[behawior15][oferta] nie udało się pobrać aktywnej ceny konsultacji', error)
    }
  }

  const moreTimeOffers = OFFERS.filter((offer) => ['konsultacja-30-min', 'konsultacja-behawioralna-online'].includes(offer.slug))
  const furtherOffers = OFFERS.filter((offer) =>
    ['konsultacja-domowa-wyjazdowa', 'indywidualna-terapia-behawioralna', 'pobyty-socjalizacyjno-terapeutyczne'].includes(
      offer.slug,
    ),
  )
  const pdfOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf')
  const offerEntranceCards = [
    SHOP_ENTRANCE_CARDS.find((card) => card.slug === 'konsultacja-15-min'),
    SHOP_ENTRANCE_CARDS.find((card) => card.slug === 'koty'),
    SHOP_ENTRANCE_CARDS.find((card) => card.slug === 'psy'),
    SHOP_ENTRANCE_CARDS.find((card) => card.slug === 'pakiety'),
    SHOP_ENTRANCE_CARDS.find((card) => card.slug === 'kontakt'),
  ].filter(Boolean) as typeof SHOP_ENTRANCE_CARDS

  return (
    <main className="page-wrap marketing-page">
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface offer-page-panel visual-scan-page">
          <div className="offer-page-hero-grid">
            <div className="offer-page-hero-copy">
              <div className="section-eyebrow">Oferta</div>
              <h1>Zacznij od 15 min. PDF zostaje drugim krokiem, a dłuższy format trzecim.</h1>
              <p className="hero-text">
                Najprostszy pierwszy krok to konsultacja 15 min. Jeśli chcesz spokojnie wrócić do tematu albo pracować we własnym tempie,
                możesz skorzystać z materiałów PDF. Gdy sprawa jest bardziej złożona, przejdziemy do szerszej konsultacji.
              </p>

              <div className="offer-page-hero-pills" aria-label="Poziomy wejścia">
                <span className="hero-proof-pill">Konsultacja 15 min</span>
                <span className="hero-proof-pill">PDF jako drugi krok</span>
                <span className="hero-proof-pill">30 min / pełna jako upgrade</span>
                <span className="hero-proof-pill">Kocie i psie PDF-y</span>
              </div>

              <div className="hero-actions top-gap">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_PRIMARY_LABEL}
                </Link>
                <Link href={FUNNEL_SECONDARY_HREF} prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_SECONDARY_LABEL}
                </Link>
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_UPGRADE_LABEL}
                </Link>
              </div>
            </div>

            <aside className="offer-page-hero-card tree-backed-card">
              <span className="offer-page-hero-label">Lejek strony</span>
              <strong>Najpierw 15 min. PDF jako drugi krok. 30 min / pełna konsultacja jako upgrade.</strong>
              <div className="offer-page-hero-stats">
                <div className="offer-page-hero-stat">
                  <span>15 min</span>
                  <strong>Primary CTA</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>PDF</span>
                  <strong>{pdfGuideCount} + {pdfBundleCount}</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>30 min / pełna</span>
                  <strong>{moreTimeOffers.length} ścieżki</strong>
                </div>
                <div className="offer-page-hero-stat">
                  <span>Dalsze opcje</span>
                  <strong>{furtherOffers.length} kierunki</strong>
                </div>
              </div>
            </aside>
          </div>

          <div className="offer-page-stack top-gap">
            {quickStartOffer ? (
              <section className="offer-section-block offer-section-block-start" id="start-15">
                <div className="offer-section-head">
                  <div className="offer-section-title-block">
                    <span className="offer-section-marker" aria-hidden="true">
                      01
                    </span>
                    <div>
                      <div className="section-eyebrow offer-section-eyebrow">Konsultacja 15 min</div>
                      <h2>Główny pierwszy krok.</h2>
                    </div>
                  </div>
                  <p className="offer-section-intro">To start, który prowadzi najkrótszą drogą do sensownej decyzji.</p>
                </div>

                <div className="offer-grid offer-grid-featured top-gap">{renderOfferCard(quickStartOffer, 'primary', quickStartPriceAmount)}</div>
              </section>
            ) : null}

            <section className="panel section-panel shop-entrance-panel leafy-section">
              <div className="shop-entrance-head">
                <div>
                  <div className="section-eyebrow">Sklep ekspercki</div>
                  <h2>Najpierw 15 min. Potem PDF. Na końcu 30 min / pełna konsultacja.</h2>
                </div>
                <p className="offer-section-intro">
                  Ten widok porządkuje ofertę od najprostszego wejścia do bardziej złożonych sytuacji. PDF zostaje po 15 min jako materiał
                  wspierający, a dłuższa konsultacja pojawia się, gdy temat wymaga więcej czasu.
                </p>
              </div>

              <div className="card-grid four-up top-gap shop-entrance-grid">
                {offerEntranceCards.map((card) => (
                  <ShopEntranceCardView key={card.slug} card={card} />
                ))}
              </div>
            </section>

            <section className="offer-feature-card tree-backed-card offer-feature-card-support">
              <div className="offer-feature-media">
                <Image
                  src={SPECIALIST_CAT_SUPPORT_PHOTO.src}
                  alt={SPECIALIST_CAT_SUPPORT_PHOTO.alt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 980px) 100vw, 42vw"
                  className="section-feature-image"
                />
                </div>

                <div className="offer-feature-content">
                <div className="section-eyebrow">Spokojny start</div>
                <h2>Najpierw 15 min porządkuje kierunek, a PDF wspiera powrót do zaleceń.</h2>
                <p className="offer-feature-summary">
                  Jeśli temat wymaga doprecyzowania, najkrótszy start pokaże, czy wystarczy prosty kierunek, materiał PDF, czy lepiej wejść
                  szerzej.
                </p>
                <div className="offer-card-meta-stack">
                  <div className="offer-card-meta">
                    <span className="offer-card-meta-label">Dla kogo</span>
                    <span>Dla osób, które chcą spokojnie wybrać pierwszy sensowny krok i nie mieszać ról produktów.</span>
                  </div>
                  <div className="offer-card-meta">
                    <span className="offer-card-meta-label">Co dostajesz</span>
                    <span>Krótki, czytelny punkt startu i prostszy wybór dalszej ścieżki.</span>
                  </div>
                  <div className="offer-card-meta offer-card-meta-muted">
                    <span className="offer-card-meta-label">Dalej</span>
                    <span>Jeśli trzeba, przechodzisz do dłuższej konsultacji, kontaktu albo PDF jako wsparcia między krokami.</span>
                  </div>
                </div>
              </div>
            </section>

            {pdfOffer ? (
              <section className="offer-feature-card tree-backed-card offer-feature-card-pdf">
                <div className="offer-feature-media">
                  <PdfGuideCoverStack
                    guides={featuredPdfGuides}
                    title="Poradniki PDF"
                    className="offer-card-stack offer-feature-stack"
                    showLegend
                  />
                </div>

                <div className="offer-feature-content">
                  <div className="offer-card-kicker-row">
                    <span className="offer-card-kicker">PDF osobno</span>
                    <div className="offer-feature-pills" aria-label="Zawartość PDF">
                      <span className="pill subtle-pill offer-feature-pill">{pdfGuideCount} PDF</span>
                      <span className="pill subtle-pill offer-feature-pill">{pdfBundleCount} pakiety</span>
                    </div>
                  </div>
                  <h2>{pdfOffer.title}</h2>
                  <p className="offer-feature-summary">
                    {pdfGuideCount} poradników i {pdfBundleCount} pakietów. To druga ścieżka, jeśli chcesz wrócić do zaleceń we własnym
                    tempie albo pracować między konsultacjami.
                  </p>
                  <div className="offer-card-meta-stack">
                    <div className="offer-card-meta">
                      <span className="offer-card-meta-label">Dla kogo</span>
                      <span>{pdfOffer.forWho}</span>
                    </div>
                    <div className="offer-card-meta">
                      <span className="offer-card-meta-label">Kiedy wybrać</span>
                      <span>{pdfOffer.whenToChoose}</span>
                    </div>
                    <div className="offer-card-meta">
                      <span className="offer-card-meta-label">Co dostajesz</span>
                      <span>{pdfOffer.outcomes.join(' · ')}</span>
                    </div>
                    <div className="offer-card-meta offer-card-meta-muted">
                      <span className="offer-card-meta-label">Dalej</span>
                      <span>{pdfOffer.nextStep}</span>
                    </div>
                  </div>
                  <div className="offer-card-actions">
                    <Link href={getOfferDetailHref(pdfOffer)} prefetch={false} className="button button-primary">
                      {pdfOffer.detailCtaLabel ?? 'Zobacz szczegóły'}
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="offer-section-block offer-section-block-moretime" id="wiecej-czasu">
              <div className="offer-section-head">
                <div className="offer-section-title-block">
                  <span className="offer-section-marker" aria-hidden="true">
                    02
                  </span>
                  <div>
                    <div className="section-eyebrow offer-section-eyebrow">Upgrade path</div>
                    <h2>Gdy temat nie mieści się w 15 min</h2>
                  </div>
                </div>
                <p className="offer-section-intro">
                  Tu obie dłuższe usługi prowadzą już do realnej rezerwacji. Wybierasz je wtedy, gdy temat wraca mimo prób, problemów jest kilka
                  naraz albo potrzebny jest szerszy plan.
                </p>
              </div>

              <div className="offer-grid top-gap offer-grid-balanced">
                {moreTimeOffers.map((offer) => renderOfferCard(offer, 'secondary'))}
              </div>
            </section>

            <section className="offer-section-block offer-section-block-further">
              <div className="offer-section-head">
                <div className="offer-section-title-block">
                  <span className="offer-section-marker" aria-hidden="true">
                    03
                  </span>
                  <div>
                    <div className="section-eyebrow offer-section-eyebrow">Dalsze opcje</div>
                    <h2>Jeśli sytuacja wymaga kolejnego poziomu wsparcia</h2>
                  </div>
                </div>
                <p className="offer-section-intro">
                  To ścieżki na dalszy etap: praca na miejscu, terapia albo pobyt, gdy widać sens takiego kroku. Zwykle wchodzą dopiero po 15
                  min albo po szerszej konsultacji.
                </p>
              </div>

              <div className="offer-grid top-gap offer-grid-balanced">
                {furtherOffers.map((offer) => renderOfferCard(offer, 'tertiary'))}
              </div>
            </section>
          </div>
        </section>

        <Footer
          variant="full"
          ctaHref={FUNNEL_PRIMARY_HREF}
          ctaLabel={FUNNEL_PRIMARY_LABEL}
          secondaryHref={FUNNEL_SECONDARY_HREF}
          secondaryLabel={FUNNEL_SECONDARY_LABEL}
        />
      </div>
    </main>
  )
}
