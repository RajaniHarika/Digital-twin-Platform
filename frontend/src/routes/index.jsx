import { lazy } from 'react';
import Dashboard from '../features/dashboard/Dashboard';
import CloudDashboard from '../components/cloud/CloudDashboard';
import authService from '../services/auth';

import { Box, Typography } from '@mui/material';

const ProjectManagerDashboard = () => (
  <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
    <Typography variant="h4">Project Manager Dashboard</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
      This dashboard is currently under construction.
    </Typography>
  </Box>
);

const DashboardRouter = () => {
  const user = authService.getCurrentUser();
  const role = user?.role;
  
  if (role === 'Cloud Engineer') {
    return <CloudDashboard />;
  }
  
  if (role === 'Project Manager') {
    return <ProjectManagerDashboard />;
  }
  
  // Default to DevOps Dashboard for DevOps Engineer and other roles
  return <Dashboard />;
};
const Topology = lazy(() => import('../features/topology/Topology'));
const Simulation = lazy(() => import('../features/simulation/Simulation'));
const Prediction = lazy(() => import('../features/prediction/Prediction'));
const Risk = lazy(() => import('../features/risk/Risk'));
const Cost = lazy(() => import('../features/cost/Cost'));
const History = lazy(() => import('../features/history/History'));

const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));

const routes = [
  {
    path: '/login',
    element: <Login />,
    title: 'Login',
    isPublic: true,
  },
  {
    path: '/',
    element: <DashboardRouter />,
    title: 'Dashboard',
  },
  {
    path: '/topology',
    element: <Topology />,
    title: 'Infrastructure',
  },
  {
    path: '/simulation',
    element: <Simulation />,
    title: 'Simulation',
  },
  {
    path: '/prediction',
    element: <Prediction />,
    title: 'Prediction',
  },
  {
    path: '/risk',
    element: <Risk />,
    title: 'Risk Analysis',
  },
  {
    path: '/cost',
    element: <Cost />,
    title: 'Cost Analysis',
  },
  {
    path: '/history',
    element: <History />,
    title: 'History',
  },
  {
    path: '*',
    element: <NotFound />,
    title: 'Not Found',
  },
];

export default routes;