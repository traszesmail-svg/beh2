import type { Metadata } from 'next'
import { InternalOpinionForm } from '@/components/InternalOpinionForm'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { buildTechnicalMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildTechnicalMetadata({
    title: 'Ukryty formularz opinii',
    path: '/__internal/opinie',
    description: 'Ukryty formularz do ręcznego zebrania opinii po konsultacji.',
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default function InternalOpinionPage() {
  return (
    <main className="page-wrap">
      <div className="container">
        <section className="panel centered-panel hero-surface">
          <div className="section-eyebrow">Ukryty formularz</div>
          <h1>Podziel się opinią po konsultacji</h1>
          <p className="hero-text small-width center-text">
            {COPY_HELPERS.reviewInternalNote}
          </p>

          <InternalOpinionForm />
        </section>
      </div>
    </main>
  )
}
