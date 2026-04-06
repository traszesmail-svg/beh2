import { FunnelLoadingPage } from '@/components/FunnelLoadingPage'

export default function Loading() {
  return (
    <FunnelLoadingPage
      eyebrow="Etap rezerwacji: wybór terminu"
      title="Ładuję terminy"
      message="Sprawdzam aktualne godziny rozmowy i przygotowuję listę terminów."
    />
  )
}
