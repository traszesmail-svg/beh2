import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref, readBookingSpeciesSearchParam } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails, getPublicContactEmailNote } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt i rezerwacja konsultacji',
  path: '/kontakt',
  description: 'Kontakt i rezerwacja konsultacji | formularz, e-mail i spokojny pierwszy krok dla opiekunow psow i kotow.',
})

function getSpeciesCopy(species: 'pies' | 'kot' | null) {
  if (species === 'pies') {
    return 'Jesli sprawa dotyczy psa, wpisz to po prostu w wiadomosci.'
  }

  if (species === 'kot') {
    return 'Jesli sprawa dotyczy kota, wpisz to po prostu w wiadomosci.'
  }

  return 'W wiadomosci mozesz od razu wskazac wlasciwy gatunek.'
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const species = readBookingSpeciesSearchParam(searchParams?.species)
  const publicContact = getPublicContactDetails()
  const publicContactNote = getPublicContactEmailNote()
  const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const faqItems = FAQ_SHORTLISTS.contact.slice(0, 2)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="contact" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Kontakt / napisz wiadomosc" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <div className="notatnik-contact">
          <div className="notatnik-contact-left">
            <div className="notatnik-mono notatnik-kicker-spaced">Kontakt / bez presji</div>
            <h1>
              Napisz, <em>zanim zarezerwujesz</em>.
            </h1>
            <p className="notatnik-contact-lede">
              Wystarczy gatunek, temat i kilka zdan. {COPY_HELPERS.contactResponseWindow} {getSpeciesCopy(species)}
            </p>

            <div className="contact-form-card" id="formularz">
              <ContactLeadForm />
            </div>
          </div>

          <div className="notatnik-contact-right notatnik-kinfo">
            <h3>Co stanie sie dalej</h3>
            <p>Odpowiem na adres e-mail z formularza i wskaze najprostszy kolejny krok: Kwadrans, Kwadrans na juz, Dwa kwadranse, Pelna konsultacje albo material startowy.</p>

            <div className="notatnik-info-stack">
              <div className="notatnik-kinfo-row">
                <span>E-mail</span>
                <span>{publicContact.email}</span>
              </div>
              <div className="notatnik-kinfo-row">
                <span>Odpowiedz</span>
                <span>1-2 dni robocze</span>
              </div>
              <div className="notatnik-kinfo-row">
                <span>Forma</span>
                <span>Formularz / e-mail</span>
              </div>
              <div className="notatnik-kinfo-row">
                <span>Instagram</span>
                <span>
                  <Link href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    @regulskibehawiorysta
                  </Link>
                </span>
              </div>
              <div className="notatnik-kinfo-row">
                <span>Profil</span>
                <span>
                  <Link href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    behawioryscicoape.pl/Regulski
                  </Link>
                </span>
              </div>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Najprostszy start</div>
              <h3>Kwadrans z behawiorysta</h3>
              <p>15 min audio bez kamery / 69 zl. Jesli wiesz, ze chcesz porozmawiac, to najkrotszy pierwszy krok bez dlugiego przygotowania.</p>
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj Kwadrans</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Sprawa zlozona albo przewlekla</div>
              <h4>Pelna konsultacja behawioralna</h4>
              <p>60 min / 470 zl. Diagnoza sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp. Dla tematow, ktore wymagaja wiecej czasu i szerszego wejscia.</p>
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Umow pelna konsultacje</span>
              </Link>
            </div>

            <div className="notatnik-contact-note notatnik-contact-note-compact">
              <p>Jesli nie jestes pewien, ktory format pasuje do Twojej sytuacji, napisz krotka wiadomosc przez formularz. Odpiszę z rekomendacją.</p>
            </div>

            <div className="notatnik-contact-note">
              <strong>Nota</strong>
              <p>{publicContactNote}</p>
            </div>

            <div className="notatnik-contact-faq">
              <div className="notatnik-faq-grid">
                {faqItems.map((item) => (
                  <article key={item.question} className="notatnik-faq-item">
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
