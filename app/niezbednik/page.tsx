import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Cat,
  CircleHelp,
  ClipboardCheck,
  Download,
  Heart,
  Home,
  Mail,
  PawPrint,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { Footer } from '@/components/Footer'
import { PetLeafHeroArt } from '@/components/PetLeafHeroArt'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Niezbędnik - praktyczne materiały dla opiekunów psów i kotów',
  path: '/niezbednik',
  description:
    'Niezbędnik: darmowe checklisty, krótkie poradniki i plany do pobrania dla opiekunów psów i kotów.',
})

type ResourceCard = {
  label: string
  title: string
  description: string
  href: string
  icon: LucideIcon
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

  return `/bezplatne-materialy/${magnet.slug}`
}

const heroHighlights = [
  { title: 'Do pobrania', description: 'Wygodne PDF', icon: Download },
  { title: 'Praktyczne', description: 'Od razu do użycia', icon: Heart },
  { title: 'Rzetelne', description: 'Oparte na wiedzy', icon: ShieldCheck },
] as const

const freeResources: ResourceCard[] = [
  {
    label: 'CHECKLISTA',
    title: 'Pierwszy dzień psa w domu',
    description: 'Lista najważniejszych kroków, które pomagają Wam dobrze zacząć.',
    href: leadMagnetHref('pies-reaktywnosc-5-krokow'),
    icon: ClipboardCheck,
    tone: 'dog',
  },
  {
    label: 'CHECKLISTA',
    title: 'Kocia adaptacja w nowym domu',
    description: 'Jak przygotować przestrzeń, wspierać poczucie bezpieczeństwa i dać czas.',
    href: '/materialy/kot-chowa-sie-po-zmianach',
    icon: Home,
    tone: 'cat',
  },
  {
    label: 'PORADNIK',
    title: 'Spacery bez frustracji',
    description: 'Praktyczne wskazówki, jak budować spokojne i przewidywalne spacery.',
    href: '/materialy/pies-ile-ruchu-potrzebuje',
    icon: PawPrint,
    tone: 'dog',
  },
  {
    label: 'MINI PORADNIK',
    title: 'Lęk u psa - pierwsze kroki',
    description: 'Jak rozpoznać lęk i jak mądrze wesprzeć psa na co dzień.',
    href: '/materialy/pies-zostaje-sam',
    icon: Heart,
    tone: 'dog',
  },
  {
    label: 'CHECKLISTA',
    title: 'Kuweta bez problemów',
    description: 'Co ma znaczenie, gdy kot unika kuwety i jak krok po kroku wrócić do równowagi.',
    href: leadMagnetHref('kot-kuweta-checklista'),
    icon: Cat,
    tone: 'cat',
  },
  {
    label: 'PLANER',
    title: 'Plan pracy z psem - 4 tygodnie',
    description: 'Gotowy szkielet pracy krok po kroku. Dopasuj go do Waszych potrzeb.',
    href: leadMagnetHref('przygotowanie-do-konsultacji-online'),
    icon: CalendarDays,
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
    title: 'Nie wiesz, od czego zacząć?',
    description: 'Zacznij od prostych materiałów - krok po kroku będzie łatwiej.',
    icon: CircleHelp,
    tone: 'neutral',
  },
]

