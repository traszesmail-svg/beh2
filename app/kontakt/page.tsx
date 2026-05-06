import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BadgeCheck,
  AtSign,
  CheckCircle2,
  Globe2,
  Headphones,
  Heart,
  Mail,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Volume2,
} from 'lucide-react'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref, readBookingSpeciesSearchParam } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails } from '@/lib/site'
import { homepageTrustBadges } from '@/lib/homepage-data'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt i rezerwacja konsultacji',
  path: '/kontakt',
  description: 'Kontakt i rezerwacja konsultacji | formularz, e-mail i spokojny pierwszy krok dla opiekunow psow i kotow.',
})

const trustIcons = [BadgeCheck, Stethoscope, PawPrint, ShieldCheck, Globe2] as const
const contactFaqItems = FAQ_SHORTLISTS.contact.slice(0, 5)

const contactSteps = [
  {
    title: 'Opisujesz sytuację',
    copy: 'Wybierasz gatunek, temat i piszesz kilka zdań.',
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

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const species = readBookingSpeciesSearchParam(searchParams?.species)
  const publicContact = getPublicContactDetails()
  const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const urgentHref = buildBookHref(null, 'kwadrans-na-juz', false, species)
  const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, species)
  const fullHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
    getFaqPageJsonLd(contactFaqItems),
  ]

  return (
    <main className="notatnik-page contact-page contact-page-redesign">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="contact" />
      <div className="notatnik-shell contact-shell">
        <NotatnikTopbar
          tag="Kontakt"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref={quickHref}
          ctaLabel="Umów pierwszy krok"
          ctaVariant="accent"
        />

        <section className="contact-hero-grid" id="formularz">
          <div className="contact-hero-copy">
            <h1>Napisz, zanim zarezerwujesz.</h1>
            <p>
              Wystarczy gatunek, temat i kilka zdań. Odpowiem w ciągu 1-2 dni roboczych i wskażę
              najprostszy kolejny krok.
            </p>
            <div className="contact-hero-actions">
              <a href="#formularz" className="notatnik-btn">
                <span>Wyślij krótką wiadomość</span>
              </a>
              <Link href={quickHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Umów pierwszy krok</span>
              </Link>
            </div>
            <div className="contact-hero-proof" aria-label="Najwazniejsze informacje">
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
            <ContactLeadForm />
            <div className="contact-form-note">
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>
                Odpowiem na adres e-mail z formularza. Jeśli sprawa wymaga rozmowy, podpowiem
                najprostszy format: Kwadrans, Dwa kwadranse albo pełną konsultację.
              </span>
            </div>
          </article>
        </section>

        <section className="contact-trust-strip" aria-label="Najwazniejsze informacje">
          {homepageTrustBadges.map((badge, index) => {
            const Icon = trustIcons[index] ?? BadgeCheck

            return (
              <span key={badge.title} className="contact-trust-strip-item">
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                <strong>{badge.title}</strong>
                {badge.helper ? <small>{badge.helper}</small> : null}
              </span>
            )
          })}
        </section>

        <section className="contact-lower-grid">
          <div className="contact-lower-left">
            <section className="contact-booking-panel" aria-labelledby="contact-booking-title">
              <h2 id="contact-booking-title">Jeśli wolisz od razu zarezerwować</h2>
              <p className="contact-booking-lead">
                Wybierz format rozmowy. Jezeli nie masz pewnosci, zostaw krotka wiadomosc w formularzu powyzej.
              </p>
              <div className="contact-booking-cards">
                <article className="contact-booking-card">
                  <span>Najprostszy start</span>
                  <h3>Kwadrans z behawiorysta</h3>
                  <strong>15 min audio bez kamery / 69 zł.</strong>
                  <p>Dla krótkiego uporządkowania sytuacji i pierwszego kierunku.</p>
                  <Link href={quickHref} prefetch={false} className="notatnik-btn">
                    <span>Zarezerwuj Kwadrans</span>
                  </Link>
                </article>
                <article className="contact-booking-card contact-booking-card-urgent">
                  <span>Gdy sprawa jest pilna</span>
                  <h3>Kwadrans na juz</h3>
                  <strong>15 min audio / 99 zł.</strong>
                  <p>Kalendarz priorytetowego terminu, gdy potrzebujesz szybkiego pierwszego kroku.</p>
                  <Link href={urgentHref} prefetch={false} className="notatnik-btn">
                    <span>Sprawdz najblizszy termin</span>
                  </Link>
                </article>
                <article className="contact-booking-card">
                  <span>Wiecej miejsca na temat</span>
                  <h3>Dwa kwadranse</h3>
                  <strong>30 min online / 169 zł.</strong>
                  <p>Gdy 15 minut moze byc za krotkie, ale nie potrzebujesz pelnej konsultacji.</p>
                  <Link href={bridgeHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                    <span>Zarezerwuj Dwa kwadranse</span>
                  </Link>
                </article>
                <article className="contact-booking-card contact-booking-card-soft">
                  <span>Sprawa złożona albo przewlekła</span>
                  <h3>Pełna konsultacja behawioralna</h3>
                  <strong>470 zł / pełny zakres.</strong>
                  <p>Dla sytuacji, które wymagają dokładnego wywiadu, planu pracy i dalszego wsparcia.</p>
                  <Link href={fullHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                    <span>Umów pełną konsultację</span>
                  </Link>
                </article>
              </div>
            </section>

            <section className="contact-direct-panel" aria-labelledby="contact-direct-title">
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
          </div>

          <aside className="contact-lower-right">
            <section className="contact-process-panel" aria-labelledby="contact-process-title">
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

            <section className="contact-faq-panel" aria-labelledby="contact-faq-title">
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
          </aside>
        </section>

        <NotatnikFooter primaryHref={quickHref} primaryLabel="Kwadrans z behawiorystą" showReviews={false} />
      </div>
    </main>
  )
}
