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
import {
  CATS_PAGE_PHOTO,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  getPublicContactDetails,
} from '@/lib/site'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pomoc behawioralna dla kotów',
  path: '/koty',
  description:
    'Konsultacje behawioralne dla opiekunów kotów. Pomoc przy kuwecie, stresie, wycofaniu, napięciu między kotami i zmianach w domu.',
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

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
const introCallHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const contactHref = '/kontakt?species=kot#formularz'
const litterGuide = (() => {
  const guide = getLeadMagnetBySlug('kot-kuweta-checklista')

  if (!guide) {
    throw new Error('Missing lead magnet: kot-kuweta-checklista')
  }

  return guide
})()

const problemCards = [
  {
    title: 'Załatwianie poza kuwetą',
    description:
      'Kot omija kuwetę całkowicie albo tylko w części sytuacji, a temat wraca mimo prób uporządkowania otoczenia.',
    href: '/koty/zalatwianie-poza-kuweta',
  },
  {
    title: 'Wycofanie i napięcie',
    description:
      'Kot chowa się, unika kontaktu albo pozostaje w czujności dłużej niż zwykle i trudno mu wrócić do rozluźnienia.',
  },
  {
    title: 'Konflikt między kotami',
    description:
      'Pojawia się unikanie, blokowanie przejść, napięte obserwowanie, gonitwy albo coraz trudniejsza atmosfera między kotami.',
    href: '/koty/konflikt-miedzy-kotami',
  },
  {
    title: 'Trudne zmiany po nowej sytuacji w domu',
    description:
      'Po przeprowadzce, nowym domowniku albo zmianie rytmu dnia coś w zachowaniu kota wyraźnie się rozsypało.',
  },
  {
    title: 'Nadmierna wokalizacja albo pobudzenie',
    description:
      'Kot częściej miauczy, intensywnie domaga się uwagi albo trudniej mu się wyciszyć po zwykłych sytuacjach dnia.',
  },
  {
    title: 'Zachowania, które nagle się zmieniły',
    description:
      'Widzisz zmianę, ale trudno nazwać ją jednym słowem i ocenić, od czego najlepiej spokojnie zacząć.',
  },
] as const

const whenToGetHelp = {
  yes: [
    'załatwianie poza kuwetą wraca albo zaczyna pojawiać się częściej',
    'wycofanie, czujność lub stres zaczynają wpływać na codzienny rytm kota',
    'między kotami rośnie unikanie, blokowanie albo napięte obserwowanie',
    'po zmianach w domu kot nie wraca do swojej równowagi',
    'widzisz kilka trudności naraz i trudno wybrać pierwszy krok',
    'chcesz zareagować wcześniej, zanim temat się utrwali',
  ],
  noNeedToWait: [
    'widzisz subtelne sygnały, które regularnie wracają',
    'drobna zmiana zaczyna obejmować kolejne miejsca albo sytuacje',
    'temat nie jest jeszcze duży, ale już zabiera spokój w domu',
    'chcesz zatrzymać problem, zanim utrwali się na dobre',
    'zależy Ci na spokojnym planie startu zamiast zgadywania',
    'chcesz działać szerzej niż tylko na sam objaw',
  ],
} as const

const consultationSteps = [
  {
    title: 'Umawiamy termin i krótko opisujesz, co się zmieniło',
    copy: 'Wybierasz spokojny termin i w kilku zdaniach opisujesz, co dziś najbardziej niepokoi Cię w zachowaniu kota.',
  },
  {
    title: 'Patrzymy na kota, środowisko i relacje w domu',
    copy: 'Bierzemy pod uwagę kuwetę, zasoby, rytm dnia, napięcie w domu i to, co mogło uruchomić zmianę.',
  },
  {
    title: 'Porządkujemy, co jest objawem, a co tłem',
    copy: 'Oddzielamy to, co widać na pierwszy rzut oka, od przyczyn i ustalamy, co ma największe znaczenie na start.',
  },
  {
    title: 'Dostajesz jasny plan pierwszych kroków',
    copy: 'Po konsultacji wiesz, co wdrożyć najpierw, co obserwować i jak działać spokojnie, bez dokładania chaosu sobie ani kotu.',
  },
] as const

const prepItems = [
  'krótki opis problemu i tego, co najbardziej niepokoi Cię dzisiaj',
  'od kiedy widać zmianę i czy wcześniej wydarzyło się coś ważnego',
  'kilka informacji o środowisku kota: kuwecie, zasobach, przestrzeni i rytmie dnia',
  'relacje z innymi kotami, zwierzętami albo domownikami, jeśli mają znaczenie',
  'zdjęcia lub nagrania, jeśli już masz je pod ręką',
] as const

