import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
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
  const urgentNowHref = buildBookHref(null, 'kwadrans-na-juz', false, species)
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, species)
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const faqItems = FAQ_SHORTLISTS.contact.slice(0, 2)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
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
                    @coapebehawiorysta
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
              <div className="notatnik-mono notatnik-text-accent">Szybciej niz wiadomosc</div>
              <h3>Kwadrans z behawiorysta</h3>
              <p>15 min audio / 69 zl. Jesli wiesz, ze chcesz porozmawiac, to najszybsza droga do pierwszego kroku.</p>
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj termin</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Pilny temat</div>
              <h4>Kwadrans na juz</h4>
              <p>15 min audio / 99 zl. To ten sam format co zwykly Kwadrans, ale z terminem w 15 minut i sciezka priorytetowa.</p>
              <Link href={urgentNowHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Zarezerwuj Kwadrans na juz</span>
              </Link>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Srodek lejka</div>
              <h4>Dwa kwadranse</h4>
              <p>30 min / 169 zl. Dobre rozwiazanie, gdy 15 minut to za malo, ale nie potrzebujesz jeszcze najszerszej konsultacji.</p>
              <Link href={bridgeHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Przejdz do 30 minut</span>
              </Link>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Szerszy temat</div>
              <h4>Pelna konsultacja behawioralna</h4>
              <p>60 min / 470 zl. Diagnoza, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp dla spraw zlozonych albo przewleklych.</p>
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Przejdz do konsultacji</span>
              </Link>
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
