// handoff-3/components/GoogleRatingBadge.tsx
// Duży badge "4.9 z Google" — pokazywany w hero lub jako standalone trust element
// Klikalny → otwiera profil Google Business

import { Star } from 'lucide-react';

interface GoogleRatingBadgeProps {
  ratingValue: number;
  reviewCount: number;
  googleProfileUrl?: string;
  variant?: 'horizontal' | 'compact';
}

// Logo Google jako inline SVG (bez zewnętrznego CDN)
const GoogleLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export function GoogleRatingBadge({
  ratingValue,
  reviewCount,
  googleProfileUrl = 'https://www.google.com/maps',
  variant = 'horizontal',
}: GoogleRatingBadgeProps) {
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;

  if (variant === 'compact') {
    return (
      <a
        href={googleProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm hover:border-accent transition-colors"
      >
        <GoogleLogo size={14} />
        <span className="font-bold text-ink">{ratingValue.toFixed(1)}</span>
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="text-neutral-500">·</span>
        <span className="text-neutral-600">{reviewCount} opinii</span>
      </a>
    );
  }

  return (
    <a
      href={googleProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-4 px-5 py-3 bg-white border-2 border-neutral-200 rounded-2xl hover:border-accent hover:shadow-lg transition-all group"
    >
      <GoogleLogo size={32} />
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < fullStars
                  ? 'fill-amber-400 text-amber-400'
                  : i === fullStars && hasHalfStar
                  ? 'fill-amber-400 text-amber-400 opacity-50'
                  : 'text-neutral-300'
              }
            />
          ))}
          <span className="ml-2 font-bold text-ink">{ratingValue.toFixed(1)}</span>
        </div>
        <div className="text-xs text-neutral-500 group-hover:text-accent-dark transition-colors">
          {reviewCount} opinii w Google →
        </div>
      </div>
    </a>
  );
}
