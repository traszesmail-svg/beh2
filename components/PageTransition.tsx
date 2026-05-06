'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageTransition } from '@/lib/motionVariants';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={shouldReduceMotion ? undefined : pageTransition}
        initial={shouldReduceMotion ? false : 'initial'}
        animate={shouldReduceMotion ? undefined : 'animate'}
        exit={shouldReduceMotion ? undefined : 'exit'}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
