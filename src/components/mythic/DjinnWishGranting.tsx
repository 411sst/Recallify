/**
 * 🧞 DJINN WISH GRANTING ANIMATION
 * Magical wish-granting celebration for milestones and achievements
 */

import { Box, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMythicFeatureActive, useMythicStore } from '../../stores/mythicStore';
import { DjinnSmoke } from './DjinnSmoke';

export interface DjinnWishGrantingProps {
  isOpen: boolean;
  wishTitle: string;
  wishMessage: string;
  onComplete: () => void;
}

export function DjinnWishGranting({
  isOpen,
  wishTitle,
  wishMessage,
  onComplete,
}: DjinnWishGrantingProps) {
  const isActive = useIsMythicFeatureActive('djinnParticles');
  const { grantWish } = useMythicStore();
  const [showSmoke, setShowSmoke] = useState(false);
  const [phase, setPhase] = useState<'appearing' | 'granting' | 'celebrating'>('appearing');

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(26, 26, 26, 0.98)');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  useEffect(() => {
    if (isOpen && isActive) {
      // Phase timing
      setPhase('appearing');
      setShowSmoke(true);
      grantWish();

      const timer1 = setTimeout(() => setPhase('granting'), 1000);
      const timer2 = setTimeout(() => setPhase('celebrating'), 2500);
      const timer3 = setTimeout(() => {
        setShowSmoke(false);
        onComplete();
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, isActive, grantWish, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Smoke particle effects */}
          {showSmoke && (
            <>
              <DjinnSmoke
                particleCount={40}
                colors={['#9B59B6', '#8E44AD', '#E1BEE7', '#CE93D8', '#FFD700']}
                duration={4}
                spread={300}
                origin={{ x: 0.5, y: 0.5 }}
              />
              {/* Second wave of smoke */}
              <DjinnSmoke
                particleCount={30}
                colors={['#FFD700', '#FFA500', '#FF6B35']}
                duration={3}
                spread={250}
                origin={{ x: 0.5, y: 0.5 }}
              />
            </>
          )}

          {/* Main modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 200,
              }}
            >
              <Box
                bg={bgColor}
                borderRadius="xl"
                maxW="600px"
                p={10}
                position="relative"
                overflow="hidden"
                boxShadow="0 0 60px rgba(155, 89, 182, 0.6), 0 0 120px rgba(255, 215, 0, 0.4)"
              >
                {/* Magical glow background */}
                <MagicalGlow phase={phase} />

                <VStack spacing={6} align="center" position="relative" zIndex={2}>
                  {/* Djinn lamp animation */}
                  <motion.div
                    animate={
                      phase === 'appearing'
                        ? { scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }
                        : phase === 'granting'
                        ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                        : { scale: [1, 1.3, 1], rotate: [0, 360] }
                    }
                    transition={{
                      duration: phase === 'celebrating' ? 1.5 : 0.8,
                      repeat: phase === 'granting' ? Infinity : 0,
                    }}
                  >
                    <Text fontSize="8xl">
                      🧞
                    </Text>
                  </motion.div>

                  {/* Wish title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="#9B59B6"
                      textAlign="center"
                      letterSpacing="wide"
                    >
                      {wishTitle}
                    </Text>
                  </motion.div>

                  {/* Wish message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Text
                      fontSize="lg"
                      color={textColor}
                      textAlign="center"
                      lineHeight="1.8"
                      fontStyle="italic"
                    >
                      {wishMessage}
                    </Text>
                  </motion.div>

                  {/* Status indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Text
                      fontSize="sm"
                      color="#FFD700"
                      fontWeight="semibold"
                      textAlign="center"
                    >
                      {phase === 'appearing' && '✨ The Djinn Awakens...'}
                      {phase === 'granting' && '🌟 Your Wish Is Being Granted...'}
                      {phase === 'celebrating' && '🎉 Wish Granted! May Your Journey Prosper!'}
                    </Text>
                  </motion.div>
                </VStack>
              </Box>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Magical pulsing glow background
 */
function MagicalGlow({ phase }: { phase: string }) {
  return (
    <>
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: phase === 'celebrating' ? 0.5 : 2,
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          inset: -20,
          background: 'radial-gradient(circle, rgba(155, 89, 182, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: phase === 'celebrating' ? 0.5 : 3,
          repeat: Infinity,
          delay: 1,
        }}
        style={{
          position: 'absolute',
          inset: -40,
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

/**
 * Quick wish-granted burst effect (for smaller achievements)
 */
export function DjinnWishBurst({
  trigger,
  message = 'Wish Granted!',
}: {
  trigger: boolean;
  message?: string;
}) {
  const isActive = useIsMythicFeatureActive('djinnParticles');
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (trigger && isActive) {
      setShowBurst(true);
      const timer = setTimeout(() => setShowBurst(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {showBurst && (
        <>
          <DjinnSmoke
            particleCount={15}
            colors={['#9B59B6', '#FFD700']}
            duration={2}
            spread={150}
            origin={{ x: 0.5, y: 0.3 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          >
            <Box
              bg="rgba(155, 89, 182, 0.95)"
              color="white"
              px={6}
              py={3}
              borderRadius="full"
              boxShadow="0 0 30px rgba(255, 215, 0, 0.6)"
              fontWeight="bold"
              fontSize="lg"
            >
              ✨ {message} ✨
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
