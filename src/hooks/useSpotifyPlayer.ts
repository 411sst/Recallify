import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import {
  getValidAccessToken,
  checkPremiumStatus,
  transferPlayback,
  updateDeviceId,
  savePlaybackState,
  resumePlayback,
  getStoredAuth,
} from "../services/spotify";

// Spotify Web Playback SDK types
declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (data: any) => void): void;
    removeListener(event: string): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: TrackWindow;
    context: {
      uri: string | null;
    };
  }

  interface TrackWindow {
    current_track: Track;
    previous_tracks: Track[];
    next_tracks: Track[];
  }

  interface Track {
    uri: string;
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: Album;
    duration_ms: number;
  }

  interface Album {
    name: string;
    images: Array<{ url: string }>;
  }

  interface PlayerInit {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume: number;
  }

  interface Error {
    message: string;
  }

  interface Ready {
    device_id: string;
  }
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: Spotify.PlayerInit) => Spotify.Player;
    };
  }
}

interface SpotifyTrack {
  uri: string;
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
}

interface SpotifyState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: SpotifyTrack;
    previous_tracks: SpotifyTrack[];
    next_tracks: SpotifyTrack[];
  };
  context: {
    uri: string | null;
  };
}

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [contextUri, setContextUri] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const toast = useToast();
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize player when SDK is ready
  const initializePlayer = useCallback(async () => {
    if (isInitializing || player) return;

    setIsInitializing(true);

    try {
      const token = await getValidAccessToken();

      if (!token) {
        throw new Error("No valid Spotify token");
      }

      // Check premium status
      const premium = await checkPremiumStatus();
      setIsPremium(premium);

      if (!premium) {
        toast({
          title: "Spotify Premium Required",
          description: "In-app playback requires Spotify Premium subscription.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setIsInitializing(false);
        return;
      }

      // Check if SDK is loaded
      if (!window.Spotify) {
        console.log("Waiting for Spotify SDK to load...");
        // Wait up to 10 seconds for SDK to load
        let attempts = 0;
        while (!window.Spotify && attempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
        
        if (!window.Spotify) {
          throw new Error("Spotify SDK failed to load. Please check your internet connection.");
        }
      }

      const spotifyPlayer = new window.Spotify.Player({
        name: "Recallify Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: volume,
      });

      // Error handling
      spotifyPlayer.addListener("initialization_error", ({ message }: Spotify.Error) => {
        console.error("Initialization error:", message);
        toast({
          title: "Spotify Error",
          description: message,
          status: "error",
          duration: 3000,
        });
      });

      spotifyPlayer.addListener("authentication_error", ({ message }: Spotify.Error) => {
        console.error("Authentication error:", message);
        toast({
          title: "Authentication Error",
          description: "Please log in to Spotify again.",
          status: "error",
          duration: 3000,
        });
      });

      spotifyPlayer.addListener("account_error", ({ message }: Spotify.Error) => {
        console.error("Account error:", message);
        toast({
          title: "Account Error",
          description: message,
          status: "error",
          duration: 3000,
        });
      });

      spotifyPlayer.addListener("playback_error", ({ message }: Spotify.Error) => {
        console.error("Playback error:", message);
      });

      // Ready
      spotifyPlayer.addListener("ready", async ({ device_id }: Spotify.Ready) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
        await updateDeviceId(device_id);
        await transferPlayback(device_id);

        // Try to resume last playback state
        const auth = await getStoredAuth();
        if (auth && auth.lastTrackUri) {
          try {
            await resumePlayback(device_id, auth.lastTrackUri, auth.lastPositionMs);
          } catch (error) {
            console.log("Could not resume last track, showing playlists");
          }
        }

        toast({
          title: "Spotify Connected",
          description: "Ready to play music!",
          status: "success",
          duration: 2000,
        });
      });

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }: Spotify.Ready) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      // Player state changed
      spotifyPlayer.addListener("player_state_changed", (state: SpotifyState | null) => {
        if (!state) {
          setIsActive(false);
          return;
        }

        setIsActive(true);
        setIsPaused(state.paused);
        setCurrentTrack(state.track_window.current_track);
        setPosition(state.position);
        setDuration(state.duration);
        setContextUri(state.context.uri);

        // Save playback state periodically
        if (!state.paused) {
          savePlaybackState(
            state.context.uri,
            state.track_window.current_track.uri,
            state.position
          );
        }
      });

      // Connect to the player with timeout
      const connectPromise = spotifyPlayer.connect();
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), 15000)
      );

      const connected = await Promise.race([connectPromise, timeoutPromise]);

      if (connected) {
        setPlayer(spotifyPlayer);
        console.log("Successfully connected to Spotify!");
      } else {
        throw new Error("Failed to connect to Spotify player");
      }
    } catch (error) {
      console.error("Error initializing player:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not connect to Spotify";
      toast({
        title: "Connection Error",
        description: errorMessage + ". Please try logging out and back in.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, player, volume, toast]);

  // Set up SDK ready callback
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Web Playback SDK is ready");
    };
  }, []);

  // Update position while playing
  useEffect(() => {
    if (!isPaused && isActive) {
      progressIntervalRef.current = setInterval(() => {
        setPosition((prev) => Math.min(prev + 1000, duration));
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, isActive, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  // Control functions
  const togglePlay = useCallback(async () => {
    if (!player) return;
    await player.togglePlay();
  }, [player]);

  const nextTrack = useCallback(async () => {
    if (!player) return;
    await player.nextTrack();
  }, [player]);

  const previousTrack = useCallback(async () => {
    if (!player) return;
    await player.previousTrack();
  }, [player]);

  const seek = useCallback(
    async (positionMs: number) => {
      if (!player) return;
      await player.seek(positionMs);
      setPosition(positionMs);
    },
    [player]
  );

  const setPlayerVolume = useCallback(
    async (vol: number) => {
      if (!player) return;
      await player.setVolume(vol);
      setVolume(vol);
    },
    [player]
  );

  return {
    player,
    deviceId,
    isReady,
    isActive,
    isPaused,
    currentTrack,
    position,
    duration,
    volume,
    contextUri,
    isPremium,
    isInitializing,
    initializePlayer,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume: setPlayerVolume,
  };
}
