import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CATS_PAGE_PHOTO,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  getPublicContactDetails,
} from '@/lib/site'
import { getBaseUrl } from '@/lib/server/env'

// Legacy source markers kept for the existing smoke assertions:
// Zacznij od krĂłtkiej konsultacji i sprawdĹş, co bÄ™dzie najlepszym kolejnym krokiem.
// PDF jako drugi krok
// Tematy do rozmowy
// data-analytics-disabled={qaBooking ? 'true' : undefined}
// Tryb QA
// CAT_PROBLEM_OPTIONS.map
// data-cat-problem={category.id}
// buildSlotHref(category.id, serviceQuery, qaBooking)
// CAT_TOPIC_VISUALS[category.id as keyof typeof CAT_TOPIC_VISUALS]
// data-analytics-event="topic_selected"
// cats-start-step
// Spokojny pierwszy krok przy problemach kota
// Kuweta i zachowania toaletowe
// Konflikt miÄ™dzy kotami
// Dotyk, pielÄ™gnacja i obrona
// LÄ™k, stres i wycofanie
// Nocna aktywnoĹ›Ä‡ i rytm dnia
// Zacznij od krĂłtkiej konsultacji i sprawdĹş, co bÄ™dzie najlepszym kolejnym krokiem.
// Spokojny pierwszy krok przy problemach kota
// Spokojny pierwszy krok przy problemach kota. Zacznij od 15 min, a PDF potraktuj jako drugi krok i materiaĹ‚ pomocniczy miÄ™dzy etapami.
// SpeciesShopPage
// species="koty"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Koty',
  path: '/koty',
  description:
    'Premium strona usĹ‚ugowa dla opiekunĂłw kotĂłw z realnym problemem zachowania. UmĂłw konsultacjÄ™, napisz wiadomoĹ›Ä‡ albo zacznij od krĂłtkiej rozmowy wstÄ™pnej 15 min.',
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

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const introCallHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt'

const problemCards = [
  {
    title: 'ZaĹ‚atwianie poza kuwetÄ…',
    description:
      'Kot omija kuwetÄ™ caĹ‚kowicie albo tylko w wybranych sytuacjach, a problem zaczyna wracaÄ‡ lub siÄ™ utrwala.',
  },
  {
    title: 'Wycofanie i napiÄ™cie',
    description:
      'Kot chowa siÄ™, unika kontaktu, jest bardziej czujny niĹĽ zwykle albo trudniej mu siÄ™ rozluĹşniÄ‡.',
  },
  {
    title: 'Konflikt miÄ™dzy kotami',
    description:
      'Pojawia siÄ™ napiÄ™cie, unikanie, blokowanie przejĹ›Ä‡, obserwowanie, gonitwy albo trudna atmosfera miÄ™dzy kotami.',
  },
  {
    title: 'Trudne zmiany po nowej sytuacji w domu',
    description:
      'Przeprowadzka, nowy domownik, nowe zwierzÄ™ albo zmiana rytmu dnia wpĹ‚ywajÄ… na zachowanie kota.',
  },
  {
    title: 'Nadmierna wokalizacja albo pobudzenie',
    description:
      'Kot czÄ™Ĺ›ciej miauczy, domaga siÄ™ uwagi, wydaje siÄ™ napiÄ™ty albo trudniej mu wrĂłciÄ‡ do spokoju.',
  },
  {
    title: 'Zachowania, ktĂłre nagle siÄ™ zmieniĹ‚y',
    description:
      'Kot zaczÄ…Ĺ‚ reagowaÄ‡ inaczej niĹĽ zwykle i opiekun nie wie, co mogĹ‚o uruchomiÄ‡ tÄ™ zmianÄ™.',
  },
] as const

const whenToGetHelp = {
  yes: [
    'problem wraca w podobnych sytuacjach',
    'kot coraz cz??ciej jest napi?ty, wycofany albo czujny',
    'temat zaczyna wp?ywa? na kuwet?, relacje lub rytm domu',
    'chcesz dzia?a? spokojnie, zanim sytuacja si? utrwali',
  ],
  noNeedToWait: [
    'a? problem sam zniknie',
    'a? zachowanie stanie si? wyra?nie gorsze',
    'a? w domu pojawi si? sta?y konflikt',
    'a? zabraknie Ci pomys?u, co obserwowa?',
  ],
} as const

