/**
 * Mock Authentication Service for DevOps Digital Twin Platform.
 * Designed to mimic an asynchronous JWT-based authentication flow.
 * Can be easily swapped with a Spring Boot REST API client.
 */

const PREDEFINED_USERS = {
  'admin@digitaltwin.com': { password: 'admin123', role: 'Admin', name: 'System Admin' },
  'devops@digitaltwin.com': { password: 'devops123', role: 'DevOps Engineer', name: 'DevOps Lead' },
  'backend@digitaltwin.com': { password: 'backend123', role: 'Backend Engineer', name: 'Backend Dev' },
  'cloud@digitaltwin.com': { password: 'cloud123', role: 'Cloud Engineer', name: 'Cloud Architect' },
  'sre@digitaltwin.com': { password: 'sre123', role: 'Site Reliability Engineer (SRE)', name: 'SRE Lead' },
  'manager@digitaltwin.com': { password: 'manager123', role: 'Project Manager', name: 'Project Manager' },
};

export const authService = {
  /**
   * Authenticates the user with email, password, and selected role.
   * @param {string} email 
   * @param {string} password 
   * @param {string} role 
   * @param {boolean} rememberMe 
   * @returns {Promise<{ success: boolean, user: object }>}
   */
  login: async (email, password, role, rememberMe) => {
    // Simulate network delay to mimic an actual API request
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email?.toLowerCase().trim();
    const user = PREDEFINED_USERS[normalizedEmail];

    // Support SRE naming variations between dropdown ("Site Reliability Engineer (SRE)") and specs ("SRE Engineer")
    const isSreMatch = 
      (normalizedEmail === 'sre@digitaltwin.com') && 
      (role === 'Site Reliability Engineer (SRE)' || role === 'SRE Engineer');

    const roleMatches = user && (user.role === role || isSreMatch);

    if (!user || user.password !== password || !roleMatches) {
      throw new Error('Invalid email, password, or role.');
    }

    // Set temporary login flag to trigger success Snackbar after redirect
    sessionStorage.setItem('loginSuccessSnackbar', 'true');
    sessionStorage.setItem('sessionActive', 'true');

    // Store auth info in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('userEmail', normalizedEmail);
    localStorage.setItem('userRole', user.role); // Store standard role
    localStorage.setItem('userName', user.name);
    localStorage.setItem('loginTime', new Date().toISOString());
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

    return {
      success: true,
      user: {
        email: normalizedEmail,
        role: user.role,
        name: user.name,
      },
    };
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
