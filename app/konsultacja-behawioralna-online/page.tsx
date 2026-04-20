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
  title: 'Konsultacja behawioralna online 60 min',
  path: '/konsultacja-behawioralna-online',
  description:
    'Konsultacja behawioralna online 60 min dla psa i kota. Zakres, cena i moment, w którym lepiej wybrać dłuższą rozmowę.',
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

export default function ConsultationOnlinePage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const contactHref = '/kontakt#formularz'
  const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Konsultacja behawioralna online', path: '/konsultacja-behawioralna-online' },
    ]),
    getServiceJsonLd({
      name: 'Konsultacja behawioralna online 60 min',
      description: '60 minut konsultacji online dla psa lub kota, z planem i podsumowaniem po rozmowie.',
      serviceUrl: consultationHref,
      offerPrice: 350,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_SHORTLISTS.consultation.map((item) => ({
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

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Konsultacja online 60 min</div>
              <h1>Konsultacja behawioralna online 60 min</h1>
              <p className="editorial-hero-lead">
                To opcja dla tematow szerszych, dluzszych albo bardziej zlozonych. Jesli nie masz pewnosci, czy potrzebujesz pelnej
                konsultacji, najpierw wybierz Kwadrans z behawiorysta.
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
                Jesli od razu wiesz, ze potrzebujesz dluzszej rozmowy, mozesz od razu{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  umowic konsultacje 60 min
                </Link>
                . Jesli chcesz doprecyzowac wybor,{' '}
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
            eyebrow="Dla kogo"
            title="Kiedy warto wybrac konsultacje 60 min"
            description="Pelna konsultacja daje wiecej czasu na tlo problemu, codziennosc zwierzecia i uporzadkowanie kilku watkow naraz."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Konsultacja 60 min bedzie dobrym wyborem, jesli</h3>
              <ul className="premium-bullet-list">
                <li>problem trwa od tygodni albo miesiecy</li>
                <li>dotyczy kilku tematow naraz</li>
                <li>potrzebujesz szerszego spojrzenia, a nie tylko pierwszej orientacji</li>
                <li>chcesz po rozmowie dostac plan i podsumowanie pisemne</li>
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Kwadrans zwykle wystarczy, jesli</h3>
              <ul className="premium-bullet-list">
                <li>masz jedno pytanie</li>
                <li>nie wiesz jeszcze, jak duzy jest problem</li>
                <li>chcesz ustalic, czy potrzebna jest dluzsza rozmowa</li>
                <li>potrzebujesz spokojnego pierwszego kroku bez rozbudowanej konsultacji</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Jak wyglada"
            title="Jak przebiega konsultacja online"
            description="Najpierw rezerwujesz termin i opisujesz sytuacje. W trakcie rozmowy porzadkujemy tlo problemu, priorytety i pierwszy plan dalszego dzialania."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">1</div>
              <h3>Rezerwacja</h3>
              <p>Wybierasz termin i oplacasz rezerwacje. Potem dostajesz potwierdzenie i dalsze wskazowki.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">2</div>
              <h3>Krotki opis</h3>
              <p>Opisujesz, co sie dzieje, od kiedy trwa problem i co bylo juz probowane. Nie musisz miec idealnie przygotowanej historii.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">3</div>
              <h3>Rozmowa i plan</h3>
              <p>Po konsultacji wiesz, od czego zaczac, co obserwowac i co na ten moment nie ma sensu dokladac.</p>
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Jak pracuje"
          title="Online ma byc spokojna, konkretna rozmowa"
          description="Przy wiekszosci tematow kluczowe sa historia, srodowisko i codziennosc. Jesli ten format nie wystarczy, powiem to wprost."
          items={TRUST_SIGNAL_SETS.consultation}
        />

        {prepGuide ? (
          <section className="panel section-panel editorial-section" id="przygotowanie">
            <SectionIntro
              eyebrow="Przygotowanie"
              title="Jesli chcesz wejsc w rozmowe spokojniej"
              description="Mozesz pobrac krotki material przygotowujacy. Pomaga uporzadkowac to, co warto miec pod reka przed kontaktem."
            />

            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup
                magnet={prepGuide}
                location="consultation-page-lead-magnet"
                sourcePage="/konsultacja-behawioralna-online"
              />
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Kiedy warto</div>
                <h3>Przed Kwadransem albo przed 60 min</h3>
                <p>
                  Ten material przydaje sie wtedy, gdy chcesz najpierw uporzadkowac opis sytuacji. Nie jest konieczny do rezerwacji i nie
                  zastapi rozmowy.
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
          title="Najczestsze pytania o konsultacje online"
          description="Krotko o tym, kiedy wybrac 60 min, a kiedy wystarczy Kwadrans."
          items={FAQ_SHORTLISTS.consultation}
        />

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Decyzja</div>
            <h2>Zacznij od kroku, ktory pasuje do Twojej sytuacji</h2>
            <p>
              Jesli temat jest szeroki, wybierz konsultacje 60 min. Jesli chcesz najpierw spokojnie ocenic sytuacje, zacznij od Kwadransu
              z behawiorysta.
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
              <Link href="/cennik" prefetch={false} className="prep-inline-link">
                Cennik i porownanie
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
