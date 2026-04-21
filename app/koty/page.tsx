import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { ServiceDecisionSection } from '@/components/ServiceDecisionSection'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta kotów online - kuweta, stres i relacje miedzy kotami',
  path: '/koty',
  description: 'Behawiorysta kotow online dla opiekunow z calej Polski. Kuweta, stres, wycofanie, konflikty i zmiany w domu.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
const serviceLandingHref = '/behawiorysta-online-polska'

const topics = [
  { number: 'i.', title: 'Kuweta', copy: 'Sikanie poza kuweta, wybor miejsca, zwirek, liczba kuwet i uklad domu.', href: '/koty/zalatwianie-poza-kuweta', label: 'Zobacz temat' },
  { number: 'ii.', title: 'Wycofanie / napiecie', copy: 'Kot, ktory chowa sie pod kanapa. Bezpieczne miejsca, kontakt i tempo zmian.', href: quickHref, label: 'Kwadrans' },
  { number: 'iii.', title: 'Konflikt miedzy kotami', copy: 'Atak, syk, pogon. Zasoby, przestrzen pionowa, rozdzielenie i spokojny plan laczenia.', href: '/koty/konflikt-miedzy-kotami', label: 'Zobacz temat' },
  { number: 'iv.', title: 'Zmiany w domu', copy: 'Przeprowadzka, dziecko, nowy czlonek rodziny, remont - jak przejsc przez to spokojnie.', href: quickHref, label: 'Kwadrans' },
  { number: 'v.', title: 'Drapanie mebli', copy: 'Nie chodzi o zlosliwosc. Drapaki, rozmieszczenie i naturalne potrzeby kota.', href: quickHref, label: 'Kwadrans' },
  { number: 'vi.', title: 'Agresja redirekt.', copy: 'Atak po widoku kota za oknem albo po silnym pobudzeniu - rozwiazywanie bez dokladania presji.', href: consultationHref, label: 'Pelna konsultacja' },
  { number: 'vii.', title: 'Mlody kot / kociak', copy: 'Pierwsze tygodnie w domu, socjalizacja, zabawa i granice bez kar.', href: quickHref, label: 'Kwadrans' },
  { number: 'viii.', title: 'Niepewny temat?', copy: 'Jesli nie wiesz, do ktorej szufladki to pasuje - po to jest Kwadrans.', href: quickHref, label: 'Kwadrans' },
] as const

export default function CatsPage() {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Kot / strona gatunku" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Dla opiekunow kotow</div>
            <h1>
              Kot nie robi tego ze zlosliwosci - <em>zacznijmy od porzadku.</em>
            </h1>
          </div>
          <p>
            Najczesciej chodzi o kuwete, wycofanie, napiecie po zmianach w domu albo trudne relacje miedzy kotami. Wybierz temat najblizszy
            Twojej sytuacji albo zarezerwuj Kwadrans, zeby ustalic priorytet.
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
          <NotatnikSectionHead index="I." kicker="Sciezka" title="Kot czesto potrzebuje najpierw sprawdzenia zdrowia." />
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">00</div>
              <h3>Najpierw weterynarz</h3>
              <p>Przy kuwecie i naglych zmianach zawsze zaczynamy od wykluczenia podloza medycznego.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <h3>Kwadrans - priorytet</h3>
              <p>Rozmawiamy o tym, co dzieje sie dzis i jaki pierwszy krok ma najwiecej sensu dla kota i domu.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <h3>Obserwacja + zmiany</h3>
              <p>Jesli trzeba, pelna konsultacja pomaga uporzadkowac zdrowie, srodowisko i kolejnosc zmian.</p>
            </article>
          </div>
        </section>

        <ServiceDecisionSection
          index="II."
          eyebrow="Usluga online"
          title="Dla kota mozesz zaczac od Kwadransu albo wejsc szerzej."
          description="Jesli temat kota wymaga pelniejszego opisu, szeroka strona uslugi online porzadkuje caly model wspolpracy."
          audioHref={quickHref}
          consultationHref={consultationHref}
          serviceHref={serviceLandingHref}
          serviceLead="Kwadrans pomaga ustalic pierwszy priorytet, a pelna konsultacja ma sens wtedy, gdy temat kota obejmuje zdrowie, srodowisko i napiecia miedzy zwierzetami."
          quickBullets={[
            'kuweta, napiecie albo zmiana w domu na start',
            'krotka rozmowa o priorytecie i pierwszym ruchu',
            'lekki poczatek bez rozwleklego wejscia',
          ]}
          consultationBullets={[
            'kilka warstw problemu lub konflikt miedzy kotami',
            'wiecej czasu na srodowisko, zasoby i rytm dnia',
            'szerszy plan zmian po pierwszym rozpoznaniu',
          ]}
          serviceLinkLabel="Zobacz stronę usługi online"
        />

        <NotatnikFinalCta
          title="Najprostszy start dla kota to <em>Kwadrans</em>."
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
