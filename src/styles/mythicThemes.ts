/**
 * 🎨 MYTHIC THEME CONFIGURATIONS
 * Custom color palettes for each mythical creature
 */

import { extendTheme, type ThemeOverride } from '@chakra-ui/react';
import type { MythicTheme, ThemeColors } from '../types/mythic';

// Theme color palettes
export const MYTHIC_THEME_COLORS: Record<MythicTheme, ThemeColors> = {
  default: {
    primary: '#005108',
    secondary: '#1EA896',
    accent: '#F59E0B',
    background: '#FBFFF1',
    text: '#0A122A',
    glow: '#1EA896',
  },
  'kitsune-autumn': {
    primary: '#D97706',      // Warm orange
    secondary: '#DC2626',    // Fox-fire red
    accent: '#F59E0B',       // Amber
    background: '#FEF3C7',   // Pale autumn
    text: '#78350F',         // Deep brown
    glow: '#FF6B35',         // Fox-fire glow
  },
  'phoenix-inferno': {
    primary: '#DC2626',      // Flame red
    secondary: '#F59E0B',    // Phoenix gold
    accent: '#FF6B35',       // Ember orange
    background: '#FEF2F2',   // Pale flame
    text: '#7C2D12',         // Ash brown
    glow: '#F39C12',         // Golden glow
  },
  'anansi-twilight': {
    primary: '#7C3AED',      // Twilight purple
    secondary: '#6366F1',    // Indigo web
    accent: '#8B5CF6',       // Violet
    background: '#F5F3FF',   // Pale twilight
    text: '#4C1D95',         // Deep purple
    glow: '#A78BFA',         // Web glow
  },
};

/**
 * Generate Chakra UI theme override based on mythic theme
 */
export function getMythicThemeOverride(mythicTheme: MythicTheme): ThemeOverride {
  const colors = MYTHIC_THEME_COLORS[mythicTheme];

  return {
    colors: {
      primary: {
        50: lighten(colors.primary, 0.4),
        100: lighten(colors.primary, 0.3),
        200: lighten(colors.primary, 0.2),
        300: lighten(colors.primary, 0.1),
        400: lighten(colors.primary, 0.05),
        500: colors.primary,
        600: darken(colors.primary, 0.1),
        700: darken(colors.primary, 0.2),
        800: darken(colors.primary, 0.3),
        900: darken(colors.primary, 0.4),
      },
      teal: {
        500: colors.secondary,
        600: darken(colors.secondary, 0.1),
        700: darken(colors.secondary, 0.2),
      },
      background: {
        main: colors.background,
        card: lighten(colors.background, 0.5),
      },
    },
    styles: {
      global: {
        body: {
          '--mythic-glow': colors.glow,
        },
      },
    },
  };
}

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
