import { useState } from 'react';
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
  useTheme,
  alpha,
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
} from '@mui/icons-material';
import { useSidebar } from '../contexts/SidebarContext';
import { SIDEBAR_ITEMS } from '../utils/constants';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

const iconMap = {
  Dashboard,
  AccountTree,
  Science,
  Analytics,
  Warning,
  Payments,
  History,
  Settings,
  Help,
};

const Sidebar = () => {
  const theme = useTheme();
  const { isOpen, toggle, setOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const drawerWidth = isOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
      open={isOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {isOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountTree sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary">
                  TwinDigital
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  DevOps Platform
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={toggle} sx={{ ml: 'auto' }}>
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: isOpen ? 2 : 1, py: 2 }}>
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: active
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.08),
                  },
                  '& .MuiListItemIcon-root': {
                    color: active ? 'primary.main' : 'text.secondary',
                  },
                  '& .MuiTypography-root': {
                    fontWeight: active ? 600 : 400,
                    color: active ? 'primary.main' : 'text.primary',
                  },
                  justifyContent: isOpen ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2 : 0,
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {isOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List sx={{ px: isOpen ? 2 : 1, py: 2 }}>
        {[
          { path: '/settings', icon: 'Settings', label: 'Settings' },
          { path: '/help', icon: 'Help', label: 'Help' },
        ].map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: active
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.08),
                  },
                  '& .MuiListItemIcon-root': {
                    color: active ? 'primary.main' : 'text.secondary',
                  },
                  justifyContent: isOpen ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2 : 0,
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {isOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;