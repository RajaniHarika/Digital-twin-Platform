import { ROUTES } from './constants';

export const ALL_ROLES = [
  'DevOps Engineer',
  'Backend Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'SRE Engineer',
  'Project Manager',
  'Admin',
];

const ENUM_TO_ROLE = {
  DEVOPS_ENGINEER: 'DevOps Engineer',
  BACKEND_ENGINEER: 'Backend Engineer',
  CLOUD_ENGINEER: 'Cloud Engineer',
  SRE_ENGINEER: 'Site Reliability Engineer (SRE)',
  PROJECT_MANAGER: 'Project Manager',
  ADMIN: 'Admin',
};

export const normalizeRole = (role) => {
  if (!role) return '';
  const mapped = ENUM_TO_ROLE[role] || role;
  return mapped === 'SRE Engineer' ? 'Site Reliability Engineer (SRE)' : mapped;
};

const SRE_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Reliability Dashboard', icon: 'Dashboard' },
  { path: ROUTES.TOPOLOGY, label: 'Infrastructure', icon: 'AccountTree' },
  { path: ROUTES.SIMULATION, label: 'Failure Simulation', icon: 'Science' },
  { path: ROUTES.RISK, label: 'Risk Analysis', icon: 'Warning' },
  { path: ROUTES.HISTORY, label: 'Incident History', icon: 'History' },
];

export const ROLE_SIDEBAR_ITEMS = {
  'DevOps Engineer': [
    { path: ROUTES.DASHBOARD, label: 'Operations Dashboard', icon: 'Dashboard' },
    { path: ROUTES.TOPOLOGY, label: 'Infrastructure', icon: 'AccountTree' },
    { path: ROUTES.SIMULATION, label: 'Simulation', icon: 'Science' },
    { path: ROUTES.PREDICTION, label: 'Prediction', icon: 'Analytics' },
    { path: ROUTES.RISK, label: 'Risk Analysis', icon: 'Warning' },
    { path: ROUTES.COST, label: 'Cost Analysis', icon: 'Payments' },
    { path: ROUTES.HISTORY, label: 'History', icon: 'History' },
  ],
  'Cloud Engineer': [
    { path: ROUTES.DASHBOARD, label: 'Cloud Dashboard', icon: 'Dashboard' },
    { path: ROUTES.TOPOLOGY, label: 'Cloud Topology', icon: 'AccountTree' },
    { path: ROUTES.PREDICTION, label: 'Capacity Forecast', icon: 'Analytics' },
    { path: ROUTES.COST, label: 'Cost Optimization', icon: 'Payments' },
    { path: ROUTES.HISTORY, label: 'Change History', icon: 'History' },
  ],
  'Backend Engineer': [
    { path: ROUTES.DASHBOARD, label: 'API Dashboard', icon: 'Dashboard' },
    { path: ROUTES.TOPOLOGY, label: 'Service Map', icon: 'AccountTree' },
    { path: ROUTES.SIMULATION, label: 'Load Simulation', icon: 'Science' },
    { path: ROUTES.HISTORY, label: 'Release History', icon: 'History' },
  ],
  'Site Reliability Engineer (SRE)': SRE_ITEMS,
  'SRE Engineer': SRE_ITEMS,
  'Project Manager': [
    { path: ROUTES.DASHBOARD, label: 'Project Dashboard', icon: 'Dashboard' },
    { path: ROUTES.PREDICTION, label: 'Forecast & Trends', icon: 'Analytics' },
    { path: ROUTES.COST, label: 'Budget & Cost', icon: 'Payments' },
    { path: ROUTES.HISTORY, label: 'Delivery History', icon: 'History' },
  ],
  Admin: [
    { path: ROUTES.DASHBOARD, label: 'Admin Console', icon: 'Dashboard' },
    { path: ROUTES.TOPOLOGY, label: 'Infrastructure', icon: 'AccountTree' },
    { path: ROUTES.SIMULATION, label: 'Simulation', icon: 'Science' },
    { path: ROUTES.PREDICTION, label: 'Prediction', icon: 'Analytics' },
    { path: ROUTES.RISK, label: 'Risk Analysis', icon: 'Warning' },
    { path: ROUTES.COST, label: 'Cost Analysis', icon: 'Payments' },
    { path: ROUTES.HISTORY, label: 'Audit History', icon: 'History' },
  ],
};

