export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || '';
};

export default getApiBaseUrl;
