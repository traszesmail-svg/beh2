import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import {
  BLOG_ROUTE_BASE,
  getBlogArticleJsonLd,
  getBlogPostBySlug,
  getBlogPostMetadata,
  listBlogPosts,
  listRelatedBlogPosts,
  renderBlogPostContent,
} from '@/lib/blog'
import { repairCopy } from '@/lib/copy'
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
    description: repairCopy(post.metaDescription),
  })
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const baseUrl = getCanonicalBaseUrl()
  const relatedPosts = listRelatedBlogPosts(post.slug, 3)
  const jsonLd = [
    getBlogArticleJsonLd(post, baseUrl),
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Blog', path: BLOG_ROUTE_BASE },
      { name: repairCopy(post.h1), path: post.path },
    ]),
  ]

  return (
    <NotatnikPageShell
      tag="Blog / wpis"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={post.audioHref}
      ctaLabel={FUNNEL_CTA_LABELS.primary}
      footerPrimaryHref={post.audioHref}
      footerPrimaryLabel={FUNNEL_CTA_LABELS.primary}
      sideVisualVariant={post.categoryHref === '/koty' ? 'cat' : post.categoryHref === '/psy' ? 'dog' : 'blog'}
      pageClassName="blog-page"
    >
      <Schema data={jsonLd} />

      <div className="container editorial-stack">
        <section className="panel section-panel blog-article-hero-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">
                <Link href={BLOG_ROUTE_BASE} prefetch={false} className="prep-inline-link">
                  Blog
                </Link>{' '}
                · {repairCopy(post.categoryLabel)}
              </div>
              <h1>{repairCopy(post.h1)}</h1>
            </div>
            <p className="editorial-section-lead">{repairCopy(post.excerpt)}</p>
          </div>

          <div className="blog-article-hero-image">
            <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(max-width: 980px) 92vw, 76vw" priority />
          </div>

          <div className="blog-article-meta-row" aria-label="Metadane wpisu">
            <span>{repairCopy(post.categoryLabel)}</span>
            <span>
              <time dateTime={post.publishedAt}>{post.publishedAtLabel}</time>
            </span>
            <span>{post.readingTimeMinutes} min czytania</span>
            <span>
              Autor:{' '}
              <Link href="/o-mnie" prefetch={false} className="prep-inline-link">
                {repairCopy(post.author)}
              </Link>
            </span>
          </div>

          <div className="hero-actions blog-article-actions">
            <Link href={BLOG_ROUTE_BASE} prefetch={false} className="prep-inline-link">
              Wróć do bloga
            </Link>
            <Link href={post.categoryHref} prefetch={false} className="prep-inline-link">
              Zobacz {repairCopy(post.categoryLabel).toLowerCase()}
            </Link>
          </div>
        </section>

        <article className="panel section-panel blog-article-panel">
          <div className="blog-article-content">{renderBlogPostContent(post)}</div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className="panel section-panel blog-related-panel">
            <div className="editorial-section-head">
              <div className="editorial-section-head-copy">
                <div className="section-eyebrow">Powiązane wpisy</div>
                <h2>Czytaj dalej w tym samym obszarze</h2>
              </div>
              <p className="editorial-section-lead">Jeśli ten temat jest bliski Twojej sytuacji, poniżej masz jeszcze kilka najbliższych artykułów.</p>
            </div>

            <div className="blog-related-grid">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={relatedPost.path} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                  <strong>{repairCopy(relatedPost.title)}</strong>
                  <span>{repairCopy(relatedPost.excerpt)}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="panel section-panel blog-related-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Dalej</div>
              <h2>Powiązane strony i kolejny krok</h2>
            </div>
            <p className="editorial-section-lead">Jeśli ten temat dotyczy też Twojej sytuacji, poniżej znajdziesz najbliższe następne kroki.</p>
          </div>

          <div className="blog-related-grid">
            {post.supportLinks.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{repairCopy(link.label)}</strong>
                <span>{repairCopy(link.description)}</span>
              </Link>
            ))}
            <Link href={BLOG_ROUTE_BASE} prefetch={false} className="summary-card tree-backed-card blog-related-card blog-related-card-main">
              <strong>Blog</strong>
              <span>Wróć do listy wpisów.</span>
            </Link>
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Po lekturze</div>
            <h2>Jeśli chcesz przejść od artykułu do konkretu, zrób pierwszy ruch tutaj</h2>
            <p>Najprostszy start to Kwadrans z behawiorystą. Jeśli wolisz jeszcze zostać przy materiałach, przejdź do Niezbędnika.</p>

            <div className="hero-actions editorial-final-actions">
              <Link href={post.audioHref} prefetch={false} className="button button-primary big-button">
                {FUNNEL_CTA_LABELS.primary}
              </Link>
              <Link href={FUNNEL_SECONDARY_HREF} prefetch={false} className="button button-ghost big-button">
                {FUNNEL_CTA_LABELS.secondary}
              </Link>
              <Link href="/kontakt#formularz" prefetch={false} className="prep-inline-link">
                Napisz wiadomość
              </Link>
            </div>
          </div>
        </section>
      </div>
    </NotatnikPageShell>
  )
}
