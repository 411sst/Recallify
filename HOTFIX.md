# QUICK HOTFIX FOR WHITE SCREEN

## The Problem
The new mythic features are breaking the app load. Most likely the badge system initialization.

## Quick Fix Options:

### Option 1: Disable Mythic Mode Temporarily
In `src/stores/mythicStore.ts`, change line 40 (DEFAULT_MYTHIC_SETTINGS):
```typescript
enabled: false,  // Change to false temporarily
```

### Option 2: Check Console Errors
Open DevTools (F12) and look for errors. Common ones:
- "Cannot read property of undefined"
- "Failed to parse JSON"
- Import/module errors

### Option 3: Clear localStorage
In DevTools Console, run:
```javascript
localStorage.clear()
location.reload()
```

This clears saved mythic state that might be corrupted.

### Option 4: Rollback to Working Version
```bash
git checkout f5ecb5e
npm run tauri:dev
```

This goes back to before Phases 5-11 (just trinity + bug fixes).
