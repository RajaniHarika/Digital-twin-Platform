import { useTheme, alpha } from '@mui/material/styles';
import { palette, shadows, radii, transitions } from './colors';

export function useAppTheme() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tokens = {
    bg: theme.palette.background.default,
    paper: theme.palette.background.paper,
    text: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    textMuted: isDark ? '#8F8F8F' : palette.textMuted,
    textLabel: isDark ? '#9CA3AF' : palette.textLabel,
    border: theme.palette.divider,
    surface: isDark ? alpha('#FFFFFF', 0.04) : alpha('#111111', 0.04),
    surfaceHover: isDark ? alpha('#FFFFFF', 0.06) : palette.backgroundAlt,
    surfaceMuted: isDark ? alpha('#FFFFFF', 0.03) : '#FCFBF8',
    accent: palette.accent,
    accentLight: isDark ? alpha(palette.accent, 0.14) : palette.accentLight,
    accentDark: palette.accentDark,
    shadow: isDark ? '0 10px 35px rgba(0, 0, 0, 0.45)' : shadows.card,
    shadowHover: isDark ? '0 20px 50px rgba(0, 0, 0, 0.55)' : shadows.cardHover,
    shadowSm: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : shadows.sm,
    chartGrid: isDark ? alpha('#FFFFFF', 0.06) : alpha('#111111', 0.04),
    tooltipBg: isDark ? '#1A1A1A' : '#FFFFFF',
    radii,
    transitions,
  };

  return { theme, isDark, tokens };
}

export default useAppTheme;
