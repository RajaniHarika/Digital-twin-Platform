export const ROUTES = {
  DASHBOARD: '/',
  TOPOLOGY: '/topology',
  SIMULATION: '/simulation',
  PREDICTION: '/prediction',
  RISK: '/risk',
  COST: '/cost',
  HISTORY: '/history',
};

export const SIDEBAR_ITEMS = [
  {
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: 'Dashboard',
  },
  {
    path: ROUTES.TOPOLOGY,
    label: 'Infrastructure',
    icon: 'AccountTree',
  },
  {
    path: ROUTES.SIMULATION,
    label: 'Simulation',
    icon: 'Science',
  },
  {
    path: ROUTES.PREDICTION,
    label: 'Prediction',
    icon: 'Analytics',
  },
  {
    path: ROUTES.RISK,
    label: 'Risk Analysis',
    icon: 'Warning',
  },
  {
    path: ROUTES.COST,
    label: 'Cost Analysis',
    icon: 'Payments',
  },
  {
    path: ROUTES.HISTORY,
    label: 'History',
    icon: 'History',
  },
];

export const STATUS_COLORS = {
  healthy: '#2E7D32',
  warning: '#ED6C02',
  critical: '#D32F2F',
  unknown: '#9E9E9E',
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
  critical: { color: '#D32F2F', label: 'Critical' },
  warning: { color: '#ED6C02', label: 'Warning' },
  info: { color: '#0288D1', label: 'Info' },
  success: { color: '#2E7D32', label: 'Success' },
};

export const DEPLOYMENT_STRATEGIES = [
  { value: 'rolling', label: 'Rolling Update' },
  { value: 'blue-green', label: 'Blue-Green' },
  { value: 'canary', label: 'Canary' },
];

export const RISK_LEVELS = [
  { value: 'low', label: 'Low', min: 0, max: 33, color: '#2E7D32' },
  { value: 'medium', label: 'Medium', min: 34, max: 66, color: '#ED6C02' },
  { value: 'high', label: 'High', min: 67, max: 100, color: '#D32F2F' },
];