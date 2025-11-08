/**
 * 🌟 MYTHIC MODE TYPE DEFINITIONS
 * Folklore features for the "Legends Awakened" saga
 */

// ═══════════════════════════════════════════════════════════════
// MYTHIC MODE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface MythicSettings {
  // Global mythic mode toggle
  enabled: boolean;

  // Individual feature toggles
  features: {
    kitsuneSidebar: boolean;      // 🦊 Fox-fire sidebar transformations
    phoenixLoaders: boolean;       // 🔥 Rebirth prophecy loading screens
    anansiWeb: boolean;            // 🕷️ Spider-yarn pomodoro interruptions
    bansheeNotifications: boolean; // 👻 Ghostly streak-loss warnings
    djinnParticles: boolean;       // 🧞 Mystical particle effects
  };

  // Performance settings
  performance: {
    animationQuality: 'high' | 'medium' | 'low';  // FPS scaling
    particlesEnabled: boolean;                     // Particle effects toggle
    audioEnabled: boolean;                         // Mythic audio toggle
  };

  // Accessibility
  accessibility: {
    reducedMotion: boolean;        // Honor prefers-reduced-motion
    muteAudio: boolean;            // Silent mode
    highContrast: boolean;         // Increase visibility
  };
}

// Default settings
export const DEFAULT_MYTHIC_SETTINGS: MythicSettings = {
  enabled: false,  // Opt-in by default
  features: {
    kitsuneSidebar: true,
    phoenixLoaders: true,
    anansiWeb: true,
    bansheeNotifications: true,
    djinnParticles: true,
  },
  performance: {
    animationQuality: 'high',
    particlesEnabled: true,
    audioEnabled: true,
  },
  accessibility: {
    reducedMotion: false,
    muteAudio: false,
    highContrast: false,
  },
};

// ═══════════════════════════════════════════════════════════════
// FOLKLORE CONTENT TYPES
// ═══════════════════════════════════════════════════════════════

export interface FolkloreTale {
  id: string;
  title: string;
  culture: 'celtic' | 'norse' | 'african' | 'japanese' | 'greek' | 'native-american' | 'arabian';
  content: string;           // 50-100 word snippet
  theme: string[];           // Tags: wisdom, memory, patience, etc.
  tone: 'playful' | 'mysterious' | 'inspiring' | 'challenging';
}

export interface KitsuneTail {
  tailCount: number;         // 1-9 based on streak
  haiku: string;             // Fox-fable haiku hint
  foxFireColor: string;      // Hex color for preview glow
  pagePreview: string;       // Page name being previewed
}

export interface PhoenixProphecy {
  prophecy: string;          // Flickering flame fortune
  sessionContext: string;    // 'math', 'history', etc.
  flameColor: string;        // Session-scented color
  rebirthMessage: string;    // Completion message
}

export interface AnansiYarn {
  id: string;
  riddle: string;            // The yarn/distraction
  correctAnswer: string;     // Correct response
  wrongAnswers: string[];    // Snare options (2-3)
  reward: string;            // Trickster thread message
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BansheeWarning {
  id: string;
  message: string;           // Mournful warning message
  severity: 'whisper' | 'wail' | 'scream';  // Urgency level
  daysUntilLoss: number;     // Days until streak breaks
  ghostlyColor: string;      // Ethereal color scheme
  wailSound?: string;        // Audio file path
}

export interface DjinnWish {
  id: string;
  wishType: 'milestone' | 'achievement' | 'streak' | 'study';
  particleColor: string;     // Smoke wisp color
  animation: 'grant' | 'deny' | 'pending';
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// MYTHIC STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export interface MythicState {
  // Current active myth
  activeMythFeature: 'kitsune' | 'phoenix' | 'anansi' | 'banshee' | 'djinn' | null;

  // Kitsune state
  kitsune: {
    currentTailCount: number;
    unlockedHaikus: string[];
  };

  // Phoenix state
  phoenix: {
    rebornCount: number;      // Times user completed prophecies
    currentProphecy: PhoenixProphecy | null;
  };

  // Anansi state
  anansi: {
    yarnsSpun: number;        // Completed yarns
    tricksterThreads: number; // Reward currency
    currentYarn: AnansiYarn | null;
  };

  // Banshee state
  banshee: {
    warningsShown: number;    // Total warnings displayed
    lastWarningDate: string | null;  // ISO date string
    streaksSaved: number;     // Times user acted on warning
  };

  // Djinn state
  djinn: {
    wishesGranted: number;    // Milestone celebrations
    particlesActive: boolean; // Global particle toggle
    cursorTrailEnabled: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════

export type MythicFeature = keyof MythicSettings['features'];

export interface MythicEvent {
  type: 'feature_enabled' | 'feature_disabled' | 'myth_completed' | 'settings_changed';
  feature?: MythicFeature;
  timestamp: Date;
  data?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════════════════

export type MythicTheme = 'default' | 'kitsune-autumn' | 'phoenix-inferno' | 'anansi-twilight';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  glow: string;
}

// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENT BADGES
// ═══════════════════════════════════════════════════════════════

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;              // Emoji or icon identifier
  rarity: BadgeRarity;
  unlockCondition: string;   // Human-readable
  unlocked: boolean;
  unlockedAt?: string;       // ISO date string
  category: 'streak' | 'study' | 'pomodoro' | 'milestone' | 'secret';
  mythCreature?: 'kitsune' | 'phoenix' | 'anansi' | 'banshee' | 'djinn';
}
