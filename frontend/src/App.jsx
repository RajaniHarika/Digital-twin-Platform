import { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppLayout from './layouts/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { PageSkeleton } from './components/LoadingSkeleton';
import routes from './routes';
import authService from './services/auth';
import { pageTransition } from './theme/motion';

authService.init();

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authService.isAuthenticated()) {
        if (active) {
          setAuthed(false);
          setChecking(false);
        }
        return;
      }
      const ok = await authService.verifyToken();
      if (active) {
        setAuthed(ok);
        setChecking(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (checking) return <PageSkeleton />;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authService.isAuthenticated()) {
        if (active) {
          setRedirect(null);
          setChecking(false);
        }
        return;
      }
      const ok = await authService.verifyToken();
      if (active) {
        setRedirect(ok ? '/dashboard' : null);
        setChecking(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (checking) return <PageSkeleton />;
  if (redirect) return <Navigate to={redirect} replace />;
  return children;
};

const RoleRoute = ({ children, path }) => {
  const user = authService.getCurrentUser();
  if (!authService.canAccessRoute(path, user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const RouteElement = ({ route }) => {
  if (route.noAuth) return route.element;
  if (route.isPublic) return <PublicRoute>{route.element}</PublicRoute>;
  return (
    <ProtectedRoute>
      <RoleRoute path={route.path}>{route.element}</RoleRoute>
    </ProtectedRoute>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <motion.div
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              style={{ minHeight: '100%' }}
            >
              <RouteElement route={route} />
            </motion.div>
          }
        />
      ))}
    </Routes>
  );
};

const AppContent = () => {
  const { theme } = useThemeContext();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarProvider>
        <NotificationProvider>
          <AppLayout>
            <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRoutes />
              </Suspense>
            </ErrorBoundary>
          </AppLayout>
        </NotificationProvider>
      </SidebarProvider>
    </MuiThemeProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
