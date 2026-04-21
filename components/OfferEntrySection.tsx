import Link from 'next/link'
import { BOOKING_SERVICE_ONLINE_PRICE } from '@/lib/booking-services'
import { buildBookHref, type BookingSpecies } from '@/lib/booking-routing'
import { COPY_CTA, COPY_HELPERS, COPY_SERVICE_NAMES } from '@/lib/copy-governance'
import { DEFAULT_PRICE_PLN, formatPricePln } from '@/lib/pricing'

type OfferEntrySectionProps = {
  species?: BookingSpecies | null
  sectionId?: string
  eyebrow?: string
  title?: string
  description?: string
}

function getSpeciesLabel(species?: BookingSpecies | null) {
  if (species === 'pies') {
    return 'psa'
  }

  if (species === 'kot') {
    return 'kota'
  }

  return 'psa lub kota'
}

function getAudioDescription(species?: BookingSpecies | null) {
  if (species === 'pies') {
    return `${COPY_SERVICE_NAMES.primary} to najprostszy start dla opiekuna psa, gdy chcesz omowic jedno pytanie albo spokojnie ustalic, od czego zaczac.`
  }

  if (species === 'kot') {
    return `${COPY_SERVICE_NAMES.primary} to najprostszy start dla opiekuna kota, gdy chcesz uporzadkowac temat i sprawdzic najlepszy pierwszy krok.`
  }

  return `${COPY_SERVICE_NAMES.primary} to najprostszy start dla opiekuna psa lub kota, gdy chcesz uporzadkowac jeden temat i ruszyc z wlasciwego miejsca.`
}

function getFullConsultationDescription(species?: BookingSpecies | null) {
  if (species === 'pies') {
    return 'Dla psa przy temacie bardziej zlozonym, dluzej trwajacym albo obejmujacym kilka watkow.'
  }

  if (species === 'kot') {
    return 'Dla kota przy temacie szerszym, dluzej trwajacym albo obejmujacym kilka obszarow naraz.'
  }

  return 'Dla spraw bardziej zlozonych, dluzej trwajacych albo wielowatkowych, gdy potrzebna jest pelniejsza konsultacja.'
}

export function OfferEntrySection({
  species = null,
  sectionId,
  eyebrow = 'Oferta',
  title = 'Zacznij od Kwadransu z behawiorysta. Jesli temat jest szerszy, wybierz Dwa kwadranse albo pelna konsultacje.',
  description = 'Kwadrans zostaje nazwa uslugi, a 15 min audio bez kamery tylko opisuje jego format. Dwa kwadranse sa etapem posrednim, Niezbednik zostaje opcja materialowa, a wiadomosc sluzy do krotkiego doprecyzowania tematu.',
}: OfferEntrySectionProps) {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const fullConsultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const toolkitHref = '/niezbednik'
  const messageHref = species ? `/kontakt?species=${species}#formularz` : '/kontakt#formularz'
  const speciesLabel = getSpeciesLabel(species)

  return (
    <section className="panel section-panel editorial-section" id={sectionId}>
      <div className="editorial-section-head">
        <div className="editorial-section-head-copy">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        <p className="editorial-section-lead">{description}</p>
      </div>

      <div className="hero-actions editorial-final-actions top-gap-small">
        <Link href={audioHref} prefetch={false} className="button button-primary big-button">
          {COPY_CTA.primary}
        </Link>
        <Link href={toolkitHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.toolkit}
        </Link>
        <Link href={fullConsultationHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.consultation}
        </Link>
        <Link href={messageHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.contact}
        </Link>
      </div>

      <div className="card-grid three-up top-gap">
        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">{COPY_SERVICE_NAMES.primary}</div>
          <h3>{COPY_SERVICE_NAMES.primary}</h3>
          <p>{getAudioDescription(species)}</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi">
            <span>{COPY_SERVICE_NAMES.primaryDescriptor}</span>
            <span>{formatPricePln(DEFAULT_PRICE_PLN)}</span>
            <span>najprostszy start</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy temat jest jeden albo chcesz spokojnie ustalic kierunek bez przechodzenia od razu do dluzszej konsultacji.</p>
          <div className="hero-actions top-gap-small">
            <Link href={audioHref} prefetch={false} className="button button-primary">
              {COPY_CTA.primary}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Niezbednik</div>
          <h3>{COPY_SERVICE_NAMES.toolkit}</h3>
          <p>{COPY_HELPERS.toolkitIntro}</p>
          <div className="editorial-hero-meta" aria-label="Zakres materialow">
            <span>materialy wlasne</span>
            <span>ksiazki</span>
            <span>narzedzia</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy chcesz wrocic do materialow albo przygotowac sie do rozmowy.</p>
          <div className="hero-actions top-gap-small">
            <Link href={toolkitHref} prefetch={false} className="button button-ghost">
              {COPY_CTA.toolkit}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Pelna konsultacja</div>
          <h3>Pelna konsultacja behawioralna</h3>
          <p>{getFullConsultationDescription(species)}</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi">
            <span>ok. 2 h</span>
            <span>{formatPricePln(BOOKING_SERVICE_ONLINE_PRICE)}</span>
            <span>online</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy problem trwa dluzej, wraca albo obejmuje kilka obszarow naraz.</p>
          <div className="hero-actions top-gap-small">
            <Link href={fullConsultationHref} prefetch={false} className="button button-ghost">
              {COPY_CTA.consultation}
            </Link>
          </div>
        </article>
      </div>

      <p className="muted top-gap-small">
        {COPY_HELPERS.startFromAudio}{' '}
        <Link href={messageHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.contact.toLowerCase()}
        </Link>{' '}
        pomaga wtedy, gdy chcesz tylko krotko doprecyzowac temat.
      </p>
    </section>
  )
}
