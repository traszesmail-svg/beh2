// handoff-3/lib/reviewsSchema.ts
// Generator Schema.org JSON-LD dla opinii — gwiazdki w Google SERP
// Standard: https://schema.org/Review + AggregateRating

import type { Review } from './reviews.config';

interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

interface BusinessConfig {
  name: string;
  url: string;
  image: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  priceRange?: string;
}

const DEFAULT_BUSINESS: BusinessConfig = {
  name: 'Krzysztof Regulski — Behawiorysta zwierzęcy',
  url: 'https://regulskibehawiorysta.pl',
  image: 'https://regulskibehawiorysta.pl/og-image.png',
  address: {
    addressLocality: 'Polska',
    addressCountry: 'PL',
  },
  priceRange: '120-450 PLN',
};

/**
 * Generuje JSON-LD typu LocalBusiness z aggregateRating + listą review
 * Najlepszy format dla SEO: gwiazdki + recenzje pojawiają się w SERP
 */
export function generateReviewsSchema(
  reviews: Review[],
  aggregateRating: AggregateRating,
  business: BusinessConfig = DEFAULT_BUSINESS,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': business.url,
    name: business.name,
    url: business.url,
    image: business.image,
    ...(business.telephone && { telephone: business.telephone }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        ...business.address,
      },
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue.toFixed(1),
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    },
    review: reviews.map(r => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: r.author,
      },
      datePublished: r.date,
      reviewBody: r.text,
      ...(r.location && { itemReviewed: {
        '@type': 'Place',
        name: r.location,
      }}),
    })),
  };
}

/**
 * Schema dla pojedynczej opinii — używaj na stronach case study
 */
export function generateSingleReviewSchema(review: Review, businessName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: businessName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.date,
    reviewBody: review.text,
  };
}
