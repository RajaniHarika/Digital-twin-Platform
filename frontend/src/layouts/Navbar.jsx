import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
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
import { useThemeContext } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';
import { useNotifications } from '../contexts/NotificationContext';
import authService from '../services/auth';
import { palette, radii } from '../theme/colors';
import { searchNavItemsForRole, getSearchableNavItemsForRole } from '../utils/navigation';

const NAVBAR_HEIGHT = 72;

const breadcrumbs = {
  '/dashboard': { label: 'Dashboard' },
  '/topology': { label: 'Infrastructure' },
  '/simulation': { label: 'Simulation' },
  '/prediction': { label: 'Prediction' },
  '/risk': { label: 'Risk Analysis' },
  '/cost': { label: 'Cost Analysis' },
  '/history': { label: 'History' },
  '/settings': { label: 'Settings' },
  '/help': { label: 'Help' },
};

const Navbar = () => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const isCompact = useMediaQuery(muiTheme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { mode, toggleTheme } = useThemeContext();
  const { toggle, setMobileOpen } = useSidebar();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser() || { name: 'Guest User', role: '' });

  useEffect(() => {
    const syncUser = () => setCurrentUser(authService.getCurrentUser() || { name: 'Guest User', role: '' });
    syncUser();
    window.addEventListener('auth:changed', syncUser);
    return () => window.removeEventListener('auth:changed', syncUser);
  }, []);

  const allNavItems = useMemo(
    () => getSearchableNavItemsForRole(currentUser.role),
    [currentUser.role]
  );

  const searchResults = useMemo(
    () => searchNavItemsForRole(currentUser.role, searchQuery),
    [currentUser.role, searchQuery]
  );

  const currentBreadcrumb = breadcrumbs[location.pathname] || { label: 'Dashboard' };

  const navigateToResult = (path) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim() || searchResults.length === 0) return;
    navigateToResult(searchResults[0].path);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleMenuClick = () => {
    if (isCompact) setMobileOpen(true);
    else toggle();
  };

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'GU';

  const handleOpenNotifications = (e) => {
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setNotificationAnchorEl(null);
  };

  const searchFieldSx = {
    width: { sm: 260, md: 340 },
    '& .MuiOutlinedInput-root': {
      borderRadius: `${radii.lg}px`,
      bgcolor: isDark ? alpha('#FFFFFF', 0.04) : palette.background,
      color: 'text.primary',
    },
  };

  const renderSearchInput = ({ fullWidth = false } = {}) => (
    <Autocomplete
      size="small"
      options={allNavItems}
      filterOptions={(_, { inputValue }) => searchNavItemsForRole(currentUser.role, inputValue)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.path === value.path}
      inputValue={searchQuery}
      onInputChange={(_, value) => setSearchQuery(value)}
      onChange={(_, value) => {
        if (value) navigateToResult(value.path);
      }}
      noOptionsText="No pages found"
      clearOnBlur={false}
      openOnFocus
      renderInput={(autocompleteParams) => (
        <TextField
          {...autocompleteParams}
          placeholder="Search pages..."
          onKeyDown={handleSearchKeyDown}
          autoFocus={fullWidth}
          InputProps={{
            ...autocompleteParams.InputProps,
            startAdornment: (
              <>
                <Search sx={{ color: 'text.secondary', fontSize: 20, ml: 1, mr: 0.5 }} />
                {autocompleteParams.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={key} {...optionProps}>
            <Box>
              <Typography variant="body2" fontWeight={600}>{option.label}</Typography>
              <Typography variant="caption" color="text.secondary">{option.path}</Typography>
            </Box>
          </Box>
        );
      }}
      sx={fullWidth ? { width: '100%' } : searchFieldSx}
    />
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: NAVBAR_HEIGHT,
        zIndex: () => muiTheme.zIndex.drawer + 1,
        bgcolor: isDark ? alpha('#111111', 0.95) : 'rgba(252, 251, 248, 0.90)',
        backdropFilter: 'blur(14px)',
        color: muiTheme.palette.text.primary,
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: `${NAVBAR_HEIGHT}px !important`, px: { xs: 2, md: 3 } }}>
        <IconButton edge="start" onClick={handleMenuClick} sx={{ mr: 2, color: 'text.primary' }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="caption" 
            onClick={() => navigate('/')}
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 600, 
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' }
            }}
          >
            TWIN DIGITAL
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mx: 0.5 }}>{'>'}</Typography>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {currentBreadcrumb.label}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile ? (
            <IconButton onClick={() => setSearchOpen(true)} sx={{ color: 'text.primary' }} aria-label="search">
              <Search />
            </IconButton>
          ) : (
            renderSearchInput()
          )}

          <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Search console</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                {renderSearchInput({ fullWidth: true })}
              </Box>
            </DialogContent>
          </Dialog>

          <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }} aria-label="toggle theme">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton onClick={handleOpenNotifications} sx={{ color: 'text.primary' }} aria-label="notifications">
            <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
              <Notifications />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleCloseNotifications}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: '70vh',
                mt: 1.5,
                borderRadius: `${radii.lg}px`,
                bgcolor: 'background.paper',
                border: `1px solid ${muiTheme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              },
            }}
            MenuListProps={{
              sx: { p: 0, overflow: 'hidden' },
              disablePadding: true,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: isDark ? alpha('#FFFFFF', 0.03) : alpha('#111111', 0.03),
                borderBottom: `1px solid ${muiTheme.palette.divider}`,
                flexShrink: 0,
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Box
              sx={{
                overflowY: 'auto',
                maxHeight: 'calc(70vh - 64px)',
                overscrollBehavior: 'contain',
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No notifications</Typography>
                </Box>
              ) : (
                notifications.map((item) => (
                  <MenuItem
                    key={item.id}
                    onClick={() => handleNotificationClick(item.id)}
                    sx={{
                      py: 1.5,
                      alignItems: 'flex-start',
                      whiteSpace: 'normal',
                      bgcolor: isRead(item.id) ? 'transparent' : isDark ? alpha(palette.accent, 0.08) : alpha(palette.accent, 0.06),
                      borderBottom: `1px solid ${muiTheme.palette.divider}`,
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" fontWeight={isRead(item.id) ? 500 : 700}>
                          {item.title}
                        </Typography>
                        {!isRead(item.id) && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: palette.accent, flexShrink: 0, mt: 0.5 }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        {item.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                        {item.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Box>
          </Menu>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: palette.accent, color: '#111111', fontWeight: 700, fontSize: 14 }}>
              {getInitials(currentUser.name)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                width: 240,
                mt: 1.5,
                borderRadius: `${radii.lg}px`,
                bgcolor: 'background.paper',
                border: `1px solid ${muiTheme.palette.divider}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>{currentUser.name}</Typography>
              <Typography variant="caption" color="text.secondary">{currentUser.role}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}><AccountCircle sx={{ mr: 1.5 }} /> Profile</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}><Settings sx={{ mr: 1.5 }} /> Settings</MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                authService.logout();
                navigate('/login');
              }}
            >
              <Logout sx={{ mr: 1.5 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
