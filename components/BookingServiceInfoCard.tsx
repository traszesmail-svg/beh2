import { type BookingServiceType, getBookingServicePriceLabel } from '@/lib/booking-services'
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
  title = 'Informacje o usłudze',
  stageLabel = 'Ta usługa',
  emphasis,
}: BookingServiceInfoCardProps) {
  const service = FUNNEL_SERVICE_CONFIG[serviceType]
  const priceLabel = getBookingServicePriceLabel(serviceType, quickConsultationPrice ?? service.priceAmount)
  const cancellationPolicy =
    'Po potwierdzeniu wpłaty masz 24 godziny na bezpłatną rezygnację. Zmianę terminu ustalamy przez krótki kontakt w tym samym oknie.'
  const formatLabel = service.mode === 'audio' ? '15 min audio, bez kamery' : 'Konsultacja online'

  return (
    <aside className="booking-stage-sidecard booking-service-info-card tree-backed-card" aria-label={title}>
      <span className="booking-stage-sidecard-label">{stageLabel}</span>
      <strong>{title}</strong>
      <div className="booking-service-info-grid">
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Czas</span>
          <strong>{service.durationMinutes} min</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Cena</span>
          <strong>{priceLabel}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Forma</span>
          <strong>{formatLabel}</strong>
        </div>
        <div className="booking-service-info-item">
          <span className="booking-service-info-key">Zmiana / odwołanie</span>
          <strong>{cancellationPolicy}</strong>
        </div>
      </div>
      <div className="booking-stage-sidecard-pills" aria-label="Najważniejsze informacje">
        <span className="hero-proof-pill">{service.slotBadge}</span>
        <span className="hero-proof-pill">{service.mode === 'audio' ? 'bez kamery' : '60 min'}</span>
      </div>
      <p className="booking-service-info-note">{emphasis ?? service.publicSummary}</p>
    </aside>
  )
}
