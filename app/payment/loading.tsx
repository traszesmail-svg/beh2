import { FunnelLoadingPage } from '@/components/FunnelLoadingPage'

export default function Loading() {
  return (
    <FunnelLoadingPage
      eyebrow="Wybór płatności"
      title="Ładuję płatność"
      message="Pobieram dane rezerwacji i przygotowuję dostępne metody płatności."
    />
  )
}
