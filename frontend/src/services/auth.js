/**
 * Authentication Service for DevOps Digital Twin Platform.
 * Connects to Spring Boot Auth Service via API Gateway.
 */
import api from './api';
import { getApiBaseUrl } from './config';
import { canAccessRoute as checkRouteAccess, ROUTE_ROLES } from '../utils/navigation';

const AUTH_URL = getApiBaseUrl();

// Map frontend display role names → backend enum values
const ROLE_TO_ENUM = {
  'DevOps Engineer': 'DEVOPS_ENGINEER',
  'Backend Engineer': 'BACKEND_ENGINEER',
  'Cloud Engineer': 'CLOUD_ENGINEER',
  'Site Reliability Engineer (SRE)': 'SRE_ENGINEER',
  'Project Manager': 'PROJECT_MANAGER',
  'Admin': 'ADMIN',
};

// Map backend enum values → frontend display role names
const ENUM_TO_ROLE = {
  'DEVOPS_ENGINEER': 'DevOps Engineer',
  'BACKEND_ENGINEER': 'Backend Engineer',
  'CLOUD_ENGINEER': 'Cloud Engineer',
  'SRE_ENGINEER': 'Site Reliability Engineer (SRE)',
  'PROJECT_MANAGER': 'Project Manager',
  'ADMIN': 'Admin',
};

const AUTH_KEYS = ['isAuthenticated', 'authToken', 'userEmail', 'userRole', 'userName', 'loginTime'];

const clearAuthStorage = () => {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  sessionStorage.removeItem('loginSuccessSnackbar');
};

const getStorage = () => (localStorage.getItem('authToken') ? localStorage : sessionStorage);

const persistUser = (user, storage) => {
  storage.setItem('userEmail', user.email);
  storage.setItem('userRole', user.role);
  storage.setItem('userName', user.name);
};

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth:changed'));
};

export const authService = {
  /**
   * Authenticates the user with email, password, and selected role.
   * Calls POST /auth/login on the backend via API Gateway.
   */
  login: async (email, password, role, rememberMe) => {
    const backendRoleEnum = ROLE_TO_ENUM[role] || role;
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email?.toLowerCase().trim(),
        password,
        role: backendRoleEnum,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email, password, or role.');
    }

    const data = await response.json();
    const token = data.token;
    const backendRole = data.role || (data.user && data.user.role) || role;
    const displayRole = ENUM_TO_ROLE[backendRole] || backendRole;
    const userName = data.name || (data.user && data.user.name) || displayRole;
    const userEmail = data.email || (data.user && data.user.email) || email;

    const userObj = {
      email: userEmail,
      role: displayRole,
      name: userName,
    };

    clearAuthStorage();
    const storage = rememberMe ? localStorage : sessionStorage;
    sessionStorage.setItem('loginSuccessSnackbar', 'true');
    sessionStorage.setItem('sessionActive', 'true');

    storage.setItem('isAuthenticated', 'true');
    storage.setItem('authToken', token);
    persistUser(userObj, storage);
    storage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

    notifyAuthChange();
    return {
      success: true,
      user: userObj,
    };
  },

  /**
   * Registers a new user account.
   * Calls POST /auth/register on the backend via API Gateway.
   */
  register: async (name, email, password, role) => {
    const backendRole = ROLE_TO_ENUM[role] || role;
    const response = await api.post('/auth/register', {
      name,
      email: email?.toLowerCase().trim(),
      password,
      role: backendRole,
    });
    return response.data;
  },

  /**
   * Logs out the current user and clears session state.
   */
  logout: () => {
    clearAuthStorage();
    localStorage.removeItem('rememberMe');
    notifyAuthChange();
  },

  getToken: () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken'),

  isAuthenticated: () =>
    !!authService.getToken() &&
    (localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true'),

  getCurrentUser: () => {
    if (!authService.isAuthenticated()) return null;
    const storage = getStorage();
    const rawRole = storage.getItem('userRole');
    const role = ENUM_TO_ROLE[rawRole] || rawRole;
    return {
      email: storage.getItem('userEmail'),
      role: role,
      name: storage.getItem('userName') || role || 'User',
      loginTime: storage.getItem('loginTime'),
    };
  },

  init: () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (!rememberMe && !sessionStorage.getItem('authToken') && localStorage.getItem('isAuthenticated') === 'true') {
      authService.logout();
      return;
    }
    if (authService.isAuthenticated()) {
      sessionStorage.setItem('sessionActive', 'true');
    }
  },

  verifyToken: async () => {
    const token = authService.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${AUTH_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        authService.logout();
        return false;
      }
      if (res.ok) {
        const user = await res.json();
        if (user?.email) {
          const backendRole = user.role;
          const displayRole = ENUM_TO_ROLE[backendRole] || backendRole;
          const userObj = {
            email: user.email,
            role: displayRole,
            name: user.name || displayRole,
          };
          const storage = getStorage();
          persistUser(userObj, storage);
        }
      }
      return true;
    } catch {
      return Boolean(token);
    }
  },

  canAccessRoute: (path, role) => checkRouteAccess(path, role),
};

export { ROUTE_ROLES };

export default authService;
