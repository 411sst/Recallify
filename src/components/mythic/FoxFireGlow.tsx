/**
 * 🔥 FOX-FIRE GLOW EFFECT
 * Wraps elements with mystical fox-fire glow on hover
 */

import { Box, BoxProps } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { useIsMythicFeatureActive, useShouldRenderParticles } from '../../stores/mythicStore';

interface FoxFireGlowProps extends BoxProps {
  children: ReactNode;
  glowColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  enableParticles?: boolean;
  isActive?: boolean; // Force glow on/off (for active nav items)
}

export function FoxFireGlow({
  children,
  glowColor = '#FF6B35',
  glowIntensity = 'medium',
  enableParticles = false,
  isActive = false,
  ...boxProps
}: FoxFireGlowProps) {
  const isMythicActive = useIsMythicFeatureActive('kitsuneSidebar');
  const shouldRenderParticles = useShouldRenderParticles();
  const [isHovered, setIsHovered] = useState(false);

  // Don't render mythic effects if disabled
  if (!isMythicActive) {
    return <Box {...boxProps}>{children}</Box>;
  }

  const showGlow = isHovered || isActive;
  const showParticles = enableParticles && shouldRenderParticles && showGlow;

  // Glow intensity mapping
  const intensityMap = {
    low: {
      blur: '8px',
      spread: '4px',
      opacity: 0.4,
    },
    medium: {
      blur: '12px',
      spread: '6px',
      opacity: 0.6,
    },
    high: {
      blur: '16px',
      spread: '8px',
      opacity: 0.8,
    },
  };

  const intensity = intensityMap[glowIntensity];

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...boxProps}
    >
      {/* Glow effect layer */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: intensity.opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: `-${intensity.spread}`,
              borderRadius: 'inherit',
              background: `radial-gradient(circle, ${glowColor}40, transparent 70%)`,
              filter: `blur(${intensity.blur})`,
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Pulsing ring effect for active items */}
      {isActive && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: 'inherit',
            border: `2px solid ${glowColor}`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Particle effects (optional) */}
      {showParticles && (
        <FoxFireParticles color={glowColor} />
      )}

      {/* Content */}
      {children}
    </Box>
  );
}

// Fox-fire particles that float around the element
function FoxFireParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, particle.x, particle.x * 1.5],
            y: [0, particle.y, particle.y * 1.5],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: color,
            filter: 'blur(1px)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

// Simpler version: Just a subtle border glow
export function FoxFireBorder({
  children,
  isActive = false,
  ...boxProps
}: Omit<FoxFireGlowProps, 'glowColor' | 'glowIntensity' | 'enableParticles'>) {
  const isMythicActive = useIsMythicFeatureActive('kitsuneSidebar');
  const [isHovered, setIsHovered] = useState(false);

  if (!isMythicActive) {
    return <Box {...boxProps}>{children}</Box>;
  }

  const showEffect = isHovered || isActive;

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition="all 0.3s"
      borderLeft={showEffect ? '3px solid' : '3px solid transparent'}
      borderColor={showEffect ? 'orange.400' : 'transparent'}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
