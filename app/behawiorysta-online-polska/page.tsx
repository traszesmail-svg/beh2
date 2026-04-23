import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferEntrySection } from '@/components/OfferEntrySection'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLocalSeoPageByPath } from '@/lib/growth-layer'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

const pageData = getLocalSeoPageByPath('/behawiorysta-online-polska')
const pageTitle = 'Behawiorysta online dla opiekunow psow i kotow'
const pageLead =
  'Behawiorysta online dla calej Polski. Trzy glowne wejscia: Kwadrans 69 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl. Priorytetowy wariant pojawia sie przy rezerwacji Kwadransu.'
const pageProblemCards = [
  { title: 'Problem dotyczy psa', copy: 'Spacery, reaktywnosc, rozlaka, pobudzenie albo trudne zachowania w domu.', href: '/psy' },
  { title: 'Problem dotyczy kota', copy: 'Kuweta, stres, wycofanie, napiecie w domu albo relacje miedzy kotami.', href: '/koty' },
  { title: 'Chcesz ustalic pierwszy krok', copy: 'Masz jedno pytanie albo potrzebujesz spokojnie uporzadkowac temat przed dalszym dzialaniem.' },
  { title: 'Sprawa jest szersza', copy: 'Problem trwa dluzej, wraca albo obejmuje kilka watkow naraz i wymaga dluzszej rozmowy.' },
]
const pageSupportTitle = 'Jak wyglada taka pomoc online'
const pageSupportBody = [
  'W pracy behawioralnej najwazniejsze sa kontekst, historia problemu, srodowisko i codzienne sytuacje, w ktorych zachowanie wraca. To wlasnie porzadkujemy na rozmowie.',
  'Do startu wystarczy krotki opis. Nagrania bywaja pomocne, ale nie sa warunkiem, a kamera nie jest potrzebna przy 15 min audio.',
  'Najpierw wybierasz zakres. Kwadrans porzadkuje pierwszy krok, Dwa kwadranse rozwiazuja temat szerzej, a Pelna konsultacja sluzy sprawom zlozonym.',
]
const pageFaqItems = [
  {
    question: 'Czy konsultacja online jest dostepna dla calej Polski?',
    answer: 'Tak. Pracuje online z opiekunami z calej Polski, w tej samej formule niezaleznie od miejsca.',
  },
  {
    question: 'Czy potrzebuje kamery albo specjalnego sprzetu?',
    answer: 'Nie. Przy 15 min audio wystarcza rozmowa glosowa. Przy konsultacji 60 min wideo moze pomoc, ale nie jest obowiazkowe.',
  },
  {
    question: 'Czy moge zglosic temat przed adopcja albo przed zmiana w domu?',
    answer: 'Tak. Mozesz omowic przygotowanie domu, plan dzialania i rzeczy, ktore warto sprawdzic wczesniej.',
  },
  {
    question: 'Od czego najlepiej zaczac?',
    answer: 'Jesli nie wiesz jeszcze, jak duzy jest temat, zacznij od Kwadransu. Jesli problem jest zlozony i trwa od dawna, wybierz konsultacje 60 min.',
  },
  {
    question: 'Gdzie sprawdzic dostepne terminy?',
    answer: 'Aktualna dostepnosc najlatwiej sprawdzic w kalendarzu przy rezerwacji.',
  },
]
const pageRelatedLinks = [
  { href: '/psy', label: 'Pomoc dla opiekunow psow', copy: 'Jesli problem dotyczy psa, tutaj znajdziesz szerszy opis najczestszych tematow i problemow.' },
  { href: '/koty', label: 'Pomoc dla opiekunow kotow', copy: 'Jesli problem dotyczy kota, tutaj znajdziesz szerszy opis najczestszych tematow i problemow.' },
  { href: '/konsultacja-behawioralna-online', label: 'Jak wyglada konsultacja 60 min', copy: 'Osobna strona procesu i przebiegu dluzszej konsultacji online.' },
  { href: '/cennik', label: 'Cennik', copy: 'Porownanie 15 min audio i konsultacji 60 min.' },
  { href: '/kontakt', label: 'Kontakt', copy: 'Krotka wiadomosc, jesli chcesz cos doprecyzowac przed rezerwacja.' },
]

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
      name: pageTitle,
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
    getFaqPageJsonLd(pageFaqItems),
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Behawiorysta psow i kotow online', path: '/behawiorysta-online-polska' },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Behawiorysta online / cala Polska"
      navItems={PUBLIC_SITE_NAV_ITEMS}
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
              <h1>{pageTitle}</h1>
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
            {pageProblemCards.map((item) => (
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
          <SectionIntro eyebrow="Rola strony" title={pageSupportTitle} description={pageSupportBody[0] ?? ''} />
          <div className="stack-gap top-gap-small">
            {pageSupportBody.slice(1, 3).map((paragraph) => (
              <div key={paragraph} className="list-card tree-backed-card">
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro eyebrow="FAQ" title="Najczestsze pytania przed rezerwacja" description="Krotko o tym, jak wyglada start, wybor uslugi i pierwszy kontakt przed rozmowa." />
          <div className="premium-faq-grid top-gap">
            {pageFaqItems.map((item) => (
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
            {pageRelatedLinks.map((item) => (
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
