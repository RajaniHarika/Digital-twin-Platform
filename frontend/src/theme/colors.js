export const palette = {
  accent: '#3B82F6',
  accentHover: '#2563EB',
  accentLight: '#DBEAFE',
  accentDark: '#081021',
  background: '#FCFBF8',
  backgroundAlt: '#FBFAF7',
  section: '#FFFFFF',
  card: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#565656',
  textMuted: '#8F8F8F',
  textLabel: '#A3A3A3',
  border: 'rgba(17, 17, 17, 0.06)',
  divider: 'rgba(17, 17, 17, 0.06)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const colors = {
  primary: {
    main: palette.accent,
    light: palette.accentLight,
    dark: palette.accentDark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: palette.textPrimary,
    light: palette.textSecondary,
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  success: {
    main: palette.success,
    light: '#4ADE80',
    dark: '#16A34A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: palette.warning,
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#111111',
  },
  error: {
    main: palette.error,
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    main: palette.textSecondary,
    light: palette.textMuted,
    dark: palette.textPrimary,
    contrastText: '#FFFFFF',
  },
  background: {
    default: palette.background,
    paper: palette.card,
  },
  text: {
    primary: palette.textPrimary,
    secondary: palette.textSecondary,
    disabled: palette.textMuted,
  },
  divider: palette.divider,
  border: palette.border,
};

export const darkColors = {
  ...colors,
  background: {
    default: '#111111',
    paper: '#1A1A1A',
  },
  text: {
    primary: '#FCFBF8',
    secondary: '#B0B0B0',
    disabled: '#8F8F8F',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.08)',
};

export const gradients = {
  hero: 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)',
  cta: 'linear-gradient(90deg, #3B82F6, #10B981)',
  subtle: 'linear-gradient(180deg, #FCFBF8 0%, #FFFFFF 100%)',
  cardHover: 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(16,185,129,0.04) 100%)',
  heroGlow: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.03)',
  md: '0 4px 16px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 35px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 50px rgba(0, 0, 0, 0.06)',
  card: '0 10px 35px rgba(0, 0, 0, 0.05)',
  cardHover: '0 20px 50px rgba(0, 0, 0, 0.06)',
  button: '0 10px 28px rgba(59, 130, 246, 0.25)',
  badge: '0 2px 8px rgba(0, 0, 0, 0.04)',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  pill: 999,
};

export const layout = {
  containerMax: 1280,
  sectionPaddingY: { xs: 10, md: 15 },
  cardGap: 4,
  cardPadding: { xs: 4, md: 5 },
};

export const transitions = {
  default: 'all 0.25s ease',
  fast: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const statusColors = {
  healthy: palette.success,
  warning: palette.warning,
  critical: palette.error,
  unknown: palette.textMuted,
};

export const badgeStyle = {
  bgcolor: '#FFFFFF',
  color: palette.textSecondary,
  border: `1px solid ${palette.border}`,
  boxShadow: shadows.badge,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

export const iconCircleStyle = {
  bgcolor: palette.accent,
  color: '#FFFFFF',
  borderRadius: '50%',
};

export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#111111',
  quaternary: '#565656',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const neutrals = {
  track: 'rgba(17, 17, 17, 0.04)',
  border: palette.border,
  borderLight: palette.border,
  hover: palette.backgroundAlt,
  subtle: palette.backgroundAlt,
  muted: palette.textMuted,
  label: palette.textLabel,
  secondary: palette.textSecondary,
  limeTint: palette.accentLight,
};
