import { type BookingServiceType, getBookingServiceDurationLabel, getBookingServicePriceLabel } from '@/lib/booking-services'
import { COPY_SERVICE_NAMES } from '@/lib/copy-governance'
import { FUNNEL_SERVICE_CONFIG } from '@/lib/funnel'

type BookingServiceInfoCardProps = {
  serviceType: BookingServiceType
  quickConsultationPrice?: number
  title?: string
  stageLabel?: string
  emphasis?: string
}

export function BookingServiceInfoCard({
  serviceType,
  quickConsultationPrice,
  title = 'Informacje o usludze',
  stageLabel = 'Ta usluga',
  emphasis,
}: BookingServiceInfoCardProps) {
  const service = FUNNEL_SERVICE_CONFIG[serviceType]
  const priceLabel = getBookingServicePriceLabel(serviceType, quickConsultationPrice ?? service.priceAmount)
  const cancellationPolicy =
    'Po potwierdzeniu wplaty masz 24 godziny na bezplatna rezygnacje. Zmiane terminu ustalamy przez krotki kontakt w tym samym oknie.'
  const serviceLabel = service.mode === 'audio' ? COPY_SERVICE_NAMES.primary : service.title
  const formatLabel = service.mode === 'audio' ? COPY_SERVICE_NAMES.primaryDescriptor : 'rozmowa online'

  return (
    <aside className="booking-stage-sidecard booking-service-info-card tree-backed-card" aria-label={title}>
      <span className="booking-stage-sidecard-label">{stageLabel}</span>
      <strong>{title}</strong>
      <div className="booking-service-info-grid">
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Czas</span>
          <strong>{getBookingServiceDurationLabel(serviceType)}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Cena</span>
          <strong>{priceLabel}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Usluga</span>
          <strong>{serviceLabel}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Forma</span>
          <strong>{formatLabel}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Zmiana / odwolanie</span>
          <strong>{cancellationPolicy}</strong>
        </div>
      </div>
      <div className="booking-stage-sidecard-pills" aria-label="Najwazniejsze informacje">
        <span className="hero-proof-pill">{service.mode === 'audio' ? COPY_SERVICE_NAMES.primaryShort : service.slotBadge}</span>
        <span className="hero-proof-pill">{service.mode === 'audio' ? 'bez kamery' : getBookingServiceDurationLabel(serviceType)}</span>
      </div>
      <p className="booking-service-info-note">{emphasis ?? service.publicSummary}</p>
    </aside>
  )
}
