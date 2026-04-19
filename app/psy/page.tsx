import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { HeroAudioSoftCta } from '@/components/HeroAudioSoftCta'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { OfferEntrySection } from '@/components/OfferEntrySection'
import { buildBookHref } from '@/lib/booking-routing'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { getPublicContactDetails, SITE_NAME, SITE_TAGLINE, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pomoc behawioralna dla psów',
  path: '/psy',
  description:
    'Konsultacje behawioralne dla opiekunów psów. Pomoc przy spacerach, reaktywności, rozłące, pobudzeniu i trudnych zachowaniach w domu.',
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

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
const contactHref = '/kontakt?species=pies#formularz'
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const reactiveGuide = (() => {
  const guide = getLeadMagnetBySlug('pies-reaktywnosc-5-krokow')

  if (!guide) {
    throw new Error('Missing lead magnet: pies-reaktywnosc-5-krokow')
  }

  return guide
})()

const problemCards = [
  {
    title: 'Spacery pełne napięcia',
    description: 'Już samo wyjście podnosi napięcie, a zwykły spacer szybko zamienia się w ciągnięcie, zamieranie albo trudne mijanki.',
    href: '/psy/reaktywnosc-na-smyczy',
  },
  {
    title: 'Reaktywność i silne emocje',
    description: 'Szczekanie, wyrywanie się i gwałtowne reakcje na psy, ludzi, rowery lub inne bodźce, z którymi pies sobie dziś nie radzi.',
    href: '/psy/reaktywnosc-na-smyczy',
  },
  {
    title: 'Trudność z zostawaniem samemu',
    description: 'Po wyjściu opiekuna pojawia się niepokój, wokalizacja, niszczenie albo długie dochodzenie do równowagi po powrocie.',
    href: '/psy/lek-separacyjny',
  },
  {
    title: 'Pobudzenie i brak wyciszenia',
    description: 'Pies łatwo się nakręca, trudno mu odpocząć i wrócić do równowagi nawet po zwykłych sytuacjach dnia.',
  },
  {
    title: 'Trudne zachowania w domu',
    description: 'Szczekanie, skakanie, pilnowanie zasobów albo napięcie wobec gości i domowników zaczynają regularnie wracać.',
  },
  {
    title: 'Zmiana, po której coś się posypało',
    description: 'Przeprowadzka, nowy domownik albo zmiana rytmu dnia sprawiają, że codzienność nagle staje się trudniejsza.',
  },
] as const

const whenToGetHelp = {
  yes: [
    'ta sama trudność wraca regularnie i zabiera spokój Tobie albo psu',
    'spacery robią się coraz bardziej napięte albo coraz trudniejsze do przewidzenia',
    'psu trudno się wyciszyć, odpocząć albo zostać samemu',
    'napięcie w domu wraca w podobnych sytuacjach',
    'kolejne rady mnożą próby, ale nie porządkują tematu',
    'po zmianie w domu, planie dnia albo otoczeniu coś wyraźnie się posypało',
  ],
  noNeedToWait: [
    'widzisz pierwsze sygnały i chcesz zatrzymać problem, zanim się utrwali',
    'temat wraca mimo dobrych chęci i kolejnych prób',
    'potrzebujesz spokojnego planu startu zamiast zgadywania',
    'chcesz wiedzieć, od czego naprawdę zacząć już teraz',
    'zależy Ci na kierunku dopasowanym do psa i Waszego domu',
    'nie chcesz dokładać presji sobie ani psu',
  ],
} as const

const consultationSteps = [
  {
    title: 'Umawiasz termin i krótko opisujesz sytuację',
    copy: 'Wybierasz dogodny termin i w kilku zdaniach opisujesz, co dziś najbardziej obciąża Waszą codzienność.',
  },
  {
    title: 'Patrzę szerzej: na psa, dom i rytm dnia',
    copy: 'Bierzemy pod uwagę emocje psa, wyzwalacze, codzienny rytm i to, co dzieje się wokół problemu.',
  },
  {
    title: 'Porządkujemy priorytety',
    copy: 'Oddzielamy objawy od tła i ustalamy, od czego warto zacząć, żeby nie robić wszystkiego naraz.',
  },
  {
    title: 'Dostajesz realny plan pierwszych kroków',
    copy: 'Po konsultacji wiesz, co wdrożyć najpierw, co obserwować i jak zacząć spokojnie, ale konkretnie.',
  },
] as const

const prepItems = [
  'krótki opis tego, co dzieje się na co dzień',
  '2-3 konkretne sytuacje, które najbardziej Cię martwią',
  'informacje o rytmie dnia psa',
  'krótkie nagrania, jeśli masz je pod ręką',
  'ostatnie zmiany w domu albo otoczeniu',
] as const

const benefitCards = [
  {
    eyebrow: 'Czytelność',
    title: 'Jaśniejszy obraz sytuacji',
    copy: 'Lepiej widzisz, co naprawdę napędza zachowanie i które elementy dziś najmocniej wpływają na Waszą codzienność.',
  },
  {
    eyebrow: 'Pierwszy plan',
    title: 'Plan pierwszych kroków',
    copy: 'Dostajesz pierwszy plan: co wdrożyć od razu, co obserwować i czego na razie nie dokładać.',
  },
  {
    eyebrow: 'Dopasowanie',
    title: 'Kierunek dopasowany do Twojego psa',
    copy: 'Kierunek pracy uwzględnia emocje psa, jego możliwości oraz realia Waszego domu.',
  },
  {
    eyebrow: 'Więcej spokoju',
    title: 'Więcej spokoju i mniej chaosu',
    copy: 'Zamiast improwizować masz spokojniejszy punkt oparcia, mniej chaosu i większą pewność kolejnych decyzji.',
  },
] as const

const featuredOpinions = [
  {
    label: 'Spacery',
    context: 'Reaktywność i napięcie na spacerach',
    quote:
      'Po konsultacji przestałam zmieniać plan co kilka dni. Wreszcie wiedziałam, kiedy zwiększyć dystans, na co patrzeć i jak prowadzić spacer, żeby nie dokładać psu napięcia.',
    signature: 'Opiekunka psa reagującego na psy i ludzi',
    note: 'spokojniejsze spacery, mniej improwizacji',
  },
  {
    label: 'Dom',
    context: 'Pobudzenie i trudne zachowania w domu',
    quote:
      'Największą zmianę dało uporządkowanie dnia i odpuszczenie robienia wszystkiego naraz. Pies szybciej wracał do wyciszenia, a w domu zrobiło się ciszej i bardziej przewidywalnie.',
    signature: 'Opiekunka psa, któremu trudno było się wyciszyć',
    note: 'więcej przewidywalności w domu',
  },
  {
    label: 'Styl pracy',
    context: 'Spokojna rozmowa bez presji',
    quote:
      'To była spokojna, bardzo konkretna rozmowa. Bez oceniania i bez straszenia. Wyszłam z prostym planem, poczuciem ulgi i jasnością, co robić dalej.',
    signature: 'Po pierwszej konsultacji',
    note: 'konkret bez oceniania i presji',
  },
] as const

const shortOpinions = [
  {
    label: 'Spacery',
    copy: 'Wreszcie wiedziałam, od czego zacząć bez dokładania psu napięcia.',
  },
  {
    label: 'Zostawanie samemu',
    copy: 'Dostałam spokojny plan startu zamiast kolejnych przypadkowych prób.',
  },
  {
    label: 'Po konsultacji',
    copy: 'Po rozmowie wszystko zrobiło się prostsze, spokojniejsze i bardziej poukładane.',
  },
] as const

const miniCaseStudies = [
  {
    eyebrow: 'Spacer',
    title: 'Pies napięty na spacerach',
    situation:
      'Spacer zaczynał się napięciem jeszcze przed wyjściem. Po drodze pies szybko wchodził w silne emocje, a po powrocie długo nie potrafił odpuścić.',
    key:
      'Najpierw skróciliśmy najbardziej obciążające trasy, zwiększyliśmy dystans od wyzwalaczy i uspokoiliśmy sam rytuał wyjścia.',
    effect: 'Opiekun dostał czytelny plan spokojniejszych spacerów, a pies więcej przestrzeni do regulacji i odpoczynku.',
  },
  {
    eyebrow: 'Rozłąka',
    title: 'Pies, który nie radzi sobie z zostawaniem samemu',
    situation:
      'Po wyjściu opiekuna pojawiało się szczekanie, wycie i długie napięcie, nawet jeśli na pierwszy rzut oka pies wydawał się spokojny.',
    key:
      'Kluczowe było sprawdzenie rytuału wyjścia, poziomu trudności i tego, czy problem wynika z lęku, przeciążenia czy frustracji.',
    effect: 'Opiekun wiedział, od jakiego poziomu zacząć i jak nie dokładać psu presji już na pierwszym etapie pracy.',
  },
  {
    eyebrow: 'Zmiana',
    title: 'Pies, który rozsypał się po zmianach',
    situation:
      'Po przeprowadzce albo zmianie rytmu dnia pies stał się bardziej czujny, trudniej odpoczywał i szybciej reagował napięciem na codzienne sytuacje.',
    key: 'Najpierw ustabilizowaliśmy otoczenie, dostęp do zasobów i przewidywalność dnia.',
    effect: 'Kiedy wróciło poczucie bezpieczeństwa, łatwiej było planować dalszą pracę nad wyciszeniem i reakcjami.',
  },
] as const

const faqItems = FAQ_SHORTLISTS.dogs

export default function DogsPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Online dla opiekunów psów z całej Polski.`,
      url: new URL('/psy', baseUrl).toString(),
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      serviceType: [
        'Konsultacje behawioralne dla psów',
        'Pomoc przy spacerach, reaktywności i rozłące',
        'Spokojny plan pierwszych kroków po konsultacji',
      ],
      provider: {
        '@type': 'Person',
        name: SPECIALIST_NAME,
        jobTitle: 'Behawiorysta COAPE',
        image: new URL('/branding/specialist-krzysztof-portrait.jpg', baseUrl).toString(),
        description: `${SPECIALIST_CREDENTIALS}.`,
      },
      contactPoint: contact.email
        ? {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email,
            areaServed: [{ '@type': 'Country', name: 'Polska' }],
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
    <main className="page-wrap editorial-home-page premium-home-page dog-service-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />
        <OfferEntrySection
          species="pies"
          sectionId="start"
          eyebrow="Oferta dla psa"
          title="Kwadrans z behawiorystą jest najprostszym startem dla psa."
          description="Jeśli temat jest szerszy, wybierz konsultację online 60 min. Jeśli chcesz tylko doprecyzować sprawę, napisz krótką wiadomość."
        />

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunów psów</div>
              <h1>Pomoc dla opiekunów psów</h1>
              <p className="editorial-hero-lead">
                Pracuję z opiekunami psów, którzy widzą, że coś nie działa i szukają konkretnej pomocy, nie kolejnych ogólnych porad.
              </p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="dogs-hero-audio"
                secondaryLocation="dogs-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions"
                noteClassName="dog-hero-cta-note"
              />

              <HeroAudioSoftCta
                href={audioHref}
                analyticsLocation="dogs-hero-audio"
                className="dog-hero-soft-cta"
                title="Nie wiesz jeszcze, od czego zacząć z problemem psa?"
                copy="Kwadrans z behawiorystą wystarczy, żeby spokojnie opisać sytuację, ustalić priorytet i ocenić, czy potrzebujesz czegoś więcej."
              />

              <p className="contact-support-copy">
                Reaktywność, lęk separacyjny, pobudzenie i trudne zachowania w domu wyglądają podobnie u wielu psów, ale przyczyny bywają różne.
                To decyduje o tym, co ma sens zrobić.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie psa w spokojnym, domowym kontekście">
              <div className="editorial-hero-photo-frame">
                <Image
                  src="/branding/case-dog-home.jpg"
                  alt="Spokojny pies w domowym kadrze"
                  width={1200}
                  height={900}
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny pierwszy krok</span>
                  <strong>Najpierw rozumiemy, co napędza problem. Potem układamy plan dopasowany do psa, domu i codzienności.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Typowe trudności"
            title="Z jakimi trudnościami najczęściej zgłaszają się opiekunowie psów"
            description="Często nie chodzi o jeden duży problem, tylko o kilka sygnałów, które z czasem zabierają coraz więcej spokoju i porządku w codzienności."
          />

          <div className="editorial-entry-grid dog-problem-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card dog-problem-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {'href' in card ? (
                  <Link href={card.href} prefetch={false} className="prep-inline-link">
                    Zobacz stronę problemową
                  </Link>
                ) : null}
              </article>
            ))}
          </div>

          <p className="muted top-gap">
            To zwykle nie jest jeden objaw, tylko cały układ napięć, który zaczyna wpływać na spacery, dom i Waszą relację z psem.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#kiedy-warto" prefetch={false} className="prep-inline-link">
              Sprawdź, kiedy warto zgłosić się po pomoc
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="kiedy-warto">
          <SectionIntro
            eyebrow="Kiedy działać"
            title="Kiedy warto zgłosić się po pomoc behawioralną dla psa"
            description="Nie trzeba czekać, aż problem zrobi się bardzo duży. Wystarczy, że regularnie wpływa na Waszą codzienność albo odbiera spokój Tobie i psu."
          />

          <div className="premium-two-column-grid dog-comparison-grid">
            <article className="summary-card tree-backed-card dog-compare-card">
              <div className="section-eyebrow">Sygnały z codzienności</div>
              <h3>Warto zgłosić się wtedy, gdy</h3>
              <p>
                Nie chodzi o dramatyczny kryzys. Wystarczy, że temat wraca, obciąża Waszą codzienność albo zaczyna przechodzić na
                kolejne sytuacje.
              </p>
              <ul className="premium-bullet-list">
                {whenToGetHelp.yes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="summary-card tree-backed-card dog-compare-card dog-compare-card-accent">
              <div className="section-eyebrow">Dobry moment na pierwszy krok</div>
              <h3>Nie trzeba czekać, aż będzie bardzo źle</h3>
              <p>
                Wcześniejszy kontakt często daje więcej spokoju, bo pozwala zatrzymać problem zanim się utrwali i zacznie obejmować
                kolejne obszary codzienności.
              </p>
              <ul className="premium-bullet-list">
                {whenToGetHelp.noNeedToWait.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="muted top-gap">
            Jeśli widzisz, że temat wraca albo zajmuje coraz więcej miejsca w codzienności, to zwykle jest dobry moment na spokojny
            kontakt.
          </p>

          <FunnelPrimaryActions
            audioHref={audioHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="dogs-when-audio"
            secondaryLocation="dogs-when-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wygląda pierwsza konsultacja dotycząca psa"
            description="Wystarczy krótko opisać sytuację psa. Resztę porządkujemy razem spokojnie, konkretnie i bez potrzeby idealnego opisu już w pierwszej wiadomości."
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

            <aside className="editorial-process-note dog-process-note" aria-label="Co przygotować przed konsultacją">
              <span className="editorial-process-note-label">Co warto przygotować</span>
              <strong>Nie musisz mieć wszystkiego idealnie poukładanego przed rozmową.</strong>
              <p>Wystarczy kilka konkretów z codzienności. To daje dobry, spokojny start bez przeciążania psa ani siebie.</p>

              <ul className="premium-bullet-list top-gap-small">
                {prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="dog-process-soft-note">
                Jeśli czegoś nie masz pod ręką, doprecyzujemy to spokojnie podczas konsultacji. Nie trzeba przygotowywać wszystkiego
                perfekcyjnie.
              </p>
            </aside>
          </div>

          <FunnelPrimaryActions
            audioHref={audioHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="dogs-consultation-audio"
            secondaryLocation="dogs-consultation-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="material-startowy">
          <SectionIntro
            eyebrow="Lżejszy start"
            title="Jeśli temat dotyczy spacerów albo reaktywności, możesz najpierw pobrać krótki materiał"
            description="To materiał, który pomaga uporządkować temat przed rozmową albo między kolejnymi krokami. Jeśli chcesz od razu odnieść sytuację do swojego psa, wybierz Kwadrans z behawiorystą."
          />

          <div className="premium-two-column-grid top-gap-small">
            <LeadMagnetSignup magnet={reactiveGuide} location="dogs-page" sourcePage="/psy" />

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kiedy warto</div>
              <h3>{reactiveGuide.shortTitle}</h3>
              <p>Ten materiał pomaga wtedy, gdy chcesz przed rozmową zobaczyć, od czego nie zaczynać i które elementy spaceru albo napięcia uporządkować najpierw.</p>
              <ul className="premium-bullet-list">
                {reactiveGuide.bullets.slice(0, 3).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <p className="muted">Jeśli po przeczytaniu widzisz, że temat jest szerszy niż jeden spacer czy jedno zachowanie, przejdź do Kwadransu z behawiorystą.</p>
            </article>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-dostajesz">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co dostajesz po konsultacji dotyczącej psa"
            description="Po rozmowie sytuacja staje się czytelniejsza, a Ty wiesz, od czego spokojnie zacząć, bez kolejnych przypadkowych prób."
          />

          <div className="premium-two-column-grid dog-benefits-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card dog-benefit-card">
                <div className="section-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">
            Najczęściej to moment, w którym codzienność staje się spokojniejsza, bo nie trzeba już zgadywać kolejnych ruchów ani
            testować wszystkiego naraz.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie opiekunów psów
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co mówią opiekunowie psów po konsultacji"
            description="Najczęściej wraca jedno: większy porządek, mniej zgadywania i spokojniejszy pierwszy plan działania od razu po rozmowie."
          />

          <div className="home-opinion-featured-grid dog-opinion-featured-grid top-gap">
            {featuredOpinions.map((opinion, index) => (
              <article key={opinion.label} className="home-quote-card dog-quote-card">
                <div className="home-quote-head dog-quote-head">
                  <div className="dog-quote-topline">
                    <span className="home-quote-label">{opinion.label}</span>
                    <span className="dog-quote-order">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="home-quote-context">{opinion.context}</span>
                </div>
                <blockquote className="home-quote-text">„{opinion.quote}”</blockquote>
                <div className="home-quote-footer dog-quote-footer">
                  <span className="home-quote-person">{opinion.signature}</span>
                  <span className="home-quote-note">{opinion.note}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="dog-opinion-micro-intro">
            <span>Krótsze głosy po pierwszych konsultacjach</span>
            <p>To krótkie zdania, które najczęściej wracają wtedy, gdy pierwszy plan jest już poukładany i w codzienności robi się trochę lżej.</p>
          </div>

          <div className="home-opinion-micro-grid dog-opinion-micro-grid top-gap-small">
            {shortOpinions.map((opinion) => (
              <article key={opinion.copy} className="summary-card tree-backed-card home-opinion-micro-card dog-opinion-micro-card">
                <div className="home-opinion-micro-label">{opinion.label}</div>
                <p>„{opinion.copy}”</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykładowe sytuacje psów
            </Link>
          </div>

          <FunnelPrimaryActions
            audioHref={audioHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="dogs-opinions-audio"
            secondaryLocation="dogs-opinions-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje psów, z którymi zgłaszają się opiekunowie"
            description="Trzy krótkie scenariusze pokazują, jak zwykle zaczyna się spokojne uporządkowanie tematu."
          />

          <div className="summary-grid dog-case-grid top-gap">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card home-mini-case-card dog-case-card">
                <div className="section-eyebrow">{caseStudy.eyebrow}</div>
                <h3>{caseStudy.title}</h3>

                <div className="home-case-mini-lines">
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Sytuacja</span>
                    <p>{caseStudy.situation}</p>
                  </div>
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Co było kluczowe</span>
                    <p>{caseStudy.key}</p>
                  </div>
                  <div className="home-case-mini-line">
                    <span className="home-case-mini-label">Efekt</span>
                    <p>{caseStudy.effect}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#faq" prefetch={false} className="prep-inline-link">
              Sprawdź najczęstsze pytania opiekunów psów
            </Link>
          </div>

          <FunnelPrimaryActions
            audioHref={audioHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="dogs-cases-audio"
            secondaryLocation="dogs-cases-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania opiekunów psów przed konsultacją"
            description="Krótko, konkretnie i spokojnie o tym, co najczęściej pojawia się jeszcze przed pierwszym kontaktem."
          />

          <div className="premium-faq-grid dog-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band dog-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Nie wiesz, od czego zacząć?</strong>
              <p>Kwadrans z behawiorystą to rozmowa głosem bez kamery. Opisujesz, co się dzieje, a ja pomagam ustalić pierwszy konkretny kierunek.</p>
            </div>
            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="dogs-faq-audio"
              secondaryLocation="dogs-faq-toolkit"
            />
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Nie wiesz, od czego zacząć?</h2>
            <p>Kwadrans z behawiorystą to rozmowa głosem bez kamery. Opisujesz, co się dzieje i wychodzisz z jednym konkretnym kierunkiem.</p>

            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="dogs-final-audio"
              secondaryLocation="dogs-final-toolkit"
              noteClassName="muted home-final-soft-note"
            />
          </div>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/psy"
          ctaHref={audioHref}
          ctaLabel="Zarezerwuj Kwadrans z behawiorystą"
          secondaryHref="/niezbednik"
          secondaryLabel="Przejdź do Niezbędnika"
        />
      </div>
    </main>
  )
}
