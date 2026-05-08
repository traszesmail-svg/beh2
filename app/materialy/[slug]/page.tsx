import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { MaterialyOrderForm } from '@/components/MaterialyOrderForm'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PRICE_LABEL,
  PRICE_AMOUNT_PLN,
  categoryLabel,
  getMaterialyGuideBySlug,
  getMaterialyGuideCoverSrc,
  getMaterialyGuidePreviewSrcs,
  listMaterialyGuides,
} from '@/lib/materialy-catalog'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return listMaterialyGuides().map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const guide = getMaterialyGuideBySlug(params.slug)
  if (!guide) return { title: 'Materiał nieznaleziony' }

  return buildMarketingMetadata({
    title: guide.title,
    path: `/materialy/${guide.slug}`,
    description: `${guide.subtitle}. ${guide.shortPromise}`,
  })
}

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)

export default function MaterialyGuidePage({ params }: { params: Params }) {
  const guide = getMaterialyGuideBySlug(params.slug)
  if (!guide) notFound()

  const isFree = guide.priceCode === 'free'
  const priceAmount = PRICE_AMOUNT_PLN[guide.priceCode]
  const priceLabel = PRICE_LABEL[guide.priceCode]
  const coverSrc = getMaterialyGuideCoverSrc(guide)
  const previews = getMaterialyGuidePreviewSrcs(guide, 3)

  return (
    <NotatnikPageShell
      tag={`Materiały / ${categoryLabel(guide.category)}`}
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zł"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorystą"
      sideVisualVariant={guide.category === 'cat' ? 'cat' : guide.category === 'dog' ? 'dog' : 'materials'}
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">
            {categoryLabel(guide.category)} · {priceLabel}
          </div>
          <h1>{guide.title}</h1>
          <p>{guide.subtitle}</p>
          <p style={{ marginTop: '12px' }}>{guide.shortPromise}</p>

          {guide.highlights.length > 0 ? (
            <ul style={{ margin: '20px 0 0', padding: '0 0 0 18px', color: 'var(--ink-quiet)' }}>
              {guide.highlights.map((highlight) => (
                <li key={highlight} style={{ margin: '4px 0' }}>
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="notatnik-subhero-actions" style={{ marginTop: '24px' }}>
            <Link href="#zamow" prefetch={false} className="notatnik-btn">
              <span>{isFree ? 'Pobierz bezpłatnie' : `Zamów za ${priceLabel}`}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/materialy" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Wszystkie materiały</span>
            </Link>
          </div>
        </div>

        <div className="notatnik-material-detail-side">
          <div className="notatnik-material-detail-cover-card" aria-label={`Okładka PDF: ${guide.title}`}>
            <Image
              src={coverSrc}
              alt={`Okładka PDF: ${guide.title}`}
              fill
              sizes="(max-width: 760px) 72vw, (max-width: 1200px) 30vw, 320px"
              className="notatnik-material-detail-cover-image"
              priority
              unoptimized
            />
          </div>
          <div className="summary-card tree-backed-card">
            <div className="section-eyebrow">Dla kogo</div>
            <h3>{guide.subtitle}</h3>
            <p>{guide.forWhom}</p>
          </div>
        </div>
      </section>

      <section id="podglad" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="I." kicker="Podgląd" title="Pierwsze strony materiału." />
        <div className="notatnik-material-preview-grid">
          {previews.map((src, index) => (
            <div key={src} className="notatnik-material-preview-page">
              <Image
                src={src}
                alt={`Podgląd strony ${index + 1}: ${guide.title}`}
                fill
                sizes="(max-width: 760px) 84vw, 260px"
                className="notatnik-material-preview-image"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      <section id="zamow">
        <NotatnikSectionHead
          index="II."
          kicker={isFree ? 'Bezpłatne pobranie' : 'Zamówienie'}
          title={isFree ? 'Podaj e-mail i wyślę kod do pobrania.' : 'Wypełnij dane i przejdź do płatności.'}
        />

        <MaterialyOrderForm
          productKind="guide"
          productSlug={guide.slug}
          productTitle={guide.title}
          priceLabel={priceLabel}
          priceAmount={priceAmount}
        />
      </section>

      <section id="jak-to-dziala" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="III." kicker="Jak to działa" title="3 kroki do PDF-a." />
        <div className="notatnik-steps">
          <article className="notatnik-step">
            <div className="notatnik-step-number">01</div>
            <p>
              {isFree
                ? 'Podajesz imię i e-mail. Kod do pobrania przychodzi mailem od razu.'
                : 'Wypełniasz formularz. Dostajesz numer zamówienia i przechodzisz do płatności.'}
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">02</div>
            <p>
              {isFree
                ? 'Wpisujesz e-mail i kod na stronie /dostep.'
                : 'Po potwierdzeniu płatności system wysyła kod dostępu na e-mail.'}
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">03</div>
            <p>Pobierasz PDF. Kod działa 72 godziny i pozwala na maksymalnie 3 pobrania.</p>
          </article>
        </div>
      </section>

      <NotatnikFinalCta
        title="Jeśli temat jest mieszany, <em>Kwadrans porządkuje go w 15 minut.</em>"
        copy="PDF jest dobry jako spokojny start. Przy splątanym temacie rozmowa jest szybsza."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zł"
        secondaryHref="/materialy"
        secondaryLabel="Inne materiały PDF"
      />
    </NotatnikPageShell>
  )
}
