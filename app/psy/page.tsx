import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferCards } from '@/components/OfferCards'
import { RegulskiWebHero } from '@/components/RegulskiWebHero'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta psów online - reaktywność i separacja',
  path: '/psy',
  description: 'Pomoc behawioralna online dla opiekunów psów. Kwadrans 69 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'pies')
const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, 'pies')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'pies')
const serviceLandingHref = '/behawiorysta-online-polska'

const dogProblemTopics = [
  {
    id: 'reaktywnosc-na-smyczy',
    number: 'i.',
    icon: 'dog-reactivity',
    title: 'Pies reaguje na psy, ludzi albo rowery',
    description:
      'Szczekanie, rzucanie się na smyczy, napięcie przy mijaniu bodźców albo trudne spacery. Najpierw porządkujemy wyzwalacze, dystans i rytm spaceru.',
    href: '/psy/reaktywnosc-na-smyczy',
    ctaLabel: 'Zobacz temat',
  },
  {
    id: 'problemy-separacyjne',
    number: 'ii.',
    icon: 'dog-separation',
    title: 'Problemy separacyjne',
    description:
      'Pies źle znosi zostawanie samemu: wyje, szczeka, niszczy, chodzi za opiekunem albo napina się przy szykowaniu do wyjścia.',
    href: '/psy/lek-separacyjny',
    ctaLabel: 'Zobacz temat',
  },
  {
    id: 'pobudzenie-brak-wyciszenia',
    number: 'iii.',
    icon: 'dog-puppy',
    title: 'Pobudzenie i brak wyciszenia',
    description:
      'Pies trudno odpoczywa, skacze, wymusza uwagę, szybko się nakręca albo nie umie wrócić do spokoju po spacerze, zabawie lub gościach.',
    href: quickHref,
    ctaLabel: 'Zacznij od Kwadransa',
  },
  {
    id: 'szczeniak-start-w-domu',
    number: 'iv.',
    icon: 'dog-puppy',
    title: 'Szczeniak gryzie, skacze albo nie odpoczywa',
    description:
      'Młody pies gryzie ręce, skacze, trudno mu zasnąć, pobudza się przy kontakcie albo potrzebuje spokojnego planu pierwszych tygodni w domu.',
    href: quickHref,
    ctaLabel: 'Omów start',
  },
  {
    id: 'lek-stres-wycofanie',
    number: 'v.',
    icon: 'dog-reactivity',
    title: 'Pies się boi, wycofuje albo żyje w napięciu',
    description:
      'Pies unika kontaktu, chowa się, zamiera, reaguje paniką na ludzi, dźwięki albo zmiany. Szukamy źródła stresu i pierwszego bezpiecznego kroku.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'agresja-warczenie-gryzienie',
    number: 'vi.',
    icon: 'dog-reactivity',
    title: 'Warczenie, kłapanie i gryzienie',
    description:
      'Pies warczy, pokazuje zęby, kłapie pyskiem, pilnuje zasobów albo gryzie w kontakcie. Sprawdzamy strach, ból, frustrację, granice i sytuacje zapalne.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'spacery-ciagniecie-trudnosci',
    number: 'vii.',
    icon: 'dog-reactivity',
    title: 'Spacery, ciągnięcie i trudności na zewnątrz',
    description:
      'Pies ciągnie, zamiera, oszczekuje bodźce, nie wraca do kontaktu albo spacer kończy się napięciem. Układamy prostszy rytm i pierwsze zasady pracy.',
    href: quickHref,
    ctaLabel: 'Omów spacer',
  },
  {
    id: 'niszczenie-szczekanie-dom',
    number: 'viii.',
    icon: 'dog-separation',
    title: 'Niszczenie, szczekanie i trudności w domu',
    description:
      'Pies niszczy rzeczy, szczeka, kradnie przedmioty albo trudno mu wejść w spokojny rytm dnia. Sprawdzamy potrzeby, napięcie i zasady w domu.',
    href: quickHref,
    ctaLabel: 'Omów problem',
  },
  {
    id: 'sprawa-zlozona-pies',
    number: 'ix.',
    icon: 'topic-other',
    title: 'Nie wiesz, który temat wybrać?',
    description:
      'Problem pasuje do kilku kategorii albo trudno go nazwać jednym słowem. Zacznij od krótkiego omówienia sytuacji i ustalenia pierwszego priorytetu.',
    href: quickHref,
    ctaLabel: 'Zacznij od Kwadransa',
  },
] as const

