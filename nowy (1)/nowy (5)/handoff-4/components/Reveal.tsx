// handoff-4/components/Reveal.tsx
// Wrapper do scroll reveal — owinięcie dowolnej sekcji
// Domyślnie fadeUp, ale można podać własny variant

'use client';

import { motion, type Variants } from 'framer-motion';
import { fadeUp, VIEWPORT_DEFAULTS } from '@/lib/motionVariants';

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULTS}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionComponent>
  );
}

/*
Przykład:
  <Reveal>
    <section>...</section>
  </Reveal>

  <Reveal delay={0.2} as="article">
    <h2>...</h2>
  </Reveal>
*/
