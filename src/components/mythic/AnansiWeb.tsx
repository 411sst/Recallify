/**
 * 🕷️ ANANSI'S WEB COMPONENT
 * Animated spider web SVG
 */

import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface AnansiWebProps {
  size?: number;
  animated?: boolean;
  isVibrating?: boolean; // Vibrate when yarn is active
}

export function AnansiWeb({ size = 100, animated = true, isVibrating = false }: AnansiWebProps) {
  const MotionPath = motion.path;
  const MotionCircle = motion.circle;

  return (
    <Box width={`${size}px`} height={`${size}px`} display="flex" alignItems="center" justifyContent="center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          {/* Web gradient */}
          <radialGradient id="web-gradient">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.6" />
          </radialGradient>

          {/* Glow filter for vibration */}
          <filter id="web-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Radial threads */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + Math.cos(rad) * 45;
          const y2 = 50 + Math.sin(rad) * 45;

          return (
            <MotionPath
              key={`radial-${i}`}
              d={`M 50 50 L ${x2} ${y2}`}
              stroke="url(#web-gradient)"
              strokeWidth="0.5"
              fill="none"
              filter={isVibrating ? "url(#web-glow)" : undefined}
              animate={
                isVibrating
                  ? {
                      strokeWidth: [0.5, 0.8, 0.5],
                      opacity: [0.7, 1, 0.7],
                    }
                  : undefined
              }
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          );
        })}

        {/* Spiral threads */}
        {[15, 25, 35, 45].map((radius, ringIndex) => (
          <MotionCircle
            key={`spiral-${ringIndex}`}
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#web-gradient)"
            strokeWidth="0.5"
            fill="none"
            filter={isVibrating ? "url(#web-glow)" : undefined}
            animate={
              isVibrating
                ? {
                    r: [radius, radius + 1, radius],
                    opacity: [0.7, 1, 0.7],
                  }
                : undefined
            }
            transition={{
              duration: 0.4,
              repeat: Infinity,
              delay: ringIndex * 0.08,
            }}
          />
        ))}

        {/* Spider (Anansi) */}
        {animated && (
          <motion.g
            animate={{
              x: [0, 3, -3, 0],
              y: [0, -2, 2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <circle cx="50" cy="50" r="3" fill="#8B4513" />
            <circle cx="50" cy="48" r="2" fill="#654321" />
            {/* Spider legs */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 50 + Math.cos(rad) * 6;
              const y2 = 50 + Math.sin(rad) * 6;

              return (
                <line
                  key={`leg-${i}`}
                  x1="50"
                  y1="50"
                  x2={x2}
                  y2={y2}
                  stroke="#654321"
                  strokeWidth="0.8"
                />
              );
            })}
          </motion.g>
        )}
      </svg>
    </Box>
  );
}

// Compact web icon
export function AnansiWebIcon({ size = 24 }: { size?: number }) {
  return (
    <Box display="inline-block">
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#9B59B6" strokeWidth="0.5" fill="none" opacity="0.4" />
        <circle cx="12" cy="12" r="7" stroke="#9B59B6" strokeWidth="0.5" fill="none" opacity="0.6" />
        <circle cx="12" cy="12" r="4" stroke="#9B59B6" strokeWidth="0.5" fill="none" opacity="0.8" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="#9B59B6" strokeWidth="0.5" opacity="0.5" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="#9B59B6" strokeWidth="0.5" opacity="0.5" />
        <circle cx="12" cy="12" r="2" fill="#8B4513" />
      </svg>
    </Box>
  );
}