export const BOTTOM_NAV_ITEMS = [
  { path: '/settings', icon: 'Settings', label: 'Settings' },
  { path: '/help', icon: 'Help', label: 'Help' },
];

const buildRouteRoles = () => {
  const map = {};

  Object.entries(ROLE_SIDEBAR_ITEMS).forEach(([role, items]) => {
    items.forEach(({ path }) => {
      if (!map[path]) map[path] = new Set();
      map[path].add(role);
      if (role === 'Site Reliability Engineer (SRE)') {
        map[path].add('SRE Engineer');
      }
    });
  });

  BOTTOM_NAV_ITEMS.forEach(({ path }) => {
    if (!map[path]) map[path] = new Set();
    ALL_ROLES.forEach((role) => map[path].add(role));
  });

  return Object.fromEntries(
    Object.entries(map).map(([path, roles]) => [path, Array.from(roles)])
  );
};

export const ROUTE_ROLES = buildRouteRoles();

export const getSidebarItemsForRole = (role) => {
  const key = normalizeRole(role);
  return ROLE_SIDEBAR_ITEMS[key] || ROLE_SIDEBAR_ITEMS['DevOps Engineer'];
};

export const getSearchableNavItemsForRole = (role) => [
  ...getSidebarItemsForRole(role),
  ...BOTTOM_NAV_ITEMS,
];

const SEARCH_ALIASES = {
  '/dashboard': ['dashboard', 'home', 'overview', 'operations', 'cluster', 'console'],
  '/topology': ['topology', 'infrastructure', 'infra', 'network', 'services', 'resources', 'nodes', 'map'],
  '/simulation': ['simulation', 'simulate', 'deploy', 'deployment', 'rollout', 'what-if'],
  '/prediction': ['prediction', 'predict', 'forecast', 'analytics', 'ml', 'ai', 'capacity'],
  '/risk': ['risk', 'analysis', 'threat', 'failure', 'score'],
  '/cost': ['cost', 'budget', 'spend', 'billing', 'finops', 'payments'],
  '/history': ['history', 'audit', 'events', 'logs', 'timeline', 'incidents'],
  '/settings': ['settings', 'profile', 'preferences', 'theme', 'account'],
  '/help': ['help', 'support', 'docs', 'documentation'],
};

export const searchNavItemsForRole = (role, query) => {
  const q = query.trim().toLowerCase();
  const items = getSearchableNavItemsForRole(role);
  if (!q) return items;

  const tokens = q.split(/\s+/).filter((token) => token.length >= 2);

  const scoreItem = (item) => {
    const label = item.label.toLowerCase();
    const path = item.path.toLowerCase();
    const aliases = SEARCH_ALIASES[item.path] || [];
    let score = 0;

    if (label === q || path === q) score += 100;
    if (label.startsWith(q)) score += 60;
    if (aliases.some((term) => term === q || term.startsWith(q))) score += 55;
    if (label.includes(q)) score += 40;
    if (path.includes(q)) score += 35;
    if (aliases.some((term) => term.includes(q))) score += 25;

    tokens.forEach((token) => {
      if (label.includes(token)) score += 20;
      if (path.includes(token)) score += 15;
      if (aliases.some((term) => term.includes(token))) score += 10;
    });

    return score;
  };

  return items
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
};

export const canAccessRoute = (path, role) => {
  if (!role) return false;
  const allowed = ROUTE_ROLES[path];
  if (!allowed) return true;
  const normalized = normalizeRole(role);
  return allowed.includes(role) || allowed.includes(normalized);
};
