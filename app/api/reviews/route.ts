import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/googlePlaces';
import { reviews as fallbackReviews, aggregateRating as fallbackRating } from '@/lib/reviews.config';

export const revalidate = 86400;

export async function GET() {
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

  return NextResponse.json({
    reviews: fallbackReviews,
    aggregateRating: fallbackRating,
    source: 'manual',
  });
}
