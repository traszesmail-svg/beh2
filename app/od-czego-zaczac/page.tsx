import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ListChecks, MessageSquareText } from 'lucide-react'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Nie wiem, od czego zaczac',
  path: '/od-czego-zaczac',
  description: 'Trzy spokojne sciezki startu: materialy, wiadomosc albo pelniejszy quiz prowadzacy do najlepszego kolejnego kroku.',
})

const startChoices = [
  {
    href: '/niezbednik',
    icon: BookOpen,
    label: 'Materiały',
    title: 'Chcę zacząć od materiałów',
    copy: 'Przejdź do Niezbędnika: gotowe materiały i PDF-y, gdy chcesz najpierw spokojnie sprawdzić temat.',
  },
  {
    href: '/kontakt#formularz',
    icon: MessageSquareText,
    label: 'Wiadomość',
    title: 'Chcę napisać wiadomość',
    copy: 'Opisz krótko sytuację. To dobry wybór, jeśli nie wiesz, czy potrzebny jest PDF, Kwadrans czy pełniejsza rozmowa.',
  },
  {
    href: '/quiz',
    icon: ListChecks,
    label: 'Quiz',
    title: 'Chcę najpierw zrobić quiz',
    copy: 'Pełniejszy quiz prowadzi przez materiały/PDF, a jeśli temat wymaga rozmowy, kieruje do Kwadransu lub konsultacji.',
  },
] as const

export default function StartHerePage() {
  return (
    <NotatnikPageShell
      tag="Pierwszy krok"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/quiz"
      ctaLabel="Zrob quiz"
      footerPrimaryHref="/quiz"
      footerPrimaryLabel="Zrob quiz"
      sideVisualVariant="mixed"
      pageClassName="start-choice-page"
    >
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Od czego zaczac', path: '/od-czego-zaczac' },
        ])}
      />

      <section className="start-choice-hero">
        <div className="start-choice-copy">
          <div className="section-eyebrow">Nie wiem, od czego zacząć</div>
          <h1>Wybierz najprostszy pierwszy krok.</h1>
          <p>
            Nie musisz od razu rezerwować rozmowy. Możesz zacząć od materiałów, krótkiej wiadomości
            albo pełniejszego quizu, który podpowiada dalszą ścieżkę.
          </p>
        </div>

        <div className="start-choice-grid" aria-label="Wybierz pierwszy krok">
          {startChoices.map((choice) => {
            const Icon = choice.icon

            return (
              <Link key={choice.href} href={choice.href} prefetch={false} className="start-choice-card">
                <span className="start-choice-icon" aria-hidden="true">
                  <Icon size={30} strokeWidth={1.75} />
                </span>
                <span className="notatnik-mono">{choice.label}</span>
                <strong>{choice.title}</strong>
                <span>{choice.copy}</span>
                <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            )
          })}
        </div>

        <div className="start-choice-note">
          <strong>{FUNNEL_CTA_LABELS.primary}</strong>
          <span>
            Jeśli po materiałach albo quizie sprawa nadal wymaga rozmowy, Kwadrans zostaje najkrótszym kolejnym krokiem.
          </span>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
