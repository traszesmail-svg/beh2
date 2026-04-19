import type { ReactNode } from 'react'
import Link from 'next/link'
import { getFunnelEntryEventForHref, getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { COPY_CTA } from '@/lib/copy-governance'
import { FUNNEL_SECONDARY_HREF } from '@/lib/offers'

type FunnelPrimaryActionsProps = {
  audioHref: string
  consultationHref: string
  contactHref: string
  primaryLocation: string
  secondaryLocation: string
  note?: ReactNode
  actionsClassName?: string
  noteClassName?: string
}

export function FunnelPrimaryActions({
  audioHref,
  consultationHref,
  contactHref,
  primaryLocation,
  secondaryLocation,
  note,
  actionsClassName = 'hero-actions editorial-final-actions',
  noteClassName = 'muted top-gap-small',
}: FunnelPrimaryActionsProps) {
  const quickService = getServiceAnalyticsParams('szybka-konsultacja-15-min')
  const consultationService = getServiceAnalyticsParams('konsultacja-behawioralna-online')
  const resolvedNote = note ?? (
    <>
      Jeśli wolisz najpierw napisać, użyj{' '}
      <Link href={contactHref} prefetch={false} className="prep-inline-link">
        {COPY_CTA.contact.toLowerCase()}
      </Link>
      . Jeśli chcesz najpierw przeczytać materiały, zajrzyj do
    </>
  )

  return (
    <>
      <div className={actionsClassName}>
        <Link
          href={audioHref}
          prefetch={false}
          className="button button-primary big-button home-primary-cta"
          data-analytics-event={getFunnelEntryEventForHref(audioHref)}
          data-analytics-location={primaryLocation}
          data-analytics-cta-label={COPY_CTA.primary}
          data-analytics-service="szybka-konsultacja-15-min"
          data-analytics-service-name={String(quickService.service_name)}
          data-analytics-service-duration={String(quickService.service_duration)}
          data-analytics-service-price={String(quickService.service_price)}
        >
          {COPY_CTA.primary}
        </Link>
        <Link
          href={consultationHref}
          prefetch={false}
          className="button button-ghost big-button home-secondary-cta"
          data-analytics-event={getFunnelEntryEventForHref(consultationHref)}
          data-analytics-location={secondaryLocation}
          data-analytics-cta-label={COPY_CTA.consultation}
          data-analytics-service="konsultacja-behawioralna-online"
          data-analytics-service-name={String(consultationService.service_name)}
          data-analytics-service-duration={String(consultationService.service_duration)}
          data-analytics-service-price={String(consultationService.service_price)}
        >
          {COPY_CTA.consultation}
        </Link>
      </div>

      <p className={noteClassName}>
        {resolvedNote}{' '}
        <Link href={FUNNEL_SECONDARY_HREF} prefetch={false} className="prep-inline-link">
          {COPY_CTA.toolkit}
        </Link>
        .
      </p>
    </>
  )
}
