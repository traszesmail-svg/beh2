import Link from 'next/link'
import { NotatnikSectionHead } from '@/components/NotatnikA'
import { COPY_CTA, COPY_HELPERS, COPY_SERVICE_NAMES } from '@/lib/copy-governance'
import { getPublicServicePriceLabel } from '@/lib/funnel'

type ServiceDecisionSectionProps = {
  index: string
  eyebrow: string
  title: string
  description: string
  audioHref: string
  consultationHref: string
  serviceHref: string
  serviceLead: string
  quickBullets: string[]
  consultationBullets: string[]
  serviceLinkLabel?: string
}

export function ServiceDecisionSection({
  index,
  eyebrow,
  title,
  description,
  audioHref,
  consultationHref,
  serviceHref,
  serviceLead,
  quickBullets,
  consultationBullets,
  serviceLinkLabel = 'strony uslugi online',
}: ServiceDecisionSectionProps) {
  return (
    <section className="notatnik-service-section">
      <NotatnikSectionHead index={index} kicker={eyebrow} title={title} />
      <p className="notatnik-service-description">{description}</p>

      <div className="notatnik-service-grid">
        <article className="notatnik-service-card">
          <div className="notatnik-mono">{COPY_SERVICE_NAMES.primary}</div>
          <h3>{COPY_HELPERS.primaryLead}</h3>
          <p>{serviceLead}</p>
          <div className="notatnik-service-meta" aria-label="Parametry Kwadransu">
            <span>{COPY_SERVICE_NAMES.primaryDescriptor}</span>
            <span>{getPublicServicePriceLabel('szybka-konsultacja-15-min')}</span>
            <span>najprostszy start</span>
          </div>
          <ul className="notatnik-service-list">
            {quickBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="notatnik-service-actions">
            <Link href={audioHref} prefetch={false} className="notatnik-btn">
              {COPY_CTA.primary}
            </Link>
          </div>
        </article>

        <article className="notatnik-service-card">
          <div className="notatnik-mono">Pelna konsultacja</div>
          <h3>Kiedy od razu wejsc szerzej</h3>
          <p>Pelna konsultacja daje wiecej czasu na kontekst, kilka watkow naraz, diagnoze i 7 dni wsparcia tekstowego przez WhatsApp.</p>
          <div className="notatnik-service-meta" aria-label="Parametry pelnej konsultacji">
            <span>60 min online</span>
            <span>{getPublicServicePriceLabel('konsultacja-behawioralna-online')}</span>
            <span>diagnoza + 7 dni</span>
          </div>
          <ul className="notatnik-service-list">
            {consultationBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="notatnik-service-note">
            Po rozmowie mozesz przez 7 dni pisac przez WhatsApp, zadawac pytania, wysylac filmy i konsultowac kazdy krok planu. Jesli ten etap nie daje realnego kierunku, kolejnym krokiem bywa wizyta domowa i terapia ustalana indywidualnie.
          </p>
          <div className="notatnik-service-actions">
            <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              {COPY_CTA.consultation}
            </Link>
          </div>
        </article>
      </div>

      <p className="notatnik-service-note">
        Jesli chcesz najpierw zobaczyc pelny opis szerokiej uslugi online dla calej Polski, przejdz do{' '}
        <Link href={serviceHref} prefetch={false} className="notatnik-inline-link">
          {serviceLinkLabel}
        </Link>
        .
      </p>
    </section>
  )
}
