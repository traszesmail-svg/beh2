import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Produkt cyfrowy i konsultacje',
    path: '/produkt',
    description: 'Wybierz konsultację albo materiał cyfrowy i przejdź do płatności.',
    noIndex: false,
    follow: true,
  })
}

export default function ProductPage() {
  return (
    <NotatnikPageShell
      tag="Produkt"
      navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS}
      ctaHref="/dostep"
      ctaLabel="Wpisz kod"
      footerPrimaryHref="/dostep"
      footerPrimaryLabel="Wpisz kod dostępu"
    >
      <div className="container">
        <section className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel">
          <div className="section-eyebrow">Konsultacje i ebooki</div>
          <h1>Wybierz, co chcesz opłacić.</h1>
          <p className="hero-text small-width center-text">
            Ten system obsługuje konsultacje oraz materiały cyfrowe. Po płatności dostajesz kod dostępu.
          </p>
          <div className="summary-grid trust-grid top-gap">
            <div className="summary-card trust-card tree-backed-card">
              <strong>Konsultacja</strong>
              <span>Wybierz temat, termin i przejdź do płatności online albo BLIK na telefon.</span>
              <Link href="/wybor" className="button button-primary big-button">
                Wybierz konsultację
              </Link>
            </div>
            <div className="summary-card trust-card tree-backed-card">
              <strong>Ebook / PDF</strong>
              <span>Wybierz materiał, opłać online albo BLIK-iem i odbierz kod dostępu.</span>
              <Link href="/materialy" className="button button-primary big-button">
                Zobacz materiały
              </Link>
            </div>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
