import type { Metadata } from 'next'
import Image from '@/components/BlankImage'
import Link from 'next/link'
import { HeroIllustration } from '@/components/HeroIllustration'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { BLOG_ROUTE_BASE, getBlogListingMetadata, listBlogPosts } from '@/lib/blog'
import { buildBookHref } from '@/lib/booking-routing'
import { repairCopy } from '@/lib/copy'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getLeadMagnetBySlug } from '@/lib/growth-layer'
import { FUNNEL_SECONDARY_HREF } from '@/lib/offers'
import { getBreadcrumbJsonLd, getItemListJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl } from '@/lib/server/env'

export const dynamic = 'force-static'

export const metadata: Metadata = getBlogListingMetadata({
  title: 'Blog o zachowaniu psów i kotów',
  path: BLOG_ROUTE_BASE,
  description: 'Blog o zachowaniu psów i kotów: praktyczne teksty o spacerach, kuwecie, stresie i konsultacjach online.',
})

const mainPathCards = [
  {
    href: '/psy',
    title: 'Psy',
    copy: 'Spacery, reaktywność, rozłąka i napięcie w domu.',
  },
  {
    href: '/koty',
    title: 'Koty',
    copy: 'Kuweta, stres środowiskowy i napięcie między kotami.',
  },
  {
    href: '/book',
    title: 'Kwadrans',
    copy: 'Najprostszy pierwszy krok, jeśli chcesz omówić swoją sytuację.',
  },
  {
    href: '/niezbednik',
    title: 'Niezbędnik',
    copy: 'Materiały do samodzielnej pracy, gdy chcesz najpierw spokojnie poczytać.',
  },
] as const

function getBlogVisual(post: { categoryHref: string; slug: string }) {
  if (post.categoryHref === '/koty') {
    return {
      src: post.slug.includes('kuweta') ? '/branding/side-visuals/cat-litter-home.jpg' : '/branding/side-visuals/cat-owner-home.jpg',
      alt: 'Kot w domu jako ilustracja wpisu',
    }
  }

  if (post.categoryHref === '/psy') {
    return {
      src: post.slug.includes('sam') ? '/branding/topic-cards/dog-window-alone.jpg' : '/branding/side-visuals/dog-forest-walk.jpg',
      alt: 'Pies z opiekunem jako ilustracja wpisu',
    }
  }

  return {
    src: '/branding/side-visuals/blog-notebook-desk.jpg',
    alt: 'Notatnik na biurku jako ilustracja wpisu',
  }
}

