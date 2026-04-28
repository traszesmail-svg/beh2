'use client';

import { Star, Quote, MapPin } from 'lucide-react';
import type { Review } from '@/lib/reviews.config';

interface ReviewCardProps {
  review: Review;
  variant?: 'default' | 'compact' | 'featured';
}

export function ReviewCard({ review, variant = 'default' }: ReviewCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <article
      className={`
        group relative bg-white rounded-2xl border border-neutral-200
        transition-all duration-300 hover:border-accent hover:shadow-lg
        ${isFeatured ? 'p-8 lg:p-10' : isCompact ? 'p-5' : 'p-7'}
      `}
    >
      <Quote
        className="absolute top-6 right-6 text-accent-light opacity-50"
        size={isFeatured ? 40 : 28}
        strokeWidth={1.5}
      />

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={isFeatured ? 20 : 16}
            className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
          />
        ))}
        {review.source === 'google' && (
          <span className="ml-2 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
            Google
          </span>
        )}
      </div>

      <blockquote
        className={`
          text-neutral-700 leading-relaxed mb-5 relative z-10
          ${isFeatured ? 'text-lg lg:text-xl' : isCompact ? 'text-sm' : 'text-base'}
        `}
      >
        &bdquo;{review.text}&rdquo;
      </blockquote>

      {!isCompact && review.problem && (
        <div className="inline-flex items-center gap-1.5 bg-accent-light text-accent-dark text-xs font-medium px-3 py-1 rounded-full mb-4">
          {review.problem}
        </div>
      )}

      <footer className="flex items-center gap-3 pt-4 border-t border-neutral-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {review.author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: 'var(--ink, #1c1a18)' }}>{review.author}</div>
          <div className="text-xs text-neutral-500 flex items-center gap-2">
            {review.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {review.location}
              </span>
            )}
            {review.petName && (
              <>
                <span>·</span>
                <span>
                  {review.petType === 'dog' ? '🐕' : review.petType === 'cat' ? '🐈' : '🐾'} {review.petName}
                </span>
              </>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
