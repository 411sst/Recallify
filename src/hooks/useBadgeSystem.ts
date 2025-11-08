/**
 * 🏆 BADGE SYSTEM HOOK
 * Initialize and manage achievement badges
 */

import { useEffect } from 'react';
import { useMythicStore } from '../stores/mythicStore';
import badgeData from '../data/badges.json';
import type { Badge } from '../types/mythic';

/**
 * Initialize badge system on app load
 */
export function useBadgeInitialization() {
  const { badges } = useMythicStore();

  useEffect(() => {
    // Initialize badges from JSON if store is empty
    if (badges.length === 0) {
      // Load badges from data file with proper typing
      const initialBadges = badgeData.badges.map((badge) => ({
        ...badge,
        unlocked: false,
        unlockedAt: undefined,
      })) as Badge[];

      // Update store (we need to add a setBadges action)
      // For now, badges will be initialized in the store default state
    }
  }, [badges]);
}

/**
 * Check and unlock badges based on current stats
 */
export function useAutoBadgeUnlock() {
  // This will check conditions and auto-unlock badges
  // Will be called after relevant actions (create entry, complete pomodoro, etc.)

  const checkBadgeConditions = async () => {
    // TODO: Implement badge condition checking
    // Example:
    // - Check if user created first entry → unlock "first-steps"
    // - Check if user has 7-day streak → unlock "week-warrior"
    // etc.
  };

  return { checkBadgeConditions };
}
