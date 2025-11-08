/**
 * ✨ PAGE TRANSITION WRAPPER
 * Animated transitions between routes based on mythic theme
 */

import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useMythicStore } from '../../stores/mythicStore';

export interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const { enabled, currentTheme } = useMythicStore();

  // Skip animations if mythic mode is off
  if (!enabled) {
    return <>{children}</>;
  }

  const getTransitionVariants = () => {
    switch (currentTheme) {
      case 'kitsune-autumn':
        // Fox-tail swipe animation
        return {
          initial: { opacity: 0, x: -100, rotate: -5 },
          animate: { opacity: 1, x: 0, rotate: 0 },
          exit: { opacity: 0, x: 100, rotate: 5 },
        };

      case 'phoenix-inferno':
        // Flame rise animation
        return {
          initial: { opacity: 0, y: 100, scale: 0.8 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -100, scale: 1.2 },
        };

      case 'anansi-twilight':
        // Web fade animation
        return {
          initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
        };

      default:
        // Default smooth fade
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
    }
  };

  const variants = getTransitionVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Box width="100%" height="100%">
          {children}
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Morphing state transition (for within-page state changes)
 */
export function StateMorph({
  children,
  state,
}: {
  children: ReactNode;
  state: string | number;
}) {
  const { enabled } = useMythicStore();

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Themed route transition effects
 */
export function RouteTransitionEffect({ theme }: { theme: string }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9997,
          background: theme === 'kitsune-autumn'
            ? 'linear-gradient(45deg, #FF6B3540 0%, transparent 100%)'
            : theme === 'phoenix-inferno'
            ? 'radial-gradient(circle, #DC262640 0%, transparent 70%)'
            : theme === 'anansi-twilight'
            ? 'radial-gradient(ellipse, #7C3AED40 0%, transparent 70%)'
            : 'transparent',
        }}
      />
    </AnimatePresence>
  );
}
