import type { Metadata } from 'next'
import Link from 'next/link'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCard } from '@/components/PdfGuideCard'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { listPdfBundles, listPdfGuides } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbednik - materialy dla opiekunow psow i kotow',
  path: '/niezbednik',
  description: 'Niezbednik: materialy dla opiekunow psow i kotow, checklisty, przewodniki i spokojne punkty startu.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false)

const leadMagnets = ([
  {
    icon: 'file',
    label: 'PDF startowy',
    cta: 'Otworz przewodnik',
    title: '5 pierwszych krokow, gdy pies szczeka na spacerach',
    description: 'Pierwszy tydzien obserwacji i decyzji dla reaktywnego psa.',
    magnet: getLeadMagnetBySlug('pies-reaktywnosc-5-krokow'),
  },
  {
    icon: 'check',
    label: 'Checklista',
    cta: 'Otworz checkliste',
    title: 'Checklista kuweta - krok po kroku',
    description: 'Zdrowie, kuweta, srodowisko, zmiany w domu. Uporzadkuj temat zanim poglebi sie.',
    magnet: getLeadMagnetBySlug('kot-kuweta-checklista'),
  },
  {
    icon: 'book',
    label: 'Przygotowanie',
    cta: 'Otworz material',
    title: 'Jak przygotowac sie do konsultacji behawioralnej',
    description: 'Co warto miec przed Kwadransem albo pelna konsultacja. Czego nie musisz przygotowywac.',
    magnet: getLeadMagnetBySlug('przygotowanie-do-konsultacji-online'),
  },
] as const).map((item) => {
  if (!item.magnet) {
    throw new Error('Missing lead magnet required by /niezbednik.')
  }

  return {
    ...item,
    href: `/bezplatne-materialy/${item.magnet.slug}`,
  }
})

const books = [
  {
    title: 'The Other End of the Leash',
    author: 'Patricia McConnell',
    description:
      'Dobra ksiazka na start, jesli chcesz lepiej czytac relacje czlowiek-pies i zobaczyc, jak wiele nieporozumien bierze sie z naszego sposobu komunikacji.',
    href: 'https://www.randomhousebooks.com/books/110768',
    linkLabel: 'Zobacz ksiazke',
  },
  {
    title: 'The Power of Positive Dog Training',
    author: 'Pat Miller',
    description:
      'Porzadkuje podstawy pracy opartej na wzmocnieniach. Ma sens szczegolnie wtedy, gdy chcesz przestac skakac miedzy przypadkowymi poradami treningowymi.',
    href: 'https://books.apple.com/us/book/the-power-of-positive-dog-training/id6757761816',
    linkLabel: 'Zobacz wydanie',
  },
  {
    title: "Don't Shoot the Dog!",
    author: 'Karen Pryor',
    description:
      'To bardziej ksiazka o mechanice uczenia niz o jednym gatunku. Pomaga zrozumiec, dlaczego nagradzanie i czytelne kryteria zwykle daja lepszy efekt niz presja.',
    href: 'https://www.penguinrandomhouse.com/books/177702/dont-shoot-the-dog-by-karen-pryor/',
    linkLabel: 'Zobacz ksiazke',
  },
  {
    title: 'Cat Sense',
    author: 'John Bradshaw',
    description:
      'Przydatna, kiedy chcesz lepiej rozumiec kocie potrzeby i codzienne napiecie, zamiast interpretowac zachowanie kota wylacznie jako upor albo zlosliwosc.',
    href: 'https://en.wikipedia.org/wiki/Cat_Sense',
    linkLabel: 'Zobacz opis',
  },
] as const

const tools = [
  {
    title: 'Szelki typu H lub dobrze dopasowane szelki spacerowe',
    note: 'Dla psa, ktory ciagnie, nakreca sie na spacerach albo potrzebuje stabilniejszego prowadzenia bez nacisku na szyje.',
    href: 'https://idcpower.julius-k9.com/en',
    linkLabel: 'Zobacz przyklad',
  },
  {
    title: 'Dluga linka 5-10 m',
    note: 'Ma sens wtedy, gdy chcesz dac psu wiecej swobody do obserwacji i wachania, ale nadal utrzymac bezpieczny margines.',
    href: 'https://juliusk9.com/',
    linkLabel: 'Zobacz marke',
  },
  {
    title: 'Drapak pionowy minimum 90 cm',
    note: 'To realny zasob srodowiskowy dla kota, ktory potrzebuje pionu, rozladowania i bezpiecznego miejsca do zaznaczenia terenu.',
    href: '/koty',
    linkLabel: 'Wroc do strony kotow',
  },
  {
    title: 'Mata wechowa lub spokojne zabawki do samodzielnej pracy',
    note: 'Przydaje sie, gdy potrzebujesz kontrolowanego zajecia dla psa bez podbijania pobudzenia kolejnymi dynamicznymi aktywnosciami.',
    href: '/psy',
    linkLabel: 'Wroc do strony psow',
  },
  {
    title: 'Feliway / Adaptil jako wsparcie srodowiskowe',
    note: 'Czasem ma sens jako dodatek do planu, nie zamiennik diagnozy. Najbardziej przy zmianach w domu, napieciu i trudnosciach z powrotem do rownowagi.',
    href: 'https://us.feliway.com/',
    linkLabel: 'Zobacz przyklad',
  },
] as const

