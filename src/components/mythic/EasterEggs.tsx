/**
 * 🥚 EASTER EGGS
 * Hidden features, Konami code, secret mini-game, and mythology references
 */

import { useEffect, useState, useCallback } from 'react';
import { Box, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMythicStore } from '../../stores/mythicStore';
import { DjinnSmoke } from './DjinnSmoke';

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/**
 * Konami Code Detector
 */
export function useKonamiCode(onUnlock: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-10); // Keep last 10 keys

        // Check if it matches Konami code
        if (newKeys.length === 10 && newKeys.every((key, index) => key === KONAMI_CODE[index])) {
          onUnlock();
          return []; // Reset
        }

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUnlock]);
}

/**
 * Konami Code Easter Egg Component
 */
export function KonamiCodeEasterEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { unlockBadge } = useMythicStore();
  const toast = useToast();

  const handleUnlock = useCallback(() => {
    if (unlocked) return;

    setUnlocked(true);
    setShowCelebration(true);
    unlockBadge('konami-keeper');

    toast({
      title: '🎮 KONAMI CODE ACTIVATED!',
      description: 'You\'ve unlocked legendary mode! All mythic features now have enhanced effects!',
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top',
    });

    // Hide celebration after 5 seconds
    setTimeout(() => setShowCelebration(false), 5000);
  }, [unlocked, unlockBadge, toast]);

  useKonamiCode(handleUnlock);

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          <DjinnSmoke
            particleCount={100}
            colors={['#FF6B35', '#9B59B6', '#3182CE', '#F59E0B', '#DC2626']}
            duration={4}
            spread={400}
            origin={{ x: 0.5, y: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10003,
            }}
          >
            <Box
              bg="rgba(0, 0, 0, 0.95)"
              color="white"
              p={8}
              borderRadius="xl"
              boxShadow="0 0 100px rgba(255, 107, 53, 0.8)"
              textAlign="center"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Text fontSize="6xl">🎮</Text>
              </motion.div>
              <Text fontSize="2xl" fontWeight="bold" mt={4}>
                KONAMI CODE!
              </Text>
              <Text fontSize="md" mt={2} opacity={0.8}>
                Legendary Mode Activated
              </Text>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hidden Mythology References
 * Click on specific UI elements in sequence to reveal lore
 */
export function MythologyReferenceDetector() {
  const [clicks, setClicks] = useState<string[]>([]);
  const toast = useToast();

  // Secret sequence: Click Kitsune icon → Phoenix icon → Anansi icon
  const SECRET_SEQUENCE = ['kitsune', 'phoenix', 'anansi', 'banshee', 'djinn'];

  const handleCreatureClick = useCallback((creature: string) => {
    setClicks((prev) => {
      const newClicks = [...prev, creature].slice(-5);

      if (newClicks.length === 5 && newClicks.every((c, i) => c === SECRET_SEQUENCE[i])) {
        toast({
          title: '🌟 MYTHIC PROPHECY REVEALED',
          description: '"When all five spirits unite, the scholar achieves true enlightenment..."',
          status: 'info',
          duration: 8000,
          isClosable: true,
        });
        return [];
      }

      return newClicks;
    });
  }, [toast]);

  // Expose handler for components to use
  useEffect(() => {
    (window as any).__mythicCreatureClick = handleCreatureClick;
  }, [handleCreatureClick]);

  return null;
}

/**
 * Secret Mini-Game: Mythic Memory Match
 */
export function MythicMemoryGame({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      initializeGame();
    }
  }, [isOpen]);

  const initializeGame = () => {
    const icons = ['🦊', '🔥', '🕷️', '👻', '🧞', '📚', '🍅', '⭐'];
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
    setCards(deck);
    setScore(0);
    setFlippedIndices([]);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        // Match!
        setTimeout(() => {
          const updated = [...cards];
          updated[first].matched = true;
          updated[second].matched = true;
          setCards(updated);
          setFlippedIndices([]);
          setScore((s) => s + 10);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updated = [...cards];
          updated[first].flipped = false;
          updated[second].flipped = false;
          setCards(updated);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  if (!isOpen) return null;

  const isComplete = cards.every((c) => c.matched);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10004,
      }}
    >
      <Box bg="white" p={8} borderRadius="xl" maxW="600px">
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold">
            🎮 Mythic Memory Match
          </Text>
          <Text fontSize="lg">Score: {score}</Text>

          {/* Game Grid */}
          <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={3}>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  width="80px"
                  height="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={card.matched ? 'green.200' : card.flipped ? 'blue.100' : 'gray.200'}
                  borderRadius="md"
                  fontSize="3xl"
                  cursor={card.matched ? 'default' : 'pointer'}
                  onClick={() => handleCardClick(index)}
                  border="2px solid"
                  borderColor={card.matched ? 'green.500' : 'gray.400'}
                >
                  {card.flipped || card.matched ? card.icon : '?'}
                </Box>
              </motion.div>
            ))}
          </Box>

          {isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <VStack spacing={3}>
                <Text fontSize="xl" fontWeight="bold" color="green.600">
                  🎉 You Win! 🎉
                </Text>
                <Text>Final Score: {score}</Text>
              </VStack>
            </motion.div>
          )}

          <Button onClick={isComplete ? onClose : initializeGame}>
            {isComplete ? 'Close' : 'New Game'}
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
}

/**
 * Developer Signatures (Hidden credits)
 */
export function DeveloperSignatures() {
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    // Secret: Type "mythic" in console
    (window as any).showMythicCredits = () => setShowCredits(true);

    // Also log a hint
    console.log('%c🌟 Mythic Mode Activated! 🌟', 'font-size: 20px; color: #9B59B6; font-weight: bold;');
    console.log('%cTry typing: showMythicCredits()', 'font-size: 14px; color: #3182CE;');
  }, []);

  return (
    <AnimatePresence>
      {showCredits && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10005,
          }}
        >
          <Box
            bg="rgba(0, 0, 0, 0.9)"
            color="white"
            p={4}
            borderRadius="lg"
            boxShadow="0 0 30px rgba(155, 89, 182, 0.6)"
            maxW="300px"
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="bold" color="#9B59B6">
                ⚡ Mythic Mode Credits
              </Text>
              <Text fontSize="xs" lineHeight="1.6">
                Developed with Claude Code by Anthropic
              </Text>
              <Text fontSize="xs" opacity={0.7}>
                Featuring: Kitsune 🦊, Phoenix 🔥, Anansi 🕷️, Banshee 👻, Djinn 🧞
              </Text>
              <Button size="xs" onClick={() => setShowCredits(false)}>
                Close
              </Button>
            </VStack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
