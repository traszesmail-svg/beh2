import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell } from '@/components/NotatnikA'
import {
  BLOG_ROUTE_BASE,
  getBlogArticleJsonLd,
  getBlogPostBySlug,
  getBlogPostMetadata,
  listBlogPosts,
  renderBlogPostContent,
} from '@/lib/blog'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { FUNNEL_SECONDARY_HREF } from '@/lib/offers'
import { getBreadcrumbJsonLd } from '@/lib/schema'

export const dynamic = 'force-static'
export const dynamicParams = false

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return listBlogPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Blog',
      description: 'Blog regulskibehawiorysta.pl.',
      alternates: {
        canonical: BLOG_ROUTE_BASE,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return getBlogPostMetadata({
    post,
    description: post.metaDescription,
  })
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const baseUrl = getCanonicalBaseUrl()
  const jsonLd = [
    getBlogArticleJsonLd(post, baseUrl),
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Blog', path: BLOG_ROUTE_BASE },
      { name: post.h1, path: post.path },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Blog / wpis"
      navItems={[
        { href: '/blog', label: 'Blog' },
        { href: '/psy', label: 'Psy' },
        { href: '/koty', label: 'Koty' },
        { href: '/niezbednik', label: 'Niezbednik' },
        { href: '/kontakt#formularz', label: 'Kontakt' },
      ]}
      ctaHref={post.audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={post.audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container editorial-stack">
        

        <section className="panel section-panel blog-article-hero-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">
                <Link href={BLOG_ROUTE_BASE} prefetch={false} className="prep-inline-link">
                  Blog
                </Link>{' '}
                · {post.categoryLabel}
              </div>
              <h1>{post.h1}</h1>
            </div>
            <p className="editorial-section-lead">{post.excerpt}</p>
          </div>

          <div className="blog-article-meta-row" aria-label="Metadane wpisu">
            <span>{post.categoryLabel}</span>
            <span>
              <time dateTime={post.publishedAt}>{post.publishedAtLabel}</time>
            </span>
            <span>{post.readingTimeMinutes} min czytania</span>
            <span>
              Autor:{' '}
              <Link href="/o-mnie" prefetch={false} className="prep-inline-link">
                {post.author}
              </Link>
            </span>
          </div>

          <div className="hero-actions blog-article-actions">
            <Link href={BLOG_ROUTE_BASE} prefetch={false} className="prep-inline-link">
              Wróć do bloga
            </Link>
            <Link href={post.categoryHref} prefetch={false} className="prep-inline-link">
              Zobacz {post.categoryLabel.toLowerCase()}
            </Link>
          </div>
        </section>

        <article className="panel section-panel blog-article-panel">
          <div className="blog-article-content">{renderBlogPostContent(post)}</div>
        </article>

        <section className="panel section-panel blog-related-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Dalej</div>
              <h2>Powiązane strony</h2>
            </div>
            <p className="editorial-section-lead">Jeśli ten temat dotyczy też Twojej sytuacji, poniżej znajdziesz najbliższe następne kroki.</p>
          </div>

          <div className="blog-related-grid">
            {post.supportLinks.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </Link>
            ))}
            <Link href={BLOG_ROUTE_BASE} prefetch={false} className="summary-card tree-backed-card blog-related-card blog-related-card-main">
              <strong>Blog</strong>
              <span>Wróć do listy wpisów.</span>
            </Link>
          </div>
        </section>

      </div>
    </NotatnikPageShell>
  )
}
