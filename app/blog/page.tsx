import type { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Mail } from 'lucide-react'
import { BlogArticlePreview } from '@/components/BlogArticlePreview'
import { Footer } from '@/components/Footer'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { Schema } from '@/components/schema'
import { BLOG_ROUTE_BASE, getBlogListingMetadata, listBlogPosts, type BlogPost } from '@/lib/blog'
import { repairCopy } from '@/lib/copy'
import { getBreadcrumbJsonLd, getItemListJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl } from '@/lib/server/env'

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

const BLOG_PAGE_SIZE = 9

type BlogSearchParams = {
  category?: string | string[]
  page?: string | string[]
  q?: string | string[]
}

type BlogCategory = {
  id: string
  label: string
  href: string
  count: number
  predicate?: (post: BlogPost) => boolean
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function normalizeParam(value: string | string[] | undefined) {
  return repairCopy(getSingleParam(value) ?? '').trim().toLowerCase()
}

function orderBlogPosts(posts: BlogPost[]) {
  const bySlug = new Map(posts.map((post) => [post.slug, post] as const))
  const featured = FEATURED_BLOG_SLUGS.map((slug) => bySlug.get(slug)).filter((post): post is BlogPost => Boolean(post))
  const rest = posts.filter((post) => !FEATURED_BLOG_SLUGS.includes(post.slug as (typeof FEATURED_BLOG_SLUGS)[number]))

  return [...featured, ...rest]
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

function isDogPost(post: BlogPost) {
  return post.categoryHref === '/psy'
}

function isCatPost(post: BlogPost) {
  return post.categoryHref === '/koty'
}

function isBehaviorPost(post: BlogPost) {
  return isDogPost(post) || isCatPost(post)
}

function getCategoryHref(categoryId: string) {
  if (categoryId === 'all') return `${BLOG_ROUTE_BASE}#artykuły`

  return `${BLOG_ROUTE_BASE}?category=${encodeURIComponent(categoryId)}#artykuły`
}

function buildCategories(posts: BlogPost[]): BlogCategory[] {
  const categories: BlogCategory[] = [
    { id: 'all', label: 'Wszystkie', href: getCategoryHref('all'), count: posts.length },
    { id: 'pies', label: 'Pies', href: getCategoryHref('pies'), count: countBy(posts, isDogPost), predicate: isDogPost },
    { id: 'kot', label: 'Kot', href: getCategoryHref('kot'), count: countBy(posts, isCatPost), predicate: isCatPost },
    {
      id: 'zachowanie',
      label: 'Zachowanie',
      href: getCategoryHref('zachowanie'),
      count: countBy(posts, isBehaviorPost),
      predicate: isBehaviorPost,
    },
    {
      id: 'emocje',
      label: 'Emocje',
      href: getCategoryHref('emocje'),
      count: countBy(posts, (post) => /stres|lęk|lęk|wyje|boi|napieciu|napięciu/i.test(post.slug)),
      predicate: (post) => /stres|lęk|lęk|wyje|boi|napieciu|napięciu/i.test(post.slug),
    },
    {
      id: 'relacja',
      label: 'Relacja',
      href: getCategoryHref('relacja'),
      count: countBy(posts, (post) => /relac|zapoznac|wprowadzic|nowy|trener/i.test(post.slug)),
      predicate: (post) => /relac|zapoznac|wprowadzic|nowy|trener/i.test(post.slug),
    },
    {
      id: 'dom',
      label: 'Dom',
      href: getCategoryHref('dom'),
      count: countBy(posts, (post) => /dom|kuwet|meble|sam|samotnos/i.test(post.slug)),
      predicate: (post) => /dom|kuwet|meble|sam|samotnos/i.test(post.slug),
    },
    {
      id: 'mlode',
      label: 'Szczeniak / Kocię',
      href: getCategoryHref('mlode'),
      count: countBy(posts, (post) => /szczeniak|nowy-pies|nowego-kota/i.test(post.slug)),
      predicate: (post) => /szczeniak|nowy-pies|nowego-kota/i.test(post.slug),
    },
    { id: 'niezbędnik', label: 'Niezbędnik', href: '/niezbednik', count: 8 },
  ]

  return categories
}

function filterBlogPosts(posts: BlogPost[], category: BlogCategory | undefined, query: string) {
  const byCategory = category?.predicate ? posts.filter(category.predicate) : posts
  const normalizedQuery = repairCopy(query).trim().toLowerCase()

  if (!normalizedQuery) return byCategory

  return byCategory.filter((post) => {
    const haystack = [post.title, post.h1, post.excerpt, post.categoryLabel, post.slug]
      .map((value) => repairCopy(value).toLowerCase())
      .join(' ')

    return haystack.includes(normalizedQuery)
  })
}

function getPageHref(page: number, categoryId: string, query: string) {
  const params = new URLSearchParams()

  if (categoryId !== 'all') params.set('category', categoryId)
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))

  const queryString = params.toString()

  return `${BLOG_ROUTE_BASE}${queryString ? `?${queryString}` : ''}#artykuły`
}

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
}

