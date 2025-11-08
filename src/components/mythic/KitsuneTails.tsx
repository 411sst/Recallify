/**
 * 🦊 KITSUNE TAILS COMPONENT
 * Animated fox tails that display 1-9 tails based on user's streak
 */

import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useMythicStore } from '../../stores/mythicStore';
import { useIsMythicFeatureActive } from '../../stores/mythicStore';

interface KitsuneTailsProps {
  tailCount?: number;  // Override tail count (defaults to store value)
  size?: number;       // Size in pixels (default: 40)
  color?: string;      // Tail color (default: gradient)
  animated?: boolean;  // Enable sway animation (default: true)
}

export function KitsuneTails({
  tailCount: overrideTailCount,
  size = 40,
  color,
  animated = true,
}: KitsuneTailsProps) {
  const isActive = useIsMythicFeatureActive('kitsuneSidebar');
  const storeTailCount = useMythicStore((state) => state.kitsune.currentTailCount);

  const tailCount = overrideTailCount ?? storeTailCount;

  // Don't render if mythic mode is off
  if (!isActive) return null;

  // Clamp tail count to 1-9
  const clampedCount = Math.max(1, Math.min(9, tailCount));

  // Generate tail positions in a fan shape
  const tails = useMemo(() => {
    const tailArray = [];
    const spreadAngle = 120; // Total spread in degrees
    const startAngle = -spreadAngle / 2;
    const angleStep = clampedCount > 1 ? spreadAngle / (clampedCount - 1) : 0;

    for (let i = 0; i < clampedCount; i++) {
      const angle = startAngle + (angleStep * i);
      const zIndex = clampedCount - Math.abs(i - Math.floor(clampedCount / 2));

      tailArray.push({
        id: i,
        angle,
        zIndex,
        delay: i * 0.1, // Stagger animation
      });
    }

    return tailArray;
  }, [clampedCount]);

  return (
    <Box
      position="relative"
      width={`${size}px`}
      height={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Fox-fire gradient */}
          <linearGradient id="foxfire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color || "#FF6B35"} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color || "#F7931E"} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color || "#FDC830"} stopOpacity="1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="tail-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render each tail */}
        {tails.map((tail) => (
          <TailPath
            key={tail.id}
            angle={tail.angle}
            zIndex={tail.zIndex}
            delay={tail.delay}
            color={color}
            animated={animated}
          />
        ))}
      </svg>
    </Box>
  );
}

// Individual tail path with animation
interface TailPathProps {
  angle: number;
  zIndex: number;
  delay: number;
  color?: string;
  animated: boolean;
}

function TailPath({ angle, zIndex, delay, color, animated }: TailPathProps) {
  const MotionPath = motion.path;

  // Tail SVG path (curved, fluffy shape)
  const tailPath = "M 50 50 Q 45 30, 40 15 Q 38 10, 42 8 Q 46 6, 48 10 Q 50 15, 48 20 Q 46 30, 50 50 Z";

  return (
    <g
      transform={`rotate(${angle} 50 50)`}
      style={{ transformOrigin: '50px 50px' }}
    >
      <MotionPath
        d={tailPath}
        fill={color || "url(#foxfire-gradient)"}
        stroke={color || "#FF6B35"}
        strokeWidth="0.5"
        filter="url(#tail-glow)"
        opacity={0.7 + (zIndex * 0.05)}
        animate={
          animated
            ? {
                // Gentle sway animation
                rotate: [angle - 3, angle + 3, angle - 3],
                scale: [1, 1.02, 1],
              }
            : undefined
        }
        transition={{
          duration: 2 + delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay,
        }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </g>
  );
}

// Compact version for collapsed sidebar
export function KitsuneTailsCompact({ tailCount }: { tailCount?: number }) {
  const isActive = useIsMythicFeatureActive('kitsuneSidebar');
  const storeTailCount = useMythicStore((state) => state.kitsune.currentTailCount);

  const count = tailCount ?? storeTailCount;

  if (!isActive) return null;

  return (
    <Box
      position="absolute"
      top="-4px"
      right="-4px"
      width="20px"
      height="20px"
      borderRadius="full"
      bg="orange.400"
      color="white"
      fontSize="10px"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="0 0 8px rgba(255, 107, 53, 0.6)"
      zIndex={10}
    >
      {count}
    </Box>
  );
}
