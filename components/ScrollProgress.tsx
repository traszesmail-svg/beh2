'use client';

import { motion, useScroll } from 'framer-motion';

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export function ScrollProgress({
  color = '#4a8d7a',
  height = 3,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress, height, background: color, willChange: 'transform' }}
    />
  );
}
