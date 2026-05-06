'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { fadeUp, VIEWPORT_DEFAULTS } from '@/lib/motionVariants';

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  id?: string;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  id,
  className,
  as = 'div',
}: RevealProps) {
  const MotionComponent = motion[as];
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionComponent
      id={id}
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : undefined}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={VIEWPORT_DEFAULTS}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionComponent>
  );
}
