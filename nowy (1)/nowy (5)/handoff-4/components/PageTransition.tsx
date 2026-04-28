// handoff-4/components/PageTransition.tsx
// Fade między stronami — owinięcie zawartości każdej strony
// Pluskwa: w Next.js App Router AnimatePresence wymaga key na route

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageTransition } from '@/lib/motionVariants';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/*
Wstaw w src/app/layout.tsx wokół {children}:

  <PageTransition>{children}</PageTransition>
*/
