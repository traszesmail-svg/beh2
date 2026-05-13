import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Cat,
  CircleHelp,
  Download,
  Heart,
  Home,
  Mail,
  PawPrint,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { NotatnikFooter } from '@/components/NotatnikA'
import { getLeadMagnetBySlug } from '@/lib/active-lead-magnets'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbędnik - PDF-y i checklisty dla opiekunów psów i kotów',
  path: '/niezbednik',
  description:
    'Niezbędnik: krótkie PDF-y, checklisty i materiały, które pomagają nazwać sytuację i przygotować się do spokojniejszej rozmowy.',
})

type ResourceCard = {
  label: string
  title: string
  description: string
  href: string
  coverSrc: string
  coverAlt: string
  tone: 'dog' | 'cat' | 'neutral'
}

type AudienceItem = {
  title: string
  description: string
  icon: LucideIcon
  tone: 'dog' | 'cat' | 'neutral'
}

function leadMagnetHref(slug: string) {
  const magnet = getLeadMagnetBySlug(slug)

  if (!magnet) {
    throw new Error(`Missing lead magnet required by /niezbednik: ${slug}`)
  }

  if (magnet.slug.includes('pies')) return '/materialy#psy'
  if (magnet.slug.includes('kot')) return '/materialy#koty'

  return '/materialy#start'
}

const heroHighlights = [
  { title: 'Do pobrania', description: 'Wygodne PDF', icon: Download },
  { title: 'Praktyczne', description: 'Od razu do użycia', icon: Heart },
  { title: 'Rzetelne', description: 'Oparte na wiedzy', icon: ShieldCheck },
] as const

const freeResources: ResourceCard[] = [
  {
    label: 'PDF',
    title: '30 sygnałów, które warto zauważyć, zanim problem urośnie',
    description: 'Szeroki start dla opiekuna psa albo kota, gdy trzeba nazwać powtarzające się sygnały.',
    href: leadMagnetHref('30-zachowan'),
    coverSrc: '/branding/pdf-covers/30-zachowan.png',
    coverAlt: 'Okładka PDF 30 sygnałów, które warto zauważyć, zanim problem urośnie',
    tone: 'neutral',
  },
  {
    label: 'PDF',
    title: 'Czy Twój kot żyje w napięciu? Ciche sygnały, które łatwo przegapić',
    description: 'Ciche sygnały stresu, pierwsze obserwacje i bezpieczniejszy porządek w domu.',
    href: leadMagnetHref('kot-zyje-w-napieciu'),
    coverSrc: '/branding/pdf-covers/kot-zyje-w-napieciu.png',
    coverAlt: 'Okładka PDF Czy Twój kot żyje w napięciu? Ciche sygnały, które łatwo przegapić',
    tone: 'cat',
  },
  {
    label: 'PDF',
    title: 'Czy Twój pies potrzebuje więcej ruchu - czy mniej pobudzenia?',
    description: 'Kiedy ruch pomaga, a kiedy dokłada pobudzenia i przeciążenia.',
    href: '/materialy#psy',
    coverSrc: '/branding/pdf-covers/pies-ile-ruchu-potrzebuje.png',
    coverAlt: 'Okładka PDF Czy Twój pies potrzebuje więcej ruchu - czy mniej pobudzenia?',
    tone: 'dog',
  },
  {
    label: 'PDF',
    title: 'Pies sam w domu: co sprawdzić, zanim zaczniesz trening zostawania',
    description: 'Pierwsze kroki przy zostawaniu samemu, nagraniach i bezpiecznej obserwacji.',
    href: leadMagnetHref('pies-sam-w-domu'),
    coverSrc: '/branding/pdf-covers/pies-sam-w-domu.png',
    coverAlt: 'Okładka PDF Pies sam w domu: co sprawdzić, zanim zaczniesz trening zostawania',
    tone: 'dog',
  },
  {
    label: 'PDF',
    title: 'Pierwszy tydzień z kotem: spokojny start bez przyspieszania kontaktu',
    description: 'Spokojny plan wejścia kota do domu: przestrzeń, rytm i kontakt.',
    href: leadMagnetHref('pierwszy-tydzien-z-kotem'),
    coverSrc: '/branding/pdf-covers/pierwszy-tydzien-z-kotem.png',
    coverAlt: 'Okładka PDF Pierwszy tydzień z kotem: spokojny start bez przyspieszania kontaktu',
    tone: 'cat',
  },
  {
    label: 'PDF',
    title: 'Przed Kwadransem: co przygotować, żeby 15 minut naprawdę pomogło',
    description: 'Dwa krótkie materiały porządkujące pierwszą rozmowę o psie albo kocie.',
    href: '/materialy',
    coverSrc: '/branding/pdf-covers/kwadrans.png',
    coverAlt: 'Okładka PDF Przed Kwadransem: co przygotować, żeby 15 minut naprawdę pomogło',
    tone: 'neutral',
  },
]

