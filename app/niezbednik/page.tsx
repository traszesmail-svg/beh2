import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { AccessoryShelfCard, BookShelfCard, ShopAnchorNav } from '@/components/ShopCatalog'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS, FUNNEL_SERVICE_CONFIG, getPublicServicePriceLabel } from '@/lib/funnel'
import { getBreadcrumbJsonLd, getItemListJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import type { ShopAccessoryCard, ShopBookCard } from '@/lib/shop-catalog'
import { FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbednik behawiorysty | akcesoria i narzedzia dla psow i kotow',
  path: '/niezbednik',
  description:
    'Wybrane przez behawioryste akcesoria i narzedzia dla psow i kotow: spacery, transport, enrichment i spokojniejsza codziennosc bez chaosu.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="editorial-section-head">
      <div className="editorial-section-head-copy">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p className="editorial-section-lead">{description}</p>
    </div>
  )
}

type ProblemHubCard = {
  eyebrow: string
  title: string
  problem: string
  bestStart: string
  affiliateHref: string
  affiliateLabel: string
  supportingHref: string
  supportingLabel: string
  serviceHref: string
  serviceLabel: string
}

const AMAZON_ASSOCIATE_TAG = 'resetglowy206-21'

function withAmazonAssociateTag(url: string) {
  const parsed = new URL(url)
  parsed.searchParams.set('tag', AMAZON_ASSOCIATE_TAG)
  return parsed.toString()
}

const AFFILIATE_LINKS = {
  AFFIL_LINK_8: withAmazonAssociateTag('https://www.amazon.pl/Petsafe-Easy-Walk-Uprz%C4%85%C5%BC-Czarny/dp/B00600YMDK/'),
  AFFIL_LINK_9: withAmazonAssociateTag('https://www.amazon.pl/Dont-Shoot-Dog-Teaching-Training/dp/1982106468/'),
  AFFIL_LINK_10: withAmazonAssociateTag(
    'https://www.amazon.pl/PetSafe-treningowe-wychowywania-odpowiednie-opakowanie/dp/B0057H1HZI/',
  ),
  AFFIL_LINK_11: withAmazonAssociateTag('https://www.amazon.pl/Company-Animals-Halti-Szkolenie-Czarny/dp/B004JZGOGQ/'),
  AFFIL_LINK_12: withAmazonAssociateTag(
    'https://www.amazon.pl/Toozey-Wodoszczelna-wytrzymala-karabi%C5%84czykiem-atmosferyczne/dp/B08MDXWFNK/',
  ),
  AFFIL_LINK_13: withAmazonAssociateTag('https://www.amazon.pl/Najpierw-wytresuj-kurczaka-Karen-Pryor/dp/8372781176/'),
  AFFIL_LINK_14: withAmazonAssociateTag(
    'https://www.amazon.pl/KONG-Klasyczna-naturalna-gonienia-pobierania/dp/B000AYN7LU/',
  ),
  AFFIL_LINK_15: withAmazonAssociateTag('https://www.amazon.pl/KONG-Wobler-interaktywna-dozowania-smakolyk%C3%B3w/dp/B003ALMW0M/'),
  AFFIL_LINK_16: withAmazonAssociateTag('https://www.amazon.pl/Chewies-Przysmaki-treningowe-ps%C3%B3w-Maxi/dp/B07VMNGRPL/'),
  AFFIL_LINK_17: withAmazonAssociateTag('https://www.amazon.pl/Trixie-Capri-XS-ciemnoszary-rumieniec/dp/B0DNFZRBPM/'),
  AFFIL_LINK_18: withAmazonAssociateTag('https://www.amazon.pl/TRIXIE-28645-le%C5%BCenia-transportera-Skudo/dp/B07N6KLQ9M/'),
  AFFIL_LINK_19: withAmazonAssociateTag(
    'https://www.amazon.pl/KYG-siedzenie-samochodowe-okienkiem-zarysowania/dp/B0B49NZNQ6/',
  ),
  AFFIL_LINK_20: withAmazonAssociateTag(
    'https://www.amazon.pl/PetSafe-Gentle-Leader-Obro%C5%BCa-ci%C4%85gni%C4%99cia/dp/B00074L4Y0/',
  ),
  AFFIL_LINK_21: withAmazonAssociateTag('https://www.amazon.pl/SYGNA%C5%81Y-USPOKAJAJ%C4%84CE-UNIKAJ%C4%84-dodruk-2016/dp/8375790672/'),
  AFFIL_LINK_22: withAmazonAssociateTag('https://www.amazon.pl/Other-End-Leash-What-Around/dp/034544678X/'),
  AFFIL_LINK_23: withAmazonAssociateTag('https://www.amazon.pl/Love-Dog-Understanding-Emotion-Friend/dp/0345477154/'),
} as const