export default function BlogPage() {
  const posts = listBlogPosts()
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
    getItemListJsonLd(
      posts.map((post) => ({
        name: repairCopy(post.h1),
        url: new URL(post.path, getCanonicalBaseUrl()).toString(),
      })),
      'https://schema.org/ItemListOrderDescending',
    ),
  ]
  const leadMagnets = [
    getLeadMagnetBySlug('pies-reaktywnosc-5-krokow'),
    getLeadMagnetBySlug('kot-kuweta-checklista'),
    getLeadMagnetBySlug('przygotowanie-do-konsultacji-online'),
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <NotatnikPageShell
      tag="Blog / zachowanie psów i kotów"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
      sideVisualVariant="blog"
      pageClassName="blog-page"
    >
      <Schema data={structuredData} />
      <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }]} />
      <div className="container editorial-stack">
        <section className="panel section-panel blog-hero-panel">
          <div className="editorial-hero-grid">
            <div>
              <div className="editorial-section-head">
                <div className="editorial-section-head-copy">
                  <div className="section-eyebrow">Blog</div>
                  <h1>Teksty o zachowaniu psów i kotów - konkretnie, bez ogólników.</h1>
                </div>
                <p className="editorial-section-lead">
                  Znajdziesz tu krótkie i praktyczne teksty o najczęstszych problemach psów i kotów. Jeśli po lekturze chcesz przejść dalej,
                  pod ręką jest Kwadrans z behawiorystą, strony tematyczne i Niezbędnik.
                </p>
              </div>

              <div className="hero-actions blog-hero-actions">
                <Link href={audioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href={FUNNEL_SECONDARY_HREF} prefetch={false} className="button button-ghost big-button">
                  {FUNNEL_CTA_LABELS.secondary}
                </Link>
                <Link href="/psy" prefetch={false} className="prep-inline-link">
                  Psy
                </Link>
                <Link href="/koty" prefetch={false} className="prep-inline-link">
                  Koty
                </Link>
              </div>
            </div>

            <aside className="editorial-hero-visual hidden lg:block">
              <HeroIllustration slug="blog" emojiPlaceholder="📖" className="w-full h-full min-h-[320px]" />
            </aside>
          </div>
        </section>

        <section className="panel section-panel blog-listing-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wpisy</div>
              <h2>Artykuły na start</h2>
            </div>
            <p className="editorial-section-lead">Każdy wpis odpowiada na konkretne pytanie i pomaga zdecydować, co sprawdzić dalej.</p>
          </div>

          <div className="blog-list-grid">
            {posts.map((post) => {
              const visual = getBlogVisual(post)

              return (
                <article key={post.slug} className="summary-card tree-backed-card blog-list-card">
                  <div className="blog-card-image">
                    <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 760px) 92vw, 30vw" />
                  </div>
                  <div className="blog-list-card-topline">
                    <span className="section-eyebrow">{repairCopy(post.categoryLabel)}</span>
                    <span className="blog-list-meta">
                      <time dateTime={post.publishedAt}>{post.publishedAtLabel}</time>
                      <span>·</span>
                      <span>{post.readingTimeMinutes} min czytania</span>
                    </span>
                  </div>

                  <h3>
                    <Link href={post.path} prefetch={false} className="blog-list-title-link">
                      {repairCopy(post.title)}
                    </Link>
                  </h3>
                  <p>{repairCopy(post.excerpt)}</p>

                  <div className="blog-list-card-footer">
                    <Link href={post.path} prefetch={false} className="prep-inline-link">
                      Czytaj wpis
                    </Link>
                    <Link href={post.categoryHref} prefetch={false} className="prep-inline-link">
                      {repairCopy(post.categoryLabel)}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="panel section-panel blog-pathways-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Dalej</div>
              <h2>Zobacz też</h2>
            </div>
            <p className="editorial-section-lead">Jeśli chcesz przejść od czytania do kolejnego kroku, zacznij tutaj.</p>
          </div>

          <div className="blog-route-grid">
            {mainPathCards.map((card) => (
              <Link key={card.href} href={card.href} prefetch={false} className="summary-card tree-backed-card blog-route-card">
                <strong>{card.title}</strong>
                <span>{card.copy}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Materiały</div>
              <h2>Do czytania po blogu</h2>
            </div>
            <p className="editorial-section-lead">
              Jeśli wolisz jeszcze zostać przy materiałach, poniżej znajdziesz trzy sensowne punkty startu i zapis do newslettera.
            </p>
          </div>

          <div className="card-grid three-up top-gap-small">
            {leadMagnets.map((magnet) => (
              <article key={magnet.slug} className="summary-card tree-backed-card">
                <div className="section-eyebrow">Bezpłatny materiał</div>
                <h3>{magnet.shortTitle}</h3>
                <p>{magnet.subtitle}</p>
                <Link href={`/bezplatne-materialy/${magnet.slug}`} prefetch={false} className="prep-inline-link">
                  Zobacz materiał
                </Link>
              </article>
            ))}
          </div>

          <div className="premium-two-column-grid top-gap-small">
            {leadMagnets[0] ? <LeadMagnetSignup magnet={leadMagnets[0]} location="blog-listing-lead-magnet" sourcePage="/blog" /> : null}
            <NewsletterSignup location="blog-listing-newsletter" sourcePage="/blog" />
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
