/**
 * 🧞 DJINN CURSOR TRAIL
 * Mystical particle trail that follows the cursor
 */

import { useEffect, useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMythicFeatureActive, useMythicStore } from '../../stores/mythicStore';

interface Particle {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function DjinnCursorTrail() {
  const isActive = useIsMythicFeatureActive('djinnParticles');
  const { djinn } = useMythicStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newParticle: Particle = {
      id: particleIdCounter,
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
    };

    setParticles((prev) => [...prev, newParticle]);
    setParticleIdCounter((prev) => prev + 1);

    // Clean up old particles (older than 1 second)
    setParticles((prev) =>
      prev.filter((p) => Date.now() - p.timestamp < 1000)
    );
  }, [particleIdCounter]);

  useEffect(() => {
    if (!isActive || !djinn.cursorTrailEnabled) return;

    // Throttle mouse move events to every 50ms for performance
    let lastCall = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastCall >= 50) {
        lastCall = now;
        handleMouseMove(e);
      }
    };

    window.addEventListener('mousemove', throttledMouseMove);

    // Clean up interval
    const cleanupInterval = setInterval(() => {
      setParticles((prev) =>
        prev.filter((p) => Date.now() - p.timestamp < 1000)
      );
    }, 100);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      clearInterval(cleanupInterval);
    };
  }, [isActive, djinn.cursorTrailEnabled, handleMouseMove]);

  if (!isActive || !djinn.cursorTrailEnabled) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={9999}
      overflow="hidden"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x - 4,
              y: particle.y - 4,
              opacity: 0.6,
              scale: 1,
            }}
            animate={{
              opacity: 0,
              scale: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #9B59B680 0%, transparent 70%)',
              boxShadow: '0 0 10px #9B59B680',
            }}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
}

/**
 * Enhanced cursor trail with stars/sparkles for special moments
 */
export function DjinnSparkleTrail({ active = false }: { active?: boolean }) {
  const isFeatureActive = useIsMythicFeatureActive('djinnParticles');
  const [sparkles, setSparkles] = useState<Particle[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Only create sparkle every 100px of movement (less frequent than smoke trail)
    if (Math.random() > 0.3) return;

    const newSparkle: Particle = {
      id: idCounter,
      x: e.clientX + (Math.random() * 20 - 10),
      y: e.clientY + (Math.random() * 20 - 10),
      timestamp: Date.now(),
    };

    setSparkles((prev) => [...prev, newSparkle]);
    setIdCounter((prev) => prev + 1);

    setSparkles((prev) =>
      prev.filter((p) => Date.now() - p.timestamp < 600)
    );
  }, [idCounter]);

  useEffect(() => {
    if (!isFeatureActive || !active) return;

    window.addEventListener('mousemove', handleMouseMove);

    const cleanupInterval = setInterval(() => {
      setSparkles((prev) =>
        prev.filter((p) => Date.now() - p.timestamp < 600)
      );
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, [isFeatureActive, active, handleMouseMove]);

  if (!isFeatureActive || !active) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={9999}
      overflow="hidden"
    >
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{
              x: sparkle.x - 6,
              y: sparkle.y - 6,
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1,
              rotate: 180,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              fontSize: '12px',
            }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
