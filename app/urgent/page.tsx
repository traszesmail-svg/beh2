import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, NotatnikSectionHead } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { UrgentForm } from './UrgentForm'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kwadrans na juz - termin w 15 minut',
  path: '/urgent',
  description:
    'Wyslij prosbe o Kwadrans na juz. Termin w 15 minut, 99 zl, 15 min audio bez kamery. Odpowiedz e-mailem i SMS w ciagu 15 minut.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Wypisujesz formularz',
    body: 'Podajesz imie, e-mail, temat i 2-3 zdania opisu. Telefon opcjonalnie, zeby dostac SMS z potwierdzeniem.',
  },
  {
    number: '02',
    title: 'Dostajesz e-mail i SMS',
    body: 'Zaraz po kliknieciu dostajesz wiadomosc, ze prosba dotarla. Na stronie uruchamia sie licznik 15 minut.',
  },
  {
    number: '03',
    title: 'Odpiszę w ciagu 15 minut',
    body: 'Proponuje termin na kolejne 15 minut albo najblizsze mozliwe okno. Dostaniesz link do formularza rezerwacji z PayPal.me albo BLIK.',
  },
] as const

export default function UrgentPage() {
  return (
    <NotatnikPageShell
      tag="Kwadrans na juz / 99 zl"
      navItems={navItems}
      ctaHref="/urgent"
      ctaLabel="Kwadrans na juz / 99 zl"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Kwadrans na juz', path: '/urgent' },
          ]),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Kwadrans na juz / pilny termin</div>
          <h1>
            Kwadrans na juz <em>— termin w 15 minut.</em>
          </h1>
          <p>
            Ten sam format co Kwadrans: 15 minut audio bez kamery, jeden konkretny kierunek. Roznica to czas oczekiwania
            — odpiszę z terminem w ciagu 15 minut od Twojej prosby.
          </p>
          <div className="info-box top-gap-small">
            Cena: 99 zl. Platnosc przychodzi dopiero po potwierdzeniu terminu — PayPal.me albo BLIK.
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dostajesz</div>
          <h3>15 minut audio bez kamery z terminem w 15 minut.</h3>
          <p>
            Jeden konkretny priorytet i pierwszy ruch. Jesli temat okaze sie szerszy, od razu bedzie
            widac, czy potrzebujesz Dwoch kwadransow albo Pelnej konsultacji.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="I." kicker="Jak to dziala" title="Trzy kroki od formularza do terminu." />
        <div className="notatnik-steps">
          {HOW_IT_WORKS.map((step) => (
            <article key={step.number} className="notatnik-step">
              <div className="notatnik-step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz Kwadransu na juz</div>
          <h2>
            Wyslij prosbe, <em>a ja odpiszę z terminem w ciagu 15 minut.</em>
          </h2>
          <p className="notatnik-contact-lede">
            Podaj gatunek, temat i krotki opis. Termin dostaniesz mailem — bez telefonu na stronie,
            bez kalendarza do klikania.
          </p>

          <div id="formularz">
            <UrgentForm />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Czego tu nie ma</h3>
          <p>Nie ma publicznego numeru telefonu na stronie. Nie ma kalendarza do klikania. Nie ma automatycznej platnosci.</p>
          <p>Jest formularz, moj mail i odpowiedz w 15 minut z terminem i linkiem do PayPal.me albo BLIK.</p>

          <h3 className="top-gap-small">Po wyslaniu prosby</h3>
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <p>Na podany e-mail dostaniesz potwierdzenie, ze prosba dotarla.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <p>Odpiszę z proponowanym terminem w ciagu 15 minut.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <p>Po wplacie 99 zl przez PayPal.me albo BLIK potwierdzam rezerwacje i wysylam link do rozmowy.</p>
            </article>
          </div>

          <div className="notatnik-contact-note">
            <strong>Inne formaty</strong>
            <p>
              Nie potrzebujesz terminu w 15 minut?{' '}
              <Link href="/book?service=szybka-konsultacja-15-min" prefetch={false} className="notatnik-inline-link">
                Zarezerwuj zwykly Kwadrans za 69 zl
              </Link>
              {' '}albo{' '}
              <Link href="/cennik" prefetch={false} className="notatnik-inline-link">
                porownaj wszystkie uslugi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
