import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'

const heroImage = { src: '/branding/omnie-hero.webp', width: 1024, height: 1536 } as const

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pelna konsultacja behawioralna',
  path: '/konsultacja-behawioralna-online',
  description:
    'Pelna konsultacja behawioralna dla psa i kota. Zakres, cena i moment, w ktorym lepiej wybrac najszersza rozmowe online.',
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
  const consultationFaqItems = FAQ_SHORTLISTS.consultation.slice(0, 5)
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Konsultacja behawioralna online', path: '/konsultacja-behawioralna-online' },
    ]),
    getServiceJsonLd({
      name: 'Pelna konsultacja behawioralna',
      description: 'Pelna konsultacja behawioralna online dla psa lub kota, ok. 2 h lacznie, z planem i podsumowaniem po rozmowie.',
      serviceUrl: consultationHref,
      offerPrice: 350,
    }),
    getFaqPageJsonLd(consultationFaqItems),
  ]

  return (
    <NotatnikPageShell
      tag="Konsultacja / pelny opis"
      navItems={[
        { href: '/psy', label: 'Pies' },
        { href: '/koty', label: 'Kot' },
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/o-mnie', label: 'O mnie' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <Schema data={structuredData} />
      <div className="container editorial-stack">

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pelna konsultacja behawioralna</div>
              <h1>Pelna konsultacja behawioralna</h1>
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
                  umowic pelna konsultacje
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
            title="Kiedy warto wybrac pelna konsultacje behawioralna"
            description="Pelna konsultacja daje wiecej czasu na tlo problemu, codziennosc zwierzecia i uporzadkowanie kilku watkow naraz."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Pelna konsultacja bedzie dobrym wyborem, jesli</h3>
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

        <section className="panel section-panel editorial-section" id="przygotowanie">
          <SectionIntro
            eyebrow="Przygotowanie"
            title="Co przygotowac przed konsultacja"
            description="Nie potrzebujesz rozbudowanej dokumentacji. Wystarczy kilka konkretow, ktore pomoga szybciej wejsc w sedno rozmowy."
          />

          <div className="card-grid two-up top-gap-small">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">01</div>
              <h3>Opis sytuacji</h3>
              <p>Przygotuj 2-3 zdania o tym, co sie dzieje, od kiedy trwa problem i kiedy pojawia sie najczesciej.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">02</div>
              <h3>Codzienny rytm</h3>
              <p>Warto miec pod reka podstawy: spacer, karmienie, sen, obecne zmiany w domu i to, co zwykle poprzedza trudny moment.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">03</div>
              <h3>Dotychczasowe proby</h3>
              <p>Jesli cos bylo juz sprawdzane, powiedz co i z jakim efektem. To oszczedza czas i pozwala nie wracac do slepych uliczek.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">04</div>
              <h3>Nagranie lub notatki</h3>
              <p>Jesli masz nagranie problemu albo krotkie notatki z obserwacji, trzymaj je pod reka. To pomocne, ale nieobowiazkowe.</p>
            </article>
          </div>

          {prepGuide ? (
            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup
                magnet={prepGuide}
                location="consultation-page-lead-magnet"
                sourcePage="/konsultacja-behawioralna-online"
              />
              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Material pomocniczy</div>
                <h3>Jesli chcesz uporzadkowac temat jeszcze przed rezerwacja</h3>
                <p>
                  Ten material pomaga zebrac obserwacje przed Kwadransem, Dwoma kwadransami albo pelna konsultacja. Nie jest konieczny i nie
                  zastapi rozmowy, ale zmniejsza chaos na starcie.
                </p>
                <div className="hero-actions top-gap-small">
                  <Link href={`/bezplatne-materialy/${prepGuide.slug}`} prefetch={false} className="prep-inline-link">
                    Zobacz strone materialu
                  </Link>
                </div>
              </article>
            </div>
          ) : null}
        </section>

        <EditorialFaqSection
          id="faq"
          title="Najczestsze pytania o konsultacje online"
          description="Krotko o tym, kiedy wybrac pelna konsultacje, a kiedy wystarczy Kwadrans."
          items={consultationFaqItems}
        />

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Decyzja</div>
            <h2>Zacznij od kroku, ktory pasuje do Twojej sytuacji</h2>
            <p>
              Jesli temat jest szeroki, wybierz pelna konsultacje. Jesli chcesz najpierw spokojnie ocenic sytuacje, zacznij od Kwadransu
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

      </div>
    </NotatnikPageShell>
  )
}
