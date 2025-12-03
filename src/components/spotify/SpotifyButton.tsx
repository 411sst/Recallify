import { useState } from "react";
import {
  IconButton,
  Tooltip,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import SpotifyPlayerCard from "./SpotifyPlayerCard.tsx";

export default function SpotifyButton() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const bgColor = useColorModeValue("#1DB954", "#1ED760"); // Spotify green
  const hoverBg = useColorModeValue("#1ED760", "#1DB954");

  return (
    <>
      {/* Floating Spotify Button */}
      <Tooltip
        label="Open Spotify Player"
        placement="left"
        hasArrow
      >
        <IconButton
          aria-label="Spotify Player"
          icon={<Icon as={FaSpotify} boxSize={6} />}
          position="fixed"
          bottom="16px"
          right="16px"
          size="lg"
          borderRadius="full"
          bg={bgColor}
          color="white"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          _hover={{
            bg: hoverBg,
            transform: "scale(1.05)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
          onClick={() => setIsPlayerOpen(!isPlayerOpen)}
          zIndex={1000}
          transition="all 0.2s"
        />
      </Tooltip>

      {/* Player Card (conditionally rendered) */}
      {isPlayerOpen && (
        <SpotifyPlayerCard onClose={() => setIsPlayerOpen(false)} />
      )}
    </>
  );
}
