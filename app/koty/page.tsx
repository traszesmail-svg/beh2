import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { ServicesComparison } from '@/components/ServicesComparison'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta kotów online - kuweta, stres i relacje miedzy kotami',
  path: '/koty',
  description: 'Pomoc behawioralna online dla opiekunow kotow. Kwadrans 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const urgentHref = buildBookHref(null, 'kwadrans-na-juz', false, 'kot')
const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, 'kot')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  {
    number: 'i.',
    title: 'Kuweta',
    copy: 'Sikanie poza kuweta, wybor miejsca, zwirek i liczba kuwet. Najpierw porzadek, potem zmiany.',
    href: '/koty/zalatwianie-poza-kuweta',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    title: 'Wycofanie i napiecie',
    copy: 'Kot chowa sie, jest bardziej czujny albo trudniej mu odpoczac po zmianach w domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iii.',
    title: 'Konflikt miedzy kotami',
    copy: 'Syk, pogon, blokowanie przejsc albo napiecie stale wiszace w domu. Tu liczy sie kolejnosc zmian.',
    href: '/koty/konflikt-miedzy-kotami',
    label: 'Zobacz temat',
  },
  {
    number: 'iv.',
    title: 'Zmiany w domu',
    copy: 'Przeprowadzka, dziecko, remont, nowy domownik albo rozchwiany rytm dnia potrafia mocno obciazyc kota.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    title: 'Drapanie i napiecie srodowiskowe',
    copy: 'Tu zwykle nie chodzi o zlosliwosc, tylko o potrzeby, rozmieszczenie zasobow i poczucie bezpieczenstwa.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'vi.',
    title: 'Agresja przekierowana',
    copy: 'Silne pobudzenie po bodzcu z zewnatrz, atak po napieciu i trudnosc w zatrzymaniu eskalacji.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
  {
    number: 'vii.',
    title: 'Mlody kot i start w domu',
    copy: 'Pierwsze tygodnie, socjalizacja, zabawa i codzienne granice bez wprowadzania presji.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'viii.',
    title: 'Niepewny temat',
    copy: 'Jesli nie wiesz, czy chodzi o kuwete, stres czy zdrowie, zaczynamy od ustalenia priorytetu.',
    href: quickHref,
    label: 'Kwadrans',
  },
] as const

