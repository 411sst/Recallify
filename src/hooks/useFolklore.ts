/**
 * 📚 FOLKLORE CONTENT HOOK
 * Access mythological tales, haikus, prophecies, and yarns
 */

import { useMemo } from 'react';
import folkloreData from '../data/folklore.json';
import { FolkloreTale, PhoenixProphecy, AnansiYarn } from '../types/mythic';
import { useMythicStore } from '../stores/mythicStore';

// ═══════════════════════════════════════════════════════════════
// KITSUNE FOLKLORE
// ═══════════════════════════════════════════════════════════════

export const useKitsuneTales = (): FolkloreTale[] => {
  return useMemo(() => folkloreData.kitsune.tales as FolkloreTale[], []);
};

export const useKitsuneHaiku = (tailCount: number): string => {
  return useMemo(() => {
    const haikus = folkloreData.kitsune.haikus;
    const haiku = haikus.find((h) => h.tailCount === tailCount);
    return haiku?.haiku || haikus[0].haiku;
  }, [tailCount]);
};

export const useKitsuneTailCount = (): number => {
  // Calculate tail count based on current streak
  const currentStreak = 5; // TODO: Get from streak calculation

  // Tail count mapping: 1-6 days = 1 tail, 7-13 = 2 tails, etc.
  // Formula: Math.min(Math.floor(streak / 7) + 1, 9)
  return useMemo(() => {
    return Math.min(Math.floor(currentStreak / 7) + 1, 9);
  }, [currentStreak]);
};

// ═══════════════════════════════════════════════════════════════
// PHOENIX FOLKLORE
// ═══════════════════════════════════════════════════════════════

export const usePhoenixProphecy = (sessionContext?: string): PhoenixProphecy | null => {
  return useMemo(() => {
    const prophecies = folkloreData.phoenix.prophecies;

    if (!sessionContext) {
      // Return default prophecy
      return prophecies.find((p) => p.sessionContext === 'default') as PhoenixProphecy || prophecies[0] as PhoenixProphecy;
    }

    // Try to find context-specific prophecy
    const contextMatch = prophecies.find((p) => p.sessionContext === sessionContext.toLowerCase());
    if (contextMatch) return contextMatch as PhoenixProphecy;

    // Fallback to default
    return prophecies.find((p) => p.sessionContext === 'default') as PhoenixProphecy || prophecies[0] as PhoenixProphecy;
  }, [sessionContext]);
};

export const useRandomPhoenixProphecy = (): PhoenixProphecy => {
  return useMemo(() => {
    const prophecies = folkloreData.phoenix.prophecies;
    const randomIndex = Math.floor(Math.random() * prophecies.length);
    return prophecies[randomIndex] as PhoenixProphecy;
  }, []);
};

// ═══════════════════════════════════════════════════════════════
// ANANSI FOLKLORE
// ═══════════════════════════════════════════════════════════════

export const useRandomAnansiYarn = (difficulty?: 'easy' | 'medium' | 'hard'): AnansiYarn => {
  return useMemo(() => {
    let yarns = folkloreData.anansi.yarns;

    // Filter by difficulty if specified
    if (difficulty) {
      yarns = yarns.filter((y) => y.difficulty === difficulty);
    }

    // Randomize
    const randomIndex = Math.floor(Math.random() * yarns.length);
    return yarns[randomIndex] as AnansiYarn;
  }, [difficulty]);
};

export const useAnansiRewardMessage = (): string => {
  return useMemo(() => {
    const messages = folkloreData.anansi.rewardMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, []);
};

// ═══════════════════════════════════════════════════════════════
// GENERAL MYTHOLOGY
// ═══════════════════════════════════════════════════════════════

export const useRandomMythicQuote = (): string => {
  return useMemo(() => {
    const quotes = folkloreData.general.mythicQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);
};

// ═══════════════════════════════════════════════════════════════
// INTEGRATED HOOKS (with Zustand store)
// ═══════════════════════════════════════════════════════════════

/**
 * Get current active haiku based on user's tail count from store
 */
export const useCurrentKitsuneHaiku = (): { haiku: string; tailCount: number } => {
  const tailCount = useMythicStore((state) => state.kitsune.currentTailCount);
  const haiku = useKitsuneHaiku(tailCount);

  return { haiku, tailCount };
};

/**
 * Get current Anansi yarn from store, or generate new one if none active
 */
export const useCurrentAnansiYarn = (): AnansiYarn | null => {
  const currentYarn = useMythicStore((state) => state.anansi.currentYarn);
  return currentYarn;
};

/**
 * Get current Phoenix prophecy from store
 */
export const useCurrentPhoenixProphecy = (): PhoenixProphecy | null => {
  const currentProphecy = useMythicStore((state) => state.phoenix.currentProphecy);
  return currentProphecy;
};
