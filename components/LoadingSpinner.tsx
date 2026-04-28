'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
  variant?: 'inline' | 'overlay' | 'block';
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  label = 'Ładowanie...',
  variant = 'inline',
  className = '',
}: LoadingSpinnerProps) {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      role="status"
      aria-label={label}
      className="inline-flex"
    >
      <Loader2 size={size} className="text-accent" strokeWidth={2.5} />
    </motion.div>
  );

  if (variant === 'overlay') {
    return (
      <div className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 ${className}`}>
        {spinner}
        <span className="text-sm text-neutral-600">{label}</span>
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
        {spinner}
        <span className="text-sm text-neutral-500">{label}</span>
      </div>
    );
  }

  return <span className={`inline-flex items-center gap-2 ${className}`}>{spinner}</span>;
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = 'h-4 w-full', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-neutral-200 rounded ${className}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        />
      ))}
    </>
  );
}
