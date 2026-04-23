import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { OfferEntrySection } from '@/components/OfferEntrySection'
import { Schema } from '@/components/schema'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { ServicesComparison } from '@/components/ServicesComparison'
import { repairCopy } from '@/lib/copy'
import { getLeadMagnetBySlug, type LeadMagnet } from '@/lib/growth-layer'
import { FUNNEL_FULL_CONSULTATION_HREF, FUNNEL_PRIMARY_HREF, FUNNEL_PRIMARY_LABEL, FUNNEL_UPGRADE_HREF } from '@/lib/offers'
import { PUBLIC_OFFER_FAQ_ITEMS } from '@/lib/public-offer-faq'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_LEAD, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const serviceLandingHref = '/behawiorysta-online-polska'

const materials = [
  getLeadMagnetBySlug('pies-reaktywnosc-5-krokow'),
  getLeadMagnetBySlug('kot-kuweta-checklista'),
  getLeadMagnetBySlug('przygotowanie-do-konsultacji-online'),
].filter((item): item is LeadMagnet => item !== null)

const quotes = [
  {
    quote: 'Po rozmowie wiedzialam, co zrobic od razu i co spokojnie odlozyc. W domu zrobilo sie duzo lzej.',
    footer: 'Opiekunka psa reaktywnego / po pierwszym kontakcie audio',
  },
  {
    quote: 'Przy kuwecie dostalam porzadek zamiast kolejnych domyslow. To byl pierwszy moment, kiedy wiedzialam, od czego zaczac.',
    footer: 'Opiekunka kota niewychodzacego / po uporzadkowaniu tematu',
  },
] as const

const credentials = [
  {
    title: 'Behawiorysta COAPE',
    copy: 'Miedzynarodowy standard ksztalcenia behawiorystow i spokojna praca z realna codziennoscia.',
  },
  {
    title: 'Trener zwierzat towarzyszacych',
    copy: 'Pierwszy krok ma byc wykonalny dla opiekuna i realny dla psa albo kota.',
  },
  {
    title: 'Technik weterynarii',
    copy: 'Szerszy kontekst zdrowia, bezpieczenstwa i tego, kiedy najpierw trzeba wykluczyc podloze medyczne.',
  },
] as const

const trustCards = [
  {
    title: '4 wejscia, jedna logika',
    copy: 'Kwadrans 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl maja jasne role jeszcze przed rezerwacja.',
  },
  {
    title: 'Roznica 69 i 99 jest prosta',
    copy: 'To ten sam 15-minutowy format. Przy 99 zl placisz za priorytet i szybki termin, a nie za dluzsza konsultacje.',
  },
  {
    title: 'Pelna konsultacja ma konkretny zakres',
    copy: '470 zl obejmuje 60 minut rozmowy, diagnoze sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
  },
] as const

