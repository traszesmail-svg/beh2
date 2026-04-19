import React, { type ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLeadForm } from '@/components/ContactLeadForm'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref, readBookingSpeciesSearchParam } from '@/lib/booking-routing'
import { COPY_HELPERS } from '@/lib/copy-governance'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS, TRUST_SIGNAL_SETS } from '@/lib/trust-layer'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import {
  CAPBT_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SPECIALIST_NAME,
  getPublicContactDetails,
  getPublicContactEmailNote,
} from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt',
  path: '/kontakt',
  description: 'Napisz krótko, jeśli chcesz doprecyzować temat albo sprawdzić dostępność terminu.',
})

type SectionIntroProps = {
  eyebrow: string
  title: string
  description: string
}

type BriefCard = {
  title: string
  copy: string
}

type PublicContactCard = {
  title: string
  content: ReactNode
}

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="editorial-section-head">
      <div className="editorial-section-head-copy">
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <p className="editorial-section-lead">{description}</p>
    </div>
  )
}

const briefCards: BriefCard[] = [
  {
    title: 'Napisz krótko',
    copy: 'W wiadomości wystarczy gatunek, temat i 2-4 zdania opisu.',
  },
  {
    title: 'Możesz od razu wybrać Kwadrans',
    copy: 'Jeśli wiesz już, że chcesz rozmowę, najprościej zacząć od Kwadransu z behawiorystą.',
  },
  {
    title: 'Wiadomość służy do pytania',
    copy: 'Formularz jest po to, żeby krótko opisać sprawę albo zadać pytanie przed rozmową.',
  },
]

