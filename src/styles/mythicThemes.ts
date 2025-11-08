/**
 * 🎨 MYTHIC THEME CONFIGURATIONS
 * Custom color palettes for each mythical creature
 */

import type { MythicTheme, ThemeColors } from '../types/mythic';

// Theme color palettes
export const MYTHIC_THEME_COLORS: Record<MythicTheme, ThemeColors> = {
  default: {
    primary: '#005108',    // Dark green (main brand color)
    secondary: '#1EA896',  // Teal (accent color)
    accent: '#F59E0B',     // Orange/Amber (highlights)
    background: '#FBFFF1', // Off-white cream
    text: '#0A122A',       // Dark navy
    glow: '#1EA896',       // Teal glow effects
  },
  'kitsune-autumn': {
    primary: '#B45309',    // Burnt sienna (deep autumn anchor)
    secondary: '#DC6803',  // Amber glow (leaf-litter lift)
    accent: '#F59E0B',     // Goldenrod spark (fox-fire flickers)
    background: '#FDF4F3', // Warm peach cream (hazy harvest hush)
    text: '#451A03',       // Rich walnut (storyteller's shadow)
    glow: '#D97706',       // Kitsune ember (tail-tip tease)
  },
  'phoenix-inferno': {
    primary: '#B91C1C',    // Crimson core (flame-heart fury)
    secondary: '#EF4444',  // Scarlet surge (wing-wake warmth)
    accent: '#F97316',     // Ember orange (rebirth's bold burst)
    background: '#FEF7F6', // Blush ash (smoldering serenity)
    text: '#1F2937',       // Charcoal forge (ancient anvil etch)
    glow: '#DC2626',       // Phoenix blaze (talon-trail torch)
  },
  'anansi-twilight': {
    primary: '#6D28D9',    // Deep indigo (spider-silk spine)
    secondary: '#A78BFA',  // Lavender loom (dusk-dew drift)
    accent: '#8B5CF6',     // Plum pulse (yarn-yank yarn)
    background: '#FCFCFF', // Moon-mist pearl (twilight's tender veil)
    text: '#1E1B4B',       // Midnight mulberry (weaver's whisper)
    glow: '#7C3AED',       // Anansi aura (web-weft wonder)
  },
};

/**
 * Lighten a hex color by percentage
 */
function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

/**
 * Darken a hex color by percentage
 */
function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (
    0x1000000 +
    (R > 0 ? R : 0) * 0x10000 +
    (G > 0 ? G : 0) * 0x100 +
    (B > 0 ? B : 0)
  ).toString(16).slice(1);
}

/**
 * Apply theme dynamically
 */
export function applyMythicTheme(themeName: MythicTheme): void {
  const root = document.documentElement;
  const colors = MYTHIC_THEME_COLORS[themeName];

  // Set main colors
  root.style.setProperty('--mythic-primary', colors.primary);
  root.style.setProperty('--mythic-secondary', colors.secondary);
  root.style.setProperty('--mythic-accent', colors.accent);
  root.style.setProperty('--mythic-glow', colors.glow);

  // Set color gradients for primary shades (50-900)
  root.style.setProperty('--mythic-primary-50', lighten(colors.primary, 0.4));
  root.style.setProperty('--mythic-primary-100', lighten(colors.primary, 0.3));
  root.style.setProperty('--mythic-primary-200', lighten(colors.primary, 0.2));
  root.style.setProperty('--mythic-primary-300', lighten(colors.primary, 0.1));
  root.style.setProperty('--mythic-primary-400', lighten(colors.primary, 0.05));
  root.style.setProperty('--mythic-primary-600', darken(colors.primary, 0.1));
  root.style.setProperty('--mythic-primary-700', darken(colors.primary, 0.2));
  root.style.setProperty('--mythic-primary-800', darken(colors.primary, 0.3));
  root.style.setProperty('--mythic-primary-900', darken(colors.primary, 0.4));
}
