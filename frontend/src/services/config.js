export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // In dev mode, use empty string so Vite proxy (vite.config.js) handles /auth and /api routing to port 8090
  if (import.meta.env.DEV) return '';
  return '/api';
};

export default getApiBaseUrl;
