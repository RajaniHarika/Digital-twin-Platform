import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Brightness4,
  Brightness7,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useThemeContext } from "../contexts/ThemeContext";
import { useSidebar } from '../contexts/SidebarContext';
import authService from '../services/auth';

const NAVBAR_HEIGHT = 64;

const breadcrumbs = {
  '/': { label: 'Dashboard', path: '/' },
  '/topology': { label: 'Infrastructure', path: '/topology' },
  '/simulation': { label: 'Simulation', path: '/simulation' },
  '/prediction': { label: 'Prediction', path: '/prediction' },
  '/risk': { label: 'Risk Analysis', path: '/risk' },
  '/cost': { label: 'Cost Analysis', path: '/cost' },
  '/history': { label: 'History', path: '/history' },
};

const Navbar = () => {
  const muiTheme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const { toggle } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const profileOpen = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const currentUser = authService.getCurrentUser() || { email: '', role: '', name: 'Guest User' };

  const getInitials = (name) => {
    if (!name) return 'GU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    handleMenuClose();
    authService.logout();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const currentBreadcrumb = breadcrumbs[location.pathname] || { label: 'Dashboard', path: '/' };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: NAVBAR_HEIGHT,
        zIndex: () => muiTheme.zIndex.drawer + 1,
        bgcolor: muiTheme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
        color: muiTheme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={toggle}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
            Platform
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
            /
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            {currentBreadcrumb.label}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: 0, sm: 200, md: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: alpha(muiTheme.palette.action.hover, 0.05),
                '&:hover': {
                  bgcolor: alpha(muiTheme.palette.action.hover, 0.08),
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            onClick={toggleTheme}
            sx={{ color: 'text.primary', ml: 1 }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{ color: 'text.primary' }}
            aria-label="notifications"
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 480,
                mt: 1.5,
                borderRadius: 2,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, bgcolor: alpha(muiTheme.palette.primary.main, 0.05) }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Notifications
              </Typography>
            </Box>
            {[1, 2, 3].map((i) => (
              <MenuItem key={i} onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" fontWeight={500}>
                    Notification {i}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This is a sample notification message
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ justifyContent: 'center', py: 1 }}>
              <Typography variant="body2" color="primary">
                View All Notifications
              </Typography>
            </MenuItem>
          </Menu>

          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
            aria-label="profile"
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
              }}
            >
              {getInitials(currentUser.name)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={profileOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5,
                borderRadius: 2,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {currentUser.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;