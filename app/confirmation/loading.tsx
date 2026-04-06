import { FunnelLoadingPage } from '@/components/FunnelLoadingPage'

export default function Loading() {
  return (
    <FunnelLoadingPage
      eyebrow="Potwierdzenie rezerwacji"
      title="Ładuję potwierdzenie"
      message="Sprawdzam aktualny status płatności i przygotowuję podsumowanie rezerwacji."
    />
  )
}
