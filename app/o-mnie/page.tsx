import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getPersonJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import {
  CAPBT_ORG_URL,
  CAPBT_POLSKA_LOGO,
  CAPBT_PROFILE_URL,
  COAPE_INTL_LOGO,
  COAPE_INTL_URL,
  COAPE_ORG_URL,
  COAPE_POLSKA_LOGO,
  INSTAGRAM_PROFILE_URL,
  MEDIA_MENTIONS,
  SPECIALIST_CREDENTIALS_LIST,
  SPECIALIST_NAME,
  SPECIALIST_PUBLIC_STATUS,
  SPECIALIST_STATUS_EXPLANATION,
  getPublicContactDetails,
} from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krzysztof Regulski - behawiorysta COAPE psow i kotow',
  path: '/o-mnie',
  description:
    'Krzysztof Regulski - behawiorysta COAPE psow i kotow. Sposob pracy, kwalifikacje, profil publiczny i informacje przed kontaktem.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')

const approachCards = [
  {
    title: 'Zaczynam od tego, co dzieje sie dzis',
    copy: 'Interesuje mnie konkretna codziennosc: kiedy pojawia sie problem, co go poprzedza i co najbardziej obciaza dom.',
  },
  {
    title: 'Oddzielam objaw od tla',
    copy: 'Nie zatrzymuje sie na samym sygnale. Sprawdzam tez srodowisko, relacje, rytm dnia i to, co moze podtrzymywac zachowanie.',
  },
  {
    title: 'Mowie wprost, kiedy warto sprawdzic zdrowie',
    copy: 'Jesli widze powod, zeby najpierw wracac do weterynarza albo bezpieczenstwa, mowie to jasno i bez tworzenia pozornej pewnosci.',
  },
] as const

const expectationCards = [
  {
    title: 'Dostajesz jasny pierwszy krok',
    copy: 'Po rozmowie ma byc wiadomo, co zrobic teraz, co obserwowac i gdzie nie dokladac sobie chaosu.',
  },
  {
    title: 'Nie musisz znac fachowych nazw',
    copy: 'Wystarczy opis codziennosci. To moja rola poukladac, co jest objawem, a co tlem sytuacji.',
  },
  {
    title: 'Mowie wprost, kiedy potrzeba czegos wiecej',
    copy: 'Jesli temat wymaga szerszej konsultacji, badan albo zmiany priorytetu, uslyszysz to od razu i bez ozdobnikow.',
  },
] as const

const proofCards = [
  {
    label: 'Publiczny profil',
    title: 'Publiczny profil ekspercki',
    copy: 'Publiczny wpis pozwalajacy od razu zweryfikowac kwalifikacje COAPE i obecnosc w katalogu CAPBT.',
    href: CAPBT_PROFILE_URL,
    cta: 'Zweryfikuj profil',
  },
  {
    label: 'Publiczny profil',
    title: 'Profil marki na Instagramie',
    copy: 'Dodatkowy publiczny profil, jesli chcesz zobaczyc sposob komunikacji projektu poza sama strona.',
    href: INSTAGRAM_PROFILE_URL,
    cta: 'Otworz Instagram',
  },
  ...MEDIA_MENTIONS.slice(0, 2).map((mention) => ({
    label: mention.label,
    title: mention.title,
    copy: mention.summary,
    href: mention.href,
    cta: mention.cta,
  })),
] as const

const qualifications = [
  {
    title: 'COAPE',
    eyebrow: 'Miedzynarodowe odniesienie',
    copy: 'Zaplecze szkoleniowe dla sposobu myslenia o zachowaniu, dobrostanie i pracy z opiekunem.',
    href: COAPE_INTL_URL,
    logo: COAPE_INTL_LOGO,
  },
  {
    title: 'COAPE Polska',
    eyebrow: 'Polskie zaplecze',
    copy: 'Lokalne srodowisko afiliacyjne i czytelne odniesienie do pracy specjalistow COAPE w Polsce.',
    href: COAPE_ORG_URL,
    logo: COAPE_POLSKA_LOGO,
  },
  {
    title: 'CAPBT Polska',
    eyebrow: 'Srodowisko zawodowe',
    copy: 'Stowarzyszenie Behawiorystow i Trenerow COAPE oraz srodowisko zawodowe, z ktorym jestem zwiazany.',
    href: CAPBT_ORG_URL,
    logo: CAPBT_POLSKA_LOGO,
  },
] as const

