import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { PdfOrderForm } from '@/components/PdfOrderForm'
import { Schema } from '@/components/schema'
import { buildPdfOrderHref, getPdfBundleBySlug, getPdfGuideBySlug } from '@/lib/pdf-guides'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildTechnicalMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_PAYMENT_EMAIL_STEP, PUBLIC_OFFER_PAYMENT_METHODS } from '@/lib/public-offer-copy'

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
  const detailHref = item.routePath

  return (
    <NotatnikPageShell
      tag="PDF / zamowienie"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/book?service=szybka-konsultacja-15-min"
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={buildPdfOrderHref({ guideSlug, bundleSlug })}
      footerPrimaryLabel={guide ? 'Zamow PDF' : 'Zamow pakiet'}
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Zamow PDF', path: '/zamow-pdf' },
          ]),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Zamowienie / PDF</div>
          <h1>
            Zamow <em>{item.title}</em>.
          </h1>
          <p>
            To nie jest zwykly link do kontaktu. Formularz zapisuje zamowienie konkretnego produktu, a dalszy krok przychodzi mailowo:
            {' '}
            {PUBLIC_OFFER_PAYMENT_METHODS}.
          </p>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Jak to dziala</div>
          <h3>Krotki formularz, potem mail i platnosc.</h3>
          <p>
            Najpierw wysylasz zamowienie. Potem odpisuje z potwierdzeniem wyboru i dalszym krokiem platnosci. BLIK na telefon zostaje dostepny bez publikowania numeru na stronie.
          </p>
          <p>{PUBLIC_OFFER_PAYMENT_EMAIL_STEP}</p>
          <p>
            <Link href={detailHref} prefetch={false} className="prep-inline-link">
              Wroc do opisu produktu
            </Link>
          </p>
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz zamowienia</div>
          <h2>
            Zostaw dane, <em>a ja odpisze z potwierdzeniem.</em>
          </h2>
          <div className="contact-form-card" id="formularz">
            <PdfOrderForm itemType={itemType} itemSlug={itemSlug} itemTitle={item.title} itemPrice={item.pricing} />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Co dostaniesz po wyslaniu</h3>
          <div className="notatnik-steps">
            {[
              '1. Potwierdzenie, ze zamowienie dotyczy wlasciwego PDF-u albo pakietu.',
              '2. Dalszy krok platnosci: przycisk do PayPal albo instrukcja BLIK na telefon.',
              '3. Mail z informacja o dostepie albo nastepnym kroku po wplacie.',
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

export function generateMetadata({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}): Metadata {
  const guideSlug = typeof searchParams?.guide === 'string' ? searchParams.guide : null
  const bundleSlug = typeof searchParams?.bundle === 'string' ? searchParams.bundle : null
  const guide = guideSlug ? getPdfGuideBySlug(guideSlug) : null
  const bundle = bundleSlug ? getPdfBundleBySlug(bundleSlug) : null
  const item = guide ?? bundle
  const path = buildPdfOrderHref({ guideSlug, bundleSlug })

  return buildTechnicalMetadata({
    title: item ? `Zamowienie: ${item.title}` : 'Zamowienie PDF i pakietow',
    path,
    description: item
      ? `Formularz zamowienia: ${item.title}. Potwierdzenie oraz dalszy krok platnosci przychodza mailowo.`
      : 'Formularz zamowienia poradnikow PDF i pakietow. Potwierdzenie oraz dalszy krok platnosci przychodza mailowo.',
    noIndex: true,
    follow: true,
  })
}
