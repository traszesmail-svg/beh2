import React from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SocialProofSection } from '@/components/SocialProofSection'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie i historie',
  path: '/opinie',
  description:
    'Prawdziwe historie opiekunów, publiczne źródła i ręcznie weryfikowane opinie dla osób, które chcą sprawdzić profil przed kontaktem.',
})

export default function OpinionsPage() {
  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <SocialProofSection />
        <Footer variant="full" ctaHref="/kontakt" ctaLabel="Napisz wiadomość" />
      </div>
    </main>
  )
}
