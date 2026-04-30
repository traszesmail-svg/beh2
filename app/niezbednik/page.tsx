import type { Metadata } from 'next'
import Image from '@/components/BlankImage'
import Link from 'next/link'
import { HeroIllustration } from '@/components/HeroIllustration'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { buildBookHref } from '@/lib/booking-routing'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { listMaterialyBundles, listMaterialyGuides } from '@/lib/materialy-catalog'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbędnik - PDF-y, książki i przydatne rzeczy',
  path: '/niezbednik',
  description: 'Niezbędnik: darmowe materiały, PDF-y, pakiety, książki i praktyczne rzeczy dla opiekunów psów i kotów.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false)

type EssentialsShopCard = {
  label: string
  price: string
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  cta: string
  meta?: string
  author?: string
}

const leadMagnets = ([
  {
    label: 'PDF startowy',
    price: '0 zł',
    cta: 'Pobierz materiał',
    title: 'Pies szczeka na spacerach',
    description: 'Krótki plan na pierwsze dni: co obserwować, czego nie dokładać i kiedy szukać pomocy.',
    image: '/branding/niezbednik/pdf-dog-walk.jpg',
    imageAlt: 'Pies na spacerze przy smyczy',
    magnet: getLeadMagnetBySlug('pies-reaktywnosc-5-krokow'),
  },
  {
    label: 'Checklista',
    price: '0 zł',
    cta: 'Pobierz checklistę',
    title: 'Kot załatwia się poza kuwetą',
    description: 'Prosta lista spraw do sprawdzenia: zdrowie, kuweta, dom i ostatnie zmiany.',
    image: '/branding/niezbednik/pdf-cat-litter.jpg',
    imageAlt: 'Kuweta z czystym zwirkiem',
    magnet: getLeadMagnetBySlug('kot-kuweta-checklista'),
  },
  {
    label: 'Przygotowanie',
    price: '0 zł',
    cta: 'Pobierz listę',
    title: 'Przed rozmową z behawiorystą',
    description: 'Co przygotować, co nagrać i czym nie trzeba się stresować przed konsultacją.',
    image: '/branding/side-visuals/contact-writing-notebook.jpg',
    imageAlt: 'Notatnik i długopis — przygotowanie do rozmowy',
    magnet: getLeadMagnetBySlug('przygotowanie-do-konsultacji-online'),
  },
] as const).map((item) => {
  if (!item.magnet) {
    throw new Error('Missing lead magnet required by /niezbednik.')
  }

  return {
    label: item.label,
    price: item.price,
    title: item.title,
    description: item.description,
    image: item.image,
    imageAlt: item.imageAlt,
    href: `/bezplatne-materialy/${item.magnet.slug}`,
    cta: item.cta,
    meta: 'bezpłatny materiał',
  }
})

const books = [
  {
    title: 'The Other End of the Leash',
    author: 'Patricia McConnell',
    price: 'ok. 55 zł',
    cover: '/branding/books/other-end-of-the-leash.jpg',
    imageAlt: 'Okładka książki The Other End of the Leash',
    description:
      'Dobra książka o tym, jak różnie ludzie i psy odczytują te same sytuacje. Pomaga zejść z tonu „pies robi na złość”.',
    href: 'https://www.randomhousebooks.com/books/110768',
    linkLabel: 'Sprawdź książkę',
  },
  {
    title: 'The Power of Positive Dog Training',
    author: 'Pat Miller',
    price: 'ok. 60 zł',
    cover: '/branding/books/power-of-positive-dog-training.jpg',
    imageAlt: 'Okładka książki The Power of Positive Dog Training',
    description:
      'Dla opiekuna, który chce pracować spokojniej i konsekwentniej, bez przeskakiwania między losowymi poradami z internetu.',
    href: 'https://books.apple.com/us/book/the-power-of-positive-dog-training/id6757761816',
    linkLabel: 'Sprawdź książkę',
  },
  {
    title: "Don't Shoot the Dog!",
    author: 'Karen Pryor',
    price: 'ok. 45 zł',
    cover: '/branding/books/dont-shoot-the-dog.jpg',
    imageAlt: "Okładka książki Don't Shoot the Dog!",
    description:
      'Klasyka o uczeniu zachowań. Przydatna, jeśli chcesz lepiej rozumieć nagradzanie, kryteria i sens prostych ćwiczeń.',
    href: 'https://www.penguinrandomhouse.com/books/177702/dont-shoot-the-dog-by-karen-pryor/',
    linkLabel: 'Sprawdź książkę',
  },
  {
    title: 'Cat Sense',
    author: 'John Bradshaw',
    price: 'ok. 65 zł',
    cover: '/branding/books/cat-sense.jpg',
    imageAlt: 'Okładka książki Cat Sense',
    description:
      'Dobra pozycja do zrozumienia kocich potrzeb, stresu i tego, dlaczego „złośliwość” zwykle nie jest dobrym wyjaśnieniem.',
    href: 'https://www.penguinrandomhouse.com/books/222938/cat-sense-by-john-bradshaw/',
    linkLabel: 'Sprawdź książkę',
  },
] as const