const paidGuides = listPdfGuides().filter((guide) => guide.accessType === 'low-ticket')
const pdfBundles = listPdfBundles()

const paidGuideCounts = {
  dog: paidGuides.filter((guide) => guide.category === 'dog').length,
  cat: paidGuides.filter((guide) => guide.category === 'cat').length,
  mixed: paidGuides.filter((guide) => guide.category === 'mixed').length,
}

const paidGuideCategorySummary = [
  paidGuideCounts.dog > 0 ? `${paidGuideCounts.dog} dla psow` : null,
  paidGuideCounts.cat > 0 ? `${paidGuideCounts.cat} dla kotow` : null,
  paidGuideCounts.mixed > 0 ? `${paidGuideCounts.mixed} mieszane` : null,
]
  .filter((value): value is string => value !== null)
  .join(', ')

const catalogShelves = [
  {
    id: 'polecane-starty',
    label: '3 darmowe materialy',
    title: 'Darmowe starty',
    description: 'Trzy bezplatne materialy, od ktorych mozesz zaczac bez rozmowy i bez kupowania czegokolwiek.',
    cta: 'Przejdz do darmowych startow',
  },
  {
    id: 'pdfy-do-kupienia',
    label: `${paidGuides.length} tematow PDF`,
    title: 'PDF-y do kupienia',
    description: 'Pelniejszy katalog platnych poradnikow PDF do konkretnego problemu albo etapu pracy.',
    cta: 'Przejdz do PDF-ow do kupienia',
  },
  {
    id: 'pakiety-pdf',
    label: `${pdfBundles.length} pakietow`,
    title: 'Pakiety PDF',
    description: 'Gotowe zestawy kilku materialow, gdy temat nie miesci sie w jednym poradniku.',
    cta: 'Przejdz do pakietow PDF',
  },
  {
    id: 'ksiazki',
    label: `${books.length} rekomendacje`,
    title: 'Ksiazki',
    description: 'Wybrane pozycje do poglebienia rozumienia zachowania, nie do przypadkowego kolekcjonowania porad.',
    cta: 'Przejdz do ksiazek',
  },
  {
    id: 'przybory',
    label: `${tools.length} przyborow`,
    title: 'Przybory',
    description: 'Sprzety i wsparcia srodowiskowe tylko tam, gdzie realnie wspieraja plan pracy.',
    cta: 'Przejdz do przyborow',
  },
] as const

const faqItems = [
  {
    question: 'Od czego tu najlepiej zaczac?',
    answer:
      'Najpierw wybierz problem, dopiero potem format. Jesli temat jest blisko reaktywnosci, kuwety albo przygotowania do rozmowy, zacznij od jednego z trzech materialow startowych.',
  },
  {
    question: 'Czy Niezbednik zastepuje konsultacje?',
    answer:
      'Nie zawsze. Materialy sa dobrym punktem startu, ale gdy temat wraca, miesza kilka watkow albo po prostu nie uklada sie w jeden prosty plan, rozmowa zwykle skraca droge.',
  },
  {
    question: 'Czy wszystkie rekomendacje trzeba kupowac?',
    answer:
      'Nie. Przybory maja sens tylko wtedy, gdy wspieraja konkretny plan pracy, a nie jako kolejny zakup bez celu.',
  },
] as const