const bundles = [
  {
    title: 'Zestaw: Spokojne spacery',
    description: 'Checklisty, plan pracy i wskazówki, które pomagają ograniczyć ciągnięcie, reakcje i stres na spacerach.',
    href: '/materialy/pakiet/pakiet-trudny-pies',
    image: '/branding/homepage/choice-dog-clean.png',
    tone: 'dog',
  },
  {
    title: 'Zestaw: Kocia równowaga',
    description: 'Kuweta, stres, wzbogacanie środowiska i relacje między kotami w praktyce.',
    href: '/materialy/pakiet/pakiet-kuweta',
    image: '/branding/homepage/choice-cat-clean.png',
    tone: 'cat',
  },
  {
    title: 'Zestaw: Zrozumieć zachowanie',
    description: 'Podstawy komunikacji, emocji i uczenia się. Solidna baza dla każdego opiekuna.',
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

function ResourceIcon({ icon: Icon, tone }: { icon: LucideIcon; tone: ResourceCard['tone'] }) {
  return (
    <span className={`essentials-index-resource-icon is-${tone}`} aria-hidden="true">
      <Icon size={58} strokeWidth={1.55} />
    </span>
  )
}

export default function EssentialsPage() {
  return (
    <main className="notatnik-page essentials-index-page">
      <div className="notatnik-shell essentials-index-shell">
        <EditorialIndexTopbar />

        <div className="essentials-index-content">
          <section className="essentials-index-hero" aria-labelledby="essentials-index-title">
            <div className="essentials-index-hero-copy">
              <span className="essentials-index-pill">Niezbędnik</span>
              <h1 id="essentials-index-title">Praktyczne materiały, które naprawdę pomagają.</h1>
              <p>
                Sprawdzone checklisty, mini poradniki i planery do pobrania. Stworzone, żeby wspierać Cię w
                codziennym życiu z psem lub kotem.
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

            <div className="essentials-index-hero-art" aria-hidden="true">
              <PetLeafHeroArt />
            </div>
          </section>

          <section className="essentials-index-layout" aria-label="Materiały do pobrania">
            <div className="essentials-index-main">
              <div className="essentials-index-section-head">
                <h2>Bezpłatne materiały</h2>
                <p>Pobierz i korzystaj na co dzień.</p>
              </div>

              <div className="essentials-index-resource-grid">
                {freeResources.map((item) => (
                  <article key={item.title} className="essentials-index-resource-card">
                    <ResourceIcon icon={item.icon} tone={item.tone} />
                    <span className="essentials-index-resource-label">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <Link href={item.href} prefetch={false} className="essentials-index-download">
                      <span>Pobierz PDF</span>
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

              <section className="essentials-index-choice-card">
                <div>
                  <h2>Nie wiesz, co wybrać?</h2>
                  <p>Napisz krótko o swojej sytuacji - podpowiem, które materiały będą dla Ciebie najważniejsze.</p>
                </div>
                <div className="essentials-index-choice-actions">
                  <Link href="/kontakt#formularz" prefetch={false} className="essentials-index-button is-primary">
                    Wyślij krótką wiadomość
                  </Link>
                  <Link href="/wybor" prefetch={false} className="essentials-index-button is-secondary">
                    Umów pierwszy krok
                  </Link>
                </div>
              </section>
            </aside>
          </section>

          <section className="essentials-index-bundles" aria-labelledby="essentials-index-bundles-title">
            <div className="essentials-index-section-head">
              <h2 id="essentials-index-bundles-title">Gotowe zestawy tematyczne</h2>
              <p>Więcej wiedzy w jednym miejscu. Zestawy będą rozwijane.</p>
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

          <section className="essentials-index-newsletter" aria-labelledby="essentials-index-newsletter-title">
            <span className="essentials-index-newsletter-icon" aria-hidden="true">
              <Mail size={40} strokeWidth={1.6} />
            </span>
            <div>
              <h2 id="essentials-index-newsletter-title">Nowe materiały prosto na Twoją skrzynkę</h2>
              <p>Zapisz się na newsletter i otrzymuj praktyczne materiały, nowości i wskazówki.</p>
            </div>
            <form className="essentials-index-newsletter-form" action="/newsletter">
              <label className="sr-only" htmlFor="essentials-newsletter-email">
                Twój e-mail
              </label>
              <input id="essentials-newsletter-email" name="email" type="email" placeholder="Twój e-mail" />
              <button type="submit">Zapisz się</button>
              <small>Bez spamu. W każdej chwili możesz się wypisać.</small>
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

        <Footer variant="full" showReviews={false} />
      </div>
    </main>
  )
}
