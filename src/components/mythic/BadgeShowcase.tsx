/**
 * 🏆 BADGE SHOWCASE
 * Display collection of unlocked achievement badges
 */

import { Box, SimpleGrid, VStack, Text, Badge as ChakraBadge, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMythicStore } from '../../stores/mythicStore';
import type { Badge, BadgeRarity } from '../../types/mythic';

export function BadgeShowcase() {
  const { badges } = useMythicStore();
  const bgColor = useColorModeValue('white', '#1a1a1a');
  const borderColor = useColorModeValue('gray.200', '#333333');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const getRarityColor = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'orange';
      case 'mythic': return 'pink';
      default: return 'gray';
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;

  return (
    <Box>
      {/* Header Stats */}
      <Box mb={8} p={6} bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              🏆 Badge Collection
            </Text>
            <Text fontSize="sm" color="gray.500">
              Unlock achievements through your study journey
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="3xl" fontWeight="bold" color="primary.500">
              {unlockedCount}/{totalCount}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {Math.round((unlockedCount / totalCount) * 100)}% Complete
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Badge Grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {badges.map((badge, index) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            index={index}
            rarityColor={getRarityColor(badge.rarity)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

interface BadgeCardProps {
  badge: Badge;
  index: number;
  rarityColor: string;
}

function BadgeCard({ badge, index, rarityColor }: BadgeCardProps) {
  const bgColor = useColorModeValue('white', '#1a1a1a');
  const borderColor = useColorModeValue('gray.200', '#2d2d2d');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Box
        bg={bgColor}
        borderRadius="lg"
        p={6}
        border="2px solid"
        borderColor={badge.unlocked ? `${rarityColor}.400` : borderColor}
        position="relative"
        overflow="hidden"
        opacity={badge.unlocked ? 1 : 0.4}
        filter={badge.unlocked ? 'none' : 'grayscale(100%)'}
        transition="all 0.3s"
        _hover={{
          transform: badge.unlocked ? 'translateY(-4px)' : 'none',
          boxShadow: badge.unlocked ? 'lg' : 'none',
        }}
      >
        {/* Rarity glow for unlocked badges */}
        {badge.unlocked && (
          <Box
            position="absolute"
            inset={0}
            bg={`linear-gradient(135deg, ${rarityColor}.400 0%, transparent 50%)`}
            opacity={0.1}
            pointerEvents="none"
          />
        )}

        <VStack spacing={3} align="center">
          {/* Badge Icon */}
          <motion.div
            animate={badge.unlocked ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: badge.unlocked ? Infinity : 0,
              repeatType: 'reverse',
            }}
          >
            <Text fontSize="4xl">{badge.icon}</Text>
          </motion.div>

          {/* Badge Name */}
          <VStack spacing={1} align="center">
            <Text fontSize="md" fontWeight="bold" color={textColor} textAlign="center">
              {badge.name}
            </Text>
            <ChakraBadge colorScheme={rarityColor} fontSize="2xs">
              {badge.rarity.toUpperCase()}
            </ChakraBadge>
          </VStack>

          {/* Description */}
          <Text fontSize="xs" color="gray.500" textAlign="center" lineHeight="1.4">
            {badge.description}
          </Text>

          {/* Unlock Condition */}
          <Text fontSize="2xs" color="gray.400" textAlign="center" fontStyle="italic">
            {badge.unlockCondition}
          </Text>

          {/* Unlocked Date */}
          {badge.unlocked && badge.unlockedAt && (
            <Text fontSize="2xs" color={`${rarityColor}.500`} fontWeight="semibold">
              Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </VStack>
      </Box>
    </motion.div>
  );
}
