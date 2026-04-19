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
  title: 'Behawiorysta kotow online',
  path: '/behawiorysta-kotow',
  description:
    'Behawiorysta kotow online. Sprawdz, kiedy zaczac od Kwadransu z behawiorysta, kiedy wybrac konsultacje 60 min i jak wyglada pomoc dla opiekuna kota.',
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

export default function CatBehavioristPage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
  const contactHref = '/kontakt?species=kot#formularz'

  return (
    <main className="page-wrap editorial-home-page premium-home-page money-page">
      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc dla opiekunow kotow</div>
              <h1>Behawiorysta kotow online</h1>
              <p className="editorial-hero-lead">
                To strona dla Ciebie, jesli chcesz spokojnie ustalic pierwszy krok przy problemie kota. Krotko, konkretnie i bez
                przerzucania sie miedzy zbyt wieloma tresciami na start.
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
                Jesli temat kota od razu wymaga szerszej rozmowy, mozesz wybrac{' '}
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
            title="Z czym najczesciej zglaszaja sie opiekunowie kotow"
            description="Najczesciej chodzi o kuwete, stres, wycofanie, napiecie miedzy kotami albo zmiany po przeprowadzce czy nowym domowniku."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card">
              <h3>Kuweta i codziennosc</h3>
              <p>Problem z kuweta, nagla zmiana zachowania albo trudnosc z powrotem do spokojnego rytmu dnia.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <h3>Stres i wycofanie</h3>
              <p>Chowanie sie, czujnosc, napiecie w domu albo sygnaly, ktore trudno jeszcze dobrze nazwac.</p>
            </article>
            <article className="summary-card tree-backed-card">
              <h3>Relacje i zmiany</h3>
              <p>Konflikt miedzy kotami, napiecie po zmianach i sytuacje, w ktorych trudno ustalic, od czego zaczac.</p>
            </article>
          </div>

          <div className="hero-actions editorial-final-actions top-gap-small">
            <Link href="/koty" prefetch={false} className="prep-inline-link">
              Przejdz do szerszej strony o problemach kotow
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Od czego zaczac"
            title="Najczesciej najlepszym pierwszym krokiem jest Kwadrans"
            description="Kwadrans z behawiorysta pomaga wtedy, gdy chcesz ocenic, czy temat dotyczy glownie zachowania, srodowiska czy wymaga najpierw sprawdzenia zdrowia."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Zacznij od Kwadransu, jesli</h3>
              <ul className="premium-bullet-list">
                <li>nie wiesz jeszcze, co napedza problem kota</li>
                <li>chcesz ustalic, czy potrzebna jest dluzsza konsultacja</li>
                <li>masz jedno pytanie albo chcesz spokojnie uporzadkowac start</li>
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Wybierz 60 min, jesli</h3>
              <ul className="premium-bullet-list">
                <li>temat ma kilka watkow naraz</li>
                <li>problem wraca mimo kolejnych zmian w domu</li>
                <li>potrzebujesz szerszego planu dla kota, srodowiska i relacji</li>
              </ul>
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Jak pracuje"
          title="Przy kocich tematach liczy sie tlo, nie tylko objaw"
          description="Najpierw trzeba uporzadkowac zdrowie, srodowisko i relacje. Dopiero potem ma sens plan dalszego dzialania."
          items={TRUST_SIGNAL_SETS.catBehaviorist}
        />

        <EditorialFaqSection
          id="faq"
          title="Najczestsze pytania przed kontaktem"
          description="Krotko o tym, kiedy wybrac Kwadrans, a kiedy od razu konsultacje 60 min."
          items={FAQ_SHORTLISTS.catBehaviorist}
        />

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Decyzja</div>
            <h2>Wybierz spokojny pierwszy krok dla kota</h2>
            <p>
              Jesli chcesz najpierw ustalic kierunek, zacznij od Kwadransu z behawiorysta. Jesli od razu wiesz, ze temat jest szerszy,
              wybierz konsultacje 60 min.
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