const problemHubCards: ProblemHubCard[] = [
  {
    eyebrow: 'Pies | spacer i reakcje',
    title: 'Nie wiesz, czy temat zaczyna sie od reaktywnosci, pobudzenia czy samej trasy',
    problem: 'Dla psa, ktory szczeka, napina sie albo traci rownowage na spacerze.',
    bestStart: 'Najpierw uporzadkuj dystans, wyzwalacze i przewidywalnosc spaceru. Dopiero potem dokladaj kolejne rzeczy.',
    affiliateHref: AFFILIATE_LINKS.AFFIL_LINK_8,
    affiliateLabel: 'Kup na Amazon: oryginalne szelki Easy Walk',
    supportingHref: '/psy/reaktywnosc-na-smyczy',
    supportingLabel: 'Landing problemowy: reaktywnosc na smyczy',
    serviceHref: '/book?service=szybka-konsultacja-15-min',
    serviceLabel: 'Kwadrans, jesli chcesz ustalic kierunek',
  },
  {
    eyebrow: 'Pies | rozlaka i samotnosc',
    title: 'Temat wraca przy wychodzeniu z domu albo po zmianie rytmu dnia',
    problem: 'Dla psa, ktory zle znosi samotnosc, dlugo sie wycisza albo nie radzi sobie po rozstaniu.',
    bestStart: 'Najpierw buduj prosty, spokojny rytm i sensowne zajecie. Nie probuj rozwiazywac wszystkiego jednym gadzetem.',
    affiliateHref: AFFILIATE_LINKS.AFFIL_LINK_14,
    affiliateLabel: 'Kup na Amazon: KONG Classic',
    supportingHref: '/psy/lek-separacyjny',
    supportingLabel: 'Landing problemowy: lek separacyjny',
    serviceHref: '/book?service=konsultacja-behawioralna-online',
    serviceLabel: '60 min przy temacie szerszym lub utrwalonym',
  },
  {
    eyebrow: 'Kot | kuweta i napiecie',
    title: 'Nie wiesz, czy problem siedzi w kuwecie, srodowisku czy zmianie w domu',
    problem: 'Dla kota, ktory omija kuwete albo daje subtelne sygnaly stresu wokol toalety i domu.',
    bestStart: 'Najpierw uporzadkuj srodowisko i podstawy zdrowotne. Potem siegaj po szerszy kontekst i dobre zrodla.',
    affiliateHref: AFFILIATE_LINKS.AFFIL_LINK_17,
    affiliateLabel: 'Kup na Amazon: transporter Trixie Capri',
    supportingHref: '/koty/zalatwianie-poza-kuweta',
    supportingLabel: 'Landing problemowy: zalatwianie poza kuweta',
    serviceHref: '/book?service=szybka-konsultacja-15-min',
    serviceLabel: 'Kwadrans, jesli chcesz ustalic kolejnosc zmian',
  },
]

