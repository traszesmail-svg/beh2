import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCard } from '@/components/PdfGuideCard'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { AccessoryShelfCard, BookShelfCard, ShopAnchorNav } from '@/components/ShopCatalog'
import { buildBookHref } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { FUNNEL_CTA_LABELS, FUNNEL_SERVICE_CONFIG, getPublicServicePriceLabel } from '@/lib/funnel'
import { getPdfBundleBySlug, getPdfGuideBySlug } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'
import { listShopAccessoryCards, SHOP_BOOK_CARDS } from '@/lib/shop-catalog'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbędnik behawiorysty',
  path: '/niezbednik',
  description:
    'Przewodniki, książki i narzędzia do spokojnej pracy z psem lub kotem. Zacznij od jednego materiału albo od Kwadransu z behawiorystą.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="editorial-section-head">
      <div className="editorial-section-head-copy">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p className="editorial-section-lead">{description}</p>
    </div>
  )
}

function pickGuides(slugs: string[]) {
  return slugs
    .map((slug) => getPdfGuideBySlug(slug))
    .filter((guide): guide is NonNullable<ReturnType<typeof getPdfGuideBySlug>> => guide !== null)
}

function pickBundles(slugs: string[]) {
  return slugs
    .map((slug) => getPdfBundleBySlug(slug))
    .filter((bundle): bundle is NonNullable<ReturnType<typeof getPdfBundleBySlug>> => bundle !== null)
}

const FEATURED_GUIDE_SLUGS = [
  'pies-zostaje-sam-plan-pierwszych-krokow',
  'szczeniak-pierwsze-30-dni',
  'kot-stres-srodowisko-i-bledy-opiekuna',
  'kot-i-kuweta-pierwszy-plan-dzialania',
  'domowy-enrichment-plan-na-14-dni',
  'pierwsze-dni-po-adopcji-psa-lub-kota',
] as const

const HERO_STACK_GUIDE_SLUGS = [
  'kot-i-kuweta-pierwszy-plan-dzialania',
  'pies-zostaje-sam-plan-pierwszych-krokow',
  'domowy-enrichment-plan-na-14-dni',
] as const

const FEATURED_BUNDLE_SLUGS = [
  'pakiet-startowy-psa',
  'pakiet-spokojny-dom-pies',
  'pakiet-kota-domowego',
  'pakiet-kot-bez-napiecia',
] as const

const featuredGuides = pickGuides([...FEATURED_GUIDE_SLUGS])
const heroStackGuides = pickGuides([...HERO_STACK_GUIDE_SLUGS])
const featuredBundles = pickBundles([...FEATURED_BUNDLE_SLUGS])
const expertBooks = [...SHOP_BOOK_CARDS.koty, ...SHOP_BOOK_CARDS.psy]
const accessoryCards = listShopAccessoryCards()
const quickAudioService = FUNNEL_SERVICE_CONFIG['szybka-konsultacja-15-min']
const fullConsultationService = FUNNEL_SERVICE_CONFIG['konsultacja-behawioralna-online']

