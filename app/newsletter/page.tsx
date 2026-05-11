import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Newsletter dla opiekunów psów i kotów',
  path: '/newsletter',
  description:
    'Spokojny newsletter o zachowaniu psów i kotów: konkretne obserwacje, nowe teksty i materiały bez presji sprzedażowej.',
})

const newsletterCards = [
  {
    title: 'Krótkie teksty zamiast kampanii',
    copy: 'Dostajesz wiadomość tylko wtedy, gdy pojawia się sensowny temat: nowy tekst, materiał albo obserwacja z pracy z psami i kotami.',
  },
  {
    title: 'Segment: pies, kot albo oba',
    copy: 'Przy zapisie wybierasz najbliższy obszar. To pomaga nie mieszac tematów, które nie dotycza Twojej sytuacji.',
  },
  {
    title: 'Bez diagnozowania na sile',
    copy: 'Newsletter ma pomagac nazwać sytuację i spokojnie przejść do następnego kroku, nie zastepuje konsultacji ani badania zdrowia.',
  },
] as const

export default function NewsletterPage() {
  return (
    <NotatnikPageShell
      tag="Newsletter"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
      sideVisualVariant="blog"
      pageClassName="newsletter-page"
    >
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Newsletter', path: '/newsletter' },
        ])}
      />

      <div className="container editorial-stack">
        <section className="panel section-panel newsletter-hero-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Newsletter</div>
              <h1>Spokojne wiadomości o zachowaniu psów i kotów.</h1>
            </div>
            <p className="editorial-section-lead">
              Bez codziennego pisania i bez obietnic cudow. Dostajesz konkret, kiedy jest nowy tekst,
              materiał albo temat, który może pomóc uporządkować sytuację w domu.
            </p>
          </div>

          <div className="premium-two-column-grid top-gap-small">
            <NewsletterSignup location="newsletter-page" sourcePage="/newsletter" />
            <aside className="summary-card tree-backed-card newsletter-note-card">
              <div className="section-eyebrow">Co dalej</div>
              <h2>Jeśli temat jest pilny, nie czekaj na newsletter.</h2>
              <p>
                Newsletter jest wolnym kanałem. Przy problemie, który narasta, obejmuje bezpieczeństwo
                albo mocno obciąża dom, lepszy jest Kwadrans albo dłuższa konsultacja.
              </p>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  Zacznij od Kwadransa
                </Link>
                <Link href="/quiz" prefetch={false} className="button button-ghost">
                  Zrob krótki quiz
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel">
          <NotatnikSectionHead index="I." kicker="Zasady" title="Co dostajesz po zapisie." />
          <div className="card-grid three-up top-gap-small">
            {newsletterCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
