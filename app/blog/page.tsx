import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Mail, Search } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { PetLeafHeroArt } from '@/components/PetLeafHeroArt'
import { Schema } from '@/components/schema'
import { BLOG_ROUTE_BASE, getBlogListingMetadata, listBlogPosts, type BlogPost } from '@/lib/blog'
import { buildBookHref } from '@/lib/booking-routing'
import { repairCopy } from '@/lib/copy'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getBreadcrumbJsonLd, getItemListJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl } from '@/lib/server/env'

export const dynamic = 'force-static'

export const metadata: Metadata = getBlogListingMetadata({
  title: 'Blog o zachowaniu psów i kotów',
  path: BLOG_ROUTE_BASE,
  description: 'Blog o zachowaniu psów i kotów: praktyczne teksty o spacerach, kuwecie, stresie i konsultacjach online.',
})

const FEATURED_BLOG_SLUGS = [
  'dlaczego-moj-pies-szczeka-na-inne-psy',
  'kot-zalatwia-sie-poza-kuweta',
  'pies-ciagnie-na-smyczy',
  'stres-kota-a-zachowania-toaletowe',
  'pies-ciagnie-na-smyczy-od-czego-zaczac',
  'jak-zapoznac-dwa-koty',
  'pies-wyje-kiedy-zostaje-sam',
  'jak-wprowadzic-nowego-kota-do-domu',
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy',
] as const

function pickFeaturedPosts(posts: BlogPost[]) {
  const bySlug = new Map(posts.map((post) => [post.slug, post] as const))
  const featured = FEATURED_BLOG_SLUGS.map((slug) => bySlug.get(slug)).filter((post): post is BlogPost => Boolean(post))
  const rest = posts.filter((post) => !FEATURED_BLOG_SLUGS.includes(post.slug as (typeof FEATURED_BLOG_SLUGS)[number]))

  return [...featured, ...rest].slice(0, 9)
}

function getSpeciesBadge(post: BlogPost) {
  if (post.categoryHref === '/koty') return 'Kot'
  if (post.categoryHref === '/psy') return 'Pies'
  return repairCopy(post.categoryLabel)
}

function getSpeciesClass(post: BlogPost) {
  if (post.categoryHref === '/koty') return 'is-cat'
  if (post.categoryHref === '/psy') return 'is-dog'
  return 'is-neutral'
}

function countBy(posts: BlogPost[], predicate: (post: BlogPost) => boolean) {
  return posts.filter(predicate).length
}

function buildCategories(posts: BlogPost[]) {
  const articleListHref = '#artykuly'

  return [
    { label: 'Pies', href: articleListHref, count: countBy(posts, (post) => post.categoryHref === '/psy') },
    { label: 'Kot', href: articleListHref, count: countBy(posts, (post) => post.categoryHref === '/koty') },
    { label: 'Zachowanie', href: articleListHref, count: posts.length },
    { label: 'Emocje', href: articleListHref, count: countBy(posts, (post) => /stres|lek|lęk|wyje|boi|napieciu|napięciu/i.test(post.slug)) },
    { label: 'Relacja', href: articleListHref, count: countBy(posts, (post) => /relac|zapoznac|wprowadzic|nowy|trener/i.test(post.slug)) },
    { label: 'Dom', href: articleListHref, count: countBy(posts, (post) => /dom|kuwet|meble|sam|samotnos/i.test(post.slug)) },
    { label: 'Szczeniak / Kocię', href: articleListHref, count: countBy(posts, (post) => /szczeniak|nowy-pies|nowego-kota/i.test(post.slug)) },
    { label: 'Niezbędnik', href: articleListHref, count: 8 },
  ]
}

