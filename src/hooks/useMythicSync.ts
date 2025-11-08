/**
 * 🔄 MYTHIC MODE SYNC HOOK
 * Synchronizes mythic state with database (streaks, etc.)
 */

import { useEffect } from 'react';
import { useMythicStore } from '../stores/mythicStore';
import { calculateStreaks } from '../services/database';

/**
 * Hook to sync Kitsune tail count with current streak
 * Call this in App.tsx to keep tail count updated
 */
export function useSyncKitsuneTails() {
  const { enabled, updateKitsuneTailCount } = useMythicStore();

  useEffect(() => {
    if (!enabled) return;

    const syncTailCount = async () => {
      try {
        const streaks = await calculateStreaks();
        const currentStreak = streaks.currentStreak || 0;

        // Tail count mapping: 1-6 days = 1 tail, 7-13 = 2 tails, etc.
        // Formula: Math.min(Math.floor(streak / 7) + 1, 9)
        const tailCount = Math.min(Math.floor(currentStreak / 7) + 1, 9);

        updateKitsuneTailCount(tailCount);
      } catch (error) {
        console.error('Failed to sync Kitsune tail count:', error);
        // Default to 1 tail on error
        updateKitsuneTailCount(1);
      }
    };

    // Initial sync
    syncTailCount();

    // Sync every 5 minutes
    const interval = setInterval(syncTailCount, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, updateKitsuneTailCount]);
}

/**
 * Master sync hook - call this once in App.tsx
 */
export function useMythicSync() {
  useSyncKitsuneTails();
  // Add more sync hooks here as we add Phoenix/Anansi features
}
