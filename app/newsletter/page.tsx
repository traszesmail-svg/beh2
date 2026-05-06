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
  title: 'Newsletter dla opiekunow psow i kotow',
  path: '/newsletter',
  description:
    'Spokojny newsletter o zachowaniu psow i kotow: konkretne obserwacje, nowe teksty i materialy bez presji sprzedazowej.',
})

const newsletterCards = [
  {
    title: 'Krotkie teksty zamiast kampanii',
    copy: 'Dostajesz wiadomosc tylko wtedy, gdy pojawia sie sensowny temat: nowy tekst, material albo obserwacja z pracy z psami i kotami.',
  },
  {
    title: 'Segment: pies, kot albo oba',
    copy: 'Przy zapisie wybierasz najblizszy obszar. To pomaga nie mieszac tematow, ktore nie dotycza Twojej sytuacji.',
  },
  {
    title: 'Bez diagnozowania na sile',
    copy: 'Newsletter ma pomagac nazwac sytuacje i spokojnie przejsc do nastepnego kroku, nie zastepuje konsultacji ani badania zdrowia.',
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
          { name: 'Strona glowna', path: '/' },
          { name: 'Newsletter', path: '/newsletter' },
        ])}
      />

      <div className="container editorial-stack">
        <section className="panel section-panel newsletter-hero-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Newsletter</div>
              <h1>Spokojne wiadomosci o zachowaniu psow i kotow.</h1>
            </div>
            <p className="editorial-section-lead">
              Bez codziennego pisania i bez obietnic cudow. Dostajesz konkret, kiedy jest nowy tekst,
              material albo temat, ktory moze pomoc uporzadkowac sytuacje w domu.
            </p>
          </div>

          <div className="premium-two-column-grid top-gap-small">
            <NewsletterSignup location="newsletter-page" sourcePage="/newsletter" />
            <aside className="summary-card tree-backed-card newsletter-note-card">
              <div className="section-eyebrow">Co dalej</div>
              <h2>Jesli temat jest pilny, nie czekaj na newsletter.</h2>
              <p>
                Newsletter jest wolnym kanalem. Przy problemie, ktory narasta, obejmuje bezpieczenstwo
                albo mocno obciaza dom, lepszy jest Kwadrans albo dluzsza konsultacja.
              </p>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  Zacznij od Kwadransa
                </Link>
                <Link href="/quiz" prefetch={false} className="button button-ghost">
                  Zrob krotki quiz
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