const tools = [
  {
    title: 'Dobrze dopasowane szelki spacerowe',
    price: 'sprawdź cenę',
    image: '/branding/niezbednik/product-dog-harness.jpg',
    imageAlt: 'Prawdziwe szelki spacerowe dla psa',
    note: 'Przydatne, gdy pies ciągnie albo szybko się nakręca, a obroża tylko dokłada napięcia.',
    href: 'https://idcpower.julius-k9.com/en',
    linkLabel: 'Zobacz przykład',
  },
  {
    title: 'Długa linka 5-10 m',
    price: 'sprawdź cenę',
    image: '/branding/niezbednik/product-long-leash.jpg',
    imageAlt: 'Prawdziwe długie linki spacerowe dla psów',
    note: 'Daje psu więcej miejsca na węszenie i spokojne decyzje, bez puszczania go luzem w złym miejscu.',
    href: 'https://juliusk9.com/',
    linkLabel: 'Zobacz markę',
  },
  {
    title: 'Wysoki drapak dla kota',
    price: 'dobierz rozmiar',
    image: '/branding/niezbednik/product-cat-scratcher.jpg',
    imageAlt: 'Prawdziwy wysoki drapak dla kota',
    note: 'Ma sens, gdy kot drapie meble, szuka wysokości albo potrzebuje własnego miejsca w mieszkaniu.',
    href: '/koty',
    linkLabel: 'Wróć do strony kotów',
  },
  {
    title: 'Mata węchowa albo spokojna zabawka',
    price: 'sprawdź cenę',
    image: '/branding/niezbednik/product-dog-toy.jpg',
    imageAlt: 'Prawdziwa zabawka do spokojnej pracy psa',
    note: 'Dobre zajęcie na wyciszenie, nie kolejna nakręcająca zabawa na pełnych obrotach.',
    href: '/psy',
    linkLabel: 'Wróć do strony psów',
  },
  {
    title: 'Feromony jako dodatek, nie plan',
    price: 'sprawdź cenę',
    image: '/branding/niezbednik/product-diffuser.jpg',
    imageAlt: 'Prawdziwy domowy dyfuzor zapachowy',
    note: 'Czasem pomagają przy zmianach w domu i napięciu, ale nie zastępują diagnozy ani pracy z przyczyną problemu.',
    href: 'https://us.feliway.com/',
    linkLabel: 'Zobacz przykład',
  },
] as const

const allMaterialyGuides = listMaterialyGuides()
const materialyBundles = listMaterialyBundles()
const paidMaterialyCount = allMaterialyGuides.filter((g) => g.tier !== 'free').length

