import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, CircleHelp, Mail, ReceiptText, ShieldCheck } from 'lucide-react'
import { FinalReviewsQuoteCarousel } from '@/components/FinalReviewsQuoteCarousel'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import { REGULSKI_WEB_LOGO } from '@/lib/regulski-web-assets'
import { catReviews, dogReviews, reviews } from '@/lib/reviews.config'
import {
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  SITE_HEADER_BRAND,
  SPECIALIST_NAME,
  buildMailtoHref,
  getPublicContactDetails,
} from '@/lib/site'

type FooterProps = {
  variant?: 'landing' | 'lean' | 'full' | 'home' | 'legal'
  ctaHref?: string
  ctaLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  showReviews?: boolean
  reviewSpecies?: 'dog' | 'cat' | 'all'
  sectionBasePath?: '/' | '/blog' | '/psy' | '/koty' | '/opinie' | '/o-mnie' | '/faq' | '/kontakt' | '/materialy' | '/niezbednik'
}

const FOOTER_NAV_ITEMS = [
  { href: '/cennik', label: 'Cennik', icon: ReceiptText },
  { href: '/niezbednik', label: 'Niezbędnik', icon: BookOpen },
  { href: '/o-mnie', label: 'O mnie', icon: ShieldCheck },
  { href: '/faq', label: 'FAQ', icon: CircleHelp },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/kontakt', label: 'Kontakt', icon: Mail },
] as const

export function Footer(props: FooterProps) {
  const buildMarker = getBuildMarkerSnapshot()
  const footerReviews = props.reviewSpecies === 'dog' ? dogReviews : props.reviewSpecies === 'cat' ? catReviews : reviews
  const contact = getPublicContactDetails()
  const contactHref = contact.email ? buildMailtoHref(contact.email, 'Pytanie że stopki - Regulski Behawiorysta') : null

  return (
    <>
      {props.showReviews === false ? null : <FinalReviewsQuoteCarousel reviews={footerReviews} intervalMs={10000} />}
      <footer className="site-footer" aria-label="Stopka" data-build-marker={buildMarker.value}>
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" prefetch={false} className="site-footer-brand-lockup" aria-label="Wróć na stronę główną Regulski Behawiorysta">
              <span className="site-footer-brand-mark">
                <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} />
              </span>
              <span className="site-footer-brand-copy">
                <span>{SITE_HEADER_BRAND}</span>
                <small>
                  Krzysztof Regulski - behawiorysta zwierzęcy, doświadczony technik weterynarii i dietetyk. Pomagam opiekunom psów i kotów zrozumieć zachowanie, znaleźć możliwą przyczynę i wybrać pierwszy krok bez presji, kar i zgadywania.
                </small>
              </span>
            </Link>
            {contact.email && contactHref ? (
              <p>
                E-mail:{' '}
                <a href={contactHref}>
                  {contact.email}
                </a>
              </p>
            ) : null}
          </div>

          <div className="site-footer-meta">
            <div className="site-footer-nav">
              <div className="section-eyebrow">Nawigacja</div>
              <div className="site-footer-links">
                {FOOTER_NAV_ITEMS.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link key={item.href} href={item.href} prefetch={false} className="site-footer-link">
                      <span className="site-footer-link-icon" aria-hidden="true">
                        <Icon size={15} strokeWidth={1.9} />
                      </span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <div className="site-footer-credit-block">
            <div className="site-footer-credentials" aria-label="Akredytacje i organizacje">
              <Link href={COAPE_ORG_URL} target="_blank" rel="noopener noreferrer" aria-label="Otwórz stronę COAPE">
                <Image src="/branding/credentials/coape-logo.jpg" alt="COAPE" width={220} height={72} />
              </Link>
              <Link href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="Otwórz profil CAPBT">
                <Image src="/branding/credentials/capbt-logo.png" alt="CAPBT" width={162} height={72} />
              </Link>
            </div>
            <div className="site-footer-credit">
              <span>&copy; 2026 {SPECIALIST_NAME}</span>
            </div>
          </div>

          <div className="site-footer-legal">
            <Link href="/polityka-prywatnosci" prefetch={false}>
              Polityka prywatności
            </Link>
            <span>&bull;</span>
            <Link href="/regulamin" prefetch={false}>
              Regulamin
            </Link>
            <span>&bull;</span>
            <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
              Regulamin Pełnej konsultacji
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
