import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell } from '@/components/NotatnikA'
import { OfferEntrySection } from '@/components/OfferEntrySection'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')
const pageLead =
  'Behawiorysta online dla calej Polski. Trzy glowne wejscia: Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl. Priorytetowy wariant pojawia sie przy rezerwacji Kwadransu.'

export const metadata: Metadata = buildMarketingMetadata({
  title: pageData?.title ?? 'Behawiorysta online dla calej Polski',
  path: '/behawiorysta-online-polska',
  description: pageLead,
  appendLocalContext: false,
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

export default function LocalSeoPolandOnlinePage() {
  if (!pageData) {
    return null
  }

  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const toolkitHref = '/niezbednik'
  const contactHref = '/kontakt#formularz'
  const structuredData = [
    getServiceJsonLd({
      name: pageData.h1,
      description: pageLead,
      serviceUrl: 'https://regulskibehawiorysta.pl/behawiorysta-online-polska',
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery jako najprostszy pierwszy krok.',
          url: audioHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na szersze uporzadkowanie tematu i krotka notatke.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: '60 minut rozmowy, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(pageData.faq),
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Behawiorysta psow i kotow online', path: '/behawiorysta-online-polska' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Behawiorysta online / cala Polska"
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
              <div className="section-eyebrow">Konsultacje online</div>
              <h1>{pageData.h1}</h1>
              <p className="editorial-hero-lead">{pageLead}</p>

              <div className="stack-gap top-gap-small">
                <p className="muted">
                  Publicznie zostaja trzy jasne wejscia: Kwadrans za 69 zl, Dwa kwadranse za 169 zl i Pelna konsultacja za 470 zl. Priorytetowy
                  wariant pojawia sie dopiero przy rezerwacji Kwadransu.
                </p>
                <p className="muted">
                  Najprostszy start to zwykly Kwadrans. Jesli 15 minut to za malo, przechodzisz do Dwoch kwadransow albo Pelnej konsultacji. Jesli
                  przy wyborze terminu zalezy Ci na czasie, priorytet moze pojawic sie dopiero w rezerwacji Kwadransu.
                </p>
              </div>

              <div className="hero-actions editorial-final-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="/cennik" prefetch={false} className="button button-ghost big-button">
                  Zobacz cennik
                </Link>
              </div>

              <p className="muted top-gap-small">
                Jesli temat od razu wymaga dluzszej rozmowy, mozesz wybrac{' '}
                <Link href={bridgeHref} prefetch={false} className="prep-inline-link">
                  Dwa kwadranse
                </Link>{' '}
                albo{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  Pelna konsultacje
                </Link>
                . Jesli chcesz najpierw zadac krotkie pytanie, napisz{' '}
                <Link href={contactHref} prefetch={false} className="prep-inline-link">
                  wiadomosc
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <SectionIntro
            eyebrow="Zakres"
            title="Wybierz wlasciwa sciezke wejscia"
            description="To jest glowna strona uslugi online. Stad przechodzisz dalej do problemow psa, problemow kota, cennika i odpowiedniego formatu konsultacji."
          />
          <div className="card-grid two-up top-gap-small">
            {pageData.problemCards.map((item) => (
              <article key={item.title} className="summary-card tree-backed-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.href ? (
                  <Link href={item.href} prefetch={false} className="prep-inline-link">
                    Przejdz do tematu
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <OfferEntrySection
          eyebrow="Formaty"
          title="Trzy glowne formaty, jedna logika wyboru."
          description="69 zl = najprostszy start. 169 zl = szersze uporzadkowanie tematu. 470 zl = diagnoza, plan poprawy i 7 dni wsparcia przez WhatsApp. Priorytetowy wariant pojawia sie dopiero przy rezerwacji Kwadransu."
        />

        <section className="panel section-panel editorial-section">
          <SectionIntro eyebrow="Rola strony" title={pageData.supportTitle} description={pageData.supportBody[0] ?? ''} />
          <div className="stack-gap top-gap-small">
            {pageData.supportBody.slice(1, 3).map((paragraph) => (
              <div key={paragraph} className="list-card tree-backed-card">
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro eyebrow="FAQ" title="Najczestsze pytania przed rezerwacja" description="Krotko o tym, jak wyglada start, wybor uslugi i pierwszy kontakt przed rozmowa." />
          <div className="premium-faq-grid top-gap">
            {pageData.faq.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">
                  <span>{item.question}</span>
                </summary>
                <div className="premium-faq-content">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="panel section-panel blog-related-panel">
          <SectionIntro eyebrow="Architektura" title="Przejdz dalej tam, gdzie to ma sens" description="Tutaj znajdziesz strony, ktore maja rozne role: problemy psa, problemy kota, cennik, materialy i kontakt." />
          <div className="blog-related-grid top-gap-small">
            {pageData.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>{item.copy}</span>
              </Link>
            ))}
            <Link href="/cennik" prefetch={false} className="summary-card tree-backed-card blog-related-card">
              <strong>Cennik 69 / 169 / 470</strong>
              <span>Zobacz jedna tabele porownawcza trzech glownych formatow i note o wariancie priorytetowym.</span>
            </Link>
            <Link href={toolkitHref} prefetch={false} className="summary-card tree-backed-card blog-related-card">
              <strong>Niezbednik</strong>
              <span>Materialy pomocnicze, jesli chcesz najpierw wejsc lzej albo przygotowac sie do rozmowy.</span>
            </Link>
          </div>
          <div className="hero-actions top-gap-small">
            <Link href={contactHref} prefetch={false} className="prep-inline-link">
              Przejdz do kontaktu
            </Link>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
