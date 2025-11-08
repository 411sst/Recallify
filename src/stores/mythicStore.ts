/**
 * 🌟 MYTHIC MODE STATE MANAGEMENT
 * Global Zustand store for folklore features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MythicSettings, MythicState, DEFAULT_MYTHIC_SETTINGS, AnansiYarn, PhoenixProphecy } from '../types/mythic';

interface MythicStore extends MythicSettings, MythicState {
  // ═══════════════════════════════════════════════════════════════
  // SETTINGS ACTIONS
  // ═══════════════════════════════════════════════════════════════

  toggleMythicMode: () => void;
  toggleFeature: (feature: keyof MythicSettings['features']) => void;
  updatePerformance: (settings: Partial<MythicSettings['performance']>) => void;
  updateAccessibility: (settings: Partial<MythicSettings['accessibility']>) => void;

  // ═══════════════════════════════════════════════════════════════
  // KITSUNE ACTIONS
  // ═══════════════════════════════════════════════════════════════

  updateKitsuneTailCount: (count: number) => void;
  unlockHaiku: (haiku: string) => void;

  // ═══════════════════════════════════════════════════════════════
  // PHOENIX ACTIONS
  // ═══════════════════════════════════════════════════════════════

  setPhoenixProphecy: (prophecy: PhoenixProphecy | null) => void;
  incrementRebornCount: () => void;

  // ═══════════════════════════════════════════════════════════════
  // ANANSI ACTIONS
  // ═══════════════════════════════════════════════════════════════

  setCurrentYarn: (yarn: AnansiYarn | null) => void;
  completeYarn: () => void;
  addTricksterThread: (amount?: number) => void;

  // ═══════════════════════════════════════════════════════════════
  // UTILITY ACTIONS
  // ═══════════════════════════════════════════════════════════════

  resetMythicState: () => void;
}

// Check if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useMythicStore = create<MythicStore>()(
  persist(
    (set, get) => ({
      // ═══════════════════════════════════════════════════════════════
      // INITIAL STATE
      // ═══════════════════════════════════════════════════════════════

      ...DEFAULT_MYTHIC_SETTINGS,

      // Mythic state
      activeMythFeature: null,

      kitsune: {
        currentTailCount: 1,
        unlockedHaikus: [],
      },

      phoenix: {
        rebornCount: 0,
        currentProphecy: null,
      },

      anansi: {
        yarnsSpun: 0,
        tricksterThreads: 0,
        currentYarn: null,
      },

      // ═══════════════════════════════════════════════════════════════
      // SETTINGS ACTIONS
      // ═══════════════════════════════════════════════════════════════

      toggleMythicMode: () => {
        set((state) => ({ enabled: !state.enabled }));
      },

      toggleFeature: (feature) => {
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        }));
      },

      updatePerformance: (settings) => {
        set((state) => ({
          performance: {
            ...state.performance,
            ...settings,
          },
        }));
      },

      updateAccessibility: (settings) => {
        set((state) => {
          const newAccessibility = {
            ...state.accessibility,
            ...settings,
          };

          // Auto-detect reduced motion preference
          if (settings.reducedMotion === undefined) {
            newAccessibility.reducedMotion = prefersReducedMotion();
          }

          return {
            accessibility: newAccessibility,
          };
        });
      },

      // ═══════════════════════════════════════════════════════════════
      // KITSUNE ACTIONS
      // ═══════════════════════════════════════════════════════════════

      updateKitsuneTailCount: (count) => {
        const clampedCount = Math.max(1, Math.min(9, count));
        set((state) => ({
          kitsune: {
            ...state.kitsune,
            currentTailCount: clampedCount,
          },
        }));
      },

      unlockHaiku: (haiku) => {
        set((state) => {
          const haikus = state.kitsune.unlockedHaikus;
          if (haikus.includes(haiku)) return state;

          return {
            kitsune: {
              ...state.kitsune,
              unlockedHaikus: [...haikus, haiku],
            },
          };
        });
      },

      // ═══════════════════════════════════════════════════════════════
      // PHOENIX ACTIONS
      // ═══════════════════════════════════════════════════════════════

      setPhoenixProphecy: (prophecy) => {
        set((state) => ({
          phoenix: {
            ...state.phoenix,
            currentProphecy: prophecy,
          },
        }));
      },

      incrementRebornCount: () => {
        set((state) => ({
          phoenix: {
            ...state.phoenix,
            rebornCount: state.phoenix.rebornCount + 1,
          },
        }));
      },

      // ═══════════════════════════════════════════════════════════════
      // ANANSI ACTIONS
      // ═══════════════════════════════════════════════════════════════

      setCurrentYarn: (yarn) => {
        set((state) => ({
          anansi: {
            ...state.anansi,
            currentYarn: yarn,
          },
        }));
      },

      completeYarn: () => {
        set((state) => ({
          anansi: {
            ...state.anansi,
            yarnsSpun: state.anansi.yarnsSpun + 1,
            currentYarn: null,
          },
        }));
      },

      addTricksterThread: (amount = 1) => {
        set((state) => ({
          anansi: {
            ...state.anansi,
            tricksterThreads: state.anansi.tricksterThreads + amount,
          },
        }));
      },

      // ═══════════════════════════════════════════════════════════════
      // UTILITY ACTIONS
      // ═══════════════════════════════════════════════════════════════

      resetMythicState: () => {
        set({
          ...DEFAULT_MYTHIC_SETTINGS,
          activeMythFeature: null,
          kitsune: {
            currentTailCount: 1,
            unlockedHaikus: [],
          },
          phoenix: {
            rebornCount: 0,
            currentProphecy: null,
          },
          anansi: {
            yarnsSpun: 0,
            tricksterThreads: 0,
            currentYarn: null,
          },
        });
      },
    }),
    {
      name: 'recallify-mythic-storage',
      version: 1,
    }
  )
);

// ═══════════════════════════════════════════════════════════════
// CONVENIENCE HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if mythic mode is enabled AND specific feature is active
 */
export const useIsMythicFeatureActive = (feature: keyof MythicSettings['features']): boolean => {
  const enabled = useMythicStore((state) => state.enabled);
  const featureEnabled = useMythicStore((state) => state.features[feature]);
  const reducedMotion = useMythicStore((state) => state.accessibility.reducedMotion);

  // Respect reduced motion preference
  if (reducedMotion && (feature === 'kitsuneSidebar' || feature === 'phoenixLoaders')) {
    return false;
  }

  return enabled && featureEnabled;
};

/**
 * Get animation quality setting (for FPS capping)
 */
export const useAnimationQuality = (): 'high' | 'medium' | 'low' => {
  return useMythicStore((state) => state.performance.animationQuality);
};

/**
 * Check if particles should be rendered
 */
export const useShouldRenderParticles = (): boolean => {
  const enabled = useMythicStore((state) => state.enabled);
  const particlesEnabled = useMythicStore((state) => state.performance.particlesEnabled);
  const reducedMotion = useMythicStore((state) => state.accessibility.reducedMotion);

  return enabled && particlesEnabled && !reducedMotion;
};
