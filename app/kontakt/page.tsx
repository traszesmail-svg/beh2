import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikTopbar } from '@/components/NotatnikA'
import { buildBookHref, readBookingSpeciesSearchParam } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { buildMarketingMetadata } from '@/lib/seo'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails, getPublicContactEmailNote } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt i rezerwacja konsultacji',
  path: '/kontakt',
  description: 'Kontakt, formularz i rezerwacja konsultacji behawioralnych online dla opiekunow psow i kotow.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/faq', label: 'FAQ' },
]

function getSpeciesCopy(species: 'pies' | 'kot' | null) {
  if (species === 'pies') {
    return {
      message: 'Jesli sprawa dotyczy psa, po prostu wpisz to w wiadomosci.',
    }
  }

  if (species === 'kot') {
    return {
      message: 'Jesli sprawa dotyczy kota, po prostu wpisz to w wiadomosci.',
    }
  }

  return {
    message: 'W wiadomosci mozesz od razu wskazac wlasciwy gatunek.',
  }
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const species = readBookingSpeciesSearchParam(searchParams?.species)
  const speciesCopy = getSpeciesCopy(species)
  const publicContact = getPublicContactDetails()
  const publicContactNote = getPublicContactEmailNote()
  const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)

  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Kontakt / napisz wiadomosc" navItems={navItems} ctaHref={quickHref} ctaLabel="Kwadrans / 69 zl" />

        <div className="notatnik-contact">
          <div className="notatnik-contact-left">
            <div className="notatnik-mono notatnik-kicker-spaced">Kontakt / bez presji</div>
            <h1>
              Jesli wolisz najpierw <em>zapytac</em>, napisz krotka wiadomosc.
            </h1>
            <p className="notatnik-contact-lede">
              Wystarczy gatunek, temat i kilka zdan. {COPY_HELPERS.contactResponseWindow} {speciesCopy.message}
            </p>

            <div className="contact-form-card" id="formularz">
              <ContactLeadForm />
            </div>
          </div>

          <div className="notatnik-contact-right notatnik-kinfo">
            <h3>Co stanie sie dalej</h3>
            <p>
              Odpowiem na adres e-mail z formularza i wskaze najprostszy kolejny krok: Kwadrans, Dwa kwadranse, pelna konsultacje albo material z
              Niezbednika.
            </p>

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
              <p>15 min audio / 69 zl. Jesli wiesz, ze chcesz porozmawiac, rezerwacja jest najszybsza droga.</p>
              <Link href={quickHref} prefetch={false} className="notatnik-btn">
                <span>Zarezerwuj termin</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>

            <div className="notatnik-side-cta">
              <div className="notatnik-mono notatnik-text-accent">Szerszy temat</div>
              <h4>Pelna konsultacja behawioralna</h4>
              <p>Jesli problem jest bardziej zlozony, mozesz od razu wejsc w najpelniejsza konsultacje online, ok. 2 h lacznie.</p>
              <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Przejdz do konsultacji</span>
              </Link>
            </div>

            <div className="notatnik-contact-note">
              <strong>Nota</strong>
              <p>{publicContactNote}</p>
            </div>
          </div>
        </div>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorysta" />
      </div>
    </main>
  )
}
