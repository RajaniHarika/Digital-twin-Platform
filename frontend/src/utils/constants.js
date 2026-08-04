export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  TOPOLOGY: '/topology',
  SIMULATION: '/simulation',
  PREDICTION: '/prediction',
  RISK: '/risk',
  COST: '/cost',
  HISTORY: '/history',
  LOGIN: '/login',
};

export const SIDEBAR_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
  { path: ROUTES.TOPOLOGY, label: 'Infrastructure', icon: 'AccountTree' },
  { path: ROUTES.SIMULATION, label: 'Simulation', icon: 'Science' },
  { path: ROUTES.PREDICTION, label: 'Prediction', icon: 'Analytics' },
  { path: ROUTES.RISK, label: 'Risk Analysis', icon: 'Warning' },
  { path: ROUTES.COST, label: 'Cost Analysis', icon: 'Payments' },
  { path: ROUTES.HISTORY, label: 'History', icon: 'History' },
];

export const STATUS_COLORS = {
  healthy: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
  unknown: '#8F8F8F',
};

export const STATUS_LABELS = {
  healthy: 'Healthy',
  warning: 'Warning',
  critical: 'Critical',
  unknown: 'Unknown',
  success: 'Success',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  pending: 'Pending',
};

export const ALERT_SEVERITIES = {
  critical: { color: '#EF4444', label: 'Critical' },
  warning: { color: '#F59E0B', label: 'Warning' },
  info: { color: '#565656', label: 'Info' },
  success: { color: '#22C55E', label: 'Success' },
};

export const DEPLOYMENT_STRATEGIES = [
  { value: 'rolling', label: 'Rolling Update' },
  { value: 'blue-green', label: 'Blue-Green' },
  { value: 'canary', label: 'Canary' },
];

export const RISK_LEVELS = [
  { value: 'low', label: 'Low', min: 0, max: 33, color: '#22C55E' },
  { value: 'medium', label: 'Medium', min: 34, max: 66, color: '#F59E0B' },
  { value: 'high', label: 'High', min: 67, max: 100, color: '#EF4444' },
];
