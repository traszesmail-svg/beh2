import type { Metadata } from 'next'
import { CalendarCheck, Headphones, MessageSquareText, Video } from 'lucide-react'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { FaqAccordion } from '@/components/FaqAccordion'
import { HomepageServiceSelector } from '@/components/HomepageServiceSelector'
import { Reveal } from '@/components/Reveal'
import { NotatnikFooter } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { homepageProcessSteps } from '@/lib/homepage-data'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildHomeMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

const serviceLandingHref = '/'

const processIcons = [MessageSquareText, Headphones, CalendarCheck] as const

const routerFaqItems = [
  {
    question: 'Czy jeśli nie wiem, co wybrać, mogę zacząć od quizu?',
    answer: 'Tak. Quiz jest po to, żeby spokojnie wybrać pierwszy krok bez znajomości fachowych nazw.',
  },
  {
    question: 'Czy konsultacja jest dla psów i kotów?',
    answer: 'Tak. Pierwszy wybór prowadzi osobno przez tematy psie i kocie.',
  },
  {
    question: 'Czy muszę już wiedzieć, co jest przyczyną?',
    answer: 'Nie. Wystarczy opis codziennej sytuacji. Na tej podstawie układamy dane i szukamy najrozsądniejszego pierwszego kroku.',
  },
  {
    question: 'Co jeśli sytuacja ma kilka warstw?',
    answer: 'Wtedy lepiej zebrać więcej kontekstu: formularz, historię zachowania, rutynę domu lub spacerów i nagrania, jeśli są.',
  },
] as const

export default function HomePage() {
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psów i kotów online',
      description:
        'Konsultacje behawioralne online dla opiekunów psów i kotów. W każdej usłudze punktem wyjścia jest diagnoza behawioralna oparta na informacjach przekazanych przez opiekuna.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: 'Kwadrans', description: '15 min audio bez kamery, gdy potrzebujesz pierwszego kierunku.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Kwadrans na już', description: 'Ten sam zakres co Kwadrans, ale z priorytetem terminu.', url: '/book?service=kwadrans-na-juz', price: 99 },
        { name: 'Dwa kwadranse', description: '30 min online na spokojniejsze uporządkowanie kilku wątków.', url: '/book?service=konsultacja-30-min', price: 169 },
        {
          name: 'Pełna konsultacja',
          description: 'Rozmowa online, diagnoza behawioralna oparta na danych od opiekuna, plan działania i 7 dni konsultacji tekstowych przez WhatsApp.',
          url: '/book?service=konsultacja-behawioralna-online',
          price: 470,
        },
      ],
    }),
    getFaqPageJsonLd([...routerFaqItems]),
  ]

  return (
    <main className="notatnik-page homepage-shell">
      <Schema data={structuredData} />
      <div className="notatnik-shell homepage-main">
        <EditorialIndexTopbar />

        <section className="notatnik-router-hero-section">
          <HomepageServiceSelector />
        </section>

        <Reveal as="section" className="compact-home-section" id="jak-to-działa">
          <div className="home-section-title">
            <h2>Jak wygląda współpraca?</h2>
          </div>
          <div className="process-grid process-grid-compact top-gap-small">
            {homepageProcessSteps.map((step, index) => {
              const Icon = processIcons[index] ?? MessageSquareText

              return (
              <article key={step.step} className="process-card">
                <span aria-hidden="true">
                  {index === 1 ? (
                    <span className="process-icon-combo">
                      <Icon size={29} strokeWidth={1.7} />
                      <Video className="process-icon-video" size={15} strokeWidth={2} />
                    </span>
                  ) : (
                    <Icon size={28} strokeWidth={1.7} />
                  )}
                </span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
              )
            })}
          </div>
          <p className="notatnik-service-description top-gap-small">
            Nie patrzę tylko na to, co zwierzę robi. Patrzę też na to, dlaczego może to robić. Jako behawiorysta, doświadczony technik weterynarii i dietetyk biorę pod uwagę zachowanie, zdrowie, ból, dietę, środowisko i codzienną rutynę.
          </p>
        </Reveal>

        <Reveal as="section" className="compact-home-section">
          <div className="home-section-title">
            <h2>W każdej usłudze dostajesz diagnozę behawioralną opartą na danych</h2>
          </div>
          <p className="notatnik-service-description top-gap-small">
            To nie jest przypadkowa porada z internetu. Analizuję opis sytuacji, odpowiedzi z formularza, historię zachowania, kontekst domu lub spacerów i - jeśli je masz - nagrania. Dzięki temu łatwiej ustalić, co naprawdę może napędzać zachowanie i od czego zacząć.
          </p>
          <p className="notatnik-service-description top-gap-small">
            Jako doświadczony technik weterynarii i dietetyk patrzę też szerzej: na zdrowie, ból, dietę, środowisko i rytm dnia. Jeśli coś może mieć tło zdrowotne, powiem jasno, kiedy warto równolegle skonsultować się z lekarzem weterynarii.
          </p>
          <div className="hero-actions top-gap-small">
            <a href="/wybor" className="notatnik-btn">
              Pomóż mi dobrać pierwszy krok
            </a>
          </div>
        </Reveal>

        <Reveal as="section" className="compact-home-section">
          <div className="home-section-title">
            <h2>Najczęściej zadawane pytania</h2>
          </div>
          <div className="notatnik-faq-compact top-gap-small">
            <FaqAccordion items={routerFaqItems.map((item) => ({ q: item.question, a: item.answer }))} />
          </div>
        </Reveal>

        <NotatnikFooter primaryHref="/wybor" primaryLabel="Quiz" />
      </div>
    </main>
  )
}
