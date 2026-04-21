import type { Metadata } from 'next'
import { NotatnikEssentialsTable, type NotatnikEssentialRow } from '@/components/NotatnikEssentialsTable'
import { NotatnikFinalCta, NotatnikFooter, NotatnikTopbar } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbednik behawiorysty | akcesoria i narzedzia dla psow i kotow',
  path: '/niezbednik',
  description: 'Wybrane przez behawioryste akcesoria, materialy i punkty startu dla psow i kotow: spacery, transport, enrichment i spokojniejsza codziennosc.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)

const rows: NotatnikEssentialRow[] = [
  {
    id: 'reactive-dog-guide',
    index: '01.',
    category: 'Pies / przewodnik',
    title: '5 krokow dla reaktywnego psa',
    description: 'Pierwszy tydzien obserwacji: wyzwalacze, prog reakcji, zmiana trasy i oddech zanim zaczniesz cwiczyc.',
    meta: ['Czas czytania / 12 min', 'Bezplatne'],
    href: '/bezplatne-materialy/pies-reaktywnosc-5-krokow',
    ctaLabel: 'Zobacz',
    filters: ['pies', 'przewodnik'],
  },
  {
    id: 'litter-checklist',
    index: '02.',
    category: 'Kot / checklista',
    title: 'Checklista kuweta',
    description: 'Zdrowie, kuweta, srodowisko i zmiany w domu - w kolejnosci, nie naraz.',
    meta: ['Czas czytania / 8 min', 'Bezplatne'],
    href: '/bezplatne-materialy/kot-kuweta-checklista',
    ctaLabel: 'Zobacz',
    filters: ['kot', 'przewodnik'],
  },
  {
    id: 'prep-guide',
    index: '03.',
    category: 'Konsultacja / przygotowanie',
    title: 'Przygotowanie do konsultacji online',
    description: 'Co warto miec, a czego nie musisz przygotowywac przed Kwadransem, Dwoma kwadransami albo pelna konsultacja.',
    meta: ['Czas czytania / 5 min', 'Bezplatne'],
    href: '/bezplatne-materialy/przygotowanie-do-konsultacji-online',
    ctaLabel: 'Zobacz',
    filters: ['przewodnik'],
  },
  {
    id: 'calming-signals',
    index: '04.',
    category: 'Ksiazka / polecana',
    title: 'Sygnaly uspokajajace. Jak psy unikaja konfliktow',
    description: 'Dobra pozycja, jesli chcesz szybciej czytac napiecie, komunikacje i wczesne sygnaly psa.',
    meta: ['Ksiazka / pies', 'Zewnetrzne zrodlo'],
    href: 'https://www.amazon.pl/SYGNA%C5%81Y-USPOKAJAJ%C4%84CE-UNIKAJ%C4%84-dodruk-2016/dp/8375790672/',
    ctaLabel: 'Zobacz',
    filters: ['pies', 'ksiazka'],
  },
  {
    id: 'dont-shoot',
    index: '05.',
    category: 'Ksiazka / polecana',
    title: "Don't Shoot the Dog",
    description: 'Klasyka o treningu opartym na wzmocnieniach i porzadkowaniu nauki bez presji i chaosu.',
    meta: ['Ksiazka / pies', 'Zewnetrzne zrodlo'],
    href: 'https://www.amazon.pl/Dont-Shoot-Dog-Teaching-Training/dp/1982106468/',
    ctaLabel: 'Zobacz',
    filters: ['pies', 'ksiazka'],
  },
  {
    id: 'easy-walk',
    index: '06.',
    category: 'Narzedzie',
    title: 'PetSafe Easy Walk',
    description: 'Front-clip do spacerow i pracy nad czytelniejszym ruchem bez ucisku tchawicy. Narzedzie, nie skrot.',
    meta: ['Akcesorium / pies', 'Zewnetrzne zrodlo'],
    href: 'https://www.amazon.pl/Petsafe-Easy-Walk-Uprz%C4%85%C5%BC-Czarny/dp/B00600YMDK/',
    ctaLabel: 'Zobacz',
    filters: ['pies', 'narzedzie'],
  },
  {
    id: 'capri-transporter',
    index: '07.',
    category: 'Narzedzie',
    title: 'Transporter Trixie Capri',
    description: 'Praktyczny start do spokojniejszego transportu i pracy nad bezpieczniejszym przemieszczaniem kota.',
    meta: ['Akcesorium / kot', 'Zewnetrzne zrodlo'],
    href: 'https://www.amazon.pl/Trixie-Capri-XS-ciemnoszary-rumieniec/dp/B0DNFZRBPM/',
    ctaLabel: 'Zobacz',
    filters: ['kot', 'narzedzie'],
  },
]

export default function EssentialsPage() {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Niezbednik / materialy" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Niezbednik</div>
            <h1>
              Materialy do samodzielnej pracy - <em>dobrane pod konkretne sytuacje.</em>
            </h1>
          </div>
          <p>
            Wlasne przewodniki, ksiazki i narzedzia. Do tych pozycji mozna wracac miedzy konsultacjami - albo siegnac po nie, zanim w ogole
            zdecydujesz sie na rozmowe.
          </p>
        </section>

        <NotatnikEssentialsTable rows={rows} />

        <NotatnikFinalCta title="Temat wymaga rozmowy? <em>Zacznij od Kwadransu.</em>" primaryHref={quickHref} primaryLabel="Zarezerwuj Kwadrans / 69 zl" />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
