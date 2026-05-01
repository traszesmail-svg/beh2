import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { OfferCards } from '@/components/OfferCards'
import { FaqAccordion } from '@/components/FaqAccordion'
import { Icon, type IconName } from '@/components/icons-config'
import { PetTopicsSection } from '@/components/PetTopicCard'
import { NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import {
  FUNNEL_FULL_CONSULTATION_HREF,
  FUNNEL_PRIMARY_HREF,
  FUNNEL_UPGRADE_HREF,
} from '@/lib/offers'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const serviceLandingHref = '/behawiorysta-online-polska'

const speciesSections = [
  {
    key: 'pies',
    headline: 'Masz psa i nie wiesz, od czego zaczac?',
    subtitle: 'Pomoge Ci uporzadkowac spacer, pobudzenie, separacje lub rytm dnia mlodego psa.',
    href: '/psy',
    ctaLabel: 'Zobacz pomoc dla psa',
    items: [
      {
        title: 'Reaktywnosc',
        href: '/psy/reaktywnosc-na-smyczy',
        copy: 'Poradnik krok po kroku, jak wprowadzic spokoj na spacerze i w codziennych sytuacjach.',
      },
      {
        title: 'Separacja',
        href: '/psy/lek-separacyjny',
        copy: 'Jak pomoc psu radzic sobie z zostawaniem samemu, bez stresu i niszczenia w domu.',
      },
      {
        title: 'Szczeniak',
        href: '/materialy/szczeniak-gryzie-i-skacze',
        copy: 'Pierwsze tygodnie i rytm dnia szczeniaka: jak spokojnie wdrozyc codzienny plan.',
      },
    ],
  },
  {
    key: 'kot',
    headline: 'Masz kota i chcesz wprowadzic spokoj w domu?',
    subtitle: 'Przejrzymy kuwety, stres, zmiany w domu i relacje miedzy kotami.',
    href: '/koty',
    ctaLabel: 'Zobacz pomoc dla kota',
    items: [
      {
        title: 'Kuweta',
        href: '/koty/zalatwianie-poza-kuweta',
        copy: 'Jak zorganizowac kuwete i srodowisko, by kot czul sie bezpiecznie.',
      },
      {
        title: 'Stres',
        href: '/materialy/kot-zyje-w-napieciu',
        copy: 'Strategie redukcji napiecia u kota w domu i po zmianach.',
      },
      {
        title: 'Konflikt',
        href: '/koty/konflikt-miedzy-kotami',
        copy: 'Jak wprowadzic nowego kota lub rozwiazac konflikt miedzy kotami.',
      },
    ],
  },
] as const

const processSteps = [
  'Wybierz jeden z trzech formatow konsultacji.',
  'Opowiedz krotko sytuacje w domu lub na spacerze.',
  'Rozmawiamy w wybranym formacie: audio albo audio/video.',
  'Wiesz, co zrobic dalej i ktore kroki sa najlepsze.',
] as const

const consultationFormats = [
  {
    title: 'Kwadrans z behawiorysta',
    eyebrow: '69 zl / pierwszy kierunek',
    description: '15 minut audio bez kamery, aby nazwac problem i ustalic priorytet.',
    whenToChoose: 'gdy chcesz zaczac od jednego pytania albo sprawdzic, ktory kierunek ma sens',
    meta: ['15 min audio', 'bez kamery', '69 zl'],
    href: FUNNEL_PRIMARY_HREF,
    ctaLabel: 'Zarezerwuj Kwadrans',
    ctaClassName: 'button button-primary',
  },
  {
    title: 'Dwa kwadranse',
    eyebrow: '169 zl / spokojniejsze uporzadkowanie',
    description: '30 minut online, aby objac 2-3 watki i otrzymac krotka notatke.',
    whenToChoose: 'gdy 15 minut to za malo, ale sprawa nie wymaga jeszcze pelnej konsultacji',
    meta: ['30 min online', '2-3 watki', '169 zl'],
    href: FUNNEL_UPGRADE_HREF,
    ctaLabel: 'Umow Dwa kwadranse',
    ctaClassName: 'button button-ghost',
  },
  {
    title: 'Pelna konsultacja',
    eyebrow: '470 zl / sprawa zlozona',
    description: '60 minut, diagnoza sytuacji, plan poprawy i 7 dni konsultacji WhatsApp.',
    whenToChoose: 'gdy problem jest zlozony, przewlekly albo obejmuje kilka obszarow naraz',
    meta: ['60 min online', 'plan poprawy', '7 dni WhatsApp'],
    href: FUNNEL_FULL_CONSULTATION_HREF,
    ctaLabel: 'Umow Pelna konsultacje',
    ctaClassName: 'button button-ghost',
  },
] as const

const credentials = [
  {
    icon: 'award',
    title: 'Behawiorysta i trener COAPE',
    copy: 'Analiza zachowania polaczona z prostym planem dla domu, spaceru albo relacji z kotem.',
  },
  {
    icon: 'utensils',
    title: 'Dietetyk',
    copy: 'Uwzgledniam jedzenie, rytm dnia i sygnaly zdrowotne, bo zachowanie nie dzieje sie w prozni.',
  },
  {
    icon: 'heart-handshake',
    title: 'Dogoterapeuta',
    copy: 'Patrze na relacje, bezpieczenstwo i tempo zmian mozliwe do utrzymania na co dzien.',
  },
  {
    icon: 'shield-check',
    title: 'Bez kar i oceniania',
    copy: 'Szukamy przyczyny problemu i realnego pierwszego kroku, bez presji na Ciebie ani zwierze.',
  },
] satisfies ReadonlyArray<{ icon: IconName; title: string; copy: string }>

const approachProof = [
  {
    icon: 'clock',
    title: 'Zaczynam od tego, co dzieje sie dzis',
    copy: 'Interesuje mnie konkretna codziennosc: kiedy pojawia sie problem, co go poprzedza i co najbardziej obciaza dom.',
  },
  {
    icon: 'search',
    title: 'Oddzielam objaw od tla',
    copy: 'Nie zatrzymuje sie na samym sygnale. Sprawdzam tez srodowisko, relacje, rytm dnia i to, co moze podtrzymywac zachowanie.',
  },
  {
    icon: 'message-square-text',
    title: 'Mowie wprost, kiedy potrzeba czegos wiecej',
    copy: 'Jesli temat wymaga szerszej konsultacji, badan albo zmiany priorytetu, uslyszysz to od razu i bez ozdobnikow.',
  },
] satisfies ReadonlyArray<{ icon: IconName; title: string; copy: string }>

const faqItems = [
  {
    question: 'Kiedy wybrac Dwa kwadranse?',
    answer: 'Gdy 15 minut to za malo, temat ma kilka watkow lub chcesz spokojnie uporzadkowac sytuacje.',
  },
  {
    question: 'Co obejmuje Pelna konsultacja 470 zl?',
    answer: '60 minut online, diagnoze sytuacji, plan poprawy i 7 dni konsultacji WhatsApp.',
  },
  {
    question: 'Co jesli nie wiem, od czego zaczac?',
    answer:
      'Najprostszy start to Kwadrans 69 zl albo material z Niezbednika. Po krotkim opisie sytuacji wybierzemy najlepszy krok dla Ciebie i Twojego pupila.',
  },
] as const

export default function HomePage() {
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psow i kotow online',
      description:
        'Konsultacje behawioralne online dla opiekunow psow i kotow. Podstawowa usluga to Kwadrans 69 zl. Dostepny jest tez wariant pilny Kwadrans na juz 99 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery, najprostszy start.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Kwadrans na juz', description: 'Ten sam zakres co Kwadrans, ale dla pilniejszego terminu.', url: '/book?service=kwadrans-na-juz', price: 99 },
        { name: 'Dwa kwadranse', description: '30 min online na szersze uporzadkowanie tematu.', url: '/book?service=konsultacja-30-min', price: 169 },
        {
          name: 'Pelna konsultacja',
          description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: '/book?service=konsultacja-behawioralna-online',
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd([...faqItems]),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="home" />
      <div className="notatnik-shell">
        <NotatnikTopbar
          tag="Terapia behawioralna"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref={FUNNEL_PRIMARY_HREF}
          ctaLabel="Kwadrans 69 zl"
          ctaVariant="accent"
        />

        <section className="notatnik-hero">
          <div className="notatnik-hero-kicker notatnik-mono">Konsultacje behawioralne online dla przewodnikow zwierzat towarzyszacych</div>

          <div className="notatnik-hero-grid notatnik-hero-grid-photo-only">
            <div className="notatnik-hero-copy">
              <h1>
                Chcesz uporzadkowac zachowanie swojego psa lub kota? <em>Zacznij od spokojnej rozmowy, razem uporzadkujemy kazda zaburzona relacje.</em>
              </h1>
            </div>

            <aside className="notatnik-hero-media-stack" aria-label="Zdjecie Krzysztofa Regulskiego">
              <div className="notatnik-hero-card notatnik-hero-photo-card">
                <Image
                  src="/omnie.png"
                  alt="Krzysztof Regulski z kotem na rekach"
                  width={900}
                  height={900}
                  priority
                  className="notatnik-hero-photo"
                />
              </div>
            </aside>

            <div className="notatnik-about-compact notatnik-hero-proof">
              <p>Spokojna rozmowa, analiza zachowan, zdrowia, rytmu dnia i relacji, terapia bez kar bez oceniania opiekuna.</p>
              <div className="notatnik-about-proof-row" aria-label="Najwazniejsze kwalifikacje i sposob pracy">
                {credentials.map((item) => (
                  <span key={item.title}>
                    <span className="notatnik-about-proof-icon" aria-hidden="true">
                      <Icon name={item.icon} size={20} strokeWidth={2.2} />
                    </span>
                    <strong>{item.title}</strong>
                    <small>{item.copy}</small>
                  </span>
                ))}
              </div>
              <div className="notatnik-hero-method-list" aria-label="Jak wyglada pierwsza analiza">
                {approachProof.map((item) => (
                  <span key={item.title} className="notatnik-hero-method-item">
                    <span className="notatnik-hero-method-icon" aria-hidden="true">
                      <Icon name={item.icon} size={15} strokeWidth={2.2} />
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.copy}</small>
                    </span>
                  </span>
                ))}
              </div>
              <Link href="/o-mnie" prefetch={false} className="notatnik-inline-link">
                Wiecej o mnie
              </Link>
            </div>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="I." title="Wybierz gatunek i okresl problem" />
          <div className="top-gap-small">
            <PetTopicsSection />
          </div>
        </section>

        <section id="cennik">
          <NotatnikSectionHead index="II." kicker="Cennik / wybor sciezki" title="Najpierw cena, potem najprostsza sciezka." />
          <Reveal delay={0.1}>
            <div className="top-gap-small">
              <OfferCards />
            </div>
          </Reveal>
          <div className="notatnik-pdf-fallback top-gap-small">
            <span>Jesli nie rezerwujesz rozmowy, przejdz do materialow PDF.</span>
            <Link href="/materialy" prefetch={false} className="notatnik-inline-link">
              Zobacz materialy
            </Link>
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania przed pierwszym krokiem." />
          <div className="notatnik-faq-compact top-gap-small">
            <FaqAccordion items={faqItems.map((item) => ({ q: item.question, a: item.answer }))} />
          </div>
        </section>

        <NotatnikFooter primaryHref={FUNNEL_PRIMARY_HREF} primaryLabel="Zarezerwuj Kwadrans" />
      </div>
    </main>
  )
}