export default function BlogPage({ searchParams }: { searchParams?: BlogSearchParams }) {
  const posts = listBlogPosts()
  const categories = buildCategories(posts)
  const categoryId = normalizeParam(searchParams?.category) || 'all'
  const activeCategory = categories.find((category) => category.id === categoryId && category.id !== 'niezbędnik') ?? categories[0]
  const query = ''
  const orderedPosts = orderBlogPosts(posts)
  const filteredPosts = filterBlogPosts(orderedPosts, activeCategory, query)
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOG_PAGE_SIZE))
  const requestedPage = Number.parseInt(getSingleParam(searchParams?.page) ?? '1', 10)
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * BLOG_PAGE_SIZE, currentPage * BLOG_PAGE_SIZE)
  const popularPosts = orderedPosts.slice(0, 5)
  const paginationPages = getPaginationPages(currentPage, totalPages)
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
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
            </div>

            <div className="blog-index-hero-art blog-index-hero-screen" aria-hidden="true">
              <BlogArticlePreview
                title="Artykuły o zachowaniu psów i kotów"
                excerpt="Praktyczne teksty, które możesz otworzyć i przeczytać bez pośrednich ekranów."
                categoryLabel="Blog"
                variant="hero"
              />
            </div>
          </section>

          <nav className="blog-index-category-strip" aria-label="Kategorie bloga">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                prefetch={false}
                className={category.id === activeCategory?.id ? 'is-active' : undefined}
                aria-current={category.id === activeCategory?.id ? 'page' : undefined}
              >
                <span>{repairCopy(category.label)}</span>
                <small>{category.count}</small>
              </Link>
            ))}
          </nav>

          <section id="artykuły" className="blog-index-layout" aria-label="Artykuły i kategorie">
            <div className="blog-index-grid">
              {paginatedPosts.map((post) => (
                <Link key={post.slug} href={post.path} prefetch={false} className="blog-index-card">
                  <div className="blog-index-card-media" aria-label={repairCopy(post.title)}>
                    <BlogArticlePreview
                      title={post.title}
                      excerpt={post.excerpt}
                      categoryLabel={post.categoryLabel}
                      publishedAtLabel={post.publishedAtLabel}
                      readingTimeMinutes={post.readingTimeMinutes}
                    />
                    <span className={`blog-index-card-badge ${getSpeciesClass(post)}`}>{getSpeciesBadge(post)}</span>
                  </div>
                  <div className="blog-index-card-body">
                    <h2>{repairCopy(post.title)}</h2>
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
                    <span className="blog-index-card-read-state" aria-label={`Artykuł dostępny na liście: ${repairCopy(post.title)}`}>
                      <ArrowRight size={16} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
              {paginatedPosts.length === 0 ? (
                <div className="blog-index-empty">
                  <h2>Brak artykułów dla tego filtra</h2>
                  <p>Zmień kategorię, żeby zobaczyć pełną listę wpisów.</p>
                  <Link href={`${BLOG_ROUTE_BASE}#artykuły`} prefetch={false} className="blog-index-button is-secondary">
                    Pokaż wszystkie artykuły
                  </Link>
                </div>
              ) : null}
            </div>

            <aside className="blog-index-sidebar" aria-label="Panel bloga">
              <section className="blog-index-side-card">
                <h2>Kategorie</h2>
                <div className="blog-index-category-list">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={category.href}
                      prefetch={false}
                      className={category.id === activeCategory?.id ? 'is-active' : undefined}
                      aria-current={category.id === activeCategory?.id ? 'page' : undefined}
                    >
                      <span>{repairCopy(category.label)}</span>
                      <small>{category.count}</small>
                      <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-index-side-card">
                <h2>Popularne artykuły</h2>
                <ol className="blog-index-popular-list">
                  {popularPosts.map((post, index) => (
                    <li key={post.slug}>
                      <Link href={post.path} prefetch={false} className="blog-index-popular-item">
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
                    <h2>Newsletter</h2>
                    <p>Jeden właściwy formularz jest na osobnej stronie newslettera.</p>
                  </div>
                  <Mail size={34} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <Link href="/newsletter" prefetch={false} className="blog-index-newsletter-link">
                  Przejdź do zapisu
                  <ArrowRight size={16} strokeWidth={1.9} aria-hidden="true" />
                </Link>
                <small>Bez podwójnego wpisywania maila na blogu.</small>
              </section>
            </aside>
          </section>

          {filteredPosts.length > BLOG_PAGE_SIZE ? (
            <nav className="blog-index-pagination" aria-label="Paginacja bloga">
              {currentPage > 1 ? (
                <Link href={getPageHref(currentPage - 1, activeCategory?.id ?? 'all', query)} prefetch={false} aria-label="Poprzednia strona">
                  <ChevronLeft size={17} strokeWidth={1.9} />
                </Link>
              ) : (
                <span aria-disabled="true">
                  <ChevronLeft size={17} strokeWidth={1.9} />
                </span>
              )}

              {paginationPages.map((page, index) => (
                <Fragment key={page}>
                  {index > 0 && page - paginationPages[index - 1] > 1 ? <span aria-hidden="true">...</span> : null}
                  <Link href={getPageHref(page, activeCategory?.id ?? 'all', query)} prefetch={false} aria-current={page === currentPage ? 'page' : undefined}>
                    {page}
                  </Link>
                </Fragment>
              ))}

              {currentPage < totalPages ? (
                <Link href={getPageHref(currentPage + 1, activeCategory?.id ?? 'all', query)} prefetch={false} aria-label="Następna strona">
                  <ChevronRight size={17} strokeWidth={1.9} />
                </Link>
              ) : (
                <span aria-disabled="true">
                  <ChevronRight size={17} strokeWidth={1.9} />
                </span>
              )}
            </nav>
          ) : null}

        </div>

        <Footer variant="full" showReviews={false} />
      </div>
    </main>
  )
}
