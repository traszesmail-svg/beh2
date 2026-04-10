import Image from 'next/image'
import Link from 'next/link'
import type { PdfBundle } from '@/lib/pdf-guides'
import type { ShopBookCard, ShopBundleShelfCard, ShopEntranceCard, ShopPdfCard } from '@/lib/shop-catalog'

export function ShopAnchorNav({
  items,
  className = '',
}: {
  items: ReadonlyArray<{ href: string; label: string }>
  className?: string
}) {
  return (
    <nav className={`shop-anchor-nav ${className}`.trim()} aria-label="Nawigacja po półkach">
      {items.map((item) => (
        <Link key={item.href} href={item.href} prefetch={false} className="shop-anchor-pill">
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function ShopEntranceCardView({ card }: { card: ShopEntranceCard }) {
  return (
    <article className="shop-entrance-card tree-backed-card">
      <div className="shop-entrance-topline">
        <span className="section-eyebrow">{card.eyebrow}</span>
      </div>
      <h3>{card.title}</h3>
      <p>{card.summary}</p>
      <div className="hero-actions">
        <Link href={card.href} prefetch={false} className="button button-primary">
          {card.cta}
        </Link>
      </div>
    </article>
  )
}

export function PdfShelfCard({ card }: { card: ShopPdfCard }) {
  return (
    <article className={`pdf-path-card tree-backed-card shop-pdf-card shop-pdf-card-${card.kind}`} data-product-kind={card.kind}>
      <div className="pdf-path-card-topline">
        <span className="section-eyebrow">{card.kindLabel}</span>
        <span className={`shop-pdf-kind shop-pdf-kind-${card.kind}`}>{card.kind === 'pdf' ? 'Produkt PDF' : 'Pakiet PDF'}</span>
      </div>

      <h3>{card.title}</h3>
      <dl className="pdf-path-card-facts">
        <div className="pdf-path-card-fact">
          <dt>Dla kogo</dt>
          <dd>{card.forWho}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Co porządkuje</dt>
          <dd>{card.organizes}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Kiedy wystarcza</dt>
          <dd>{card.enough}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Kiedy lepsza będzie konsultacja</dt>
          <dd>{card.consult}</dd>
        </div>
      </dl>

      <div className="hero-actions pdf-path-card-actions">
        <Link href={card.href} prefetch={false} className={`button ${card.kind === 'pdf' ? 'button-primary' : 'button-ghost'}`}>
          {card.cta}
        </Link>
      </div>
    </article>
  )
}

export function BundleShelfCard({ bundle }: { bundle: ShopBundleShelfCard }) {
  return (
    <article className="pdf-path-card tree-backed-card shop-bundle-card shop-bundle-shelf-card">
      <div className="pdf-path-card-topline">
        <span className="section-eyebrow">Pakiet PDF</span>
        <span className="shop-pdf-kind shop-pdf-kind-pakiet">{bundle.pricing}</span>
      </div>

      <h3>{bundle.title}</h3>
      <p className="pdf-path-card-promise">{bundle.promise}</p>

      <dl className="pdf-path-card-facts">
        <div className="pdf-path-card-fact">
          <dt>Dla kogo</dt>
          <dd>{bundle.audience}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Co porządkuje</dt>
          <dd>{bundle.promise}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Kiedy wystarcza</dt>
          <dd>{bundle.whenEnough}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Kiedy lepsza będzie konsultacja</dt>
          <dd>{bundle.whenConsult}</dd>
        </div>
      </dl>

      <div className="pdf-bundle-guide-row">
        {bundle.guideTitles.map((title) => (
          <span key={title} className="pdf-bundle-guide-pill">
            {title}
          </span>
        ))}
      </div>

      <div className="hero-actions pdf-path-card-actions">
        <Link href={bundle.href} prefetch={false} className="button button-primary">
          {bundle.cta}
        </Link>
      </div>
    </article>
  )
}

export function PdfBundleShelfCard({ bundle }: { bundle: PdfBundle }) {
  return (
    <article className="pdf-path-card tree-backed-card shop-bundle-card">
      <div className="pdf-path-card-topline">
        <span className="section-eyebrow">Pakiet PDF</span>
        <span className="shop-pdf-kind shop-pdf-kind-pakiet">{bundle.pricing}</span>
      </div>

      <h3>{bundle.title}</h3>
      <p className="pdf-path-card-promise">{bundle.promise}</p>

      <dl className="pdf-path-card-facts">
        <div className="pdf-path-card-fact">
          <dt>Dla kogo</dt>
          <dd>{bundle.audience}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Co zawiera</dt>
          <dd>{bundle.guides.map((guide) => guide.title).join(' · ')}</dd>
        </div>
        <div className="pdf-path-card-fact">
          <dt>Wskazówka</dt>
          <dd>Najlepiej, gdy jeden PDF to za mało i chcesz wejść szerzej w temat bez chaosu.</dd>
        </div>
      </dl>

      <div className="hero-actions pdf-path-card-actions">
        <Link href={bundle.pageHref} prefetch={false} className="button button-primary">
          Zobacz pakiet
        </Link>
      </div>
    </article>
  )
}

export function BookShelfCard({ book }: { book: ShopBookCard }) {
  const bookImage = book.image ?? book.coverSrc ?? ''
  const bookImageAlt = book.imageAlt ?? book.coverAlt ?? `Okładka książki ${book.title}`
  const bookDescription =
    book.shortDescription ?? book.note ?? 'Dla osób, które chcą wejść szerzej w temat i wolą papierową półkę obok PDF-ów.'
  const affiliateHref = book.amazonAffiliateUrl ?? book.amazonHref ?? '#'
  const speciesLabel = book.speciesCategory ?? book.species ?? 'papier'

  return (
    <article className="shop-book-card tree-backed-card">
      <div className="shop-book-cover-shell">
        <Image
          src={bookImage}
          alt={bookImageAlt}
          width={900}
          height={1200}
          sizes="(max-width: 680px) 42vw, (max-width: 1100px) 24vw, 18vw"
          className="shop-book-cover"
        />
        <span className="shop-book-badge">link afiliacyjny</span>
      </div>

      <div className="shop-book-copy">
        <div className="shop-book-topline">
          <span className="section-eyebrow">{speciesLabel === 'koty' ? 'Koty' : speciesLabel === 'psy' ? 'Psy' : 'Książka papierowa'}</span>
        </div>
        <h3>{book.title}</h3>
        <div className="shop-book-author">{book.author}</div>
        <p>{bookDescription}</p>
      </div>

      <div className="hero-actions shop-book-actions">
        <a
          href={affiliateHref}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="button button-ghost"
          aria-label={`Zobacz na Amazonie: ${book.title}`}
        >
          Zobacz na Amazonie
        </a>
      </div>
    </article>
  )
}
