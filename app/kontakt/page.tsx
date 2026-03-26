import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OFFERS, getOfferBySlug } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { buildMailtoHref, getContactDetails } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt',
  path: '/kontakt',
  description:
    'Kontakt do marki Regulski | Terapia behawioralna. Opisz sytuację psa lub kota i dobierz odpowiednią formę współpracy.',
})

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const serviceSlug = readSearchParam(searchParams?.service)
  const selectedOffer = serviceSlug ? getOfferBySlug(serviceSlug) : null
  const contact = getContactDetails()
  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        selectedOffer ? `Zapytanie - ${selectedOffer.title}` : 'Zapytanie - Regulski | Terapia behawioralna',
        `Dzień dobry,\n\nopisuję krótko swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- interesująca mnie forma pracy: ${selectedOffer?.title ?? ''}\n\nNajwygodniejsza forma kontaktu zwrotnego:\n`,
      )
    : null

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Kontakt i dobór ścieżki</div>
            <h1>{selectedOffer ? `Zapytanie o: ${selectedOffer.title}` : 'Opisz swoją sytuację i dobierz formę współpracy.'}</h1>
            <p className="hero-text">
              Jeśli nie wiesz, od czego zacząć, napisz kilka zdań o problemie psa lub kota. Lepiej dobrać właściwy próg
              wejścia niż zaczynać od przypadkowej usługi.
            </p>

            {selectedOffer ? (
              <div className="list-card accent-outline tree-backed-card top-gap">
                <strong>Wybrana ścieżka</strong>
                <span>{selectedOffer.heroSummary}</span>
              </div>
            ) : null}

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Co warto napisać</strong>
                <span>Gatunek, główny problem, od kiedy trwa, co jest dziś najtrudniejsze i jaka forma pracy wydaje Ci się najbliższa.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Jak odpowiadam</strong>
                <span>Odpowiadam tak, żeby zaproponować właściwy kierunek: konsultację startową, konsultację pogłębioną, terapię, wizytę lub pobyt.</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              {mailtoHref ? (
                <a href={mailtoHref} className="button button-primary big-button">
                  Wyślij e-mail
                </a>
              ) : null}
              {contact.phoneDisplay && contact.phoneHref ? (
                <a href={`tel:${contact.phoneHref}`} className="button button-ghost big-button">
                  Zadzwoń
                </a>
              ) : null}
              <Link href="/book" className="button button-ghost big-button">
                Umów konsultację 15 min
              </Link>
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Skróty do ścieżek</div>
            <h2>Najczęściej wybierane wejścia</h2>
            <div className="stack-gap top-gap">
              {OFFERS.filter((offer) => offer.kind !== 'resource').map((offer) => (
                <div key={offer.slug} className="list-card tree-backed-card">
                  <strong>{offer.title}</strong>
                  <span>{offer.cardSummary}</span>
                  <div className="offer-card-actions top-gap-small">
                    <Link href={`/oferta/${offer.slug}`} className="button button-ghost">
                      Szczegóły
                    </Link>
                    <Link href={offer.primaryHref} className="button button-primary">
                      {offer.primaryCtaLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
