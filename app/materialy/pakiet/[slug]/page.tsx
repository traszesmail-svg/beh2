import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { MaterialyOrderForm } from '@/components/MaterialyOrderForm'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PRICE_LABEL,
  PRICE_AMOUNT_PLN,
  bundleSavings,
  categoryLabel,
  getMaterialyBundleBySlug,
  getMaterialyGuideBySlug,
  listMaterialyBundles,
} from '@/lib/materialy-catalog'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return listMaterialyBundles().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const bundle = getMaterialyBundleBySlug(params.slug)
  if (!bundle) return { title: 'Pakiet nieznaleziony' }
  return buildMarketingMetadata({
    title: `${bundle.title} | Pakiet PDF 49 zl`,
    path: `/materialy/pakiet/${bundle.slug}`,
    description: `${bundle.subtitle}. ${bundle.shortPromise}`,
  })
}

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)

export default function MaterialyBundlePage({ params }: { params: Params }) {
  const bundle = getMaterialyBundleBySlug(params.slug)
  if (!bundle) notFound()

  const guides = bundle.guideSlugs
    .map((slug) => getMaterialyGuideBySlug(slug))
    .filter((g): g is NonNullable<ReturnType<typeof getMaterialyGuideBySlug>> => g !== null)
  const savings = bundleSavings(bundle)
  const priceLabel = PRICE_LABEL[bundle.priceCode]
  const priceAmount = PRICE_AMOUNT_PLN[bundle.priceCode]

  return (
    <NotatnikPageShell
      tag={`Materialy / Pakiet ${categoryLabel(bundle.category)}`}
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
      sideVisualVariant={bundle.category === 'cat' ? 'cat' : bundle.category === 'dog' || bundle.category === 'puppy' ? 'dog' : 'materials'}
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">
            Pakiet · {categoryLabel(bundle.category)} · {priceLabel}
            {savings > 0 ? ` · oszczedzasz ${savings} zl` : ''}
          </div>
          <h1>{bundle.title}</h1>
          <p>{bundle.subtitle}</p>
          <p style={{ marginTop: '12px' }}>{bundle.shortPromise}</p>

          <div className="notatnik-subhero-actions" style={{ marginTop: '24px' }}>
            <Link href="#zamow" prefetch={false} className="notatnik-btn">
              <span>Zamow pakiet za {priceLabel}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/materialy" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Wszystkie materialy</span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">{guides.length} przewodniki w pakiecie</div>
          <h3>Tansze niz osobno</h3>
          <p>
            {savings > 0
              ? `Suma pojedynczych cen to ${priceAmount + savings} zl. Pakiet kosztuje ${priceAmount} zl — oszczedzasz ${savings} zl.`
              : 'Pakiet jest tansza i bardziej spojna sciezka tematyczna.'}
          </p>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="W pakiecie" title="Co dostajesz w tym zestawie." />
        <div className="notatnik-material-grid top-gap-small">
          {guides.map((g) => (
            <article key={g.slug} className="notatnik-material-card">
              <div className="notatnik-material-tag notatnik-mono">
                {categoryLabel(g.category)} · pojedynczo {PRICE_LABEL[g.priceCode]}
              </div>
              <h3>{g.title}</h3>
              <p style={{ minHeight: '3.6em' }}>{g.subtitle}</p>
              <Link href={`/materialy/${g.slug}`} prefetch={false}>
                Zobacz osobno &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="zamow" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Zamowienie BLIK-iem" title="Wypelnij dane i zaplac BLIK-iem." />
        <MaterialyOrderForm
          productKind="bundle"
          productSlug={bundle.slug}
          productTitle={bundle.title}
          priceLabel={priceLabel}
          priceAmount={priceAmount}
        />
      </section>

      <NotatnikFinalCta
        title="Jesli temat jest mieszany, <em>Kwadrans porzadkuje go w 15 minut.</em>"
        copy="Pakiet daje 3 spojne materialy, ale przy splatanym temacie rozmowa jest szybsza."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref="/materialy"
        secondaryLabel="Inne materialy PDF"
      />
    </NotatnikPageShell>
  )
}