const featuredPdfs = [
  {
    label: 'PDF / pies',
    price: '29 zł',
    title: 'Trudny spacer',
    description: 'Dla psa, który ciągnie, szczeka na mijankach albo wraca ze spaceru bardziej nakręcony niż przed wyjściem.',
    meta: 'spacer, dystans, odpoczynek',
    image: '/branding/niezbednik/pdf-dog-walk.jpg',
    imageAlt: 'Pies na spacerze z opiekunem',
    href: '/materialy/pies-trudny-spacer',
    cta: 'Zobacz PDF',
  },
  {
    label: 'PDF / kot',
    price: '29 zł',
    title: 'Problem poza kuwetą',
    description: 'Gdy problem kuwetowy trwa, wraca falami albo łączy się z napięciem w domu.',
    meta: 'kuweta, zdrowie, dom',
    image: '/branding/niezbednik/pdf-cat-litter.jpg',
    imageAlt: 'Kuweta z czystym zwirkiem',
    href: '/materialy/kot-problem-poza-kuweta',
    cta: 'Zobacz PDF',
  },
  {
    label: 'PDF / pies',
    price: '29 zł',
    title: 'Pies zostaje sam',
    description: 'Pomaga odróżnić panikę separacyjną od frustracji, nudy i chaosu po wyjściu opiekuna.',
    meta: 'samotność, nagrania, plan',
    image: '/branding/niezbednik/pdf-dog-window.jpg',
    imageAlt: 'Pies patrzący przez okno',
    href: '/materialy/pies-zostaje-sam',
    cta: 'Zobacz PDF',
  },
  {
    label: 'PDF / szczeniak',
    price: '19 zł',
    title: 'Szczeniak gryzie i skacze',
    description: 'Na pierwsze tygodnie, kiedy gryzienie rąk, skakanie i emocje zaczynają rządzić domem.',
    meta: 'sen, granice, codzienność',
    image: '/branding/niezbednik/pdf-puppy.jpg',
    imageAlt: 'Szczeniak jako ilustracja materiału PDF',
    href: '/materialy/szczeniak-gryzie-i-skacze',
    cta: 'Zobacz PDF',
  },
  {
    label: 'PDF / kot',
    price: '19 zł',
    title: 'Konflikt między kotami',
    description: 'Dla domu, w którym nie ma wielkiej bójki, ale są blokady, napięcie i omijanie się kotów.',
    meta: 'zasoby, napięcie, sygnały',
    image: '/branding/niezbednik/pdf-cats-conflict.jpg',
    imageAlt: 'Dwa koty w konflikcie',
    href: '/materialy/konflikt-miedzy-kotami',
    cta: 'Zobacz PDF',
  },
  {
    label: 'PDF / kot',
    price: '29 zł',
    title: 'Kot broni się przy pielęgnacji',
    description: 'Dla opiekuna, który chce ogarniać czesanie, pazury albo transporter bez walki.',
    meta: 'dotyk, pazury, transporter',
    image: '/branding/niezbednik/pdf-cat-grooming.jpg',
    imageAlt: 'Kot podczas pielęgnacji',
    href: '/materialy/kot-broni-sie-przy-pielegnacji',
    cta: 'Zobacz PDF',
  },
] as const

const featuredBundles = [
  {
    label: 'Pakiet / kot',
    price: '49 zł',
    title: 'Pakiet kuwetowy',
    description: 'Dla sytuacji, w której sama checklista to za mało: kuweta, lęk kuwetowy i napięcie między kotami.',
    meta: '3 PDF-y razem',
    image: '/branding/niezbednik/bundle-litter.jpg',
    imageAlt: 'Kot przy pudełku i żwirku kuwetowym',
    href: '/materialy/pakiet/pakiet-kuweta',
    cta: 'Zobacz pakiet',
  },
  {
    label: 'Pakiet / pies',
    price: '49 zł',
    title: 'Pakiet trudny spacer',
    description: 'Dla psa, u którego spacer, smycz, mijanki i dzwonek szybko robią się jednym dużym problemem.',
    meta: 'spacer, smycz, goście',
    image: '/branding/topic-cards/french-bulldog-leash.jpg',
    imageAlt: 'Pies na smyczy podczas spaceru',
    href: '/materialy/pakiet/pakiet-trudny-pies',
    cta: 'Zobacz pakiet',
  },
  {
    label: 'Pakiet / szczeniak',
    price: '49 zł',
    title: 'Pakiet szczeniak',
    description: 'Pierwsze tygodnie bez przypadkowego utrwalania gryzienia, skakania i nakręcania na smyczy.',
    meta: 'start z młodym psem',
    image: '/branding/topic-cards/puppy-hands.jpg',
    imageAlt: 'Szczeniak trzymany w dłoniach opiekuna',
    href: '/materialy/pakiet/pakiet-szczeniak-start',
    cta: 'Zobacz pakiet',
  },
] as const

