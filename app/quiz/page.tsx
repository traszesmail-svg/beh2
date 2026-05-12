import type { Metadata } from 'next'
import Link from 'next/link'
import { DecisionQuiz } from '@/components/DecisionQuiz'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import type { QuizServiceKey } from '@/lib/quiz'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const bookingHrefs: Record<QuizServiceKey, string> = {
  kwadrans: buildBookHref(null, 'szybka-konsultacja-15-min'),
  'dwa-kwadranse': buildBookHref(null, 'konsultacja-30-min'),
  'pelna-konsultacja': buildBookHref(null, 'konsultacja-behawioralna-online'),
}

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Szybki start: dobierz pierwszy krok',
  path: '/quiz',
  description:
    'Krótki quiz dla opiekunów psów i kotów. Pomaga dobrać najrozsądniejszy pierwszy krok bez zgadywania, co wybrać.',
})

export default function QuizPage() {
  return (
    <NotatnikPageShell
      tag="Quiz"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={bookingHrefs.kwadrans}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={bookingHrefs.kwadrans}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
      sideVisualVariant="mixed"
      pageClassName="quiz-page"
    >
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Quiz', path: '/quiz' },
        ])}
      />

      <div className="container editorial-stack">
        <section className="panel section-panel quiz-hero-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Co wybrać?</div>
            <h1>Zacznijmy od tego, co pies albo kot próbuje pokazać zachowaniem</h1>
            </div>
            <p className="editorial-section-lead">
              Odpowiedz na kilka krótkich pytań. Na końcu zobaczysz najprostszy format rozmowy - bez zgadywania, co wybrać.
            </p>
          </div>

          <div className="quiz-path-strip" aria-label="Sciezka quizu">
            <span>1. Materiały</span>
            <span>2. PDF / Niezbędnik</span>
            <span>3. Najrozsądniejszy pierwszy krok na ten moment</span>
          </div>

          <DecisionQuiz bookingHrefs={bookingHrefs} />
        </section>

        <section className="panel section-panel">
          <NotatnikSectionHead index="I." kicker="Zasada" title="Najpierw najprostszy sensowny krok." />
          <p className="notatnik-service-description">
            W realnych sytuacjach zachowanie łączy się ze zdrowiem, środowiskiem, relacjami i rytmem dnia.
            Quiz ma skrócić wybór: materiał albo PDF, jeśli to wystarczy, a rozmowa wtedy, gdy temat wymaga dopytania.
          </p>
          <div className="hero-actions top-gap-small">
            <Link href="/niezbednik" prefetch={false} className="button button-ghost">
              Przejdź do Niezbędnika
            </Link>
            <Link href={bookingHrefs.kwadrans} prefetch={false} className="button button-ghost">
              Umów spokojny pierwszy krok
            </Link>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
