/**
 * 🔥 PHOENIX LOADER COMPONENT
 * Loading screen with flame animation and prophecies
 */

import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PhoenixFlame } from './PhoenixFlame';
import { usePhoenixProphecy } from '../../hooks/useFolklore';
import { useIsMythicFeatureActive, useMythicStore } from '../../stores/mythicStore';
import { triggerConfetti } from '../../utils/confetti';

interface PhoenixLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  sessionContext?: string; // 'math', 'history', etc.
  onLoadComplete?: () => void;
  showConfetti?: boolean;
}

export function PhoenixLoader({
  isLoading,
  loadingText = 'Loading...',
  sessionContext,
  onLoadComplete,
  showConfetti = true,
}: PhoenixLoaderProps) {
  const isActive = useIsMythicFeatureActive('phoenixLoaders');
  const prophecy = usePhoenixProphecy(sessionContext);
  const { incrementRebornCount } = useMythicStore();
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 26, 26, 0.95)');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const MIN_DISPLAY_TIME = 2000; // 2 seconds minimum to see prophecy

  // Track when loading starts - always track, even if mythic mode is off
  useEffect(() => {
    if (isLoading) {
      setLoadStartTime(Date.now());
      setShowLoader(true);
      setHasCompleted(false);
    }
  }, [isLoading]);

  // Handle loading completion with minimum display time
  useEffect(() => {
    if (!isLoading && showLoader && !hasCompleted && loadStartTime) {
      const elapsed = Date.now() - loadStartTime;
      const remaining = isActive ? Math.max(0, MIN_DISPLAY_TIME - elapsed) : 0;

      const timer = setTimeout(() => {
        setHasCompleted(true);
        setShowLoader(false);

        // ALWAYS trigger confetti when loading completes, regardless of mythic mode
        if (showConfetti) {
          triggerRebirthConfetti();
          if (isActive) {
            incrementRebornCount();
          }
        }
        onLoadComplete?.();
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, showLoader, hasCompleted, isActive, showConfetti, incrementRebornCount, onLoadComplete, loadStartTime]);

  // Fallback standard loader when mythic mode is off
  if (!isActive) {
    return (
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: bgColor,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <VStack spacing={4}>
              <Text fontSize="lg" color={textColor}>{loadingText}</Text>
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: bgColor,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <VStack spacing={6} maxW="500px" px={8}>
            {/* Phoenix flame */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <PhoenixFlame size={120} intensity="high" animated={true} />
            </motion.div>

            {/* Prophecy */}
            {prophecy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Text
                  fontSize="md"
                  fontStyle="italic"
                  color={textColor}
                  textAlign="center"
                  lineHeight="1.8"
                >
                  "{prophecy.prophecy}"
                </Text>
              </motion.div>
            )}

            {/* Loading text */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Text fontSize="sm" color={textColor} opacity={0.7}>
                {loadingText}
              </Text>
            </motion.div>
          </VStack>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Rebirth confetti effect
function triggerRebirthConfetti() {
  triggerConfetti(['#FF6B35', '#F7931E', '#FDC830', '#FFE66D']);
}

// Inline loader for smaller contexts (e.g., buttons)
export function PhoenixLoaderInline({ size = 24 }: { size?: number }) {
  const isActive = useIsMythicFeatureActive('phoenixLoaders');

  if (!isActive) {
    return (
      <Box
        width={`${size}px`}
        height={`${size}px`}
        borderRadius="50%"
        border="2px solid"
        borderColor="orange.400"
        borderTopColor="transparent"
        animation="spin 0.8s linear infinite"
      />
    );
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <PhoenixFlame size={size} animated={false} />
    </motion.div>
  );
}

// Loading overlay for specific sections
export function PhoenixLoadingOverlay({
  isLoading,
  children,
  minHeight = '200px',
}: {
  isLoading: boolean;
  children: React.ReactNode;
  minHeight?: string;
}) {
  const isActive = useIsMythicFeatureActive('phoenixLoaders');

  return (
    <Box position="relative" minHeight={minHeight}>
      {children}
      <AnimatePresence>
        {isLoading && isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <PhoenixFlame size={60} intensity="medium" animated={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
