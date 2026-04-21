import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'
import { SPECIALIST_NAME } from '@/lib/site'

const heroImage = { src: '/branding/omnie-hero.webp', width: 1024, height: 1536 } as const

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik - konsultacje behawioralne online',
  path: '/cennik',
  description:
    'Cennik konsultacji behawioralnych online dla psa i kota. Kwadrans, Dwa kwadranse i pelna konsultacja behawioralna w jednym miejscu.',
})

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
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

const SERVICE_COMPARISON_ROWS = [
  {
    label: 'Najlepszy wybór, gdy',
    quick: 'masz jedno pytanie, chcesz spokojnie ustalić pierwszy krok albo nie wiesz jeszcze, jak szeroki jest temat',
    full: 'problem trwa dłużej, dotyczy kilku wątków naraz albo wiesz, że potrzebujesz szerszego uporządkowania',
  },
  {
    label: 'Format',
    quick: '15 minut rozmowy audio bez kamery',
    full: 'ok. 2 h rozmowy online z wieksza iloscia czasu na temat',
  },
  {
    label: 'Po rozmowie wychodzisz z',
    quick: 'priorytetem i decyzją, co robić dalej',
    full: 'szerszym planem i podsumowaniem pisemnym',
  },
  {
    label: 'Cena',
    quick: '69 zł',
    full: '350 zł',
  },
] as const

const BOOKING_FLOW_STEPS = [
  '1. Wybierasz usługę, gatunek i temat.',
  '2. Widzisz dostępne terminy i klikasz ten, który pasuje.',
  '3. Uzupełniasz krótki formularz i przechodzisz do płatności.',
  '4. Po potwierdzeniu wracasz do strony z następnym krokiem rezerwacji.',
] as const

