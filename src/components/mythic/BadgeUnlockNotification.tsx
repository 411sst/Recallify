/**
 * 🎉 BADGE UNLOCK NOTIFICATION
 * Celebration animation when earning new badges
 */

import { Box, VStack, Text, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Badge, BadgeRarity } from '../../types/mythic';
import { DjinnSmoke } from './DjinnSmoke';

export interface BadgeUnlockNotificationProps {
  badge: Badge | null;
  onComplete: () => void;
}

export function BadgeUnlockNotification({ badge, onComplete }: BadgeUnlockNotificationProps) {
  const [showParticles, setShowParticles] = useState(false);
  const bgColor = useColorModeValue('white', '#1a1a1a');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const getRarityColor = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common': return '#718096';
      case 'rare': return '#3182CE';
      case 'epic': return '#805AD5';
      case 'legendary': return '#DD6B20';
      case 'mythic': return '#D53F8C';
      default: return '#718096';
    }
  };

  useEffect(() => {
    if (badge) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        onComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [badge, onComplete]);

  if (!badge) return null;

  const rarityColor = getRarityColor(badge.rarity);

  return (
    <AnimatePresence>
      {badge && (
        <>
          {/* Particles */}
          {showParticles && (
            <DjinnSmoke
              particleCount={badge.rarity === 'mythic' ? 50 : badge.rarity === 'legendary' ? 40 : 30}
              colors={[rarityColor, `${rarityColor}80`, '#FFD700']}
              duration={3}
              spread={250}
              origin={{ x: 0.5, y: 0.5 }}
            />
          )}

          {/* Notification Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10002,
            }}
            onClick={() => {
              setShowParticles(false);
              onComplete();
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180, y: -100 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0, rotate: 180, y: 100 }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 200,
              }}
            >
              <Box
                bg={bgColor}
                borderRadius="xl"
                p={10}
                maxW="500px"
                position="relative"
                overflow="hidden"
                boxShadow={`0 0 60px ${rarityColor}, 0 0 100px ${rarityColor}60`}
                border="3px solid"
                borderColor={rarityColor}
              >
                {/* Animated glow background */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  style={{
                    position: 'absolute',
                    inset: -20,
                    background: `radial-gradient(circle, ${rarityColor}40 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                <VStack spacing={6} position="relative" zIndex={2}>
                  {/* Header */}
                  <VStack spacing={2}>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <Text fontSize="lg" fontWeight="bold" color={rarityColor}>
                        🎉 BADGE UNLOCKED! 🎉
                      </Text>
                    </motion.div>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                      {badge.rarity} Achievement
                    </Text>
                  </VStack>

                  {/* Badge Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <Box
                      fontSize="7xl"
                      filter="drop-shadow(0 0 20px rgba(255,215,0,0.5))"
                    >
                      {badge.icon}
                    </Box>
                  </motion.div>

                  {/* Badge Name & Description */}
                  <VStack spacing={3}>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={textColor}
                      textAlign="center"
                    >
                      {badge.name}
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.500"
                      textAlign="center"
                      lineHeight="1.6"
                    >
                      {badge.description}
                    </Text>
                  </VStack>

                  {/* Mythic Creature Badge */}
                  {badge.mythCreature && (
                    <HStack spacing={2} px={4} py={2} bg={`${rarityColor}20`} borderRadius="full">
                      <Text fontSize="sm">
                        {badge.mythCreature === 'kitsune' && '🦊'}
                        {badge.mythCreature === 'phoenix' && '🔥'}
                        {badge.mythCreature === 'anansi' && '🕷️'}
                        {badge.mythCreature === 'banshee' && '👻'}
                        {badge.mythCreature === 'djinn' && '🧞'}
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color={rarityColor} textTransform="capitalize">
                        {badge.mythCreature} Badge
                      </Text>
                    </HStack>
                  )}

                  {/* Tap to continue */}
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                      (Tap anywhere to continue)
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