const audience: AudienceItem[] = [
  {
    title: 'Opiekunowie psów',
    description: 'Materiały o spacerach, emocjach, reakcjach i codziennym życiu.',
    icon: PawPrint,
    tone: 'dog',
  },
  {
    title: 'Opiekunowie kotów',
    description: 'Wsparcie w adaptacji, kuwecie, stresie i relacjach.',
    icon: Cat,
    tone: 'cat',
  },
  {
    title: 'Spokojny pierwszy krok',
    description: 'Zacznij od prostych materiałów - krok po kroku będzie łatwiej.',
    icon: CircleHelp,
    tone: 'neutral',
  },
]

const bundles = [
  {
    title: 'Ścieżka dla psa',
    description: 'Pies i poziom ruchu, pies sam w domu oraz podstawy przed krótką konsultacją.',
    href: '/materialy#psy',
    image: '/branding/homepage/choice-dog-clean.png',
    tone: 'dog',
  },
  {
    title: 'Ścieżka dla kota',
    description: 'Kot w napięciu, pierwszy tydzień z kotem oraz podstawy przed krótką konsultacją.',
    href: '/materialy#koty',
    image: '/branding/homepage/choice-cat-clean.png',
    tone: 'cat',
  },
  {
    title: 'Wszystkie materiały PDF',
    description: 'Krótka biblioteka poradników dla opiekunów psów i kotów, ułożona według najczęstszych sytuacji.',
    href: '/materialy',
    icon: BookOpen,
    tone: 'neutral',
  },
] as const

const values = [
  {
    title: 'Rzetelna wiedza',
    description: 'Oparta na doświadczeniu i ciągłym uczeniu się.',
    icon: Download,
  },
  {
    title: 'Praktyczne podejście',
    description: 'Krok po kroku, bez presji, z myślą o realnym życiu.',
    icon: Home,
  },
  {
    title: 'Dobrostan przede wszystkim',
    description: 'Bez kar, bez awersji, z szacunkiem do zwierzęcia i relacji.',
    icon: PawPrint,
  },
  {
    title: 'Wsparcie, gdy go potrzebujesz',
    description: 'Gdy temat jest trudniejszy - jestem po to, żeby pomóc.',
    icon: ShieldCheck,
  },
] as const

