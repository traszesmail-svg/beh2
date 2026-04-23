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
  title: 'Behawiorysta psów online - reaktywnosc, separacja i pomoc w domu',
  path: '/psy',
  description: 'Konsultacja behawioralna online dla opiekunow psow. Spacery, reaktywnosc, rozlaka, pobudzenie. Kwadrans z behawiorysta COAPE - 69 zl, bez kamery.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  {
    number: 'i.',
    title: 'Reaktywnosc na smyczy',
    copy: 'Pies reaguje na inne psy, ludzi albo rowery. Najpierw porzadkujemy wyzwalacze, dystans i rytm spaceru.',
    href: '/psy/reaktywnosc-na-smyczy',
    label: 'Zobacz temat',
  },
  {
    number: 'ii.',
    title: 'Lek separacyjny',
    copy: 'Wycie, niszczenie, napiecie po wyjsciu opiekuna. To temat do spokojnego planu, nie do zgadywania.',
    href: '/psy/lek-separacyjny',
    label: 'Zobacz temat',
  },
  {
    number: 'iii.',
    title: 'Pobudzenie i wyciszenie',
    copy: 'Pies nie umie odpoczac, trudno mu zejsc z napiecia i zlapac codzienny rytm domu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'iv.',
    title: 'Mlody pies i start w domu',
    copy: 'Szczeniak, gryzienie, skakanie, pierwsze spacery i codzienne granice bez chaosu.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'v.',
    title: 'Szczekanie i czujnosc',
    copy: 'Szczekanie przy oknie, w domu albo na spacerach zwykle jest objawem wiekszego napiecia.',
    href: quickHref,
    label: 'Kwadrans',
  },
  {
    number: 'vi.',
    title: 'Agresja i zasoby',
    copy: 'Warczenie, bronienie jedzenia albo napiecie miedzy psami. Tu warto wejsc szerzej i bez pospiechu.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
  {
    number: 'vii.',
    title: 'Strach i fobie',
    copy: 'Halasy, goscie, weterynarz, nowe miejsca. Pracujemy na poczuciu bezpieczenstwa i tempie psa.',
    href: consultationHref,
    label: 'Pelna konsultacja',
  },
  {
    number: 'viii.',
    title: 'Niepewny temat',
    copy: 'Jesli nie wiesz, jak nazwac problem, od tego wlasnie jest Kwadrans z behawiorysta.',
    href: quickHref,
    label: 'Kwadrans',
  },
] as const

export default function DogsPage() {
  const faqItems = FAQ_SHORTLISTS.dogs.slice(0, 4)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Psy', path: '/psy' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunow psow online',
      description: 'Konsultacje online dla opiekunow psow: spacery, reaktywnosc, rozlaka, pobudzenie i pierwszy spokojny krok.',
      serviceUrl: serviceLandingHref,
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorysta',
          description: '15 minut rozmowy audio bez kamery dla opiekuna psa.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Pelna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematow psich wielowatkowych albo dlugotrwalych.',
          url: consultationHref,
          price: 350,
        },
      ],
    }),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Pies / strona gatunku" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Pies / strona gatunku</div>
            <h1>
              Twoj pies zachowuje sie w sposob, <em>ktory Cie niepokoi</em>.
            </h1>
            <p>
              Pomagam opiekunom psow zrozumiec, co stoi za trudnym zachowaniem i jak zaczac to porzadkowac bez przymusu i bez karania.
            </p>
            <NextSlot className="top-gap-small" />
            <p className="notatnik-service-description">Nie musisz wiedziec, jak to nazwac. Wystarczy, ze opiszesz, co sie dzieje.</p>
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
              <Image src="/branding/topic-cards/dog-window-alone.jpg" alt="Pies obserwujacy otoczenie przez okno" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
            </div>
            <div className="notatnik-subhero-note">
              <span>Spacery / pobudzenie / rozlaka</span>
              <span>online / cala Polska</span>
            </div>
          </div>
        </section>

        <section id="tematy">
          <NotatnikSectionHead index="I." kicker="Problemy / kategorie" title="Problemy psie - lista." />
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
              <span>Niezbednik dla opiekuna psa</span>
            </Link>
          </div>
        </section>

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead
            index="II."
            kicker="Jak to dziala"
            title="Dla psa najczesciej dziala ta sama spokojna sciezka."
          />
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Kwadrans i priorytet</h3>
              <p>Krotko opisujesz sytuacje. Ustalamy, co wymaga uwagi najpierw i czego nie robic na starcie.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Obserwacja codziennosci</h3>
              <p>Patrzymy na spacer, rytm dnia, wyzwalacze i momenty, w ktorych pies przestaje sobie radzic.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Szersza konsultacja, jesli trzeba</h3>
              <p>Jesli temat jest wiekszy albo warstwowy, przechodzimy do pelniejszej konsultacji z planem dalszej pracy.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="III."
          eyebrow="Usluga online"
          title="Dla psa mozesz zaczac od Kwadransu albo wejsc szerzej."
          description="Kwadrans porzadkuje temat na start, a pelna konsultacja zostaje dla spraw, ktore od razu wymagaja szerszego planu."
          audioHref={quickHref}
          consultationHref={consultationHref}
          serviceHref={serviceLandingHref}
          serviceLead="Jesli sytuacja psa ma kilka warstw naraz, od razu powiem, czy wystarczy lekki start, czy lepiej wejsc w pelna konsultacje."
          quickBullets={[
            'reaktywnosc, pobudzenie albo mlody pies na start',
            'jeden priorytet i pierwszy ruch bez przeciagania',
            'najprostsze wejscie bez dlugiej ankiety',
          ]}
          consultationBullets={[
            'kilka trudnosci naraz lub dluzsza historia problemu',
            'wiecej czasu na kontekst spaceru i domu',
            'szerszy plan dalszej pracy po rozpoznaniu sytuacji',
          ]}
          serviceLinkLabel="Zobacz stronę usługi online"
        />

        <section id="konsultacja">
          <NotatnikSectionHead index="IV." kicker="Uslugi" title="Porownanie uslug dla opiekuna psa." />
          <p className="notatnik-service-description">
            Przy problemach spacerowych, separacji albo pobudzeniu najwazniejsze jest, czy potrzebujesz pierwszego ruchu,
            spokojniejszego etapu posredniego czy od razu pelnej konsultacji.
          </p>
          <ServicesComparison species="pies" />
        </section>

        <section id="faq">
          <NotatnikSectionHead index="V." kicker="FAQ" title="Najczestsze pytania przy tematach psich." />
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
          title="Jesli temat psa Cie niepokoi, <em>zacznij spokojnie.</em>"
          copy="Nie musisz od razu wiedziec, czy to spacer, pobudzenie czy rozlaka. Wystarczy pierwszy kontakt."
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref="/kontakt?species=pies#formularz"
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