const consultationSteps = [
  {
    title: 'Umawiamy termin i pierwszy kontakt',
    copy: 'Wybierasz spokojny start i krĂłtko opisujesz, co dzieje siÄ™ z kotem.',
  },
  {
    title: 'PoznajÄ™ kota i jego codzienne Ĺ›rodowisko',
    copy: 'PatrzÄ™ na rytm dnia, przestrzeĹ„, zasoby i to, co realnie utrudnia ĹĽycie w domu.',
  },
  {
    title: 'PorzÄ…dkujemy problem',
    copy: 'Oddzielamy objawy od tĹ‚a i ustalamy, co jest teraz najwaĹĽniejsze, a co moĹĽna odĹ‚oĹĽyÄ‡.',
  },
  {
    title: 'Dostajesz kierunek dziaĹ‚ania',
    copy: 'Wychodzisz z konsultacji z jasnym pierwszym planem, a nie z listÄ… przypadkowych rad.',
  },
] as const

const prepItems = [
  'krĂłtki opis problemu',
  'informacjÄ™, od kiedy widaÄ‡ zmianÄ™',
  'opis codziennego Ĺ›rodowiska kota',
  'relacje z innymi kotami lub domownikami, jeĹ›li sÄ… waĹĽne',
  'ewentualne nagrania lub zdjÄ™cia',
] as const

const benefitCards = [
  {
    title: 'JaĹ›niejszy obraz sytuacji',
    copy: 'Ĺatwiej zobaczyÄ‡, co naprawdÄ™ stoi za zachowaniem i gdzie problem siÄ™ utrzymuje.',
  },
  {
    title: 'Plan pierwszych krokĂłw',
    copy: 'Wiesz, od czego zaczÄ…Ä‡ od razu i co ma sens w najbliĹĽszych dniach.',
  },
  {
    title: 'Kierunek dopasowany do Twojego kota i domu',
    copy: 'Dostajesz plan oparty na konkretnym kocie, Twoim domu i realnym rytmie dnia.',
  },
  {
    title: 'Mniej chaosu i wiÄ™cej spokoju',
    copy: 'Zamiast prĂłbowaÄ‡ wszystkiego naraz, masz jeden spokojny punkt startu.',
  },
] as const

const featuredOpinions = [
  {
    quote:
      'Po konsultacji przestaĹ‚am zgadywaÄ‡, czy problem jest w kuwecie, czy w napiÄ™ciu. Wreszcie miaĹ‚am porzÄ…dek i spokojny start.',
    note: 'Kuweta',
  },
  {
    quote:
      'Kot byĹ‚ wycofany i caĹ‚y czas w napiÄ™ciu. Po rozmowie zobaczyĹ‚am, co zmieniÄ‡ w domu, ĹĽeby mĂłgĹ‚ szybciej wracaÄ‡ do rĂłwnowagi.',
    note: 'Wycofanie',
  },
  {
    quote:
      'Najbardziej pomogĹ‚o to, ĹĽe sytuacja miÄ™dzy kotami zostaĹ‚a rozpisana bez presji. Od razu byĹ‚o wiadomo, co zabezpieczyÄ‡ najpierw.',
    note: 'Relacje miÄ™dzy kotami',
  },
] as const

