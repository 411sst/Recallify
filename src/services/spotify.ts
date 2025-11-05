import { invoke } from "@tauri-apps/api/tauri";

// IMPORTANT: Set these in your .env file
// Get credentials from: https://developer.spotify.com/dashboard
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "";
// Use a hosted callback page for production, or localhost for dev
// In production, users will copy the code manually from the callback page
const REDIRECT_URI = import.meta.env.DEV 
  ? "http://localhost:1420/spotify-callback"
  : "https://recallify-spotify-callback.netlify.app/";

// Scopes needed for playback and playlist access
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export interface SpotifyAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  deviceId: string | null;
  lastPlaylistUri: string | null;
  lastTrackUri: string | null;
  lastPositionMs: number;
  isPremium: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  uri: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  uri: string;
}

// Get authorization URL for OAuth flow
export function getSpotifyAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return await response.json();
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return await response.json();
}

// Check if token is expired and refresh if needed
export async function getValidAccessToken(): Promise<string | null> {
  try {
    const auth = await invoke<SpotifyAuth | null>("spotify_get_auth");
    
    if (!auth) {
      return null;
    }

    // Check if token is expired (with 5-minute buffer)
    const expiresAt = new Date(auth.expiresAt);
    const now = new Date();
    const bufferMs = 5 * 60 * 1000; // 5 minutes

    if (now.getTime() + bufferMs >= expiresAt.getTime()) {
      // Token expired or about to expire, refresh it
      const { access_token, expires_in } = await refreshAccessToken(auth.refreshToken);
      
      const newExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
      
      await invoke("spotify_save_auth", {
        accessToken: access_token,
        refreshToken: auth.refreshToken,
        expiresAt: newExpiresAt,
        isPremium: auth.isPremium,
      });

      return access_token;
    }

    return auth.accessToken;
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

// Fetch user's playlists
export async function fetchUserPlaylists(): Promise<SpotifyPlaylist[]> {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error("No valid Spotify token");
  }

  const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await response.json();
  return data.items;
}

// Check if user has Spotify Premium
export async function checkPremiumStatus(): Promise<boolean> {
  const token = await getValidAccessToken();
  
  if (!token) {
    return false;
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const user = await response.json();
  return user.product === "premium";
}

// Play a specific playlist
export async function playPlaylist(playlistUri: string, deviceId: string): Promise<void> {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error("No valid Spotify token");
  }

  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      context_uri: playlistUri,
    }),
  });
}

// Resume playback
export async function resumePlayback(deviceId: string, trackUri?: string, positionMs?: number): Promise<void> {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error("No valid Spotify token");
  }

  const body: any = {};
  
  if (trackUri) {
    body.uris = [trackUri];
  }
  
  if (positionMs !== undefined) {
    body.position_ms = positionMs;
  }

  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Transfer playback to device
export async function transferPlayback(deviceId: string): Promise<void> {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error("No valid Spotify token");
  }

  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false,
    }),
  });
}

// Save current playback state to database
export async function savePlaybackState(
  playlistUri: string | null,
  trackUri: string | null,
  positionMs: number
): Promise<void> {
  await invoke("spotify_save_playback_state", {
    playlistUri,
    trackUri,
    positionMs,
  });
}

// Get stored auth data
export async function getStoredAuth(): Promise<SpotifyAuth | null> {
  return await invoke("spotify_get_auth");
}

// Save auth data
export async function saveAuth(
  accessToken: string,
  refreshToken: string,
  expiresAt: string,
  isPremium: boolean
): Promise<void> {
  await invoke("spotify_save_auth", {
    accessToken,
    refreshToken,
    expiresAt,
    isPremium: isPremium ? 1 : 0,
  });
}

// Update device ID
export async function updateDeviceId(deviceId: string): Promise<void> {
  await invoke("spotify_update_device", { deviceId });
}

// Logout (clear auth data)
export async function logout(): Promise<void> {
  await invoke("spotify_logout");
}
