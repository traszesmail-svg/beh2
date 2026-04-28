// handoff-3/api/reviews.ts
// Next.js App Router API route: /api/reviews
// Hybrydowe pobieranie: próbuje Google → fallback do reviews.config.ts
// Cache 24h przez next: { revalidate: 86400 } w fetchGoogleReviews

import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/googlePlaces';
import { reviews as fallbackReviews, aggregateRating as fallbackRating } from '@/lib/reviews.config';

export const revalidate = 86400; // 24h

export async function GET() {
  // Próbuj Google API
  const googleData = await fetchGoogleReviews();

  if (googleData && googleData.reviews.length >= 3) {
    return NextResponse.json({
      reviews: googleData.reviews,
      aggregateRating: {
        ratingValue: googleData.aggregateRating,
        reviewCount: googleData.totalCount,
        bestRating: 5,
        worstRating: 1,
      },
      source: 'google',
    });
  }

  // Fallback do manualnej listy
  return NextResponse.json({
    reviews: fallbackReviews,
    aggregateRating: fallbackRating,
    source: 'manual',
  });
}

/*
Lokalizacja w Next.js App Router:
  app/api/reviews/route.ts

Użycie z front-endu:
  const data = await fetch('/api/reviews').then(r => r.json());
  // → { reviews: [...], aggregateRating: {...}, source: 'google' | 'manual' }
*/
