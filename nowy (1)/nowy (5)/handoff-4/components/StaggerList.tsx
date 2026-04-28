// handoff-4/components/StaggerList.tsx
// Lista z opóźnionym wejściem dzieci — idealne dla kart oferty, FAQ, itd.

'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, VIEWPORT_DEFAULTS } from '@/lib/motionVariants';

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'section';
}

export function StaggerList({ children, className, as = 'div' }: StaggerListProps) {
  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULTS}
      variants={staggerContainer}
    >
      {children}
    </MotionComponent>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const MotionComponent = motion[as];

  return (
    <MotionComponent className={className} variants={fadeUp}>
      {children}
    </MotionComponent>
  );
}

/*
Przykład:
  <StaggerList className="grid grid-cols-3 gap-6">
    <StaggerItem><OfferCard /></StaggerItem>
    <StaggerItem><OfferCard /></StaggerItem>
    <StaggerItem><OfferCard /></StaggerItem>
  </StaggerList>
*/
