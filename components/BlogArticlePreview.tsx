import { CalendarDays, Clock3 } from 'lucide-react'
import { repairCopy } from '@/lib/copy'

type BlogArticlePreviewProps = {
  title: string
  excerpt: string
  categoryLabel: string
  publishedAtLabel?: string
  readingTimeMinutes?: number
  variant?: 'card' | 'hero'
}

export function BlogArticlePreview({
  title,
  excerpt,
  categoryLabel,
  publishedAtLabel,
  readingTimeMinutes,
  variant = 'card',
}: BlogArticlePreviewProps) {
  return (
    <div className={`blog-article-screen-preview is-${variant}`} aria-hidden="true">
      <div className="blog-article-screen-toolbar">
        <span />
        <span />
        <span />
      </div>
      <div className="blog-article-screen-paper">
        <span className="blog-article-screen-kicker">{repairCopy(categoryLabel)}</span>
        <strong>{repairCopy(title)}</strong>
        <p>{repairCopy(excerpt)}</p>
        <div className="blog-article-screen-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="blog-article-screen-meta">
        {publishedAtLabel ? (
          <span>
            <CalendarDays size={13} strokeWidth={1.8} />
            {repairCopy(publishedAtLabel)}
          </span>
        ) : null}
        {readingTimeMinutes ? (
          <span>
            <Clock3 size={13} strokeWidth={1.8} />
            {readingTimeMinutes} min
          </span>
        ) : null}
      </div>
      <span className="blog-article-screen-brand">Regulski</span>
    </div>
  )
}
