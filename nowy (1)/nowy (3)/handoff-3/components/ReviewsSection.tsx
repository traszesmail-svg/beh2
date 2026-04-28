// handoff-3/components/ReviewsSection.tsx
// Kompletna sekcja opinii — drop-in komponent
// Łączy: heading + GoogleRatingBadge + Carousel/Grid + CTA na Google

import { ReviewsCarousel } from './ReviewsCarousel';
import { ReviewsGrid } from './ReviewsGrid';
import { GoogleRatingBadge } from './GoogleRatingBadge';
import { reviews, aggregateRating } from '@/lib/reviews.config';

interface ReviewsSectionProps {
  variant?: 'carousel' | 'grid';
  showBadge?: boolean;
  limit?: number;
  title?: string;
  subtitle?: string;
  googleProfileUrl?: string;
}

export function ReviewsSection({
  variant = 'carousel',
  showBadge = true,
  limit = 8,
  title = 'Co mówią klienci',
  subtitle = 'Prawdziwe opinie z Google i bezpośrednich konsultacji',
  googleProfileUrl,
}: ReviewsSectionProps) {
  const displayReviews = reviews.slice(0, limit);

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="font-serif text-4xl lg:text-5xl text-ink mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-neutral-600 text-lg mb-6 max-w-xl mx-auto">
            {subtitle}
          </p>
          {showBadge && (
            <GoogleRatingBadge
              ratingValue={aggregateRating.ratingValue}
              reviewCount={aggregateRating.reviewCount}
              googleProfileUrl={googleProfileUrl}
            />
          )}
        </header>

        {/* Lista opinii */}
        {variant === 'carousel' ? (
          <ReviewsCarousel reviews={displayReviews} />
        ) : (
          <ReviewsGrid reviews={displayReviews} initialCount={6} />
        )}

        {/* CTA — wystaw opinię */}
        {googleProfileUrl && (
          <div className="text-center mt-12 pt-8 border-t border-neutral-200">
            <p className="text-neutral-600 mb-4">
              Byłeś moim klientem? Twoja opinia pomoże innym opiekunom.
            </p>
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-ink rounded-full font-medium text-ink hover:bg-ink hover:text-white transition-colors"
            >
              Wystaw opinię w Google →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
