import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import authService from '../services/auth';
import { useSidebar } from '../contexts/SidebarContext';
import routes from '../routes';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 80;
const NAVBAR_HEIGHT = 72;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isOpen } = useSidebar();
  const hideLayout = shouldHideLayout(location.pathname);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const drawerWidth = isOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  useEffect(() => {
    if (sessionStorage.getItem('loginSuccessSnackbar') === 'true') {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUserName(currentUser.name);
        setSnackbarOpen(true);
      }
      sessionStorage.removeItem('loginSuccessSnackbar');
    }
  }, [location.pathname]);

  if (hideLayout) {
    return <Box sx={{ minHeight: '100vh', width: '100vw' }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 2 },
          width: { xs: '100%', lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: 0 },
          mt: 9,
          transition: 'width 0.3s ease',
          bgcolor: (theme) => theme.palette.background.default,
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        {children}
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: 7 }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          Welcome back, {userName}! Signed in successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

function shouldHideLayout(pathname) {
  const exact = routes.find((r) => r.path === pathname);
  if (exact?.hideLayout) return true;
  if (pathname === '/' || pathname === '/login') return true;
  return false;
}

export default AppLayout;
