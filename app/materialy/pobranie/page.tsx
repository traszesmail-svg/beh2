import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { MaterialyDownloadForm } from '@/components/MaterialyDownloadForm'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pobierz PDF | Materialy Regulski',
  path: '/materialy/pobranie',
  description: 'Wpisz e-mail i 6-cyfrowy kod, by pobrac zamowiony PDF. Kod wazny 72 godziny, do 3 pobran.',
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
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Pobranie PDF</div>
          <h1>Wpisz e-mail i kod.</h1>
          <p>
            Kod do pobrania dostales mailem po potwierdzeniu wplaty. Jest wazny 72 godziny i pozwala
            na maksymalnie 3 pobrania (dla pakietow — 3 pobrania lacznie, niezaleznie od liczby
            plikow).
          </p>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Nie dostales kodu?</div>
          <h3>Sprawdz spam, potem napisz</h3>
          <p>
            Kod przychodzi do 60 minut po wplacie BLIK (pon–pt 8–18). Jesli nie ma go po godzinie,
            sprawdz spam. Jesli i tam pusto — odpowiedz na wiadomosc z numerem zamowienia albo napisz
            na <Link href="mailto:kontakt@regulskibehawiorysta.pl" className="notatnik-inline-link">kontakt@regulskibehawiorysta.pl</Link>.
          </p>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="Formularz pobrania" title="Email + 6 cyfr." />
        <MaterialyDownloadForm />
      </section>

      <NotatnikFinalCta
        title="Cos sie nie zgadza? <em>Najszybciej napisac.</em>"
        copy="Jesli kod wygasl, nie dziala albo zamowienie zniknelo z poczty — odpisuje recznie i wysylam nowy link."
        primaryHref="/kontakt#formularz"
        primaryLabel="Napisz wiadomosc"
        secondaryHref="/materialy"
        secondaryLabel="Wszystkie materialy"
      />
    </NotatnikPageShell>
  )
}
