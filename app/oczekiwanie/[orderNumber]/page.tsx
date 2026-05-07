import type { Metadata } from 'next'
import Link from 'next/link'
import { CommerceWaitingStatus } from '@/components/CommerceWaitingStatus'
import { NotatnikPageShell, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { canUseCommerceAccess, getCommerceOrder } from '@/lib/server/commerce-store'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Oczekiwanie na potwierdzenie płatności',
    path: '/oczekiwanie',
    description: 'Status zamówienia i kod dostępu po potwierdzeniu płatności.',
    noIndex: false,
    follow: true,
  })
}

export default async function WaitingPage({ params }: { params: { orderNumber: string } }) {
  const order = await getCommerceOrder(params.orderNumber)
  const accessReady = order ? canUseCommerceAccess(order) : false
  const accessUrl = order && accessReady
    ? `/pokoj?code=${encodeURIComponent(order.accessCode!)}&email=${encodeURIComponent(order.customerEmail)}`
    : null

  return (
    <NotatnikPageShell
      tag="Status płatności"
      navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS}
      ctaHref="/dostep"
      ctaLabel="Wpisz kod"
      footerPrimaryHref="/dostep"
      footerPrimaryLabel="Wpisz kod dostępu"
    >
      <div className="container">
        <section className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel">
          {!order ? (
            <div className="stack-gap">
              <h1>Nie znaleziono zamówienia</h1>
              <div className="error-box">Ten link jest nieprawidłowy albo wygasł.</div>
              <Link href="/kontakt#formularz" className="button button-primary big-button">
                Napisz wiadomość
              </Link>
            </div>
          ) : (
            <>
              <div className="section-eyebrow">Zamówienie {order.orderNumber}</div>
              <h1>Zgłoszenie płatności zostało wysłane.</h1>
              <p className="hero-text small-width center-text">
                Po potwierdzeniu płatności otrzymasz kod dostępu na e-mail. Możesz zostać na tej stronie, status sprawdzi się automatycznie.
              </p>
              <CommerceWaitingStatus
                orderNumber={order.orderNumber}
                initialStatus={order.status}
                initialAccessCode={accessReady ? order.accessCode : null}
                initialAccessUrl={accessUrl}
              />
            </>
          )}
        </section>
      </div>
    </NotatnikPageShell>
  )
}
