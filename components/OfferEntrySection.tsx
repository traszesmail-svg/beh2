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
  title = 'Masz cztery proste wejscia: Kwadrans za 69 zl, Kwadrans na juz za 99 zl, Dwa kwadranse za 169 zl i Pelna konsultacja za 470 zl.',
  description = 'Kwadrans zostaje nazwa uslugi, a 15 min audio bez kamery opisuje tylko jego format. Kwadrans za 69 zl jest najprostszym startem. Kwadrans na juz za 99 zl to ten sam format 15 minut, ale z priorytetem i terminem w 15 minut. Dwa kwadranse sa pomostem, a Pelna konsultacja daje diagnoze i 7 dni wsparcia przez WhatsApp.',
}: OfferEntrySectionProps) {
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const urgentNowHref = buildBookHref(null, 'kwadrans-na-juz', false, species)
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
        <Link href={bridgeHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.bridge}
        </Link>
        <Link href={fullConsultationHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.consultation}
        </Link>
        <Link href={messageHref} prefetch={false} className="prep-inline-link">
          {COPY_CTA.contact}
        </Link>
        <Link href={urgentNowHref} prefetch={false} className="prep-inline-link">
          Kwadrans na juz
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
            <span>cena wejscia</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy temat jest jeden albo chcesz spokojnie ustalic kierunek bez przechodzenia od razu do dluzszej konsultacji.</p>
          <div className="hero-actions top-gap-small">
            <Link href={audioHref} prefetch={false} className="button button-primary">
              {COPY_CTA.primary}
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">Kwadrans na juz</div>
          <h3>Ten sam format, ale szybciej</h3>
          <p>15 minut audio bez kamery jak w zwyklym Kwadransie. Roznica jest jedna: tu rezerwujesz sciezke priorytetowa z terminem w 15 minut.</p>
          <div className="editorial-hero-meta" aria-label="Parametry pilnej sciezki">
            <span>15 min audio</span>
            <span>{formatPricePln(99)}</span>
            <span>priorytet / 15 min</span>
          </div>
          <p className="muted">Dla {speciesLabel}, gdy nie potrzebujesz dluzszej rozmowy, tylko szybszego dostepu.</p>
          <div className="hero-actions top-gap-small">
            <Link href={urgentNowHref} prefetch={false} className="button button-ghost">
              Zarezerwuj Kwadrans na juz
            </Link>
          </div>
        </article>

        <article className="summary-card tree-backed-card">
          <div className="section-eyebrow">{COPY_SERVICE_NAMES.bridge}</div>
          <h3>{COPY_SERVICE_NAMES.bridge}</h3>
          <p>Pomost miedzy szybkim startem a Pelna konsultacja, gdy 15 minut to za malo, ale nie potrzebujesz od razu najszerszej opcji.</p>
          <div className="editorial-hero-meta" aria-label="Parametry uslugi posredniej">
            <span>30 min online</span>
            <span>{formatPricePln(169)}</span>
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
            <span>{formatPricePln(BOOKING_SERVICE_ONLINE_PRICE)}</span>
            <span>diagnoza + 7 dni WhatsApp</span>
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
        pomaga wtedy, gdy chcesz tylko krotko doprecyzowac temat. Jesli wolisz najpierw materialy, nadal mozesz wejsc do Niezbednika.
      </p>
    </section>
  )
}
