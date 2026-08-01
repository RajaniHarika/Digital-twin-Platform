import { Box, Typography, Paper, Stack, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import { Settings as SettingsIcon, Brightness4, NotificationsActive } from '@mui/icons-material';
import authService from '../services/auth';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

const Settings = () => {
  const user = authService.getCurrentUser();
  const { mode, toggleTheme } = useThemeContext();
  const { markAllAsRead, unreadCount } = useNotifications();

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your TwinDigital console preferences.
      </Typography>
      <Stack spacing={2}>
        <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <SettingsIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Profile & account</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {user?.name} · {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Role: {user?.role}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <NotificationsActive color="primary" fontSize="small" />
              <Box>
                <Typography fontWeight={600}>Notifications</Typography>
                <Typography variant="caption" color="text.secondary">
                  {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                </Typography>
              </Box>
            </Stack>
            <Button size="small" variant="outlined" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark all read
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Brightness4 color="primary" fontSize="small" />
              <Box>
                <Typography fontWeight={600}>Theme preferences</Typography>
                <Typography variant="caption" color="text.secondary">
                  Currently using {mode} mode
                </Typography>
              </Box>
            </Stack>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label={mode === 'dark' ? 'Dark' : 'Light'}
            />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
          <Typography fontWeight={600}>API keys</Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            API key management is disabled in the demo environment. Contact an administrator to provision keys.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Settings;
