import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta psow online',
  path: '/behawiorysta-psow',
  description:
    'Behawiorysta psow online. Sprawdz, kiedy zaczac od Kwadransu z behawiorysta, kiedy wybrac konsultacje 60 min i jak wyglada pomoc dla opiekuna psa.',
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

export default function DogBehavioristPage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
  const contactHref = '/kontakt?species=pies#formularz'

  return (
    <main className="page-wrap editorial-home-page premium-home-page money-page">
      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc dla opiekunow psow</div>
              <h1>Behawiorysta psow online</h1>
              <p className="editorial-hero-lead">
                To strona dla Ciebie, jesli chcesz spokojnie ustalic, od czego zaczac przy problemie psa. Bez zgadywania, bez
                przechodzenia przez zbyt duza ilosc tresci na start.
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
                Jesli temat od razu jest zlozony, mozesz wybrac{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  konsultacje 60 min
                </Link>
                . Jesli chcesz najpierw dopytac,{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  napisz wiadomosc
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Kiedy warto"
            title="Z czym najczesciej zglaszaja sie opiekunowie psow"
            description="Najczesciej chodzi o spacery, reaktywnosc, rozlaka, pobudzenie albo trudne zachowania w domu. Jesli temat wraca i zabiera spokoj, warto go uporzadkowac."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card">
              <h3>Spacery i reaktywnosc</h3>
              <p>Napiecie na spacerach, szczekanie, wyrywanie sie albo trudne mijanki.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <h3>Rozlaka i pobudzenie</h3>
              <p>Trudnosc z zostawaniem samemu, nakrecanie sie albo brak wyciszenia po zwyklych sytuacjach dnia.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <h3>Dom i codziennosc</h3>
              <p>Szczekanie, pilnowanie zasobow, napiecie wobec gosci albo zmiany po przeprowadzce czy adopcji.</p>
            </article>
          </div>

          <div className="hero-actions editorial-final-actions top-gap-small">
            <Link href="/psy" prefetch={false} className="prep-inline-link">
              Przejdz do szerszej strony o problemach psow
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Od czego zaczac"
            title="Najczesciej najlepszym pierwszym krokiem jest Kwadrans"
            description="Kwadrans z behawiorysta pomaga wtedy, gdy chcesz nazwac problem, ocenic priorytet i ustalic, co zrobic najpierw."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Zacznij od Kwadransu, jesli</h3>
              <ul className="premium-bullet-list">
                <li>nie wiesz jeszcze, co napedza zachowanie psa</li>
                <li>masz jedno pytanie albo chcesz spokojnie ustawic kierunek</li>
                <li>chcesz ocenic, czy potrzebna jest dluzsza konsultacja</li>
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Wybierz 60 min, jesli</h3>
              <ul className="premium-bullet-list">
                <li>problem jest dlugotrwaly albo obejmuje kilka obszarow</li>
                <li>wiesz, ze potrzebujesz szerszego planu</li>
                <li>temat wraca mimo kolejnych prob</li>
              </ul>
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Jak pracuje"
          title="Najpierw rozumiemy tlo problemu psa"
          description="Tu chodzi o spokojne uporzadkowanie sytuacji, a nie o szybkie dopisywanie gotowej techniki."
          items={TRUST_SIGNAL_SETS.dogBehaviorist}
        />

        <EditorialFaqSection
          id="faq"
          title="Najczestsze pytania przed kontaktem"
          description="Krotko o tym, kiedy wybrac Kwadrans, a kiedy od razu konsultacje 60 min."
          items={FAQ_SHORTLISTS.dogBehaviorist}
        />

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Decyzja</div>
            <h2>Wybierz prosty pierwszy krok</h2>
            <p>
              Jesli temat psa wymaga spokojnego uporzadkowania, zacznij od Kwadransu z behawiorysta. Jesli od razu wiesz, ze potrzebujesz
              szerszej rozmowy, wybierz konsultacje 60 min.
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
