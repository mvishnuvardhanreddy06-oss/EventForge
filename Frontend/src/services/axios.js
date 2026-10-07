import axios from 'axios';

const RENDER_BACKEND_URL = 'https://eventforge-1.onrender.com';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    // If self-hosted directly on Render, use relative /api
    if (window.location.hostname.includes('onrender.com')) {
      return '/api';
    }
    // For localhost dev, Vercel, or other domains, connect to the live Render backend
    return `${RENDER_BACKEND_URL}/api`;
  }
  return `${RENDER_BACKEND_URL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize response data and intercept global errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const res = error.response;
    const message = res?.data?.message || error.message || 'An unexpected error occurred';
    const customError = new Error(message);
    customError.response = res;
    customError.status = res?.status;
    return Promise.reject(customError);
  }
);

export default api;
