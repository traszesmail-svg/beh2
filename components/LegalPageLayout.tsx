import Link from 'next/link'
import type { ReactNode } from 'react'
import { FileText, Globe2, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { ReferenceContactCard, ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import {
  CAPBT_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'

export type LegalSummaryItem = {
  label: string
  value: string
}

export type LegalSection = {
  title: string
  body: ReactNode
}

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  intro: string
  contactSubject: string
  summaryItems: LegalSummaryItem[]
  sections: LegalSection[]
  supportTitle: string
  supportText: string
  supportNoteTitle: string
  supportNoteText: string
  structuredData?: Record<string, unknown>[]
}

export function LegalPageLayout({
  eyebrow,
  title,
  intro,
  contactSubject,
  summaryItems,
  sections,
  supportTitle,
  supportText,
  supportNoteTitle,
  supportNoteText,
  structuredData = [],
}: LegalPageLayoutProps) {
  const contact = getPublicContactDetails()
  const contactMailtoHref = contact.email ? buildMailtoHref(contact.email, contactSubject) : null
  const bookHref = buildBookHref(null, 'szybka-konsultacja-15-min')

  return (
    <ReferencePageShell className="reference-legal-page" ctaHref={bookHref}>
      {structuredData.length > 0 ? <Schema data={structuredData} /> : null}

      <section className="reference-hero reference-legal-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
          <div className="reference-hero-actions">
            <Link href="/cennik" prefetch={false} className="reference-btn reference-btn-primary">
              Wróć do cennika
            </Link>
            <Link href="/kontakt#formularz" prefetch={false} className="reference-btn reference-btn-secondary">
              Kontakt
            </Link>
          </div>
        </div>

        <aside className="reference-legal-summary" aria-label="Skrót dokumentu">
          <div className="reference-legal-summary-icon" aria-hidden="true">
            <FileText size={34} strokeWidth={1.7} />
          </div>
          <h2>Najważniejsze informacje</h2>
          <div className="reference-info-list">
            {summaryItems.map((item) => (
              <div key={item.label} className="reference-info-row">
                <ShieldCheck size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.value}</small>
                </span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="reference-main-layout">
        <div className="reference-content-column">
          <section className="reference-section-card reference-legal-document">
            {sections.map((section, index) => (
              <article key={section.title} className="reference-legal-section">
                <div className="reference-legal-number">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <h2>{section.title}</h2>
                  <div className="reference-legal-body">{section.body}</div>
                </div>
              </article>
            ))}
          </section>

          <section className="reference-section-card reference-legal-note">
            <h2>{supportNoteTitle}</h2>
            <p>{supportNoteText}</p>
            <div className="reference-hero-actions">
              {contactMailtoHref ? (
                <a href={contactMailtoHref} className="reference-btn reference-btn-primary">
                  Napisz e-mail
                </a>
              ) : null}
              <Link href="/kontakt#formularz" prefetch={false} className="reference-btn reference-btn-secondary">
                Formularz kontaktowy
              </Link>
            </div>
          </section>
        </div>

        <aside className="reference-sidebar">
          <div className="reference-side-card reference-help-card">
            <h2>{supportTitle}</h2>
            <p>{supportText}</p>
            <div className="reference-info-list">
              {contact.email ? (
                <a href={contactMailtoHref ?? `mailto:${contact.email}`} className="reference-info-row">
                  <Mail size={22} strokeWidth={1.7} aria-hidden="true" />
                  <span>
                    <strong>E-mail</strong>
                    <small>{contact.email}</small>
                  </span>
                </a>
              ) : null}
              <div className="reference-info-row">
                <Globe2 size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Obszar działania</strong>
                  <small>Kontakt online / cała Polska</small>
                </span>
              </div>
              <div className="reference-info-row">
                <UserRound size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Kto odpowiada</strong>
                  <small>
                    {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
                  </small>
                </span>
              </div>
            </div>
          </div>

          <div className="reference-side-card">
            <h2>Profile publiczne</h2>
            <div className="reference-info-list">
              <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="reference-info-row">
                <ShieldCheck size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Profil CAPBT / COAPE</strong>
                  <small>Publiczny profil kwalifikacji.</small>
                </span>
              </a>
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="reference-info-row">
                <Globe2 size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Instagram</strong>
                  <small>@regulskibehawiorysta</small>
                </span>
              </a>
            </div>
          </div>

          <ReferenceContactCard />
        </aside>
      </section>

      <ReferenceFinalCta
        title="Masz pytanie do dokumentu?"
        copy="Napisz krótko, którego zapisu dotyczy pytanie. Odpowiem przez e-mail albo formularz kontaktowy."
        primaryHref="/kontakt#formularz"
        primaryLabel="Napisz wiadomość"
        secondaryHref="/cennik"
        secondaryLabel="Wróć do cennika"
      />
    </ReferencePageShell>
  )
}