const entryShelves = [
  {
    id: 'polecane-starty',
    label: '3 materiały za 0 zł',
    title: 'Zacznij bez kupowania',
    description: 'Krótki materiał o spacerach, checklista kuwety i lista rzeczy przed konsultacją.',
    cta: 'Pokaż darmowe materiały',
  },
  {
    id: 'ksiazki',
    label: `${books.length} książki i ${tools.length} rzeczy`,
    title: 'Książki i sprzęt',
    description: 'Kilka rzeczy, które mają sens wtedy, gdy pasują do konkretnego problemu.',
    cta: 'Pokaż książki i sprzęt',
  },
  {
    id: 'pdfy-do-kupienia',
    label: `${paidMaterialyCount} PDF-ów i ${materialyBundles.length} pakietów`,
    title: 'Materiały do pobrania',
    description: 'PDF-y do konkretnych problemów i pakiety, gdy temat łączy kilka wątków.',
    cta: 'Pokaż PDF-y',
  },
] as const

const faqItems = [
  {
    question: 'Od czego zacząć?',
    answer:
      'Jeśli sprawa dotyczy spacerów, kuwety albo przygotowania do rozmowy, zacznij od darmowego materiału. Jeśli temat wraca od dawna, lepiej przejść od razu do PDF-a albo rozmowy.',
  },
  {
    question: 'Czy to zastępuje konsultację?',
    answer:
      'Nie zawsze. Materiał pomaga poukładać temat, ale nie zobaczy Twojego psa, kota, domu ani nagrania. Przy mieszanych sprawach rozmowa zwykle szybciej porządkuje decyzje.',
  },
  {
    question: 'Czy trzeba kupować sprzęt?',
    answer:
      'Nie. Sprzęt ma sens tylko wtedy, gdy pomaga w konkretnym planie. Sam zakup nie naprawia zachowania.',
  },
] as const

function EssentialsProductCard({ item, variant = 'photo' }: { item: EssentialsShopCard; variant?: 'photo' | 'book' }) {
  const isExternal = item.href.startsWith('http')
  const className = `essentials-shop-card${variant === 'book' ? ' essentials-shop-card-book' : ''}`
  const actionClassName = 'essentials-shop-link'

  const action = isExternal ? (
    <a href={item.href} target="_blank" rel="noreferrer noopener" className={actionClassName}>
      {item.cta}
    </a>
  ) : (
    <Link href={item.href} prefetch={false} className={actionClassName}>
      {item.cta}
    </Link>
  )

  return (
    <article className={className}>
      <div className="essentials-shop-media">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 26vw"
          className="essentials-shop-image"
          unoptimized
        />
        <span className="essentials-shop-badge">{item.label}</span>
      </div>
      <div className="essentials-shop-body">
        <div className="essentials-shop-topline">
          <span>{item.meta ?? item.label}</span>
          <strong>{item.price}</strong>
        </div>
        <h3>{item.title}</h3>
        {item.author ? <div className="essentials-shop-author">{item.author}</div> : null}
        <p>{item.description}</p>
      </div>
      <div className="essentials-shop-actions">{action}</div>
    </article>
  )
}