const expertBooks: ShopBookCard[] = [
  {
    slug: 'sygnaly-uspokajajace-turid-rugaas',
    speciesCategory: 'psy',
    title: 'Sygnaly uspokajajace. Jak psy unikaja konfliktow',
    author: 'Turid Rugaas',
    shortDescription:
      'Bardzo konkretna ksiazka o komunikacji, napieciu i wczesnym czytaniu sygnalow psa zanim sytuacja eskaluje.',
    image: '/images/book-covers/cat-cover-1.svg',
    imageAlt: 'Okladka ksiazki Sygnaly uspokajajace Turid Rugaas',
    amazonAffiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_21,
  },
  {
    slug: 'dont-shoot-the-dog-karen-pryor',
    speciesCategory: 'psy',
    title: "Don't Shoot the Dog: The Art of Teaching and Training",
    author: 'Karen Pryor',
    shortDescription:
      'Klasyczna ksiazka o treningu opartym na wzmocnieniach i o tym, jak porzadkowac nauke bez presji i chaosu.',
    image: '/images/book-covers/dog-cover-1.svg',
    imageAlt: "Okladka ksiazki Don't Shoot the Dog Karen Pryor",
    amazonAffiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_9,
  },
  {
    slug: 'najpierw-wytresuj-kurczaka-karen-pryor',
    speciesCategory: 'psy',
    title: 'Najpierw wytresuj kurczaka',
    author: 'Karen Pryor',
    shortDescription:
      'Polskie wydanie dobrze pokazujace logike klikeru, timing i budowanie zachowan krok po kroku.',
    image: '/images/book-covers/dog-cover-2.svg',
    imageAlt: 'Okladka ksiazki Najpierw wytresuj kurczaka Karen Pryor',
    amazonAffiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_13,
  },
  {
    slug: 'other-end-of-the-leash-patricia-mcconnell',
    speciesCategory: 'psy',
    title: 'The Other End of the Leash',
    author: 'Patricia McConnell',
    shortDescription:
      'Klasyczna pozycja o tym, jak ludzie i psy wzajemnie czytaja swoje zachowania oraz skad biora sie codzienne nieporozumienia.',
    image: '/images/book-covers/dog-cover-1.svg',
    imageAlt: 'Okladka ksiazki The Other End of the Leash Patricia McConnell',
    amazonAffiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_22,
  },
  {
    slug: 'for-the-love-of-a-dog-patricia-mcconnell',
    speciesCategory: 'psy',
    title: 'For the Love of a Dog',
    author: 'Patricia McConnell',
    shortDescription:
      'Dobra ksiazka, jesli chcesz lepiej rozumiec emocje psa i odroznic pobudzenie, stres oraz zwykle przeciazenie.',
    image: '/images/book-covers/dog-cover-2.svg',
    imageAlt: 'Okladka ksiazki For the Love of a Dog Patricia McConnell',
    amazonAffiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_23,
  },
]

