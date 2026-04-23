import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { ServicesComparison } from '@/components/ServicesComparison'
import { repairCopy } from '@/lib/copy'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug, type LeadMagnet } from '@/lib/growth-layer'
import { FUNNEL_PRIMARY_HREF, FUNNEL_UPGRADE_HREF } from '@/lib/offers'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

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
    quote: 'Po rozmowie wiedziałam, co zrobić od razu i co spokojnie odłożyć. W domu zrobiło się dużo lżej.',
    footer: 'Opiekunka psa reaktywnego / po pierwszym kontakcie audio',
  },
  {
    quote: 'Przy kuwecie dostałam porządek zamiast kolejnych domysłów. To był pierwszy moment, kiedy wiedziałam, od czego zacząć.',
    footer: 'Opiekunka kota niewychodzącego / po uporządkowaniu tematu',
  },
] as const

const credentials = [
  {
    title: 'Behawiorysta COAPE',
    copy: 'Międzynarodowy standard kształcenia behawiorystów i spokojna praca z realną codziennością.',
  },
  {
    title: 'Trener zwierząt towarzyszących',
    copy: 'Pierwszy krok ma być wykonalny dla opiekuna i realny dla psa albo kota.',
  },
  {
    title: 'Technik weterynarii',
    copy: 'Szerszy kontekst zdrowia, bezpieczeństwa i tego, kiedy najpierw trzeba wykluczyć podłoże medyczne.',
  },
] as const

const trustCards = [
  {
    title: '3 formaty startu',
    copy: 'Kwadrans, Dwa kwadranse i pełna konsultacja mają jasne role jeszcze przed rezerwacją.',
  },
  {
    title: '24 h na zmianę lub rezygnację',
    copy: 'Krótkie formaty mają opisane wprost okno na zmianę terminu albo rezygnację po potwierdzeniu wpłaty.',
  },
  {
    title: 'Publiczny profil i źródła',
    copy: 'Profil COAPE/CAPBT, FAQ i strony usługowe są spięte tym samym opisem kwalifikacji i zakresu pracy.',
  },
] as const

