import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, VStack, Spinner, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { exchangeCodeForToken, saveAuth, checkPremiumStatus } from "../services/spotify";

export default function SpotifyCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Spotify authentication...");

  const textColor = useColorModeValue("gray.800", "white");
  const successColor = useColorModeValue("green.500", "green.400");
  const errorColor = useColorModeValue("red.500", "red.400");

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // Get authorization code from URL
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      setMessage("Exchanging authorization code...");
      console.log("Authorization code:", code);

      // Exchange code for tokens
      const tokenData = await exchangeCodeForToken(code);
      console.log("Token exchange successful");

      setMessage("Checking Premium status...");

      // Check if user has Premium
      const isPremium = await checkPremiumStatus();
      console.log("Premium status:", isPremium);

      // Calculate expiry time
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

      // Save to database
      await saveAuth(
        tokenData.access_token,
        tokenData.refresh_token,
        expiresAt,
        isPremium
      );

      setStatus("success");
      setMessage(isPremium ? "Successfully connected to Spotify!" : "Connected! Note: Premium required for playback.");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
        // Reload to initialize player
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("OAuth callback error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setStatus("error");
      setMessage(`Failed to authenticate: ${errorMessage}. Copy the code from the URL and try again manually.`);
      setTimeout(() => navigate("/"), 5000);
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("background.main", "#0f0f0f")}
    >
      <VStack spacing={6} p={8}>
        {status === "loading" && (
          <>
            <Spinner size="xl" color="#1DB954" thickness="4px" />
            <Text fontSize="lg" color={textColor} textAlign="center">
              {message}
            </Text>
          </>
        )}

        {status === "success" && (
          <>
            <Icon as={FaCheckCircle} boxSize={16} color={successColor} />
            <Text fontSize="lg" color={textColor} textAlign="center">
              {message}
            </Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              Redirecting...
            </Text>
          </>
        )}

        {status === "error" && (
          <>
            <Icon as={FaTimesCircle} boxSize={16} color={errorColor} />
            <Text fontSize="lg" color={textColor} textAlign="center">
              {message}
            </Text>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
              Redirecting to home...
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