export default function AboutPage() {
  const contact = getPublicContactDetails()
  const faqItems = FAQ_SHORTLISTS.consultation.slice(0, 4)
  const structuredData = [
    getPersonJsonLd(),
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'O mnie', path: '/o-mnie' }]),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="O mnie / podejscie" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">O mnie / podejscie</div>
            <h1>
              Spokojne podejscie, <em>konkretne doswiadczenie</em>.
            </h1>
            <p>
              Pomagam uporzadkowac sytuacje psa albo kota tak, zeby po rozmowie zostal jasny pierwszy krok. Bez egzaminowania opiekuna i bez
              sztucznej pewnosci tam, gdzie najpierw trzeba cos sprawdzic.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Jak wyglada konsultacja</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Napisz wiadomosc</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-hero-card">
              <div className="notatnik-hero-card-corner notatnik-mono">Publiczny status</div>
              <div className="notatnik-hero-card-media" style={{ height: 360 }}>
                <Image
                  src="/branding/specialist-krzysztof-portrait.jpg"
                  alt="Krzysztof Regulski podczas pracy z kotem"
                  fill
                  sizes="(max-width: 980px) 100vw, 40vw"
                  priority
                />
              </div>
              <div className="notatnik-hero-card-body">
                <h3>{SPECIALIST_NAME}</h3>
                <p>{SPECIALIST_PUBLIC_STATUS}</p>
                <div className="notatnik-price-row notatnik-price-row-plain">
                  <Link href={CAPBT_PROFILE_URL} target="_blank" rel="noreferrer noopener" className="notatnik-inline-link">
                    Zobacz profil CAPBT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="notatnik-about">
            <div className="notatnik-portrait">
              <Image src="/branding/omnie-hero.webp" alt="Krzysztof Regulski w spokojnym kadrze konsultacyjnym" fill sizes="(max-width: 1180px) 100vw, 42vw" />
            </div>

            <div className="notatnik-about-copy">
              <div className="notatnik-mono notatnik-kicker-spaced">Kim jestem</div>
              <h2>Pracuje z psami i kotami online, zaczynajac od tego, co realnie dzieje sie w domu.</h2>
              <p>
                Najwazniejszy jest dla mnie porzadek sytuacji, dobrostan zwierzecia i wykonalny plan dla opiekuna.
              </p>
              <p>
                Nie obiecuje szybkich efektow ani gotowych recept na kazdy przypadek. Jesli trzeba, jasno mowie tez, kiedy najpierw warto
                sprawdzic zdrowie, bezpieczenstwo albo wybrac szerszy format pracy.
              </p>
              <div className="notatnik-cred-grid">
                {SPECIALIST_CREDENTIALS_LIST.map((item) => (
                  <div key={item} className="notatnik-cred">
                    <div className="notatnik-cred-title">{item}</div>
                    <div className="notatnik-cred-copy">
                      {item === 'dyplomant COAPE' ? (
                        <>
                          {SPECIALIST_STATUS_EXPLANATION}{' '}
                          <a href={CAPBT_PROFILE_URL} target="_blank" rel="noreferrer noopener" className="notatnik-inline-link">
                            zweryfikuj profil &rarr;
                          </a>
                        </>
                      ) : (
                        'Element sposobu pracy i szerszego kontekstu w konsultacji.'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="I." kicker="Jak pracuje" title="Najpierw porzadkujemy sytuacje, potem wybieramy pierwszy ruch." />
          <div className="notatnik-material-grid">
            {approachCards.map((card) => (
              <article key={card.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">Podejscie</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="II." kicker="Czego sie spodziewac" title="Ta strona ma pomoc Ci ocenic osobe, nie wybierac pakiet." />
          <div className="notatnik-quiet-grid">
            {expectationCards.map((card) => (
              <article key={card.title} className="notatnik-quiet-card">
                <div className="notatnik-mono">Przebieg rozmowy</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="III." kicker="Publiczne zrodla" title="Rzeczy, ktore mozesz sprawdzic poza sama strona." />
          <div className="notatnik-material-grid">
            {proofCards.map((card) => (
              <article key={card.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{card.label}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <a href={card.href} target="_blank" rel="noreferrer noopener">
                  {card.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="IV." kicker="Srodowisko zawodowe" title="Odniesienia i miejsca, do ktorych odwoluje sie ten profil." />
          <div className="notatnik-material-grid">
            {qualifications.map((item) => (
              <article key={item.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{item.eyebrow}</div>
                <div style={{ position: 'relative', height: 52 }}>
                  <Image src={item.logo.src} alt={item.logo.alt} fill sizes="220px" style={{ objectFit: 'contain', objectPosition: 'left center' }} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  Otworz strone
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="V." kicker="FAQ" title="Najczestsze pytania o sposob pracy." />
          <div className="notatnik-faq-grid">
            {faqItems.map((item) => (
              <article key={item.question} className="notatnik-faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jesli chcesz zaczac spokojnie, <em>zacznij od Kwadransu.</em>"
          copy={`Mozesz od razu zarezerwowac rozmowe albo napisac na ${contact.email}, jesli najpierw chcesz doprecyzowac temat.`}
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref="/kontakt#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
