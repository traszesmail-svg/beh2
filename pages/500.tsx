import { RouteFallbackPage } from '@/components/RouteFallbackPage'

export default function Custom500() {
  return (
    <RouteFallbackPage
      code="500"
      eyebrow="Błąd serwera"
      title="Coś po drodze się wysypało"
      description="To awaryjna strona dla sytuacji, kiedy system nie złożył odpowiedzi tak, jak powinien. Wróć do bezpiecznej ścieżki albo napisz wiadomość."
      highlights={['Najlepiej teraz', 'Wrócić do strony głównej albo napisać, jeśli chcesz przejść przez kolejny krok bez zgadywania.']}
      actions={[
        { href: '/', label: 'Strona główna', primary: true },
        { href: '/kontakt', label: 'Kontakt' },
        { href: '/oferta', label: 'Oferta' },
      ]}
      footerCtaHref="/kontakt"
      footerCtaLabel="Napisz wiadomość"
      footerHeadline="Masz bezpieczną ścieżkę wyjścia"
      footerDescription="Jeśli błąd był chwilowy, wróć do strony głównej. Jeśli potrzebujesz pomocy, napisz wiadomość i przejdziemy dalej ręcznie."
    />
  )
}
