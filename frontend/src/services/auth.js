/**
 * Authentication Service for DevOps Digital Twin Platform.
 * Connects to Spring Boot Auth Service via API Gateway.
 */
import api from './api';

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
  'CLOUD_ENGINEER': 'CLOUD_ENGINEER' && 'Cloud Engineer',
  'SRE_ENGINEER': 'Site Reliability Engineer (SRE)',
  'PROJECT_MANAGER': 'Project Manager',
  'ADMIN': 'Admin',
};

export const authService = {
  /**
   * Authenticates the user with email, password, and selected role.
   * Calls POST /auth/login on the backend via API Gateway.
   */
  login: async (email, password, role, rememberMe) => {
    const response = await api.post('/auth/login', {
      email: email?.toLowerCase().trim(),
      password,
    });

    const { token, role: backendRole, name, email: userEmail } = response.data;
    const displayRole = ENUM_TO_ROLE[backendRole] || backendRole;

    // Verify the role selected on the frontend matches the backend role
    const expectedEnum = ROLE_TO_ENUM[role];
    if (expectedEnum && expectedEnum !== backendRole) {
      throw new Error('Selected role does not match your account role.');
    }

    // Set temporary login flag to trigger success Snackbar after redirect
    sessionStorage.setItem('loginSuccessSnackbar', 'true');
    sessionStorage.setItem('sessionActive', 'true');

    // Store auth info in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', userEmail || email);
    localStorage.setItem('userRole', displayRole);
    localStorage.setItem('userName', name || displayRole);
    localStorage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

    return {
      success: true,
      user: {
        email: userEmail || email,
        role: displayRole,
        name: name || displayRole,
      },
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('loginSuccessSnackbar');
  },

  /**
   * Checks if a user is currently authenticated.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem('authToken');
  },

  /**
   * Gets the details of the currently logged-in user.
   * @returns {object|null}
   */
  getCurrentUser: () => {
    if (!authService.isAuthenticated()) return null;
    return {
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('userRole'),
      name: localStorage.getItem('userName') || localStorage.getItem('userRole') || 'User',
      loginTime: localStorage.getItem('loginTime'),
    };
  },

  /**
   * Initializes the authentication state.
   * If rememberMe was unchecked and sessionActive is missing (indicating browser restart), logs out the user.
   */
  init: () => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const remember = localStorage.getItem('rememberMe') === 'true';
    const hasActiveSession = sessionStorage.getItem('sessionActive') === 'true';

    if (isAuth && !remember && !hasActiveSession) {
      // Unremembered user reopened browser -> clear credentials
      authService.logout();
    }

    // Always mark current tab session as active
    sessionStorage.setItem('sessionActive', 'true');
  },
};

export default authService;
