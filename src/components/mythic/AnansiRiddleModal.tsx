/**
 * 🕷️ ANANSI RIDDLE MODAL
 * Spider-yarn challenges during Pomodoro sessions
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Box,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnansiWeb } from './AnansiWeb';
import { AnansiYarn } from '../../types/mythic';
import { useMythicStore } from '../../stores/mythicStore';
import { useAnansiRewardMessage } from '../../hooks/useFolklore';

interface AnansiRiddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  yarn: AnansiYarn | null;
  onCorrect?: () => void;
  onWrong?: () => void;
}

export function AnansiRiddleModal({ isOpen, onClose, yarn, onCorrect, onWrong }: AnansiRiddleModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { completeYarn, addTricksterThread } = useMythicStore();
  const rewardMessage = useAnansiRewardMessage();
  const toast = useToast();

  if (!yarn) return null;

  const allAnswers = [yarn.correctAnswer, ...yarn.wrongAnswers].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === yarn.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      completeYarn();
      addTricksterThread(1);
      onCorrect?.();

      // Show reward toast
      toast({
        title: '🕷️ Anansi Approves!',
        description: rewardMessage,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } else {
      onWrong?.();
    }
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
      <ModalContent bg="gray.800" color="white" borderWidth="2px" borderColor="purple.500">
        <ModalHeader>
          <HStack spacing={3}>
            <AnansiWeb size={40} animated={true} isVibrating={!showResult} />
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold">
                Anansi's Web Weaves...
              </Text>
              <Text fontSize="sm" fontWeight="normal" opacity={0.7}>
                Answer the riddle to continue
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Riddle */}
            <Box
              p={4}
              bg="purple.900"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="purple.400"
            >
              <Text fontSize="md" fontStyle="italic" lineHeight="1.8">
                {yarn.riddle}
              </Text>
            </Box>

            {/* Answer options */}
            <VStack spacing={3} align="stretch">
              {allAnswers.map((answer, index) => (
                <AnswerButton
                  key={index}
                  answer={answer}
                  isSelected={selectedAnswer === answer}
                  isCorrect={showResult && answer === yarn.correctAnswer}
                  isWrong={showResult && selectedAnswer === answer && !isCorrect}
                  onClick={() => !showResult && handleAnswer(answer)}
                  disabled={showResult}
                />
              ))}
            </VStack>

            {/* Result message */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Box
                    p={4}
                    bg={isCorrect ? 'green.900' : 'red.900'}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor={isCorrect ? 'green.400' : 'red.400'}
                  >
                    <Text fontWeight="bold" mb={2}>
                      {isCorrect ? '✅ Clever Spinner!' : '❌ Caught in the Web'}
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      {isCorrect
                        ? yarn.reward
                        : `The correct answer was: "${yarn.correctAnswer}"`}
                    </Text>
                    {yarn.moral && (
                      <Text fontSize="xs" mt={2} fontStyle="italic" opacity={0.7}>
                        Moral: {yarn.moral}
                      </Text>
                    )}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Difficulty indicator */}
            <HStack justify="space-between" fontSize="xs" opacity={0.6}>
              <Text>Difficulty: {yarn.difficulty}</Text>
              <Text>🕷️ Trickster Threads: +1</Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {showResult ? (
            <Button colorScheme="purple" onClick={handleClose}>
              Continue
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleClose}>
              Skip (No Reward)
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Answer button component
interface AnswerButtonProps {
  answer: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onClick: () => void;
  disabled: boolean;
}

function AnswerButton({ answer, isSelected, isCorrect, isWrong, onClick, disabled }: AnswerButtonProps) {
  let bgColor = 'gray.700';
  let borderColor = 'gray.600';
  let hoverBg = 'gray.600';

  if (isCorrect) {
    bgColor = 'green.700';
    borderColor = 'green.400';
  } else if (isWrong) {
    bgColor = 'red.700';
    borderColor = 'red.400';
  } else if (isSelected) {
    bgColor = 'purple.700';
    borderColor = 'purple.400';
  }

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      <Box
        as="button"
        w="100%"
        p={4}
        bg={bgColor}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="md"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        onClick={onClick}
        disabled={disabled}
        _hover={!disabled ? { bg: hoverBg } : undefined}
        transition="all 0.2s"
        textAlign="left"
      >
        <HStack>
          {isCorrect && <Text>✅</Text>}
          {isWrong && <Text>❌</Text>}
          <Text>{answer}</Text>
        </HStack>
      </Box>
    </motion.div>
  );
}
