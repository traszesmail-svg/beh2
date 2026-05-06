import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  AtSign,
  CheckCircle2,
  Globe2,
  Headphones,
  Heart,
  Mail,
  MessageCircle,
  PawPrint,
  Volume2,
} from 'lucide-react'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt i rezerwacja konsultacji',
  path: '/kontakt',
  description: 'Kontakt i rezerwacja konsultacji | formularz, e-mail i spokojny pierwszy krok dla opiekunow psow i kotow.',
})

const contactFaqItems = FAQ_SHORTLISTS.contact.slice(0, 5)

const contactSteps = [
  {
    title: 'Opisujesz sytuację',
    copy: 'Wybierasz gatunek albo Nie wiem, wpisujesz temat i piszesz kilka zdań.',
    icon: MessageCircle,
  },
  {
    title: 'Czytam i porządkuję temat',
    copy: 'Sprawdzam, czy wystarczy odpowiedź, Kwadrans czy pełna konsultacja.',
    icon: Volume2,
  },
  {
    title: 'Dostajesz rekomendację',
    copy: 'Odpowiadam w ciągu 1-2 dni roboczych z jasnym kolejnym krokiem.',
    icon: CheckCircle2,
  },
] as const

export default function ContactPage() {
  const publicContact = getPublicContactDetails()
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
    getFaqPageJsonLd(contactFaqItems),
  ]

  return (
    <main className="notatnik-page contact-page contact-page-redesign">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="contact" />
      <div className="notatnik-shell contact-shell">
        <NotatnikTopbar tag="Kontakt" navItems={PUBLIC_SITE_NAV_ITEMS} />

        <section className="contact-hero-grid" id="formularz">
          <div className="contact-hero-copy">
            <h1>Napisz, zanim zarezerwujesz.</h1>
            <p>
              Wystarczy gatunek, temat i kilka zdań. Odpowiem w ciągu 1-2 dni roboczych i wskażę
              najprostszy kolejny krok.
            </p>
            <section id="jak-wyglada-kontakt" className="contact-process-panel contact-process-panel-hero" aria-labelledby="contact-process-title">
              <h2 id="contact-process-title">Jak wygląda kontakt?</h2>
              <div className="contact-process-list">
                {contactSteps.map((step, index) => {
                  const Icon = step.icon

                  return (
                    <article key={step.title} className="contact-process-step">
                      <span className="contact-process-icon" aria-hidden="true">
                        <Icon size={24} strokeWidth={1.85} />
                      </span>
                      <div>
                        <strong>
                          {index + 1}. {step.title}
                        </strong>
                        <p>{step.copy}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
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

          <section id="kontakt-bez-formularza" className="contact-direct-panel" aria-labelledby="contact-direct-title">
            <h2 id="contact-direct-title">Kontakt bez formularza</h2>
            <div className="contact-direct-grid">
              <span>
                <Mail size={20} strokeWidth={1.8} aria-hidden="true" />
                <strong>E-mail</strong>
                <a href={`mailto:${publicContact.email}`}>{publicContact.email}</a>
              </span>
              <span>
                <Headphones size={20} strokeWidth={1.8} aria-hidden="true" />
                <strong>Odpowiedź</strong>
                1-2 dni robocze
              </span>
              <span>
                <MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" />
                <strong>Forma</strong>
                formularz / e-mail
              </span>
              <span>
                <AtSign size={20} strokeWidth={1.8} aria-hidden="true" />
                <strong>Instagram</strong>
                <Link href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                  @regulskibehawiorysta
                </Link>
              </span>
              <span>
                <Globe2 size={20} strokeWidth={1.8} aria-hidden="true" />
                <strong>Profil</strong>
                <Link href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                  behawioryscicoape.pl/Regulski
                </Link>
              </span>
            </div>
          </section>
        </section>

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
