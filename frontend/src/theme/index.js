import { createTheme } from '@mui/material/styles';
import { colors, darkColors, shadows, radii, palette, layout, transitions } from './colors';

const getTypography = () => ({
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  h1: { fontWeight: 800, fontSize: '3.5rem', lineHeight: 0.92, letterSpacing: '-0.04em' },
  h2: { fontWeight: 800, fontSize: '2.75rem', lineHeight: 0.95, letterSpacing: '-0.04em' },
  h3: { fontWeight: 800, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.03em' },
  h4: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' },
  h5: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.015em' },
  h6: { fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 },
  subtitle1: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.7 },
  subtitle2: { fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.7 },
  body1: { fontWeight: 400, fontSize: '1.0625rem', lineHeight: 1.7 },
  body2: { fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.7 },
  button: { fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', letterSpacing: '0.01em' },
  caption: { fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.6, color: palette.textLabel },
  overline: { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: palette.textLabel },
});

const getComponents = (mode) => {
  const border = mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : palette.border;
  const bgDefault = mode === 'dark' ? '#111111' : palette.background;
  const textPrimary = mode === 'dark' ? '#FCFBF8' : palette.textPrimary;

  return {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollBehavior: 'smooth',
        backgroundColor: bgDefault,
        color: textPrimary,
      },
      p: { lineHeight: 1.7 },
      '#root': { minHeight: '100vh', backgroundColor: bgDefault },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        maxWidth: `${layout.containerMax}px !important`,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: radii.pill,
        padding: '12px 24px',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: transitions.default,
      },
      sizeLarge: {
        padding: '14px 32px',
        fontSize: '1rem',
      },
      contained: {
        backgroundColor: palette.accent,
        color: '#111111',
        boxShadow: shadows.button,
        '&:hover': {
          backgroundColor: palette.accentHover,
          boxShadow: shadows.button,
          transform: 'translateY(-1px)',
        },
      },
      outlined: {
        borderColor: border,
        color: textPrimary,
        borderWidth: '1px',
        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        boxShadow: 'none',
        '&:hover': {
          borderWidth: '1px',
          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : palette.backgroundAlt,
          borderColor: border,
          boxShadow: 'none',
        },
      },
      text: {
        color: textPrimary,
        '&:hover': {
          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(17, 17, 17, 0.03)',
          textDecoration: 'underline',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: `${radii.xl}px`,
        boxShadow: shadows.card,
        border: `1px solid ${border}`,
        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        transition: transitions.default,
        '&:hover': {
          boxShadow: shadows.cardHover,
          transform: 'translateY(-6px)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: `${radii.xl}px`,
        backgroundImage: 'none',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: radii.pill,
        fontWeight: 700,
        letterSpacing: '0.04em',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        backgroundColor: mode === 'dark' ? '#111111' : 'rgba(252, 251, 248, 0.90)',
        backdropFilter: 'blur(14px)',
        color: mode === 'dark' ? '#FCFBF8' : palette.textPrimary,
        borderBottom: `1px solid ${border}`,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: mode === 'dark' ? '#111111' : '#FFFFFF',
        borderRight: `1px solid ${border}`,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: `${radii.lg}px`,
          backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
          color: textPrimary,
          '& fieldset': { borderColor: border },
        },
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        border: `1px solid ${border}`,
        backgroundImage: 'none',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: border,
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: `${radii.md}px`,
        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(17, 17, 17, 0.04)',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: textPrimary,
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      },
    },
  },
};
};

export const createCustomTheme = (mode = 'light') => {
  const themeColors = mode === 'dark' ? darkColors : colors;

  return createTheme({
    palette: {
      mode,
      primary: themeColors.primary,
      secondary: themeColors.secondary,
      success: themeColors.success,
      warning: themeColors.warning,
      error: themeColors.error,
      info: themeColors.info,
      background: themeColors.background,
      text: themeColors.text,
      divider: themeColors.divider,
    },
    typography: getTypography(),
    shape: { borderRadius: radii.lg },
    shadows: ['none', shadows.sm, shadows.md, shadows.lg, shadows.xl, ...Array(20).fill(shadows.lg)],
    components: getComponents(mode),
    spacing: 8,
  });
};

export default createCustomTheme;
