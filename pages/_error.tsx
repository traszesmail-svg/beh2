import type { NextPageContext } from 'next'
import { RouteFallbackPage } from '@/components/RouteFallbackPage'

type ErrorPageProps = {
  statusCode?: number
}

function ErrorPage({ statusCode }: ErrorPageProps) {
  const code = statusCode ?? 500
  const isServerError = code >= 500

  return (
    <RouteFallbackPage
      code={String(code)}
      eyebrow={isServerError ? 'Błąd po drodze' : 'Problem z dostępem'}
      title={isServerError ? 'Coś po drodze się wysypało' : 'Nie udało się otworzyć tej strony'}
      description={
        isServerError
          ? 'To jest bezpieczna strona awaryjna. Wróć do stabilnej ścieżki albo napisz wiadomość, jeśli chcesz, żebym pomógł znaleźć właściwy ekran.'
          : 'Ta strona nie mogła zostać wyświetlona w obecnej formie. Wróć na start, sprawdź ofertę albo przejdź do kontaktu.'
      }
      highlights={[
        isServerError ? 'Co teraz' : 'Najkrótszy ruch',
        isServerError
          ? 'Spróbuj wrócić do strony głównej, oferty albo kontaktu. Jeśli błąd wróci, mamy już jasny fallback.'
          : 'Wejdź od razu przez stronę główną, ofertę lub kontakt, zamiast zostawać na martwym ekranie.',
      ]}
      actions={[
        { href: '/', label: 'Strona główna', primary: true },
        { href: '/oferta', label: 'Zobacz ofertę' },
        { href: '/kontakt', label: 'Kontakt' },
      ]}
      footerCtaHref="/book"
      footerCtaLabel="Umów 15 min"
      footerHeadline={isServerError ? 'Masz prostą drogę wyjścia' : 'Wracamy do bezpiecznej ścieżki'}
      footerDescription="Jeśli problem był jednorazowy, wystarczy wrócić do startu. Jeśli nie, napisz wiadomość i przejdziemy przez właściwy krok ręcznie."
    />
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default ErrorPage