const accessoryCards: ShopAccessoryCard[] = [
  {
    slug: 'easy-walk-petsafe',
    species: 'psy',
    title: 'PetSafe Easy Walk / Deluxe Easy Walk',
    summary: 'Oryginalne szelki front-clip do delikatnego ograniczania ciagniecia na smyczy. W PDF oznaczone jako naturalny bestseller afiliacyjny.',
    helpsWith: 'spacerami, ciagnieciem na smyczy i praca nad czytelniejszym ruchem bez ucisku tchawicy',
    usage: 'ma sens przy dobrze dopasowanych szelkach i rownoleglej pracy nad emocjami psa podczas spaceru',
    caution: 'to nie jest rozwiazanie samo w sobie; zle dopasowanie albo brak pracy nad emocjami ogranicza efekt',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_8,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'clik-r-trainer-petsafe',
    species: 'psy',
    title: 'Clik-R Trainer / kliker treningowy',
    summary: 'Klasyczny marker dzwiekowy z paskiem na palec. W PDF polecany jako prosty, tani start do treningu pozytywnego.',
    helpsWith: 'precyzyjnym oznaczaniem zachowan i porzadkowaniem nauki',
    usage: 'najlepiej dziala wtedy, gdy opiekun rozumie zasade markera i laczy go z dobra nagroda',
    caution: 'w PDF ta pozycja nie miala potwierdzenia obecnosci w publicznym indeksie Amazon.pl',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_10,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'halti-training-lead',
    species: 'psy',
    title: 'HALTI Training Lead',
    summary: 'Regulowana smycz treningowa o wielu konfiguracjach. W PDF polecana jako praktyczna do spaceru, treningu i kontroli bez szarpania.',
    helpsWith: 'chodzeniem na smyczy, przywolaniem i codzienna obsluga roznych scenariuszy spacerowych',
    usage: 'dobra jako jedna smycz do kilku zastosowan albo uzupelnienie pracy z szelkami',
    caution: 'w PDF ta pozycja nie miala potwierdzenia obecnosci w publicznym indeksie Amazon.pl',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_11,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'gentle-leader-obroza-uzdowa',
    species: 'psy',
    title: 'PetSafe Gentle Leader / obroza uzdowa',
    summary: 'Obroza uzdowa do pracy nad kontrola ruchu i ograniczaniem ciagniecia. Dobra jako dodatkowe narzedzie w wybranych przypadkach, nie jako rozwiazanie na skroty.',
    helpsWith: 'bezpieczniejszym prowadzeniem psa, ograniczeniem ciagniecia i odzyskaniem czytelniejszej kontroli na spacerze',
    usage: 'ma sens tylko przy spokojnym wprowadzeniu, dobrym dopasowaniu i rownoleglej pracy nad emocjami oraz skojarzeniami psa',
    caution: 'to narzedzie techniczne; nie kazdy pies je toleruje, a zbyt szybkie wdrozenie albo zle dopasowanie moze dokladac napiecia',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_20,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'dluga-linka-spacerowa',
    species: 'psy',
    title: 'Dluga linka spacerowa 5-10 m',
    summary: 'Przydatna przy pracy na dystansie, reaktywnosci i pierwszych etapach spaceru. To jedna z najbardziej praktycznych rzeczy, jesli pies potrzebuje wiecej swobody bez puszczania luzem.',
    helpsWith: 'dystansem, przywolaniem, pierwszymi etapami spaceru i ograniczeniem presji krotkiej smyczy',
    usage: 'szczegolnie ma sens tam, gdzie potrzebujesz wiecej kontroli i wiecej przestrzeni jednoczesnie',
    caution: 'zle prowadzona linka doklada chaosu i nie zastapi planu pracy ani nauki czytania psa',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_12,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'mata-antyposlizgowa-capri',
    species: 'mixed',
    title: 'Mata do lezenia do transportera TRIXIE',
    summary: 'Mata do transporterow TRIXIE poprawiajaca stabilnosc i komfort podczas podrozy. To praktyczne uzupelnienie, gdy zwierze slabo znosi sliskie podloze.',
    helpsWith: 'komfortem podrozy, ograniczeniem poslizgu i spokojniejszym transportem zwierzecia',
    usage: 'najlepiej jako uzupelnienie transportera u zwierzat wrazliwych na sliskie podloze',
    caution: 'dobierz rozmiar do konkretnego transportera; sama mata nie zastapi spokojnego wdrozenia i treningu podrozy',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_18,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'kong-classic',
    species: 'psy',
    title: 'KONG Classic',
    summary: 'Ikoniczna zabawka do wypelniania jedzeniem lub pasta. W PDF wskazana jako mocny evergreen do enrichmentu i pracy z nuda.',
    helpsWith: 'zajeciem, zuciem, wydluzaniem zabawy i spokojniejszym zostawaniem samemu',
    usage: 'najlepiej dziala jako regularny element planu, a nie przypadkowa zabawka wrzucana raz na jakis czas',
    caution: 'w PDF nie bylo potwierdzenia obecnosci w publicznym indeksie Amazon.pl',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_14,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'kong-wobbler',
    species: 'psy',
    title: 'KONG Wobbler',
    summary: 'Interaktywna zabawka-podajnik karmy i smakolykow. W PDF polecana szczegolnie przy szybkich posilkach i przewleklej nudzie.',
    helpsWith: 'stymulacja psychiczna, spowolnieniem jedzenia i bardziej angazujacym karmieniem',
    usage: 'szczegolnie sensowny dla psow, ktore jedza zbyt szybko albo potrzebuja wiecej pracy nosem i ruchem',
    caution: 'w PDF nie bylo potwierdzenia obecnosci w publicznym indeksie Amazon.pl',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_15,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'chewies-przysmaki-treningowe',
    species: 'psy',
    title: 'Chewies przysmaki treningowe Maxi 200 g',
    summary: 'Male, wygodne przysmaki treningowe. W PDF oznaczone jako potwierdzone w publicznym indeksie Amazon.pl i dobre do pracy z klikerem i szelkami.',
    helpsWith: 'powtorzeniami, nauka skupienia i codziennym nagradzaniem',
    usage: 'najlepiej jako mala nagroda treningowa przy pracy nad ruchem, uwaga i emocjami',
    caution: 'dbaj o wielkosc porcji i dopasowanie do wrazliwosci pokarmowej psa',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_16,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'trixie-capri-transporter',
    species: 'mixed',
    title: 'Transporter z gornym otwieraniem Trixie Capri',
    summary: 'Transporter z twarda konstrukcja do podrozy i wizyt. W PDF oznaczony jako potwierdzony w publicznym indeksie Amazon.pl.',
    helpsWith: 'spokojniejszym treningiem transportera, podrozami i wizytami weterynaryjnymi',
    usage: 'sensowny wtedy, gdy transporter ma byc uzywany regularnie, a nie tylko awaryjnie',
    caution: 'sam transporter nie wystarczy bez spokojnego wdrozenia i pracy nad skojarzeniami',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_17,
    cta: 'Zobacz na Amazonie',
  },
  {
    slug: 'kyg-mata-do-samochodu',
    species: 'psy',
    title: 'KYG koc / mata ochronna do samochodu',
    summary: 'Mata samochodowa z oslona boczna i antyposlizgiem. W PDF oznaczona jako potwierdzona w publicznym indeksie Amazon.pl.',
    helpsWith: 'komfortem podrozy, bezpieczenstwem psa i ochrona tapicerki',
    usage: 'ma sens przy regularnych przejazdach autem i pracy nad spokojniejszym wsiadaniem oraz jazda',
    caution: 'nie zastapi bezpiecznego przypiecia psa ani treningu samej podrozy',
    affiliateUrl: AFFILIATE_LINKS.AFFIL_LINK_19,
    cta: 'Zobacz na Amazonie',
  },
]

