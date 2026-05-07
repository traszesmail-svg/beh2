import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import {
  getMaterialyBundleBySlug,
  getMaterialyGuideBySlug,
  type MaterialyGuide,
} from '@/lib/materialy-catalog'
import {
  canUseCommerceAccess,
  getCommerceOrderByAccessCode,
} from '@/lib/server/commerce-store'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Pokój / dostęp',
    path: '/pokoj',
    description: 'Dostęp do opłaconej konsultacji albo materiału cyfrowego.',
    noIndex: false,
    follow: true,
  })
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default async function RoomAccessPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const code = readParam(searchParams?.code)?.trim().toUpperCase() ?? ''
  const email = readParam(searchParams?.email)?.trim().toLowerCase() ?? ''
  const order = code && email ? await getCommerceOrderByAccessCode(code, email) : null
  const hasAccess = Boolean(order && canUseCommerceAccess(order))

  const guide = order?.productType === 'ebook' && order.meta.productKind === 'guide' && order.meta.productSlug
    ? getMaterialyGuideBySlug(order.meta.productSlug)
    : null
  const bundle = order?.productType === 'ebook' && order.meta.productKind === 'bundle' && order.meta.productSlug
    ? getMaterialyBundleBySlug(order.meta.productSlug)
    : null
  const bundleGuides = bundle?.guideSlugs
    .map((slug) => getMaterialyGuideBySlug(slug))
    .filter((item): item is MaterialyGuide => Boolean(item)) ?? []

  return (
    <NotatnikPageShell
      tag="Dostęp"
      navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS}
      ctaHref="/dostep"
      ctaLabel="Wpisz kod"
      footerPrimaryHref="/dostep"
      footerPrimaryLabel="Wpisz kod dostępu"
    >
      <div className="container">
        <section className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel">
          {!hasAccess || !order ? (
            <div className="stack-gap">
              <h1>Kod jest nieprawidłowy albo wygasł.</h1>
              <div className="error-box">Wpisz kod ponownie na stronie dostępu albo napisz wiadomość, jeśli płatność była potwierdzona.</div>
              <div className="hero-actions centered-actions">
                <Link href="/dostep" className="button button-primary big-button">
                  Wpisz kod ponownie
                </Link>
                <Link href="/kontakt#formularz" className="button button-ghost big-button">
                  Kontakt
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="section-eyebrow">Dostęp aktywny</div>
              <h1>{order.productName}</h1>
              <p className="hero-text small-width center-text">
                Kod jest poprawny. Poniżej masz dostęp do opłaconej konsultacji albo materiału.
              </p>

              {order.productType === 'consultation' && order.meta.bookingId ? (
                <div className="list-card accent-outline tree-backed-card top-gap">
                  <strong>Pokój konsultacji</strong>
                  <span>Przejdź do pokoju rozmowy. Jeśli termin jeszcze nie nadszedł, zachowaj ten link.</span>
                  <Link
                    href={`/call/${order.meta.bookingId}${order.meta.bookingAccessToken ? `?access=${encodeURIComponent(order.meta.bookingAccessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Wejdź do pokoju
                  </Link>
                </div>
              ) : null}

              {guide ? (
                <div className="list-card accent-outline tree-backed-card top-gap">
                  <strong>{guide.title}</strong>
                  <span>{guide.shortPromise}</span>
                  <a
                    href={`/api/access/download?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`}
                    className="button button-primary big-button"
                  >
                    Pobierz PDF
                  </a>
                </div>
              ) : null}

              {bundle ? (
                <div className="stack-gap top-gap">
                  <div className="list-card accent-outline tree-backed-card">
                    <strong>{bundle.title}</strong>
                    <span>{bundle.shortPromise}</span>
                  </div>
                  <div className="summary-grid trust-grid">
                    {bundleGuides.map((item, index) => (
                      <div key={item.slug} className="summary-card trust-card tree-backed-card">
                        <strong>{item.title}</strong>
                        <span>{item.shortPromise}</span>
                        <a
                          href={`/api/access/download?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}&part=${index}`}
                          className="button button-ghost"
                        >
                          Pobierz PDF
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="disclaimer">
                Kod: <strong>{order.accessCode}</strong>. Limit użyć: {order.accessCodeUsageCount}/{order.accessCodeUsageLimit}.
              </div>
            </>
          )}
        </section>
      </div>
    </NotatnikPageShell>
  )
}
