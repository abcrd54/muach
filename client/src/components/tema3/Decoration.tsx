import { motion } from 'motion/react';

export type DecoType =
  | 'flower-lotus' | 'flower-rose' | 'flower-bloom' | 'flower-single' | 'flower-bunch'
  | 'leaf-single' | 'leaf-branch' | 'leaf-vine'
  | 'ornament-corner' | 'ornament-divider' | 'ornament-diamond' | 'ornament-circle'
  | 'ring-gold' | 'heart-ornament' | 'gift';

interface DecorationProps {
  type: DecoType;
  size?: number;
  className?: string;
  animated?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}

const BASE = '/assets/images/tema3';

const animations = {
  float: {
    animate: { y: [0, -6, 0], rotate: [0, 2, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
  pulse: {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
  spin: {
    animate: { rotate: [0, 10, 0, -10, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
  },
  fade: {
    animate: { opacity: [0.3, 0.7, 0.3] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export default function Decoration({ type, size = 48, className = '', animated = false, opacity = 1, style }: DecorationProps) {
  const anim = animated ? animations.float : {};

  return (
    <motion.img
      src={`${BASE}/${type}.svg`}
      alt=""
      width={size}
      height={size}
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity, ...style }}
      {...anim}
    />
  );
}