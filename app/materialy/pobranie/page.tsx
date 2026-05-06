import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { MaterialyDownloadForm } from '@/components/MaterialyDownloadForm'
import { buildBookHref } from '@/lib/booking-routing'
import { buildTechnicalMetadata } from '@/lib/seo'

export const metadata: Metadata = buildTechnicalMetadata({
  title: 'Pobierz PDF | Materialy Regulski',
  path: '/materialy/pobranie',
  description: 'Wpisz e-mail i 6-cyfrowy kod, by pobrać zamówiony PDF. Kod jest ważny 72 godziny.',
  follow: false,
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)

export default function MaterialyDownloadPage() {
  return (
    <NotatnikPageShell
      tag="Materialy / pobranie"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
      sideVisualVariant="materials"
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Pobranie PDF</div>
          <h1>Wpisz e-mail i kod.</h1>
          <p>
            Kod do pobrania przychodzi mailem po potwierdzeniu wpłaty. Jest ważny 72 godziny i pozwala
            na maksymalnie 3 pobrania.
          </p>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Nie dostałeś kodu?</div>
          <h3>Sprawdź spam, potem napisz</h3>
          <p>
            Kod przychodzi do 60 minut po wpłacie BLIK w godzinach obsługi. Jeśli nie ma go po godzinie,
            sprawdź spam. Jeśli i tam pusto, odpowiedz na wiadomość z numerem zamówienia albo napisz
            na <Link href="mailto:kontakt@regulskibehawiorysta.pl" className="notatnik-inline-link">kontakt@regulskibehawiorysta.pl</Link>.
          </p>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="Formularz pobrania" title="Wpisz dane z maila z kodem." />
        <MaterialyDownloadForm />
      </section>

      <NotatnikFinalCta
        title="Kod nie działa? <em>Napisz wiadomość.</em>"
        copy="Jeśli kod wygasł, nie działa albo nie możesz znaleźć zamówienia, sprawdzę je ręcznie i wyślę nowy link."
        primaryHref="/kontakt#formularz"
        primaryLabel="Napisz wiadomość"
        secondaryHref="/materialy"
        secondaryLabel="Wszystkie materiały"
      />
    </NotatnikPageShell>
  )
}
