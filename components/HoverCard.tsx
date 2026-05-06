'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASING } from '@/lib/motionVariants';

interface HoverCardProps {
  children: React.ReactNode;
  variant?: 'lift' | 'tilt' | 'glow' | 'scale';
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function HoverCard({
  children,
  variant = 'lift',
  className,
  href,
  onClick,
}: HoverCardProps) {
  const Component = href ? motion.a : motion.div;
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    lift: {
      rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      hover: {
        y: -4,
        boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12)',
        transition: { duration: 0.25, ease: EASING.smooth },
      },
    },
    tilt: {
      rest: { rotate: 0, scale: 1 },
      hover: {
        rotate: -1,
        scale: 1.01,
        transition: { duration: 0.3, ease: EASING.smooth },
      },
    },
    glow: {
      rest: { boxShadow: '0 0 0 0 rgba(74, 141, 122, 0)' },
      hover: {
        boxShadow: '0 0 0 4px rgba(74, 141, 122, 0.15)',
        transition: { duration: 0.3, ease: EASING.smooth },
      },
    },
    scale: {
      rest: { scale: 1 },
      hover: { scale: 1.02, transition: { duration: 0.2, ease: EASING.smooth } },
    },
  };

  return (
    <Component
      className={className}
      href={href}
      onClick={onClick}
      initial="rest"
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      animate="rest"
      variants={variants[variant]}
    >
      {children}
    </Component>
  );
}