export default function DogsPage() {
  const faqItems = FAQ_SHORTLISTS.dogs.slice(0, 3)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }, { name: 'Psy', path: '/psy' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunów psów online',
      description: 'Konsultacje online dla opiekunów psów: spacery, reaktywność, rozłąka, pobudzenie i pierwszy spokojny krok.',
      serviceUrl: serviceLandingHref,
      offerPrice: 69,
      offerCatalog: [
        {
          name: 'Kwadrans z behawiorystą',
          description: '15 minut rozmowy audio bez kamery dla opiekuna psa.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na spokojniejsze uporządkowanie tematu psa.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pełna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematów psich wielowątkowych albo długotrwałych.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="dog" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Pies / strona gatunku" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zł" />

        <section className="notatnik-subhero notatnik-subhero-pet">
          <div>
            <h1>
              Twój pies zachowuje się w sposób, <em>który Cię niepokoi</em>.
            </h1>
            <p>
              Pomagam opiekunom psów zrozumieć, co stoi za trudnym zachowaniem i jak zacząć to porządkować bez przymusu i bez karania. Nie musisz
              wiedzieć, jak to nazwać. Wystarczy, że opiszesz, co się dzieje.
            </p>
            <NextSlot className="top-gap-small" />
            <p className="notatnik-service-description">
              Kwadrans 69 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł. Dla psa obowiązuje ta sama logika 3 formatów.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj Kwadrans</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Umów Pełną konsultację</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <RegulskiWebHero variant="dogs" priority className="notatnik-pet-hero-visual" />
          </div>
        </section>

        <section id="tematy" className="notatnik-pet-topic-section">
          <NotatnikSectionHead index="I." kicker="Najczęstsze tematy" title="Najczęstsze problemy behawioralne psów" />
          <p className="notatnik-service-description top-gap-small">
            Wybierz temat najbliższy temu, co dzieje się u Twojego psa. Nie musisz trafić idealnie - wiele problemów się łączy. Jeśli nie wiesz, od czego zacząć, wybierz Kwadrans.
          </p>
          <div className="notatnik-topic-grid notatnik-topic-grid-with-icons">
            {dogProblemTopics.map((topic) => (
              <Link key={topic.id} href={topic.href} prefetch={false} className="notatnik-topic-card notatnik-topic-card-with-icon">
                <Image
                  src={`/branding/pet-topics/subcategories/${topic.icon}.png`}
                  alt=""
                  width={126}
                  height={126}
                  className="notatnik-topic-card-icon"
                />
                <div className="notatnik-topic-number">{topic.number}</div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <span className="notatnik-topic-card-action">
                  {topic.ctaLabel}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="II." kicker="FAQ" title="3 szybkie odpowiedzi przy tematach psich." />
          <div className="card-grid three-up top-gap-small">
            {faqItems.map((item) => (
              <article key={item.question} className="summary-card tree-backed-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cennik">
          <NotatnikSectionHead index="III." kicker="Cennik / wybor sciezki" title="Najpierw cena, potem najprostsza sciezka." />
          <div className="top-gap-small">
            <OfferCards />
          </div>
          <div className="notatnik-pdf-fallback top-gap-small">
            <span>Jeśli nie rezerwujesz rozmowy, przejdź do materiałów PDF.</span>
            <Link href="/materialy" prefetch={false} className="notatnik-inline-link">
                  Zobacz materiały
            </Link>
            <Link href={serviceLandingHref} prefetch={false} className="notatnik-inline-link">
              Przejdz do pelnego opisu konsultacji online
            </Link>
          </div>
        </section>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorystą" showReviews={false} />
      </div>
    </main>
  )
}