export default function EssentialsPage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const cennikHref = '/cennik'
  const messageHref = '/kontakt#formularz'
  const dogHref = '/psy'
  const catHref = '/koty'

  return (
    <main className="page-wrap editorial-home-page premium-home-page materials-page">
      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell pdf-path-hero-shell" id="start">
          <div className="editorial-hero-grid pdf-path-hero-grid">
            <div className="editorial-hero-copy materials-hero-copy pdf-path-hero-copy">
              <div className="section-eyebrow">Niezbędnik</div>
              <h1>Niezbędnik do spokojnej pracy z psem lub kotem</h1>
              <p className="editorial-hero-lead materials-hero-lead">
                Materiały własne, wybrane książki i praktyczne narzędzia do sytuacji, które da się uporządkować bez chaosu. Jeśli chcesz, możesz
                zacząć od jednego materiału, a jeśli potrzebujesz kierunku, od razu przejść do Kwadransu z behawiorystą.
              </p>

              <div className="hero-actions editorial-hero-actions materials-hero-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="#pdf-y" prefetch={false} className="button button-ghost big-button">
                  Przeglądaj Niezbędnik
                </Link>
              </div>

              <div className="materials-soft-cta">
                <p>{COPY_HELPERS.toolkitIntro}</p>
              </div>

              <div className="editorial-hero-trust-row" aria-label="Zakres materiałów">
                <span className="editorial-hero-trust-item">materiały własne</span>
                <span className="editorial-hero-trust-item">książki i publikacje</span>
                <span className="editorial-hero-trust-item">przybory i narzędzia</span>
                <span className="editorial-hero-trust-item">jeden jasny kolejny krok</span>
              </div>
            </div>

            <aside className="editorial-hero-visual" aria-label="Wybrane materiały własne">
              <PdfGuideCoverStack guides={heroStackGuides} title="Wybrane materiały Niezbędnika" showLegend />
              <div className="editorial-hero-note">
                <span className="editorial-hero-note-label">Od czego zacząć</span>
                <strong>Zacznij od jednego materiału albo od krótkiej rozmowy. To wystarcza, żeby zobaczyć, który krok ma dziś najwięcej sensu.</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Szybki start"
            title="Najprościej zacząć od jednego materiału."
            description="Jeśli chcesz działać od razu, wybierz obszar, który najbardziej pasuje do sytuacji. Gdy temat jest szerszy, porównaj formaty albo przejdź do rozmowy."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card materials-decision-card materials-decision-card-primary">
              <div className="section-eyebrow">Materiały własne</div>
              <h3>Masz jeden konkretny temat</h3>
              <p>Przewodnik albo checklista pomoże Ci uporządkować pierwszy krok bez przekopywania się przez ogólną wiedzę.</p>
              <div className="hero-actions top-gap-small">
                <Link href="#pdf-y" prefetch={false} className="button button-primary">
                  Zobacz materiały
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Format pracy</div>
              <h3>Chcesz porównać opcje</h3>
              <p>Kwadrans z behawiorystą porządkuje kierunek. Konsultacja 60 min daje więcej czasu na temat szerszy lub wielowątkowy.</p>
              <div className="hero-actions top-gap-small">
                <Link href={cennikHref} prefetch={false} className="button button-ghost">
                  Zobacz cennik
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Gatunek</div>
              <h3>Wolisz wejść od strony psa albo kota</h3>
              <p>Jeśli chcesz zacząć od strony problemów gatunkowych, przejdź do właściwej podstrony i wróć tutaj po materiał.</p>
              <div className="hero-actions top-gap-small">
                <Link href={dogHref} prefetch={false} className="button button-ghost">
                  Psy
                </Link>
                <Link href={catHref} prefetch={false} className="button button-ghost">
                  Koty
                </Link>
              </div>
            </article>
          </div>

          <ShopAnchorNav
            className="shop-anchor-nav-compact"
            items={[
              { href: '#pdf-y', label: 'Materiały własne' },
              { href: '#ksiazki', label: 'Książki' },
              { href: '#przybory', label: 'Przybory' },
              { href: '#kontakt', label: 'Dalszy krok' },
            ]}
          />
        </section>

        <section className="panel section-panel editorial-section" id="pdf-y">
          <SectionIntro
            eyebrow="Materiały własne"
            title="To najważniejsza półka na tej stronie."
            description="Znajdziesz tu przewodniki i pakiety PDF do konkretnych sytuacji. Są po to, żeby szybko uporządkować temat, zanim zdecydujesz o kolejnym kroku."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card materials-decision-card materials-decision-card-primary">
              <div className="section-eyebrow">Jedna sytuacja</div>
              <h3>Przewodniki i checklisty</h3>
              <p>Materiały do jednego problemu, z jasnym kierunkiem i prostym planem na start.</p>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Więcej niż jeden wątek</div>
              <h3>Pakiety tematyczne</h3>
              <p>Pakiety pomagają, gdy trzeba uporządkować kilka powiązanych tematów jednym wyborem.</p>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Spokojny start</div>
              <h3>Do pracy przed lub po konsultacji</h3>
              <p>Materiały możesz wykorzystać samodzielnie albo jako wsparcie po rozmowie.</p>
            </article>
          </div>

          <div className="editorial-section-head top-gap">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wybrane teraz</div>
              <h2>Wybrane materiały na start</h2>
            </div>
            <p className="editorial-section-lead">
              Pokazuję tylko sensowny wybór startowy. Gdy wiesz już, czego dotyczy sytuacja, łatwiej wybrać materiał bez dodatkowego szumu.
            </p>
          </div>

          <div className="offer-grid top-gap-small">
            {featuredGuides.map((guide) => (
              <PdfGuideCard key={guide.slug} guide={guide} />
            ))}
          </div>

          <div className="editorial-section-head top-gap">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Pakiety PDF</div>
              <h2>Szerszy wybór, gdy jeden poradnik to za mało</h2>
            </div>
            <p className="editorial-section-lead">
              Pakiet ma sens wtedy, gdy porządkuje kilka sąsiednich wątków i pozwala ruszyć spokojniej bez dokładania chaosu.
            </p>
          </div>

          <div className="offer-grid top-gap-small">
            {featuredBundles.map((bundle) => (
              <PdfBundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>

          <div className="pdf-path-section-footer top-gap">
            <div className="pdf-path-section-footer-copy">
              <strong>Nie musisz wybierać kilku rzeczy naraz.</strong>
              <span>Jeśli temat jest prosty, wystarczy jeden materiał. Jeśli jest mieszany albo wraca, lepiej najpierw porównać formaty pracy.</span>
            </div>

            <div className="hero-actions">
              <Link href={audioHref} prefetch={false} className="button button-primary">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={consultationHref} prefetch={false} className="button button-ghost">
                {FUNNEL_CTA_LABELS.consultation}
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="ksiazki">
          <SectionIntro
            eyebrow="Książki"
            title="Książki są tu jako spokojne uzupełnienie."
            description="Każda pozycja ma krótki opis, dzięki któremu łatwiej ocenić, czy rzeczywiście pomoże Ci wejść szerzej w temat."
          />

          <div className="premium-two-column-grid">
            <div className="stack-gap">
              <div className="list-card accent-outline tree-backed-card">
                <strong>Najpierw materiały własne</strong>
                <span>Książki są niżej celowo. Mają wspierać decyzję, a nie zastępować prosty start.</span>
              </div>

              <div className="shop-books-rail shop-books-rail-tight">
                {expertBooks.map((book) => (
                  <BookShelfCard key={book.slug} book={book} ctaLabel="Zobacz książkę" />
                ))}
              </div>
            </div>

            <div className="stack-gap">
              <div className="list-card tree-backed-card">
                <strong>Kiedy się przydają</strong>
                <span>Gdy chcesz wejść szerzej w temat, wrócić do spokojnego czytania albo dołożyć kontekst do materiału PDF.</span>
              </div>

              <div className="list-card tree-backed-card">
                <strong>Jeśli chcesz porównać formaty</strong>
                <span>
                  Zobacz też <Link href={cennikHref} prefetch={false} className="inline-link">cennik</Link>, żeby łatwiej ocenić, czy lepszy będzie materiał,
                  Kwadrans z behawiorystą czy pełniejsza konsultacja.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przybory">
          <SectionIntro
            eyebrow="Przybory"
            title="Przybory i narzędzia są tylko wsparciem planu."
            description="Nie trzeba kupować wszystkiego. Każdy element ma sens dopiero wtedy, gdy naprawdę pomaga w pracy z psem albo kotem."
          />

          <div className="list-card accent-outline tree-backed-card">
            <strong>Wybieraj tylko to, co ma zastosowanie</strong>
            <span>Jeśli coś ma pomóc w domu, spacerach albo rutynie, znajdziesz to tutaj. Jeśli nie wspiera planu, nie warto dokładać tego na siłę.</span>
          </div>

          <div className="offer-grid top-gap">
            {accessoryCards.map((accessory) => (
              <AccessoryShelfCard key={accessory.slug} accessory={accessory} />
            ))}
          </div>

          <div className="pdf-path-section-footer top-gap">
            <div className="pdf-path-section-footer-copy">
              <strong>Najpierw problem, potem ewentualne narzędzie.</strong>
              <span>Jeśli nie masz pewności, zacznij od Kwadransu z behawiorystą albo krótkiej wiadomości. Dzięki temu łatwiej dobrać sensowny kolejny krok.</span>
            </div>

            <div className="hero-actions">
              <Link href={audioHref} prefetch={false} className="button button-primary">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={messageHref} prefetch={false} className="button button-ghost">
                {FUNNEL_CTA_LABELS.contact}
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kontakt">
          <SectionIntro
            eyebrow="Dalszy krok"
            title="Jeśli materiał nie wystarczy, wybierz najlżejszy sensowny krok."
            description="Najczęściej będzie to Kwadrans z behawiorystą. Przy sprawach szerszych warto porównać formaty, a przy krótkim doprecyzowaniu wystarczy wiadomość."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Primary</div>
              <h3>Kwadrans z behawiorystą</h3>
              <p>Najkrótsza droga, gdy chcesz ustalić kierunek i nie wybierać w ciemno.</p>
              <div className="editorial-hero-meta" aria-label="Parametry krótkiej konsultacji">
                <span>{quickAudioService.durationMinutes} min</span>
                <span>{getPublicServicePriceLabel('szybka-konsultacja-15-min')}</span>
                <span>bez kamery</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Druga opcja</div>
              <h3>{fullConsultationService.title}</h3>
              <p>Lepsza przy sprawach złożonych, dłuższych albo wielowątkowych, kiedy potrzebujesz więcej czasu na temat i plan.</p>
              <div className="editorial-hero-meta" aria-label="Parametry pełnej konsultacji">
                <span>{fullConsultationService.durationMinutes} min</span>
                <span>{getPublicServicePriceLabel('konsultacja-behawioralna-online')}</span>
                <span>szersza analiza</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={consultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Pomocniczo</div>
              <h3>{FUNNEL_CTA_LABELS.contact}</h3>
              <p>Jeśli chcesz najpierw krótko opisać sytuację albo dopytać o właściwy materiał, wystarczy kilka zdań.</p>
              <div className="editorial-hero-meta" aria-label="Parametry krótkiej wiadomości">
                <span>gatunek</span>
                <span>temat</span>
                <span>krótki opis</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={messageHref} prefetch={false} className="button button-ghost">
                  Napisz wiadomość
                </Link>
              </div>
            </article>
          </div>

          <p className="muted top-gap-small">
            Jeśli wolisz wejść od strony gatunku, wróć najpierw na stronę{' '}
            <Link href={dogHref} prefetch={false} className="inline-link">
              psa
            </Link>{' '}
            albo{' '}
            <Link href={catHref} prefetch={false} className="inline-link">
              kota
            </Link>
            . Gdy chcesz tylko porównać koszty i formaty, sprawdź{' '}
            <Link href={cennikHref} prefetch={false} className="inline-link">
              cennik
            </Link>
            .
          </p>
        </section>

        <Footer
          variant="home"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={consultationHref}
          secondaryLabel={FUNNEL_CTA_LABELS.consultation}
          sectionBasePath="/niezbednik"
        />
      </div>
    </main>
  )
}
