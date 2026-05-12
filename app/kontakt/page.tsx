import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import {
  Globe2,
  Heart,
  MessageCircle,
  PawPrint,
} from 'lucide-react'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt i rezerwacja konsultacji',
  path: '/kontakt',
  description: 'Kontakt i rezerwacja konsultacji | formularz, e-mail i spokojny pierwszy krok dla opiekunów psów i kotów.',
})

const contactFaqItems = FAQ_SHORTLISTS.contact.slice(0, 5)

export default function ContactPage() {
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
    getFaqPageJsonLd(contactFaqItems),
  ]

  return (
    <main className="notatnik-page contact-page contact-page-redesign">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="contact" />
      <div className="notatnik-shell contact-shell">
        <NotatnikTopbar tag="Kontakt" navItems={PUBLIC_SITE_NAV_ITEMS} showUtilityLinks={false} />

        <section className="contact-hero-grid" id="formularz">
          <div className="contact-hero-copy">
            <figure className="contact-intro-photo">
              <Image
                src="/branding/omnie3.png"
                alt="Krzysztof Regulski w granatowym stroju medycznym podczas kontaktu online"
                width={320}
                height={480}
                priority
              />
            </figure>
            <h1>Napisz, zanim zarezerwujesz.</h1>
            <p>
              Wystarczy gatunek, temat i kilka zdań. Odpowiem w ciągu 1-2 dni roboczych i wskażę
              najprostszy kolejny krok.
            </p>
            <div className="contact-hero-proof" aria-label="Najważniejsze informacje">
              <span>
                <Heart size={20} strokeWidth={1.8} aria-hidden="true" />
                Bez oceniania
              </span>
              <span>
                <PawPrint size={20} strokeWidth={1.8} aria-hidden="true" />
                Psy i koty
              </span>
              <span>
                <Globe2 size={20} strokeWidth={1.8} aria-hidden="true" />
                Online w całej Polsce
              </span>
            </div>
          </div>

          <article className="contact-form-card">
            <div className="contact-form-head">
              <h2>Pierwszy kontakt</h2>
              <p>
                Nie musisz od razu wiedzieć, jaki rodzaj pomocy będzie najlepszy. Napisz krótko,
                co się dzieje, a ja uporządkuję sytuację i podpowiem kolejny krok.
              </p>
            </div>
            <Suspense fallback={<div className="info-box">Ładuję formularz...</div>}>
              <ContactLeadForm />
            </Suspense>
            <div className="contact-form-note">
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>
                Odpowiem na adres e-mail z formularza. Jeśli sprawa wymaga rozmowy, podpowiem
                najprostszy format: Kwadrans, Dwa kwadranse albo pełną konsultację.
              </span>
            </div>
          </article>
        </section>

        <section className="contact-lower-grid">
          <section id="faq" className="contact-faq-panel" aria-labelledby="contact-faq-title">
            <h2 id="contact-faq-title">Najczęściej zadawane pytania</h2>
            <div className="contact-faq-list">
              {contactFaqItems.map((item) => (
                <details key={item.question} className="contact-faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </section>

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
