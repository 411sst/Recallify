import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
  useToast,
  Input,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaListUl,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { open } from "@tauri-apps/api/shell";
import { useSpotifyPlayer } from "../../hooks/useSpotifyPlayer";
import { 
  getSpotifyAuthUrl, 
  getStoredAuth, 
  exchangeCodeForToken,
  checkPremiumStatus,
  saveAuth 
} from "../../services/spotify";
import PlaylistDrawer from "./PlaylistDrawer.tsx";

interface SpotifyPlayerCardProps {
  onClose: () => void;
}

export default function SpotifyPlayerCard({ onClose }: SpotifyPlayerCardProps) {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    deviceId,
    isReady,
    isPaused,
    currentTrack,
    position,
    duration,
    volume,
    isPremium,
    isInitializing,
    initializePlayer,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  } = useSpotifyPlayer();

  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(26, 26, 26, 0.95)");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const progressBg = useColorModeValue("gray.200", "gray.700");
  const progressColor = useColorModeValue("primary.500", "#1DB954");

  // Check for existing auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const auth = await getStoredAuth();
    if (auth) {
      setHasAuth(true);
      // Initialize player if not already initialized
      if (!isReady && !isInitializing) {
        await initializePlayer();
      }
    }
  }

  // Handle Spotify login
  async function handleLogin() {
    setIsAuthenticating(true);
    setError(null);
    const authUrl = getSpotifyAuthUrl();
    
    try {
      // Open Spotify OAuth in user's default browser using Tauri shell API
      await open(authUrl);
      
      // Show manual input option
      setShowManualInput(true);
      
      toast({
        title: "Login in Browser",
        description: "After authorizing, copy the 'code' from the URL and paste it below.",
        status: "info",
        duration: 7000,
      });
    } catch (error) {
      console.error("Failed to open browser:", error);
      setError("Failed to open browser. Please try again.");
      setIsAuthenticating(false);
    }
  }

  // Handle manual code submission
  async function handleManualCodeSubmit() {
    if (!manualCode.trim()) {
      setError("Please enter the authorization code");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Exchange code for tokens
      const tokenData = await exchangeCodeForToken(manualCode.trim());
      
      // Check Premium status
      const isPremium = await checkPremiumStatus();
      
      // Calculate expiry time
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
      
      // Save to database
      await saveAuth(
        tokenData.access_token,
        tokenData.refresh_token,
        expiresAt,
        isPremium
      );

      setHasAuth(true);
      setShowManualInput(false);
      setManualCode("");
      setIsAuthenticating(false);
      
      toast({
        title: "Success!",
        description: "Connected to Spotify. Initializing player...",
        status: "success",
        duration: 3000,
      });
      
      // Initialize player
      await initializePlayer();
    } catch (error) {
      console.error("Failed to process authorization code:", error);
      setError("Failed to authenticate. Make sure you copied the full code from the URL.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Format time (milliseconds to MM:SS)
  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Handle seek
  function handleSeek(value: number) {
    seek(value);
  }

  // Handle volume change
  function handleVolumeChange(value: number) {
    setVolume(value / 100);
  }

  // If not authenticated, show login prompt
  if (!hasAuth) {
    return (
      <Box
        position="fixed"
        bottom="80px"
        right="16px"
        width="340px"
        bg={cardBg}
        borderRadius="16px"
        boxShadow="0 8px 32px rgba(0,0,0,0.2)"
        border="1px solid"
        borderColor={borderColor}
        p={6}
        zIndex={999}
      >
        <IconButton
          aria-label="Close"
          icon={<Icon as={FaTimes} />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={onClose}
          variant="ghost"
        />

        <VStack spacing={4} align="center">
          <Icon as={FaListUl} boxSize={12} color={progressColor} />
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Connect to Spotify
          </Text>
          <Text fontSize="sm" color={secondaryTextColor} textAlign="center">
            Log in with your Spotify account to play music while studying.
          </Text>

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showManualInput ? (
            <>
              <Button
                bg="#1DB954"
                color="white"
                size="lg"
                width="full"
                _hover={{ bg: "#1ED760" }}
                onClick={handleLogin}
                isLoading={isAuthenticating}
              >
                Login with Spotify
              </Button>
              <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
                Requires Spotify Premium
              </Text>
            </>
          ) : (
            <VStack spacing={3} width="full">
              <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
                After authorizing in your browser, copy the long code from the URL (after "code=") and paste it here:
              </Text>
              <Input
                placeholder="Paste authorization code here"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                size="sm"
                fontSize="xs"
              />
              <HStack width="full" spacing={2}>
                <Button
                  bg="#1DB954"
                  color="white"
                  size="sm"
                  flex={1}
                  _hover={{ bg: "#1ED760" }}
                  onClick={handleManualCodeSubmit}
                  isLoading={isProcessing}
                >
                  Submit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowManualInput(false);
                    setManualCode("");
                    setError(null);
                    setIsAuthenticating(false);
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>
    );
  }

  // If not premium, show upgrade message
  if (!isPremium) {
    return (
      <Box
        position="fixed"
        bottom="80px"
        right="16px"
        width="340px"
        bg={cardBg}
        borderRadius="16px"
        boxShadow="0 8px 32px rgba(0,0,0,0.2)"
        border="1px solid"
        borderColor={borderColor}
        p={6}
        zIndex={999}
      >
        <IconButton
          aria-label="Close"
          icon={<Icon as={FaTimes} />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={onClose}
          variant="ghost"
        />

        <VStack spacing={4} align="center">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Premium Required
          </Text>
          <Text fontSize="sm" color={secondaryTextColor} textAlign="center">
            Spotify Premium is required for in-app playback. Please upgrade your Spotify account.
          </Text>
          <Button
            as="a"
            href="https://www.spotify.com/premium/"
            target="_blank"
            bg="#1DB954"
            color="white"
            size="md"
            width="full"
            _hover={{ bg: "#1ED760" }}
          >
            Upgrade to Premium
          </Button>
        </VStack>
      </Box>
    );
  }

  // If initializing, show loading
  if (isInitializing || !isReady) {
    return (
      <Box
        position="fixed"
        bottom="80px"
        right="16px"
        width="340px"
        bg={cardBg}
        borderRadius="16px"
        boxShadow="0 8px 32px rgba(0,0,0,0.2)"
        border="1px solid"
        borderColor={borderColor}
        p={6}
        zIndex={999}
      >
        <IconButton
          aria-label="Close"
          icon={<Icon as={FaTimes} />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={onClose}
          variant="ghost"
        />

        <VStack spacing={4} align="center" py={4}>
          <Spinner size="xl" color={progressColor} thickness="4px" />
          <Text fontSize="md" color={textColor}>
            Connecting to Spotify...
          </Text>
          <Text fontSize="sm" color={secondaryTextColor} textAlign="center">
            Initializing Recallify Player
          </Text>
        </VStack>
      </Box>
    );
  }

  // Minimized view
  if (isMinimized) {
    return (
      <Box
        position="fixed"
        bottom="80px"
        right="16px"
        width="340px"
        bg={cardBg}
        borderRadius="16px"
        boxShadow="0 8px 32px rgba(0,0,0,0.2)"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        zIndex={999}
      >
        <HStack p={3} spacing={3}>
          {currentTrack && (
            <>
              <Image
                src={currentTrack.album.images[0]?.url || "/placeholder-album.png"}
                alt={currentTrack.album.name}
                boxSize="48px"
                borderRadius="8px"
                objectFit="cover"
              />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={1}>
                  {currentTrack.name}
                </Text>
                <Text fontSize="xs" color={secondaryTextColor} noOfLines={1}>
                  {currentTrack.artists.map((a) => a.name).join(", ")}
                </Text>
              </VStack>
            </>
          )}
          <HStack spacing={1}>
            <IconButton
              aria-label={isPaused ? "Play" : "Pause"}
              icon={<Icon as={isPaused ? FaPlay : FaPause} />}
              size="sm"
              variant="ghost"
              onClick={togglePlay}
              color={textColor}
            />
            <IconButton
              aria-label="Expand"
              icon={<Icon as={FaChevronUp} />}
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(false)}
              color={textColor}
            />
            <IconButton
              aria-label="Close"
              icon={<Icon as={FaTimes} />}
              size="sm"
              variant="ghost"
              onClick={onClose}
              color={textColor}
            />
          </HStack>
        </HStack>
      </Box>
    );
  }

  return (
    <>
      <Box
        position="fixed"
        bottom="80px"
        right="16px"
        width="340px"
        bg={cardBg}
        borderRadius="16px"
        boxShadow="0 8px 32px rgba(0,0,0,0.2)"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        zIndex={999}
      >
        {/* Minimize and Close Buttons */}
        <HStack position="absolute" top={2} right={2} spacing={1} zIndex={1}>
          <IconButton
            aria-label="Minimize"
            icon={<Icon as={FaChevronDown} />}
            size="sm"
            onClick={() => setIsMinimized(true)}
            variant="ghost"
          />
          <IconButton
            aria-label="Close"
            icon={<Icon as={FaTimes} />}
            size="sm"
            onClick={onClose}
            variant="ghost"
          />
        </HStack>

        <VStack spacing={0} align="stretch">
          {/* Album Art & Track Info */}
          <Box p={4} pb={3}>
            <HStack spacing={3} align="start">
              {currentTrack ? (
                <>
                  <Image
                    src={currentTrack.album.images[0]?.url || "/placeholder-album.png"}
                    alt={currentTrack.album.name}
                    boxSize="64px"
                    borderRadius="8px"
                    objectFit="cover"
                  />
                  <VStack align="start" spacing={0} flex={1} pr={6}>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={textColor}
                      noOfLines={1}
                    >
                      {currentTrack.name}
                    </Text>
                    <Text fontSize="sm" color={secondaryTextColor} noOfLines={1}>
                      {currentTrack.artists.map((a) => a.name).join(", ")}
                    </Text>
                  </VStack>
                </>
              ) : (
                <VStack align="center" width="full" py={2}>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    No track playing
                  </Text>
                </VStack>
              )}
            </HStack>
          </Box>

          {/* Playback Controls */}
          {currentTrack && (
            <>
              <Box px={4} pb={2}>
                <HStack justify="center" spacing={2}>
                  <IconButton
                    aria-label="Previous"
                    icon={<Icon as={FaStepBackward} />}
                    size="sm"
                    variant="ghost"
                    onClick={previousTrack}
                    color={textColor}
                  />
                  <IconButton
                    aria-label={isPaused ? "Play" : "Pause"}
                    icon={<Icon as={isPaused ? FaPlay : FaPause} />}
                    size="lg"
                    borderRadius="full"
                    bg={progressColor}
                    color="white"
                    _hover={{ bg: "#1ED760" }}
                    onClick={togglePlay}
                  />
                  <IconButton
                    aria-label="Next"
                    icon={<Icon as={FaStepForward} />}
                    size="sm"
                    variant="ghost"
                    onClick={nextTrack}
                    color={textColor}
                  />
                </HStack>
              </Box>

              {/* Progress Bar */}
              <Box px={4} pb={2}>
                <HStack spacing={2} fontSize="xs" color={secondaryTextColor}>
                  <Text>{formatTime(position)}</Text>
                  <Box flex={1}>
                    <Slider
                      value={position}
                      min={0}
                      max={duration}
                      onChange={handleSeek}
                      focusThumbOnChange={false}
                    >
                      <SliderTrack bg={progressBg}>
                        <SliderFilledTrack bg={progressColor} />
                      </SliderTrack>
                      <SliderThumb boxSize={3} />
                    </Slider>
                  </Box>
                  <Text>{formatTime(duration)}</Text>
                </HStack>
              </Box>

              {/* Volume & Playlist Button */}
              <HStack px={4} pb={3} spacing={2}>
                <Icon as={FaVolumeUp} color={secondaryTextColor} boxSize={4} />
                <Slider
                  value={volume * 100}
                  min={0}
                  max={100}
                  onChange={handleVolumeChange}
                  flex={1}
                >
                  <SliderTrack bg={progressBg}>
                    <SliderFilledTrack bg={progressColor} />
                  </SliderTrack>
                  <SliderThumb boxSize={3} />
                </Slider>
              </HStack>
            </>
          )}

          {/* Playlist Button */}
          <Button
            leftIcon={<Icon as={FaListUl} />}
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
            borderTopRadius={0}
            color={textColor}
          >
            {isPlaylistOpen ? "Hide Playlists" : "My Playlists"}
          </Button>
        </VStack>
      </Box>

      {/* Playlist Drawer */}
      {isPlaylistOpen && deviceId && (
        <PlaylistDrawer
          deviceId={deviceId}
          onClose={() => setIsPlaylistOpen(false)}
        />
      )}
    </>
  );
}
