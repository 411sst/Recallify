import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Spinner,
  useColorModeValue,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaMusic } from "react-icons/fa";
import { fetchUserPlaylists, playPlaylist, SpotifyPlaylist } from "../../services/spotify";

interface PlaylistDrawerProps {
  deviceId: string;
  onClose: () => void;
}

export default function PlaylistDrawer({ deviceId, onClose }: PlaylistDrawerProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(26, 26, 26, 0.95)");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.800");
  const selectedBg = useColorModeValue("primary.50", "rgba(29, 185, 84, 0.1)");

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    try {
      setIsLoading(true);
      const data = await fetchUserPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Error loading playlists:", error);
      toast({
        title: "Error",
        description: "Could not load playlists. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayPlaylist(playlist: SpotifyPlaylist) {
    try {
      setSelectedPlaylist(playlist.id);
      await playPlaylist(playlist.uri, deviceId);
      
      toast({
        title: "Playing",
        description: `Now playing: ${playlist.name}`,
        status: "success",
        duration: 2000,
      });

      // Close drawer after selection
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error playing playlist:", error);
      toast({
        title: "Playback Error",
        description: "Could not start playback. Please try again.",
        status: "error",
        duration: 3000,
      });
      setSelectedPlaylist(null);
    }
  }

  return (
    <Box
      position="fixed"
      bottom="280px" // Above player card
      right="16px"
      width="340px"
      maxH="400px"
      bg={cardBg}
      borderRadius="16px"
      boxShadow="0 8px 32px rgba(0,0,0,0.2)"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      zIndex={998}
    >
      {/* Header */}
      <Box
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          Your Playlists
        </Text>
      </Box>

      {/* Playlist List */}
      <Box overflowY="auto" maxH="340px">
        {isLoading ? (
          <VStack py={8} spacing={3}>
            <Spinner size="lg" color="#1DB954" thickness="4px" />
            <Text fontSize="sm" color={secondaryTextColor}>
              Loading playlists...
            </Text>
          </VStack>
        ) : playlists.length === 0 ? (
          <VStack py={8} spacing={3}>
            <Icon as={FaMusic} boxSize={8} color={secondaryTextColor} />
            <Text fontSize="sm" color={secondaryTextColor}>
              No playlists found
            </Text>
          </VStack>
        ) : (
          <VStack spacing={0} align="stretch">
            {playlists.map((playlist) => (
              <Box
                key={playlist.id}
                px={4}
                py={3}
                cursor="pointer"
                bg={selectedPlaylist === playlist.id ? selectedBg : "transparent"}
                _hover={{ bg: hoverBg }}
                onClick={() => handlePlayPlaylist(playlist)}
                transition="background 0.2s"
              >
                <HStack spacing={3}>
                  {playlist.images && playlist.images.length > 0 ? (
                    <Image
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      boxSize="48px"
                      borderRadius="4px"
                      objectFit="cover"
                    />
                  ) : (
                    <Box
                      boxSize="48px"
                      borderRadius="4px"
                      bg="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaMusic} color="gray.400" />
                    </Box>
                  )}
                  <VStack align="start" spacing={0} flex={1}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      noOfLines={1}
                    >
                      {playlist.name}
                    </Text>
                    <Text fontSize="xs" color={secondaryTextColor}>
                      {playlist.tracks.total} tracks
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