export default function HomePage() {
  const faqItems = PUBLIC_OFFER_FAQ_ITEMS
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psow i kotow online',
      description:
        'Spokojny pierwszy krok dla opiekunow psow i kotow. Cztery jasne uslugi: Kwadrans 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery, najprostszy start.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Kwadrans na juz', description: 'Ten sam format 15 min, ale z priorytetem i terminem w 15 minut.', url: '/book?service=kwadrans-na-juz', price: 99 },
        { name: 'Dwa kwadranse', description: '30 min online na szersze uporzadkowanie tematu.', url: '/book?service=konsultacja-30-min', price: 169 },
        {
          name: 'Pelna konsultacja',
          description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: '/book?service=konsultacja-behawioralna-online',
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(
      faqItems.map((item) => ({
        question: repairCopy(item.question),
        answer: repairCopy(item.answer),
      })),
    ),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-side-visual notatnik-side-visual-left" aria-hidden="true">
        <Image src="/branding/side-left-crop.jpg" alt="" fill sizes="280px" />
      </div>
      <div className="notatnik-side-visual notatnik-side-visual-right" aria-hidden="true">
        <Image src="/branding/side-right-crop.jpg" alt="" fill sizes="280px" />
      </div>
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Terapia behawioralna / psy i koty" navItems={navItems} ctaHref={FUNNEL_PRIMARY_HREF} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-hero">
          <div className="notatnik-hero-kicker notatnik-mono">
            <span className="notatnik-hero-edition">Nr 01 / 2026</span>
            <span>Spokojny start dla opiekunow psow i kotow</span>
          </div>

          <h1>
            Problem z zachowaniem psa albo kota? <em>Wybierz spokojny pierwszy krok.</em>
          </h1>

          <div className="notatnik-hero-grid">
            <div>
              <p className="notatnik-hero-lede">
                {PUBLIC_OFFER_LEAD}
              </p>

              <NextSlot className="top-gap-small" />

              <div className="notatnik-hero-cta">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-btn">
                  <span>{FUNNEL_PRIMARY_LABEL}</span>
                  <span className="notatnik-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/cennik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                  <span>Zobacz cennik</span>
                </Link>
              </div>

              <div className="notatnik-hero-fine">
                Pilny temat?{' '}
                <Link href="/urgent" prefetch={false}>
                  Kwadrans na juz
                </Link>
                . Gdy 15 minut to za malo, wybierz{' '}
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false}>
                  Dwa kwadranse
                </Link>
                . Przy sprawie zlozonej albo przewleklej przejdz do{' '}
                <Link href={FUNNEL_FULL_CONSULTATION_HREF} prefetch={false}>
                  Pelnej konsultacji
                </Link>
                .
              </div>
            </div>

            <aside className="notatnik-hero-card">
              <div className="notatnik-hero-card-corner notatnik-mono">Najprostszy start</div>
              <div className="notatnik-hero-card-media">
                <Image
                  src="/branding/omnie-hero.webp"
                  alt="Krzysztof Regulski podczas spokojnej konsultacji"
                  fill
                  priority
                  sizes="(max-width: 1180px) 100vw, 420px"
                />
                <div className="notatnik-hero-card-media-note notatnik-mono">spokojna rozmowa / online</div>
              </div>
              <div className="notatnik-hero-card-body">
                <h3>Kwadrans z behawiorysta</h3>
                <p>15 minut rozmowy audio bez kamery. Najprostszy start, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, od czego zaczac.</p>
                <div className="notatnik-price-row">
                  <div className="notatnik-price-big">{PUBLIC_OFFER_PRICES.quick} zl</div>
                  <div className="notatnik-price-small">15 min / audio / bez kamery</div>
                </div>
                <p className="notatnik-hero-fine">Pilniej? Kwadrans na juz kosztuje {PUBLIC_OFFER_PRICES.urgent} zl i daje ten sam format z priorytetem.</p>
                <p className="notatnik-hero-fine">
                  <Link href="/urgent" prefetch={false} className="notatnik-inline-link">
                    Kwadrans na juz
                  </Link>{' '}
                  to lzejszy dopisek, nie drugi glowny kierunek.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="I." kicker="Pies i Kot" title="Jesli wiesz juz, czy temat dotyczy psa, czy kota, wybierz wlasciwa strone." />

          <div className="notatnik-quiet-grid">
            <article className="notatnik-quiet-card">
              <div className="notatnik-mono">Sekcja A / Pies / strona gatunku</div>
              <h3>
                Pomoc dla opiekuna <em>psa</em>.
              </h3>
              <p>Najczesciej start dotyczy spacerow, pobudzenia, separacji albo mlodego psa, z ktorym trudno zlapac codzienny rytm.</p>
              <Link href="/psy" prefetch={false} className="notatnik-inline-link">
                Zobacz pomoc dla psa
              </Link>
            </article>

            <article className="notatnik-quiet-card">
              <div className="notatnik-mono">Sekcja B / Kot / strona gatunku</div>
              <h3>
                Pomoc dla opiekuna <em>kota</em>.
              </h3>
              <p>Tu zwykle chodzi o kuwete, wycofanie, napiecie po zmianach w domu albo trudne relacje miedzy kotami.</p>
              <Link href="/koty" prefetch={false} className="notatnik-inline-link">
                Zobacz pomoc dla kota
              </Link>
            </article>
          </div>
        </section>

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead
            index="II."
            kicker="Jak to dziala"
            title="Najpierw wybierasz wlasciwy format, potem dopiero termin i kolejny krok."
          />

          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Wybierasz jedna z 4 uslug</h3>
              <p>Kwadrans to najprostszy start. Kwadrans na juz daje ten sam zakres szybciej. Dwa kwadranse porzadkuja temat szerzej, a Pelna konsultacja sluzy sprawom zlozonym.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Krotko opisujesz sytuacje</h3>
              <p>Mowisz, co dzieje sie dzis w domu, na spacerze albo przy kuwecie, i co najbardziej blokuje Wasza codziennosc.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Rozmawiamy w wybranym formacie</h3>
              <p>Kwadrans i Kwadrans na juz sa audio bez kamery. Dwa kwadranse i Pelna konsultacja moga odbyc sie audio albo audio/video.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">04</div>
              <h3>Wiesz, co robic dalej</h3>
              <p>Po rozmowie masz pierwszy kierunek i wiesz, czy zostac przy tym etapie, czy przejsc do Dwoch kwadransow albo Pelnej konsultacji.</p>
            </article>
          </div>
        </section>

        <OfferEntrySection
          sectionId="oferta"
          eyebrow="Oferta"
          title="Cztery uslugi. Jedna logika wyboru."
          description="Kwadrans za 69 zl jest najprostszym startem. Kwadrans na juz za 99 zl daje ten sam format 15 minut, ale z terminem w 15 minut. Dwa kwadranse za 169 zl daja spokojniejsze uporzadkowanie tematu, a Pelna konsultacja za 470 zl daje diagnoze, plan poprawy i 7 dni wsparcia przez WhatsApp."
        />

        <ServiceDecisionSection
          index="III."
          eyebrow="Szeroka usluga online"
          title="Jesli chcesz najpierw zobaczyc pelny opis pracy online, przejdz do strony uslugi dla calej Polski."
          description="Drabinka 69 / 99 / 169 / 470 pomaga wybrac format. Strona uslugi online porzadkuje jeszcze szerzej, kiedy wystarczy Kwadrans, a kiedy lepiej od razu wejsc w najszersza konsultacje."
          audioHref={FUNNEL_PRIMARY_HREF}
          consultationHref={FUNNEL_FULL_CONSULTATION_HREF}
          serviceHref={serviceLandingHref}
          serviceLead="Kwadrans zostaje najprostszym startem, a Pelna konsultacja jest dla spraw zlozonych, przewleklych albo wielowatkowych."
          quickBullets={[
            'jedno pytanie albo pierwszy porzadek',
            '15 minut audio bez kamery',
            'najlatwiejszy pierwszy krok bez dlugiego wejscia',
          ]}
          consultationBullets={[
            'wiecej czasu na tlo problemu i codziennosc',
            'diagnoza, plan poprawy i 7 dni WhatsApp',
            'opcja dla trudniejszych tematow psa albo kota',
          ]}
        />

        <section>
          <NotatnikSectionHead index="IV." kicker="Zaufanie" title="Najwazniejsze rzeczy sa widoczne jeszcze przed rezerwacja." />
          <div className="notatnik-quiet-grid">
            {trustCards.map((card) => (
              <article key={card.title} className="notatnik-quiet-card">
                <div className="notatnik-mono">{card.title}</div>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="V." kicker="Cennik" title="Cztery wejscia. Jasne roznice przed rezerwacja." />
          <p className="notatnik-service-description">
            Najprostszy start to Kwadrans za 69 zl. Kwadrans na juz za 99 zl nie daje dluzszej rozmowy, tylko szybszy termin. Dwa kwadranse za 169 zl sa
            srodkiem dla tematow szerszych, a Pelna konsultacja za 470 zl jest dla spraw zlozonych i przewleklych.
          </p>
          <ServicesComparison />
          <div className="top-gap-small">
            <Link href="/cennik" prefetch={false} className="notatnik-inline-link">
              Otworz pelny cennik
            </Link>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VI." kicker="Bezplatne materialy" title="Jesli chcesz wejsc lzej, siegnij po krotki material startowy." />

          <div className="notatnik-material-grid">
            {materials.map((material) => (
              <article key={material.slug} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{material.categoryLabel}</div>
                <h3>{material.shortTitle}</h3>
                <p>{material.lead}</p>
                <Link href={`/bezplatne-materialy/${material.slug}`} prefetch={false}>
                  Zobacz material
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VII." kicker="Opinie" title="Co opiekunowie mowia po rozmowie." />

          <div className="notatnik-quote-grid">
            {quotes.map((item) => (
              <article key={item.footer} className="notatnik-quote">
                <blockquote>
                  <p>{item.quote}</p>
                  <footer>{item.footer}</footer>
                </blockquote>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VIII." kicker="O mnie" title="Spokojne podejscie, konkretne doswiadczenie i materialy, do ktorych mozna wrocic." />
          <div className="notatnik-about">
            <div className="notatnik-portrait">
              <Image src="/branding/specialist-krzysztof-portrait.jpg" alt="Krzysztof Regulski behawiorysta psow i kotow" fill sizes="(max-width: 1180px) 100vw, 42vw" />
            </div>

            <div className="notatnik-about-copy">
              <div className="notatnik-mono notatnik-kicker-spaced">O mnie</div>
              <h2>Spokojne podejscie, konkretne doswiadczenie i materialy, do ktorych mozna wrocic.</h2>
              <p>
                Pracuje spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok. Najpierw porzadkuje tlo zachowania,
                dopiero potem dobieram pierwszy ruch, ktory da sie wdrozyc w domu bez dokladania chaosu.
              </p>

              <div className="notatnik-cred-grid">
                {credentials.map((item) => (
                  <article key={item.title} className="notatnik-cred">
                    <div className="notatnik-cred-title">{item.title}</div>
                    <div className="notatnik-cred-copy">{item.copy}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="IX." kicker="FAQ" title="Najczestsze pytania przed pierwszym ruchem." />

          <div className="notatnik-faq-grid">
            {faqItems.map((item) => (
              <article key={item.question} className="notatnik-faq-item">
                <h4>{repairCopy(item.question)}</h4>
                <p>{repairCopy(item.answer)}</p>
              </article>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jesli cos Cie niepokoi, <em>zacznij spokojnie.</em>"
          copy="Nie musisz od razu wybierac najwiekszej uslugi. Najczesciej wystarczy dobrze dobrac pierwszy format i ruszyc bez chaosu."
          primaryHref={FUNNEL_PRIMARY_HREF}
          primaryLabel={FUNNEL_PRIMARY_LABEL}
          secondaryHref="/cennik"
          secondaryLabel="Zobacz cennik"
        />

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel={FUNNEL_PRIMARY_LABEL} />
      </div>
    </main>
  )
}
