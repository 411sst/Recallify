# 🚨 IMPORTANT: Update Spotify Redirect URI

## Action Required in Spotify Dashboard

The correct redirect URI is actually:
```
http://127.0.0.1:1420/spotify-callback
```

**NOT** `http://127.0.0.1:5173/spotify-callback` (this was incorrect)

---

## Steps to Update:

1. **Go to** [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Click** on your Recallify app
3. **Click** "Settings" button (top-right)
4. **Scroll down** to "Redirect URIs"
5. **Remove** the old URI: `http://127.0.0.1:5173/spotify-callback`
6. **Add** the new URI: `http://127.0.0.1:1420/spotify-callback`
7. **Click** "Save" at the bottom

---

## Why This Change?

Tauri's default Vite dev server runs on port **1420**, not 5173. The redirect URI in your Spotify app MUST exactly match the URL that your app is running on.

---

## What Was Fixed:

✅ Updated `vite.config.ts` to use `127.0.0.1` instead of `localhost`  
✅ Updated `spotify.ts` redirect URI from port 5173 → 1420  
✅ Fixed TypeScript import errors in `SpotifyButton.tsx` and `SpotifyPlayerCard.tsx`

---

## After Updating in Spotify Dashboard:

Your app should be accessible at: **`http://127.0.0.1:1420`**

The Spotify OAuth flow will now work correctly! 🎉
