export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // Always use /api so requests are properly intercepted by Vite proxy in dev, and relative in prod
  return '/api';
};

export default getApiBaseUrl;
