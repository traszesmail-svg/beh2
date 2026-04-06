import { FunnelLoadingPage } from '@/components/FunnelLoadingPage'

export default function Loading() {
  return (
    <FunnelLoadingPage
      eyebrow="Etap rezerwacji: dane do konsultacji"
      title="Ładuję formularz"
      message="Sprawdzam wybrany termin i przygotowuję pola do rezerwacji."
    />
  )
}
