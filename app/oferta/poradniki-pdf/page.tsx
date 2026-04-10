import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BookShelfCard, BundleShelfCard, PdfShelfCard, ShopAnchorNav } from '@/components/ShopCatalog'
import { buildMarketingMetadata } from '@/lib/seo'
import { FUNNEL_UPGRADE_HREF, FUNNEL_UPGRADE_LABEL } from '@/lib/offers'
import {
  SHOP_BOOK_CARDS,
  SHOP_BUNDLE_SHELF_CARDS,
  SHOP_PDF_ANCHORS,
  SHOP_PDF_CARDS,
  type ShopBundleShelfCard,
  type ShopPdfCard,
} from '@/lib/shop-catalog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Poradniki PDF',
  path: '/oferta/poradniki-pdf',
  description:
    'Materiały PDF jako drugi krok po konsultacji 15 min, pakiety do szerszych tematów i dodatkowa półka książek papierowych.',
})

function PdfSection({
  id,
  eyebrow,
  title,
  intro,
  cards,
}: {
  id: string
  eyebrow: string
  title: string
  intro: string
  cards: ShopPdfCard[]
}) {
  return (
    <section className="panel section-panel pdf-path-section shop-catalog-section leafy-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="pdf-path-section-head">
        <div className="pdf-path-section-copy">
          <span className="section-eyebrow offer-section-eyebrow">{eyebrow}</span>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <p className="offer-section-intro">{intro}</p>
      </div>

      <div className="card-grid three-up pdf-path-card-grid top-gap">
        {cards.map((card) => (
          <PdfShelfCard key={card.slug} card={card} />
        ))}
      </div>
    </section>
  )
}

type DogPdfSection =
  | {
      id: string
      eyebrow: string
      title: string
      intro: string
      cards: ShopPdfCard[]
      bundle?: false
    }
  | {
      id: string
      eyebrow: string
      title: string
      intro: string
      cards: ShopBundleShelfCard[]
      bundle: true
    }