export default function EssentialsPage() {
  return (
    <main className="notatnik-page essentials-index-page">
      <div className="notatnik-shell essentials-index-shell">
        <EditorialIndexTopbar />

        <div className="essentials-index-content">
          <section className="essentials-index-hero" aria-labelledby="essentials-index-title">
            <div className="essentials-index-hero-copy">
              <span className="essentials-index-pill">Niezbędnik</span>
              <h1 id="essentials-index-title">Nie wszystko trzeba od razu konsultować. Czasem najpierw wystarczy dobrze poobserwować.</h1>
              <p>
                Tu znajdziesz krótkie PDF-y, checklisty i materiały, które pomagają nazwać sytuację, zobaczyć powtarzalne sygnały i przygotować się do spokojniejszej rozmowy.
              </p>
              <div className="essentials-index-hero-highlights" aria-label="Najważniejsze cechy materiałów">
                {heroHighlights.map((item) => {
                  const Icon = item.icon

                  return (
                    <span key={item.title}>
                      <Icon size={27} strokeWidth={1.6} aria-hidden="true" />
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="essentials-index-hero-art essentials-index-hero-photo">
              <Image
                src="/branding/side-visuals/blog-laptop-notes.jpg"
                alt="Opiekun szuka informacji przy komputerze"
                width={960}
                height={720}
                priority
              />
            </div>
          </section>

          <section className="essentials-index-bundles essentials-index-bundles-top" aria-labelledby="essentials-index-bundles-title">
            <div className="essentials-index-section-head">
              <h2 id="essentials-index-bundles-title">Wybierz sytuację najbliższą Twojej</h2>
              <p>Nie musisz czytać wszystkiego. Wybierz to, co najbardziej przypomina Wasz dom, spacer albo problem z kuwetą.</p>
            </div>
            <div className="essentials-index-bundle-grid">
              {bundles.map((item) => {
                const Icon = 'icon' in item ? item.icon : null

                return (
                  <article key={item.title} className={`essentials-index-bundle-card is-${item.tone}`}>
                    <span className="essentials-index-bundle-media" aria-hidden="true">
                      {'image' in item ? (
                        <Image src={item.image} alt="" width={112} height={112} />
                      ) : Icon ? (
                        <Icon size={72} strokeWidth={1.55} />
                      ) : null}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <Link href={item.href} prefetch={false} className="essentials-index-small-link">
                        <span>Zobacz zestaw</span>
                        <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="essentials-index-layout" aria-label="Materiały do pobrania">
            <div className="essentials-index-main">
              <div className="essentials-index-section-head">
                <h2>Zacznij bez płacenia i bez presji</h2>
                <p>Pobierz, przejrzyj spokojnie i sprawdź, co zaczyna się powtarzać.</p>
              </div>

              <div className="essentials-index-resource-grid">
                {freeResources.map((item) => (
                  <article key={item.title} className="essentials-index-resource-card">
                    <div className={`essentials-index-resource-cover is-${item.tone}`}>
                      <Image
                        src={item.coverSrc}
                        alt={item.coverAlt}
                        width={420}
                        height={540}
                        sizes="(max-width: 780px) 86vw, (max-width: 1180px) 30vw, 280px"
                      />
                    </div>
                    <span className="essentials-index-resource-label">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <Link href={item.href} prefetch={false} className="essentials-index-download">
                      <span>Sprawdź, czy ten PDF pasuje do Twojej sytuacji</span>
                      <Download size={16} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            <aside className="essentials-index-sidebar" aria-label="Dla kogo są materiały">
              <section className="essentials-index-audience-card">
                <h2>Dla kogo?</h2>
                <div className="essentials-index-audience-list">
                  {audience.map((item) => {
                    const Icon = item.icon

                    return (
                      <article key={item.title}>
                        <span className={`essentials-index-audience-icon is-${item.tone}`} aria-hidden="true">
                          <Icon size={23} strokeWidth={1.8} />
                        </span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

            </aside>
          </section>

          <section className="essentials-index-newsletter" aria-labelledby="essentials-index-newsletter-title">
            <span className="essentials-index-newsletter-icon" aria-hidden="true">
              <Mail size={40} strokeWidth={1.6} />
            </span>
            <div>
              <h2 id="essentials-index-newsletter-title">Raz w miesiącu spokojna porcja wiedzy</h2>
              <p>Raz w miesiącu spokojna porcja wiedzy o psach, kotach i pierwszych krokach w trudnych sytuacjach.</p>
            </div>
            <form className="essentials-index-newsletter-form" action="/newsletter">
              <label className="sr-only" htmlFor="essentials-newsletter-email">
                Twój e-mail
              </label>
              <input id="essentials-newsletter-email" name="email" type="email" placeholder="Twój e-mail" />
              <button type="submit">Zapisz się</button>
              <small>Bez spamu, bez codziennych maili. Możesz wypisać się jednym kliknięciem.</small>
            </form>
          </section>

          <section className="essentials-index-value-strip" aria-label="Wartości">
            {values.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title}>
                  <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </article>
              )
            })}
          </section>
        </div>

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