const benefitCards = [
  {
    eyebrow: 'Czytelność',
    title: 'Jaśniejszy obraz sytuacji',
    copy: 'Lepiej widzisz, co jest głównym problemem, a co jego skutkiem, tłem albo konsekwencją napięcia.',
  },
  {
    eyebrow: 'Pierwszy plan',
    title: 'Plan pierwszych kroków',
    copy: 'Wiesz, co warto wdrożyć od razu, co obserwować i czego na ten moment lepiej nie dokładać.',
  },
  {
    eyebrow: 'Dopasowanie',
    title: 'Kierunek dopasowany do Twojego kota i domu',
    copy: 'Plan uwzględnia konkretnego kota, jego środowisko, relacje w domu i realia Waszej codzienności.',
  },
  {
    eyebrow: 'Spokój',
    title: 'Mniej chaosu i więcej spokoju',
    copy: 'Zamiast wielu sprzecznych prób masz uporządkowany punkt startu i większy oddech w codzienności.',
  },
] as const

const featuredOpinions = [
  {
    label: 'Kuweta',
    context: 'porządek zamiast zgadywania',
    quote:
      'Po konsultacji przestałam zgadywać, czy to tylko kwestia kuwety. Wreszcie wiedziałam, od czego zacząć, co uporządkować w domu i co spokojnie obserwować dalej.',
    signature: 'Opiekunka kota z problemem kuwetowym',
    note: 'więcej porządku, spokojniejszy start',
  },
  {
    label: 'Napięcie',
    context: 'wycofanie i stres w domu',
    quote:
      'Kot był wycofany i czujny, a ja nie umiałam ocenić, co go tak obciąża. Po rozmowie zobaczyłam, które elementy domu naprawdę dokładały mu stresu i od czego warto zacząć zmiany.',
    signature: 'Opiekunka kota bardziej wycofanego',
    note: 'czytelniejsza sytuacja, mniej chaosu',
  },
  {
    label: 'Relacje',
    context: 'między kotami i styl pracy',
    quote:
      'Najbardziej pomogło mi spokojne rozpisanie sytuacji między kotami bez oceniania i bez presji. Po konsultacji od razu było wiadomo, co zabezpieczyć na start i jak nie dokładać napięcia.',
    signature: 'Opiekunka dwóch kotów po zmianach',
    note: 'konkretnie, bez presji i straszenia',
  },
] as const

const shortOpinions = [
  {
    label: 'Kuweta',
    copy: 'Wreszcie wiedziałam, co sprawdzić najpierw, zamiast robić wszystko naraz.',
  },
  {
    label: 'Wycofanie',
    copy: 'Drobne sygnały zaczęły mieć sens i łatwiej było działać spokojnie.',
  },
  {
    label: 'Dom',
    copy: 'Plan był prosty do wdrożenia i nie wywrócił codzienności.',
  },
  {
    label: 'Styl pracy',
    copy: 'Bez oceniania, bez straszenia, za to bardzo konkretnie.',
  },
] as const

const miniCaseStudies = [
  {
    eyebrow: 'Kuweta',
    title: 'Kot załatwiający się poza kuwetą',
    situation:
      'Problem wrócił po zmianach w rytmie domu. Raz dotyczył sofy, raz łazienki, a opiekunka nie wiedziała, czy to kwestia kuwety, stresu czy szerszego przeciążenia.',
    key:
      'Kluczowe było uporządkowanie zasobów, historii zmian i sygnałów, które równolegle wymagały sprawdzenia weterynaryjnego.',
    effect:
      'Powstał jasny plan: co poprawić w środowisku od razu, co dalej obserwować i czego nie robić chaotycznie.',
  },
  {
    eyebrow: 'Wycofanie',
    title: 'Kot, który stał się bardziej wycofany i napięty',
    situation:
      'Kot coraz częściej chował się, unikał kontaktu i pozostawał w czujności nawet wtedy, gdy w domu było spokojnie.',
    key:
      'Kluczowe okazało się przyjrzenie bodźcom, układowi przestrzeni i temu, czy kot ma realną możliwość odpoczynku i kontroli.',
    effect:
      'Po konsultacji łatwiej było uprościć otoczenie i przywrócić kotu większe poczucie bezpieczeństwa.',
  },
  {
    eyebrow: 'Relacje',
    title: 'Napięcie między kotami po zmianach',
    situation:
      'Po przeprowadzce albo pojawieniu się nowego domownika między kotami zaczęło rosnąć unikanie, blokowanie i napięte obserwowanie.',
    key:
      'Najważniejsze okazały się zasoby, odległość, kolejność zmian i zabezpieczenie sytuacji, które napędzały konflikt.',
    effect:
      'Dom dostał spokojniejszy układ, a dalsza praca mogła zacząć się bez dokładania presji.',
  },
] as const

