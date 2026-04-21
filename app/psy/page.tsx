import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta psów online - reaktywnosc, separacja i pomoc w domu',
  path: '/psy',
  description: 'Behawiorysta psow online dla opiekunow z calej Polski. Reaktywnosc, separacja, pobudzenie i trudne zachowania w domu.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  { number: 'i.', title: 'Szczeniak / mlody pies', copy: 'Gryzienie, pobudzenie, pierwsze spacery, sygnaly podstawowe, sen i rytm dnia.', href: quickHref, label: 'Kwadrans' },
  { number: 'ii.', title: 'Spacer i reaktywnosc', copy: 'Reakcje na psy, ludzi, rowery. Wyzwalacze, prog reakcji, trasa, dystans.', href: '/psy/reaktywnosc-na-smyczy', label: 'Zobacz temat' },
  { number: 'iii.', title: 'Lek separacyjny', copy: 'Co robic z psem, ktory nie znosi samotnosci - diagnoza i pierwsze zmiany.', href: '/psy/lek-separacyjny', label: 'Zobacz temat' },
  { number: 'iv.', title: 'Pobudzenie / wyciszenie', copy: 'Pies, ktory nie umie odpoczywac. Struktura dnia, sen, aktywnosc i jedzenie.', href: quickHref, label: 'Kwadrans' },
  { number: 'v.', title: 'Agresja w domu', copy: 'Warczenie, obronnosc przy jedzeniu, napiecie miedzy psami - z glowa i bez zgadywania.', href: consultationHref, label: 'Pelna konsultacja' },
  { number: 'vi.', title: 'Drugi pies w domu', copy: 'Wprowadzenie, konflikt, pierwsze tygodnie, przestrzen i reguly domu.', href: quickHref, label: 'Kwadrans' },
  { number: 'vii.', title: 'Strach / fobie', copy: 'Halasy, burza, weterynarz, nowe miejsca. Desensytyzacja i spokojny plan wsparcia.', href: consultationHref, label: 'Pelna konsultacja' },
  { number: 'viii.', title: 'Niepewny temat?', copy: 'Jesli nie wiesz, do ktorej szufladki to pasuje - po to jest Kwadrans.', href: quickHref, label: 'Kwadrans' },
] as const

export default function DogsPage() {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Pies / strona gatunku" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Dla opiekunow psow</div>
            <h1>
              Pies zachowuje sie inaczej niz oczekujesz - <em>spokojnie znajdzmy pierwszy krok.</em>
            </h1>
          </div>
          <p>
            Najczesciej start dotyczy spacerow, pobudzenia, separacji albo mlodego psa, z ktorym trudno zlapac codzienny rytm. Wybierz temat,
            ktory pasuje najblizej, albo zarezerwuj Kwadrans, zeby ustalic priorytet.
          </p>
        </section>

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

        <section style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="I." kicker="Sciezka" title="Dla psa najczesciej dziala ta sama sciezka." />
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Kwadrans - priorytet</h3>
              <p>Opisujesz sytuacje, ustalamy, co najpierw. Czasem sam Kwadrans wystarczy, zeby wejsc na dobry tor.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Obserwacja tygodnia</h3>
              <p>Notujesz wyzwalacze, reakcje i kontekst. To daje material do dalszej pracy bez robienia wszystkiego naraz.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <h3>Pelna konsultacja behawioralna</h3>
              <p>Jesli trzeba, najszersza rozmowa online daje wiecej czasu na temat, podsumowanie i plan dalszych krokow.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="II."
          eyebrow="Usluga online"
          title="Dla psa mozesz zaczac od Kwadransu albo wejsc szerzej."
          description="Jesli temat jest rozlegly, strona uslugi online zbiera pelniejszy opis pracy dla opiekunow z calej Polski."
          audioHref={quickHref}
          consultationHref={consultationHref}
          serviceHref={serviceLandingHref}
          serviceLead="Kwadrans sprawdza sie przy pierwszym priorytecie, a pelna konsultacja pomaga wtedy, gdy temat psa jest juz szerszy lub naklada sie kilka trudnosci."
          quickBullets={[
            'reaktywnosc, pobudzenie albo mlody pies na start',
            'krotki opis sytuacji i pierwszy kierunek',
            'najprostsze wejscie bez przeciazania opiekuna',
          ]}
          consultationBullets={[
            'kilka watkow naraz lub trudny przypadek w domu',
            'wiecej czasu na kontekst spaceru i codziennosci',
            'szerszy plan dalszej pracy po pierwszym rozpoznaniu',
          ]}
          serviceLinkLabel="Zobacz stronę usługi online"
        />

        <NotatnikFinalCta
          title="Najprostszy start dla psa to <em>Kwadrans</em>."
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