export default function BlogPage() {
  const posts = listBlogPosts()
  const featuredPosts = pickFeaturedPosts(posts)
  const popularPosts = featuredPosts.slice(0, 5)
  const categories = buildCategories(posts)
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const urgentHref = buildBookHref(null, 'kwadrans-na-juz')
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

  return (
    <main className="notatnik-page blog-page blog-index-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell blog-index-shell">
        <EditorialIndexTopbar />

        <div className="blog-index-content">
          <section className="blog-index-hero" aria-labelledby="blog-index-title">
            <div className="blog-index-hero-copy">
              <span className="blog-index-pill">Blog</span>
              <h1 id="blog-index-title">Wiedza, która pomaga zrozumieć i działać.</h1>
              <p>
                Praktyczne artykuły o psach i kotach: o zachowaniu, emocjach, relacji i codziennych trudnościach.
                Bez mitów, bez presji, za to z empatią i doświadczeniem.
              </p>
              <form className="blog-index-search" action="/blog" role="search">
                <Search size={18} strokeWidth={1.9} aria-hidden="true" />
                <label className="sr-only" htmlFor="blog-search">
                  Szukaj w artykułach
                </label>
                <input id="blog-search" name="q" type="search" placeholder="Szukaj w artykułach..." />
              </form>
            </div>

            <div className="blog-index-hero-art" aria-hidden="true">
              <PetLeafHeroArt />
            </div>
          </section>

          <section id="artykuly" className="blog-index-layout" aria-label="Artykuły i kategorie">
            <div className="blog-index-grid">
              {featuredPosts.map((post) => (
                <article key={post.slug} className="blog-index-card">
                  <Link href={post.path} prefetch={false} className="blog-index-card-media" aria-label={repairCopy(post.title)}>
                    <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(max-width: 760px) 92vw, (max-width: 1180px) 42vw, 300px" />
                    <span className={`blog-index-card-badge ${getSpeciesClass(post)}`}>{getSpeciesBadge(post)}</span>
                  </Link>
                  <div className="blog-index-card-body">
                    <h2>
                      <Link href={post.path} prefetch={false}>
                        {repairCopy(post.title)}
                      </Link>
                    </h2>
                    <p>{repairCopy(post.excerpt)}</p>
                  </div>
                  <div className="blog-index-card-meta">
                    <span>
                      <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
                      <time dateTime={post.publishedAt}>{repairCopy(post.publishedAtLabel)}</time>
                    </span>
                    <span>
                      <Clock3 size={14} strokeWidth={1.8} aria-hidden="true" />
                      {post.readingTimeMinutes} min czytania
                    </span>
                    <Link href={post.path} prefetch={false} aria-label={`Czytaj: ${repairCopy(post.title)}`}>
                      <ArrowRight size={16} strokeWidth={1.9} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <aside className="blog-index-sidebar" aria-label="Panel bloga">
              <section className="blog-index-side-card">
                <h2>Kategorie</h2>
                <div className="blog-index-category-list">
                  {categories.map((category) => (
                    <Link key={category.label} href={category.href} prefetch={false}>
                      <span>{category.label}</span>
                      <small>{category.count}</small>
                      <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-index-start-card">
                <div>
                  <h2>Nie wiesz, od czego zacząć?</h2>
                  <p>Opisz krótko, co się dzieje, a pomogę Ci wybrać najlepszy pierwszy krok.</p>
                </div>
                <div className="blog-index-start-actions">
                  <Link href="/kontakt#formularz" prefetch={false} className="blog-index-button is-primary">
                    Wyślij krótką wiadomość
                  </Link>
                  <Link href="/wybor" prefetch={false} className="blog-index-button is-secondary">
                    Umów pierwszy krok
                  </Link>
                </div>
              </section>

              <section className="blog-index-side-card">
                <h2>Popularne artykuły</h2>
                <ol className="blog-index-popular-list">
                  {popularPosts.map((post, index) => (
                    <li key={post.slug}>
                      <Link href={post.path} prefetch={false}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{repairCopy(post.title)}</strong>
                        <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="blog-index-newsletter-card">
                <div className="blog-index-newsletter-head">
                  <div>
                    <h2>Zapisz się do newslettera</h2>
                    <p>Raz w tygodniu praktyczna wiedza i prosty kierunek działania.</p>
                  </div>
                  <Mail size={34} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <form className="blog-index-newsletter-form" action="/newsletter">
                  <label className="sr-only" htmlFor="blog-newsletter-email">
                    Twój e-mail
                  </label>
                  <input id="blog-newsletter-email" name="email" type="email" placeholder="Twój e-mail" />
                  <button type="submit">Zapisz się</button>
                </form>
                <small>Bez spamu. Możesz wypisać się w każdej chwili.</small>
              </section>
            </aside>
          </section>

          <nav className="blog-index-pagination" aria-label="Paginacja bloga">
            <Link href="/blog" prefetch={false} aria-label="Poprzednia strona">
              <ChevronLeft size={17} strokeWidth={1.9} />
            </Link>
            <Link href="/blog" prefetch={false} aria-current="page">
              1
            </Link>
            <Link href="/blog?page=2" prefetch={false}>
              2
            </Link>
            <Link href="/blog?page=3" prefetch={false}>
              3
            </Link>
            <span>...</span>
            <Link href="/blog?page=12" prefetch={false}>
              12
            </Link>
            <Link href="/blog?page=2" prefetch={false} aria-label="Następna strona">
              <ChevronRight size={17} strokeWidth={1.9} />
            </Link>
          </nav>

          <section className="blog-index-support">
            <span className="blog-index-support-icon" aria-hidden="true">
              <CalendarDays size={34} strokeWidth={1.7} />
            </span>
            <div>
              <h2>Potrzebujesz indywidualnego wsparcia?</h2>
              <p>Artykuły to dobry start, ale nic nie zastąpi dopasowanej pomocy. Wspólnie znajdziemy najlepsze rozwiązanie dla Was.</p>
            </div>
            <div className="blog-index-support-actions">
              <Link href="/kontakt#formularz" prefetch={false} className="blog-index-button is-primary">
                Wyślij krótką wiadomość
              </Link>
              <Link href={audioHref} prefetch={false} className="blog-index-button is-secondary">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={urgentHref} prefetch={false} className="blog-index-button is-urgent">
                Szybka pomoc
              </Link>
            </div>
          </section>
        </div>

        <Footer variant="full" showReviews={false} />
      </div>
    </main>
  )
}
