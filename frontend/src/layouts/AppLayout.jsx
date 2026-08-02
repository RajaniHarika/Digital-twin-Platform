import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import authService from '../services/auth';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userName, setUserName] = useState('');

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

  if (isLoginPage) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100vw' }}>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', lg: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)` },
          mt: 8,
          transition: 'width 0.3s ease, margin 0.3s ease',
          bgcolor: (theme) => theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>

      {/* Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          Welcome back, {userName}! Signed in successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppLayout;