import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {
  CAPBT_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  SPECIALIST_WIDE_PHOTO,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'

export type LegalSummaryItem = {
  label: string
  value: string
}

export type LegalSection = {
  title: string
  body: React.ReactNode
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
}

function renderAction(href: string, label: string, className: string) {
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} prefetch={false} className={className}>
      {label}
    </Link>
  )
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
}: LegalPageLayoutProps) {
  const contact = getPublicContactDetails()
  const contactMailtoHref = contact.email ? buildMailtoHref(contact.email, contactSubject) : null

  return (
    <main className="page-wrap marketing-page">
      <div className="container">
        <Header />

        <section className="two-col-section legal-stage-layout">
          <div className="panel section-panel hero-surface legal-main-panel">
            <div className="section-eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p className="hero-text">{intro}</p>

            <div className="legal-summary-grid top-gap">
              {summaryItems.map((item) => (
                <div key={item.label} className="list-card tree-backed-card legal-summary-card">
                  <strong>{item.label}</strong>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="legal-section-grid top-gap">
              {sections.map((section) => (
                <article key={section.title} className="list-card tree-backed-card legal-section-card">
                  <strong>{section.title}</strong>
                  <div className="legal-section-body">{section.body}</div>
                </article>
              ))}
            </div>

            <article className="list-card tree-backed-card legal-section-card top-gap">
              <strong>{supportNoteTitle}</strong>
              <div className="legal-section-body">
                <p>{supportNoteText}</p>
              </div>

              <div className="hero-actions top-gap-small">
                {contactMailtoHref ? renderAction(contactMailtoHref, 'Napisz e-mail', 'button button-primary big-button') : null}
                {renderAction('/kontakt#formularz', 'Formularz kontaktowy', 'button button-ghost big-button')}
              </div>
            </article>
          </div>

          <aside className="panel section-panel contact-support-panel legal-support-panel">
            <div className="contact-visual-shell">
              <Image
                src={SPECIALIST_WIDE_PHOTO.src}
                alt={SPECIALIST_WIDE_PHOTO.alt}
                width={SPECIALIST_WIDE_PHOTO.width}
                height={SPECIALIST_WIDE_PHOTO.height}
                sizes="(max-width: 980px) 100vw, 38vw"
                className="contact-feature-image"
              />
            </div>

            <div className="section-eyebrow">Dane kontaktowe</div>
            <h2>{supportTitle}</h2>
            <p className="hero-text">{supportText}</p>

            <div className="legal-support-grid">
              {contact.email ? (
                <div className="list-card tree-backed-card">
                  <strong>E-mail</strong>
                  <span>
                    <a href={contactMailtoHref ?? `mailto:${contact.email}`}>{contact.email}</a>
                  </span>
                </div>
              ) : null}

              <div className="list-card tree-backed-card">
                <strong>Obszar działania</strong>
                <span>Kontakt online / cała Polska</span>
              </div>

              <div className="list-card tree-backed-card">
                <strong>Profile publiczne</strong>
                <span>
                  <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    Profil CAPBT / COAPE
                  </a>{' '}
                  potwierdza kwalifikacje, a{' '}
                  <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                    Instagram @coapebehawiorysta
                  </a>{' '}
                  zawiera publiczne informacje o marce.
                </span>
              </div>

              <div className="list-card tree-backed-card">
                <strong>Kto odpowiada</strong>
                <span>
                  {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
                </span>
              </div>
            </div>
          </aside>
        </section>

        <Footer variant="legal" />
      </div>
    </main>
  )
}
