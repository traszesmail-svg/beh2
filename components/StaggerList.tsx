'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, VIEWPORT_DEFAULTS } from '@/lib/motionVariants';

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'section';
}

export function StaggerList({ children, className, as = 'div' }: StaggerListProps) {
  const MotionComponent = motion[as];
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionComponent
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : undefined}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionComponent className={className} variants={shouldReduceMotion ? undefined : fadeUp}>
      {children}
    </MotionComponent>
  );
}
