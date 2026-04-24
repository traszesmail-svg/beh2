import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getPersonJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import {
  CAPBT_PROFILE_URL,
  CAPBT_ORG_URL,
  INSTAGRAM_PROFILE_URL,
  MEDIA_MENTIONS,
  SPECIALIST_NAME,
  SPECIALIST_PUBLIC_PROOF_SUMMARY,
  SPECIALIST_PUBLIC_STATUS,
  SPECIALIST_STATUS_EXPLANATION,
} from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krzysztof Regulski - behawiorysta COAPE psow i kotow',
  path: '/o-mnie',
  description:
    'Krzysztof Regulski - behawiorysta COAPE psow i kotow. Sposob pracy, kwalifikacje, profil publiczny i informacje przed kontaktem.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')

const workStyleCards = [
  {
    title: 'Zaczynam od tego, co dzieje sie dzis',
    copy: 'Interesuje mnie konkretna codziennosc: kiedy pojawia sie problem, co go poprzedza i co najbardziej obciaza dom.',
  },
  {
    title: 'Oddzielam objaw od tla',
    copy: 'Nie zatrzymuje sie na samym sygnale. Sprawdzam tez srodowisko, relacje, rytm dnia i to, co moze podtrzymywac zachowanie.',
  },
  {
    title: 'Mowie wprost, kiedy potrzeba czegos wiecej',
    copy: 'Jesli temat wymaga szerszej konsultacji, badan albo zmiany priorytetu, uslyszysz to od razu i bez ozdobnikow.',
  },
] as const

const trustCards = [
  {
    eyebrow: 'Profil publiczny',
    title: 'Status COAPE i profil CAPBT',
    copy: SPECIALIST_STATUS_EXPLANATION,
    href: CAPBT_PROFILE_URL,
    cta: 'Zweryfikuj profil',
  },
  {
    eyebrow: 'Publiczne tresci',
    title: 'Instagram i publikacje',
    copy: 'Mozesz sprawdzic sposob komunikacji marki i opublikowane teksty o podobnych tematach poza sama strona.',
    href: MEDIA_MENTIONS[0]?.href ?? INSTAGRAM_PROFILE_URL,
    cta: MEDIA_MENTIONS[0] ? 'Zobacz artykul' : 'Otworz Instagram',
  },
  {
    eyebrow: 'Srodowisko zawodowe',
    title: 'COAPE, COAPE Polska i CAPBT',
    copy: 'To publiczne punkty odniesienia dla sposobu pracy i miejsca tego profilu w srodowisku zawodowym.',
    href: CAPBT_ORG_URL,
    cta: 'Zobacz srodowisko',
  },
] as const

export default function AboutPage() {
  const faqItems = FAQ_SHORTLISTS.consultation.slice(0, 3)
  const structuredData = [
    getPersonJsonLd(),
    getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'O mnie', path: '/o-mnie' }]),
    getFaqPageJsonLd(faqItems),
  ]

  return (
    <NotatnikPageShell
      tag="O mnie / podejscie"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <Schema data={structuredData} />
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">O mnie / podejscie</div>
          <h1>Krzysztof Regulski - behawiorysta psow i kotow.</h1>
          <p>
            Pomagam uporzadkowac sytuacje psa albo kota tak, zeby po rozmowie zostal jasny pierwszy krok. Bez egzaminowania opiekuna i bez
            sztucznej pewnosci tam, gdzie najpierw trzeba cos sprawdzic.
          </p>
          <div className="notatnik-subhero-actions">
            <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Jak wyglada konsultacja</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Napisz wiadomosc</span>
            </Link>
          </div>
        </div>

        <div className="notatnik-subhero-media">
          <div className="notatnik-hero-card">
            <div className="notatnik-hero-card-corner notatnik-mono">Publiczny status</div>
            <div className="notatnik-hero-card-media" style={{ height: 360 }}>
              <Image
                src="/branding/specialist-krzysztof-portrait.jpg"
                alt="Krzysztof Regulski, behawiorysta i technik weterynarii"
                fill
                sizes="(max-width: 980px) 100vw, 40vw"
                priority
              />
            </div>
            <div className="notatnik-hero-card-body">
              <h3>{SPECIALIST_NAME}</h3>
              <p>{SPECIALIST_PUBLIC_STATUS}</p>
              <span>{SPECIALIST_PUBLIC_PROOF_SUMMARY}</span>
              <div className="notatnik-price-row notatnik-price-row-plain">
                <Link href={CAPBT_PROFILE_URL} target="_blank" rel="noreferrer noopener" className="notatnik-inline-link">
                  Zobacz profil CAPBT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="I." kicker="3 filary pracy" title="Jak pracuje z problemem psa albo kota." />
        <div className="card-grid three-up top-gap-small">
          {workStyleCards.map((card) => (
            <article key={card.title} className="summary-card tree-backed-card">
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="3 publiczne sygnaly zaufania" title="Co mozesz sprawdzic publicznie." />
        <div className="card-grid three-up top-gap-small">
          {trustCards.map((card) => (
            <article key={card.title} className="summary-card tree-backed-card">
              <div className="section-eyebrow">{card.eyebrow}</div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <a href={card.href} target="_blank" rel="noreferrer noopener" className="notatnik-inline-link">
                {card.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="list-card accent-outline tree-backed-card top-gap-small">
          <strong>To ma byc strona o osobie i sposobie pracy.</strong>
          <span>Nie wybierasz tu pakietu. Sprawdzasz, czy sposob myslenia, jezyk i publiczne zrodla sa dla Ciebie wiarygodne.</span>
        </div>
      </section>

      <section id="faq">
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania o sposob pracy." />
        <div className="card-grid three-up top-gap-small">
          {faqItems.map((item) => (
            <article key={item.question} className="summary-card tree-backed-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli chcesz sprawdzic to w rozmowie, <em>zacznij od Kwadransu.</em>"
        copy="Ta strona ma pomoc ocenic osobe i sposob pracy. Pierwszy krok dalej zostaje prosty."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref="/kontakt#formularz"
        secondaryLabel="Napisz wiadomosc"
      />
    </NotatnikPageShell>
  )
}
