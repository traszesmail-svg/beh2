// handoff-4/components/ScrollProgress.tsx
// Pasek progress przy scrollu strony — subtelny, na samej górze
// Pomocny dla długich artykułów / FAQ

'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export function ScrollProgress({
  color = '#4a8d7a',
  height = 3,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 origin-left pointer-events-none"
      style={{
        scaleX,
        height,
        background: color,
      }}
    />
  );
}

/*
Wstaw raz w layout.tsx:
  <ScrollProgress />
Albo tylko na stronach blog/FAQ.
*/