export default function PdfGuidesListingPage() {
  const catPdfCards = SHOP_PDF_CARDS.koty.filter((card) => card.kind === 'pdf')
  const dogPdfCards = SHOP_PDF_CARDS.psy.filter((card) => card.kind === 'pdf')
  const dogBundleCards = SHOP_BUNDLE_SHELF_CARDS.psy
  const catBundleCards = SHOP_BUNDLE_SHELF_CARDS.koty
  const catBooks = SHOP_BOOK_CARDS.koty.slice(0, 12)
  const dogBooks = SHOP_BOOK_CARDS.psy.slice(0, 12)
  const dogSections: DogPdfSection[] = [
    {
      id: 'psy-start',
      eyebrow: 'Darmowy start',
      title: 'Najpierw darmowy start, potem właściwy wybór.',
      intro: 'Ten materiał prowadzi dalej do starterów, core, pakietów i specjalistycznego PDF-u bez płaskiej ściany kart.',
      cards: dogPdfCards.filter((card) => card.kindLabel === 'Darmowy start'),
      bundle: false,
    },
    {
      id: 'psy-starters',
      eyebrow: 'Startery',
      title: 'Najczęściej kupowane startery.',
      intro: 'Startery są wyżej niż core i mają prowadzić do szybszego uporządkowania najczęstszych problemów.',
      cards: dogPdfCards.filter((card) => card.kindLabel === 'Starter PDF' || card.kindLabel === 'Starter-core PDF'),
      bundle: false,
    },
    {
      id: 'psy-core',
      eyebrow: 'Core',
      title: 'Głębsze PDF-y podzielone problemowo.',
      intro: 'Core pokazuje dalej idące rozwiązania w obszarze spaceru, samotności, obrony zasobów i pobudzenia.',
      cards: dogPdfCards.filter((card) => card.kindLabel === 'Core PDF'),
      bundle: false,
    },
    {
      id: 'psy-pakiety',
      eyebrow: 'Pakiety',
      title: 'Pakiety dla psów.',
      intro: 'Pakiety łączą kilka powiązanych materiałów w jeden prostszy wybór.',
      cards: dogBundleCards,
      bundle: true,
    },
    {
      id: 'psy-specjalistyczne',
      eyebrow: 'Specjalistyczne',
      title: 'Specjalistyczny PDF niżej na stronie.',
      intro: 'Pies do pracy z ludźmi? siedzi niżej, bo ma być bardziej ekspercką oceną niż pierwszym wejściem.',
      cards: dogPdfCards.filter((card) => card.kindLabel === 'Specjalistyczny PDF'),
      bundle: false,
    },
  ] as const

  return (
    <main className="page-wrap marketing-page">
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface pdf-path-hero-shell shop-catalog-hero">
          <div className="pdf-path-hero-grid">
            <div className="pdf-path-hero-copy">
              <div className="section-eyebrow">Poradniki PDF</div>
              <h1>Materiały PDF do uporządkowania tematu.</h1>
              <p className="hero-text">
                Materiały PDF pomagają uporządkować temat i wrócić do zaleceń we własnym tempie. Możesz z nich skorzystać jako uzupełnienia po
                konsultacji 15 min albo jako spokojnego materiału pomocniczego.
              </p>

              <div className="hero-note-row pdf-path-pill-row" aria-label="Szybkie wskazówki">
                <span className="hero-proof-pill">Po konsultacji 15 min</span>
                <span className="hero-proof-pill">Między krokami</span>
                <span className="hero-proof-pill">Pakiety gdy potrzebujesz szerzej</span>
                <span className="hero-proof-pill">Książki jako uzupełnienie</span>
              </div>

              <div className="hero-actions top-gap">
                <Link href="#koty-pdf" prefetch={false} className="button button-primary big-button">
                  Zobacz koty
                </Link>
                <Link href="#psy-pdf" prefetch={false} className="button button-ghost big-button">
                  Zobacz psy
                </Link>
              </div>
            </div>

            <aside className="pdf-path-hero-aside tree-backed-card">
              <span className="pdf-path-hero-aside-label">Jak korzystać z półek</span>
              <strong>PDF porządkuje temat, pakiety pomagają wejść szerzej, a książki są osobną półką niżej.</strong>
              <p>Każda karta pokazuje dla kogo jest, co porządkuje, kiedy wystarcza i kiedy lepsza będzie konsultacja lub 30 min / pełna.</p>

              <ShopAnchorNav items={SHOP_PDF_ANCHORS} className="shop-anchor-nav-compact" />
            </aside>
          </div>
        </section>

        <PdfSection
          id="koty-pdf"
          eyebrow="PDF dla kotów"
          title="Kocia półka PDF"
          intro="To dobry drugi krok po konsultacji 15 min albo spokojny materiał, do którego możesz wrócić we własnym tempie."
          cards={catPdfCards}
        />

        <section className="panel section-panel pdf-path-section shop-catalog-section leafy-section top-gap" id="psy-pdf" aria-labelledby="psy-pdf-title">
          <div className="pdf-path-section-head">
            <div className="pdf-path-section-copy">
              <span className="section-eyebrow offer-section-eyebrow">PDF dla psów</span>
              <h2 id="psy-pdf-title">Psia półka PDF</h2>
            </div>
            <p className="offer-section-intro">
              To drugi krok po konsultacji 15 min albo spokojny materiał, jeśli chcesz wracać do zaleceń bez presji. Układ prowadzi od
              pierwszego ruchu do kolejnego kroku bez katalogowego chaosu.
            </p>
          </div>

          <div className="stack-gap top-gap">
            {dogSections.map((section) => (
              <section key={section.id} className="shop-section-subpanel" id={section.id}>
                <div className="shop-section-subhead">
                  <strong>{section.eyebrow}</strong>
                  <span>{section.intro}</span>
                </div>
                <div className="card-grid three-up pdf-path-card-grid top-gap">
                  {section.bundle
                    ? section.cards.map((bundle) => <BundleShelfCard key={bundle.slug} bundle={bundle} />)
                    : section.cards.map((card) => <PdfShelfCard key={card.slug} card={card} />)}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="panel section-panel pdf-path-section shop-catalog-section leafy-section top-gap" id="pakiety-pdf" aria-labelledby="pakiety-pdf-title">
          <div className="pdf-path-section-head">
            <div className="pdf-path-section-copy">
              <span className="section-eyebrow offer-section-eyebrow">Pakiety PDF</span>
              <h2 id="pakiety-pdf-title">Pakiety jako szersza, nadal spokojna półka.</h2>
            </div>
            <p className="offer-section-intro">
              Gdy jeden materiał to za mało, pakiet pozwala wejść szerzej bez dokładań hałasu i przypadkowych wyborów. To nadal materiał
              wspierający, nie pierwszy ruch.
            </p>
          </div>

          <div className="shop-books-subheads">
            <div className="shop-books-subhead">
              <strong>Pakiety dla kotów</strong>
              <span>Najpierw najprostsze domowe osie: kuweta, relacje, noc i dotyk.</span>
            </div>
            <div className="card-grid three-up pdf-path-card-grid top-gap">
              {catBundleCards.map((bundle) => (
                <BundleShelfCard key={bundle.slug} bundle={bundle} />
              ))}
            </div>
          </div>

          <div className="shop-books-subheads top-gap">
            <div className="shop-books-subhead">
              <strong>Pakiety dla psów</strong>
              <span>Łączą darmowy start, startery i core w czytelniejsze ścieżki problemowe.</span>
            </div>
            <div className="card-grid three-up pdf-path-card-grid top-gap">
              {dogBundleCards.map((bundle) => (
                <BundleShelfCard key={bundle.slug} bundle={bundle} />
              ))}
            </div>
          </div>
        </section>

        <section className="panel section-panel pdf-path-section shop-catalog-section leafy-section top-gap" id="ksiazki" aria-labelledby="ksiazki-title">
          <div className="pdf-path-section-head">
            <div className="pdf-path-section-copy">
              <span className="section-eyebrow offer-section-eyebrow">Książki papierowe</span>
              <h2 id="ksiazki-title">Polecane książki papierowe</h2>
            </div>
            <p className="offer-section-intro">
              Jeśli chcesz wejść szerzej w temat, poniżej znajdziesz kilka książek, które dobrze uzupełniają pracę z konsultacją i materiałami
              PDF.
            </p>
          </div>

          <div className="shop-books-subheads">
            <div className="shop-books-subhead">
              <strong>Książki o kotach</strong>
              <span>Wybrane pozycje na papierowy start lub szersze uzupełnienie pracy z PDF-em.</span>
            </div>
            <div className="shop-books-rail shop-books-rail-tight">
              {catBooks.map((book) => (
                <BookShelfCard key={book.slug} book={book} />
              ))}
            </div>
          </div>

          <div className="shop-books-subheads top-gap">
            <div className="shop-books-subhead">
              <strong>Książki o psach</strong>
              <span>Druga półka dla osób, które wolą papier i chcą wejść szerzej w temat psa.</span>
            </div>
            <div className="shop-books-rail shop-books-rail-tight">
              {dogBooks.map((book) => (
                <BookShelfCard key={book.slug} book={book} />
              ))}
            </div>
          </div>
        </section>

        <section className="panel section-panel shop-followup-panel leafy-section top-gap">
          <div className="shop-followup-grid">
            <div>
              <div className="section-eyebrow">Następny krok</div>
              <h2>Jeśli chcesz wracać do zaleceń we własnym tempie, PDF jest obok.</h2>
              <p className="hero-text">
                Najpierw 15 min porządkuje kierunek. PDF pomaga wrócić do zaleceń później, a jeśli temat okaże się szerszy, łatwo przejdziesz
                do pakietu albo konsultacji.
              </p>
            </div>

            <div className="shop-followup-actions tree-backed-card">
              <strong>PDF jest materiałem wspierającym, nie pierwszym ruchem.</strong>
              <span>Jeśli temat jest prosty, wróć do materiału. Jeśli jest mieszany, zacznij od 15 min, a PDF użyj między krokami.</span>
              <div className="hero-actions top-gap">
                <Link href="/book" prefetch={false} className="button button-primary">
                  Umów 15 min
                </Link>
                <Link href="/oferta/poradniki-pdf" prefetch={false} className="button button-ghost">
                  Zobacz materiały PDF
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer
          variant="full"
          ctaHref="/book"
          ctaLabel="Umów 15 min"
          secondaryHref={FUNNEL_UPGRADE_HREF}
          secondaryLabel={FUNNEL_UPGRADE_LABEL}
        />
      </div>
    </main>
  )
}
