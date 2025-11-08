/**
 * 👻 BANSHEE WARNING COMPONENT
 * Ghostly streak-loss warnings with ethereal animations
 */

import { Box, VStack, Text, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMythicFeatureActive, useMythicStore } from '../../stores/mythicStore';

export interface BansheeWarningProps {
  isOpen: boolean;
  message: string;
  severity: 'whisper' | 'wail' | 'scream';
  daysUntilLoss: number;
  onDismiss: () => void;
  onStudyNow: () => void;
}

export function BansheeWarning({
  isOpen,
  message,
  severity,
  daysUntilLoss,
  onDismiss,
  onStudyNow,
}: BansheeWarningProps) {
  const isActive = useIsMythicFeatureActive('bansheeNotifications');
  const { showBansheeWarning } = useMythicStore();
  const [hasPlayedWail, setHasPlayedWail] = useState(false);

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(26, 26, 26, 0.98)');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  // Ghostly colors based on severity
  const getGhostlyColor = () => {
    switch (severity) {
      case 'whisper': return '#A5B8CF'; // Soft blue-gray
      case 'wail': return '#8B9DC3';    // Medium blue
      case 'scream': return '#7A8BA1';  // Dark blue-gray
      default: return '#9EAFC7';
    }
  };

  const ghostlyColor = getGhostlyColor();

  useEffect(() => {
    if (isOpen && isActive && !hasPlayedWail) {
      setHasPlayedWail(true);
      showBansheeWarning();
      // Play wailing sound if audio enabled
      playWail(severity);
    }
  }, [isOpen, isActive, hasPlayedWail, severity, showBansheeWarning]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setHasPlayedWail(false);
    }
  }, [isOpen]);

  const playWail = (sev: 'whisper' | 'wail' | 'scream') => {
    try {
      // TODO: Add actual wailing sound files
      // const audio = new Audio(`/banshee-${sev}.mp3`);
      // audio.volume = sev === 'scream' ? 0.5 : sev === 'wail' ? 0.3 : 0.2;
      // audio.play().catch(() => console.log('Sound play failed'));
    } catch (error) {
      console.log('Banshee sound not available');
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
          >
            <Box
              bg={bgColor}
              borderRadius="lg"
              maxW="500px"
              p={8}
              position="relative"
              overflow="hidden"
              boxShadow={`0 0 40px ${ghostlyColor}, 0 0 80px ${ghostlyColor}40`}
            >
              {/* Ghostly floating orbs background */}
              <GhostlyOrbs color={ghostlyColor} />

              {/* Banshee icon */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Text fontSize="6xl" textAlign="center" mb={4}>
                  👻
                </Text>
              </motion.div>

              <VStack spacing={6} align="stretch">
                {/* Warning message */}
                <VStack spacing={2}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={ghostlyColor}
                    textAlign="center"
                    letterSpacing="wide"
                  >
                    {severity === 'scream' ? '⚠️ URGENT WARNING ⚠️' : severity === 'wail' ? 'WARNING' : 'Gentle Reminder'}
                  </Text>
                  <motion.div
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Text
                      fontSize="md"
                      color={textColor}
                      textAlign="center"
                      lineHeight="1.8"
                      fontStyle="italic"
                    >
                      {message}
                    </Text>
                  </motion.div>
                </VStack>

                {/* Days until loss indicator */}
                <Box
                  bg={`${ghostlyColor}20`}
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                  borderLeft="4px solid"
                  borderColor={ghostlyColor}
                >
                  <Text fontSize="sm" color={textColor} fontWeight="semibold">
                    {daysUntilLoss === 0
                      ? "🕐 Time remaining: Until midnight tonight"
                      : `📅 ${daysUntilLoss} day${daysUntilLoss !== 1 ? 's' : ''} until streak loss`
                    }
                  </Text>
                </Box>

                {/* Action buttons */}
                <HStack spacing={4} justify="center" pt={2}>
                  <Button
                    variant="outline"
                    onClick={onDismiss}
                    color={textColor}
                    borderColor={ghostlyColor}
                    _hover={{ bg: `${ghostlyColor}20` }}
                  >
                    Dismiss
                  </Button>
                  <Button
                    bg={ghostlyColor}
                    color="white"
                    onClick={onStudyNow}
                    _hover={{ bg: ghostlyColor, filter: 'brightness(1.2)' }}
                    boxShadow={`0 0 20px ${ghostlyColor}60`}
                  >
                    Study Now 📚
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Ghostly floating orbs background effect
 */
function GhostlyOrbs({ color }: { color: string }) {
  const orbs = [
    { delay: 0, duration: 8, x: -20, y: -30 },
    { delay: 2, duration: 10, x: 20, y: -20 },
    { delay: 4, duration: 12, x: -10, y: 20 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            y: [orb.y, orb.y - 40, orb.y],
            x: [orb.x, orb.x + 20, orb.x],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            pointerEvents: 'none',
            top: '50%',
            left: '50%',
            transform: `translate(${orb.x}px, ${orb.y}px)`,
          }}
        />
      ))}
    </>
  );
}

/**
 * Mini banshee notification (for less intrusive warnings)
 */
export function BansheeMiniNotification({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const isActive = useIsMythicFeatureActive('bansheeNotifications');
  const bgColor = useColorModeValue('white', '#1a1a1a');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <Box
        bg={bgColor}
        borderRadius="md"
        p={4}
        maxW="300px"
        boxShadow="0 4px 12px rgba(0,0,0,0.15), 0 0 20px #8B9DC340"
        borderLeft="4px solid #8B9DC3"
      >
        <HStack spacing={3} align="start">
          <Text fontSize="2xl">👻</Text>
          <VStack align="start" flex="1" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color="#8B9DC3">
              Banshee Warning
            </Text>
            <Text fontSize="sm" color={textColor} lineHeight="1.4">
              {message}
            </Text>
          </VStack>
          <Text
            fontSize="xs"
            color="gray.500"
            cursor="pointer"
            onClick={onClose}
            _hover={{ color: textColor }}
          >
            ✕
          </Text>
        </HStack>
      </Box>
    </motion.div>
  );
}
