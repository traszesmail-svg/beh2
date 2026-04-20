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
    return 'Dla opiekuna psa, gdy chcesz omówić jedno pytanie albo spokojnie ustalić, od czego zacząć.'
  }

  if (species === 'kot') {
    return 'Dla opiekuna kota, gdy chcesz uporządkować temat i sprawdzić najlepszy pierwszy krok.'
  }

  return 'Dla opiekuna psa lub kota, gdy chcesz uporządkować jeden temat i ruszyć z właściwego miejsca.'
}

function getFullConsultationDescription(species?: BookingSpecies | null) {
  if (species === 'pies') {
    return 'Dla psa przy temacie bardziej złożonym, dłużej trwającym albo obejmującym kilka wątków.'
  }

  if (species === 'kot') {
    return 'Dla kota przy temacie szerszym, dłużej trwającym albo obejmującym kilka obszarów naraz.'
  }

  return 'Dla spraw bardziej złożonych, dłużej trwających albo wielowątkowych, gdy potrzebna jest pełniejsza konsultacja.'
}

export function OfferEntrySection({
  species = null,
  sectionId,
  eyebrow = 'Oferta',
  title = 'Zacznij od Kwadransu z behawiorystą. Jeśli temat jest szerszy, wybierz konsultację 60 min.',
  description = 'Niezbędnik zostaje drugą opcją, a wiadomość służy tylko do krótkiego doprecyzowania tematu.',
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
          <div className="section-eyebrow">Kwadrans z behawiorystą</div>
          <h3>{COPY_SERVICE_NAMES.primary}</h3>
          <p>{getAudioDescription(species)}</p>
          <div className="editorial-hero-meta" aria-label="Parametry usługi">
            <span>15 min</span>
            <span>{formatPricePln(DEFAULT_PRICE_PLN)}</span>
            <span>bez kamery</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy temat jest jeden albo chcesz spokojnie ustalić kierunek.</p>
          <div className="hero-actions top-gap-small">
            <Link href={audioHref} prefetch={false} className="button button-primary">
              {COPY_CTA.primary}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Niezbędnik</div>
          <h3>{COPY_SERVICE_NAMES.toolkit}</h3>
          <p>{COPY_HELPERS.toolkitIntro}</p>
          <div className="editorial-hero-meta" aria-label="Zakres materiałów">
            <span>materiały własne</span>
            <span>książki</span>
            <span>narzędzia</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy chcesz wrócić do materiałów albo przygotować się do rozmowy.</p>
          <div className="hero-actions top-gap-small">
            <Link href={toolkitHref} prefetch={false} className="button button-ghost">
              {COPY_CTA.toolkit}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Konsultacja 60 min</div>
          <h3>Konsultacja online 60 min</h3>
          <p>{getFullConsultationDescription(species)}</p>
          <div className="editorial-hero-meta" aria-label="Parametry usługi">
            <span>60 min</span>
            <span>{formatPricePln(BOOKING_SERVICE_ONLINE_PRICE)}</span>
            <span>online</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy problem trwa dłużej, wraca albo obejmuje kilka obszarów naraz.</p>
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
        pomaga wtedy, gdy chcesz tylko krótko doprecyzować temat.
      </p>
    </section>
  )
}
