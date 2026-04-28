// handoff-3/components/ReviewsCarousel.tsx
// Karuzela opinii z auto-scroll, swipe i kontrolkami
// Bezpieczna na dotyk mobile + klawiaturę

'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import type { Review } from '@/lib/reviews.config';

interface ReviewsCarouselProps {
  reviews: Review[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export function ReviewsCarousel({
  reviews,
  autoplay = true,
  autoplayDelay = 6000,
}: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = reviews.length;

  const goNext = () => setIndex(i => (i + 1) % total);
  const goPrev = () => setIndex(i => (i - 1 + total) % total);
  const goTo = (i: number) => setIndex(i);

  // Autoplay
  useEffect(() => {
    if (!autoplay || isPaused) return;
    const timer = setInterval(goNext, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isPaused, total]);

  // Klawiatura
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Touch swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? goNext : goPrev)();
    touchStart.current = null;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map(review => (
            <div key={review.id} className="w-full flex-shrink-0 px-2">
              <ReviewCard review={review} variant="featured" />
            </div>
          ))}
        </div>
      </div>

      {/* Strzałki */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shadow-md z-10"
        aria-label="Poprzednia opinia"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shadow-md z-10"
        aria-label="Następna opinia"
      >
        <ChevronRight size={20} />
      </button>

      {/* Kropki */}
      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-accent' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Opinia ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
