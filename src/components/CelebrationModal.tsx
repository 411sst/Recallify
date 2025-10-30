import { useEffect, useState } from "react";
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
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

interface MilestoneData {
  milestone: number;
  title: string;
  message: string;
  emoji: string;
}

interface CelebrationModalProps {
  isOpen: boolean;
  milestone: number | null;
  onClose: () => void;
}

const MILESTONES: Record<number, MilestoneData> = {
  7: { milestone: 7, title: "First Week!", emoji: "🎉", message: "One week straight! You're building a great habit!" },
  14: { milestone: 14, title: "Two Weeks!", emoji: "🔥", message: "Two weeks of consistency! Keep up the momentum!" },
  30: { milestone: 30, title: "One Month!", emoji: "⭐", message: "A full month! Amazing! You're unstoppable!" },
  50: { milestone: 50, title: "50 Days!", emoji: "💪", message: "50 days! You're unstoppable! Rare achievement!" },
  100: { milestone: 100, title: "100 Days!", emoji: "🏆", message: "100 DAYS! Incredible dedication! You're in elite company!" },
  180: { milestone: 180, title: "Six Months!", emoji: "🎊", message: "6 months! You're a study machine! Outstanding commitment!" },
  365: { milestone: 365, title: "One Year!", emoji: "👑", message: "ONE FULL YEAR! LEGENDARY! Extraordinary achievement!" },
};

export default function CelebrationModal({ isOpen, milestone, onClose }: CelebrationModalProps) {
  const [canClose, setCanClose] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  const cardBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("text.primary", "#ffffff");
  const fireColor = useColorModeValue("orange.500", "#ff6b35");

  const milestoneData = milestone ? MILESTONES[milestone] : null;

  useEffect(() => {
    if (isOpen) {
      // Prevent closing for 3 seconds minimum
      setCanClose(false);
      const timer = setTimeout(() => {
        setCanClose(true);
      }, 3000);

      // Generate confetti positions
      const confettiArray = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setConfetti(confettiArray);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  if (!milestoneData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="lg"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      <ModalContent bg={cardBg} position="relative" overflow="hidden">
        {/* Confetti Animation */}
        {confetti.map((particle) => (
          <Box
            key={particle.id}
            position="absolute"
            top="-10px"
            left={`${particle.left}%`}
            width="10px"
            height="10px"
            bg={`hsl(${Math.random() * 360}, 70%, 60%)`}
            borderRadius="2px"
            animation={`confettiFall 3s ease-in ${particle.delay}s infinite`}
            opacity="0.8"
          />
        ))}

        <ModalHeader textAlign="center" fontSize="3xl" color={textColor} pt={8}>
          🎉 {milestoneData.title} 🎉
        </ModalHeader>
        <ModalBody pb={6}>
          <VStack spacing={6}>
            <Text fontSize="8xl" animation="bounce 1s ease-in-out infinite">
              {milestoneData.emoji}
            </Text>
            <Text fontSize="xl" textAlign="center" color={textColor} fontWeight="medium">
              {milestoneData.message}
            </Text>
            <Box
              bg={fireColor}
              color="white"
              px={8}
              py={4}
              borderRadius="xl"
              boxShadow="lg"
            >
              <Text fontSize="4xl" fontWeight="bold" textAlign="center">
                {milestoneData.milestone} Day Streak!
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center" pb={8}>
          <Button
            colorScheme="teal"
            size="lg"
            px={12}
            onClick={handleClose}
            isDisabled={!canClose}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
            }}
          >
            {canClose ? "Keep Going! 🚀" : "Celebrating..."}
          </Button>
        </ModalFooter>
      </ModalContent>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </Modal>
  );
}
