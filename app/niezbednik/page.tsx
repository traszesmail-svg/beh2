import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { listMaterialyBundles, listMaterialyGuides } from '@/lib/materialy-catalog'
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
    price: 'ok. 55 zl',
    cover: '/branding/books/other-end-of-the-leash.jpg',
    description:
      'Dobra ksiazka na start, jesli chcesz lepiej czytac relacje czlowiek-pies i zobaczyc, jak wiele nieporozumien bierze sie z naszego sposobu komunikacji.',
    href: 'https://www.randomhousebooks.com/books/110768',
    linkLabel: 'Znajdz ksiazke',
  },
  {
    title: 'The Power of Positive Dog Training',
    author: 'Pat Miller',
    price: 'ok. 60 zl',
    cover: '/branding/books/power-of-positive-dog-training.jpg',
    description:
      'Porzadkuje podstawy pracy opartej na wzmocnieniach. Ma sens szczegolnie wtedy, gdy chcesz przestac skakac miedzy przypadkowymi poradami treningowymi.',
    href: 'https://books.apple.com/us/book/the-power-of-positive-dog-training/id6757761816',
    linkLabel: 'Znajdz ksiazke',
  },
  {
    title: "Don't Shoot the Dog!",
    author: 'Karen Pryor',
    price: 'ok. 45 zl',
    cover: '/branding/books/dont-shoot-the-dog.jpg',
    description:
      'To bardziej ksiazka o mechanice uczenia niz o jednym gatunku. Pomaga zrozumiec, dlaczego nagradzanie i czytelne kryteria zwykle daja lepszy efekt niz presja.',
    href: 'https://www.penguinrandomhouse.com/books/177702/dont-shoot-the-dog-by-karen-pryor/',
    linkLabel: 'Znajdz ksiazke',
  },
  {
    title: 'Cat Sense',
    author: 'John Bradshaw',
    price: 'ok. 65 zl',
    cover: '/branding/books/cat-sense.jpg',
    description:
      'Przydatna, kiedy chcesz lepiej rozumiec kocie potrzeby i codzienne napiecie, zamiast interpretowac zachowanie kota wylacznie jako upor albo zlosliwosc.',
    href: 'https://www.penguinrandomhouse.com/books/222938/cat-sense-by-john-bradshaw/',
    linkLabel: 'Znajdz ksiazke',
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

const allMaterialyGuides = listMaterialyGuides()
const materialyBundles = listMaterialyBundles()
const paidMaterialyCount = allMaterialyGuides.filter((g) => g.tier !== 'free').length

const entryShelves = [
  {
    id: 'polecane-starty',
    label: '3 darmowe materialy',
    title: 'Darmowy start',
    description: 'Trzy bezplatne materialy, od ktorych mozesz zaczac bez rozmowy i bez kupowania czegokolwiek.',
    cta: 'Zobacz od czego zaczac',
  },
  {
    id: 'ksiazki',
    label: `${books.length} ksiazki i ${tools.length} przyborow`,
    title: 'Ksiazki i przybory',
    description: 'Rzeczy, do ktorych warto wrocic dopiero wtedy, gdy realnie wspieraja plan pracy i porzadkuja temat.',
    cta: 'Przejdz do rekomendacji',
  },
  {
    id: 'pdfy-do-kupienia',
    label: `${paidMaterialyCount} PDF-ow i ${materialyBundles.length} pakietow`,
    title: 'PDF-y i pakiety',
    description: 'Pojedyncze przewodniki od 19 zl i pakiety tematyczne 49 zl. Pelna lista i zamowienia w /materialy.',
    cta: 'Przejdz do /materialy',
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
    <NotatnikPageShell
      tag="Niezbednik / materialy"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Niezbednik / materialy i rekomendacje</div>
          <h1>
            Niezbednik do spokojnej pracy <em>z psem lub kotem</em>.
          </h1>
          <p>
            Najpierw wybierz problem, dopiero potem format. Tu masz trzy polki wejściowe: darmowy start, PDF-y i pakiety oraz rekomendacje do spokojnego
            powrotu do tematu.
          </p>
          <div className="notatnik-subhero-actions">
            <Link href="#polecane-starty" prefetch={false} className="notatnik-btn">
              <span>Zobacz od czego zaczac</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href={quickHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Kwadrans / 69 zl</span>
            </Link>
          </div>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-subhero-figure">
            <Image src="/branding/topic-cards/puppy-hands.jpg" alt="Szczeniak trzymany w dloniach opiekuna" fill sizes="(max-width: 980px) 100vw, 40vw" priority />
          </div>
          <div className="notatnik-subhero-note">
            <span>Materialy / rekomendacje</span>
            <span>bezplatny start</span>
          </div>
        </div>
      </section>

      <section id="katalog-materialow">
        <NotatnikSectionHead index="I." kicker="Mapa Niezbednika" title="3 polki Niezbednika." />
        <div className="notatnik-material-grid">
          {entryShelves.map((item) => (
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
        <NotatnikSectionHead
          index="III."
          kicker="PDF-y i pakiety"
          title={`${paidMaterialyCount} przewodnikow i ${materialyBundles.length} pakietow w /materialy.`}
        />
        <p style={{ maxWidth: '720px', color: 'var(--ink-quiet)' }}>
          Pojedyncze PDF-y od 19 zl, pakiety 49 zl, dwa darmowe lead magnety. Pelna lista, opisy i
          zamowienia BLIK-iem znajdziesz na osobnej stronie.
        </p>
        <div className="notatnik-subhero-actions top-gap">
          <Link href="/materialy" prefetch={false} className="notatnik-btn">
            <span>Przejdz do /materialy</span>
            <span className="notatnik-btn-arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
          <Link href="/materialy/pobranie" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
            <span>Mam juz kod — pobierz</span>
          </Link>
        </div>
      </section>

      <section id="rekomendacje">
        <NotatnikSectionHead index="IV." kicker="Ksiazki i przybory" title="Wybrane ksiazki i przybory, ktore maja sens dopiero w dobrym kontekscie." />

        <div id="ksiazki">
          <div className="section-eyebrow">Wybrane ksiazki</div>
          <div className="notatnik-material-grid top-gap-small">
            {books.map((book) => (
              <article key={book.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">Ksiazka</div>
                <div className="essentials-book-cover">
                  <Image src={book.cover} alt={`Okładka: ${book.title}`} width={80} height={110} style={{ borderRadius: '4px', objectFit: 'cover' }} />
                </div>
                <h3>{book.title}</h3>
                <p style={{ margin: 0 }}>
                  <strong>{book.author}</strong>
                </p>
                <p className="notatnik-mono" style={{ fontSize: '13px', margin: '2px 0 0' }}>{book.price}</p>
                <p>{book.description}</p>
                <a href={book.href} target="_blank" rel="noreferrer noopener">
                  {book.linkLabel} →
                </a>
              </article>
            ))}
          </div>
        </div>

        <div id="przybory" className="top-gap">
          <div className="section-eyebrow">Przybory</div>
          <div className="notatnik-material-grid top-gap-small">
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
        </div>
      </section>

      <section id="faq" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="V." kicker="FAQ" title="Najczestsze pytania przed wyborem rekomendacji albo rozmowy." />
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
        title="Jesli material nie wystarcza, <em>Kwadrans porzadkuje temat w 15 minut.</em>"
        copy="Niezbednik jest dobrym startem, ale przy mieszanym albo wracajacym temacie rozmowa zwykle porzadkuje sytuacje szybciej."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref={consultationHref}
        secondaryLabel="Przejdz do pelnej konsultacji"
      />
    </NotatnikPageShell>
  )
}