const faqItems = FAQ_SHORTLISTS.cats

export default function CatsPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Online dla opiekunów kotów z całej Polski.`,
      url: new URL('/koty', baseUrl).toString(),
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      serviceType: [
        'Konsultacje behawioralne dla kotów',
        'Pomoc przy kuwecie, stresie i relacjach między kotami',
        'Spokojny plan pierwszych kroków po konsultacji',
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
    <main className="page-wrap editorial-home-page premium-home-page cat-service-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />
        <OfferEntrySection
          species="kot"
          sectionId="start"
          eyebrow="Oferta dla kota"
          title="Kwadrans z behawiorystą jest najprostszym startem dla kota."
          description="Jeśli temat jest szerszy, wybierz konsultację online 60 min. Jeśli chcesz tylko doprecyzować sprawę, napisz krótką wiadomość."
        />

        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Pomoc behawioralna dla opiekunów kotów</div>
              <h1>Pomoc dla opiekunów kotów</h1>
              <p className="editorial-hero-lead">
                Pracuję z opiekunami kotów, którzy nie rozumieją, co się dzieje z ich kotem i chcą wiedzieć, od czego zacząć.
              </p>

              <FunnelPrimaryActions
                audioHref={introCallHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="cats-hero-audio"
                secondaryLocation="cats-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions"
                noteClassName="cat-hero-cta-note"
              />

              <HeroAudioSoftCta
                href={introCallHref}
                analyticsLocation="cats-hero-audio"
                className="cat-hero-soft-cta"
                title="Nie wiesz jeszcze, od czego zacząć z problemem kota?"
                copy="Kwadrans z behawiorystą wystarczy, żeby spokojnie opisać sytuację, ustalić, czy to temat behawioralny, środowiskowy czy zdrowotny, i wybrać pierwszy ruch."
              />

              <p className="cat-contact-support-copy">
                Zachowanie kota zmienia się rzadko bez powodu. Zanim zdecydujesz, co zmienić w środowisku, warto wiedzieć, co stoi za tym zachowaniem.
              </p>
            </div>

            <aside className="editorial-hero-visual" aria-label="Zdjęcie kota w spokojnym wnętrzu">
              <div className="editorial-hero-photo-frame">
                <Image
                  src={CATS_PAGE_PHOTO.src}
                  alt={CATS_PAGE_PHOTO.alt}
                  width={1024}
                  height={1536}
                  sizes="(max-width: 980px) 100vw, 520px"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="editorial-hero-photo"
                />
                <div className="editorial-hero-photo-caption">
                  <span>Spokojny pierwszy krok</span>
                  <strong>Najpierw rozumiem, co zmieniło zachowanie kota. Potem układamy spokojny plan dla kota, domu i relacji.</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-pomagam">
          <SectionIntro
            eyebrow="Typowe trudności"
            title="Z jakimi trudnościami najczęściej zgłaszają się opiekunowie kotów"
            description="Przy kotach ważne bywają także subtelne zmiany. Warto je uporządkować, zanim zaczną mocniej wpływać na rytm domu."
          />

          <div className="editorial-entry-grid cat-problem-grid">
            {problemCards.map((card) => (
              <article key={card.title} className="editorial-entry-card cat-problem-card">
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
            Nie musisz znać fachowych nazw. Wystarczy opis tego, co widzisz na co dzień i tego, co zaczyna zabierać spokój Wam obojgu.
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
            title="Kiedy warto zgłosić się po pomoc behawioralną dla kota"
            description="Nie trzeba czekać na duży kryzys. Przy kotach znaczenie mają także drobniejsze sygnały, jeśli zaczynają się powtarzać lub rozszerzać."
          />

          <div className="premium-two-column-grid cat-comparison-grid">
            <article className="summary-card tree-backed-card cat-compare-card">
              <div className="section-eyebrow">Sygnały z codzienności</div>
              <h3>Warto zgłosić się wtedy, gdy</h3>
              <p>
                Nie chodzi o dramatyczny moment. Wystarczy, że temat wraca, zaczyna się utrwalać albo wyraźnie obciąża kota i
                codzienność domu.
              </p>
              <ul className="premium-bullet-list">
                {whenToGetHelp.yes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="summary-card tree-backed-card cat-compare-card cat-compare-card-accent">
              <div className="section-eyebrow">Dobry moment na pierwszy krok</div>
              <h3>Nie trzeba czekać, aż zrobi się bardzo źle</h3>
              <p>
                Wcześniejszy kontakt często daje więcej spokoju, bo pozwala zatrzymać problem na etapie, na którym łatwiej go
                uporządkować i nie dokładać napięcia w domu.
              </p>
              <ul className="premium-bullet-list">
                {whenToGetHelp.noNeedToWait.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="muted top-gap">
            Jeśli widzisz, że zmiana zaczyna obejmować kuwetę, napięcie, relacje albo rytm dnia, to zwykle jest dobry moment na
            spokojny kontakt.
          </p>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="cats-when-audio"
            secondaryLocation="cats-when-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="konsultacja">
          <SectionIntro
            eyebrow="Pierwsza konsultacja"
            title="Jak wygląda konsultacja dotycząca kota"
            description="Wystarczy krótko opisać, co się zmieniło. Resztę porządkujemy razem spokojnie, konkretnie i bez presji."
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

            <aside className="editorial-process-note cat-process-note" aria-label="Co warto przygotować przed konsultacją">
              <span className="editorial-process-note-label">Co warto przygotować</span>
              <strong>Nie musisz mieć wszystkiego idealnie poukładanego przed rozmową.</strong>
              <p>
                Wystarczy kilka konkretów: opis problemu, tło zmian i to, jak dziś wygląda codzienność kota. To daje dobry start bez
                przeciążania siebie i bez zgadywania.
              </p>

              <ul className="premium-bullet-list top-gap-small">
                {prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="cat-process-soft-note">
                Jeśli czegoś nie masz pod ręką, doprecyzujemy to spokojnie podczas konsultacji. Nie trzeba przygotowywać wszystkiego
                perfekcyjnie.
              </p>
            </aside>
          </div>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="cats-consultation-audio"
            secondaryLocation="cats-consultation-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="material-startowy">
          <SectionIntro
            eyebrow="Lżejszy start"
            title="Jeśli temat dotyczy kuwety albo napięcia w domu, możesz zacząć od krótkiej checklisty"
            description="To materiał do spokojnego uporządkowania obserwacji przed rozmową albo między kolejnymi krokami. Jeśli chcesz od razu odnieść temat do swojej sytuacji, wybierz Kwadrans z behawiorystą."
          />

          <div className="premium-two-column-grid top-gap-small">
            <LeadMagnetSignup magnet={litterGuide} location="cats-page" sourcePage="/koty" />

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kiedy warto</div>
              <h3>{litterGuide.shortTitle}</h3>
              <p>Ten materiał pomaga zebrać najważniejsze elementy środowiska i codzienności kota, zanim wejdziesz w szerszą rozmowę o kuwecie, stresie albo napięciu między kotami.</p>
              <ul className="premium-bullet-list">
                {litterGuide.bullets.slice(0, 3).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <p className="muted">Jeśli po uporządkowaniu checklisty nadal nie jest jasne, co najmocniej napędza problem, przejdź do Kwadransu z behawiorystą.</p>
            </article>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="co-dostajesz">
          <SectionIntro
            eyebrow="Efekt konsultacji"
            title="Co dostajesz po konsultacji dotyczącej kota"
            description="Najważniejsze jest to, że po rozmowie widzisz sytuację wyraźniej i wiesz, od czego naprawdę spokojnie zacząć."
          />

          <div className="premium-two-column-grid cat-benefits-grid">
            {benefitCards.map((card) => (
              <article key={card.title} className="summary-card tree-backed-card cat-benefit-card">
                <div className="section-eyebrow">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>

          <p className="muted top-gap">
            To zwykle moment, w którym robi się mniej chaotycznie, bo nie trzeba już zgadywać kolejnych ruchów ani próbować wszystkiego
            naraz.
          </p>

          <div className="hero-actions editorial-final-actions">
            <Link href="#opinie" prefetch={false} className="prep-inline-link">
              Zobacz opinie opiekunów kotów
            </Link>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="opinie">
          <SectionIntro
            eyebrow="Opinie"
            title="Co mówią opiekunowie kotów po konsultacji"
            description="Najczęściej wraca jedno: więcej porządku, mniej zgadywania i spokojniejszy pierwszy plan działania."
          />

          <div className="home-opinion-featured-grid cat-opinion-featured-grid top-gap">
            {featuredOpinions.map((opinion, index) => (
              <article key={opinion.label} className="home-quote-card cat-quote-card">
                <div className="home-quote-head cat-quote-head">
                  <div className="cat-quote-topline">
                    <span className="home-quote-label">{opinion.label}</span>
                    <span className="cat-quote-order">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="home-quote-context">{opinion.context}</span>
                </div>
                <blockquote className="home-quote-text">„{opinion.quote}”</blockquote>
                <div className="home-quote-footer cat-quote-footer">
                  <span className="home-quote-person">{opinion.signature}</span>
                  <span className="home-quote-note">{opinion.note}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="cat-opinion-micro-intro">
            <span>Krótsze głosy po pierwszych konsultacjach</span>
            <p>To krótkie zdania, które najczęściej wracają wtedy, gdy pierwszy plan jest już poukładany i w codzienności robi się trochę lżej.</p>
          </div>

          <div className="home-opinion-micro-grid cat-opinion-micro-grid top-gap-small">
            {shortOpinions.map((opinion) => (
              <article key={opinion.copy} className="summary-card tree-backed-card home-opinion-micro-card cat-opinion-micro-card">
                <div className="home-opinion-micro-label">{opinion.label}</div>
                <p>„{opinion.copy}”</p>
              </article>
            ))}
          </div>

          <div className="hero-actions editorial-final-actions">
            <Link href="#przypadki" prefetch={false} className="prep-inline-link">
              Zobacz przykładowe sytuacje kotów
            </Link>
          </div>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="cats-opinions-audio"
            secondaryLocation="cats-opinions-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="przypadki">
          <SectionIntro
            eyebrow="Mini przypadki"
            title="Przykładowe sytuacje kotów, z którymi zgłaszają się opiekunowie"
            description="Trzy krótkie scenariusze pokazują, jak zwykle zaczyna się spokojne uporządkowanie sytuacji."
          />

          <div className="summary-grid cat-case-grid top-gap">
            {miniCaseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="summary-card tree-backed-card home-mini-case-card cat-case-card">
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
              Sprawdź najczęstsze pytania opiekunów kotów
            </Link>
          </div>

          <FunnelPrimaryActions
            audioHref={introCallHref}
            consultationHref={consultationHref}
            contactHref={contactHref}
            primaryLocation="cats-cases-audio"
            secondaryLocation="cats-cases-toolkit"
          />
        </section>

        <section className="panel section-panel editorial-section" id="faq">
          <SectionIntro
            eyebrow="FAQ"
            title="Najczęstsze pytania opiekunów kotów przed konsultacją"
            description="Krótko, konkretnie i spokojnie o tym, co najczęściej pojawia się jeszcze przed pierwszym kontaktem."
          />

          <div className="premium-faq-grid cat-faq-grid">
            {faqItems.map((item) => (
              <details key={item.question} className="premium-faq-item">
                <summary className="premium-faq-summary">{item.question}</summary>
                <div className="premium-faq-content">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="premium-contact-band cat-contact-band">
            <div className="premium-contact-band-copy">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Zacznij od Kwadransu z behawiorystą.</strong>
              <p>Opisujesz, co się dzieje. Pytam. Ustalamy, czy to temat behawioralny, środowiskowy czy zdrowotny i co zrobić w pierwszej kolejności.</p>
            </div>
            <FunnelPrimaryActions
              audioHref={introCallHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="cats-faq-audio"
              secondaryLocation="cats-faq-toolkit"
            />
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Ostatni krok</div>
            <h2>Zacznij od Kwadransu z behawiorystą</h2>
            <p>
              Opisujesz, co się dzieje. Pytam. Ustalamy, czy to temat behawioralny, środowiskowy czy zdrowotny i co zrobić w pierwszej kolejności.
            </p>

            <FunnelPrimaryActions
              audioHref={introCallHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="cats-final-audio"
              secondaryLocation="cats-final-toolkit"
              noteClassName="muted home-final-soft-note"
            />
          </div>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/koty"
          ctaHref={introCallHref}
          ctaLabel="Zarezerwuj Kwadrans z behawiorystą"
          secondaryHref="/niezbednik"
          secondaryLabel="Przejdź do Niezbędnika"
        />
      </div>
    </main>
  )
}