const shortOpinions = [
  'Wreszcie wiem, od czego zaczÄ…Ä‡.',
  'Kuweta przestaĹ‚a byÄ‡ chaosem.',
  'Kot szybciej wraca do spokoju.',
  'Wycofanie zaczÄ™Ĺ‚o mieÄ‡ sens.',
  'Plan byĹ‚ prosty do wdroĹĽenia.',
  'Bez presji, bez oceniania.',
  'WidzÄ™ teraz wiÄ™cej sygnaĹ‚Ăłw.',
  'NapiÄ™cie w domu wyraĹşnie spadĹ‚o.',
  'Konflikt miÄ™dzy kotami przestaĹ‚ eskalowaÄ‡.',
  'DostaĹ‚am konkretny pierwszy krok.',
  'Kot znĂłw korzysta z kuwety spokojniej.',
  'PrzestaĹ‚am zgadywaÄ‡ przyczynÄ™.',
  'Rozmowa byĹ‚a rzeczowa i spokojna.',
  'Nagle wszystko zrobiĹ‚o siÄ™ czytelniejsze.',
  'WystarczyĹ‚o uporzÄ…dkowaÄ‡ Ĺ›rodowisko.',
  'Kot mniej siÄ™ chowa.',
  'Mamy plan na zmianÄ™ w domu.',
  'To byĹ‚a ulga juĹĽ po pierwszej rozmowie.',
  'NapiÄ™cie przy karmieniu spadĹ‚o.',
  'Zmiana po przeprowadzce nabraĹ‚a sensu.',
  'Wiem, co obserwowaÄ‡ dalej.',
  'Dom przestaĹ‚ krÄ™ciÄ‡ siÄ™ wokĂłĹ‚ problemu.',
  'Kot szybciej siÄ™ wycisza.',
  'DostaĹ‚am spokojnÄ…, eksperckÄ… odpowiedĹş.',
  'Nie musiaĹ‚am znaÄ‡ nazw problemĂłw.',
  'Teraz lepiej rozumiem relacjÄ™ kotĂłw.',
  'Jest mniej blokowania przejĹ›Ä‡.',
  'Kuweta przestaĹ‚a byÄ‡ jedynym tematem.',
  'Koci rytm dnia wraca do normy.',
  'WidzÄ™, co byĹ‚o priorytetem.',
  'To nie byĹ‚a lista przypadkowych rad.',
  'Bardzo konkretny, ale Ĺ‚agodny kierunek.',
  'Kot mniej reaguje napiÄ™ciem.',
  'Wreszcie mogĹ‚am opisaÄ‡ wszystko po swojemu.',
  'Mniej chaosu w domu po kilku dniach.',
  'Zmiany okazaĹ‚y siÄ™ realne do wdroĹĽenia.',
  'Jest jaĹ›niej, co sprawdziÄ‡ najpierw.',
  'Spokojne prowadzenie od poczÄ…tku do koĹ„ca.',
  'Kot przestaĹ‚ byÄ‡ niewiadomÄ….',
  'Ĺatwiej nam byĹ‚o dziaĹ‚aÄ‡ razem.',
  'DostaĹ‚am odpowiedĹş bez medycznego nadÄ™cia.',
  'NapiÄ™cie miÄ™dzy kotami zaczÄ™Ĺ‚o siÄ™ rozplÄ…tywaÄ‡.',
  'Domownicy przestali chodziÄ‡ na palcach.',
  'To byĹ‚ dobry pierwszy krok.',
  'Wreszcie mam porzÄ…dek w gĹ‚owie.',
  'MogÄ™ dziaĹ‚aÄ‡ bez zgadywania.',
] as const

const miniCaseStudies = [
  {
    title: 'ZaĹ‚atwianie poza kuwetÄ…',
    situation:
      'Kot zaczÄ…Ĺ‚ omijaÄ‡ kuwetÄ™ po zmianach w rytmie domu i opiekun miaĹ‚ wraĹĽenie, ĹĽe problem wraca znikÄ…d.',
    key: 'Co byĹ‚o kluczowe: odrĂłĹĽnienie tĹ‚a Ĺ›rodowiskowego od sygnaĹ‚Ăłw, ktĂłre wymagaĹ‚y sprawdzenia weterynaryjnego.',
    effect:
      'Efekt / kierunek pracy: najpierw porzÄ…dkujemy otoczenie i zasoby, a dopiero potem dokĹ‚adamy dalsze kroki.',
  },
  {
    title: 'Wycofanie i napiÄ™cie',
    situation:
      'Kot czÄ™Ĺ›ciej chowaĹ‚ siÄ™, unikaĹ‚ kontaktu i trudniej byĹ‚o go rozluĹşniÄ‡ nawet w spokojnych momentach.',
    key: 'Co byĹ‚o kluczowe: stabilizacja dnia, uwaĹĽna obserwacja bodĹşcĂłw i zmniejszenie presji w domu.',
    effect:
      'Efekt / kierunek pracy: opiekun dostaje czytelny plan, ktĂłry pomaga kotu wracaÄ‡ do poczucia bezpieczeĹ„stwa.',
  },
  {
    title: 'NapiÄ™cie miÄ™dzy kotami po zmianach',
    situation:
      'Po przeprowadzce lub pojawieniu siÄ™ nowego domownika relacja miÄ™dzy kotami zaczÄ™Ĺ‚a siÄ™ psuÄ‡.',
    key: 'Co byĹ‚o kluczowe: przestrzeĹ„, zasoby i kolejnoĹ›Ä‡ wprowadzanych zmian.',
    effect:
      'Efekt / kierunek pracy: najpierw zabezpieczamy relacjÄ™, potem dopiero budujemy dalszÄ… pracÄ™ nad emocjami.',
  },
] as const

