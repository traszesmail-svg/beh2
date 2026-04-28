import { ReviewsCarousel } from '@/components/ReviewsCarousel';
import { ReviewsGrid } from '@/components/ReviewsGrid';
import { GoogleRatingBadge } from '@/components/GoogleRatingBadge';
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
    <section className="py-16" style={{ background: 'var(--paper, #faf9f7)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)', color: 'var(--ink, #1c1a18)' }}>
            {title}
          </h2>
          <p className="text-neutral-600 text-lg mb-6 max-w-xl mx-auto">
            {subtitle}
          </p>
          {showBadge && (
            <div className="flex justify-center">
              <GoogleRatingBadge
                ratingValue={aggregateRating.ratingValue}
                reviewCount={aggregateRating.reviewCount}
                googleProfileUrl={googleProfileUrl}
              />
            </div>
          )}
        </header>

        {variant === 'carousel' ? (
          <ReviewsCarousel reviews={displayReviews} />
        ) : (
          <ReviewsGrid reviews={displayReviews} initialCount={6} />
        )}

        {googleProfileUrl && (
          <div className="text-center mt-12 pt-8 border-t border-neutral-200">
            <p className="text-neutral-600 mb-4">
              Byłeś moim klientem? Twoja opinia pomoże innym opiekunom.
            </p>
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-full font-medium transition-colors hover:text-white"
              style={{ borderColor: 'var(--ink, #1c1a18)', color: 'var(--ink, #1c1a18)' }}
            >
              Wystaw opinię w Google →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
