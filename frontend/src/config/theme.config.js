/**
 * Design System - Color Palette and Theme Configuration
 * Consistent colors across light and dark modes
 */

export const COLORS = {
  // Primary Colors
  primary: {
    light: '#6366f1',    // Indigo
    dark: '#818cf8',     // Lighter indigo for dark mode
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary Colors (Blue)
  secondary: {
    light: '#3b82f6',    // Blue
    dark: '#60a5fa',     // Lighter blue for dark mode
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Accent Colors (Cyan/Teal)
  accent: {
    light: '#06b6d4',    // Cyan
    dark: '#22d3ee',     // Light cyan for dark mode
    50: '#ecf8fb',
    100: '#cff9f7',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Success
  success: {
    light: '#10b981',
    dark: '#34d399',
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  // Warning
  warning: {
    light: '#f59e0b',
    dark: '#fbbf24',
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Error/Danger
  error: {
    light: '#ef4444',
    dark: '#f87171',
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Neutral/Grayscale
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Dark mode backgrounds
  darkBg: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    primary: '#1f2937',      // Main dark bg
    secondary: '#111827',    // Darker bg
    tertiary: '#030712',     // Darkest bg
  },

  // Light mode backgrounds
  lightBg: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
};

/**
 * Semantic color tokens - use these in components
 */
export const SEMANTIC_COLORS = {
  light: {
    // Backgrounds
    background: {
      primary: COLORS.lightBg.primary,
      secondary: COLORS.lightBg.secondary,
      tertiary: COLORS.lightBg.tertiary,
    },
    // Text
    text: {
      primary: COLORS.neutral[900],
      secondary: COLORS.neutral[600],
      tertiary: COLORS.neutral[500],
      inverse: COLORS.neutral[50],
    },
    // Borders
    border: {
      light: COLORS.neutral[200],
      medium: COLORS.neutral[300],
      dark: COLORS.neutral[400],
    },
    // Interactive
    interactive: {
      primary: COLORS.primary[600],
      primaryHover: COLORS.primary[700],
      primaryActive: COLORS.primary[800],
      secondary: COLORS.secondary[500],
      secondaryHover: COLORS.secondary[600],
    },
    // Status
    status: {
      success: COLORS.success[600],
      warning: COLORS.warning[600],
      error: COLORS.error[600],
      info: COLORS.primary[600],
    },
  },

  dark: {
    // Backgrounds
    background: {
      primary: COLORS.darkBg.primary,
      secondary: COLORS.darkBg.secondary,
      tertiary: COLORS.darkBg.tertiary,
    },
    // Text
    text: {
      primary: COLORS.neutral[50],
      secondary: COLORS.neutral[400],
      tertiary: COLORS.neutral[500],
      inverse: COLORS.neutral[900],
    },
    // Borders
    border: {
      light: COLORS.neutral[700],
      medium: COLORS.neutral[600],
      dark: COLORS.neutral[500],
    },
    // Interactive
    interactive: {
      primary: COLORS.primary[500],
      primaryHover: COLORS.primary[400],
      primaryActive: COLORS.primary[300],
      secondary: COLORS.secondary[400],
      secondaryHover: COLORS.secondary[300],
    },
    // Status
    status: {
      success: COLORS.success[400],
      warning: COLORS.warning[400],
      error: COLORS.error[400],
      info: COLORS.primary[400],
    },
  },
};

/**
 * Get color based on current theme
 * Usage: getThemeColor('text.primary', 'light')
 */
export const getThemeColor = (path, theme = 'light') => {
  const colors = SEMANTIC_COLORS[theme];
  return path.split('.').reduce((obj, key) => obj?.[key], colors);
};

/**
 * Tailwind utility classes for consistent styling
 */
export const THEME_CLASSES = {
  light: {
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    bgTertiary: 'bg-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
  },
  dark: {
    bg: 'dark:bg-gray-900',
    bgSecondary: 'dark:bg-gray-800',
    bgTertiary: 'dark:bg-gray-700',
    text: 'dark:text-white',
    textSecondary: 'dark:text-gray-400',
    border: 'dark:border-gray-700',
  },
};

// Tailwind config for color palette
export const TAILWIND_COLORS = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  accent: COLORS.accent,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  neutral: COLORS.neutral,
};