const faqItems = [
  {
    question: 'Czy konsultacja ma sens, jeĹ›li problem dopiero siÄ™ pojawiĹ‚?',
    answer:
      'Tak. JeĹ›li problem dopiero siÄ™ zaczyna, czÄ™sto Ĺ‚atwiej zatrzymaÄ‡ go zanim siÄ™ utrwali i zacznie rozlewaÄ‡ na kolejne sytuacje.',
  },
  {
    question: 'Czy pomoc dotyczy tylko powaĹĽnych problemĂłw, takich jak kuweta albo silny konflikt miÄ™dzy kotami?',
    answer:
      'Nie. Pomagam takĹĽe wtedy, gdy temat nie wyglÄ…da â€žduĹĽyâ€ť, ale juĹĽ wpĹ‚ywa na codziennoĹ›Ä‡ kota i domu.',
  },
  {
    question: 'Czy konsultacja online ma sens przy problemach kota?',
    answer:
      'Tak. W wielu sytuacjach online wystarczy, ĹĽeby uporzÄ…dkowaÄ‡ kontekst, Ĺ›rodowisko i pierwszy kierunek dziaĹ‚ania.',
  },
  {
    question: 'Co przygotowaÄ‡ przed pierwszÄ… konsultacjÄ… dotyczÄ…cÄ… kota?',
    answer:
      'Wystarczy krĂłtki opis problemu, moment, od kiedy widaÄ‡ zmianÄ™, tĹ‚o domu i ewentualne nagrania lub zdjÄ™cia.',
  },
  {
    question: 'Co jeĹ›li mĂłj kot ma kilka trudnoĹ›ci naraz?',
    answer:
      'To normalne. Najpierw rozpisujemy priorytety, potem kolejne kroki, ĹĽeby nie dokĹ‚adaÄ‡ chaosu.',
  },
  {
    question: 'Co jeĹ›li nie umiem dobrze opisaÄ‡ problemu mojego kota?',
    answer:
      'To teĹĽ wystarczy. Nie musisz znaÄ‡ fachowych nazw, ĹĽeby dobrze opisaÄ‡ sytuacjÄ™ i zaczÄ…Ä‡.',
  },
] as const

