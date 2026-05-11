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
    answer: 'Tak. Quiz jest po to, żeby szybko wybrać pierwszy krok bez znajomości nazw problemów.',
  },
  {
    question: 'Czy konsultacja jest dla psów i kotów?',
    answer: 'Tak. Pierwszy wybór prowadzi osobno przez tematy psie i kocie.',
  },
  {
    question: 'Czy muszę mieć diagnozę?',
    answer: 'Nie. Wystarczy opis codziennej sytuacji. Diagnozy nie trzeba przynosić na start.',
  },
  {
    question: 'Co jeśli problem jest złożony?',
    answer: 'Quiz wskaże dłuższy format albo bezpieczny pierwszy krok, żeby dobrać zakres bez zgadywania.',
  },
] as const

export default function HomePage() {
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }]),
    getServiceJsonLd({
      name: 'Behawiorysta psów i kotów online',
      description:
        'Konsultacje behawioralne online dla opiekunów psów i kotów. Podstawowa usługa to Kwadrans 69 zł. Dostępny jest też wariant pilny Kwadrans na już 99 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł.',
      serviceUrl: serviceLandingHref,
      offerCatalog: [
        { name: '15-minutowa konsultacja behawioralna', description: '15 min audio bez kamery, najprostszy start.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
        { name: 'Kwadrans na już', description: 'Ten sam zakres co Kwadrans, ale dla pilniejszego terminu.', url: '/book?service=kwadrans-na-juz', price: 99 },
        { name: 'Dwa kwadranse', description: '30 min online na szersze uporządkowanie tematu.', url: '/book?service=konsultacja-30-min', price: 169 },
        {
          name: 'Pełna konsultacja',
          description: 'Audio albo video, diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
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
        </Reveal>

        <Reveal as="section" className="compact-home-section">
          <div className="home-section-title">
            <h2>Najczęściej zadawane pytania</h2>
          </div>
          <div className="notatnik-faq-compact top-gap-small">
            <FaqAccordion items={routerFaqItems.map((item) => ({ q: item.question, a: item.answer }))} />
          </div>
        </Reveal>

        <NotatnikFooter primaryHref="/wybor" primaryLabel="Przejdź przez krótki wybór" />
      </div>
    </main>
  )
}
