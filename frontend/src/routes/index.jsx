import { lazy } from 'react';
import DashboardRouter from '../features/role-dashboards/DashboardRouter';

const Landing = lazy(() => import('../pages/Landing'));
const Topology = lazy(() => import('../features/topology/Topology'));
const Simulation = lazy(() => import('../features/simulation/Simulation'));
const Prediction = lazy(() => import('../features/prediction/Prediction'));
const Risk = lazy(() => import('../features/risk/Risk'));
const Cost = lazy(() => import('../features/cost/Cost'));
const History = lazy(() => import('../features/history/History'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Settings = lazy(() => import('../pages/Settings'));
const Help = lazy(() => import('../pages/Help'));

const routes = [
  { path: '/', element: <Landing />, title: 'Home', isPublic: true, hideLayout: true },
  { path: '/login', element: <Login />, title: 'Login', isPublic: true, hideLayout: true },
  { path: '/dashboard', element: <DashboardRouter />, title: 'Dashboard' },
  { path: '/topology', element: <Topology />, title: 'Infrastructure' },
  { path: '/simulation', element: <Simulation />, title: 'Simulation' },
  { path: '/prediction', element: <Prediction />, title: 'Prediction' },
  { path: '/risk', element: <Risk />, title: 'Risk Analysis' },
  { path: '/cost', element: <Cost />, title: 'Cost Analysis' },
  { path: '/history', element: <History />, title: 'History' },
  { path: '/settings', element: <Settings />, title: 'Settings' },
  { path: '/help', element: <Help />, title: 'Help' },
  { path: '*', element: <NotFound />, title: 'Not Found', hideLayout: true, noAuth: true },
];

export default routes;
