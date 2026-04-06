import { RouteFallbackPage } from '@/components/RouteFallbackPage'

export default function NotFound() {
  return (
    <RouteFallbackPage
      code="404"
      eyebrow="Strona nie istnieje"
      title="Nie znaleźliśmy tej strony"
      description="Ten adres nie prowadzi już do żadnej publicznej podstrony. Wróć do sprawdzonej ścieżki i wybierz najkrótszy kolejny krok."
      highlights={['Co możesz zrobić', 'Wrócić do oferty, konsultacji albo kontaktu bez zgadywania, gdzie kliknąć dalej.']}
      actions={[
        { href: '/', label: 'Strona główna', primary: true },
        { href: '/oferta', label: 'Zobacz ofertę' },
        { href: '/kontakt', label: 'Napisz wiadomość' },
      ]}
      footerCtaHref="/book"
      footerCtaLabel="Umów 15 min"
      footerHeadline="Nie musisz szukać dalej"
      footerDescription="Wróć do strony głównej, oferty albo napisz wiadomość, jeśli chcesz dostać najkrótszą ścieżkę do właściwego ekranu."
    />
  )
}
