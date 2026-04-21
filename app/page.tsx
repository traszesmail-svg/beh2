import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug, type LeadMagnet } from '@/lib/growth-layer'
import { FUNNEL_PRIMARY_HREF, FUNNEL_UPGRADE_HREF } from '@/lib/offers'
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

export default function HomePage() {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Terapia behawioralna / psy i koty" navItems={navItems} ctaHref={FUNNEL_PRIMARY_HREF} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-hero">
          <div className="notatnik-hero-kicker notatnik-mono">
            <span className="notatnik-hero-edition">Nr 01 / 2026</span>
            <span>Spokojny start dla opiekunow psow i kotow</span>
          </div>

          <h1>
            Twoj pies albo kot zachowuje sie inaczej, niz powinien, i chcesz <em>wiedziec, co z tym zrobic.</em>
          </h1>

          <div className="notatnik-hero-grid">
            <div>
              <p className="notatnik-hero-lede">
                Pomagam opiekunom, ktorzy widza problem i szukaja <strong>konkretnej pomocy</strong>, nie kolejnych ogolnych porad z internetu.
                <strong> Kwadrans z behawiorysta</strong> to najprostszy start, gdy chcesz spokojnie ustalic pierwszy krok.
              </p>

              <div className="notatnik-hero-cta">
                <Link href={FUNNEL_PRIMARY_HREF} prefetch={false} className="notatnik-btn">
                  <span>Kwadrans z behawiorysta</span>
                  <span className="notatnik-btn-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
                <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                  <span>Napisz wiadomosc</span>
                </Link>
              </div>

              <div className="notatnik-hero-fine">
                Szerszy temat?{' '}
                <Link href={FUNNEL_UPGRADE_HREF} prefetch={false}>
                  Umow Dwa kwadranse.
                </Link>{' '}
                / Masz juz kontekst?{' '}
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
                <h3>Kwadrans z behawiorysta</h3>
                <p>15 minut rozmowy audio bez kamery. Jedno pytanie albo uporzadkowanie tematu na start.</p>
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
            title="Zacznij od Kwadransu z behawiorysta. Najpierw ustalamy priorytet, potem pierwszy krok."
          />

          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Zaczynasz od Kwadransu</h3>
              <p>Najpierw krotki start, zeby spokojnie ustalic priorytet i kolejny krok. Bez presji, bez dlugiej ankiety.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Krotko opisujesz sytuacje</h3>
              <p>Mowisz, co dzieje sie dzis w domu, na spacerze albo przy kuwecie, i co najbardziej Cie blokuje.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Wiesz, co zrobic dalej</h3>
              <p>Po rozmowie wiesz, od czego zaczac, co obserwowac i czy temat wymaga Dwoch kwadransow albo pelnej konsultacji.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="III."
          eyebrow="Usluga online"
          title="Behawiorysta psów i kotów online. Zacznij od spokojnej rozmowy."
          description="Jesli chcesz najpierw zobaczyc pelny opis uslugi, nadal mozesz wejsc przez szeroka strone online dla calej Polski."
          audioHref={FUNNEL_PRIMARY_HREF}
          consultationHref={FUNNEL_UPGRADE_HREF}
          serviceHref={serviceLandingHref}
          serviceLead="Kwadrans porzadkuje temat na start, a pelna konsultacja zostaje dla spraw, ktore od razu wymagaja szerszego planu."
          quickBullets={[
            'jedno pytanie albo uporzadkowanie sytuacji',
            '15 minut audio bez kamery',
            'najprostszy pierwszy krok bez dlugiego wejscia',
          ]}
          consultationBullets={[
            'szerszy temat z wieksza liczba watkow',
            'wiecej czasu na kontekst i plan dalszej pracy',
            'opcja dla trudniejszych tematow psa albo kota',
          ]}
        />

        <section>
          <NotatnikSectionHead index="IV." kicker="Bezplatne materialy" title="Jesli chcesz wejsc lzej, siegnij po krotki material startowy." />

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
          <NotatnikSectionHead index="V." kicker="Opinie" title="Co opiekunowie mowia po rozmowie." />

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
          <div className="notatnik-about">
            <div className="notatnik-portrait">
              <Image src="/branding/specialist-krzysztof-portrait.jpg" alt="Krzysztof Regulski podczas pracy z kotem" fill sizes="(max-width: 1180px) 100vw, 42vw" />
            </div>

            <div className="notatnik-about-copy">
              <div className="notatnik-mono notatnik-kicker-spaced">O mnie</div>
              <h2>Spokojne podejscie, konkretne doswiadczenie i materialy, do ktorych mozna wrocic.</h2>
              <p>
                Pracuje spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok. Najpierw porzadkuje tlo
                zachowania, dopiero potem dobieram pierwszy ruch, ktory da sie wdrozyc w domu bez dokladania chaosu.
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
          <NotatnikSectionHead index="VI." kicker="FAQ" title="Najczestsze pytania przed pierwszym ruchem." />

          <div className="notatnik-faq-grid">
            {FAQ_SHORTLISTS.home.slice(0, 4).map((item) => (
              <article key={item.question} className="notatnik-faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jesli cos Cie niepokoi, <em>zacznij spokojnie.</em>"
          copy="Krotka rozmowa glosem bez kamery wystarczy, zeby ustalic priorytet i wiedziec, co zrobic dalej."
          primaryHref={FUNNEL_PRIMARY_HREF}
          primaryLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/kontakt#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel={FUNNEL_CTA_LABELS.primary} />
      </div>
    </main>
  )
}
