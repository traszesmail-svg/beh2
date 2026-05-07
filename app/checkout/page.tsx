import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CommerceCheckoutActions } from '@/components/CommerceCheckoutActions'
import { NotatnikPageShell, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { formatCommercePrice } from '@/lib/commerce'
import {
  createOrReuseConsultationCommerceOrder,
  isCommerceTestModeAllowed,
} from '@/lib/server/commerce-service'
import { getCommerceOrder } from '@/lib/server/commerce-store'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Wybierz metodę płatności',
    path: '/checkout',
    description: 'Wybierz płatność online albo BLIK na telefon.',
    noIndex: false,
    follow: true,
  })
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const orderNumber = readParam(searchParams?.orderNumber)
  const bookingId = readParam(searchParams?.bookingId)
  const access = readParam(searchParams?.access)

  if (!orderNumber && bookingId) {
    const order = await createOrReuseConsultationCommerceOrder(bookingId, access, headers().get('authorization'))
    redirect(`/checkout?orderNumber=${encodeURIComponent(order.orderNumber)}`)
  }

  const order = orderNumber ? await getCommerceOrder(orderNumber) : null
  const stripeAvailable = Boolean(process.env.STRIPE_SECRET_KEY?.trim())

  return (
    <NotatnikPageShell
      tag="Płatność"
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
              <div className="error-box">Ten link do checkoutu jest nieprawidłowy albo wygasł.</div>
              <div className="hero-actions centered-actions">
                <Link href="/kontakt#formularz" className="button button-primary big-button">
                  Napisz wiadomość
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="section-eyebrow">Wybierz metodę płatności</div>
              <h1>Opłać zamówienie {order.orderNumber}</h1>
              <p className="hero-text small-width center-text">
                Wybierz wygodną płatność online albo tańszy, ręczny BLIK na telefon. Po potwierdzeniu dostaniesz kod dostępu.
              </p>
              <div className="summary-grid">
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Produkt</div>
                  <div className="summary-value">{order.productName}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Online</div>
                  <div className="summary-value">{formatCommercePrice(order.onlineAmount)}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">BLIK na telefon</div>
                  <div className="summary-value">{formatCommercePrice(order.manualAmount)}</div>
                </div>
              </div>
              <CommerceCheckoutActions
                orderNumber={order.orderNumber}
                productName={order.productName}
                onlineAmount={order.onlineAmount}
                manualAmount={order.manualAmount}
                stripeAvailable={stripeAvailable}
                testModeAllowed={isCommerceTestModeAllowed()}
              />
            </>
          )}
        </section>
      </div>
    </NotatnikPageShell>
  )
}