export default function PricingPage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const contactHref = '/kontakt#formularz'
  const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Cennik', path: '/cennik' },
    ]),
    getServiceJsonLd({
      name: 'Kwadrans z behawiorystą',
      description: '15 minut rozmowy audio jako spokojny pierwszy krok przy problemie psa lub kota.',
      serviceUrl: audioHref,
      offerPrice: 69,
    }),
    getServiceJsonLd({
      name: 'Pelna konsultacja behawioralna',
      description: 'Pelna konsultacja online dla tematow szerszych, dluzszych albo wielowatkowych.',
      serviceUrl: consultationHref,
      offerPrice: 350,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_SHORTLISTS.pricing.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ]

  return (
    <main className="page-wrap editorial-home-page premium-home-page money-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Cennik</div>
              <h1>Cennik i zakres konsultacji</h1>
              <p className="editorial-hero-lead">
                Do wyboru sa trzy formaty: Kwadrans, Dwa kwadranse i pelna konsultacja behawioralna. Jesli nie wiesz, od czego zaczac,
                najbezpieczniej zaczac od Kwadransu.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="/niezbednik" prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jesli od razu wiesz, ze temat jest szerszy, mozesz wybrac{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  pelna konsultacje
                </Link>
                . Jesli chcesz najpierw dopytac,{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  napisz wiadomosc
                </Link>
                .
              </p>
            </div>

            <aside className="home-hero-aside" aria-label="Zdjecie specjalisty">
              <div className="home-hero-photo-shell">
                <Image
                  src={heroImage.src}
                  alt=""
                  aria-hidden="true"
                  width={heroImage.width}
                  height={heroImage.height}
                  sizes="(max-width: 980px) 100vw, 480px"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="home-hero-photo"
                />
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Porownanie"
            title="Ktory format wybrac"
            description="Kwadrans pomaga uporzadkowac temat i wybrac pierwszy krok. Pelna konsultacja daje wiecej czasu na szersza diagnoze i plan."
          />

          <div className="premium-two-column-grid top-gap">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kwadrans z behawiorysta</div>
              <h3>69 zl</h3>
              <ul className="premium-bullet-list">
                <li>15 minut rozmowy audio bez kamery</li>
                <li>jedno pytanie albo pierwszy kontakt z tematem</li>
                <li>ustalenie priorytetu i pierwszego kierunku</li>
                <li>najlepszy start, gdy nie wiesz jeszcze, jak duzy jest problem</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Pelna konsultacja behawioralna</div>
              <h3>350 zl</h3>
              <ul className="premium-bullet-list">
                <li>ok. 2 h rozmowy online lacznie</li>
                <li>wideo albo glos</li>
                <li>dla tematow zlozonych, dlugotrwalych albo wielowatkowych</li>
                <li>plan i podsumowanie pisemne po rozmowie</li>
              </ul>
              <div className="hero-actions top-gap-small">
                <Link href={consultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>Najkrótsza zasada wyboru</strong>
            <span>
              Jeśli nie masz pewności, zacznij od Kwadransu. Jeśli już teraz wiesz, że temat jest szerszy, przewlekły albo wielowątkowy,
              wybierz pelna konsultacje.
            </span>
          </div>

          <div className="top-gap">
            {SERVICE_COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="summary-card tree-backed-card top-gap-small">
                <div className="section-eyebrow">{row.label}</div>
                <div className="premium-two-column-grid">
                  <div>
                    <strong>Kwadrans z behawiorysta</strong>
                    <p>{row.quick}</p>
                  </div>
                  <div>
                    <strong>Pelna konsultacja</strong>
                    <p>{row.full}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Od czego zaczac"
            title="Najczesciej wystarczy prosta zasada"
            description="Im mniej wiesz o problemie, tym bardziej warto zaczac od Kwadransu. Im szerszy i dluzszy temat, tym bardziej ma sens pelna konsultacja."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Zacznij od Kwadransu, jesli</h3>
              <ul className="premium-bullet-list">
                <li>masz jedno pytanie</li>
                <li>nie wiesz jeszcze, co jest glownym problemem</li>
                <li>chcesz spokojnie ustalic pierwszy ruch</li>
                <li>potrzebujesz oceny, czy temat jest behawioralny, treningowy albo zdrowotny</li>
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Wybierz pelna konsultacje, jesli</h3>
              <ul className="premium-bullet-list">
                <li>problem trwa od dawna</li>
                <li>dotyczy kilku kwestii naraz</li>
                <li>masz za soba nieskuteczne proby i chcesz szerszego uporzadkowania</li>
                <li>potrzebujesz planu po rozmowie, a nie tylko pierwszego kierunku</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Po rezerwacji"
            title="Co stanie sie po kliknieciu"
            description="Raport pokazywal tarcie na etapie decyzji i platnosci, dlatego tutaj caly proces jest rozpisany wprost."
          />

          <div className="premium-two-column-grid top-gap-small">
            <article className="summary-card tree-backed-card">
              <h3>Sciezka rezerwacji</h3>
              <ul className="premium-bullet-list">
                {BOOKING_FLOW_STEPS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Gdy nadal nie masz pewnosci</h3>
              <p>
                Nie musisz zgadywac idealnej uslugi. Jesli temat jest mieszany albo chcesz najpierw dopytac o sensowny pierwszy krok,
                napisz wiadomosc. Jesli wolisz prostszy start bez rozpisywania calego problemu, wybierz Kwadrans.
              </p>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href={contactHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Spokojny wybor"
          title="Tu chodzi o dobranie formatu do sytuacji"
          description="Nie ma presji, zeby zaczynac od dluzszej rozmowy. Najwazniejsze jest to, zeby pierwszy krok byl adekwatny."
          items={TRUST_SIGNAL_SETS.pricing}
        />

        {prepGuide ? (
          <section className="panel section-panel editorial-section">
            <SectionIntro
              eyebrow="Przed rezerwacja"
              title="Jesli lubisz przygotowac sie wczesniej"
              description="Mozesz pobrac krotki material przygotowujacy do rozmowy. To pomoc przed kontaktem, nie osobna usluga."
            />

            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup magnet={prepGuide} location="pricing-page-lead-magnet" sourcePage="/cennik" />
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Kiedy warto</div>
                <h3>Najpierw material, potem decyzja</h3>
                <p>
                  Jesli chcesz na spokojnie zebrac najwazniejsze informacje przed rozmowa, ten material ulatwia start. Jesli po nim dalej
                  nie wiesz, co wybrac, zacznij od Kwadransu.
                </p>
                <div className="hero-actions top-gap-small">
                  <Link href={`/bezplatne-materialy/${prepGuide.slug}`} prefetch={false} className="prep-inline-link">
                    Zobacz strone materialu
                  </Link>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <EditorialFaqSection
          id="faq"
          title="Najczestsze pytania przed rezerwacja"
          description="Krotko o tym, czym rozni sie Kwadrans od pelnej konsultacji."
          items={FAQ_SHORTLISTS.pricing}
        />

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Decyzja</div>
            <h2>Zacznij od formatu, ktory pasuje do Twojej sytuacji</h2>
            <p>
              Jesli potrzebujesz pierwszego uporzadkowania, wybierz Kwadrans z behawiorysta. Jesli wiesz, ze temat jest szeroki,
              wybierz pelna konsultacje.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href="/niezbednik" prefetch={false} className="button button-ghost big-button">
                {FUNNEL_CTA_LABELS.secondary}
              </Link>
              <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                {FUNNEL_CTA_LABELS.consultation}
              </Link>
              <Link href={contactHref} prefetch={false} className="prep-inline-link">
                {FUNNEL_CTA_LABELS.contact}
              </Link>
            </div>
          </div>
        </section>

        <Footer
          variant="lean"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
