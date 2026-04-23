import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { PdfOrderForm } from '@/components/PdfOrderForm'
import { Schema } from '@/components/schema'
import { buildPdfOrderHref, getPdfBundleBySlug, getPdfGuideBySlug } from '@/lib/pdf-guides'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Zamówienie PDF i pakietów',
  path: '/zamow-pdf',
  description: 'Formularz zamówienia poradników PDF i pakietów. Potwierdzenie oraz dane do BLIK-a przychodzą mailowo.',
})

export default function PdfOrderPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const guideSlug = typeof searchParams?.guide === 'string' ? searchParams.guide : null
  const bundleSlug = typeof searchParams?.bundle === 'string' ? searchParams.bundle : null
  const guide = guideSlug ? getPdfGuideBySlug(guideSlug) : null
  const bundle = bundleSlug ? getPdfBundleBySlug(bundleSlug) : null
  const item = guide ?? bundle

  if (!item) {
    notFound()
  }

  const itemType = guide ? 'guide' : 'bundle'
  const itemSlug = item.slug
  const detailHref = guide ? item.routePath : item.routePath

  return (
    <NotatnikPageShell
      tag="PDF / zamówienie"
      navItems={[
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/oferta/poradniki-pdf', label: 'PDF-y' },
        { href: '/cennik', label: 'Cennik' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={detailHref}
      ctaLabel="Wróć do opisu"
      footerPrimaryHref={buildPdfOrderHref({ guideSlug, bundleSlug })}
      footerPrimaryLabel={guide ? 'Zamów PDF' : 'Zamów pakiet'}
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Zamów PDF', path: '/zamow-pdf' },
          ]),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Zamówienie / PDF</div>
          <h1>
            Zamów <em>{item.title}</em>.
          </h1>
          <p>
            To nie jest zwykły link do kontaktu. Formularz zapisuje zamówienie konkretnego produktu, a dalszy krok przychodzi mailowo
            razem z danymi do BLIK-a.
          </p>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Jak to działa</div>
          <h3>Krótki formularz, potem mail i BLIK.</h3>
          <p>
            Najpierw wysyłasz zamówienie. Potem odpisuję z potwierdzeniem wyboru, numerem telefonu do BLIK-a i dalszym krokiem dostępu.
          </p>
          <p>
            <Link href={detailHref} prefetch={false} className="prep-inline-link">
              Wróć do opisu produktu
            </Link>
          </p>
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz zamówienia</div>
          <h2>
            Zostaw dane, <em>a ja odpiszę z potwierdzeniem.</em>
          </h2>
          <div className="contact-form-card" id="formularz">
            <PdfOrderForm itemType={itemType} itemSlug={itemSlug} itemTitle={item.title} itemPrice={item.pricing} />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Co dostaniesz po wysłaniu</h3>
          <div className="notatnik-steps">
            {[
              '1. Potwierdzenie, że zamówienie dotyczy właściwego PDF-u albo pakietu.',
              '2. Numer telefonu do BLIK-a i dalszą instrukcję płatności.',
              '3. Mail z informacją o dostępie albo następnym kroku po wpłacie.',
            ].map((step, index) => (
              <article key={step} className="notatnik-step">
                <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
