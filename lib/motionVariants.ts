// Reużywalne variants dla Framer Motion — spójne timingi w całej aplikacji

import type { Variants } from 'framer-motion';

export const EASING = {
  smooth: [0.22, 1, 0.36, 1] as const,
  snap: [0.4, 0, 0.2, 1] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING.smooth },
  },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASING.smooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASING.smooth },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASING.smooth },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const hoverLift = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  hover: {
    y: -4,
    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12)',
    transition: { duration: 0.25, ease: EASING.smooth },
  },
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15, ease: EASING.smooth } },
  tap: { scale: 0.98 },
};

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASING.smooth } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASING.smooth } },
};

export const VIEWPORT_DEFAULTS = {
  once: true,
  amount: 0.3,
  margin: '0px 0px -100px 0px' as const,
};