export default function CatsPage() {
  const faqItems = FAQ_SHORTLISTS.cats.slice(0, 4)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Koty', path: '/koty' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunow kotow online',
      description: 'Konsultacje online dla opiekunow kotow: kuweta, wycofanie, stres po zmianach i napiecie miedzy kotami.',
      serviceUrl: serviceLandingHref,
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery dla opiekuna kota.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Kwadrans na juz',
          description: 'Ten sam format 15 minut, ale z terminem w 15 minut.',
          url: urgentHref,
          price: 99,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na spokojniejsze uporzadkowanie tematu kota.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematow kocich wielowatkowych albo dlugotrwalych.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Kot / strona gatunku" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Kot / strona gatunku</div>
            <h1>
              Twoj kot zachowuje sie w sposob, <em>ktory Cie niepokoi</em>.
            </h1>
            <p>
              Pomagam opiekunom kotow zrozumiec, co stoi za trudnym zachowaniem i jak zaczac to porzadkowac bez stresu dla kota i dla Ciebie.
            </p>
            <NextSlot className="top-gap-small" />
            <p className="notatnik-service-description">
              Nie oceniam. Szukam przyczyny, nie winy. Dla kota obowiazuje ta sama drabinka: Kwadrans na start, Kwadrans na juz przy pilnym temacie, Dwa kwadranse przy szerszym uporzadkowaniu i Pelna konsultacja przy sprawach zlozonych.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj Kwadrans</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href="/niezbednik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Przejdz do Niezbednika</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-subhero-figure">
              <Image src="/branding/topic-cards/cats/cat-anxious-hiding.jpg" alt="Kot wycofany i schowany w domu" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
            </div>
            <div className="notatnik-subhero-note">
              <span>Kuweta / stres / relacje miedzy kotami</span>
              <span>online / cala Polska</span>
            </div>
          </div>
        </section>

        <section id="tematy">
          <NotatnikSectionHead index="I." kicker="Problemy / kategorie" title="Problemy kocie - lista." />
          <div className="notatnik-topic-grid">
            {topics.map((topic) => (
              <article key={topic.title} className="notatnik-topic-card">
                <div className="notatnik-topic-number">{topic.number}</div>
                <h3>{topic.title}</h3>
                <p>{topic.copy}</p>
                <Link href={topic.href} prefetch={false}>
                  {topic.label}
                </Link>
              </article>
            ))}
          </div>
          <div className="notatnik-subhero-actions top-gap">
            <Link href={quickHref} prefetch={false} className="notatnik-btn">
              <span>Rozpoznajesz swoj problem? Zarezerwuj Kwadrans</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/niezbednik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Niezbednik dla opiekuna kota</span>
            </Link>
          </div>
        </section>

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="II." kicker="Jak to dziala" title="Przy kocie bardzo czesto najpierw sprawdzamy porzadek sytuacji." />
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">00</div>
              <h3>Najpierw zdrowie, jesli trzeba</h3>
              <p>Przy naglej zmianie zachowania albo kuwecie pierwszym krokiem bywa weterynarz. To element bezpiecznej oceny.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Wybierasz wlasciwy format</h3>
              <p>Kwadrans jest najprostszym startem. Kwadrans na juz daje ten sam zakres szybciej. Dwa kwadranse i Pelna konsultacja sa dla tematow szerszych.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Opisujesz sytuacje kota</h3>
              <p>Rozmawiamy o tym, co dzieje sie dzis w domu, i wybieramy pierwszy ruch z sensem dla kota i opiekuna.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Wiesz, czy wejsc szerzej</h3>
              <p>Jesli problem obejmuje zdrowie, srodowisko i relacje, po rozmowie wiadomo, czy kolejnym krokiem maja byc Dwa kwadranse albo Pelna konsultacja.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="III."
          eyebrow="Usluga online"
          title="Dla kota obowiazuje ta sama logika 4 uslug."
          description="Kwadrans pomaga ustalic pierwszy priorytet, Kwadrans na juz przyspiesza wejscie, Dwa kwadranse daja etap posredni, a Pelna konsultacja zostaje dla spraw, ktore wymagaja szerszego porzadkowania."
          audioHref={quickHref}
          consultationHref={consultationHref}
          serviceHref={serviceLandingHref}
          serviceLead="Jesli temat kota obejmuje zdrowie, srodowisko i napiecia w domu, od razu ustawimy bezpieczny zakres dalszej pracy."
          quickBullets={[
            'kuweta, napiecie albo zmiana w domu na start',
            'krotka rozmowa o priorytecie i pierwszym ruchu',
            'lekki poczatek bez przeciazania opiekuna',
          ]}
          consultationBullets={[
            'kilka warstw problemu lub konflikt miedzy kotami',
            'wiecej czasu na zasoby, przestrzen i rytm dnia',
            'szerszy plan zmian po pierwszym rozpoznaniu',
          ]}
          serviceLinkLabel="Zobacz stronę usługi online"
        />

        <section id="konsultacja">
          <NotatnikSectionHead index="IV." kicker="Uslugi" title="Porownanie uslug dla opiekuna kota." />
          <p className="notatnik-service-description">
            Przy kuwecie, stresie i relacjach miedzy kotami dobrze od razu widziec roznice miedzy prostym startem, pilnym terminem, etapem posrednim i pelna konsultacja.
          </p>
          <ServicesComparison species="kot" />
        </section>

        <section id="faq">
          <NotatnikSectionHead index="V." kicker="FAQ" title="Najczestsze pytania przy tematach kocich." />
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
          title="Jesli temat kota Ci nie daje spokoju, <em>zacznij od porzadku.</em>"
          copy="Nie musisz od razu wiedziec, czy chodzi o kuwete, stres czy relacje. Wystarczy dobrze wybrac pierwszy format."
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref="/kontakt?species=kot#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
