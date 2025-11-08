/**
 * 🎨 MYTHIC THEME CONFIGURATIONS
 * Comprehensive color palettes for each mythical creature theme
 */

import type { MythicTheme, ThemeColors } from '../types/mythic';

// ═══════════════════════════════════════════════════════════════
// THEME COLOR PALETTES
// ═══════════════════════════════════════════════════════════════

export const MYTHIC_THEME_COLORS: Record<MythicTheme, ThemeColors> = {
  // 🌿 DEFAULT THEME (Green) - Original Recallify colors
  default: {
    primary: '#005108',
    secondary: '#1EA896',
    accent: '#F59E0B',
    glow: '#1EA896',

    light: {
      background: '#FBFFF1',
      cardBg: '#FFFFFF',
      cardHover: '#F0FDF4',
      border: '#E5E7EB',
      text: {
        primary: '#0A122A',
        secondary: '#2F2F2F',
        tertiary: '#6B6B6B',
      },
      sidebar: {
        bg: '#FFFFFF',
        hover: '#F9FAFB',
        active: '#005108',
        activeText: '#FFFFFF',
        text: '#2F2F2F',
      },
      input: {
        bg: '#FFFFFF',
        border: '#E5E7EB',
        borderFocus: '#005108',
      },
      button: {
        primaryBg: '#005108',
        primaryText: '#FFFFFF',
        primaryHover: '#004106',
        secondaryBorder: '#005108',
        secondaryHover: '#F0FDF4',
      },
    },

    dark: {
      background: '#0A122A',
      cardBg: '#1F2937',
      cardHover: '#374151',
      border: '#374151',
      text: {
        primary: '#FBFFF1',
        secondary: '#D1D5DB',
        tertiary: '#9CA3AF',
      },
      sidebar: {
        bg: '#1F2937',
        hover: '#374151',
        active: '#1EA896',
        activeText: '#FFFFFF',
        text: '#D1D5DB',
      },
      input: {
        bg: '#374151',
        border: '#4B5563',
        borderFocus: '#1EA896',
      },
      button: {
        primaryBg: '#1EA896',
        primaryText: '#FFFFFF',
        primaryHover: '#188577',
        secondaryBorder: '#1EA896',
        secondaryHover: '#374151',
      },
    },

    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    },

    heatmap: {
      none: '#EBEDF0',
      low: '#9BE9A8',
      medium: '#40C463',
      high: '#005108',
    },
  },

  // 🦊 KITSUNE AUTUMN THEME (Orange)
  'kitsune-autumn': {
    primary: '#B45309',
    secondary: '#DC6803',
    accent: '#F59E0B',
    glow: '#D97706',

    light: {
      background: '#FDF4F3',
      cardBg: '#FFFFFF',
      cardHover: '#FFF7ED',
      border: '#FCD34D',
      text: {
        primary: '#451A03',
        secondary: '#92400E',
        tertiary: '#D97706',
      },
      sidebar: {
        bg: '#FEF3C7',
        hover: '#FCD34D',
        active: '#B45309',
        activeText: '#FFFFFF',
        text: '#92400E',
      },
      input: {
        bg: '#FFFFFF',
        border: '#FCD34D',
        borderFocus: '#B45309',
      },
      button: {
        primaryBg: '#B45309',
        primaryText: '#FFFFFF',
        primaryHover: '#92400E',
        secondaryBorder: '#B45309',
        secondaryHover: '#FCD34D',
      },
    },

    dark: {
      background: '#1F1A14',
      cardBg: '#2D2820',
      cardHover: '#3D362A',
      border: '#FCD34D',
      text: {
        primary: '#FCD34D',
        secondary: '#EAB308',
        tertiary: '#92400E',
      },
      sidebar: {
        bg: '#2D2820',
        hover: '#3D362A',
        active: '#D97706',
        activeText: '#FFFFFF',
        text: '#EAB308',
      },
      input: {
        bg: '#3D362A',
        border: '#FCD34D',
        borderFocus: '#B45309',
      },
      button: {
        primaryBg: '#FCD34D',
        primaryText: '#451A03',
        primaryHover: '#EAB308',
        secondaryBorder: '#FCD34D',
        secondaryHover: '#92400E',
      },
    },

    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    },

    heatmap: {
      none: '#FEF3C7',
      low: '#FDE68A',
      medium: '#FCD34D',
      high: '#B45309',
    },
  },

  // 🔥 PHOENIX INFERNO THEME (Red)
  'phoenix-inferno': {
    primary: '#B91C1C',
    secondary: '#EF4444',
    accent: '#F97316',
    glow: '#DC2626',

    light: {
      background: '#FEF7F6',
      cardBg: '#FFFFFF',
      cardHover: '#FEE2E2',
      border: '#F87171',
      text: {
        primary: '#7F1D1D',
        secondary: '#991B1B',
        tertiary: '#B91C1C',
      },
      sidebar: {
        bg: '#FEE2E2',
        hover: '#FECACA',
        active: '#B91C1C',
        activeText: '#FFFFFF',
        text: '#991B1B',
      },
      input: {
        bg: '#FFFFFF',
        border: '#F87171',
        borderFocus: '#B91C1C',
      },
      button: {
        primaryBg: '#B91C1C',
        primaryText: '#FFFFFF',
        primaryHover: '#991B1B',
        secondaryBorder: '#B91C1C',
        secondaryHover: '#FECACA',
      },
    },

    dark: {
      background: '#1E1818',
      cardBg: '#2D1E1E',
      cardHover: '#3D2626',
      border: '#F87171',
      text: {
        primary: '#FECACA',
        secondary: '#F87171',
        tertiary: '#EF4444',
      },
      sidebar: {
        bg: '#2D1E1E',
        hover: '#3D2626',
        active: '#DC2626',
        activeText: '#FFFFFF',
        text: '#F87171',
      },
      input: {
        bg: '#3D2626',
        border: '#F87171',
        borderFocus: '#B91C1C',
      },
      button: {
        primaryBg: '#FECACA',
        primaryText: '#7F1D1D',
        primaryHover: '#F87171',
        secondaryBorder: '#FECACA',
        secondaryHover: '#EF4444',
      },
    },

    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    },

    heatmap: {
      none: '#FEE2E2',
      low: '#FECACA',
      medium: '#F87171',
      high: '#B91C1C',
    },
  },

  // 🕷️ ANANSI TWILIGHT THEME (Purple)
  'anansi-twilight': {
    primary: '#6D28D9',
    secondary: '#A78BFA',
    accent: '#8B5CF6',
    glow: '#7C3AED',

    light: {
      background: '#FCFCFF',
      cardBg: '#FFFFFF',
      cardHover: '#F3F4FF',
      border: '#C4B5FD',
      text: {
        primary: '#3730A3',
        secondary: '#6366F1',
        tertiary: '#8B5CF6',
      },
      sidebar: {
        bg: '#F3F4FF',
        hover: '#EDE9FE',
        active: '#6D28D9',
        activeText: '#FFFFFF',
        text: '#6366F1',
      },
      input: {
        bg: '#FFFFFF',
        border: '#C4B5FD',
        borderFocus: '#6D28D9',
      },
      button: {
        primaryBg: '#6D28D9',
        primaryText: '#FFFFFF',
        primaryHover: '#5B21B6',
        secondaryBorder: '#6D28D9',
        secondaryHover: '#EDE9FE',
      },
    },

    dark: {
      background: '#1E1B2A',
      cardBg: '#2D293D',
      cardHover: '#3D394D',
      border: '#C4B5FD',
      text: {
        primary: '#EDE9FE',
        secondary: '#C4B5FD',
        tertiary: '#A78BFA',
      },
      sidebar: {
        bg: '#2D293D',
        hover: '#3D394D',
        active: '#7C3AED',
        activeText: '#FFFFFF',
        text: '#C4B5FD',
      },
      input: {
        bg: '#3D394D',
        border: '#C4B5FD',
        borderFocus: '#6D28D9',
      },
      button: {
        primaryBg: '#EDE9FE',
        primaryText: '#3730A3',
        primaryHover: '#C4B5FD',
        secondaryBorder: '#EDE9FE',
        secondaryHover: '#A78BFA',
      },
    },

    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    },

    heatmap: {
      none: '#F3F4FF',
      low: '#EDE9FE',
      medium: '#C4B5FD',
      high: '#6D28D9',
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// APPLY THEME FUNCTION
// ═══════════════════════════════════════════════════════════════

/**
 * Apply theme dynamically by setting CSS variables
 * This makes ALL components use the theme colors
 */
export function applyMythicTheme(themeName: MythicTheme, isDarkMode: boolean = false): void {
  const root = document.documentElement;
  const colors = MYTHIC_THEME_COLORS[themeName];
  const mode = isDarkMode ? colors.dark : colors.light;

  // Set brand colors
  root.style.setProperty('--mythic-primary', colors.primary);
  root.style.setProperty('--mythic-secondary', colors.secondary);
  root.style.setProperty('--mythic-accent', colors.accent);
  root.style.setProperty('--mythic-glow', colors.glow);

  // Set mode-specific colors (light or dark)
  root.style.setProperty('--theme-background', mode.background);
  root.style.setProperty('--theme-card-bg', mode.cardBg);
  root.style.setProperty('--theme-card-hover', mode.cardHover);
  root.style.setProperty('--theme-border', mode.border);

  // Text colors
  root.style.setProperty('--theme-text-primary', mode.text.primary);
  root.style.setProperty('--theme-text-secondary', mode.text.secondary);
  root.style.setProperty('--theme-text-tertiary', mode.text.tertiary);

  // Sidebar colors
  root.style.setProperty('--theme-sidebar-bg', mode.sidebar.bg);
  root.style.setProperty('--theme-sidebar-hover', mode.sidebar.hover);
  root.style.setProperty('--theme-sidebar-active', mode.sidebar.active);
  root.style.setProperty('--theme-sidebar-active-text', mode.sidebar.activeText);
  root.style.setProperty('--theme-sidebar-text', mode.sidebar.text);

  // Input colors
  root.style.setProperty('--theme-input-bg', mode.input.bg);
  root.style.setProperty('--theme-input-border', mode.input.border);
  root.style.setProperty('--theme-input-border-focus', mode.input.borderFocus);

  // Button colors
  root.style.setProperty('--theme-button-primary-bg', mode.button.primaryBg);
  root.style.setProperty('--theme-button-primary-text', mode.button.primaryText);
  root.style.setProperty('--theme-button-primary-hover', mode.button.primaryHover);
  root.style.setProperty('--theme-button-secondary-border', mode.button.secondaryBorder);
  root.style.setProperty('--theme-button-secondary-hover', mode.button.secondaryHover);

  // Status colors (same for light/dark)
  root.style.setProperty('--theme-status-success', colors.status.success);
  root.style.setProperty('--theme-status-warning', colors.status.warning);
  root.style.setProperty('--theme-status-error', colors.status.error);
  root.style.setProperty('--theme-status-info', colors.status.info);

  // Heatmap colors
  root.style.setProperty('--theme-heatmap-none', colors.heatmap.none);
  root.style.setProperty('--theme-heatmap-low', colors.heatmap.low);
  root.style.setProperty('--theme-heatmap-medium', colors.heatmap.medium);
  root.style.setProperty('--theme-heatmap-high', colors.heatmap.high);

  // Legacy primary color shades (for backwards compatibility)
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

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

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