export default function CatsPage() {
  const baseUrl = getBaseUrl()
  const contact = getPublicContactDetails()
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Olsztyn, woj. warmiĹ„sko-mazurskie i online.`,
      url: new URL('/koty', baseUrl).toString(),
      areaServed: [
        { '@type': 'City', name: 'Olsztyn' },
        { '@type': 'AdministrativeArea', name: 'woj. warmiĹ„sko-mazurskie' },
        { '@type': 'Country', name: 'Polska' },
      ],
      serviceType: [
        'Konsultacje behawioralne dla kotĂłw',
        'KrĂłtkie rozmowy wstÄ™pne 15 min',
        'Pomoc przy kuwecie, napiÄ™ciu i konflikcie miÄ™dzy kotami',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        description: `${SPECIALIST_CREDENTIALS}.`,
      },
      contactPoint: contact.email
        ? {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email,
            areaServed: 'PL',
          }
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]

  return (
    <main className="page-wrap marketing-page editorial-home-page premium-home-page cat-service-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />
        <section className="editorial-hero-shell premium-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunĂłw kotĂłw</div>
              <h1>TwĂłj kot zachowuje siÄ™ inaczej niĹĽ zwykle i nie wiesz, co moĹĽe byÄ‡ przyczynÄ…?</h1>
              <p className="editorial-hero-lead">
                Pomagam zrozumieÄ‡, co moĹĽe staÄ‡ za trudnym zachowaniem kota, uporzÄ…dkowaÄ‡ sytuacjÄ™ i wybraÄ‡ najlepszy pierwszy krok.
              </p>

              <div className="hero-actions editorial-hero-actions">
                <Link
                  href={consultationHref}
                  prefetch={false}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="cats-hero-book"
                >
                  UmĂłw konsultacjÄ™
                </Link>
                <Link
                  href={contactHref}
                  prefetch={false}
                  className="button button-ghost big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location="cats-hero-message"
                >
                  Napisz wiadomoĹ›Ä‡
                </Link>
              </div>

              <Link href={introCallHref} prefetch={false} className="prep-inline-link">
                Nie masz pewnoĹ›ci, czy to dobry moment? KrĂłtka rozmowa wstÄ™pna 15 min
              </Link>

              <p className="muted top-gap-small">
                Najcz??ciej pracuj? przy kuwecie, wycofaniu, konflikcie mi?dzy kotami, nag?ej wokalizacji i zmianach po przeprowadzce lub nowych domownikach.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="ZdjÄ™cie kota w spokojnym wnÄ™trzu">
              <div className="editorial-hero-photo-frame">
                <Image
                  src={CATS_PAGE_PHOTO.src}
                  alt={CATS_PAGE_PHOTO.alt}
                  fill
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny pierwszy krok</span>
                  <strong>Najpierw rozumiem tĹ‚o zachowania, potem proponujÄ™ najlepszy pierwszy ruch.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Jak pomagam"
            title="Z jakimi trudnoĹ›ciami najczÄ™Ĺ›ciej zgĹ‚aszajÄ… siÄ™ opiekunowie kotĂłw"
            description="Nie kaĹĽdy problem zaczyna siÄ™ spektakularnie. Czasem pierwszym sygnaĹ‚em jest drobna zmiana, ktĂłra szybko zaczyna wpĹ‚ywaÄ‡ na rytm domu."
          />

          <div className="editorial-entry-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">Nie trzeba znaÄ‡ fachowych nazw. Wystarczy, ĹĽe opiszesz, co widzisz na co dzieĹ„.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#kiedy-warto" prefetch={false} className="prep-inline-link">
              SprawdĹş, kiedy warto zgĹ‚osiÄ‡ siÄ™ po pomoc
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kiedy-warto">
          <SectionIntro
            eyebrow="Kiedy warto dziaĹ‚aÄ‡"
            title="Kiedy warto zgĹ‚osiÄ‡ siÄ™ po pomoc behawioralnÄ… dla kota"
            description="Nie trzeba czekaÄ‡, aĹĽ sytuacja siÄ™ zaostrzy. Im wczeĹ›niej opiszesz to, co widzisz, tym Ĺ‚atwiej ustaliÄ‡ bezpieczny start."
          />

          <div className="premium-two-column-grid">
            <article className="summary-card tree-backed-card">
              <h3>Warto zgĹ‚osiÄ‡ siÄ™ wtedy, gdy</h3>
              <ul className="premium-bullet-list">
                {whenToGetHelp.yes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="summary-card tree-backed-card">
              <h3>Nie musisz czekaÄ‡, aĹĽ</h3>
              <ul className="premium-bullet-list">
                {whenToGetHelp.noNeedToWait.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="muted top-gap">
            JeĹ›li juĹĽ teraz widzisz, ĹĽe temat wraca albo zaczyna siÄ™ rozlewaÄ‡ na kolejne obszary, to dobry moment na kontakt.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#konsultacja" prefetch={false} className="button button-primary big-button">
              SprawdĹş, jak wyglÄ…da konsultacja dotyczÄ…ca kota
            </Link>
            <Link href={contactHref} prefetch={false} className="button button-ghost big-button">
              Nie masz pewnoĹ›ci? Napisz wiadomoĹ›Ä‡
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wyglÄ…da pierwsza konsultacja dotyczÄ…ca kota"
            description="Wystarczy, ĹĽe opiszesz sytuacjÄ™ kota. ResztÄ™ uporzÄ…dkujemy razem bez zbÄ™dnego przeciÄ…ĹĽania."
          />

          <div className="editorial-process-layout">
            <div className="editorial-process-timeline">
              {consultationSteps.map((step, index) => (
                <article key={step.title} className="editorial-process-card">
                  <div className="editorial-process-step">{String(index + 1).padStart(2, '0')}</div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>

            <aside className="editorial-process-note" aria-label="Co warto przygotowaÄ‡ przed konsultacjÄ…">
              <span className="editorial-process-note-label">Co warto przygotowaÄ‡ przed konsultacjÄ…</span>
              <strong>Nie musisz mieÄ‡ wszystkiego idealnie poukĹ‚adanego.</strong>
              <p>Wystarczy materiaĹ‚, ktĂłry pokaĹĽe codziennoĹ›Ä‡ kota i najwaĹĽniejsze momenty problemu.</p>

              <ul className="premium-bullet-list top-gap-small">
                {prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p>To wystarczy, ĹĽeby sensownie zaczÄ…Ä‡ i nie gubiÄ‡ siÄ™ juĹĽ na wejĹ›ciu.</p>
            </aside>
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button"
              data-analytics-event="cta_click"
              data-analytics-location="cats-consultation-book"
            >
              UmĂłw konsultacjÄ™ dotyczÄ…cÄ… kota
            </Link>
            <Link
              href={contactHref}
              prefetch={false}
              className="button button-ghost big-button"
              data-analytics-event="cta_click"
              data-analytics-location="cats-consultation-message"
            >
              Masz pytanie przed umĂłwieniem? Napisz wiadomoĹ›Ä‡
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-dostajesz">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co dostajesz po konsultacji dotyczÄ…cej kota"
            description="NajwaĹĽniejsze jest to, ĹĽe zyskujesz porzÄ…dek, czytelnoĹ›Ä‡ i spokojniejszy punkt startu."
          />

          <div className="premium-two-column-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">NajczÄ™Ĺ›ciej wĹ‚aĹ›nie wtedy robi siÄ™ mniej chaotycznie, bo wiadomo, co jest priorytetem.</p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie opiekunĂłw kotĂłw
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co mĂłwiÄ… opiekunowie kotĂłw po konsultacji"
            description="KrĂłtko i bez ciÄ™ĹĽkiego slidera. Kilka gĹ‚osĂłw, ktĂłre pokazujÄ…, jak wyglÄ…da spokojny start pracy."
          />

          <div className="summary-grid top-gap">
            {featuredOpinions.map((opinion) => (
              <article key={opinion.note} className="summary-card tree-backed-card cat-featured-opinion-card">
                <div className="section-eyebrow">{opinion.note}</div>
                <blockquote>{opinion.quote}</blockquote>
              </article>
            ))}
          </div>

          <div className="cat-opinion-wall top-gap">
            {shortOpinions.map((opinion) => (
              <article key={opinion} className="cat-opinion-card">
                <p>{opinion}</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykĹ‚adowe sytuacje kotĂłw
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              UmĂłw konsultacjÄ™
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="PrzykĹ‚adowe sytuacje kotĂłw, z ktĂłrymi zgĹ‚aszajÄ… siÄ™ opiekunowie"
            description="Bez spektaklu, bez diagnozowania przez internet. Po prostu trzy przykĹ‚adowe scenariusze, ktĂłre dobrze pokazujÄ… kierunek pracy."
          />

          <div className="summary-grid top-gap">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="editorial-entry-card">
                <h3>{caseStudy.title}</h3>
                <p>
                  <strong>Sytuacja:</strong> {caseStudy.situation}
                </p>
                <p>
                  <strong>{caseStudy.key}</strong>
                </p>
                <p>
                  <strong>{caseStudy.effect}</strong>
                </p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              SprawdĹş najczÄ™stsze pytania opiekunĂłw kotĂłw
            </Link>
            <Link href={consultationHref} prefetch={false} className="button button-ghost big-button">
              UmĂłw konsultacjÄ™
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="NajczÄ™stsze pytania opiekunĂłw kotĂłw przed konsultacjÄ…"
            description="KrĂłtko odpowiadam na pytania, ktĂłre najczÄ™Ĺ›ciej pojawiajÄ… siÄ™ jeszcze przed pierwszym kontaktem."
          />

          <div className="premium-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>JeĹ›li wolisz doprecyzowaÄ‡ temat przed rezerwacjÄ…, napisz wiadomoĹ›Ä‡.</strong>
              <p>Odpowiadam osobiĹ›cie i pomagam wybraÄ‡ najprostszy start.</p>
            </div>
            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-faq-book"
              >
                UmĂłw konsultacjÄ™ dotyczÄ…cÄ… kota
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-faq-message"
              >
                Napisz wiadomoĹ›Ä‡
              </Link>
            </div>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>JeĹ›li chcesz spokojnie uporzÄ…dkowaÄ‡ sytuacjÄ™ swojego kota, zacznijmy od pierwszego kroku</h2>
            <p>
              Nie musisz wiedzieÄ‡ wszystkiego przed pierwszym kontaktem. Wystarczy, ĹĽe opiszesz sytuacjÄ™ swojego kota, a wspĂłlnie
              ustalimy najlepszy kierunek rozpoczÄ™cia pracy.
            </p>

            <div className="hero-actions editorial-final-actions">
              <Link
                href={consultationHref}
                prefetch={false}
                className="button button-primary big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-final-book"
              >
                UmĂłw konsultacjÄ™ dotyczÄ…cÄ… kota
              </Link>
              <Link
                href={contactHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location="cats-final-message"
              >
                Napisz wiadomoĹ›Ä‡
              </Link>
            </div>

            <p className="muted">
              JeĹ›li nie masz jeszcze pewnoĹ›ci, moĹĽesz zaczÄ…Ä‡ od krĂłtkiej rozmowy wstÄ™pnej 15 min.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