function getSpeciesCopy(species: 'pies' | 'kot' | null) {
  if (species === 'pies') {
    return {
      lead: 'dla psa',
      message: 'Jeśli sprawa dotyczy psa, po prostu wpisz to w wiadomości.',
    }
  }

  if (species === 'kot') {
    return {
      lead: 'dla kota',
      message: 'Jeśli sprawa dotyczy kota, po prostu wpisz to w wiadomości.',
    }
  }

  return {
    lead: 'dla psa lub kota',
    message: 'W wiadomości możesz od razu wskazać właściwy gatunek.',
  }
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const species = readBookingSpeciesSearchParam(searchParams?.species)
  const speciesCopy = getSpeciesCopy(species)
  const publicContact = getPublicContactDetails()
  const publicContactNote = getPublicContactEmailNote()
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const formHref = '#formularz'
  const prepGuide = getLeadMagnetBySlug('przygotowanie-do-konsultacji-online')
  const publicContactCards: PublicContactCard[] = [
    {
      title: 'E-mail',
      content: (
        <a href={`mailto:${publicContact.email}`} className="prep-inline-link">
          {publicContact.email}
        </a>
      ),
    },
    {
      title: 'Profile publiczne',
      content: (
        <>
          <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="prep-inline-link">
            Profil CAPBT
          </a>{' '}
          i{' '}
          <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="prep-inline-link">
            Instagram
          </a>{' '}
          pokazują publiczne informacje o marce.
        </>
      ),
    },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    description: `${SITE_TAGLINE}. Kontakt dla ${speciesCopy.lead}.`,
    url: new URL('/kontakt', getCanonicalBaseUrl()).toString(),
    provider: {
      '@type': 'Person',
      name: SPECIALIST_NAME,
    },
  }

  return (
    <main className="page-wrap editorial-home-page premium-home-page contact-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell contact-hero-shell" id="kontakt">
          <div className="editorial-hero-grid contact-hero-grid">
            <div className="editorial-hero-copy contact-hero-copy">
              <div className="section-eyebrow">Kontakt</div>
              <h1>Napisz, jeśli chcesz doprecyzować temat albo zadać pytanie.</h1>
              <p className="editorial-hero-lead">
                Jeśli chcesz opisać sprawę albo sprawdzić, od czego zacząć, wyślij krótką wiadomość. Wystarczy gatunek,
                temat i zwięzły opis sytuacji. {COPY_HELPERS.contactResponseWindow}
              </p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={formHref}
                primaryLocation="contact-hero-audio"
                secondaryLocation="contact-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions contact-hero-actions"
              />

              <p className="muted top-gap-small">
                Jeśli wiesz, że potrzebujesz dłuższej rozmowy, możesz od razu wybrać{' '}
                <Link href={consultationHref} prefetch={false} className="prep-inline-link">
                  {FUNNEL_CTA_LABELS.consultation.toLowerCase()}
                </Link>
                . Jeśli chcesz napisać, przewiń niżej do formularza.
              </p>

              <p className="contact-support-copy">
                {speciesCopy.message} W wiadomości wystarczy wskazać gatunek, temat i 2-4 zdania opisu sytuacji.
              </p>
            </div>

            <aside className="contact-hero-side" aria-label="Podstawowe informacje o kontakcie">
              {briefCards.map((card) => (
                <article key={card.title} className="summary-card tree-backed-card contact-hero-card contact-hero-card-soft">
                  <h3>{card.title}</h3>
                  <p className="muted">{card.copy}</p>
                </article>
              ))}
            </aside>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="jak-umowic-konsultacje">
          <SectionIntro
            eyebrow="Wybór formy"
            title="Kwadrans, konsultacja 60 min albo krótka wiadomość"
            description="Kwadrans z behawiorystą sprawdza się przy krótszym temacie. Konsultacja 60 min jest dla spraw szerszych. Wiadomość służy do doprecyzowania tematu."
          />

          <div className="card-grid three-up top-gap">
            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Kwadrans z behawiorystą</div>
              <h3>15 minut rozmowy audio</h3>
              <p>Dobry wybór, gdy chcesz omówić jedno pytanie albo spokojnie uporządkować temat.</p>
              <div className="editorial-hero-meta" aria-label="Parametry usługi">
                <span>15 min</span>
                <span>69 zł</span>
                <span>audio</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={audioHref} prefetch={false} className="button button-primary">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Konsultacja 60 min</div>
              <h3>Szersza rozmowa online</h3>
              <p>Wybierz ją wtedy, gdy problem jest bardziej złożony, trwa dłużej albo obejmuje kilka wątków.</p>
              <div className="editorial-hero-meta" aria-label="Parametry usługi">
                <span>60 min</span>
                <span>350 zł</span>
                <span>online</span>
              </div>
              <div className="hero-actions top-gap-small">
                <Link href={consultationHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.consultation}
                </Link>
              </div>
            </article>

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Wiadomość</div>
              <h3>Krótkie pytanie</h3>
              <p>Jeżeli chcesz coś doprecyzować przed rozmową, wystarczy krótki opis sytuacji i kontakt.</p>
              <div className="editorial-hero-meta" aria-label="Parametry formularza">
                <span>gatunek</span>
                <span>temat</span>
                <span>kontakt</span>
              </div>
              <div className="hero-actions top-gap-small">
                <a href={formHref} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="panel section-panel editorial-section" id="rezerwacja">
          <SectionIntro
            eyebrow="Krótka wiadomość"
            title="Jeżeli nie wybierasz terminu od razu, wyślij krótką wiadomość"
            description="Wystarczy gatunek, temat, 2-4 zdania opisu i adres e-mail."
          />

          <div className="premium-two-column-grid top-gap contact-final-grid">
            <div className="contact-final-left">
              <article className="summary-card tree-backed-card contact-support-card">
                <span className="pill subtle-pill">Kontakt</span>
                <h3>Kontakt przez formularz i e-mail</h3>
                <div className="legal-support-grid">
                  {publicContactCards.map((card) => (
                    <div key={card.title} className="list-card tree-backed-card">
                      <strong>{card.title}</strong>
                      <span>{card.content}</span>
                    </div>
                  ))}
                </div>
                <p className="muted top-gap-small">{publicContactNote}</p>
              </article>

              <article className="summary-card tree-backed-card contact-booking-card">
                <span className="pill">Kiedy napisać</span>
                <h3>Krótka wiadomość ma sens wtedy, gdy chcesz coś doprecyzować przed wyborem usługi</h3>
                <ul className="premium-bullet-list">
                  <li>nie chcesz jeszcze wybierać terminu,</li>
                  <li>potrzebujesz wstępnie opisać temat,</li>
                  <li>chcesz ograniczyć kontakt do najważniejszych informacji.</li>
                </ul>
              </article>

              <article className="summary-card tree-backed-card contact-support-card contact-support-card-soft">
                <span className="pill subtle-pill">Jak opisać sprawę</span>
                <h3>Najlepiej zwięźle</h3>
                <p className="muted">
                  W zupełności wystarczy krótki opis tego, co się dzieje, od kiedy trwa problem i co obecnie najbardziej
                  wymaga uporządkowania.
                </p>
              </article>

              <article className="summary-card tree-backed-card contact-support-card contact-support-card-message">
                <span className="pill subtle-pill">Po wysłaniu formularza</span>
                <h3>Po wiadomości wskażę, co dalej</h3>
                <p className="muted">
                  Jeżeli będzie to potrzebne, wskażę od razu odpowiedni kolejny krok zamiast prowadzić długą wymianę
                  wiadomości.
                </p>
              </article>
            </div>

            <article className="summary-card tree-backed-card contact-form-card" id="formularz">
              <span className="pill subtle-pill">Formularz</span>
              <h3>Krótka wiadomość</h3>
              <p className="muted">To formularz do krótkiej wiadomości albo do pytania o dalszy krok.</p>
              <div className="contact-form-assurance">
                Wystarczy krótki opis, adres e-mail i wymagane zgody. Dalsze informacje będą potrzebne tylko wtedy, gdy
                będą niezbędne do obsługi sprawy.
              </div>
              <ContactLeadForm />
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Informacje dodatkowe"
          title="Najważniejsze informacje o kontakcie"
          description="Krótko o tym, kiedy napisać, czego dotyczy formularz i jak wygląda dalszy krok."
          items={TRUST_SIGNAL_SETS.contact}
        />

        {prepGuide ? (
          <section className="panel section-panel editorial-section" id="material-przed-kontaktem">
            <SectionIntro
              eyebrow="Materiał pomocniczy"
              title="Jeżeli chcesz uporządkować opis sprawy przed kontaktem"
              description="Materiał ma charakter uzupełniający. Nie zastępuje formularza kontaktowego ani rezerwacji konsultacji."
            />

            <div className="premium-two-column-grid top-gap-small">
              <LeadMagnetSignup magnet={prepGuide} location="contact-prep-guide" sourcePage="/kontakt" />

              <article className="summary-card tree-backed-card">
                <div className="section-eyebrow">Kiedy to ma sens</div>
                <h3>Najpierw materiał, potem wiadomość albo wybór usługi</h3>
                <p>
                  Jeśli po materiale łatwiej opisać problem, możesz wrócić do formularza albo od razu przejść do
                  rezerwacji. Materiał ma charakter pomocniczy i nie zastępuje kontaktu ani konsultacji.
                </p>
                <div className="hero-actions top-gap-small">
                  <a href={formHref} className="prep-inline-link">
                    Wróć do formularza
                  </a>
                  <Link href="/niezbednik" prefetch={false} className="prep-inline-link">
                    Przejdź do Niezbędnika
                  </Link>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <EditorialFaqSection
          id="faq"
          title="Najczęstsze pytania przed kontaktem"
          description="Krótko i jasno o tym, kiedy wybrać Kwadrans z behawiorystą, konsultację 60 min albo wiadomość."
          items={FAQ_SHORTLISTS.contact}
        />

        <Footer
          variant="home"
          sectionBasePath="/kontakt"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
