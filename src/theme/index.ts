export const THEME = {
  colors: {
    // Primary Brand & Accents
    primary: '#10B981', // Emerald Green (Recycling)
    primaryLight: '#34D399',
    primaryDark: '#059669',
    primarySoft: 'rgba(16, 185, 129, 0.12)',
    primaryGlow: 'rgba(16, 185, 129, 0.25)',

    // Gold / Amber Accent for Pro/Subscription/VIP
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    accentSoft: 'rgba(245, 158, 11, 0.12)',

    // Cyan / Tech accents
    cyan: '#06B6D4',
    cyanSoft: 'rgba(6, 182, 212, 0.12)',

    // Dark Industrial Backgrounds
    background: '#0B1120', // Deep Obsidian Slate
    surface: '#131D31',
    surfaceCard: '#1E293B',
    surfaceElevated: '#283548',
    surfaceBorder: '#334155',
    surfaceBorderHighlight: '#475569',

    // Status Colors
    success: '#10B981',
    successSoft: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorSoft: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoSoft: 'rgba(59, 130, 246, 0.15)',

    // Typography
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0B1120',

    // Overlay
    backdrop: 'rgba(11, 17, 32, 0.85)',
    cardGradients: {
      emerald: ['#10B981', '#047857'],
      gold: ['#F59E0B', '#B45309'],
      dark: ['#1E293B', '#0F172A'],
      slate: ['#283548', '#1E293B'],
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    }
  }
};