export default function HomePage() {
  const faqItems = FAQ_SHORTLISTS.home.slice(0, 4)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psów i kotów online',
      description: 'Spokojny pierwszy krok dla opiekunów psów i kotów. Kwadrans, Dwa kwadranse i pełna konsultacja online.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: 'Kwadrans z behawiorystą', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Dwa kwadranse', description: '30 min audio.', url: '/book?service=konsultacja-30-min', price: 129 },
        { name: 'Pełna konsultacja', description: '60 min audio albo video.', url: '/book?service=konsultacja-behawioralna-online', price: 350 },
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
            <span>Spokojny start dla opiekunów psów i kotów</span>
          </div>

          <h1>
            Twój pies albo kot zachowuje się inaczej, niż powinien, i chcesz <em>wiedzieć, co z tym zrobić.</em>
          </h1>

          <div className="notatnik-hero-grid">
            <div>
              <p className="notatnik-hero-lede">
                Pomagam opiekunom, którzy widzą problem i szukają <strong>konkretnej pomocy</strong>, nie kolejnych ogólnych porad z internetu.
                <strong> Kwadrans z behawiorystą</strong> to najprostszy start, gdy chcesz spokojnie ustalić pierwszy krok.
              </p>

              <NextSlot className="top-gap-small" />

              <div className="notatnik-hero-cta">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-btn">
                  <span>Kwadrans z behawiorystą</span>
                  <span className="notatnik-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                  <span>Napisz wiadomość</span>
                </Link>
              </div>

              <div className="notatnik-hero-fine">
                Szerszy temat?{' '}
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false}>
                  Umów Dwa kwadranse.
                </Link>{' '}
                / Masz już kontekst?{' '}
                <Link href="/psy" prefetch={false}>
                  Pies
                </Link>{' '}
                /{' '}
                <Link href="/koty" prefetch={false}>
                  Kot
                </Link>
                .
              </div>
            </div>

            <aside className="notatnik-hero-card">
              <div className="notatnik-hero-card-corner notatnik-mono">Pierwszy krok</div>
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
                <h3>Kwadrans z behawiorystą</h3>
                <p>15 minut rozmowy audio bez kamery. Jedno pytanie albo uporządkowanie tematu na start.</p>
                <div className="notatnik-price-row">
                  <div className="notatnik-price-big">69 zl</div>
                  <div className="notatnik-price-small">15 min / audio / bez kamery</div>
                </div>
                <div className="notatnik-price-row notatnik-price-row-plain">
                  <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-inline-link">
                    Rezerwacja
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="I." kicker="Pies i Kot" title="Jeśli wiesz już, czy temat dotyczy psa, czy kota, wybierz właściwą stronę." />

          <div className="notatnik-quiet-grid">
            <article className="notatnik-quiet-card">
              <div className="notatnik-mono">Sekcja A / Pies / strona gatunku</div>
              <h3>
                Pomoc dla opiekuna <em>psa</em>.
              </h3>
              <p>Najczęściej start dotyczy spacerów, pobudzenia, separacji albo młodego psa, z którym trudno złapać codzienny rytm.</p>
              <Link href="/psy" prefetch={false} className="notatnik-inline-link">
                Zobacz pomoc dla psa
              </Link>
            </article>

            <article className="notatnik-quiet-card">
              <div className="notatnik-mono">Sekcja B / Kot / strona gatunku</div>
              <h3>
                Pomoc dla opiekuna <em>kota</em>.
              </h3>
              <p>Tu zwykle chodzi o kuwetę, wycofanie, napięcie po zmianach w domu albo trudne relacje między kotami.</p>
              <Link href="/koty" prefetch={false} className="notatnik-inline-link">
                Zobacz pomoc dla kota
              </Link>
            </article>
          </div>
        </section>

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead
            index="II."
            kicker="Jak to działa"
            title="Zacznij od Kwadransu z behawiorystą. Najpierw ustalamy priorytet, potem pierwszy krok."
          />

          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Zaczynasz od Kwadransu</h3>
              <p>Najpierw krótki start, żeby spokojnie ustalić priorytet i kolejny krok. Bez presji, bez długiej ankiety.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Krótko opisujesz sytuację</h3>
              <p>Mówisz, co dzieje się dziś w domu, na spacerze albo przy kuwecie, i co najbardziej Cię blokuje.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Wiesz, co zrobić dalej</h3>
              <p>Po rozmowie wiesz, od czego zacząć, co obserwować i czy temat wymaga Dwóch kwadransów albo pełnej konsultacji.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="III."
          eyebrow="Usluga online"
          title="Behawiorysta psów i kotów online. Zacznij od spokojnej rozmowy."
          description="Jeśli chcesz najpierw zobaczyć pełny opis usługi, nadal możesz wejść przez szeroką stronę online dla całej Polski."
          audioHref={FUNNEL_PRIMARY_HREF}
          consultationHref={FUNNEL_UPGRADE_HREF}
          serviceHref={serviceLandingHref}
          serviceLead="Kwadrans porządkuje temat na start, a pełna konsultacja zostaje dla spraw, które od razu wymagają szerszego planu."
          quickBullets={[
            'jedno pytanie albo uporządkowanie sytuacji',
            '15 minut audio bez kamery',
            'najprostszy pierwszy krok bez długiego wejścia',
          ]}
          consultationBullets={[
            'szerszy temat z większą liczbą wątków',
            'więcej czasu na kontekst i plan dalszej pracy',
            'opcja dla trudniejszych tematów psa albo kota',
          ]}
        />

        <section>
          <NotatnikSectionHead index="IV." kicker="Zaufanie" title="Najważniejsze rzeczy są widoczne jeszcze przed rezerwacją." />
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
          <NotatnikSectionHead index="V." kicker="Cennik" title="Trzy formaty. Jasne różnice przed rezerwacją." />
          <p className="notatnik-service-description">
            Jeśli chcesz porównać usługi przed rezerwacją, poniżej masz cennik w jednym miejscu. Najprostszy start to
            nadal Kwadrans, ale wszystkie opcje są widoczne od razu.
          </p>
          <ServicesComparison />
          <div className="top-gap-small">
            <Link href="/cennik" prefetch={false} className="notatnik-inline-link">
              Otwórz pełny cennik
            </Link>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VI." kicker="Bezpłatne materiały" title="Jeśli chcesz wejść lżej, sięgnij po krótki materiał startowy." />

          <div className="notatnik-material-grid">
            {materials.map((material) => (
              <article key={material.slug} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{material.categoryLabel}</div>
                <h3>{material.shortTitle}</h3>
                <p>{material.lead}</p>
                <Link href={`/bezplatne-materialy/${material.slug}`} prefetch={false}>
                  Zobacz materiał
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="VII." kicker="Opinie" title="Co opiekunowie mówią po rozmowie." />

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
          <NotatnikSectionHead index="VIII." kicker="O mnie" title="Spokojne podejście, konkretne doświadczenie i materiały, do których można wrócić." />
          <div className="notatnik-about">
            <div className="notatnik-portrait">
              <Image src="/branding/specialist-krzysztof-portrait.jpg" alt="Krzysztof Regulski podczas pracy z kotem" fill sizes="(max-width: 1180px) 100vw, 42vw" />
            </div>

            <div className="notatnik-about-copy">
              <div className="notatnik-mono notatnik-kicker-spaced">O mnie</div>
              <h2>Spokojne podejście, konkretne doświadczenie i materiały, do których można wrócić.</h2>
              <p>
                Pracuję spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok. Najpierw porządkuję tło
                zachowania, dopiero potem dobieram pierwszy ruch, który da się wdrożyć w domu bez dokładania chaosu.
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
          <NotatnikSectionHead index="IX." kicker="FAQ" title="Najczęstsze pytania przed pierwszym ruchem." />

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
          title="Jeśli coś Cię niepokoi, <em>zacznij spokojnie.</em>"
          copy="Krótka rozmowa głosem bez kamery wystarczy, żeby ustalić priorytet i wiedzieć, co zrobić dalej."
          primaryHref={FUNNEL_PRIMARY_HREF}
          primaryLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/kontakt#formularz"
          secondaryLabel="Napisz wiadomość"
        />

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel={FUNNEL_CTA_LABELS.primary} />
      </div>
    </main>
  )
}
