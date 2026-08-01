import { getApiBaseUrl } from './config';
import { canAccessRoute as checkRouteAccess, ROUTE_ROLES } from '../utils/navigation';

const AUTH_URL = getApiBaseUrl();

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
  login: async (email, password, role, rememberMe) => {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid email, password, or role.');
    }

    const { token, user } = await response.json();
    clearAuthStorage();

    const storage = rememberMe ? localStorage : sessionStorage;
    sessionStorage.setItem('loginSuccessSnackbar', 'true');
    sessionStorage.setItem('sessionActive', 'true');
    storage.setItem('isAuthenticated', 'true');
    storage.setItem('authToken', token);
    persistUser(user, storage);
    storage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

    notifyAuthChange();
    return { success: true, user };
  },

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
    return {
      email: storage.getItem('userEmail'),
      role: storage.getItem('userRole'),
      name: storage.getItem('userName') || storage.getItem('userRole') || 'User',
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
      if (!res.ok) throw new Error('Invalid token');
      const user = await res.json();
      if (user?.email) {
        const storage = getStorage();
        persistUser(user, storage);
      }
      return true;
    } catch {
      authService.logout();
      return false;
    }
  },

  canAccessRoute: (path, role) => checkRouteAccess(path, role),
};

export { ROUTE_ROLES };

export default authService;