function EssentialsIcon({ kind }: { kind: 'file' | 'book' | 'check' }) {
  if (kind === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 6.5h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8.5 10h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.5 12.2 2.3 2.3 4.7-5.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3.5h6.5L20 9v11.5H8A2.5 2.5 0 0 1 5.5 18V6A2.5 2.5 0 0 1 8 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.5 3.5V9H20" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export default function EssentialsPage() {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Niezbednik / materialy" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">Niezbednik / materialy i rekomendacje</div>
            <h1>
              Niezbednik do spokojnej pracy <em>z psem lub kotem</em>.
            </h1>
            <p>
              Najpierw wybierz problem, dopiero potem format. Z top menu trafiasz tu od razu do darmowych startow, platnych PDF-ow, pakietow PDF,
              wybranych ksiazek i przyborow, ktore maja sens tylko wtedy, gdy wspieraja realny plan pracy.
            </p>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-quiet-card">
              <div className="notatnik-mono">Szybkie przejscie</div>
              <h3>Jedna polka z darmowym startem, platnymi PDF-ami, pakietami i rzeczami wspierajacymi plan.</h3>
              <p>Kazda sekcja ma jeden cel: skrocic droge od wejscia z menu do materialu, ktory realnie pasuje do Twojej sytuacji.</p>
            </div>
          </div>
        </section>

        <section id="katalog-materialow">
          <NotatnikSectionHead index="I." kicker="Mapa Niezbednika" title="Od razu wybierz polke, ktora pasuje do problemu albo etapu pracy." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Z poziomu top menu trafiasz prosto do jednej strony, na ktorej widac caly katalog materialow: darmowe starty, pojedyncze PDF-y, pakiety,
            ksiazki i przybory. Nie musisz juz zgadywac, gdzie sa materialy platne.
          </p>
          <div className="notatnik-material-grid">
            {catalogShelves.map((item) => (
              <article key={item.id} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={`#${item.id}`}>{item.cta}</a>
              </article>
            ))}
          </div>
        </section>

        <section id="polecane-starty">
          <NotatnikSectionHead index="II." kicker="Darmowy start" title="Trzy konkretne materialy startowe, do ktorych mozesz przejsc od razu." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Te materialy maja sens wtedy, gdy chcesz najpierw uporzadkowac temat samodzielnie, zanim wejdziesz w Kwadrans albo pelna konsultacje.
          </p>
          <div className="notatnik-material-grid">
            {leadMagnets.map((item) => (
              <article key={item.href} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{item.label}</div>
                <div className="essentials-icon" aria-hidden="true">
                  <EssentialsIcon kind={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href} prefetch={false}>
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="pdfy-do-kupienia" style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="III." kicker="PDF-y do kupienia" title="Platne poradniki PDF, gdy chcesz od razu wejsc w konkretny temat." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Masz tu {paidGuides.length} gotowych tematow: {paidGuideCategorySummary}. Kazdy poradnik prowadzi do osobnej strony z opisem, zakresem i
            zamowieniem bez schodzenia do innej sekcji serwisu.
          </p>
          <div className="offer-grid">
            {paidGuides.map((guide) => (
              <PdfGuideCard key={guide.slug} guide={guide} compact />
            ))}
          </div>
        </section>

        <section id="pakiety-pdf">
          <NotatnikSectionHead index="IV." kicker="Pakiety PDF" title="Pakiety, gdy temat miesza kilka watkow albo chcesz gotowa sekwencje materialow." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Tu sa {pdfBundles.length} pakiety PDF zlozone z kilku poradnikow. To najkrotsza droga, gdy potrzebujesz nie jednego tekstu, ale juz
            ulozonej kolejnosci materialow do jednego obszaru pracy.
          </p>
          <div className="offer-grid">
            {pdfBundles.map((bundle) => (
              <PdfBundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>
        </section>

        <section id="ksiazki" style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="V." kicker="Ksiazki" title="Wybrane ksiazki, ktore realnie sa dobrym przedluzeniem tematu." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Kazda z tych pozycji ma sens jako poglebienie rozumienia zachowania, nie jako zamiennik diagnozy i rozmowy o konkretnym przypadku.
          </p>
          <div className="notatnik-material-grid">
            {books.map((book) => (
              <article key={book.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">Ksiazka</div>
                <h3>{book.title}</h3>
                <p>
                  <strong>{book.author}</strong>
                </p>
                <p>{book.description}</p>
                <a href={book.href} target="_blank" rel="noreferrer noopener">
                  {book.linkLabel}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="przybory">
          <NotatnikSectionHead index="VI." kicker="Przybory" title="Przybory, ktore moga wspierac plan pracy." />
          <p className="offer-section-intro" style={{ marginTop: '-24px', marginBottom: '32px' }}>
            Tu nie chodzi o zakupy dla samych zakupow. Kazdy z tych elementow ma sens tylko wtedy, gdy wspiera spokoj, bezpieczenstwo albo lepsze
            zarzadzanie srodowiskiem.
          </p>
          <div className="notatnik-material-grid">
            {tools.map((tool) => {
              const isExternal = tool.href.startsWith('http')

              return (
                <article key={tool.title} className="notatnik-material-card">
                  <div className="notatnik-material-tag notatnik-mono">Przybor</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.note}</p>
                  {isExternal ? (
                    <a href={tool.href} target="_blank" rel="noreferrer noopener">
                      {tool.linkLabel}
                    </a>
                  ) : (
                    <Link href={tool.href} prefetch={false}>
                      {tool.linkLabel}
                    </Link>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section id="faq" style={{ background: 'var(--paper)' }}>
          <NotatnikSectionHead index="VII." kicker="FAQ" title="Najczestsze pytania przed wyborem rekomendacji albo rozmowy." />
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
          title="Jesli ktorys z materialow okazal sie niewystarczajacy, <em>Kwadrans porzadkuje temat w 15 minut.</em>"
          copy="Niezbednik jest dobrym startem, ale przy mieszanym albo wracajacym temacie rozmowa zwykle porzadkuje sytuacje szybciej. Mozesz zaczac od Kwadransu albo od razu przejsc do pelnej konsultacji."
          primaryHref={quickHref}
          primaryLabel="Zarezerwuj Kwadrans / 69 zl"
          secondaryHref={consultationHref}
          secondaryLabel="Przejdz do pelnej konsultacji"
        />

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
