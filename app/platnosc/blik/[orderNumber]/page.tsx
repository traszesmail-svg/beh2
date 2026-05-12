import type { Metadata } from 'next'
import Link from 'next/link'
import { CommerceBlikActions } from '@/components/CommerceBlikActions'
import { NotatnikPageShell, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { formatCommercePrice } from '@/lib/commerce'
import { prepareCommerceManualPayment } from '@/lib/server/commerce-store'
import { getManualPaymentConfig } from '@/lib/server/payment-options'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'BLIK na telefon',
    path: '/platnosc/blik',
    description: 'Instrukcja ręcznej płatności BLIK na telefon.',
    noIndex: false,
    follow: true,
  })
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const tail = digits.slice(-3)
  return `*** *** ${tail || '---'}`
}

export default async function BlikPaymentPage({ params }: { params: { orderNumber: string } }) {
  const order = await prepareCommerceManualPayment(params.orderNumber)
  const manual = getManualPaymentConfig()
  const fullPhone = manual.phone ?? ''

  return (
    <NotatnikPageShell
      tag="BLIK na telefon"
      navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS}
      ctaHref="/dostep"
      ctaLabel="Wpisz kod"
      footerPrimaryHref="/dostep"
      footerPrimaryLabel="Wpisz kod dostępu"
      pageClassName="commerce-flow-page"
    >
      <div className="container">
        <section className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel">
          {!order ? (
            <div className="stack-gap">
              <h1>Nie znaleziono zamówienia</h1>
              <div className="error-box">Ten link do płatności jest nieprawidłowy albo wygasł.</div>
              <Link href="/kontakt#formularz" className="button button-primary big-button">
                Opisz krótko, co się dzieje
              </Link>
            </div>
          ) : !manual.isAvailable || !fullPhone ? (
            <div className="stack-gap">
              <h1>BLIK jest chwilowo niedostępny</h1>
              <div className="error-box">{manual.summary}</div>
              <Link href={`/checkout?orderNumber=${encodeURIComponent(order.orderNumber)}`} className="button button-primary big-button">
                Wróć do metod płatności
              </Link>
            </div>
          ) : (
            <>
              <div className="section-eyebrow">Płatność ręczna</div>
              <h1>Wyślij BLIK na telefon</h1>
              <p className="hero-text small-width center-text">
                Kwota: <strong>{formatCommercePrice(order.manualAmount)}</strong>. W tytule przelewu wpisz dokładnie numer zamówienia.
              </p>
              <CommerceBlikActions
                orderNumber={order.orderNumber}
                phone={fullPhone}
                maskedPhone={maskPhone(fullPhone)}
              />
              <div className="disclaimer">
                Po wykonaniu przelewu kliknij „Zapłaciłem/am”. Dostęp zostanie aktywowany po ręcznym potwierdzeniu płatności.
              </div>
            </>
          )}
        </section>
      </div>
    </NotatnikPageShell>
  )
}
