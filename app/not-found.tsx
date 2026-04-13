import { RouteFallbackPage } from '@/components/RouteFallbackPage'

export default function NotFound() {
  return (
    <RouteFallbackPage
      code="404"
      eyebrow="Strona nie istnieje"
      title="Nie znaleźliśmy tej strony"
      description="Ten adres nie prowadzi już do żadnej publicznej podstrony. Wróć do sprawdzonej ścieżki i wybierz najkrótszy kolejny krok."
      highlights={['Co możesz zrobić', 'Wrócić do strony głównej, konsultacji albo wiadomości bez zgadywania, gdzie kliknąć dalej.']}
      actions={[
        { href: '/', label: 'Strona główna', primary: true },
        { href: '/book', label: 'Umów konsultację' },
        { href: '/kontakt', label: 'Napisz wiadomość' },
      ]}
      footerCtaHref="/book"
      footerCtaLabel="Umów konsultację"
      footerHeadline="Nie musisz szukać dalej"
      footerDescription="Wróć do strony głównej albo napisz wiadomość, jeśli chcesz dostać najkrótszą ścieżkę do właściwego miejsca."
    />
  )
}
