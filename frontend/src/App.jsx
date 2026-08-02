import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import AppLayout from './layouts/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { PageSkeleton } from './components/LoadingSkeleton';
import routes from './routes';
import authService from './services/auth';

// Initialize session state on app load
authService.init();

const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ children }) => {
  return !authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const AppContent = () => {
  const { theme } = useThemeContext();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarProvider>
        <AppLayout>
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      route.isPublic ? (
                        <PublicRoute>{route.element}</PublicRoute>
                      ) : (
                        <ProtectedRoute>{route.element}</ProtectedRoute>
                      )
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AppLayout>
      </SidebarProvider>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;