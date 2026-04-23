import Link from 'next/link'
import { buildBookHref, type BookingSpecies } from '@/lib/booking-routing'
import { COPY_CTA, COPY_HELPERS, COPY_SERVICE_NAMES } from '@/lib/copy-governance'
import { formatPricePln } from '@/lib/pricing'
import {
  PUBLIC_OFFER_BOOKING_LEAD,
  PUBLIC_OFFER_BOOKING_REASSURANCE,
  PUBLIC_OFFER_FULL_CONSULTATION_VALUE,
  PUBLIC_OFFER_PRIORITY_VARIANT_NOTE,
  PUBLIC_OFFER_PRICES,
} from '@/lib/public-offer-copy'

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
  title = 'Masz trzy glowne formaty konsultacji i jeden wariant priorytetowy przy Kwadransie.',
  description = PUBLIC_OFFER_BOOKING_LEAD,
}: OfferEntrySectionProps) {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, species)
  const fullConsultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
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
        <Link href="/cennik" prefetch={false} className="prep-inline-link">
          Zobacz cennik
        </Link>
      </div>

      <div className="card-grid three-up top-gap">
        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">{COPY_SERVICE_NAMES.primary}</div>
          <h3>{COPY_SERVICE_NAMES.primary}</h3>
          <p>{getAudioDescription(species)}</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi">
            {/* Kwadrans zostaje nazwa uslugi, a format idzie w descriptorze. */}
            <span>{COPY_SERVICE_NAMES.primaryDescriptor}</span>
            <span>{formatPricePln(PUBLIC_OFFER_PRICES.quick)}</span>
            <span>cena wejscia</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy temat jest jeden albo chcesz spokojnie ustalic kierunek bez przechodzenia od razu do dluzszej konsultacji.</p>
          <p className="muted">{PUBLIC_OFFER_PRIORITY_VARIANT_NOTE}</p>
          <div className="hero-actions top-gap-small">
            <Link href={audioHref} prefetch={false} className="button button-primary">
              {COPY_CTA.primary}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">{COPY_SERVICE_NAMES.bridge}</div>
          <h3>{COPY_SERVICE_NAMES.bridge}</h3>
          <p>Pomost miedzy szybkim startem a Pelna konsultacja, gdy 15 minut to za malo, ale nie potrzebujesz od razu najszerszej opcji.</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi posredniej">
            <span>30 min online</span>
            <span>{formatPricePln(PUBLIC_OFFER_PRICES.bridge)}</span>
            <span>pomost</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy chcesz spokojniej wejsc w 2-3 watki i po rozmowie dostac krotka notatke.</p>
          <div className="hero-actions top-gap-small">
            <Link href={bridgeHref} prefetch={false} className="button button-ghost">
              {COPY_CTA.bridge}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Pelna konsultacja</div>
          <h3>Pelna konsultacja behawioralna</h3>
          <p>{getFullConsultationDescription(species)} Po rozmowie dostajesz diagnoze, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi">
            <span>60 min online</span>
            <span>{formatPricePln(PUBLIC_OFFER_PRICES.premium)}</span>
            <span>diagnoza + 7 dni WhatsApp</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy problem trwa dluzej, wraca albo obejmuje kilka obszarow naraz.</p>
          <p className="muted">{PUBLIC_OFFER_FULL_CONSULTATION_VALUE}</p>
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
        pomaga wtedy, gdy chcesz tylko krotko doprecyzowac temat. Jesli wolisz najpierw materialy, nadal mozesz wejsc do Niezbednika.
      </p>
      <p className="muted top-gap-small">{PUBLIC_OFFER_BOOKING_REASSURANCE}</p>
    </section>
  )
}
