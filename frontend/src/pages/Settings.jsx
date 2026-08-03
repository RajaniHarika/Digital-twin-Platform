import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  Chip,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Brightness4,
  Brightness7,
  NotificationsActive,
  Person,
  VpnKey,
  Logout,
  HelpOutline,
  Schedule,
  Security,
} from '@mui/icons-material';
import authService from '../services/auth';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAppTheme } from '../theme/useAppTheme';
import { palette, radii, shadows } from '../theme/colors';

const getInitials = (name) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U';

const formatLoginTime = (loginTime) => {
  if (!loginTime) return 'Unknown';
  try {
    return new Date(loginTime).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return 'Unknown';
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { mode, toggleTheme } = useThemeContext();
  const { dismissAllNotifications, unreadCount, reloadNotifications } = useNotifications();
  const { tokens, isDark } = useAppTheme();
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  const cardSx = {
    p: 3,
    height: '100%',
    borderRadius: `${radii.xl}px`,
    border: `1px solid ${tokens.border}`,
    bgcolor: tokens.paper,
    boxShadow: tokens.shadowSm,
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: `${radii.xl}px`,
          border: `1px solid ${tokens.border}`,
          background: isDark
            ? `linear-gradient(135deg, ${alpha('#111111', 0.95)} 0%, ${alpha(palette.accent, 0.08)} 100%)`
            : `linear-gradient(135deg, ${palette.background} 0%, ${alpha(palette.accent, 0.12)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: 3,
            background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
          }}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Box>
            <Chip
              label="Console preferences"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 700,
                bgcolor: tokens.accentLight,
                color: palette.accentDark,
                border: `1px solid ${alpha(palette.accent, 0.35)}`,
              }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.03em', mb: 1 }}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7 }}>
              Manage your profile, appearance, notifications, and session preferences for the TwinDigital console.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<HelpOutline />}
              onClick={() => navigate('/help')}
              sx={{ borderRadius: `${radii.pill}px`, px: 3 }}
            >
              Help center
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderRadius: `${radii.pill}px`,
                px: 3,
                bgcolor: isDark ? alpha('#FFFFFF', 0.08) : alpha('#111111', 0.06),
                color: 'text.primary',
                '&:hover': { bgcolor: isDark ? alpha('#FFFFFF', 0.12) : alpha('#111111', 0.1) },
              }}
            >
              Sign out
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} sx={cardSx}>
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: palette.accent,
                  color: '#111111',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>{user?.name || 'User'}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                {user?.role && (
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      mt: 1,
                      height: 24,
                      fontWeight: 700,
                      bgcolor: tokens.accentLight,
                      color: palette.accentDark,
                    }}
                  />
                )}
              </Box>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Person sx={{ color: palette.accentDark, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>Account</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Role-based access is managed by your platform administrator.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Schedule sx={{ color: palette.accentDark, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>Last sign-in</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatLoginTime(user?.loginTime)}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Security sx={{ color: palette.accentDark, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>Session</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rememberMe ? 'Remember me enabled on this device' : 'Session expires when the browser closes'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={cardSx}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: `${radii.lg}px`,
                      bgcolor: tokens.accentLight,
                      display: 'grid',
                      placeItems: 'center',
                      color: palette.accentDark,
                    }}
                  >
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>Appearance</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Switch between light and dark console themes.
                    </Typography>
                    <Chip
                      label={`${mode === 'dark' ? 'Dark' : 'Light'} mode active`}
                      size="small"
                      sx={{ mt: 1, fontWeight: 600, bgcolor: tokens.surface, border: `1px solid ${tokens.border}` }}
                    />
                  </Box>
                </Stack>
                <FormControlLabel
                  control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
                  label={mode === 'dark' ? 'Dark mode' : 'Light mode'}
                  sx={{ m: 0 }}
                />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: `${radii.lg}px`,
                      bgcolor: tokens.accentLight,
                      display: 'grid',
                      placeItems: 'center',
                      color: palette.accentDark,
                    }}
                  >
                    <NotificationsActive />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {unreadCount} unread alert{unreadCount === 1 ? '' : 's'} from cluster monitoring.
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" onClick={reloadNotifications} sx={{ borderRadius: `${radii.lg}px` }}>
                    Refresh
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={dismissAllNotifications}
                    disabled={unreadCount === 0}
                    sx={{ borderRadius: `${radii.lg}px`, boxShadow: shadows.button }}
                  >
                    Clear all
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={cardSx}>
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: `${radii.lg}px`,
                    bgcolor: tokens.accentLight,
                    display: 'grid',
                    placeItems: 'center',
                    color: palette.accentDark,
                  }}
                >
                  <VpnKey />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>API access</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>
                    API key management is not available in this environment. Contact your administrator to provision
                    keys for automation, CI/CD, or external integrations.
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SettingsIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="caption" color="text.secondary">
                  JWT authentication is active for console and API requests.
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
