import { RouteFallbackPage } from '@/components/RouteFallbackPage'

export default function Custom404() {
  return (
    <RouteFallbackPage
      code="404"
      eyebrow="Nie ma takiej strony"
      title="Ta podstrona nie została znaleziona"
      description="Adres mógł się zmienić, a ta ścieżka nie prowadzi już do publicznej treści. Wybierz bezpieczny następny krok."
      highlights={['Najkrótsza droga', 'Wrócić do strony głównej, oferty albo kontaktu bez błądzenia po martwych linkach.']}
      actions={[
        { href: '/', label: 'Strona główna', primary: true },
        { href: '/oferta', label: 'Oferta' },
        { href: '/book', label: 'Umów 15 min' },
      ]}
      footerCtaHref="/kontakt"
      footerCtaLabel="Napisz wiadomość"
      footerHeadline="Nie zgaduj dalej"
      footerDescription="Zamiast szukać po adresach, wejdź do oferty albo napisz krótką wiadomość, a wskażę właściwy kierunek."
    />
  )
}
