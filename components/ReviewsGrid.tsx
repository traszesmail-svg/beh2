'use client';

import { useState } from 'react';
import { ReviewCard } from '@/components/ReviewCard';
import type { Review } from '@/lib/reviews.config';

interface ReviewsGridProps {
  reviews: Review[];
  initialCount?: number;
}

export function ReviewsGrid({ reviews, initialCount = 6 }: ReviewsGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, initialCount);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map(r => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {reviews.length > initialCount && !showAll && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors"
          >
            Zobacz wszystkie opinie ({reviews.length})
          </button>
        </div>
      )}
    </div>
  );
}
