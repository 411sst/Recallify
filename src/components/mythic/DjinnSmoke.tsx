/**
 * 🧞 DJINN SMOKE PARTICLES
 * Mystical smoke wisp effects for wishes and celebrations
 */

import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useIsMythicFeatureActive, useShouldRenderParticles } from '../../stores/mythicStore';

export interface DjinnSmokeProps {
  particleCount?: number;
  colors?: string[];
  duration?: number;
  spread?: number;
  origin?: { x: number; y: number }; // Position origin (0-1 for percentage)
}

export function DjinnSmoke({
  particleCount = 20,
  colors = ['#9B59B6', '#8E44AD', '#E1BEE7', '#CE93D8'],
  duration = 3,
  spread = 200,
  origin = { x: 0.5, y: 0.8 },
}: DjinnSmokeProps) {
  const isActive = useIsMythicFeatureActive('djinnParticles');
  const shouldRender = useShouldRenderParticles();

  const particles = useMemo(() => {
    if (!isActive || !shouldRender) return [];

    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = Math.random() * spread;
      const size = 20 + Math.random() * 40;

      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 100, // Bias upward (smoke rises)
        delay: Math.random() * 0.5,
        duration: duration + Math.random() * 2,
        rotation: Math.random() * 360,
      };
    });
  }, [particleCount, colors, spread, duration, isActive, shouldRender]);

  if (!isActive || !shouldRender) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={9998}
      overflow="hidden"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${origin.x * 100}vw`,
            y: `${origin.y * 100}vh`,
            opacity: 0.8,
            scale: 0,
          }}
          animate={{
            x: `calc(${origin.x * 100}vw + ${particle.x}px)`,
            y: `calc(${origin.y * 100}vh + ${particle.y}px)`,
            opacity: [0.8, 0.6, 0],
            scale: [0, 1, 1.5],
            rotate: particle.rotation,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${particle.color}80 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />
      ))}
    </Box>
  );
}

/**
 * Continuous ambient smoke wisps (background effect)
 */
export function DjinnAmbientSmoke({ intensity = 'low' }: { intensity?: 'low' | 'medium' | 'high' }) {
  const isActive = useIsMythicFeatureActive('djinnParticles');
  const { particlesActive } = useMythicStore();
  const shouldRender = useShouldRenderParticles();

  const count = intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3;
  const duration = intensity === 'high' ? 15 : intensity === 'medium' ? 20 : 25;

  const wisps = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: (i * duration) / count,
      x: 10 + Math.random() * 80, // Random starting position (% of screen width)
    }));
  }, [count, duration]);

  if (!isActive || !shouldRender || !particlesActive) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={1}
      overflow="hidden"
    >
      {wisps.map((wisp) => (
        <motion.div
          key={wisp.id}
          animate={{
            y: ['100vh', '-20vh'],
            x: [`${wisp.x}vw`, `${wisp.x + (Math.random() * 20 - 10)}vw`],
            opacity: [0, 0.15, 0.15, 0],
            scale: [0.5, 1, 1.2, 0.8],
          }}
          transition={{
            duration,
            delay: wisp.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: '60px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(155, 89, 182, 0.2) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />
      ))}
    </Box>
  );
}

// Import the store for ambient smoke
import { useMythicStore } from '../../stores/mythicStore';
