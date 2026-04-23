import type { Metadata } from 'next'
import Link from 'next/link'
import { BookRequestForm } from '@/components/BookRequestForm'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikPageShell, NotatnikSectionHead } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import { readBookingServiceSearchParam, readBookingSpeciesSearchParam, readSearchParam } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Rezerwacja Kwadransa z behawiorystÄ…',
  path: '/book',
  description:
    'Prosba o rezerwacje Kwadransu, Dwoch kwadransow albo Pelnej konsultacji. PayPal albo BLIK na telefon po potwierdzeniu terminu, odpowiedz w godzinach 9-21.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const PAYMENT_STEPS = [
  '1. Wybierasz usĹ‚ugÄ™ i wpisujesz preferowane terminy.',
  '2. Dostajesz odpowiedz z potwierdzonym terminem i dalszym krokiem platnosci: PayPal albo BLIK na telefon.',
  '3. Oplacasz rezerwacje przez PayPal albo BLIK na telefon w godzinach 9-21, poza dniami ustawowo wolnymi.',
  '4. Potwierdzenie przychodzi do 15 minut wraz z linkiem do rozmowy.',
] as const

const NEXT_STEPS = [
  '1. Potwierdzam jeden z terminĂłw albo odsyĹ‚am najbliĹĽszÄ… alternatywÄ™.',
  '2. W mailu dostajesz PayPal albo instrukcje BLIK na telefon.',
  '3. Po wpĹ‚acie potwierdzam rezerwacjÄ™ i odsyĹ‚am link do rozmowy.',
] as const

export default function BookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const rawService = readSearchParam(searchParams?.service)
  const service =
    rawService === 'kwadrans-na-juz' ? 'kwadrans-na-juz' : (readBookingServiceSearchParam(searchParams?.service) ?? 'szybka-konsultacja-15-min')
  const species = readBookingSpeciesSearchParam(searchParams?.species)

  return (
    <NotatnikPageShell
      tag="Rezerwacja / PayPal lub BLIK po potwierdzeniu"
      navItems={navItems}
      ctaHref="/cennik"
      ctaLabel="Zobacz cennik"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorystÄ…"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Rezerwacja', path: '/book' },
          ]),
          getServiceJsonLd({
            name: 'Rezerwacja konsultacji behawioralnych online',
            description: 'Prosba o rezerwacje Kwadransu, Dwoch kwadransow albo Pelnej konsultacji z potwierdzeniem PayPal lub BLIK po mailu.',
            serviceUrl: '/book',
            offerCatalog: [
              // nazwa uslugi: Kwadrans z behawiorysta
              // format: 15 min audio bez kamery
              { name: 'Kwadrans z behawiorystÄ…', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min audio.', url: '/book?service=konsultacja-30-min', price: 129 },
              { name: 'PeĹ‚na konsultacja', description: '60 min audio albo video.', url: '/book?service=konsultacja-behawioralna-online', price: 350 },
            ],
          }),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Rezerwacja / spokojny start</div>
          <h1>
            Rezerwacja <em>Kwadransa z behawiorystÄ…</em>.
          </h1>
          <p>
            Wybierasz usĹ‚ugÄ™, wpisujesz 2-4 zdania opisu i proponujesz terminy. ResztÄ™ potwierdzam mailem, bez telefonu
            na stronie i bez kalendarza do klikania.
          </p>
          <NextSlot className="top-gap-small" />
          <div className="notatnik-subhero-actions">
            <Link href="/cennik" prefetch={false} className="notatnik-btn">
              <span>PorĂłwnaj usĹ‚ugi</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Napisz wiadomoĹ›Ä‡</span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dzieje siÄ™ dalej</div>
          <h3>Platnosc przychodzi dopiero po potwierdzeniu terminu.</h3>
          <p>
            Ten model porzadkuje rezerwacje bez publicznego numeru telefonu. Najpierw uzgadniamy termin, potem wysylam
            PayPal albo instrukcje BLIK na telefon i potwierdzam rezerwacje.
          </p>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="UsĹ‚ugi" title="Najpierw porĂłwnaj trzy formaty." />
        <ServicesComparison species={species} />
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="PĹ‚atnoĹ›Ä‡" title="Jak przebiega pĹ‚atnoĹ›Ä‡." />
        <div className="notatnik-steps">
          {PAYMENT_STEPS.map((step, index) => (
            <article key={step} className="notatnik-step">
              <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz rezerwacji</div>
          <h2>
            WyĹ›lij proĹ›bÄ™ o termin, <em>a ja odpiszÄ™ z potwierdzeniem.</em>
          </h2>
          <p className="notatnik-contact-lede">
            Linki z `?service=` i `?species=` dalej dziaĹ‚ajÄ…. Formularz wstÄ™pnie zaznacza wybranÄ… usĹ‚ugÄ™ i gatunek, ĹĽeby
            nie gubiÄ‡ kontekstu po przejĹ›ciu z innych stron.
          </p>

          <div className="contact-form-card" id="formularz">
            <BookRequestForm initialService={service} initialSpecies={species} />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Po wysĹ‚aniu proĹ›by</h3>
          <p>Ten sam trzyetapowy proces zobaczysz teĹĽ w mailu zwrotnym, ĹĽeby od razu byĹ‚o jasne, co stanie siÄ™ dalej.</p>

          <div className="notatnik-steps">
            {NEXT_STEPS.map((step, index) => (
              <article key={step} className="notatnik-step">
                <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
                <p>{step}</p>
              </article>
            ))}
          </div>

          <div className="notatnik-contact-note">
            <strong>Regulaminy</strong>
            <p>
              Przy rezerwacji akceptujesz{' '}
              <Link href="/regulamin" prefetch={false}>
                regulamin ogĂłlny
              </Link>{' '}
              oraz{' '}
              <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
                regulamin PeĹ‚nej konsultacji
              </Link>
              . Dla peĹ‚nej konsultacji warunki zwrotĂłw i odstÄ…pienia sÄ… opisane osobno.
            </p>
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
