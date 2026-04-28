// handoff-3/lib/googlePlaces.ts
// Integracja z Google Places API (New) — fetch live opinii z Google Business Profile
// Wymaga: GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID w .env.local

import type { Review } from './reviews.config';

interface GooglePlaceReview {
  name: string;
  rating: number;
  text: { text: string; languageCode: string };
  authorAttribution: { displayName: string; photoUri?: string };
  publishTime: string;          // ISO datetime
  relativePublishTimeDescription: string;
}

interface GooglePlaceResponse {
  reviews?: GooglePlaceReview[];
  rating?: number;
  userRatingCount?: number;
}

const PLACES_API = 'https://places.googleapis.com/v1/places';

/**
 * Pobiera opinie z Google Places API (New).
 * Cache 24h zalecany — patrz api/reviews.ts
 */
export async function fetchGoogleReviews(): Promise<{
  reviews: Review[];
  aggregateRating: number;
  totalCount: number;
} | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn('[GooglePlaces] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID — using fallback');
    return null;
  }

  try {
    const res = await fetch(`${PLACES_API}/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
      next: { revalidate: 86400 }, // 24h cache w Next.js
    });

    if (!res.ok) {
      console.error('[GooglePlaces] API error:', res.status, await res.text());
      return null;
    }

    const data: GooglePlaceResponse = await res.json();

    if (!data.reviews) return null;

    // Mapowanie z formatu Google na nasz typ Review
    const reviews: Review[] = data.reviews.map((r, i) => ({
      id: `google-${i}`,
      author: anonymizeAuthor(r.authorAttribution.displayName),
      petType: detectPetType(r.text.text),
      problem: 'opinia z Google',
      rating: r.rating as 1 | 2 | 3 | 4 | 5,
      date: r.publishTime.split('T')[0],
      text: r.text.text,
      source: 'google',
    }));

    return {
      reviews,
      aggregateRating: data.rating ?? 5,
      totalCount: data.userRatingCount ?? reviews.length,
    };
  } catch (e) {
    console.error('[GooglePlaces] Fetch failed:', e);
    return null;
  }
}

/**
 * Anonimizacja imienia z Google: "Jan Kowalski" → "Jan K."
 * Zgodne z RODO + spójne z manualnymi opiniami
 */
function anonymizeAuthor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

/**
 * Heurystyczne wykrywanie pet type z tekstu opinii
 * Pomocne do filtrowania na stronach /psy lub /koty
 */
function detectPetType(text: string): 'dog' | 'cat' | 'other' {
  const lower = text.toLowerCase();
  const dogWords = ['pies', 'piesek', 'suczka', 'szczeniak', 'pies', 'psa', 'psem', 'psie'];
  const catWords = ['kot', 'kotek', 'kocica', 'kotka', 'kota', 'kotem', 'kocie', 'kociak'];

  const dogScore = dogWords.filter(w => lower.includes(w)).length;
  const catScore = catWords.filter(w => lower.includes(w)).length;

  if (dogScore > catScore) return 'dog';
  if (catScore > dogScore) return 'cat';
  return 'other';
}
