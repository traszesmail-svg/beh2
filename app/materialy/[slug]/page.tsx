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
  categoryLabel,
  getMaterialyGuideBySlug,
  listMaterialyGuides,
} from '@/lib/materialy-catalog'

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return listMaterialyGuides().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const guide = getMaterialyGuideBySlug(params.slug)
  if (!guide) return { title: 'Material nieznaleziony' }
  return buildMarketingMetadata({
    title: `${guide.title} | Materialy PDF`,
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

  return (
    <NotatnikPageShell
      tag={`Materialy / ${categoryLabel(guide.category)}`}
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">
            {categoryLabel(guide.category)} · {priceLabel}
          </div>
          <h1>{guide.title}</h1>
          <p>{guide.subtitle}</p>
          <p style={{ marginTop: '12px' }}>{guide.shortPromise}</p>

          {guide.highlights.length > 0 && (
            <ul style={{ margin: '20px 0 0', padding: '0 0 0 18px', color: 'var(--ink-quiet)' }}>
              {guide.highlights.map((h) => (
                <li key={h} style={{ margin: '4px 0' }}>{h}</li>
              ))}
            </ul>
          )}

          <div className="notatnik-subhero-actions" style={{ marginTop: '24px' }}>
            <Link href="#zamow" prefetch={false} className="notatnik-btn">
              <span>{isFree ? 'Pobierz bezplatnie' : `Zamow za ${priceLabel}`}</span>
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
          <div className="section-eyebrow">Dla kogo</div>
          <h3>{guide.subtitle}</h3>
          <p>{guide.forWhom}</p>
        </div>
      </section>

      <section id="zamow">
        <NotatnikSectionHead
          index="I."
          kicker={isFree ? 'Bezplatne pobranie' : 'Zamowienie BLIK-iem'}
          title={isFree ? 'Podaj e-mail i wysle kod do pobrania.' : 'Wypelnij dane i zaplac BLIK-iem.'}
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
        <NotatnikSectionHead index="II." kicker="Jak to dziala" title="3 kroki do PDF-a." />
        <div className="notatnik-steps">
          <article className="notatnik-step">
            <div className="notatnik-step-number">01</div>
            <p>
              {isFree
                ? 'Podajesz imie i e-mail. Kod do pobrania przychodzi mailem od razu.'
                : 'Wypelniasz formularz. Dostajesz numer zamowienia i instrukcje BLIK na podany e-mail.'}
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">02</div>
            <p>
              {isFree
                ? 'Wpisujesz e-mail i kod na stronie /materialy/pobranie.'
                : 'Robisz BLIK-a na podany numer telefonu. Po zaksiegowaniu (do 60 min, pon–pt 8–18) wysylam kod mailem.'}
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">03</div>
            <p>Pobierasz PDF. Kod dziala 72 godziny i pozwala na maks. 3 pobrania.</p>
          </article>
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli temat jest mieszany, <em>Kwadrans porzadkuje go w 15 minut.</em>"
        copy="PDF jest dobry punkt startu, ale przy splatanym temacie rozmowa jest szybsza."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref="/materialy"
        secondaryLabel="Inne materialy PDF"
      />
    </NotatnikPageShell>
  )
}
