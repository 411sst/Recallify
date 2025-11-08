/**
 * 🔥 PHOENIX FLAME COMPONENT
 * Animated flame SVG with flickering effects
 */

import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAnimationQuality } from '../../stores/mythicStore';

interface PhoenixFlameProps {
  size?: number;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

export function PhoenixFlame({
  size = 80,
  color = '#F39C12',
  intensity = 'medium',
  animated = true,
}: PhoenixFlameProps) {
  const animationQuality = useAnimationQuality();

  // Flicker animation speeds based on quality
  const flickerSpeed = {
    high: 0.8,
    medium: 1.2,
    low: 2,
  }[animationQuality];

  const MotionPath = motion.path;
  const MotionG = motion.g;

  return (
    <Box width={`${size}px`} height={`${size}px`} display="flex" alignItems="center" justifyContent="center">
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* Phoenix fire gradient */}
          <linearGradient id="phoenix-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="30%" stopColor="#F7931E" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FDC830" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.6" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="flame-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shimmer gradient for inner flame */}
          <radialGradient id="shimmer-gradient">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFE66D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main flame */}
        <MotionG
          animate={
            animated
              ? {
                  scale: [1, 1.05, 0.98, 1.03, 1],
                  y: [0, -2, 1, -1, 0],
                }
              : undefined
          }
          transition={{
            duration: flickerSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '50px 80px' }}
        >
          {/* Outer flame */}
          <MotionPath
            d="M 50 20 Q 30 40, 35 60 Q 40 75, 50 80 Q 60 75, 65 60 Q 70 40, 50 20 Z"
            fill="url(#phoenix-gradient)"
            filter="url(#flame-glow)"
            animate={
              animated
                ? {
                    opacity: [0.8, 0.95, 0.85, 0.9, 0.8],
                  }
                : undefined
            }
            transition={{
              duration: flickerSpeed * 0.7,
              repeat: Infinity,
            }}
          />

          {/* Middle flame */}
          <MotionPath
            d="M 50 30 Q 38 45, 42 58 Q 45 68, 50 72 Q 55 68, 58 58 Q 62 45, 50 30 Z"
            fill="url(#phoenix-gradient)"
            opacity="0.9"
            animate={
              animated
                ? {
                    scale: [1, 1.08, 0.96, 1.04, 1],
                  }
                : undefined
            }
            transition={{
              duration: flickerSpeed * 0.5,
              repeat: Infinity,
            }}
            style={{ transformOrigin: '50px 70px' }}
          />

          {/* Inner core (bright) */}
          <MotionPath
            d="M 50 40 Q 44 48, 46 56 Q 48 62, 50 65 Q 52 62, 54 56 Q 56 48, 50 40 Z"
            fill="url(#shimmer-gradient)"
            animate={
              animated
                ? {
                    opacity: [0.9, 1, 0.85, 0.95, 0.9],
                    scale: [1, 1.1, 0.95, 1.05, 1],
                  }
                : undefined
            }
            transition={{
              duration: flickerSpeed * 0.3,
              repeat: Infinity,
            }}
            style={{ transformOrigin: '50px 60px' }}
          />
        </MotionG>

        {/* Embers floating up */}
        {animated && <FloatingEmbers speed={flickerSpeed} />}
      </svg>
    </Box>
  );
}

// Floating ember particles
function FloatingEmbers({ speed }: { speed: number }) {
  const embers = [
    { x: 45, delay: 0, duration: 2 },
    { x: 55, delay: 0.3, duration: 2.2 },
    { x: 50, delay: 0.6, duration: 1.8 },
  ];

  return (
    <>
      {embers.map((ember, i) => (
        <motion.circle
          key={i}
          cx={ember.x}
          cy={80}
          r={1.5}
          fill="#FFE66D"
          opacity={0}
          animate={{
            y: [0, -60],
            opacity: [0, 0.8, 0.6, 0],
            scale: [1, 0.8, 0.5],
          }}
          transition={{
            duration: ember.duration * speed,
            delay: ember.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

// Compact flame for small spaces
export function PhoenixFlameCompact({ size = 24 }: { size?: number }) {
  return (
    <Box display="inline-block">
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="compact-flame-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FDC830" />
          </linearGradient>
        </defs>
        <path
          d="M 12 4 Q 8 10, 10 16 Q 11 19, 12 20 Q 13 19, 14 16 Q 16 10, 12 4 Z"
          fill="url(#compact-flame-gradient)"
          filter="url(#flame-glow)"
        />
      </svg>
    </Box>
  );
}
