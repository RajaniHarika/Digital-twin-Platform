import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Toolbar,
  Divider,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  AccountTree,
  Science,
  Analytics,
  Warning,
  Payments,
  History,
  Settings,
  Help,
  Hub,
} from '@mui/icons-material';
import { useSidebar } from '../contexts/SidebarContext';
import authService from '../services/auth';
import { BOTTOM_NAV_ITEMS, getSidebarItemsForRole } from '../utils/navigation';
import { palette, shadows, radii } from '../theme/colors';
import { useAppTheme } from '../theme/useAppTheme';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 80;

const iconMap = { Dashboard, AccountTree, Science, Analytics, Warning, Payments, History, Settings, Help };

const Sidebar = () => {
  const { tokens, theme } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { isOpen, toggle, mobileOpen, setMobileOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const drawerWidth = isOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const syncUser = () => setUser(authService.getCurrentUser());
    syncUser();
    window.addEventListener('auth:changed', syncUser);
    return () => window.removeEventListener('auth:changed', syncUser);
  }, []);

  const navItems = getSidebarItemsForRole(user?.role);

  const isActive = (path) =>
    path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const navButtonSx = (active) => ({
    borderRadius: `${radii.lg}px`,
    py: 1.4,
    px: isOpen ? 2 : 1.5,
    justifyContent: isOpen ? 'flex-start' : 'center',
    bgcolor: active ? 'rgba(199, 255, 58, 0.14)' : 'transparent',
    '&:hover': {
      bgcolor: active ? 'rgba(199, 255, 58, 0.18)' : tokens.surfaceHover,
    },
    '& .MuiListItemIcon-root': {
      color: active ? palette.accentDark : tokens.textMuted,
      minWidth: isOpen ? 40 : 0,
      justifyContent: 'center',
    },
  });

  const drawerContent = (
    <>
      <Toolbar sx={{ px: isOpen ? 2.5 : 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {isOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: palette.accent,
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: shadows.button,
                  overflow: 'hidden',
                }}
              >
                <img src="/logo.png" alt="TwinDigital Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: tokens.text, lineHeight: 1.1 }}>
                  TwinDigital
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.textMuted }}>
                  Console
                </Typography>
              </Box>
            </Box>
          )}
          {!isMobile && (
            <IconButton onClick={toggle} sx={{ ml: 'auto' }}>
              {isOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {isOpen && user?.role && (
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Chip
            label={user.role}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.6875rem',
              fontWeight: 700,
              bgcolor: 'rgba(199, 255, 58, 0.12)',
              color: palette.accentDark,
              border: `1px solid rgba(199, 255, 58, 0.28)`,
            }}
          />
        </Box>
      )}

      <Divider />

      <List sx={{ px: isOpen ? 2 : 1, py: 2 }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => handleNavigate(item.path)} selected={active} sx={navButtonSx(active)}>
                <ListItemIcon><Icon sx={{ fontSize: 22 }} /></ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      color: active ? tokens.text : tokens.textSecondary,
                      fontSize: '0.9375rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List sx={{ px: isOpen ? 2 : 1, py: 2 }}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => handleNavigate(item.path)} selected={active} sx={navButtonSx(active)}>
                <ListItemIcon><Icon sx={{ fontSize: 22 }} /></ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      color: active ? tokens.text : tokens.textSecondary,
                      fontSize: '0.9375rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={() => setMobileOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? DRAWER_WIDTH : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? DRAWER_WIDTH : drawerWidth,
          boxSizing: 'border-box',
          bgcolor: tokens.paper,
          borderRight: `1px solid ${tokens.border}`,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          boxShadow: shadows.sm,
          top: 72,
          height: 'calc(100% - 72px)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
