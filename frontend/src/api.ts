import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export const message = (error: unknown) =>
  axios.isAxiosError(error)
    ? String(error.response?.data?.message || error.message)
    : 'Something went wrong.';

export const media = (path: unknown) => {
  const value = String(path || '').trim();
  if (!value) return '/images/omnaad-logo.png';
  if (/^(https?:|data:)/i.test(value)) return value;
  const relative = value.replace(/^\/?(?:storage|uploads)\//i, '').replace(/^\/+/, '');
  return `${import.meta.env.VITE_ASSET_URL || ''}/uploads/${relative}`;
};