const quickAudioService = FUNNEL_SERVICE_CONFIG['szybka-konsultacja-15-min']
const fullConsultationService = FUNNEL_SERVICE_CONFIG['konsultacja-behawioralna-online']
const faqItems = FAQ_SHORTLISTS.toolkit

export default function EssentialsPage() {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
  const cennikHref = '/cennik'
  const messageHref = '/kontakt#formularz'
  const dogHref = '/psy'
  const catHref = '/koty'

  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Niezbednik', path: '/niezbednik' },
    ]),
    getItemListJsonLd(
      [
        { name: 'Szybki start', url: new URL('/niezbednik#quick-start', getCanonicalBaseUrl()).toString() },
        { name: 'Polecane starty', url: new URL('/niezbednik#polecane-starty', getCanonicalBaseUrl()).toString() },
        { name: 'Ksiazki', url: new URL('/niezbednik#ksiazki', getCanonicalBaseUrl()).toString() },
        { name: 'Przybory', url: new URL('/niezbednik#przybory', getCanonicalBaseUrl()).toString() },
        { name: 'Dalszy krok', url: new URL('/niezbednik#kontakt', getCanonicalBaseUrl()).toString() },
      ],
    ),
  ]

  return (
    <main className="page-wrap editorial-home-page premium-home-page materials-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell pdf-path-hero-shell" id="start">
          <div className="editorial-hero-grid pdf-path-hero-grid">
            <div className="editorial-hero-copy materials-hero-copy pdf-path-hero-copy">
              <div className="section-eyebrow">Niezbednik</div>
              <h1>Niezbednik do spokojnej pracy z psem lub kotem</h1>
              <p className="editorial-hero-lead materials-hero-lead">
                Znajdziesz tu wybrane narzedzia i praktyczne akcesoria z linkami Amazon do sytuacji, ktore warto uporzadkowac
                bez chaosu. Jesli potrzebujesz pomocy w wyborze, zacznij od Kwadransu z behawiorysta.
              </p>
              <p className="editorial-hero-lead materials-hero-lead">
                Jako uczestnik Programu Partnerskiego Amazon zarabiam na kwalifikujacych sie zakupach.
              </p>

              <div className="hero-actions editorial-hero-actions materials-hero-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href="#quick-start" prefetch={false} className="button button-ghost big-button">
                  Zobacz od czego zaczac
                </Link>
              </div>

              <div className="editorial-hero-trust-row" aria-label="Zakres Niezbednika">
              <span className="editorial-hero-trust-item">szybki start</span>
              <span className="editorial-hero-trust-item">polecane starty</span>
              <span className="editorial-hero-trust-item">ksiazki</span>
              <span className="editorial-hero-trust-item">akcesoria</span>
            </div>
            </div>

            <aside className="editorial-hero-visual" aria-label="Wersja afiliacyjna">
              <div className="materials-preview-card materials-preview-card-wide tree-backed-card">
                <strong>Wersja afiliacyjna</strong>
                <p>Wlasne PDF-y i pakiety nie sa publikowane. Zostaja tylko pozycje z bezposrednia karta produktu na Amazonie.</p>
              </div>
              <div className="editorial-hero-note">
                <span className="editorial-hero-note-label">Jawny zakres</span>
                <strong>To nie jest juz polka z Twoimi PDF-ami. To uporzadkowany zestaw zewnetrznych rekomendacji i narzedzi.</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="quick-start">
          <SectionIntro
            eyebrow="Szybki start"
            title="Od czego zaczac"
            description="Najprosciej wybrac jedna sciezke: jedna rekomendacje z Amazonu, Kwadrans z behawiorysta albo pelna konsultacje przy sprawie szerszej."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card materials-decision-card materials-decision-card-primary">
              <div className="section-eyebrow">Jedna sytuacja</div>
              <h3>Wybierz jedna rekomendacje</h3>
              <p>To dobry start, gdy chcesz uporzadkowac jedna sytuacje i nie budowac sobie od razu zbyt szerokiej listy zakupow.</p>
              <div className="hero-actions top-gap-small">
                <Link href="#polecane-starty" prefetch={false} className="button button-primary">
                  Zobacz polecane starty
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Wybor formy</div>
              <h3>Porownaj Kwadrans i konsultacje 60 min</h3>
              <p>Kwadrans pomaga ustalic kierunek. Konsultacja 60 min daje wiecej czasu na temat zlozony, dluzszy albo wielowatkowy.</p>
              <div className="hero-actions top-gap-small">
                <Link href={cennikHref} prefetch={false} className="button button-ghost">
                  Zobacz cennik
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Pies lub kot</div>
              <h3>Wejdz od strony gatunku</h3>
              <p>Jesli latwiej zaczac od problemow psa albo kota, przejdz do odpowiedniej strony i wroc tu po rekomendacje lub dalszy krok.</p>
              <div className="hero-actions top-gap-small">
                <Link href={dogHref} prefetch={false} className="button button-ghost">
                  Psy
                </Link>
                <Link href={catHref} prefetch={false} className="button button-ghost">
                  Koty
                </Link>
              </div>
            </article>
          </div>

          <ShopAnchorNav
            className="shop-anchor-nav-compact"
            items={[
              { href: '#sciezki-problemowe', label: 'Sciezki problemowe' },
              { href: '#polecane-starty', label: 'Polecane starty' },
              { href: '#ksiazki', label: 'Ksiazki' },
              { href: '#przybory', label: 'Przybory' },
              { href: '#faq', label: 'FAQ' },
              { href: '#kontakt', label: 'Dalszy krok' },
            ]}
          />
        </section>

        <section className="panel section-panel editorial-section" id="sciezki-problemowe">
          <SectionIntro
            eyebrow="Wejscie od sytuacji"
            title="Najpierw wybierz problem, dopiero potem format"
            description="Ta warstwa ma skrocic droge: od objawu i codziennosci do wlasciwej rekomendacji, landingu problemowego albo rozmowy."
          />

          <div className="card-grid two-up">
            {problemHubCards.map((card, index) => (
              <article
                key={card.title}
                className={`summary-card tree-backed-card materials-decision-card${index === 0 ? ' materials-decision-card-primary' : ''}`}
              >
                <div className="section-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.problem}</p>
                <p>{card.bestStart}</p>
                <div className="hero-actions top-gap-small">
                  <a href={card.affiliateHref} target="_blank" rel="sponsored noopener noreferrer" className="button button-primary">
                    {card.affiliateLabel}
                  </a>
                </div>
                <div className="stack-gap-small">
                  <Link href={card.supportingHref} prefetch={false} className="prep-inline-link">
                    {card.supportingLabel}
                  </Link>
                  <Link href={card.serviceHref} prefetch={false} className="prep-inline-link">
                    {card.serviceLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="list-card accent-outline tree-backed-card top-gap">
            <strong>To ma dzialac jak hub problemow, nie katalog wszystkiego.</strong>
            <span>
              Jesli widzisz swoja sytuacje tylko czesciowo, wejdz najpierw w landing problemowy albo jedna rekomendacje. Jesli obraz jest mieszany,
              temat wraca mimo prob albo nie chcesz zgadywac, przejdz od razu do Kwadransu albo konsultacji 60 min.
            </span>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="polecane-starty">
          <SectionIntro
            eyebrow="Polecane starty"
            title="Tu najlepiej zaczac"
            description="Wlasne PDF-y nie sa gotowe do publikacji, wiec ta sekcja prowadzi teraz przez wybrane akcesoria i narzedzia z Amazonu."
          />

          <div className="list-card accent-outline tree-backed-card">
            <strong>Nota afiliacyjna</strong>
            <span>Jako uczestnik Programu Partnerskiego Amazon zarabiam na kwalifikujacych sie zakupach.</span>
          </div>

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card materials-decision-card materials-decision-card-primary">
              <div className="section-eyebrow">Spacery i kontrola</div>
              <h3>Narzedzia do codziennej pracy</h3>
              <p>To dobry wybor, gdy chcesz zaczac od jednej rzeczy, ktora realnie porzadkuje spacer, transport albo prosty enrichment.</p>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Narzedzia</div>
              <h3>Rzeczy, ktore wspieraja plan pracy</h3>
              <p>To dodatki pomocnicze. Maja sens tylko wtedy, gdy wspieraja konkretna sytuacje, a nie zastepuja planu.</p>
            </article>

            <article className="summary-card tree-backed-card materials-decision-card">
              <div className="section-eyebrow">Jawne oznaczenie</div>
              <h3>Linki zewnetrzne do Amazonu</h3>
              <p>Ta sekcja ma charakter afiliacyjny. Linki prowadza poza serwis i sa oznaczone jako zewnetrzne.</p>
            </article>
          </div>

          <div className="editorial-section-head top-gap">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wybrane teraz</div>
              <h2>Start od jednej rekomendacji</h2>
            </div>
            <p className="editorial-section-lead">To dobry wybor, jesli chcesz zaczac od jednego kierunku i od razu zobaczyc sensowne pozycje z Amazonu.</p>
          </div>

          <div className="offer-grid top-gap-small">
            {expertBooks.slice(0, 1).map((book) => (
              <BookShelfCard key={book.slug} book={book} ctaLabel="Zobacz na Amazonie" />
            ))}
            {[accessoryCards[0], accessoryCards[3], accessoryCards[7]].map((accessory) => (
              <AccessoryShelfCard key={accessory.slug} accessory={accessory} />
            ))}
          </div>

          <div className="pdf-path-section-footer top-gap">
            <div className="pdf-path-section-footer-copy">
              <strong>Nie musisz wybierac kilku rzeczy naraz.</strong>
              <span>Najpierw jedna rekomendacja. Jesli nadal nie wiesz, co bedzie najlepszym pierwszym ruchem, wybierz Kwadrans z behawiorysta.</span>
            </div>

            <div className="hero-actions">
              <Link href={audioHref} prefetch={false} className="button button-primary">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={consultationHref} prefetch={false} className="button button-ghost">
                {FUNNEL_CTA_LABELS.consultation}
              </Link>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="ksiazki">
          <SectionIntro
            eyebrow="Ksiazki"
            title="Wybrane ksiazki, ktore realnie sa na Amazon.pl"
            description="Przywrocilem tylko te pozycje, dla ktorych jest konkretna karta produktu Amazon, bez linkow do samego wyszukiwania."
          />

          <div className="premium-two-column-grid materials-books-grid">
            <div className="stack-gap">
              <div className="list-card accent-outline tree-backed-card">
                <strong>Malo, ale konkretnie</strong>
                <span>Ta sekcja nie udaje juz pelnej biblioteki. Zostaja tylko ksiazki, ktore maja potwierdzony bezposredni link Amazon.</span>
              </div>

              <div className="shop-books-rail shop-books-rail-tight">
                {expertBooks.map((book) => (
                  <BookShelfCard key={book.slug} book={book} ctaLabel="Zobacz na Amazonie" />
                ))}
              </div>
            </div>

            <div className="stack-gap">
              <div className="list-card tree-backed-card">
                <strong>Kiedy maja sens</strong>
                <span>Gdy chcesz lepiej zrozumiec logike treningu, timing nagrody i ukladanie zachowan bez zgadywania.</span>
              </div>

              <div className="list-card tree-backed-card">
                <strong>Uwaga afiliacyjna</strong>
                <span>Linki w tej sekcji prowadza do Amazonu i maja charakter afiliacyjny. Jako uczestnik Programu Partnerskiego Amazon zarabiam na kwalifikujacych sie zakupach.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przybory">
          <SectionIntro
            eyebrow="Przybory i narzedzia"
            title="Przybory, ktore moga wspierac plan pracy"
            description="To dodatki pomocnicze. Maja sens tylko wtedy, gdy naprawde wspieraja konkretna sytuacje i sposob pracy ze zwierzeciem."
          />

          <div className="list-card accent-outline tree-backed-card">
            <strong>Najpierw problem, potem narzedzie</strong>
            <span>Nie trzeba kupowac wszystkiego. Lepiej wybrac jedna rzecz, ktora rzeczywiscie pomaga w domu, na spacerze albo w codziennej rutynie.</span>
          </div>

          <div className="offer-grid top-gap">
            {accessoryCards.map((accessory) => (
              <AccessoryShelfCard key={accessory.slug} accessory={accessory} />
            ))}
          </div>

          <div className="pdf-path-section-footer top-gap">
            <div className="pdf-path-section-footer-copy">
              <strong>Jesli nie masz pewnosci, nie zgaduj.</strong>
              <span>Kwadrans z behawiorysta albo krotka wiadomosc pomagaja ustalic, czy narzedzie w ogole bedzie potrzebne.</span>
            </div>

            <div className="hero-actions">
              <Link href={audioHref} prefetch={false} className="button button-primary">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={messageHref} prefetch={false} className="button button-ghost">
                {FUNNEL_CTA_LABELS.contact}
              </Link>
            </div>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Jak korzystac z huba"
          title="Kilka waznych granic Niezbednika"
          description="To ma porzadkowac decyzje, a nie dokladac kolejnych losowych wyborow."
          items={TRUST_SIGNAL_SETS.toolkit}
        />

        <EditorialFaqSection
          id="faq"
          title="Najczestsze pytania przed wyborem rekomendacji albo rozmowy"
          description="Tu zostaja najwazniejsze odpowiedzi, jesli nadal wahasz sie miedzy narzedziem, rekomendacja z Amazonu, Kwadransem i konsultacja 60 min."
          items={faqItems}
        />

        <section className="panel section-panel editorial-section" id="kontakt">
          <SectionIntro
            eyebrow="Dalszy krok"
            title="Jesli rekomendacja nie wystarczy, wybierz kolejny krok"
            description="Najczesciej wystarczy Kwadrans z behawiorysta. Przy sprawach szerszych lepsza bedzie konsultacja 60 min, a przy krotkim doprecyzowaniu wiadomosc."
          />

          <div className="card-grid three-up">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Najczestszy wybor</div>
              <h3>Kwadrans z behawiorysta</h3>
              <p>Najprostszy start, gdy chcesz ustalic kierunek i nie wybierac w ciemno.</p>
              <div className="editorial-hero-meta" aria-label="Parametry Kwadransu z behawiorysta">
                <span>{quickAudioService.durationMinutes} min</span>
                <span>{getPublicServicePriceLabel('szybka-konsultacja-15-min')}</span>
                <span>bez kamery</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Szerszy temat</div>
              <h3>{fullConsultationService.title}</h3>
              <p>Lepsza przy sprawach zlozonych, dluzszych albo wielowatkowych, kiedy potrzebujesz wiecej czasu na analize i plan.</p>
              <div className="editorial-hero-meta" aria-label="Parametry konsultacji 60 min">
                <span>{fullConsultationService.durationMinutes} min</span>
                <span>{getPublicServicePriceLabel('konsultacja-behawioralna-online')}</span>
                <span>szersza analiza</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={consultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Pomocniczo</div>
              <h3>{FUNNEL_CTA_LABELS.contact}</h3>
              <p>Jesli chcesz najpierw krotko opisac sytuacje albo dopytac o wlasciwa rekomendacje, wystarczy kilka zdan.</p>
              <div className="editorial-hero-meta" aria-label="Co opisac w wiadomosci">
                <span>gatunek</span>
                <span>temat</span>
                <span>krotki opis</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={messageHref} prefetch={false} className="button button-ghost">
                  Napisz wiadomosc
                </Link>
              </div>
            </article>
          </div>

          <p className="muted top-gap-small">
            Jesli wolisz wejsc od strony gatunku, zobacz strone{' '}
            <Link href={dogHref} prefetch={false} className="inline-link">
              psa
            </Link>{' '}
            albo{' '}
            <Link href={catHref} prefetch={false} className="inline-link">
              kota
            </Link>
            . Jesli chcesz tylko porownac ceny i formaty, sprawdz{' '}
            <Link href={cennikHref} prefetch={false} className="inline-link">
              cennik
            </Link>
            .
          </p>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/niezbednik"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={consultationHref}
          secondaryLabel={FUNNEL_CTA_LABELS.consultation}
        />
      </div>
    </main>
  )
}