export default function EssentialsPage() {
  return (
    <NotatnikPageShell
      tag="Niezbędnik / materiały"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zł"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
      sideVisualVariant="materials"
    >
      <Breadcrumbs items={[{ name: 'Niezbędnik', url: '/niezbednik' }]} />
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Niezbędnik / materiały i rzeczy pomocnicze</div>
          <h1>
            Materiały i rzeczy, które pomagają <em>zrobić pierwszy sensowny krok.</em>
          </h1>
          <p>
            Nie wszystko trzeba kupować i nie każdy temat od razu wymaga pełnej konsultacji. Tu są darmowe
            materiały, PDF-y i kilka praktycznych rzeczy, które mają sens w konkretnych sytuacjach.
          </p>
          <div className="notatnik-subhero-actions">
            <Link href="#polecane-starty" prefetch={false} className="notatnik-btn">
              <span>Zacznij od darmowych materiałów</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href={quickHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Kwadrans / 69 zł</span>
            </Link>
          </div>
        </div>

        <div className="notatnik-subhero-media">
          <HeroIllustration slug="niezbednik" emojiPlaceholder="📚" className="w-full h-full min-h-[340px]" />
        </div>
      </section>

      <section id="katalog-materialow">
        <NotatnikSectionHead index="I." kicker="Od czego zacząć" title="Wybierz najprostszy następny krok." />
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
        <NotatnikSectionHead index="II." kicker="Darmowy start" title="Trzy materiały, które możesz pobrać od razu." />
        <div className="essentials-shop-grid">
          {leadMagnets.map((item) => (
            <EssentialsProductCard key={item.href} item={item} />
          ))}
        </div>
      </section>

      <section id="pdfy-do-kupienia" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead
          index="III."
          kicker="PDF-y i pakiety"
          title="PDF-y do konkretnych problemów."
        />
        <p style={{ maxWidth: '720px', color: 'var(--ink-quiet)' }}>
          Pojedynczy PDF jest dobry, gdy temat jest dość jasny. Pakiet ma sens, gdy problem rozlewa się
          na kilka codziennych sytuacji.
        </p>

        <div className="essentials-shop-subhead top-gap">
          <strong>Najczęściej wybierane</strong>
          <span>Najkrótsza droga do materiału, jeśli wiesz już, czego szukasz.</span>
        </div>
        <div className="essentials-shop-grid top-gap-small">
          {featuredPdfs.map((item) => (
            <EssentialsProductCard key={item.href} item={item} />
          ))}
        </div>

        <div className="essentials-shop-subhead top-gap">
          <strong>Pakiety</strong>
          <span>Dla tematów, które rzadko mieszczą się w jednym prostym PDF-ie.</span>
        </div>
        <div className="essentials-shop-grid top-gap-small">
          {featuredBundles.map((item) => (
            <EssentialsProductCard key={item.href} item={item} />
          ))}
        </div>

        <div className="notatnik-subhero-actions top-gap">
          <Link href="/materialy" prefetch={false} className="notatnik-btn">
            <span>Zobacz wszystkie PDF-y</span>
            <span className="notatnik-btn-arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
          <Link href="/materialy/pobranie" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
            <span>Mam kod do pobrania</span>
          </Link>
        </div>
      </section>

      <section id="rekomendacje">
        <NotatnikSectionHead index="IV." kicker="Książki i sprzęt" title="Kilka rzeczy, które mogą pomóc, ale nie zastąpią planu." />

        <div id="ksiazki">
          <div className="section-eyebrow">Książki</div>
          <div className="essentials-shop-grid top-gap-small">
            {books.map((book) => (
              <EssentialsProductCard
                key={book.title}
                variant="book"
                item={{
                  label: 'Książka',
                  price: book.price,
                  title: book.title,
                  author: book.author,
                  description: book.description,
                  image: book.cover,
                  imageAlt: book.imageAlt,
                  href: book.href,
                  cta: book.linkLabel,
                }}
              />
            ))}
          </div>
        </div>

        <div id="przybory" className="top-gap">
          <div className="section-eyebrow">Sprzęt</div>
          <div className="essentials-shop-grid top-gap-small">
            {tools.map((tool) => (
              <EssentialsProductCard
                key={tool.title}
                item={{
                  label: 'Sprzęt',
                  price: tool.price,
                  title: tool.title,
                  description: tool.note,
                  image: tool.image,
                  imageAlt: tool.imageAlt,
                  href: tool.href,
                  cta: tool.linkLabel,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="V." kicker="FAQ" title="Zanim coś kupisz albo pobierzesz." />
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
        title="Jeśli dalej nie wiesz, od czego zacząć, <em>weź Kwadrans.</em>"
        copy="W 15 minut łatwiej ustalić, czy wystarczy materiał, czy problem wymaga dokładniejszego planu."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zł"
        secondaryHref={consultationHref}
        secondaryLabel="Zobacz pełną konsultację"
      />
    </NotatnikPageShell>
  )
}
