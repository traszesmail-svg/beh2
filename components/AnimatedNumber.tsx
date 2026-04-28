'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (latest) =>
    `${prefix}${latest.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
