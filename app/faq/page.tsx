import type { Metadata } from 'next'
import { ReferenceFaq } from '@/components/ReferenceFaq'
import { ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { referenceFaqItems } from '@/lib/reference-faq'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Najczęstsze pytania i odpowiedzi',
  path: '/faq',
  description: 'FAQ o konsultacjach behawioralnych online, pierwszym kontakcie, płatnościach, psach i kotach.',
})

const bookHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'

export default function FaqPage() {
  return (
    <ReferencePageShell className="reference-faq-page" ctaHref={bookHref}>
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
          getFaqPageJsonLd(referenceFaqItems),
        ]}
      />
      <ReferenceFaq bookHref={bookHref} contactHref={contactHref} />
      <ReferenceFinalCta
        title="Gotowy na pierwszy krok?"
        copy="Wybierz dogodny termin albo napisz kilka zdań - podpowiem Ci najlepszą ścieżkę."
        primaryHref={bookHref}
        primaryLabel="Umów pierwszy krok"
        secondaryHref={contactHref}
        secondaryLabel="Wyślij krótką wiadomość"
      />
    </ReferencePageShell>
  )
}
